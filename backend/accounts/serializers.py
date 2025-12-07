from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from partnerships.models import Department
from partnerships.serializers import DepartmentSerializer

class UserSerializer(serializers.ModelSerializer):
    """
    User serializer for authenticated user's own profile management.
    Allows write access to non-sensitive fields, but read operations only return ID.
    """
    department = DepartmentSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'department', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        """Override to only return user ID in read operations"""
        return {'id': instance.id}


class FullUserProfileSerializer(serializers.ModelSerializer):
    """
    Full user profile serializer for authenticated users accessing their own profile.
    Returns all user fields (id, email, first_name, last_name, business_name, address)
    for read operations. Does NOT override to_representation, so it returns full data.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        label='Confirm Password'
    )

    class Meta:
        model = User
        fields = ['email', 'password', 'password2', 'first_name', 'last_name']
        extra_kwargs = {
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        # CustomUserManager handles username assignment automatically
        # Explicitly set all users as regular users only (no admin privileges)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_staff=False,
            is_superuser=False,
            is_active=True,
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer to use email instead of username for login"""
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["is_superuser"] = user.is_superuser
        token["is_staff"] = user.is_staff
        token["department"] = user.department if hasattr(user, "department") else None
        
        return token


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change endpoint"""
    current_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        """Validate password change request"""
        # Check if new_password and confirm_password match
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"confirm_password": "New password and confirm password do not match."}
            )
        
        # Get the user from context
        user = self.context.get('user')
        if not user:
            raise serializers.ValidationError("User not found in context.")
        
        # Verify current password
        if not user.check_password(attrs['current_password']):
            raise serializers.ValidationError(
                {"current_password": "Current password is incorrect."}
            )
        
        return attrs

    def save(self, **kwargs):
        """Update user password"""
        user = self.context.get('user')
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

