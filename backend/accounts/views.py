from django.shortcuts import render
from rest_framework.generics import *
from rest_framework.permissions import *
from rest_framework.response import Response

from .models import *
from .serializers import *


class SupplierListCreateView(ListCreateAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        search = self.request.query_params.get('search')
        queryset = Supplier.objects.all().order_by('name')
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

class SupplierRetrieveUpdateView(RetrieveUpdateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]


class AllUsersView(ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        group = getattr(user.user_group, 'title', '').lower()

        if group in ['admin', 'manager']:
            users = CustomUser.objects.all()
        else:
            users = CustomUser.objects.filter(id=user.id)  # only self

        serializer = UserMiniSerializer(users, many=True)
        return Response(serializer.data)
