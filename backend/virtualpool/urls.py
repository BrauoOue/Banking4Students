from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VirtualCardViewSet, CardVirtualCardListAPIView

router = DefaultRouter()
router.register(r'virtualcards', VirtualCardViewSet, basename='virtualcard')

urlpatterns = [
    path('', include(router.urls)),
    # Endpoint to list all Card - VirtualCard associations.
    path('card-virtualcards/', CardVirtualCardListAPIView.as_view(), name='card-virtualcards'),

]