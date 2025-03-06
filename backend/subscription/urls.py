from django.urls import path
from . import views

urlpatterns = [
    path('subscriptions/', views.SubscriptionEntityListView.as_view(), name='subscription_entity_list'),
    path('subscriptions/<int:pk>/', views.SubscriptionEntityDetailView.as_view(), name='subscription_entity_detail'),
    path('create/', views.create_subscription_entity, name='create_subscription_entity'),
    path('subscribe/', views.subscribe_card, name='subscribe_card'),
    path('delete/', views.delete_subscription_entity, name='delete_subscription_entity'),
]