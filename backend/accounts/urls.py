from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CustomUserView, CreateUserView

urlpatterns = [
    path("users/", CustomUserView.as_view()),
    path("user/register", CreateUserView.as_view()),
    path("user/token", TokenObtainPairView.as_view()),
    path("user/token/refresh", TokenRefreshView.as_view()),
    path("user/auth", include("rest_framework.urls")),

]