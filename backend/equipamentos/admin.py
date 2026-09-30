from django.contrib import admin
from . import models


@admin.register(models.Filtro)
class FiltroAdmin(admin.ModelAdmin):
    list_display = (
        "nome",
        "marca",
        "tipo_filtro",
        "vazao_lh",
        "litros_min_indicado",
        "litros_max_indicado",
    )
    list_filter = ("tipo_filtro", "marca")
    search_fields = ("nome", "marca", "modelo")
    ordering = ("nome",)


@admin.register(models.Aquecedor)
class AquecedorAdmin(admin.ModelAdmin):
    list_display = (
        "nome",
        "marca",
        "potencia_watts",
        "litros_min_indicado",
        "litros_max_indicado",
        "termostato_integrado",
    )
    list_filter = ("marca", "termostato_integrado")
    search_fields = ("nome", "marca", "modelo")
    ordering = ("nome",)


@admin.register(models.Iluminacao)
class IluminacaoAdmin(admin.ModelAdmin):
    list_display = (
        "nome",
        "marca",
        "potencia_watts",
        "par_a_30cm",
        "espectro_kelvin",
        "comprimento_cm",
    )
    list_filter = ("marca",)
    search_fields = ("nome", "marca", "modelo")
    ordering = ("nome",)


@admin.register(models.SistemaCO2)
class SistemaCO2Admin(admin.ModelAdmin):
    list_display = ("nome", "marca", "tipo_co2", "vazao_bps", "possui_difusor")
    list_filter = ("tipo_co2", "possui_difusor")
    search_fields = ("nome", "marca", "modelo")
    ordering = ("nome",)


@admin.register(models.Substrato)
class SubstratoAdmin(admin.ModelAdmin):
    list_display = (
        "nome",
        "marca",
        "tipo_substrato",
        "altera_ph",
        "altera_gh",
        "granulometria_mm",
    )
    list_filter = ("tipo_substrato", "altera_ph", "altera_gh")
    search_fields = ("nome", "marca", "modelo")
    ordering = ("nome",)


@admin.register(models.BombaCirculadora)
class BombaCirculadoraAdmin(admin.ModelAdmin):
    list_display = (
        "nome",
        "marca",
        "vazao_lh",
        "ajustavel",
        "litros_min_indicado",
        "litros_max_indicado",
    )
    list_filter = ("marca", "ajustavel")
    search_fields = ("nome", "marca", "modelo")
    ordering = ("nome",)


class AquarioFaunaInline(admin.TabularInline):
    model = models.AquarioFauna
    extra = 0


class AquarioFloraInline(admin.TabularInline):
    model = models.AquarioFlora
    extra = 0


class AquarioEquipamentoInline(admin.TabularInline):
    model = models.AquarioEquipamento
    extra = 0


@admin.register(models.Aquario)
class AquarioAdmin(admin.ModelAdmin):
    list_display = ("nome", "usuario", "litros", "publico", "criado_em")
    list_filter = ("publico",)
    search_fields = ("nome", "usuario__username")
    inlines = [AquarioFaunaInline, AquarioFloraInline, AquarioEquipamentoInline]
