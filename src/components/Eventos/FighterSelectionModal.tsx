/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Search, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import {usePeleadores} from "@/src/hooks/PeleadoresHooks/usePeleadores.ts";
import {Peleador} from "@/src/types/GET/Peleador.ts";
import {getImageUrl} from "@/src/util/imgUltil.ts";

interface FighterSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (fighter: Peleador) => void;
  onNewFighter?: () => void;
  title: string;
}

export default function FighterSelectionModal({ isOpen, onClose, onSelect,onNewFighter, title }: FighterSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: peleadores, isLoading: loadingPeleadores } = usePeleadores();
  if (loadingPeleadores) return <p>Cargando...</p>

  const filteredFighters = peleadores.filter(f =>
    f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.apodo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl h-full max-h-[850px] bg-[#0e0e0e] border border-white/5 rounded-2xl flex flex-col shadow-[0_24px_48px_rgba(0,0,0,0.8)] overflow-hidden"
          >

            {/* Modal Header */}
            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-b from-white/5 to-transparent">
              <div>
                <h2 className="font-display font-black text-4xl tracking-tighter uppercase mb-1 text-white">
                  SELECCIONAR <span className="text-primary italic">{title}</span>
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-12 bg-primary"></div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Roster Oficial Octagon Elite</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-zinc-900 border-none focus:ring-1 focus:ring-primary text-white font-bold text-sm uppercase tracking-wider pl-12 pr-6 py-4 w-full md:w-80 rounded-lg transition-all placeholder:text-zinc-600"
                    placeholder="BUSCAR PELEADOR..." 
                  />
                </div>
                <button
                  onClick={() => onNewFighter?.()}
                  className="bg-primary hover:bg-primary-dim text-black font-black px-6 py-4 rounded-lg flex items-center gap-2 transition-transform active:scale-95 uppercase text-sm shadow-[0_0_20px_rgba(255,143,111,0.2)]"
                >
                  <UserPlus size={18} strokeWidth={3} />
                  <span className="hidden sm:inline">NUEVO</span>
                </button>
              </div>
            </div>

            {/* Modal Content (Scrollable Grid) */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFighters.map((fighter) => (
                  <div 
                    key={fighter.id} 
                    className="group relative bg-zinc-900/50 rounded-xl overflow-hidden hover:bg-zinc-800/50 transition-all duration-300 border border-white/5"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <img 
                        src={getImageUrl(fighter.imgUrl)}
                        alt={fighter.nombre}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-primary text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest italic">
                          {fighter.fisicoData.categoriaPeso.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-black text-2xl leading-none uppercase mb-1 text-white">
                        {fighter.nombre.split(' ')[0]}
                        <br />
                        <span className="text-primary italic">'{fighter.apodo}'</span>
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-tighter">
                          Record: <span className="text-white font-black">{fighter.historialData.victorias} - {fighter.historialData.derrotas} - {fighter.historialData.empates}</span>
                        </p>
                        <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-tighter">
                          Status: <span className="text-primary font-black uppercase text-[8px]">{fighter.estadoActividad ? "Activo" : "Suspendido"}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => onSelect(fighter)}
                        className="w-full bg-white/5 hover:bg-primary group-hover:text-black text-primary font-black py-3 rounded-lg transition-all border border-primary/20 uppercase tracking-widest text-[10px] italic shadow-lg shadow-black/20"
                      >
                        SELECCIONAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-zinc-900/50 backdrop-blur-md">
              <button 
                onClick={onClose}
                className="px-8 py-3 font-black text-zinc-500 uppercase text-[10px] tracking-widest hover:text-white transition-colors"
              >
                CANCELAR
              </button>
              <button className="bg-white/5 px-8 py-3 font-black text-white hover:text-primary uppercase text-[10px] tracking-widest rounded-lg border border-white/5 hover:bg-white/10 transition-all cursor-not-allowed opacity-50">
                FILTRAR POR PESO
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
