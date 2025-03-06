# ClaimHub/views.py
from rest_framework.views import APIView
from rest_framework import generics
from main.models import Service, Product,Item, Student  # Adjust the app name if needed
from .serializers import ServiceSerializer, ProductSerializer
from rest_framework.response import Response
from django.utils import timezone
from rest_framework import status


class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    

class PurchaseItemView(APIView):
    def post(self, request):
        # Expecting JSON with "user_id" and "item_id"
        user_id = request.data.get("user_id")
        item_id = request.data.get("item_id")
        
        if not user_id or not item_id:
            return Response(
                {"error": "user_id and item_id are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the student object
        try:
            student = Student.objects.get(pk=user_id)
        except Student.DoesNotExist:
            return Response(
                {"error": "Student not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Retrieve the item from the parent Item table
        try:
            item = Item.objects.get(pk=item_id)
        except Item.DoesNotExist:
            return Response(
                {"error": "Item not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if the student has enough points (using Item.price as the cost)
        if student.points < item.price:
            return Response(
                {"error": "Insufficient points."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Deduct the cost from the student's points
        student.points -= item.price
        student.save()
        
        # If the purchased item is a Service, update its datetime to the current time.
        # Because Service inherits from Item with the same primary key,
        # we can try to fetch the Service instance by its pk.
        try:
            service_item = Service.objects.get(pk=item.pk)
            service_item.datetime = timezone.now()
            service_item.save()
        except Service.DoesNotExist:
            # The item is not a Service, so no datetime update is needed.
            pass

        return Response(
            {"message": "Purchase successful.", "remaining_points": student.points},
            status=status.HTTP_200_OK
        )

class ItemDetailView(APIView):
    """
    Retrieve, update, or delete an item. 
    If the item is a Service, the extra datetime attribute is available.
    """
    def get_object(self, pk):
        # Attempt to get a Service first
        try:
            return Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            # If not found, try to get a Product
            try:
                return Product.objects.get(pk=pk)
            except Product.DoesNotExist:
                return None

    def get_serializer(self, instance, data=None, partial=False):
        if isinstance(instance, Service):
            return ServiceSerializer(instance, data=data, partial=partial)
        elif isinstance(instance, Product):
            return ProductSerializer(instance, data=data, partial=partial)
        return None

    def get(self, request, pk):
        instance = self.get_object(pk)
        if not instance:
            return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Use the appropriate serializer based on instance type.
        if isinstance(instance, Service):
            serializer = ServiceSerializer(instance)
        else:
            serializer = ProductSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        instance = self.get_object(pk)
        if not instance:
            return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        instance = self.get_object(pk)
        if not instance:
            return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        instance = self.get_object(pk)
        if not instance:
            return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        instance.delete()
        return Response({"message": "Item deleted successfully."}, status=status.HTTP_200_OK)