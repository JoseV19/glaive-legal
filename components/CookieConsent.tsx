"use client";
import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-[slideUp_0.4s_ease-out]">
      <div className="max-w-3xl mx-auto bg-jack-panel border border-jack-gold/20 rounded-sm p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
        <Cookie className="w-5 h-5 text-jack-gold shrink-0 hidden sm:block" />
        <p className="text-xs text-jack-silver/70 leading-relaxed flex-1">
          Utilizamos cookies y almacenamiento local para mejorar su experiencia
          en la plataforma. Al continuar navegando, acepta nuestro uso de estas
          tecnologias. Consulte nuestra{" "}
          <Link
            href="/privacidad"
            className="text-jack-gold hover:underline"
          >
            Politica de Privacidad
          </Link>{" "}
          para mas informacion.
        </p>
        <button
          onClick={handleAccept}
          className="bg-jack-crimson text-jack-white px-5 py-2 text-xs font-cinzel tracking-widest border border-jack-gold/20 hover:shadow-[0_0_20px_rgba(122,31,46,0.4)] transition-all shrink-0"
        >
          ACEPTAR
        </button>
      </div>
    </div>
  );
}
