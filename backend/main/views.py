from datetime import date, datetime

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from main.models import *
from .serializers import StudentSerializer, CompanySerializer, TransactionSerializer, TransactionAccSerializer
from decimal import Decimal


@api_view(["GET"])
@permission_classes([AllowAny])
def user_list(request):
    students = Student.objects.all()
    companies = Company.objects.all()

    student_data = StudentSerializer(students, many=True).data
    company_data = CompanySerializer(companies, many=True).data

    return Response(student_data + company_data)


@api_view(["GET"])
def get_user(request, id):
    student = Student.objects.get(id=id)
    ser = StudentSerializer(student, many=False)

    return Response(ser.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def user_transactions(request, email):
    # Find the user by email
    user = get_object_or_404(User, email=email)

    # Get all transaction accounts linked to this user
    transaction_accounts = TransactionAcc.objects.filter(trans_owner=user.id)

    # Get transactions where the user is involved (either sending or receiving)
    transactions = Transaction.objects.filter(
        transaction_acc_pays__in=transaction_accounts
    )

    # Serialize and return the transactions
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_user_transaction_accounts(request, user_id):
    user = get_object_or_404(User, id=user_id)
    transaction_accounts = TransactionAcc.objects.filter(trans_owner=user)

    serializer = TransactionAccSerializer(transaction_accounts, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def make_transaction(request):
    from_transaction_number = request.data.get("from_transaction_number")
    to_user_email = request.data.get("to_user_email")
    amount = request.data.get("amount")

    if not from_transaction_number or not to_user_email or not amount:
        return Response(
            {"error": "Missing required fields"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        amount = float(amount)
        if amount <= 0:
            return Response(
                {"error": "Amount must be greater than zero"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except ValueError:
        return Response(
            {"error": "Invalid amount"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        from_transaction_acc = TransactionAcc.objects.get(number=from_transaction_number)
        to_student = Student.objects.get(email=to_user_email)

        # if from_transaction_number.balance < amount:
        #     return Response(
        #         {"error": "Insufficient balance"},
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )

        # Get or create the recipient's primary transaction account
        to_card = to_student.card_default
        if not to_card:
            return Response(
                {"error": "Recipient does not have a default card setup"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        to_transaction_acc = to_card.transaction_acc

        # Perform the transaction
        from_transaction_acc.balance -= Decimal(amount)
        to_transaction_acc.balance += Decimal(amount)

        # Save the updated balances
        from_transaction_acc.save()
        to_transaction_acc.save()

        # Create a new transaction record
        new_transaction = Transaction.objects.create(
            transaction_acc_pays=from_transaction_acc,
            transaction_acc_receives=to_transaction_acc,
            title=f"Transfer to {to_student.email}",
            amount=amount,
            date=datetime.now(),
            type="Transfer",
            category="General",
        )

        return Response(
            {"message": "Transaction successful", "transaction_id": new_transaction.id},
            status=status.HTTP_201_CREATED,
        )

    except Student.DoesNotExist:
        return Response(
            {"error": "Sender student not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except User.DoesNotExist:
        return Response(
            {"error": "Recipient user not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
