from rest_framework import serializers
from . import models


class FiltroSerializer(serializers.ModelSerializer):
    tipo_filtro_display = serializers.CharField(
        source="get_tipo_filtro_display", read_only=True
    )
    categoria_display = serializers.CharField(
        source="get_categoria_display", read_only=True
    )

    class Meta:
        model = models.Filtro
        fields = "__all__"
        read_only_fields = ("criado_em", "atualizado_em")


class AquecedorSerializer(serializers.ModelSerializer):
    categoria_display = serializers.CharField(
        source="get_categoria_display", read_only=True
    )

    class Meta:
        model = models.Aquecedor
        fields = "__all__"
        read_only_fields = ("criado_em", "atualizado_em")


class IluminacaoSerializer(serializers.ModelSerializer):
    categori_display = serializers.CharField(
        source="get_categoria_display", read_only=True
    )

    class Meta:
        model = models.Iluminacao
        fields = "__all__"
        read_only_fields = ("criado_em", "atualizado_em")


class SistemaCO2Serializer(serializers.ModelSerializer):
    tipo_co2_display = serializers.CharField(
        source="get_tipo_co2_display", read_only=True
    )
    categoria_display = serializers.CharField(
        source="get_categoria_display", read_only=True
    )

    class Meta:
        model = models.SistemaCO2
        fields = "__all__"
        read_only_fields = ("criado_em", "atualizado_em")


class SubstratoSerializer(serializers.ModelSerializer):
    tipo_substrato_display = serializers.CharField(
        source="get_tipo_substrato_display", read_only=True
    )
    categoria_display = serializers.CharField(
        source="get_categoria_display", read_only=True
    )

    class Meta:
        model = models.Substrato
        fields = "__all__"
        read_only_fields = ("criado_em", "atualizado_em")


class BombaCirculacaoSerializer(serializers.ModelSerializer):
    categoria_display = serializers.CharField(
        source="get_categoria_display", read_only=True
    )

    class Meta:
        model = models.BombaCirculadora
        fields = "__all__"
        read_only_fields = ("criado_em", "atualizado_em")


class AquarioFaunaSerializer(serializers.ModelSerializer):
    nome_popular = serializers.CharField(source="fauna.nome_popular", read_only=True)
    nome_cientifico = serializers.CharField(
        source="fauna.nome_cientifico", read_only=True
    )

    class Meta:
        model = models.AquarioFauna
        fields = (
            "id",
            "flora",
            "nome_popular",
            "nome_cientifico",
            "quantidade",
            "adicionado_em",
        )


class AquarioFloraSerializer(serializers.ModelSerializer):
    nome_popular = serializers.CharField(source="flora.nome_popular", read_only=True)
    nome_cientifico = serializers.CharField(
        source="flora.nome_cientifico", read_only=True
    )

    class Meta:
        model = models.AquarioFlora
        fields = (
            "id",
            "flora",
            "nome_popular",
            "nome_cientifico",
            "quantidade",
            "adicionado_em",
        )


class AquarioEquipamentoSerializer(serializers.ModelSerializer):
    categoria_display = serializers.CharField(
        source="get_categoria_display", read_only=True
    )
    nome_equipamento = serializers.SerializerMethodField()

    class Meta:
        model = models.AquarioEquipamento
        fields = (
            "id",
            "categoria",
            "categoria_display",
            "equipamento_id",
            "nome_equipamento",
            "ativo",
            "adicionado_em",
        )

    def get_total_fauna(self, obj):
        return obj.itens_fauna.count()

    def get_total_flora(self, obj):
        return obj.itens_flora.count()


class AquarioListSerializer(serializers.ModelSerializer):
    """Versão resumida para listagens."""

    total_fauna = serializers.SerializerMethodField()
    total_flora = serializers.SerializerMethodField()

    class Meta:
        model = models.Aquario
        fields = (
            "id",
            "nome",
            "litros",
            "publico",
            "total_fauna",
            "total_flora",
            "criado_em",
        )

    def get_total_fauna(self, obj):
        return obj.itens_fauna.count()

    def get_total_flora(self, obj):
        return obj.itens_flora.count()


class AquarioSerializer(serializers.ModelSerializer):
    """Versão completa — detalhe do aquário com todos os itens."""

    itens_fauna = AquarioFaunaSerializer(many=True, read_only=True)
    itens_flora = AquarioFloraSerializer(many=True, read_only=True)
    itens_equipamento = AquarioEquipamentoSerializer(many=True, read_only=True)
    usuario_nome = serializers.CharField(source="usuario.username", read_only=True)

    class Meta:
        model = models.Aquario
        fields = (
            "id",
            "usuario",
            "usuario_nome",
            "nome",
            "litros",
            "comprimento_cm",
            "largura_cm",
            "altura_cm",
            "ph_atual",
            "temp_atual",
            "gh_atual",
            "observacoes",
            "publico",
            "itens_fauna",
            "itens_flora",
            "itens_equipamento",
            "criado_em",
            "atualizado_em",
        )
        read_only_fields = ("usuario", "criado_em", "atualizado_em")
