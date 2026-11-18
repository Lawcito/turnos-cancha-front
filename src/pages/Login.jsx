import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/useAuth';
import { BallIcon, LockIcon, UserIcon, AlertCircleIcon } from '../components/Icons';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const redirectPath = location.state?.from?.pathname || location.state?.from || '/';
  const customMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor completá tu correo y contraseña.');
      return;
    }

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      if (err.status === 401) {
        setError('Credenciales inválidas. Verificá tu correo y contraseña.');
      } else {
        setError(err.message || 'Error al iniciar sesión.');
      }
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10">
      {/* Retro Ticket / Pass Card */}
      <div className="retro-card bg-white dark:bg-shadow-grey p-6 sm:p-8 relative transition-colors duration-150">
        {/* Top Header Badge */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-mustard border-2 border-shadow-grey shadow-[3px_3px_0px_#272727] dark:shadow-[3px_3px_0px_#111111] mx-auto flex items-center justify-center text-shadow-grey mb-3">
            <BallIcon className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-shadow-grey dark:text-platinum font-retro tracking-tight uppercase">
            Ingreso al Club
          </h1>
          <p className="text-xs text-dim-grey dark:text-platinum/70 uppercase tracking-wider font-bold mt-1">
            Accedé para reservar canchas y gestionar tus turnos
          </p>
        </div>

        {customMessage && (
          <div className="mb-5 p-3 bg-pacific-blue/10 dark:bg-pacific-blue/20 border-2 border-pacific-blue text-xs font-bold text-pacific-blue dark:text-pacific-blue">
            {customMessage}
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border-2 border-red-500 text-xs font-bold text-red-700 dark:text-red-300 flex items-start gap-2 animate-in fade-in">
            <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-shadow-grey dark:text-platinum mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="juan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="retro-input w-full px-3.5 py-2.5 text-sm font-semibold placeholder:text-dim-grey/60 dark:placeholder:text-platinum/40"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dim-grey dark:text-platinum/60 pointer-events-none">
                <UserIcon className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-shadow-grey dark:text-platinum mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="retro-input w-full px-3.5 py-2.5 text-sm font-semibold placeholder:text-dim-grey/60 dark:placeholder:text-platinum/40"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dim-grey dark:text-platinum/60 pointer-events-none">
                <LockIcon className="w-4 h-4" />
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="retro-btn w-full mt-2 py-3 bg-mustard hover:bg-mustard/90 text-shadow-grey text-sm font-black uppercase tracking-wider cursor-pointer"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t-2 border-platinum dark:border-dim-grey/30 text-center text-xs text-dim-grey dark:text-platinum/70">
          <span>¿No tenés una cuenta en el club? </span>
          <Link
            to="/register"
            className="font-black text-shadow-grey dark:text-mustard underline hover:text-pacific-blue ml-1"
          >
            Registrate acá
          </Link>
        </div>

        {/* Demo Seed Credentials Helper */}
        <div className="mt-6 p-3.5 bg-platinum dark:bg-[#1c1c1c] border border-shadow-grey/30 dark:border-dim-grey/50 text-xs">
          <span className="block font-black text-shadow-grey dark:text-platinum uppercase text-[10px] tracking-wider mb-2">
            Credenciales de prueba (Seeds de Rails):
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => handleFillDemo('cliente@canchaturnos.com', 'password123')}
              className="text-left font-mono text-[11px] hover:bg-white dark:hover:bg-[#272727] p-1 border border-transparent hover:border-shadow-grey dark:hover:border-dim-grey/60 transition-all flex items-center justify-between text-shadow-grey dark:text-platinum cursor-pointer"
            >
              <span><strong>Cliente:</strong> cliente@canchaturnos.com</span>
              <span className="text-[10px] text-pacific-blue dark:text-mustard uppercase font-bold">Usar</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@canchaturnos.com', 'password123')}
              className="text-left font-mono text-[11px] hover:bg-white dark:hover:bg-[#272727] p-1 border border-transparent hover:border-shadow-grey dark:hover:border-dim-grey/60 transition-all flex items-center justify-between text-shadow-grey dark:text-platinum cursor-pointer"
            >
              <span><strong>Admin:</strong> admin@canchaturnos.com</span>
              <span className="text-[10px] text-pacific-blue dark:text-mustard uppercase font-bold">Usar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
