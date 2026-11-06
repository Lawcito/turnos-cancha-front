import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CourtCard } from '../components/CourtCard';
import { BallIcon, ShieldIcon, ClockIcon } from '../components/Icons';

export default function Home() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCovered, setFilterCovered] = useState('all'); // 'all' | 'covered' | 'outdoor'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchCourts() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getCourts();
        if (isMounted) {
          setCourts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'No se pudieron cargar las canchas.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCourts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourts = courts.filter((court) => {
    const matchesFilter =
      filterCovered === 'all'
        ? true
        : filterCovered === 'covered'
        ? court.covered === true
        : court.covered === false;

    const matchesSearch = court.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Retro Clubhouse Hero Banner */}
      <section className="retro-card p-6 sm:p-10 bg-white relative overflow-hidden">
        {/* Subtle retro badge in background */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-5 text-shadow-grey pointer-events-none">
          <BallIcon className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-mustard border-2 border-shadow-grey shadow-[2px_2px_0px_#272727] text-xs font-black uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-shadow-grey" />
            Temporada 2026 • Reservas Online
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-shadow-grey font-retro tracking-tight leading-none mb-4">
            ELEGÍ TU CANCHA, RESERVÁ TU TURNO Y JUGÁ.
          </h1>

          <p className="text-base sm:text-lg text-dim-grey font-medium leading-relaxed mb-6">
            Instalaciones de alto rendimiento para fútbol 5 y 7. Superficie de césped sintético de última generación, iluminación LED nocturna y vestuarios con duchas.
          </p>

          {/* Retro stadium perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t-2 border-platinum">
            <div className="flex items-center gap-2.5 text-xs font-bold text-shadow-grey">
              <span className="w-7 h-7 bg-platinum border border-shadow-grey flex items-center justify-center shrink-0">
                <ClockIcon className="w-4 h-4 text-pacific-blue" />
              </span>
              <span>Confirmación al instante</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-shadow-grey">
              <span className="w-7 h-7 bg-platinum border border-shadow-grey flex items-center justify-center shrink-0">
                <ShieldIcon className="w-4 h-4 text-mustard" />
              </span>
              <span>Canchas Techadas y Abiertas</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-shadow-grey">
              <span className="w-7 h-7 bg-platinum border border-shadow-grey flex items-center justify-center shrink-0">
                <BallIcon className="w-4 h-4 text-dim-grey" />
              </span>
              <span>Pelota y pecheras incluidas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Control / Filter Bar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre de cancha..."
            className="retro-input w-full px-4 py-2.5 text-sm font-semibold placeholder:text-dim-grey/70"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-dim-grey hover:text-shadow-grey"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-white border-2 border-shadow-grey shadow-[2px_2px_0px_#272727] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterCovered('all')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
              filterCovered === 'all'
                ? 'bg-shadow-grey text-white'
                : 'text-dim-grey hover:text-shadow-grey'
            }`}
          >
            Todas ({courts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCovered('covered')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
              filterCovered === 'covered'
                ? 'bg-pacific-blue text-white'
                : 'text-dim-grey hover:text-shadow-grey'
            }`}
          >
            Cubiertas
          </button>
          <button
            type="button"
            onClick={() => setFilterCovered('outdoor')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
              filterCovered === 'outdoor'
                ? 'bg-mustard text-shadow-grey'
                : 'text-dim-grey hover:text-shadow-grey'
            }`}
          >
            Al Aire Libre
          </button>
        </div>
      </section>

      {/* Courts Grid / Content State */}
      <section>
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-shadow-grey">
          <h2 className="text-xl sm:text-2xl font-black text-shadow-grey font-retro uppercase tracking-tight flex items-center gap-2">
            <span>Canchas Disponibles</span>
            <span className="text-xs px-2 py-0.5 bg-mustard border border-shadow-grey font-mono">
              {filteredCourts.length}
            </span>
          </h2>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="retro-card h-96 p-4 animate-pulse flex flex-col justify-between"
              >
                <div className="h-48 bg-platinum border border-dim-grey/30 mb-4" />
                <div className="space-y-3">
                  <div className="h-6 bg-platinum w-3/4" />
                  <div className="h-4 bg-platinum w-1/2" />
                </div>
                <div className="h-10 bg-platinum border border-dim-grey/30 mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="retro-card p-8 text-center bg-white border-red-500">
            <div className="w-12 h-12 bg-red-100 text-red-600 border-2 border-red-500 mx-auto flex items-center justify-center font-black text-xl mb-3">
              !
            </div>
            <h3 className="text-lg font-black text-shadow-grey font-retro mb-2">
              No pudimos conectar con el servidor
            </h3>
            <p className="text-sm text-dim-grey max-w-md mx-auto mb-5">
              {error}. Comprobá que el backend de Rails esté corriendo en <code className="bg-platinum px-1 py-0.5">http://localhost:3000</code>.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="retro-btn px-5 py-2 bg-mustard text-shadow-grey text-xs font-black uppercase tracking-wider"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCourts.length === 0 && (
          <div className="retro-card p-12 text-center bg-white">
            <div className="w-16 h-16 bg-platinum border-2 border-shadow-grey shadow-[3px_3px_0px_#272727] mx-auto flex items-center justify-center text-dim-grey mb-4">
              <BallIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-shadow-grey font-retro mb-2">
              No se encontraron canchas
            </h3>
            <p className="text-sm text-dim-grey max-w-md mx-auto mb-6">
              {searchQuery
                ? `No hay canchas que coincidan con "${searchQuery}". Probá con otro término.`
                : 'Aún no se han configurado canchas en el sistema.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="retro-btn px-4 py-2 bg-platinum text-shadow-grey text-xs font-black uppercase tracking-wider"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}

        {/* Courts Grid */}
        {!loading && !error && filteredCourts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

