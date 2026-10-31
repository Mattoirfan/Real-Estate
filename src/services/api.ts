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
import { clientStorage } from './clientStorage';
import { SPLASH_AI_PROMPTS } from '../data/splashPrompts';

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
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        this.setSession(data.user, data.token);
        return { success: true, user: data.user };
      }
    } catch (err) {
      // Fallback for Netlify static deployment
    }

    // Client Storage Fallback
    const user = clientStorage.getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'No account found with this email. Please register.' };
    }
    const token = `token-${user.id}-${Date.now()}`;
    this.setSession(user, token);
    return { success: true, user };
  }

  async register(name: string, email: string, phone?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        this.setSession(data.user, data.token);
        return { success: true, user: data.user };
      }
    } catch (err) {
      // Fallback for Netlify static deployment
    }

    const existing = clientStorage.getUserByEmail(email);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const user = clientStorage.createUser({ name, email, phone });
    const token = `token-${user.id}-${Date.now()}`;
    this.setSession(user, token);
    return { success: true, user };
  }

  logout() {
    this.setSession(null, null);
  }

  async refreshProfile(): Promise<User | null> {
    if (!this.currentUser) return null;
    try {
      const res = await fetch('/api/auth/me', { headers: this.getHeaders() });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        this.setSession(data.user, this.token);
        return data.user;
      }
    } catch (err) {
      // Netlify fallback
    }

    const user = clientStorage.getUserById(this.currentUser.id);
    if (user) {
      this.setSession(user, this.token);
      return user;
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
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        this.setSession(data.user, this.token);
        return { success: true, user: data.user };
      }
    } catch (err) {
      // Netlify fallback
    }

    if (!this.currentUser) return { success: false, error: 'Not authenticated' };
    const updated = clientStorage.updateUser(this.currentUser.id, updates);
    if (updated) {
      this.setSession(updated, this.token);
      return { success: true, user: updated };
    }
    return { success: false, error: 'User not found' };
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

    try {
      const res = await fetch(`/api/properties?${query.toString()}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }

    return clientStorage.getProperties(params);
  }

  async getPropertyBySlug(slug: string): Promise<{ property: Property; similar: Property[] }> {
    try {
      const res = await fetch(`/api/properties/${slug}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }

    const prop = clientStorage.getPropertyBySlug(slug);
    if (!prop) throw new Error('Property not found');
    const similar = clientStorage.getProperties({
      property_type: prop.property_type,
      limit: 3
    }).properties.filter(p => p.id !== prop.id);
    return { property: prop, similar };
  }

  async createProperty(propertyData: any): Promise<Property> {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(propertyData)
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return data.property;
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.createProperty(propertyData);
  }

  async updateProperty(id: string, updates: any): Promise<Property> {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates)
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return data.property;
      }
    } catch (e) {
      // Netlify fallback
    }
    const updated = clientStorage.updateProperty(id, updates);
    if (!updated) throw new Error('Property not found');
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      if (res.ok) return true;
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.deleteProperty(id);
  }

  // --- Favorites ---
  async toggleFavorite(propertyId: string): Promise<{ success: boolean; isFavorited: boolean; error?: string; savedCount?: number; maxAllowed?: number }> {
    if (!this.currentUser) {
      return { success: false, isFavorited: false, error: 'Please log in or create an account to save favorite properties.' };
    }

    try {
      const res = await fetch('/api/account/favorites/toggle', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ propertyId })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
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
    } catch (e) {
      // Netlify fallback
    }

    const data = clientStorage.toggleFavorite(this.currentUser.id, propertyId);
    if (data.success) {
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
    if (!this.currentUser) throw new Error('Not authenticated');

    try {
      const res = await fetch('/api/account/favorites', { headers: this.getHeaders() });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }

    const user = clientStorage.getUserById(this.currentUser.id) || this.currentUser;
    const favorites = (user.saved_property_ids || [])
      .map(id => clientStorage.getPropertyById(id))
      .filter(Boolean) as Property[];

    return {
      favorites,
      total: favorites.length,
      maxAllowed: user.entitlements.max_favorites,
      planName: user.membership.plan_name
    };
  }

  // --- Plans & Checkout ---
  async getPlans(): Promise<MembershipPlan[]> {
    try {
      const res = await fetch('/api/plans');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.getPlans();
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
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.user) this.setSession(data.user, this.token);
        return data;
      }
    } catch (e) {
      // Netlify fallback
    }

    const upgraded = clientStorage.upgradeUserMembership(this.currentUser.id, planId, paymentMethod);
    if (!upgraded) {
      return { success: false, error: 'Failed to process membership upgrade' };
    }
    this.setSession(upgraded.user, this.token);
    return {
      success: true,
      user: upgraded.user,
      transaction: upgraded.transaction,
      message: `Privileges activated for ${upgraded.user.membership.plan_name}!`
    };
  }

  async cancelSubscription(): Promise<{ success: boolean; message?: string; user?: User; error?: string }> {
    if (!this.currentUser) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/account/subscription/cancel', {
        method: 'POST',
        headers: this.getHeaders()
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.user) this.setSession(data.user, this.token);
        return data;
      }
    } catch (e) {
      // Netlify fallback
    }

    const updated = clientStorage.cancelSubscription(this.currentUser.id);
    if (updated) {
      this.setSession(updated, this.token);
      return {
        success: true,
        user: updated,
        message: 'Subscription renewal has been canceled.'
      };
    }
    return { success: false, error: 'Failed to cancel subscription' };
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
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }

    const created = clientStorage.createEnquiry({
      ...enquiry,
      user_id: this.currentUser?.id
    });
    return {
      success: true,
      enquiry: created,
      message: 'Your inquiry has been securely received by our private advisory desk.'
    };
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
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }

    const created = clientStorage.createViewing({
      ...viewing,
      user_id: this.currentUser?.id
    });
    return {
      success: true,
      viewing: created,
      message: 'Private viewing requested. Our concierge will confirm security clearance and itinerary.'
    };
  }

  async getMyEnquiries(): Promise<Enquiry[]> {
    if (!this.currentUser) return [];
    try {
      const res = await fetch('/api/account/enquiries', { headers: this.getHeaders() });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.getEnquiries(this.currentUser.id);
  }

  async getMyViewings(): Promise<ViewingRequest[]> {
    if (!this.currentUser) return [];
    try {
      const res = await fetch('/api/account/viewings', { headers: this.getHeaders() });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.getViewings(this.currentUser.id);
  }

  // --- Site Config ---
  async getConfig(): Promise<SiteConfig> {
    try {
      const res = await fetch('/api/config');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.getConfig();
  }

  async updateConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(config)
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return data.config;
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.updateConfig(config);
  }

  // --- Admin ---
  async getAdminStats() {
    try {
      const res = await fetch('/api/admin/stats', { headers: this.getHeaders() });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.getAdminStats();
  }

  async getAdminEnquiries(): Promise<Enquiry[]> {
    try {
      const res = await fetch('/api/admin/enquiries', { headers: this.getHeaders() });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.getEnquiries();
  }

  async updateAdminEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates)
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return data.enquiry;
      }
    } catch (e) {
      // Netlify fallback
    }
    const updated = clientStorage.updateEnquiry(id, updates);
    if (!updated) throw new Error('Enquiry not found');
    return updated;
  }

  async getAdminUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/admin/users', { headers: this.getHeaders() });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.getUsers();
  }

  async overrideUserTier(userId: string, planId: string): Promise<User> {
    try {
      const res = await fetch(`/api/admin/users/${userId}/tier`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ planId })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return data.user;
      }
    } catch (e) {
      // Netlify fallback
    }
    const result = clientStorage.upgradeUserMembership(userId, planId, 'Admin Override');
    if (!result) throw new Error('User or Plan not found');
    return result.user;
  }

  async getAdminPayments(): Promise<PaymentTransaction[]> {
    try {
      const res = await fetch('/api/admin/payments', { headers: this.getHeaders() });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.getPayments();
  }

  // --- Blog ---
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const res = await fetch('/api/blog');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return clientStorage.getBlogPosts();
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    const post = clientStorage.getBlogPostBySlug(slug);
    if (!post) throw new Error('Post not found');
    return post;
  }

  // --- Splash AI Prompts ---
  async getSplashPrompts(): Promise<SplashPrompt[]> {
    try {
      const res = await fetch('/api/splash-prompts');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Netlify fallback
    }
    return SPLASH_AI_PROMPTS;
  }
}

export const api = new ApiService();
