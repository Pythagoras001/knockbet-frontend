/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowLeft,
  UserPlus,
  Clock,
  MapPin,
  Zap,
  Search,
  ChevronRight,
  Edit2,
  Trash2,
  User, X
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import FighterSelectionModal from './FighterSelectionModal.tsx';
import { Peleador } from "@/src/types/GET/Peleador.ts";
import { EventoPost } from "@/src/types/POST/EventoPost.ts";
import { useCreateEvento } from "@/src/hooks/EventoHooks/useCreateEvent.ts";
import { formatFecha, formatHora } from "@/src/util/eventoUtils.ts";
import { usePeleadores } from "@/src/hooks/PeleadoresHooks/usePeleadores.ts";
import logo from "@/src/assets/Logo.png";
import { validateFightForm, formatFightData, FightFormErrors } from './formNewFightValidators.ts';
import FighterProfileModal from '../Peleadores/FighterProfileModal.tsx';
import {getImageUrl} from "@/src/util/imgUltil.ts";

interface FightSchedulerProps {
  onBack: () => void;
  key?: string;
  onNewFighter?: () => void;
  onDirectory?: () => void;
}


export default function FightScheduler({ onBack, onNewFighter, onDirectory }: FightSchedulerProps) {
  const [fighter1, setFighter1] = useState<Peleador | null>(null);
  const [fighter2, setFighter2] = useState<Peleador | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'f1' | 'f2' | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfileFighter, setSelectedProfileFighter] = useState<Peleador | null>(null);

  const { mutate: createEvento } = useCreateEvento();
  const { data: peleadores, isLoading: loadingPeleadores } = usePeleadores();
  if (loadingPeleadores) return <p>Cargando...</p>

  const initialState: EventoPost = {
    nombrePelea: '',
    idPeleadorA: '',
    idPeleadorB: '',
    horaIncio: '',
    direccion: '',
    descripcion: '',
    asociarApuesta: true
  }

  const [formData, setFormData] = useState<EventoPost>(initialState);
  const [errors, setErrors] = useState<FightFormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (Object.keys(errors).length > 0) {
        setErrors(validateFightForm(newData));
      }
      return newData;
    });
  };

  const openSelection = (slot: 'f1' | 'f2') => {
    setSelectingFor(slot);
    setIsModalOpen(true);
  };

  const handleSelectFighter = (fighter: Peleador) => {
    if (selectingFor === 'f1') {
      setFighter1(fighter);
      setFormData(prev => {
        const newData = { ...prev, idPeleadorA: fighter.id };
        if (Object.keys(errors).length > 0) setErrors(validateFightForm(newData));
        return newData;
      });
    }

    if (selectingFor === 'f2') {
      setFighter2(fighter);
      setFormData(prev => {
        const newData = { ...prev, idPeleadorB: fighter.id };
        if (Object.keys(errors).length > 0) setErrors(validateFightForm(newData));
        return newData;
      });
    }

    setIsModalOpen(false);
    setSelectingFor(null);
  };

  const handlebettingEnabled = () => {
    setFormData(prev => ({
      ...prev,
      asociarApuesta: !prev.asociarApuesta
    }));
  };

  const handleCrearEvento = () => {
    const validationErrors = validateFightForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const formattedData = formatFightData(formData);

    createEvento(formattedData, {
      onSuccess: () => {
        setFormData(initialState);
        setFighter1(null)
        setFighter2(null)
        setShowSuccessModal(true);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="mx-auto w-full max-w-[1600px] px-8 py-10"
    >
      {/* Top Controls */}
      <div className="mb-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver A Control De Eventos
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Form Section */}
        <div className="flex-1 space-y-12">
          <header>
            <h2 className="text-5xl md:text-7xl italic font-headline font-black tracking-tighter leading-none uppercase">
              Programar <span className="editorial-outline italic">Nueva</span> <span className="text-primary">Pelea</span>
            </h2>
            <p className="text-zinc-500 text-[10px] tracking-[0.3em] mt-3 font-black uppercase">ADMINISTRACIÓN LOGÍSTICA DE COMBATES</p>
          </header>

          {/* Fighter Selection Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => openSelection('f1')}
              className="group cursor-pointer bg-surface-low p-10 border-b-2 border-transparent hover:border-primary transition-all rounded-t-xl relative overflow-hidden h-48 flex flex-col justify-center"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black tracking-widest text-primary uppercase italic">Esquina Roja</span>
                  <UserPlus size={20} className="text-primary" />
                </div>
                <h3 className="text-4xl font-headline font-black text-zinc-200 group-hover:text-primary transition-colors italic uppercase leading-none truncate">
                  {fighter1 ? fighter1.nombre : 'Peleador 1'}
                </h3>
                {fighter1 && <p className="text-[10px] font-black text-primary mt-2 uppercase tracking-widest italic">{fighter1.apodo}</p>}
                {errors.idPeleadorA && (
                  <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-widest italic bg-red-500/10 inline-block px-2 py-1 rounded">
                    {errors.idPeleadorA}
                  </p>
                )}
              </div>
              {fighter1 && (
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                  <img
                    src={getImageUrl(fighter1.imgUrl)}
                    alt={fighter1.nombre}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-surface-low via-surface-low/40 to-transparent"></div>
                </div>
              )}
            </div>

            <div
              onClick={() => openSelection('f2')}
              className="group cursor-pointer bg-surface-low p-10 border-b-2 border-transparent hover:border-primary transition-all rounded-t-xl text-right relative overflow-hidden h-48 flex flex-col justify-center"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 flex-row-reverse">
                  <span className="text-[10px] font-black tracking-widest text-primary uppercase italic leading-none">Esquina Azul</span>
                  <UserPlus size={20} className="text-primary" />
                </div>
                <h3 className="text-4xl font-headline font-black text-zinc-200 group-hover:text-primary transition-colors italic uppercase leading-none truncate">
                  {fighter2 ? fighter2.nombre : 'Peleador 2'}
                </h3>
                {fighter2 && <p className="text-[10px] font-black text-primary mt-2 uppercase tracking-widest italic">{fighter2.apodo}</p>}
                {errors.idPeleadorB && (
                  <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-widest italic bg-red-500/10 inline-block px-2 py-1 rounded text-left">
                    {errors.idPeleadorB}
                  </p>
                )}
              </div>
              {fighter2 && (
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                  <img
                    src={getImageUrl(fighter2.imgUrl)}
                    alt={fighter2.nombre}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-surface-low via-surface-low/40 to-transparent"></div>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-surface-low p-10 rounded-xl border border-white/5 space-y-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Evento</label>
                <input
                  name="nombrePelea"
                  value={formData.nombrePelea}
                  onChange={handleInputChange}
                  className={`w-full bg-surface-high border-none rounded-lg py-4 px-6 font-bold text-sm focus:ring-1 focus:ring-primary placeholder:text-zinc-700 transition-all ${errors.nombrePelea ? 'ring-1 ring-red-500' : ''}`}
                  placeholder="UFC 300: LAS VEGAS"
                />
                {errors.nombrePelea && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.nombrePelea}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Categoría</label>
                <select className="w-full bg-surface-high border-none rounded-lg py-4 px-6 font-bold text-sm focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer">
                  <option>PESO LIGERO (155 LBS)</option>
                  <option>PESO PLUMA (145 LBS)</option>
                  <option>PESO WELTER (170 LBS)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Duración</label>
                <select className="w-full bg-surface-high border-none rounded-lg py-4 px-6 font-bold text-sm focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer">
                  <option>5 ROUNDS (ESTELAR)</option>
                  <option>3 ROUNDS</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Hora de Inicio</label>
                <div className="relative">
                  <input
                    name="horaIncio"
                    value={formData.horaIncio}
                    onChange={handleInputChange}
                    className={`w-full bg-surface-high border-none rounded-lg py-4 px-6 font-bold text-sm focus:ring-1 focus:ring-primary transition-all ${errors.horaIncio ? 'ring-1 ring-red-500' : ''}`}
                    type="datetime-local"
                  />

                  <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={18} />
                </div>
                {errors.horaIncio && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.horaIncio}</p>}
              </div>
              <div className="col-span-1 md:col-span-2 space-y-3">
                <label className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Lugar</label>
                <div className="relative">
                  <input
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className={`w-full bg-surface-high border-none rounded-lg py-4 px-6 font-bold text-sm focus:ring-1 focus:ring-primary placeholder:text-zinc-700 transition-all pl-12 ${errors.direccion ? 'ring-1 ring-red-500' : ''}`}
                    placeholder="T-MOBILE ARENA, LAS VEGAS, NV" />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                </div>
                {errors.direccion && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.direccion}</p>}
              </div>

              <div className="col-span-1 md:col-span-2 space-y-3">
                <label className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Descripción de la Pelea</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className={`w-full bg-surface-high border-none rounded-lg py-4 px-6 font-bold text-sm focus:ring-1 focus:ring-primary placeholder:text-zinc-700 transition-all min-h-[120px] resize-none ${errors.descripcion ? 'ring-1 ring-red-500' : ''}`}
                  placeholder="DETALLES ADICIONALES SOBRE EL COMBATE, RIVALIDAD O RELEVANCIA DEL EVENTO..."
                />
                {errors.descripcion && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.descripcion}</p>}
              </div>

            </div>

            {/* Betting Configuration */}
            <div className="pt-10 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="font-headline font-black text-xl italic uppercase tracking-tighter">Asociar Apuesta</h4>
                  <p className="text-[10px] text-zinc-500 tracking-widest uppercase mt-1">Habilitar apuesta para la comunidad</p>
                </div>
                <button
                  onClick={handlebettingEnabled}
                  className={`w-14 h-7 rounded-full p-1 transition-all duration-300 flex items-center ${formData.asociarApuesta ? 'bg-primary' : 'bg-surface-highest'}`}
                >
                  <motion.div
                    animate={{ x: formData.asociarApuesta ? 28 : 0 }}
                    className="w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCrearEvento}
            className="w-full bg-primary text-black py-7 rounded-xl font-headline font-black text-2xl tracking-tighter uppercase italic shadow-[0_20px_50px_rgba(255,143,111,0.2)] hover:bg-primary-dim transition-all"
          >
            Confirmar Programación
          </motion.button>
        </div>

        {/* Sidebar Previews Section */}
        <aside className="w-full lg:w-[420px] space-y-12">
          {/* Billboard Preview */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-600 uppercase">Previsualización de Cartelera</h4>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-transparent to-transparent z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <span className="editorial-outline text-[120px] text-primary  font-headline font-black italic opacity-20 tracking-tighter select-none">VS</span>
              </div>
              <div className="absolute inset-0 grid grid-cols-2">
                <div className="h-full relative overflow-hidden">
                  {fighter1 ? (
                    <img className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale brightness-75" src={getImageUrl(fighter1.imgUrl)} />
                  ) : (
                    <div className="h-full w-full bg-surface-highest flex items-center justify-center text-zinc-800 font-black text-4xl italic">A</div>
                  )}
                </div>
                <div className="h-full relative overflow-hidden">
                  {fighter2 ? (
                    <img className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale brightness-75 border-l border-white/10" src={getImageUrl(fighter2.imgUrl)} />
                  ) : (
                    <div className="h-full w-full bg-surface-highest flex items-center justify-center text-zinc-800 font-black text-4xl italic border-l border-white/10">B</div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 z-30 space-y-3">
                <div className="flex justify-between items-end border-b border-primary/40 pb-3">
                  <h5 className="font-headline font-black text-4xl leading-none italic uppercase italic tracking-tighter">{formData.nombrePelea ? `"${formData.nombrePelea.toUpperCase()}"` : '"TITULO PELEA"'} </h5>
                  <span className="text-primary font-black text-sm tracking-widest italic">{formData.horaIncio ? `"${formatHora(formData.horaIncio)}"` : '"-- AM"'}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-zinc-400 uppercase">
                  <span>{formData.direccion ? `"${formData.direccion.toUpperCase()}"` : '"DIRECCION"'}</span>
                  <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                  <span>Peso Ligero</span>
                  <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                  <span className="text-primary italic">COMBATE KNOCKBET</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Fighters List */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-600 uppercase">Lista de Peleadores Activos</h4>
            <div className="bg-surface-low rounded-xl border border-white/5 overflow-hidden shadow-xl">
              <div className="divide-y divide-white/5">
                {peleadores.map(fighter => (
                  <div
                    key={fighter.id}
                    className="p-5 flex items-center gap-5 group hover:bg-surface-high transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedProfileFighter(fighter);
                      setProfileModalOpen(true);
                    }}
                  >
                    <div className="w-14 h-14 rounded-lg bg-surface-highest overflow-hidden border border-white/5">
                      <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={getImageUrl(fighter.imgUrl)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black uppercase tracking-tight italic text-white group-hover:text-primary transition-colors">{fighter.nombre}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] text-zinc-500 font-bold tracking-widest">{fighter.fisicoData.peso} Kg</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
                        <span className="text-[9px] text-zinc-400 font-black tracking-widest uppercase">{fighter.historialData.victorias} - {fighter.historialData.derrotas} - {fighter.historialData.empates}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-widest italic`}>
                        {fighter.estadoActividad ? "Activo" : "Suspendido"}
                      </span>
                      <div className="flex gap-3">
                        <Edit2 size={14} className="text-zinc-500 hover:text-white" />
                        <Trash2 size={14} className="text-zinc-500 hover:text-red-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={onDirectory}
                className="w-full py-4 bg-surface-high/50 hover:bg-surface-high text-zinc-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                Ver todos los peleadores
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </aside>
      </div>

      <FighterSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectFighter}
        onNewFighter={onNewFighter}
        title={selectingFor === 'f1' ? 'Peleador 1' : 'Peleador 2'}
      />

      <FighterProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        fighter={selectedProfileFighter}
      />

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowSuccessModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 100 }}
              className="relative w-full max-w-lg bg-surface-low border-2 border-primary/20 rounded-3xl p-12 overflow-hidden shadow-[0_0_100px_rgba(255,143,111,0.15)]"
            >
              {/* Animated Background Element */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-32 -right-32 w-80 h-80 bg-primary/20 blur-[100px] rounded-full"
              />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Punch Animation Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{
                    scale: [0, 1.5, 1],
                    rotate: [-45, 10, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    times: [0, 0.7, 1],
                    ease: "backOut"
                  }}
                  className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,143,111,0.5)]"
                >
                  <img src={logo} alt="Logo" className="w-30 object-contain" />


                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4"
                >
                  ¡REGISTRO EXITOSO!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-10 leading-relaxed"
                >
                  EL COMBATE <span className="text-primary">{formData.nombrePelea.toUpperCase()}</span> HA SIDO INGRESADO EN LOS REGISTROS OFICIALES.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    setShowSuccessModal(false);
                    onBack();
                  }}
                  className="w-full bg-white text-black font-black italic uppercase tracking-[0.2em] py-5 rounded-xl hover:bg-primary transition-all shadow-xl shadow-black/40 group flex items-center justify-center gap-3"
                >
                  VOLVER A EVENTOS
                  <Zap size={18} className="fill-current group-hover:scale-125 transition-transform" />
                </motion.button>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
