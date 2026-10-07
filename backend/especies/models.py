from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# ==========================================================
# TAXONOMIA
# ==========================================================
class Familia(models.Model):
    """Ex: Characidae, Cichlidae, Poeciliidae."""
    nome_cientifico = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True)

    class Meta:
        verbose_name = "Família"
        verbose_name_plural = "Famílias"
        ordering = ['nome_cientifico']

    def __str__(self):
        return self.nome_cientifico


class Genero(models.Model):
    """Ex: Paracheirodon, Corydoras, Betta. Pertence a uma Família."""
    familia = models.ForeignKey(
        Familia, related_name='generos', on_delete=models.PROTECT
    )
    nome_cientifico = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Gênero"
        verbose_name_plural = "Gêneros"
        unique_together = ('familia', 'nome_cientifico')
        ordering = ['nome_cientifico']

    def __str__(self):
        return self.nome_cientifico


class GrupoComercial(models.Model):
    """
    Classificação popular/comercial, independente da árvore taxonômica.
    Ex: "Tetra", "Corydoras", "Discos", "Acará", "Bettas".
    Um grupo pode reunir espécies de gêneros científicos diferentes
    (ex: "Tetra" inclui Paracheirodon, Hyphessobrycon, Hemigrammus).
    """
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True)

    class Meta:
        verbose_name = "Grupo Comercial"
        verbose_name_plural = "Grupos Comerciais"
        ordering = ['nome']

    def __str__(self):
        return self.nome


# ==========================================================
# CHOICES DE ATRIBUTOS BIOLÓGICOS/COMPORTAMENTAIS
# ==========================================================
class TipoOrganismo(models.TextChoices):
    PEIXE = 'peixe', 'Peixe'
    INVERTEBRADO = 'invertebrado', 'Invertebrado'
    CORAL = 'coral', 'Coral'
    ANFIBIO = 'anfibio', 'Anfibio'
    REPTIL = 'reptil', 'Reptil'


class Temperamento(models.TextChoices):
    PACIFICO = 'pacifico', 'Pacifico'
    SEMI_AGRESSIVO = 'semi_agressivo', 'Semi-agressivo'
    AGRESSIVO = 'agressivo', 'Agressivo'
    TERRITORIAL = 'territorial', 'Territorial'


class NivelAgua(models.TextChoices):
    FUNDO = 'fundo', 'Fundo'
    MEIO = 'meio', 'Meio'
    SUPERFICIE = 'superficie', 'Superfície'
    TODOS = 'todos', 'Todos os níveis'


class Dieta(models.TextChoices):
    HERBIVORO = 'herbivoro', 'Herbívoro'
    CARNIVORO = 'carnivoro', 'Carnívoro'
    ONIVORO = 'onivoro', 'Onívoro'
    FILTRADOR = 'filtrador', 'Filtrador'


class ComportamentoSocial(models.TextChoices):
    SOLITARIO = 'solitario', 'Solitário'
    CASAL = 'casal', 'Casal'
    CARDUME = 'cardume', 'Cardume'
    COLONIA = 'colonia', 'Colônia'


class NecessidadeLuz(models.TextChoices):
    BAIXA = 'baixa', 'Baixa'
    MEDIA = 'media', 'Média'
    ALTA = 'alta', 'Alta'


# ==========================================================
# ORGANISMO BASE (abstrato)
# ==========================================================
class OrganismoBase(models.Model):
    """Classe abstrata com campos compartilhados entre Fauna e Flora"""

    epiteto_especifico = models.CharField(
        max_length=100,
        help_text="""Segunda parte do nome científico.
        Ex: em 'Paracheirodon innesi', digite apenas 'innesi'."""
    )
    nome_popular = models.CharField(max_length=150)
    origem = models.CharField(
        max_length=150, blank=True, help_text='Região de origem natural'
    )
    imagem = models.ImageField(upload_to='organismos/', blank=True, null=True)
    descricao = models.TextField(blank=True)

    # Parâmetros de água — usados no cruzamento de compatibilidade
    ph_min = models.DecimalField(
        max_digits=3, decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(14)]
    )
    ph_max = models.DecimalField(
        max_digits=3, decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(14)]
    )
    temp_min = models.DecimalField(
        max_digits=4, decimal_places=1, help_text="Temperatura mínima em °C"
    )
    temp_max = models.DecimalField(
        max_digits=4, decimal_places=1, help_text="Temperatura máxima em °C"
    )
    gh_min = models.DecimalField(
        max_digits=5, decimal_places=1, null=True, blank=True,
        help_text="Dureza mínima (GH)"
    )
    gh_max = models.DecimalField(
        max_digits=5, decimal_places=1, null=True, blank=True,
        help_text="Dureza máxima (GH)"
    )

    # Exceções manuais curadas, específicas deste organismo
    observacoes_compatibilidade = models.JSONField(default=dict, blank=True)

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['nome_popular']

    @property
    def nome_cientifico(self):
        """Monta 'Paracheirodon innesi' a
        partir do Gênero (FK) + epíteto (str)."""
        return f"{self.genero.nome_cientifico} {self.epiteto_especifico}"

    @property
    def familia(self):
        return self.genero.familia

    def __str__(self):
        return f"{self.nome_popular} ({self.nome_cientifico})"


