import { Property, MembershipPlan, User, Enquiry, ViewingRequest, PaymentTransaction, BlogPost, SiteConfig } from '../types';

export const DEFAULT_PLANS: MembershipPlan[] = [
  {
    id: 'plan-starter',
    slug: 'starter',
    name: 'Starter',
    price: 99,
    currency: 'USD',
    billing_interval: 'one_time',
    description: 'Essential access for individual buyers and renters beginning their property journey.',
    is_popular: false,
    features: [
      'Full access to curated public listings',
      'Save up to 5 favorite properties',
      'Standard property inquiry submission',
      'Downloadable architectural brochure PDFs',
      'Weekly real estate market briefing'
    ],
    limits: {
      max_favorites: 5,
      direct_agent_contact: false,
      priority_alerts: false,
      virtual_tours_unlocked: false,
      vip_concierge: false,
      listing_credits: 0,
      advanced_market_data: false
    },
    renewal_terms: 'One-time payment with lifetime basic platform account privileges.',
    cancellation_policy: 'Non-recurring charge. 14-day refund window if no private advisory accessed.',
    eligibility: 'Open to all private individuals exploring luxury residential properties.'
  },
  {
    id: 'plan-plus',
    slug: 'plus',
    name: 'Plus',
    price: 149,
    currency: 'USD',
    billing_interval: 'one_time',
    tag: 'Popular for Buyers',
    description: 'Elevated discovery tools and direct agent communication for active buyers.',
    is_popular: true,
    features: [
      'All Starter features included',
      'Save up to 25 favorite properties with custom notes',
      'Direct agent phone & WhatsApp reveal',
      'Verified Member profile badge',
      'High-resolution floor plans & 3D tour access',
      'Early access to weekly new release catalog'
    ],
    limits: {
      max_favorites: 25,
      direct_agent_contact: true,
      priority_alerts: false,
      virtual_tours_unlocked: true,
      vip_concierge: false,
      listing_credits: 0,
      advanced_market_data: false
    },
    renewal_terms: 'One-time payment for permanent Plus benefits with zero monthly fees.',
    cancellation_policy: 'One-time fee. 14-day money-back guarantee prior to property enquiry.',
    eligibility: 'Ideal for prospective home buyers, international relocators, and second-home investors.'
  },
  {
    id: 'plan-premium',
    slug: 'premium',
    name: 'Premium',
    price: 199,
    currency: 'USD',
    billing_interval: 'monthly',
    tag: 'Most Flexible',
    description: 'Priority intelligence, off-market whispers, and expedited viewing concierge.',
    is_popular: false,
    features: [
      'All Plus features included',
      'Unlimited saved properties & price-drop alerts',
      'Priority 48-hour preview of off-market private residences',
      'Guaranteed next-day private viewing coordination',
      'Direct WhatsApp concierge desk (Mon–Sat)',
      'Submarket price valuation metrics & yield reports'
    ],
    limits: {
      max_favorites: 9999,
      direct_agent_contact: true,
      priority_alerts: true,
      virtual_tours_unlocked: true,
      vip_concierge: true,
      listing_credits: 1,
      advanced_market_data: true
    },
    renewal_terms: 'Billed monthly at $199. Renews automatically each month until canceled.',
    cancellation_policy: 'Cancel anytime in one click from your account dashboard. Active until period end.',
    eligibility: 'High-intent acquisitions, international investors, and selective renters.'
  },
  {
    id: 'plan-elite',
    slug: 'elite',
    name: 'Elite',
    price: 499,
    currency: 'USD',
    billing_interval: 'monthly',
    tag: 'Private Office',
    description: 'Unrestricted bespoke advisory, dedicated managing director, and promotional credits.',
    is_popular: false,
    features: [
      'All Premium features included',
      'Dedicated Senior Managing Broker assigned to your portfolio',
      '5 complimentary premium listing promotion credits',
      'Confidential off-market seller matching',
      'Legal due diligence & escrow preliminary review assistance',
      'Chauffeured private viewing arrangements in key metro areas'
    ],
    limits: {
      max_favorites: 9999,
      direct_agent_contact: true,
      priority_alerts: true,
      virtual_tours_unlocked: true,
      vip_concierge: true,
      listing_credits: 5,
      advanced_market_data: true
    },
    renewal_terms: 'Billed monthly at $499. Includes 24/7 private client WhatsApp desk.',
    cancellation_policy: 'Flexible monthly subscription. Cancel anytime with immediate confirmation.',
    eligibility: 'Family offices, UHNW collectors, and developers seeking top-tier market positioning.'
  }
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brand_name: 'EstateNova',
  tagline: 'Private Residences & International Estates',
  contact_email: 'advisory@estatenova.com',
  contact_phone: '+1 (800) 378-2831',
  whatsapp_number: '+18003782831',
  office_address: {
    street: '450 Park Avenue, 21st Floor',
    city: 'New York',
    state: 'NY',
    zip: '10022',
    country: 'United States'
  },
  currency: 'USD',
  currency_symbol: '$',
  social_links: {
    twitter: 'https://twitter.com/estatenova',
    linkedin: 'https://linkedin.com/company/estatenova',
    instagram: 'https://instagram.com/estatenova'
  }
};

