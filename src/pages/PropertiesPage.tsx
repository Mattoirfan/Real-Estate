import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  RotateCcw, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Filter,
  X
} from 'lucide-react';
import { Property, User, PropertyType, TransactionType } from '../types';
import { api } from '../services/api';
import { PropertyCard } from '../components/property/PropertyCard';

interface PropertiesPageProps {
  onNavigate: (path: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenEnquiry: (property?: Property) => void;
  searchQueryString?: string;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenEnquiry,
  searchQueryString = ''
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [bathrooms, setBathrooms] = useState<string>('all');
  const [minArea, setMinArea] = useState<string>('');
  const [maxArea, setMaxArea] = useState<string>('');
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc' | 'area_desc'>('newest');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const AMENITY_OPTIONS = [
    'Pool',
    'Wine Cellar',
    'Spa',
    'Elevator',
    'Gym',
    'Screening Room',
    'Mooring',
    'Ski-in / Ski-out',
    'Smart Home'
  ];

  // Initialize from search URL query params on mount or when searchQueryString changes
  useEffect(() => {
    const params = new URLSearchParams(searchQueryString || window.location.search);
    if (params.get('search')) setSearch(params.get('search')!);
    if (params.get('type')) setTransactionType(params.get('type')!);
    if (params.get('property_type')) setPropertyType(params.get('property_type')!);
    if (params.get('location')) setLocation(params.get('location')!);
    if (params.get('minPrice')) setMinPrice(params.get('minPrice')!);
    if (params.get('maxPrice')) setMaxPrice(params.get('maxPrice')!);
    if (params.get('bedrooms')) setBedrooms(params.get('bedrooms')!);
    if (params.get('bathrooms')) setBathrooms(params.get('bathrooms')!);
    if (params.get('sort')) setSort(params.get('sort') as any);
  }, [searchQueryString]);

  // Fetch properties whenever filters or page changes
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProperties({
        search: search.trim() || undefined,
        transaction_type: transactionType !== 'all' ? transactionType : undefined,
        property_type: propertyType !== 'all' ? propertyType : undefined,
        location: location !== 'all' ? location : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        bedrooms: bedrooms !== 'all' ? parseInt(bedrooms, 10) : undefined,
        bathrooms: bathrooms !== 'all' ? parseInt(bathrooms, 10) : undefined,
        minArea: minArea ? parseFloat(minArea) : undefined,
        maxArea: maxArea ? parseFloat(maxArea) : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        sort,
        page,
        limit: 9
      });

      setProperties(res.properties);
      setTotal(res.total);
      setTotalPages(res.totalPages);

      // Sync URL query params for shareability without hard reload
      const q = new URLSearchParams();
      if (search.trim()) q.set('search', search.trim());
      if (transactionType !== 'all') q.set('type', transactionType);
      if (propertyType !== 'all') q.set('property_type', propertyType);
      if (location !== 'all') q.set('location', location);
      if (minPrice) q.set('minPrice', minPrice);
      if (maxPrice) q.set('maxPrice', maxPrice);
      if (bedrooms !== 'all') q.set('bedrooms', bedrooms);
      if (sort !== 'newest') q.set('sort', sort);

