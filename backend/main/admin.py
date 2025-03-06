from django.contrib import admin
from .models import (
    Bank, Owent, Document, VirtualCard, Notification, User, Company, University,
    TransactionAcc, Transaction, OwentTransaction, Card, SubscriptionEntity, BucketItem,
    Grant, Item, Service, Product, Student, FriendWith, StudentAppliesGrant, StudentParticipatesOwent,
    StudentBuysService, StudentBuysProduct, CardOperatesVirtualCard, CardSubscribesSubscriptionEntity,
    UniHasDocument
)

# Register each model with the admin site.
admin.site.register(Bank)
admin.site.register(Owent)
admin.site.register(Document)
admin.site.register(VirtualCard)
admin.site.register(Notification)
admin.site.register(User)
admin.site.register(Company)
admin.site.register(University)
admin.site.register(TransactionAcc)
admin.site.register(Transaction)
admin.site.register(OwentTransaction)
admin.site.register(Card)
admin.site.register(SubscriptionEntity)
admin.site.register(BucketItem)
admin.site.register(Grant)
admin.site.register(Item)
admin.site.register(Service)
admin.site.register(Product)
admin.site.register(Student)
admin.site.register(FriendWith)
admin.site.register(StudentAppliesGrant)
admin.site.register(StudentParticipatesOwent)
admin.site.register(StudentBuysService)
admin.site.register(StudentBuysProduct)
admin.site.register(CardOperatesVirtualCard)
admin.site.register(CardSubscribesSubscriptionEntity)
admin.site.register(UniHasDocument)