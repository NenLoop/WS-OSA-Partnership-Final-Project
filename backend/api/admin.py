from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Department, Partnership, PartnershipRequest, Notification


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'department', 'is_active']
    list_filter = ['role', 'department', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Role & Department', {'fields': ('role', 'department')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role & Department', {'fields': ('role', 'department')}),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(Partnership)
class PartnershipAdmin(admin.ModelAdmin):
    list_display = ['business_name', 'department', 'contact_person', 'email', 'started_date']
    list_filter = ['department']
    search_fields = ['business_name', 'contact_person']


@admin.register(PartnershipRequest)
class PartnershipRequestAdmin(admin.ModelAdmin):
    list_display = ['request_type', 'requested_by', 'status', 'timestamp']
    list_filter = ['status', 'request_type']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['notification_type', 'user', 'status', 'timestamp']
    list_filter = ['status', 'notification_type']
