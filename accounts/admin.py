from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Extended Admin panel view for the custom User model.

    Owner : Mariam
    """

    list_display  = (
        "email", "username", "get_full_name",
        "role", "is_approved", "is_active", "date_joined",
    )
    readonly_fields= (
        "date_joined",
        "last_login",
    )
    list_filter   = ("role", "is_approved", "is_active", "is_staff")
    search_fields = ("email", "username", "first_name", "last_name")
    ordering      = ("-date_joined",)

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        (_("Personal Info"), {
            "fields": (
                "first_name", "last_name",
                "phone_number", "date_of_birth",
                "profile_picture",
            )
        }),
        (_("Role & Access"), {
            "fields": ("role", "is_approved", "is_active", "is_staff", "is_superuser"),
        }),
        (_("Permissions"), {"fields": ("groups", "user_permissions")}),
        (_("Important Dates"), {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username", "email",
                "first_name", "last_name",
                "role", "password1", "password2",
                "is_approved", "is_active",
            ),
        }),
    )

    # Allow Admin to toggle approval directly from the list view
    actions = ["approve_users", "block_users"]

    @admin.action(description="Approve selected users")
    def approve_users(self, request, queryset):
        queryset.update(is_approved=True)

    @admin.action(description="Block selected users")
    def block_users(self, request, queryset):
        queryset.update(is_active=False)