from django.shortcuts import render 

from rest_framework.response import Response




# Create your views here.

from appointments.models import Appointments
from appointments.permissions import CanManageAppointments
from appointments.serlizer import AppointmentSerializer, AppointmentCreateSerializer

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets


from appointments.models import Appointments
from appointments.serlizer import AppointmentSerializer, AppointmentCreateSerializer


class AppointmenstViewSet(viewsets.ModelViewSet):
    permission_classes = [CanManageAppointments]


    queryset = Appointments.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AppointmentCreateSerializer
        return AppointmentSerializer
    




