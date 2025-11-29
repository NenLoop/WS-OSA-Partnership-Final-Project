from django.contrib.auth.models import User, Permission # Group - like departmental staff - or manager
from .models import CustomUser
from rest_framework import serializers

class CustomUserSerializer(serializers.ModelSerializer):
    user_permissions = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Permission.objects.all(), required=False
    )

    # still partial - this can change maybe we dont need user_permissions just isStaff is enough

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "password",
            "is_staff",
            "user_permissions"
        ]
        read_only_fields = ["id", "username"]
        extra_kwargs = {"password": {"write_only": True}}