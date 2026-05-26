# doctors/serializers.py
from rest_framework import serializers
from .models import *


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Specialty
        fields = '__all__'


class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DoctorProfile
        fields = ['id', 'user', 'specialty', 'bio', 'phone', 
                  'experience_years', 'consultation_fees', 'profile_image',]
        read_only_fields = ['id', 'user']

    def validate_bio(self, value):
        if value and len(value) < 20:
            raise serializers.ValidationError(
                'Bio must be at least 20 characters.'
            )
        return value

    def validate_experience_years(self, value):
        if value < 0:
            raise serializers.ValidationError(
                'Experience years cannot be negative.'
            )
        return value

    def validate_consultation_fees(self, value):
        if value < 0:
            raise serializers.ValidationError(
                'Fee cannot be negative.'
            )
        return value


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model  = DoctorAvailability
        fields = ['id', 'doctor', 'day', 'start_time', 'end_time', 'is_active']
        read_only_fields = ['id', 'doctor']

    def validate(self, data):
        start = data.get('start_time')
        end   = data.get('end_time')

        if start and end and end <= start:
            raise serializers.ValidationError(
                'End time must be after start time.'
            )
        return data