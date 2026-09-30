from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from . import serializers


# Create your views here.
class RegistroView(generics.CreateAPIView):
    """Endpoint público — qualquer visitante pode criar conta."""

    queryset = User.objects.all()
    serializer_class = serializers.RegistroSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "usuario": serializers.UsuarioSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """Endpoint público — autentica e retorna tokens JWT."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "usuario": serializers.UsuarioSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class MeView(generics.RetrieveUpdateAPIView):
    """Perfil do usuário logado — exige autenticação."""

    serializer_class = serializers.UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user


class PerfilUsuarioView(generics.RetrieveUpdateAPIView):
    """Atualização do perfil estendido (avatar, bio, etc.) — exige autenticação."""

    serializer_class = serializers.PerfilUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.perfil
