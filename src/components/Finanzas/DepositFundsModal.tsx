import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, ShieldCheck } from 'lucide-react';

interface DepositFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

export default function DepositFundsModal({ isOpen, onClose, onDeposit }: DepositFundsModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      onDeposit(parsedAmount);
      setAmount('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface-low w-full max-w-lg border border-white/5 shadow-2xl relative overflow-hidden rounded-2xl"
          >
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            
            <div className="p-8">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-black font-headline tracking-tighter uppercase text-white mb-2 italic">
                  DEPOSITAR <span className="text-primary">FONDOS</span>
                </h2>
                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black italic">
                  Recarga de Liquidez Operacional
                </p>
              </div>

              {/* Form */}
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Amount Input */}
                <div className="space-y-3">
                  <label className="block text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] italic">Monto a Depositar (USD)</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                      <DollarSign size={20} />
                    </div>
                    <input 
                      className="w-full bg-surface-high border border-white/5 focus:border-primary/50 focus:ring-0 text-white pl-12 pr-4 py-4 font-headline font-black text-2xl transition-all placeholder:text-zinc-800 italic"
                      placeholder="0.00" 
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    className="w-full bg-primary text-zinc-950 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-primary-dim transition-all shadow-[0_15px_30px_rgba(255,143,111,0.2)] active:scale-[0.98] italic" 
                    type="submit"
                  >
                    Confirmar Depósito
                  </button>
                  <button 
                    className="w-full bg-transparent border border-white/5 text-zinc-500 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 hover:text-white transition-all active:scale-[0.98] italic" 
                    onClick={onClose}
                    type="button"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom UI Detail */}
            <div className="bg-surface-high/50 px-8 py-4 flex justify-between items-center border-t border-white/5">
              <span className="text-[9px] text-zinc-600 font-mono font-bold tracking-widest">SECURE PROTOCOL v4.2</span>
              <ShieldCheck size={16} className="text-zinc-700 italic" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
