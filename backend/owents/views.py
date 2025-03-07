import base64
import io
from datetime import datetime
from decimal import Decimal, InvalidOperation

import cv2
import numpy as np
import qrcode
from django.db import transaction
from django.shortcuts import render
import pytesseract
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image
from ai_modules.llm_assistant import LLMAssistant
from ai_modules.ai_functions import read_file_smart
import os

from main.models import StudentParticipatesPartyUsesTransaction, Transaction

from main.models import TransactionAcc, Student, ReceiptParty

# Windows: Set the correct path to Tesseract
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

assistant = LLMAssistant(
    api_key=read_file_smart(full_path="../common/api_key.txt"),
    starting_instructions=read_file_smart(
        full_path="../ai_modules/instructions/ReceiptSplitter/1_starting_instructions.txt")
)


def extract_text_from_receipt(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]  # Improve OCR accuracy
    text = pytesseract.image_to_string(gray, lang="bul")
    return text


class ReciteSplitting(APIView):

    def post(self, request, *args, **kwargs):
        if 'image' not in request.FILES:
            return Response({"error": "No image provided"}, status=400)

        image_file = request.FILES['image']
        party_id = request.data["party_id"]

        image = Image.open(image_file).convert("RGB")
        image_np = np.array(image)  # Convert to NumPy array
        image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

        ocr_text = extract_text_from_receipt(image_cv)

        output = assistant.consult_once(f"The OCR text:{ocr_text}", structured_output="json")
        output["warning"] = None

        calculated_total = 0
        for item in output["items"]:
            calculated_total += item["amount"] * item["price"]

        if output["total"] is None:
            output[
                "warning"] = "The scanned receipt image was of poor quality. The total could not be calculated correctly. Please check the receipt manually."
            output["total"] = calculated_total

        if output["total"] != calculated_total:
            output["total"] = calculated_total

        party = ReceiptParty.objects.get(id=party_id)
        party.scanned_receipt = output
        party.save()

        return JsonResponse(output, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_receipt_party(request):
    try:
        transaction_acc_number = request.data.get('transaction_acc_number')

        if not transaction_acc_number:
            return Response(
                {'error': 'Transaction account ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the transaction account
        try:
            transaction_acc_number = TransactionAcc.objects.get(number=transaction_acc_number)
        except TransactionAcc.DoesNotExist:
            return Response(
                {'error': 'Transaction account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get the student based on the user
        student = Student.objects.filter(id=transaction_acc_number.trans_owner.id).first()
        if not student:
            return Response(
                {'error': 'Student profile not found for this user'},
                status=status.HTTP_404_NOT_FOUND
            )

        url = f"http://127.0.0.1:8000/api/owent/join-party/{receipt_party.id}"
        qr = generate_qr_code(url)

        # Create receipt party and the relationship with the student
        with transaction.atomic():
            # Create the receipt party
            receipt_party = ReceiptParty.objects.create(

                student=student,
                transaction_acc=transaction_acc_number,
                qr=qr,
                scanned_receipt=None

            )

            return Response({
                'id': receipt_party.id,
                "qr": qr
            }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def join_receipt_party(request, party_id):
    """
    Join a Receipt Party as a participant.

    Required data:
    - transaction_acc_id: ID of the transaction account to use

    URL parameters:
    - party_id: ID of the receipt party
    - join_code: Unique code to verify the join request
    """
    try:
        transaction_acc_number = request.data.get('transaction_acc_number')

        if not transaction_acc_number:
            return Response(
                {'error': 'Transaction account ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the receipt party
        try:
            receipt_party = ReceiptParty.objects.get(id=party_id)
        except ReceiptParty.DoesNotExist:
            return Response(
                {'error': 'Receipt party not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get the transaction account
        try:
            transaction_acc = TransactionAcc.objects.get(number=transaction_acc_number)
        except TransactionAcc.DoesNotExist:
            return Response(
                {'error': 'Transaction account not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get the student based on the user
        student = Student.objects.filter(id=transaction_acc.trans_owner.id).first()
        if not student:
            return Response(
                {'error': 'Student profile not found for this user'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if the student is already a participant in this party
        if StudentParticipatesPartyUsesTransaction.objects.filter(
                student=student, receipt_party=receipt_party
        ).exists():
            return Response(
                {'error': 'You are already a participant in this receipt party'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add the student as a participant
        with transaction.atomic():
            StudentParticipatesPartyUsesTransaction.objects.create(
                student=student,
                receipt_party=receipt_party,
                transaction_acc=transaction_acc,
                owed_money=0.00,  # Initial value, will be updated later
                status='joined'  # Initial status
            )

            return Response({
                'message': 'Successfully joined the receipt party',
                'party_id': receipt_party.id,
                'participant': {
                    'id': student.id,
                    'name': f"{student.name} {student.surname}"
                },
                "receipt": receipt_party.scanned_receipt
            }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Add this to your create_receipt_party view after generating the join_url
def generate_qr_code(url):
    qr = qrcode.main.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    # Convert the image to a base64 string for API response
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')

    return f"data:image/png;base64,{img_str}"


@api_view(["POST"])
def accept_paying(request):
    """
    Allow a student to accept their payment portion for a receipt party.

    Required parameters:
    - party_id: ID of the ReceiptParty
    - student_id: ID of the Student accepting the payment
    - amount: Decimal amount the student agrees to pay
    """
    try:
        party_id = request.data.get("party_id")
        student_id = request.data.get("student_id")

        if not party_id or not student_id:
            return Response(
                {"error": "Missing required parameters: party_id and student_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Safely convert amount to Decimal, with error handling
        try:
            amount = Decimal(request.data.get("amount"))
        except (ValueError, TypeError, InvalidOperation):
            return Response(
                {"error": "Invalid amount value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find the party participation record
        try:
            party_info = StudentParticipatesPartyUsesTransaction.objects.get(
                receipt_party_id=party_id,
                student_id=student_id
            )
        except StudentParticipatesPartyUsesTransaction.DoesNotExist:
            return Response(
                {"error": "No participation record found for this student and party"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update the record
        party_info.owed_money = amount
        party_info.status = "accepted"
        party_info.save()

        return Response(
            {"message": "Payment amount accepted successfully"},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def get_status(request):
    """
    Get the current payment status for a student in a receipt party.

    Required parameters:
    - party_id: ID of the ReceiptParty
    - student_id: ID of the Student
    """
    try:
        # For GET requests, typically use request.query_params instead of request.data
        party_id = request.data.get("party_id")
        student_id = request.data.get("student_id")

        if not party_id or not student_id:
            return Response(
                {"error": "Missing parameters: party_id and student_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            party_info = StudentParticipatesPartyUsesTransaction.objects.get(
                receipt_party_id=party_id,
                student_id=student_id
            )
        except StudentParticipatesPartyUsesTransaction.DoesNotExist:
            return Response(
                {"error": "No participation record found for this student and party"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "status": party_info.status,
            "owed_money": party_info.owed_money,
            "student_id": party_info.student_id,
            "party_id": party_info.receipt_party_id
        })

    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def pay(request):
    party_id = request.data["party_id"]
    destination_acc_number = request.data.get("pay_to_acc_number")
    owner_part = Decimal(request.data.get("owner_part"))

    # Get the party and all its participants
    party = ReceiptParty.objects.get(pk=party_id)
    party_infos = StudentParticipatesPartyUsesTransaction.objects.filter(receipt_party=party_id)

    # Check if all participants have accepted
    for party_info in party_infos:
        if party_info.status != "accepted":
            return Response(data={"message": "Everyone must first accept their part"}, status=status.HTTP_403_FORBIDDEN)

    # Get owner's transaction account
    owner_account = party.transaction_acc

    # First collect money from all participants to the party owner
    for party_info in party_infos:
        participant_account = party_info.transaction_acc
        owed_amount = party_info.owed_money

        # Create transaction from participant to owner
        Transaction.objects.create(
            transaction_acc_pays=participant_account,
            transaction_acc_receives=owner_account,
            title=f"Payment for party #{party_id}",
            amount=owed_amount,
            date=datetime.now(),
            type="f",
            category="Transfer"
        )

        # Update balances
        participant_account.balance -= owed_amount
        participant_account.save()

        owner_account.balance += owed_amount
        owner_account.save()

        # Update party participation status
        party_info.status = "paid"
        party_info.save()

    # If destination account is provided, transfer from owner to destination
    if destination_acc_number:
        try:
            destination_account = TransactionAcc.objects.get(number=destination_acc_number)
            total_amount = sum(info.owed_money for info in party_infos) + owner_part

            # Create transaction from owner to destination
            Transaction.objects.create(
                transaction_acc_pays=owner_account,
                transaction_acc_receives=destination_account,
                title=f"Final payment for party #{party_id}",
                amount=total_amount,
                date=datetime.now(),
                type="f",
                category="Payment"
            )

            # Update balances
            owner_account.balance -= total_amount
            owner_account.save()

            destination_account.balance += total_amount
            destination_account.save()
        except TransactionAcc.DoesNotExist:
            return Response(
                data={"message": "Destination account not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    return Response(data={"message": "Party payment completed successfully"}, status=status.HTTP_200_OK)
