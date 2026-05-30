/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ChevronDown,
  Activity,
  Users,
  Stethoscope,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useState } from 'react';
import FighterProfileModal from './FighterProfileModal.tsx';
import {usePeleadores} from "@/src/hooks/PeleadoresHooks/usePeleadores.ts";
import {Peleador} from "@/src/types/GET/Peleador.ts";
import {getImageUrl} from "@/src/util/imgUltil.ts";

interface FighterDirectoryProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRegisterClick: () => void;
  // React `key` isn't available at runtime; keep for TS callers that pass it.
  key?: string;
}

export default function FighterDirectory({activeTab, onTabChange, onRegisterClick }: FighterDirectoryProps) {
  const [selectedFighter, setSelectedFighter] = useState<Peleador | null>(null);

  const { data: peleadores, isLoading: loadingPeleadores } = usePeleadores();
  if (loadingPeleadores) return <p>Cargando...</p>

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedWeightClass, setSelectedWeightClass] = useState('Select Class');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const totalPeleadores = peleadores?.length ?? 0;
  const suspendidos = peleadores?.filter(p => p.estadoActividad).length ?? 0;
  const porcentaje = totalPeleadores > 0 ? (suspendidos / totalPeleadores) * 100 : 0;

  const handleFighterClick = (fighter: Peleador) => {
    setSelectedFighter(fighter);
    setIsModalOpen(true);
  };

  const filteredFighters = (peleadores ?? []).filter(f => {
    // Search filter
    const matchesSearch = f.nombre.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    let matchesStatus = true;
    const currentStatus = activeTab.toUpperCase();

    if (currentStatus === 'ACTIVO') {
      matchesStatus = f.estadoActividad;
    } else if (currentStatus === 'SUSPENDIDO') {
      matchesStatus = !f.estadoActividad;
    }

    // Advanced filters (Status)
    if (filterStatus !== 'ALL') {
      if (filterStatus === 'ACTIVO') {
        matchesStatus = matchesStatus && f.estadoActividad;
      } else if (filterStatus === 'SUSPENDIDO') {
        matchesStatus = matchesStatus && !f.estadoActividad;
      }
    }

    // Weight class filter
    if (selectedWeightClass !== 'Select Class') {
      matchesStatus = matchesStatus && f.fisicoData.categoriaPeso === selectedWeightClass;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="mx-auto w-full max-w-[1600px] px-4 md:px-8 py-6 md:py-10"
    >
      {/* Editorial Header */}
      <div className="relative overflow-hidden mb-8 md:mb-12 p-6 md:p-10 bg-surface-low border border-white/5 rounded-2xl">
        {/* Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none select-none -translate-y-1/4 translate-x-1/4">
          <span className="text-[120px] md:text-[240px] font-black italic editorial-outline tracking-tighter leading-none whitespace-nowrap uppercase">FIGHTERS</span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-4"
            >
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase font-headline">
                DIRECTORIO DE <span className="editorial-outline-primary block md:inline">PELEADORES</span>
              </h2>
              <div className="h-1.5 w-24 bg-primary mt-4 rounded-full" />
            </motion.div>
            
            <p className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
              GESTIONA EL PLANTEL DE ÉLITE Y ATLETAS DE CLASE MUNDIAL. SUPERVISA RANKINGS, ESTADOS MÉDICOS Y RÉCORDS PROFESIONALES DE LA RED GLOBAL DE KNOCKBET.
            </p>
          </div>

          <motion.button 
            onClick={onRegisterClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-5 md:py-6 font-black uppercase tracking-widest text-black shadow-[0_0_30px_rgba(255,143,111,0.2)] hover:bg-primary-dim transition-all text-xs md:text-sm italic"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="whitespace-nowrap">REGISTRAR NUEVO PELEADOR</span>
          </motion.button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="group relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar Peleadores Por Nombre..."
              className="w-full rounded-lg border-none bg-surface-lowest/50 py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-500 transition-all focus:ring-1 focus:ring-primary/50"
            />
          </div>
          
          <div className="flex bg-surface-low border border-white/5 rounded-lg p-1 min-w-fit">
            {['ALL', 'ACTIVO', 'SUSPENDIDO'].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab.charAt(0) + tab.slice(1).toLowerCase())}
                className={`px-6 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all rounded ${
                  activeTab.toUpperCase() === tab ? 'bg-surface-highest text-white shadow-lg' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center justify-center gap-3 rounded-lg px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all border ${
              showAdvancedFilters 
                ? 'bg-primary text-black border-primary' 
                : 'bg-surface-low text-white border-white/5 hover:bg-surface-high'
            }`}
          >
            <Filter size={16} />
            Filtros
          </button>
        </div>

        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-surface-low/30 border border-white/5 rounded-xl mt-2"
            >
              <div className="p-8 flex flex-col xl:flex-row items-end gap-10">
                <div className="flex-1 w-full xl:w-auto">
                  <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.2em] mb-4">Clasificacion Peso</p>
                  <div className="relative">
                    <select 
                      value={selectedWeightClass}
                      onChange={(e) => setSelectedWeightClass(e.target.value)}
                      className="w-full appearance-none bg-surface-highest border border-white/5 rounded-xl px-6 py-4 text-sm font-black text-white focus:ring-1 focus:ring-primary/30 cursor-pointer"
                    >
                      <option>Select Class</option>
                      <option>PESO_MOSCA</option>
                      <option>PESO_GALLO</option>
                      <option>PESO_PLUMA</option>
                      <option>PESO_LIGERO</option>
                      <option>PESO_WELTER</option>
                      <option>PESO_MEDIO</option>
                      <option>SEMIPESADO</option>
                      <option>PESO_PESADO</option>

                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                <div className="flex-1 w-full xl:w-auto">
                  <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-[0.2em] mb-4">Estado</p>
                  <div className="flex bg-surface-low border border-white/5 rounded-xl p-2 gap-2">
                    {['ALL', 'ACTIVO', 'SUSPENDIDO'].map((s) => (
                      <button 
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                          filterStatus === s 
                            ? 'bg-surface-highest text-white shadow-lg' 
                            : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 w-full xl:w-auto">
                  <button
                    onClick={() => setShowAdvancedFilters(false)}
                    className="flex-1 xl:flex-none px-12 py-5 bg-primary text-black text-xs font-black uppercase tracking-widest rounded-xl italic hover:bg-primary-dim transition-all shadow-xl shadow-primary/10"
                  >
                    APLICAR FILTROS
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus('ALL');
                      setSelectedWeightClass('Select Class');
                      setSearchQuery('');
                      onTabChange('All');
                    }}
                    className="p-5 bg-surface-low border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Container */}
      <div className="overflow-hidden rounded-xl border border-white/5 bg-surface-low shadow-2xl">

        <div className="px-4 md:px-8 py-5 md:py-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 bg-surface-high/10">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <span className="w-1.5 h-8 bg-primary block"></span>
            <h4 className="text-base md:text-lg font-bold tracking-tight font-headline uppercase italic">Peleadores Registrados</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
            <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase italic">Bitácora de Control</span>
          </div>
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden lg:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-surface-high/50">
                <th className="px-6 py-5 text-[10px] font-black tracking-widest text-zinc-400 uppercase">PELEADOR</th>
                <th className="px-6 py-5 text-[10px] font-black tracking-widest text-zinc-400 uppercase">CATEGORÍA</th>
                <th className="px-6 py-5 text-[10px] font-black tracking-widest text-zinc-400 uppercase">RÉCORD (V-D-E)</th>
                <th className="px-6 py-5 text-[10px] font-black tracking-widest text-zinc-400 uppercase">ESTADO</th>
                <th className="px-6 py-5 text-right text-[10px] font-black tracking-widest text-zinc-400 uppercase">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFighters.map((fighter) => (
                <tr 
                  key={fighter.id} 
                  onClick={() => handleFighterClick(fighter)}
                  className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={getImageUrl(fighter.imgUrl)}
                          alt={fighter.nombre}
                          className="h-12 w-12 rounded bg-surface-highest object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface-low`}></div>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white mb-0.5 leading-none transition-colors group-hover:text-primary">{fighter.nombre}</p>
                        <p className="text-[9px] font-black italic uppercase tracking-wider text-zinc-500">"{fighter.apodo}"</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-xs text-zinc-300">{fighter.fisicoData.categoriaPeso}</td>
                  <td className="px-6 py-5">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs font-bold text-white">
                      {fighter.historialData.victorias} - {fighter.historialData.derrotas} - {fighter.historialData.empates}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                      fighter.estadoActividad
                        ? "text-green-400 bg-green-500/10 border-green-500/20"
                        : "text-red-400 bg-red-500/10 border-red-500/20"
                      }`}>
                      {fighter.estadoActividad ? "Activo" : "Suspendido"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 bg-red-900/10 hover:bg-red-500/20 rounded text-zinc-500 hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFighterClick(fighter);
                        }}
                        className="bg-primary text-black px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded italic hover:scale-[1.05] transition-all shadow-xl shadow-primary/10"
                      >
                        Perfil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet View (Cards) */}
        <div className="lg:hidden divide-y divide-white/5">
          {peleadores.map((fighter) => (
            <div 
              key={fighter.id} 
              onClick={() => handleFighterClick(fighter)}
              className="p-4 bg-surface-low hover:bg-surface-high/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src="https://picsum.photos/seed/khabib/200/200"
                      alt={fighter.nombre}
                      className="h-14 w-14 rounded-xl bg-surface-highest object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface-low `}>
                    </div>

                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight group-hover:text-primary transition-colors">{fighter.nombre}</h4>
                    <p className="text-[10px] font-black text-zinc-500 uppercase italic tracking-widest">"{fighter.apodo}"</p>
                  </div>
                </div>
                <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-surface-high/40 rounded-lg p-3 border border-white/5">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">CATEGORÍA</p>
                  <p className="text-xs font-bold text-zinc-300">{fighter.fisicoData.categoriaPeso}</p>
                </div>
                <div className="bg-surface-high/40 rounded-lg p-3 border border-white/5">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">RÉCORD</p>
                  <p className="text-xs font-mono font-bold text-white">{fighter.historialData.victorias} - {fighter.historialData.derrotas} - {fighter.historialData.empates}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">

                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                  fighter.estadoActividad
                    ? "text-green-400 bg-green-500/10 border-green-500/20"
                    : "text-red-400 bg-red-500/10 border-red-500/20"
                  }`}>
                  {fighter.estadoActividad ? "Activo" : "Suspendido"}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFighterClick(fighter);
                  }}
                  className="text-primary text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-1 group/btn"
                >
                  Ver Perfil Completo
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 bg-surface-high/30 px-6 py-4 gap-4">
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500">Viendo <span className="text-white">{filteredFighters.length}</span> de {totalPeleadores} Peleadores</p>
          <div className="flex gap-2 w-full sm:w-auto">
            <PaginationButton icon={<ChevronLeft size={16} />} label="Previous" />
            <PaginationButton icon={<ChevronRight size={16} />} label="Next" primary />
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          label="DISPONIBILIDAD MÉDICA"
          value={String(porcentaje) + "%"}
          icon={<Activity size={24} />} 
          subContent={
            <div className="mt-4 flex h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${porcentaje}%` }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(255,143,111,0.5)]" 
              />
            </div>
          }
        />
        <StatCard 
          label="DISPONIBILIDAD OPERATIVA"
          value={`${(peleadores ?? []).filter(p => p.estadoActividad).length} Peleadores`}
          icon={<Users size={24} />} 
          subText="Preparados para proximos Eventos"
        />
        <StatCard 
          label="En Recuperacion"
          value={`${(peleadores ?? []).filter(p => !p.estadoActividad).length} Peleadores`}
          icon={<Stethoscope size={24} />} 
          highlightColor="text-red-400"
          className="md:col-span-2 lg:col-span-1"
          subText="Peleadores Suspendidos"
        />
      </div>

      <FighterProfileModal 
        fighter={selectedFighter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  );
}

