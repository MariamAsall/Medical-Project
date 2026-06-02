from django.urls import path, include
from rest_framework.routers import DefaultRouter
from availability.views import AvailabilityViewSet, AvailableSlotsView

router = DefaultRouter()
router.register(r'', AvailabilityViewSet, basename='availability')

urlpatterns = [
    path('', include(router.urls)),
    path('slots/<int:doctor_id>/<str:selected_date>/', AvailableSlotsView.as_view(), name='available-slots'),
]