from django.urls import path, include
from .views import AdminAppointmentListView

from rest_framework.routers import DefaultRouter

from appointments.views import AppointmenstViewSet, BookAppointmentView

router = DefaultRouter()

router.register( r"", AppointmenstViewSet,  basename="appointments")

urlpatterns = [

 path("book/", BookAppointmentView.as_view(),  name="book-appointment"),

    path("", include(router.urls)),

    path("admin/appointments/",AdminAppointmentListView.as_view()),
]