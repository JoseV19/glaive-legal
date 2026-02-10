"use client";
import { FadeIn } from "@/components/animations/FadeIn";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-jack-crimson/15 via-jack-base to-jack-plum/15" />

      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-jack-crimson/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <FadeIn>
          <h2 className="font-cinzel text-3xl md:text-5xl text-jack-white font-bold mb-6 leading-tight">
            Moderniza tu Practica{" "}
            <span className="text-gradient-gold">Legal Hoy</span>
          </h2>
          <p className="text-jack-silver/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Confia en la plataforma que esta redefiniendo el ejercicio
            juridico en Guatemala.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="btn-shimmer bg-jack-crimson text-jack-white px-8 py-4 font-cinzel tracking-[0.2em] text-sm border border-jack-gold/20 hover:shadow-[0_0_40px_rgba(122,31,46,0.5)] transition-all flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              COMENZAR AHORA <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="border border-jack-gold/40 text-jack-gold px-8 py-4 font-cinzel tracking-[0.2em] text-sm hover:bg-jack-gold/10 transition-all w-full sm:w-auto text-center"
            >
              SOLICITAR DEMO
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
