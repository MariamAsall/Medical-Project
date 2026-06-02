from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import PatientProfile
from .serializers import PatientProfileSerializer
from .permissions import IsPatient
from .permissions import IsPatient, IsAdmin

# ── Profile ────────────────────────────────────────────────────────────────

class PatientProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/patients/profile/   → view my profile
    PUT  /api/patients/profile/   → edit my profile
    PATCH /api/patients/profile/  → partial edit
    """
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated, IsPatient]

    def get_object(self):
        return self.request.user.patient_profile


class PatientListView(generics.ListAPIView):
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAdmin]

    queryset = PatientProfile.objects.all()

# ── Appointments ───────────────────────────────────────────────────────────

class PatientAppointmentListView(APIView):
    """
    GET /api/patients/appointments/
    Returns all appointments for the logged-in patient.
    Supports ?status=pending|confirmed|completed|cancelled
    """
    permission_classes = [IsAuthenticated, IsPatient,IsAdmin]

    def get(self, request):
        try:
            from appointments.models import Appointment
        except ImportError:
            return Response(
                {"detail": "Appointments module not ready yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

        # If admin → return all, if patient → return only theirs
        if request.user.is_staff:
            appointments = Appointment.objects.all().select_related(
                'doctor__user', 'doctor__specialty'
            ).order_by('-date', '-time')
        else:
            appointments = Appointment.objects.filter(
                patient=request.user.patient_profile
            ).select_related(
                'doctor__user', 'doctor__specialty'
            ).order_by('-date', '-time')

        # Optional filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            appointments = appointments.filter(status=status_filter.upper())

        data = [
            {
                'id': appt.id,
                'doctor_name': appt.doctor.user.get_full_name(),
                'specialty': appt.doctor.specialty.name if appt.doctor.specialty else None,
                'date': str(appt.date),
                'time': str(appt.time),
                'status': appt.status,
                'notes': appt.notes or '',
            }
            for appt in appointments
        ]
        return Response(data)


class CancelAppointmentView(APIView):
    """
    DELETE /api/patients/appointments/<id>/cancel/
    Patient can only cancel their own PENDING appointments.
    """
    permission_classes = [IsAuthenticated, IsPatient,IsAdmin]

    def delete(self, request, pk):
        try:
            from appointments.models import Appointment
        except ImportError:
            return Response(
                {"detail": "Appointments module not ready yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        appointment = get_object_or_404(
            Appointment,
            pk=pk,
            patient=request.user.patient_profile
        )

        if appointment.status not in ['PENDING', 'CONFIRMED']:
            return Response(
                {"error": "Only pending or confirmed appointments can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = 'CANCELLED'
        appointment.save()
        return Response({"detail": "Appointment cancelled successfully."})


class RescheduleAppointmentView(APIView):
    """
    PATCH /api/patients/appointments/<id>/reschedule/
    Atomically cancels old slot and books a new one.
    Requires: { "new_date": "YYYY-MM-DD", "new_time": "HH:MM" }
    """
    permission_classes = [IsAuthenticated, IsPatient,IsAdmin]

    def patch(self, request, pk):
        try:
            from appointments.models import Appointment
        except ImportError:
            return Response(
                {"detail": "Appointments module not ready yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        new_date = request.data.get('new_date')
        new_time = request.data.get('new_time')

        if not new_date or not new_time:
            return Response(
                {"error": "Both new_date and new_time are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment = get_object_or_404(
            Appointment,
            pk=pk,
            patient=request.user.patient_profile,
        )

        if appointment.status not in ['PENDING', 'CONFIRMED']:
            return Response(
                {"error": "Only pending or confirmed appointments can be rescheduled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check the new slot isn't already taken by this doctor
        conflict = Appointment.objects.filter(
            doctor=appointment.doctor,
            date=new_date,
            time=new_time,
        ).exclude(pk=pk).exclude(status='CANCELLED').exists()

        if conflict:
            return Response(
                {"error": "This time slot is already booked."},
                status=status.HTTP_409_CONFLICT
            )

        with transaction.atomic():
            appointment.date = new_date
            appointment.time = new_time
            appointment.status = 'PENDING'
            appointment.save()

        return Response({"detail": "Appointment rescheduled successfully."})