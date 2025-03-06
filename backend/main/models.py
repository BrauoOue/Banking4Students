from django.db import models

###############################################################################
# 1) Base models and new super-entity: TransOwner
###############################################################################

class TransOwner(models.Model):
    # New super entity for User and University (no extra fields)
    def __str__(self):
        return f"TransOwner {self.pk}"


class Bank(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Owent(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Document(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class VirtualCard(models.Model):
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} (limit={self.limit})"


class Notification(models.Model):
    content = models.TextField()
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    def __str__(self):
        return f"Notification for {self.user.email}: {self.content[:20]}..."


###############################################################################
# 2) User, Student, Company (multi‐table inheritance)
###############################################################################

class User(TransOwner):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return f"{self.id} {self.email}"


class Company(User):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Company {self.name} ({self.email})"


###############################################################################
# 3) University now inherits from TransOwner (removed its transaction_acc field)
###############################################################################

class University(TransOwner):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


###############################################################################
# 4) TransactionAcc now points to TransOwner instead of User
###############################################################################

class TransactionAcc(models.Model):
    number = models.CharField(max_length=50)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bank = models.ForeignKey(
        Bank,
        on_delete=models.CASCADE,
        related_name="transaction_accounts"
    )
    trans_owner = models.ForeignKey(
        TransOwner,
        on_delete=models.CASCADE,
        related_name="transaction_accounts"
    )

    def __str__(self):
        return f"Acc {self.number} (Balance={self.balance}) {self.trans_owner}"


###############################################################################
# 5) Transaction and OwentTransaction (multi‐table inheritance)
###############################################################################

class Transaction(models.Model):
    transaction_acc_pays = models.ForeignKey(
        TransactionAcc,
        on_delete=models.CASCADE,
        related_name="transactions_out"
    )
    transaction_acc_receives = models.ForeignKey(
        TransactionAcc,
        on_delete=models.CASCADE,
        related_name="transactions_in"
    )
    title = models.CharField(max_length=100, blank=True, default='')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField()
    type = models.CharField(max_length=50)
    category = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.title} ({self.amount})"


class OwentTransaction(Transaction):
    owent_title = models.CharField(max_length=100, blank=True)
    # N:1 with Student and N:1 with Owent
    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="owent_transactions"
    )
    owent = models.ForeignKey(
        Owent,
        on_delete=models.CASCADE,
        related_name="owent_transactions"
    )

    def __str__(self):
        return f"OwentTx: {self.title} for {self.student}"


###############################################################################
# 6) Card - N:1 with Student, N:1 with Bank, 1:1 with TransactionAcc
###############################################################################

class Card(models.Model):
    card_number = models.CharField(max_length=16)
    cvv = models.CharField(max_length=4)
    exp_date = models.DateField()
    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="cards"
    )
    bank = models.ForeignKey(
        Bank,
        on_delete=models.CASCADE,
        related_name="cards"
    )
    transaction_acc = models.OneToOneField(
        TransactionAcc,
        on_delete=models.CASCADE,
        related_name="card",
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Card {self.card_number}"


###############################################################################
# 7) SubscriptionEntity - 1:1 with TransactionAcc
###############################################################################

class SubscriptionEntity(models.Model):
    name = models.CharField(max_length=100)
    link = models.URLField(max_length=200)
    transaction_acc = models.OneToOneField(
        TransactionAcc,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="subscription_entity"
    )

    def __str__(self):
        return self.name


###############################################################################
# 8) BucketItem - N:1 with Card
###############################################################################

class BucketItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    frequency = models.IntegerField(default=1)
    stacked_money = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=50)
    amount = models.IntegerField(default=1000)
    card = models.ForeignKey(
        Card,
        on_delete=models.CASCADE,
        related_name="bucket_items"
    )

    def __str__(self):
        return f"BucketItem {self.name} (${self.price})"


###############################################################################
# 9) Grant - N:1 with Company
###############################################################################

