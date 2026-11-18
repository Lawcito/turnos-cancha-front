import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import {
  BallIcon,
  UserIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
  CalendarIcon,
  ShieldIcon,
  ExternalLinkIcon,
} from "./Icons";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const backofficeUrl =
    import.meta.env.VITE_BACKOFFICE_URL || "http://localhost:3000/admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-1.5 text-sm font-black uppercase tracking-wider transition-all border-2 ${
      isActive
        ? "bg-mustard text-shadow-grey border-shadow-grey shadow-[2px_2px_0px_#272727] dark:shadow-[2px_2px_0px_#fed766]"
        : "border-transparent text-shadow-grey dark:text-platinum hover:border-shadow-grey dark:hover:border-dim-grey hover:bg-platinum dark:hover:bg-[#272727]"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#1a1a1a] border-b-2 border-shadow-grey dark:border-dim-grey/60 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand / Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group select-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-11 h-11 bg-mustard border-2 border-shadow-grey shadow-[3px_3px_0px_#272727] dark:shadow-[3px_3px_0px_#111111] flex items-center justify-center text-shadow-grey group-hover:rotate-12 transition-transform duration-200">
              <BallIcon className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-retro text-2xl font-black tracking-tighter text-shadow-grey dark:text-platinum leading-none">
                CANCHA<span className="text-pacific-blue">TURNOS</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-dim-grey dark:text-platinum/70 mt-0.5">
                Club Social & Deportivo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={navLinkClasses}>
              Canchas
            </NavLink>

            {isAuthenticated && (
              <NavLink to="/mis-reservas" className={navLinkClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  Mis Reservas
                </span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Auth Actions & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <a
                    href={backofficeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retro-btn px-3.5 py-1.5 bg-mustard hover:bg-mustard/90 text-shadow-grey text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                    title="Abrir el panel de administración de Rails"
                  >
                    <ShieldIcon className="w-4 h-4 text-shadow-grey" />
                    <span>Backoffice Rails</span>
                    <ExternalLinkIcon className="w-3.5 h-3.5 text-shadow-grey" />
                  </a>
                )}

                <div className="px-3 py-1.5 bg-platinum dark:bg-[#272727] border-2 border-shadow-grey dark:border-dim-grey/60 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-dim-grey dark:text-platinum/70" />
                  <span className="text-xs font-bold text-shadow-grey dark:text-platinum truncate max-w-[150px]">
                    {user?.email}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      isAdmin
                        ? "bg-mustard text-shadow-grey border border-shadow-grey"
                        : "bg-pacific-blue text-white"
                    }`}
                  >
                    {isAdmin ? "ADMIN" : user?.role || "socio"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="retro-btn px-3.5 py-1.5 bg-platinum dark:bg-[#272727] hover:bg-dim-grey hover:text-white dark:hover:bg-dim-grey text-shadow-grey dark:text-platinum text-xs font-bold uppercase tracking-wider dark:border-dim-grey/60 cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogoutIcon className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-shadow-grey dark:text-platinum hover:underline"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="retro-btn px-4 py-2 bg-mustard text-shadow-grey text-xs font-black uppercase tracking-wider"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right: Theme Toggle & Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-shadow-grey dark:border-dim-grey/60 bg-platinum dark:bg-[#272727] text-shadow-grey dark:text-platinum shadow-[2px_2px_0px_#272727] dark:shadow-[2px_2px_0px_#111111]"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-shadow-grey dark:border-dim-grey/60 bg-white dark:bg-[#1a1a1a] p-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-sm font-black uppercase tracking-wider border-2 border-shadow-grey dark:border-dim-grey/60 bg-platinum dark:bg-[#272727] text-shadow-grey dark:text-platinum"
            >
              Canchas
            </Link>

            {isAuthenticated && (
              <Link
                to="/mis-reservas"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 text-sm font-black uppercase tracking-wider border-2 border-shadow-grey bg-mustard text-shadow-grey"
              >
                Mis Reservas
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t-2 border-platinum dark:border-dim-grey/40">
            {isAuthenticated ? (
              <div className="space-y-3">
                {isAdmin && (
                  <a
                    href={backofficeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retro-btn w-full py-2.5 bg-mustard text-shadow-grey text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <ShieldIcon className="w-4 h-4" />
                    <span>Panel Backoffice Rails</span>
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                )}

                <div className="p-2 bg-platinum dark:bg-[#272727] border border-shadow-grey dark:border-dim-grey/60 text-xs font-bold flex items-center justify-between text-shadow-grey dark:text-platinum">
                  <span className="truncate">{user?.email}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] uppercase font-black ${
                      isAdmin
                        ? "bg-mustard text-shadow-grey border border-shadow-grey"
                        : "bg-pacific-blue text-white"
                    }`}
                  >
                    {isAdmin ? "ADMIN" : user?.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="retro-btn w-full py-2.5 bg-dim-grey text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <LogoutIcon className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="retro-btn py-2 bg-platinum dark:bg-[#272727] text-shadow-grey dark:text-platinum text-xs font-bold uppercase text-center"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="retro-btn py-2 bg-mustard text-shadow-grey text-xs font-black uppercase text-center"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
