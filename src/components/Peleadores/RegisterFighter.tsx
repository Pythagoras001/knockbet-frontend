/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowLeft,
  Camera,
  Info,
  Trophy,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, {useEffect, useState} from 'react';
import {PeleadorPost} from "@/src/types/POST/PeleadorPost.ts";
import {useCreatePeleador} from "@/src/hooks/PeleadoresHooks/useCreatePeleador.ts";
import logo from '../../assets/LogoAnimado.png';
import {
  formatField,
  validateField,
  type RegisterFighterField,
} from "./formRegisterFighterValidators.ts";

interface RegisterFighterProps {
  onBack: () => void;
  // React `key` isn't available at runtime; keep for TS callers that pass it.
  key?: string;
}

export default function RegisterFighter({ onBack }: RegisterFighterProps) {
  const [isNewFighter, setIsNewFighter] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { mutate: createPeleador } = useCreatePeleador();
  const [errors, setErrors] = useState<Partial<Record<RegisterFighterField, string>>>({});
  const [imgPreviewUrl, setImgPreviewUrl] = useState<string | null>(null);

  const initialState: PeleadorPost = {
    nombre: '',
    apodo: '',
    genero: '',
    // Will be replaced when the user selects an image.
    img: null as unknown as File,

    esNuevo: false,

    peso: '',
    altura: '',
    alcance: '',
    edad: '',

    ultimaPelea: '',
    duracionPromedioEnPelea: '',

    victorias: '',
    derrotas: '',
    empates: '',
    rachaActual: '',
    rachaHistorica: ''
  };

  const [formData, setFormData] = useState<PeleadorPost>(initialState);

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  }, []);

  useEffect(() => {
    const file = formData.img;
    if (!(file instanceof File) || file.size === 0) {
      setImgPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setImgPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.img]);

  const validatedFields: RegisterFighterField[] = [
    "nombre",
    "apodo",
    "peso",
    "altura",
    "alcance",
    "edad",
    "duracionPromedioEnPelea",
    "victorias",
    "derrotas",
    "empates",
    "rachaActual",
    "rachaHistorica",
  ];

  const isValidatedField = (name: string): name is RegisterFighterField =>
    (validatedFields as string[]).includes(name);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      window.alert("La imagen no puede superar 10MB.");
      // Allows selecting the same file again after the alert.
      e.target.value = "";
      return;
    }

    setFormData(prev => ({ ...prev, img: file }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (isValidatedField(name)) {
      const nextValue = formatField(name, value);
      setFormData(prev => ({ ...prev, [name]: nextValue }));
      // If the field already has an error, re-validate on change for fast feedback.
      setErrors(prev => {
        if (!prev[name]) return prev;
        const nextError = validateField(name, nextValue);
        return { ...prev, [name]: nextError ?? undefined };
      });
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!isValidatedField(name)) return;

    // Skip history validations when fighter is new (section is hidden).
    const historyFields: RegisterFighterField[] = [
      "duracionPromedioEnPelea",
      "victorias",
      "derrotas",
      "empates",
      "rachaActual",
      "rachaHistorica",
    ];
    if (isNewFighter && historyFields.includes(name)) return;

    const msg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: msg ?? undefined }));
  };

  const handlePeleadorNuevo = () => {
    setIsNewFighter(prev => !prev);
    setFormData(prev => ({
      ...prev,
      esNuevo: !isNewFighter
    }));

  };

  const handleCrearPeleador = () => {
    const fieldsToValidate: RegisterFighterField[] = isNewFighter
      ? ["nombre", "apodo", "peso", "altura", "alcance", "edad"]
      : validatedFields;

    const nextErrors: Partial<Record<RegisterFighterField, string>> = {};
    for (const f of fieldsToValidate) {
      const msg = validateField(f, String((formData as any)[f] ?? ""));
      if (msg) nextErrors[f] = msg;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    createPeleador(formData, {
      onSuccess: () => {
        setFormData(initialState);
        setErrors({});
        setShowSuccessModal(true);
        setIsNewFighter(false);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-[1600px] px-8 py-10"
    >
      {/* Registration View Header */}
      <div className="mb-12 relative">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver Al Directorio
        </button>
        <div className="flex flex-col gap-0 select-none">
          <h1 className="text-7xl md:text-[6rem] font-extrabold italic tracking-tighter uppercase leading-[0.8] text-white">
            REGISTRO
          </h1>
          <h1 className="text-7xl md:text-[6rem] font-extrabold italic tracking-tighter uppercase leading-[0.8] editorial-outline">
            DE NUEVOS
          </h1>
          <h1 className="text-7xl md:text-[6rem] font-extrabold italic tracking-tighter uppercase leading-[0.8] text-primary">
            PELEADORES
          </h1>
        </div>
        <div className="absolute -top-10 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Side */}
        <div className="lg:col-span-8 space-y-8">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Section 1: Información básica */}
            <div className="bg-surface-low p-8 rounded-lg border border-white/5 shadow-xl">
              <h3 className="text-primary font-headline font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(255,143,111,0.5)]"></span>
                1. Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Nombre Completo</label>
                  <input 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                    placeholder="Ej: Israel Adesanya" 
                    type="text"
                  />
                  {errors.nombre && <p className="text-[10px] font-bold text-red-400">{errors.nombre}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Apodo (Nickname)</label>
                  <input 
                    name="apodo"
                    value={formData.apodo}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                    placeholder="Ej: The Last Stylebender" 
                    type="text"
                  />
                  {errors.apodo && <p className="text-[10px] font-bold text-red-400">{errors.apodo}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Género</label>
                  <select 
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white transition-all appearance-none cursor-pointer text-sm font-medium"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="MASCULINO">MASCULINO</option>
                    <option value="FEMENINO">FEMENINO</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Estado del peleador */}
            <div className="bg-surface-low p-8 rounded-lg border border-white/5 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-primary font-headline font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(255,143,111,0.5)]"></span>
                    2. Estado del Peleador
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">¿Es este un peleador nuevo en el circuito?</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handlePeleadorNuevo()}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${isNewFighter ? 'bg-primary' : 'bg-surface-high'}`}
                >
                  <motion.div 
                    animate={{ x: isNewFighter ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            </div>

            {/* Section 3: Información física */}
            <div className="bg-surface-low p-8 rounded-lg border border-white/5 shadow-xl">
              <h3 className="text-primary font-headline font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(255,143,111,0.5)]"></span>
                3. Información Física
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Peso (kg)</label>
                  <input 
                    name="peso"
                    value={formData.peso}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                    placeholder="84" 
                    type="text"
                    inputMode="numeric"
                  />
                  {errors.peso && <p className="text-[10px] font-bold text-red-400">{errors.peso}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Altura (m)</label>
                  <input 
                    name="altura"
                    value={formData.altura}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                    placeholder="1.93" 
                    type="text"
                    inputMode="decimal"
                  />
                  {errors.altura && <p className="text-[10px] font-bold text-red-400">{errors.altura}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Alcance (cm)</label>
                  <input 
                    name="alcance"
                    value={formData.alcance}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                    placeholder="203" 
                    type="text"
                    inputMode="decimal"
                  />
                  {errors.alcance && <p className="text-[10px] font-bold text-red-400">{errors.alcance}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Edad</label>
                  <input 
                    name="edad"
                    value={formData.edad}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                    placeholder="34" 
                    type="text"
                    inputMode="numeric"
                  />
                  {errors.edad && <p className="text-[10px] font-bold text-red-400">{errors.edad}</p>}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isNewFighter && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="space-y-6 overflow-hidden"
                >
                  {/* Section 4: Actividad reciente */}
                  <div className="bg-surface-low p-8 rounded-lg border border-white/5 shadow-xl">
                    <h3 className="text-primary font-headline font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(255,143,111,0.5)]"></span>
                      4. Actividad Reciente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Última Pelea (Fecha)</label>
                        <input 
                          name="ultimaPelea"
                          value={formData.ultimaPelea}
                          onChange={handleInputChange}
                          className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white transition-all text-sm font-medium cursor-pointer" 
                          type="date"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Duración Promedio (min)</label>
                        <input 
                          name="duracionPromedioEnPelea"
                          value={formData.duracionPromedioEnPelea}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                          placeholder="12" 
                          type="text"
                          inputMode="numeric"
                        />
                        {errors.duracionPromedioEnPelea && <p className="text-[10px] font-bold text-red-400">{errors.duracionPromedioEnPelea}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Historial */}
                  <div className="bg-surface-low p-8 rounded-lg border border-white/5 shadow-xl">
                    <h3 className="text-primary font-headline font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(255,143,111,0.5)]"></span>
                      5. Historial de Combate
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Victorias</label>
                        <input 
                          name="victorias"
                          value={formData.victorias}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                          placeholder="24" 
                          type="text"
                          inputMode="numeric"
                        />
                        {errors.victorias && <p className="text-[10px] font-bold text-red-400">{errors.victorias}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Derrotas</label>
                        <input 
                          name="derrotas"
                          value={formData.derrotas}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                          placeholder="3" 
                          type="text"
                          inputMode="numeric"
                        />
                        {errors.derrotas && <p className="text-[10px] font-bold text-red-400">{errors.derrotas}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Empates</label>
                        <input 
                          name="empates"
                          value={formData.empates}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                          placeholder="0" 
                          type="text"
                          inputMode="numeric"
                        />
                        {errors.empates && <p className="text-[10px] font-bold text-red-400">{errors.empates}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Racha Actual</label>
                        <input 
                          name="rachaActual"
                          value={formData.rachaActual}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                          placeholder="3" 
                          type="text"
                          inputMode="numeric"
                        />
                        {errors.rachaActual && <p className="text-[10px] font-bold text-red-400">{errors.rachaActual}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Racha Histórica</label>
                        <input 
                          name="rachaHistorica"
                          value={formData.rachaHistorica}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className="w-full bg-surface-high border-none focus:ring-1 focus:ring-primary rounded-md p-4 text-white placeholder:text-white/5 transition-all text-sm font-medium" 
                          placeholder="12" 
                          type="text"
                          inputMode="numeric"
                        />
                        {errors.rachaHistorica && <p className="text-[10px] font-bold text-red-400">{errors.rachaHistorica}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Photo Section */}
            <div className="bg-surface-low p-8 rounded-lg border border-white/5 shadow-xl">
              <h3 className="text-primary font-headline font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(255,143,111,0.5)]"></span>
                0. Foto del Peleador
              </h3>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-10 bg-surface-high/30 hover:bg-surface-high transition-colors cursor-pointer group">
                <label className="flex flex-col items-center gap-4 cursor-pointer w-full text-center">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Camera className="text-white/20 group-hover:text-primary transition-colors" size={48} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-white">Subir Imagen del Peleador</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] mt-1">PNG, JPG hasta 5MB (Fondo Transparente recomendado)</p>
                  </div>
                  <div className="mt-2 bg-primary/10 border border-primary/20 text-primary px-6 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest group-hover:bg-primary group-hover:text-black transition-all">
                    Seleccionar Archivo
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-6">
              <motion.button
                onClick={handleCrearPeleador}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-primary text-black font-headline font-black uppercase tracking-[0.2em] py-6 rounded-md hover:bg-primary-dim transition-all shadow-2xl shadow-primary/20"
              >
                <span className="whitespace-nowrap">REGISTRAR NUEVO PELEADOR</span>
              </motion.button>
            </div>
          </form>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="group relative overflow-hidden rounded-lg bg-surface-high aspect-[3/4] shadow-2xl border border-white/5">
              <img 
                src={imgPreviewUrl ?? "https://picsum.photos/seed/fighter-preview-new/800/1200?grayscale"} 
                alt="Fighter Preview" 
                className={`absolute inset-0 w-full h-full object-cover ${imgPreviewUrl ? "" : "grayscale brightness-50 group-hover:grayscale-0"} group-hover:scale-105 transition-all duration-1000`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10 w-full z-10">
                <div className="inline-block px-3 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest mb-6">Prevista</div>
                <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-none mb-2 text-white transition-all">
                  {formData.nombre || 'Nombre del Peleador'}
                </h3>
                <p className="text-primary font-bold tracking-[0.3em] text-sm uppercase">
                  {formData.apodo ? `"${formData.apodo.toUpperCase()}"` : '"apodo"'}
                </p>
                
                <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Estado</p>
                    <p className="text-lg font-bold text-white uppercase italic">{isNewFighter ? 'Nuevo' : 'Veterano'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Record</p>
                    <p className="text-lg font-bold font-mono text-white">
                      {isNewFighter ? '0-0-0' : (formData.victorias || '0') + '-' + (formData.derrotas || '0') + '-' + (formData.empates || '0')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-8 rounded-lg text-primary shadow-lg">
              <div className="flex items-start gap-5">
                <Info className="flex-shrink-0 mt-1" size={28} />
                <div>
                  <h4 className="font-headline font-black uppercase tracking-tight mb-2">Consejo Editorial</h4>
                  <p className="text-sm leading-relaxed text-primary/80">
                    {isNewFighter 
                      ? "Has marcado a este peleador como 'Nuevo'. El sistema omitirá automáticamente los campos de historial profesional y actividad previa en la base de datos pública."
                      : "Asegúrate de que los datos de récord coincidan con los registros oficiales de Sherdog o Tapology para mantener la integridad de las líneas de apuesta."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  EL PELEADOR <span className="text-primary">{formData.nombre.toUpperCase()}</span> HA SIDO INGRESADO EN LOS REGISTROS OFICIALES.
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
                  VOLVER AL DIRECTORIO
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