export const DEFAULT_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    title: 'The Bel Air Horizon Sanctuary',
    slug: 'bel-air-horizon-sanctuary',
    description: 'An architectural tour de force conceived by renowned modernist architects, this cantilevered residence floats above the Los Angeles basin with 280-degree unobstructed panoramas from downtown to the Pacific Ocean. Finished in honed Roman travertine, oiled walnut, and acoustic acoustic paneling, the home features automated floor-to-ceiling fleetwood glass pocket doors, an 80-foot horizon infinity pool, a subterranean wine gallery for 1,200 bottles, and a state-of-the-art Dolby Atmos screening theater.',
    transaction_type: 'sale',
    property_type: 'villa',
    price: 18500000,
    currency: 'USD',
    address: '10484 Bellagio Road',
    city: 'Los Angeles',
    region: 'California',
    country: 'United States',
    latitude: 34.0837,
    longitude: -118.4452,
    bedrooms: 6,
    bathrooms: 8,
    area: 9800,
    area_unit: 'sq ft',
    amenities: [
      'Infinity Edge Pool',
      'Travertine Sun Deck',
      'Dolby Screening Room',
      '1,200 Bottle Wine Cellar',
      'Smart Home Automation',
      'Private Motor Court',
      'Wellness Spa & Sauna',
      'Staff Quarters'
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      id: 'agent-01',
      name: 'Victoria Vance',
      title: 'Managing Director, West Coast Estates',
      phone: '+1 (310) 849-2190',
      email: 'victoria.vance@estatenova.com',
      whatsapp: '+13108492190',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Over 16 years specializing in trophy residential assets across Bel Air, Beverly Hills, and Malibu.',
      languages: ['English', 'French']
    },
    listing_status: 'available',
    featured_status: true,
    is_sample: true,
    year_built: 2023,
    parking_spaces: 4,
    hoa_fee: 450,
    tax_annual: 142000,
    heating_cooling: 'Multi-zone Geothermal Radiant & Variable Refrigerant',
    published_at: '2026-09-15T10:00:00Z',
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-10-28T14:30:00Z'
  },
  {
    id: 'prop-002',
    title: 'Central Park South Duplex Tower Penthouse',
    slug: 'central-park-south-duplex-penthouse',
    description: 'Perched on the 64th and 65th floors of Billionaires’ Row, this duplex penthouse is a bespoke achievement in Manhattan luxury. Featuring 14-foot ceiling heights, double-sided bronze fireplace, herringbone white oak flooring, and custom Poliform kitchen with Calacatta marble slab islands. Private terrace overlooking the entirety of Central Park with motorized louvered pergolas and integrated outdoor heating.',
    transaction_type: 'sale',
    property_type: 'penthouse',
    price: 24750000,
    currency: 'USD',
    address: '220 Central Park South',
    city: 'New York',
    region: 'New York',
    country: 'United States',
    latitude: 40.7675,
    longitude: -73.9806,
    bedrooms: 5,
    bathrooms: 6,
    area: 6450,
    area_unit: 'sq ft',
    amenities: [
      'Direct Park Views',
      'Private High-Speed Elevator',
      'Wrap-Around Sky Terrace',
      '24/7 White-Glove Concierge',
      'Private Dining Club Access',
      'Valet Parking',
      'Bespoke Fireplaces',
      'Wine Room'
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      id: 'agent-02',
      name: 'Alexander Sterling',
      title: 'Partner, Private Client Group Manhattan',
      phone: '+1 (212) 634-9022',
      email: 'alexander.sterling@estatenova.com',
      whatsapp: '+12126349022',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      bio: 'Leading Manhattan luxury advisor with over $1.2B career volume in super-prime condominiums.',
      languages: ['English', 'German']
    },
    listing_status: 'available',
    featured_status: true,
    is_sample: true,
    year_built: 2022,
    parking_spaces: 2,
    hoa_fee: 6800,
    tax_annual: 210000,
    heating_cooling: 'Concealed 4-Pipe Central HVAC',
    published_at: '2026-09-20T12:00:00Z',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-10-25T11:20:00Z'
  },
  {
    id: 'prop-003',
    title: 'Villa Luminosa Cap d’Antibes',
    slug: 'villa-luminosa-cap-dantibes',
    description: 'An idyllic French Riviera coastal estate located in prestigious Cap d’Antibes. Offering direct private access to the Mediterranean waters, manicured century-old olive groves, a heated saltwater overflow pool, and guest pavilion. The main villa features lime-washed stone facades, provencal ceilings, and custom metalwork by local French artisans.',
    transaction_type: 'sale',
    property_type: 'villa',
    price: 14200000,
    currency: 'USD',
    address: 'Boulevard de Bacon',
    city: 'Antibes',
    region: 'Côte d’Azur',
    country: 'France',
    latitude: 43.5658,
    longitude: 7.1278,
    bedrooms: 7,
    bathrooms: 8,
    area: 7200,
    area_unit: 'sq ft',
    amenities: [
      'Direct Sea Access',
      'Private Mooring Rights',
      'Saltwater Infinity Pool',
      'Guest House',
      'Summer Kitchen & Pergola',
      'Security Post & Cameras',
      'Landscaped Olive Grove',
      'Wine Tasting Cellar'
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      id: 'agent-03',
      name: 'Charlotte Dubois',
      title: 'Director, European Mediterranean Portfolio',
      phone: '+33 4 93 34 22 10',
      email: 'charlotte.dubois@estatenova.com',
      whatsapp: '+33493342210',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      bio: 'Bespoke Côte d’Azur advisory representing prime waterfront properties in Cannes, Antibes, and Saint-Tropez.',
      languages: ['French', 'English', 'Italian']
    },
    listing_status: 'available',
    featured_status: true,
    is_sample: true,
    year_built: 2020,
    parking_spaces: 6,
    hoa_fee: 0,
    tax_annual: 65000,
    heating_cooling: 'Reversible Climate Control & Underfloor Hydronic Heating',
    published_at: '2026-10-01T09:00:00Z',
    created_at: '2026-10-01T09:00:00Z',
    updated_at: '2026-10-27T16:15:00Z'
  },
  {
    id: 'prop-004',
    title: 'Mayfair Edwardian Townhouse Residence',
    slug: 'mayfair-edwardian-townhouse',
    description: 'A Grade II listed Edwardian townhouse meticulously restored in the heart of Mayfair, moments from Mount Street and Berkeley Square. Spanning six levels serviced by a discreet passenger lift, the residence combines heritage plasterwork with 21st-century comfort, including a subterranean spa with swimming pool, gym, steam room, and rooftop garden.',
    transaction_type: 'rent',
    property_type: 'house',
    price: 45000,
    currency: 'USD',
    rental_billing_period: 'month',
    address: '18 Chesterfield Hill',
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    latitude: 51.5085,
    longitude: -0.1488,
    bedrooms: 5,
    bathrooms: 6,
    area: 5800,
    area_unit: 'sq ft',
    amenities: [
      'Indoor Swimming Pool',
      'Private Passenger Lift',
      'Roof Terrace with Skyline Views',
      'Subterranean Gym & Spa',
      'Air Conditioning Throughout',
      'Integrated Audio System',
      'Staff Accommodation',
      'Secure Garage Parking'
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      id: 'agent-04',
      name: 'James Harrington-Smyth',
      title: 'Partner, Prime Central London',
      phone: '+44 20 7946 0880',
      email: 'james.harrington@estatenova.com',
      whatsapp: '+442079460880',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Trusted advisor to diplomatic delegations and family offices across Mayfair, Belgravia, and Knightsbridge.',
      languages: ['English']
    },
    listing_status: 'available',
    featured_status: true,
    is_sample: true,
    year_built: 1908,
    parking_spaces: 2,
    hoa_fee: 0,
    tax_annual: 48000,
    heating_cooling: 'Heritage Cast Iron Radiators & Integrated Concealed AC',
    published_at: '2026-10-05T14:00:00Z',
    created_at: '2026-10-05T14:00:00Z',
    updated_at: '2026-10-26T08:45:00Z'
  },
  {
    id: 'prop-005',
    title: 'The Glass Pavilion Alpine Estate',
    slug: 'the-glass-pavilion-aspen',
    description: 'Positioned on Red Mountain in Aspen, Colorado, this architectural masterpiece commands sweeping views of Aspen Mountain and the Roaring Fork Valley. Featuring board-formed concrete, Swiss triple-glazed glass curtains, reclaimed barn timber beams, indoor heated lap pool, ski-in ski-out access, and geothermal radiant heated driveway.',
    transaction_type: 'sale',
    property_type: 'villa',
    price: 29500000,
    currency: 'USD',
    address: '720 Willoughby Way',
    city: 'Aspen',
    region: 'Colorado',
    country: 'United States',
    latitude: 39.1911,
    longitude: -106.8175,
    bedrooms: 6,
    bathrooms: 7,
    area: 8900,
    area_unit: 'sq ft',
    amenities: [
      'Ski-in / Ski-out Access',
      'Geothermal Heated Driveway',
      'Indoor Heated Lap Pool',
      'Oxygen-Enriched Master Suite',
      'Bespoke Ski Locker Room',
      'Hot Tub with Valley Views',
      'Outdoor Fire Pits',
      'Full Home Automation'
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      id: 'agent-01',
      name: 'Victoria Vance',
      title: 'Managing Director, West Coast Estates',
      phone: '+1 (310) 849-2190',
      email: 'victoria.vance@estatenova.com',
      whatsapp: '+13108492190',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Over 16 years specializing in trophy residential assets across Bel Air, Beverly Hills, and Malibu.',
      languages: ['English', 'French']
    },
    listing_status: 'available',
    featured_status: false,
    is_sample: true,
    year_built: 2024,
    parking_spaces: 3,
    hoa_fee: 300,
    tax_annual: 98000,
    heating_cooling: 'Closed-Loop Geothermal Hydronic In-Slab Heating',
    published_at: '2026-10-10T16:00:00Z',
    created_at: '2026-10-10T16:00:00Z',
    updated_at: '2026-10-24T18:00:00Z'
  },
  {
    id: 'prop-006',
    title: 'Palm Jumeirah Signature Beachfront Villa',
    slug: 'palm-jumeirah-signature-villa',
    description: 'Occupying a coveted frond position on the iconic Palm Jumeirah in Dubai, this modern palace boasts a private 120-foot white sand beach, panoramic Dubai Marina skyline views, Italian travertine finishes, custom water features, rooftop lounge with jacuzzi, and separate butler staff quarters.',
    transaction_type: 'sale',
    property_type: 'villa',
    price: 16800000,
    currency: 'USD',
    address: 'Frond N, Palm Jumeirah',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    latitude: 25.1124,
    longitude: 55.1389,
    bedrooms: 6,
    bathrooms: 7,
    area: 8400,
    area_unit: 'sq ft',
    amenities: [
      'Private Beachfront',
      'Infinity Pool & Sunken Firepit',
      'Rooftop Marina View Lounge',
      'Private Yacht Mooring Option',
      'Smart Glass Privacy Tech',
      'Driver & Maid Suites',
      'Triple Car Garage',
      'Elevator'
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      id: 'agent-02',
      name: 'Alexander Sterling',
      title: 'Partner, Private Client Group Manhattan',
      phone: '+1 (212) 634-9022',
      email: 'alexander.sterling@estatenova.com',
      whatsapp: '+12126349022',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      bio: 'Leading Manhattan luxury advisor with over $1.2B career volume in super-prime condominiums.',
      languages: ['English', 'German']
    },
    listing_status: 'available',
    featured_status: false,
    is_sample: true,
    year_built: 2023,
    parking_spaces: 4,
    hoa_fee: 1200,
    tax_annual: 0,
    heating_cooling: 'District Chilled Water Smart HVAC',
    published_at: '2026-10-12T11:00:00Z',
    created_at: '2026-10-12T11:00:00Z',
    updated_at: '2026-10-23T15:30:00Z'
  },
  {
    id: 'prop-007',
    title: 'The Shinjuku Sky Executive Duplex',
    slug: 'shinjuku-sky-executive-duplex',
    description: 'Floating on the top floors of a boutique high-rise in Shinjuku, Tokyo, this penthouse showcases Japanese minimalist architecture fused with Scandinavian clean aesthetics (Japandi). Featuring Hinoki cypress baths, tatami contemplation room, bespoke walnut built-ins, and breathtaking Mount Fuji vistas on clear days.',
    transaction_type: 'rent',
    property_type: 'apartment',
    price: 18000,
    currency: 'USD',
    rental_billing_period: 'month',
    address: 'Nishi-Shinjuku 2-Chome',
    city: 'Tokyo',
    region: 'Kanto',
    country: 'Japan',
    latitude: 35.6895,
    longitude: 139.6917,
    bedrooms: 3,
    bathrooms: 3,
    area: 3200,
    area_unit: 'sq ft',
    amenities: [
      'Mount Fuji Skyline Views',
      'Hinoki Cedar Onsen Tub',
      'Traditional Tea Room',
      'Bilingual 24/7 Concierge',
      'Private High-Speed Elevator',
      'Seismic Base-Isolation System',
      'Miele Appliances',
      'Automated Mechanical Parking'
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      id: 'agent-03',
      name: 'Charlotte Dubois',
      title: 'Director, European Mediterranean Portfolio',
      phone: '+33 4 93 34 22 10',
      email: 'charlotte.dubois@estatenova.com',
      whatsapp: '+33493342210',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      bio: 'Bespoke Côte d’Azur advisory representing prime waterfront properties in Cannes, Antibes, and Saint-Tropez.',
      languages: ['French', 'English', 'Italian']
    },
    listing_status: 'available',
    featured_status: false,
    is_sample: true,
    year_built: 2024,
    parking_spaces: 1,
    hoa_fee: 950,
    tax_annual: 22000,
    heating_cooling: 'Daikin VRV Silent Air Purification',
    published_at: '2026-10-14T08:30:00Z',
    created_at: '2026-10-14T08:30:00Z',
    updated_at: '2026-10-22T10:15:00Z'
  },
  {
    id: 'prop-008',
    title: 'One Kensington Flagship Prime Commercial Gallery',
    slug: 'one-kensington-flagship-commercial',
    description: 'An exceptional triple-frontage commercial freehold opportunity on Kensington High Street. Suited for private banking, flagship art galleries, luxury haute horlogerie, or corporate family-office headquarters. Features double-height glazed curtain walling, secure vaults, executive boardrooms, and rear mews parking.',
    transaction_type: 'lease',
    property_type: 'commercial',
    price: 32000,
    currency: 'USD',
    rental_billing_period: 'month',
    address: '144 Kensington High Street',
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    latitude: 51.5008,
    longitude: -0.1932,
    bedrooms: 0,
    bathrooms: 4,
    area: 7600,
    area_unit: 'sq ft',
    amenities: [
      'Triple Glazed Frontage',
      'Reinforced Subterranean Vault',
      'Dual Passenger & Freight Lifts',
      'Executive Boardroom Suite',
      'Dedicated Server Room',
      'CCTV & Biometric Access',
      'Private Rear Loading Mews',
      'BREEAM Excellent Rating'
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      id: 'agent-04',
      name: 'James Harrington-Smyth',
      title: 'Partner, Prime Central London',
      phone: '+44 20 7946 0880',
      email: 'james.harrington@estatenova.com',
      whatsapp: '+442079460880',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Trusted advisor to diplomatic delegations and family offices across Mayfair, Belgravia, and Knightsbridge.',
      languages: ['English']
    },
    listing_status: 'available',
    featured_status: false,
    is_sample: true,
    year_built: 2021,
    parking_spaces: 4,
    hoa_fee: 0,
    tax_annual: 58000,
    heating_cooling: 'Commercial High-Efficiency VRF Ventilation',
    published_at: '2026-10-18T10:00:00Z',
    created_at: '2026-10-18T10:00:00Z',
    updated_at: '2026-10-21T12:00:00Z'
  }
];

