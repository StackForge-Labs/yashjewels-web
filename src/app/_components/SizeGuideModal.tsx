"use client";

import React from "react";
import { X } from "lucide-react";
import { SizeGuideContent } from "./SizeGuideContent";

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl transition-all dark:bg-[#0a0a0a] md:p-12">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="mb-10 text-center">
                    <h2 className="font-serif text-3xl text-gray-900 dark:text-white mb-2">Size Guide</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ensure the perfect fit for your precious jewelry</p>
                </div>

                <SizeGuideContent />
                
                <div className="mt-12 text-center">
                    <button 
                        onClick={onClose}
                        className="bg-gold px-10 py-3 rounded-xl text-[11px] font-bold tracking-[0.2em] text-white uppercase hover:brightness-110 transition-all"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};
