"use client";
import { Search, UserPlus, Building2, User, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';

// DATA SIMULADA (CRM)
const clientsData = [
    {
        id: 'C-001',
        name: 'Industrias Farmacéuticas S.A.',
        type: 'Empresa',
        contact: 'Lic. Roberto Mendez',
        phone: '+502 2456-7890',
        email: 'legal@indufarma.com',
        cases: 3,
        status: 'VIP'
    },
    {
        id: 'C-002',
        name: 'Juan Carlos Pérez',
        type: 'Individual',
        contact: 'Personal',
        phone: '+502 5555-4444',
        email: 'juancarlos@gmail.com',
        cases: 1,
        status: 'Activo'
    },
    {
        id: 'C-003',
        name: 'Inmobiliaria Los Altos',
        type: 'Empresa',
        contact: 'Arq. Sofia Lima',
        phone: '+502 2333-1111',
        email: 'proyectos@losaltos.gt',
        cases: 5,
        status: 'Deudor'
    },
    {
        id: 'C-004',
        name: 'Banco G&T Continental',
        type: 'Corporativo',
        contact: 'Gerencia Legal',
        phone: '+502 2222-0000',
        email: 'judiciales@gyt.com.gt',
        cases: 12,
        status: 'VIP'
    },
];

export default function ClientesPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER */}
            <div className="flex justify-between items-end border-b border-jack-gold/10 pb-6">
                <div>
                    <h1 className="text-3xl font-cinzel text-jack-white font-bold tracking-wide">Cartera de Clientes</h1>
                    <p className="text-jack-silver/50 text-sm mt-1 font-serif">Directorio de personas individuales y jurídicas.</p>
                </div>
                <button className="px-4 py-2 bg-jack-gold text-jack-base font-bold tracking-wider text-sm flex items-center gap-2 hover:bg-white transition-all shadow-lg">
                    <UserPlus className="w-4 h-4" /> NUEVO CLIENTE
                </button>
            </div>

            {/* SEARCH */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-jack-silver/50" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, NIT o representante..."
                    className="w-full bg-jack-panel border border-jack-gold/10 py-3 pl-12 text-jack-silver focus:border-jack-gold focus:outline-none transition-colors"
                />
            </div>

            {/* GRID DE TARJETAS (Estilo Rolodex Moderno) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientsData.map((client) => (
                    <div key={client.id} className="group bg-jack-panel border border-jack-gold/10 p-6 relative overflow-hidden hover:border-jack-gold/40 transition-all cursor-pointer">

                        {/* Decoración Hover */}
                        <div className="absolute top-0 left-0 w-1 h-0 bg-jack-gold group-hover:h-full transition-all duration-300"></div>

                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-full border ${client.type === 'Empresa' || client.type === 'Corporativo'
                                    ? 'bg-blue-900/10 border-blue-500/20 text-blue-400'
                                    : 'bg-jack-gold/10 border-jack-gold/20 text-jack-gold'
                                }`}>
                                {client.type === 'Empresa' || client.type === 'Corporativo' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                            </div>
                            {client.status === 'VIP' && (
                                <span className="text-[10px] bg-jack-gold text-jack-base px-2 py-0.5 font-bold tracking-widest rounded-sm">VIP</span>
                            )}
                            {client.status === 'Deudor' && (
                                <span className="text-[10px] bg-jack-crimson text-white px-2 py-0.5 font-bold tracking-widest rounded-sm">MORA</span>
                            )}
                        </div>

                        <h3 className="text-lg font-cinzel font-bold text-jack-white mb-1 truncate">{client.name}</h3>
                        <p className="text-xs text-jack-silver/50 mb-4 font-mono">{client.id} • {client.type}</p>

                        <div className="space-y-2 border-t border-white/5 pt-4 text-sm text-jack-silver/70">
                            <div className="flex items-center gap-2">
                                <User className="w-3 h-3 text-jack-gold/50" />
                                <span className="truncate">{client.contact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-jack-gold/50" />
                                <span>{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3 text-jack-gold/50" />
                                <span className="truncate hover:text-jack-gold transition-colors">{client.email}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-xs">
                            <span className="bg-white/5 px-2 py-1 rounded text-jack-silver/50 border border-white/5 group-hover:bg-jack-gold/10 group-hover:text-jack-gold transition-colors">
                                {client.cases} Casos Activos
                            </span>
                            <ChevronRight className="w-4 h-4 text-jack-silver/30 group-hover:translate-x-1 transition-transform" />
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}