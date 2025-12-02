from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Department, Partnership, PartnershipInstance
from .serializers import DepartmentSerializer, PartnershipSerializer, PartnershipInstanceSerializer

# Create your views here.

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class PartnershipViewSet(viewsets.ModelViewSet):
    queryset = Partnership.objects.all()
    serializer_class = PartnershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location_type']
    search_fields = ['business_name']
    ordering_fields = ['business_name','created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow staff to filter by status_tag, restrict normal users
        user = self.request.user
        status_tag = self.request.query_params.get('status_tag')
        if status_tag is not None and user.is_staff:
            queryset = queryset.filter(status_tag=status_tag)
        return queryset

class PartnershipInstanceViewSet(viewsets.ModelViewSet):
    queryset = PartnershipInstance.objects.all()
    serializer_class = PartnershipInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]
