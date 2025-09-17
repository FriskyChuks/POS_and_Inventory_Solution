from rest_framework import serializers
from .models import ManagementSetting
from items.models import Brand  # adjust import to your app


class ManagementSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagementSetting
        fields = ["id", "default_markup_type", "default_markup_value", "cost_source"]


class BrandPriceUpdateSerializer(serializers.Serializer):
    """
    Payload for price updates:
    - cost_source: "max_supply" or "brand"
    - markup_type: "percent" or "absolute"
    - markup_value: number
    - round_to: optional int (e.g., nearest 10 or 50) for selling price rounding
    """
    cost_source = serializers.ChoiceField(choices=[("max_supply", "max_supply"), ("brand", "brand")], default="max_supply")
    markup_type = serializers.ChoiceField(choices=[("percent", "percent"), ("absolute", "absolute")], default="percent")
    markup_value = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    round_to = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, attrs):
        if attrs["markup_type"] == "percent" and attrs["markup_value"] < 0:
            raise serializers.ValidationError("Percent markup cannot be negative.")
        return attrs


class BrandLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "selling_price", "cost_price"]
