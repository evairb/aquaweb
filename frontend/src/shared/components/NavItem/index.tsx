import { Link } from "react-router-dom";

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

export const NavItem = ({to, children}: NavItemProps) => {
  return (
    <li>
      <Link
        to={to}
        className="block rounded-lg px-4 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}