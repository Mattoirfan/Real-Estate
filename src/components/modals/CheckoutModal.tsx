import React, { useState } from 'react';
import { X, Check, Shield, CreditCard, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { MembershipPlan, User } from '../../types';
import { api } from '../../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
  currentUser: User | null;
  onSuccess: (updatedUser: User) => void;
  onOpenAuth: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  currentUser,
  onSuccess,
  onOpenAuth
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [billingZip, setBillingZip] = useState('10022');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  if (!isOpen || !plan) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const paymentMethod = `Visa ending in ${cardNumber.slice(-4) || '4242'}`;
      const res = await api.checkoutPlan(plan.id, paymentMethod);

      if (res.success && res.user) {
        setCompleted(true);
        setTimeout(() => {
          onSuccess(res.user!);
          setCompleted(false);
          onClose();
        }, 1800);
      } else {
        setError(res.error || 'Payment authorization failed');
      }
    } catch (err: any) {
      setError(err.message || 'Transaction error');
    } finally {
      setLoading(false);
    }
  };

  const isRecurring = plan.billing_interval === 'monthly' || plan.billing_interval === 'yearly';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-[#0B132B] text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#C6A76A] text-xs font-semibold uppercase tracking-[0.2em]">
              Secure Checkout
            </span>
            <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded-full font-mono">
              256-Bit SSL Encrypted
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <h2 className="text-2xl font-bold font-['Manrope'] text-white">
                {plan.name} Privileges
              </h2>
              <div className="text-xs text-slate-300">
                {isRecurring ? 'Automatic monthly subscription' : 'One-time investment · Permanent access'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-['Manrope'] text-[#C6A76A]">
                ${plan.price}
              </div>
              <div className="text-[11px] text-slate-400">
                {isRecurring ? '/month billed recurring' : 'one-time payment'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {completed ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#F4EEDF] text-[#C6A76A] rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-['Manrope'] text-slate-900">
              Payment Confirmed
            </h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your server entitlements and <strong className="text-slate-900">{plan.name}</strong> privileges have been activated. Generating your receipt...
            </p>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="p-6 space-y-5">
            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!currentUser && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-900">Account Required</div>
                  <div className="text-[11px] text-amber-800">Please sign in or register to attach your membership.</div>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 bg-[#0B132B] text-white text-xs font-medium rounded-md hover:bg-slate-800"
                >
                  Sign In Now
                </button>
              </div>
            )}

            {/* Plan Entitlements Summary */}
            <div className="bg-[#F8F7F3] p-4 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
                Included Entitlements & Features:
              </div>
              <ul className="space-y-1.5">
                {plan.features.slice(0, 4).map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-[#C6A76A] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Simulated Payment Inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>Card Details (Test Gateway)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Test Mode Active</span>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={cardExp}
                  onChange={(e) => setCardExp(e.target.value)}
                  placeholder="MM/YY"
                  className="px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                />
                <input
                  type="text"
                  required
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="CVC"
                  className="px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                />
                <input
                  type="text"
                  required
                  value={billingZip}
                  onChange={(e) => setBillingZip(e.target.value)}
                  placeholder="Postal Code"
                  className="px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                />
              </div>
            </div>

            {/* Renewal and Terms Notice */}
            <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
              {isRecurring ? (
                <span>
                  You will be charged <strong>${plan.price} today</strong> and monthly thereafter. You can cancel anytime with 1-click in your account dashboard. 14-day refund window.
                </span>
              ) : (
                <span>
                  One-time charge of <strong>${plan.price}</strong>. No recurring fees or hidden surprises. Permanent access to {plan.name} features.
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !currentUser}
                className="w-full py-3 px-4 bg-[#0B132B] hover:bg-[#1C2541] disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#C6A76A]" />
                <span>
                  {loading 
                    ? 'Authorizing Transaction...' 
                    : `Authorize $${plan.price} & Activate ${plan.name}`}
                </span>
                <ArrowRight className="w-4 h-4 text-[#C6A76A]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
