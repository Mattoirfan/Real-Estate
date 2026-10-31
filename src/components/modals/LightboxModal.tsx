import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onSelectIndex: (idx: number) => void;
  title: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onSelectIndex,
  title
}) => {
  const next = useCallback(() => {
    onSelectIndex((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onSelectIndex]);

  const prev = useCallback(() => {
    onSelectIndex((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onSelectIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, next, prev, onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h4 className="text-sm font-semibold truncate max-w-md">{title}</h4>
          <span className="text-xs text-slate-400 font-mono">
            {currentIndex + 1} of {images.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 p-3 text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 p-3 text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Center Image */}
      <div className="max-w-5xl max-h-[85vh] flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`${title} - view ${currentIndex + 1}`}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
        />
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 overflow-x-auto px-4 z-10">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelectIndex(idx)}
            className={`w-16 h-12 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
              idx === currentIndex ? 'border-[#C6A76A] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
