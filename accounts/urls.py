from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    CustomTokenRefreshView,
    MeView,
    ChangePasswordView,
)

app_name = "accounts"

urlpatterns = [
    # ------------------------------------------------------------------ #
    # Auth endpoints  (all match the spec exactly)
    # ------------------------------------------------------------------ #
    path("register/",         RegisterView.as_view(),            name="register"),
    path("login/",            LoginView.as_view(),               name="login"),
    path("logout/",           LogoutView.as_view(),              name="logout"),
    path("refresh-token/",    CustomTokenRefreshView.as_view(),  name="token-refresh"),

    # ------------------------------------------------------------------ #
    # Profile endpoints
    # ------------------------------------------------------------------ #
    path("me/",               MeView.as_view(),                  name="me"),
    path("change-password/",  ChangePasswordView.as_view(),      name="change-password"),
]