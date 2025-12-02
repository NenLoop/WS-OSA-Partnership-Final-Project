from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


class CustomUserManager(UserManager):
    """Custom user manager for email-based authentication"""
    
    def normalize_email(self, email):
        """Normalize email address"""
        if email:
            email = email.strip().lower()
        return email
    
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a regular user with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        # Validate email format
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError('Invalid email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Extended user model for business information"""
    username = None
    email = models.EmailField(unique=True)
    # business_name = models.CharField(max_length=255, blank=True, null=True)
    # link to department
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