export const DEFAULT_USERS: User[] = [
  {
    id: 'user-client-01',
    name: 'Eleanor Vance',
    email: 'client@estatenova.com',
    phone: '+1 (917) 555-0199',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    created_at: '2026-08-10T14:00:00Z',
    membership: {
      plan_id: 'plan-plus',
      plan_name: 'Plus',
      status: 'active',
      started_at: '2026-08-10T14:00:00Z',
      expires_at: null,
      auto_renew: false,
      billing_interval: 'one_time',
      last_payment_id: 'tx-1001'
    },
    entitlements: {
      max_favorites: 25,
      direct_agent_contact: true,
      priority_alerts: false,
      virtual_tours_unlocked: true,
      vip_concierge: false,
      listing_credits: 0,
      advanced_market_data: false
    },
    saved_property_ids: ['prop-001', 'prop-002', 'prop-004']
  },
  {
    id: 'user-admin-01',
    name: 'Julian Montgomery',
    email: 'admin@estatenova.com',
    phone: '+1 (800) 378-2831',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    created_at: '2026-01-01T00:00:00Z',
    membership: {
      plan_id: 'plan-elite',
      plan_name: 'Elite Executive',
      status: 'active',
      started_at: '2026-01-01T00:00:00Z',
      expires_at: null,
      auto_renew: true,
      billing_interval: 'monthly',
      last_payment_id: 'tx-admin'
    },
    entitlements: {
      max_favorites: 9999,
      direct_agent_contact: true,
      priority_alerts: true,
      virtual_tours_unlocked: true,
      vip_concierge: true,
      listing_credits: 999,
      advanced_market_data: true
    },
    saved_property_ids: ['prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005']
  }
];

