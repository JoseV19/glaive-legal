"use client";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import {
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Globe,
  DollarSign,
  RefreshCw,
  FolderOpen,
} from "lucide-react";

const categories = [
  {
    icon: Clock,
    label: "Tiempo de Investigacion",
    traditional: "Horas revisando codigos impresos y fuentes dispersas",
    glaive: "Busqueda instantanea en 5 codigos con resultados en segundos",
  },
  {
    icon: Target,
    label: "Precision Legal",
    traditional: "Riesgo de omitir articulos o infracciones relevantes",
    glaive: "Deteccion automatica de infracciones con citas textuales",
  },
  {
    icon: Globe,
    label: "Accesibilidad",
    traditional: "Documentos fisicos limitados a la oficina",
    glaive: "Plataforma en la nube accesible desde cualquier dispositivo",
  },
  {
    icon: DollarSign,
    label: "Costo Operativo",
    traditional: "Gastos en papel, impresion, almacenamiento fisico y tiempo",
    glaive: "Suscripcion mensual que consolida todas las herramientas",
  },
  {
    icon: RefreshCw,
    label: "Actualizaciones Legales",
    traditional:
      "Comprar nuevas ediciones de codigos y actualizarse manualmente",
    glaive: "Base de datos actualizada de forma continua y automatica",
  },
  {
    icon: FolderOpen,
    label: "Organizacion de Casos",
    traditional:
      "Expedientes en carpetas fisicas, dificil de buscar y rastrear",
    glaive: "CRM digital con filtros, estados y vinculacion entre modulos",
  },
];

export function Comparison() {
  return (
    <section id="comparativa" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.35em] text-jack-gold border border-jack-gold/30 px-5 py-2 mb-6 font-cinzel">
              Comparativa
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-jack-white font-bold mb-4">
              Metodo Tradicional vs{" "}
              <span className="text-gradient-gold">Con Glaive</span>
            </h2>
            <p className="text-jack-silver/60 max-w-xl mx-auto">
              Descubra como Glaive transforma cada aspecto de su practica
              juridica.
            </p>
          </div>
        </FadeIn>

        {/* Column headers */}
        <FadeIn>
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr] gap-4 mb-4 px-6">
            <div />
            <p className="text-xs uppercase tracking-[0.2em] text-jack-silver/40 font-cinzel text-center">
              Metodo Tradicional
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-jack-gold/60 font-cinzel text-center">
              Con Glaive
            </p>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={0.1} className="flex flex-col gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <StaggerItem key={cat.label}>
                <div className="bg-jack-panel/50 border border-jack-gold/10 rounded-sm p-6 hover:border-jack-gold/25 transition-all duration-300">
                  {/* Mobile layout */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="w-5 h-5 text-jack-gold" />
                      <h3 className="font-cinzel text-sm text-jack-white tracking-wide font-semibold">
                        {cat.label}
                      </h3>
                    </div>
                    <div className="flex items-start gap-3 mb-3 pl-2">
                      <XCircle className="w-4 h-4 text-jack-crimson/60 mt-0.5 shrink-0" />
                      <p className="text-sm text-jack-silver/50">
                        {cat.traditional}
                      </p>
                    </div>
                    <div className="flex items-start gap-3 pl-2">
                      <CheckCircle className="w-4 h-4 text-jack-gold mt-0.5 shrink-0" />
                      <p className="text-sm text-jack-white/80">
                        {cat.glaive}
                      </p>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-jack-gold" />
                      <h3 className="font-cinzel text-sm text-jack-white tracking-wide font-semibold">
                        {cat.label}
                      </h3>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-jack-crimson/60 mt-0.5 shrink-0" />
                      <p className="text-sm text-jack-silver/50">
                        {cat.traditional}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-jack-gold mt-0.5 shrink-0" />
                      <p className="text-sm text-jack-white/80">
                        {cat.glaive}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
