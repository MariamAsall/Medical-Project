from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from availability.models import DoctorAvailability
from availability.serlizer import AvailabilitySerializer
from appointments.permissions import CanManageDoctorAvailability


class AvailabilityViewSet(viewsets.ModelViewSet):

    serializer_class = AvailabilitySerializer

    def get_permissions(self):
        # Patients (and anyone authenticated) may read availability slots.
        # Only doctors/admins may create, update, or delete.
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [IsAuthenticated()]
        return [CanManageDoctorAvailability()]

    def get_queryset(self):
        user = self.request.user
        doctor_id = self.request.query_params.get("doctor")

        # Patients: return slots for the requested doctor (for booking flow)
        if user.role == "PATIENT":
            if doctor_id:
                return DoctorAvailability.objects.filter(doctor__id=doctor_id)
            return DoctorAvailability.objects.none()

        if user.role == "ADMIN":
            if doctor_id:
                return DoctorAvailability.objects.filter(doctor__id=doctor_id)
            return DoctorAvailability.objects.all()

        if user.role == "DOCTOR":
            if hasattr(user, 'doctorprofile'):
                return DoctorAvailability.objects.filter(doctor=user.doctorprofile)

        return DoctorAvailability.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == "DOCTOR":
            serializer.save(doctor=user.doctorprofile)
        else:
            serializer.save()