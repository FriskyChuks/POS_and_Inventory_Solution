from rest_framework.generics import *
from rest_framework.decorators import api_view
from rest_framework.permissions import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import *
from rest_framework.decorators import permission_classes
from django.utils.dateparse import parse_date
from django_filters.rest_framework import DjangoFilterBackend
from datetime import date, timedelta
from django.db.models import Prefetch

from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa

from .models import *
from .serializers import *
from .filters import SalesInvoiceFilter


class SalesListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SalesInvoice.objects.all().order_by('-sale_date')
    serializer_class = SalesInvoiceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = SalesInvoiceFilter

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SalesDetailListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SalesDetail.objects.all()
    serializer_class = SalesDetailSerializer
    permission_classes = [AllowAny]


class SalesHistoryView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SalesInvoiceSerializer

    def get_queryset(self):
        user = self.request.user
        groups = ['admin', 'manager']

        # Base queryset with related brand, item, and payments
        queryset = (
            SalesInvoice.objects.all()
            .order_by('-id')
            .prefetch_related(
                Prefetch(
                    'items',
                    queryset=SalesDetail.objects.select_related('brand', 'brand__item')
                ),
                Prefetch(
                    'payments',
                    queryset=Payment.objects.all().only('id', 'method', 'amount')
                )
            )
        )

        # Restrict for non-admin/manager users
        if user.user_group.title not in groups:
            queryset = queryset.filter(created_by=user)

        # Filters
        start_date = parse_date(self.request.query_params.get('start_date', ''))
        end_date = parse_date(self.request.query_params.get('end_date', ''))
        customer = self.request.query_params.get('customer')
        user_id = self.request.query_params.get('user_id')

        if start_date and end_date:
            adjusted_end = end_date + timedelta(days=1)
            queryset = queryset.filter(
                sale_date__date__gte=start_date,
                sale_date__date__lt=adjusted_end
            )
        elif not (start_date or end_date or customer or user_id):
            queryset = queryset.filter(sale_date__date=date.today())

        if customer:
            queryset = queryset.filter(customer__icontains=customer)

        if user_id and user.user_group.title in groups:
            queryset = queryset.filter(created_by__id=user_id)

        return queryset


@api_view(['GET'])
def get_sales_details(request, sales_id):
    queryset = SalesDetail.objects.filter(sales_id=sales_id)
    serializer = SalesDetailSerializer(queryset, many=True)
    data = serializer.data
    return Response(data)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_sales(request, id):
    queryset = SalesInvoice.objects.filter(id=id)
    serializer = SalesInvoiceSerializer(queryset, many=True)
    data = serializer.data
    return Response(data)
    

def generate_invoice_pdf(request, invoice_id):
    invoice = (
        SalesInvoice.objects
        .select_related()
        .prefetch_related('items', 'payments')  # payments FK relation
        .get(pk=invoice_id)
    )

    subtotal = sum(
        item.quantity * item.unit_price - item.discount
        for item in invoice.items.all()
    )
    total = subtotal - invoice.sales_discount

    # Decide payment info: use payments if available, else fallback
    payments = invoice.payments.all()
    if not payments.exists():
        payments = [{"method": invoice.payment_method, "amount": total}]

    template_path = 'sales/invoice.html'
    context = {
        'invoice': invoice,
        'items': invoice.items.all(),
        'subtotal': subtotal,
        'sales_discount': invoice.sales_discount,
        'total': total,
        'payments': payments,
    }

    template = get_template(template_path)
    html = template.render(context)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'filename="invoice_{invoice.invoice_number}.pdf"'

    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse('PDF generation failed', status=500)

    return response

