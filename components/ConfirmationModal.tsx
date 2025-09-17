import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
            aria-labelledby="confirmation-title"
        >
            <div 
                className="glass-pane w-full max-w-md p-8"
                onClick={e => e.stopPropagation()}
                role="document"
            >
                <div className="flex justify-between items-start mb-4">
                    <h2 id="confirmation-title" className="text-2xl font-bold text-white text-glow">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 -mt-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <p className="text-slate-300 mb-8">{message}</p>

                <div className="flex justify-end space-x-4">
                    <button 
                        onClick={onClose}
                        type="button"
                        className="bg-white/10 text-slate-200 font-bold py-2.5 px-6 rounded-xl hover:bg-white/20 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        type="button"
                        className="bg-error text-white font-bold py-2.5 px-6 rounded-xl hover:bg-error/80 transition-colors shadow-lg shadow-error/30"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
