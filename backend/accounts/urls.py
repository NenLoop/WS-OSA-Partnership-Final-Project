from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, LoginView, logout_view, change_password_view

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'auth/register', RegisterView, basename='register')
 
urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/change-password/', change_password_view, name='change-password'),
    path('', include(router.urls)),
]
