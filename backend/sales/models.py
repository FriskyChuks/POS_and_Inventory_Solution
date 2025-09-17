from django.db import models
from items.models import Brand
from accounts.models import Supplier, CustomUser
from django.db.models import Sum, F


class SalesInvoice(models.Model):
    invoice_number = models.CharField(max_length=20, unique=True)  # Unique identifier
    customer = models.CharField(max_length=100, blank=True, null=True)
    customer_phone = models.CharField(max_length=15, blank=True, null=True)
    customer_address = models.CharField(max_length=225, blank=True, null=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Cashier handling the sale
    sales_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cash')
    sale_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.sale_date}"
    

class Payment(models.Model):
    invoice = models.ForeignKey(SalesInvoice, related_name="payments", on_delete=models.CASCADE)
    method = models.CharField(max_length=20, choices=[
        ("cash", "Cash"),
        ("pos", "POS"),
        ("transfer", "Transfer"),
        ("cheque", "Cheque"),
        ("credit", "Credit"),
    ])
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount}-{self.method} | Invoice No:{self.invoice.invoice_number}"


class SalesDetail(models.Model):
    sales = models.ForeignKey(SalesInvoice, on_delete=models.CASCADE, related_name="items")
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='sales')
    # brand = models.CharField(max_length=100, blank=True)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.brand.stock_level -= self.quantity
            self.brand.save()
        super().save(*args, **kwargs)
        

class ExpiryNotification(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    days_left = models.PositiveIntegerField()
    notified_at = models.DateTimeField(auto_now_add=True)