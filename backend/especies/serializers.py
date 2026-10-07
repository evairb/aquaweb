from rest_framework import serializers
from . import models


# ==========================================================
# TAXONOMIA
# ==========================================================

class FamiliaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Familia
        fields = ('id', 'nome_cientifico', 'descricao')


class GeneroSerializer(serializers.ModelSerializer):
    familia_nome = serializers.CharField(
        source='familia.nome_cientifico', read_only=True
    )

    class Meta:
        model = models.Genero
        fields = (
            'id', 'familia', 'familia_nome', 'nome_cientifico'
        )


class GrupoComercialSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GrupoComercial
        fields = ('id', 'nome', 'descricao')


# ==========================================================
# FAUNA
# ==========================================================

class FaunaSerializer(serializers.ModelSerializer):
    nome_cientifico = serializers.ReadOnlyField()
    familia_nome = serializers.CharField(
        source='genero.familia.nome_cientifico', read_only=True
    )
    genero_nome = serializers.CharField(
        source='grupo_comercial.nome', read_only=True,
        default=None
    )
    tipo_display = serializers.CharField(
        source='get_tipo_display', read_only=True
    )
    temperamento_display = serializers.CharField(
        source='get_temperamento_display', read_only=True
    )

    class Meta:
        model = models.Fauna
        fields = '__all__'
        read_only_fields = ('criado_em', 'atualizado_em')


class FaunaListSerializer(serializers.ModelSerializer):
    """Versão resumida para listagens (cards)."""
    nome_cientifico = serializers.ReadOnlyField()
    grupo_comercial_nome = serializers.CharField(
        source='grupo_comercial.nome', read_only=True, default=None
    )
    tipo_display = serializers.CharField(
        source='get_tipo_display', read_only=True
    )

    class Meta:
        model = models.Fauna
        fields = (
            'id', 'nome_popular', 'nome_cientifico', 'grupo_comercial_nome',
            'tipo', 'tipo_display', 'imagem', 'temperamento'
        )


# ==========================================================
# FLORA
# ==========================================================
class GeneroFloraSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GeneroFlora
        fields = ('id', 'nome', 'descricao')


class FloraSerializer(serializers.ModelSerializer):
    nome_cientifico = serializers.ReadOnlyField()
    genero = serializers.CharField(
        source='genero.nome', read_only=True, default=None
    )
    necessidade_luz_display = serializers.CharField(
        source='get_necessidade_luz_display', read_only=True
    )

    class Meta:
        model = models.Flora
        fields = '__all__'
        read_only_fields = ('criado_em', 'atualizado_em')


class FloraListSerializer(serializers.ModelSerializer):
    nome_cientifico = serializers.ReadOnlyField()
    genero = serializers.CharField(
        source='genero.nome', read_only=True, default=None
    )
    necessidade_luz_display = serializers.CharField(
        source='get_necessidade_luz_display', read_only=True
    )

    class Meta:
        model = models.Flora
        fields = (
            'id', 'nome_popular', 'nome_cientifico',
            'imagem', 'necessidade_luz', 'necessidade_luz_display'
        )


# ==========================================================
# REGRAS DE COMPATIBILIDADE
# ==========================================================

class RegraCompatibilidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RegraCompatibilidade
        fields = '__all__'
