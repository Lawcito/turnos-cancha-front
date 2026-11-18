import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { api } from '../services/api';
import { useAuth } from '../context/useAuth';
import { CourtPlaceholder } from '../components/CourtPlaceholder';
import { SlotButton } from '../components/SlotButton';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  RoofIcon,
  SunIcon,
  CheckIcon,
  AlertCircleIcon,
} from '../components/Icons';

export default function CourtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Today formatted as YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [court, setCourt] = useState(null);
  const [loadingCourt, setLoadingCourt] = useState(true);
  const [courtError, setCourtError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(getTodayString);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0);

  // Booking states
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // Fetch court details
  useEffect(() => {
    let isMounted = true;
    api.getCourtById(id)
      .then((data) => {
        if (isMounted) {
          setCourt(data);
          setLoadingCourt(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setCourtError(err.message || 'Cancha no encontrada.');
          setLoadingCourt(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Fetch time slots for chosen date
  useEffect(() => {
    let isMounted = true;
    api.getTimeSlots(id, selectedDate)
      .then((data) => {
        if (isMounted) {
          setTimeSlots(Array.isArray(data) ? data : []);
          setLoadingSlots(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setSlotsError(err.message || 'No se pudieron cargar los horarios para esta fecha.');
          setLoadingSlots(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, selectedDate, slotsRefreshKey]);

  // Handle slot click
  const handleSelectSlot = (slot) => {
    setBookingError(null);
    setBookingSuccess(null);

    // If not authenticated, redirect to login with return state
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: `/canchas/${id}`,
          message: 'Iniciá sesión para completar tu reserva.',
        },
      });
      return;
    }

    setSelectedSlot(slot);
    setIsConfirmModalOpen(true);
  };

  // Perform booking request
  const handleConfirmReservation = async () => {
    if (!selectedSlot) return;

    setSubmitting(true);
    setBookingError(null);

    try {
      const result = await api.createReservation({
        court_id: id,
        time_slot_id: selectedSlot.id,
        date: selectedDate,
      });

      setBookingSuccess(result);
      setIsConfirmModalOpen(false);
      setSelectedSlot(null);

      // Trigger slots reload to update availability
      setSlotsRefreshKey((k) => k + 1);
    } catch (err) {
      setBookingError(err.message || 'No se pudo crear la reserva.');
      setIsConfirmModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedPrice = court
    ? new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(court.price || 0)
    : '';

  // Quick date selector chips: Today, Tomorrow, +2 days, +3 days
  const quickDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${day}`;

    const label =
      i === 0
        ? 'Hoy'
        : i === 1
        ? 'Mañana'
        : d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });

    return { iso, label };
  });

  if (loadingCourt) {
    return (
      <div className="retro-card p-12 text-center bg-white dark:bg-shadow-grey max-w-xl mx-auto animate-pulse">
        <div className="h-6 bg-platinum dark:bg-[#1a1a1a] w-1/3 mx-auto mb-4" />
        <div className="h-4 bg-platinum dark:bg-[#1a1a1a] w-1/2 mx-auto" />
      </div>
    );
  }

  if (courtError || !court) {
    return (
      <div className="retro-card p-8 text-center bg-white dark:bg-shadow-grey max-w-xl mx-auto border-red-500">
        <AlertCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-black text-shadow-grey dark:text-platinum font-retro mb-2">
          Cancha no encontrada
        </h2>
        <p className="text-sm text-dim-grey dark:text-platinum/70 mb-6">
          {courtError || 'El identificador de cancha no existe o no se encuentra disponible.'}
        </p>
        <Link
          to="/"
          className="retro-btn px-4 py-2 bg-mustard text-shadow-grey text-xs font-black uppercase tracking-wider"
        >
          Volver a canchas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-dim-grey dark:text-platinum/70 hover:text-shadow-grey dark:hover:text-platinum transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Volver al listado de canchas</span>
        </Link>
      </div>

      {/* Main Court Hero Card */}
      <section className="retro-card bg-white dark:bg-shadow-grey overflow-hidden transition-colors duration-150">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Court Photo / Illustration */}
          <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[260px] bg-shadow-grey border-b-2 lg:border-b-0 lg:border-r-2 border-shadow-grey dark:border-dim-grey/60">
            {court.photo_url ? (
              <img
                src={court.photo_url}
                alt={court.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}

            <div className={court.photo_url ? 'hidden' : 'block h-full w-full'}>
              <CourtPlaceholder
                name={court.name}
                covered={court.covered}
                className="h-full w-full"
              />
            </div>

            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-shadow-grey shadow-[2px_2px_0px_#272727] ${
                  court.covered
                    ? 'bg-pacific-blue text-white'
                    : 'bg-mustard text-shadow-grey'
                }`}
              >
                {court.covered ? <RoofIcon className="w-3.5 h-3.5" /> : <SunIcon className="w-3.5 h-3.5" />}
                {court.covered ? 'Techada' : 'Al Aire Libre'}
              </span>
            </div>
          </div>

          {/* Court Details */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-dim-grey dark:text-platinum/60 uppercase tracking-widest mb-1">
                <span>CANCHA Nº 0{court.id}</span>
                <span>•</span>
                <span>FÚTBOL SINTÉTICO</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-shadow-grey dark:text-platinum font-retro tracking-tight mb-4">
                {court.name}
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 p-4 bg-platinum dark:bg-[#1c1c1c] border-2 border-shadow-grey dark:border-dim-grey/60 text-xs">
                <div>
                  <span className="block text-dim-grey dark:text-platinum/60 font-bold uppercase text-[10px]">
                    Superficie
                  </span>
                  <span className="font-extrabold text-shadow-grey dark:text-platinum">Sintético Pro</span>
                </div>
                <div>
                  <span className="block text-dim-grey dark:text-platinum/60 font-bold uppercase text-[10px]">
                    Modalidad
                  </span>
                  <span className="font-extrabold text-shadow-grey dark:text-platinum">
                    {court.covered ? 'Techada (Climatizada)' : 'Descubierta (LED)'}
                  </span>
                </div>
                <div>
                  <span className="block text-dim-grey dark:text-platinum/60 font-bold uppercase text-[10px]">
                    Duración
                  </span>
                  <span className="font-extrabold text-shadow-grey dark:text-platinum">60 minutos</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-platinum dark:border-dim-grey/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-dim-grey dark:text-platinum/60 uppercase tracking-wider">
                  Tarifa oficial por turno
                </span>
                <span className="text-3xl font-black text-shadow-grey dark:text-mustard font-retro">
                  {formattedPrice}
                </span>
              </div>

              <div className="text-xs text-dim-grey dark:text-platinum/70 font-medium text-right">
                <span className="block font-bold text-shadow-grey dark:text-platinum">Pago en recepción o seña</span>
                <span>Cancelación gratuita hasta 3hs antes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Alerts / Feedback */}
      {bookingSuccess && (
        <div className="retro-card p-6 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500 text-white border-2 border-shadow-grey shadow-[2px_2px_0px_#272727] shrink-0">
              <CheckIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-shadow-grey dark:text-platinum font-retro">
                ¡Reserva creada exitosamente!
              </h3>
              <p className="text-sm text-dim-grey dark:text-platinum/80 mt-1">
                Tu turno para el día <strong className="text-shadow-grey dark:text-platinum">{bookingSuccess.date}</strong> en horario{' '}
                <strong className="text-shadow-grey dark:text-platinum">
                  {bookingSuccess.time_slot?.formatted || bookingSuccess.time_slot?.start_time}
                </strong>{' '}
                ha sido agendado con estado <strong className="text-mustard bg-shadow-grey px-1.5 py-0.5 text-xs uppercase">Pendiente</strong>.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  to="/mis-reservas"
                  className="retro-btn px-4 py-2 bg-pacific-blue text-white text-xs font-black uppercase tracking-wider"
                >
                  Ver en Mis Reservas
                </Link>
                <button
                  type="button"
                  onClick={() => setBookingSuccess(null)}
                  className="retro-btn px-4 py-2 bg-platinum dark:bg-[#1c1c1c] text-shadow-grey dark:text-platinum text-xs font-bold uppercase tracking-wider"
                >
                  Seguir reservando
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bookingError && (
        <div className="retro-card p-5 bg-red-50 dark:bg-red-950/40 border-red-500 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500 text-white border-2 border-shadow-grey shadow-[2px_2px_0px_#272727] shrink-0">
              <AlertCircleIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-red-700 dark:text-red-400 font-retro">
                No pudimos procesar tu reserva
              </h3>
              <p className="text-sm text-red-900 dark:text-red-200 mt-1">{bookingError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Turnos Section */}
      <section className="retro-card p-6 sm:p-8 bg-white dark:bg-shadow-grey space-y-6 transition-colors duration-150">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-shadow-grey dark:border-dim-grey/60 gap-4">
          <div>
            <h2 className="text-2xl font-black text-shadow-grey dark:text-platinum font-retro tracking-tight">
              SELECCIONÁ DÍA Y HORARIO
            </h2>
            <p className="text-xs text-dim-grey dark:text-platinum/70 font-medium mt-0.5">
              Los turnos con borde mostaza o blanco están libres. Los turnos tachados ya fueron reservados.
            </p>
          </div>

          {/* Native Date Picker */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-2 p-2 bg-platinum dark:bg-[#1c1c1c] border-2 border-shadow-grey dark:border-dim-grey/60 shadow-[2px_2px_0px_#272727] dark:shadow-[2px_2px_0px_#111111]">
              <CalendarIcon className="w-4 h-4 text-shadow-grey dark:text-platinum" />
              <input
                type="date"
                min={getTodayString()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-black text-shadow-grey dark:text-platinum outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Quick Day Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {quickDates.map((q) => {
            const isCurrent = selectedDate === q.iso;
            return (
              <button
                key={q.iso}
                type="button"
                onClick={() => setSelectedDate(q.iso)}
                className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-shadow-grey dark:bg-mustard text-mustard dark:text-shadow-grey border-shadow-grey shadow-[2px_2px_0px_#272727] dark:shadow-[2px_2px_0px_#fed766]'
                    : 'bg-white dark:bg-[#1c1c1c] hover:bg-platinum dark:hover:bg-[#252525] text-shadow-grey dark:text-platinum border-shadow-grey dark:border-dim-grey/60'
                }`}
              >
                {q.label}
              </button>
            );
          })}
        </div>

        {/* Slots Grid */}
        <div className="pt-2">
          {loadingSlots ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-20 bg-platinum dark:bg-[#1a1a1a] border-2 border-dim-grey/20 dark:border-dim-grey/40" />
              ))}
            </div>
          ) : slotsError ? (
            <div className="p-6 bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-700 text-center">
              <p className="text-sm font-bold text-red-700 dark:text-red-300">{slotsError}</p>
              <button
                type="button"
                onClick={() => setSlotsRefreshKey((k) => k + 1)}
                className="retro-btn mt-3 px-4 py-1.5 bg-white dark:bg-[#1c1c1c] text-shadow-grey dark:text-platinum text-xs font-black uppercase"
              >
                Reintentar
              </button>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-dim-grey/40 dark:border-dim-grey/40 text-center bg-platinum/40 dark:bg-[#1a1a1a]/40">
              <ClockIcon className="w-8 h-8 text-dim-grey dark:text-platinum/50 mx-auto mb-2 opacity-60" />
              <h4 className="text-base font-black text-shadow-grey dark:text-platinum font-retro">
                No hay turnos configurados para este día
              </h4>
              <p className="text-xs text-dim-grey dark:text-platinum/70 mt-1">
                Probá seleccionando otra fecha en el calendario.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {timeSlots.map((slot) => (
                <SlotButton
                  key={slot.id}
                  slot={slot}
                  isSelected={selectedSlot?.id === slot.id}
                  onSelect={handleSelectSlot}
                  isSubmitting={submitting}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Confirmar Reserva"
        confirmText="Confirmar Turno"
        cancelText="Volver"
        confirmVariant="primary"
        isLoading={submitting}
        onConfirm={handleConfirmReservation}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedSlot(null);
        }}
        message={
          <div className="space-y-3 text-shadow-grey dark:text-platinum">
            <p className="text-sm">
              Estás a punto de reservar la{' '}
              <strong className="text-shadow-grey dark:text-mustard font-bold">{court.name}</strong> para el día:
            </p>
            <div className="p-3.5 bg-platinum dark:bg-[#1a1a1a] border-2 border-shadow-grey dark:border-dim-grey/60 text-xs space-y-1.5 font-mono text-shadow-grey dark:text-platinum shadow-[2px_2px_0px_#272727] dark:shadow-[2px_2px_0px_#111111]">
              <div className="flex items-center justify-between">
                <span className="text-dim-grey dark:text-platinum/70 font-semibold">Fecha:</span>
                <span className="font-bold">{selectedDate} ({selectedSlot?.day_name})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dim-grey dark:text-platinum/70 font-semibold">Horario:</span>
                <span className="font-bold text-pacific-blue dark:text-mustard">
                  {selectedSlot?.formatted || `${selectedSlot?.start_time} a ${selectedSlot?.end_time} hs`}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-dim-grey/20 dark:border-dim-grey/40">
                <span className="text-dim-grey dark:text-platinum/70 font-semibold">Precio:</span>
                <span className="font-extrabold text-sm text-shadow-grey dark:text-mustard font-retro">{formattedPrice}</span>
              </div>
            </div>
            <p className="text-xs text-dim-grey dark:text-platinum/70">
              Tu turno se registrará con estado{' '}
              <strong className="text-shadow-grey dark:text-mustard font-bold">pendiente</strong> hasta que el administrador del club lo confirme.
            </p>
          </div>
        }
      />
    </div>
  );
}
