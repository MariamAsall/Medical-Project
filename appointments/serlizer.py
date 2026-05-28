from django.utils import timezone

from rest_framework import serializers

from appointments.models import Appointments

from availability.models import DoctorAvailability


class AppointmentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointments
        fields = "__all__"
        read_only_fields = ["patient"]

    def validate_date_time(self, value):

        if value < timezone.now():

            raise serializers.ValidationError("Cannot book appointment in the past." )

        return value

    def validate(self, data):

        doctor = data.get("doctor")

        date_time = data.get("date_time")

        weekday = date_time.weekday()

        availability = (
            DoctorAvailability.objects.filter(doctor=doctor, weekday=weekday,is_available=True).first())

        if not availability:

            raise serializers.ValidationError("The doctor is not available on this day.")

        exists = Appointments.objects.filter(doctor=doctor,date_time=date_time).exists()

        if exists:

            raise serializers.ValidationError("Doctor already has appointment at this time.")

        return data


class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointments
        fields = "__all__"
        read_only_fields = ['created_at']