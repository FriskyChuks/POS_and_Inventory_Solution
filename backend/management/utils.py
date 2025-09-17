from decimal import Decimal, ROUND_HALF_UP
from django.db.models import Max

from items.models import Brand, Supply  # adjust if Brand lives elsewhere


def compute_cost_from_supplies(brand):
    """
    Return the highest cost_price recorded in supplies for this brand.
    Fallback to brand.cost_price or 0 if none.
    """
    if Supply is not None:
        try:
            row = Supply.objects.filter(brand=brand).aggregate(max_cost=Max("cost_price"))
            if row["max_cost"] is not None:
                return row["max_cost"]
        except Exception:
            pass
    return getattr(brand, "cost_price", None) or 0


def apply_markup(cost, markup_type: str, markup_value: Decimal):
    if markup_type == "percent":
        return Decimal(cost) * (Decimal("1.00") + (Decimal(markup_value) / Decimal("100")))
    # absolute
    return Decimal(cost) + Decimal(markup_value)


def round_to_nearest(value: Decimal, nearest: int | None):
    if not nearest or nearest <= 0:
        return value
    nearest = Decimal(nearest)
    # round half up to nearest increment
    return (Decimal(value) / nearest).quantize(Decimal('1'), rounding=ROUND_HALF_UP) * nearest
