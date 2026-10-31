import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
  PlanLimits 
} from '../types';
import { 
  DEFAULT_PROPERTIES, 
  DEFAULT_PLANS, 
  DEFAULT_SITE_CONFIG, 
  DEFAULT_USERS, 
  DEFAULT_ENQUIRIES, 
  DEFAULT_VIEWINGS, 
  DEFAULT_PAYMENTS, 
  DEFAULT_BLOG_POSTS 
} from './defaultData';

export interface DatabaseSchema {
  properties: Property[];
  plans: MembershipPlan[];
  users: User[];
  enquiries: Enquiry[];
  viewings: ViewingRequest[];
  payments: PaymentTransaction[];
  blog_posts: BlogPost[];
  config: SiteConfig;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.properties && parsed.plans && parsed.users) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to read existing database.json, re-initializing seeds:', err);
    }

    const initialData: DatabaseSchema = {
      properties: DEFAULT_PROPERTIES,
      plans: DEFAULT_PLANS,
      users: DEFAULT_USERS,
      enquiries: DEFAULT_ENQUIRIES,
      viewings: DEFAULT_VIEWINGS,
      payments: DEFAULT_PAYMENTS,
      blog_posts: DEFAULT_BLOG_POSTS,
      config: DEFAULT_SITE_CONFIG,
    };

    this.saveDatabase(initialData);
    return initialData;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- Config ---
  getConfig(): SiteConfig {
    return this.data.config;
  }

  updateConfig(updates: Partial<SiteConfig>): SiteConfig {
    this.data.config = { ...this.data.config, ...updates };
    this.saveDatabase();
    return this.data.config;
  }

  // --- Properties ---
  getProperties(params: PropertyFilterParams = {}): { properties: Property[]; total: number; page: number; totalPages: number } {
    let list = [...this.data.properties];

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.amenities.some(a => a.toLowerCase().includes(q))
      );
    }

    if (params.transaction_type && params.transaction_type !== 'all') {
      list = list.filter(p => p.transaction_type.toLowerCase() === params.transaction_type?.toLowerCase());
    }

    if (params.property_type && params.property_type !== 'all') {
      list = list.filter(p => p.property_type.toLowerCase() === params.property_type?.toLowerCase());
    }

    if (params.location && params.location !== 'all') {
      const loc = params.location.toLowerCase();
      list = list.filter(p => 
        p.city.toLowerCase().includes(loc) || 
        p.country.toLowerCase().includes(loc) || 
        p.region.toLowerCase().includes(loc)
      );
    }

    if (typeof params.minPrice === 'number' && !isNaN(params.minPrice) && params.minPrice > 0) {
      list = list.filter(p => p.price >= params.minPrice!);
    }

    if (typeof params.maxPrice === 'number' && !isNaN(params.maxPrice) && params.maxPrice > 0) {
      list = list.filter(p => p.price <= params.maxPrice!);
    }

    if (typeof params.bedrooms === 'number' && !isNaN(params.bedrooms) && params.bedrooms > 0) {
      list = list.filter(p => p.bedrooms >= params.bedrooms!);
    }

    if (typeof params.bathrooms === 'number' && !isNaN(params.bathrooms) && params.bathrooms > 0) {
      list = list.filter(p => p.bathrooms >= params.bathrooms!);
    }

    if (typeof params.minArea === 'number' && !isNaN(params.minArea) && params.minArea > 0) {
      list = list.filter(p => p.area >= params.minArea!);
    }

    if (typeof params.maxArea === 'number' && !isNaN(params.maxArea) && params.maxArea > 0) {
      list = list.filter(p => p.area <= params.maxArea!);
    }

    if (params.amenities && params.amenities.length > 0) {
      list = list.filter(p => 
        params.amenities!.every(req => 
          p.amenities.some(item => item.toLowerCase().includes(req.toLowerCase()))
        )
      );
    }

    if (params.featured === true) {
      list = list.filter(p => p.featured_status);
    }

    // Sorting
    switch (params.sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'area_desc':
        list.sort((a, b) => b.area - a.area);
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
        break;
    }

    const total = list.length;
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      properties: paginated,
      total,
      page,
      totalPages
    };
  }

  getPropertyBySlug(slug: string): Property | undefined {
    return this.data.properties.find(p => p.slug === slug);
  }

  getPropertyById(id: string): Property | undefined {
    return this.data.properties.find(p => p.id === id);
  }

  createProperty(propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Property {
    const id = `prop-${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const newProp: Property = {
      ...propertyData,
      id,
      created_at: now,
      updated_at: now,
      published_at: propertyData.published_at || now,
      is_sample: propertyData.is_sample !== undefined ? propertyData.is_sample : true
    };
    this.data.properties.unshift(newProp);
    this.saveDatabase();
    return newProp;
  }

  updateProperty(id: string, updates: Partial<Property>): Property | null {
    const idx = this.data.properties.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const updated = {
      ...this.data.properties[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.data.properties[idx] = updated;
    this.saveDatabase();
    return updated;
  }

  deleteProperty(id: string): boolean {
    const initialLen = this.data.properties.length;
    this.data.properties = this.data.properties.filter(p => p.id !== id);
    if (this.data.properties.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- Membership Plans ---
  getPlans(): MembershipPlan[] {
    return this.data.plans;
  }

  getPlanById(id: string): MembershipPlan | undefined {
    return this.data.plans.find(p => p.id === id || p.slug === id);
  }

  updatePlan(id: string, updates: Partial<MembershipPlan>): MembershipPlan | null {
    const idx = this.data.plans.findIndex(p => p.id === id || p.slug === id);
    if (idx === -1) return null;
    this.data.plans[idx] = { ...this.data.plans[idx], ...updates };
    this.saveDatabase();
    return this.data.plans[idx];
  }

  // --- Users & Entitlements ---
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: { name: string; email: string; phone?: string; role?: 'user' | 'admin' }): User {
    const id = `user-${Date.now().toString(36)}`;
    const starterPlan = this.getPlanById('plan-starter') || DEFAULT_PLANS[0];
    const newUser: User = {
      id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role || 'user',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      created_at: new Date().toISOString(),
      membership: {
        plan_id: starterPlan.id,
        plan_name: starterPlan.name,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: null,
        auto_renew: false,
        billing_interval: 'one_time'
      },
      entitlements: { ...starterPlan.limits },
      saved_property_ids: []
    };
    this.data.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveDatabase();
    return this.data.users[idx];
  }

  /**
   * Server-Side Entitlement & Membership Activation
   * Verified upon successful checkout or admin override
   */
  upgradeUserMembership(
    userId: string, 
    planId: string, 
    paymentDetails?: { amount: number; paymentMethod: string; invoiceNumber?: string }
  ): { user: User; transaction?: PaymentTransaction } | null {
    const user = this.getUserById(userId);
    const plan = this.getPlanById(planId);
    if (!user || !plan) return null;

    const now = new Date();
    const startedAt = now.toISOString();
    let expiresAt: string | null = null;
    let autoRenew = false;

    if (plan.billing_interval === 'monthly') {
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      expiresAt = nextMonth.toISOString();
      autoRenew = true;
    } else if (plan.billing_interval === 'yearly') {
      const nextYear = new Date(now);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      expiresAt = nextYear.toISOString();
      autoRenew = true;
    }

    let tx: PaymentTransaction | undefined;
    if (paymentDetails) {
      const txId = `tx-${Date.now().toString(36)}`;
      const invoiceNumber = paymentDetails.invoiceNumber || `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      tx = {
        id: txId,
        user_id: user.id,
        user_email: user.email,
        user_name: user.name,
        plan_id: plan.id,
        plan_name: plan.name,
        amount: paymentDetails.amount,
        currency: plan.currency,
        billing_interval: plan.billing_interval,
        payment_method: paymentDetails.paymentMethod,
        status: 'succeeded',
        invoice_number: invoiceNumber,
        created_at: startedAt
      };
      this.data.payments.unshift(tx);
    }

    user.membership = {
      plan_id: plan.id,
      plan_name: plan.name,
      status: 'active',
      started_at: startedAt,
      expires_at: expiresAt,
      auto_renew: autoRenew,
      billing_interval: plan.billing_interval,
      last_payment_id: tx?.id
    };

    // Apply strict server-side entitlement limits
    user.entitlements = { ...plan.limits };

    this.saveDatabase();
    return { user, transaction: tx };
  }

  cancelSubscription(userId: string): User | null {
    const user = this.getUserById(userId);
    if (!user) return null;
    if (user.membership.billing_interval === 'monthly' || user.membership.billing_interval === 'yearly') {
      user.membership.auto_renew = false;
      user.membership.status = 'canceled';
      this.saveDatabase();
    }
    return user;
  }

  toggleFavorite(userId: string, propertyId: string): { success: boolean; isFavorited: boolean; error?: string; savedCount: number; maxAllowed: number } {
    const user = this.getUserById(userId);
    if (!user) {
      return { success: false, isFavorited: false, error: 'User authentication required', savedCount: 0, maxAllowed: 0 };
    }

    const currentSaved = user.saved_property_ids || [];
    const maxAllowed = user.entitlements?.max_favorites || 5;
    const exists = currentSaved.includes(propertyId);

    if (exists) {
      // Remove favorite
      user.saved_property_ids = currentSaved.filter(id => id !== propertyId);
      this.saveDatabase();
      return { success: true, isFavorited: false, savedCount: user.saved_property_ids.length, maxAllowed };
    } else {
      // Check server entitlement limit
      if (currentSaved.length >= maxAllowed) {
        return {
          success: false,
          isFavorited: false,
          error: `Your current ${user.membership.plan_name} plan allows up to ${maxAllowed} saved favorites. Please upgrade to save more properties.`,
          savedCount: currentSaved.length,
          maxAllowed
        };
      }
      user.saved_property_ids.push(propertyId);
      this.saveDatabase();
      return { success: true, isFavorited: true, savedCount: user.saved_property_ids.length, maxAllowed };
    }
  }

  // --- Enquiries ---
  getEnquiries(userId?: string): Enquiry[] {
    if (userId) {
      return this.data.enquiries.filter(e => e.user_id === userId);
    }
    return this.data.enquiries;
  }

  createEnquiry(enquiryData: Omit<Enquiry, 'id' | 'created_at' | 'status'>): Enquiry {
    const id = `enq-${Date.now().toString(36)}`;
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    this.data.enquiries.unshift(newEnquiry);
    this.saveDatabase();
    return newEnquiry;
  }

  updateEnquiry(id: string, updates: Partial<Enquiry>): Enquiry | null {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.enquiries[idx] = { ...this.data.enquiries[idx], ...updates };
    this.saveDatabase();
    return this.data.enquiries[idx];
  }

  // --- Viewings ---
  getViewings(userId?: string): ViewingRequest[] {
    if (userId) {
      return this.data.viewings.filter(v => v.user_id === userId);
    }
    return this.data.viewings;
  }

  createViewing(viewingData: Omit<ViewingRequest, 'id' | 'created_at' | 'status'>): ViewingRequest {
    const id = `view-${Date.now().toString(36)}`;
    const newViewing: ViewingRequest = {
      ...viewingData,
      id,
      status: 'requested',
      created_at: new Date().toISOString()
    };
    this.data.viewings.unshift(newViewing);
    this.saveDatabase();
    return newViewing;
  }

  updateViewing(id: string, updates: Partial<ViewingRequest>): ViewingRequest | null {
    const idx = this.data.viewings.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.viewings[idx] = { ...this.data.viewings[idx], ...updates };
    this.saveDatabase();
    return this.data.viewings[idx];
  }

  // --- Payments ---
  getPayments(userId?: string): PaymentTransaction[] {
    if (userId) {
      return this.data.payments.filter(p => p.user_id === userId);
    }
    return this.data.payments;
  }

  // --- Blog ---
  getBlogPosts(): BlogPost[] {
    return this.data.blog_posts;
  }

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.data.blog_posts.find(b => b.slug === slug);
  }

  // --- Admin Stats ---
  getAdminStats() {
    const totalProperties = this.data.properties.length;
    const availableProperties = this.data.properties.filter(p => p.listing_status === 'available').length;
    const totalEnquiries = this.data.enquiries.length;
    const pendingEnquiries = this.data.enquiries.filter(e => e.status === 'pending').length;
    const totalUsers = this.data.users.length;
    const activeSubscribers = this.data.users.filter(u => u.membership.status === 'active' && u.membership.plan_id !== 'plan-starter').length;
    const totalRevenue = this.data.payments.reduce((acc, curr) => acc + (curr.status === 'succeeded' ? curr.amount : 0), 0);

    return {
      totalProperties,
      availableProperties,
      totalEnquiries,
      pendingEnquiries,
      totalUsers,
      activeSubscribers,
      totalRevenue
    };
  }
}

export const db = new DatabaseService();
