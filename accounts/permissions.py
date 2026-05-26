from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


# ======================================================================= #
#  BASE HELPER
# ======================================================================= #
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


# ======================================================================= #
#  ADMIN PERMISSION
# ======================================================================= #
class IsAdminUser(BasePermission):
    """
    Grants access exclusively to users with role = 'ADMIN'.

    Owner  : Mariam
    Usage  : permission_classes = [IsAuthenticated, IsAdminUser]
    Covers : /admin/users/, /admin/appointments/, all admin_panel/ endpoints
    """

    message = "Access denied. Admin privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(request, "ADMIN")


# ======================================================================= #
#  DOCTOR PERMISSION
# ======================================================================= #
class IsDoctorUser(BasePermission):
    """
    Grants access exclusively to users with role = 'DOCTOR'.

    Owner  : Mariam
    Usage  : permission_classes = [IsAuthenticated, IsDoctorUser]
    Covers : /doctors/<id>/, /availability/, doctor profile endpoints
    """

    message = "Access denied. Doctor privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(request, "DOCTOR")


# ======================================================================= #
#  PATIENT PERMISSION
# ======================================================================= #
class IsPatientUser(BasePermission):
    """
    Grants access exclusively to users with role = 'PATIENT'.

    Owner  : Mariam
    Usage  : permission_classes = [IsAuthenticated, IsPatientUser]
    Covers : /patients/, /patient/profile/, /patient/appointments/
    """

    message = "Access denied. Patient privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(request, "PATIENT")


# ======================================================================= #
#  COMPOSITE PERMISSIONS  (convenience classes for shared endpoints)
# ======================================================================= #
class IsAdminOrDoctor(BasePermission):
    """
    Grants access to Admin OR Doctor users.
    Useful for endpoints that Admins manage and Doctors view (e.g. appointments list).

    Owner : Mariam
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

    Owner : Mariam
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

    Owner : Mariam
    """

    message = "Access denied. Doctor or Patient privileges are required."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return _is_authenticated_with_role(
            request, "DOCTOR"
        ) or _is_authenticated_with_role(request, "PATIENT")


# ======================================================================= #
#  OBJECT-LEVEL PERMISSION — Own Resource Only
# ======================================================================= #
class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission.
    Allows access if:
      - The requesting user is an Admin, OR
      - The requesting user owns the object (obj.user == request.user
        or obj == request.user for User model itself).

    Owner : Mariam
    Usage : Used in retrieve/update/destroy ViewSet actions.
    """

    message = "Access denied. You do not have permission to access this resource."

    def has_object_permission(
        self, request: Request, view: APIView, obj
    ) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False

        # Admin always has access
        if request.user.role == "ADMIN":
            return True

        # Direct user object
        if obj == request.user:
            return True

        # Related user field (e.g. DoctorProfile.user, PatientProfile.user)
        owner = getattr(obj, "user", None)
        return owner == request.user