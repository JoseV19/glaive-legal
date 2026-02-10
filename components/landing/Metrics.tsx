"use client";
import { FadeIn } from "@/components/animations/FadeIn";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/StaggerChildren";

const metrics = [
  {
    value: 500,
    suffix: "+",
    label: "Articulos Legales Indexados",
    sub: "Busqueda instantanea",
  },
  {
    value: 5,
    suffix: "",
    label: "Codigos de Guatemala",
    sub: "Trabajo, Penal, Civil y mas",
  },
  {
    value: 100,
    suffix: "%",
    label: "Deteccion de Infracciones",
    sub: "Analisis automatizado",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Disponibilidad del Sistema",
    sub: "Infraestructura en la nube",
  },
];

export function Metrics() {
  return (
    <section className="py-24 px-6 bg-jack-panel/30 border-y border-jack-gold/5">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-jack-gold/60 font-cinzel mb-4 block">
            Impacto
          </span>
          <h2 className="font-cinzel text-3xl md:text-4xl text-jack-white font-bold">
            Numeros que Respaldan Resultados
          </h2>
        </FadeIn>

        <StaggerChildren
          staggerDelay={0.15}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {metrics.map((metric) => (
            <StaggerItem key={metric.label}>
              <div className="group">
                <div className="font-cinzel text-4xl md:text-5xl font-bold text-jack-gold mb-3">
                  <AnimatedCounter
                    target={metric.value}
                    suffix={metric.suffix}
                  />
                </div>
                <p className="text-jack-white text-sm font-bold mb-1">
                  {metric.label}
                </p>
                <p className="text-jack-silver/40 text-xs">{metric.sub}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
