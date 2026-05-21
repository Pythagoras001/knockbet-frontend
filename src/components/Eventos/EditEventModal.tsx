/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, MapPin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import type { Evento } from "@/src/types/GET/Evento.ts";
import {useEditEvento} from "@/src/hooks/EventoHooks/useEditEvento.ts";
import {EditEventPost} from "@/src/types/POST/EditEventPost.ts";

interface EditEventModalProps {
  event: Evento | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedEvent: EditEventPost) => void;
}

export default function EditEventModal({ event, isOpen, onClose, onSave }: EditEventModalProps) {
  const [formData, setFormData] = useState<EditEventPost>({
    idPelea: '',
    nombrePelea: '',
    horaIncio: '',
    direccion: '',
    descripcion: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        idPelea: event.id,
        nombrePelea: event.tituloPelea ?? '',
        horaIncio: event.fechaPelea ?? '',
        direccion: event.ubicacion?.dirreccion ?? '',
        descripcion: event.ubicacion?.Descripcion  ?? '',
      });
    }
  }, [event]);

  const { mutate: editEvento } = useEditEvento();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    editEvento(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && event && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-surface-low shadow-[0px_24px_48px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden border border-zinc-800/40"
          >
            {/* Modal Header */}
            <div className="relative h-40 md:h-48 overflow-hidden">
              <img 
                alt="MMA Event" 
                className="w-full h-full object-cover opacity-40 grayscale" 
                src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-surface-low/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 md:left-8">
                <p className="text-primary font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-1 italic">ADMINISTRACION DE EVENTO</p>
                <h2 className="text-2xl md:text-3xl font-black italic font-headline tracking-tighter uppercase text-white">
                  EDICION DE <span className="editorial-outline text-white">DETALLES</span>
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre de la Pelea */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 tracking-wider uppercase ml-1 italic">Nombre de la Pelea</label>
                  <div className="group relative">
                    <input 
                      type="text" 
                      value={formData.nombrePelea}
                      onChange={(e) => setFormData({ ...formData, nombrePelea: e.target.value })}
                      className="w-full bg-surface-high border-none rounded-md px-4 py-3 text-sm font-bold focus:ring-1 focus:ring-primary transition-all text-white placeholder-zinc-600 italic" 
                    />
                  </div>
                </div>
                {/* Hora de Inicio */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 tracking-wider uppercase ml-1 italic">Hora de Inicio</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.horaIncio}
                      onChange={(e) => setFormData({ ...formData, horaIncio: e.target.value })}
                      className="w-full bg-surface-high border-none rounded-md px-4 py-3 text-sm font-bold focus:ring-1 focus:ring-primary transition-all text-white italic" 
                    />
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 tracking-wider uppercase ml-1 italic">Dirección</label>
                <div className="flex items-center bg-surface-high rounded-md px-4 py-3 focus-within:ring-1 focus-within:ring-primary transition-all">
                  <MapPin size={16} className="text-primary mr-3" />
                  <input 
                    type="text" 
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 text-white italic" 
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 tracking-wider uppercase ml-1 italic">Descripción</label>
                <textarea 
                  rows={4}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full bg-surface-high border-none rounded-md px-4 py-3 text-sm font-bold focus:ring-1 focus:ring-primary transition-all text-white resize-none italic"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 mt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all rounded-md italic"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 text-[10px] font-black uppercase tracking-widest bg-primary text-black hover:bg-primary-dim active:scale-95 transition-all rounded-md shadow-[0_8px_16px_rgba(255,143,111,0.2)] italic flex items-center gap-2"
                >
                  <Check size={14} strokeWidth={3} />
                  Guardar Cambios
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
