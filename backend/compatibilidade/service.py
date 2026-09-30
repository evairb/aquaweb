"""
Motor de compatibilidade do AquaWeb.
Regras baseadas em critérios consolidados de aquarismo:
  - Overlap de pH, temperatura e GH entre as faixas das espécies.
  - Overlap "apertado" (baixa margem) gera ressalva, não incompatibilidade.
  - Predação: tamanho adulto muito diferente + temperamento não estritamente
  pacífico/herbívoro.
  - Conflito de temperamento (agressivo/territorial vs. outros).
  - Conflito fauna x flora (come_plantas vs sensivel_a_herbivoros).
  - Regras manuais (RegraCompatibilidade) sempre têm prioridade sobre o cálculo
  automático.
"""

from dataclasses import dataclass, field
from decimal import Decimal
from enum import Enum
from typing import Optional, Union

from especies.models import Fauna, Flora, RegraCompatibilidade


class StatusCompatibilidade(str, Enum):
    COMPATIVEL = "compativel"
    RESSALVAS = "ressalvas"
    INCOMPATIVEL = "incompativel"


# Limiares de referência (baseados em calculadoras de estocagem consolidadas)
OVERLAP_TEMP_MINIMO_SEGURO = Decimal("2.0")  # °C — abaixo disso, overlap é "apertado"
OVERLAP_PH_MINIMO_SEGURO = Decimal(
    "0.5"
)  # unidades de pH — abaixo disso, overlap é "apertado"
RAZAO_TAMANHO_RISCO_PREDACAO = Decimal(
    "3.0"
)  # espécie A > 3x o tamanho de B, com temperamento não-pacífico

TEMPERAMENTOS_CONFLITANTES = {"agressivo", "territorial"}
TEMPERAMENTOS_PACIFICOS = {"pacifico"}


@dataclass
class ResultadoPar:
    organismo_a: Union[Fauna, Flora]
    organismo_b: Union[Fauna, Flora]
    status: StatusCompatibilidade
    motivos: list = field(default_factory=list)  # lista de strings explicando o motivo
    origem: str = "automatico"  # 'automatico' ou 'regra_manual'


def _overlap_faixas(
    min_a: Decimal, max_a: Decimal, min_b: Decimal, max_b: Decimal
) -> Optional[Decimal]:
    """Retorna o tamanho da intersecção entre duas faixas,
    ou None se não houver overlap."""
    inicio = max(min_a, min_b)
    fim = min(max_a, max_b)
    if inicio > fim:
        return None
    return fim - inicio


def _verificar_parametros_agua(a, b) -> tuple[StatusCompatibilidade, list]:
    motivos = []
    pior_status = StatusCompatibilidade.COMPATIVEL

    overlap_temp = _overlap_faixas(a.temp_min, a.temp_max, b.temp_min, b.temp_max)
    if overlap_temp is None:
        return StatusCompatibilidade.INCOMPATIVEL, [
            f"Faixas de temperatura não se sobrepõem "
            f"({a.temp_min}-{a.temp_max}°C vs {b.temp_min}-{b.temp_max}°C)."
        ]
    if overlap_temp < OVERLAP_TEMP_MINIMO_SEGURO:
        motivos.append(
            f"""Sobreposição de temperatura estreita ({overlap_temp}°C) — margem de
            segurança baixa."""
        )
        pior_status = StatusCompatibilidade.RESSALVAS

    overlap_ph = _overlap_faixas(a.ph_min, a.ph_max, b.ph_min, b.ph_max)
    if overlap_ph is None:
        return StatusCompatibilidade.INCOMPATIVEL, motivos + [
            f"""Faixas de pH não se sobrepõem
            ({a.ph_min}-{a.ph_max} vs {b.ph_min}-{b.ph_max})."""
        ]
    if overlap_ph < OVERLAP_PH_MINIMO_SEGURO:
        motivos.append(
            f"Sobreposição de pH estreita ({overlap_ph}) — margem de segurança baixa."
        )
        pior_status = StatusCompatibilidade.RESSALVAS

    if (
        a.gh_min is not None
        and a.gh_max is not None
        and b.gh_min is not None
        and b.gh_max is not None
    ):
        overlap_gh = _overlap_faixas(a.gh_min, a.gh_max, b.gh_min, b.gh_max)
        if overlap_gh is None:
            return StatusCompatibilidade.INCOMPATIVEL, motivos + [
                f"""Faixas de dureza (GH) não se sobrepõem
                ({a.gh_min}-{a.gh_max} vs {b.gh_min}-{b.gh_max})."""
            ]

    return pior_status, motivos


def _verificar_predacao(a: Fauna, b: Fauna) -> tuple[StatusCompatibilidade, list]:
    if not (a.tamanho_adulto_cm and b.tamanho_adulto_cm):
        return StatusCompatibilidade.COMPATIVEL, []

    maior, menor = (a, b) if a.tamanho_adulto_cm >= b.tamanho_adulto_cm else (b, a)
    if menor.tamanho_adulto_cm == 0:
        return StatusCompatibilidade.COMPATIVEL, []

    razao = maior.tamanho_adulto_cm / menor.tamanho_adulto_cm
    if razao < RAZAO_TAMANHO_RISCO_PREDACAO:
        return StatusCompatibilidade.COMPATIVEL, []

    eh_pacifico_estrito = (
        maior.temperamento in TEMPERAMENTOS_PACIFICOS
        and maior.dieta in {"herbivoro", "onivoro"}
    )
    if eh_pacifico_estrito:
        return StatusCompatibilidade.RESSALVAS, [
            f"{maior.nome_popular} é bem maior que {menor.nome_popular} "
            f"""(razão {razao:.1f}x), mas tem temperamento pacífico —
            risco baixo, ainda observar."""
        ]

    return StatusCompatibilidade.INCOMPATIVEL, [
        f"{maior.nome_popular} é significativamente maior que {menor.nome_popular} "
        f"(razão {razao:.1f}x) e não é estritamente pacífico — risco real de predação."
    ]


