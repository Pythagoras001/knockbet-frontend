/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  Search,
  ArrowRight,
  Filter,
  RotateCcw,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {ReactNode, useEffect, useState} from 'react';
import {formatFecha} from "@/src/util/eventoUtils.ts";
import {Resultado} from "@/src/types/GET/Resultado.ts";
import {useResultados} from "@/src/hooks/EventoHooks/useResultado.ts";
import {useApuesta} from "@/src/hooks/ApuestaHooks/useApuesta.ts";
import {Cuota} from "@/src/types/GET/Apuesta.ts";

interface FinanceViewProps {
  onViewDetail?: (resultado: Resultado) => void;
  onViewAccountStatement?: () => void;
  // React `key` isn't available at runtime; keep for TS callers that pass it.
  key?: string;
}

interface Transaction {
  id: string;
  event: string;
  category: string;
  location: string;
  winner: string;
  loser: string;
  date: string;
  status: 'PENDIENTE' | 'CANCELADA' | 'PAGADA';
}


export default function FinanceView({ onViewDetail, onViewAccountStatement }: FinanceViewProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PAGADA' | 'PENDIENTE'>('ALL');
  const [eventSearch, setEventSearch] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Select Status');

  const { data : resultados , isLoading : loadingResultados } = useResultados();
  const { data : apuestas, isLoading : loadingApuestas } = useApuesta();

  if (loadingResultados || loadingApuestas) return <p>Cargando...</p>

  const pozoTotal = apuestas.reduce((acc, a) => {
    return acc +
      (a.cuotaPeleadorA?.estadisticaAsociada?.gananciaTotalCasa ?? 0) +
      (a.cuotaEmpate?.estadisticaAsociada?.gananciaTotalCasa ?? 0) +
      (a.cuotaPeleadorB?.estadisticaAsociada?.gananciaTotalCasa ?? 0);
  }, 0);

  const getGanancia = (cuota:Cuota) =>
    cuota?.resultadoCuota === "PERDIDA"
      ? cuota?.estadisticaAsociada?.gananciaTotalCasa ?? 0
      : 0;

  const getPerdida = (cuota:Cuota) =>
    cuota?.resultadoCuota === "GANADA"
      ? cuota?.estadisticaAsociada?.pagoTotalPorVictoria ?? 0
      : 0;


  const ganancia = apuestas.reduce((acc, a) => {
    return acc +
      getGanancia(a.cuotaPeleadorA) +
      getGanancia(a.cuotaEmpate) +
      getGanancia(a.cuotaPeleadorB);
  }, 0);

  const perdida = apuestas.reduce((acc, a) => {
    return acc +
      getPerdida(a.cuotaPeleadorA) +
      getPerdida(a.cuotaEmpate) +
      getPerdida(a.cuotaPeleadorB);
  }, 0);

  const filteredTransactions = resultados?.filter(t => true) ?? [];

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
          <span className="text-[120px] md:text-[240px] font-black italic editorial-outline tracking-tighter leading-none whitespace-nowrap uppercase">LEDGER</span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-4"
            >
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase font-headline">
                LIBRO DE <span className="editorial-outline-primary block md:inline">TRANSACCIONES</span>
              </h2>
              <div className="h-1.5 w-24 bg-primary mt-4 rounded-full" />
            </motion.div>

            <p className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
              Registro central de finanzas. Audita transacciones de alto riesgo, márgenes operativos y el estado de liquidación de todo el ecosistema de apuestas.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewAccountStatement}
            className="flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-5 md:py-6 font-black uppercase tracking-widest text-black shadow-[0_0_30px_rgba(255,143,111,0.2)] hover:bg-primary-dim transition-all text-xs md:text-sm italic"
          >
            <CreditCard size={20} strokeWidth={3} />
            <span className="whitespace-nowrap">Ver Presupuesto</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        <MetricCard label="Pozo Total" value={`$ ${pozoTotal.toLocaleString('es-CO')}`} icon={<TrendingUp size={24} />} border="border-l-primary" />
        <MetricCard label="Ganancia" value={`$ ${ganancia.toLocaleString('es-CO')}`} icon={<DollarSign size={24} />} border="border-l-primary" highlightRatio />
        <MetricCard label="Perdida Por Pago" value={`$ ${perdida.toLocaleString('es-CO')}`} icon={<CreditCard size={24} />} border="border-l-red-500" />
        <MetricCard label="Combates Finalizados" value={` ${resultados.length}`} icon={<Users size={24} />} border="border-l-white" />
      </div>

      {/* Controls Container */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="group relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search financial records by event, athlete, or reference..."
              className="w-full rounded-lg border-none bg-surface-lowest/50 py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-500 transition-all focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="flex bg-surface-low border border-white/5 rounded-lg p-1 min-w-fit">
            {['ALL', 'PAGADA', 'PENDIENTE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all rounded ${
                  activeTab === tab ? 'bg-surface-highest text-white shadow-lg' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center justify-center gap-3 rounded-lg px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all border ${
              showAdvancedFilters
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
                      placeholder="Search event..."
                      className="w-full bg-surface-highest border border-white/5 rounded-xl px-12 py-4 text-sm font-bold text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="flex-1 w-full xl:w-auto">
                  <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.2em] mb-4">Fecha</p>
                  <div className="relative group">
                    <input
                      type="text"
                      value={recordDate}
                      onChange={(e) => setRecordDate(e.target.value)}
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
                      <option>Select Status</option>
                      <option>PAGADA</option>
                      <option>PENDIENTE</option>
                      <option>CANCELADA</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-4 w-full xl:w-auto">
                  <button className="flex-1 xl:flex-none px-12 py-5 bg-primary text-black text-xs font-black uppercase tracking-widest rounded-xl italic hover:bg-primary-dim transition-all shadow-xl shadow-primary/10">
                    APPLY FILTERS
                  </button>
                  <button
                    onClick={() => {
                      setEventSearch('');
                      setRecordDate('');
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

      {/* Main Ledger Table */}
      <div className="bg-surface-low border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 md:p-8 border-b border-white/5 bg-surface-high/20 flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <span className="w-1.5 h-8 bg-primary block"></span>
            <h4 className="text-base md:text-lg font-bold tracking-tight font-headline uppercase italic">Historial De Apuestas</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase italic">Operational Records</span>
          </div>
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden lg:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
            <tr className="bg-surface-high/30 border-b border-white/5 font-headline">
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 tracking-[0.25em] uppercase">Evento Asociado</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 tracking-[0.25em] uppercase">Ganador</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 tracking-[0.25em] uppercase">Perdedor</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 tracking-[0.25em] uppercase">Fecha</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 tracking-[0.25em] uppercase text-right">Acciones</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {filteredTransactions.map((result) => (
              <tr
                key={result.id}
                onClick={() => onViewDetail?.(result)}
                className="hover:bg-white/[0.02] transition-all group cursor-pointer"
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-black text-white text-sm uppercase tracking-tight italic leading-none mb-1 group-hover:text-primary transition-colors">{result.pelea.tituloPelea}</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{result.pelea.peleadorA.nombre} VS {result.pelea.peleadorB.nombre}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="font-bold text-white text-sm uppercase tracking-tight italic whitespace-nowrap">{result?.ganador?.nombre ?? "Empate"}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-zinc-500 text-sm font-medium uppercase italic whitespace-nowrap">{result?.perdedor?.nombre ?? "Empate"}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-zinc-500 font-mono text-xs tabular-nums whitespace-nowrap">{formatFecha(result.horaFinalizacion)}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail?.(result);
                    }}
                    className="bg-primary text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded italic opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl shadow-primary/10 hover:scale-[1.05] active:scale-95"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="lg:hidden divide-y divide-white/5">
          {filteredTransactions.map((result) => (
            <div
              key={result.id}
              onClick={() => onViewDetail?.(result)}
              className="p-5 hover:bg-white/[0.02] transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="font-black text-white text-base uppercase tracking-tight italic leading-none mb-1 group-hover:text-primary transition-colors">{result.pelea.tituloPelea}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{result.pelea.peleadorA.nombre} VS {result.pelea.peleadorB.nombre}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Ganador</p>
                  <p className="font-bold text-white text-xs uppercase italic truncate">{result?.ganador?.nombre ?? "Empate"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1 text-right">Perdedor</p>
                  <p className="text-zinc-500 text-xs font-medium uppercase italic truncate text-right">{result?.perdedor?.nombre ?? "Empate"}</p>
                </div>
              </div>

              <div className="flex justify-between items-center sm:items-end">
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Fecha de Registro</p>
                  <p className="text-zinc-500 font-mono text-[10px] tabular-nums">{formatFecha(result.horaFinalizacion)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetail?.(result);
                  }}
                  className="bg-primary text-black px-6 py-2.5 rounded font-black text-[10px] uppercase tracking-widest italic shadow-xl shadow-primary/10 active:scale-95 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, icon, border, highlightRatio }: { label: string, value: string, icon: ReactNode, border: string, highlightRatio?: boolean }) {
  return (
    <div className={`p-6 md:p-8 bg-surface-low border border-white/5 rounded-xl ${border} border-l-4 shadow-xl relative overflow-hidden group hover:bg-surface-high transition-all pointer-events-none`}>
      <div className={`absolute -right-4 -top-4 opacity-[0.03] scale-150 transition-transform group-hover:scale-[1.7] ${highlightRatio ? 'text-primary' : 'text-zinc-500'}`}>
        {icon}
      </div>
      <p className="text-zinc-500 text-[9px] md:text-[10px] font-black tracking-widest uppercase mb-4">{label}</p>
      <p className={`text-xl md:text-2xl font-black tracking-tight ${highlightRatio ? 'text-primary' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const styles = {
    PENDIENTE: 'bg-zinc-800 text-zinc-400 border-zinc-700/50',
    CANCELADA: 'bg-red-950/30 text-red-400 border-red-500/20',
    PAGADA: 'bg-green-950/30 text-green-400 border-green-500/20'
  };

  return (
    <span className={`px-4 py-1.5 text-[10px] font-black tracking-tighter rounded-full border uppercase italic ${styles[status]}`}>
      {status}
    </span>
  );
}
