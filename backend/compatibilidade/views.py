from rest_framework import serializers as drf_serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .service import verificar_grupo


class ItemVerificacaoSerializar(drf_serializers.Serializer):
    tipo = drf_serializers.ChoiceField(choices=["fauna", "flora"])
    id = drf_serializers.IntegerField()


class VerificarCompatibilidadeSerializer(drf_serializers.Serializer):
    itens = ItemVerificacaoSerializar(many=True, min_length=2)


class VerificarCompatibilidadeView(APIView):
    """
    POST /api/compatibilidade/verificar/
    Body: {"itens": [{"tipo": "fauna", "id": 1}, {"tipo": "flora", "id": 3}, ...]}

    Retorna a compatibilidade par a par entre todos os organismos informados.
    Leitura livre (não exige login) — qualquer aprendiz pode simular um aquário.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerificarCompatibilidadeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resultados = verificar_grupo(serializer.validated_data["itens"])

        payload = []
        pior_geral = "compativel"
        ordem = {"compativel": 0, "ressalvas": 1, "incompativel": 2}

        for r in resultados:
            payload.append(
                {
                    "organismo_a": {
                        "id": r.organismo_a.id,
                        "nome_popular": r.organismo_a.nome_popular,
                        "nome_cientifico": r.organismo_a.nome_cientifico,
                    },
                    "organismo_b": {
                        "id": r.organismo_b.id,
                        "nome_popular": r.organismo_b.nome_popular,
                        "nome_cientifico": r.organismo_b.nome_cientifico,
                    },
                    "status": r.status.value,
                    "motivos": r.motivos,
                    "origem": r.origem,
                }
            )
            if ordem[r.status.value] > ordem[pior_geral]:
                pior_geral = r.status.value

        return Response(
            {
                "status_geral": pior_geral,
                "total_pares_avaliados": len(payload),
                "pares": payload,
            }
        )
