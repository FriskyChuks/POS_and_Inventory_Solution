from django.urls import path

from .views import *


urlpatterns = [
    path('dashboard/daily-summary/', daily_summary, name='daily_summary'),
    path('dashboard/monthly-summary/', monthly_sales_summary),
    path("profit-loss/detail/", ProfitLossDetailReportView.as_view(), name="profit-loss-detail"),
    path("profit-loss/summary/", ProfitLossSummaryReportView.as_view(), name="profit-loss-summary"),
]