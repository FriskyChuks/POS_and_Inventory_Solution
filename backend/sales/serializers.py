# serializers.py (relevant parts)
from rest_framework import serializers
import uuid
from .models import SalesInvoice, SalesDetail, Payment
from items.models import Brand

class SalesDetailSerializer(serializers.ModelSerializer):
    # write with brand id, read with brand_info
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all())
    brand_info = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SalesDetail
        fields = ['id', 'brand', 'quantity', 'unit_price', 'discount', 'brand_info']
        extra_kwargs = {'sales': {'required': False}}  # sales set by parent create()

    def get_brand_info(self, obj):
        b = obj.brand
        if not b:
            return {}
        return {
            'id': b.id,
            'brand_name': b.name,
            'item_name': b.item.name if getattr(b, 'item', None) else None,
            'display': f"{b.name} ({b.item.name})" if getattr(b, 'item', None) else b.name,
            'selling_price': str(b.selling_price) if b.selling_price is not None else None,
            'stock_level': b.stock_level
        }


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['method', 'amount']


class SalesInvoiceSerializer(serializers.ModelSerializer):
    items = SalesDetailSerializer(many=True)
    payments = PaymentSerializer(many=True, required=False)  # nested payments
    total = serializers.SerializerMethodField(read_only=True)
    cashier = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SalesInvoice
        fields = '__all__'
        read_only_fields = ['invoice_number', 'sale_date']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        payments_data = validated_data.pop('payments', [])

        # Generate invoice number
        validated_data['invoice_number'] = str(uuid.uuid4()).split('-')[0].upper()
        invoice = SalesInvoice.objects.create(**validated_data)

        # Handle sales details
        for row in items_data:
            brand = row['brand']
            qty = int(row['quantity'])

            if brand.stock_level < qty:
                raise serializers.ValidationError(
                    f"Insufficient stock for brand '{brand.name}'"
                )

            SalesDetail.objects.create(sales=invoice, **row)

        # Handle payments (safe: supports multiple methods)
        for p in payments_data:
            Payment.objects.create(invoice=invoice, **p)

        return invoice

    def to_representation(self, instance):
        """
        Ensure nested payments always come through on reads
        (even if Prefetch is used in the view).
        """
        rep = super().to_representation(instance)
        rep['payments'] = PaymentSerializer(instance.payments.all(), many=True).data
        return rep

    def get_total(self, obj):
        total = 0
        item_discount = 0
        for detail in obj.items.all():
            price = detail.quantity * detail.unit_price
            total += price - detail.discount
            item_discount += detail.discount

        discount_total = item_discount + obj.sales_discount
        total -= obj.sales_discount

        return {
            'total': total,
            'discount_total': discount_total
        }

    def get_cashier(self, obj):
        if obj.created_by:
            return {
                'id': obj.created_by.id,
                'email': obj.created_by.email
            }
        return {}
