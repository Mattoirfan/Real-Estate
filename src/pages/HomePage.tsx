import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Building2, 
  Key, 
  ChevronRight, 
  Check, 
  HelpCircle,
  Eye,
  Award,
  Globe2,
  Lock
} from 'lucide-react';
import { Property, MembershipPlan, BlogPost, User } from '../types';
import { api } from '../services/api';
import { PropertyCard } from '../components/property/PropertyCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenCheckout: (plan: MembershipPlan) => void;
  onOpenEnquiry: (property?: Property) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenCheckout,
  onOpenEnquiry
}) => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Search Bar States
  const [searchLocation, setSearchLocation] = useState('all');
  const [searchTransaction, setSearchTransaction] = useState('all');
  const [searchPropertyType, setSearchPropertyType] = useState('all');
  const [searchMaxPrice, setSearchMaxPrice] = useState<string>('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [propsRes, plansRes, blogRes] = await Promise.all([
          api.getProperties({ featured: true, limit: 6 }),
          api.getPlans(),
          api.getBlogPosts()
        ]);
        setFeaturedProperties(propsRes.properties);
        setPlans(plansRes);
        setArticles(blogRes.slice(0, 3));
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchLocation !== 'all') query.set('location', searchLocation);
    if (searchTransaction !== 'all') query.set('type', searchTransaction);
    if (searchPropertyType !== 'all') query.set('property_type', searchPropertyType);
    if (searchMaxPrice) query.set('maxPrice', searchMaxPrice);

    onNavigate(`/properties?${query.toString()}`);
  };

  const handleToggleFavorite = async (propertyId: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const res = await api.toggleFavorite(propertyId);
    if (!res.success && res.error) {
      alert(res.error);
    }
  };

  const faqs = [
    {
      q: 'How does EstateNova curate its private property collection?',
      a: 'Every residence represented on EstateNova undergoes comprehensive due diligence by our managing directors, evaluating structural architectural pedigree, title deed veracity, historical provenance, and investment yields.'
    },
    {
      q: 'What is the distinction between One-Time and Monthly Membership Plans?',
      a: 'The Starter ($99) and Plus ($149) plans are single one-time payments providing lifetime discovery and buyer communication perks without recurring charges. The Premium ($199/mo) and Elite ($499/mo) tiers are recurring monthly subscriptions designed for active acquirers requiring continuous off-market whispers, WhatsApp concierge access, and dedicated managing brokers.'
    },
    {
      q: 'Can I arrange confidential chauffeured or virtual viewings?',
      a: 'Yes. Plus, Premium, and Elite members enjoy accompanied in-person showings coordinated by our senior advisors, complete with discreet security protocol and 4K interactive digital walkthroughs.'
    },
    {
      q: 'How are client privacy and financial disclosures guarded?',
      a: 'All transactions and consultations are conducted under strict non-disclosure covenants (NDAs). Customer information is never syndicated to third-party ad networks or public portals.'
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-[#0B132B] text-white pt-28 pb-20 overflow-hidden">
        {/* Background Visual Asset */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            alt="EstateNova Luxury Residence"
            className="w-full h-full object-cover opacity-40 scale-105 animate-fade-in"
          />
          {/* Measured Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/60 to-[#0B132B]/80" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[#C6A76A] text-xs font-semibold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A76A]" />
            <span>Curated International Real Estate</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Manrope'] text-white text-balance leading-[1.08] mb-6">
            Find a Place <br className="hidden sm:inline" />
            <span className="text-[#C6A76A]">That Moves You.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10 text-balance">
            Discover bespoke architectural estates, skyline penthouses, and prime commercial acquisitions across the world’s most coveted capitals.
          </p>

          {/* Prominent Multi-Parameter Search Bar */}
          <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/40 max-w-4xl mx-auto text-left text-slate-900">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Location */}
              <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C6A76A]" />
                  <span>Location</span>
                </label>
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">All Prime Capitals</option>
                  <option value="New York">New York, USA</option>
                  <option value="Los Angeles">Los Angeles, USA</option>
                  <option value="London">London, UK</option>
                  <option value="Antibes">Cap d’Antibes, France</option>
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="Tokyo">Tokyo, Japan</option>
                  <option value="Aspen">Aspen, USA</option>
                </select>
              </div>

              {/* Transaction Type */}
              <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3 text-[#C6A76A]" />
                  <span>Transaction</span>
                </label>
                <select
                  value={searchTransaction}
                  onChange={(e) => setSearchTransaction(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">Sale & Luxury Lease</option>
                  <option value="sale">For Acquisition (Sale)</option>
                  <option value="rent">Luxury Rental</option>
                  <option value="lease">Commercial Lease</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#C6A76A]" />
                  <span>Property Type</span>
                </label>
                <select
                  value={searchPropertyType}
                  onChange={(e) => setSearchPropertyType(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">All Architectural Types</option>
                  <option value="villa">Villas & Mansions</option>
                  <option value="penthouse">Skyline Penthouses</option>
                  <option value="apartment">Luxury Apartments</option>
                  <option value="house">Townhouses & Estates</option>
                  <option value="commercial">Commercial Flagships</option>
                </select>
              </div>

              {/* Price & Submit Action */}
              <div className="flex items-center gap-2">
                <div className="p-2 sm:p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#C6A76A]" />
                    <span>Max Price</span>
                  </label>
                  <input
                    type="number"
                    step="50000"
                    placeholder="Any Budget"
                    value={searchMaxPrice}
                    onChange={(e) => setSearchMaxPrice(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="h-full px-5 py-3 bg-[#0B132B] hover:bg-[#1C2541] text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-md hover:border-[#C6A76A] border border-transparent"
                  aria-label="Search listings"
                >
                  <Search className="w-4 h-4 text-[#C6A76A]" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Filter Direct Links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Popular:</span>
            <button 
              onClick={() => onNavigate('/properties?property_type=penthouse')} 
              className="text-white hover:text-[#C6A76A] underline underline-offset-4 transition-colors"
            >
              Manhattan Penthouses
            </button>
            <span>·</span>
            <button 
              onClick={() => onNavigate('/properties?location=Los Angeles')} 
              className="text-white hover:text-[#C6A76A] underline underline-offset-4 transition-colors"
            >
              Bel Air Villas
            </button>
            <span>·</span>
            <button 
              onClick={() => onNavigate('/properties?location=London')} 
              className="text-white hover:text-[#C6A76A] underline underline-offset-4 transition-colors"
            >
              Mayfair Townhouses
            </button>
            <span>·</span>
            <button 
              onClick={() => onNavigate('/properties?type=rent')} 
              className="text-white hover:text-[#C6A76A] underline underline-offset-4 transition-colors"
            >
              Executive Rentals
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROOF STRIP (Quantifiable Adjacency) */}
      <section className="bg-white border-y border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-slate-900 tabular-nums">
                $1.8B+
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                Portfolio Transacted
              </div>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-slate-900 tabular-nums">
                450+
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                Private Residences
              </div>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-slate-900 tabular-nums">
                98.4%
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                Client Discretion Rate
              </div>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-slate-900 tabular-nums">
                14
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                Key Global Metros
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CURATED PROPERTIES */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
                Hand-Selected Portfolio
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
                Featured Private Residences
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl">
                Exemplary residential properties offering world-class architectural pedigree, rare privacy, and panoramic viewpoints.
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button
                onClick={() => onNavigate('/properties')}
                className="py-2.5 px-5 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0"
              >
                <span>View All Properties ({featuredProperties.length}+)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6A76A]" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 bg-slate-200/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.slice(0, 6).map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onViewDetails={(slug) => onNavigate(`/properties/${slug}`)}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorited={currentUser?.saved_property_ids?.includes(property.id)}
                  currentUser={currentUser}
                  onQuickInquire={(p) => onOpenEnquiry(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. ARCHITECTURAL CATEGORIES (Asymmetric Grid) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
              Architectural Archetypes
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
              Properties of Distinction
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Explore residences categorized by distinct lifestyle archetypes and living environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Category 1: Villas */}
            <div 
              onClick={() => onNavigate('/properties?property_type=villa')}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80"
                alt="Mediterranean Villas"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-semibold text-[#C6A76A] uppercase tracking-widest">Coastal & Alpine</span>
                <h3 className="text-xl font-bold font-['Manrope'] mt-0.5 group-hover:text-[#C6A76A] transition-colors">
                  Villas & Private Mansions
                </h3>
                <p className="text-xs text-slate-300 mt-1">Expansive grounds, private docks, and gated perimeter security.</p>
              </div>
            </div>

            {/* Category 2: Penthouses */}
            <div 
              onClick={() => onNavigate('/properties?property_type=penthouse')}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
                alt="Skyline Penthouses"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-semibold text-[#C6A76A] uppercase tracking-widest">Metro Landmarks</span>
                <h3 className="text-xl font-bold font-['Manrope'] mt-0.5 group-hover:text-[#C6A76A] transition-colors">
                  Skyline Penthouses
                </h3>
                <p className="text-xs text-slate-300 mt-1">Duplex sky terraces, bespoke elevators, and 360-degree vistas.</p>
              </div>
            </div>

            {/* Category 3: Townhouses */}
            <div 
              onClick={() => onNavigate('/properties?property_type=house')}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="Historic Townhouses"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-semibold text-[#C6A76A] uppercase tracking-widest">Heritage Architecture</span>
                <h3 className="text-xl font-bold font-['Manrope'] mt-0.5 group-hover:text-[#C6A76A] transition-colors">
                  Heritage Townhouses
                </h3>
                <p className="text-xs text-slate-300 mt-1">Listed Edwardian & brownstone residences with restored artisan masonry.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE ESTATENOVA (Clean Editorial Chapter List) */}
      <section className="py-20 bg-[#0B132B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C6A76A]">
                The EstateNova Standard
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] leading-tight">
                Bespoke Discretion.<br />
                Institutional Rigor.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We represent discerning private collectors, family offices, and sovereign investors seeking discreet representation in super-prime residential and commercial real estate.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/about')}
                  className="py-2.5 px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Explore Our Advisory History</span>
                  <ArrowRight className="w-4 h-4 text-[#C6A76A]" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-3">
                <div className="text-xs font-bold font-mono text-[#C6A76A]">01.</div>
                <h3 className="text-lg font-bold font-['Manrope'] text-white">Off-Market Whispers</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Over 40% of our premier transactions occur off-market. Privileged access to private portfolios not indexed by public portals.
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-3">
                <div className="text-xs font-bold font-mono text-[#C6A76A]">02.</div>
                <h3 className="text-lg font-bold font-['Manrope'] text-white">Forensic Due Diligence</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every property is audited for structural pedigree, title boundary accuracy, environmental metrics, and submarket valuation models.
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-3">
                <div className="text-xs font-bold font-mono text-[#C6A76A]">03.</div>
                <h3 className="text-lg font-bold font-['Manrope'] text-white">Accompanied Concierge</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Private viewings with assigned managing partners, chauffeured arrivals, and comprehensive structural briefing packages.
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-3">
                <div className="text-xs font-bold font-mono text-[#C6A76A]">04.</div>
                <h3 className="text-lg font-bold font-['Manrope'] text-white">Cross-Border Legal Structuring</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Guidance on currency escrow mechanisms, holding trust frameworks, and international property taxation standards.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. DISCOVERY JOURNEY (Visual Explanation) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
              Acquisition Process
            </span>
            <h2 className="text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
              The Journey to Key Handover
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              A structured, transparent four-step trajectory engineered for peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            <div className="relative p-6 bg-[#FAFAF8] rounded-xl border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#0B132B] text-[#C6A76A] flex items-center justify-center font-bold font-mono mx-auto text-sm">
                1
              </div>
              <h3 className="text-base font-bold font-['Manrope'] text-slate-900">Curated Shortlist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consult with your assigned managing director to filter criteria and unlock tailored confidential dossiers.
              </p>
            </div>

            <div className="relative p-6 bg-[#FAFAF8] rounded-xl border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#0B132B] text-[#C6A76A] flex items-center justify-center font-bold font-mono mx-auto text-sm">
                2
              </div>
              <h3 className="text-base font-bold font-['Manrope'] text-slate-900">Accompanied Tour</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Experience the residence in person or via private live 4K stream with complete architectural and HOA review.
              </p>
            </div>

            <div className="relative p-6 bg-[#FAFAF8] rounded-xl border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#0B132B] text-[#C6A76A] flex items-center justify-center font-bold font-mono mx-auto text-sm">
                3
              </div>
              <h3 className="text-base font-bold font-['Manrope'] text-slate-900">Offer & Escrow</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bespoke deal negotiation and escrow legal coordination to protect financial terms and deposit structures.
              </p>
            </div>

            <div className="relative p-6 bg-[#FAFAF8] rounded-xl border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#0B132B] text-[#C6A76A] flex items-center justify-center font-bold font-mono mx-auto text-sm">
                4
              </div>
              <h3 className="text-base font-bold font-['Manrope'] text-slate-900">Key Handover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamless title registration, facility onboarding, smart-home passoff, and continued asset management support.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. MEMBERSHIP PREVIEW SECTION */}
      <section className="py-20 bg-[#F8F7F3] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
                Privilege Tiers
              </span>
              <h2 className="text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
                EstateNova Membership Plans
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Unlock higher favorite allowances, direct agent telephone contact, off-market preview alerts, and dedicated concierge advisory.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/services')}
              className="mt-4 md:mt-0 text-xs font-semibold text-[#0B132B] hover:text-[#B8934A] flex items-center gap-1.5 transition-colors"
            >
              <span>Compare All 4 Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isPopular = plan.is_popular;
              const isMonthly = plan.billing_interval === 'monthly';
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-xl p-6 border flex flex-col justify-between transition-all ${
                    isPopular 
                      ? 'border-[#C6A76A] shadow-xl relative' 
                      : 'border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C6A76A] text-[#0B132B] text-[10px] uppercase font-bold tracking-widest px-3 py-0.5 rounded-full shadow-xs">
                      Recommended
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {plan.name}
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-extrabold font-['Manrope'] text-slate-900">
                        ${plan.price}
                      </span>
                      <span className="text-xs text-slate-500">
                        {isMonthly ? '/mo' : ' one-time'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-4 min-h-[32px] leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="border-t border-slate-100 pt-3 space-y-2 mb-6">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-[#C6A76A] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!currentUser) onOpenAuth();
                      else onOpenCheckout(plan);
                    }}
                    className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      isPopular 
                        ? 'bg-[#0B132B] hover:bg-[#1C2541] text-white shadow-sm' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{currentUser?.membership.plan_id === plan.id ? 'Current Plan' : `Acquire ${plan.name}`}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C6A76A]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (Attributable Proof) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
              Client Endorsements
            </span>
            <h2 className="text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
              Enduring Relationships
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Demonstration testimonials reflecting typical acquisition feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                “EstateNova orchestrated the confidential acquisition of our Bel Air sanctuary with complete discretion. The architectural and structural appraisal was the most thorough our family office has experienced.”
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Arthur Sterling"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Arthur Sterling-Vane</div>
                  <div className="text-[11px] text-slate-500">Principal, Sterling Capital Trust</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                “As international buyers from Geneva, having Victoria and Alexander arrange accompanied private viewings and currency escrow ensured our Manhattan penthouse closed within 21 days.”
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Helena Moreau"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Helena Moreau</div>
                  <div className="text-[11px] text-slate-500">Private Collector, Geneva</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                “The Elite membership desk gives our advisory team direct access to verified unlisted inventory in London and the French Riviera. An essential tool for discerning acquirers.”
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Lord Charles Danforth"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Lord Charles Danforth</div>
                  <div className="text-[11px] text-slate-500">Danforth Asset Management</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. REAL ESTATE INSIGHTS PREVIEW */}
      <section className="py-20 bg-[#FAFAF8] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
                Editorial Briefing
              </span>
              <h2 className="text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
                Market Insights & Architecture
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/blog')}
              className="mt-4 md:mt-0 text-xs font-semibold text-[#0B132B] hover:text-[#B8934A] flex items-center gap-1.5 transition-colors"
            >
              <span>Read All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigate(`/blog/${art.slug}`)}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="aspect-16/9 overflow-hidden bg-slate-100">
                  <img
                    src={art.cover_image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-[#B8934A]">{art.category}</span>
                    <span>·</span>
                    <span>{art.read_time}</span>
                  </div>
                  <h3 className="text-base font-bold font-['Manrope'] text-slate-900 group-hover:text-[#B8934A] transition-colors line-clamp-2 mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
              Frequently Addressed
            </span>
            <h2 className="text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
              Client Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-90 text-[#C6A76A]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-[#FAFAF8]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL ADVISORY CALL TO ACTION */}
      <section className="py-20 bg-[#0B132B] text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#C6A76A]">
            Confidential Consultation
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Manrope'] tracking-tight">
            Ready to Discover Your Next Sanctuary?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Connect with our private managing directors for bespoke acquisition guidance or explore our membership tiers for off-market privileges.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/properties')}
              className="py-3 px-6 bg-[#C6A76A] hover:bg-[#B8934A] text-[#0B132B] font-bold text-xs rounded-lg transition-colors shadow-md"
            >
              Browse Prime Properties
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="py-3 px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Contact Private Desk
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
