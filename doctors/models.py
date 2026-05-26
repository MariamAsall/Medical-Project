from django.db import models
from django.conf import settings

# Create your models here.
class Specialty(models.Model):
    name = models.CharField(max_length=100)
    discription = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class DoctorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    experience_years = models.PositiveSmallIntegerField(default=0)
    consultation_fees = models.DecimalField(decimal_places=2, max_digits=8, default=0.00)
    profile_image = models.ImageField(upload_to='doctors/', null=True, blank=True)
    specialty = models.ForeignKey(Specialty, on_delete=models.SET_NULL, null=True, related_name='doctors')

    def __str__(self):
        return self.user.username


class DoctorAvailability(models.Model):
    DAYS = [
        ('sat', 'Saturday'),
        ('sun', 'Sunday'),
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
    ]
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='availabilities')
    day = models.CharField(max_length=10, choices=DAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
