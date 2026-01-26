"use client";
import { useState, useRef } from 'react';
import { ArrowLeft, Printer, Save, FileSignature, Eraser } from 'lucide-react';
import Link from 'next/link';

export default function ProtocoloPage() {
    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Función para imprimir
    const handlePrint = () => {
        window.print();
    };

    // Función para limpiar
    const handleClear = () => {
        if (confirm("¿Desea borrar todo el contenido del instrumento público?")) {
            setContent("");
        }
    };

    return (
        <div className="min-h-screen bg-jack-base text-jack-silver flex flex-col items-center py-8 font-serif relative overflow-hidden">

            {/* Fondo decorativo (Niebla) */}
            <div className="absolute inset-0 bg-london-mist pointer-events-none z-0"></div>

            {/* BARRA DE HERRAMIENTAS FLOTANTE */}
            <nav className="fixed top-6 z-50 bg-jack-panel/90 backdrop-blur-md border border-jack-gold/30 rounded-full px-8 py-3 flex items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <Link href="/" className="text-jack-silver hover:text-jack-gold transition-colors" title="Volver">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="h-6 w-[1px] bg-jack-gold/20"></div>

                <h1 className="font-cinzel text-jack-gold font-bold tracking-widest text-sm hidden md:block">
                    MATRIZ NOTARIAL
                </h1>

                <div className="h-6 w-[1px] bg-jack-gold/20"></div>

                <button onClick={handleClear} className="text-jack-crimson hover:text-red-400 transition-colors" title="Limpiar Hoja">
                    <Eraser className="w-5 h-5" />
                </button>
                <button className="text-jack-silver hover:text-white transition-colors" title="Guardar Borrador">
                    <Save className="w-5 h-5" />
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-jack-gold text-jack-base px-4 py-1.5 rounded-full font-bold hover:bg-white transition-all flex items-center gap-2"
                >
                    <Printer className="w-4 h-4" />
                    <span className="text-xs tracking-wide">IMPRIMIR</span>
                </button>
            </nav>

            {/* MESA DE TRABAJO (Padding para separar el papel del borde) */}
            <div className="mt-20 z-10 flex flex-col items-center justify-center w-full overflow-auto pb-20">

                {/* EL PAPEL DE PROTOCOLO (Este ID es el que se imprime) */}
                <div
                    id="protocol-sheet"
                    className="relative bg-[#fdfbf7] text-black shadow-2xl transition-transform duration-300 ease-out"
                    style={{
                        width: '21.59cm', // Ancho Carta Estándar (8.5in)
                        height: '27.94cm', // Alto Carta (11in) - Ajustable a Oficio
                        paddingTop: '2.5cm', // Margen superior legal
                        paddingLeft: '2cm',  // Margen izquierdo
                        paddingRight: '1.5cm', // Margen derecho
                    }}
                >
                    {/* LÍNEAS GUÍA (Se ocultan al imprimir con la clase 'no-print') */}
                    {/* Simulan los renglones del papel sellado físico para que el abogado se guíe */}
                    <div className="absolute inset-0 pointer-events-none no-print opacity-20 pt-[2.5cm]">
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div
                                key={i}
                                className="border-b border-cyan-500 w-full mx-auto"
                                style={{ height: '0.96cm' }} // Altura exacta por línea
                            >
                                <span className="absolute left-1 text-[8px] text-cyan-600">{i + 1}</span>
                            </div>
                        ))}
                    </div>

                    {/* MARGENES ROJOS LATERALES (Clásicos del protocolo) */}
                    <div className="absolute top-0 left-[1.5cm] bottom-0 w-[1px] bg-red-500/30 no-print h-full"></div>
                    <div className="absolute top-0 right-[1cm] bottom-0 w-[1px] bg-red-500/30 no-print h-full"></div>

                    {/* ÁREA DE ESCRITURA REAL */}
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full bg-transparent resize-none focus:outline-none font-[family-name:var(--font-serif)] text-justify leading-[0.96cm] text-[15px]"
                        spellCheck={false}
                        placeholder="NUMERO UNO (1). En la ciudad de Guatemala, el veintiséis de enero del año dos mil veintiséis, ANTE MÍ: JOSÉ ALEJANDRO..."
                        style={{
                            lineHeight: '0.96cm', // DEBE COINCIDIR CON LAS LÍNEAS DE FONDO
                            letterSpacing: '0.01em'
                        }}
                    />

                    {/* Sello de Agua Visual (Solo decoración en pantalla) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none no-print opacity-5">
                        <FileSignature className="w-64 h-64 text-jack-base" />
                    </div>

                </div>

                {/* Info del estado */}
                <div className="mt-6 text-jack-silver/50 text-xs font-mono bg-jack-panel px-4 py-2 rounded border border-jack-gold/10">
                    LÍNEAS UTILIZADAS: {content.split('\n').length} / 25
                </div>

            </div>
        </div>
    );
}