class Fauna(OrganismoBase):
    """Peixes, invertebrados e corais."""

    genero = models.ForeignKey(
        Genero, related_name='%(class)s_set', on_delete=models.PROTECT
    )
    grupo_comercial = models.ForeignKey(
        GrupoComercial, related_name='%(class)s_set',
        on_delete=models.SET_NULL, null=True, blank=True
    )
    tipo = models.CharField(max_length=20, choices=TipoOrganismo.choices)
    temperamento = models.CharField(
        max_length=20, choices=Temperamento.choices, blank=True
    )
    tamanho_adulto_cm = models.DecimalField(
        max_digits=5, decimal_places=1, null=True, blank=True
    )
    litragem_minima = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="Litragem minima recomendada por individuo/grupo"
    )
    nivel_agua = models.CharField(
        max_length=20, choices=NivelAgua.choices, blank=True
    )
    dieta = models.CharField(max_length=20, choices=Dieta.choices, blank=True)
    comportamento_social = models.CharField(
        max_length=20, choices=ComportamentoSocial.choices, blank=True
    )
    tamanho_minimo_grupo = models.PositiveIntegerField(
        null=True, blank=True, help_text="Ex: cardume mínimo de 6 indivíduos"
    )
    come_plantas = models.BooleanField(
        default=False,
        help_text="Se True, entra em conflito automático com Flora sensível"
    )

    class Meta(OrganismoBase.Meta):
        verbose_name = "Fauna"
        verbose_name_plural = "Fauna"


class GeneroFlora(models.Model):
    """Ex: Paracheirodon, Corydoras, Betta. Pertence a uma Família."""
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)

    class Meta:
        verbose_name = "Gênero Flora"
        verbose_name_plural = "Gêneros Floras"
        ordering = ['nome']

    def __str__(self):
        return self.nome


class Flora(OrganismoBase):
    """Plantas aquáticas."""
    genero = models.ForeignKey(
        GeneroFlora, related_name='%(class)s_set', on_delete=models.PROTECT
    )
    necessidade_luz = models.CharField(
        max_length=20, choices=NecessidadeLuz.choices
    )
    necessidade_co2 = models.BooleanField(default=False)
    velocidade_crescimento = models.CharField(
        max_length=20, blank=True,
        choices=[('lenta', 'Lenta'), ('media', 'Média'), ('rapida', 'Rápida')]
    )
    posicao_plantio = models.CharField(
        max_length=20, blank=True,
        choices=[
            ('fundo', 'Fundo'), ('meio', 'Meio/Plano médio'),
            ('flutuante', 'Flutuante'), ('epifita', 'Epífita')
        ]
    )
    sensivel_a_herbivoros = models.BooleanField(
        default=False, help_text="Se True, conflita com Fauna que come_plantas"
    )

    class Meta(OrganismoBase.Meta):
        verbose_name = "Flora"
        verbose_name_plural = "Flora"


class RegraCompatibilidade(models.Model):
    """
    Regras manuais/curadas entre pares de organismos.
    Usa dois campos de tipo+id para suportar combinações
    Fauna-Fauna, Fauna-Flora e Flora-Flora.
    """
    class TipoOrigem(models.TextChoices):
        FAUNA = 'fauna', 'Fauna'
        FLORA = 'flora', 'Flora'

    class Status(models.TextChoices):
        COMPATIVEL = 'compativel', 'Compatível'
        RESSALVAS = 'ressalvas', 'Compatível com ressalvas'
        INCOMPATIVEL = 'incompativel', 'Incompatível'

    tipo_a = models.CharField(max_length=10, choices=TipoOrigem.choices)
    id_a = models.PositiveIntegerField()
    tipo_b = models.CharField(max_length=10, choices=TipoOrigem.choices)
    id_b = models.PositiveIntegerField()

    status = models.CharField(max_length=20, choices=Status.choices)
    justificativa = models.TextField()

    class Meta:
        verbose_name = "Regra de Compatibilidade"
        verbose_name_plural = "Regras de Compatibilidade"
        unique_together = ('tipo_a', 'id_a', 'tipo_b', 'id_b')

    def __str__(self):
        return (f"""
            {self.tipo_a}#{self.id_a} x {self.tipo_b}#{self.id_b}:
            {self.status}
        """)
