from rest_framework import serializers
from main.models import VirtualCard, Card, CardOperatesVirtualCard

# Serializer to show simple card details.
class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('id', 'card_number')

# Serializer to show a simple virtual card (used in nested views).
class VirtualCardSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualCard
        fields = ('id', 'name', 'limit')

# Serializer for the m:n relationship record.
class CardOperatesVirtualCardSerializer(serializers.ModelSerializer):
    card = CardSerializer(read_only=True)
    virtual_card = VirtualCardSimpleSerializer(read_only=True)

    class Meta:
        model = CardOperatesVirtualCard
        fields = ('id', 'card', 'virtual_card')

# Serializer for VirtualCard detail and list views.
class VirtualCardSerializer(serializers.ModelSerializer):
    # Optional: include a list of associated card ids.
    cards = serializers.SerializerMethodField()

    class Meta:
        model = VirtualCard
        fields = ('id', 'name', 'limit', 'cards')

    def get_cards(self, obj):
        # Use the default reverse relation name.
        associations = obj.cardoperatesvirtualcard_set.all()
        return [assoc.card.id for assoc in associations]

# Serializer used when creating a VirtualCard.
class VirtualCardCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    limit = serializers.DecimalField(max_digits=10, decimal_places=2)
    card_id = serializers.IntegerField()

# Serializer for adding a card to an existing VirtualCard.
class AddCardSerializer(serializers.Serializer):
    card_id = serializers.IntegerField()

# Serializer for a virtual transaction.
class VirtualTransactionSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)