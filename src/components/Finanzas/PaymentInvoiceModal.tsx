/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  X, 
  User, 
  Receipt, 
  BarChart3, 
  Download,
  CheckCircle,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {useFactura} from "@/src/hooks/RetornosHooks/useFactura.ts";
import {Retorno} from "@/src/types/GET/Retorno.ts";

interface InvoiceData {
  bettorName: string;
  phone: string;
  email: string;
  event: string;
  fighter: string;
  odds: string;
  amount: string;
  totalPayout: string;
  paymentMethod: string;
  paymentDate: string;
  transactionId: string;
}

interface PaymentInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  retorno: Retorno | null;
}

export default function PaymentInvoiceModal({ isOpen, onClose, retorno }: PaymentInvoiceModalProps) {

  const { data: facturas, isLoading : loadingFacturas } = useFactura();

  if (!retorno) return null;

  const invoiceData = facturas?.find(p => p.retorno.id === retorno.id);

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

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface-low shadow-[0px_24px_48px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden border border-white/5 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-surface-low shrink-0">
              <h2 className="text-xl font-black italic uppercase font-headline tracking-tighter text-white">Factura de Pago / Confirmada</h2>
              <button 
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              {loadingFacturas && (
                <p className="text-center text-zinc-500 text-sm font-bold">Cargando factura...</p>
              )}

              {!loadingFacturas && !invoiceData && (
                <p className="text-center text-zinc-500 text-sm font-bold">No se encontro factura para este pago.</p>
              )}

              {!loadingFacturas && invoiceData && (
              <>
              <div className="flex justify-center">
                <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-6 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.2)] whitespace-nowrap">
                  <CheckCircle size={14} className="font-bold" />
                  <span className="font-black italic uppercase tracking-widest text-[10px]">PAGADO / CONFIRMADO</span>
                </div>
              </div>

              {/* Section 1: INFORMACIÓN DEL APOSTADOR */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <User size={14} className="text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Información del Apostador</h3>
                </div>
                <div className="bg-surface-high p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs">Nombre:</span>
                    <span className="font-bold text-white text-sm">{invoiceData.retorno.apuestaInscrita.apostador.nombre}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs">Teléfono:</span>
                    <span className="font-bold text-white text-sm tracking-wide">{invoiceData.retorno.apuestaInscrita.apostador.celular}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs">Email:</span>
                    <span className="font-bold text-white text-sm">{invoiceData.retorno.apuestaInscrita.apostador.correo}</span>
                  </div>
                </div>
              </section>

              {/* Section 2: RESUMEN DE LA APUESTA */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={14} className="text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Resumen de la Apuesta</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-500 text-xs">Evento:</span>
                    <span className="font-black font-headline text-white italic text-sm">{invoiceData.retorno.apuestaInscrita.apuesta.pelea.tituloPelea}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-500 text-xs">Luchador Seleccionado:</span>
                    <span className="font-bold text-white text-sm">{invoiceData.retorno.apuestaInscrita.ganadorEsperado?.peleador?.nombre ?? "Empate"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-surface-high p-4 rounded-lg text-center">
                      <span className="text-[10px] font-bold uppercase text-zinc-600 block mb-1">Odds</span>
                      <span className="text-xl font-headline font-black text-primary italic">{invoiceData.retorno.apuestaInscrita.rendimientoGananciaAsociada}</span>
                    </div>
                    <div className="bg-surface-high p-4 rounded-lg text-center">
                      <span className="text-[10px] font-bold uppercase text-zinc-600 block mb-1">Monto Apostado</span>
                      <span className="text-xl font-headline font-black text-white italic">{invoiceData.retorno.apuestaInscrita.valorApostado}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: DETALLES DEL PAGO */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Receipt size={14} className="text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Detalles del Pago</h3>
                </div>
                <div className="bg-surface-high/50 border border-white/5 p-5 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold">Método de Pago:</span>
                    <div className="flex items-center gap-2">
                      <Wallet size={14} className="text-white" />
                      <span className="font-bold text-white text-xs">{invoiceData.metodoPago}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold">Fecha de Pago:</span>
                    <span className="font-bold text-white text-xs">{invoiceData.fechaPago}</span>
                  </div>
                </div>
              </section>

              {/* Section 4: TOTAL & ACTION */}
              <div className="pt-4 space-y-6 shrink-0">
                <div className="bg-green-500/5 p-6 rounded-xl border border-green-500/20 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Total Pagado</p>
                    <p className="text-4xl font-headline font-black text-white italic tracking-tighter leading-none mt-1">{invoiceData.retorno.apuestaInscrita.totalGananciaPosible}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-zinc-950 shadow-xl shadow-primary/20">
                    <Wallet size={24} />
                  </div>
                </div>
                <p className="text-center text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em]">
                  Transacción encriptada & verificada por Octagon Elite
                </p>
              </div>
              </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
