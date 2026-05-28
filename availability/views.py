from rest_framework import viewsets

from availability.models import DoctorAvailability

from availability.serlizer import AvailabilitySerializer

from appointments.permissions import (
    CanManageDoctorAvailability
)


class AvailabilityViewSet(viewsets.ModelViewSet):

    permission_classes = [ CanManageDoctorAvailability]

    serializer_class = AvailabilitySerializer

    def get_queryset(self):

        user = self.request.user

        if user.role == "ADMIN":

            return DoctorAvailability.objects.all()

        if user.role == "DOCTOR":

            if hasattr(user, 'doctorprofile'):

                return DoctorAvailability.objects.filter(doctor=user.doctorprofile )

        return DoctorAvailability.objects.none()

    def perform_create(self, serializer):

        user = self.request.user

        if user.role == "DOCTOR":

            serializer.save(doctor=user.doctorprofile)
        else:

            serializer.save()