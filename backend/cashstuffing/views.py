from rest_framework import viewsets, status
from rest_framework.response import Response
from main.models import BucketItem
from .serializers import BucketItemSerializer

class BucketItemViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions to create, retrieve, update,
    delete, and list BucketItems.
    """
    queryset = BucketItem.objects.all()
    serializer_class = BucketItemSerializer

    # Optionally, override create() if you need to add custom logic,
    # otherwise, the default implementation already allows passing in the card's id.
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)