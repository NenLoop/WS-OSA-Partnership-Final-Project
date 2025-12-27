from django.utils import timezone
from django.db.models import Count
from rest_framework import viewsets, status, generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .models import Department, Partnership, PartnershipRequest, Notification
from .serializers import (
    DepartmentSerializer, UserSerializer, UserProfileSerializer,
    PartnershipSerializer, PartnershipRequestSerializer,
    NotificationSerializer, DashboardStatsSerializer, AssignStaffSerializer
)
from .permissions import (
    IsAdmin, IsAdminOrReadOnly, PartnershipPermission,
    RequestPermission, NotificationPermission
)
from .filters import PartnershipFilter

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data['username'])
            response.data['user'] = UserProfileSerializer(user).data
        return response


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrReadOnly]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    @action(detail=False, methods=['post'])
    def assign_staff(self, request):
        serializer = AssignStaffSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(id=serializer.validated_data['user_id'])
                department_id = serializer.validated_data['department_id']
                role = serializer.validated_data['role']
                
                if department_id:
                    department = Department.objects.get(id=department_id)
                    user.department = department
                else:
                    user.department = None
                
                user.role = role
                user.save()
                
                return Response(UserSerializer(user).data)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            except Department.DoesNotExist:
                return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PartnershipViewSet(viewsets.ModelViewSet):
    queryset = Partnership.objects.all()
    serializer_class = PartnershipSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PartnershipFilter
    permission_classes = [PartnershipPermission]

    def get_queryset(self):
        queryset = Partnership.objects.all()
        status = self.request.query_params.get('status')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if status and (start_date or end_date):
            if start_date:
                queryset = queryset.filter(started_date__gte=start_date)
            if end_date:
                queryset = queryset.filter(started_date__lte=end_date)

        # if department_id:
        #     queryset = queryset.filter(department_id=department_id)
        

        return queryset

    def perform_create(self, serializer):
        partnership = serializer.save()
        Notification.objects.create(
            notification_type='created',
            partnership=partnership,
            user=self.request.user,
            message=f"New partnership '{partnership.business_name}' created"
        )

    def perform_update(self, serializer):
        partnership = serializer.save()
        Notification.objects.create(
            notification_type='updated',
            partnership=partnership,
            user=self.request.user,
            message=f"Partnership '{partnership.business_name}' updated"
        )

    def perform_destroy(self, instance):
        Notification.objects.create(
            notification_type='deleted',
            partnership=None,
            user=self.request.user,
            message=f"Partnership '{instance.business_name}' deleted"
        )
        instance.delete()


class PartnershipRequestViewSet(viewsets.ModelViewSet):
    queryset = PartnershipRequest.objects.all()
    serializer_class = PartnershipRequestSerializer
    permission_classes = [RequestPermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return PartnershipRequest.objects.all()
        return PartnershipRequest.objects.filter(requested_by=user)

    def perform_create(self, serializer):
        request_obj = serializer.save(requested_by=self.request.user)
        Notification.objects.create(
            notification_type='created',
            partnership_request=request_obj,
            user=self.request.user,
            message=f"New {request_obj.request_type} request submitted"
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can approve requests'}, status=status.HTTP_403_FORBIDDEN)
        
        partnership_request = self.get_object()
        if partnership_request.status != 'pending':
            return Response({'error': 'Request already processed'}, status=status.HTTP_400_BAD_REQUEST)
        
        admin_remarks = request.data.get('remarks', '')
        
        if partnership_request.request_type == 'create':
            data = partnership_request.request_data
            Partnership.objects.create(
                department_id=data.get('department'),
                business_name=data.get('business_name', ''),
                description=data.get('description', ''),
                address=data.get('address', ''),
                contact_person=data.get('contact_person', ''),
                email=data.get('email', ''),
                contact_number=data.get('contact_number', ''),
                started_date=data.get('started_date'),
                effectivity_date=data.get('effectivity_date'),
            )
        elif partnership_request.request_type == 'update' and partnership_request.partnership:
            data = partnership_request.request_data
            partnership = partnership_request.partnership
            for key, value in data.items():
                if hasattr(partnership, key) and key != 'id':
                    setattr(partnership, key, value)
            partnership.save()
        elif partnership_request.request_type == 'delete' and partnership_request.partnership:
            partnership_request.partnership.delete()
        
        partnership_request.status = 'approved'
        partnership_request.processed_by = request.user
        partnership_request.admin_remarks = admin_remarks
        partnership_request.processed_at = timezone.now()
        partnership_request.save()
        
        return Response(PartnershipRequestSerializer(partnership_request).data)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can decline requests'}, status=status.HTTP_403_FORBIDDEN)
        
        partnership_request = self.get_object()
        if partnership_request.status != 'pending':
            return Response({'error': 'Request already processed'}, status=status.HTTP_400_BAD_REQUEST)
        
        admin_remarks = request.data.get('remarks', '')
        
        partnership_request.status = 'declined'
        partnership_request.processed_by = request.user
        partnership_request.admin_remarks = admin_remarks
        partnership_request.processed_at = timezone.now()
        partnership_request.save()
        
        return Response(PartnershipRequestSerializer(partnership_request).data)


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [NotificationPermission]

    @action(detail=True, methods=['post'])
    def mark_seen(self, request, pk=None):
        notification = self.get_object()
        notification.status = 'seen'
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['post'])
    def mark_all_seen(self, request):
        Notification.objects.filter(status='unseen').update(status='seen')
        return Response({'status': 'All notifications marked as seen'})


class DashboardStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        partnerships_by_dept = Department.objects.annotate(
            count=Count('partnerships')
        ).values('name', 'acronym', 'count')
        
        stats = {
            'total_users': User.objects.count(),
            'total_departments': Department.objects.count(),
            'total_partnerships': Partnership.objects.count(),
            'pending_requests': PartnershipRequest.objects.filter(status='pending').count(),
            'partnerships_by_department': list(partnerships_by_dept),
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
