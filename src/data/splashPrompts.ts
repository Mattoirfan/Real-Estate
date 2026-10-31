/**
 * Splash AI & Gemini Image Generation Prompt Repository
 * 
 * Production-ready prompts adhering to editorial architectural standards.
 * Can be utilized to generate photorealistic luxury real estate assets.
 */

export interface SplashPrompt {
  id: string;
  category: 'hero' | 'villa' | 'penthouse' | 'apartment' | 'commercial' | 'interior' | 'agent';
  title: string;
  prompt: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  recommendedResolution: string;
}

export const SPLASH_AI_PROMPTS: SplashPrompt[] = [
  {
    id: 'hero-bel-air',
    category: 'hero',
    title: 'The Horizon Belvedere Hero Exterior',
    prompt: 'Cinematic wide-angle dusk architectural photograph of a modern cantilevered luxury mansion in Bel Air, infinity pool reflecting golden hour sky, travertine stone terraces, floor-to-ceiling glass walls, warm minimalist interior lighting, lush manicured cypress landscaping, 8k editorial real estate photography.',
    aspectRatio: '16:9',
    recommendedResolution: '3840x2160'
  },
  {
    id: 'penthouse-manhattan',
    category: 'penthouse',
    title: 'Central Park South Duplex Penthouse',
    prompt: 'Photorealistic high-angle interior view of a luxury Manhattan duplex penthouse living salon overlooking Central Park at twilight, double-height ceilings, bespoke bronze fireplace, herringbone white oak floors, contemporary Italian furniture, architectural soft ambient lighting, Architectural Digest quality.',
    aspectRatio: '4:3',
    recommendedResolution: '2048x1536'
  },
  {
    id: 'villa-cannes',
    category: 'villa',
    title: 'Villa Luminosa Côte d’Azur',
    prompt: 'Breathtaking editorial drone perspective of a modern white Mediterranean villa nestled on Cannes coastal cliffside, turquoise Mediterranean sea in background, expansive limestone sundeck, sun loungers, pergolas with bougainvillea, crisp natural sunlight, pristine luxury residence.',
    aspectRatio: '4:3',
    recommendedResolution: '2048x1536'
  },
  {
    id: 'interior-kitchen-marble',
    category: 'interior',
    title: 'Calacatta Gold Minimalist Chef Kitchen',
    prompt: 'Magazine-grade editorial photograph of a minimalist luxury kitchen with monolithic Calacatta marble island, fluted dark oak cabinetry, integrated Gaggenau induction cooktops, concealed LED reveal lighting, warm natural daylight streaming through black-steel crittall windows.',
    aspectRatio: '4:3',
    recommendedResolution: '2048x1536'
  },
  {
    id: 'commercial-mayfair',
    category: 'commercial',
    title: 'Mayfair Executive Private Office Gallery',
    prompt: 'High-end interior photograph of an executive family-office suite in Mayfair London, walnut wood paneling, bespoke brass lighting, sculptural leather desk, curated contemporary art on neutral plaster walls, discrete wealth and architectural sophistication.',
    aspectRatio: '4:3',
    recommendedResolution: '2048x1536'
  },
  {
    id: 'agent-advisory',
    category: 'agent',
    title: 'Senior Real Estate Managing Director',
    prompt: 'Studio editorial portrait of an executive luxury real estate director in tailored bespoke charcoal blazer against a clean neutral architectural plaster backdrop, warm natural directional lighting, confident and approachable expression, Leica 50mm portrait aesthetic.',
    aspectRatio: '1:1',
    recommendedResolution: '1024x1024'
  }
];
