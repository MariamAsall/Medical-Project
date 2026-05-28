from urllib import request

from rest_framework.permissions import BasePermission



class IsAdmin(BasePermission):

    def has_permission(self, request, view):

        return ( request.user.is_authenticated and request.user.role == "ADMIN" )




class IsDoctor(BasePermission):

    def has_permission(self, request, view):

        return (  request.user and request.user.is_authenticated and request.user.role == "DOCTOR")



class IsPatient(BasePermission):

    def has_permission(self, request, view):

        return ( request.user and request.user.is_authenticated and request.user.role == "PATIENT")   




class IsDoctorOrAdmin(BasePermission):

    def has_permission(self, request, view):

        return ( request.user.is_authenticated and request.user.role in ["DOCTOR","ADMIN"])




class IsPatientOrAdmin(BasePermission):

    def has_permission(self, request, view):

        return (request.user.is_authenticated and request.user.role in ["PATIENT", "ADMIN" ])




class CanManageAppointments(BasePermission):
    # ... (keeping your docstring clean and intact)

    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == "ADMIN":
            return True

        if (user.role == "DOCTOR" and obj.doctor.user == user):
            return True

        if (user.role == "PATIENT" and obj.patient.user == user):
            return True

        return False





class ReadOnlyOrAdmin(BasePermission):

    """
    Specialties:
    Everyone reads
    Admin CRUD
    """

    def has_permission(self,request,view):

        if ( request.method in ["GET", "HEAD", "OPTIONS"]):

            return True

        return (   request.user.is_authenticated and  request.user.role  == "ADMIN" )
    




class CanManageDoctorAvailability(BasePermission):
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and request.user.role in ["DOCTOR", "ADMIN"])

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == "ADMIN":
            return True

        if user.role == "DOCTOR":
            # Evaluates: DoctorAvailability.DoctorProfile.user == logged_in_user
            return getattr(obj.doctor, 'user', None) == user

        return False

