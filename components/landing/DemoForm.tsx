"use client";
import { useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  Presentation,
  Users,
  FileSearch,
  Calendar,
} from "lucide-react";

const demoIncludes = [
  {
    icon: Presentation,
    text: "Recorrido completo por todos los modulos",
  },
  {
    icon: FileSearch,
    text: "Demostracion en vivo del Analista Laboral",
  },
  {
    icon: Users,
    text: "Evaluacion de necesidades de su bufete",
  },
  {
    icon: Calendar,
    text: "Propuesta de plan personalizado",
  },
];

export function DemoForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    firm: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demo request:", form);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const inputClasses =
    "w-full bg-jack-base/80 border border-jack-gold/10 rounded-sm px-4 py-3 text-jack-white text-sm placeholder:text-jack-silver/30 focus:border-jack-gold/40 focus:outline-none transition-colors";

  return (
    <section
      id="contacto"
      className="py-24 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-jack-plum/10 via-jack-base to-jack-crimson/10" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.35em] text-jack-gold border border-jack-gold/30 px-5 py-2 mb-6 font-cinzel">
              Agenda tu Demostracion
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-jack-white font-bold mb-4">
              Descubra Glaive{" "}
              <span className="text-gradient-gold">en Accion</span>
            </h2>
            <p className="text-jack-silver/60 max-w-xl mx-auto">
              Solicite una demostracion personalizada y vea como Glaive puede
              transformar su practica juridica.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: what the demo includes */}
          <FadeIn direction="left" delay={0.1}>
            <div>
              <h3 className="font-cinzel text-xl text-jack-white font-semibold mb-6 tracking-wide">
                Que Incluye la Demostracion
              </h3>
              <div className="flex flex-col gap-5">
                {demoIncludes.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="p-2.5 bg-jack-plum/20 rounded border border-jack-gold/20 shrink-0">
                        <Icon className="w-5 h-5 text-jack-gold" />
                      </div>
                      <p className="text-jack-silver/80 text-sm leading-relaxed pt-2">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 p-5 bg-jack-panel/30 border border-jack-gold/10 rounded-sm">
                <p className="text-jack-silver/50 text-xs leading-relaxed">
                  Nuestro equipo se pondra en contacto con usted dentro de las
                  proximas 24 horas habiles para coordinar la demostracion en el
                  horario que mejor le convenga.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Right: form */}
          <FadeIn direction="right" delay={0.2}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-jack-panel/50 border border-jack-gold/10 rounded-sm p-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-jack-silver/50 mb-2 uppercase tracking-wider">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Lic. Juan Perez"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-jack-silver/50 mb-2 uppercase tracking-wider">
                        Correo Electronico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="correo@bufete.com"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-jack-silver/50 mb-2 uppercase tracking-wider">
                        Telefono *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+502 5555-0000"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-jack-silver/50 mb-2 uppercase tracking-wider">
                        Nombre del Bufete *
                      </label>
                      <input
                        type="text"
                        name="firm"
                        required
                        value={form.firm}
                        onChange={handleChange}
                        placeholder="Bufete Perez & Asociados"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs text-jack-silver/50 mb-2 uppercase tracking-wider">
                      Mensaje (Opcional)
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Cuentenos sobre su practica y necesidades..."
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-shimmer w-full bg-jack-crimson text-jack-white px-8 py-4 font-cinzel tracking-[0.2em] text-sm border border-jack-gold/20 hover:shadow-[0_0_40px_rgba(122,31,46,0.5)] transition-all flex items-center justify-center gap-3"
                  >
                    SOLICITAR DEMOSTRACION
                    <Send className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="bg-jack-panel/50 border border-jack-gold/10 rounded-sm p-12 flex flex-col items-center text-center"
                >
                  <div className="p-4 bg-jack-gold/10 rounded-full mb-6">
                    <CheckCircle className="w-10 h-10 text-jack-gold" />
                  </div>
                  <h3 className="font-cinzel text-xl text-jack-white font-semibold mb-4 tracking-wide">
                    Solicitud Recibida
                  </h3>
                  <p className="text-jack-silver/70 text-sm leading-relaxed max-w-md">
                    Hemos recibido su solicitud. Nuestro equipo se pondra en
                    contacto con usted en las proximas 24 horas habiles para
                    coordinar su demostracion personalizada.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
