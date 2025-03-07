from django.urls import path
from . import views

urlpatterns = [
    # path('', views.home, name='home'),
    path('make-party/', views.create_receipt_party, name='create_receipt_party'),
    path('analyze-receipt/', views.ReciteSplitting.as_view(), name='analyze-receipt'),
    path('join-party/<int:party_id>', views.join_receipt_party,
         name='join_receipt_party'),

    path('ap/', views.accept_paying,
         name='join_receipt_party'),

    path('get-payment-status/', views.get_status,
         name='join_receipt_party'),

    path('pay-bill/', views.pay,
         name='join_receipt_party'),

    path('pay-bill/', views.pay,
         name='join_receipt_party'),

    path('create-owent/', views.create_owent,
         name='join_receipt_party'),

    path('make-owent-transaction/', views.make_owent_transaction,
         name='join_receipt_party'),

    path('get-owent-transaction/', views.get_student_owent_transactions,
         name='join_receipt_party'),

    path('pay-owent-transaction/', views.pay_owent_transaction,
         name='join_receipt_party'),

]
