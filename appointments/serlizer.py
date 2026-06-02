# from django.utils import timezone
# from rest_framework import serializers
# from appointments.models import Appointments
# from availability.models import DoctorAvailability
# from django.utils.timezone import localtime

# class AppointmentCreateSerializer(serializers.ModelSerializer):

#     class Meta:

#         model = Appointments

#         fields = "__all__"

#         read_only_fields = [
#             "patient",
#             "created_at"
#         ]

#     def validate_date_time(self, value):

#         if value < timezone.now():

#             raise serializers.ValidationError(
#                 "Cannot book appointment in the past."
#             )

#         return value

#     def validate_status(self, value):

#         request = self.context.get("request")

#         user = request.user

#         # Patient restrictions
#         if user.role == "PATIENT":

#             forbidden_status = [
#                 "confirmed",
#                 "completed"
#             ]

#             if value in forbidden_status:

#                 raise serializers.ValidationError(
#                     "Patients cannot set this status."
#                 )

#         return value

#     def validate(self, data):

#         doctor = data.get("doctor")

#         date_time = data.get("date_time")

#         if not doctor or not date_time:
#             return data

#         request = self.context.get("request")

#         patient_profile = getattr(request.user, 'patient_profile', None)
#         if not patient_profile:
#             raise serializers.ValidationError(
#                 "Patient profile not found. Please complete your profile first."
#             )

#         local_dt = localtime(date_time)
#         weekday = local_dt.weekday()        
#         appointment_time = local_dt.time()  

#         availability = DoctorAvailability.objects.filter(
#             doctor=doctor,
#             weekday=weekday,
#             start_time__lte=appointment_time,
#             end_time__gte=appointment_time,
#             #is_available=True,
#         ).first()

#         # availability = (
#         #     DoctorAvailability.objects.filter(
#         #         doctor=doctor,
#         #         weekday=weekday,
#         #         is_available=True
#         #     ).first()
#         # )

#         if not availability:

#             raise serializers.ValidationError(
#                 "The doctor is not available on this day."
#             )

#         # Prevent doctor double booking
#         doctor_exists = Appointments.objects.filter(
#             doctor=doctor,
#             date_time=date_time
#         ).exists()

#         if doctor_exists:

#             raise serializers.ValidationError(
#                 "Doctor already has appointment at this time."
#             )

#         # Prevent patient booking same time
#         patient_exists = Appointments.objects.filter( patient=patient_profile, date_time=date_time).exists()

#         if patient_exists:

#             raise serializers.ValidationError(  "You already have another appointment at this time."  )
        
#         same_day_exists = Appointments.objects.filter( patient=patient_profile,doctor=doctor,date_time__date=date_time.date()).exists()

#         if same_day_exists:

#                 raise serializers.ValidationError(  "You already have an appointment with this doctor on this day.")

#         return data



# class AppointmentSerializer(serializers.ModelSerializer):

#     doctor_name = serializers.CharField(
#         source="doctor.user.username",
#         read_only=True
#     )

#     patient_name = serializers.CharField(
#         source="patient.user.username",
#         read_only=True
#     )

#     class Meta:
#         model = Appointments
#         fields = "__all__"
#         read_only_fields = ['created_at']


from django.utils import timezone
from django.utils.timezone import localtime
from rest_framework import serializers
from datetime import datetime, timedelta
from appointments.models import Appointments
from availability.models import DoctorAvailability


def get_valid_slot_times(availability):
    """Generate all valid slot start times from a DoctorAvailability record."""
    slots = []
    base = datetime(2000, 1, 1)
    current = datetime.combine(base, availability.start_time)
    end     = datetime.combine(base, availability.end_time)
    delta   = timedelta(minutes=availability.slot_duration)

    while current + delta <= end:
        slots.append(current.time())
        current += delta

    return slots


class AppointmentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Appointments
        fields = "__all__"
        read_only_fields = ["patient", "created_at"]

    def validate_date_time(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Cannot book an appointment in the past.")
        return value

    def validate_status(self, value):
        request = self.context.get("request")
        user = request.user
        if user.role == "PATIENT" and value in ["confirmed", "completed"]:
            raise serializers.ValidationError("Patients cannot set this status.")
        return value

    def validate(self, data):
        doctor    = data.get("doctor")
        date_time = data.get("date_time")

        if not doctor or not date_time:
            return data

        request = self.context.get("request")
        patient_profile = getattr(request.user, 'patient_profile', None)
        if not patient_profile:
            raise serializers.ValidationError(
                "Patient profile not found. Please complete your profile first."
            )

        local_dt         = localtime(date_time)
        weekday          = local_dt.weekday()
        appointment_time = local_dt.time()

        # 1. Check doctor has availability on this weekday
        availability = DoctorAvailability.objects.filter(
            doctor=doctor,
            weekday=weekday,
            is_available=True,
            start_time__lte=appointment_time,
            end_time__gt=appointment_time,   # __gt not __gte so 21:00 itself is not bookable
        ).first()

        if not availability:
            raise serializers.ValidationError(
                "The doctor is not available on this day or at this time."
            )

        # 2. ✅ NEW: Check the time lands exactly on a slot boundary
        valid_slots = get_valid_slot_times(availability)
        if appointment_time not in valid_slots:
            formatted = [t.strftime('%I:%M %p') for t in valid_slots]
            raise serializers.ValidationError(
                f"Invalid time. Please pick one of the available slots: {', '.join(formatted)}"
            )

        # 3. Prevent doctor double booking
        if Appointments.objects.filter(doctor=doctor, date_time=date_time).exists():
            raise serializers.ValidationError(
                "This slot is already booked. Please choose another time."
            )

        # 4. Prevent patient booking same time with anyone
        if Appointments.objects.filter(patient=patient_profile, date_time=date_time).exists():
            raise serializers.ValidationError(
                "You already have another appointment at this time."
            )

        # 5. Prevent patient booking same doctor same day twice
        if Appointments.objects.filter(
            patient=patient_profile,
            doctor=doctor,
            date_time__date=date_time.date()
        ).exists():
            raise serializers.ValidationError(
                "You already have an appointment with this doctor on this day."
            )

        return data


class AppointmentSerializer(serializers.ModelSerializer):

    doctor_name  = serializers.CharField(source="doctor.user.username",  read_only=True)
    patient_name = serializers.CharField(source="patient.user.username", read_only=True)

    class Meta:
        model  = Appointments
        fields = "__all__"
        read_only_fields = ['created_at']