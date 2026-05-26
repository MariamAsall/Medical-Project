
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
     path('availability/', include('availability.urls')),
    path("appointments/", include("appointments.urls")),
]
