from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import models
from .models import Item, Brand

def recalculate_item_stock(item_id):
    """
    Sum all remaining brand stock levels for the item and update the item's stock_level.
    """
    total_stock = Brand.objects.filter(item_id=item_id).aggregate(total=models.Sum('stock_level'))['total'] or 0
    Item.objects.filter(id=item_id).update(stock_level=total_stock)
    return total_stock

@receiver(post_save, sender=Brand)
def update_stock_on_save(sender, instance, **kwargs):
    recalculate_item_stock(instance.item.id)

@receiver(post_delete, sender=Brand)
def update_stock_on_delete(sender, instance, **kwargs):
    recalculate_item_stock(instance.item.id)
