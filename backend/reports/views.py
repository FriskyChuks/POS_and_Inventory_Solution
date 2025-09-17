from datetime import datetime, timedelta
from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models.functions import TruncMonth
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from datetime import date, timedelta
from django.db.models import Count
from rest_framework.generics import ListAPIView
from .utils import get_date_range

from sales.models import *
from .serializers import *
from .utils import *
from items.models import *  # adjust if different app
from accounts.models import Supplier


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_summary(request):
    today = date.today()

    # Optional filters
    selected_date = request.query_params.get('date')
    user_id = request.query_params.get('user_id')
    payment_method = request.query_params.get('payment_method')

    if selected_date:
        try:
            selected_date = parse_date(selected_date)
        except Exception:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
    else:
        selected_date = today

    # Base queryset
    invoices = SalesInvoice.objects.filter(sale_date__date=selected_date)

    if user_id:
        invoices = invoices.filter(created_by_id=user_id)

    if payment_method:
        invoices = invoices.filter(payment_method__iexact=payment_method)

    # --- Aggregate total sales & profit ---
    total_sales = invoices.aggregate(
        total=Sum(F('items__quantity') * F('items__unit_price'))
    )['total'] or 0

    total_profit = invoices.aggregate(
        profit=Sum(
            F('items__quantity') * (
                F('items__unit_price') - F('items__brand__cost_price')
            )
        )
    )['profit'] or 0

    invoice_count = invoices.count()

    # --- Top 5 sold brands by quantity ---
    top_items = (
        SalesDetail.objects.filter(sales__sale_date__date=selected_date)
        .values(brand_name=F('brand__name'))
        .annotate(total_qty=Sum('quantity'))
        .order_by('-total_qty')[:5]
    )

    # --- Low stock brands ---
    low_stock_items = Brand.objects.filter(stock_level__lte=5).values('name', 'stock_level')[:5]

    # --- Soon expiring brands ---
    soon_expiring = Brand.objects.filter(
        item__isnull=False,
        item__date_created__isnull=False,  # (replace with your expiry_date if you add it to Brand)
        # expiry_date__gte=today,
        # expiry_date__lte=today + timedelta(days=30)
    )[:0]  # Placeholder: your Brand model currently has no expiry_date

    # --- Payment Method Summary ---
    payment_summary = (
        invoices.values('payment_method')
        .annotate(count=Count('id'))
    )

    payment_dict = {
        entry['payment_method']: entry['count']
        for entry in payment_summary
    }

    return Response({
        'summary_date': selected_date,
        'filtered_by_user': user_id,
        'filtered_by_payment_method': payment_method,
        'total_sales': total_sales,
        'total_profit': total_profit,
        'invoice_count': invoice_count,
        'top_items': top_items,
        'low_stock': list(low_stock_items),
        'expiring_soon': list(soon_expiring),
        'payment_methods': payment_dict,
    })


@api_view(['GET'])
def monthly_sales_summary(request):
    current_year = date.today().year

    monthly_data = (
        SalesDetail.objects
        .filter(sales__sale_date__year=current_year)
        .annotate(month=TruncMonth('sales__sale_date'))
        .annotate(
            total=ExpressionWrapper(
                F('unit_price') * F('quantity'),
                output_field=DecimalField()
            )
        )
        .values('month')
        .annotate(total_sales=Sum('total'))
        .order_by('month')
    )

    data = [
        {
            'month': item['month'].strftime('%B'),
            'total_sales': float(item['total_sales'] or 0)
        }
        for item in monthly_data
    ]

    return Response(data)



class ProfitLossDetailReportView(ListAPIView):
    serializer_class = ProfitLossDetailSerializer

    def get_queryset(self):
        params = self.request.query_params
        shortcut = params.get("date_shortcut")
        start_date = params.get("start_date")
        end_date = params.get("end_date")
        item = params.get("item")
        brand = params.get("brand")
        seller = params.get("seller")

        start, end = get_date_range(shortcut, start_date, end_date)

        qs = SalesDetail.objects.select_related("brand", "sales", "sales__created_by")

        if start and end:
            qs = qs.filter(sales__sale_date__date__range=[start, end])
        if item:
            qs = qs.filter(brand__item__name__icontains=item)
        if brand:
            qs = qs.filter(brand__name__icontains=brand)
        if seller:
            qs = qs.filter(sales__created_by__username__icontains=seller)

        return qs


class ProfitLossSummaryReportView(ListAPIView):
    serializer_class = ProfitLossSummarySerializer

    def get(self, request, *args, **kwargs):
        params = request.query_params
        shortcut = params.get("date_shortcut")
        start_date = params.get("start_date")
        end_date = params.get("end_date")

        # ✅ Use the same date range logic as details
        start, end = get_date_range(shortcut, start_date, end_date)

        details = SalesDetail.objects.select_related("brand", "brand__item", "sales")

        # ✅ Apply filters
        item = params.get("item")
        brand = params.get("brand")
        seller = params.get("seller")

        if item:
            details = details.filter(brand__item__name__icontains=item)
        if brand:
            details = details.filter(brand__name__icontains=brand)
        if seller:
            details = details.filter(sales__created_by__username__icontains=seller)
        if start and end:
            details = details.filter(sales__sale_date__date__range=[start, end])

        # ✅ Aggregates
        revenue = details.aggregate(
            total_revenue=Sum(F("quantity") * F("unit_price"))
        )["total_revenue"] or 0

        cost = details.aggregate(
            total_cost=Sum(F("quantity") * F("brand__cost_price"))
        )["total_cost"] or 0

        profit = revenue - cost

        # Highest selling item
        highest = details.values("brand__item__name").annotate(
            total_qty=Sum("quantity")
        ).order_by("-total_qty").first()

        highest_item = highest["brand__item__name"] if highest else "N/A"

        summary_data = {
            "total_revenue": revenue,
            "total_cost": cost,
            "total_profit": profit,
            "highest_selling_item": highest_item,
        }

        serializer = self.get_serializer(summary_data)
        return Response(serializer.data)
