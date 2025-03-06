from django.db import models

###############################################################################
# 1) Simple “base” models (no parents)
###############################################################################

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
        # Display a truncated snippet of the content for readability
        return f"Notification for {self.user.email}: {self.content[:20]}..."


###############################################################################
# 2) User, Student, Company (multi-table inheritance)
###############################################################################

class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.email

class Company(User):
    # In multi-table inheritance, "id" is inherited from User
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Company {self.name} ({self.email})"


###############################################################################
# 3) University has a 1:1 with TransactionAcc (defined below),
#    so we can define University here with a OneToOneField that
#    points to 'TransactionAcc' via string reference.
###############################################################################

class University(models.Model):
    name = models.CharField(max_length=100)
    # 1:1 with TransactionAcc
    transaction_acc = models.OneToOneField(
        "TransactionAcc",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="university_account"
    )

    def __str__(self):
        return self.name


###############################################################################
# 4) TransactionAcc - has N:1 with Bank, N:1 with User
###############################################################################

class TransactionAcc(models.Model):
    number = models.CharField(max_length=50)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bank = models.ForeignKey(
        Bank,
        on_delete=models.CASCADE,
        related_name="transaction_accounts"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="transaction_accounts",
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Acc {self.number} (Balance={self.balance})"


###############################################################################
# 5) Transaction -> OwentTransaction (multi-table inheritance)
###############################################################################

class Transaction(models.Model):
    # Foreign keys to TransactionAcc (N:1 both sides)
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
    # title = models.CharField(max_length=100) msm ne treba (uncomment ako treba)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField()
    type = models.CharField(max_length=50)
    category = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.title} ({self.amount})"

class OwentTransaction(Transaction):
    owent_title = models.CharField(max_length=100, blank=True)
    # OwentTransaction inherits id/PK from Transaction
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
    # N:1 with Company
    company = models.ForeignKey( 
        Company,
        on_delete=models.CASCADE,
        related_name="grants"
    )

    def __str__(self):
        return f"Grant {self.name} ({self.amount})"


###############################################################################
# 10) Item -> Service, Product (multi-table inheritance)
###############################################################################

class Item(models.Model):
    price = models.IntegerField()
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Service(Item):
    # Inherits PK from Item
    datetime = models.DateTimeField()
    # N:1 with Student
    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="services_offered"
    )

    def __str__(self):
        return f"Service {self.name}"

class Product(Item):
    # Inherits PK from Item
    # no extra fields in the ER diagram
    def __str__(self):
        return f"Product {self.name}"


###############################################################################
# 11) Student (inherits from User, referencing other models)
###############################################################################

class Student(User):
    # In multi-table inheritance, Student has a OneToOneField to User behind the scenes
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    ssn = models.CharField(max_length=20)
    points = models.IntegerField(default=0)
    # N:1 with University
    university = models.ForeignKey(
        University,
        on_delete=models.CASCADE,
        related_name="students",
        null=True,
        blank=True
    )
    # 1:1 with Card for "default card"
    card_default = models.OneToOneField(
        Card,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="default_for_student"
    )

    # M:N "friend_with" – self-referential
    # We'll define the through model below (FriendWith).
    friends = models.ManyToManyField(
        "self",
        symmetrical=True,
        through="FriendWith",
        related_name="friend_of"
    )

    def __str__(self):
        return f"Student {self.name} {self.surname} ({self.email})"



###############################################################################
# 12) Now define the many-to-many "through" tables with any extra fields
###############################################################################

# friend_with(#id_user_student_1*, #id_user_student_2*)
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


# student_applies_grant(#id_grant*, #id_user_student*)
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

# For convenience, you can also define a ManyToManyField on Student or Grant:
# class Grant(models.Model):
#     ...
#     students = models.ManyToManyField(Student, through='StudentAppliesGrant', related_name='grants_applied')


# student_participates_owent(#id_user_student*, #id_owent*)
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


# student_buys_service(#id_user_student*, #id_item_service*)
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


# student_buys_product(#id_user_student*, #id_item_product*, qr_code_image, date, is_used)
class StudentBuysProduct(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    qr_code_image = models.ImageField(upload_to="../ qr_codes/", null=True, blank=True)
    date = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student} buys product {self.product}"


# card_operates_virtual_card(#id_card*, #id_virtual_card*)
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


# card_subscribes_subscription_entity(#id_card*, #id_subscription_entity*, date_from, date_to, amount, status)
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


# uni_has_document(#id_university*, #id_document*, price)
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
    
    