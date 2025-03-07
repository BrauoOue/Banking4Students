from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST
from datetime import datetime
from decimal import Decimal
from rest_framework import generics
from main.models import SubscriptionEntity
from .serializers import SubscriptionEntitySerializer

# Import models from the main app (adjust the import path as needed)
from main.models import (
    SubscriptionEntity,
    TransactionAcc,
    CardSubscribesSubscriptionEntity,
    Card
)

class SubscriptionEntityListView(generics.ListAPIView):
    """
    API view to list all SubscriptionEntity instances.
    """
    queryset = SubscriptionEntity.objects.all()
    serializer_class = SubscriptionEntitySerializer


class SubscriptionEntityDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve the details of a specific SubscriptionEntity given its ID.
    """
    queryset = SubscriptionEntity.objects.all()
    serializer_class = SubscriptionEntitySerializer

@require_POST
def create_subscription_entity(request):
    """
    Creates a new SubscriptionEntity.
    Expects POST parameters:
      - transaction_acc_id: The ID of the TransactionAcc to associate.
      - name: The name for the subscription entity.
      - link: The URL link for the subscription entity.
    """
    transaction_acc_id = request.POST.get('transaction_acc_id')
    name = request.POST.get('name')
    link = request.POST.get('link')

    if not (transaction_acc_id and name and link):
        return HttpResponseBadRequest("Missing parameters. 'transaction_acc_id', 'name', and 'link' are required.")

    transaction_acc = get_object_or_404(TransactionAcc, pk=transaction_acc_id)
    subscription_entity = SubscriptionEntity.objects.create(
        name=name,
        link=link,
        transaction_acc=transaction_acc
    )
    return JsonResponse({
        'status': 'success',
        'subscription_entity_id': subscription_entity.id
    })


@require_POST
def subscribe_card(request):
    """
    Subscribes a Card to a SubscriptionEntity.
    Expects POST parameters:
      - card_id: The ID of the Card to subscribe.
      - subscription_entity_id: The ID of the SubscriptionEntity.
      - date_from: Start date of the subscription (YYYY-MM-DD).
      - date_to: End date of the subscription (YYYY-MM-DD). Can be empty.
      - amount: The subscription amount.
      - status: The subscription status.
    """
    card_id = request.POST.get('card_id')
    subscription_entity_id = request.POST.get('subscription_entity_id')
    date_from_str = request.POST.get('date_from')
    date_to_str = request.POST.get('date_to')
    amount_str = request.POST.get('amount')
    status_val = request.POST.get('status')

    if not (card_id and subscription_entity_id and date_from_str and amount_str and status_val):
        return HttpResponseBadRequest("Missing required parameters.")

    # Convert date strings to date objects and amount to Decimal.
    try:
        date_from = datetime.strptime(date_from_str, '%Y-%m-%d').date()
        date_to = datetime.strptime(date_to_str, '%Y-%m-%d').date() if date_to_str else None
        amount = Decimal(amount_str)
    except Exception as e:
        return HttpResponseBadRequest(f"Invalid data format: {e}")

    card = get_object_or_404(Card, pk=card_id)
    subscription_entity = get_object_or_404(SubscriptionEntity, pk=subscription_entity_id)

    subscription = CardSubscribesSubscriptionEntity.objects.create(
        card=card,
        subscription_entity=subscription_entity,
        date_from=date_from,
        date_to=date_to,
        amount=amount,
        status=status_val
    )
    return JsonResponse({
        'status': 'success',
        'subscription_id': subscription.id
    })


@require_POST
def delete_subscription_entity(request):
    """
    Deletes a SubscriptionEntity.
    Expects a POST parameter:
      - subscription_entity_id: The ID of the SubscriptionEntity to delete.
    """
    subscription_entity_id = request.POST.get('subscription_entity_id')
    if not subscription_entity_id:
        return HttpResponseBadRequest("Missing 'subscription_entity_id' parameter.")

    subscription_entity = get_object_or_404(SubscriptionEntity, pk=subscription_entity_id)
    subscription_entity.delete()
    return JsonResponse({'status': 'deleted'})