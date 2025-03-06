from django.urls import path
from .views import ServiceListView, ProductListView, PurchaseItemView, ItemDetailView

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='services-list'),
    path('products/', ProductListView.as_view(), name='products-list'),
    path('purchase/', PurchaseItemView.as_view(), name='purchase-item'),
    path('items/<int:pk>/', ItemDetailView.as_view(), name='item-detail'),
]