from rest_framework import serializers
from .models import Partnership, PartnershipInstance, Department
from django.contrib.auth import get_user_model

class DepartmentSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False, allow_null=True, use_url=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'logo', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.is_staff:
            raise serializers.ValidationError("Only staff users can create departments.")
        if hasattr(user, 'department') and user.department is not None:
            raise serializers.ValidationError("You already have a department.")
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        department = Department.objects.create(**validated_data)
        user.department = department
        user.save()
        return department

class PartnershipInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnershipInstance
        fields = [
            'id',
            'previous_status',
            'effectivity_date',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
        ]

class PartnershipSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False, allow_null=True, use_url=True)
    instances = PartnershipInstanceSerializer(many=True, read_only=True)

    class Meta:
        model = Partnership
        fields = [
            'id',
            'department_id',
            'business_name',
            'logo',
            'description',
            'address',
            'contact_person',
            'email',
            'contact_number',
            'started_date',
            'effectivity_date',
            'location_type',
            'status_tag',
            'school_year',
            'created_at',
            'updated_at',
            'instances',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'instances',
        ]
    
    def update(self, instance, validated_data):
        # Save previous status if status_tag changes
        new_status_tag = validated_data.get('status_tag', instance.status_tag)
        if instance.status_tag != new_status_tag:
            PartnershipInstance.objects.create(
                partnership=instance,
                previous_status=instance.status_tag,
                effectivity_date=instance.effectivity_date if instance.status_tag != 't' else None
            )
            instance.status_tag = new_status_tag
            # Handle effectivity_date logic for terminated
            if new_status_tag == 't':
                instance.effectivity_date = None
            else:
                effectivity_date = validated_data.get('effectivity_date', instance.effectivity_date)
                instance.effectivity_date = effectivity_date
        # Save other fields
        for attr, value in validated_data.items():
            if attr not in ['status_tag', 'effectivity_date']:
                setattr(instance, attr, value)
        instance.save()
        return instance
