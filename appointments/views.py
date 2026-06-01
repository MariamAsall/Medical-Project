from django.shortcuts import render 

from rest_framework.response import Response




# Create your views here.

from appointments.models import Appointments


from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets , generics

from appointments.permissions import (  CanManageAppointments,  IsPatient)
from rest_framework import status, viewsets
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

    # Prevent booking from this ViewSet
    http_method_names = [
        'get',
        'patch',
        'put',
        'delete',
        'head',
        'options'
    ]

    def create(self, request, *args, **kwargs):

        return Response(
            {
                "detail":
                "Use /appointments/book/ to book appointments."
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def get_queryset(self):

        user = self.request.user

        if user.role == "ADMIN":

            return Appointments.objects.all()

        if user.role == "DOCTOR":

            if hasattr(user, 'doctorprofile'):

                return Appointments.objects.filter(
                    doctor=user.doctorprofile
                )

            return Appointments.objects.none()

        if user.role == "PATIENT":

            if hasattr(user, 'patient_profile'):

                return Appointments.objects.filter(
                    patient=user.patient_profile
                )

            return Appointments.objects.none()

        return Appointments.objects.none()

    def get_serializer_class(self):
        return AppointmentSerializer

    def perform_update(self, serializer):

        appointment = self.get_object()

        old_status = appointment.status

        updated_appointment = serializer.save()

        new_status = updated_appointment.status

        # Send email only if status changed
        if old_status != new_status:

            try:

                send_appointment_email(
                    "Appointment Status Updated",
                    (
                        f"Your appointment status has been updated "
                        f"to {new_status}."
                    ),
                    updated_appointment.patient.user.email,
                )

            except Exception as e:
                print("Email Error:", e)


# class AppointmenstViewSet(viewsets.ModelViewSet):

#     permission_classes = [CanManageAppointments]

#     def get_queryset(self):

#         user = self.request.user

#         if user.role == "ADMIN":
#             return Appointments.objects.all()

#         if user.role == "DOCTOR":

#             if hasattr(user, 'doctorprofile'):

#                 return Appointments.objects.filter(   doctor=user.doctorprofile)

#             return Appointments.objects.none()

#         if user.role == "PATIENT":

#             if hasattr(user, 'patient_profile'):

#                 return Appointments.objects.filter( patient=user.patient_profile )

#             return Appointments.objects.none()

#         return Appointments.objects.none()

#     def get_serializer_class(self):

#         if self.action in ['create', 'update','partial_update' ]:
#             return AppointmentCreateSerializer

#         return AppointmentSerializer
    
#     def perform_create(self, serializer):
#         patient_profile= self.request.user.patient_profile
#         appointment=serializer.save(patient=patient_profile)

#         print("Sending email to:", appointment.patient.user.email)

#             # Email to patient
#         send_appointment_email(
#         "Appointment Booked",
#         f"Your appointment has been booked successfully for {appointment.date_time}.",
#         appointment.patient.user.email,
#         )
#         # Email to doctor
#         send_appointment_email(
#             "New Appointment",
#             f"You have a new appointment from {appointment.patient.user.get_full_name()} at {appointment.date_time}.",
#             appointment.doctor.user.email,
#         )
    

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



class BookAppointmentView(generics.CreateAPIView):

    permission_classes = [IsPatient]
    queryset = Appointments.objects.all()
    serializer_class = AppointmentCreateSerializer

    def perform_create(self, serializer):

        serializer.save( patient=self.request.user.patient_profile )