import { Link } from 'react-router';
import { BallIcon } from '../components/Icons';

export default function NotFound() {
  return (
    <div className="retro-card p-12 text-center bg-white max-w-lg mx-auto my-12">
      <div className="w-16 h-16 bg-mustard border-2 border-shadow-grey shadow-[3px_3px_0px_#272727] mx-auto flex items-center justify-center text-shadow-grey mb-4">
        <BallIcon className="w-9 h-9" />
      </div>
      <span className="font-mono text-xs font-black uppercase tracking-widest text-pacific-blue">
        Error 404 • Fuera de juego
      </span>
      <h1 className="text-3xl font-black text-shadow-grey font-retro mt-2 mb-3">
        Pelota fuera del campo
      </h1>
      <p className="text-sm text-dim-grey leading-relaxed mb-6">
        La página que estás buscando no existe o fue movida de lugar.
      </p>
      <Link
        to="/"
        className="retro-btn px-6 py-2.5 bg-mustard text-shadow-grey text-xs font-black uppercase tracking-wider"
      >
        Volver a Canchas
      </Link>
    </div>
  );
}