def _verificar_temperamento(a: Fauna, b: Fauna) -> tuple[StatusCompatibilidade, list]:
    if not (a.temperamento and b.temperamento):
        return StatusCompatibilidade.COMPATIVEL, []

    if (
        a.temperamento in TEMPERAMENTOS_CONFLITANTES
        and b.temperamento in TEMPERAMENTOS_CONFLITANTES
    ):
        return StatusCompatibilidade.INCOMPATIVEL, [
            f"Ambos têm temperamento conflitante ({a.get_temperamento_display()} e "
            f"{b.get_temperamento_display()}) — risco alto de disputa territorial."
        ]

    um_agressivo = (
        a.temperamento in TEMPERAMENTOS_CONFLITANTES
        or b.temperamento in TEMPERAMENTOS_CONFLITANTES
    )
    outro_pacifico = (
        a.temperamento in TEMPERAMENTOS_PACIFICOS
        or b.temperamento in TEMPERAMENTOS_PACIFICOS
    )
    if um_agressivo and outro_pacifico:
        return StatusCompatibilidade.RESSALVAS, [
            """Um dos organismos é agressivo/territorial e o outro é
            pacífico — monitorar estresse e esconderijos."""
        ]

    return StatusCompatibilidade.COMPATIVEL, []


def _verificar_fauna_flora(
    fauna: Fauna, flora: Flora
) -> tuple[StatusCompatibilidade, list]:
    if fauna.come_plantas and flora.sensivel_a_herbivoros:
        return StatusCompatibilidade.INCOMPATIVEL, [
            f"""{fauna.nome_popular} come plantas e
            {flora.nome_popular} é sensível a herbívoros."""
        ]
    return StatusCompatibilidade.COMPATIVEL, []


def _pior_status(status_list: list[StatusCompatibilidade]) -> StatusCompatibilidade:
    ordem = {
        StatusCompatibilidade.COMPATIVEL: 0,
        StatusCompatibilidade.RESSALVAS: 1,
        StatusCompatibilidade.INCOMPATIVEL: 2,
    }
    return max(status_list, key=lambda s: ordem[s])


def _buscar_regra_manual(
    tipo_a: str, id_a: int, tipo_b: str, id_b: int
) -> Optional[RegraCompatibilidade]:
    """Busca regra manual, considerando que o par pode estar salvo
    em qualquer ordem (A,B) ou (B,A)."""
    regra = RegraCompatibilidade.objects.filter(
        tipo_a=tipo_a, id_a=id_a, tipo_b=tipo_b, id_b=id_b
    ).first()
    if regra is None:
        regra = RegraCompatibilidade.objects.filter(
            tipo_a=tipo_b, id_a=id_b, tipo_b=tipo_a, id_b=id_a
        ).first()
    return regra


def verificar_par(organismo_a, tipo_a: str, organismo_b, tipo_b: str) -> ResultadoPar:
    """Verifica compatibilidade entre dois organismos (Fauna ou Flora)."""
    regra_manual = _buscar_regra_manual(tipo_a, organismo_a.id, tipo_b, organismo_b.id)
    if regra_manual:
        return ResultadoPar(
            organismo_a=organismo_a,
            organismo_b=organismo_b,
            status=StatusCompatibilidade(regra_manual.status),
            motivos=[regra_manual.justificativa],
            origem="regra_manual",
        )

    status_list = []
    motivos = []

    status_agua, motivos_agua = _verificar_parametros_agua(organismo_a, organismo_b)
    status_list.append(status_agua)
    motivos += motivos_agua

    if tipo_a == "fauna" and tipo_b == "fauna":
        status_pred, motivos_pred = _verificar_predacao(organismo_a, organismo_b)
        status_list.append(status_pred)
        motivos += motivos_pred

        status_temp, motivos_temp = _verificar_temperamento(organismo_a, organismo_b)
        status_list.append(status_temp)
        motivos += motivos_temp

    elif {tipo_a, tipo_b} == {"fauna", "flora"}:
        fauna = organismo_a if tipo_a == "fauna" else organismo_b
        flora = organismo_b if tipo_b == "flora" else organismo_a
        status_ff, motivos_ff = _verificar_fauna_flora(fauna, flora)
        status_list.append(status_ff)
        motivos += motivos_ff

    status_final = _pior_status(status_list)
    if not motivos:
        motivos = ["Nenhum conflito identificado nos critérios avaliados."]

    return ResultadoPar(
        organismo_a=organismo_a,
        organismo_b=organismo_b,
        status=status_final,
        motivos=motivos,
        origem="automatico",
    )


def verificar_grupo(itens: list[dict]) -> list[ResultadoPar]:
    """
    Verifica compatibilidade entre todos os pares de uma lista de organismos.
    itens: lista de dicts {"tipo": "fauna"|"flora", "id": int}
    """
    organismos = []
    for item in itens:
        model = Fauna if item["tipo"] == "fauna" else Flora
        obj = model.objects.select_related("genero__familia").get(id=item["id"])
        organismos.append((obj, item["tipo"]))

    resultados = []
    for i in range(len(organismos)):
        for j in range(i + 1, len(organismos)):
            obj_a, tipo_a = organismos[i]
            obj_b, tipo_b = organismos[j]
            resultados.append(verificar_par(obj_a, tipo_a, obj_b, tipo_b))

    return resultados
