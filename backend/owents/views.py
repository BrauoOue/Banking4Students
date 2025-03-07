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

from main.serializers import OwentTransactionSerializer
import os
from main.models import StudentParticipatesPartyUsesTransaction, Transaction

from main.models import *

# Windows: Set the correct path to Tesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

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
        # output = assistant.analyze(f"The Receipt:", image, structured_output="json")
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

        # Create receipt party and the relationship with the student
        with transaction.atomic():
            # Create the receipt party
            receipt_party = ReceiptParty.objects.create(

                student=student,
                transaction_acc=transaction_acc,
                scanned_receipt=None

            )

            url = f"http://127.0.0.1:8000/api/owent/join-party/{receipt_party.id}"
            qr = generate_qr_code(url)

            receipt_party.qr = qr

            receipt_party.save()
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


@api_view(["POST"])
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

@api_view(["POST"])
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


@api_view(["POST"])
def create_owent(request):
    """
    Create a new Owent (Owning Event).

    Required parameters:
    - name: String name of the Owent
    - user_id: ID of the User creating the Owent

    Returns:
    - The created Owent data and a success message
    """
    try:
        # Get the required parameters
        name = request.data.get("name")
        user_id = request.data.get("user_id")

        # Validate parameters
        if not name:
            return Response(
                {"error": "Missing required parameter: name"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user_id:
            return Response(
                {"error": "Missing required parameter: user_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the user exists
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": f"User with id {user_id} does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create the Owent
        owent = Owent.objects.create(name=name)

        # If the user is a Student, automatically make them a participant
        if hasattr(user, 'student'):
            student = user.student
            # Create the relationship between student and owent
            StudentParticipatesOwent.objects.create(
                student=student,
                owent=owent
            )

        # Return success response with the created Owent data
        response_data = {
            "message": "Owent created successfully",
            "owent": {
                "id": owent.id,
                "name": owent.name,
                "creator_id": user_id
            }
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def make_owent_transaction(request):
    """
    Create a new OwentTransaction where one student pays for another student.

    Required parameters:
    - payer_student_id: ID of the Student making the payment
    - owed_student_id: ID of the Student who will owe money to the payer
    - destination_acc_number: Account number of the destination TransactionAcc
    - amount: Amount of the transaction
    - owent_id: ID of the Owent this transaction belongs to
    - title: Title of the transaction

    Optional parameters:
    - category: Category of the transaction (default: "owent")
    - owent_title: Title specific to the owent transaction (default: same as title)

    Returns:
    - Details of the created transactions and a success message
    """
    try:
        # Get required parameters
        payer_student_id = request.data.get("payer_student_id")
        owed_student_id = request.data.get("owed_student_id")
        destination_acc_number = request.data.get("destination_acc_number")
        amount = request.data.get("amount")
        owent_id = request.data.get("owent_id")
        title = "Owent Payment"

        # Get optional parameters
        category = "Ownet"
        owent_title = "Title"

        # Validate required parameters
        if not all([payer_student_id, owed_student_id, destination_acc_number, amount, owent_id]):
            return Response(
                {
                    "error": "Missing required parameters. Please provide payer_student_id, owed_student_id, destination_acc_number, amount, and owent_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Convert amount to Decimal
        try:
            amount = Decimal(amount)
            if amount <= 0:
                return Response(
                    {"error": "Amount must be greater than zero"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception:
            return Response(
                {"error": "Invalid amount format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retrieve the required objects
        try:
            payer_student = Student.objects.get(pk=payer_student_id)
            owed_student = Student.objects.get(pk=owed_student_id)
            owent = Owent.objects.get(pk=owent_id)

            # Get the transaction accounts
            payer_account = payer_student.card_default.transaction_acc

            owed_account = owed_student.card_default.transaction_acc

            destination_account = TransactionAcc.objects.get(number=destination_acc_number)

            if not payer_account:
                return Response(
                    {"error": f"Payer student with id {payer_student_id} does not have a transaction account"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not owed_account:
                return Response(
                    {"error": f"Owed student with id {owed_student_id} does not have a transaction account"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Student.DoesNotExist:
            return Response(
                {"error": "One or both students do not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Owent.DoesNotExist:
            return Response(
                {"error": f"Owent with id {owent_id} does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        except TransactionAcc.DoesNotExist:
            return Response(
                {"error": f"Transaction account with number {destination_acc_number} does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if both students are participants in the owent
        payer_participant = StudentParticipatesOwent.objects.filter(
            student=payer_student,
            owent=owent
        ).exists()

        owed_participant = StudentParticipatesOwent.objects.filter(
            student=owed_student,
            owent=owent
        ).exists()

        if not payer_participant or not owed_participant:
            return Response(
                {"error": "Both students must be participants in the owent"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if payer has sufficient balance
        if payer_account.balance < amount:
            return Response(
                {"error": "Insufficient balance in payer's account"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use a database transaction to ensure both transactions are created together
        with transaction.atomic():
            current_time = datetime.now()

            # 1. Create the transaction from payer to destination (finished)
            paid_transaction = Transaction.objects.create(
                transaction_acc_pays=payer_account,
                transaction_acc_receives=destination_account,
                title=title,
                amount=amount,
                date=current_time,
                type="f",  # finished
                category=category
            )

            # Update payer's balance
            payer_account.balance -= amount
            payer_account.save()

            # Update destination's balance
            destination_account.balance += amount
            destination_account.save()

            # 2. Create the OwentTransaction from owed student to payer (unfinished)
            owent_transaction = OwentTransaction.objects.create(
                transaction_acc_pays=owed_account,
                transaction_acc_receives=payer_account,
                title=title,
                amount=amount,
                date=current_time,
                type="u",  # unfinished
                category=category,
                owent_title=owent_title,
                student=owed_student,
                owent=owent
            )

        # Return success response with transaction details
        return Response({
            "message": "Owent transactions created successfully",
            "paid_transaction": {
                "id": paid_transaction.id,
                "from": payer_account.number,
                "to": destination_account.number,
                "amount": float(amount),
                "type": "finished"
            },
            "owent_transaction": {
                "id": owent_transaction.id,
                "from": owed_account.number,
                "to": payer_account.number,
                "amount": float(amount),
                "type": "unfinished"
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def get_student_owent_transactions(request):
    """
    Fetch all owning transactions for a student.

    This endpoint can fetch transactions where the student:
    1. Owes money to others (outgoing debts, where they need to pay)
    2. Is owed money by others (incoming debts, where they will receive payment)

    Query parameters:
    - student_id: ID of the Student
    - transaction_type: (optional) Filter by 'owed' (I owe others), 'owed_to_me' (others owe me), or 'all' (default)
    - status: (optional) Filter by 'u' (unfinished), 'f' (finished), or 'all' (default)
    """
    try:
        # Get query parameters
        student_id = request.data.get("student_id")

        # Validate required parameters
        if not student_id:
            return Response(
                {"error": "Missing required parameter: student_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if student exists
        try:
            student = Student.objects.get(pk=student_id)
        except Student.DoesNotExist:
            return Response(
                {"error": f"Student with id {student_id} does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        outgoing_debts = OwentTransaction.objects.filter(
            student=student.id,
            type="u"
        )

        ser = OwentTransactionSerializer(outgoing_debts, many=Transaction)

        # # Prepare response data
        # response_data = {
        #     "student_id": student_id,
        #     "student_name": f"{student.name} {student.surname}"
        # }

        return Response(ser.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def pay_owent_transaction(request):
    """
    Pay an existing OwentTransaction that is currently unfinished.

    Required parameters:
    - owent_transaction_id: ID of the OwentTransaction to pay

    Returns:
    - Details of the updated transaction and a success message
    """
    try:
        # Get required parameters
        owent_transaction_id = request.data.get("owent_transaction_id")

        # Validate parameters
        if not owent_transaction_id:
            return Response(
                {"error": "Missing required parameter: owent_transaction_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retrieve the OwentTransaction
        try:
            owent_tx = OwentTransaction.objects.get(pk=owent_transaction_id)
        except OwentTransaction.DoesNotExist:
            return Response(
                {"error": f"OwentTransaction with id {owent_transaction_id} does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if the transaction is already finished
        if owent_tx.type == "f":
            return Response(
                {"error": "This transaction has already been paid"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the paying account (the student who owes money)
        paying_account = owent_tx.transaction_acc_pays

        # Get the receiving account (the student who is owed money)
        receiving_account = owent_tx.transaction_acc_receives

        # Check if the paying account has sufficient balance
        if paying_account.balance < owent_tx.amount:
            return Response(
                {"error": "Insufficient balance to complete this payment"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use a database transaction to ensure atomicity
        with transaction.atomic():
            # Update the transaction status to finished
            owent_tx.type = "f"
            owent_tx.date = datetime.now()  # Update the date to the current time
            owent_tx.save()

            # Update account balances
            paying_account.balance -= owent_tx.amount
            paying_account.save()

            receiving_account.balance += owent_tx.amount
            receiving_account.save()

        # Return success response
        return Response({
            "message": "Transaction paid successfully",
            "transaction": {
                "id": owent_tx.id,
                "amount": float(owent_tx.amount),
                "date": owent_tx.date.strftime("%Y-%m-%d %H:%M:%S"),
                "title": owent_tx.title,
                "owent_title": owent_tx.owent_title,
                "status": "Finished",
                "owent_id": owent_tx.owent_id,
                "owent_name": owent_tx.owent.name
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
