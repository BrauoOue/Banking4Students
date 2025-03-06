from django.urls import path
from .views import ServiceListView, ProductListView

urlpatterns = [
    path('/services/', ServiceListView.as_view(), name='services-list'),
    path('/products/', ProductListView.as_view(), name='products-list'),
]