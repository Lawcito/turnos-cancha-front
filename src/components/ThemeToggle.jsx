import { useTheme } from '../context/useTheme';
import { SunIcon, MoonIcon } from './Icons';

export function ThemeToggle({ className = '', showLabel = false }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`retro-btn px-2.5 py-1.5 cursor-pointer text-xs font-black uppercase tracking-wider transition-colors duration-150 ${
        isDark
          ? 'bg-shadow-grey hover:bg-[#333] text-mustard border-mustard shadow-[2px_2px_0px_#fed766]'
          : 'bg-white hover:bg-platinum text-shadow-grey border-shadow-grey shadow-[2px_2px_0px_#272727]'
      } ${className}`}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'}
      title={isDark ? 'Modo Nocturno activo (clic para modo día)' : 'Modo Diurno activo (clic para modo noche)'}
    >
      <span className="flex items-center gap-1.5">
        {isDark ? (
          <>
            <SunIcon className="w-4 h-4 text-mustard animate-in spin-in-180 duration-200" />
            {showLabel && <span>Modo Día</span>}
          </>
        ) : (
          <>
            <MoonIcon className="w-4 h-4 text-shadow-grey animate-in spin-in-180 duration-200" />
            {showLabel && <span>Modo Noche</span>}
          </>
        )}
      </span>
    </button>
  );
}

