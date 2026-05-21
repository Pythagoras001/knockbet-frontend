/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowLeft,
  Timer,
  CheckCircle2,
  Users,
  Zap,
  User,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import BetDetailModal from './BetDetailModal.tsx';
import type { Apuesta } from '@/src/types/GET/Apuesta.ts';
import { useApuesta } from '@/src/hooks/ApuestaHooks/useApuesta.ts';
import { useUserApuesta } from "@/src/hooks/ApuestaHooks/useUserApuesta.ts";
import { UserApuesta } from "@/src/types/GET/UserApuesta.ts";
import { useCreateUserApuesta } from "@/src/hooks/ApuestaHooks/useCreateUserApuesta.ts";
import { UserApuestaPost } from "@/src/types/POST/UserApuestaPost.ts";
import { usePresupuesto } from '@/src/hooks/PresupuestoHooks/usePresupuesto.ts';
import imgBetPlace from '../../assets/betPlaceImg.png';

interface PlaceBetViewProps {
  onBack: () => void;
  onViewLiveBook: (apuesta: Apuesta) => void;
  apuesta?: Apuesta;
  marketData?: {
    name: string;
    subtitle: string;
    odds: string;
  };
  key?: string;
}

const INITIAL_USER_APUESTA_STATE: UserApuestaPost = {
  nombreApostador: '',
  correo: '',
  cedula: '',
  celular: '',
  apuesta: '',
  ganadorEsperado: '',
  valorApostado: ''
};

