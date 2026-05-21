/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Users, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  ArrowRight,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { ReactNode, useState } from 'react';
import BetDetailModal, { BetDetail } from '../Apuestas/BetDetailModal.tsx';
import peleadorDash from '../../assets/PeleadoresDash.png';
import eventoDash from '../../assets/EventoDash.png';
import apostarDash from '../../assets/ApostarDash.png';
import {useEffect} from "react";
import {usePeleadores} from "@/src/hooks/PeleadoresHooks/usePeleadores.ts";
import {useEventos} from "@/src/hooks/EventoHooks/useEventos.ts";
import {getTrendEventos} from "@/src/util/eventoUtils.ts";
import {formatFecha} from "@/src/util/eventoUtils.ts";
import {formatHora} from "@/src/util/eventoUtils.ts";
import {usePresupuesto} from "@/src/hooks/PresupuestoHooks/usePresupuesto.ts";
import type { Evento } from "@/src/types/GET/Evento.ts";

interface DashboardViewProps {
  onNavigate: (view: 'directory' | 'events' | 'bets' | 'finance') => void;
  onEventClick?: (evento: Evento) => void;
  // NOTE: React's `key` is a special prop and isn't delivered to components at runtime,
  // but some callers still set it and TypeScript may complain if it's missing.
  key?: string;
}

export default function DashboardView({ onNavigate, onEventClick }: DashboardViewProps) {
  const [selectedBet, setSelectedBet] = useState<BetDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  }, []);

  const { data: peleadores, isLoading: loadingPeleadores } = usePeleadores();
  const { data: eventos, isLoading: loadingEventos } = useEventos();
  const { data: presupuesto, isLoading: loadingPresupuestp } = usePresupuesto();

  if (loadingPresupuestp || loadingEventos || loadingPeleadores) return <p>Cargando...</p>;

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="mx-auto w-full max-w-[1600px] px-8 py-10"
    >
      {/* Editorial Header */}
      <div className="relative overflow-hidden mb-12 p-6 md:p-10 bg-surface-low border border-white/5 rounded-2xl">
        {/* Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none select-none -translate-y-1/4 translate-x-1/4">
          <span className="text-[120px] md:text-[240px] font-black italic editorial-outline tracking-tighter leading-none whitespace-nowrap uppercase">COMMAND</span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-4"
            >
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase font-headline">
                Panel de <span className="editorial-outline-primary block md:inline">Control</span>
              </h2>
              <div className="h-1.5 w-24 bg-primary mt-4 rounded-full" />
            </motion.div>
            
            <p className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
              GESTIÓN OPERATIVA INTEGRAL. CONTROL DE ATLETAS, FLUJO TRANSACCIONAL Y MÉTRICAS FINANCIERAS EN TIEMPO REAL.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surface-high/50 p-4 rounded-xl border border-white/5">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(255,143,111,0.5)]"></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Estado del sistema</span>
              <span className="text-xs font-black text-white uppercase italic">Sistemas en linea</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <MetricCard 
          label="ATLETAS ACTIVOS"
          value={peleadores?.length || 0}
          icon={<Users size={24} />} 
          trend="Disponibles"
        />
        <MetricCard 
          label="Proximos Eventos"
          value={
            eventos?.filter(
              e => e.estadoPelea !== "FINALIZADA" && e.estadoPelea !== "CANCELADA"
            ).length || 0
          }
          icon={<Calendar size={24} />} 
          trend={getTrendEventos(eventos || [])}
        />
        <MetricCard 
          label="Ganancias Totales"
          value={`$ ${presupuesto.gananciasTotales.toLocaleString('es-CO')}`}
          icon={<BarChart3 size={24} />} 
          trend=""
        />
      </div>

      {/* Navigation Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <NavCard 
          title="DIRECTORIO DE PELEADORES"
          description="ADMINISTRA PERFILES DE ATLETAS, CATEGORÍAS DE PESO Y REGISTROS."
          tag="CONTROL DE ROSTER"
          icon={<Zap size={16} />}
          image={peleadorDash}
          onClick={() => onNavigate('directory')}
        />
        <NavCard 
          title="Administracion de Eventos"
          description="Coordirna Peleas, Gestiona logistica y Define Resultado."
          tag="Eventos En Vivo"
          icon={<Activity size={16} />}
          image={eventoDash}
          onClick={() => onNavigate('events')}
        />
        <NavCard 
          title="MERCADOS DE APUESTAS"
          description="MONITOREA CUOTAS EN TIEMPO REAL, GESTIONA EVALUACIONES DE RIESGO Y AJUSTA MOVIMIENTOS DE LÍNEA PARA LOS PRÓXIMOS COMBATES."
          tag="CONTROL DE MERCADO"
          icon={<TrendingUp size={16} />}
          image={apostarDash}
          onClick={() => onNavigate('bets')}
        />
        <NavCard 
          title="REGISTROS FINANCIEROS"
          description="REVISA FLUJOS DE INGRESOS Y GESTION DE PAGOS."
          tag="ACTIVOS CONTABLES"
          icon={<DollarSign size={16} />}
          image="https://picsum.photos/seed/financial_gold/800/450"
          onClick={() => onNavigate('finance')}
        />
      </div>

      {/* Activity Log Area */}
      <div className="bg-surface-low rounded-2xl p-10 border border-white/5 shadow-2xl relative overflow-hidden group/log">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-primary rounded-full"></div>
             <h4 className="text-xl font-headline font-black uppercase tracking-tight italic">Proximos Eventos</h4>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline hover:text-primary-dim transition-all"
          >
            Ver Todos Los Eventos
          </button>
        </div>
        <div className="space-y-4 relative z-10">

          {eventos
            ?.filter(e => !["FINALIZADA", "CANCELADA"].includes(e.estadoPelea))
            .sort(
              (a, b) =>
                new Date(a.fechaPelea).getTime() - new Date(b.fechaPelea).getTime()
            )
            .slice(0, 3)
            .map((evento, index) => (
              <ActivityItem
                key={index}
                onClick={() => onEventClick?.(evento)}
                icon={<AlertTriangle size={16} className="text-red-500" />}
                title={`PELEA: ${evento.peleadorA.nombre} VS ${evento.peleadorB.nombre}`}
                description={`Ubicacion: ${evento.ubicacion.dirreccion} - ${evento.ubicacion.Descripcion}`}
                time={`${formatFecha(evento.fechaPelea)} | ${formatHora(evento.fechaPelea)}`}
              />
            ))}

        </div>
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover/log:scale-125 transition-transform duration-1000"></div>
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

