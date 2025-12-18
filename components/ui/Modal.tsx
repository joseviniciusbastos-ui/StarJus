
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/60 dark:bg-black/90 backdrop-blur-md animate-in fade-in transition-all">
      <div 
        className="bg-white dark:bg-black rounded-[2.5rem] md:rounded-[4rem] shadow-2xl w-full max-w-2xl transform transition-all border border-slate-200 dark:border-zinc-900 flex flex-col max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-8 md:px-14 py-8 md:py-10 border-b border-slate-100 dark:border-zinc-900 shrink-0">
          <div className="space-y-1">
            <h3 id="modal-title" className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tighter italic font-serif gold-gradient-text leading-none">
              {title}
            </h3>
            <div className="h-1 w-12 bg-gold-600 rounded-full" />
          </div>
          <button
            onClick={onClose}
            className="p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-600 hover:text-red-500 transition-all border border-slate-200 dark:border-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 md:px-14 py-8 md:py-10 overflow-y-auto custom-scrollbar flex-1 text-slate-950 dark:text-zinc-100">
          {children}
        </div>
      </div>
    </div>
  );
};
