from rest_framework import serializers
from .models import Notification
from partnerships.models import Department, Partnership

class DepartmentDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class PartnershipDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Partnership
        fields = ['id', 'business_name']

class NotificationSerializer(serializers.ModelSerializer):
    sender_id = DepartmentDisplaySerializer(read_only=True)
    partnership_id = PartnershipDisplaySerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'sender_id',
            'partnership_id',
            'message',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