export const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-001',
    property_id: 'prop-002',
    property_title: 'Central Park South Duplex Tower Penthouse',
    user_id: 'user-client-01',
    name: 'Eleanor Vance',
    email: 'client@estatenova.com',
    phone: '+1 (917) 555-0199',
    category: 'viewing',
    preferred_contact: 'phone',
    message: 'We are flying in from Zurich next Thursday and would like to schedule a private viewing of the Central Park duplex with Mr. Sterling.',
    status: 'contacted',
    notes: 'Called client on Oct 28. Confirmed private security clearance with building concierge for Thursday 2pm.',
    created_at: '2026-10-27T16:20:00Z'
  },
  {
    id: 'enq-002',
    property_id: 'prop-001',
    property_title: 'The Bel Air Horizon Sanctuary',
    name: 'Marcus Sterling-Ross',
    email: 'marcus.sr@meridiancap.co',
    phone: '+1 (310) 998-3312',
    category: 'offer',
    preferred_contact: 'email',
    message: 'Requesting confidential seller disclosure package and preliminary boundary surveys for Bellagio Road estate.',
    status: 'reviewed',
    notes: 'NDA sent to Marcus via DocuSign.',
    created_at: '2026-10-28T09:15:00Z'
  },
  {
    id: 'enq-003',
    property_id: 'prop-004',
    property_title: 'Mayfair Edwardian Townhouse Residence',
    name: 'Lady Beatrice Thorne',
    email: 'beatrice.thorne@kensington.co.uk',
    phone: '+44 20 7118 4421',
    category: 'viewing',
    preferred_contact: 'whatsapp',
    message: 'Seeking a 12-month lease starting January for the Chesterfield Hill property.',
    status: 'pending',
    created_at: '2026-10-30T11:40:00Z'
  }
];

