from rest_framework.routers import DefaultRouter
from .views import (
    FiltroViewSet,
    AquecedorViewSet,
    IluminacaoViewSet,
    SistemaCO2ViewSet,
    SubstratoViewSet,
    BombaCirculadoraViewSet,
    AquarioViewSet
)

router = DefaultRouter()
router.register(r"filtros", FiltroViewSet, basename="filtro")
router.register(r"aquecedores", AquecedorViewSet, basename="aquecedor")
router.register(r"iluminacoes", IluminacaoViewSet, basename="iluminacao")
router.register(r"sistemas-co2", SistemaCO2ViewSet, basename="sistema-co2")
router.register(r"substratos", SubstratoViewSet, basename="substrato")
router.register(r"bombas", BombaCirculadoraViewSet, basename="bomba")
router.register(r'aquarios', AquarioViewSet, basename='aquario')

urlpatterns = router.urls
