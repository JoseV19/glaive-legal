"use client";
import { useState } from 'react';
import { ArrowLeft, Gavel, FileText, CheckCircle2, Siren, Banknote, Clock, ShieldAlert, Skull, Users, HeartCrack, Copy } from 'lucide-react';
import Link from 'next/link';

// BASE DE DATOS MAESTRA (Detector + Citas Textuales)
const knowledgeBase = [
    // --- DINERO Y PRESTACIONES ---
    {
        id: 'ECO-01',
        keywords: ['igss', 'seguro social', 'inscribir', 'carnet', 'doctor', 'hospital'],
        law: 'Ley Orgánica del IGSS',
        article: 'Art. 23 / Acuerdo 1123',
        text: 'Infracción por omisión de inscripción.',
        quote: 'Los patronos están obligados a inscribirse e inscribir a sus trabajadores, descontar la cuota correspondiente y enterarla a las Cajas del Instituto en el tiempo y forma que determinen los reglamentos.',
        type: 'economic',
        icon: <Banknote className="w-5 h-5 text-green-500" />
    },
    {
        id: 'ECO-02',
        keywords: ['aguinaldo', 'navidad', 'diciembre', 'bono navideño'],
        law: 'Ley Reguladora del Aguinaldo',
        article: 'Decreto 76-78',
        text: 'Falta de pago de Aguinaldo (100% salario).',
        quote: 'Todo patrono queda obligado a pagar a sus trabajadores, anualmente, en concepto de aguinaldo, el equivalente al cien por ciento del sueldo o salario ordinario mensual que éstos devenguen por un año de servicios continuos.',
        type: 'economic',
        icon: <Banknote className="w-5 h-5 text-green-500" />
    },
    {
        id: 'ECO-03',
        keywords: ['bono 14', 'catorce', 'julio', 'bonificación anual'],
        law: 'Ley de Bonificación Anual',
        article: 'Decreto 42-92',
        text: 'Falta de pago de Bono 14.',
        quote: 'Se establece con carácter de prestación laboral obligatoria para todo patrono, tanto del sector privado como del sector público, el pago a sus trabajadores de una bonificación anual equivalente a un salario o sueldo ordinario que devengue el trabajador.',
        type: 'economic',
        icon: <Banknote className="w-5 h-5 text-green-500" />
    },

    // --- JORNADAS Y DESPIDOS ---
    {
        id: 'LAB-01',
        keywords: ['horas extra', 'tiempo extra', 'tarde', 'noche', 'salía tarde', 'explotación'],
        law: 'Código de Trabajo',
        article: 'Art. 121',
        text: 'Pago de Jornada Extraordinaria (+50%).',
        quote: 'El trabajo efectivo que se ejecute fuera de los límites de tiempo que determinan la jornada ordinaria para el trabajo de que se trate, constituye jornada extraordinaria y debe ser remunerada por lo menos con un cincuenta por ciento más de los salarios mínimos.',
        type: 'rights',
        icon: <Clock className="w-5 h-5 text-orange-400" />
    },
    {
        id: 'LAB-02',
        keywords: ['despido', 'echaron', 'carta', 'sin causa', 'puerta', 'retirate'],
        law: 'Código de Trabajo',
        article: 'Art. 78',
        text: 'Despido sin Causa Justa (Indemnización).',
        quote: 'La terminación del contrato de trabajo conforme a una o varias de las causas enumeradas en el artículo anterior (77), surte efectos desde que el patrono lo comunique por escrito al trabajador indicándole la causa del despido y éste cese efectivamente sus labores.',
        type: 'critical',
        icon: <Gavel className="w-5 h-5 text-jack-crimson" />
    },

    // --- SITUACIONES SOSPECHOSAS (Full Spectrum) ---
    {
        id: 'SUS-01',
        keywords: ['toca', 'insinúa', 'molesta', 'sexual', 'acoso', 'cuerpo', 'morbo', 'invita'],
        law: 'Código de Trabajo',
        article: 'Art. 62 inciso c',
        text: 'Prohibición de acoso u hostigamiento.',
        quote: 'Se prohíbe a los patronos: [...] c) Obligar o intentar obligar a los trabajadores, cualquiera que sea el medio que se adopte, a retirarse de los sindicatos o grupos legales a que pertenezcan, o a ingresar a unos o a otros.',
        type: 'grave',
        icon: <HeartCrack className="w-5 h-5 text-purple-500" />
    },
    {
        id: 'SUS-02',
        keywords: ['embarazada', 'bebé', 'gestación', 'lactancia', 'discriminan', 'mujer'],
        law: 'Código de Trabajo',
        article: 'Art. 151',
        text: 'Protección a la Madre Trabajadora.',
        quote: 'Se prohíbe a los patronos: a) Anunciar por cualquier medio, sus ofertas de empleo, especificando como requisito para llenar las plazas el sexo, raza, etnia o estado civil de la persona.',
        type: 'grave',
        icon: <Users className="w-5 h-5 text-pink-500" />
    },
    {
        id: 'SUS-03',
        keywords: ['peligro', 'sin casco', 'riesgo', 'accidente', 'seguridad', 'miedo', 'caer', 'quimicos'],
        law: 'Reglamento SSO',
        article: 'Acuerdo 229-2014, Art. 4',
        text: 'Obligación de Equipo de Protección Personal.',
        quote: 'Todo patrono o su representante, intermediario o contratista debe adoptar y poner en práctica en los lugares de trabajo, las medidas adecuadas de seguridad e higiene para proteger la vida, la salud y la integridad corporal de sus trabajadores.',
        type: 'alert',
        icon: <Skull className="w-5 h-5 text-yellow-500" />
    },
    {
        id: 'SUS-04',
        keywords: ['bajaron sueldo', 'cambiaron puesto', 'otra zona', 'menos dinero', 'degradaron', 'cambio'],
        law: 'Código de Trabajo',
        article: 'Art. 20',
        text: 'Alteración de condiciones (Ius Variandi).',
        quote: 'El contrato individual de trabajo obliga, no sólo a lo que se establece en él, sino: a) A la observancia de las obligaciones y derechos que este Código o los convenios internacionales ratificados por Guatemala determinen.',
        type: 'alert',
        icon: <ShieldAlert className="w-5 h-5 text-red-400" />
    }
];

