import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, size = 'md', showCloseButton = true,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/75 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-900/60 w-full ${sizeClasses[size]} animate-slide-up border border-neutral-100 dark:border-slate-700`}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h3>}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
