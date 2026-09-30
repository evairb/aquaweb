from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r"familias", views.FamiliaViewSet, basename="familia")
router.register(r"generos", views.GeneroViewSet, basename="genero")
router.register(
    r"grupos-comerciais", views.GrupoComercialViewSet,
    basename="grupo-comercial"
)
router.register(r"fauna", views.FaunaViewSet, basename="fauna")
router.register(r"flora", views.FloraViewSet, basename="flora")
router.register(
    r"regras-compatibilidade",
    views.RegraCompatibilidadeViewSet,
    basename="regra-compatibilidade",
)

urlpatterns = router.urls
