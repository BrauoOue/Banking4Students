# ClaimHub/serializers.py

from rest_framework import serializers
from main.models import Service, Product  # Adjust the app name as needed

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'