import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  CalendarIcon,
  ClockIcon,
  BallIcon,
  AlertCircleIcon,
  CheckIcon,
  ChevronRightIcon,
} from '../components/Icons';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Cancellation modal state
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Filter state: 'all' | 'pending' | 'confirmed' | 'cancelled'
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    api.getReservations()
      .then((data) => {
        if (isMounted) {
          setReservations(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'No se pudieron cargar tus reservas.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleOpenCancelModal = (res) => {
    setReservationToCancel(res);
  };

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;

    setIsCancelling(true);
    try {
      await api.cancelReservation(reservationToCancel.id);
      setFeedback({
        type: 'success',
        message: 'Reserva cancelada exitosamente.',
      });

      // Update state in place or re-fetch
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationToCancel.id ? { ...r, status: 'cancelled' } : r
        )
      );
      setReservationToCancel(null);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'No se pudo cancelar la reserva.',
      });
      setReservationToCancel(null);
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-shadow-grey">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-dim-grey uppercase tracking-widest mb-1">
            <span>HISTORIAL Y GESTIÓN</span>
            <span>•</span>
            <span>SOCIO ACTIVO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-shadow-grey font-retro tracking-tight">
            MIS RESERVAS
          </h1>
        </div>

        <Link
          to="/"
          className="retro-btn px-4 py-2 bg-mustard hover:bg-mustard/90 text-shadow-grey text-xs font-black uppercase tracking-wider self-start sm:self-auto"
        >
          <span>Nueva Reserva</span>
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* Notifications / Feedback */}
      {feedback && (
        <div
          className={`retro-card p-4 text-xs font-bold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
              : 'bg-red-50 text-red-800 border-red-600'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <AlertCircleIcon className="w-4 h-4" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs uppercase font-black underline ml-4 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: `Todas (${reservations.length})` },
          { key: 'pending', label: 'Pendientes' },
          { key: 'confirmed', label: 'Confirmadas' },
          { key: 'cancelled', label: 'Canceladas' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-shadow-grey text-mustard border-shadow-grey shadow-[2px_2px_0px_#272727]'
                : 'bg-white hover:bg-platinum text-shadow-grey border-shadow-grey'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content List */}
      <div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="retro-card p-6 bg-white animate-pulse space-y-3">
                <div className="h-5 bg-platinum w-1/3" />
                <div className="h-4 bg-platinum w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="retro-card p-8 text-center bg-white border-red-500">
            <AlertCircleIcon className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-shadow-grey font-retro mb-1">
              No pudimos cargar tus turnos
            </h3>
            <p className="text-xs text-dim-grey mb-4">{error}</p>
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="retro-btn px-4 py-2 bg-mustard text-xs font-black uppercase"
            >
              Reintentar
            </button>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="retro-card p-12 text-center bg-white">
            <div className="w-14 h-14 bg-platinum border-2 border-shadow-grey mx-auto flex items-center justify-center text-dim-grey mb-3 shadow-[2px_2px_0px_#272727]">
              <BallIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-shadow-grey font-retro mb-1">
              No tenés reservas registradas
            </h3>
            <p className="text-sm text-dim-grey max-w-sm mx-auto mb-6">
              {statusFilter !== 'all'
                ? `No encontramos reservas con estado "${statusFilter}".`
                : 'Todavía no reservaste ningún turno para jugar.'}
            </p>
            <Link
              to="/"
              className="retro-btn px-5 py-2.5 bg-mustard text-shadow-grey text-xs font-black uppercase tracking-wider"
            >
              Elegir Cancha
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((res) => {
              const courtName = res.court?.name || 'Cancha de Fútbol';
              const timeSlotFormatted =
                res.time_slot?.formatted ||
                `${res.time_slot?.start_time} a ${res.time_slot?.end_time} hs`;

              const priceFormatted = res.court?.price
                ? new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 2,
                  }).format(res.court.price)
                : null;

              const canCancel = res.status === 'pending' || res.status === 'confirmed';

              return (
                <div
                  key={res.id}
                  className="retro-card p-5 sm:p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Reservation Information */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-dim-grey">
                        #RES-{res.id}
                      </span>
                      <StatusBadge status={res.status} />
                    </div>

                    <h3 className="text-xl font-black text-shadow-grey font-retro tracking-tight">
                      {courtName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-dim-grey">
                      <div className="flex items-center gap-1.5 text-shadow-grey font-bold">
                        <CalendarIcon className="w-4 h-4 text-pacific-blue" />
                        <span>Fecha: {res.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-shadow-grey font-bold">
                        <ClockIcon className="w-4 h-4 text-mustard" />
                        <span>{timeSlotFormatted}</span>
                      </div>

                      {priceFormatted && (
                        <div className="text-shadow-grey font-bold">
                          Importe: {priceFormatted}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-platinum">
                    {canCancel ? (
                      <button
                        type="button"
                        onClick={() => handleOpenCancelModal(res)}
                        className="retro-btn px-4 py-2 bg-platinum hover:bg-red-50 hover:text-red-600 text-shadow-grey text-xs font-black uppercase tracking-wider"
                      >
                        Cancelar Reserva
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-dim-grey italic px-3 py-1 bg-platinum border border-dim-grey/30">
                        Turno dado de baja
                      </span>
                    )}

                    <Link
                      to={`/canchas/${res.court?.id || 1}`}
                      className="retro-btn px-3 py-2 bg-mustard text-shadow-grey text-xs font-black uppercase"
                      title="Ver información de la cancha"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(reservationToCancel)}
        title="¿Cancelar Reserva?"
        confirmText="Sí, cancelar reserva"
        cancelText="No, conservar turno"
        confirmVariant="danger"
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => setReservationToCancel(null)}
        message={
          reservationToCancel ? (
            <div className="space-y-3">
              <p>
                ¿Estás seguro de que deseás cancelar el turno para{' '}
                <strong className="text-shadow-grey">
                  {reservationToCancel.court?.name}
                </strong>
                ?
              </p>
              <div className="p-3 bg-platinum border border-shadow-grey text-xs font-mono space-y-1">
                <div>
                  <strong>Fecha:</strong> {reservationToCancel.date}
                </div>
                <div>
                  <strong>Horario:</strong>{' '}
                  {reservationToCancel.time_slot?.formatted ||
                    reservationToCancel.time_slot?.start_time}
                </div>
              </div>
              <p className="text-xs text-dim-grey">
                El turno volverá a estar disponible para que otros socios puedan reservarlo.
              </p>
            </div>
          ) : null
        }
      />
    </div>
  );
}
