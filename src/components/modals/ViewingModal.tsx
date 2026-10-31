import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Property } from '../../types';

interface ViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({
  isOpen,
  onClose,
  property
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('2026-11-12');
  const [time, setTime] = useState('14:00');
  const [attendees, setAttendees] = useState(2);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.requestViewing({
        property_id: property.id,
        property_title: property.title,
        name,
        email,
        phone,
        preferred_date: date,
        preferred_time: time,
        attendees,
        notes
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || 'Failed to submit viewing request.');
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
            aria-label="Close viewing modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-[#C6A76A] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
            Private Viewings Desk
          </div>
          <h2 className="text-xl font-bold font-['Manrope'] text-white">
            Schedule Accompanied Tour
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {property.title} · {property.city}
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#F4EEDF] text-[#C6A76A] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-['Manrope'] text-slate-900">
              Viewing Appointment Requested
            </h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Our partner broker will confirm security clearance and itinerary for <strong>{date} at {time}</strong>.
            </p>
            <button
              onClick={() => { setSuccess(false); onClose(); }}
              className="mt-4 px-6 py-2 bg-[#0B132B] text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
            >
              Close
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

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Party Size</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={attendees}
                  onChange={(e) => setAttendees(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Direct Contact Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Special Requirements (e.g. airport transfer, security)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes for our concierge team..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#C6A76A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0B132B] hover:bg-[#1C2541] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Submitting...' : 'Request Private Accompanied Viewing'}</span>
              <ArrowRight className="w-4 h-4 text-[#C6A76A]" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
