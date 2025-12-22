from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView, UserProfileView, DepartmentViewSet,
    UserViewSet, PartnershipViewSet, PartnershipRequestViewSet,
    NotificationViewSet, DashboardStatsView, RegisterView
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'users', UserViewSet)
router.register(r'partnerships', PartnershipViewSet)
router.register(r'requests', PartnershipRequestViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/me/', UserProfileView.as_view(), name='user_profile'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
