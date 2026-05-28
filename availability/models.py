from django.db import models


from doctors.models import DoctorProfile

# Create your models here.

class DoctorAvailability(models.Model):

    DAYS = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )

    doctor = models.ForeignKey(DoctorProfile,on_delete=models.CASCADE,related_name='availability')
    weekday = models.IntegerField(choices=DAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField( auto_now=True)

    class Meta:

        ordering = ['weekday', 'start_time']

        constraints = [
            models.UniqueConstraint(
                fields=['doctor','weekday','start_time','end_time'], name='unique_doctor_schedule' ) ]

    def __str__(self):

        return (f"{self.doctor.user.username} - "f"{self.get_weekday_display()} "f"{self.start_time} to {self.end_time}")