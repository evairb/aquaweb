from django.db import models
from django.contrib.auth.models import User
from especies.models import Fauna, Flora


class CategoriaEquipamento(models.TextChoices):
    FILTRO = "filtro", "Filtro"
    AQUECEDOR = "aquecedor", "Aquecedor"
    ILUMINACAO = "iluminacao", "Iluminação"
    CO2 = "co2", "Sistema de CO2"
    SUBSTRATO = "substrato", "Substrato"
    BOMBA = "bomba", "Bomba/Circulador"
    OUTRO = "outro", "Outro"


class TipoFiltro(models.TextChoices):
    INTERNO = "interno", "Interno"
    EXTERNO = "externo", "Externo (HOB)"
    CANISTER = "canister", "Canister"
    MOCHILA = "mochila", "Mochila"
    SUMP = "sump", "Sump"


class TipoCO2(models.TextChoices):
    PRESSURIZADO = "pressurizado", "Pressurizado"
    DIY = "diy", "DIY (fermentação)"


class TipoSubstrato(models.TextChoices):
    INERTE = "inerte", "Inerte (areia, cascalho)"
    NUTRITIVO = "nutritivo", "Nutritivo/Fértil"
    SOLO_ATIVO = "solo_ativo", "Solo ativo (reduz pH/GH)"


class EquipamentoBase(models.Model):
    """Campos compartilhados por todas as categorias de equipamento."""

    nome = models.CharField(max_length=150)
    marca = models.CharField(max_length=100, blank=True)
    modelo = models.CharField(max_length=100, blank=True)
    categoria = models.CharField(max_length=20, choices=CategoriaEquipamento.choices)
    imagem = models.ImageField(upload_to="equipamentos/", blank=True, null=True)
    descricao = models.TextField(blank=True)

    litros_min_indicado = models.PositiveIntegerField(
        null=True, help_text="Litragem minime=a recomendada"
    )
    litros_max_indicado = models.PositiveIntegerField(
        null=True, blank=True, help_text="Litragem máxima recomendada"
    )

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome} ({self.get_categoria_display()})"


class Filtro(EquipamentoBase):
    tipo_filtro = models.CharField(max_length=20, choices=TipoFiltro.choices)
    vazao_lh = models.PositiveIntegerField(help_text="Vazão em litro por hora (L/h)")
    numero_estagios = models.PositiveSmallIntegerField(
        default=1, help_text="Nº de estágios de filtragem (mecânica/biológica/química)"
    )

    class Meta:
        verbose_name = "Filtro"
        verbose_name_plural = "Filtros"


class Aquecedor(EquipamentoBase):
    potencia_watts = models.PositiveIntegerField()
    temp_min_ajustavel = models.DecimalField(
        max_digits=4, decimal_places=1, default=20.0
    )
    temp_max_ajustavel = models.DecimalField(
        max_digits=4, decimal_places=1, default=30.0
    )
    termostato_integrado = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Aquecedor"
        verbose_name_plural = "Aquecedores"


class Iluminacao(EquipamentoBase):
    potencia_watts = models.PositiveIntegerField(null=True, blank=True)
    lumens = models.PositiveIntegerField(null=True, blank=True)
    par_a_30cm = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text=(
            """
            PAR medido a 30cm da superfície — referência p/
            necessidade de luz das plantas
        """
        ),
    )
    espectro_kelvin = models.PositiveIntegerField(
        null=True, blank=True, help_text="Temperatura de cor em Kelvin"
    )
    comprimento_cm = models.PositiveIntegerField(
        null=True, blank=True, help_text="Comprimento da luminária"
    )

    class Meta:
        verbose_name = "Iluminação"
        verbose_name_plural = "Iluminações"


class SistemaCO2(EquipamentoBase):
    tipo_co2 = models.CharField(max_length=20, choices=TipoCO2.choices)
    vazao_bps = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Vazão em bolhas por segundo (BPS) recomendada",
    )
    possui_difusor = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Sistema de CO2"
        verbose_name_plural = "Sistemas de CO2"


class Substrato(EquipamentoBase):
    tipo_substrato = models.CharField(max_length=20, choices=TipoSubstrato.choices)
    altera_ph = models.BooleanField(default=False)
    altera_gh = models.BooleanField(default=False)
    granulometria_mm = models.DecimalField(
        max_digits=4, decimal_places=1, null=True, blank=True
    )

    class Meta:
        verbose_name = "Substrato"
        verbose_name_plural = "Substratos"


class BombaCirculadora(EquipamentoBase):
    vazao_lh = models.PositiveIntegerField(help_text="Vazão em litros por hora (L/h)")
    ajustavel = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Bomba/Circulador"
        verbose_name_plural = "Bombas/Circuladores"


