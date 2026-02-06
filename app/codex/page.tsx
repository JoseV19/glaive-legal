"use client";
import { useState, useEffect } from 'react';
import { Search, Book, ArrowLeft, Scroll, Shield, Briefcase, Heart, Landmark, Loader2, BookOpen, X, Copy, Check, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// --- ICONOS POR CATEGORÍA ---
const categoryIcons: Record<string, React.ReactNode> = {
    Suprema: <Shield className="w-6 h-6" />,
    Penal: <Scroll className="w-6 h-6" />,
    Laboral: <Briefcase className="w-6 h-6" />,
    Civil: <Heart className="w-6 h-6" />,
    Mercantil: <Landmark className="w-6 h-6" />,
};

// --- INTERFACES DE DATOS ---
interface Ley {
    id: number;
    titulo: string;
    categoria: string;
    abreviatura: string;
    año: number;
}

interface ArticuloResult {
    id: number;
    numero: string;
    titulo: string | null;
    contenido: string;
    leyes: {
        titulo: string;
        abreviatura: string;
        categoria: string;
    };
}

export default function CodexPage() {
    // Estados de Datos
    const [input, setInput] = useState('');
    const [searchedTerm, setSearchedTerm] = useState('');
    const [leyes, setLeyes] = useState<Ley[]>([]);
    const [results, setResults] = useState<ArticuloResult[]>([]);
    
    // Estados de Carga
    const [loading, setLoading] = useState(false);
    const [loadingLeyes, setLoadingLeyes] = useState(true);
    const [loadingBrowse, setLoadingBrowse] = useState(false);

    // Estados de Navegación
    const [browseLey, setBrowseLey] = useState<Ley | null>(null);
    const [browseArticles, setBrowseArticles] = useState<ArticuloResult[]>([]);
    
    // Estado del MODAL DE LECTURA
    const [readingArticle, setReadingArticle] = useState<ArticuloResult | null>(null);

    // 1. CARGAR LEYES (Libros)
    useEffect(() => {
        async function fetchLeyes() {
            const { data } = await supabase
                .from('leyes')
                .select('id, titulo, categoria, abreviatura, año')
                .order('titulo');
            setLeyes((data as unknown as Ley[]) || []);
            setLoadingLeyes(false);
        }
        fetchLeyes();
    }, []);

    // 2. BUSCADOR INTELIGENTE
    async function handleSearch() {
        const term = input.trim();
        if (!term) return;

        setBrowseLey(null);
        setLoading(true);
        setSearchedTerm(term);

        // Búsqueda Full-Text Search en Supabase
        const { data } = await supabase
            .from('articulos')
            .select('id, numero, titulo, contenido, leyes(titulo, abreviatura, categoria)')
            .textSearch('fts', term, { type: 'websearch', config: 'spanish' })
            .limit(50);

        setResults((data as unknown as ArticuloResult[]) || []);
        setLoading(false);
    }

    // 3. EXPLORAR UNA LEY ESPECÍFICA
    async function handleBrowseLey(ley: Ley) {
        setSearchedTerm('');
        setResults([]);
        setInput('');
        setBrowseLey(ley);
        setLoadingBrowse(true);

        const { data } = await supabase
            .from('articulos')
            .select('id, numero, titulo, contenido, leyes(titulo, abreviatura, categoria)')
            .eq('ley_id', ley.id)
            .order('id') // Idealmente ordenar por un campo numérico real, pero ID sirve por ahora
            .limit(100);

        setBrowseArticles((data as unknown as ArticuloResult[]) || []);
        setLoadingBrowse(false);
    }

    // UTILIDADES
    function handleClear() {
        setInput('');
        setSearchedTerm('');
        setResults([]);
        setBrowseLey(null);
        setBrowseArticles([]);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleSearch();
    }

    // Lógica de Vistas
    const showInitial = !searchedTerm && !browseLey;
    const showResults = !!searchedTerm && !browseLey;
    const showBrowse = !!browseLey;

    return (
        <div className="min-h-screen bg-jack-base text-jack-silver font-serif pb-20">

            {/* --- NAV SUPERIOR --- */}
            <div className="max-w-6xl mx-auto px-6 pt-6 flex justify-between items-center">
                <Link href="/" className="text-jack-gold hover:text-white transition-colors flex items-center gap-2 text-xs tracking-widest uppercase font-bold">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>
            </div>

            {/* --- HERO SECTION & BUSCADOR --- */}
            <div className={`transition-all duration-700 ease-in-out ${showInitial ? 'py-16' : 'py-8'}`}>
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">

                    {showInitial && (
                        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h1 className="text-5xl md:text-6xl font-cinzel text-jack-white tracking-widest flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
                                <BookOpen className="w-12 h-12 text-jack-gold" />
                                <span>CODEX</span>
                            </h1>
                            <p className="text-jack-silver/50 text-sm font-sans tracking-widest uppercase">
                                Inteligencia Legal &middot; Jurisprudencia Indexada
                            </p>
                        </div>
                    )}

                    {!showInitial && (
                        <h1 className="text-2xl font-cinzel text-jack-white tracking-widest flex items-center justify-center gap-3 mb-6 animate-in fade-in">
                            <Book className="w-5 h-5 text-jack-gold" />
                            CODEX
                        </h1>
                    )}

                    {/* INPUT DE BÚSQUEDA */}
                    <div className="relative max-w-2xl mx-auto group">
                        {/* Efecto de brillo dorado detrás del input */}
                        <div className="absolute inset-0 bg-jack-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-jack-gold/70" />
                            <input
                                type="text"
                                placeholder='Ej: "despido injustificado", "homicidio", "vacaciones"'
                                className="w-full bg-jack-panel border border-jack-gold/30 focus:border-jack-gold rounded-full py-4 pl-14 pr-32 text-jack-white focus:outline-none transition-all shadow-2xl placeholder-jack-silver/30 text-lg font-sans"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                            
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {(input || searchedTerm || browseLey) && (
                                    <button
                                        onClick={handleClear}
                                        className="p-2 text-jack-silver/30 hover:text-white transition-colors"
                                        title="Limpiar búsqueda"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={handleSearch}
                                    disabled={!input.trim() || loading}
                                    className="bg-jack-gold hover:bg-white text-jack-base font-bold px-6 py-2 rounded-full text-xs tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Buscar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="max-w-5xl mx-auto px-6">

                {/* VISTA 1: EXPLORAR BIBLIOTECA (INICIO) */}
                {showInitial && (
                    <div className="animate-in fade-in duration-700 delay-150">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="h-px w-10 bg-jack-gold/20"></div>
                            <h2 className="text-xs font-bold text-jack-gold tracking-widest uppercase">Legislación Disponible</h2>
                            <div className="h-px w-10 bg-jack-gold/20"></div>
                        </div>

                        {loadingLeyes ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-jack-gold/30" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {leyes.map((ley) => (
                                    <button
                                        key={ley.id}
                                        onClick={() => handleBrowseLey(ley)}
                                        className="group bg-jack-panel border border-jack-gold/10 hover:border-jack-gold p-6 rounded relative overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-jack-gold/5"
                                    >
                                        {/* Icono de fondo grande y sutil */}
                                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity scale-150 text-jack-gold">
                                            {categoryIcons[ley.categoria] || <Book className="w-20 h-20" />}
                                        </div>

                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className="p-3 bg-jack-base border border-jack-gold/20 rounded-full text-jack-gold group-hover:bg-jack-gold group-hover:text-jack-base transition-colors shadow-lg">
                                                {categoryIcons[ley.categoria] || <Book className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-bold text-jack-crimson tracking-widest uppercase bg-jack-crimson/10 px-2 py-0.5 rounded">
                                                    {ley.abreviatura}
                                                </span>
                                                <h3 className="text-jack-white font-bold text-sm mt-2 leading-snug group-hover:text-jack-gold transition-colors">
                                                    {ley.titulo}
                                                </h3>
                                                <p className="text-jack-silver/40 text-xs mt-1 font-mono">
                                                    {ley.año}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* VISTA 2: RESULTADOS DE BÚSQUEDA */}
                {showResults && (
                    <div className="animate-in slide-in-from-bottom-2 duration-500">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 text-jack-gold/60">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <span className="text-sm tracking-wide font-cinzel">Analizando jurisprudencia...</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6 border-b border-jack-gold/10 pb-4">
                                    <p className="text-sm text-jack-silver">
                                        Se encontraron <span className="text-jack-gold font-bold">{results.length}</span> coincidencias para &quot;{searchedTerm}&quot;
                                    </p>
                                    <button onClick={handleClear} className="text-xs text-jack-silver/50 hover:text-white underline decoration-jack-gold/50">
                                        Limpiar filtros
                                    </button>
                                </div>

                                {results.length === 0 ? (
                                    <div className="text-center py-20 border border-dashed border-jack-gold/20 bg-jack-panel rounded-lg">
                                        <BookOpen className="w-12 h-12 text-jack-gold/20 mx-auto mb-4" />
                                        <p className="text-jack-white font-cinzel text-lg">Sin resultados</p>
                                        <p className="text-jack-silver/40 text-sm mt-2">Intenta usar términos más generales.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {results.map((item) => (
                                            <ArticleCard 
                                                key={item.id} 
                                                item={item} 
                                                highlight={searchedTerm} 
                                                onClick={() => setReadingArticle(item)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* VISTA 3: EXPLORAR LEY (INDICE) */}
                {showBrowse && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-4 mb-8 bg-jack-panel p-6 border-l-4 border-jack-gold shadow-lg">
                            <button onClick={handleClear} className="bg-jack-base hover:bg-jack-gold hover:text-jack-base text-jack-gold p-2 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-jack-white font-cinzel font-bold text-2xl leading-none">{browseLey.titulo}</h2>
                                <div className="flex gap-3 mt-2 text-xs text-jack-silver/50 uppercase tracking-widest">
                                    <span>{browseLey.abreviatura}</span>
                                    <span>&bull;</span>
                                    <span>{browseLey.categoria}</span>
                                    <span>&bull;</span>
                                    <span>{browseLey.año}</span>
                                </div>
                            </div>
                        </div>

                        {loadingBrowse ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-jack-gold" />
                            </div>
                        ) : browseArticles.length === 0 ? (
                            <div className="text-center py-20 opacity-40">
                                <p>Esta ley aún no ha sido indexada completamente.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {browseArticles.map((item) => (
                                    <ArticleCard 
                                        key={item.id} 
                                        item={item} 
                                        onClick={() => setReadingArticle(item)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </main>

            {/* --- MODAL DE LECTURA (OVERLAY) --- */}
            {readingArticle && (
                <ArticleModal 
                    article={readingArticle} 
                    onClose={() => setReadingArticle(null)} 
                />
            )}

        </div>
    );
}

// --- COMPONENTE: TARJETA DE ARTÍCULO (Preview) ---
function ArticleCard({ item, highlight, onClick }: { item: ArticuloResult; highlight?: string; onClick: () => void }) {
    // Cortamos el texto para la vista previa
    let fragment = item.contenido;
    if (fragment.length > 250) {
        fragment = fragment.substring(0, 250).trimEnd() + '...';
    }

    return (
        <div 
            onClick={onClick}
            className="group bg-jack-panel border border-jack-gold/10 hover:border-jack-gold/50 transition-all cursor-pointer relative overflow-hidden rounded shadow-sm hover:shadow-lg hover:shadow-jack-gold/5"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-jack-gold/30 group-hover:bg-jack-gold transition-colors" />
            
            <div className="p-5 pl-6">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-jack-base bg-jack-gold px-2 py-0.5 rounded tracking-wider">
                            {item.leyes.abreviatura}
                        </span>
                        <span className="text-jack-white font-cinzel font-bold text-lg">
                            Art. {item.numero}
                        </span>
                    </div>
                    <Maximize2 className="w-4 h-4 text-jack-silver/20 group-hover:text-jack-gold transition-colors" />
                </div>

                <h4 className="text-jack-gold text-sm font-bold mb-2 uppercase tracking-wide">
                    {item.titulo || 'Sin Título'}
                </h4>

                <p className="text-sm text-jack-silver/70 font-serif leading-relaxed">
                    {highlight ? highlightText(fragment, highlight) : fragment}
                </p>
                
                <div className="mt-3 flex items-center gap-2 text-[10px] text-jack-silver/30 uppercase tracking-widest group-hover:text-jack-gold/50 transition-colors">
                    <BookOpen className="w-3 h-3" />
                    Leer artículo completo
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTE: MODAL DE LECTURA COMPLETA ---
function ArticleModal({ article, onClose }: { article: ArticuloResult; onClose: () => void }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = `${article.leyes.titulo}\nArtículo ${article.numero}: ${article.titulo || ''}\n\n${article.contenido}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-jack-base border border-jack-gold w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative rounded-sm animate-in zoom-in-95 duration-200">
                
                {/* Header del Modal */}
                <div className="flex justify-between items-center p-5 border-b border-jack-gold/20 bg-jack-panel">
                    <div>
                        <p className="text-xs text-jack-gold tracking-widest uppercase mb-1">{article.leyes.titulo}</p>
                        <h2 className="text-2xl font-cinzel text-jack-white font-bold">Artículo {article.numero}</h2>
                    </div>
                    <button onClick={onClose} className="text-jack-silver hover:text-white bg-white/5 p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cuerpo Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar bg-jack-base">
                    {article.titulo && (
                        <h3 className="text-lg font-bold text-jack-gold mb-4 uppercase tracking-wide text-center">
                            {article.titulo}
                        </h3>
                    )}
                    <p className="text-jack-silver text-base font-serif leading-loose whitespace-pre-wrap text-justify">
                        {article.contenido}
                    </p>
                </div>

                {/* Footer de Acciones */}
                <div className="p-4 border-t border-jack-gold/20 bg-jack-panel flex justify-end gap-3">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-jack-base border border-jack-gold/30 text-jack-gold hover:bg-jack-gold hover:text-jack-base transition-colors text-xs font-bold tracking-widest uppercase rounded"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copiado' : 'Copiar Texto'}
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-jack-gold text-jack-base font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded"
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
}

// --- UTILIDAD: RESALTADO DE TEXTO ---
function highlightText(text: string, term: string) {
    if (!term) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
        regex.test(part)
            ? <mark key={i} className="bg-jack-gold text-jack-base px-1 font-bold rounded-sm">{part}</mark>
            : part
    );
}