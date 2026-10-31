import React, { useState } from 'react';
import { Bookmark, MapPin, Bed, Bath, Maximize2, ArrowUpRight, Check } from 'lucide-react';
import { Property, User } from '../../types';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (slug: string) => void;
  onToggleFavorite: (propertyId: string) => void;
  isFavorited?: boolean;
  currentUser?: User | null;
  onQuickInquire?: (property: Property) => void;
  variant?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  onToggleFavorite,
  isFavorited = false,
  currentUser,
  onQuickInquire,
  variant = 'grid'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: property.currency || 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const fallbackImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80';

  if (variant === 'list') {
    return (
      <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row">
        {/* Media */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden bg-slate-100">
          <img
            src={imageError ? fallbackImage : (property.image_urls[0] || fallbackImage)}
            alt={property.title}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle Top Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#0B132B]/85 text-white backdrop-blur-xs rounded-sm">
              {property.transaction_type === 'rent' ? 'For Rent' : property.transaction_type === 'lease' ? 'For Lease' : 'For Sale'}
            </span>
            {property.featured_status && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#C6A76A] text-[#0B132B] rounded-sm">
                Featured
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors ${
              isFavorited 
                ? 'bg-[#C6A76A] text-[#0B132B]' 
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            aria-label={isFavorited ? 'Remove favorite' : 'Save favorite'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Info */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs uppercase tracking-widest text-[#B8934A] font-semibold">
                {property.property_type} · {property.city}
              </span>
              <div className="text-xl font-bold font-['Manrope'] text-slate-900">
                {formattedPrice}
                {property.transaction_type === 'rent' && (
                  <span className="text-xs font-normal text-slate-500"> / mo</span>
                )}
              </div>
            </div>

            <h3 
              onClick={() => onViewDetails(property.slug)}
              className="text-lg font-bold font-['Manrope'] text-slate-900 group-hover:text-[#B8934A] transition-colors cursor-pointer line-clamp-1 mb-1.5"
            >
              {property.title}
            </h3>

            <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{property.address}, {property.city}, {property.country}</span>
            </p>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {property.description}
            </p>
          </div>

          {/* Unboxed Metadata & Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4 text-slate-400" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {property.bedrooms > 0 && <span aria-hidden="true" className="text-slate-300">·</span>}
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4 text-slate-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <span className="tabular-nums">{property.area.toLocaleString()} {property.area_unit}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onQuickInquire && (
                <button
                  onClick={() => onQuickInquire(property)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Quick Inquire
                </button>
              )}
              <button
                onClick={() => onViewDetails(property.slug)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0B132B] hover:bg-[#1C2541] rounded-lg transition-colors flex items-center gap-1"
              >
                <span>View Details</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C6A76A]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid View
  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
      {/* Top Image Carrier */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={imageError ? fallbackImage : (property.image_urls[0] || fallbackImage)}
          alt={property.title}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#0B132B]/85 text-white backdrop-blur-xs rounded-sm">
            {property.transaction_type === 'rent' ? 'For Rent' : property.transaction_type === 'lease' ? 'For Lease' : 'For Sale'}
          </span>
          {property.featured_status && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#C6A76A] text-[#0B132B] font-semibold rounded-sm">
              Curated
            </span>
          )}
        </div>

        {/* Bookmark Favorite Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors ${
            isFavorited 
              ? 'bg-[#C6A76A] text-[#0B132B] shadow-md' 
              : 'bg-black/35 text-white hover:bg-black/60'
          }`}
          aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {/* Bottom Price on Image for Editorial Punch */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
          <div className="text-xl font-bold font-['Manrope'] drop-shadow-sm">
            {formattedPrice}
            {property.transaction_type === 'rent' && (
              <span className="text-xs font-normal text-slate-200"> /mo</span>
            )}
          </div>
          <span className="text-[11px] uppercase tracking-wider text-slate-200 capitalize font-medium drop-shadow-xs">
            {property.property_type}
          </span>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onViewDetails(property.slug)}
            className="text-base font-bold font-['Manrope'] text-slate-900 group-hover:text-[#B8934A] transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.city}, {property.country}</span>
          </p>

          {/* Zero-Pill Unboxed Metadata with Typographic Dots */}
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
            {property.bedrooms > 0 && (
              <span>{property.bedrooms} Beds</span>
            )}
            {property.bedrooms > 0 && <span aria-hidden="true" className="text-slate-300">·</span>}
            <span>{property.bathrooms} Baths</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums">{property.area.toLocaleString()} {property.area_unit}</span>
          </div>
        </div>

        {/* Card Footer: Agent snippet & View button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200"
            />
            <span className="text-[11px] text-slate-500 truncate">
              {property.agent.name}
            </span>
          </div>

          <button
            onClick={() => onViewDetails(property.slug)}
            className="py-1.5 px-3 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shrink-0"
          >
            <span>Explore</span>
            <ArrowUpRight className="w-3 h-3 text-[#C6A76A]" />
          </button>
        </div>
      </div>
    </div>
  );
};
