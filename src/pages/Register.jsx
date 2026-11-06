import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/useAuth';
import { BallIcon, LockIcon, UserIcon, AlertCircleIcon } from '../components/Icons';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Client-side validations
    const validationErrors = [];
    if (!email) {
      validationErrors.push('El correo electrónico es requerido.');
    }
    if (!password) {
      validationErrors.push('La contraseña es requerida.');
    }
    if (password.length < 6) {
      validationErrors.push('La contraseña debe tener al menos 6 caracteres.');
    }
    if (password !== passwordConfirmation) {
      validationErrors.push('Las contraseñas no coinciden.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register(email, password, passwordConfirmation);
      navigate('/', { replace: true });
    } catch (err) {
      if (err.details && Array.isArray(err.details)) {
        setErrors(err.details);
      } else {
        setErrors([err.message || 'Error al crear la cuenta.']);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10">
      <div className="retro-card bg-white p-6 sm:p-8 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-pacific-blue text-white border-2 border-shadow-grey shadow-[3px_3px_0px_#272727] mx-auto flex items-center justify-center mb-3">
            <BallIcon className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-shadow-grey font-retro tracking-tight uppercase">
            Ficha de Nuevo Socio
          </h1>
          <p className="text-xs text-dim-grey uppercase tracking-wider font-bold mt-1">
            Creá tu cuenta para empezar a reservar canchas
          </p>
        </div>

        {/* Validation Errors Box */}
        {errors.length > 0 && (
          <div className="mb-5 p-3.5 bg-red-50 border-2 border-red-500 text-xs font-bold text-red-700 animate-in fade-in space-y-1">
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wider mb-1">
              <AlertCircleIcon className="w-4 h-4 shrink-0" />
              <span>Por favor corregí los siguientes errores:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
              {errors.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-shadow-grey mb-1">
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
                className="retro-input w-full px-3.5 py-2.5 text-sm font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dim-grey pointer-events-none">
                <UserIcon className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-shadow-grey mb-1">
              Contraseña (mínimo 6 caracteres)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="retro-input w-full px-3.5 py-2.5 text-sm font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dim-grey pointer-events-none">
                <LockIcon className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-shadow-grey mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="retro-input w-full px-3.5 py-2.5 text-sm font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dim-grey pointer-events-none">
                <LockIcon className="w-4 h-4" />
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="retro-btn w-full mt-2 py-3 bg-pacific-blue hover:bg-pacific-blue/90 text-white text-sm font-black uppercase tracking-wider cursor-pointer"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t-2 border-platinum text-center text-xs text-dim-grey">
          <span>¿Ya estás registrado? </span>
          <Link
            to="/login"
            className="font-black text-shadow-grey underline hover:text-pacific-blue ml-1"
          >
            Iniciá sesión acá
          </Link>
        </div>
      </div>
    </div>
  );
}
