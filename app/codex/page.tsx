"use client";
import { useState } from 'react';
import { Search, Book, ArrowLeft, Bookmark, Scroll, Shield, Briefcase, Heart, Landmark } from 'lucide-react';
import Link from 'next/link';

// BASE DE DATOS DE LEYES (LOS 5 GRANDES)
// En el futuro, esto vendrá de una base de datos real.
const library = [
    {
        code: 'Constitución Política',
        abbr: 'CPRG',
        category: 'Suprema',
        icon: <Shield className="w-5 h-5" />,
        articles: [
            { art: 'Art. 1', title: 'Protección a la Persona', text: 'El Estado de Guatemala se organiza para proteger a la persona y a la familia; su fin supremo es la realización del bien común.' },
            { art: 'Art. 2', title: 'Deberes del Estado', text: 'Es deber del Estado garantizar a los habitantes de la República la vida, la libertad, la justicia, la seguridad, la paz y el desarrollo integral de la persona.' },
            { art: 'Art. 28', title: 'Derecho de Petición', text: 'Los habitantes de la República de Guatemala tienen derecho a dirigir, individual o colectivamente, peticiones a la autoridad...' },
        ]
    },
    {
        code: 'Código Penal',
        abbr: 'Decreto 17-73',
        category: 'Penal',
        icon: <Scroll className="w-5 h-5" />,
        articles: [
            { art: 'Art. 1', title: 'Principio de Legalidad', text: 'Nadie podrá ser penado por hechos que no estén expresamente calificados, como delitos o faltas, por ley anterior a su perpetración.' },
            { art: 'Art. 123', title: 'Homicidio', text: 'Comete homicidio quien diere muerte a alguna persona. Al homicida se le impondrá prisión de 15 a 40 años.' },
            { art: 'Art. 251', title: 'Robo', text: 'Quien sin la debida autorización y con violencia anterior, simultánea o posterior a la aprehensión, tomare cosa, mueble, total o parcialmente ajena...' },
        ]
    },
    {
        code: 'Código de Trabajo',
        abbr: 'Decreto 1441',
        category: 'Laboral',
        icon: <Briefcase className="w-5 h-5" />,
        articles: [
            { art: 'Art. 3', title: 'Trabajador', text: 'Trabajador es toda persona individual que presta a un patrono sus servicios materiales, intelectuales o de ambos géneros...' },
            { art: 'Art. 82', title: 'Indemnización', text: 'Si el contrato de trabajo por tiempo indeterminado concluye una vez transcurrido el período de prueba, por razón de despido injustificado...' },
            { art: 'Art. 116', title: 'Jornada Ordinaria', text: 'La jornada ordinaria de trabajo efectivo diurno no puede ser mayor de ocho horas diarias, ni exceder de un total de cuarenta y ocho horas a la semana.' },
        ]
    },
    {
        code: 'Código Civil',
        abbr: 'Decreto 106',
        category: 'Civil',
        icon: <Heart className="w-5 h-5" />,
        articles: [
            { art: 'Art. 1', title: 'Personalidad', text: 'La personalidad civil comienza con el nacimiento y termina con la muerte; sin embargo, al que está por nacer se le considera nacido para todo lo que le favorece...' },
            { art: 'Art. 78', title: 'El Matrimonio', text: 'El matrimonio es una institución social por la que un hombre y una mujer se unen legalmente, con ánimo de permanencia y con el fin de vivir juntos...' },
        ]
    },
    {
        code: 'Código de Comercio',
        abbr: 'Decreto 2-70',
        category: 'Mercantil',
        icon: <Landmark className="w-5 h-5" />,
        articles: [
            { art: 'Art. 1', title: 'Aplicabilidad', text: 'Los comerciantes en su actividad profesional, los negocios jurídicos mercantiles y cosas mercantiles, se regirán por las disposiciones de este Código...' },
            { art: 'Art. 10', title: 'Sociedades Mercantiles', text: 'Son sociedades organizadas bajo forma mercantil, exclusivamente las siguientes: 1. La sociedad colectiva...' },
        ]
    }
];

