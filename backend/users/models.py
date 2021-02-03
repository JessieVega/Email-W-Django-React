from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator


class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, dob, phone, password, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        if not first_name:
            raise ValueError(_('First name must be set'))
        if not last_name:
            raise ValueError(_('Last name must be set'))
        if not dob:
            raise ValueError(_('DOB must be set'))
        if not phone:
            raise ValueError(_('Phone must be set'))

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            dob=dob,
            phone=phone,
            **extra_fields
        )

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, first_name, last_name, dob, phone, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, first_name, last_name, dob, phone, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None

    email = models.EmailField(_('email address'), unique=True)

    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    phone = models.CharField(max_length=10, validators=[
                             MinLengthValidator(10)])
    dob = models.DateField()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone', 'dob']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
