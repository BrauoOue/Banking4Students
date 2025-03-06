from django.urls import path
from .views import ServiceListView, ProductListView, PurchaseItemView, ItemDetailView, GrantCreateView,GrantListView,GrantDetailView,ApplyGrantView

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='services-list'), #ok
    path('products/', ProductListView.as_view(), name='products-list'),
    path('purchase/', PurchaseItemView.as_view(), name='purchase-item'),
    path('items/<int:pk>/', ItemDetailView.as_view(), name='item-detail'),
    path('grants/', GrantListView.as_view(), name='grant-list'),
    path('grants/create/<int:company_id>/', GrantCreateView.as_view(), name='grant-create'),
    path('grants/<int:pk>/', GrantDetailView.as_view(), name='grant-detail'),
    path('grants/<int:grant_id>/apply/<int:user_id>/', ApplyGrantView.as_view(), name='grant-apply'),
]