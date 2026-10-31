import React from 'react';
import { Home, Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-36 pb-24 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <span className="text-[#C6A76A] font-mono font-bold text-3xl">404</span>
        <h1 className="text-2xl font-bold font-['Manrope'] text-slate-900">
          Page Not Located
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested sanctuary or page address cannot be found or has been moved within our private archives.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto py-2.5 px-5 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-[#C6A76A]" />
            <span>Return Home</span>
          </button>
          <button
            onClick={() => onNavigate('/properties')}
            className="w-full sm:w-auto py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Properties</span>
          </button>
        </div>
      </div>
    </div>
  );
};
