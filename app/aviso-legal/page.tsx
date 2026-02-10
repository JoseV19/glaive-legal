"use client";
import { Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AvisoLegalPage() {
  return (
    <div className="bg-jack-base text-jack-silver h-screen overflow-y-auto">
      {/* Header */}
      <header className="border-b border-jack-gold/10 bg-jack-base/95 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="p-1.5 bg-jack-plum/20 rounded border border-jack-gold/30">
              <Scale className="w-4 h-4 text-jack-gold" />
            </div>
            <span className="text-sm font-cinzel font-bold text-jack-white tracking-[0.2em]">
              GLAIVE
            </span>
          </Link>
          <Link
            href="/landing"
            className="flex items-center gap-2 text-sm text-jack-silver/50 hover:text-jack-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-cinzel text-3xl md:text-4xl text-jack-white font-bold mb-2">
          Aviso Legal
        </h1>
        <p className="text-jack-silver/40 text-sm mb-12">
          Ultima actualizacion: Febrero 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-jack-silver/70">
          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              1. Titularidad del Sitio
            </h2>
            <p>
              El presente sitio web y la plataforma Glaive son propiedad y estan
              operados por ZIONAK LEGAL SYSTEMS, con domicilio en la ciudad de
              Guatemala, Republica de Guatemala.
            </p>
            <div className="mt-3 p-4 bg-jack-panel/50 border border-jack-gold/10 rounded-sm">
              <p className="text-jack-white font-semibold">
                ZIONAK LEGAL SYSTEMS
              </p>
              <p className="mt-1">Correo: info@glaive.legal</p>
              <p>Telefono: +502 2222-0000</p>
              <p>Ciudad de Guatemala, Guatemala</p>
            </div>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              2. Naturaleza del Servicio
            </h2>
            <p>
              Glaive es una herramienta tecnologica de asistencia para
              profesionales del derecho. La plataforma facilita la gestion de
              expedientes, analisis de situaciones laborales, consulta de
              legislacion y redaccion de documentos.
            </p>
            <p className="mt-3 p-4 bg-jack-crimson/10 border border-jack-crimson/20 rounded-sm text-jack-white">
              <strong>Importante:</strong> Glaive no es un despacho de abogados,
              no proporciona asesoria legal y no establece relacion
              abogado-cliente con sus usuarios. Los resultados generados por la
              plataforma, incluyendo los analisis de inteligencia artificial, son
              de caracter informativo y orientativo, y no constituyen opinion
              legal vinculante.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              3. Exclusion de Garantias
            </h2>
            <p>
              El Servicio se proporciona "tal cual" y "segun disponibilidad". La
              Empresa no garantiza que:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                El Servicio funcione de manera ininterrumpida o libre de
                errores.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Los resultados del analisis de inteligencia artificial sean
                completos, exactos o actualizados en todo momento.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                La base de datos legal refleje la version mas reciente de
                todas las reformas legislativas.
              </li>
            </ul>
            <p className="mt-3">
              Es responsabilidad exclusiva del profesional del derecho verificar
              toda informacion legal antes de utilizarla en procedimientos
              judiciales o extrajudiciales.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              4. Limitacion de Responsabilidad
            </h2>
            <p>
              ZIONAK LEGAL SYSTEMS no sera responsable por danos directos,
              indirectos, incidentales, especiales o consecuentes que resulten
              del uso o la imposibilidad de uso de la plataforma, incluyendo
              pero no limitado a:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Perdida de datos o informacion almacenada en la plataforma.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Resultados adversos en procedimientos legales basados en
                informacion obtenida a traves del Servicio.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Interrupciones del servicio por mantenimiento o causas de
                fuerza mayor.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              5. Propiedad Intelectual
            </h2>
            <p>
              Todos los elementos de la plataforma Glaive, incluyendo el
              diseno, marca, logotipos, interfaz de usuario, algoritmos y codigo
              fuente, estan protegidos por las leyes de propiedad intelectual de
              Guatemala y tratados internacionales aplicables.
            </p>
            <p className="mt-3">
              Queda prohibida la reproduccion, distribucion, modificacion o uso
              comercial de cualquier elemento de la plataforma sin la
              autorizacion previa y por escrito de ZIONAK LEGAL SYSTEMS.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              6. Enlaces Externos
            </h2>
            <p>
              La plataforma puede contener enlaces a sitios web de terceros. La
              Empresa no se responsabiliza por el contenido, politicas de
              privacidad o practicas de dichos sitios. El acceso a enlaces
              externos se realiza bajo la exclusiva responsabilidad del usuario.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              7. Legislacion sobre Datos Personales
            </h2>
            <p>
              El tratamiento de datos personales se rige por lo dispuesto en
              nuestra{" "}
              <Link
                href="/privacidad"
                className="text-jack-gold hover:underline"
              >
                Politica de Privacidad
              </Link>{" "}
              y la legislacion guatemalteca aplicable en materia de proteccion
              de datos.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              8. Jurisdiccion
            </h2>
            <p>
              El presente Aviso Legal se rige por las leyes de la Republica de
              Guatemala. Cualquier controversia sera sometida a la jurisdiccion
              de los tribunales competentes de la ciudad de Guatemala.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-jack-gold/10 py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-jack-silver/30 text-xs">
            &copy; 2026 Glaive Legal. Todos los derechos reservados.
          </p>
          <p className="text-jack-silver/20 text-[10px] font-cinzel tracking-widest">
            Zionak Legal Systems
          </p>
        </div>
      </footer>
    </div>
  );
}
