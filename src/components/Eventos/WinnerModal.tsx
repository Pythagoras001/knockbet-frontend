/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, CheckCircle2, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import {Peleador} from "@/src/types/GET/Peleador.ts";
import {Evento} from "@/src/types/GET/Evento.ts";
import {PeleadorPost} from "@/src/types/POST/PeleadorPost.ts";
import {ResultadoPost} from "@/src/types/POST/ResultadoPost.ts";
import {getImageUrl} from "@/src/util/imgUltil.ts";

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (winnerId: string | 'DRAW') => void;
  event: Evento;
}

export default function WinnerModal({ isOpen, onClose, onConfirm, event }: WinnerModalProps) {
  const [selected, setSelected] = useState<string | 'DRAW' | null>(null);
  const fighterA = event.peleadorA;
  const fighterB = event.peleadorB

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-surface-high rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight italic leading-none">
                  Declarar <span className="text-primary italic">Ganador</span>
                </h2>
                <button 
                  onClick={onClose}
                  className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Fighter Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Fighter A */}
                <button 
                  onClick={() => setSelected(fighterA.id)}
                  className={`group relative flex flex-col items-center gap-6 p-8 rounded-xl border-2 transition-all ${
                    selected === fighterA.id 
                      ? 'bg-primary/5 border-primary shadow-[0_0_40px_rgba(255,143,111,0.15)]' 
                      : 'bg-surface-highest/30 border-transparent hover:border-white/10 hover:bg-surface-highest/50'
                  }`}
                >
                  {selected === fighterA.id && (
                    <div className="absolute top-4 right-4 text-primary">
                      <CheckCircle2 size={24} fill="currentColor" className="text-primary" />
                    </div>
                  )}
                  <img 
                    src={getImageUrl(fighterA.imgUrl)}
                    alt={fighterA.nombre}
                    className={`w-32 h-32 object-cover rounded-lg border border-white/10 transition-all duration-500 ${selected === fighterA.id ? 'scale-105 brightness-110' : 'grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0'}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center">
                    <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 transition-colors ${selected === fighterA.id ? 'text-primary' : 'text-zinc-600'}`}>Ganador</p>
                    <p className={`text-3xl font-headline font-black uppercase italic transition-colors ${selected === fighterA.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{fighterA.nombre}</p>
                  </div>
                </button>

                {/* Fighter B */}
                <button 
                  onClick={() => setSelected(fighterB.id)}
                  className={`group relative flex flex-col items-center gap-6 p-8 rounded-xl border-2 transition-all ${
                    selected === fighterB.id 
                      ? 'bg-primary/5 border-primary shadow-[0_0_40px_rgba(255,143,111,0.15)]' 
                      : 'bg-surface-highest/30 border-transparent hover:border-white/10 hover:bg-surface-highest/50'
                  }`}
                >
                  {selected === fighterB.id && (
                    <div className="absolute top-4 right-4 text-primary">
                      <CheckCircle2 size={24} fill="currentColor" className="text-primary" />
                    </div>
                  )}
                  <img 
                    src={getImageUrl(fighterB.imgUrl)}
                    alt={fighterB.nombre}
                    className={`w-32 h-32 object-cover rounded-lg border border-white/10 transition-all duration-500 ${selected === fighterB.id ? 'scale-105 brightness-110' : 'grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0'}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center">
                    <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 transition-colors ${selected === fighterB.id ? 'text-primary' : 'text-zinc-600'}`}>Ganador</p>
                    <p className={`text-3xl font-headline font-black uppercase italic transition-colors ${selected === fighterB.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{fighterB.nombre}</p>
                  </div>
                </button>
              </div>

              {/* Draw Option */}
              <button 
                onClick={() => setSelected('DRAW')}
                className={`w-full py-5 px-6 mb-10 rounded-xl border-2 flex items-center justify-center gap-4 transition-all group ${
                  selected === 'DRAW' 
                    ? 'bg-white/5 border-white/20 text-white' 
                    : 'bg-surface-highest/20 border-transparent text-zinc-500 hover:text-zinc-200 hover:border-white/10'
                }`}
              >
                <Scale size={24} className={`${selected === 'DRAW' ? 'text-primary' : 'text-zinc-600 group-hover:text-primary'} transition-colors`} />
                <span className="font-headline font-black uppercase tracking-[0.2em] text-xs italic">Empate / Sin Decisión</span>
              </button>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={!selected}
                  onClick={() => selected && onConfirm(selected)}
                  className={`w-full py-6 rounded-lg font-headline font-black uppercase tracking-[0.25em] text-lg transition-all shadow-2xl ${
                    selected 
                      ? 'bg-primary text-black hover:bg-primary-dim shadow-primary/20' 
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  Confirmar Resultado
                </motion.button>
                <button 
                  onClick={onClose}
                  className="w-full py-2 text-zinc-600 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
