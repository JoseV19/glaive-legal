"use client";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";
import { Bot, CheckCircle, AlertTriangle, Scale, ArrowRight } from "lucide-react";
import Link from "next/link";

const sampleResults = [
  {
    delay: 0.4,
    icon: AlertTriangle,
    color: "text-jack-crimson",
    borderColor: "border-l-jack-crimson",
    badge: "Infraccion Detectada",
    badgeColor: "bg-jack-crimson/20 text-jack-crimson",
    title: "Despido Injustificado",
    article: "Codigo de Trabajo - Art. 78",
    text: "El patrono no puede despedir sin causa justificada durante la vigencia del contrato.",
  },
  {
    delay: 0.7,
    icon: Scale,
    color: "text-jack-gold",
    borderColor: "border-l-jack-gold",
    badge: "Derecho Vulnerado",
    badgeColor: "bg-jack-gold/20 text-jack-gold",
    title: "Horas Extraordinarias No Pagadas",
    article: "Codigo de Trabajo - Art. 121",
    text: "Las horas extras deben remunerarse con un 50% adicional sobre el salario ordinario.",
  },
  {
    delay: 1.0,
    icon: AlertTriangle,
    color: "text-amber-400",
    borderColor: "border-l-amber-400",
    badge: "Obligacion Patronal",
    badgeColor: "bg-amber-900/20 text-amber-400",
    title: "Falta de Inscripcion al IGSS",
    article: "Ley Organica del IGSS - Art. 100",
    text: "Todo patrono esta obligado a inscribir a sus trabajadores al regimen de seguridad social.",
  },
];

export function AIDemo() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <FadeIn direction="right">
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-jack-crimson border border-jack-crimson/30 px-4 py-1.5 mb-6 font-cinzel">
              Herramienta Insignia
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-jack-white font-bold mb-6 leading-tight">
              Analista Laboral{" "}
              <span className="text-gradient-gold">de Ultima Generacion</span>
            </h2>
            <p className="text-jack-silver/70 mb-6 leading-relaxed">
              Pega el relato de tu cliente o la transcripcion de un chat y
              nuestro motor juridico identifica
              automaticamente infracciones laborales, derechos vulnerados y
              articulos legales aplicables.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Deteccion automatica de infracciones laborales",
                "Citas textuales del Codigo de Trabajo",
                "Analisis de chats de WhatsApp y narrativas",
                "Exportacion a PDF para expedientes",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-jack-silver/80"
                >
                  <CheckCircle className="w-4 h-4 text-jack-gold mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/laboral"
              className="inline-flex items-center gap-2 btn-shimmer bg-jack-crimson text-jack-white px-6 py-3 font-cinzel tracking-widest text-sm border border-jack-gold/20 hover:shadow-[0_0_30px_rgba(122,31,46,0.4)] transition-all"
            >
              PROBAR AHORA <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>

          {/* Right: Animated Mockup */}
          <FadeIn direction="left" delay={0.2}>
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-jack-crimson/5 rounded-lg blur-2xl" />

              <div className="relative bg-jack-panel border border-jack-gold/20 rounded-sm p-6 shadow-2xl animate-pulse-glow">
                {/* Mockup Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-jack-gold/10">
                  <div className="p-2 bg-jack-crimson/20 rounded border border-jack-crimson/30">
                    <Bot className="w-5 h-5 text-jack-crimson" />
                  </div>
                  <div>
                    <p className="text-jack-white text-sm font-bold font-cinzel">
                      Analista Laboral
                    </p>
                    <p className="text-[10px] text-jack-silver/40">
                      Motor de deteccion v2.0
                    </p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-jack-crimson" />
                    <div className="w-2 h-2 rounded-full bg-jack-gold" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Fake Textarea */}
                <div className="bg-jack-base/80 border border-jack-gold/10 rounded-sm p-4 mb-5 text-sm text-jack-silver/60 italic leading-relaxed">
                  &ldquo;Mi jefe no me paga horas extra desde hace 6 meses y me
                  despidieron sin causa justa. Tampoco me inscribieron al
                  IGSS...&rdquo;
                </div>

                {/* Animated Results */}
                <div className="space-y-3">
                  {sampleResults.map((result, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        delay: result.delay,
                        duration: 0.5,
                        ease: [0.25, 0.4, 0.25, 1],
                      }}
                      className={`bg-jack-base/60 border border-jack-gold/10 rounded-sm p-4 border-l-4 ${result.borderColor}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <result.icon
                            className={`w-4 h-4 ${result.color}`}
                          />
                          <span className="text-jack-white text-sm font-bold">
                            {result.title}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold ${result.badgeColor}`}
                        >
                          {result.badge}
                        </span>
                      </div>
                      <p className="text-jack-gold text-xs font-cinzel mb-1">
                        {result.article}
                      </p>
                      <p className="text-jack-silver/50 text-xs leading-relaxed">
                        {result.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
