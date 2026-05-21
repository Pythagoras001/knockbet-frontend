/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, BadgeInfo, Swords, TrendingUp, Calendar, Mail, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserApuesta } from "@/src/types/GET/UserApuesta.ts";
import { formatFecha, formatHora } from "@/src/util/eventoUtils.ts";

export interface BetDetail {
  id: string;
  bettorName: string;
  phone: string;
  email: string;
  event: string;
  subEvent: string;
  startTime: string;
  selection: string;
  odds: string;
  amount: string;
  potentialPayout: string;
}

interface BetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: UserApuesta | null;
}

export default function BetDetailModal({ isOpen, onClose, bet }: BetDetailModalProps) {
  if (!bet) return null;

  const selectionName = bet?.ganadorEsperado?.peleador?.nombre ?? 'Empate';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-950 border-t-2 border-primary rounded-xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.9)] max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 md:px-10 py-6 md:py-8 flex justify-between items-start bg-zinc-900/50 backdrop-blur-xl border-b border-white/5">
              <div>
                <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-primary uppercase font-headline">
                  Detalle de la <span className="not-italic">Apuesta</span>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <p className="text-[9px] md:text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase italic">
                    Octagon Elite Verified Transaction
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-8 md:space-y-12">

              {/* Section 1: Bettor Info */}
              <section>
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <BadgeInfo size={14} className="text-primary" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Información del Apostador</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 bg-zinc-900/50 p-6 rounded-lg border border-white/5">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={10} className="text-primary" /> Nombre
                    </p>
                    <p className="font-bold text-base md:text-lg text-white leading-tight">{bet.apostador.nombre}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone size={10} className="text-primary" /> Celular
                    </p>
                    <p className="font-bold text-base md:text-lg text-white tabular-nums">{bet.apostador.celular}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={10} className="text-primary" /> Cedula
                    </p>
                    <p className="font-bold text-sm md:text-base text-white/80 truncate">{bet.apostador.cedula}</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Bet Details */}
              <section>
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <Swords size={14} className="text-primary" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Detalles de la Apuesta</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Event Info */}
                  <div className="bg-zinc-900 border border-white/5 p-6 rounded-lg flex flex-col justify-between group overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 opacity-[0.02] transform rotate-12 scale-150 transition-transform group-hover:scale-[1.7]">
                      <Calendar size={100} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest italic mb-2 leading-none">Evento Principal</p>
                      <h5 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase font-headline leading-none">
                        {bet.apuesta.pelea.tituloPelea} <span className="block text-xl md:text-2xl mt-1 editorial-outline text-zinc-800">{bet.apuesta.pelea.peleadorA.nombre} VS {bet.apuesta.pelea.peleadorB.nombre}</span>
                      </h5>
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded flex items-center justify-center text-zinc-500">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase leading-none mb-1">{formatFecha(bet.apuesta.pelea.fechaPelea)}-{formatHora(bet.apuesta.pelea.fechaPelea)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Selection Info */}
                  <div className="bg-primary/5 border border-primary/10 p-6 rounded-lg relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 opacity-[0.05] scale-150 transition-transform group-hover:scale-[1.8] text-primary">
                      <Swords size={120} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Peleador Seleccionado</p>
                      <h5 className="text-2xl md:text-3xl font-black italic tracking-tighter text-primary uppercase font-headline leading-tight">
                        {selectionName}
                      </h5>
                      <div className="mt-8 flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cuota Asociada</p>
                          <p className="text-xl md:text-2xl font-black text-white tabular-nums">{bet.rendimientoGananciaAsociada}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Monto Apostado</p>
                          <p className="text-xl md:text-2xl font-black text-white tabular-nums">${bet.valorApostado.toLocaleString('es-CO')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Potential Payout */}
              <section className="bg-primary/10 border border-primary/20 p-6 md:p-8 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-primary">
                  <TrendingUp size={100} />
                </div>
                <div className="relative z-10 text-center md:text-left">
                  <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-1">Ganancia Potencial Estimada</p>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">Basado en cuotas actuales y comisión de la casa</p>
                </div>
                <div className="relative z-10 text-center md:text-right">
                  <p className="text-5xl md:text-6xl font-black text-primary italic tracking-tighter font-headline tabular-nums leading-none">${bet.totalGananciaPosible.toLocaleString('es-CO')}</p>
                  <div className="mt-3 inline-flex items-center gap-2 bg-primary text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest italic rounded-sm shadow-lg shadow-primary/20">
                    <TrendingUp size={12} /> Verificado
                  </div>
                </div>
              </section>

              {/* Close Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-zinc-900 text-white font-black uppercase tracking-[0.2em] text-[10px] px-10 py-5 rounded hover:bg-zinc-800 transition-colors border border-white/5 italic"
                >
                  Cerrar Detalles
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
