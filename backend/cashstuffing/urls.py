from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BucketItemViewSet

router = DefaultRouter()
router.register(r'bucketitems', BucketItemViewSet, basename='bucketitem')

urlpatterns = [
    path('', include(router.urls)),
]