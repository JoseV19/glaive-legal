"use client";

const institutions = [
  "Tu Bufete Aqui",
  "Firma Legal Asociada",
  "Corporacion Juridica",
  "Notaria de Confianza",
  "Grupo Legal Premier",
  "Asesores y Consultores",
  "Despacho Profesional",
  "Alianza Juridica GT",
];

export function TrustBar() {
  return (
    <section className="relative py-10 bg-jack-panel/30 border-y border-jack-gold/5 overflow-hidden">
      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-jack-silver/30 mb-8 font-cinzel">
        Confiado por profesionales del derecho en Guatemala
      </p>

      {/* Marquee container */}
      <div className="relative">
        {/* Left fade mask */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-jack-base via-jack-base/80 to-transparent z-10 pointer-events-none" />
        {/* Right fade mask */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-jack-base via-jack-base/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
          {[...institutions, ...institutions].map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-4 px-6 py-3 border border-jack-gold/10 rounded-sm bg-jack-panel/50 text-jack-silver/40 font-cinzel text-xs md:text-sm tracking-wider whitespace-nowrap hover:border-jack-gold/30 hover:text-jack-silver/70 transition-all"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
