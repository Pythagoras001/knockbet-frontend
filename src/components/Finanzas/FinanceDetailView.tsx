import {
  ArrowLeft,
  Send,
  Archive,
  Download,
  BarChart3,
  TrendingUp,
  CreditCard,
  Bell,
  Settings, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import PayoutModal from './PayoutModal';
import PaymentInvoiceModal from './PaymentInvoiceModal';
import {useUserApuesta} from "@/src/hooks/ApuestaHooks/useUserApuesta.ts";
import { Resultado } from "@/src/types/GET/Resultado.ts";
import {UserApuesta} from "@/src/types/GET/UserApuesta.ts";
import BetDetailModal from "@/src/components/Apuestas/BetDetailModal.tsx";
import {useRetornos} from "@/src/hooks/RetornosHooks/useRetornos.ts";
import {Retorno} from "@/src/types/GET/Retorno.ts";
import {formatFecha, formatHora} from "@/src/util/eventoUtils.ts";
import {getImageUrl} from "@/src/util/imgUltil.ts";
import logo from '../../assets/LogoAnimado.png';

interface FinanceDetailViewProps {
  onBack: () => void;
  resultado?: Resultado | null;
  key?: string;
}

export default function FinanceDetailView({ onBack, resultado }: FinanceDetailViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenApuestaView, setIsModalOpenApuestaView] = useState(false);
  const [selectedBettor, setSelectedBettor] = useState<Retorno | null>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'TODOS' | 'GANADORES' | 'PERDEDORES'>('TODOS');
  const [activePayoutsTab, setActivePayoutsTab] = useState<'TODAS' | 'PAGADAS' | 'PENDIENTES'>('TODAS');
  const [selectedBet, setSelectedBet] = useState<UserApuesta | null>(null);

  const { data: userApuestas, isLoading: loadingUserApuestas } = useUserApuesta();
  const { data: retornos, isLoading: loadingRetornos} = useRetornos();

  if (loadingUserApuestas || loadingRetornos) return <p>Cargando...</p>

  const apuestasActuales = userApuestas?.filter(
    ap => ap.apuesta?.pelea.id === resultado.pelea.id
  ) ?? [];

  const retornosActuales = retornos?.filter(
    re => re.apuestaInscrita?.apuesta?.pelea.id === resultado.pelea.id
  ) ?? [];

  const filteredPayouts = retornosActuales.filter(r => {
    if (activePayoutsTab === 'TODAS') return true;
    if (activePayoutsTab === 'PAGADAS') return r.estadoRetorno === 'PAGADO';
    if (activePayoutsTab === 'PENDIENTES') return r.estadoRetorno === 'PENDIENTE';
    return true;
  });

  const totalGanado = apuestasActuales
    .filter(a => a.ganadorEsperado.resultadoCuota === "PERDIDA")
    .reduce((acc, a) => acc + a.valorApostado, 0);

  const totalPerdido = apuestasActuales
    .filter(a => a.ganadorEsperado.resultadoCuota === "GANADA")
    .reduce((acc, a) => acc + a.totalGananciaPosible, 0);


  const handleActivityClick = (item: UserApuesta) => {
    setSelectedBet(item);
    setIsModalOpenApuestaView(true);
  };

  const handleOpenModal = (retorno: Retorno) => {
    setSelectedBettor(retorno);
    setIsModalOpen(true);
  };

  const filteredHistory = apuestasActuales.filter(b => {
    if (activeHistoryTab === 'TODOS') return true;
    if (activeHistoryTab === 'GANADORES') return b.ganadorEsperado.resultadoCuota === 'GANADA';
    if (activeHistoryTab === 'PERDEDORES') return b.ganadorEsperado.resultadoCuota === 'PERDIDA';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface"
    >
      {/* Local Top Navigation Bar */}
      <div className="sticky top-0 z-[60] px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 md:gap-8 overflow-x-auto w-full md:w-auto no-scrollbar">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver A Historial
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8 md:py-12 max-w-[1920px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* LEFT COLUMN: Fight Highlights */}
          <section className="lg:w-[450px] space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-surface-low border border-white/5 shadow-2xl group">
              <div className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-primary font-headline font-black text-[10px] tracking-[0.3em] uppercase italic">Evento</span>
                    <h2 className="text-4xl sm:text-5xl font-headline font-black italic tracking-tighter leading-none mt-2 text-white">
                      {resultado?.pelea?.tituloPelea ?? 'Finance Detail'}
                    </h2>
                  </div>
                  <div className="bg-surface-high/50 px-4 py-1.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Resultado</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mb-12 relative">
                  <div className="text-center flex-1">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-4 relative group/fighter cursor-pointer">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-0 group-hover/fighter:scale-110 transition-transform duration-700"></div>
                      <img
                        src={resultado.ganador ? getImageUrl(resultado.ganador.imgUrl) : logo}
                        alt="Khabib"
                        className="w-full h-full object-cover rounded-xl relative z-10 border-2 border-primary grayscale group-hover/fighter:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="font-black text-[9px] uppercase text-primary tracking-widest mb-1 italic">Ganador</p>
                    <h3 className="font-headline font-black text-xl sm:text-2xl italic uppercase tracking-tighter text-white">
                      {resultado?.ganador?.nombre ?? 'Empate'}
                    </h3>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <span className="text-3xl sm:text-5xl font-black italic text-zinc-800 opacity-20 pointer-events-none" style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)', color: 'transparent' }}>VS</span>
                  </div>

                  <div className="text-center flex-1">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-4 relative group/fighter cursor-pointer">
                      <img
                        src={resultado.perdedor ? getImageUrl(resultado.perdedor.imgUrl) : logo}
                        alt="Dustin"
                        className="w-full h-full object-cover rounded-xl opacity-40 grayscale group-hover/fighter:opacity-100 transition-all duration-500 border border-white/5"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="font-black text-[9px] uppercase text-zinc-700 tracking-widest mb-1 italic">Perdedor</p>
                    <h3 className="font-headline font-black text-xl sm:text-2xl italic uppercase tracking-tighter text-zinc-600">
                      {resultado?.perdedor?.nombre ?? 'Empate'}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Ganandor Electo</span>
                    <span className="text-sm font-black text-primary italic uppercase tracking-tighter">{resultado?.ganador?.nombre ?? 'Empate'}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Round</span>
                    <span className="text-sm font-black text-white italic">3</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Terminancion</span>
                    <span className="text-sm font-black text-white italic tabular-nums">{formatFecha(resultado.horaFinalizacion)} - {formatHora(resultado.horaFinalizacion)}</span>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <span className="text-[5rem] sm:text-[6rem] font-black italic tracking-tighter text-white">{resultado?.ganador?.apodo ?? 'Empate'}</span>
              </div>
            </div>

          </section>

          {/* RIGHT COLUMN: Statistics & Tables */}
          <section className="flex-1 space-y-10 lg:min-w-0">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-surface-low rounded-3xl p-6 sm:p-8 border-l-4 border-primary shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] sm:text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] font-headline">Ganancias Totales</span>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-white">${totalGanado.toLocaleString('es-CO')}</h3>
                  </div>
                </div>
                <div className="absolute -right-6 -bottom-10 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <span className="text-[8rem] sm:text-[10rem] font-black italic select-none text-white">WIN</span>
                </div>
              </div>

              <div className="bg-surface-low rounded-3xl p-6 sm:p-8 border-l-4 border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] sm:text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] font-headline">Pago Total (Pérdidas)</span>
                    <div className="p-2 bg-white/5 rounded-lg text-zinc-500">
                      <CreditCard size={20} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black italic tracking-tighter text-white">${totalPerdido.toLocaleString('es-CO')}</h3>
                  </div>
                </div>
                <div className="absolute -right-6 -bottom-10 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <span className="text-[8rem] sm:text-[10rem] font-black italic select-none text-white">OUT</span>
                </div>
              </div>
            </div>

            {/* Pending Payouts Table */}
            <div className="bg-surface-low rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="p-6 sm:p-8 space-y-8 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-headline font-black italic tracking-tight uppercase text-white mb-2 leading-none">PAGOS PENDIENTES</h2>
                    <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] italic">Apuestas ganadoras pendientes de pago.</p>
                  </div>
                </div>

                <div className="flex bg-[#0e0e0e] p-1.5 rounded-xl border border-white/5 max-w-full overflow-x-auto no-scrollbar">
                  {['TODAS', 'PAGADAS', 'PENDIENTES'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActivePayoutsTab(tab as any)}
                      className={`whitespace-nowrap flex-1 sm:flex-none px-6 sm:px-8 py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg ${
                        activePayoutsTab === tab
                          ? 'bg-primary text-zinc-950 shadow-xl shadow-primary/20 italic'
                          : 'text-zinc-500 hover:text-white hover:bg-white/5 font-bold'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto w-full relative z-10 px-8 pb-8">
                <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="text-[10px] uppercase font-black tracking-widest text-zinc-600 border-b border-white/5">
                    <th className="pb-6 px-6 font-black">Apostador</th>
                    <th className="pb-6 px-6 font-black">Detalle</th>
                    <th className="pb-6 px-6 font-black">Monto</th>
                    <th className="pb-6 px-6 font-black">Estado</th>
                    <th className="pb-6 px-6 font-black text-right">Acción</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                  {filteredPayouts.map((retorno) => (
                    <tr key={retorno.id} onClick={() => handleOpenModal(retorno)} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-base font-black italic uppercase tracking-tight text-white group-hover:text-primary transition-colors leading-none mb-1">{retorno.apuestaInscrita.apostador.nombre}</p>
                            <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">ID: {retorno.apuestaInscrita.apostador.cedula}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <p className="text-sm font-black italic uppercase tracking-tight text-zinc-300 leading-none mb-1.5">{retorno.apuestaInscrita?.ganadorEsperado?.peleador?.nombre ?? "Empate"}</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">CUOTA: {retorno.apuestaInscrita.rendimientoGananciaAsociada}</p>
                      </td>
                      <td className="py-6 px-6">
                        <p className="text-xl font-black italic tracking-tighter text-primary tabular-nums">{retorno.apuestaInscrita.valorApostado}</p>
                      </td>

                      <td className="py-6 px-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest italic ${
                            retorno.estadoRetorno === 'PENDIENTE' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-zinc-600'
                          }`}>
                            <div className={`w-1 h-1 rounded-full ${retorno.estadoRetorno === 'PENDIENTE' ? 'bg-primary' : 'bg-zinc-800'}`}></div>
                            {retorno.estadoRetorno}
                          </span>
                      </td>

                      <td className="py-6 px-6 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(retorno); }}
                          className="bg-surface-high hover:bg-primary-container hover:text-primary p-2.5 rounded transition-all active:scale-90 text-zinc-400 group-hover:shadow-[0_0_20px_rgba(255,143,111,0.2)]"
                        >
                          <Send size={18} className="fill-current" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-white/5 relative z-10 px-4 pb-4">
                {filteredPayouts.map((retornos) => (
                  <div key={retornos.id} onClick={() => handleOpenModal(retornos)} className="py-6 flex flex-col gap-4 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src="https://picsum.photos/seed/jon/200/200" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-black uppercase italic tracking-tight text-white">{retornos.apuestaInscrita.apostador.nombre}</p>
                          <p className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase">{retornos.apuestaInscrita.apostador.cedula}</p>
                        </div>
                      </div>
                      <p className="text-xl font-black italic tracking-tighter text-primary">{retornos.apuestaInscrita.valorApostado}</p>
                    </div>
                    <div className="flex justify-between items-end bg-surface-high/30 p-4 rounded-xl border border-white/5">
                      <div>
                        <p className="text-xs font-black uppercase italic tracking-tight text-zinc-300 mb-1">{retornos.apuestaInscrita?.ganadorEsperado?.peleador?.nombre ?? "Empate"}</p>
                        <p className="text-[9px] text-primary font-black uppercase tracking-widest">CUOTA: {retornos.apuestaInscrita.rendimientoGananciaAsociada}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(retornos); }}
                        className="bg-primary text-zinc-950 p-3 rounded-lg shadow-lg shadow-primary/20"
                      >
                        <Send size={16} className="fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Betting History Table */}
            <div className="bg-surface-low rounded-3xl border border-white/5 shadow-2xl">
              <div className="p-6 sm:p-8 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-headline font-black italic tracking-tight uppercase text-white mb-2 leading-none">HISTORIAL DE APUESTAS</h2>
                    <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] italic">Registro completo de la actividad de apuestas reciente.</p>
                  </div>
                </div>

                <div className="flex bg-[#0e0e0e] p-1.5 rounded-xl border border-white/5 max-w-full overflow-x-auto no-scrollbar">
                  {['TODOS', 'GANADORES', 'PERDEDORES'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveHistoryTab(tab as any)}
                      className={`whitespace-nowrap flex-1 sm:flex-none px-6 sm:px-8 py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg ${
                        activeHistoryTab === tab
                          ? 'bg-primary text-zinc-950 shadow-xl shadow-primary/20 italic'
                          : 'text-zinc-500 hover:text-white hover:bg-white/5 font-bold'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop History Table */}
              <div className="hidden lg:block overflow-x-auto w-full px-8 pb-8">
                <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="text-[10px] uppercase font-black tracking-widest text-zinc-600 border-b border-white/5">
                    <th className="pb-6 px-6 font-black">Apostador</th>
                    <th className="pb-6 px-6 font-black">Detalle de Apuesta</th>
                    <th className="pb-6 px-6 font-black">Monto</th>
                    <th className="pb-6 px-6 font-black">Estado</th>
                    <th className="pb-6 px-6 font-black text-right">Acción</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                  {filteredHistory.map((apuesta) => (
                    <tr key={apuesta.id} onClick={() => handleActivityClick(apuesta)} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-black italic uppercase tracking-tight text-white group-hover:text-primary transition-colors leading-none mb-1">{apuesta.apostador.nombre}</p>
                            <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">ID: {apuesta.apostador.cedula}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <p className="text-xs font-black italic uppercase tracking-tight text-white/80 leading-none mb-1.5">{apuesta?.ganadorEsperado?.peleador?.nombre ?? "Empate"}</p>
                        <p className="text-[10px] text-primary/40 font-black uppercase tracking-widest">CUOTA: {apuesta.rendimientoGananciaAsociada}</p>
                      </td>
                      <td className="py-6 px-6">
                        <p className={`text-base font-black italic tracking-tighter tabular-nums ${apuesta.ganadorEsperado.resultadoCuota === "GANADA" ? "text-white" : "text-zinc-600"}`}>
                          {apuesta.valorApostado}
                        </p>
                      </td>

                      <td className="py-6 px-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest italic ${
                            apuesta.ganadorEsperado.resultadoCuota === 'GANADA' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-zinc-600'
                          }`}>
                            <div className={`w-1 h-1 rounded-full ${apuesta.ganadorEsperado.resultadoCuota === 'GANADA' ? 'bg-primary' : 'bg-zinc-800'}`}></div>
                            {apuesta.ganadorEsperado.resultadoCuota}
                          </span>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleActivityClick(apuesta); }}
                            className="bg-primary text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded italic hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary/10 ml-2"
                          >
                            Ver
                          </button>
                        </div>
                      </td>


                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile History Cards */}
              <div className="lg:hidden divide-y divide-white/5 px-4 pb-4">
                {filteredHistory.map((apuesta) => (
                  <div key={apuesta.id} onClick={() => handleActivityClick(apuesta)} className="py-6 flex flex-col gap-4 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src="https://picsum.photos/seed/jon/200/200" className="w-10 h-10 rounded-lg object-cover grayscale opacity-60" />
                        <div>
                          <p className="text-sm font-black uppercase italic tracking-tight text-white">{apuesta.apostador.nombre}</p>
                          <p className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase">{apuesta.apostador.cedula}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-tighter ${
                        apuesta.ganadorEsperado.resultadoCuota === 'GANADA' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-zinc-600'
                      }`}>
                        {apuesta.ganadorEsperado.resultadoCuota}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div>
                        <p className="text-xs font-black uppercase italic tracking-tight text-white/80 leading-none mb-1">{apuesta?.ganadorEsperado?.peleador?.nombre ?? "Empate"}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[9px] text-primary/40 font-black tracking-widest uppercase">CUOTA: {apuesta.rendimientoGananciaAsociada}</p>
                          <p className="text-sm font-black italic tracking-tighter text-white">{apuesta.valorApostado}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleActivityClick(apuesta); }}
                          className="bg-primary text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded italic hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary/10 ml-2"
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="w-full py-20 px-8 border-t border-white/5 bg-surface-low flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 mt-20 text-zinc-400">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-headline font-black text-white italic tracking-tighter uppercase mb-2">KNOCKBET</h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-[10px]">© 2024 KnockBet Editorial. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          <a href="#" className="text-zinc-600 hover:text-white transition-colors uppercase text-[9px] sm:text-[10px] font-black tracking-widest">Privacy Policy</a>
          <a href="#" className="text-zinc-600 hover:text-white transition-colors uppercase text-[9px] sm:text-[10px] font-black tracking-widest">Terms of Service</a>
          <a href="#" className="text-zinc-600 hover:text-white transition-colors uppercase text-[9px] sm:text-[10px] font-black tracking-widest">Contact Us</a>
        </div>
      </footer>

      <AnimatePresence>
        {isModalOpen && selectedBettor && (
          selectedBettor.estadoRetorno === "PAGADO" ? (
            <PaymentInvoiceModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              retorno={selectedBettor}
            />
          ) : (
            <PayoutModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              payoutData={selectedBettor}
            />
          )
        )}
      </AnimatePresence>

      <BetDetailModal
        isOpen={isModalOpenApuestaView}
        onClose={() => setIsModalOpenApuestaView(false)}
        bet={selectedBet}
      />


    </motion.div>
  );
}
