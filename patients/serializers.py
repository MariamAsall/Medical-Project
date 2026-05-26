from rest_framework import serializers
from .models import PatientProfile


class PatientProfileSerializer(serializers.ModelSerializer):
    # Read from User model 
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number')
    date_of_birth = serializers.DateField(source='user.date_of_birth')
    profile_picture = serializers.ImageField(
        source='user.profile_picture', read_only=True
    )

    class Meta:
        model = PatientProfile
        fields = [
            'id',
            'full_name',
            'email',
            'phone_number',       # from User
            'date_of_birth',      # from User
            'profile_picture',    # from User
            'address',            # from PatientProfile
            'emergency_contact',  # from PatientProfile
            'blood_type',         # from PatientProfile
            'created_at',
        ]
        read_only_fields = ['id', 'email', 'full_name', 'profile_picture', 'created_at']

    def get_full_name(self, obj):
        return obj.user.get_full_name()

    def update(self, instance, validated_data):
        # Extract user fields and update them separately
        user_data = validated_data.pop('user', {})
        user = instance.user

        if 'phone_number' in user_data:
            user.phone_number = user_data['phone_number']
        if 'date_of_birth' in user_data:
            user.date_of_birth = user_data['date_of_birth']
        user.save()

        # Update PatientProfile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance