export function CourtPlaceholder({ name = "Cancha de Fútbol", covered = false, className = "h-48 w-full" }) {
  return (
    <div
      className={`relative overflow-hidden bg-shadow-grey flex items-center justify-center select-none border-b-2 border-shadow-grey ${className}`}
      aria-label={`Ilustración retro de ${name}`}
    >
      {/* Retro field pattern / tactile lines */}
      <svg
        viewBox="0 0 400 220"
        className="w-full h-full opacity-85"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="stripes" width="40" height="220" patternUnits="userSpaceOnUse">
            <rect width="20" height="220" fill="#202020" />
            <rect x="20" width="20" height="220" fill="#2a2a2a" />
          </pattern>
        </defs>

        {/* Pitch grass stripes */}
        <rect width="400" height="220" fill="url(#stripes)" />

        {/* Outer boundary */}
        <rect
          x="20"
          y="20"
          width="360"
          height="180"
          fill="none"
          stroke="#fed766"
          strokeWidth="2.5"
          strokeDasharray="none"
          opacity="0.8"
        />

        {/* Halfway line */}
        <line
          x1="200"
          y1="20"
          x2="200"
          y2="200"
          stroke="#fed766"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Center circle */}
        <circle
          cx="200"
          cy="110"
          r="36"
          fill="none"
          stroke="#fed766"
          strokeWidth="2"
          opacity="0.8"
        />
        <circle cx="200" cy="110" r="3" fill="#fed766" />

        {/* Left penalty box */}
        <rect
          x="20"
          y="60"
          width="60"
          height="100"
          fill="none"
          stroke="#fed766"
          strokeWidth="2"
          opacity="0.8"
        />
        {/* Left goal area */}
        <rect
          x="20"
          y="85"
          width="25"
          height="50"
          fill="none"
          stroke="#fed766"
          strokeWidth="2"
          opacity="0.8"
        />
        <circle cx="65" cy="110" r="2.5" fill="#fed766" />

        {/* Right penalty box */}
        <rect
          x="320"
          y="60"
          width="60"
          height="100"
          fill="none"
          stroke="#fed766"
          strokeWidth="2"
          opacity="0.8"
        />
        {/* Right goal area */}
        <rect
          x="355"
          y="85"
          width="25"
          height="50"
          fill="none"
          stroke="#fed766"
          strokeWidth="2"
          opacity="0.8"
        />
        <circle cx="335" cy="110" r="2.5" fill="#fed766" />
      </svg>

      {/* Retro center badge */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-shadow-grey/30">
        <div className="px-3 py-1 bg-mustard text-shadow-grey text-xs font-black uppercase tracking-widest border-2 border-shadow-grey shadow-[2px_2px_0px_#272727]">
          {covered ? "Cancha Cubierta" : "Cancha al Aire Libre"}
        </div>
        <p className="mt-1 text-sm font-bold text-platinum tracking-wide drop-shadow">
          {name}
        </p>
      </div>
    </div>
  );
}

