"use client";
import { useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqItems = [
  {
    question: "Como protege Glaive la confidencialidad de mis datos legales?",
    answer:
      "Toda la informacion almacenada en Glaive esta protegida con encriptacion SSL/TLS de extremo a extremo y politicas de Row Level Security (RLS) que aseguran que solo usted y los miembros autorizados de su bufete puedan acceder a sus datos. Nuestra infraestructura en la nube cumple con los mas altos estandares internacionales de seguridad y privacidad de datos.",
  },
  {
    question:
      "El analisis de IA del modulo laboral es confiable para presentar en audiencias?",
    answer:
      "El Analista Laboral de Glaive no reemplaza su criterio profesional, sino que lo complementa. El sistema identifica infracciones potenciales y cita textualmente los articulos del Codigo de Trabajo de Guatemala y legislacion aplicable. Cada resultado incluye la referencia legal exacta para que usted pueda verificarla y utilizarla como fundamento en sus escritos y audiencias.",
  },
  {
    question: "Cual es el modelo de precios de Glaive?",
    answer:
      "Glaive opera bajo un modelo de suscripcion mensual adaptado a las necesidades del mercado legal guatemalteco. Ofrecemos planes individuales para abogados independientes y planes para bufetes con multiples usuarios. Para conocer las opciones y precios vigentes, solicite una demostracion personalizada y nuestro equipo le presentara la propuesta que mejor se ajuste a su practica.",
  },
  {
    question: "Que tipo de soporte tecnico ofrecen?",
    answer:
      "Contamos con soporte tecnico por correo electronico y asistencia directa durante horario laboral guatemalteco. Ademas, cada nuevo usuario recibe un proceso de onboarding guiado para familiarizarse con todos los modulos de la plataforma. Nuestro equipo esta comprometido con su exito y el de su practica juridica.",
  },
  {
    question: "Glaive funciona en dispositivos moviles?",
    answer:
      "Si. Glaive es una aplicacion web progresiva (PWA) completamente responsiva. Puede acceder desde su computadora de escritorio, laptop, tablet o telefono movil con cualquier navegador moderno. Incluso puede instalar Glaive como aplicacion en su dispositivo para acceso rapido sin necesidad de descargar nada de una tienda de aplicaciones.",
  },
  {
    question: "Que codigos legales estan disponibles en la Biblioteca Legal?",
    answer:
      "Actualmente la plataforma incluye 5 codigos fundamentales del ordenamiento juridico guatemalteco: el Codigo de Trabajo, el Codigo Penal, el Codigo Civil, la Ley de Transito y la Constitucion Politica de la Republica. La busqueda es instantanea por palabra clave, numero de articulo o tema, y estamos en constante proceso de ampliacion de nuestra base de datos legal.",
  },
  {
    question: "Puedo migrar mis expedientes y datos actuales a Glaive?",
    answer:
      "Nuestro equipo ofrece asistencia personalizada durante el proceso de migracion para que pueda trasladar la informacion de sus casos y clientes existentes a la plataforma de manera ordenada. Durante la demostracion, evaluamos las necesidades especificas de su bufete para garantizar una transicion fluida.",
  },
  {
    question: "Necesito instalar algun software adicional para usar Glaive?",
    answer:
      "No. Glaive funciona completamente en la nube a traves de su navegador web. No requiere instalacion de software, no consume espacio en disco y las actualizaciones se aplican automaticamente. Solo necesita una conexion a internet y un navegador actualizado como Chrome, Firefox, Safari o Edge.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.35em] text-jack-gold border border-jack-gold/30 px-5 py-2 mb-6 font-cinzel">
              Preguntas Frecuentes
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-jack-white font-bold mb-4">
              Todo lo que Necesita{" "}
              <span className="text-gradient-gold">Saber</span>
            </h2>
            <p className="text-jack-silver/60 max-w-xl mx-auto">
              Respuestas a las consultas mas comunes sobre nuestra plataforma.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={0.08} className="flex flex-col gap-3">
          {faqItems.map((item, i) => (
            <StaggerItem key={i}>
              <div className="bg-jack-panel/50 border border-jack-gold/10 rounded-sm overflow-hidden hover:border-jack-gold/25 transition-colors duration-300">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full text-left flex items-center justify-between p-6 gap-4"
                >
                  <span className="font-cinzel text-sm md:text-base text-jack-white tracking-wide">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-jack-gold shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.3, ease: [0.25, 0.4, 0.25, 1] },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="border-t border-jack-gold/10 pt-4">
                          <p className="text-sm text-jack-silver/70 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