class Aquario(models.Model):
    """Um aquário montado por um usuário."""

    usuario = models.ForeignKey(User, related_name="aquarios", on_delete=models.CASCADE)
    nome = models.CharField(
        max_length=150, help_text="Ex: 'Aquário da sala', 'Betta solo'"
    )
    litros = models.PositiveIntegerField(help_text="Volumne total em litros")
    comprimento_cm = models.PositiveIntegerField(null=True, blank=True)
    largura_cm = models.PositiveIntegerField(null=True, blank=True)
    altura_cm = models.PositiveIntegerField(null=True, blank=True)

    ph_atual = models.DecimalField(
        max_digits=3, decimal_places=1, null=True, blank=True
    )
    temp_atual = models.DecimalField(
        max_digits=4, decimal_places=1, null=True, blank=True
    )
    gh_atual = models.DecimalField(
        max_digits=5, decimal_places=1, null=True, blank=True
    )

    observacoes = models.TextField(blank=True)
    publico = models.BooleanField(
        default=False, help_text="Se True, outros usuários podem ver este aquário"
    )

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-criado_em"]
        verbose_name = "Aquário"
        verbose_name_plural = "Aquários"

    def __str__(self):
        return f"{self.nome} ({self.litros}L) — {self.usuario.username}"


class AquarioFauna(models.Model):
    """Item de fauna dentro de um aquário, com quantidade."""

    aquario = models.ForeignKey(
        Aquario, related_name="itens_fauna", on_delete=models.CASCADE
    )
    fauna = models.ForeignKey(
        Fauna, related_name="em_aquarios", on_delete=models.PROTECT
    )
    quantidade = models.PositiveIntegerField(default=1)
    adicionado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("aquario", "fauna")
        verbose_name = "Fauna do Aquário"
        verbose_name_plural = "Fauna dos Aquários"

    def __str__(self):
        return f"{self.quantidade}x {self.fauna.nome_popular} em {self.aquario.nome}"


class AquarioFlora(models.Model):
    """Item de flora dentro de um aquário, com quantidade."""

    aquario = models.ForeignKey(
        Aquario, related_name="itens_flora", on_delete=models.CASCADE
    )
    flora = models.ForeignKey(
        Flora, related_name="em_aquarios", on_delete=models.PROTECT
    )
    quantidade = models.PositiveIntegerField(default=1)
    adicionado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("aquario", "flora")
        verbose_name = "Flora do Aquário"
        verbose_name_plural = "Flora dos Aquários"

    def __str__(self):
        return f"{self.quantidade}x {self.flora.nome_popular} em {self.aquario.nome}"


class CategoriaEquipamentoAquario(models.TextChoices):
    FILTRO = "filtro", "Filtro"
    AQUECEDOR = "aquecedor", "Aquecedor"
    ILUMINACAO = "iluminacao", "Iluminação"
    CO2 = "co2", "Sistema de CO2"
    SUBSTRATO = "substrato", "Substrato"
    BOMBA = "bomba", "Bomba/Circulador"


class AquarioEquipamento(models.Model):
    """
    Equipamento instalado num aquário.
    Usa tipo+id genérico (como RegraCompatibilidade) porque equipamentos
    estão espalhados em 6 tabelas diferentes (Filtro, Aquecedor, etc.).
    """

    aquario = models.ForeignKey(
        Aquario, related_name="itens_equipamento", on_delete=models.CASCADE
    )
    categoria = models.CharField(
        max_length=20, choices=CategoriaEquipamentoAquario.choices
    )
    equipamento_id = models.PositiveIntegerField()
    ativo = models.BooleanField(default=True)
    adicionado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("aquario", "categoria", "equipamento_id")
        verbose_name = "Equipamento do Aquário"
        verbose_name_plural = "Equipamentos dos Aquários"

    _MODEL_POR_CATEGORIA = {
        "filtro": Filtro,
        "aquecedor": Aquecedor,
        "iluminacao": Iluminacao,
        "co2": SistemaCO2,
        "substrato": Substrato,
        "bomba": BombaCirculadora,
    }

    @property
    def equipamento(self):
        """Retorna a instância real do equipamento (Filtro, Aquecedor, etc.)."""
        model = self._MODEL_POR_CATEGORIA.get(self.categoria)
        if model is None:
            return None
        return model.objects.filter(id=self.equipamento_id).first()

    def __str__(self):
        obj = self.equipamento
        nome = obj.nome if obj else f"#{self.equipamento_id}"
        return f"{nome} ({self.get_categoria_display()}) em {self.aquario.nome}"
