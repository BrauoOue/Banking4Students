from django.contrib import admin
from .models import (
    TransOwner, Bank, Owent, Document, VirtualCard, Notification, User, Company, University,
    TransactionAcc, Transaction, OwentTransaction, Card, SubscriptionEntity, BucketItem,
    Grant, Item, Service, Product, Student, FriendWith, StudentAppliesGrant, StudentParticipatesOwent,
    StudentBuysService, StudentBuysProduct, CardOperatesVirtualCard, CardSubscribesSubscriptionEntity,
    UniHasDocument, ReceiptParty, StudentCreatesPartyUsesTransaction, StudentParticipatesPartyUsesTransaction
)


class TransactionAccAdmin(admin.ModelAdmin):
    list_display = ("number", "balance", "bank", "get_owner_info")  # Custom column for owner info
    search_fields = ("number", "trans_owner__user__email", "trans_owner__university__name")

    def get_owner_info(self, obj):
        """Fetch owner details dynamically depending on whether it's a User or University."""
        owner = obj.trans_owner
        if isinstance(owner, User):
            return f"User: {owner.email} ({owner.id})"
        elif isinstance(owner, University):
            return f"University: {owner.name} ({owner.id})"
        return "Unknown"

    get_owner_info.short_description = "Owner Information"  # Column name in admin panel



# Register in Django Admin
admin.site.register(TransactionAcc)
admin.site.register(TransOwner)
admin.site.register(Bank)
admin.site.register(Owent)
admin.site.register(Document)
admin.site.register(VirtualCard)
admin.site.register(Notification)
admin.site.register(User)
admin.site.register(Company)
admin.site.register(University)
# admin.site.register(TransactionAcc)
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
admin.site.register(ReceiptParty)
admin.site.register(StudentCreatesPartyUsesTransaction)
admin.site.register(StudentParticipatesPartyUsesTransaction)
