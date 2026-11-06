import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/useAuth';
import { BallIcon, UserIcon, LogoutIcon, MenuIcon, CloseIcon, CalendarIcon } from './Icons';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-1.5 text-sm font-black uppercase tracking-wider transition-all border-2 ${
      isActive
        ? 'bg-mustard text-shadow-grey border-shadow-grey shadow-[2px_2px_0px_#272727]'
        : 'border-transparent text-shadow-grey hover:border-shadow-grey hover:bg-platinum'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-shadow-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand / Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group select-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-11 h-11 bg-mustard border-2 border-shadow-grey shadow-[3px_3px_0px_#272727] flex items-center justify-center text-shadow-grey group-hover:rotate-12 transition-transform duration-200">
              <BallIcon className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-retro text-2xl font-black tracking-tighter text-shadow-grey leading-none">
                CANCHA<span className="text-pacific-blue">TURNOS</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-dim-grey mt-0.5">
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

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-platinum border-2 border-shadow-grey flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-dim-grey" />
                  <span className="text-xs font-bold text-shadow-grey truncate max-w-[150px]">
                    {user?.email}
                  </span>
                  <span className="px-1.5 py-0.2 bg-pacific-blue text-white text-[9px] font-black uppercase tracking-wider">
                    {user?.role || 'socio'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="retro-btn px-3.5 py-1.5 bg-platinum hover:bg-dim-grey hover:text-white text-shadow-grey text-xs font-bold uppercase tracking-wider"
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
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-shadow-grey hover:underline"
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

          {/* Mobile hamburger toggle */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-shadow-grey bg-platinum text-shadow-grey shadow-[2px_2px_0px_#272727]"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-shadow-grey bg-white p-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-sm font-black uppercase tracking-wider border-2 border-shadow-grey bg-platinum"
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

          <div className="pt-3 border-t-2 border-platinum">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="p-2 bg-platinum border border-shadow-grey text-xs font-bold flex items-center justify-between">
                  <span className="truncate">{user?.email}</span>
                  <span className="px-1.5 py-0.5 bg-pacific-blue text-white text-[10px] uppercase font-black">
                    {user?.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="retro-btn w-full py-2.5 bg-dim-grey text-white text-xs font-bold uppercase tracking-wider"
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
                  className="retro-btn py-2 bg-platinum text-shadow-grey text-xs font-bold uppercase text-center"
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
