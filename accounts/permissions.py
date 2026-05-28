from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView



def _is_authenticated_with_role(request: Request, role: str) -> bool:
    """
    Returns True only when the request carries a valid JWT and the
    authenticated user's role matches exactly.
    Also enforces that the account must be approved.
    """
    return (
        request.user
        and request.user.is_authenticated
        and request.user.role == role
        and request.user.is_approved
        and request.user.is_active
    )


class IsAdminUser(BasePermission):
    """
    Grants access exclusively to users with role = 'ADMIN'.
    Usage  : permission_classes = [IsAuthenticated, IsAdminUser]
    Covers : /admin/users/, /admin/appointments/, all admin_panel/ endpoints
    """

    message = "Access denied. Admin privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(request, "ADMIN")


class IsDoctorUser(BasePermission):
    """
    Grants access exclusively to users with role = 'DOCTOR'.
    Usage  : permission_classes = [IsAuthenticated, IsDoctorUser]
    Covers : /doctors/<id>/, /availability/, doctor profile endpoints
    """

    message = "Access denied. Doctor privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(request, "DOCTOR")


class IsPatientUser(BasePermission):

    message = "Access denied. Patient privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(request, "PATIENT")

class IsAdminOrDoctor(BasePermission):
    """
    Grants access to Admin OR Doctor users.
    Useful for endpoints that Admins manage and Doctors view (e.g. appointments list).
    """

    message = "Access denied. Admin or Doctor privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(
            request, "ADMIN"
        ) or _is_authenticated_with_role(request, "DOCTOR")


class IsAdminOrPatient(BasePermission):
    """
    Grants access to Admin OR Patient users.
    Useful for patient-facing endpoints that Admins also need to manage.
    """

    message = "Access denied. Admin or Patient privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(
            request, "ADMIN"
        ) or _is_authenticated_with_role(request, "PATIENT")


class IsDoctorOrPatient(BasePermission):
    """
    Grants access to Doctor OR Patient users (but NOT Admin).
    Useful for appointment-related shared views.
    """

    message = "Access denied. Doctor or Patient privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(
            request, "DOCTOR"
        ) or _is_authenticated_with_role(request, "PATIENT")


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission.
    Allows access if:
      - The requesting user is an Admin, OR
      - The requesting user owns the object (obj.user == request.user
        or obj == request.user for User model itself).
    Usage : Used in retrieve/update/destroy ViewSet actions.
    """

    message = "Access denied. You do not have permission to access this resource."

    def has_object_permission(
        self, request: Request, view: APIView, obj
    ) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.role == "ADMIN":
            return True

        if obj == request.user:
            return True

        owner = getattr(obj, "user", None)
        return owner == request.user