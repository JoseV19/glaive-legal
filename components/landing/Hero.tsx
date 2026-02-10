"use client";
import { FadeIn } from "@/components/animations/FadeIn";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, #1F2533 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, #3E2034 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #0B0A12 0%, #0B0A12 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Dot grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #Cfb568 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-jack-crimson/5 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-20">
        <FadeIn delay={0.1}>
          <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.35em] text-jack-gold border border-jack-gold/30 px-5 py-2 mb-8 font-cinzel">
            Tecnologia Legal de Vanguardia para Guatemala
          </span>
        </FadeIn>

        <FadeIn delay={0.25}>
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-jack-white leading-[1.1] mb-6">
            Precision y Elegancia{" "}
            <span className="text-gradient-gold">al Servicio</span>{" "}
            del Derecho
          </h1>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-jack-silver/80 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Analiza casos laborales, gestiona expedientes y consulta los 5
            codigos legales de Guatemala. Todo desde una sola plataforma
            disenada para el abogado moderno.
          </p>
        </FadeIn>

        <FadeIn delay={0.55}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="btn-shimmer bg-jack-crimson text-jack-white px-8 py-4 font-cinzel tracking-[0.2em] text-sm border border-jack-gold/20 hover:shadow-[0_0_40px_rgba(122,31,46,0.5)] transition-all w-full sm:w-auto text-center"
            >
              COMENZAR AHORA
            </Link>
            <button
              onClick={() =>
                document
                  .getElementById("contacto")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border border-jack-gold/40 text-jack-gold px-8 py-4 font-cinzel tracking-[0.2em] text-sm hover:bg-jack-gold/10 transition-all w-full sm:w-auto"
            >
              SOLICITAR DEMO
            </button>
          </div>
        </FadeIn>

        {/* Scroll indicator */}
        <FadeIn delay={0.8}>
          <div className="mt-16 md:mt-24 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-jack-silver/30">
              Explorar
            </span>
            <ChevronDown className="w-5 h-5 text-jack-gold/40 animate-bounce" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
