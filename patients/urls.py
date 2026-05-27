from django.urls import path
from . import views

urlpatterns = [
    path('profile/',                              views.PatientProfileView.as_view()),
    path('appointments/',                         views.PatientAppointmentListView.as_view()),
    path('appointments/<int:pk>/cancel/',         views.CancelAppointmentView.as_view()),
    path('appointments/<int:pk>/reschedule/',     views.RescheduleAppointmentView.as_view()),
]