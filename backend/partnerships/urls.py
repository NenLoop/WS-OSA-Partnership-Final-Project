from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, PartnershipViewSet, PartnershipInstanceViewSet
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

router = DefaultRouter()
router.register(r'department', DepartmentViewSet, basename='department')
router.register(r'partnership', PartnershipViewSet, basename='partnership')
router.register(r'partnership-instance', PartnershipInstanceViewSet, basename='partnership-instance')

urlpatterns = [
    path('', include(router.urls)),
]




