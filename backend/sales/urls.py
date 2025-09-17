from django.urls import path

from .views import *

urlpatterns = [
    path('', SalesListCreateView.as_view()),
    path('get_sales/<int:id>/',get_sales, name='get_sales'),
    path('sales-detail/', SalesDetailListCreateView.as_view()),
    path('invoice/pdf/<int:invoice_id>/', generate_invoice_pdf, name='invoice_pdf'),
    path('get_sales_details/<int:sales_id>/', get_sales_details, name='get_sales_detail'),
    path('sales-history/', SalesHistoryView.as_view(), name='sales-history'),
]