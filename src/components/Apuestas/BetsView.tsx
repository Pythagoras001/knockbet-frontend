/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Bolt,
  BarChart3,
  Edit2,
  Trash2,
  Zap,
  Activity,
  MoreVertical,
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, ReactNode } from 'react';
import CreateMarketModal from './CreateMarketModal.tsx';
import { useApuesta } from "@/src/hooks/ApuestaHooks/useApuesta.ts";
import type { Evento } from '@/src/types/GET/Evento.ts';
import type { Apuesta } from '@/src/types/GET/Apuesta.ts';
import { useConectBet } from "@/src/hooks/ApuestaHooks/useConectBet.ts";
import { usePresupuesto } from "@/src/hooks/PresupuestoHooks/usePresupuesto.ts";

interface BetsViewProps {
  onBetClick?: (apuesta: Apuesta) => void;
  key?: string;
}

export default function BetsView({ onBetClick }: BetsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ABIERTA' | 'CERRADA' | 'FINALIZADA' | 'CANCELADA'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [marketDate, setMarketDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Select Status');

  const { data: apuestas, isLoading: loadingApuesta } = useApuesta();
  const { data: presupuesto, isLoading: loadingPresupuesto } = usePresupuesto();
  const { mutate: conectBet } = useConectBet();

  if (loadingPresupuesto || loadingApuesta) return <p>Cargando...</p>;

  const handleMarketConfirm = (ev: Evento) => {
    conectBet(ev.id);
  };

  const filteredMarkets = apuestas.filter((m) => {
    // Search filter (top input)
    const q = searchQuery.trim().toLowerCase();
    const haystack = [
      m.pelea?.tituloPelea,
      m.pelea?.peleadorA?.nombre,
      m.pelea?.peleadorB?.nombre,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = q === '' || haystack.includes(q);

    // Tab status filter
    let matchesStatus = true;
    if (activeTab !== 'ALL') {
      matchesStatus = m.activo === activeTab;
    }

    // Advanced filter: Evento (string match on same haystack)
    const evQ = eventSearch.trim().toLowerCase();
    const matchesEvent = evQ === '' || haystack.includes(evQ);

    // Advanced filter: Fecha (same calendar day)
    const dateQ = marketDate.trim(); // expected yyyy-mm-dd from <input type="date" />
    let matchesDate = true;
    if (dateQ !== '') {
      const selected = new Date(dateQ);
      const pelea = new Date((m.pelea as any)?.fechaPelea);
      if (Number.isNaN(selected.getTime()) || Number.isNaN(pelea.getTime())) {
        matchesDate = true; // if parsing fails, don't block results
      } else {
        matchesDate =
          selected.getFullYear() === pelea.getFullYear() &&
          selected.getMonth() === pelea.getMonth() &&
          selected.getDate() === pelea.getDate();
      }
    }

    // Advanced filter: Estado (dropdown)
    let matchesSelectedStatus = true;
    if (selectedStatus !== 'Select Status') {
      const activo = selectedStatus;
      matchesSelectedStatus = activo ? m.activo === activo : true;
    }

    return matchesSearch && matchesStatus && matchesEvent && matchesDate && matchesSelectedStatus;
  });

  const montoTotalDeApuestasActivas = (apuestas || [])
    .filter(a => a.activo !== "FINALIZADA" && a.activo !== "CANCELADA")
    .reduce((acc, apuesta) => {
      const aGanancia = apuesta.cuotaPeleadorA?.estadisticaAsociada?.gananciaTotalCasa || 0;
      const empateGanancia = apuesta.cuotaEmpate?.estadisticaAsociada?.gananciaTotalCasa || 0;
      const bGanancia = apuesta.cuotaPeleadorB?.estadisticaAsociada?.gananciaTotalCasa || 0;

      return acc + aGanancia + empateGanancia + bGanancia;
    }, 0);

  const montoTotalPagoDeApuestasActivas = (apuestas || [])
    .filter(a => a.activo !== "FINALIZADA" && a.activo !== "CANCELADA")
    .reduce((acc, apuesta) => {
      const aGanancia = apuesta.cuotaPeleadorA?.estadisticaAsociada?.pagoTotalPorVictoria || 0;
      const empateGanancia = apuesta.cuotaEmpate?.estadisticaAsociada?.pagoTotalPorVictoria || 0;
      const bGanancia = apuesta.cuotaPeleadorB?.estadisticaAsociada?.pagoTotalPorVictoria || 0;

      return acc + aGanancia + empateGanancia + bGanancia;
    }, 0);

  const porcentajeDeRiesgo = () => {
    return Math.round((montoTotalPagoDeApuestasActivas / presupuesto.presupuestoInicial) * 100);
  }

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
          <span className="text-[120px] md:text-[240px] font-black italic editorial-outline tracking-tighter leading-none whitespace-nowrap uppercase">MARKETS</span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-4"
            >
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase font-headline">
                MERCADOS DE <span className="editorial-outline-primary block md:inline">APUESTAS</span>
              </h2>
              <div className="h-1.5 w-24 bg-primary mt-4 rounded-full" />
            </motion.div>

            <p className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
              CONTROL TOTAL DE RIESGO. Ajuste de cuotas en tiempo real y monitoreo de alta exposición.
            </p>
          </div>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-5 md:py-6 font-black uppercase tracking-widest text-black shadow-[0_0_30px_rgba(255,143,111,0.2)] hover:bg-primary-dim transition-all text-xs md:text-sm italic"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="whitespace-nowrap">Asociar Nueva Apuesta</span>
          </motion.button>
        </div>
      </div>

      {/* Dashboard Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <StatsCard
          icon={<Bolt size={32} />}
          label="Apuestas Abiertas"
          value={`${apuestas.filter(a => a.activo === "ABIERTA").length}`}
        />
        <StatsCard
          icon={<Bolt size={32} />}
          label="Pozo Total De Apuestas Activas + Cerradas"
          value={`$ ${montoTotalDeApuestasActivas.toLocaleString("es-CO")}`}
          highlight
        />
        <StatsCard
          icon={<BarChart3 size={32} />}
          label="Pago Peor Caso Por Victoria Activas + Cerradas"
          value={`$ ${montoTotalPagoDeApuestasActivas.toLocaleString("es-CO")}`}
          className="sm:col-span-2 md:col-span-1"
        />
      </div>

      {/* Main Data Table Container */}
      {/* Controls */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="group relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por evento o peleador..."
              className="w-full rounded-lg border-none bg-surface-lowest/50 py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-500 transition-all focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="flex bg-surface-low border border-white/5 rounded-lg p-1 min-w-fit">
            {['ALL', 'ABIERTA', 'CERRADA', 'FINALIZADA', 'CANCELADA'].map((tab) => (
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
            Filters
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
                {/* Event Search */}
                <div className="flex-1 w-full xl:w-auto">
                  <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.2em] mb-4">Evento</p>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={16} />
                    <input
                      type="text"
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      placeholder="Buscar evento..."
                      className="w-full bg-surface-highest border border-white/5 rounded-xl px-12 py-4 text-sm font-bold text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="flex-1 w-full xl:w-auto">
                  <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.2em] mb-4">Fecha</p>
                  <div className="relative group">
                    <input
                      type="date"
                      value={marketDate}
                      onChange={(e) => setMarketDate(e.target.value)}
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
                      <option>Select Status</option>
                      <option>ABIERTA</option>
                      <option>CERRADA</option>
                      <option>FINALIZADA</option>
                      <option>CANCELADA</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-4 w-full xl:w-auto">
                  <button
                    onClick={() => setShowAdvancedFilters(false)}
                    className="flex-1 xl:flex-none px-12 py-5 bg-primary text-black text-xs font-black uppercase tracking-widest rounded-xl italic hover:bg-primary-dim transition-all shadow-xl shadow-primary/10"
                  >
                    APPLY FILTERS
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setEventSearch('');
                      setMarketDate('');
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

      <div className="bg-surface-low border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 bg-surface-high/20">

          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <span className="w-1.5 h-8 bg-primary block"></span>
            <h4 className="text-base md:text-lg font-bold tracking-tight font-headline uppercase italic">Directorio de Eventos</h4>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
            <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase italic">Apuestas Knockbet</span>
          </div>
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden lg:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-high/50">
                <th className="px-8 py-5 text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase">Evento Asociado</th>
                <th className="px-8 py-5 text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase text-center">Pelador A / Empate / Pelador B</th>
                <th className="px-8 py-5 text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase">Estado Apuesta</th>
                <th className="px-8 py-5 text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase text-right">Accion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMarkets.map((market) => (
                <tr key={market.id} onClick={() => onBetClick?.(market)} className="hover:bg-white/[0.02] transition-all group cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-base font-black text-white uppercase tracking-tight italic transition-colors group-hover:text-primary leading-none mb-1">{market.pelea.peleadorA.nombre} VS {market.pelea.peleadorB.nombre}</span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{market.pelea.tituloPelea}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-mono text-xl font-black text-primary tabular-nums italic">{market.cuotaPeleadorA.cuotaGananciaActual} - {market.cuotaEmpate.cuotaGananciaActual} - {market.cuotaPeleadorB.cuotaGananciaActual}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${market.activo === 'ABIERTA' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-white/20'}`}></div>
                      <span className="text-xs font-bold text-zinc-300 uppercase tracking-tight">{market.activo}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                      <button className="p-2.5 bg-red-900/10 hover:bg-red-500/20 rounded text-zinc-500 hover:text-red-400 transition-all shadow-lg shadow-black/20">
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onBetClick?.(market); }}
                        className="bg-primary text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded italic hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary/10 ml-2"
                      >
                        {market.activo === 'ABIERTA' ? 'Apostar' : 'Ver Apuesta'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet View (Cards) */}
        <div className="lg:hidden p-4 space-y-4">
          {filteredMarkets.map((market) => (
            <div key={market.id} onClick={() => onBetClick?.(market)} className="bg-surface-high/30 border border-white/5 rounded-xl p-5 hover:border-primary/20 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-sm md:text-base font-black text-white uppercase tracking-tight italic leading-none mb-1">{market.pelea.peleadorA.nombre} VS {market.pelea.peleadorB.nombre}</span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{market.pelea.tituloPelea}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-surface-highest/50 rounded text-zinc-400 hover:text-white">
                    <Edit2 size={14} />
                  </button>
                  <button className="p-2 bg-red-900/20 rounded text-zinc-500 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 border-y border-white/5 py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Odds</span>
                  <span className="font-mono text-lg font-black text-primary tabular-nums italic">{market.cuotaPeleadorA.cuotaGananciaActual} - {market.cuotaEmpate.cuotaGananciaActual} - {market.cuotaPeleadorB.cuotaGananciaActual}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${market.activo === 'ABIERTA' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-white/20'}`}></div>
                    <span className="text-[10px] font-black text-white uppercase italic">{market.activo}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Activity size={12} className="text-primary" />
                  <span className="text-[9px] font-bold uppercase tracking-tight">{market.pelea.tituloPelea}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onBetClick?.(market); }}
                  className="w-full sm:w-auto bg-primary text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded italic active:scale-95 transition-all shadow-xl shadow-primary/10"
                >
                  Confirm Apuesta
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 md:p-8 bg-surface-high/10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Viendo <span className="text-white">{filteredMarkets.length}</span> de <span className="text-white">{apuestas.length}</span> Apuestas</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center border border-white/10 rounded bg-surface-high text-zinc-500 hover:text-white hover:bg-surface-highest disabled:opacity-20 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-white/10 rounded bg-surface-high text-zinc-500 hover:text-white hover:bg-surface-highest transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Featured Grid Layer */}
      <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-surface-high p-6 md:p-10 rounded-xl border border-white/5 flex flex-col justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-6 md:p-10 opacity-[0.02] pointer-events-none">
            <Activity size={200} className="w-32 md:w-48 lg:w-64" />
          </div>
          <h4 className="text-xl md:text-2xl font-headline font-black mb-4 md:mb-6 uppercase tracking-tight italic">Salud del sistema <br /> Porcentaje de riesgo global {porcentajeDeRiesgo()}% </h4>
          <p className="relative z-10 text-zinc-400 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 font-medium">
            Porcentaje de riesgo global en todas las apuestas activas.
          </p>
          <div className="relative z-10 space-y-3">
            <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-widest">
              <span className="text-zinc-500">Nivel De Riesgo</span>
              <span className="text-primary italic">{porcentajeDeRiesgo()}%</span>
            </div>
            <div className="w-full h-2 bg-surface-highest overflow-hidden rounded-full p-[2px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${porcentajeDeRiesgo()}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(255,143,111,0.5)]"
              ></motion.div>
            </div>
          </div>
        </div>
      </div>

      <CreateMarketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleMarketConfirm}
      />
    </motion.div>
  );
}

function StatsCard({ icon, label, value, highlight = false, className = "" }: { icon: ReactNode, label: string, value: string, highlight?: boolean, className?: string }) {
  return (
    <div className={`p-6 md:p-8 rounded-xl border border-white/5 relative overflow-hidden shadow-xl transition-all hover:bg-surface-high/50 group ${highlight ? 'bg-surface-high/40' : 'bg-surface-low'} ${className}`}>
      <div className={`absolute -right-4 -bottom-4 opacity-[0.03] transform scale-120 md:scale-150 transition-transform group-hover:scale-[1.7] ${highlight ? 'text-primary' : 'text-white'}`}>
        {icon}
      </div>
      <p className="text-zinc-500 text-[9px] md:text-[10px] font-black tracking-widest uppercase mb-3 md:mb-4">{label}</p>
      <div className="flex items-center gap-4">
        <p className={`text-3xl md:text-5xl font-headline font-black italic tracking-tighter ${highlight ? 'text-primary' : 'text-white'}`}>{value}</p>
        {highlight && (
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-6 bg-primary animate-pulse rounded-full shadow-[0_0_10px_rgba(255,143,111,0.4)]"></div>
            <div className="h-1.5 w-4 bg-primary/40 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
