from django.urls import path
from .views import user_list, user_transactions, get_user_transaction_accounts, get_user, send_money, make_transaction

urlpatterns = [
    path("user-list/", user_list, name="user-list"),
    path("user/<int:id>/", get_user, name="user-list"),
    path("transactions/<str:email>/", user_transactions, name="user-transactions"),
    path("transaction-accounts/<int:user_id>/", get_user_transaction_accounts, name="user-transaction-accounts"),
    path("send-money/", send_money, name="send-transaction"),
    path("make-transaction/", make_transaction, name="make-transaction"),
]
