from django.urls import path
from . import views


urlpatterns = [
    path(
        "compatibilidade/verificar/",
        views.VerificarCompatibilidadeView.as_view(),
        name="verficar-compatibilidade",
    ),
]
