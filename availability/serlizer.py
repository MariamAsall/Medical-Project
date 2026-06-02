from rest_framework import serializers

from availability.models import DoctorAvailability

import datetime
from django.utils import timezone

class AvailabilitySerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(
        source='doctor.user.username',
        read_only=True
    )

    weekday_name = serializers.CharField(
        source='get_weekday_display',
        read_only=True
    )

    is_booked = serializers.SerializerMethodField()
    def get_is_booked(self, obj):                    # ← ADD THIS
        from appointments.models import Appointments
        today = timezone.localdate()
        days_ahead = (obj.weekday - today.weekday()) % 7
        if days_ahead == 0:
            days_ahead = 7  # always next occurrence
        slot_date = today + datetime.timedelta(days=days_ahead)
        return Appointments.objects.filter(
            doctor=obj.doctor,
            date_time__date=slot_date,
            date_time__time=obj.start_time,
            status__in=["pending", "confirmed"]
        ).exists()

    class Meta:
        model = DoctorAvailability

        fields = [
            'id',
            'doctor',
            'doctor_name',
            'weekday',
            'weekday_name',
            'start_time',
            'end_time',
            'is_available',
            'is_booked',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'doctor',
            'created_at',
            'updated_at'
        ]

    def validate(self, data):

        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if start_time >= end_time:
            raise serializers.ValidationError(
                "End time must be after start time."
            )

        return data