export default function CodexPage() {
    const [query, setQuery] = useState('');
    const [selectedBook, setSelectedBook] = useState('Todos');

    // Lógica de búsqueda profunda (Busca en nombre del código, número de artículo y texto)
    const results = library.flatMap(book => {
        if (selectedBook !== 'Todos' && book.code !== selectedBook) return [];

        return book.articles
            .filter(article =>
                article.text.toLowerCase().includes(query.toLowerCase()) ||
                article.title.toLowerCase().includes(query.toLowerCase()) ||
                article.art.toLowerCase().includes(query.toLowerCase())
            )
            .map(article => ({ ...article, code: book.code, abbr: book.abbr, icon: book.icon }));
    });

    return (
        <div className="min-h-screen bg-jack-base text-jack-silver p-6 md:p-8 font-serif">

            {/* HEADER */}
            <header className="max-w-5xl mx-auto mb-10 border-b border-jack-gold/20 pb-6">
                <Link href="/" className="text-jack-gold hover:text-jack-crimson transition-colors flex items-center gap-2 mb-4 text-xs tracking-widest uppercase">
                    <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
                </Link>
                <h1 className="text-4xl font-cinzel text-jack-white tracking-widest flex items-center gap-3">
                    <Book className="w-8 h-8 text-jack-gold" />
                    CODEX LEGISLATIVO
                </h1>
                <p className="text-jack-silver/50 mt-2 text-sm italic">
                    "Compendio de las leyes supremas de la República."
                </p>
            </header>

            <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* SIDEBAR: LIBROS DISPONIBLES */}
                <aside className="lg:col-span-1 space-y-4">
                    <div className="bg-jack-panel p-4 border border-jack-gold/10 rounded-sm">
                        <h3 className="text-jack-gold text-xs font-bold tracking-widest uppercase mb-4">Biblioteca</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedBook('Todos')}
                                className={`w-full text-left px-3 py-2 text-sm rounded transition-all ${selectedBook === 'Todos' ? 'bg-jack-gold text-jack-base font-bold' : 'text-jack-silver hover:bg-white/5'}`}
                            >
                                Todas las Leyes
                            </button>
                            {library.map((book) => (
                                <button
                                    key={book.code}
                                    onClick={() => setSelectedBook(book.code)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded transition-all flex items-center gap-2 ${selectedBook === book.code
                                            ? 'bg-jack-crimson text-white font-bold'
                                            : 'text-jack-silver hover:bg-white/5'
                                        }`}
                                >
                                    {book.icon}
                                    <span className="truncate">{book.code}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* BUSCADOR Y RESULTADOS */}
                <section className="lg:col-span-3 space-y-6">

                    {/* Barra de Búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-jack-gold/70" />
                        <input
                            type="text"
                            placeholder='Buscar "Homicidio", "Art. 82", "Despido"...'
                            className="w-full bg-jack-panel border-2 border-jack-gold/20 focus:border-jack-gold py-3 pl-12 pr-4 text-jack-white focus:outline-none transition-colors shadow-lg placeholder-jack-silver/30"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Lista de Artículos */}
                    <div className="space-y-4">
                        {query === '' && (
                            <div className="text-center py-10 opacity-40">
                                <p className="text-sm">Ingrese un término para buscar en {selectedBook}</p>
                            </div>
                        )}

                        {query !== '' && results.length === 0 && (
                            <div className="text-center py-10 border border-dashed border-jack-crimson/30 bg-jack-crimson/5 rounded">
                                <p className="text-jack-crimson">No se encontraron artículos con ese término.</p>
                            </div>
                        )}

                        {results.map((item, idx) => (
                            <div key={idx} className="bg-jack-panel border border-jack-gold/10 p-6 hover:border-jack-gold/40 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-jack-silver group-hover:bg-jack-gold transition-colors"></div>

                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-jack-gold bg-jack-gold/10 px-2 py-0.5 rounded border border-jack-gold/20">
                                            {item.abbr}
                                        </span>
                                        <span className="text-xs text-jack-silver/50">{item.code}</span>
                                    </div>
                                    <button className="text-jack-silver/40 hover:text-jack-gold transition-colors">
                                        <Bookmark className="w-4 h-4" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-jack-white font-cinzel mb-1">
                                    {item.art} <span className="text-jack-silver/60 mx-1">|</span> {item.title}
                                </h3>

                                <p className="text-sm text-jack-silver/80 leading-relaxed font-serif bg-black/20 p-3 rounded border border-white/5 mt-3">
                                    "{item.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}