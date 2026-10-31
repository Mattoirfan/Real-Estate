import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Key, 
  Home, 
  TrendingUp, 
  Building, 
  Compass, 
  Eye, 
  FileCheck, 
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { MembershipPlan, User } from '../types';
import { api } from '../services/api';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenCheckout: (plan: MembershipPlan) => void;
  onOpenEnquiry: (property?: any) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenCheckout,
  onOpenEnquiry
}) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await api.getPlans();
        setPlans(data);
      } catch (err) {
        console.error('Failed to load membership plans', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const services = [
    {
      id: 'buying',
      title: 'Bespoke Property Acquisition',
      desc: 'Exclusive buyer advisory navigating prime property searches, off-market opportunities, valuation benchmarks, and price negotiations.',
      benefits: ['Unlisted portfolio access', 'Independent structural audit review', 'Escrow price optimization'],
      cta: 'Engage Acquisition Advisor',
      icon: Key
    },
    {
      id: 'rental',
      title: 'Luxury Tenancy & Relocation',
      desc: 'Discreet long-term and seasonal residential rentals across London, Manhattan, Cannes, and Tokyo with verified landlords.',
      benefits: ['Diplomatic lease clauses', 'Turnkey interior staging', 'Private concierge coordination'],
      cta: 'Explore Rental Advisory',
      icon: Home
    },
    {
      id: 'selling',
      title: 'Discretionary Seller Representation',
      desc: 'Representing owners of landmark residences through quiet confidential marketing or targeted international syndication.',
      benefits: ['Vetted high-net-worth buyers', 'Strict confidentiality agreements', 'Global family-office reach'],
      cta: 'List With EstateNova',
      icon: TrendingUp
    },
    {
      id: 'promotion',
      title: 'Architectural Media & Exposure',
      desc: 'Editorial-grade cinematography, 4K architectural drone perspectives, and feature placement in leading global lifestyle journals.',
      benefits: ['Architectural Digest aesthetic', 'Targeted international digital distribution', 'Virtual 3D digital twins'],
      cta: 'Request Media Kit',
      icon: Eye
    },
    {
      id: 'management',
      title: 'Super-Prime Property Management',
      desc: 'Turnkey asset preservation, preventative facility maintenance, staff payroll management, and seasonal residency preparation.',
      benefits: ['24/7 emergency response', 'Dedicated estate superintendent', 'Transparent operating statements'],
      cta: 'Consult Asset Team',
      icon: Building
    },
    {
      id: 'consultation',
      title: 'Strategic Real Estate Advisory',
      desc: 'Portfolio yield modeling, cross-border property tax frameworks, and multi-generational real estate wealth allocation.',
      benefits: ['Macro urban liquidity analysis', 'Tax-efficient holding structures', 'Zoning & development feasibility'],
      cta: 'Schedule Consultation',
      icon: Compass
    },
    {
      id: 'viewing',
      title: 'Accompanied Private Viewings',
      desc: 'Chauffeured, security-cleared property tours led by our senior managing directors with detailed structural dossiers.',
      benefits: ['Discreet executive transit', 'Complete architectural briefing', 'Flexible multi-city itineraries'],
      cta: 'Book Accompanied Tour',
      icon: FileCheck
    },
    {
      id: 'offmarket',
      title: 'Off-Market Capital Placement',
      desc: 'Direct confidential matching between institutional capital, sovereign funds, and trophy freehold asset owners.',
      benefits: ['Zero public syndication', 'Pre-qualified liquid capital', 'Speed of closing'],
      cta: 'Discuss Placement',
      icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-24">
      
      {/* Header */}
      <div className="bg-[#0B132B] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-[#C6A76A] text-xs font-semibold uppercase tracking-[0.24em] block mb-2">
            Advisory & Privileges
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Manrope'] tracking-tight">
            Comprehensive Real Estate Services & Membership
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
            From bespoke buyer representation to privileged membership tiers, EstateNova offers unmatched discretion, market intelligence, and institutional excellence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* AREA A: REAL ESTATE SERVICES */}
        <section id="services">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
              Area A · Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
              Private Real Estate Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Bespoke solutions delivered by our managing directors across global key financial centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#0B132B] text-[#C6A76A] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-bold font-['Manrope'] text-slate-900 mb-2">
                      {svc.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {svc.desc}
                    </p>

                    <div className="space-y-1.5 mb-6 border-t border-slate-100 pt-3">
                      {svc.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                          <Check className="w-3.5 h-3.5 text-[#C6A76A] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenEnquiry()}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-[#0B132B] hover:text-white text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 hover:border-transparent transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{svc.cta}</span>
                    <ArrowRight className="w-3 h-3 text-[#C6A76A]" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* AREA B: MEMBERSHIP PLANS & PRICING */}
        <section id="memberships" className="pt-8 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
              Area B · Private Client Membership
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
              Select Your Privilege Tier
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Clearly categorized into one-time lifetime tiers and recurring monthly advisory programs. Entitlements are immediately enforced by verified server records.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-96 bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => {
                const isPopular = plan.is_popular;
                const isMonthly = plan.billing_interval === 'monthly';
                const isCurrent = currentUser?.membership?.plan_id === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-2xl p-7 border flex flex-col justify-between transition-all ${
                      isPopular 
                        ? 'border-[#C6A76A] shadow-xl relative ring-1 ring-[#C6A76A]/40' 
                        : 'border-slate-200 shadow-sm hover:border-slate-300'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C6A76A] text-[#0B132B] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-xs">
                        Most Popular for Buyers
                      </div>
                    )}

                    <div>
                      {/* Billing Classification Tag */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {plan.name}
                        </span>
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                          isMonthly 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isMonthly ? 'Monthly Subscription' : 'One-Time Payment'}
                        </span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-1 my-3">
                        <span className="text-4xl font-extrabold font-['Manrope'] text-slate-900">
                          ${plan.price}
                        </span>
                        <span className="text-xs text-slate-500">
                          {isMonthly ? '/month' : ' one-time'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-6 min-h-[40px]">
                        {plan.description}
                      </p>

                      {/* Core Entitlements Checklist */}
                      <div className="border-t border-slate-100 pt-4 space-y-2.5 mb-6">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Included Entitlements:
                        </div>
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-[#C6A76A] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Explicit Limits & Terms */}
                      <div className="bg-[#FAFAF8] p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1 mb-6">
                        <div>
                          <strong>Saved Favorites:</strong> {plan.limits.max_favorites > 100 ? 'Unlimited' : `Up to ${plan.limits.max_favorites}`}
                        </div>
                        <div>
                          <strong>Broker Contact:</strong> {plan.limits.direct_agent_contact ? 'Direct Phone & WhatsApp' : 'Via Advisory Desk'}
                        </div>
                        <div>
                          <strong>Renewal:</strong> {isMonthly ? 'Renews monthly · Cancel anytime' : 'Permanent access · Zero renewals'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          if (!currentUser) onOpenAuth();
                          else onOpenCheckout(plan);
                        }}
                        disabled={isCurrent}
                        className={`w-full py-3 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          isCurrent
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                            : isPopular
                              ? 'bg-[#0B132B] hover:bg-[#1C2541] text-white shadow-md'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Active Plan</span>
                          </>
                        ) : (
                          <>
                            <span>{currentUser ? `Acquire ${plan.name} ($${plan.price})` : `Sign In to Select ${plan.name}`}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#C6A76A]" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Comparison Matrix */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold font-['Manrope'] text-slate-900 mb-6">
              Complete Privileges & Limits Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3 pr-4 font-semibold">Privilege Feature</th>
                    <th className="py-3 px-4 font-semibold text-center">Starter ($99)</th>
                    <th className="py-3 px-4 font-semibold text-center bg-[#F8F7F3] rounded-t-lg">Plus ($149)</th>
                    <th className="py-3 px-4 font-semibold text-center">Premium ($199/mo)</th>
                    <th className="py-3 px-4 font-semibold text-center">Elite ($499/mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Billing Interval</td>
                    <td className="py-3 px-4 text-center text-slate-600">One-Time</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-900 bg-[#F8F7F3]">One-Time</td>
                    <td className="py-3 px-4 text-center text-slate-600">Monthly</td>
                    <td className="py-3 px-4 text-center text-slate-600">Monthly</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Saved Properties Limit</td>
                    <td className="py-3 px-4 text-center text-slate-600">5 Properties</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-900 bg-[#F8F7F3]">25 Properties</td>
                    <td className="py-3 px-4 text-center text-[#B8934A] font-semibold">Unlimited</td>
                    <td className="py-3 px-4 text-center text-[#B8934A] font-semibold">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Direct Broker Phone & WhatsApp</td>
                    <td className="py-3 px-4 text-center text-slate-400">—</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold bg-[#F8F7F3]">Unlocked</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">Unlocked</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">Dedicated Director</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Off-Market 48h Advance Alerts</td>
                    <td className="py-3 px-4 text-center text-slate-400">—</td>
                    <td className="py-3 px-4 text-center text-slate-400 bg-[#F8F7F3]">—</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">Real-Time First Look</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Virtual Tours & Floor Plan CADs</td>
                    <td className="py-3 px-4 text-center text-slate-400">—</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold bg-[#F8F7F3]">Included</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">Included</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Listing Promotion Credits</td>
                    <td className="py-3 px-4 text-center text-slate-400">0</td>
                    <td className="py-3 px-4 text-center text-slate-400 bg-[#F8F7F3]">0</td>
                    <td className="py-3 px-4 text-center text-slate-700">1 Credit / mo</td>
                    <td className="py-3 px-4 text-center text-[#B8934A] font-bold">5 Credits / mo</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Chauffeured Viewing Concierge</td>
                    <td className="py-3 px-4 text-center text-slate-400">—</td>
                    <td className="py-3 px-4 text-center text-slate-400 bg-[#F8F7F3]">—</td>
                    <td className="py-3 px-4 text-center text-slate-600">Standard Accompanied</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">Chauffeured VIP</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Terms and Cancellation Notice */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C6A76A]" />
                <span>14-day refund window. Cancel monthly subscriptions in 1-click anytime from your account.</span>
              </div>
              <button onClick={() => onNavigate('/terms')} className="text-[#0B132B] font-semibold hover:underline">
                Read Full Membership Terms
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
