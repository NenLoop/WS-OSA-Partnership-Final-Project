from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True) # use email as unique identifier
    department = models.CharField(max_length=50, blank=True, null=True) # relevant for staff only - to know which department they can work on
    
    USERNAME_FIELD = 'email' # make email the login field
    REQUIRED_FIELDS = ['username']

    def __str__(self): 
        return self.email
