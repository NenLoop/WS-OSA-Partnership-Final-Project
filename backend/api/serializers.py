from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Department, Partnership, PartnershipRequest, Notification

User = get_user_model()


class DepartmentSerializer(serializers.ModelSerializer):
    partnership_count = serializers.SerializerMethodField()
    staff_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'acronym', 'name', 'description', 'partnership_count', 'staff_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_partnership_count(self, obj):
        return obj.partnerships.count()

    def get_staff_count(self, obj):
        return obj.staff_members.count()


class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'department_name', 'password', 'date_joined']
        read_only_fields = ['date_joined']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserProfileSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'department_name']


class PartnershipSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Partnership
        fields = [
            'id', 'department', 'department_name', 'business_name', 'logo',
            'status', 'partnership_type',
            'description', 'address', 'contact_person', 'email', 'contact_number',
            'started_date', 'effectivity_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PartnershipRequestSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.CharField(source='requested_by.username', read_only=True)
    processed_by_name = serializers.CharField(source='processed_by.username', read_only=True)
    partnership_name = serializers.CharField(source='partnership.business_name', read_only=True)
    department_name = serializers.SerializerMethodField()

    class Meta:
        model = PartnershipRequest
        fields = [
            'id', 'partnership', 'partnership_name', 'request_type', 'requested_by',
            'requested_by_name', 'processed_by', 'processed_by_name', 'status',
            'message', 'admin_remarks', 'request_data', 'timestamp', 'processed_at',
            'department_name'
        ]
        read_only_fields = ['requested_by', 'processed_by', 'status', 'admin_remarks', 'timestamp', 'processed_at']

    def get_department_name(self, obj):
        if obj.partnership:
            return obj.partnership.department.name
        if obj.request_data and 'department' in obj.request_data:
            try:
                dept = Department.objects.get(id=obj.request_data['department'])
                return dept.name
            except Department.DoesNotExist:
                pass
        return None


class NotificationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    partnership_name = serializers.CharField(source='partnership.business_name', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'partnership', 'partnership_name',
            'partnership_request', 'user', 'user_name', 'status', 'message', 'timestamp'
        ]
        read_only_fields = ['notification_type', 'partnership', 'partnership_request', 'user', 'timestamp']


class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_departments = serializers.IntegerField()
    total_partnerships = serializers.IntegerField()
    pending_requests = serializers.IntegerField()
    partnerships_by_department = serializers.ListField()


class AssignStaffSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    department_id = serializers.IntegerField(allow_null=True)
    role = serializers.ChoiceField(choices=['viewer', 'staff', 'admin'])
