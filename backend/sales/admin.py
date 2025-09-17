from django.contrib import admin

from .models import *

admin.site.register(SalesInvoice)
admin.site.register(SalesDetail)
admin.site.register(Payment)
