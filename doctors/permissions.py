from rest_framework.permissions import BasePermission

class IsApprovedDoctor(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == 'DOCTOR' and 
            request.user.is_approved 
        )