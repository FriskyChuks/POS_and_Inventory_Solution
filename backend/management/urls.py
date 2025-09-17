from django.urls import path

from .views import *

urlpatterns = [
    path('settings/', ManagementSettingView.as_view(), name='management-settings'),  # GET/PUT
    path('brands/<int:brand_id>/price-preview/', BrandPricePreviewView.as_view(), name='brand-price-preview'),
    path('brands/<int:brand_id>/apply-price/', BrandPriceApplyView.as_view(), name='brand-price-apply'),
    path('sync-costs/', SyncAllCostsFromSuppliesView.as_view(), name='sync-costs'),
]