from django.contrib.auth.models import AbstractUser
from django.db import models


class Department(models.Model):
    # acronym?
    acronym = models.CharField(max_length=10, blank=True, null=True)
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='department-logo/', null=True, blank=True)

    DEPT_STATUS = (
        ('a', 'Active'),
        ('i', 'Inactive'),
    )

    status = models.CharField(
        max_length=1,
        choices=DEPT_STATUS,
        blank=True,
        default='a',
        help_text='Department Status'
    )

    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class User(AbstractUser):
    ROLE_CHOICES = [
        ('viewer', 'Viewer'),
        ('staff', 'Department Staff'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    department = models.ForeignKey(
        Department, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='staff_members'
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_staff_member(self):
        return self.role == 'staff'

    @property
    def is_viewer(self):
        return self.role == 'viewer'


class Partnership(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('renewal', 'For Renewal'),
        ('terminated', 'Terminated'),
        ('expired', 'Approved'),
        
    ]
    PARTNERSHIP_TYPE_CHOICES = [
        ('local', 'Local'),
        ('international', 'International'),
    ]

    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE, 
        related_name='partnerships'
    )
    business_name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='partnership_logos/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    partnership_type = models.CharField(max_length=20, choices=PARTNERSHIP_TYPE_CHOICES, default='local')
    description = models.TextField(blank=True)
    address = models.TextField(blank=True)
    contact_person = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    contact_number = models.CharField(max_length=50, blank=True)
    # school_year = models.CharField(max_length=50)
    started_date = models.DateField(null=True, blank=True)
    effectivity_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.business_name} - {self.department.name}"

    class Meta:
        ordering = ['-created_at']


class PartnershipRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    ]
    REQUEST_TYPE_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
    ]
    
    partnership = models.ForeignKey(
        Partnership, 
        on_delete=models.CASCADE, 
        related_name='requests',
        null=True,
        blank=True
    )
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES, default='create')
    requested_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='partnership_requests'
    )
    processed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_requests'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    admin_remarks = models.TextField(blank=True)
    request_data = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.request_type} request by {self.requested_by.username} - {self.status}"

    class Meta:
        ordering = ['-timestamp']


class Notification(models.Model):
    TYPE_CHOICES = [
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('deleted', 'Deleted'),
    ]
    STATUS_CHOICES = [
        ('seen', 'Seen'),
        ('unseen', 'Unseen'),
    ]
    
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    partnership = models.ForeignKey(
        Partnership, 
        on_delete=models.CASCADE, 
        related_name='notifications',
        null=True,
        blank=True
    )
    partnership_request = models.ForeignKey(
        PartnershipRequest,
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='triggered_notifications'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unseen')
    message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.notification_type} notification - {self.status}"

    class Meta:
        ordering = ['-timestamp']
