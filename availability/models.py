from django.db import models


from accounts.models import User

# Create your models here.


class DoctorAvailability(models.Model):

    DAYS=((0,'Monday'),
          (1,'Tuesday'), 
          (2,'Wednesday'),
          (3,'Thursday'),
          (4,'Friday'),
          (5,'Saturday'),
            (6,'Sunday'),  )
    
    doctor=models.ForeignKey(User, on_delete=models.CASCADE,related_name='availability'  )

    weekday=models.IntegerField( choices=DAYS)

    start_time=models.TimeField()

    end_time=models.TimeField()
    

    is_available=models.BooleanField( default=True)


    def __str__(self):
        return f"{self.doctor.username} - {self.get_weekday_display()} {self.start_time} to {self.end_time}"    
