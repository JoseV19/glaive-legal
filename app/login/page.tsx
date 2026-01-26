"use client";
import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // <-- YA NO LO NECESITAMOS, PUEDES BORRARLO
import { Lock, User, Key, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';

export default function LoginPage() {
    // const router = useRouter(); // <-- YA NO LO USAMOS
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Guardamos la credencial
        localStorage.setItem("user_name", email || "Licenciado");

        // 2. Simulamos la carga
        setTimeout(() => {
            // --- CAMBIO IMPORTANTE AQUÍ ---
            // En lugar de router.push('/'), usamos esto para forzar una recarga limpia:
            window.location.href = '/';
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-london-mist flex items-center justify-center p-6 relative overflow-hidden">

            {/* Decoración de Fondo */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>

            {/* TARJETA DE LOGIN */}
            <div className="w-full max-w-md bg-jack-panel/80 backdrop-blur-sm border border-jack-gold/30 p-10 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-500">

                {/* Borde superior dorado */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-jack-gold to-transparent"></div>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-jack-base border border-jack-gold/50 mb-4 shadow-[0_0_20px_rgba(194,155,64,0.2)]">
                        <Lock className="w-8 h-8 text-jack-gold" />
                    </div>
                    <h1 className="text-3xl font-cinzel text-jack-white tracking-[0.2em] font-bold">
                        GLAIVE
                    </h1>
                    <p className="text-jack-silver/50 text-xs uppercase tracking-widest mt-2">
                        Acceso Restringido · Nivel Notarial
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleLogin} className="space-y-8">

                    {/* Input Usuario */}
                    <div className="group relative">
                        <div className="absolute left-0 top-3 text-jack-gold/50 group-focus-within:text-jack-gold transition-colors">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-jack-silver/20 py-3 pl-10 text-jack-white focus:outline-none focus:border-jack-gold transition-colors font-serif placeholder-jack-silver/20"
                            placeholder="Credencial de Abogado"
                        />
                    </div>

                    {/* Input Password */}
                    <div className="group relative">
                        <div className="absolute left-0 top-3 text-jack-gold/50 group-focus-within:text-jack-gold transition-colors">
                            <Key className="w-5 h-5" />
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full bg-transparent border-b border-jack-silver/20 py-3 pl-10 text-jack-white focus:outline-none focus:border-jack-gold transition-colors font-serif placeholder-jack-silver/20"
                            placeholder="Código de Acceso"
                        />
                    </div>

                    {/* Botón de Acción */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full group relative overflow-hidden bg-jack-crimson text-jack-white py-4 font-cinzel font-bold tracking-widest border border-jack-gold/20 hover:bg-red-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2 animate-pulse">
                                <Fingerprint className="w-5 h-5" /> VERIFICANDO...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
                                INGRESAR AL SISTEMA <ArrowRight className="w-5 h-5" />
                            </span>
                        )}

                        {/* Brillo al pasar el mouse */}
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-700 ease-in-out"></div>
                    </button>

                </form>

                {/* Footer Seguro */}
                <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-jack-silver/30 font-mono">
                    <ShieldCheck className="w-3 h-3" />
                    <span>CONEXIÓN ENCRIPTADA (E2EE)</span>
                </div>

            </div>
        </div>
    );
}