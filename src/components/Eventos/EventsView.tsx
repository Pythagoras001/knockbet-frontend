/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Ticket,
  Sparkles,
  ArrowRight,
  Edit2,
  Trash2,
  MoreVertical,
  Calendar,
  Search,
  Filter,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useState } from 'react';
import { usePeleadores } from "@/src/hooks/PeleadoresHooks/usePeleadores.ts";
import { useEventos } from "@/src/hooks/EventoHooks/useEventos.ts";
import { formatFecha } from "@/src/util/eventoUtils.ts";
import { Evento } from "@/src/types/GET/Evento.ts";
import EditEventModal from "@/src/components/Eventos/EditEventModal.tsx";

interface EventsViewProps {
  onEventClick: (event: Evento) => void;
  onRegisterEvent?: () => void;
}

export default function EventsView({ onEventClick, onRegisterEvent }: EventsViewProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PROGRAMADA' | 'EN_DUELO' | 'FINALIZADA' | 'CANCELADA'>('ALL');
  const [fighterSearch, setFighterSearch] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<Evento | null>(null);

  const { data: eventos, isLoading: loadingEventos } = useEventos();

  if (loadingEventos) return <div>Loading...</div>;

  const filteredEvents = eventos.filter(e => {
    const estadoFiltro =
      activeTab !== 'ALL' ? activeTab : selectedStatus;

    if (estadoFiltro !== 'ALL' && e.estadoPelea !== estadoFiltro) {
      return false;
    }

    if (fighterSearch) {
      const query = fighterSearch.toLowerCase();
      const matches =
        e.peleadorA.nombre.toLowerCase().includes(query) ||
        e.peleadorB.nombre.toLowerCase().includes(query);

      if (!matches) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!e.tituloPelea.toLowerCase().includes(query)) return false;
    }

    if (eventDate) {
      const fecha = new Date(e.fechaPelea)
        .toISOString()
        .slice(0, 10);

      if (!fecha.includes(eventDate)) return false;
    }

    return true;
  });

  const getEstadoPeleaStyles = (estado: string): string => {
    switch (estado) {
      case "PROGRAMADA":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "EN_DUELO":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "FINALIZADA":
        return "text-zinc-500 bg-zinc-800 border-zinc-700/50";
      case "CANCELADA":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="mx-auto w-full max-w-[1600px] px-4 md:px-8 py-6 md:py-10"
    >
      {/* Editorial Header */}
      <div className="relative overflow-hidden mb-8 md:mb-12 p-6 md:p-10 bg-surface-low border border-white/5 rounded-2xl">
        {/* Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none select-none -translate-y-1/4 translate-x-1/4">
          <span className="text-[120px] md:text-[240px] font-black italic editorial-outline tracking-tighter leading-none whitespace-nowrap uppercase">EVENTS</span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-4"
            >
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase font-headline">
                CONTROL <span className="editorial-outline-primary block md:inline">DE EVENTOS</span>
              </h2>
              <div className="h-1.5 w-24 bg-primary mt-4 rounded-full" />
            </motion.div>

            <p className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
              Control Maestro de Eventos. Logística de combate y supervisión de transmisiones en vivo para la red de Knockbet.
            </p>
          </div>

          <motion.button
            onClick={onRegisterEvent}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-5 md:py-6 font-black uppercase tracking-widest text-black shadow-[0_0_30px_rgba(255,143,111,0.2)] hover:bg-primary-dim transition-all text-xs md:text-sm italic"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="whitespace-nowrap">Nuevo Evento</span>
          </motion.button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="group relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar evento por nombre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-none bg-surface-lowest/50 py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-500 transition-all focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="flex bg-surface-low border border-white/5 rounded-lg p-1 min-w-fit">
            {['ALL', 'PROGRAMADA', 'EN_DUELO', 'FINALIZADA', 'CANCELADA'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all rounded ${activeTab === tab ? 'bg-surface-highest text-white shadow-lg' : 'text-zinc-500 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center justify-center gap-3 rounded-lg px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all border ${showAdvancedFilters
              ? 'bg-primary text-black border-primary'
              : 'bg-surface-low text-white border-white/5 hover:bg-surface-high'
              }`}
          >
            <Filter size={16} />
            Filtros
          </button>
        </div>

        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-surface-low/30 border border-white/5 rounded-xl"
            >
              <div className="p-8 flex flex-col xl:flex-row items-end gap-10">
                {/* Fighter Search */}
                <div className="flex-1 w-full xl:w-auto">
                  <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.2em] mb-4">Peleador</p>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={16} />
                    <input
                      type="text"
                      value={fighterSearch}
                      onChange={(e) => setFighterSearch(e.target.value)}
                      placeholder="Buscar Peleador..."
                      className="w-full bg-surface-highest border border-white/5 rounded-xl px-12 py-4 text-sm font-bold text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Event Date */}
                <div className="flex-1 w-full xl:w-auto">
                  <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.2em] mb-4">Fecha</p>
                  <div className="relative group">
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      placeholder="dd/mm/aaaa"
                      className="w-full bg-surface-highest border border-white/5 rounded-xl px-6 py-4 text-sm font-bold text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary/30"
                    />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="flex-1 w-full xl:w-auto">
                  <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.2em] mb-4">Estado</p>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full appearance-none bg-surface-highest border border-white/5 rounded-xl px-6 py-4 text-sm font-black text-white focus:ring-1 focus:ring-primary/30 cursor-pointer"
                    >
                      <option>ALL</option>
                      <option>PROGRAMADA</option>
                      <option>EN_DUELO</option>
                      <option>FINALIZADA</option>
                      <option>CANCELADA</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-4 w-full xl:w-auto">
                  <button className="flex-1 xl:flex-none px-12 py-5 bg-primary text-black text-xs font-black uppercase tracking-widest rounded-xl italic hover:bg-primary-dim transition-all shadow-xl shadow-primary/10">
                    Aplicar Filtros
                  </button>
                  <button
                    onClick={() => {
                      setFighterSearch('');
                      setEventDate('');
                      setSelectedStatus('Select Status');
                    }}
                    className="p-5 bg-surface-low border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-surface-low rounded-xl overflow-hidden shadow-2xl border border-white/5">
        <div className="px-4 md:px-8 py-5 md:py-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 bg-surface-high/10">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <span className="w-1.5 h-8 bg-primary block"></span>
            <h4 className="text-base md:text-lg font-bold tracking-tight font-headline uppercase italic">Directorio de Eventos</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
            <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase italic">Bitácora de Control</span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-high/30 border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase">Nombre del evento y fecha</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase">Combate Principal</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase">Estado</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase text-right">Accion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={`hover:bg-white/[0.02] transition-all group cursor-pointer ${event.estadoPelea === 'CANCELADA' ? 'opacity-60' : ''}`}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className={`font-bold tracking-tight uppercase ${event.estadoPelea === 'CANCELADO' ? 'text-zinc-600 line-through' : 'text-white'}`}>
                          {event.tituloPelea}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${event.estadoPelea === 'EN_DUELO' ? 'text-primary font-bold animate-pulse' : 'text-zinc-400 font-medium'}`}>
                          {formatFecha(event.fechaPelea)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">

                      <span className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase ${event.estadoPelea === 'CANCELADO' ? 'text-zinc-600' : 'text-zinc-200'}`}>{event.peleadorA.nombre}</span>
                        <span className="text-[10px] font-black text-primary italic">VS</span>
                      </span>

                      <span className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase ${event.estadoPelea === 'CANCELADO' ? 'text-zinc-600' : 'text-zinc-200'}`}>{event.peleadorB.nombre}</span>
                      </span>

                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 text-[10px] font-black tracking-widest rounded border uppercase ${getEstadoPeleaStyles(event.estadoPelea)}`}>
                      {event.estadoPelea}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEventForEdit(event);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2.5 bg-surface-highest/40 hover:bg-surface-highest rounded text-zinc-400 hover:text-white transition-all shadow-lg shadow-black/20"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2.5 bg-red-900/10 hover:bg-red-500/20 rounded text-zinc-500 hover:text-red-400 transition-all shadow-lg shadow-black/20">
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className="bg-primary text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded italic hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary/10 ml-2"
                      >
                        Control
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List */}
        <div className="lg:hidden divide-y divide-white/5">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`p-5 hover:bg-white/[0.02] transition-colors relative group cursor-pointer ${event.estadoPelea === 'CANCELADO' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/*CONFIGURAR CODIGO*/}
                  <div className={`w-12 h-12 rounded-lg bg-surface-highest flex items-center justify-center font-black italic flex-shrink-0 text-lg ${event.estadoPelea === 'CANCELADO' ? 'text-zinc-700' : 'text-primary'}`}>
                    {101}
                  </div>
                  <div>
                    <h5 className={`font-black uppercase tracking-tight italic transition-colors group-hover:text-primary ${event.estadoPelea === 'CANCELADO' ? 'text-zinc-600 line-through' : 'text-white'}`}>
                      {event.tituloPelea}
                    </h5>
                    <div className={`flex items-center gap-2 text-[10px] mt-1 ${event.estadoPelea === 'EN_DUELO' ? 'text-primary font-black' : 'text-zinc-500 font-bold'}`}>
                      <Calendar size={12} />
                      <span className="uppercase tracking-widest">{formatFecha(event.fechaPelea)}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-zinc-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="bg-surface-high/30 rounded-lg p-4 border border-white/5 mb-4">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Main Event Pair</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="flex items-center gap-4">
                    <span className="text-sm font-black text-white italic tracking-tighter uppercase">{event.peleadorA.nombre}</span>
                    <span className="text-xs font-black text-primary italic">VS</span>
                  </span>

                  <span key={1} className="flex items-center gap-4">
                    <span className="text-sm font-black text-white italic tracking-tighter uppercase">{event.peleadorB.nombre}</span>
                    <span className="text-xs font-black text-primary italic">VS</span>
                  </span>

                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-4 py-1.5 text-[9px] font-black tracking-widest rounded border uppercase ${getEstadoPeleaStyles(event.estadoPelea)}`}>
                  {event.estadoPelea}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  className="bg-primary text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded italic shadow-xl shadow-primary/10"
                >
                  EVENT CONTROL
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 md:px-8 py-5 bg-surface-high/20 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">Viendo {filteredEvents.length} of {eventos.length} Eventos</span>
          <div className="flex gap-2">
            <NavBtn icon={<ChevronLeft size={16} />} />
            <button className="w-10 h-10 flex items-center justify-center rounded bg-primary text-black font-black text-xs italic">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded bg-surface-highest text-zinc-400 hover:text-white transition-all text-xs font-black italic">2</button>
            <NavBtn icon={<ChevronRight size={16} />} />
          </div>
        </div>
      </div>

      {/* Contextual Stats Bento */}
      <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <BentoBlock
          icon={<TrendingUp size={20} />}
          label="Eventos Programados"
          value={eventos.filter(e => e.estadoPelea === "PROGRAMADA").length}
        />
        <BentoBlock
          icon={<Ticket size={20} />}
          label="Total De Eventos En Progreso"
          value={eventos.filter(e => e.estadoPelea === "EN_DUELO").length}
        />
        <BentoBlock
          icon={<Ticket size={20} />}
          label="Total De Eventos Registrados"
          value={eventos.length}
        />
      </div>

      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEventForEdit(null);
        }}
        event={selectedEventForEdit}
      />
    </motion.div>
  );
}

