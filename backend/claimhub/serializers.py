# ClaimHub/serializers.py

from rest_framework import serializers
from main.models import Service, Product  # Adjust the app name as needed
from main.models import Grant, StudentAppliesGrant

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
class GrantSerializer(serializers.ModelSerializer):
    # The company field is read-only because it is automatically set by the view.
    company = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Grant
        fields = ['id', 'name', 'amount', 'company']

# Optional serializer if you need to serialize student applications.
class StudentAppliesGrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAppliesGrant
        fields = ['id', 'student', 'grant']