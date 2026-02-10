"use client";
import { Scale } from "lucide-react";
import Link from "next/link";

const productLinks = [
  { label: "Analista Laboral", href: "/laboral" },
  { label: "Expedientes", href: "/expedientes" },
  { label: "CRM Clientes", href: "/clientes" },
  { label: "Biblioteca Legal", href: "/codex" },
  { label: "Protocolo Notarial", href: "/protocolo" },
  { label: "Jurisprudencia", href: "/investigacion" },
];

const legalLinks = [
  { label: "Terminos de Servicio", href: "#" },
  { label: "Politica de Privacidad", href: "#" },
  { label: "Aviso Legal", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-jack-base border-t border-jack-gold/10 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-jack-plum/20 rounded border border-jack-gold/30">
                <Scale className="w-5 h-5 text-jack-gold" />
              </div>
              <div>
                <h3 className="text-lg font-cinzel font-bold text-jack-white tracking-[0.2em]">
                  GLAIVE
                </h3>
                <p className="text-[8px] text-jack-silver/40 uppercase tracking-[0.3em]">
                  Legal Platform
                </p>
              </div>
            </div>
            <p className="text-jack-silver/50 text-sm leading-relaxed mb-4">
              Plataforma de tecnologia juridica disenada para el ejercicio
              del derecho en Guatemala.
            </p>
            <p className="text-[10px] text-jack-gold/40 font-cinzel tracking-widest">
              ZIONAK LEGAL SYSTEMS
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-jack-gold/60 font-cinzel font-bold mb-4">
              Producto
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-jack-silver/50 hover:text-jack-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-jack-gold/60 font-cinzel font-bold mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-jack-silver/50 hover:text-jack-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-jack-gold/60 font-cinzel font-bold mb-4">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-jack-silver/50">
              <li>info@glaive.legal</li>
              <li>+502 2222-0000</li>
              <li>Ciudad de Guatemala, Guatemala</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-jack-gold/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-jack-silver/30 text-xs">
            &copy; 2026 Glaive Legal. Todos los derechos reservados.
          </p>
          <p className="text-jack-silver/20 text-[10px] font-cinzel tracking-widest">
            Zionak Legal Systems
          </p>
        </div>
      </div>
    </footer>
  );
}