function StatsBadge({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="bg-surface-high/60 backdrop-blur-xl px-4 md:px-7 py-4 md:py-5 rounded border border-white/5 flex flex-col min-w-[140px] md:min-w-[160px] flex-shrink-0">
      <span className="text-zinc-500 text-[9px] md:text-[10px] font-black tracking-widest uppercase mb-1">{label}</span>
      <span className={`text-xl md:text-2xl font-black italic tracking-tighter ${highlight ? 'text-primary' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function BentoBlock({ icon, label, value, description, subContent, cta, highlight, className = "" }: { icon: ReactNode, label: string, value: ReactNode, description?: string, subContent?: ReactNode, cta?: string, highlight?: boolean, className?: string }) {
  return (
    <div className={`p-6 md:p-8 rounded-xl relative overflow-hidden group shadow-xl transition-all hover:bg-surface-high/80 ${highlight ? 'bg-surface-high border-2 border-primary/20' : 'bg-surface-high border border-white/5'} ${className}`}>
      <div className={`absolute top-0 right-0 p-4 opacity-[0.03] transform scale-150 transition-transform group-hover:scale-[1.7] ${highlight ? 'text-primary' : 'text-white'}`}>
        {icon}
      </div>
      <div className="text-primary mb-4">{icon}</div>
      <h5 className="text-zinc-500 text-[9px] md:text-[10px] font-black tracking-[0.25em] uppercase mb-3">{label}</h5>
      <div className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">{value}</div>
      {description && <p className="text-[11px] text-zinc-500 mt-3 font-medium opacity-80">{description}</p>}
      {subContent}
      {cta && (
        <button className="mt-6 text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all italic">
          {cta} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

function NavBtn({ icon }: { icon: ReactNode }) {
  return (
    <button className="w-10 h-10 flex items-center justify-center rounded bg-surface-highest text-zinc-400 hover:text-white transition-all border border-white/5">
      {icon}
    </button>
  );
}
