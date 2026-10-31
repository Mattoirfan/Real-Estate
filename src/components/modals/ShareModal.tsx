import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Twitter, Mail } from 'lucide-react';
import { Property } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  property
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !property) return null;

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/properties/${property.slug}` 
    : `https://estatenova.com/properties/${property.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(`Explore ${property.title} with EstateNova Private Residences:`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 font-['Manrope'] text-lg">
            Share Residence
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <img 
              src={property.image_urls[0]} 
              alt={property.title} 
              className="w-16 h-12 object-cover rounded-md shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900 truncate">{property.title}</div>
              <div className="text-xs text-slate-500">{property.city}, {property.country}</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-700 select-all"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-medium rounded-lg shrink-0 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C6A76A]" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Share via</label>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 border border-slate-200 hover:border-emerald-500 rounded-lg flex flex-col items-center gap-1 text-slate-700 hover:text-emerald-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-medium">WhatsApp</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 border border-slate-200 hover:border-blue-400 rounded-lg flex flex-col items-center gap-1 text-slate-700 hover:text-blue-500 transition-colors"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-medium">X (Twitter)</span>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(property.title)}&body=${shareText}%20${encodeURIComponent(currentUrl)}`}
                className="p-2.5 border border-slate-200 hover:border-[#C6A76A] rounded-lg flex flex-col items-center gap-1 text-slate-700 hover:text-[#C6A76A] transition-colors"
              >
                <Mail className="w-5 h-5 text-[#C6A76A]" />
                <span className="text-xs font-medium">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
