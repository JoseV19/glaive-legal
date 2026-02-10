"use client";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { ShieldCheck, Lock, Cloud, Scale } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    label: "Conexion Encriptada",
    sub: "SSL/TLS End-to-End",
  },
  {
    icon: Lock,
    label: "Datos Protegidos",
    sub: "Row Level Security",
  },
  {
    icon: Cloud,
    label: "Infraestructura Cloud",
    sub: "Alta disponibilidad",
  },
  {
    icon: Scale,
    label: "Cumplimiento Legal",
    sub: "Normativa guatemalteca",
  },
];

export function SecurityBadges() {
  return (
    <section className="py-20 px-6 border-y border-jack-gold/5">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-12">
          <h2 className="font-cinzel text-2xl md:text-3xl text-jack-white font-bold mb-3">
            Seguridad y Confianza
          </h2>
          <p className="text-jack-silver/50 text-sm">
            Tu informacion legal protegida con los mas altos estandares.
          </p>
        </FadeIn>

        <StaggerChildren
          staggerDelay={0.1}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {badges.map((badge) => (
            <StaggerItem key={badge.label}>
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full border border-jack-gold/20 flex items-center justify-center mb-4 group-hover:border-jack-gold/40 group-hover:bg-jack-gold/5 transition-all">
                  <badge.icon className="w-7 h-7 text-jack-gold/60 group-hover:text-jack-gold transition-colors" />
                </div>
                <p className="text-jack-white text-sm font-bold mb-1">
                  {badge.label}
                </p>
                <p className="text-jack-silver/40 text-xs">{badge.sub}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
