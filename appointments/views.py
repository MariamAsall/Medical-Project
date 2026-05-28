from django.shortcuts import render 

from rest_framework.response import Response




# Create your views here.

from appointments.models import Appointments


from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets , generics

from appointments.permissions import (  CanManageAppointments,  IsPatient)

from appointments.models import Appointments
from appointments.serlizer import AppointmentSerializer, AppointmentCreateSerializer



class AppointmenstViewSet(viewsets.ModelViewSet):

    permission_classes = [CanManageAppointments]

    def get_queryset(self):

        user = self.request.user

        if user.role == "ADMIN":
            return Appointments.objects.all()

        if user.role == "DOCTOR":

            if hasattr(user, 'doctorprofile'):

                return Appointments.objects.filter(   doctor=user.doctorprofile)

            return Appointments.objects.none()

        if user.role == "PATIENT":

            if hasattr(user, 'patient_profile'):

                return Appointments.objects.filter( patient=user.patient_profile )

            return Appointments.objects.none()

        return Appointments.objects.none()

    def get_serializer_class(self):

        if self.action in ['create', 'update','partial_update' ]:
            return AppointmentCreateSerializer

        return AppointmentSerializer

    def perform_create(self, serializer):

        serializer.save(patient=self.request.user.patient_profile)




class BookAppointmentView(generics.CreateAPIView):

    permission_classes = [IsPatient]
    queryset = Appointments.objects.all()
    serializer_class = AppointmentCreateSerializer

    def perform_create(self, serializer):

        serializer.save( patient=self.request.user.patient_profile )