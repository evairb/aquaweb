from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from . import models
from . import serializers
from core.permission import IsAdmin


# ==========================================================
# TAXONOMIA — usados pelo frontend para popular selects em cascata
# ==========================================================
class FamiliaViewSet(viewsets.ModelViewSet):
    queryset = models.Familia.objects.all()
    serializer_class = serializers.FamiliaSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["nome_cientifico"]
    permission_classes = [IsAdmin]


class GeneroViewSet(viewsets.ModelViewSet):
    queryset = models.Genero.objects.select_related("familia").all()
    serializer_class = serializers.GeneroSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        "familia",
    ]
    search_fields = ["nome_cientifico"]
    permission_classes = [IsAdmin]


class GrupoComercialViewSet(viewsets.ModelViewSet):
    queryset = models.GrupoComercial.objects.all()
    serializer_class = serializers.GrupoComercialSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["nome"]
    permission_classes = [IsAdmin]


class GeneroFloraViewSet(viewsets.ModelViewSet):
    queryset = models.GeneroFlora.objects.all()
    serializer_class = serializers.GeneroFloraSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["nome"]
    permission_classes = [IsAdmin]


# ==========================================================
# FAUNA / FLORA
# ==========================================================
class FaunaViewSet(viewsets.ModelViewSet):
    queryset = models.Fauna.objects.select_related(
        "genero__familia", "grupo_comercial"
    ).all()
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "tipo",
        "temperamento",
        "dieta",
        "nivel_agua",
        "come_plantas",
        "genero",
        "genero__familia",
        "grupo_comercial",
    ]
    search_fields = [
        "nome_popular",
        "epiteto_especifico",
        "genero__nome_cientifico",
        "genero__familia__nome_cientifico",
    ]
    ordering_fields = ["nome_popular", "criado_em"]

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.FaunaListSerializer
        return serializers.FaunaSerializer


class FloraViewSet(viewsets.ModelViewSet):
    queryset = models.Flora.objects.select_related(
        "genero"
    ).all()
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "necessidade_luz",
        "necessidade_co2",
        "velocidade_crescimento",
        "posicao_plantio",
        "genero"
    ]

    search_fields = [
        "nome_popular",
        "epiteto_especifico",
        "genero__nome",
    ]
    ordering_fields = ["nome_popular", "criado_em"]

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.FloraListSerializer
        return serializers.FloraSerializer


class RegraCompatibilidadeViewSet(viewsets.ModelViewSet):
    queryset = models.RegraCompatibilidade.objects.all()
    serializer_class = serializers.RegraCompatibilidadeSerializer
