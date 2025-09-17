# sales/filters.py
import django_filters
from .models import SalesInvoice

class SalesInvoiceFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="sale_date", lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name="sale_date", lookup_expr='lte')
    user = django_filters.CharFilter(field_name="user__username", lookup_expr='icontains')
    customer = django_filters.CharFilter(field_name="customer", lookup_expr='icontains')

    class Meta:
        model = SalesInvoice
        fields = ['start_date', 'end_date', 'user', 'customer']
