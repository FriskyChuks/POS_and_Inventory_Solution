from django.urls import path

from .views import *


urlpatterns = [
    path('items/', ItemListCreateView.as_view()),
    path('item-category/', ItemCategoryView.as_view()),
    path('item-update/<pk>/', ItemRetrieveUpdateView.as_view()),
    path('item-delete/<pk>/', ItemDestroyView.as_view()),
    path('supplies/', SupplyListCreateView.as_view(), name='create-supply'),
    path('brands/', BrandListCreateView.as_view(), name='brand-list-create'),
    path('brand-update/<pk>/', BrandRetrieveUpdateView.as_view(), name='brand_update'),
    path('brands/by-item/<int:item_id>/', get_brands_for_item),
    path('brands/search/', BrandSearchView.as_view(), name='brand-search'),

]