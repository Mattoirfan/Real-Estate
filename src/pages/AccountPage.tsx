import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Bookmark, 
  Mail, 
  ShieldCheck, 
  CreditCard, 
  Calendar, 
  LogOut, 
  ArrowUpRight, 
  Check, 
  Sparkles, 
  AlertCircle,
  Clock,
  Trash2,
  Lock,
  Download
} from 'lucide-react';
import { User, Property, Enquiry, ViewingRequest, PaymentTransaction } from '../types';
import { api } from '../services/api';
import { PropertyCard } from '../components/property/PropertyCard';

interface AccountPageProps {
  currentUser: User | null;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  initialTab?: string;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
  onLogout,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'enquiries' | 'viewings' | 'membership' | 'profile'>(
    (initialTab as any) || 'overview'
  );

  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [viewings, setViewings] = useState<ViewingRequest[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form States
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccountData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const [savedRes, enqRes, viewRes] = await Promise.all([
          api.getSavedProperties(),
          api.getMyEnquiries(),
          api.getMyViewings()
        ]);
        setSavedProperties(savedRes.favorites);
        setEnquiries(enqRes);
        setViewings(viewRes);
      } catch (err) {
        console.warn('Account load error', err);
      } finally {
        setLoading(false);
      }
    }
    loadAccountData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-36 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-['Manrope'] text-slate-900">
            Private Client Portal
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please authenticate to access your saved portfolio, scheduled viewings, and active membership entitlements.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAuth}
              className="px-6 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = async (propId: string) => {
    const res = await api.toggleFavorite(propId);
    if (res.success) {
      setSavedProperties(prev => prev.filter(p => p.id !== propId));
    } else if (res.error) {
      alert(res.error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you wish to cancel automatic renewal for your membership? Your privileges remain active until the end of your billing cycle.')) {
      return;
    }
    const res = await api.cancelSubscription();
    if (res.success) {
      alert('Subscription renewal cancelled.');
      await api.refreshProfile();
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    const res = await api.updateProfile({ name, phone });
    setProfileSaving(false);
    if (res.success) {
      setProfileMessage('Profile details successfully updated.');
      setTimeout(() => setProfileMessage(null), 3000);
    } else {
      setProfileMessage(res.error || 'Failed to update profile.');
    }
  };

  const membership = currentUser.membership;
  const isMonthly = membership.billing_interval === 'monthly';

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-24">
      
      {/* Account Hero Top */}
      <div className="bg-[#0B132B] text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#C6A76A]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-['Manrope']">{currentUser.name}</h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#C6A76A] text-[#0B132B] rounded">
                    {membership.plan_name}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{currentUser.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/services')}
                className="py-2 px-4 bg-[#C6A76A] hover:bg-[#B8934A] text-[#0B132B] text-xs font-bold rounded-lg transition-colors"
              >
                Change Membership Tier
              </button>
              <button
                onClick={onLogout}
                className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-white/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar Tabs */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: UserIcon },
                { id: 'saved', label: `Saved Residences (${savedProperties.length})`, icon: Bookmark },
                { id: 'enquiries', label: `My Enquiries (${enquiries.length})`, icon: Mail },
                { id: 'viewings', label: `Viewing Itineraries (${viewings.length})`, icon: Calendar },
                { id: 'membership', label: 'Membership & Billing', icon: ShieldCheck },
                { id: 'profile', label: 'Profile Settings', icon: UserIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors text-left ${
                      active
                        ? 'bg-[#0B132B] text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#C6A76A]' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Entitlement Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Saved Properties</span>
                    <div className="text-2xl font-bold font-['Manrope'] text-slate-900 mt-1 tabular-nums">
                      {savedProperties.length} <span className="text-xs text-slate-400 font-normal">/ {currentUser.entitlements.max_favorites > 100 ? '∞' : currentUser.entitlements.max_favorites}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Allowed on {membership.plan_name} plan
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Broker Contact</span>
                    <div className="text-base font-bold font-['Manrope'] text-emerald-700 mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{currentUser.entitlements.direct_agent_contact ? 'Direct Cell & WhatsApp' : 'Standard Advisory'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {currentUser.entitlements.direct_agent_contact ? 'Active entitlement' : 'Upgrade to Plus to unlock'}
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Membership Status</span>
                    <div className="text-base font-bold font-['Manrope'] text-slate-900 mt-1 capitalize flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C6A76A]" />
                      <span>{membership.status}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {isMonthly ? `Next renewal: ${membership.expires_at ? new Date(membership.expires_at).toLocaleDateString() : 'Active'}` : 'Permanent lifetime account'}
                    </div>
                  </div>
                </div>

                {/* Recent Saved Properties preview */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold font-['Manrope'] text-slate-900">
                      Recent Saved Residences
                    </h3>
                    <button
                      onClick={() => setActiveTab('saved')}
                      className="text-xs font-semibold text-[#0B132B] hover:text-[#B8934A]"
                    >
                      View All ({savedProperties.length})
                    </button>
                  </div>

                  {savedProperties.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      You haven’t saved any residences yet.{' '}
                      <button onClick={() => onNavigate('/properties')} className="text-[#0B132B] font-semibold underline">
                        Explore properties
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedProperties.slice(0, 2).map(prop => (
                        <div key={prop.id} className="p-3 bg-[#FAFAF8] rounded-lg border border-slate-200 flex items-center gap-3">
                          <img src={prop.image_urls[0]} alt={prop.title} className="w-16 h-14 object-cover rounded-md shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 truncate">{prop.title}</div>
                            <div className="text-[11px] text-slate-500">{prop.city} · ${prop.price.toLocaleString()}</div>
                          </div>
                          <button
                            onClick={() => onNavigate(`/properties/${prop.slug}`)}
                            className="p-1.5 text-slate-400 hover:text-slate-900"
                          >
                            <ArrowUpRight className="w-4 h-4 text-[#C6A76A]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. SAVED PROPERTIES TAB */}
            {activeTab === 'saved' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold font-['Manrope'] text-slate-900">
                      Saved Residences
                    </h3>
                    <div className="text-xs text-slate-500">
                      You have saved <strong>{savedProperties.length}</strong> of <strong>{currentUser.entitlements.max_favorites > 100 ? 'unlimited' : currentUser.entitlements.max_favorites}</strong> properties allowed on your plan.
                    </div>
                  </div>
                </div>

                {savedProperties.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 space-y-3">
                    <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs">You have no saved properties in your portfolio.</p>
                    <button
                      onClick={() => onNavigate('/properties')}
                      className="px-4 py-2 bg-[#0B132B] text-white text-xs font-semibold rounded-lg"
                    >
                      Browse Available Residences
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedProperties.map(property => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onViewDetails={(s) => onNavigate(`/properties/${s}`)}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorited={true}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. ENQUIRIES TAB */}
            {activeTab === 'enquiries' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3">
                  Submitted Advisory Inquiries
                </h3>

                {enquiries.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No inquiries recorded. All confidential requests will appear here with active broker notes.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                          <th className="py-2.5 pr-3">Date</th>
                          <th className="py-2.5 px-3">Subject / Residence</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 pl-3">Broker Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {enquiries.map((enq) => (
                          <tr key={enq.id}>
                            <td className="py-3 pr-3 text-slate-500 font-mono">
                              {new Date(enq.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-3 font-semibold text-slate-900">
                              {enq.property_title || 'General Advisory'}
                            </td>
                            <td className="py-3 px-3 capitalize text-slate-600">
                              {enq.category}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                enq.status === 'contacted' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                              }`}>
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-3 pl-3 text-slate-600 italic">
                              {enq.notes || 'Under review by managing partner desk'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. VIEWINGS TAB */}
            {activeTab === 'viewings' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3">
                  Accompanied Viewing Itineraries
                </h3>

                {viewings.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No viewings currently scheduled.{' '}
                    <button onClick={() => onNavigate('/properties')} className="text-[#0B132B] font-semibold underline">
                      Schedule a tour from any residence page
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {viewings.map(v => (
                      <div key={v.id} className="p-4 bg-[#FAFAF8] rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{v.property_title}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                            <Calendar className="w-3.5 h-3.5 text-[#C6A76A]" />
                            <span>{v.preferred_date} at {v.preferred_time}</span>
                            <span>·</span>
                            <span>Party of {v.attendees}</span>
                          </div>
                          {v.notes && <div className="text-[11px] text-slate-500 mt-1 italic">Notes: {v.notes}</div>}
                        </div>
                        <div className="shrink-0">
                          <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded">
                            {v.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. MEMBERSHIP & BILLING TAB */}
            {activeTab === 'membership' && (
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <span className="text-[11px] font-bold text-[#B8934A] uppercase tracking-wider">Current Membership</span>
                    <h3 className="text-2xl font-bold font-['Manrope'] text-slate-900 mt-0.5">
                      {membership.plan_name} Privileges
                    </h3>
                    <div className="text-xs text-slate-500 mt-1">
                      Status: <strong className="text-emerald-700 capitalize">{membership.status}</strong> · Started on {new Date(membership.started_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('/services')}
                      className="py-2 px-4 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg"
                    >
                      Upgrade Plan
                    </button>
                    {isMonthly && membership.status === 'active' && (
                      <button
                        onClick={handleCancelSubscription}
                        className="py-2 px-3 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg border border-red-200"
                      >
                        Cancel Renewal
                      </button>
                    )}
                  </div>
                </div>

                {/* Entitlements Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Verified Server Entitlements:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Check className="w-4 h-4 text-[#C6A76A]" />
                      <span>Max Saved Favorites: <strong>{currentUser.entitlements.max_favorites > 100 ? 'Unlimited' : currentUser.entitlements.max_favorites}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Check className="w-4 h-4 text-[#C6A76A]" />
                      <span>Direct Broker Contact: <strong>{currentUser.entitlements.direct_agent_contact ? 'Enabled' : 'Disabled'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Check className="w-4 h-4 text-[#C6A76A]" />
                      <span>Off-Market 48h Advance Alerts: <strong>{currentUser.entitlements.priority_alerts ? 'Active' : 'Not Included'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Check className="w-4 h-4 text-[#C6A76A]" />
                      <span>Listing Credits: <strong>{currentUser.entitlements.listing_credits} per month</strong></span>
                    </div>
                  </div>
                </div>

                {/* Simulated Payment Receipt */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Recent Billing Transaction
                  </h4>
                  <div className="p-4 bg-[#FAFAF8] rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">{membership.plan_name} Purchase</div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        Ref: {membership.last_payment_id || 'TX-INITIAL'} · Billed via Card
                      </div>
                    </div>
                    <button
                      onClick={() => alert('Official PDF Tax Invoice downloaded.')}
                      className="flex items-center gap-1.5 text-xs text-[#0B132B] font-semibold hover:underline"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C6A76A]" />
                      <span>Download Invoice PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PROFILE SETTINGS TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-base font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-3">
                  Client Profile Information
                </h3>

                {profileMessage && (
                  <div className="p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                    {profileMessage}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email (Immutable)</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-5 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      {profileSaving ? 'Saving...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
