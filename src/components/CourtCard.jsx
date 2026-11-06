import { Link } from 'react-router';
import { CourtPlaceholder } from './CourtPlaceholder';
import { RoofIcon, SunIcon, ChevronRightIcon } from './Icons';

export function CourtCard({ court }) {
  const { id, name, price, covered, photo_url } = court;

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price || 0);

  return (
    <article className="retro-card retro-card-interactive flex flex-col justify-between overflow-hidden group">
      {/* Visual Header / Photo */}
      <div className="relative h-52 w-full overflow-hidden bg-shadow-grey">
        {photo_url ? (
          <img
            src={photo_url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 border-b-2 border-shadow-grey"
            onError={(e) => {
              // Fallback to placeholder if image link fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}

        <div className={photo_url ? 'hidden' : 'block h-full w-full'}>
          <CourtPlaceholder name={name} covered={covered} className="h-full w-full" />
        </div>

        {/* Covered / Outdoor Pill */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-shadow-grey shadow-[2px_2px_0px_#272727] ${
              covered ? 'bg-pacific-blue text-white' : 'bg-mustard text-shadow-grey'
            }`}
          >
            {covered ? <RoofIcon className="w-3.5 h-3.5" /> : <SunIcon className="w-3.5 h-3.5" />}
            {covered ? 'Cubierta' : 'Al Aire Libre'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-dim-grey">
              Nº 0{id} • FÚTBOL
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-shadow-grey tracking-tight font-retro mb-3">
            {name}
          </h3>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t-2 border-platinum flex items-end justify-between gap-4">
          <div>
            <span className="block text-xs font-bold text-dim-grey uppercase tracking-wider">
              Precio por Turno
            </span>
            <span className="text-2xl font-black text-shadow-grey font-retro tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <Link
            to={`/canchas/${id}`}
            className="retro-btn px-4 py-2 bg-mustard hover:bg-mustard/90 text-shadow-grey text-sm font-black uppercase tracking-wider"
          >
            <span>Reservar</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