export default function LaboralPage() {
    const [inputText, setInputText] = useState('');
    const [analysis, setAnalysis] = useState<any[]>([]);

    // 1. Función para Exportar PDF (Visual)
    const printReport = () => {
        const style = document.createElement('style');
        style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #labor-report, #labor-report * { visibility: visible; }
        #labor-report { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: white; color: black; }
        .no-print { display: none !important; }
        h3 { color: black !important; }
        p { color: #333 !important; }
      }
    `;
        document.head.appendChild(style);
        window.print();
        document.head.removeChild(style);
    };

    // 2. Función para COPIAR FUNDAMENTO (Lógica Legal)
    const copyLegalArgument = (item: any) => {
        const legalText = `FUNDAMENTO DE DERECHO:\nDe conformidad con lo establecido en la ${item.law}, específicamente en su ${item.article}, que literalmente establece:\n"${item.quote}"\n\nPor lo anterior, solicito el cumplimiento de dicha norma.`;

        navigator.clipboard.writeText(legalText);
        alert(`Fundamento del ${item.article} copiado al portapapeles.`);
    };

    const analyzeCase = () => {
        const findings = knowledgeBase.filter(rule =>
            rule.keywords.some(keyword => inputText.toLowerCase().includes(keyword))
        );
        setAnalysis(findings);
    };

    return (
        <div className="min-h-screen bg-jack-base text-jack-silver p-6 md:p-12 font-serif">

            {/* HEADER */}
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 border-b border-jack-gold/20 pb-6">
                <Link href="/" className="flex items-center text-jack-gold hover:text-jack-crimson transition-colors gap-2 mb-4 md:mb-0">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-cinzel tracking-widest text-sm">VOLVER AL DASHBOARD</span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-jack-crimson/20 rounded border border-jack-crimson/50">
                        <Siren className="w-6 h-6 text-jack-crimson animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-cinzel text-jack-white tracking-widest">DEFENSOR LABORAL PRO</h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* INPUT */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-jack-gold font-bold tracking-wide flex items-center gap-2">
                            <FileText className="w-4 h-4" /> NARRATIVA DEL CLIENTE
                        </h2>
                        <span className="text-[10px] tracking-widest text-jack-crimson border border-jack-crimson/30 px-2 py-1 rounded bg-jack-crimson/10 uppercase">
                            Detección de Amenazas Activa
                        </span>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-jack-gold/20 to-jack-crimson/20 rounded-sm blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                        <textarea
                            className="relative w-full h-[500px] bg-jack-panel border border-jack-gold/20 p-6 text-sm leading-relaxed focus:outline-none focus:border-jack-gold text-jack-silver resize-none placeholder-jack-silver/20 font-mono"
                            placeholder="Ej: 'Mi jefe me insinúa cosas raras, me cambiaron de puesto a una zona peligrosa y no me dan equipo de seguridad...'"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            spellCheck={false}
                        />
                    </div>

                    <button
                        onClick={analyzeCase}
                        className="w-full py-4 bg-jack-crimson text-jack-white font-cinzel font-bold tracking-[0.2em] border border-jack-gold/50 hover:bg-red-900 hover:shadow-[0_0_20px_rgba(122,31,46,0.5)] transition-all active:scale-[0.98]"
                    >
                        EJECUTAR ANÁLISIS FORENSE
                    </button>
                </section>

                {/* RESULTADOS */}
                <section id="labor-report" className="space-y-6">
                    <div className="flex justify-between items-center border-b border-jack-gold/10 pb-4">
                        <h2 className="text-jack-gold font-bold tracking-wide flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> HALLAZGOS JURÍDICOS
                        </h2>
                        {analysis.length > 0 && (
                            <button
                                onClick={printReport}
                                className="text-xs flex items-center gap-1 text-jack-silver hover:text-jack-white border border-jack-silver/30 px-3 py-1 rounded hover:bg-jack-silver/10 transition-colors no-print"
                            >
                                <FileText className="w-3 h-3" /> EXPORTAR PDF
                            </button>
                        )}
                    </div>

                    {analysis.length === 0 ? (
                        <div className="h-[400px] flex flex-col items-center justify-center text-jack-silver/30 bg-jack-panel/30 border border-dashed border-jack-gold/10 rounded">
                            <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                            <p className="italic font-serif text-center px-10 text-sm">
                                "El sistema busca patrones de abuso, peligro o deuda..."
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[500px] overflow-y-auto pr-2 custom-scrollbar">

                            {/* Resumen de alertas */}
                            <div className="flex gap-2 mb-4">
                                <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-500/20">
                                    {analysis.filter(i => i.type === 'grave' || i.type === 'alert').length} Amenazas Graves
                                </span>
                                <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/20">
                                    {analysis.filter(i => i.type === 'economic').length} Reclamos Económicos
                                </span>
                            </div>

                            {analysis.map((item, idx) => (
                                <div key={idx} className={`bg-jack-panel border-l-[4px] p-5 shadow-lg relative group transition-all hover:bg-jack-panel/80 ${item.type === 'grave' ? 'border-l-purple-500' :
                                        item.type === 'alert' ? 'border-l-red-500' :
                                            'border-l-jack-gold'
                                    }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {item.icon}
                                            <h3 className="text-jack-white font-bold text-sm font-cinzel">{item.law}</h3>
                                        </div>
                                        <span className="text-[10px] font-mono text-jack-base bg-jack-gold/80 px-2 py-1 rounded font-bold">
                                            {item.article}
                                        </span>
                                    </div>

                                    <p className="text-jack-silver text-sm mb-3 leading-relaxed border-t border-white/5 pt-2 mt-2">
                                        {item.text}
                                    </p>

                                    {/* VISOR DE LA CITA LEGAL */}
                                    <div className="bg-black/20 p-3 border-l-2 border-jack-silver/30 text-xs text-jack-silver/60 italic mb-4 font-serif">
                                        "{item.quote.substring(0, 80)}..."
                                    </div>

                                    <div className="flex justify-end gap-3 mt-2 no-print">
                                        <button
                                            onClick={() => copyLegalArgument(item)}
                                            className="text-[10px] tracking-widest uppercase text-jack-gold hover:text-white transition-colors flex items-center gap-1 font-bold border border-jack-gold/30 px-3 py-1.5 rounded hover:bg-jack-gold/10"
                                        >
                                            <Copy className="w-3 h-3" /> Copiar Fundamento
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}