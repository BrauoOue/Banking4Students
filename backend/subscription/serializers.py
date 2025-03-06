from rest_framework import serializers
from main.models import (
    SubscriptionEntity,
    CardSubscribesSubscriptionEntity,
    TransactionAcc,
    Card
)

class SubscriptionEntitySerializer(serializers.ModelSerializer):
    # Accepts a transaction_acc_id in the payload.
    transaction_acc_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SubscriptionEntity
        fields = ['id', 'name', 'link', 'transaction_acc_id']
        read_only_fields = ['id']

    def create(self, validated_data):
        transaction_acc_id = validated_data.pop('transaction_acc_id')
        # Retrieve the TransactionAcc instance based on the provided ID.
        transaction_acc = TransactionAcc.objects.get(pk=transaction_acc_id)
        subscription_entity = SubscriptionEntity.objects.create(
            transaction_acc=transaction_acc,
            **validated_data
        )
        return subscription_entity


class CardSubscribesSubscriptionEntitySerializer(serializers.ModelSerializer):
    # Accepts card_id and subscription_entity_id in the payload.
    card_id = serializers.IntegerField(write_only=True)
    subscription_entity_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CardSubscribesSubscriptionEntity
        fields = [
            'id', 'card_id', 'subscription_entity_id',
            'date_from', 'date_to', 'amount', 'status'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        card_id = validated_data.pop('card_id')
        subscription_entity_id = validated_data.pop('subscription_entity_id')
        # Retrieve the corresponding Card and SubscriptionEntity instances.
        card = Card.objects.get(pk=card_id)
        subscription_entity = SubscriptionEntity.objects.get(pk=subscription_entity_id)
        subscription = CardSubscribesSubscriptionEntity.objects.create(
            card=card,
            subscription_entity=subscription_entity,
            **validated_data
        )
        return subscription