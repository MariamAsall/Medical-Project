from django.shortcuts import render 

from rest_framework.response import Response




# Create your views here.

from appointments.models import Appointments
from appointments.permissions import CanManageAppointments
from appointments.serlizer import AppointmentSerializer, AppointmentCreateSerializer

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from appointments.models import Appointments
from appointments.serlizer import AppointmentSerializer, AppointmentCreateSerializer

# Notifications 
from django.core.mail import send_mail
from django.conf import settings
from .utils import send_appointment_email


class AppointmenstViewSet(viewsets.ModelViewSet):
    permission_classes = [CanManageAppointments]


    queryset = Appointments.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AppointmentCreateSerializer
        return AppointmentSerializer
    
    def perform_create(self, serializer):
        patient_profile= self.request.user.patient_profile
        appointment=serializer.save(patient=patient_profile)

        send_appointment_email(
        "Appointment Booked",
        f"Your appointment has been booked successfully for {appointment.date_time}.",
        appointment.patient.user.email,
        )
    

class AdminAppointmentListView(APIView):
    permission_classes=[IsAdminUser]
    
    def get(self,request):
        appointments= Appointments.objects.all().order_by("-created_at")
        serializer= AppointmentSerializer(appointments,many=True)

        return Response({
            "count": appointments.count(),
            "appointements":serializer.data
        }
        )


