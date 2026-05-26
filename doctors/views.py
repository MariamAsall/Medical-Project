# doctors/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DoctorProfile, DoctorAvailability, Specialty
from .serializers import DoctorProfileSerializer, DoctorAvailabilitySerializer, SpecialtySerializer
from .permissions import IsApprovedDoctor

class SpecialtyViewSet(viewsets.ModelViewSet):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only admin can write
            from rest_framework.permissions import IsAdminUser
            return [IsAdminUser()]

        # Everyone logged in can read
        return [IsAuthenticated()]


class DoctorProfileViewSet(viewsets.ModelViewSet):
    serializer_class   = DoctorProfileSerializer
    #permission_classes = [IsApprovedDoctor]

    def get_queryset(self):
        return DoctorProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[IsAuthenticated],
        url_path='all'
    )
    def all_doctors(self, request):
        queryset = DoctorProfile.objects.filter(
            user__is_approved=True
        ).select_related('user', 'specialty')

        specialty = request.query_params.get('specialty')
        if specialty:
            queryset = queryset.filter(
                specialty__name__icontains=specialty
            )

        name = request.query_params.get('name')
        if name:
            queryset = queryset.filter(
                user__first_name__icontains=name
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DoctorAvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class   = DoctorAvailabilitySerializer
    permission_classes = [IsApprovedDoctor]

    def get_queryset(self):
        return DoctorAvailability.objects.filter(doctor=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context