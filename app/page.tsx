"use client";
import Link from 'next/link';
import { ArrowUpRight, Clock, FileText, Gavel, Plus, Search } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* 1. Header del Dashboard con Acción Rápida */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-cinzel text-jack-white font-bold">Panel de Control</h1>
          <p className="text-jack-silver/60 text-sm mt-1">Resumen de actividad del bufete.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-jack-panel border border-jack-gold/20 text-jack-silver hover:text-white px-4 py-2 rounded-sm text-sm flex items-center gap-2 transition-colors">
            <Search className="w-4 h-4" /> Buscar Expediente
          </button>
          <button className="bg-jack-crimson text-white px-4 py-2 rounded-sm text-sm font-bold tracking-wide flex items-center gap-2 hover:bg-red-900 transition-colors shadow-lg shadow-red-900/20">
            <Plus className="w-4 h-4" /> NUEVO CASO
          </button>
        </div>
      </div>

      {/* 2. Métricas Clave (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Casos Activos', value: '24', change: '+3 este mes', color: 'text-jack-gold' },
          { label: 'Audiencias Pendientes', value: '7', change: 'Próxima: Mañana', color: 'text-jack-crimson' },
          { label: 'Documentos Generados', value: '1,204', change: 'Archivo Histórico', color: 'text-blue-400' },
          { label: 'Clientes Registrados', value: '85', change: 'Base de Datos', color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-jack-panel border border-jack-gold/10 p-6 rounded-sm hover:border-jack-gold/30 transition-colors">
            <p className="text-xs uppercase tracking-widest text-jack-silver/50 mb-2">{stat.label}</p>
            <h3 className={`text-3xl font-bold font-cinzel ${stat.color}`}>{stat.value}</h3>
            <p className="text-xs text-jack-silver/40 mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Área de Trabajo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Columna Izquierda: Casos Recientes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-jack-gold/10 pb-2">
            <h3 className="text-jack-white font-cinzel font-bold">Expedientes Recientes</h3>
            <Link href="/expedientes" className="text-xs text-jack-gold hover:underline">Ver todos</Link>
          </div>

          {/* Lista Simulada de Casos */}
          <div className="space-y-2">
            {[
              { id: 'EXP-2026-001', cliente: 'Industrias S.A.', tipo: 'Laboral', estado: 'En Proceso', fecha: 'Hoy, 10:00 AM' },
              { id: 'EXP-2026-002', cliente: 'Juan Pérez', tipo: 'Penal', estado: 'Audiencia', fecha: 'Ayer' },
              { id: 'EXP-2026-003', cliente: 'Inmobiliaria X', tipo: 'Civil', estado: 'Revisión', fecha: 'Hace 2 días' },
            ].map((caso) => (
              <div key={caso.id} className="bg-jack-panel border border-jack-gold/5 p-4 flex items-center justify-between hover:border-jack-gold/30 cursor-pointer transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-jack-base rounded border border-white/5 text-jack-silver group-hover:text-jack-gold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-jack-white text-sm font-bold">{caso.cliente}</h4>
                    <p className="text-xs text-jack-silver/50">{caso.id} • {caso.tipo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-jack-silver border border-white/5">{caso.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Accesos Directos a Herramientas */}
        <div className="space-y-4">
          <h3 className="text-jack-white font-cinzel font-bold border-b border-jack-gold/10 pb-2">Herramientas Rápidas</h3>

          <Link href="/laboral" className="block group">
            <div className="bg-jack-plum/10 border border-jack-crimson/20 p-4 rounded-sm hover:bg-jack-crimson/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Gavel className="w-5 h-5 text-jack-crimson" />
                <h4 className="text-jack-white font-bold text-sm">Analista Laboral IA</h4>
              </div>
              <p className="text-xs text-jack-silver/60">Analizar chats o narrativas para detectar infracciones automáticamente.</p>
            </div>
          </Link>

          <Link href="/codex" className="block group">
            <div className="bg-jack-panel border border-jack-gold/20 p-4 rounded-sm hover:border-jack-gold transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-jack-gold" />
                <h4 className="text-jack-white font-bold text-sm">Consultar Codex</h4>
              </div>
              <p className="text-xs text-jack-silver/60">Búsqueda rápida en leyes y reglamentos.</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}