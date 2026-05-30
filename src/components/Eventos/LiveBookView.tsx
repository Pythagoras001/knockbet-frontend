/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowLeft,
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  User,
  Zap,
  ArrowUpRight,
  Search,
  Download,
  Filter,
  MoreVertical,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, ReactNode } from 'react';
import {Apuesta} from "@/src/types/GET/Apuesta.ts";
import {Evento} from "@/src/types/GET/Evento.ts";
import BetDetailModal, {BetDetail} from "@/src/components/Apuestas/BetDetailModal.tsx";
import {useEventos} from "@/src/hooks/EventoHooks/useEventos.ts";
import {useUserApuesta} from "@/src/hooks/ApuestaHooks/useUserApuesta.ts";
import {UserApuesta} from "@/src/types/GET/UserApuesta.ts";
import imgVistaApuesta from '../../assets/ImgVistaApuesta.png';



interface LiveBookViewProps {
  onBack: () => void;
  event?: Evento;
  apuestaActual?: Apuesta;
  key?: any;
}

export default function LiveBookView({ onBack, apuestaActual }: LiveBookViewProps) {
  const wagerSelectionName = (wager: UserApuesta) => wager?.ganadorEsperado?.peleador?.nombre ?? 'DRAW';
  const wagerSelectionLabel = (wager: UserApuesta) => wager?.ganadorEsperado?.peleador?.nombre ?? 'Empate';

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SILVA' | 'JONES' | 'DRAW'>('ALL');
  const [selectedBet, setSelectedBet] = useState<UserApuesta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: userApuestas, isLoading: loadingUserApuestas } = useUserApuesta();
  if (loadingUserApuestas) return <p>Cargando...</p>

  const apuestasActuales = userApuestas?.filter(
    ap => ap.apuesta?.id === apuestaActual.id
  ) ?? [];

  const filteredWagers = apuestasActuales.filter(wager => {
    if (activeFilter === 'ALL') return true;
    // Draw wagers may have `ganadorEsperado.peleador === null`.
    return wagerSelectionName(wager) === activeFilter;
  });

  const handleOpenBetDetail = (wager: UserApuesta) => {
    setSelectedBet(wager);
    setIsModalOpen(true);
  };

  const montoTotal =
    (apuestaActual?.cuotaEmpate?.estadisticaAsociada?.gananciaTotalCasa ?? 0) +
    (apuestaActual?.cuotaPeleadorA?.estadisticaAsociada?.gananciaTotalCasa ?? 0) +
    (apuestaActual?.cuotaPeleadorB?.estadisticaAsociada?.gananciaTotalCasa ?? 0);

  const apuestasActivas =
    (apuestaActual?.cuotaEmpate?.estadisticaAsociada?.cantidadUserApuestasAsociadas ?? 0) +
    (apuestaActual?.cuotaPeleadorA?.estadisticaAsociada?.cantidadUserApuestasAsociadas ?? 0) +
    (apuestaActual?.cuotaPeleadorB?.estadisticaAsociada?.cantidadUserApuestasAsociadas ?? 0);

  const maxPorVictoria = Math.max(
    apuestaActual?.cuotaEmpate?.estadisticaAsociada?.pagoTotalPorVictoria ?? 0,
    apuestaActual?.cuotaPeleadorA?.estadisticaAsociada?.pagoTotalPorVictoria ?? 0,
    apuestaActual?.cuotaPeleadorB?.estadisticaAsociada?.pagoTotalPorVictoria ?? 0
  );

  const porcentajeDeMonto = (monto: number) => {
    if (!Number.isFinite(monto) || !Number.isFinite(montoTotal) || montoTotal <= 0) return 0;
    return Math.round((monto / montoTotal) * 100);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto w-full max-w-[1600px] px-4 md:px-8 py-6 md:py-10 space-y-10"
    >
      <div className="w-full space-y-10">

        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a Control
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-zinc-500 font-black text-[10px] uppercase tracking-widest italic">Actualización en tiempo real</span>
          </div>
        </div>

        {/* Cinematic Hero Match Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-surface-low min-h-[400px] md:min-h-[450px] lg:min-h-[500px] flex items-center shadow-2xl border border-white/5 group">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10"></div>
          <div className="absolute inset-0 w-full h-full">
            <img
              src={imgVistaApuesta}
              alt="Fighters"
              className="w-full h-full object-cover object-center opacity-30 grayscale group-hover:scale-105 transition-transform duration-[5s] ease-linear"
            />
          </div>

          <div className="relative z-20 px-6 md:px-10 py-12 flex flex-col xl:flex-row xl:items-center justify-between w-full h-full gap-12">
            <div className="space-y-6 max-w-2xl">
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 italic">
                  <Activity size={10} strokeWidth={3} className="animate-pulse" /> Apeustas En Vivo
                </span>
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-8xl font-headline font-black tracking-tighter text-white uppercase leading-none italic">
                {apuestaActual.pelea.peleadorA.nombre} <span className="editorial-outline">VS.</span> {apuestaActual.pelea.peleadorB.nombre}
              </h2>

              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Estado del Combate</p>
                  <p className="font-headline font-black text-2xl md:text-3xl text-primary italic">Round 3</p>
                </div>
                <div className="hidden sm:block w-px h-12 bg-white/10"></div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Pozo Total Acumulado</p>
                  <p className="font-headline font-black text-2xl md:text-3xl text-white italic tracking-tighter tabular-nums">$ {montoTotal.toLocaleString("es-CO")}</p>
                </div>
              </div>
            </div>

            {/* Distribution Card / Bento */}
            <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-2xl glass-panel relative z-10 w-full xl:w-auto min-w-[320px]">
              {[
                { name: apuestaActual.pelea.peleadorA.nombre, percentage: porcentajeDeMonto(apuestaActual.cuotaPeleadorA.estadisticaAsociada.gananciaTotalCasa), amount: apuestaActual.cuotaPeleadorA.estadisticaAsociada.gananciaTotalCasa.toLocaleString("es-CO") },
                { name: 'EMPATE',percentage: porcentajeDeMonto(apuestaActual.cuotaEmpate.estadisticaAsociada.gananciaTotalCasa), amount: apuestaActual.cuotaEmpate.estadisticaAsociada.gananciaTotalCasa.toLocaleString("es-CO") },
                { name: apuestaActual.pelea.peleadorB.nombre, percentage: porcentajeDeMonto(apuestaActual.cuotaPeleadorB.estadisticaAsociada.gananciaTotalCasa), amount: apuestaActual.cuotaPeleadorB.estadisticaAsociada.gananciaTotalCasa.toLocaleString("es-CO") },
              ].map((side) => (
                <div key={side.name} className="p-5 flex flex-col items-center justify-center bg-surface-high/40 rounded-xl hover:bg-surface-high transition-colors group/item">
                  <p className="text-[10px] text-zinc-500 font-black uppercase mb-2 tracking-widest">{side.name}</p>
                  <span className={`font-headline font-black text-3xl italic tracking-tighter text-primary`}>{side.percentage}%</span>
                  <span className="text-[10px] text-zinc-400 font-black mt-2 tabular-nums">$ {side.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Volumen Total del Mercado"
            value={`$ ${montoTotal.toLocaleString("es-CO")}`}
            icon={<DollarSign size={18} />}
          />
          <StatCard
            label="Apostadores Activos"
            value={`${apuestasActivas}`}
            icon={<Users size={18} />}
          />
          <StatCard
            label="Pago MAX por Victoria"
            value={`$ ${maxPorVictoria.toLocaleString("es-CO")}`}
            icon={<Activity size={18} />}
          />
        </section>

        {/* Market Wagers & Advanced Filters */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
            <div className="space-y-2">
              <h2 className="font-headline font-black text-4xl uppercase italic tracking-tighter text-white">Apuestas <span className="text-primary italic">Asociadas</span></h2>
              <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] italic">Todas las apuestas hechas en la pelea "{apuestaActual.pelea.tituloPelea}"</p>
            </div>

            <div className="flex bg-surface-low p-1.5 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
              {(['ALL', apuestaActual.pelea.peleadorA.nombre, apuestaActual.pelea.peleadorB.nombre, 'DRAW'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-primary text-zinc-950 italic'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {filter === 'ALL' ? 'Todos' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-surface-low rounded-3xl overflow-hidden shadow-2xl border border-white/5 border-b-0">
            <table className="w-full text-left border-collapse">
              <thead>
              <tr className="bg-surface-high/50 border-b border-white/5">
                <th className="px-8 py-5 font-headline font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">Identidad del Apostador</th>
                <th className="px-8 py-5 font-headline font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500 text-center">Lado</th>
                <th className="px-8 py-5 font-headline font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500 text-right">Monto</th>
                <th className="px-8 py-5 font-headline font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500 text-right">Cuota</th>
                <th className="px-8 py-5 font-headline font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500 text-right">Pago Potencial</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
              {filteredWagers.map((wager) => (
                <tr
                  key={wager.id}
                  className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => handleOpenBetDetail(wager)}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-high border border-white/5 flex items-center justify-center text-primary font-black italic tracking-tighter text-sm group-hover:border-primary/30 transition-all">
                        {wager.apostador.nombre.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white italic tracking-tight group-hover:text-primary transition-colors">{wager.apostador.nombre}</p>
                        <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">ID: {wager.apostador.cedula}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                      <span className={`px-2 py-0.5 border text-[10px] font-black uppercase tracking-widest ${
                        wagerSelectionName(wager) === apuestaActual.cuotaPeleadorA.peleador.nombre ? 'border-primary/20 text-primary bg-primary/5 italic' :
                          wagerSelectionName(wager) === apuestaActual.cuotaPeleadorB.peleador.nombre ? 'border-zinc-500/20 text-zinc-400 bg-zinc-500/5' :
                            'border-yellow-500/20 text-yellow-400'
                      }`}>
                        {wagerSelectionLabel(wager)}
                      </span>
                  </td>
                  <td className="px-8 py-6 text-right font-headline font-black text-base italic tracking-tighter text-white tabular-nums">${wager.valorApostado.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right font-headline font-black text-sm text-zinc-500 italic tracking-tighter">{wager.rendimientoGananciaAsociada}</td>
                  <td className="px-8 py-6 text-right font-headline font-black text-lg text-primary italic tracking-tighter tabular-nums">${wager.totalGananciaPosible.toLocaleString()}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsiveness View (Cards) */}
          <div className="md:hidden space-y-4">
            {filteredWagers.map((wager) => (
              <div key={wager.id} className="bg-surface-low rounded-2xl p-6 border border-white/5 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-high border border-white/5 flex items-center justify-center text-primary font-black italic tracking-tighter text-xs">
                      {wager.apostador.nombre.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white italic truncate max-w-[120px]">{wager.apostador.nombre}</h4>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">ID: {wager.apostador.cedula}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 border text-[9px] font-black uppercase tracking-widest italic ${
                    wagerSelectionName(wager) === apuestaActual.cuotaPeleadorA.peleador.nombre ? 'border-primary/20 text-primary bg-primary/5' :
                      wagerSelectionName(wager) === apuestaActual.cuotaPeleadorB.peleador.nombre ? 'border-zinc-500/20 text-zinc-400 bg-zinc-500/5' :
                        'border-yellow-500/20 text-yellow-400'
                  }`}>
                    {wagerSelectionLabel(wager)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <label className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1 block">MONTO</label>
                    <p className="text-lg font-headline font-black italic text-white tabular-nums">${wager.valorApostado.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <label className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1 block">CUOTA</label>
                    <p className="text-lg font-headline font-black italic text-zinc-500 tracking-tighter">{wager.rendimientoGananciaAsociada}</p>
                  </div>
                </div>

                <div className="bg-surface-high/50 p-4 rounded-xl flex justify-between items-center group">
                  <div>
                    <label className="text-[8px] text-primary/50 font-black uppercase tracking-widest mb-0.5 block">PAGO POTENCIAL</label>
                    <p className="text-xl font-headline font-black italic text-primary tabular-nums tracking-tighter">${wager.totalGananciaPosible.toLocaleString()}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <Clock size={12} className="text-zinc-700 mb-1" />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Ayer</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBetDetail(wager)}
                  className="w-full py-4 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white flex items-center justify-center gap-2 group"
                >
                  Ver Detalles de Apuesta <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BetDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bet={selectedBet}
      />
    </motion.div>
  );
}

function StatCard({ label, value, trend, trendLabel, subValue, subLabel, icon }: { label: string, value: string, trend?: string, trendLabel?: string, subValue?: string, subLabel?: string, icon: ReactNode }) {
  return (
    <div className="bg-surface-low p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all">
      <div className="absolute -right-4 -top-4 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000 text-primary">
        {icon}
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] font-headline">{label}</span>
        </div>
        <div>
          <h3 className="text-4xl font-headline font-black italic tracking-tighter text-white">{value}</h3>
          {(trend || subValue) && (
            <div className="flex items-center gap-2 mt-2">
              {trend && <span className="text-xs font-black text-primary italic">{trend}</span>}
              <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">{trendLabel || subLabel} {subValue && <span className="text-zinc-500 ml-1">{subValue}</span>}</span>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] bg-primary/20 w-full group-hover:bg-primary transition-all duration-500"></div>
    </div>
  );
}
