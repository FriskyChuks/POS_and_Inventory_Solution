from rest_framework import serializers

from .models import *


class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = '__all__'

    def get_item_category(self,obj):
        return obj.name

class ItemSerializer(serializers.ModelSerializer):
    item_category = serializers.CharField(source='category.name', read_only=True)
    # brands = serializers.SerializerMethodField(read_only=True)
    # stock_level = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'item_category', 'date_created', 'stock_level', 'created_by']
        ordering = ['name']


class BrandSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)

    class Meta:
        model = Brand
        fields = [
            'id', 'name', 'item', 'item_name','stock_level', 'barcode', 'cost_price', 
            'selling_price','created_at', 'created_by'
        ]

    def validate_barcode(self, value):
        return value or None

class SupplySerializer(serializers.ModelSerializer):
    brand_name = serializers.SerializerMethodField(read_only=True)
    supplier_name = serializers.SerializerMethodField(read_only=True)
    item_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Supply
        fields = '__all__'

    def get_brand_name(self,obj):
        return obj.brand.name

    def get_supplier_name(self,obj):
        return obj.supplier.name
    
    def get_item_name(self,obj):
        return obj.brand.item.name
    
