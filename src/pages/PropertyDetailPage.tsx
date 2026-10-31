import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Car, 
  ShieldCheck, 
  Share2, 
  Bookmark, 
  Send, 
  Phone, 
  Mail, 
  MessageCircle, 
  Check, 
  Compass, 
  FileText, 
  ChevronLeft, 
  ArrowUpRight,
  Sparkles,
  Lock,
  Layers,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Property, User } from '../types';
import { api } from '../services/api';
import { PropertyCard } from '../components/property/PropertyCard';
import { LightboxModal } from '../components/modals/LightboxModal';
import { ShareModal } from '../components/modals/ShareModal';

interface PropertyDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenEnquiry: (property: Property) => void;
  onOpenViewing: (property: Property) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  slug,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenEnquiry,
  onOpenViewing
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery & Modals
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Direct Contact Revealed state (Membership entitlement)
  const isDirectContactUnlocked = currentUser?.entitlements?.direct_agent_contact ?? false;

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getPropertyBySlug(slug);
        setProperty(res.property);
        setSimilarProperties(res.similar || []);
      } catch (err: any) {
        setError('This property residence could not be found or has been retired.');
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleToggleFavorite = async () => {
    if (!property) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const res = await api.toggleFavorite(property.id);
    if (!res.success && res.error) {
      alert(res.error);
    }
  };

  const handleDownloadBrochure = () => {
    alert(`Generating official PDF brochure prospectus for ${property?.title}... Download starting.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-32 pb-20 max-w-7xl mx-auto px-4">
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse mb-8" />
        <div className="h-8 bg-slate-200 rounded max-w-md animate-pulse mb-4" />
        <div className="h-4 bg-slate-200 rounded max-w-xs animate-pulse" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-36 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-['Manrope'] text-slate-900">
            Residence Not Found
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error || 'The requested property could not be located in our private catalog.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/properties')}
              className="px-5 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg"
            >
              Return to All Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFavorited = currentUser?.saved_property_ids?.includes(property.id);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: property.currency || 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-24">
      
      {/* Breadcrumb & Navigation Topbar */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => onNavigate('/properties')}
            className="flex items-center gap-1 hover:text-slate-900 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Properties</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C6A76A]" />
              <span>Share</span>
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                isFavorited
                  ? 'bg-[#C6A76A] text-[#0B132B] border-[#C6A76A] font-semibold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Gallery Showcase */}
        <div className="space-y-3 mb-8">
          {/* Main Large Photograph */}
          <div 
            onClick={() => setLightboxOpen(true)}
            className="relative aspect-16/9 md:aspect-21/9 rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-lg"
          >
            <img
              src={property.image_urls[activeImageIndex] || property.image_urls[0]}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#C6A76A]" />
              <span>View Lightbox ({property.image_urls.length} Photographs)</span>
            </div>

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-[#0B132B]/90 text-white backdrop-blur-xs rounded-sm">
                {property.transaction_type === 'rent' ? 'Luxury Lease' : property.transaction_type === 'lease' ? 'Commercial Freehold' : 'For Acquisition'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-sm">
                Sample Demo Listing
              </span>
            </div>
          </div>

          {/* Thumbnails Strip */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {property.image_urls.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx 
                    ? 'border-[#C6A76A] ring-1 ring-[#C6A76A]' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Property Header & Title Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#B8934A]">
              <span>{property.property_type}</span>
              <span>·</span>
              <span>{property.city}, {property.country}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Manrope'] text-slate-900 leading-tight">
              {property.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C6A76A] shrink-0" />
              <span>{property.address}, {property.city}, {property.region}, {property.country}</span>
            </p>

            {/* Key Fact Strip (Zero-Pill Typography) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-xs mt-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bedrooms</span>
                <div className="text-lg font-bold font-['Manrope'] text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Bed className="w-4 h-4 text-[#C6A76A]" />
                  <span>{property.bedrooms > 0 ? property.bedrooms : 'Commercial'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bathrooms</span>
                <div className="text-lg font-bold font-['Manrope'] text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Bath className="w-4 h-4 text-[#C6A76A]" />
                  <span>{property.bathrooms}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Interior Area</span>
                <div className="text-lg font-bold font-['Manrope'] text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Maximize2 className="w-4 h-4 text-[#C6A76A]" />
                  <span className="tabular-nums">{property.area.toLocaleString()} {property.area_unit}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Completed</span>
                <div className="text-lg font-bold font-['Manrope'] text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-[#C6A76A]" />
                  <span>{property.year_built}</span>
                </div>
              </div>
            </div>

            {/* Architectural Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3">
                Architectural Narrative
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities & Structural Specifications */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3">
                Features & Specifications
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 p-2 bg-[#FAFAF8] rounded-lg">
                    <Check className="w-4 h-4 text-[#C6A76A] shrink-0" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Covered Parking:</span>
                  <span className="font-semibold text-slate-800">{property.parking_spaces} Vehicles</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Climate Systems:</span>
                  <span className="font-semibold text-slate-800">{property.heating_cooling || 'Central HVAC'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Annual Real Property Tax:</span>
                  <span className="font-semibold text-slate-800">${property.tax_annual?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Floor Plan & Brochure Action */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold font-['Manrope'] text-slate-900">
                  Architectural Plans & Detailed Prospectus
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Download high-resolution CAD schematics and certified boundary survey PDF.
                </p>
              </div>
              <button
                onClick={handleDownloadBrochure}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shrink-0"
              >
                <FileText className="w-4 h-4 text-[#C6A76A]" />
                <span>Download Prospectus</span>
              </button>
            </div>

            {/* Neighborhood & Location Highlights */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Location & Environs</span>
                <span className="text-xs font-normal text-slate-500 font-mono">
                  {property.latitude.toFixed(4)}° N, {property.longitude.toFixed(4)}° W
                </span>
              </h2>

              <div className="h-64 rounded-xl overflow-hidden relative bg-slate-900 flex items-center justify-center text-center p-6 text-white">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                  alt="Area Map"
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
                <div className="relative z-10 space-y-2 max-w-sm">
                  <MapPin className="w-8 h-8 text-[#C6A76A] mx-auto" />
                  <div className="font-bold font-['Manrope'] text-base">{property.city}, {property.country}</div>
                  <div className="text-xs text-slate-300">
                    Precision GPS map integration configured. Accompanied viewings depart from our regional advisory suite.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Pricing & Action Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Price & Primary Action Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Offered Price
                </span>
                <div className="text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
                  {formattedPrice}
                  {property.transaction_type === 'rent' && (
                    <span className="text-sm font-normal text-slate-500"> / month</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Exclusively represented by EstateNova Private Residences.
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => onOpenViewing(property)}
                  className="w-full py-3 px-4 bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 border border-transparent hover:border-[#C6A76A]"
                >
                  <Calendar className="w-4 h-4 text-[#C6A76A]" />
                  <span>Schedule Accompanied Viewing</span>
                </button>

                <button
                  onClick={() => onOpenEnquiry(property)}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-slate-600" />
                  <span>Submit Confidential Inquiry</span>
                </button>
              </div>

              {/* Membership Privilege Highlight */}
              <div className="p-4 bg-[#F8F7F3] rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#B8934A] font-bold uppercase tracking-wider text-[10px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Membership Privileges</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Plus & Premium members receive direct managing broker mobile contact and unlisted off-market dossier history.
                </p>
                {!isDirectContactUnlocked && (
                  <button
                    onClick={() => onNavigate('/services')}
                    className="text-[#0B132B] font-semibold underline underline-offset-2 hover:text-[#B8934A]"
                  >
                    Upgrade Membership to Unlock Broker Cell
                  </button>
                )}
              </div>
            </div>

            {/* Designated Managing Broker Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Designated Managing Broker
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold font-['Manrope'] text-slate-900">
                    {property.agent.name}
                  </h4>
                  <div className="text-xs text-slate-500">{property.agent.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Languages: {property.agent.languages.join(', ')}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {property.agent.bio}
              </p>

              {/* Protected / Revealed Contact Details */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                {isDirectContactUnlocked ? (
                  <div className="space-y-1.5 text-xs text-slate-800">
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                      <Phone className="w-3.5 h-3.5 text-[#C6A76A]" />
                      <a href={`tel:${property.agent.phone}`} className="font-mono hover:underline">
                        {property.agent.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                      <Mail className="w-3.5 h-3.5 text-[#C6A76A]" />
                      <a href={`mailto:${property.agent.email}`} className="hover:underline">
                        {property.agent.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-md">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <a 
                        href={`https://wa.me/${property.agent.whatsapp}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="font-medium hover:underline"
                      >
                        Direct WhatsApp Chat
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-2">
                    <div className="flex items-center justify-center gap-1 text-slate-500 text-xs">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Direct broker telephone protected</span>
                    </div>
                    <button
                      onClick={() => onNavigate('/services')}
                      className="px-3 py-1.5 bg-[#0B132B] text-white text-[11px] font-semibold rounded-md hover:bg-slate-800"
                    >
                      Unlock with Plus Plan ($149)
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Similar Residences Section */}
        {similarProperties.length > 0 && (
          <div className="border-t border-slate-200 pt-16">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
                Related Residences
              </span>
              <h2 className="text-2xl font-bold font-['Manrope'] text-slate-900 mt-1">
                Similar Architectural Opportunities
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map((sim) => (
                <PropertyCard
                  key={sim.id}
                  property={sim}
                  onViewDetails={(s) => onNavigate(`/properties/${s}`)}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorited={currentUser?.saved_property_ids?.includes(sim.id)}
                  currentUser={currentUser}
                  onQuickInquire={(p) => onOpenEnquiry(p)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={property.image_urls}
        currentIndex={activeImageIndex}
        onSelectIndex={setActiveImageIndex}
        title={property.title}
      />

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        property={property}
      />

    </div>
  );
};
