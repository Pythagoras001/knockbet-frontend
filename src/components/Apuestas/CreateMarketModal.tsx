/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Gavel, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useEventosLibres } from "@/src/hooks/EventoHooks/useEventosLibres.ts";
import type { Evento } from "@/src/types/GET/Evento.ts";

interface CreateMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (evento: Evento) => void;
}

export default function CreateMarketModal({ isOpen, onClose, onConfirm }: CreateMarketModalProps) {
  // Store the full selected event object.
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const { data: eventosLibres, isLoading: loadingEventosLibres } = useEventosLibres();
  const eventosProgramados = (eventosLibres ?? []).filter((evento) => evento.estadoPelea === 'PROGRAMADA');

  useEffect(() => {
    // Hooks must run in the same order; don't early-return above this effect.
    if (!isOpen) return;
    if (!selectedEvent && eventosProgramados.length > 0) {
      setSelectedEvent(eventosProgramados[0]);
    }
  }, [isOpen, eventosProgramados, selectedEvent]);


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative w-full max-w-2xl bg-zinc-950 border border-white/5 rounded-2xl flex flex-col shadow-[0_24px_48px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 md:px-8 py-5 md:py-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-white/5 to-transparent flex-shrink-0">
              <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase font-headline text-white italic">
                Registrar <span className="text-primary not-italic">Nueva Apuesta</span>
              </h2>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
              {loadingEventosLibres ? (
                <p className="text-zinc-400 font-bold">Cargando...</p>
              ) : null}

              {/* Dropdown Select Event */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 px-1">Seleccionar Evento</label>
                <div className="relative group">
                  <select
                    value={selectedEvent?.id ?? ''}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      const next = (eventosProgramados ?? []).find(ev => ev.id === nextId) ?? null;
                      setSelectedEvent(next);
                    }}
                    className="w-full bg-zinc-900 border-none text-white font-bold py-4 px-6 rounded-lg focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all hover:bg-zinc-800 text-sm md:text-base pr-12"
                  >
                    {(eventosProgramados ?? []).map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.tituloPelea} ({ev.peleadorA.nombre} vs {ev.peleadorB.nombre})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-primary transition-colors" size={20} />
                </div>
              </div>

              {/* Visual Comparison */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Fighter 1 */}
                <div className="w-full md:flex-1 group">
                  <div className="relative h-48 md:h-64 overflow-hidden rounded-xl bg-zinc-900 border border-white/5">
                    <img
                      alt="Fighter 1"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      src="https://picsum.photos/seed/fighter_omalley/400/600"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <p className="text-[9px] text-primary uppercase font-black tracking-widest mb-1 italic">Peleador A</p>
                      <h3 className="text-xl font-black uppercase tracking-tighter text-white leading-none">{selectedEvent?.peleadorA?.nombre ?? '-'}</h3>
                    </div>
                  </div>
                </div>

                {/* VS Anchor */}
                <div className="flex-shrink-0 flex flex-row md:flex-col items-center gap-4 md:gap-0">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_25px_rgba(255,143,111,0.4)] z-10 scale-110">
                    <span className="text-black font-black italic text-xl md:text-2xl tracking-tighter">VS</span>
                  </div>
                  <div className="hidden md:block w-px h-16 bg-gradient-to-b from-primary/50 to-transparent mt-2"></div>
                </div>

                {/* Fighter 2 */}
                <div className="w-full md:flex-1 group">
                  <div className="relative h-48 md:h-64 overflow-hidden rounded-xl bg-zinc-900 border border-white/5">
                    <img
                      alt="Fighter 2"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      src="https://picsum.photos/seed/fighter_vera/400/600"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-right md:text-left w-full pr-8 md:pr-0 md:left-4">
                      <p className="text-[9px] text-primary uppercase font-black tracking-widest mb-1 italic">Peleador B</p>
                      <h3 className="text-xl font-black uppercase tracking-tighter text-white leading-none">{selectedEvent?.peleadorB?.nombre ?? '-'}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!selectedEvent) return;
                  onConfirm(selectedEvent);
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-primary to-primary-dim text-black py-5 md:py-6 rounded-xl font-black text-xs md:text-sm uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 shadow-[0_12px_40px_rgba(255,143,111,0.25)] hover:shadow-[0_15px_50px_rgba(255,143,111,0.4)] transition-all mt-4"
              >
                Confirmar Apuesta
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function OddsInput({ value, onChange, label, highlight = false }: { value: string, onChange: (v: string) => void, label: string, highlight?: boolean }) {
  return (
    <div className="space-y-3">
      <label className={`text-[10px] uppercase tracking-[0.3em] font-black px-1 truncate block ${highlight ? 'text-primary text-center' : 'text-zinc-500'}`}>
        {label}
      </label>
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${highlight ? 'bg-surface-highest text-primary shadow-[0_0_20px_rgba(255,143,111,0.1)]' : 'bg-zinc-900 text-white'} border-none py-5 px-4 rounded-lg focus:ring-1 focus:ring-primary placeholder:text-zinc-800 font-mono text-xl font-black transition-all group-hover:bg-zinc-800 text-center`}
          placeholder="1.00"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-black text-sm italic opacity-30 select-none">X</span>
      </div>
    </div>
  )
}
