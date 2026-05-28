from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(r'specialties', SpecialtyViewSet, basename='specialties')
router.register(r'profiles', DoctorProfileViewSet, basename='doctor-profiles')

urlpatterns = [
    path('', include(router.urls)),
]