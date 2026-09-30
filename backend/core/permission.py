from rest_framework.permissions import BasePermission


class IsAdminOrLoja(BasePermission):
    """Permite acesso apenas se tipo_conta for 'admin' ou 'loja'."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if not hasattr(request.user, "perfil"):
            return False

        return request.user.perfil.tipo_conta in ["admin", "loja"]


class IsAdmin(BasePermission):
    """Permite acesso apenas se tipo_conta for 'admin'."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if not hasattr(request.user, "perfil"):
            return False

        return request.user.perfil.tipo_conta == "admin"
