import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Globe2,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import { Property, SiteConfig, User } from '../types';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  currentUser: User | null;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, currentUser }) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [category, setCategory] = useState<'general' | 'viewing' | 'offer' | 'valuation' | 'membership'>('general');
  const [relatedPropertyId, setRelatedPropertyId] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'whatsapp'>('email');
  const [message, setMessage] = useState('');

  const [properties, setProperties] = useState<Property[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');

  useEffect(() => {
    async function loadInitial() {
      try {
        const [propsRes, conf] = await Promise.all([
          api.getProperties({ limit: 50 }),
          api.getConfig()
        ]);
        setProperties(propsRes.properties);
        setConfig(conf);
      } catch (e) {
        console.warn('Initial contact load error', e);
      }
    }
    loadInitial();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const selectedProp = properties.find(p => p.id === relatedPropertyId);
      const res = await api.submitEnquiry({
        name,
        email,
        phone,
        category,
        property_id: relatedPropertyId || undefined,
        property_title: selectedProp?.title,
        preferred_contact: preferredContact,
        message
      });

      if (res.success && res.enquiry) {
        setSuccess(true);
        setTicketId(res.enquiry.id);
        setMessage('');
      } else {
        setError(res.error || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setError(err.message || 'Transmission error');
    } finally {
      setLoading(false);
    }
  };

  const regionalDesks = [
    {
      city: 'New York (Headquarters)',
      address: '450 Park Avenue, 21st Floor, New York, NY 10022',
      phone: '+1 (800) 378-2831',
      email: 'ny@estatenova.com',
      hours: 'Mon–Fri: 9:00 AM – 6:00 PM EST'
    },
    {
      city: 'London Mayfair',
      address: '14 Berkeley Square, Mayfair, London W1J 6BQ',
      phone: '+44 20 7946 0880',
      email: 'london@estatenova.com',
      hours: 'Mon–Fri: 9:00 AM – 6:00 PM GMT'
    },
    {
      city: 'Côte d’Azur & Monaco',
      address: 'Boulevard de la Croisette, 06400 Cannes, France',
      phone: '+33 4 93 34 22 10',
      email: 'cannes@estatenova.com',
      hours: 'Mon–Sat: 10:00 AM – 7:00 PM CET'
    },
    {
      city: 'Dubai International Financial Centre',
      address: 'Gate Precinct 4, DIFC, Dubai, UAE',
      phone: '+971 4 362 7000',
      email: 'dubai@estatenova.com',
      hours: 'Sun–Thu: 9:00 AM – 6:00 PM GST'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-24">
      
      {/* Top Banner */}
      <div className="bg-[#0B132B] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-[#C6A76A] text-xs font-semibold uppercase tracking-[0.24em] block mb-2">
            Direct Concierge & Inquiry Desk
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Manrope'] tracking-tight">
            Connect with Our Advisory Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
            Whether inquiring about a specific residence, discussing private portfolio disposition, or requesting membership access, our managing directors respond promptly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Inquiry Form Column */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold font-['Manrope'] text-slate-900">
                Confidential Inquiry Form
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Submissions are routed directly to the appropriate regional partner desk under strict NDA protocols.
              </p>
            </div>

            {success ? (
              <div className="p-8 text-center space-y-4 bg-[#FAFAF8] rounded-xl border border-slate-200">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-['Manrope'] text-slate-900">
                  Inquiry Accepted by Backend
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your inquiry has been logged under docket <span className="font-mono font-bold text-slate-900">{ticketId}</span>. A designated managing director will contact you via {preferredContact}.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2 bg-[#0B132B] text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lady Vivienne Vance"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone / Mobile</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Nature</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                    >
                      <option value="general">General Client Advisory</option>
                      <option value="viewing">Accompanied Tour Scheduling</option>
                      <option value="offer">Acquisition / Formal Offer</option>
                      <option value="valuation">Confidential Portfolio Valuation</option>
                      <option value="membership">Membership Tiers & Concierge</option>
                    </select>
                  </div>
                </div>

                {/* Related Property Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Property of Interest (Optional)</label>
                  <select
                    value={relatedPropertyId}
                    onChange={(e) => setRelatedPropertyId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                  >
                    <option value="">No Specific Residence / General Portfolio Inquiry</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} · {p.city} (${p.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Contact Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['email', 'phone', 'whatsapp'] as const).map(ch => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setPreferredContact(ch)}
                        className={`py-2 px-3 text-xs font-medium capitalize rounded-lg border transition-colors ${
                          preferredContact === ch
                            ? 'bg-[#0B132B] text-white border-[#0B132B]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message & Confidential Parameters *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify timeline, geographic preference, or acquisition objectives..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-[#C6A76A]" />
                    <span>{loading ? 'Transmitting Securely...' : 'Dispatch Confidential Inquiry'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C6A76A]" />
                  <span>Encrypted transmission. Your identity is strictly shielded.</span>
                </div>
              </form>
            )}
          </div>

          {/* Contact Details & Regional Desks Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-[#0B132B] text-white p-6 rounded-2xl shadow-md space-y-4">
              <span className="text-[#C6A76A] text-xs uppercase tracking-widest font-semibold">
                Direct Communication
              </span>
              <h3 className="text-xl font-bold font-['Manrope']">
                Global Headquarters
              </h3>

              <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-white/10">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C6A76A] shrink-0 mt-0.5" />
                  <span>450 Park Avenue, 21st Floor, New York, NY 10022</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C6A76A] shrink-0" />
                  <a href="tel:+18003782831" className="hover:text-white font-mono">
                    +1 (800) 378-2831
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C6A76A] shrink-0" />
                  <a href="mailto:advisory@estatenova.com" className="hover:text-white">
                    advisory@estatenova.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#C6A76A] shrink-0" />
                  <span>Monday – Friday: 9:00 AM – 6:00 PM EST</span>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-2">
                <a
                  href="https://wa.me/18003782831"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant Private WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Regional Desks List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold font-['Manrope'] text-slate-900 border-b border-slate-100 pb-2">
                Regional Partner Desks
              </h4>

              <div className="space-y-4">
                {regionalDesks.slice(1).map((desk, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <div className="font-bold text-slate-900">{desk.city}</div>
                    <div className="text-slate-500">{desk.address}</div>
                    <div className="flex items-center gap-3 text-slate-600 pt-0.5">
                      <a href={`tel:${desk.phone}`} className="hover:text-slate-900 font-mono">
                        {desk.phone}
                      </a>
                      <span>·</span>
                      <a href={`mailto:${desk.email}`} className="hover:text-[#B8934A]">
                        {desk.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
