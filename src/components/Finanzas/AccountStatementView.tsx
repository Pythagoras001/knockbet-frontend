import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Download,
  Filter,
  Calendar
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { usePresupuesto } from "@/src/hooks/PresupuestoHooks/usePresupuesto.ts";
import { useRetornos } from "@/src/hooks/RetornosHooks/useRetornos.ts";
import { formatFecha } from "@/src/util/eventoUtils.ts";
import PayoutModal from "@/src/components/Finanzas/PayoutModal.tsx";
import type { Retorno } from "@/src/types/GET/Retorno.ts";
import DepositFundsModal from "@/src/components/Finanzas/DepositFundsModal.tsx";
import { useDeposito } from '@/src/hooks/PresupuestoHooks/useDeposito.ts';
import {DepositoPost} from "@/src/types/POST/DepositoPost.ts";
import PaymentInvoiceModal from "@/src/components/Finanzas/PaymentInvoiceModal.tsx";

interface AccountStatementViewProps {
  onBack: () => void;
  key?: string;
}


export default function AccountStatementView({ onBack }: AccountStatementViewProps) {
  const [activeTab, setActiveTab] = useState<'TODOS' | 'PAGADOS' | 'PENDIENTES'>('TODOS');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const { data: presupuesto, isLoading: loadingPresupuestp } = usePresupuesto();
  const { data: retornos, isLoading: loadingRetornos } = useRetornos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBettor, setSelectedBettor] = useState<Retorno | null>(null);
  const { mutate: depositarPresupuesto } = useDeposito();


  if (loadingPresupuestp) return <p>Cargando...</p>;
  if (loadingRetornos) return <p>Cargando retornos...</p>;

  const handleDeposit = (monto: number) => {
    const deposito: DepositoPost = {
      monto
    };

    depositarPresupuesto(deposito);
  };

  const filteredRetornos = (retornos ?? []).filter(tx => {
    if (activeTab === 'TODOS') return true;
    if (activeTab === 'PAGADOS') return tx.estadoRetorno === 'PAGADO';
    if (activeTab === 'PENDIENTES') return tx.estadoRetorno === 'PENDIENTE';
    return true;
  });


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-surface"
    >
      <div className="px-4 md:px-12 py-8 md:py-16 max-w-7xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver A Historial
            </button>
            <h2 className="text-5xl md:text-8xl italic font-headline font-black tracking-tighter leading-none uppercase">
              ESTADO <span className="editorial-outline italic">DE</span><br /><span className="text-primary">CUENTA</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium tracking-wide max-w-md italic">
              Monitoreo centralizado del estado de ganancias y pérdidas. Supervisión de márgenes netos, flujo de caja y liquidación de bolsas de combate en tiempo real.
            </p>
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-surface-low text-primary border border-primary/20 px-6 py-4 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary hover:text-zinc-950 transition-all active:scale-95 italic">
              <Wallet size={16} />
              Retirar Dinero
            </button>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="flex-1 sm:flex-none bg-primary text-zinc-950 px-8 py-4 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary-dim shadow-xl shadow-primary/20 transition-all active:scale-95 italic"
            >
              <PlusCircle size={16} />
              Depositar Fondos
            </button>
          </div>
        </div>

        {/* Hero Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Balance Display */}
          <div className="lg:col-span-8 bg-surface-low p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none group-hover:scale-110 transition-transform duration-1000">
              <Wallet size={320} className="text-white" />
            </div>

            <div className="relative z-10">
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary mb-4 italic">Presupuesto Total (Balance)</p>
              <div className="flex items-baseline gap-4 mb-12">
                <span className="font-black font-headline tracking-tighter text-white text-6xl md:text-8xl italic leading-none">${presupuesto.presupuestoTotal.toLocaleString('es-CO')}</span>
                <span className="text-2xl font-black text-zinc-700 font-headline italic tracking-tighter">COP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-2">Presupuesto Inicial</p>
                  <p className="text-2xl font-black text-white italic tracking-tighter tabular-nums">${presupuesto.presupuestoInicial.toLocaleString('es-CO')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-2">Ganancias Totales</p>
                  <p className="text-2xl font-black text-primary italic tracking-tighter tabular-nums">${(presupuesto.gananciasTotales).toLocaleString('es-CO')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <StatBox
              label="Ganancias Totales"
              value={`$ ${presupuesto.gananciasTotales.toLocaleString('es-CO')}`}
              sub="Dinero De Apuestas Perdidas"
              icon={<ArrowUpRight size={20} />}
              color="text-emerald-500"
              bgColor="bg-emerald-500/10"
            />
            <StatBox
              label="Pagos Totales (Pérdidas)"
              value={`$ ${Number(presupuesto.pagosTotales).toLocaleString('es-CO')}`}
              sub="Liquidación a ganadores"
              icon={<ArrowDownRight size={20} />}
              color="text-rose-500"
              bgColor="bg-rose-500/10"
            />
          </div>
        </div>

        {/* Transaction History Section */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-8">
            <h3 className="text-3xl font-black uppercase font-headline italic tracking-tighter text-white">Historial Financiero</h3>
            <div className="flex bg-surface-low p-1.5 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
              {(['TODOS', 'PAGADOS', 'PENDIENTES'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg ${activeTab === tab
                    ? 'bg-primary text-zinc-950 italic shadow-lg shadow-primary/20'
                    : 'text-zinc-500 hover:text-white'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Card Layout (FighterDirectory style) */}
          <div className="md:hidden space-y-4">
            {filteredRetornos.map((tx) => (
              <div
                key={tx.id}
                onClick={() => {
                  setSelectedBettor(tx);
                  setIsModalOpen(true);
                }}
                className="bg-surface-low border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl group cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-zinc-600 font-bold">{tx.id}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest italic rounded ${tx.estadoRetorno === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-surface-high text-zinc-500'
                    }`}>
                    {tx.estadoRetorno}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-high border border-white/5 flex items-center justify-center overflow-hidden">
                    <History size={20} className="text-zinc-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white italic uppercase leading-none mb-1 group-hover:text-primary transition-colors">{tx.apuestaInscrita?.ganadorEsperado?.peleador?.nombre ?? "Empate"}</h4>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest truncate">{tx.apuestaInscrita.apuesta.pelea.tituloPelea}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Categoría</p>
                    <span className="text-[10px] font-black text-primary italic uppercase tracking-tighter">{tx.apuestaInscrita.rendimientoGananciaAsociada}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Monto</p>
                    <p className={`text-xl font-black italic tracking-tighter tabular-nums ${tx.estadoRetorno === 'PENDIENTE' ? 'text-white' : 'text-zinc-600'}`}>
                      {tx.apuestaInscrita.valorApostado}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-surface-low rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-high/30 border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">Apostador</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">Apuesta</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">Fighter/Evento</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">Fecha</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] text-right">Monto</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRetornos.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => {
                      setSelectedBettor(tx);
                      setIsModalOpen(true);
                    }}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-black text-white italic uppercase leading-none mb-1 group-hover:text-primary transition-colors">{tx.apuestaInscrita.apostador.nombre}</p>
                          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">CC: {tx.apuestaInscrita.apostador.cedula}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span className="bg-surface-high text-zinc-400 text-[9px] px-2.5 py-1 font-black uppercase tracking-widest rounded-sm italic">
                        {tx.apuestaInscrita?.ganadorEsperado?.peleador?.nombre ?? "Empate"}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-xs text-zinc-500 font-bold uppercase">{tx.apuestaInscrita.apuesta.pelea.tituloPelea}</td>

                    <td className="px-8 py-6 text-xs text-zinc-500 font-bold uppercase">
                      {tx.apuestaInscrita?.apuesta?.fechaDePublicacion ? formatFecha(tx.apuestaInscrita.apuesta.fechaDePublicacion) : "—"}
                    </td>

                    <td className={`px-8 py-6 text-right font-black italic text-base tabular-nums ${tx.estadoRetorno === 'PENDIENTE' ? 'text-primary' : 'text-white'}`}>
                      $ {tx.apuestaInscrita.valorApostado.toLocaleString('es-CO')}
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] italic px-3 py-1.5 rounded-sm ${tx.estadoRetorno === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary text-black'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${tx.estadoRetorno === 'PAGADO' ? 'bg-emerald-500' : 'bg-red-800 animate-pulse'}`} />
                          {tx.estadoRetorno}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 bg-surface-high/20 text-center border-t border-white/5">
              <button className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white transition-all italic">
                Ver todas las transacciones
              </button>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedBettor && (
          selectedBettor.estadoRetorno === "PAGADO" ? (
            <PaymentInvoiceModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedBettor(null);
              }}
              retorno={selectedBettor}
            />
          ) : (
            <PayoutModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedBettor(null);
              }}
              payoutData={selectedBettor}
            />
          )
        )}
      </AnimatePresence>

      <DepositFundsModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={handleDeposit}
      />

    </motion.div>
  );
}

function StatBox({ label, value, sub, icon, color, bgColor }: { label: string, value: string, sub: string, icon: React.ReactNode, color: string, bgColor: string }) {
  return (
    <div className="bg-surface-low p-8 rounded-3xl border border-white/5 shadow-xl flex flex-col justify-center group hover:border-primary/20 transition-all">
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center ${color} shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 italic leading-none">{label}</p>
        </div>
      </div>
      <div>
        <p className="text-4xl font-black font-headline text-white italic tracking-tighter leading-none">{value}</p>
        <p className="text-[10px] text-zinc-600 mt-3 italic font-bold uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );
}