export default function PlaceBetView({ onBack, onViewLiveBook, marketData, apuesta }: PlaceBetViewProps) {
  const DEFAULT_SELECTED_FIGHTER: 'A' | 'B' | 'Draw' = 'A';
  const DEFAULT_BET_AMOUNT = 0;

  const [selectedBet, setSelectedBet] = useState<UserApuesta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFighter, setSelectedFighter] = useState<'A' | 'B' | 'Draw'>(DEFAULT_SELECTED_FIGHTER);
  const [betAmount, setBetAmount] = useState(DEFAULT_BET_AMOUNT);

  const { mutate: createUserApuesta } = useCreateUserApuesta();

  const { data: apuestas, isLoading: loadingApuestas } = useApuesta();
  const { data: presupuesto, isLoading: loadingPresupuesto } = usePresupuesto();

  const presupuestoTotal = presupuesto?.presupuestoTotal;

  const { data: userApuestas, isLoading: loadingUserApuestas } = useUserApuesta({
    refetchInterval: 2000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true
  });

  const [formData, setFormData] = useState<UserApuestaPost>(INITIAL_USER_APUESTA_STATE);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const apuestasList = apuestas ?? [];
  // Always render from the freshest server copy (react-query cache) when available.
  const apuestaActual = apuestasList.find((a) => a.id === apuesta?.id) ?? apuesta;

  const montoTotal =
    (apuestaActual?.cuotaEmpate?.estadisticaAsociada?.gananciaTotalCasa ?? 0) +
    (apuestaActual?.cuotaPeleadorA?.estadisticaAsociada?.gananciaTotalCasa ?? 0) +
    (apuestaActual?.cuotaPeleadorB?.estadisticaAsociada?.gananciaTotalCasa ?? 0);

  const handleActivityClick = (item: UserApuesta) => {
    setSelectedBet(item);
    setIsModalOpen(true);
  };

  const apuestasActuales = userApuestas?.filter(
    ap => ap.apuesta?.id === apuestaActual?.id
  ) ?? [];

  const porcentajeDeMonto = (monto: number) => {
    if (!Number.isFinite(monto) || !Number.isFinite(montoTotal) || montoTotal <= 0) return 0;
    return Math.round((monto / montoTotal) * 100);
  };

  const cuotaSeleccionada =
    selectedFighter === 'A'
      ? apuestaActual?.cuotaPeleadorA?.cuotaGananciaActual ?? 1
      : selectedFighter === 'B'
        ? apuestaActual?.cuotaPeleadorB?.cuotaGananciaActual ?? 1
        : apuestaActual?.cuotaEmpate?.cuotaGananciaActual ?? 1;

  const apuestaMaximaPermitida = presupuestoTotal && cuotaSeleccionada > 0
    ? Math.max(10, Math.floor(presupuestoTotal / cuotaSeleccionada))
    : 50000;

  useEffect(() => {
    if (betAmount > apuestaMaximaPermitida) {
      setBetAmount(apuestaMaximaPermitida);
    }
  }, [apuestaMaximaPermitida, betAmount]);

  // Keep the payload fields in sync with the selected market + selection + amount.
  useEffect(() => {
    if (!apuestaActual) return;
    const ganadorEsperadoId =
      selectedFighter === 'A'
        ? apuestaActual.cuotaPeleadorA?.id
        : selectedFighter === 'B'
          ? apuestaActual.cuotaPeleadorB?.id
          : apuestaActual.cuotaEmpate?.id;

    setFormData(prev => ({
      ...prev,
      apuesta: apuestaActual.id,
      ganadorEsperado: ganadorEsperadoId ?? '',
      valorApostado: String(betAmount)
    }));
  }, [apuestaActual, selectedFighter, betAmount]);

  const handleConfirmBet = () => {

    createUserApuesta(formData, {
      onSuccess: () => {
        setSelectedFighter(DEFAULT_SELECTED_FIGHTER);
        setBetAmount(DEFAULT_BET_AMOUNT);
        setFormData(INITIAL_USER_APUESTA_STATE);
      }
    });
  };


  if (loadingPresupuesto || loadingApuestas || loadingUserApuestas) return <p>Cargando...</p>

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mx-auto w-full max-w-[1600px] px-4 md:px-8 py-6 md:py-10"
      >
        {/* Top Navigation */}
        <div className="mb-6 md:mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a Apuestas
          </button>
        </div>

        {/* Hero Stats Section */}
        <section className="relative min-h-[400px] md:h-72 mb-8 md:mb-12 rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex items-center">
          <div className="absolute inset-0">
            <img
              src={imgBetPlace}
              alt="Arena"
              className="w-full h-full object-cover opacity-30 md:opacity-40 brightness-75"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background via-transparent to-background"></div>
          </div>

          <div className="relative w-full h-full flex flex-col justify-center items-center px-6 md:px-12 py-10 md:py-0 z-10">
            {/* Main VS Container */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-5xl gap-8 md:gap-4 mb-8">
              {/* Fighter 1 */}
              <div className="text-center md:text-left order-2 md:order-1">
                <h2 className="text-4xl md:text-5xl font-headline font-black italic text-white uppercase tracking-tighter leading-none mb-1">{apuestaActual.pelea.peleadorA.nombre}</h2>
                <p className="text-primary font-bold text-xs tracking-[0.25em] uppercase">{apuestaActual.pelea.peleadorA.apodo}</p>
              </div>

              {/* Central Info */}
              <div className="flex flex-col items-center order-1 md:order-2">
                <div className="bg-primary/20 border border-primary/30 px-5 py-1.5 rounded-full mb-3 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-widest uppercase">
                    <Timer size={14} />
                    <span>Round 2</span>
                  </div>
                </div>
                <div className="editorial-outline text-5xl md:text-6xl font-headline font-black italic select-none">VS</div>
              </div>

              {/* Fighter 2 */}
              <div className="text-center md:text-right order-3 md:order-3">
                <h2 className="text-4xl md:text-5xl font-headline font-black italic text-white uppercase tracking-tighter leading-none mb-1">{apuestaActual.pelea.peleadorB.nombre}</h2>
                <p className="text-primary font-bold text-xs tracking-[0.25em] uppercase">{apuestaActual.pelea.peleadorB.apodo}</p>
              </div>
            </div>

            {/* Stats Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-24 w-full max-w-5xl">
              <StatsBar label="Dinero Apostado" value={`${porcentajeDeMonto(apuestaActual.cuotaPeleadorA.estadisticaAsociada.gananciaTotalCasa)}%`} percentage={porcentajeDeMonto(apuestaActual.cuotaPeleadorA.estadisticaAsociada.gananciaTotalCasa)} />
              <StatsBar label="Dinero Apostado" value={`${porcentajeDeMonto(apuestaActual.cuotaPeleadorB.estadisticaAsociada.gananciaTotalCasa)}%`} percentage={porcentajeDeMonto(apuestaActual.cuotaPeleadorB.estadisticaAsociada.gananciaTotalCasa)} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Main Interface */}
          <div className="lg:col-span-8">
            <div className="bg-surface-low rounded-2xl p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                <h3 className="font-headline font-black text-xl md:text-2xl tracking-tighter uppercase italic leading-none">
                  Estado de la <span className="text-primary">Apuesta</span> Actual
                </h3>
              </div>

              {/* Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
                <SelectionCard
                  label={`${porcentajeDeMonto(apuestaActual.cuotaPeleadorA.estadisticaAsociada.gananciaTotalCasa)}%`}
                  name={apuestaActual.pelea.peleadorA.nombre}
                  odds={`${apuestaActual.cuotaPeleadorA.cuotaGananciaActual}`}
                  active={selectedFighter === 'A'}
                  onClick={() => setSelectedFighter('A')}
                />
                <SelectionCard
                  label={`${porcentajeDeMonto(apuestaActual.cuotaEmpate.estadisticaAsociada.gananciaTotalCasa)}%`}
                  name="EMPATE"
                  odds={`${apuestaActual.cuotaEmpate.cuotaGananciaActual}`}
                  active={selectedFighter === 'Draw'}
                  onClick={() => setSelectedFighter('Draw')}
                />
                <SelectionCard
                  label={`${porcentajeDeMonto(apuestaActual.cuotaPeleadorB.estadisticaAsociada.gananciaTotalCasa)}%`}
                  name={apuestaActual.pelea.peleadorB.nombre}
                  odds={`${apuestaActual.cuotaPeleadorB.cuotaGananciaActual}`}
                  active={selectedFighter === 'B'}
                  onClick={() => setSelectedFighter('B')}
                />
              </div>

              <div className="space-y-10">

                {/* Bet Amount Controls */}
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                    <div>
                      <label className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase block mb-1">Apuesta Rapida - Monto</label>
                      <div className="flex items-center gap-1 group/input">
                        <span className="text-primary font-headline font-black text-3xl md:text-2xl italic">$</span>
                        <input
                          type="number"
                          min="0"
                          max={apuestaMaximaPermitida}
                          value={betAmount.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBetAmount(val);
                          }}
                          onBlur={() => {
                            let finalVal = betAmount;
                            if (finalVal < 0) finalVal = 0;
                            if (finalVal > apuestaMaximaPermitida) finalVal = apuestaMaximaPermitida;
                            setBetAmount(finalVal);
                          }}
                          className="bg-transparent text-white font-headline font-black text-3xl md:text-2xl tracking-tighter tabular-nums italic w-32 focus:outline-none focus:text-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black tracking-[0.2em] text-primary uppercase mb-1">Ganancia Potencial</p>
                      <p className="text-2xl font-headline font-black text-primary italic tracking-tighter tabular-nums">
                        ${(() => {
                          let apuestaTotal = 1;
                          if (selectedFighter === 'A') apuestaTotal = apuestaActual.cuotaPeleadorA.cuotaGananciaActual * betAmount;
                          else if (selectedFighter === 'B') apuestaTotal = apuestaActual.cuotaPeleadorB.cuotaGananciaActual * betAmount;
                          else if (selectedFighter === 'Draw') apuestaTotal = apuestaActual.cuotaEmpate.cuotaGananciaActual * betAmount;
                          return apuestaTotal.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        })()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 md:gap-4 mb-8">
                    {[5000, 10000, 20000, 50000].map(val => (
                      <button
                        key={val}
                        onClick={() => setBetAmount(prev => Math.min(prev + val, apuestaMaximaPermitida))}
                        className="py-4 bg-surface-high rounded-xl font-black text-white hover:bg-surface-highest transition-all border border-white/5 hover:border-white/10 active:scale-95 text-xs tracking-widest"
                      >
                        +$ {val.toLocaleString("es-CO")}
                      </button>
                    ))}
                  </div>

                  <div className="relative pt-6 pb-2">
                    {/* Position Indicator Point */}
                    <div
                      className="absolute top-0 flex flex-col items-center transition-all duration-150 ease-out pointer-events-none"
                      style={{ left: `${Math.min(100, Math.max(0, ((betAmount - 10) / Math.max(1, apuestaMaximaPermitida - 10)) * 100))}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded italic mb-1 shadow-lg shadow-primary/20">
                        ${betAmount}
                      </div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(255,143,111,0.6)]"></div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={apuestaMaximaPermitida}
                      step="1000"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      className="w-full h-2 bg-surface-highest rounded-lg appearance-none cursor-pointer accent-primary relative z-10
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,143,111,0.4)]
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary"
                    />
                  </div>
                </div>

                {/* Form Section */}
                <div className="space-y-8 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-primary" />
                    <h4 className="text-[12px] font-black tracking-[0.2em] text-zinc-400 uppercase">Información del Apostador</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <InputGroup
                      name="nombreApostador"
                      value={formData.nombreApostador}
                      onChange={handleInputChange}
                      label="Nombre Completo"
                      placeholder="Ej. Juan Perez"
                    />
                    <InputGroup
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                      label="Cedula"
                      placeholder="000.000.000"
                      isMono
                    />
                    <InputGroup
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      label="Correo"
                      placeholder="Ej. pedro@email.com"
                    />
                    <InputGroup
                      name="celular"
                      value={formData.celular}
                      onChange={handleInputChange}
                      label="Celular"
                      placeholder="000 - 000 - 000"
                    />


                  </div>
                </div>

                {/* Confirm Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmBet}
                  className="w-full py-6 md:py-7 bg-primary text-black font-headline font-black text-xl tracking-widest uppercase rounded-xl shadow-[0_20px_50px_rgba(255,143,111,0.2)] hover:bg-primary-dim transition-all mt-6 italic"
                >
                  Confirmar Apuesta
                </motion.button>

                {/* Footer Stats */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-10 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-tight">
                    <Users size={16} />
                    Monto total: <span className="text-white font-black tabular-nums">${montoTotal.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-tight">
                    <Zap size={16} fill="currentColor" className="text-primary" />
                    Apostadores activos: <span className="text-white font-black tabular-nums">{apuestasActuales.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Activity Column */}
          <div className="lg:col-span-4 rounded-2xl bg-surface-low border border-white/5 overflow-hidden flex flex-col shadow-2xl h-fit">
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-surface-high/20">
              <h3 className="font-headline font-black text-[10px] tracking-[0.2em] uppercase italic">Ultimas Apuestas</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                <span className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">En vivo</span>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4 max-h-[500px] lg:max-h-[700px] overflow-y-auto editorial-scrollbar">
              {[...apuestasActuales].reverse().map((item) => (
                <ActivityCard
                  key={item.id}
                  item={item}
                  onClick={() => handleActivityClick(item)}
                />
              ))}
            </div>

            <div className="p-6 bg-surface-high/5 flex justify-center">
              <button
                onClick={() => onViewLiveBook(apuestaActual)}
                className="flex items-center gap-2 group text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
              >
                Ver toda la actividad
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        <BetDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bet={selectedBet}
        />
      </motion.div>
    </>
  );
}

function StatsBar({ label, value, percentage }: { label: string, value: string, percentage: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[9px] font-black tracking-[0.2em] text-zinc-400 uppercase">
        <span>{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-primary shadow-[0_0_10px_rgba(255,143,111,0.5)]"
        />
      </div>
    </div>
  );
}

function SelectionCard({ label, name, odds, active, onClick }: { label: string, name: string, odds: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-6 md:p-8 rounded-2xl transition-all border-2 flex flex-col text-left group relative ${active
        ? 'bg-primary/5 border-primary shadow-[0_0_40px_rgba(255,143,111,0.1)]'
        : 'bg-surface-high border-transparent hover:border-white/10 hover:bg-surface-highest'
        }`}
    >
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <span className={`text-[9px] md:text-[10px] font-black tracking-widest uppercase ${active ? 'text-primary' : 'text-zinc-600'}`}>
          {label}
        </span>
        {active && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 size={24} fill="currentColor" className="text-primary" />
          </motion.div>
        )}
      </div>
      <h4 className={`font-headline font-black text-2xl md:text-3xl mb-1 uppercase italic tracking-tighter ${active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
        {name}
      </h4>
      <div className={`text-3xl md:text-4xl font-headline font-black italic tracking-tighter ${active ? 'text-primary' : 'text-zinc-700 group-hover:text-zinc-500'}`}>
        {odds}
      </div>
    </button>
  );
}

function InputGroup({ name, value, onChange, label, placeholder, isMono }: { name: keyof UserApuestaPost, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string, placeholder: string, isMono?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black tracking-widest text-zinc-600 uppercase ml-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-surface-high border border-white/5 rounded-xl py-4 px-6 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-all font-medium ${isMono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

function ActivityCard({ item, onClick }: { item: UserApuesta, onClick?: () => void, key?: string }) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-surface-high border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden ${onClick ? 'cursor-pointer hover:bg-surface-highest' : ''}`}
    >
      <div className="flex items-center gap-4 mb-3">
        <img src="https://picsum.photos/seed/dustin/200/200" alt={item.apostador.nombre} className="w-10 h-10 rounded-xl" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <p className="text-xs font-black text-white group-hover:text-primary transition-colors">{item.apostador.nombre}</p>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{item.apostador.cedula}</p>
        </div>
        <div className="text-primary font-headline font-black text-lg italic">$ {item.valorApostado.toLocaleString("es-CO")}</div>
      </div>
      <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
        Apuesta: <span className="text-white font-bold">{item?.ganadorEsperado?.peleador?.nombre || "Empate"}</span>
      </p>
    </div>
  );
}