export const DEFAULT_VIEWINGS: ViewingRequest[] = [
  {
    id: 'view-001',
    property_id: 'prop-002',
    property_title: 'Central Park South Duplex Tower Penthouse',
    user_id: 'user-client-01',
    name: 'Eleanor Vance',
    email: 'client@estatenova.com',
    phone: '+1 (917) 555-0199',
    preferred_date: '2026-11-06',
    preferred_time: '14:00',
    attendees: 2,
    notes: 'Requires building security clearance beforehand.',
    status: 'confirmed',
    created_at: '2026-10-27T16:30:00Z'
  }
];

export const DEFAULT_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'tx-1001',
    user_id: 'user-client-01',
    user_email: 'client@estatenova.com',
    user_name: 'Eleanor Vance',
    plan_id: 'plan-plus',
    plan_name: 'Plus Membership',
    amount: 149,
    currency: 'USD',
    billing_interval: 'one_time',
    payment_method: 'Visa •••• 4242',
    status: 'succeeded',
    invoice_number: 'INV-2026-0810-01',
    created_at: '2026-08-10T14:05:00Z'
  },
  {
    id: 'tx-1002',
    user_id: 'user-02',
    user_email: 'henry.cavendish@londonasset.com',
    user_name: 'Henry Cavendish',
    plan_id: 'plan-premium',
    plan_name: 'Premium Membership',
    amount: 199,
    currency: 'USD',
    billing_interval: 'monthly',
    payment_method: 'Mastercard •••• 8821',
    status: 'succeeded',
    invoice_number: 'INV-2026-1002-09',
    created_at: '2026-10-02T10:14:00Z'
  },
  {
    id: 'tx-1003',
    user_id: 'user-03',
    user_email: 'dr.sophia.chen@pacific.org',
    user_name: 'Dr. Sophia Chen',
    plan_id: 'plan-elite',
    plan_name: 'Elite Membership',
    amount: 499,
    currency: 'USD',
    billing_interval: 'monthly',
    payment_method: 'Amex •••• 1004',
    status: 'succeeded',
    invoice_number: 'INV-2026-1015-18',
    created_at: '2026-10-15T18:30:00Z'
  }
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-001',
    slug: 'the-rise-of-biophilic-luxury-architecture',
    title: 'The Evolution of Biophilic Architecture in Prime Residences',
    excerpt: 'How modern architects are merging raw geological stone, internal courtyards, and circadian light engineering to redefine ultra-luxury wellness living.',
    content: `In the upper stratosphere of international property development, the definition of luxury has decisively moved away from ostentatious ornamentation toward biophilic serenity, natural material integrity, and environmental resonance.

Leading architects in Los Angeles, Zurich, and Kyoto are designing residential sanctuaries that frame natural elements as living art. Cantilevered terraces paved with honed Roman travertine seamlessly connect living salons to horizon water features, while acoustic micro-perforated timber ceilings attenuate city reverberation.

Furthermore, buyers are prioritizing clean indoor air systems, circadian lighting spectra that sync with astronomical dawn, and subterranean wellness facilities with cold plunges and magnesium flotation suites. At EstateNova, our curated listings reflect this enduring commitment to architectural permanence.`,
    category: 'Architecture & Design',
    author: {
      name: 'Victoria Vance',
      role: 'Managing Director, West Coast Estates',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    read_time: '5 min read',
    cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Architecture', 'Biophilic Design', 'Wellness', 'Trophy Assets'],
    published_at: '2026-10-14T09:00:00Z'
  },
  {
    id: 'blog-002',
    slug: 'global-prime-real-estate-trends-2027',
    title: 'Private Capital Allocation in Global Trophy Cities: 2027 Outlook',
    excerpt: 'An analysis of cross-border liquidity flows into prime central London, Manhattan penthouses, and Mediterranean coastal havens.',
    content: `Private wealth and institutional family offices continue to allocate disproportionate capital to prime residential real estate as a reliable hedge against monetary volatility and sovereign currency fluctuations.

London's Mayfair and Belgravia have demonstrated remarkable resilience, propelled by international demand for turnkey refurbished heritage mansions. In New York, the trophy penthouse market across Central Park South and Tribeca has maintained price stability due to strictly limited geographical supply.

For investors considering multi-jurisdictional acquisitions, currency hedging and local tax efficiency remain vital structuring considerations. EstateNova's Elite membership tier provides confidential advisory and transaction matching for discretionary purchasers worldwide.`,
    category: 'Market Intelligence',
    author: {
      name: 'Alexander Sterling',
      role: 'Partner, Private Client Group Manhattan',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
    },
    read_time: '7 min read',
    cover_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    tags: ['Market Outlook', 'Investment', 'Manhattan', 'Mayfair'],
    published_at: '2026-10-20T11:30:00Z'
  },
  {
    id: 'blog-003',
    slug: 'curating-private-art-galleries-in-modern-estates',
    title: 'Architectural Lighting & Climate for Private Art Collections',
    excerpt: 'Key technical requirements for safely displaying museum-grade contemporary art and sculpture within private domestic residences.',
    content: `When designing or acquiring a prime residence intended to house blue-chip contemporary art, standard residential lighting and air conditioning specifications are rarely sufficient.

UV filtration on all exterior glass curtains must achieve 99.5% blockage to protect oil pigments and delicate works on paper. Relative humidity must be regulated within a narrow tolerance of 45–55% with continuous 24-hour sensor monitoring.

Additionally, recessed magnetic museum track fixtures with high Color Rendering Index (CRI > 98) allow flexible spotlighting without cast shadows or heat build-up. In this guide, we review the structural specifications that discerning collectors look for before committing to an acquisition.`,
    category: 'Private Advisory',
    author: {
      name: 'Julian Montgomery',
      role: 'Senior Partner, EstateNova',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    },
    read_time: '4 min read',
    cover_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Art Advisory', 'Interiors', 'Architecture'],
    published_at: '2026-10-26T15:00:00Z'
  }
];
