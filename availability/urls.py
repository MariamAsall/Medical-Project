
from django.contrib import admin
from django.urls import include, path

from rest_framework.routers import DefaultRouter


from availability.views import AvailabilityViewSet


router = DefaultRouter()
router.register(r'', AvailabilityViewSet, basename='availability')


urlpatterns = [
    path('', include(router.urls)),
]
