"use client";
import { FadeIn } from "@/components/animations/FadeIn";

const useCases = [
  "Analisis de Casos Laborales",
  "Deteccion de Infracciones",
  "Gestion de Expedientes",
  "Consulta de Codigos Legales",
  "Redaccion de Protocolos",
  "Seguimiento de Clientes",
  "Busqueda de Jurisprudencia",
  "Citacion de Articulos",
  "Exportacion a PDF",
  "Control de Audiencias",
  "Investigacion de Precedentes",
  "Calculo de Prestaciones",
];

export function UseCaseTicker() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: Label */}
        <FadeIn direction="right" className="lg:w-1/3 text-center lg:text-left flex-shrink-0">
          <span className="text-[10px] uppercase tracking-[0.3em] text-jack-gold/60 font-cinzel block mb-4">
            Versatilidad
          </span>
          <h2 className="font-cinzel text-3xl md:text-4xl text-jack-white font-bold leading-tight mb-4">
            Los mejores abogados usan{" "}
            <span className="text-gradient-gold">Glaive</span> para:
          </h2>
          <p className="text-jack-silver/50 text-sm">
            Una plataforma, multiples soluciones para tu practica juridica.
          </p>
        </FadeIn>

        {/* Right: Vertical ticker */}
        <FadeIn direction="left" delay={0.2} className="lg:w-2/3 w-full">
          <div className="relative h-[320px] overflow-hidden">
            {/* Top fade */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-jack-base to-transparent z-10 pointer-events-none" />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-jack-base to-transparent z-10 pointer-events-none" />

            {/* Scrolling column */}
            <div className="animate-ticker-down hover:[animation-play-state:paused]">
              {[...useCases, ...useCases].map((item, i) => (
                <div
                  key={i}
                  className="py-3 px-6 mb-3 border border-jack-gold/10 bg-jack-panel/30 rounded-sm text-jack-white font-cinzel tracking-wider text-sm md:text-base hover:border-jack-gold/40 hover:bg-jack-panel/60 transition-all cursor-default"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