function MetricCard({ label, value, icon, trend }: { label: string, value: string, icon: ReactNode, trend: string }) {
  return (
    <div className="bg-surface-low p-8 rounded-2xl border-l-[3px] border-primary shadow-xl hover:bg-surface-high transition-all group overflow-hidden relative border border-white/5">
      <div className="absolute -right-4 -top-4 opacity-[0.03] scale-150 transition-transform group-hover:scale-[1.7] text-primary">
        {icon}
      </div>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-primary/10 rounded-lg text-primary shadow-[0_0_15px_rgba(255,143,111,0.1)]">
          {icon}
        </div>
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="text-4xl font-black font-headline italic tracking-tighter mb-2 group-hover:text-primary transition-colors">{value}</div>
      <div className="mt-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 italic">
        <span className="text-primary font-black">{trend}</span>
      </div>
    </div>
  );
}

function NavCard({ title, description, tag, icon, image, onClick }: { title: string, description: string, tag: string, icon: ReactNode, image: string, onClick: () => void }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative aspect-[16/9] group cursor-pointer overflow-hidden rounded-2xl border border-white/5 shadow-2xl"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-60" 
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      
      {/* Decorative Borders */}
      <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 rounded-xl transition-all duration-500"></div>

      <div className="absolute inset-0 p-10 flex flex-col justify-end">
        <div className="flex items-center gap-3 mb-4 text-primary translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{tag}</span>
        </div>
        <h3 className="text-4xl font-black font-headline uppercase leading-none mb-4 italic tracking-tighter group-hover:text-primary transition-colors duration-500">{title}</h3>
        <p className="text-zinc-500 max-w-sm font-headline font-bold text-[11px] mb-8 leading-relaxed uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">{description}</p>
        <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.2em] italic group-hover:gap-5 transition-all duration-500">
          Navigate Console <ArrowRight size={14} className="group-hover:rotate-[-25deg] transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

function ActivityItem({ icon, title, description, time, onClick }: { icon: ReactNode, title: string, description: string, time: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-6 py-5 border-b border-white/5 hover:bg-white/[0.01] transition-all px-4 rounded-lg group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="p-2.5 bg-surface-high rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-black text-white italic uppercase tracking-tight group-hover:text-primary transition-colors">{title}</p>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{description}</p>
      </div>
      <span className="text-[11px] font-mono font-black text-zinc-700 italic group-hover:text-zinc-500 transition-colors uppercase">{time}</span>
    </div>
  );
}
