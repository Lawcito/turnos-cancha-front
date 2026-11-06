import { BallIcon, ClockIcon } from './Icons';

export function Footer() {
  return (
    <footer className="bg-shadow-grey text-platinum border-t-4 border-mustard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand & Mission */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-mustard text-shadow-grey border-2 border-platinum flex items-center justify-center font-bold">
                <BallIcon className="w-5 h-5" />
              </div>
              <span className="font-retro text-2xl font-black text-white tracking-tight">
                CANCHA<span className="text-mustard">TURNOS</span>
              </span>
            </div>
            <p className="text-sm text-platinum/70 leading-relaxed">
              Plataforma oficial de reservas y alquiler de canchas de fútbol 5, 7 y 11. Canchas sintéticas de nivel profesional con iluminación LED y vestuarios.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-xs font-mono text-mustard uppercase tracking-widest">
              Est. 1982 • Alquiler y Torneos
            </div>
          </div>

          {/* Horarios & Atención */}
          <div className="md:border-l md:border-white/10 md:pl-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-mustard mb-3 font-retro">
              Horario de Canchas
            </h4>
            <div className="space-y-2 text-sm text-platinum/80">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-pacific-blue shrink-0" />
                <span>Lunes a Viernes: 08:00 hs — 00:00 hs</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-pacific-blue shrink-0" />
                <span>Sábados y Domingos: 09:00 hs — 01:00 hs</span>
              </div>
              <p className="text-xs text-platinum/50 pt-1">
                Turnos de 60 minutos con 10 minutos de gracia previa.
              </p>
            </div>
          </div>

          {/* Sede & Contacto */}
          <div className="md:border-l md:border-white/10 md:pl-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-mustard mb-3 font-retro">
              Sede Central
            </h4>
            <p className="text-sm text-platinum/80">
              Av. del Deporte 1986, Predio Las Luces
            </p>
            <p className="text-sm text-platinum/80 mt-1">
              Tel: +54 (11) 4892-0000
            </p>
            <p className="text-xs text-pacific-blue mt-2 font-mono">
              contacto@canchaturnos.com
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-platinum/50 gap-4">
          <p>© {new Date().getFullYear()} CANCHATURNOS S.R.L. — Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Sistema en línea v1.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-mono">Servidor Activo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

