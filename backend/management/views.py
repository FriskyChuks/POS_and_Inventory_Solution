from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import status

from items.models import Brand  # adjust as needed
from .models import ManagementSetting
from .serializers import (
    ManagementSettingSerializer,
    BrandPriceUpdateSerializer,
    BrandLightSerializer,
)
from .utils import compute_cost_from_supplies, apply_markup, round_to_nearest


class ManagementSettingView(RetrieveUpdateAPIView):
    """
    GET/PUT /api/management/settings/
    Use id=1 (create on first access if missing).
    """
    permission_classes = [AllowAny]
    # permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ManagementSettingSerializer
    lookup_field = "pk"

    def get_object(self):
        obj, _ = ManagementSetting.objects.get_or_create(pk=1)
        return obj


class BrandPricePreviewView(APIView):
    """
    POST /api/management/brands/<brand_id>/price-preview/
    Body: { cost_source, markup_type, markup_value, round_to? }
    Returns preview without saving.
    """
    permission_classes = [AllowAny]
    # permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, brand_id):
        try:
            brand = Brand.objects.get(pk=brand_id)
        except Brand.DoesNotExist:
            return Response({"detail": "Brand not found."}, status=404)

        serializer = BrandPriceUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # cost
        if data["cost_source"] == "max_supply":
            unit_cost = Decimal(compute_cost_from_supplies(brand))
        else:
            unit_cost = Decimal(getattr(brand, "cost_price", 0) or 0)

        # selling
        suggested = apply_markup(unit_cost, data["markup_type"], data["markup_value"])
        suggested = round_to_nearest(suggested, data.get("round_to"))

        return Response({
            "brand": BrandLightSerializer(brand).data,
            "computed_cost": unit_cost,
            "suggested_selling_price": suggested,
        }, status=200)


class BrandPriceApplyView(APIView):
    """
    POST /api/management/brands/<brand_id>/apply-price/
    Body: { cost_source, markup_type, markup_value, round_to? }
    Saves cost (if cost_source=max_supply) and selling_price.
    """
    # permission_classes = [IsAuthenticated, IsAdminUser]
    permission_classes = [AllowAny]

    def post(self, request, brand_id):
        try:
            brand = Brand.objects.get(pk=brand_id)
        except Brand.DoesNotExist:
            return Response({"detail": "Brand not found."}, status=404)

        serializer = BrandPriceUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # cost
        if data["cost_source"] == "max_supply":
            unit_cost = Decimal(compute_cost_from_supplies(brand))
            brand.cost_price = unit_cost
        else:
            unit_cost = Decimal(getattr(brand, "cost_price", 0) or 0)

        # selling
        suggested = apply_markup(unit_cost, data["markup_type"], data["markup_value"])
        suggested = round_to_nearest(suggested, data.get("round_to"))

        brand.selling_price = suggested
        brand.save(update_fields=["cost_price", "selling_price"])

        return Response({
            "brand": BrandLightSerializer(brand).data,
            "saved_cost": brand.cost_price,
            "saved_selling_price": brand.selling_price,
        }, status=200)


class SyncAllCostsFromSuppliesView(APIView):
    """
    POST /api/management/sync-costs/
    Pulls highest cost from supplies for every brand and (optionally) applies default markup to selling price.
    Body (optional): { apply_markup: bool }
    """
    # permission_classes = [IsAuthenticated, IsAdminUser]
    permission_classes = [AllowAny]

    def post(self, request):
        apply_mrk = bool(request.data.get("apply_markup", False))
        settings_obj, _ = ManagementSetting.objects.get_or_create(pk=1)

        updated = 0
        for brand in Brand.objects.all().select_related("item"):
            max_cost = Decimal(compute_cost_from_supplies(brand))
            changed = False
            if max_cost and max_cost != (brand.cost_price or Decimal("0")):
                brand.cost_price = max_cost
                changed = True

            if apply_mrk:
                sp = apply_markup(
                    max_cost,
                    settings_obj.default_markup_type,
                    settings_obj.default_markup_value
                )
                brand.selling_price = sp
                changed = True

            if changed:
                brand.save(update_fields=["cost_price", "selling_price"])
                updated += 1

        return Response({"updated": updated}, status=200)
