import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Mail, 
  CreditCard, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Check, 
  X, 
  Lock, 
  TrendingUp, 
  ShieldCheck, 
  Save,
  Search,
  ExternalLink
} from 'lucide-react';
import { Property, User, Enquiry, PaymentTransaction, SiteConfig } from '../types';
import { api } from '../services/api';

interface AdminPageProps {
  currentUser: User | null;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'enquiries' | 'users' | 'payments' | 'config'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // New/Edit Property Modal State
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propForm, setPropForm] = useState({
    title: '',
    slug: '',
    description: '',
    transaction_type: 'sale',
    property_type: 'villa',
    price: 5000000,
    currency: 'USD',
    city: 'New York',
    region: 'NY',
    country: 'United States',
    address: '100 Central Park South',
    bedrooms: 4,
    bathrooms: 5,
    area: 4500,
    area_unit: 'sq ft',
    amenities: 'Pool, Wine Cellar, Concierge',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    featured_status: true,
    listing_status: 'available',
    is_sample: true
  });

  // Config Form
  const [configSuccess, setConfigSuccess] = useState(false);

  // Fetch admin data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, propsData, enqData, usersData, payData, confData] = await Promise.all([
        api.getAdminStats(),
        api.getProperties({ limit: 100 }),
        api.getAdminEnquiries(),
        api.getAdminUsers(),
        api.getAdminPayments(),
        api.getConfig()
      ]);
      setStats(statsData);
      setProperties(propsData.properties);
      setEnquiries(enqData);
      setUsers(usersData);
      setPayments(payData);
      setConfig(confData);
    } catch (err) {
      console.warn('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [currentUser]);

  // Handle unauthorized public visitors
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-36 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-['Manrope'] text-slate-900">
            Authorized Personnel Only
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The EstateNova administrative dashboard requires executive broker credentials. Please sign in with an administrator account (or use the one-click Admin Demo login in the auth modal).
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg"
            >
              Sign In to Admin Portal
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Property Handlers
  const handleOpenAddProperty = () => {
    setEditingPropertyId(null);
    setPropForm({
      title: '',
      slug: '',
      description: '',
      transaction_type: 'sale',
      property_type: 'villa',
      price: 5000000,
      currency: 'USD',
      city: 'Los Angeles',
      region: 'CA',
      country: 'United States',
      address: '742 Evergreen Terrace',
      bedrooms: 5,
      bathrooms: 6,
      area: 6200,
      area_unit: 'sq ft',
      amenities: 'Infinity Pool, Private Elevator, Wine Cellar',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      featured_status: true,
      listing_status: 'available',
      is_sample: true
    });
    setPropertyModalOpen(true);
  };

  const handleEditProperty = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setPropForm({
      title: prop.title,
      slug: prop.slug,
      description: prop.description,
      transaction_type: prop.transaction_type,
      property_type: prop.property_type,
      price: prop.price,
      currency: prop.currency,
      city: prop.city,
      region: prop.region,
      country: prop.country,
      address: prop.address,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      area: prop.area,
      area_unit: prop.area_unit,
      amenities: prop.amenities.join(', '),
      image_url: prop.image_urls[0] || '',
      featured_status: prop.featured_status,
      listing_status: prop.listing_status,
      is_sample: prop.is_sample
    });
    setPropertyModalOpen(true);
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: propForm.title,
      slug: propForm.slug || propForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: propForm.description,
      transaction_type: propForm.transaction_type,
      property_type: propForm.property_type,
      price: Number(propForm.price),
      currency: propForm.currency,
      city: propForm.city,
      region: propForm.region,
      country: propForm.country,
      address: propForm.address,
      latitude: 40.7128,
      longitude: -74.0060,
      bedrooms: Number(propForm.bedrooms),
      bathrooms: Number(propForm.bathrooms),
      area: Number(propForm.area),
      area_unit: propForm.area_unit,
      amenities: propForm.amenities.split(',').map(s => s.trim()).filter(Boolean),
      image_urls: [propForm.image_url],
      agent: {
        id: 'agent-01',
        name: 'Victoria Vance',
        title: 'Managing Director, West Coast Estates',
        phone: '+1 (310) 849-2190',
        email: 'victoria.vance@estatenova.com',
        whatsapp: '+13108492190',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior broker advising high-net-worth acquisitions.',
        languages: ['English', 'French']
      },
      listing_status: propForm.listing_status as any,
      featured_status: propForm.featured_status,
      is_sample: propForm.is_sample,
      year_built: 2024,
      parking_spaces: 3,
      published_at: new Date().toISOString()
    };

    try {
      if (editingPropertyId) {
        await api.updateProperty(editingPropertyId, payload);
      } else {
        await api.createProperty(payload);
      }
      setPropertyModalOpen(false);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save property listing');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this property listing?')) return;
    const ok = await api.deleteProperty(id);
    if (ok) {
      await loadAdminData();
    } else {
      alert('Delete failed');
    }
  };

  // Enquiry status change
  const handleUpdateEnquiryStatus = async (id: string, status: any, notes?: string) => {
    await api.updateAdminEnquiry(id, { status, notes });
    await loadAdminData();
  };

  // User Tier Override
  const handleOverrideTier = async (userId: string, planId: string) => {
    await api.overrideUserTier(userId, planId);
    await loadAdminData();
    alert('User tier override applied immediately.');
  };

  // Save config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    await api.updateConfig(config);
    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-24">
      
      {/* Admin Top Header */}
      <div className="bg-[#0B132B] text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C6A76A]">
              <ShieldCheck className="w-4 h-4 text-[#C6A76A]" />
              <span>Executive Admin Console</span>
            </div>
            <h1 className="text-2xl font-bold font-['Manrope'] mt-1">Platform Operations & Control</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/')}
              className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C6A76A]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 mb-8 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'properties', label: `Listings Manager (${properties.length})`, icon: Building2 },
            { id: 'enquiries', label: `Inquiries & Leads (${enquiries.length})`, icon: Mail },
            { id: 'users', label: `Members & Clients (${users.length})`, icon: Users },
            { id: 'payments', label: `Transactions Log (${payments.length})`, icon: CreditCard },
            { id: 'config', label: 'Site & Brand Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-lg flex items-center gap-2 transition-colors ${
                  active 
                    ? 'bg-[#0B132B] text-white' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#C6A76A]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW METRICS */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Listings</span>
                <div className="text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1 tabular-nums">
                  {stats.totalProperties}
                </div>
                <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <span>{stats.availableProperties} available for sale/rent</span>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Inquiries</span>
                <div className="text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1 tabular-nums">
                  {stats.pendingEnquiries}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {stats.totalEnquiries} total leads logged
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subscribers</span>
                <div className="text-3xl font-extrabold font-['Manrope'] text-slate-900 mt-1 tabular-nums">
                  {stats.activeSubscribers}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Active paid membership holders
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Membership Revenue</span>
                <div className="text-3xl font-extrabold font-['Manrope'] text-[#B8934A] mt-1 tabular-nums">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Processed via simulated test gateway
                </div>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="p-6 bg-[#FAFAF8] rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold font-['Manrope'] text-slate-900">
                  Listing Management
                </h3>
                <p className="text-xs text-slate-500">
                  Publish new estates or modify existing portfolio records with instant live persistence.
                </p>
              </div>
              <button
                onClick={handleOpenAddProperty}
                className="py-2.5 px-4 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-[#C6A76A]" />
                <span>Create New Listing</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. PROPERTIES MANAGER TAB */}
        {activeTab === 'properties' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-['Manrope'] text-slate-900">
                  Portfolio Listings Directory
                </h3>
                <div className="text-xs text-slate-500">
                  {properties.length} total residences saved in local database engine.
                </div>
              </div>
              <button
                onClick={handleOpenAddProperty}
                className="py-2 px-4 bg-[#0B132B] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5 text-[#C6A76A]" />
                <span>Add Property</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-3 pr-3">Photo</th>
                    <th className="py-3 px-3">Title & Location</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Featured</th>
                    <th className="py-3 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 pr-3">
                        <img src={p.image_urls[0]} alt={p.title} className="w-12 h-10 object-cover rounded-md" />
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs truncate">
                        <div>{p.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{p.city}, {p.country}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold">
                        ${p.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 capitalize text-slate-600">
                        {p.property_type}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          p.listing_status === 'available' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {p.listing_status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {p.featured_status ? (
                          <span className="text-amber-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onNavigate(`/properties/${p.slug}`)}
                            className="p-1.5 text-slate-500 hover:text-slate-900"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditProperty(p)}
                            className="p-1.5 text-blue-600 hover:text-blue-800"
                            title="Edit Listing"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(p.id)}
                            className="p-1.5 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3">
              Client Inquiries & Lead Management
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-3 pr-3">Date</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Property / Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Notes</th>
                    <th className="py-3 pl-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enquiries.map(enq => (
                    <tr key={enq.id} className="hover:bg-slate-50">
                      <td className="py-3 pr-3 font-mono text-slate-400">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {enq.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div>{enq.email}</div>
                        <div className="text-[11px] text-slate-400">{enq.phone} via {enq.preferred_contact}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-800 max-w-xs truncate">
                        {enq.property_title || `General: ${enq.category}`}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          enq.status === 'contacted' 
                            ? 'bg-emerald-50 text-emerald-800' 
                            : enq.status === 'reviewed' 
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-amber-50 text-amber-800'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 max-w-xs truncate italic">
                        {enq.notes || enq.message}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. USERS & MEMBERSHIPS TAB */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3">
              Registered Clients & Entitlement Overrides
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-3 pr-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Active Membership Tier</th>
                    <th className="py-3 px-3">Favorites Saved</th>
                    <th className="py-3 pl-3 text-right">Override Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3 pr-3 font-semibold text-slate-900">
                        {u.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {u.email}
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px] font-bold text-slate-500">
                        {u.role}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#B8934A]">
                        {u.membership.plan_name} ({u.membership.status})
                      </td>
                      <td className="py-3 px-3 tabular-nums">
                        {u.saved_property_ids?.length || 0} / {u.entitlements.max_favorites}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <select
                          value={u.membership.plan_id}
                          onChange={(e) => handleOverrideTier(u.id, e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                        >
                          <option value="plan-starter">Starter ($99)</option>
                          <option value="plan-plus">Plus ($149)</option>
                          <option value="plan-premium">Premium ($199/mo)</option>
                          <option value="plan-elite">Elite ($499/mo)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. PAYMENTS AUDIT TAB */}
        {activeTab === 'payments' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3">
              Payment & Subscription Transactions Audit
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-3 pr-3">Invoice #</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Plan</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 pl-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 pr-3 font-mono font-bold text-slate-900">
                        {p.invoice_number}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{p.user_name}</div>
                        <div className="text-[10px] text-slate-400">{p.user_email}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {p.plan_name}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        ${p.amount} {p.currency}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">
                        {p.payment_method}
                      </td>
                      <td className="py-3 pl-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. SITE & BRAND CONFIG TAB */}
        {activeTab === 'config' && config && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs max-w-2xl space-y-6">
            <h3 className="text-lg font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3">
              Brand & Organization Configuration
            </h3>

            {configSuccess && (
              <div className="p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                Site parameters updated and saved to server database.
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={config.brand_name}
                  onChange={(e) => setConfig({ ...config, brand_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={config.contact_email}
                    onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={config.contact_phone}
                    onChange={(e) => setConfig({ ...config, contact_phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Office Street Address</label>
                <input
                  type="text"
                  value={config.office_address.street}
                  onChange={(e) => setConfig({
                    ...config,
                    office_address: { ...config.office_address, street: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Global Configuration
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Property Create/Edit Modal */}
      {propertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-[#0B132B] text-white flex items-center justify-between">
              <h3 className="font-bold font-['Manrope'] text-base">
                {editingPropertyId ? 'Edit Property Listing' : 'Publish New Luxury Residence'}
              </h3>
              <button onClick={() => setPropertyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={propForm.title}
                  onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                  placeholder="e.g. The Bel Air Horizon Sanctuary"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction *</label>
                  <select
                    value={propForm.transaction_type}
                    onChange={(e) => setPropForm({ ...propForm, transaction_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="sale">Sale (Acquisition)</option>
                    <option value="rent">Rent (Lease)</option>
                    <option value="lease">Commercial Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Type *</label>
                  <select
                    value={propForm.property_type}
                    onChange={(e) => setPropForm({ ...propForm, property_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">Townhouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    value={propForm.price}
                    onChange={(e) => setPropForm({ ...propForm, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={propForm.city}
                    onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={propForm.country}
                    onChange={(e) => setPropForm({ ...propForm, country: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    value={propForm.address}
                    onChange={(e) => setPropForm({ ...propForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={propForm.bedrooms}
                    onChange={(e) => setPropForm({ ...propForm, bedrooms: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={propForm.bathrooms}
                    onChange={(e) => setPropForm({ ...propForm, bathrooms: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Area (sq ft)</label>
                  <input
                    type="number"
                    value={propForm.area}
                    onChange={(e) => setPropForm({ ...propForm, area: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={propForm.image_url}
                  onChange={(e) => setPropForm({ ...propForm, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={propForm.amenities}
                  onChange={(e) => setPropForm({ ...propForm, amenities: e.target.value })}
                  placeholder="Pool, Spa, Wine Cellar, Elevator"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={propForm.description}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={propForm.featured_status}
                    onChange={(e) => setPropForm({ ...propForm, featured_status: e.target.checked })}
                  />
                  <span>Curated / Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={propForm.is_sample}
                    onChange={(e) => setPropForm({ ...propForm, is_sample: e.target.checked })}
                  />
                  <span>Mark as Sample Demo Listing</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPropertyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold rounded-lg"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
