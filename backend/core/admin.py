from django.contrib import admin
from . import models


@admin.register(models.PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ('user', 'tipo_conta', 'criado_em')
    list_filter = ('tipo_conta',)
    search_fields = ('user__username', 'user__email', 'nome_loja')
    ordering = ('user',)
