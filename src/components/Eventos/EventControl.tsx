/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowLeft,
  Settings,
  Bell,
  PlayCircle,
  CheckCircle,
  XCircle,
  Timer,
  Calendar,
  Clock,
  MapPin,
  Radio,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useState, ReactNode } from 'react';
import WinnerModal from './WinnerModal.tsx';
import { Evento } from "@/src/types/GET/Evento.ts";
import { formatFecha, formatHora } from "@/src/util/eventoUtils.ts";
import { usePeleadores } from "@/src/hooks/PeleadoresHooks/usePeleadores.ts";
import { useCreateEvento } from "@/src/hooks/EventoHooks/useCreateEvent.ts";
import { useStartFight } from "@/src/hooks/EventoHooks/useStartFiight.ts";
import { ResultadoPost } from "@/src/types/POST/ResultadoPost.ts";
import { useCreatePeleador } from "@/src/hooks/PeleadoresHooks/useCreatePeleador.ts";
import { useFinishEvent } from "@/src/hooks/EventoHooks/useFinishEvent.ts";
import { useApuesta } from "@/src/hooks/ApuestaHooks/useApuesta.ts";
import { Apuesta } from "@/src/types/GET/Apuesta.ts";
import { useResultados } from '@/src/hooks/EventoHooks/useResultado.ts';
import { Resultado } from '@/src/types/GET/Resultado.ts';
import {useCancelFight} from "@/src/hooks/EventoHooks/useCancelEvent.ts";

interface EventControlProps {
  event?: Evento;
  onBack: () => void;
  onViewLiveBook?: (apuesta: Apuesta) => void;
  onViewDetail?: (resultado: Resultado) => void;
}

