from django.urls import path

from .views import *


urlpatterns = [
    path('suppliers/',SupplierListCreateView.as_view()),
    path('supplier-update/<pk>/',SupplierRetrieveUpdateView.as_view()),
    path('all-users/', AllUsersView.as_view(), name='all-users'),
]