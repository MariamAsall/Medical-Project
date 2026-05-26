from django.shortcuts import render

from availability.serlizer import AvailabilitySerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets

from availability.models import DoctorAvailability

from appointments.permissions import CanManageDoctorAvailability


# Create your views here.


class availabilityViewSet(viewsets.ModelViewSet):

    permission_classes = [CanManageDoctorAvailability]
    
    queryset = DoctorAvailability.objects.all()
    def get_serializer_class(self):

        return AvailabilitySerializer




