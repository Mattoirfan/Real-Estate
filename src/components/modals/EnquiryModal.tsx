import React, { useState } from 'react';
import { X, Send, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import { Property } from '../../types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  initialCategory?: 'general' | 'viewing' | 'offer' | 'valuation' | 'membership';
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  property,
  initialCategory = 'general'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'whatsapp'>('email');
  const [message, setMessage] = useState(
    property ? `I am interested in ${property.title} in ${property.city}. Please provide a comprehensive prospectus and private viewing availability.` : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.submitEnquiry({
        property_id: property?.id,
        property_title: property?.title,
        name,
        email,
        phone,
        category,
        preferred_contact: preferredContact,
        message
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || 'Failed to submit enquiry.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-[#0B132B] text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Close enquiry modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-[#C6A76A] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
            Private Client Advisory
          </div>
          <h2 className="text-xl font-bold font-['Manrope'] text-white">
            {property ? `Enquire: ${property.title}` : 'Submit Confidential Inquiry'}
          </h2>
          {property && (
            <p className="text-xs text-slate-300 mt-1">
              Direct connection to {property.agent.name} · Managing Advisor
            </p>
          )}
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-['Manrope'] text-slate-900">
              Inquiry Dispatched
            </h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Thank you, <strong className="text-slate-900">{name}</strong>. Your confidential inquiry has been routed to our managing director. You will be contacted via {preferredContact} within 4 business hours.
            </p>
            <button
              onClick={() => { setSuccess(false); onClose(); }}
              className="mt-4 px-6 py-2 bg-[#0B132B] text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Inquiry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                >
                  <option value="general">General Information</option>
                  <option value="viewing">Private Tour Request</option>
                  <option value="offer">Formal Acquisition / Offer</option>
                  <option value="valuation">Confidential Valuation</option>
                  <option value="membership">Membership Advisory</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Contact Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(['email', 'phone', 'whatsapp'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPreferredContact(method)}
                    className={`py-1.5 px-3 text-xs font-medium capitalize rounded-lg border transition-colors ${
                      preferredContact === method 
                        ? 'bg-[#0B132B] text-white border-[#0B132B]' 
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Message / Requirements</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0B132B] hover:bg-[#1C2541] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#C6A76A]" />
              <span>{loading ? 'Transmitting...' : 'Send Confidential Inquiry'}</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              We respect your confidentiality. Details are never shared with third parties.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
