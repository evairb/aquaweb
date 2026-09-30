from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class TipoConta(models.TextChoices):
    USUARIO = "usuario", "Usuario"
    LOJA = "loja", "Loja"
    ADMIN = "admin", "Administrador"


class PerfilUsuario(models.Model):
    user = models.OneToOneField(User, related_name="perfil", on_delete=models.CASCADE)
    tipo_conta = models.CharField(
        max_length=20, choices=TipoConta.choices, default=TipoConta.USUARIO
    )
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(blank=True)

    # Campos futuros para quando lojas puderem se cadastrar
    nome_loja = models.CharField(
        max_length=150, blank=True, help_text="Preenchido apenas se tipo_conta = loja"
    )
    cnpj = models.CharField(max_length=18, blank=True)

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de Usuário"
        verbose_name_plural = "Perfis de Usuários"

    def __str__(self):
        return f"Perfil de {self.user.username}"

    @property
    def is_loja(self):
        return self.tipo_conta == TipoConta.LOJA


@receiver(post_save, sender=User)
def criar_perfil_usuario(sender, instance, created, **kwargs):
    """Cria um PerfilUsuario automaticamente quando um User é criado."""
    if created:
        PerfilUsuario.objects.create(user=instance)


@receiver(post_save, sender=User)
def salvar_perfil_usuario(sender, instance, **kwargs):
    """Garante que o perfil exista (caso o signal de criação não tenha rodado)."""
    if hasattr(instance, "perfil"):
        instance.perfil.save()
