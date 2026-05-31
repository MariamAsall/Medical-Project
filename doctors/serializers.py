# doctors/serializers.py
from rest_framework import serializers
from .models import *


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Specialty
        fields = '__all__'

    def validate_name(self, value):
        if Specialty.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError(
                "This specialty already exists."
            )
        return value


class DoctorProfileSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField()
    class Meta:
        model  = DoctorProfile
        fields = ['id', 'user','user_data', 'specialty', 'bio', 'phone', 
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
    
    
    def get_user_data(self, obj):
        return {
            "id": obj.user.id,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "email": obj.user.email,
        }

