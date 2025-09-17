from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('items.urls')),
    path('accounts/',include('accounts.urls')),
    path('sales/',include('sales.urls')),
    path('reports/',include('reports.urls')),
    path('management/', include('management.urls')),

    # AUTH URLS
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]
