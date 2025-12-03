from django.contrib import admin
from .models import Department, Partnership, PartnershipInstance

admin.site.register(Department)
admin.site.register(Partnership)
admin.site.register(PartnershipInstance)
