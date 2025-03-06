# ClaimHub/views.py

from rest_framework import generics
from main.models import Service, Product  # Adjust the app name if needed
from .serializers import ServiceSerializer, ProductSerializer

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer