"use client";
import { useState } from 'react';
import { Search, BookOpen, Scale, Filter, ChevronRight, ArrowLeft, Landmark, Users, Briefcase, Gavel, FileText } from 'lucide-react';
import Link from 'next/link';

// --- BASE DE DATOS MASIVA (Simulada) ---
// Aquí es donde ocurre la magia. Al estructurarlo así, podemos tener miles.
const jurisprudenciaDb = [
    // RAMA LABORAL
    {
        id: 'EXP-LAB-2023-45',
        title: 'Despido Indirecto por Falta de Pago',
        corte: 'Corte de Constitucionalidad',
        fecha: '14 Ene 2023',
        resumen: 'Se establece que la falta de pago de dos periodos consecutivos de salario constituye causal de despido indirecto (Art. 79 CT).',
        tags: ['Laboral', 'Salarios', 'Sentencia'],
        icon: <Briefcase className="w-5 h-5" />
    },
    {
        id: 'EXP-LAB-2022-89',
        title: 'Cálculo de Bono 14 en Indemnización',
        corte: 'Corte Suprema de Justicia',
        fecha: '02 Nov 2022',
        resumen: 'El bono incentivo no forma parte del cálculo para indemnización universal salvo pacto en contrario en contrato colectivo.',
        tags: ['Laboral', 'Prestaciones', 'Doctrina'],
        icon: <Briefcase className="w-5 h-5" />
    },

    // RAMA PENAL
    {
        id: 'EXP-PEN-2024-12',
        title: 'Prisión Preventiva: Plazo Razonable',
        corte: 'Cámara Penal',
        fecha: '10 Feb 2024',
        resumen: 'Exceder el plazo de un año en prisión preventiva sin sentencia vulnera la presunción de inocencia y obliga a medida sustitutiva.',
        tags: ['Penal', 'Derechos Humanos', 'Casación'],
        icon: <Gavel className="w-5 h-5" />
    },
    {
        id: 'EXP-PEN-2023-55',
        title: 'Legítima Defensa en Propiedad Privada',
        corte: 'Tribunal de Sentencia',
        fecha: '20 Dic 2023',
        resumen: 'No es punible quien repele una agresión ilegítima dentro de su morada, siempre que haya racionalidad en el medio empleado.',
        tags: ['Penal', 'Eximentes', 'Sentencia'],
        icon: <Gavel className="w-5 h-5" />
    },

    // RAMA CIVIL
    {
        id: 'EXP-CIV-2021-33',
        title: 'Nulidad Absoluta de Escritura Pública',
        corte: 'Tribunal de lo Civil',
        fecha: '15 Mar 2021',
        resumen: 'Procede la nulidad cuando falta la firma de uno de los otorgantes en el protocolo, aunque el testimonio sí la tenga.',
        tags: ['Civil', 'Notarial', 'Nulidad'],
        icon: <FileText className="w-5 h-5" />
    },
    {
        id: 'EXP-CIV-2022-01',
        title: 'Reivindicación de la Propiedad',
        corte: 'Sala Primera de Apelaciones',
        fecha: '05 Ago 2022',
        resumen: 'Para reivindicar un bien inmueble es requisito indispensable acreditar la propiedad con certificación registral reciente.',
        tags: ['Civil', 'Propiedad', 'Tierras'],
        icon: <FileText className="w-5 h-5" />
    },

    // RAMA FAMILIA
    {
        id: 'EXP-FAM-2023-77',
        title: 'Pensión Alimenticia: Aumento',
        corte: 'Juzgado de Familia',
        fecha: '11 Sep 2023',
        resumen: 'El aumento de capacidad económica del obligado alimentista debe probarse mediante informes bancarios y movimientos migratorios.',
        tags: ['Familia', 'Alimentos', 'Menores'],
        icon: <Users className="w-5 h-5" />
    },
    {
        id: 'EXP-FAM-2024-05',
        title: 'Pérdida de Patria Potestad',
        corte: 'Corte Suprema de Justicia',
        fecha: '22 Ene 2024',
        resumen: 'El abandono injustificado del menor por más de seis meses es causal suficiente para la suspensión de patria potestad.',
        tags: ['Familia', 'Niñez', 'Tutela'],
        icon: <Users className="w-5 h-5" />
    },

    // RAMA MERCANTIL
    {
        id: 'EXP-MER-2022-10',
        title: 'Ejecución de Título de Crédito',
        corte: 'Juzgado Mercantil',
        fecha: '30 Jun 2022',
        resumen: 'El cheque rechazado por falta de fondos constituye título ejecutivo suficiente para embargo precautorio inmediato.',
        tags: ['Mercantil', 'Cobros', 'Bancos'],
        icon: <Landmark className="w-5 h-5" />
    },
];

