// src/components/AdminLayout/index.tsx
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/AuthContext";

export const AdminLayout = () => {
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/familia", label: "Famílias" },
    { path: "/admin/genero", label: "Gêneros" },
    { path: "/admin/grupo-comercial", label: "Grupos Comerciais" },
    { path: "/admin/genero-flora", label: "Genero Flora" },
    { path: "/", label: "Area Comum" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar escura */}
      <aside className="w-64 border-r border-slate-200 bg-slate-900 p-4">
        {/* Header */}
        <h2 className="mb-1 text-lg font-bold text-white">
          Administração
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          {usuario?.username}
        </p>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer (logout) */}
        <div className="mt-auto border-t border-slate-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 bg-slate-50 p-8">
        <Outlet />
      </main>
    </div>
  );
};