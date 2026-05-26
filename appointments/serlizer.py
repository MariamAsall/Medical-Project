

from appointments.models import Appointments
from rest_framework import serializers

from availability.models import DoctorAvailability
from django.utils import timezone



# class AppointmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Appointments
#         fields = "__all__"


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointments
        fields = "__all__"

    def validate(self, data):
        doctor = data.get("doctor")
        date_time = data.get("date_time")

        # Check if the doctor is available at the given date and time
        weekday = date_time.weekday()  # Get the weekday (0-6)
        availability = DoctorAvailability.objects.filter(doctor=doctor, weekday=weekday).first()

        if not availability:
            raise serializers.ValidationError("The doctor is not available on this day.")
        

        return data
    



class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:

            model = Appointments

            fields = "__all__"

            read_only_fields = [
                'created_at'
            ]

    def validate_date_time(self,value):

        if value < timezone.now():

            raise serializers.ValidationError("Cannot book appointment in the past.")

        return value

    def validate(self , data):

        doctor = data.get("doctor")
        date_time = data.get("date_time")

        exists = Appointments.objects.filter( doctor=doctor,date_time=date_time).exists()

        if exists:

            raise serializers.ValidationError(
                "Doctor already has appointment at this time."
            )

        return data