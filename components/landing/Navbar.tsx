"use client";
import { useState, useEffect } from "react";
import { Scale, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Funciones", href: "#features" },
  { label: "Demo", href: "#demo" },
  { label: "Comparativa", href: "#comparativa" },
  { label: "Metricas", href: "#metrics" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("landing-scroll");
      if (container) {
        setScrolled(container.scrollTop > 50);
      }
    };
    const container = document.getElementById("landing-scroll");
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-jack-base/95 backdrop-blur-md border-b border-jack-gold/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-jack-plum/20 rounded border border-jack-gold/30">
              <Scale className="w-5 h-5 text-jack-gold" />
            </div>
            <div>
              <h1 className="text-lg font-cinzel font-bold text-jack-white tracking-[0.2em]">
                GLAIVE
              </h1>
              <p className="text-[8px] text-jack-silver/40 uppercase tracking-[0.3em]">
                Legal Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-jack-silver/70 hover:text-jack-white transition-colors tracking-wide"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-jack-silver/70 hover:text-jack-white transition-colors"
            >
              Iniciar Sesion
            </Link>
            <button
              onClick={() => scrollTo("#contacto")}
              className="btn-shimmer bg-jack-crimson text-jack-white px-5 py-2.5 text-sm font-cinzel tracking-widest border border-jack-gold/20 hover:shadow-[0_0_25px_rgba(122,31,46,0.5)] transition-all"
            >
              SOLICITAR DEMO
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-jack-silver hover:text-jack-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-jack-base/98 backdrop-blur-xl pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-2xl font-cinzel text-jack-white tracking-widest text-left hover:text-jack-gold transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="border-t border-jack-gold/20 pt-6 mt-4 flex flex-col gap-4">
                <Link
                  href="/login"
                  className="text-jack-silver hover:text-jack-white transition-colors text-lg"
                >
                  Iniciar Sesion
                </Link>
                <button
                  onClick={() => scrollTo("#contacto")}
                  className="btn-shimmer bg-jack-crimson text-jack-white px-6 py-3 text-center font-cinzel tracking-widest border border-jack-gold/20 w-full"
                >
                  SOLICITAR DEMO
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
