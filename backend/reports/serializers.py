# reports/serializers.py
from rest_framework import serializers
from sales.models import SalesDetail

class ProfitLossDetailSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source="brand.item.name", read_only=True)
    brand = serializers.CharField(source="brand.name", read_only=True)
    seller = serializers.CharField(source="sales.seller.username", read_only=True)
    date = serializers.DateTimeField(source="sales.date", read_only=True)

    cost_price = serializers.SerializerMethodField()
    selling_price = serializers.SerializerMethodField()
    total_cost = serializers.SerializerMethodField()
    total_sales = serializers.SerializerMethodField()
    profit = serializers.SerializerMethodField()

    class Meta:
        model = SalesDetail
        fields = [
            "id", "item", "brand", "seller", "date",
            "quantity", "cost_price", "selling_price",
            "total_cost", "total_sales", "profit"
        ]

    def get_cost_price(self, obj):
        return obj.brand.cost_price

    def get_selling_price(self, obj):
        return obj.unit_price

    def get_total_cost(self, obj):
        return obj.quantity * obj.brand.cost_price

    def get_total_sales(self, obj):
        return obj.quantity * obj.unit_price

    def get_profit(self, obj):
        return (obj.quantity * obj.unit_price) - (obj.quantity * obj.brand.cost_price)


class ProfitLossSummarySerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_cost = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_profit = serializers.DecimalField(max_digits=12, decimal_places=2)
    highest_selling_item = serializers.CharField()
