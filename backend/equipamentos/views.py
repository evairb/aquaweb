from . import models
from . import serializers
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, filters, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from compatibilidade.service import verificar_grupo


class FiltroViewSet(viewsets.ModelViewSet):
    queryset = models.Filtro.objects.all()
    serializer_class = serializers.FiltroSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["tipo_filtro", "marca"]
    search_fields = ["nome", "marca", "modelo"]
    ordering_fields = ["nome", "vazao_lh", "criado_em"]


class AquecedorViewSet(viewsets.ModelViewSet):
    queryset = models.Aquecedor.objects.all()
    serializer_class = serializers.AquecedorSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["marca", "termostato_integrado"]
    search_fields = ["nome", "marca", "modelo"]
    ordering_fields = ["nome", "potencia_watts", "criado_em"]


class IluminacaoViewSet(viewsets.ModelViewSet):
    queryset = models.Iluminacao.objects.all()
    serializer_class = serializers.IluminacaoSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["marca"]
    search_fields = ["nome", "marca", "modelo"]
    ordering_fields = ["nome", "par_a_30cm", "criado_em"]


class SistemaCO2ViewSet(viewsets.ModelViewSet):
    queryset = models.SistemaCO2.objects.all()
    serializer_class = serializers.SistemaCO2Serializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["tipo_co2", "possui_difusor"]
    search_fields = ["nome", "marca", "modelo"]
    ordering_fields = ["nome", "criado_em"]


class SubstratoViewSet(viewsets.ModelViewSet):
    queryset = models.Substrato.objects.all()
    serializer_class = serializers.SubstratoSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["tipo_substrato", "altera_ph", "altera_gh"]
    search_filds = ["nome", "marca", "modelo"]
    ordering_fields = ["nome", "criado_em"]


class BombaCirculadoraViewSet(viewsets.ModelViewSet):
    queryset = models.BombaCirculadora.objects.all()
    serializer_class = serializers.BombaCirculadoraSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["marca", "ajustavel"]
    search_fields = ["nome", "marca", "modelo"]
    ordering_fields = ["nome", "vazao_lh", "criado_em"]


class DonoOuPublico(permissions.BasePermission):
    """Só o dono pode editar. Leitura livre se o aquário for público."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.publico or obj.usuario == request.user
        return obj.usuario == request.user


class AquarioViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.AquarioSerializer
    permission_classes = [permissions.IsAuthenticated, DonoOuPublico]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return models.Aquario.objects.filter(
                Q(usuario=user) | Q(publico=True)
            ).distinct()
        return models.Aquario.objects.filter(publico=True)

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.AquarioListSerializer
        return serializers.AquarioSerializer

    def perform_create(self, serializer):
        serializers.save(usuario=self.request.user)

    @action(detail=True, methods=["post"], url_path="adicionar-fauna")
    def adicionar_fauna(self, request, pkk=None):
        aquario = self.get_object()
        serializer = serializers.AquarioFaunaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(aquario=aquario)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], url_path="verificar-compatibilidade")
    def verificar_compatibilidade(self, request, pk=None):
        """
        Roda o motor de compatibilidade sobre TODOS os organismos já
        cadastrados neste aquário (sem precisar informar a lista manualmente).
        """
        aquario = self.get_object()
        itens = [
            {"tipo": "fauna", "id": af.fauna_id} for af in aquario.itens_fauna.all()
        ] + [{"tipo": "flora", "id": af.flora_id} for af in aquario.itens_flora.all()]

        if len(itens) < 2:
            return Response(
                {
                    "status_geral": "compativel",
                    "total_pares_avaliados": 0,
                    "pares": [],
                    "aviso": "Adicione ao menos 2 organismos para avaliar compatibilidade.",  # noqa
                }
            )
        resultados = verificar_grupo(itens)
        ordem = {"compativel": 0, "ressalvas": 1, "incompativel": 2}
        pior_geral = "compativel"
        payload = []
        for r in resultados:
            payload.append(
                {
                    "organismo_a": {
                        "id": r.organismo_a.id,
                        "nome_popular": r.organismo_a.nome_popular,
                    },
                    "organismo_b": {
                        "id": r.organismo_b.id,
                        "nome_popular": r.organismo_b.nome_popular,
                    },
                    "status": r.status.value,
                    "motivos": r.motivos,
                    "origem": r.origem,
                }
            )
            if ordem[r.status.value] > ordem[pior_geral]:
                pior_geral = r.status.value

        return Response(
            {
                "status_geral": pior_geral,
                "total_pares_avaliados": len(payload),
                "pares": payload,
            }
        )
