from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)
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

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.department_name

class Partnership(models.Model):
    department_id = models.OneToOneField(Department, on_delete=models.RESTRICT, null=True)
    business_name = models.CharField(max_length=150)
    logo = models.ImageField(upload_to='partnership-logo/', null=True, blank=True)
    description = models.TextField()
    address = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100)
    # no need for managers
    email = models.EmailField(max_length=100)
    contact_number = models.CharField(max_length=50)
    started_date = models.DateField() # if renewed edit this field to be the time of updated
    effectivity_date = models.DateField()

    PARTNERSHIP_STATUS = (
        ('a', 'Active'),
        ('r', 'For Renewal'),
        ('t', 'Terminated'),
        ('e', 'Expired'),
    )

    status_tag = models.CharField(
        max_length=1,
        choices=PARTNERSHIP_STATUS,
        blank=True,
        default='a',
        help_text='Partnership Status'
    )

    school_year = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    LOCATION_TYPE_CHOICES = (
        ('local', 'Local'),
        ('international', 'International'),
    )
    location_type = models.CharField(
        max_length=20,
        choices=LOCATION_TYPE_CHOICES,
        default='local',
        help_text='Indicates whether the partnership is local or international'
    )

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.business_name

class PartnershipInstance(models.Model):
    partnership = models.ForeignKey(Partnership, on_delete=models.CASCADE, related_name='instances')
    previous_status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    # ... optional effectivity/started_date if desired
    effectivity_date = models.DateField(null=True, blank=True)  # Optional for history
    def __str__(self):
        if hasattr(self.partnership, 'business_name'):
            return f"{self.partnership.business_name}: {self.previous_status} @ {self.created_at}"
        return str(self.previous_status) 
