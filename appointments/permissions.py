from rest_framework.permissions import BasePermission



class IsAdmin(BasePermission):

    def has_permission(self, request, view):

        return ( request.user.is_authenticated and request.user.role == "admin" )


class IsDoctor(BasePermission):

    def has_permission(self, request, view):

        return ( request.user.is_authenticated and  request.user.role == "doctor")


class IsPatient(BasePermission):

    def has_permission(self, request, view):

        return (request.user.is_authenticated and request.user.role == "patient")



class IsDoctorOrAdmin(BasePermission):

    def has_permission(self, request, view):

        return ( request.user.is_authenticated and request.user.role in ["doctor","admin"])


class IsPatientOrAdmin(BasePermission):

    def has_permission(self, request, view):

        return (request.user.is_authenticated and request.user.role in ["patient", "admin" ])


class CanManageAppointments(BasePermission):

    """
    Admin:
        Full access

    Doctor:
        View assigned appointments
        Update status
        Add notes

    Patient:
        Create appointment
        Cancel appointment
        Reschedule appointment
        View own appointments
    """

    def has_permission(self,request, view ):

        return (request.user and  request.user.is_authenticated)

    def has_object_permission(  self, request,view,obj):

        user = request.user

        if user.role == "admin":
            return True

        if (   user.role == "doctor" and  obj.doctor == user ):

            return True

        if ( user.role == "patient" and obj.patient == user):

            return True

        return False


class CanManageDoctorAvailability(BasePermission):
    """
    Doctor:
        CRUD own schedule
    Admin:
        Full control
    """
    def has_permission( self,request,view):

        return ( request.user.is_authenticated and request.user.role in [  "doctor", "admin"] )

    def has_object_permission(self,request,view,obj):

        user = request.user

        if user.role == "admin":
            return True

        return (obj.doctor == user)




class ReadOnlyOrAdmin(BasePermission):

    """
    Specialties:
    Everyone reads
    Admin CRUD
    """

    def has_permission(self,request,view):

        if ( request.method in ["GET", "HEAD", "OPTIONS"]):

            return True

        return (   request.user.is_authenticated and  request.user.role  == "admin" )