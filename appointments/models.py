from django.db import models

from accounts.models import User

# Create your models here.





class Appointments(models.Model):

    STATUS=(  ('pending','Pending'),
        ('confirmed','Confirmed'),
        ('completed','Completed'),
        ('cancelled','Cancelled')
    )

    doctor=models.ForeignKey(  User, on_delete=models.CASCADE, related_name='doctor_appointments' )

    patient=models.ForeignKey(   User, on_delete=models.CASCADE,  related_name='patient_appointments')

    date_time=models.DateTimeField()
    reason=models.TextField()

    status=models.CharField( max_length=20, choices=STATUS,default='pending' )
    notes=models.TextField(  blank=True )

    created_at=models.DateTimeField( auto_now_add=True  )

    class Meta:
        constraints=[ models.UniqueConstraint(fields=[  'doctor', 'date_time' ], name='prevent_double_booking'  )]

    def __str__(self):
        return f"Appointment: {self.patient.username} with {self.doctor.username} on {self.date_time.strftime('%Y-%m-%d %H:%M')} - Status: {self.status}"

