import React from 'react';
import { ArrowRight, Shield, Award, Users, Check, Globe, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const leadership = [
    {
      name: 'Julian Montgomery',
      title: 'Senior Partner & Co-Founder',
      office: 'New York & Zurich',
      bio: 'Over 22 years structuring cross-border trophy transactions for family offices and sovereign wealth entities across Manhattan, Mayfair, and Saint-Tropez.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Victoria Vance',
      title: 'Managing Director, West Coast Estates',
      office: 'Los Angeles & Aspen',
      bio: 'Leading super-prime advisor across Bel Air, Beverly Hills, and Malibu, with extensive background in modernist architectural preservation and hillside engineering.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'James Harrington-Smyth',
      title: 'Partner, Prime Central London',
      office: 'London Mayfair',
      bio: 'Specialist in Grade I and II listed heritage townhouses in Mayfair and Belgravia, advising diplomatic delegations and institutional estates.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Charlotte Dubois',
      title: 'Director, Mediterranean Portfolio',
      office: 'Cannes & Monaco',
      bio: 'Authority on prime Côte d’Azur coastal villas, private moorings, and French property tax structuring for international collectors.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-24">
      
      {/* Hero Section */}
      <section className="bg-[#0B132B] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="EstateNova Architectural Heritage"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[#C6A76A] text-xs font-semibold uppercase tracking-[0.24em]">
            Brand Story & Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] tracking-tight">
            An Enduring Commitment to Architectural Excellence.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            EstateNova was founded on a singular conviction: that extraordinary architecture demands an equally refined standard of discretion, intelligence, and bespoke stewardship.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-20">
        
        {/* Brand Mission & Approach */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
              Our Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-slate-900 leading-tight">
              Bridging Heritage Integrity with Modern Global Liquidity.
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Operating from our private client advisory suites in New York, London, and Cannes, EstateNova serves as a confidential conduit between owners of landmark residential properties and qualified international purchasers.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Unlike mass listing portals that prioritize volume over verification, our catalog is rigorously curated. Every residence represented on our platform is evaluated for architectural provenance, boundary security, and structural excellence before being presented to our membership.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C6A76A]" />
                <span>Zero Public Speculation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C6A76A]" />
                <span>Forensic Title Audits</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C6A76A]" />
                <span>Private Escrow Mechanisms</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C6A76A]" />
                <span>Direct Partner Guidance</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                alt="EstateNova Advisory Meeting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Four Pillars */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
              Guiding Principles
            </span>
            <h3 className="text-2xl font-bold font-['Manrope'] text-slate-900 mt-1">
              The EstateNova Pillars
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-2">
              <div className="text-[#C6A76A] font-bold font-mono text-xs">01. Discretion</div>
              <h4 className="text-base font-bold font-['Manrope'] text-slate-900">Absolute Confidentiality</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Client identities, financial valuations, and family arrangements are protected under strict legal protocols.
              </p>
            </div>

            <div className="p-5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-2">
              <div className="text-[#C6A76A] font-bold font-mono text-xs">02. Integrity</div>
              <h4 className="text-base font-bold font-['Manrope'] text-slate-900">Unbiased Due Diligence</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We provide candid assessments of structural liabilities, historic preservation constraints, and true liquidity.
              </p>
            </div>

            <div className="p-5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-2">
              <div className="text-[#C6A76A] font-bold font-mono text-xs">03. Curation</div>
              <h4 className="text-base font-bold font-['Manrope'] text-slate-900">Architectural Pedigree</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We represent only residential and commercial assets defined by exceptional design, materials, and locations.
              </p>
            </div>

            <div className="p-5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-2">
              <div className="text-[#C6A76A] font-bold font-mono text-xs">04. Reach</div>
              <h4 className="text-base font-bold font-['Manrope'] text-slate-900">Global Integration</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamless multi-city coordination across New York, London, Côte d’Azur, Dubai, and Tokyo.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership & Advisory Team */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
              Leadership & Partners
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
              Senior Advisory Directors
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Experienced practitioners combining local market heritage with global capital relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((leader, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={leader.avatar}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="text-[11px] font-semibold text-[#B8934A] uppercase tracking-wider">
                    {leader.office}
                  </div>
                  <h4 className="text-base font-bold font-['Manrope'] text-slate-900">
                    {leader.name}
                  </h4>
                  <div className="text-xs font-medium text-slate-500">
                    {leader.title}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Disclosures & CTA */}
        <div className="p-8 bg-[#0B132B] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-[#C6A76A] text-xs uppercase tracking-widest font-semibold">
              Ready to Engage?
            </div>
            <h3 className="text-xl font-bold font-['Manrope']">
              Schedule a Private Consultation with Our Senior Partners
            </h3>
            <p className="text-xs text-slate-400">
              Discreet meetings conducted in our offices or at your preferred location.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('/contact')}
              className="py-2.5 px-5 bg-[#C6A76A] hover:bg-[#B8934A] text-[#0B132B] text-xs font-bold rounded-lg transition-colors"
            >
              Contact Private Desk
            </button>
            <button
              onClick={() => onNavigate('/properties')}
              className="py-2.5 px-5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20"
            >
              Browse Properties
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
