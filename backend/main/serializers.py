from rest_framework import serializers
from main.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email"]


class StudentSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Student
        fields = UserSerializer.Meta.fields + ["name", "surname", "ssn", "points", "attending_university"]


class CompanySerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Company
        fields = UserSerializer.Meta.fields + ["name"]


class TransactionSerializer(serializers.ModelSerializer):
    receiver_email = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ["id", "transaction_acc_pays", "receiver_email", "amount", "date", "type", "category"]

    def get_receiver_email(self, obj):
        a = 1
        """Get the email of the user associated with transaction_acc_receives."""
        # return obj.transaction_acc_receives.trans_owner.email if obj.transaction_acc_receives.user else None
        return User.objects.get(id=obj.transaction_acc_receives.trans_owner.id).email
        # obj.transaction_acc_receives.trans_owner
        # return "ABC"


class OwentTransactionSerializer(serializers.ModelSerializer):
    receiver_email = serializers.SerializerMethodField()

    class Meta:
        model = OwentTransaction
        fields = ["id", "transaction_acc_pays", "receiver_email", "amount", "date", "type", "category"]

        def get_receiver_email(self, obj):
            a = 1
            """Get the email of the user associated with transaction_acc_receives."""
            # return obj.transaction_acc_receives.trans_owner.email if obj.transaction_acc_receives.user else None
            return User.objects.get(id=obj.transaction_acc_receives.trans_owner.id).email
            # obj.transaction_acc_receives.trans_owner
            # return "ABC"


class TransactionAccSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source="bank.name", read_only=True)

    # owner_email = serializers.SerializerMethodField()

    class Meta:
        model = TransactionAcc
        fields = ["id", "number", "balance", "bank", "bank_name", "trans_owner"]
