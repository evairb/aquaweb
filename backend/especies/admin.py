from django.contrib import admin
from . import models


@admin.register(models.Familia)
class FamiliaAdmin(admin.ModelAdmin):
    list_display = ('nome_cientifico',)
    search_fields = ('nome_cientifico',)
    ordering = ('nome_cientifico',)


@admin.register(models.Genero)
class GeneroAdmin(admin.ModelAdmin):
    list_display = ('nome_cientifico', 'familia')
    list_filter = ('familia',)
    search_fields = ('nome_cientifico', 'familia__nome_cientifico')
    autocomplete_fields = ('familia',)
    ordering = ('nome_cientifico',)


@admin.register(models.GrupoComercial)
class GrupoComercialAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)
    ordering = ('nome',)


@admin.register(models.Fauna)
class FaunaAdmin(admin.ModelAdmin):
    list_display = (
        'nome_popular', 'nome_cientifico_display', 'tipo',
        'temperamento', 'ph_min', 'ph_max'
    )
    list_filter = (
        'tipo', 'temperamento', 'dieta', 'nivel_agua', 'come_plantas',
        'genero__familia'
    )
    search_fields = (
        'nome_popular', 'epiteto_especifico', 'genero__nome_cientifico',
        'genero__familia__nome_cientifico'
    )
    autocomplete_fields = ('genero', 'grupo_comercial')
    ordering = ('nome_popular',)

    fieldsets = (
        ('Taxonomia', {
            'fields': (
                'genero', 'epiteto_especifico', 'nome_popular',
                'grupo_comercial'
            )
        }),
        ('Identificação Geral', {
            'fields': ('tipo', 'origem', 'imagem', 'descricao')
        }),
        ('Parâmetros de Água', {
            'fields': (
                ('ph_min', 'ph_max'), ('temp_min', 'temp_max'),
                ('gh_min', 'gh_max')
            )
        }),
        ('Comportamento e Biologia', {
            'fields': (
                'temperamento', 'tamanho_adulto_cm', 'litragem_minima',
                'nivel_agua', 'dieta', 'comportamento_social',
                'tamanho_minimo_grupo', 'come_plantas'
            )
        }),
        ('Compatibilidade', {
            'fields': ('observacoes_compatibilidade',),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Nome científico')
    def nome_cientifico_display(self, obj):
        return obj.nome_cientifico


@admin.register(models.Flora)
class FloraAdmin(admin.ModelAdmin):
    list_display = (
        'nome_popular', 'nome_cientifico_display', 'necessidade_luz',
        'necessidade_co2', 'ph_min', 'ph_max'
    )
    list_filter = (
        'necessidade_luz', 'necessidade_co2', 'velocidade_crescimento',
        'posicao_plantio', 'sensivel_a_herbivoros', 'genero__familia'
    )
    search_fields = (
        'nome_popular', 'epiteto_especifico', 'genero__nome_cientifico',
        'genero__familia__nome_cientifico'
    )
    autocomplete_fields = ('genero', 'grupo_comercial')
    ordering = ('nome_popular',)

    fieldsets = (
        ('Taxonomia', {
            'fields': (
                'genero', 'epiteto_especifico', 'nome_popular',
                'grupo_comercial'
            )
        }),
        ('Identificação Geral', {
            'fields': ('origem', 'imagem', 'descricao')
        }),
        ('Parâmetros de Água', {
            'fields': (
                ('ph_min', 'ph_max'), ('temp_min', 'temp_max'),
                ('gh_min', 'gh_max')
            )
        }),
        ('Cultivo', {
            'fields': (
                'necessidade_luz', 'necessidade_co2', 'velocidade_crescimento',
                'posicao_plantio', 'sensivel_a_herbivoros'
            )
        }),
        ('Compatibilidade', {
            'fields': ('observacoes_compatibilidade',),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Nome científico')
    def nome_cientifico_display(self, obj):
        return obj.nome_cientifico


@admin.register(models.RegraCompatibilidade)
class RegraCompatibilidadeAdmin(admin.ModelAdmin):
    list_display = ('tipo_a', 'id_a', 'tipo_b', 'id_b', 'status')
    list_filter = ('status', 'tipo_a', 'tipo_b')
    search_fields = ('justificativa',)
