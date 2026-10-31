import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Logo } from '../common/Logo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800">
      {/* Top Advisory Banner */}
      <div className="border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="text-[#C6A76A] text-xs font-semibold uppercase tracking-[0.2em]">
                Private Client Intelligence
              </span>
              <h3 className="text-xl md:text-2xl font-bold font-['Manrope'] text-white mt-1">
                Receive Confidential Off-Market Whispers
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md">
                Curated weekly briefings on prime residential acquisitions, sovereign capital shifts, and architectural masterpieces.
              </p>
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your confidential email"
                  className="px-4 py-2.5 text-xs bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#C6A76A] flex-1"
                />
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#C6A76A] hover:bg-[#B8934A] text-[#0B132B] text-xs font-bold rounded-lg transition-colors shrink-0 flex items-center justify-center gap-2"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-4 h-4 text-[#0B132B]" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <span>Join Briefing</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="horizontal" theme="light" subline={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              EstateNova is a premier international real estate brokerage and private advisory platform representing distinguished architectural residences and prime commercial assets across New York, London, Paris, Cannes, and Dubai.
            </p>
            
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C6A76A] shrink-0" />
                <span>450 Park Avenue, 21st Floor, New York, NY 10022</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C6A76A] shrink-0" />
                <span>+1 (800) 378-2831 · Advisory Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C6A76A] shrink-0" />
                <span>advisory@estatenova.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Discover Properties */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.16em] mb-4 font-['Manrope']">
              Residences
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/properties?type=sale')} className="hover:text-white transition-colors">
                  Properties for Sale
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/properties?type=rent')} className="hover:text-white transition-colors">
                  Luxury Rental Estates
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/properties?property_type=villa')} className="hover:text-white transition-colors">
                  Mediterranean & Alpine Villas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/properties?property_type=penthouse')} className="hover:text-white transition-colors">
                  Skyline Penthouses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/properties?property_type=commercial')} className="hover:text-white transition-colors">
                  Prime Commercial Freeholds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/properties?featured=true')} className="hover:text-white transition-colors text-[#C6A76A]">
                  Curated Private Portfolio
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Advisory & Memberships */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.16em] mb-4 font-['Manrope']">
              Privileges & Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Membership Plans & Tiers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Buyer Representation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Off-Market Seller Matching
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Accompanied Private Viewings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Asset & Escrow Due Diligence
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/account')} className="hover:text-white transition-colors">
                  Client Portal Access
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Brand & Editorial */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.16em] mb-4 font-['Manrope']">
              EstateNova
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  Our Firm & Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/blog')} className="hover:text-white transition-colors">
                  Architectural Insights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Global Desks & Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
                  Privacy & Discretion Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
                  Terms & Membership Rules
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-white transition-colors text-blue-400">
                  Staff Admin Console
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Sample Data Disclosure */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C6A76A] shrink-0" />
            <span>
              Sample Demonstration Platform: All featured property listings, broker profiles, and prices are illustrative demo assets.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} EstateNova Inc. All rights reserved.</span>
            <button onClick={() => onNavigate('/privacy')} className="hover:underline">Privacy</button>
            <button onClick={() => onNavigate('/terms')} className="hover:underline">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
