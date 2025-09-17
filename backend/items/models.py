from django.db import models
from django.db.models import Sum
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower
from django.db.models import F
import uuid

from accounts.models import Supplier, CustomUser
from accounts.models import Supplier


class ItemCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class Item(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(ItemCategory, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    stock_level = models.PositiveIntegerField(default=0)  # ✅ Real field added
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            UniqueConstraint(Lower('name'), name='unique_item_name_ci')
        ]

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, related_name='brands', null=True, blank=True)
    barcode = models.CharField(max_length=100, unique=True, null=True, blank=True)
    stock_level = models.PositiveIntegerField(default=0)  # ✅ Real field added
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            UniqueConstraint(Lower('name'), name='unique_brand_name_ci')
        ]


    def save(self, *args, **kwargs):
        if not self.barcode:
            self.barcode = str(uuid.uuid4().int)[:12]  # generate 12-digit code
        super().save(*args, **kwargs)


    def __str__(self):
        return self.name     

class Supply(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='supplies')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    supply_price = models.DecimalField(max_digits=10, decimal_places=2)
    supply_date = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} of {self.brand.item.name} - {self.brand.name} from {self.supplier.name if self.supplier else 'Unknown'}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new:
            Brand.objects.filter(pk=self.brand.pk).update(stock_level=F('stock_level') + self.quantity)





