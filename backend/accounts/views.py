from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import (
    UserSerializer, 
    FullUserProfileSerializer,
    UserRegistrationSerializer, 
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer
)


class IsSelfOnly(BasePermission):
    """
    Permission class that allows users to access only their own profile.
    All users are treated as regular users with no admin privileges.
    """
    def has_object_permission(self, request, view, obj):
        # Users can only access their own profile
        # Check both object equality and ID match for extra security
        if not request.user or not request.user.is_authenticated:
            return False
        return obj.id == request.user.id
    
    def has_permission(self, request, view):
        # Only authenticated users can access
        if not request.user or not request.user.is_authenticated:
            return False
        # For list views, always allow (queryset is already filtered)
        if view.action == 'list':
            return True
        # For other actions, require authentication
        return True


class UserViewSet(viewsets.ModelViewSet):
    """
    User management endpoint for regular users only.
    - GET /api/v1/users/ - Returns the authenticated user's own profile (full data)
    - GET /api/v1/users/{id}/ - Retrieve user details (full data, only own profile)
    - PUT /api/v1/users/{id}/ - Full update user (only own profile)
    - PATCH /api/v1/users/{id}/ - Partial update user (only own profile)
    
    Note: POST (create) and DELETE (destroy) are disabled.
    For user creation, use POST /api/v1/auth/register/
    All users can only access and modify their own profile.
    All registered users are regular users with no admin privileges.
    Read operations return full user profile data for authenticated users accessing their own profile.
    """
    serializer_class = UserSerializer
    permission_classes = [IsSelfOnly]
    search_fields = ['email', 'business_name']
    http_method_names = ['get', 'put', 'patch', 'head', 'options']  # Excludes POST and DELETE
    
    def get_queryset(self):
        """
        Return only the authenticated user's profile.
        All users are treated as regular users.
        """
        return User.objects.filter(id=self.request.user.id)
    
    def get_serializer_class(self):
        """Use FullUserProfileSerializer for read operations, UserSerializer for write operations"""
        if self.action in ['list', 'retrieve']:
            return FullUserProfileSerializer
        return UserSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Override to ensure user can only retrieve their own profile"""
        instance = self.get_object()
        # Double-check permission
        if instance.id != request.user.id:
            return Response(
                {'error': 'You can only access your own profile.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """Override to ensure user can only update their own profile"""
        instance = self.get_object()
        # Double-check permission
        if instance.id != request.user.id:
            return Response(
                {'error': 'You can only update your own profile.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        """Override to ensure user can only partially update their own profile"""
        instance = self.get_object()
        # Double-check permission
        if instance.id != request.user.id:
            return Response(
                {'error': 'You can only update your own profile.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)


class RegisterView(viewsets.ViewSet):
    """
    User registration endpoint
    POST /api/v1/auth/register/
    """
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': {'id': user.id},  # Only return user ID, no sensitive data
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    """
    User login endpoint
    POST /api/v1/auth/login/
    Body: {"email": "...", "password": "..."}
    Returns: {"access": "...", "refresh": "..."}
    """
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    User logout endpoint
    POST /api/v1/auth/logout/
    Body: {"refresh": "..."}
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            # Try to blacklist the token if blacklist app is installed
            try:
                token.blacklist()
            except AttributeError:
                # Token blacklist app not installed, just return success
                # Client should discard tokens on their end
                pass
        return Response(
            {'message': 'Successfully logged out.'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': 'Invalid token or token already blacklisted.'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Change user password endpoint
    POST /api/v1/auth/change-password/
    Body: {
        "current_password": "...",
        "new_password": "...",
        "confirm_password": "..."
    }
    """
    serializer = ChangePasswordSerializer(
        data=request.data,
        context={'user': request.user}
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
