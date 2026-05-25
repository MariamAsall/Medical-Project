from django.contrib import admin
from .models import PatientProfile


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ['get_name', 'get_email', 'get_phone', 'blood_type', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']

    def get_name(self, obj):
        return obj.user.get_full_name()
    get_name.short_description = 'Name'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

    def get_phone(self, obj):
        return obj.user.phone_number
    get_phone.short_description = 'Phone'