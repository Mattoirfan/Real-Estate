import React from 'react';
import { ShieldAlert, ChevronLeft } from 'lucide-react';

export const TermsPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
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
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs uppercase font-bold tracking-widest">Legal Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold font-['Manrope'] text-slate-900">
            Terms of Service & Membership Conditions
          </h1>
          <p className="text-slate-500 text-[11px] font-mono">
            Last Updated: October 2026 · EstateNova Global Brokerage
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-4">1. Demonstration & Sample Data Notice</h2>
          <p>
            EstateNova is configured with illustrative sample property residences, architectural photographs, and demo testimonials to demonstrate platform functionality. Fictional listings are labeled as demo assets and do not constitute an active binding public offering.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-4">2. Membership Tiers & Billing Structure</h2>
          <p>
            EstateNova offers both One-Time and Recurring Monthly Membership plans:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Starter ($99) & Plus ($149):</strong> Single, non-recurring payments providing permanent account discovery features, increased favorite allowances, and direct broker contact.</li>
            <li><strong>Premium ($199/month) & Elite ($499/month):</strong> Recurring monthly subscriptions providing 48-hour off-market advance previews, priority concierge desks, and promotional listing credits.</li>
          </ul>

          <h2 className="text-base font-bold text-slate-900 pt-4">3. Subscription Renewal & Cancellation</h2>
          <p>
            Monthly subscriptions renew automatically on each calendar billing cycle date until canceled. Members may cancel renewal anytime in one click from their Customer Account Dashboard. Privileges and entitlements remain active until the conclusion of the paid billing interval.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-4">4. Refund Policy</h2>
          <p>
            Members are eligible for a 14-day refund window following their initial purchase, provided confidential private viewings or formal acquisition advisory sessions have not already been executed.
          </p>
        </div>
      </div>
    </div>
  );
};
