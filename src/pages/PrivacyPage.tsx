import React from 'react';
import { ShieldCheck, ChevronLeft } from 'lucide-react';

export const PrivacyPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => onNavigate('/')}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return Home</span>
        </button>

        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-center gap-2 text-[#B8934A]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs uppercase font-bold tracking-widest">Confidentiality Standard</span>
          </div>
          <h1 className="text-3xl font-extrabold font-['Manrope'] text-slate-900">
            Privacy & Client Discretion Policy
          </h1>
          <p className="text-slate-500 text-[11px] font-mono">
            Effective Date: October 2026 · EstateNova Private Client Services
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-4">1. Commitment to Discretion</h2>
          <p>
            EstateNova respects and protects the confidentiality of our private acquirers, high-net-worth investors, and family offices. We do not sell, rent, or trade private customer details to third-party advertising exchanges.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-4">2. Information Collection</h2>
          <p>
            We collect personal identity data (full name, email, telephone) solely when voluntarily submitted during private inquiry generation, viewing booking, account registration, or membership checkout.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-4">3. Security & Data Protection</h2>
          <p>
            All network communication and transactional data are encrypted via modern 256-bit TLS protocols. Server-side entitlements strictly govern access to saved listings and inquiry histories.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-4">4. Non-Disclosure Covenants</h2>
          <p>
            Off-market acquisitions, valuation dossiers, and private viewing disclosures are conducted under binding non-disclosure agreements to preserve client anonymity.
          </p>
        </div>
      </div>
    </div>
  );
};
