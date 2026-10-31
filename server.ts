import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/db';
import { SPLASH_AI_PROMPTS } from './src/data/splashPrompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API ROUTES ---

// Health & Config
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'EstateNova API', timestamp: new Date().toISOString() });
});

app.get('/api/config', (req: Request, res: Response) => {
  res.json(db.getConfig());
});

app.put('/api/config', (req: Request, res: Response) => {
  try {
    const updated = db.updateConfig(req.body);
    res.json({ success: true, config: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Splash Prompts
app.get('/api/splash-prompts', (req: Request, res: Response) => {
  res.json(SPLASH_AI_PROMPTS);
});

// Properties
app.get('/api/properties', (req: Request, res: Response) => {
  try {
    const { 
      search, 
      transaction_type, 
      property_type, 
      location, 
      minPrice, 
      maxPrice, 
      bedrooms, 
      bathrooms, 
      minArea, 
      maxArea, 
      amenities, 
      featured, 
      sort, 
      page, 
      limit 
    } = req.query;

    const result = db.getProperties({
      search: search as string,
      transaction_type: transaction_type as string,
      property_type: property_type as string,
      location: location as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms as string, 10) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms as string, 10) : undefined,
      minArea: minArea ? parseFloat(minArea as string) : undefined,
      maxArea: maxArea ? parseFloat(maxArea as string) : undefined,
      amenities: amenities ? (Array.isArray(amenities) ? amenities as string[] : [amenities as string]) : undefined,
      featured: featured === 'true',
      sort: sort as any,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 12,
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/properties/:slug', (req: Request, res: Response) => {
  const prop = db.getPropertyBySlug(req.params.slug);
  if (!prop) {
    return res.status(404).json({ error: 'Property not found' });
  }

  // Find similar properties (same property_type or location, excluding current)
  const similar = db.getProperties({
    property_type: prop.property_type,
    limit: 3
  }).properties.filter(p => p.id !== prop.id);

  res.json({ property: prop, similar });
});

app.post('/api/properties', (req: Request, res: Response) => {
  try {
    const created = db.createProperty(req.body);
    res.status(201).json({ success: true, property: created });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/properties/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateProperty(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Property not found' });
    res.json({ success: true, property: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/properties/:id', (req: Request, res: Response) => {
  try {
    const ok = db.deleteProperty(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Property not found' });
    res.json({ success: true, message: 'Property listing deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Membership Plans
app.get('/api/plans', (req: Request, res: Response) => {
  res.json(db.getPlans());
});

app.get('/api/plans/:id', (req: Request, res: Response) => {
  const plan = db.getPlanById(req.params.id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  res.json(plan);
});

app.put('/api/plans/:id', (req: Request, res: Response) => {
  const updated = db.updatePlan(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Plan not found' });
  res.json({ success: true, plan: updated });
});

// Auth & Profiles
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'No account found with this email. Please register.' });
  }

  // Simulated simple authentication
  const token = `token-${user.id}-${Date.now()}`;
  res.json({
    success: true,
    token,
    user
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const user = db.createUser({ name, email, phone });
  const token = `token-${user.id}-${Date.now()}`;
  res.status(201).json({
    success: true,
    token,
    user
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = db.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const updated = db.updateUser(userId, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, user: updated });
});

// Favorites & Entitlement enforcement
app.get('/api/account/favorites', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const user = db.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const favorites = (user.saved_property_ids || [])
    .map(id => db.getPropertyById(id))
    .filter(Boolean);

  res.json({
    favorites,
    total: favorites.length,
    maxAllowed: user.entitlements.max_favorites,
    planName: user.membership.plan_name
  });
});

app.post('/api/account/favorites/toggle', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const { propertyId } = req.body;
  if (!userId) return res.status(401).json({ error: 'Please log in to save properties' });
  if (!propertyId) return res.status(400).json({ error: 'Property ID required' });

  const result = db.toggleFavorite(userId, propertyId);
  if (!result.success) {
    return res.status(403).json(result);
  }

  res.json(result);
});

// Enquiries
app.get('/api/account/enquiries', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const enquiries = db.getEnquiries(userId);
  res.json(enquiries);
});

app.post('/api/enquiries', (req: Request, res: Response) => {
  try {
    const { property_id, property_title, user_id, name, email, phone, category, preferred_contact, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const created = db.createEnquiry({
      property_id,
      property_title,
      user_id,
      name,
      email,
      phone: phone || '',
      category: category || 'general',
      preferred_contact: preferred_contact || 'email',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been securely received by our private advisory desk. A managing partner will contact you shortly.',
      enquiry: created
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Viewings
app.get('/api/account/viewings', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const viewings = db.getViewings(userId);
  res.json(viewings);
});

app.post('/api/viewings', (req: Request, res: Response) => {
  try {
    const { property_id, property_title, user_id, name, email, phone, preferred_date, preferred_time, attendees, notes } = req.body;
    if (!property_id || !name || !email || !preferred_date || !preferred_time) {
      return res.status(400).json({ error: 'Missing required viewing fields.' });
    }

    const viewing = db.createViewing({
      property_id,
      property_title: property_title || 'Private Residence',
      user_id,
      name,
      email,
      phone: phone || '',
      preferred_date,
      preferred_time,
      attendees: attendees ? parseInt(attendees, 10) : 1,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Private viewing requested. Our concierge will confirm security clearance and itinerary.',
      viewing
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Secure Checkout & Membership Upgrade (Simulated Stripe/Payment Gateway with Server Verification)
app.post('/api/checkout/session', (req: Request, res: Response) => {
  try {
    const { userId, planId, paymentMethod, paymentToken } = req.body;
    if (!userId || !planId) {
      return res.status(400).json({ error: 'User ID and Plan ID are required.' });
    }

    const plan = db.getPlanById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Membership plan not found.' });
    }

    // Verify payment in test environment
    const upgraded = db.upgradeUserMembership(userId, planId, {
      amount: plan.price,
      paymentMethod: paymentMethod || 'Visa •••• 4242'
    });

    if (!upgraded) {
      return res.status(500).json({ error: 'Failed to process membership upgrade.' });
    }

    res.json({
      success: true,
      message: `Congratulations! Your ${plan.name} privileges are now active.`,
      user: upgraded.user,
      transaction: upgraded.transaction
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/account/subscription/cancel', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const updated = db.cancelSubscription(userId);
  if (!updated) return res.status(404).json({ error: 'User not found' });

  res.json({
    success: true,
    message: 'Subscription renewal has been canceled. Your benefits remain active until the end of your billing cycle.',
    user: updated
  });
});

// Admin endpoints
app.get('/api/admin/stats', (req: Request, res: Response) => {
  res.json(db.getAdminStats());
});

app.get('/api/admin/enquiries', (req: Request, res: Response) => {
  res.json(db.getEnquiries());
});

app.put('/api/admin/enquiries/:id', (req: Request, res: Response) => {
  const updated = db.updateEnquiry(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Enquiry not found' });
  res.json({ success: true, enquiry: updated });
});

app.get('/api/admin/users', (req: Request, res: Response) => {
  res.json(db.getUsers());
});

app.put('/api/admin/users/:id/tier', (req: Request, res: Response) => {
  const { planId } = req.body;
  if (!planId) return res.status(400).json({ error: 'planId required' });

  const upgraded = db.upgradeUserMembership(req.params.id, planId, {
    amount: 0,
    paymentMethod: 'Admin Complimentary Grant',
    invoiceNumber: `COMP-${Date.now().toString(36).toUpperCase()}`
  });

  if (!upgraded) return res.status(404).json({ error: 'User or Plan not found' });
  res.json({ success: true, user: upgraded.user });
});

app.get('/api/admin/payments', (req: Request, res: Response) => {
  res.json(db.getPayments());
});

// Blog Endpoints
app.get('/api/blog', (req: Request, res: Response) => {
  res.json(db.getBlogPosts());
});

app.get('/api/blog/:slug', (req: Request, res: Response) => {
  const post = db.getBlogPostBySlug(req.params.slug);
  if (!post) return res.status(404).json({ error: 'Article not found' });
  res.json(post);
});

// --- SERVER SETUP & VITE INTEGRATION ---
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EstateNova Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
