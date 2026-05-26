from django.urls import path, include

from rest_framework.routers import DefaultRouter

from appointments.views import AppointmenstViewSet

router = DefaultRouter()

router.register(r"", AppointmenstViewSet, basename="appointments")

urlpatterns = [
    
    path("", include(router.urls)),
]