function PaginationButton({ icon, label, primary = false }: { icon: ReactNode, label: string, primary?: boolean }) {
  return (
    <button className={`flex-1 sm:flex-none flex items-center justify-center gap-1 rounded border border-white/5 px-4 py-2 text-[9px] font-black tracking-widest transition-all ${
      primary 
        ? 'bg-primary text-black hover:bg-primary-dim' 
        : 'bg-surface-highest text-zinc-400 hover:text-white'
    }`}>
      {primary ? null : icon}
      {label.toUpperCase()}
      {primary ? icon : null}
    </button>
  );
}

function StatCard({ 
  label, 
  value, 
  icon, 
  subText, 
  subContent, 
  highlightColor = "text-primary",
  className = ""
}: { 
  label: string, 
  value: string,
  icon: ReactNode, 
  subText?: string, 
  subContent?: ReactNode,
  highlightColor?: string,
  className?: string
}) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-surface-high to-surface-low p-6 shadow-xl ${className}`}
    >
      <div className="absolute -right-4 -top-4 opacity-[0.03] scale-150 text-white transform rotate-12">
        {icon}
      </div>
      <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${highlightColor} mb-2`}>{label}</p>
      <h3 className="font-headline text-3xl md:text-4xl font-black text-white italic tracking-tighter">{value}</h3>
      {subText && <p className="mt-2 text-[10px] font-medium text-zinc-500 uppercase tracking-tight">{subText}</p>}
      {subContent}
    </motion.div>
  );
}
