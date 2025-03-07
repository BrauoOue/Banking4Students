from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from main.models import VirtualCard, Card, CardOperatesVirtualCard, TransactionAcc
from .serializers import (
    VirtualCardSerializer,
    VirtualCardCreateSerializer,
    AddCardSerializer,
    VirtualTransactionSerializer,
    CardOperatesVirtualCardSerializer
)

class VirtualCardViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides standard actions for VirtualCard
    along with custom actions for adding cards and processing transactions.
    """
    queryset = VirtualCard.objects.all()
    serializer_class = VirtualCardSerializer

    def create(self, request, *args, **kwargs):
        # Expect name, limit, and a card_id to set up the initial association.
        serializer = VirtualCardCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name = serializer.validated_data.get('name')
        limit = serializer.validated_data.get('limit')
        card_id = serializer.validated_data.get('card_id')

        # Create the VirtualCard.
        vc = VirtualCard.objects.create(name=name, limit=limit)

        # Try to retrieve the provided card.
        try:
            card = Card.objects.get(pk=card_id)
        except Card.DoesNotExist:
            vc.delete()  # Rollback virtual card creation.
            return Response({"error": "Card not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Create the association record.
        CardOperatesVirtualCard.objects.create(card=card, virtual_card=vc)
        output_serializer = VirtualCardSerializer(vc)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='add-card')
    def add_card(self, request, pk=None):
        """
        Add an additional card to an existing VirtualCard.
        """
        vc = self.get_object()
        serializer = AddCardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        card_id = serializer.validated_data.get('card_id')

        try:
            card = Card.objects.get(pk=card_id)
        except Card.DoesNotExist:
            return Response({"error": "Card not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent duplicate associations.
        association, created = CardOperatesVirtualCard.objects.get_or_create(card=card, virtual_card=vc)
        if not created:
            return Response({"detail": "Association already exists"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Card added to virtual card"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='transaction')
    def virtual_transaction(self, request, pk=None):
        """
        Process a virtual transaction:
          - Deducts the specified amount from the virtual card's limit.
          - Deducts (amount / number_of_associated_cards) from each associated card's TransactionAcc balance.
        """
        vc = self.get_object()
        serializer = VirtualTransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data.get('amount')

        if vc.limit < amount:
            return Response({"error": "Insufficient virtual card limit"}, status=status.HTTP_400_BAD_REQUEST)

        # Deduct the amount from the virtual card limit.
        vc.limit -= amount
        vc.save()

        # Get all associated cards.
        associations = CardOperatesVirtualCard.objects.filter(virtual_card=vc)
        num_cards = associations.count()
        if num_cards == 0:
            return Response({"error": "No cards associated with this virtual card"}, status=status.HTTP_400_BAD_REQUEST)

        per_card_amount = amount / num_cards

        # Update each associated card's TransactionAcc.
        for assoc in associations:
            card = assoc.card
            # Since Card has a OneToOneField to TransactionAcc (transaction_acc), use it if present.
            if card.transaction_acc:
                card.transaction_acc.balance -= per_card_amount
                card.transaction_acc.save()

        return Response({"detail": "Virtual transaction processed successfully"}, status=status.HTTP_200_OK)

# A separate view to list all m:n associations (cards and their virtual cards).
class CardVirtualCardListAPIView(ListAPIView):
    queryset = CardOperatesVirtualCard.objects.all()
    serializer_class = CardOperatesVirtualCardSerializer