from rest_framework import serializers
from main.models import BucketItem, Card

class BucketItemSerializer(serializers.ModelSerializer):
    # Allow setting the card by providing its id.
    card = serializers.PrimaryKeyRelatedField(queryset=Card.objects.all())

    class Meta:
        model = BucketItem
        fields = ['id', 'name', 'price', 'frequency', 'stacked_money', 'status', 'amount', 'card']