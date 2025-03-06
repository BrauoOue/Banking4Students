from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import generics, status
from main.models import Service, Product, Item, Student,Company
from main.models import Grant, StudentAppliesGrant
from .serializers import ServiceSerializer, ProductSerializer
from rest_framework.response import Response
from django.utils import timezone
from .serializers import GrantSerializer


class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# New view to create a Service with the current user as creator.
class ServiceCreateView(generics.CreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def perform_create(self, serializer):
        # Here we assume that request.user is a Student.
        # This automatically sets the 'student' field to the logged in user and the 'datetime' field to now.
        serializer.save(student=self.request.user, datetime=timezone.now())

# New view to create a Product.
class ProductCreateView(generics.CreateAPIView):
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
    





#######################         GRANTS


# Create (publish) a new grant.
class GrantCreateView(generics.CreateAPIView):
    queryset = Grant.objects.all()
    serializer_class = GrantSerializer

    def perform_create(self, serializer):
        # Retrieve the company using the company_id provided in the URL.
        company_id = self.kwargs.get('company_id')
        company = get_object_or_404(Company, pk=company_id)
        serializer.save(company=company)

# Get a list of all grants.
class GrantListView(generics.ListAPIView):
    queryset = Grant.objects.all()
    serializer_class = GrantSerializer

# Get, update, or delete a specific grant.
class GrantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Grant.objects.all()
    serializer_class = GrantSerializer


# ---------------------------------------------------------------------------
# Student Grant Application View
# ---------------------------------------------------------------------------

class ApplyGrantView(APIView):
    """
    Endpoint for a student to apply to a grant.
    Expects the grant id and the student id as part of the URL.
    """
    def post(self, request, grant_id, user_id):
        # Get the grant or return 404 if not found.
        grant = get_object_or_404(Grant, pk=grant_id)
        # Get the student from the provided user_id.
        student = get_object_or_404(Student, pk=user_id)

        # Check if the student has already applied to this grant.
        if StudentAppliesGrant.objects.filter(student=student, grant=grant).exists():
            return Response(
                {"error": "You have already applied to this grant."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the application record.
        StudentAppliesGrant.objects.create(student=student, grant=grant)
        return Response(
            {"message": "Application submitted successfully."},
            status=status.HTTP_201_CREATED
        )