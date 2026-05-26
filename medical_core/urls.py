
from django.contrib import admin
from django.urls import path
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/doctors/', include('doctors.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/availability/', include('availability.urls')),
    #path('api/notifications/', include('notifications.urls')),

]
