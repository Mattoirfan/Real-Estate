import { 
  Property, 
  MembershipPlan, 
  User, 
  Enquiry, 
  ViewingRequest, 
  PaymentTransaction, 
  BlogPost, 
  SiteConfig,
  PropertyFilterParams,
  SplashPrompt
} from '../types';

const STORAGE_KEY_USER = 'estatenova_user';
const STORAGE_KEY_TOKEN = 'estatenova_token';

class ApiService {
  private currentUser: User | null = null;
  private token: string | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
      if (storedToken) {
        this.token = storedToken;
      }
    } catch (e) {
      console.warn('Failed to load user session from localStorage', e);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  subscribeUser(fn: (user: User | null) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.currentUser));
  }

  private setSession(user: User | null, token: string | null) {
    this.currentUser = user;
    this.token = token;
    if (user && token) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
    this.notify();
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.currentUser) {
      headers['x-user-id'] = this.currentUser.id;
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // --- Auth ---
  async login(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }
      this.setSession(data.user, data.token);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async register(name: string, email: string, phone?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      this.setSession(data.user, data.token);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  logout() {
    this.setSession(null, null);
  }

  async refreshProfile(): Promise<User | null> {
    if (!this.currentUser) return null;
    try {
      const res = await fetch('/api/auth/me', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        this.setSession(data.user, this.token);
        return data.user;
      }
    } catch (err) {
      console.warn('Profile refresh failed', err);
    }
    return this.currentUser;
  }

  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      this.setSession(data.user, this.token);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // --- Properties ---
  async getProperties(params: PropertyFilterParams = {}): Promise<{ properties: Property[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.transaction_type && params.transaction_type !== 'all') query.set('transaction_type', params.transaction_type);
    if (params.property_type && params.property_type !== 'all') query.set('property_type', params.property_type);
    if (params.location && params.location !== 'all') query.set('location', params.location);
    if (params.minPrice) query.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) query.set('maxPrice', params.maxPrice.toString());
    if (params.bedrooms) query.set('bedrooms', params.bedrooms.toString());
    if (params.bathrooms) query.set('bathrooms', params.bathrooms.toString());
    if (params.minArea) query.set('minArea', params.minArea.toString());
    if (params.maxArea) query.set('maxArea', params.maxArea.toString());
    if (params.featured) query.set('featured', 'true');
    if (params.sort) query.set('sort', params.sort);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.amenities && params.amenities.length > 0) {
      params.amenities.forEach(a => query.append('amenities', a));
    }

    const res = await fetch(`/api/properties?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch properties');
    return res.json();
  }

  async getPropertyBySlug(slug: string): Promise<{ property: Property; similar: Property[] }> {
    const res = await fetch(`/api/properties/${slug}`);
    if (!res.ok) throw new Error('Property not found');
    return res.json();
  }

  async createProperty(propertyData: any): Promise<Property> {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(propertyData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create listing');
    return data.property;
  }

  async updateProperty(id: string, updates: any): Promise<Property> {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update listing');
    return data.property;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.ok;
  }

  // --- Favorites ---
  async toggleFavorite(propertyId: string): Promise<{ success: boolean; isFavorited: boolean; error?: string; savedCount?: number; maxAllowed?: number }> {
    if (!this.currentUser) {
      return { success: false, isFavorited: false, error: 'Please log in or create an account to save favorite properties.' };
    }
    const res = await fetch('/api/account/favorites/toggle', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ propertyId })
    });
    const data = await res.json();
    if (data.success && this.currentUser) {
      if (data.isFavorited) {
        if (!this.currentUser.saved_property_ids.includes(propertyId)) {
          this.currentUser.saved_property_ids.push(propertyId);
        }
      } else {
        this.currentUser.saved_property_ids = this.currentUser.saved_property_ids.filter(id => id !== propertyId);
      }
      this.setSession({ ...this.currentUser }, this.token);
    }
    return data;
  }

  async getSavedProperties(): Promise<{ favorites: Property[]; total: number; maxAllowed: number; planName: string }> {
    const res = await fetch('/api/account/favorites', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch saved properties');
    return res.json();
  }

  // --- Plans & Checkout ---
  async getPlans(): Promise<MembershipPlan[]> {
    const res = await fetch('/api/plans');
    if (!res.ok) throw new Error('Failed to fetch plans');
    return res.json();
  }

  async checkoutPlan(planId: string, paymentMethod?: string): Promise<{ success: boolean; user?: User; transaction?: PaymentTransaction; error?: string; message?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'Please sign in or register to purchase a membership plan.' };
    }

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          userId: this.currentUser.id,
          planId,
          paymentMethod: paymentMethod || 'Visa •••• 4242'
        })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      this.setSession(data.user, this.token);
      return data;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async cancelSubscription(): Promise<{ success: boolean; message?: string; user?: User; error?: string }> {
    try {
      const res = await fetch('/api/account/subscription/cancel', {
        method: 'POST',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      this.setSession(data.user, this.token);
      return data;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // --- Enquiries & Viewings ---
  async submitEnquiry(enquiry: Partial<Enquiry>): Promise<{ success: boolean; message?: string; enquiry?: Enquiry; error?: string }> {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...enquiry,
          user_id: this.currentUser?.id
        })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      return data;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async requestViewing(viewing: Partial<ViewingRequest>): Promise<{ success: boolean; message?: string; viewing?: ViewingRequest; error?: string }> {
    try {
      const res = await fetch('/api/viewings', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...viewing,
          user_id: this.currentUser?.id
        })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      return data;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async getMyEnquiries(): Promise<Enquiry[]> {
    const res = await fetch('/api/account/enquiries', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  }

  async getMyViewings(): Promise<ViewingRequest[]> {
    const res = await fetch('/api/account/viewings', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch viewings');
    return res.json();
  }

  // --- Site Config ---
  async getConfig(): Promise<SiteConfig> {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error('Failed to fetch site config');
    return res.json();
  }

  async updateConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
    const res = await fetch('/api/config', {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(config)
    });
    const data = await res.json();
    return data.config;
  }

  // --- Admin ---
  async getAdminStats() {
    const res = await fetch('/api/admin/stats', { headers: this.getHeaders() });
    return res.json();
  }

  async getAdminEnquiries(): Promise<Enquiry[]> {
    const res = await fetch('/api/admin/enquiries', { headers: this.getHeaders() });
    return res.json();
  }

  async updateAdminEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data.enquiry;
  }

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch('/api/admin/users', { headers: this.getHeaders() });
    return res.json();
  }

  async overrideUserTier(userId: string, planId: string): Promise<User> {
    const res = await fetch(`/api/admin/users/${userId}/tier`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ planId })
    });
    const data = await res.json();
    return data.user;
  }

  async getAdminPayments(): Promise<PaymentTransaction[]> {
    const res = await fetch('/api/admin/payments', { headers: this.getHeaders() });
    return res.json();
  }

  // --- Blog ---
  async getBlogPosts(): Promise<BlogPost[]> {
    const res = await fetch('/api/blog');
    return res.json();
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`/api/blog/${slug}`);
    if (!res.ok) throw new Error('Post not found');
    return res.json();
  }

  // --- Splash AI Prompts ---
  async getSplashPrompts(): Promise<SplashPrompt[]> {
    const res = await fetch('/api/splash-prompts');
    return res.json();
  }
}

export const api = new ApiService();
