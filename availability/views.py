# from rest_framework import viewsets
# from rest_framework.permissions import IsAuthenticated

# from availability.models import DoctorAvailability
# from availability.serlizer import AvailabilitySerializer
# from appointments.permissions import CanManageDoctorAvailability


# class AvailabilityViewSet(viewsets.ModelViewSet):

#     serializer_class = AvailabilitySerializer

#     def get_permissions(self):
#         # Patients (and anyone authenticated) may read availability slots.
#         # Only doctors/admins may create, update, or delete.
#         if self.request.method in ("GET", "HEAD", "OPTIONS"):
#             return [IsAuthenticated()]
#         return [CanManageDoctorAvailability()]

#     def get_queryset(self):
#         user = self.request.user
#         doctor_id = self.request.query_params.get("doctor")

#         # Patients: return slots for the requested doctor (for booking flow)
#         if user.role == "PATIENT":
#             if doctor_id:
#                 return DoctorAvailability.objects.filter(doctor__id=doctor_id)
#             return DoctorAvailability.objects.none()

#         if user.role == "ADMIN":
#             if doctor_id:
#                 return DoctorAvailability.objects.filter(doctor__id=doctor_id)
#             return DoctorAvailability.objects.all()

#         if user.role == "DOCTOR":
#             if hasattr(user, 'doctorprofile'):
#                 return DoctorAvailability.objects.filter(doctor=user.doctorprofile)

#         return DoctorAvailability.objects.none()

#     def perform_create(self, serializer):
#         user = self.request.user
#         if user.role == "DOCTOR":
#             serializer.save(doctor=user.doctorprofile)
#         else:
#             serializer.save()

from datetime import datetime, timedelta
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import make_aware
from availability.models import DoctorAvailability
from appointments.models import Appointments


class AvailableSlotsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id, selected_date):
        """
        GET /api/availability/slots/<doctor_id>/2025-06-10/
        Returns all slots for that doctor on that date, marked available or booked.
        """
        try:
            date_obj = datetime.strptime(selected_date, "%Y-%m-%d").date()
        except ValueError:
            return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        weekday = date_obj.weekday()

        availability = DoctorAvailability.objects.filter(
            doctor_id=doctor_id,
            weekday=weekday,
            is_available=True
        ).first()

        if not availability:
            return JsonResponse({'slots': [], 'message': 'Doctor not available on this day.'})

        # Generate all slot start times
        slots = []
        base    = datetime(2000, 1, 1)
        current = datetime.combine(base, availability.start_time)
        end     = datetime.combine(base, availability.end_time)
        delta   = timedelta(minutes=availability.slot_duration)

        while current + delta <= end:
            slots.append(current.time())
            current += delta

        # Get already-booked datetimes for this doctor on this date
        booked_times = set(
            Appointments.objects.filter(
                doctor_id=doctor_id,
                date_time__date=date_obj,
                status__in=['pending', 'confirmed']
            ).values_list('date_time', flat=True)
        )
        # Extract just the time portion for easy comparison
        booked_times = {make_aware(datetime.combine(date_obj, t.time())).time()
                        if hasattr(t, 'time') else t
                        for t in booked_times}

        result = [
            {
                'datetime':  f"{selected_date} {slot.strftime('%H:%M')}",
                'label':     slot.strftime('%I:%M %p'),   # "02:00 PM"
                'available': slot not in booked_times
            }
            for slot in slots
        ]

        return JsonResponse({
            'doctor_id': doctor_id,
            'date':      selected_date,
            'slots':     result
        })