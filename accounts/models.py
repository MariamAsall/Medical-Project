from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        ADMIN   = "ADMIN",   "Admin"
        DOCTOR  = "DOCTOR",  "Doctor"
        PATIENT = "PATIENT", "Patient"

    # ------------------------------------------------------------------ #
    # Core fields
    # ------------------------------------------------------------------ #
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.PATIENT,
    )
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    is_approved = models.BooleanField(
        default=False,
        help_text="Toggled by Admin to approve or block Doctor / Patient accounts.",
    )
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        null=True,
        blank=True,
    )

    # Use email as the login identifier instead of username
    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    # ------------------------------------------------------------------ #
    # Convenience properties — used by permission classes & serializers
    # ------------------------------------------------------------------ #
    @property
    def is_admin_user(self) -> bool:
        return self.role == self.Role.ADMIN

    @property
    def is_doctor_user(self) -> bool:
        return self.role == self.Role.DOCTOR

    @property
    def is_patient_user(self) -> bool:
        return self.role == self.Role.PATIENT

    # ------------------------------------------------------------------ #
    # String representation
    # ------------------------------------------------------------------ #
    def __str__(self) -> str:
        return f"{self.get_full_name()} ({self.role}) — {self.email}"

    class Meta:
        verbose_name      = "User"
        verbose_name_plural = "Users"
        ordering          = ["-date_joined"]