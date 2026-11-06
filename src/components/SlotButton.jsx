import { ClockIcon, CheckIcon, CloseIcon } from './Icons';

export function SlotButton({
  slot,
  isSelected,
  onSelect,
  isSubmitting = false,
}) {
  const { available, start_time, end_time } = slot;

  if (!available) {
    return (
      <div
        className="relative p-3.5 border-2 border-dim-grey/40 bg-platinum/60 text-dim-grey/70 select-none cursor-not-allowed flex flex-col items-center justify-center rounded-none"
        title="Este horario ya se encuentra reservado"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1 line-through decoration-dim-grey">
          <ClockIcon className="w-3.5 h-3.5" />
          <span>{start_time} - {end_time}</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-dim-grey/20 text-dim-grey border border-dim-grey/30">
          <CloseIcon className="w-3 h-3" />
          Ocupado
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={() => onSelect(slot)}
      className={`group relative p-3.5 border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
        isSelected
          ? 'bg-pacific-blue text-white border-shadow-grey shadow-[4px_4px_0px_#272727] -translate-x-0.5 -translate-y-0.5'
          : 'bg-white hover:bg-mustard/20 text-shadow-grey border-shadow-grey shadow-[3px_3px_0px_#272727] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#272727]'
      }`}
    >
      <div className="flex items-center gap-1.5 text-sm font-black font-retro tracking-tight mb-1">
        <ClockIcon className="w-4 h-4" />
        <span>{start_time} a {end_time} hs</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border ${
            isSelected
              ? 'bg-white text-pacific-blue border-white'
              : 'bg-mustard text-shadow-grey border-shadow-grey'
          }`}
        >
          {isSelected ? (
            <>
              <CheckIcon className="w-3 h-3" />
              Seleccionado
            </>
          ) : (
            'Disponible'
          )}
        </span>
      </div>
    </button>
  );
}