      const newUrl = q.toString() ? `/properties?${q.toString()}` : '/properties';
      window.history.replaceState(null, '', newUrl);

    } catch (err: any) {
      setError(err.message || 'Failed to query property listings');
    } finally {
      setLoading(false);
    }
  }, [search, transactionType, propertyType, location, minPrice, maxPrice, bedrooms, bathrooms, minArea, maxArea, selectedAmenities, sort, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleClearAll = () => {
    setSearch('');
    setTransactionType('all');
    setPropertyType('all');
    setLocation('all');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('all');
    setBathrooms('all');
    setMinArea('');
    setMaxArea('');
    setSelectedAmenities([]);
    setSort('newest');
    setPage(1);
  };

  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
    setPage(1);
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

  const hasActiveFilters = 
    search || 
    transactionType !== 'all' || 
    propertyType !== 'all' || 
    location !== 'all' || 
    minPrice || 
    maxPrice || 
    bedrooms !== 'all' || 
    bathrooms !== 'all' || 
    selectedAmenities.length > 0;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8934A]">
                The Collection
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] text-slate-900 mt-1">
                Prime Property Discovery
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl">
                Explore verified residential estates, skyline penthouses, and prime commercial freeholds with live parameters.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 tabular-nums">
                Showing <strong>{properties.length}</strong> of <strong>{total}</strong> residences
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search city, address, title, or architectural feature..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Location Select */}
            <div className="md:col-span-2">
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
              >
                <option value="all">All Locations</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Antibes">Cap d’Antibes</option>
                <option value="Dubai">Dubai</option>
                <option value="Tokyo">Tokyo</option>
                <option value="Aspen">Aspen</option>
              </select>
            </div>

            {/* Transaction Type */}
            <div className="md:col-span-2">
              <select
                value={transactionType}
                onChange={(e) => { setTransactionType(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
              >
                <option value="all">All Transactions</option>
                <option value="sale">For Acquisition (Sale)</option>
                <option value="rent">Luxury Rental</option>
                <option value="lease">Commercial Lease</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="md:col-span-2">
              <select
                value={propertyType}
                onChange={(e) => { setPropertyType(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
              >
                <option value="all">All Archetypes</option>
                <option value="villa">Villas</option>
                <option value="penthouse">Penthouses</option>
                <option value="apartment">Apartments</option>
                <option value="house">Townhouses</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Filter Toggle Mobile/Desktop */}
            <div className="md:col-span-1">
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className={`w-full h-full py-2.5 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                  filterDrawerOpen || hasActiveFilters
                    ? 'bg-[#0B132B] text-white border-[#0B132B]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Expanded Secondary Filters Drawer */}
          {filterDrawerOpen && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in text-xs">
              
              {/* Price Range */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Price Range (USD)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#C6A76A]"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#C6A76A]"
                  />
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Bedrooms & Bathrooms</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={bedrooms}
                    onChange={(e) => { setBedrooms(e.target.value); setPage(1); }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="all">Any Beds</option>
                    <option value="2">2+ Beds</option>
                    <option value="3">3+ Beds</option>
                    <option value="4">4+ Beds</option>
                    <option value="5">5+ Beds</option>
                    <option value="6">6+ Beds</option>
                  </select>

                  <select
                    value={bathrooms}
                    onChange={(e) => { setBathrooms(e.target.value); setPage(1); }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="all">Any Baths</option>
                    <option value="2">2+ Baths</option>
                    <option value="3">3+ Baths</option>
                    <option value="4">4+ Baths</option>
                    <option value="5">5+ Baths</option>
                  </select>
                </div>
              </div>

              {/* Area Range */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Floor Area (Sq Ft)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min sqft"
                    value={minArea}
                    onChange={(e) => { setMinArea(e.target.value); setPage(1); }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="number"
                    placeholder="Max sqft"
                    value={maxArea}
                    onChange={(e) => { setMaxArea(e.target.value); setPage(1); }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>

              {/* Amenity Pills Selection */}
              <div className="sm:col-span-2 lg:col-span-4 pt-2">
                <label className="block font-semibold text-slate-700 mb-2">Amenities & Architectural Features:</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const active = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity)}
                        className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
                          active
                            ? 'bg-[#0B132B] text-white border-[#0B132B]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Summary Strip & View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as any); setPage(1); }}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Largest Area</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              )}

              {/* Segmented View Mode Control (Allowed per §1.A for functional filter toggles) */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Listings Section */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : 'space-y-6'}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-200/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center bg-white rounded-xl border border-red-200 space-y-4">
            <div className="text-red-600 font-semibold text-sm">{error}</div>
            <button
              onClick={() => fetchProperties()}
              className="px-4 py-2 bg-[#0B132B] text-white text-xs font-semibold rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Manrope'] text-slate-900">
              No Residences Matched Your Criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We couldn’t find properties matching the exact combination of filters. Try clearing your filters or contact our private desk for off-market whispers.
            </p>
            <div className="pt-2">
              <button
                onClick={handleClearAll}
                className="px-5 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                variant={viewMode}
                onViewDetails={(slug) => onNavigate(`/properties/${slug}`)}
                onToggleFavorite={handleToggleFavorite}
                isFavorited={currentUser?.saved_property_ids?.includes(property.id)}
                currentUser={currentUser}
                onQuickInquire={(p) => onOpenEnquiry(p)}
              />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="py-2 px-4 bg-white border border-slate-200 text-slate-700 disabled:opacity-40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-500 font-medium">
              Page <strong className="text-slate-900 tabular-nums">{page}</strong> of <strong className="text-slate-900 tabular-nums">{totalPages}</strong>
            </span>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="py-2 px-4 bg-white border border-slate-200 text-slate-700 disabled:opacity-40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors hover:bg-slate-50"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
