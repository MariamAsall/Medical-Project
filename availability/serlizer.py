from rest_framework import serializers

from availability.models import DoctorAvailability


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = "__all__"



