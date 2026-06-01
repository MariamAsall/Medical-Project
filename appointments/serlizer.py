from django.utils import timezone

from rest_framework import serializers

from appointments.models import Appointments

from availability.models import DoctorAvailability


class AppointmentCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Appointments

        fields = "__all__"

        read_only_fields = [
            "patient",
            "created_at"
        ]

    def validate_date_time(self, value):

        if value < timezone.now():

            raise serializers.ValidationError(
                "Cannot book appointment in the past."
            )

        return value

    def validate_status(self, value):

        request = self.context.get("request")

        user = request.user

        # Patient restrictions
        if user.role == "PATIENT":

            forbidden_status = [
                "confirmed",
                "completed"
            ]

            if value in forbidden_status:

                raise serializers.ValidationError(
                    "Patients cannot set this status."
                )

        return value

    def validate(self, data):

        doctor = data.get("doctor")

        date_time = data.get("date_time")

        if not doctor or not date_time:
            return data

        request = self.context.get("request")

        patient_profile = request.user.patient_profile

        weekday = date_time.weekday()

        availability = (
            DoctorAvailability.objects.filter(
                doctor=doctor,
                weekday=weekday,
                is_available=True
            ).first()
        )

        if not availability:

            raise serializers.ValidationError(
                "The doctor is not available on this day."
            )

        # Prevent doctor double booking
        doctor_exists = Appointments.objects.filter(
            doctor=doctor,
            date_time=date_time
        ).exists()

        if doctor_exists:

            raise serializers.ValidationError(
                "Doctor already has appointment at this time."
            )

        # Prevent patient booking same time
        patient_exists = Appointments.objects.filter( patient=patient_profile, date_time=date_time).exists()

        if patient_exists:

            raise serializers.ValidationError(  "You already have another appointment at this time."  )
        
        same_day_exists = Appointments.objects.filter( patient=patient_profile,doctor=doctor,date_time__date=date_time.date()).exists()

        if same_day_exists:

                raise serializers.ValidationError(  "You already have an appointment with this doctor on this day.")

        return data



class AppointmentSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(
        source="doctor.user.username",
        read_only=True
    )

    patient_name = serializers.CharField(
        source="patient.user.username",
        read_only=True
    )

    class Meta:
        model = Appointments
        fields = "__all__"
        read_only_fields = ['created_at']