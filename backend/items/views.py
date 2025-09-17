from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import *
from rest_framework import filters
from rest_framework.permissions import *
from django.db.models import Q

from .models import *
from .serializers import *


class ItemCategoryView(ListCreateAPIView):
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer
    permission_classes = [IsAuthenticated]


class ItemListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer

    def get_queryset(self):
        query = self.request.query_params.get('search', '')  # DRF uses `search=...`
        if query:
            return Item.objects.filter(
                Q(barcode__iexact=query) |
                Q(name__icontains=query) |
                Q(brand__name__icontains=query) |
                Q(category__name__icontains=query)
            )
        return Item.objects.all().order_by('name')


class ItemRetrieveUpdateView(RetrieveUpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

class ItemDestroyView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class SupplyListCreateView(ListCreateAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsAuthenticated]

    # def perform_create(self, serializer):
    #     serializer.save(created_by=self.request.user)


class BrandListCreateView(ListCreateAPIView):
    queryset = Brand.objects.all().order_by('name')
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Brand.objects.all()
        search = self.request.query_params.get('search')
        item_id = self.request.query_params.get('item')

        if item_id:
            queryset = queryset.filter(item_id=item_id)

        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

class BrandRetrieveUpdateView(RetrieveUpdateAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]


# views.py
@api_view(['GET'])
def get_brands_for_item(request, item_id):
    brands = Brand.objects.filter(item_id=item_id)
    serializer = BrandSerializer(brands, many=True)
    return Response(serializer.data)


class BrandSearchView(ListAPIView):
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('search', '')

        qs = Brand.objects.select_related('item')

        if query:
            qs = qs.filter(
                Q(name__icontains=query) |
                Q(barcode__iexact=query) |
                Q(item__name__icontains=query) |
                Q(item__category__name__icontains=query)
            )

        return qs.order_by('name')


