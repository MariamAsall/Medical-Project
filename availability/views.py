from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from availability.models import DoctorAvailability
from availability.serlizer import AvailabilitySerializer
from appointments.permissions import CanManageDoctorAvailability


from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

from appointments.models import Appointments
from .serlizer import AvailableSlotSerializer


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



class AvailableSlotsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doctor_id = request.query_params.get("doctor")

        if not doctor_id:
            return Response(
                {"detail": "doctor query parameter is required."},
                status=400,
            )

        doctor_availability = DoctorAvailability.objects.filter(doctor_id=doctor_id,   is_available=True,).order_by("weekday", "start_time")
        slots = []
        

        today = timezone.localdate()

        for availability in doctor_availability:

            # نحسب أقرب تاريخ لهذا اليوم (Monday, Tuesday...)
            days_ahead = availability.weekday - today.weekday()
            if days_ahead < 0:
                days_ahead += 7

            target_date = today + timedelta(days=days_ahead)

            start_dt = timezone.make_aware(
                datetime.combine(target_date, availability.start_time)
            )

            end_dt = timezone.make_aware(
                datetime.combine(target_date, availability.end_time)
            )

            current = start_dt

            while current + timedelta(minutes=30) <= end_dt:

                slots.append({
                    "start": current,
                    "end": current + timedelta(minutes=30),
                })

                current += timedelta(minutes=30)

        booked_slots = set(Appointments.objects.filter(
        doctor_id=doctor_id,
        status__in=["pending", "confirmed"],
        date_time__gte=timezone.now(),
    ).values_list("date_time", flat=True)
)
        available_slots = [
            slot
            for slot in slots
            if slot["start"] not in booked_slots
        ]

        available_slots.sort(key=lambda x: x["start"])

        serializer = AvailableSlotSerializer(available_slots, many=True)
        return Response(serializer.data)