class Grant(models.Model):
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="grants"
    )

    def __str__(self):
        return f"Grant {self.name} ({self.amount})"


###############################################################################
# 10) Item -> Service, Product (multi‐table inheritance)
###############################################################################

class Item(models.Model):
    price = models.IntegerField()
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Service(Item):
    datetime = models.DateTimeField()
    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="services_offered"
    )

    def __str__(self):
        return f"Service {self.name}"


class Product(Item):
    def __str__(self):
        return f"Product {self.name}"


###############################################################################
# 11) Student (inherits from User)
###############################################################################

class Student(User):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    ssn = models.CharField(max_length=20)
    points = models.IntegerField(default=0)
    attending_university = models.ForeignKey(
        University,
        on_delete=models.CASCADE,
        related_name="students",
        null=True,
        blank=True
    )
    card_default = models.OneToOneField(
        Card,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="default_for_student"
    )
    friends = models.ManyToManyField(
        "self",
        symmetrical=True,
        through="FriendWith"
    )

    def __str__(self):
        return f"Student {self.name} {self.surname} ({self.email})"


###############################################################################
# 12) Existing many-to-many "through" models
###############################################################################

class FriendWith(models.Model):
    student1 = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="friendships_initiated"
    )
    student2 = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="friendships_received"
    )

    class Meta:
        unique_together = ("student1", "student2")

    def __str__(self):
        return f"{self.student1} <-> {self.student2}"


class StudentAppliesGrant(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE
    )
    grant = models.ForeignKey(
        Grant,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.student} applies for {self.grant}"


class StudentParticipatesOwent(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE
    )
    owent = models.ForeignKey(
        Owent,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.student} participates in {self.owent}"


class StudentBuysService(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.student} buys service {self.service}"


class StudentBuysProduct(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    qr_code_image = models.ImageField(upload_to="../qr_codes/", null=True, blank=True)
    date = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student} buys product {self.product}"


class CardOperatesVirtualCard(models.Model):
    card = models.ForeignKey(
        Card,
        on_delete=models.CASCADE
    )
    virtual_card = models.ForeignKey(
        VirtualCard,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.card} operates {self.virtual_card}"


class CardSubscribesSubscriptionEntity(models.Model):
    card = models.ForeignKey(
        Card,
        on_delete=models.CASCADE
    )
    subscription_entity = models.ForeignKey(
        SubscriptionEntity,
        on_delete=models.CASCADE
    )
    date_from = models.DateField()
    date_to = models.DateField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.card} subscribes {self.subscription_entity} [{self.status}]"


class UniHasDocument(models.Model):
    university = models.ForeignKey(
        University,
        on_delete=models.CASCADE
    )
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.university} has doc {self.document} (${self.price})"


###############################################################################
# 13) New models for ReceiptParty and the ternary relationships
###############################################################################

class ReceiptParty(models.Model):
    # As defined, only a primary key is needed.
    def __str__(self):
        return f"ReceiptParty {self.pk}"


class StudentCreatesPartyUsesTransaction(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="created_parties"
    )
    receipt_party = models.ForeignKey(
        ReceiptParty,
        on_delete=models.CASCADE,
        related_name="creator"
    )
    transaction_acc = models.ForeignKey(
        TransactionAcc,
        on_delete=models.CASCADE,
        related_name="party_transactions"
    )

    def __str__(self):
        return f"{self.student} created party {self.receipt_party} with {self.transaction_acc}"


class StudentParticipatesPartyUsesTransaction(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="participating_parties"
    )
    receipt_party = models.ForeignKey(
        ReceiptParty,
        on_delete=models.CASCADE,
        related_name="participants"
    )
    transaction_acc = models.ForeignKey(
        TransactionAcc,
        on_delete=models.CASCADE,
        related_name="participation_transactions"
    )
    owed_money = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)

    def __str__(self):
        return (f"{self.student} participates in {self.receipt_party} with "
                f"{self.transaction_acc} (owed: {self.owed_money}, status: {self.status})")