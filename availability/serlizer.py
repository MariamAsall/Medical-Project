from rest_framework import serializers

from availability.models import DoctorAvailability

class AvailabilitySerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(
        source='doctor.user.username',
        read_only=True
    )

    weekday_name = serializers.CharField(
        source='get_weekday_display',
        read_only=True
    )

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