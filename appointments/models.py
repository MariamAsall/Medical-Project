from django.db import models


# Create your models here.
from doctors.models import DoctorProfile


from patients.models import PatientProfile

class Appointments(models.Model):

    STATUS=(  ('pending','Pending'),
        ('confirmed','Confirmed'),
        ('completed','Completed'),
        ('cancelled','Cancelled')
    )

    doctor=models.ForeignKey(DoctorProfile  , on_delete=models.CASCADE, related_name='doctor_appointments' )

    patient=models.ForeignKey( PatientProfile, on_delete=models.CASCADE,  related_name='patient_appointments')

    date_time=models.DateTimeField()
    reason=models.TextField()

    status=models.CharField(
        max_length=20,
        choices=STATUS,
        default='pending'
    )
    notes=models.TextField(  blank=True )
    approved_at = models.DateTimeField(
        null=True,
        blank=True
    )


    created_at=models.DateTimeField( auto_now_add=True  )

    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=[
                    'doctor',
                    'date_time'
                ],
                name='prevent_double_booking'
            )
        ]