export default function InvestigacionPage() {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('Todos');

    // Lógica de filtrado mejorada (Busca en título, resumen Y tags)
    const filteredResults = jurisprudenciaDb.filter(item => {
        const searchLower = query.toLowerCase();
        const matchesSearch = item.title.toLowerCase().includes(searchLower) ||
            item.resumen.toLowerCase().includes(searchLower) ||
            item.id.toLowerCase().includes(searchLower);

        const matchesFilter = filter === 'Todos' || item.tags.includes(filter);

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-jack-base text-jack-silver p-4 md:p-8 font-serif">

            {/* HEADER */}
            <header className="max-w-6xl mx-auto mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-end border-b border-jack-gold/20 pb-6">
                <div className="w-full">
                    <Link href="/" className="text-jack-gold hover:text-jack-crimson transition-colors flex items-center gap-2 mb-4 text-xs tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> VOLVER AL DASHBOARD
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-jack-panel border border-jack-gold/30 rounded-sm">
                            <BookOpen className="w-8 h-8 text-jack-gold" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-cinzel text-jack-white tracking-widest">
                                ARCHIVO JURISPRUDENCIAL
                            </h1>
                            <p className="text-jack-silver/50 text-sm mt-1 font-mono">
                                Base de Datos Unificada • Zionak Systems v2.1
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* SIDEBAR: FILTROS ACTIVOS */}
                <aside className="lg:col-span-1 space-y-6">

                    {/* Barra de Búsqueda */}
                    <div className="bg-jack-panel p-1 rounded-sm border-2 border-jack-gold/20 focus-within:border-jack-gold transition-colors shadow-lg">
                        <div className="flex items-center px-3 py-2">
                            <Search className="w-5 h-5 text-jack-gold/70 mr-2" />
                            <input
                                type="text"
                                placeholder="Buscar sentencia..."
                                className="bg-transparent border-none focus:outline-none text-jack-white placeholder-jack-silver/30 w-full text-sm font-sans"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Menú de Ramas */}
                    <div className="bg-jack-panel border border-jack-gold/10 p-4 rounded-sm">
                        <h3 className="text-jack-gold font-bold mb-4 flex items-center gap-2 text-xs tracking-widest uppercase">
                            <Filter className="w-3 h-3" /> Filtrar por Rama
                        </h3>
                        <div className="space-y-1">
                            {[
                                { name: 'Todos', icon: Scale },
                                { name: 'Penal', icon: Gavel },
                                { name: 'Civil', icon: FileText },
                                { name: 'Laboral', icon: Briefcase },
                                { name: 'Familia', icon: Users },
                                { name: 'Mercantil', icon: Landmark },
                            ].map((category) => (
                                <button
                                    key={category.name}
                                    onClick={() => setFilter(category.name)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 text-sm transition-all border-r-2 ${filter === category.name
                                            ? 'border-jack-crimson bg-gradient-to-l from-jack-crimson/10 to-transparent text-jack-white font-bold'
                                            : 'border-transparent text-jack-silver/60 hover:text-jack-gold hover:bg-jack-gold/5'
                                        }`}
                                >
                                    <category.icon className={`w-4 h-4 ${filter === category.name ? 'text-jack-crimson' : 'text-current'}`} />
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Estadísticas Rápidas */}
                    <div className="p-4 bg-jack-plum/20 border border-jack-crimson/20 rounded text-xs text-jack-silver/60 text-center">
                        <p>Mostrando {filteredResults.length} expedientes</p>
                    </div>
                </aside>

                {/* LISTADO DE RESULTADOS */}
                <section className="lg:col-span-3 space-y-4">

                    {filteredResults.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-jack-gold/10 bg-jack-panel/30 rounded">
                            <Scale className="w-16 h-16 mx-auto mb-4 text-jack-silver/20" />
                            <p className="text-jack-silver/50">No se encontraron precedentes con ese criterio.</p>
                            <button onClick={() => { setFilter('Todos'); setQuery('') }} className="mt-4 text-jack-gold hover:underline text-sm">
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        filteredResults.map((item) => (
                            <div key={item.id} className="group bg-jack-panel border-l-[3px] border-l-jack-gold/30 border-y border-r border-jack-gold/10 p-6 hover:border-l-jack-crimson hover:shadow-[0_5px_20px_rgba(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden cursor-pointer">

                                {/* Header de la Tarjeta */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="p-1.5 bg-jack-base rounded border border-jack-gold/20 text-jack-gold">
                                            {item.icon}
                                        </span>
                                        <span className="text-xs font-mono text-jack-silver/50 tracking-wide">{item.id}</span>
                                    </div>
                                    <span className="text-xs bg-jack-base px-2 py-1 rounded text-jack-silver/70 border border-white/5">
                                        {item.fecha}
                                    </span>
                                </div>

                                {/* Título */}
                                <h3 className="text-xl font-bold text-jack-white mb-2 font-cinzel group-hover:text-jack-gold transition-colors">
                                    {item.title}
                                </h3>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-jack-crimson">
                                        {item.corte}
                                    </span>
                                    {item.tags.filter(t => t !== filter).map(tag => (
                                        <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-white/5 text-jack-silver/60 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Resumen */}
                                <p className="text-sm text-jack-silver/80 leading-relaxed font-serif border-t border-jack-gold/10 pt-4 group-hover:text-jack-silver transition-colors">
                                    {item.resumen}
                                </p>

                                {/* Call to Action (Aparece al hover) */}
                                <div className="mt-4 flex items-center justify-end text-jack-crimson text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    ANALIZAR SENTENCIA COMPLETA <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        ))
                    )}

                </section>

            </main>
        </div>
    );
}