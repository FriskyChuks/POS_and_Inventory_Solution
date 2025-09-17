from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class CustomAccountManager(BaseUserManager):

    def create_superuser(self, firstname, lastname, email, phone, password, **otherfields):
        otherfields.setdefault('is_staff', True)
        otherfields.setdefault('is_superuser', True)
        otherfields.setdefault('is_active', True)

        if otherfields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff = True')
        if otherfields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff = True')

        return self.create_user(firstname, lastname, email, phone, password, **otherfields)

    def create_user(self, firstname, lastname, email, phone, password, **otherfields):
        if not email:
            raise ValueError(_('You must provide an email address'))
        email = self.normalize_email(email)
        user = self.model(firstname=firstname, lastname=lastname, email=email,
                          phone=phone, **otherfields)
        user.set_password(password)
        user.save()
        return user


class UserGroup(models.Model):
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title


class CustomUser(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(_('email address'), unique=True)
    firstname = models.CharField(max_length=150)
    lastname = models.CharField(max_length=150)
    phone = models.CharField(max_length=150, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_customer = models.BooleanField(default=True)
    user_group = models.ForeignKey(
        UserGroup, default=1, on_delete=models.CASCADE)

    objects = CustomAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['firstname', 'lastname', 'phone']

    def __str__(self):
        return self.email


class Supplier(models.Model):
    name = models.CharField(max_length=100, unique=True)
    phone1 = models.CharField(max_length=50)
    phone2 = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField()
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.name