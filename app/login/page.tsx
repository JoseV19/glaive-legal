"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  User,
  Key,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  BookOpen,
  Bot,
  FolderOpen,
  FileText,
  ChevronDown,
} from "lucide-react";
import { UserRole, ROLES, setUserRole } from "@/lib/roles";
import Link from "next/link";

const features = [
  { icon: Bot, label: "Analista Laboral Avanzado" },
  { icon: FolderOpen, label: "Gestion de Expedientes" },
  { icon: BookOpen, label: "Biblioteca Legal" },
  { icon: FileText, label: "Protocolo Notarial" },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("titular");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem("user_name", email || "Licenciado");
    setUserRole(selectedRole);
    setTimeout(() => {
      window.location.href = "/";
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-jack-base flex overflow-hidden">
      {/* ===== LEFT PANEL: Branding ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, #1F2533 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #3E2034 0%, transparent 50%), #0B0A12",
            backgroundSize: "200% 200%",
          }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #Cfb568 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Decorative glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-jack-crimson/8 rounded-full blur-[120px]" />

        {/* Gold line accent */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-jack-gold/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 px-12 xl:px-20 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Logo */}
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-jack-plum/20 rounded border border-jack-gold/30">
                <Scale className="w-8 h-8 text-jack-gold" />
              </div>
              <div>
                <h1 className="text-2xl font-cinzel font-bold text-jack-white tracking-[0.25em]">
                  GLAIVE
                </h1>
                <p className="text-[9px] text-jack-silver/40 uppercase tracking-[0.3em]">
                  Legal Platform
                </p>
              </div>
            </div>

            {/* Tagline */}
            <h2 className="font-cinzel text-3xl xl:text-4xl text-jack-white font-bold leading-tight mb-4">
              Precision y Elegancia{" "}
              <span className="text-gradient-gold">al Servicio</span> del
              Derecho
            </h2>
            <p className="text-jack-silver/60 text-sm leading-relaxed mb-10">
              La plataforma juridica mas avanzada de Guatemala. Accede a
              herramientas avanzadas, gestion de casos y biblioteca legal completa.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="flex flex-wrap gap-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 px-4 py-2 bg-jack-panel/50 border border-jack-gold/10 rounded-sm text-xs text-jack-silver/60"
              >
                <f.icon className="w-3.5 h-3.5 text-jack-gold/60" />
                {f.label}
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-12 left-12 xl:left-20"
          >
            <p className="text-[10px] text-jack-gold/30 font-cinzel tracking-[0.3em]">
              ZIONAK LEGAL SYSTEMS
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== RIGHT PANEL: Login Form ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        {/* Subtle background for right side */}
        <div className="absolute inset-0 bg-gradient-to-br from-jack-base via-jack-panel/30 to-jack-base" />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile logo (visible on small screens only) */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-jack-plum/20 rounded border border-jack-gold/30 mb-4">
              <Scale className="w-7 h-7 text-jack-gold" />
            </div>
            <h1 className="text-2xl font-cinzel font-bold text-jack-white tracking-[0.25em]">
              GLAIVE
            </h1>
            <p className="text-[9px] text-jack-silver/40 uppercase tracking-[0.3em] mt-1">
              Legal Platform
            </p>
          </div>

          {/* Form header */}
          <div className="mb-10">
            <h2 className="text-2xl font-cinzel text-jack-white font-bold tracking-wide">
              Iniciar Sesion
            </h2>
            <p className="text-jack-silver/50 text-sm mt-2">
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email/User field */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-jack-silver/50 font-bold">
                Credencial
              </label>
              <div
                className={`relative border rounded-sm transition-all duration-300 ${
                  focused === "email"
                    ? "border-jack-gold/60 shadow-[0_0_15px_rgba(207,181,104,0.1)]"
                    : "border-jack-gold/15 hover:border-jack-gold/30"
                }`}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User
                    className={`w-4 h-4 transition-colors duration-300 ${
                      focused === "email"
                        ? "text-jack-gold"
                        : "text-jack-silver/30"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-jack-panel/40 py-4 pl-12 pr-4 text-jack-white text-sm focus:outline-none rounded-sm placeholder-jack-silver/20 font-serif"
                  placeholder="Nombre de usuario o correo"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-jack-silver/50 font-bold">
                Codigo de Acceso
              </label>
              <div
                className={`relative border rounded-sm transition-all duration-300 ${
                  focused === "password"
                    ? "border-jack-gold/60 shadow-[0_0_15px_rgba(207,181,104,0.1)]"
                    : "border-jack-gold/15 hover:border-jack-gold/30"
                }`}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Key
                    className={`w-4 h-4 transition-colors duration-300 ${
                      focused === "password"
                        ? "text-jack-gold"
                        : "text-jack-silver/30"
                    }`}
                  />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-jack-panel/40 py-4 pl-12 pr-4 text-jack-white text-sm focus:outline-none rounded-sm placeholder-jack-silver/20 font-serif"
                  placeholder="Contrasena"
                />
              </div>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-jack-silver/50 font-bold">
                Rol de Acceso
              </label>
              <div
                className={`relative border rounded-sm transition-all duration-300 ${
                  focused === "role"
                    ? "border-jack-gold/60 shadow-[0_0_15px_rgba(207,181,104,0.1)]"
                    : "border-jack-gold/15 hover:border-jack-gold/30"
                }`}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Scale
                    className={`w-4 h-4 transition-colors duration-300 ${
                      focused === "role"
                        ? "text-jack-gold"
                        : "text-jack-silver/30"
                    }`}
                  />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-jack-silver/30" />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  onFocus={() => setFocused("role")}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-jack-panel/40 py-4 pl-12 pr-10 text-jack-white text-sm focus:outline-none rounded-sm font-serif appearance-none cursor-pointer"
                >
                  {(Object.keys(ROLES) as UserRole[]).map((r) => (
                    <option key={r} value={r} className="bg-jack-base text-jack-white">
                      {ROLES[r].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 border border-jack-gold/20 rounded-sm flex items-center justify-center group-hover:border-jack-gold/40 transition-colors">
                  <input type="checkbox" className="sr-only" />
                </div>
                <span className="text-xs text-jack-silver/40 group-hover:text-jack-silver/60 transition-colors">
                  Recordar sesion
                </span>
              </label>
              <button
                type="button"
                className="text-xs text-jack-gold/50 hover:text-jack-gold transition-colors"
              >
                Recuperar acceso
              </button>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full group relative overflow-hidden bg-jack-crimson text-jack-white py-4 font-cinzel font-bold tracking-[0.2em] text-sm border border-jack-gold/20 hover:shadow-[0_0_30px_rgba(122,31,46,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed rounded-sm"
            >
              {loading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-3"
                >
                  <Fingerprint className="w-5 h-5 animate-pulse" />
                  VERIFICANDO CREDENCIALES...
                </motion.span>
              ) : (
                <span className="flex items-center justify-center gap-3 group-hover:gap-4 transition-all">
                  INGRESAR AL SISTEMA
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}

              {/* Shimmer effect */}
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-700 ease-in-out" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-jack-gold/10" />
            <span className="text-[10px] text-jack-silver/30 uppercase tracking-widest">
              o
            </span>
            <div className="flex-1 h-px bg-jack-gold/10" />
          </div>

          {/* Landing page link */}
          <Link
            href="/landing"
            className="block w-full text-center py-3 border border-jack-gold/15 text-jack-silver/50 text-sm hover:border-jack-gold/30 hover:text-jack-white transition-all rounded-sm"
          >
            Conocer mas sobre Glaive
          </Link>

          {/* Security footer */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-jack-silver/25 text-[10px]">
              <ShieldCheck className="w-3 h-3" />
              <span className="uppercase tracking-widest">Encriptado E2EE</span>
            </div>
            <div className="w-px h-3 bg-jack-silver/10" />
            <div className="flex items-center gap-2 text-jack-silver/25 text-[10px]">
              <Scale className="w-3 h-3" />
              <span className="uppercase tracking-widest">Nivel Notarial</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
