from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, PartnershipViewSet, PartnershipInstanceViewSet

router = DefaultRouter()
router.register(r'department', DepartmentViewSet, basename='department')
router.register(r'partnership', PartnershipViewSet, basename='partnership')
router.register(r'partnership-instance', PartnershipInstanceViewSet, basename='partnership-instance')

urlpatterns = router.urls