export default function EventControl({ event, onBack, onViewLiveBook, onViewDetail }: EventControlProps) {
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [estadoPeleaUI, setEstadoPeleaUI] = useState(event.estadoPelea);

  const { mutate: startFight } = useStartFight();
  const { mutate: finishEvent } = useFinishEvent();
  const { mutate: cancelEvent } = useCancelFight();

  const { refetch } = useResultados();

  const { data: apuestas, isLoading: loadingApuesta } = useApuesta();

  if (loadingApuesta) return <p>Cargando...</p>

  const apuestaActual = apuestas?.find(
    a => a.pelea?.id === event?.id
  ) ?? null;

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

  useEffect(() => {
    setEstadoPeleaUI(event.estadoPelea);
  }, [event.estadoPelea]);

  const initialState: ResultadoPost = {
    pelea: '',
    peleadorGanador: '',
    empate: false
  }

  const handleConfirmWinner = (winnerId: string | 'DRAW') => {
    setIsWinnerModalOpen(false);
    setEstadoPeleaUI("FINALIZADA");

    initialState.pelea = event.id;

    if (winnerId === "DRAW") {
      initialState.empate = true;
    } else {
      initialState.peleadorGanador = winnerId;
    }

    finishEvent(initialState, {
      onSuccess: async () => {
        const { data } = await refetch();

        const resultadoAsociado = data?.find(
          (r: any) => r.pelea.id === event.id
        );

        if (!resultadoAsociado) {
          console.log("No se encontró el resultado aún");
          return;
        }

        console.log("Pelea Encontrada");
        console.log(resultadoAsociado?.pelea?.tituloPelea);

        onViewDetail(resultadoAsociado);
      }
    });
  };

  const handleStartFight = () => {
    if (estadoPeleaUI !== "PROGRAMADA") return;
    setEstadoPeleaUI("EN_DUELO");
    startFight(event.id);
  };

  const handleCancelFight = async () => {
    try {
      const response = await cancelEvent(event.id);

      if (estadoPeleaUI === "FINALIZADA" || estadoPeleaUI === "CANCELADA") return;
      setIsWinnerModalOpen(false);
      setEstadoPeleaUI("CANCELADA");

    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const startDisabled = estadoPeleaUI !== "PROGRAMADA";
  const finishDisabled = estadoPeleaUI !== "EN_DUELO";
  const cancelDisabled = estadoPeleaUI === "FINALIZADA" || estadoPeleaUI === "CANCELADA";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto w-full max-w-[1600px] px-4 md:px-8 py-6 md:py-10"
    >
      <WinnerModal
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        onConfirm={handleConfirmWinner}
        event={event}
      />

      {/* View Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a Eventos
        </button>


        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-high border border-white/5 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,143,111,0.5)]"></span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">En vivo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">

          {/* Event Summary Hero Card */}
          <section className="relative overflow-hidden rounded-xl border border-white/5 bg-surface-low min-h-[350px] md:min-h-[400px] flex items-end p-6 md:p-10">
            <div className="absolute inset-0 z-0">
              <img
                src="https://picsum.photos/seed/fighter-action/1200/800?grayscale"
                alt="MMA Action"
                className="w-full h-full object-cover opacity-30 mix-blend-luminosity brightness-75 scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
            </div>
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-2 text-primary font-black mb-4 tracking-[0.2em] text-[10px] uppercase">
                <Radio size={14} className="animate-pulse" />
                {event.peleadorA.fisicoData.categoriaPeso} • {event.peleadorB.fisicoData.categoriaPeso}
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-headline font-black tracking-tighter text-white uppercase leading-none italic">
                {event.peleadorA.nombre} <span className="editorial-outline">VS.</span> {event.peleadorB.nombre}
              </h2>
              <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-6 text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2 whitespace-nowrap"><Calendar size={16} className="text-primary" /> {formatFecha(event.fechaPelea)}</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><Clock size={16} className="text-primary" /> {formatHora(event.fechaPelea)}</span>
                <span className="flex items-center gap-2 whitespace-nowrap"><MapPin size={16} className="text-primary" /> {event.ubicacion.dirreccion}</span>
              </div>
            </div>
          </section>

          {/* Fight Control Panel */}
          <div className="bg-surface-low rounded-xl p-6 md:p-8 border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg md:text-xl font-headline font-black text-white uppercase tracking-tight italic">Control De Pelea</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{estadoPeleaUI}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <ControlAction
                icon={<PlayCircle size={32} />}
                label="Empezar Pelea"
                active={!startDisabled}
                disabled={startDisabled}
                onClick={handleStartFight}
                variant="success"
              />
              <ControlAction
                icon={<CheckCircle size={32} />}
                label="Finalizar Pelea"
                active={!finishDisabled}
                disabled={finishDisabled}
                onClick={() => setIsWinnerModalOpen(true)}
              />
              <ControlAction
                icon={<XCircle size={32} />}
                label="Cancelar Pelea"
                variant="danger"
                active={!cancelDisabled}
                disabled={cancelDisabled}
                onClick={handleCancelFight}
              />
            </div>
          </div>


        </div>

        {/* Sidebar Status Info */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">

          {/* Betting Market Snapshot */}
          <div className="bg-surface-high rounded-xl p-6 md:p-8 flex flex-col justify-between border border-white/5 shadow-2xl relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
              <Zap size={100} />
            </div>
            {loadingApuesta ? (
              <div className="flex-1 flex items-center justify-center text-center py-10">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] italic">
                  Cargando mercado...
                </p>
              </div>
            ) : apuestaActual ? (
              <>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 italic">Mercado Actual</h3>
                  <div className="space-y-8">
                    <div>
                      <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-3">Total Apostado</p>
                      <p className="text-3xl md:text-4xl font-headline font-black text-white tracking-tighter italic tabular-nums">${montoTotal.toLocaleString("es-CO")}</p>
                      <div className="w-full h-1.5 bg-zinc-900 mt-5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          className="h-full bg-primary shadow-[0_0_10px_rgba(255,143,111,0.5)]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Apuestas Activas</p>
                        <p className="text-xl md:text-2xl font-headline font-black text-white tracking-tight italic tabular-nums">{apuestasActivas}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Pago MAX por victoria</p>
                        <p className="text-xl md:text-2xl font-headline font-black text-white tracking-tight italic tabular-nums">${maxPorVictoria.toLocaleString("es-CO")}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onViewLiveBook?.(apuestaActual)}
                  className="mt-10 py-4 w-full border-2 border-primary text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary/5 transition-all rounded-lg italic"
                >
                  Ver Apuestas Asociadas
                </motion.button>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center py-10">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] italic">
                  No se encontro una apuesta asociada a este combate
                </p>
              </div>
            )}
          </div>

          {/* Match Progress */}
          <div className="bg-surface-high rounded-xl p-6 md:p-8 border border-primary/20 relative overflow-hidden shadow-2xl min-h-[400px] flex flex-col h-fit">
            <div className="absolute top-0 right-0 p-6">
              <span className="flex h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(255,143,111,0.6)]"></span>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-10 italic">Pelea En Progreso</h3>

            <div className="flex flex-col items-center justify-center py-6 text-center flex-1">
              <p className="text-zinc-500 font-black uppercase tracking-widest text-[9px] md:text-[10px] mb-4">Estado Actual</p>
              <p className="text-5xl md:text-6xl font-headline font-black text-white mb-8 italic tracking-tighter leading-none">ROUND 1</p>
            </div>

            <div className="space-y-1 mt-10">
              <MatchStat label={`Pago por Victoria ${event.peleadorA.nombre}`} value="14 - 11" />
              <MatchStat label={`Pago por Empate`} value="1 - 0" />
              <MatchStat label={`Pago por Victoria ${event.peleadorB.nombre}`} value="62%" />
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}

function ControlAction({ icon, label, onClick, active = false, disabled = false, variant = 'neutral' }: { icon: ReactNode, label: string, onClick?: () => void, active?: boolean, disabled?: boolean, variant?: 'success' | 'danger' | 'neutral' }) {
  const getStyles = () => {
    if (disabled) return 'border-zinc-800 text-zinc-800 cursor-not-allowed opacity-50 grayscale';
    if (variant === 'success') return 'bg-green-600/10 border-green-600/40 text-green-500 hover:bg-green-600 hover:text-white shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:border-green-600';
    if (variant === 'danger') return 'bg-red-600/10 border-red-600/40 text-red-500 hover:bg-red-600 hover:text-white shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:border-red-600';
    return 'bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-white/20';
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-6 py-8 md:py-10 rounded-xl border-2 transition-all group ${getStyles()}`}
    >
      <div className={`${!disabled && 'group-hover:scale-110'} transition-transform duration-300`}>
        {icon}
      </div>
      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] italic">{label}</span>
    </motion.button>
  );
}

function MatchStat({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-4 px-3 border-b border-white/5 ${highlight ? 'bg-primary/[0.03]' : ''}`}>
      <span className="text-zinc-200 font-bold uppercase tracking-widest text-[9px]">{label}</span>
      <span className={`font-black tracking-tighter text-sm md:text-base italic ${highlight ? 'text-primary' : 'text-white'}`}>{value}</span>
    </div>
  );
}
