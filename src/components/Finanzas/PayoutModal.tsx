/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  X,
  User,
  Activity,
  CreditCard, Repeat, Banknote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Retorno } from "@/src/types/GET/Retorno.ts";
import { useState } from "react";
import { PagoPost } from '@/src/types/POST/PagoPost';
import { usePago } from "@/src/hooks/RetornosHooks/usePago.ts";

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  payoutData: Retorno;
}

export default function PayoutModal({ isOpen, onClose, payoutData }: PayoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'TRANSFERENCIA'>('EFECTIVO');
  const { mutate: realizarPago } = usePago();

  const handleSummitPayment = () => {
    const pago: PagoPost = {
      idRetorno: payoutData.id,
      metodoPago: paymentMethod
    }

    realizarPago(pago);

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-surface-low rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.6)] border border-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-surface-high/20">
              <h2 className="text-xl font-black italic uppercase font-headline tracking-tighter">Detalle de Pago / Factura</h2>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Section 1: INFORMACIÓN DEL APOSTADOR */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <User size={14} className="text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Información del Apostador</h3>
                </div>
                <div className="bg-surface-high/50 p-5 rounded-xl space-y-3 border border-white/5 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Nombre</span>
                    <span className="font-bold text-white text-sm italic">{payoutData.apuestaInscrita.apostador.nombre}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Celular</span>
                    <span className="font-bold text-white text-sm tracking-widest">{payoutData.apuestaInscrita.apostador.celular}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Cedula</span>
                    <span className="font-medium text-zinc-300 text-xs lowercase">{payoutData.apuestaInscrita.apostador.cedula}</span>
                  </div>
                </div>
              </section>

              {/* Section 2: RESUMEN DE LA APUESTA */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={14} className="text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Resumen de la Apuesta</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Evento</span>
                    <span className="font-black font-headline text-white italic text-sm">{payoutData.apuestaInscrita.apuesta.pelea.tituloPelea}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Luchador</span>
                    <span className="font-bold text-white text-sm italic">{payoutData.apuestaInscrita?.ganadorEsperado?.peleador?.nombre ?? "Empate"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-surface-high/50 p-4 rounded-xl text-center border border-white/5">
                      <span className="text-[9px] font-black uppercase text-zinc-500 block mb-2 tracking-widest">Cuota</span>
                      <span className="text-2xl font-headline font-black text-primary italic leading-none">{payoutData.apuestaInscrita.rendimientoGananciaAsociada}</span>
                    </div>
                    <div className="bg-surface-high/50 p-4 rounded-xl text-center border border-white/5">
                      <span className="text-[9px] font-black uppercase text-zinc-500 block mb-2 tracking-widest">Apostado</span>
                      <span className="text-2xl font-headline font-black text-white italic leading-none">{payoutData.apuestaInscrita.valorApostado.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                </div>
              </section>


              {/* Section 3 & 4: TOTAL & ACTION */}
              <div className="pt-4 space-y-6">
                {/* Metodo de Pago Selection */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Método de Pago</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('EFECTIVO')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${paymentMethod === 'EFECTIVO'
                        ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(255,143,111,0.1)]'
                        : 'bg-surface-high/50 border-white/5 hover:border-white/10'
                        }`}
                    >
                      <Banknote size={20} className={paymentMethod === 'EFECTIVO' ? 'text-primary' : 'text-zinc-500'} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'EFECTIVO' ? 'text-white' : 'text-zinc-500'}`}>Efectivo</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('TRANSFERENCIA')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${paymentMethod === 'TRANSFERENCIA'
                        ? 'bg-primary/20 border-primary shadow-[0_0_15_px_rgba(255,143,111,0.1)]'
                        : 'bg-surface-high/50 border-white/5 hover:border-white/10'
                        }`}
                    >
                      <Repeat size={20} className={paymentMethod === 'TRANSFERENCIA' ? 'text-primary' : 'text-zinc-500'} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'TRANSFERENCIA' ? 'text-white' : 'text-zinc-500'}`}>Transferencia</span>
                    </button>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex items-center justify-between relative overflow-hidden group">
                  <div className="absolute right-0 top-0 opacity-[0.03] translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform">
                    <CreditCard size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Total a Pagar</p>
                    <p className="text-5xl font-headline font-black text-white italic tracking-tighter leading-none tabular-nums">{payoutData.apuestaInscrita.totalGananciaPosible.toLocaleString('es-CO')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSummitPayment}
                    className="w-full bg-primary hover:bg-primary-fixed-dim text-black font-black italic uppercase tracking-tighter text-xl py-6 rounded-xl transition-all shadow-[0_15px_35px_rgba(255,143,111,0.3)] flex items-center justify-center gap-3"
                  >
                    <CreditCard size={20} />
                    Pagar Apuesta
                  </motion.button>
                  <p className="text-center text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] px-8">
                    Transacción encriptada & verificada por Octagon Elite Protocol
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
