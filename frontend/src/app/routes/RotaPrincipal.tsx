import { BrowserRouter, Route, Routes } from "react-router-dom"
import { DashboardPage } from "./teste"
import { RotaPrivada } from "./RotaPrivada"
import { LoginPage } from "../../features/auth/LoginPage"
import { RegistroPage } from "../../features/auth/RegistroPage"
import { FaunaListPage } from "../../features/especies/fauna/FaunaListPage"
import { LayoutPrincipal } from "../layout/LayoutPrincipal"
import { FaunaFormPage } from "../../features/especies/fauna/FaunaFormPage"
import { NotFoundPage } from "../pages/NotFoundPage"
import { FamiliaListPage } from "../../features/admin/familia/FamiliaListPage"
import { GeneroListPage } from "../../features/admin/genero/GeneroListPage"
import { GrupoComercialListPage } from "../../features/admin/grupoComercial/GrupoComercialListPage"
import { RotaAdministrativa } from "./RotaAdministrativa"
import { NotAuthorizationPage } from "../pages/NotAuthorizationPage"
import { FamiliaFormPage } from "../../features/admin/familia/FamiliaFormPage"
import { GeneroFormPage } from "../../features/admin/genero/GeneroFormPage"
import { GrupoComercialFormPage } from "../../features/admin/grupoComercial/GrupoComercialFormPage"

export const RotaPrincipal = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />


        <Route element={<RotaPrivada />}>
          {/* Rotas principais (usuário final) */}
          <Route element={<LayoutPrincipal />}>
            <Route path="/">
              <Route index element={<DashboardPage />} />
              <Route path="nao-autorizado" element={<NotAuthorizationPage />} />

              <Route path="fauna">
                <Route index element={<FaunaListPage />} />
                <Route path="novo" element={<FaunaFormPage />} /> 
                <Route path=":id/editar" element={<FaunaFormPage />} />
              </Route>

            </Route>


            {/* Rotas administrativas */}
            <Route element={<RotaAdministrativa />}>
              <Route path="admin">
                <Route path="familia">
                  <Route index element={<FamiliaListPage />} />
                  <Route path="novo" element={<FamiliaFormPage />} />
                  <Route path=":id/editar" element={<FamiliaFormPage />} />
                </Route>

                <Route path="genero">
                  <Route index element={<GeneroListPage />} />
                  <Route path="novo" element={<GeneroFormPage />} />
                  <Route path=":id/editar" element={<GeneroFormPage />} />
                </Route>
                
                <Route path="grupo-comercial">
                  <Route index element={<GrupoComercialListPage />} />
                  <Route path="novo" element={<GrupoComercialFormPage />} />
                  <Route path=":id/editar" element={<GrupoComercialFormPage />} />
                </Route>

              </Route>
            </Route>
          </Route>
        </Route>
        {/* rota 404 - deve ficar por último */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}