import { AlertCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { dismissToast, subscribeToToasts, type ToastItem } from "../util/toast.ts";

export default function ToastViewport() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToToasts(setToasts), []);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 32, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 32, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="alert"
            className="pointer-events-auto flex gap-3 rounded border border-red-500/30 bg-[#1f1111]/95 p-4 text-white shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded bg-red-500/15 text-red-300">
              <AlertCircle size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black uppercase tracking-widest text-red-200">
                {toast.title}
              </p>
              <p className="mt-1 max-h-40 overflow-y-auto whitespace-pre-line text-sm leading-5 text-zinc-100">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              aria-label="Cerrar notificacion"
              onClick={() => dismissToast(toast.id)}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
