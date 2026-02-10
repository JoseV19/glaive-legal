"use client";
import { Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TerminosPage() {
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
          Terminos de Servicio
        </h1>
        <p className="text-jack-silver/40 text-sm mb-12">
          Ultima actualizacion: Febrero 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-jack-silver/70">
          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              1. Objeto del Servicio
            </h2>
            <p>
              Glaive es una plataforma de tecnologia juridica desarrollada y
              operada por ZIONAK LEGAL SYSTEMS (en adelante, "la Empresa"),
              disenada para asistir a profesionales del derecho en Guatemala en
              la gestion de expedientes, analisis de casos laborales, consulta
              de legislacion vigente y redaccion de documentos notariales.
            </p>
            <p className="mt-3">
              Al acceder o utilizar la plataforma Glaive (en adelante, "el
              Servicio"), usted acepta estar sujeto a los presentes Terminos de
              Servicio. Si no esta de acuerdo con alguno de estos terminos, no
              utilice el Servicio.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              2. Registro y Cuenta de Usuario
            </h2>
            <p>
              Para utilizar el Servicio, usted debera crear una cuenta
              proporcionando informacion veraz, completa y actualizada. Es
              responsable de mantener la confidencialidad de sus credenciales de
              acceso y de todas las actividades que ocurran bajo su cuenta.
            </p>
            <p className="mt-3">
              Usted se compromete a notificar de inmediato a la Empresa sobre
              cualquier uso no autorizado de su cuenta o cualquier otra
              violacion de seguridad de la que tenga conocimiento.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              3. Uso Aceptable
            </h2>
            <p>El usuario se compromete a:</p>
            <ul className="mt-3 space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                Utilizar el Servicio unicamente para fines profesionales
                legitimos relacionados con el ejercicio del derecho.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                No intentar acceder a datos de otros usuarios o comprometer la
                seguridad de la plataforma.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                No reproducir, distribuir o comercializar el contenido de la
                plataforma sin autorizacion expresa.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jack-gold mt-1">•</span>
                No utilizar el Servicio para actividades ilegales o contrarias
                al orden publico guatemalteco.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              4. Propiedad Intelectual
            </h2>
            <p>
              Todos los derechos de propiedad intelectual sobre la plataforma
              Glaive, incluyendo su diseno, codigo fuente, logotipos, marcas,
              algoritmos de analisis y contenido original, son propiedad
              exclusiva de ZIONAK LEGAL SYSTEMS.
            </p>
            <p className="mt-3">
              Los textos legales, codigos y legislacion guatemalteca incluidos
              en la Biblioteca Legal son de dominio publico. La Empresa no
              reclama propiedad sobre estos textos, pero si sobre la forma en
              que estan organizados, indexados y presentados dentro de la
              plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              5. Limitacion de Responsabilidad
            </h2>
            <p>
              El Servicio es una herramienta de asistencia tecnologica y no
              constituye asesoria legal. Los resultados generados por los
              modulos de analisis, incluyendo el Analista Laboral con
              inteligencia artificial, son de caracter orientativo y no
              sustituyen el criterio profesional del abogado.
            </p>
            <p className="mt-3">
              La Empresa no sera responsable por decisiones legales tomadas con
              base en los resultados de la plataforma. El usuario es el unico
              responsable de verificar la exactitud y aplicabilidad de toda
              informacion proporcionada por el Servicio.
            </p>
            <p className="mt-3">
              En ningun caso la responsabilidad total de la Empresa excedera el
              monto pagado por el usuario en concepto de suscripcion durante los
              doce (12) meses anteriores al evento que genere la reclamacion.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              6. Suscripcion y Pagos
            </h2>
            <p>
              El acceso al Servicio requiere una suscripcion mensual activa.
              Los precios y planes disponibles seran comunicados al momento del
              registro o a traves de nuestro equipo comercial. La Empresa se
              reserva el derecho de modificar los precios con un aviso previo
              de treinta (30) dias.
            </p>
            <p className="mt-3">
              La cancelacion de la suscripcion no genera derecho a reembolso
              por el periodo ya pagado. Al finalizar el periodo de suscripcion,
              el acceso al Servicio sera suspendido hasta que se renueve el
              pago.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              7. Modificaciones
            </h2>
            <p>
              La Empresa se reserva el derecho de modificar estos Terminos de
              Servicio en cualquier momento. Las modificaciones seran
              notificadas a traves de la plataforma o por correo electronico.
              El uso continuado del Servicio despues de la notificacion
              constituye aceptacion de los terminos modificados.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              8. Terminacion
            </h2>
            <p>
              La Empresa podra suspender o cancelar el acceso al Servicio en
              caso de incumplimiento de estos Terminos, sin perjuicio de las
              acciones legales que correspondan. El usuario podra cancelar su
              cuenta en cualquier momento contactando a nuestro equipo de
              soporte.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              9. Ley Aplicable y Jurisdiccion
            </h2>
            <p>
              Los presentes Terminos se regiran e interpretaran de conformidad
              con las leyes de la Republica de Guatemala. Para cualquier
              controversia derivada de estos Terminos o del uso del Servicio,
              las partes se someten a la jurisdiccion de los tribunales
              competentes de la ciudad de Guatemala, renunciando a cualquier
              otro fuero que pudiera corresponderles.
            </p>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-jack-white font-semibold mb-4 tracking-wide">
              10. Contacto
            </h2>
            <p>
              Para cualquier consulta relacionada con estos Terminos de
              Servicio, puede contactarnos a traves de:
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
