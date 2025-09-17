from django.db import models

MARKUP_TYPE_CHOICES = (
    ("percent", "Percent"),
    ("absolute", "Absolute"),
)

class ManagementSetting(models.Model):
    """
    Simple singleton-ish settings (use id=1).
    """
    default_markup_type = models.CharField(max_length=10, choices=MARKUP_TYPE_CHOICES, default="percent")
    default_markup_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # e.g., 10 (%) or 500 (currency)
    cost_source = models.CharField(max_length=20, default="max_supply")  # "max_supply" or "brand"

    def __str__(self):
        return "Management Settings"
