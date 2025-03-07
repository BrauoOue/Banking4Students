from django.urls import path
from . import views

urlpatterns = [
    # path('', views.home, name='home'),
    path('make-party/', views.create_receipt_party, name='create_receipt_party'),
    path("analyze-receipt", views.ReciteSplitting.as_view(), name="analyze-receipt"),
    path('join-party/<int:party_id>', views.join_receipt_party,
         name='join_receipt_party'),

]
