// src/components/Sidebar/index.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/AuthContext";
import { NavItem } from "../NavItem";

export const Sidebar = () => {
  const location = useLocation();
  const { usuario, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Verifica se está em rota de admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <aside className="w-64 bg-slate-900 text-white">
      {/* Header */}
      <div className="p-4">
        <h2 className="mb-1 text-lg font-bold text-white">

          {isAdminRoute ? "Administração" : "AquaWeb"}
        </h2>
        <p className="text-sm text-slate-500">{usuario?.username}</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {isAdminRoute ? (
            // Menu de admin
            <>
              <NavItem to="/admin/familia">Famílias</NavItem>
              <NavItem to="/admin/genero">Gêneros</NavItem>
              <NavItem to="/admin/grupo-comercial">Grupos Comerciais</NavItem>
              <NavItem to="/admin/genero-flora">Genero Flora</NavItem>
              <br />
              <NavItem to="/">Area Comum</NavItem>
            </>
          ) : (
            // Menu principal
            <>
              <NavItem to="/">Dashboard</NavItem>
              <NavItem to="/fauna">Fauna</NavItem>
              <NavItem to="/flora">Flora</NavItem>
              <NavItem to="/aquario">Aquários</NavItem>
              <NavItem to="/perfil">Perfil</NavItem>
              <br />
              {isAdmin && (
                <NavItem to="/admin">Administração</NavItem>
              )}
            </>
          )}
        </ul>
      </nav>

      {/* Footer (logout) */}
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Sair
        </button>
      </div>
    </aside>
  );
};