from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    UserUpdateSerializer,
    ChangePasswordSerializer,
)

User = get_user_model()


# ------------------------------------------------------------------ #
#  Helper: build token payload
# ------------------------------------------------------------------ #
def _get_tokens_for_user(user: User) -> dict:
    """
    Returns a dict with access + refresh tokens
    and embeds role/id claims for frontend use.
    """
    refresh = RefreshToken.for_user(user)

    # Embed custom claims into the access token
    refresh["role"]       = user.role
    refresh["email"]      = user.email
    refresh["full_name"]  = user.get_full_name()
    refresh["is_approved"] = user.is_approved

    return {
        "refresh": str(refresh),
        "access":  str(refresh.access_token),
    }


# ======================================================================= #
#  REGISTER VIEW
#  POST /register/
# ======================================================================= #
class RegisterView(generics.CreateAPIView):
    """
    Public endpoint — no authentication required.
    Creates a new Doctor or Patient account.
    Account starts as unapproved; Admin must approve before login is allowed.

    Owner : Mariam
    """

    queryset           = User.objects.all()
    serializer_class   = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "message": (
                    "Registration successful. "
                    "Your account is pending admin approval."
                ),
                "user": UserProfileSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ======================================================================= #
#  LOGIN VIEW
#  POST /login/
# ======================================================================= #
class LoginView(APIView):
    """
    Authenticates a user and returns JWT access + refresh tokens.
    The role claim is embedded in the token so the frontend can
    route the user to the correct dashboard immediately.

    Owner : Mariam
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        user   = serializer.validated_data["user"]
        tokens = _get_tokens_for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "tokens":  tokens,
                "user":    UserProfileSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


# ======================================================================= #
#  LOGOUT VIEW
#  POST /logout/
# ======================================================================= #
class LogoutView(APIView):
    """
    Blacklists the provided refresh token, effectively logging out the user.
    Requires the refresh token in the request body: { "refresh": "<token>" }

    Owner : Mariam
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except (TokenError, InvalidToken) as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Logged out successfully."},
            status=status.HTTP_205_RESET_CONTENT,
        )


# ======================================================================= #
#  TOKEN REFRESH VIEW  (wraps SimpleJWT)
#  POST /refresh-token/
# ======================================================================= #
class CustomTokenRefreshView(TokenRefreshView):
    """
    Wraps SimpleJWT's TokenRefreshView for a consistent response format.

    Owner : Mariam
    API   : POST /refresh-token/
    """

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as exc:
            raise InvalidToken(exc.args[0]) from exc

        return Response(
            {
                "message": "Token refreshed successfully.",
                "access":  serializer.validated_data["access"],
            },
            status=status.HTTP_200_OK,
        )


# ======================================================================= #
#  CURRENT USER VIEW
#  GET /me/
# ======================================================================= #
class MeView(generics.RetrieveUpdateAPIView):
    """
    GET  → returns the logged-in user's profile.
    PATCH/PUT → updates allowed profile fields (see UserUpdateSerializer).

    Owner : Mariam
    API   : GET|PATCH /me/
    """

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return UserUpdateSerializer
        return UserProfileSerializer

    def get_object(self) -> User:
        return self.request.user

    def update(self, request: Request, *args, **kwargs) -> Response:
        kwargs["partial"] = True          # always allow partial updates
        return super().update(request, *args, **kwargs)


# ======================================================================= #
#  CHANGE PASSWORD VIEW
#  POST /change-password/
# ======================================================================= #
class ChangePasswordView(APIView):
    """
    Allows an authenticated user to update their password.

    Owner : Mariam
    API   : POST /change-password/
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Password updated successfully."},
            status=status.HTTP_200_OK,
        )