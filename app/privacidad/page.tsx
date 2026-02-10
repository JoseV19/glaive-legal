"use client";
import { Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacidadPage() {
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
          Politica de Privacidad
        </h1>
        <p className="text-jack-silver/40 text-sm mb-12">
          Ultima actualizacion: Febrero 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-jack-silver/70">
          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              1. Informacion General
            </h2>
            <p>
              ZIONAK LEGAL SYSTEMS (en adelante, "la Empresa") se compromete a
              proteger la privacidad de los usuarios de la plataforma Glaive.
              Esta Politica de Privacidad describe como recopilamos, utilizamos,
              almacenamos y protegemos su informacion personal cuando utiliza
              nuestro Servicio.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              2. Datos que Recopilamos
            </h2>
            <p>Recopilamos los siguientes tipos de informacion:</p>
            <ul className="mt-3 space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                <span>
                  <strong className="text-jack-white">
                    Datos de registro:
                  </strong>{" "}
                  nombre completo, correo electronico, numero de telefono,
                  nombre del bufete o firma legal.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                <span>
                  <strong className="text-jack-white">
                    Datos profesionales:
                  </strong>{" "}
                  informacion de expedientes, clientes, documentos y notas que
                  usted ingrese en la plataforma.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                <span>
                  <strong className="text-jack-white">Datos de uso:</strong>{" "}
                  informacion sobre como interactua con la plataforma,
                  incluyendo paginas visitadas, funciones utilizadas y tiempo de
                  uso.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                <span>
                  <strong className="text-jack-white">Datos tecnicos:</strong>{" "}
                  direccion IP, tipo de navegador, sistema operativo y
                  dispositivo utilizado.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              3. Como Utilizamos sus Datos
            </h2>
            <p>Utilizamos su informacion para:</p>
            <ul className="mt-3 space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Proveer, mantener y mejorar el Servicio.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Personalizar su experiencia dentro de la plataforma.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Procesar pagos y gestionar su suscripcion.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Enviar comunicaciones relacionadas con el Servicio, incluyendo
                notificaciones y actualizaciones.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Cumplir con obligaciones legales aplicables en Guatemala.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              4. Cookies y Tecnologias Similares
            </h2>
            <p>
              Glaive utiliza cookies y tecnologias de almacenamiento local para:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Mantener su sesion activa mientras utiliza la plataforma.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Recordar sus preferencias y configuraciones.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Analizar el uso de la plataforma para mejorar su funcionamiento.
              </li>
            </ul>
            <p className="mt-3">
              Usted puede configurar su navegador para rechazar cookies, aunque
              esto podria afectar la funcionalidad de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              5. Almacenamiento y Seguridad
            </h2>
            <p>
              Sus datos se almacenan en servidores seguros en la nube con
              encriptacion SSL/TLS en transito y en reposo. Implementamos
              politicas de Row Level Security (RLS) que garantizan que cada
              usuario solo pueda acceder a sus propios datos.
            </p>
            <p className="mt-3">
              Aunque tomamos medidas razonables para proteger su informacion,
              ningun sistema de transmision o almacenamiento de datos es
              completamente seguro. No podemos garantizar la seguridad absoluta
              de sus datos.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              6. Compartir Datos con Terceros
            </h2>
            <p>
              No vendemos, alquilamos ni compartimos su informacion personal con
              terceros para fines comerciales. Podemos compartir datos
              unicamente en los siguientes casos:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                <span>
                  <strong className="text-jack-white">
                    Proveedores de servicio:
                  </strong>{" "}
                  servicios de alojamiento en la nube, procesamiento de pagos y
                  soporte tecnico, bajo estrictos acuerdos de confidencialidad.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                <span>
                  <strong className="text-jack-white">
                    Requerimientos legales:
                  </strong>{" "}
                  cuando sea requerido por ley, orden judicial o autoridad
                  competente de la Republica de Guatemala.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              7. Derechos del Usuario
            </h2>
            <p>Usted tiene derecho a:</p>
            <ul className="mt-3 space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Acceder a los datos personales que tenemos sobre usted.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Solicitar la correccion de datos inexactos o incompletos.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Solicitar la eliminacion de sus datos personales, sujeto a
                obligaciones legales de retencion.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Exportar sus datos en un formato estructurado y de uso comun.
              </li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, contactenos a traves de
              los medios indicados al final de esta politica.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              8. Retencion de Datos
            </h2>
            <p>
              Conservamos sus datos personales mientras su cuenta permanezca
              activa o mientras sea necesario para proveer el Servicio. Tras la
              cancelacion de su cuenta, sus datos seran eliminados en un plazo
              de noventa (90) dias, salvo que la ley exija su conservacion por
              un periodo mayor.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              9. Cambios a esta Politica
            </h2>
            <p>
              Nos reservamos el derecho de actualizar esta Politica de
              Privacidad periodicamente. Cualquier cambio sera notificado a
              traves de la plataforma o por correo electronico con al menos
              quince (15) dias de anticipacion. El uso continuado del Servicio
              tras la notificacion constituye aceptacion de la politica
              actualizada.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              10. Contacto
            </h2>
            <p>
              Para consultas sobre privacidad o para ejercer sus derechos,
              contactenos:
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
