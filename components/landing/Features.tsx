"use client";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import {
  Bot,
  FolderOpen,
  Users,
  BookOpen,
  FileText,
  Search,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Bot,
    title: "Analista Laboral Avanzado",
    description:
      "Detecta infracciones automaticamente a partir de narrativas de clientes. Cita textual de articulos del Codigo de Trabajo.",
    color: "text-jack-crimson",
    bg: "bg-jack-crimson/10",
    border: "border-jack-crimson/20",
    href: "/laboral",
  },
  {
    icon: FolderOpen,
    title: "Gestion de Expedientes",
    description:
      "Administra tus casos con filtros inteligentes, estados y vinculacion directa a clientes. Respaldado en la nube.",
    color: "text-blue-400",
    bg: "bg-blue-900/10",
    border: "border-blue-900/20",
    href: "/expedientes",
  },
  {
    icon: Users,
    title: "CRM de Clientes",
    description:
      "Directorio completo de personas individuales y juridicas con seguimiento de estado y vinculacion a casos.",
    color: "text-jack-gold",
    bg: "bg-jack-gold/10",
    border: "border-jack-gold/20",
    href: "/clientes",
  },
  {
    icon: BookOpen,
    title: "Biblioteca Legal",
    description:
      "Busqueda instantanea en 5 codigos legales guatemaltecos: Trabajo, Penal, Civil, Transito y Constitucional.",
    color: "text-emerald-400",
    bg: "bg-emerald-900/10",
    border: "border-emerald-900/20",
    href: "/codex",
  },
  {
    icon: FileText,
    title: "Protocolo Notarial",
    description:
      "Editor WYSIWYG optimizado para impresion con formato protocolar, lineas guia y numeracion automatica.",
    color: "text-purple-400",
    bg: "bg-purple-900/10",
    border: "border-purple-900/20",
    href: "/protocolo",
  },
  {
    icon: Search,
    title: "Jurisprudencia",
    description:
      "Base de datos de sentencias y precedentes judiciales para fundamentar tus argumentos legales.",
    color: "text-amber-400",
    bg: "bg-amber-900/10",
    border: "border-amber-900/20",
    href: "/investigacion",
  },
];

export function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-jack-gold/60 font-cinzel mb-4 block">
            Funcionalidades
          </span>
          <h2 className="font-cinzel text-3xl md:text-4xl text-jack-white font-bold mb-4">
            Herramientas que Transforman tu Practica
          </h2>
          <p className="text-jack-silver/60 max-w-xl mx-auto">
            Cada modulo fue disenado especificamente para el ejercicio del
            derecho en Guatemala.
          </p>
        </FadeIn>

        <StaggerChildren
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Link href={feature.href} className="block group h-full">
                <div
                  className={`${feature.border} border bg-jack-panel/50 p-8 rounded-sm h-full hover:border-jack-gold/30 hover:-translate-y-1 transition-all duration-300`}
                >
                  <div
                    className={`${feature.bg} ${feature.border} border w-14 h-14 rounded-sm flex items-center justify-center mb-5`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-jack-white font-cinzel font-bold text-lg mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-jack-silver/60 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <span className="text-jack-gold text-xs font-cinzel tracking-wider flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar{" "}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
