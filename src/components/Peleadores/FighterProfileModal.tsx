/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Edit, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Peleador } from "@/src/types/GET/Peleador.ts";
import { EditPeleadorPost } from "@/src/types/POST/EditPeleadorPost.ts";
import { useEffect, useState } from "react";
import { useEstadoPeleador } from "@/src/hooks/PeleadoresHooks/useEstadoPeleador.ts";
import {useEdtiPeleador} from "@/src/hooks/PeleadoresHooks/useEdtiPeleador.ts";
import {getImageUrl} from "@/src/util/imgUltil.ts";

interface FighterProfileModalProps {
  fighter: Peleador | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FighterProfileModal({ fighter, isOpen, onClose }: FighterProfileModalProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { mutate: toggleStatus, isPending } = useEstadoPeleador();
  const { mutate: editPeleador} = useEdtiPeleador();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EditPeleadorPost>>({});

  useEffect(() => {
    if (fighter) {
      setIsActive(fighter.estadoActividad);
      setFormData({
        id: fighter.id,
        nombre: fighter.nombre,
        apodo: fighter.apodo,
        peso: fighter.fisicoData.peso,
        altura: fighter.fisicoData.altura,
        alcance: fighter.fisicoData.alcance,
        edad: fighter.fisicoData.edad
      });
    }
    setIsEditing(false);
  }, [fighter, isOpen]);

  if (!fighter) return null;

  const handleToggleStatus = () => {
    setIsActive((prev) => !prev);
    toggleStatus(fighter.id, {
      onError: () => {
        setIsActive((prev) => !prev);
      }
    });
  };

  const handleSave = () => {
    editPeleador(formData);
    setIsEditing(false);
  };

  // Split name for editorial styling
  const nameParts = fighter.nombre.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-h-[90vh] md:max-h-none md:max-w-5xl bg-surface-container-lowest overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-[0px_24px_48px_rgba(0,0,0,0.6)] group z-10 rounded-2xl md:rounded-none"
          >
            {/* Image Section (Editorial Layout) */}
            <div className="relative w-full md:w-5/12 h-[350px] md:h-auto overflow-hidden shrink-0">
              <img
                src={getImageUrl(fighter.imgUrl)}
                alt={fighter.nombre}
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Editorial Text Overlay */}
              <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent">
                <span className="inline-block bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black mb-4">{fighter.apodo}</span>
                <h2 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none mb-2 text-white">
                  {firstName.toUpperCase()}
                </h2>
                <h2
                  className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none"
                  style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)', color: 'transparent' }}
                >
                  {lastName.toUpperCase()}
                </h2>
              </div>
            </div>

            {/* Stats & Details Section */}
            <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-between bg-surface-container-low border-t md:border-t-0 md:border-l border-white/5 relative">
              {isEditing ? (
                <div className="flex-1 flex flex-col relative z-20">
                  {/* Edit Form Header */}
                  <div className="grid grid-cols-1 gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                      <label className="font-headline font-bold text-primary tracking-widest text-xs uppercase italic">Nombre Completo</label>
                      <input 
                        type="text"
                        value={formData.nombre || ''}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="bg-surface-container-high border border-white/5 text-white font-headline font-bold text-xl px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-zinc-800 italic" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-headline font-bold text-primary tracking-widest text-xs uppercase italic">Apodo</label>
                      <input 
                        type="text"
                        value={formData.apodo || ''}
                        onChange={(e) => setFormData({ ...formData, apodo: e.target.value })}
                        className="bg-surface-container-high border border-white/5 text-primary font-headline font-black italic text-xl px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all uppercase placeholder:text-zinc-800" 
                      />
                    </div>
                  </div>

                  {/* Edit Form Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">Peso (Kg)</label>
                      <input 
                        type="number"
                        value={formData.peso || ''}
                        onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) || 0 })}
                        className="bg-surface-container-high border border-white/5 text-white font-headline font-bold px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all italic placeholder:text-zinc-800" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">Altura (m)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={formData.altura || ''}
                        onChange={(e) => setFormData({ ...formData, altura: parseFloat(e.target.value) || 0 })}
                        className="bg-surface-container-high border border-white/5 text-white font-headline font-bold px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all italic placeholder:text-zinc-800" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">Alcance (m)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={formData.alcance || ''}
                        onChange={(e) => setFormData({ ...formData, alcance: parseFloat(e.target.value) || 0 })}
                        className="bg-surface-container-high border border-white/5 text-white font-headline font-bold px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all italic placeholder:text-zinc-800" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">Edad</label>
                      <input 
                        type="number"
                        value={formData.edad || ''}
                        onChange={(e) => setFormData({ ...formData, edad: parseInt(e.target.value) || 0 })}
                        className="bg-surface-container-high border border-white/5 text-white font-headline font-bold px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all italic placeholder:text-zinc-800" 
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                    <button 
                      onClick={handleSave}
                      className="px-8 py-4 bg-primary text-zinc-950 font-headline font-extrabold uppercase tracking-widest text-xs md:text-sm hover:bg-primary-dim transition-all flex items-center justify-center gap-2 italic shadow-[0_15px_30px_rgba(255,143,111,0.2)]"
                    >
                      <Check size={16} strokeWidth={3} /> GUARDAR CAMBIOS
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-4 bg-surface-container-highest text-white font-headline font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-surface-bright transition-colors border border-white/5 flex items-center justify-center gap-2 italic"
                    >
                      CANCELAR
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Nickname & Record Head */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-4 mb-8 md:mb-12 relative z-20">
                    <div>
                      <p className="font-headline font-bold text-primary tracking-widest text-xs uppercase mb-1">Apodo</p>
                      <p className="text-2xl md:text-3xl font-headline font-black italic tracking-tighter uppercase text-white">"{fighter.apodo}"</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-headline font-bold text-zinc-500 tracking-widest text-xs uppercase mb-1">Record</p>
                      <p className="text-3xl md:text-4xl font-headline font-black tracking-tighter text-primary">{fighter.historialData.victorias} - {fighter.historialData.derrotas} - {fighter.historialData.empates}</p>
                    </div>
                  </div>

                  {/* Bento Grid Stats */}
                  <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12 relative z-20">
                    <div className="bg-surface-container-high p-4 md:p-6 group/stat hover:bg-surface-bright transition-colors border border-white/5">
                      <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2">Clase Peso</p>
                      <div className="flex flex-col lg:flex-row lg:items-end gap-1 md:gap-2 text-white">
                        <span className="text-xl md:text-2xl font-headline font-bold tracking-tight">{fighter.fisicoData.categoriaPeso}</span>
                        <span className="text-primary text-[10px] md:text-xs font-bold lg:pb-1">
                          {fighter.fisicoData.peso} Kg
                        </span>
                      </div>
                    </div>
                    <div className="bg-surface-container-high p-4 md:p-6 group/stat hover:bg-surface-bright transition-colors border border-white/5">
                      <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2">Estado</p>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl md:text-2xl font-headline font-bold tracking-tight uppercase text-white">{isActive ? "Activo" : "Suspendido"}</span>
                        <label className="relative inline-flex items-center cursor-pointer scale-75 md:scale-100 origin-right">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={handleToggleStatus}
                            disabled={isPending}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                    <div className="bg-surface-container-high p-4 md:p-6 group/stat hover:bg-surface-bright transition-colors border border-white/5">
                      <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2">Altura</p>
                      <p className="text-xl md:text-2xl font-headline font-bold tracking-tight text-white">{fighter.fisicoData.altura || '---'} m</p>
                    </div>
                    <div className="bg-surface-container-high p-4 md:p-6 group/stat hover:bg-surface-bright transition-colors border border-white/5">
                      <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2">Alcance</p>
                      <p className="text-xl md:text-2xl font-headline font-bold tracking-tight text-white">{fighter.fisicoData.alcance || '---'} m</p>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 md:gap-4 mt-auto pt-6 border-t border-white/5 relative z-20">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto px-6 py-4 bg-surface-container-highest text-white font-headline font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-surface-bright transition-colors border border-white/5 flex items-center justify-center gap-2"
                    >
                      <Edit size={16} /> Edit Profile
                    </button>
                  </div>
                </>
              )}

              {/* Background Subtle Branding */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.015] select-none hidden lg:block z-10">
                <span className="text-[7rem] font-black tracking-tighter uppercase leading-none text-white whitespace-nowrap">
                  {fighter.apodo.toUpperCase().replace(/"/g, '')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
