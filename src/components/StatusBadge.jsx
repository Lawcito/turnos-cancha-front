export function StatusBadge({ status }) {
  const configs = {
    pending: {
      label: 'Pendiente',
      className: 'bg-mustard text-shadow-grey border-shadow-grey',
      dotClass: 'bg-shadow-grey animate-pulse',
    },
    confirmed: {
      label: 'Confirmada',
      className: 'bg-pacific-blue text-white border-shadow-grey',
      dotClass: 'bg-white',
    },
    cancelled: {
      label: 'Cancelada',
      className: 'bg-dim-grey text-white border-shadow-grey',
      dotClass: 'bg-platinum',
    },
  };

  const config = configs[status] || {
    label: status,
    className: 'bg-platinum text-shadow-grey border-shadow-grey',
    dotClass: 'bg-dim-grey',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border-2 ${config.className} shadow-[2px_2px_0px_#272727]`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}

