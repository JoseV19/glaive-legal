"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Glaive transformo la forma en que analizo casos laborales. Lo que antes me tomaba horas de investigacion, ahora lo resuelvo en minutos con el Analista Avanzado.",
    name: "Lic. Maria Fernanda Lopez",
    role: "Abogada Laboralista",
    firm: "Bufete Lopez & Asociados",
  },
  {
    quote:
      "La biblioteca de codigos legales es imprescindible. Tener acceso instantaneo a los 5 codigos con busqueda inteligente nos da una ventaja real en audiencias.",
    name: "Lic. Carlos Eduardo Mendez",
    role: "Notario",
    firm: "Notaria Mendez",
  },
  {
    quote:
      "El modulo de expedientes y el CRM de clientes nos permitieron digitalizar nuestro bufete por completo. La integracion entre modulos es excepcional.",
    name: "Dr. Roberto Jose Alvarez",
    role: "Director Juridico",
    firm: "Corporacion Legal Guatemala",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-jack-gold/60 font-cinzel mb-4 block">
            Testimonios
          </span>
          <h2 className="font-cinzel text-3xl md:text-4xl text-jack-white font-bold">
            Lo que Dicen Nuestros Usuarios
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="relative">
            {/* Quote decoration */}
            <Quote className="absolute -top-4 left-4 md:left-8 w-16 h-16 text-jack-gold/10" />

            <div className="bg-jack-panel/50 border border-jack-gold/10 rounded-sm p-8 md:p-12 min-h-[280px] flex items-center overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                  className="text-center w-full"
                >
                  <p className="text-jack-white text-lg md:text-xl font-serif italic leading-relaxed mb-8 max-w-2xl mx-auto">
                    &ldquo;{testimonials[current].quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-jack-gold font-cinzel font-bold tracking-wider text-sm">
                      {testimonials[current].name}
                    </p>
                    <p className="text-jack-silver/50 text-xs mt-1">
                      {testimonials[current].role} &mdash;{" "}
                      {testimonials[current].firm}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={prev}
                className="p-2 border border-jack-gold/20 text-jack-silver/50 hover:text-jack-gold hover:border-jack-gold/40 transition-all rounded-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > current ? 1 : -1);
                      setCurrent(i);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === current
                        ? "bg-jack-gold w-6"
                        : "bg-jack-silver/20 hover:bg-jack-silver/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2 border border-jack-gold/20 text-jack-silver/50 hover:text-jack-gold hover:border-jack-gold/40 transition-all rounded-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
