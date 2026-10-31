import React, { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, Shield, ChevronDown, LogOut, Bookmark, FileText } from 'lucide-react';
import { Logo } from '../common/Logo';
import { User } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Properties', path: '/properties' },
    { label: 'Services & Plans', path: '/services' },
    { label: 'About Us', path: '/about' },
    { label: 'Insights', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const isDarkHero = currentPath === '/' && !isScrolled;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3' 
          : isDarkHero 
            ? 'bg-gradient-to-b from-[#0B132B]/90 via-[#0B132B]/60 to-transparent py-5' 
            : 'bg-white border-b border-slate-200 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (1 Primary Action) */}
        <div className="flex items-center justify-between gap-8">
          
          {/* Zone 1: Single Brand Wordmark */}
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center text-left focus:outline-none shrink-0"
            aria-label="EstateNova Home"
          >
            <Logo 
              variant="horizontal" 
              theme={isDarkHero && !isScrolled ? 'light' : 'dark'} 
              subline={false}
            />
          </button>

          {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const active = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                    active 
                      ? (isDarkHero && !isScrolled ? 'text-[#C6A76A] border-b-2 border-[#C6A76A]' : 'text-slate-900 border-b-2 border-[#C6A76A] font-semibold')
                      : (isDarkHero && !isScrolled ? 'text-slate-200 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action Area */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
                    isDarkHero && !isScrolled
                      ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
                  <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[#C6A76A] text-[10px] uppercase font-bold px-1.5 py-0.2 bg-[#0B132B] rounded">
                    {currentUser.membership?.plan_name || 'Member'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 text-xs text-slate-700 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-semibold text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    </div>

                    <button
                      onClick={() => handleLinkClick('/account')}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>Account Dashboard</span>
                    </button>

                    <button
                      onClick={() => handleLinkClick('/account?tab=saved')}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Bookmark className="w-4 h-4 text-slate-500" />
                      <span>Saved Properties ({currentUser.saved_property_ids?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => handleLinkClick('/account?tab=membership')}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-[#B8934A]"
                    >
                      <Shield className="w-4 h-4 text-[#C6A76A]" />
                      <span>Membership Privileges</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => handleLinkClick('/admin')}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-blue-700 font-semibold border-t border-slate-100"
                      >
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isDarkHero && !isScrolled
                    ? 'text-white hover:text-[#C6A76A]'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
            )}

            {/* Primary Action CTA */}
            <button
              onClick={() => handleLinkClick('/properties')}
              className="py-2 px-4 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 border border-transparent hover:border-[#C6A76A]"
            >
              Explore Properties
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${
                isDarkHero && !isScrolled ? 'text-white' : 'text-slate-800'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-6 pt-2 border-t border-slate-200/40 bg-white/95 backdrop-blur-md rounded-xl p-4 text-slate-900 shadow-xl space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className="w-full text-left py-2 px-3 text-sm font-medium hover:bg-slate-100 rounded-lg text-slate-800 flex items-center justify-between"
              >
                <span>{link.label}</span>
              </button>
            ))}

            <div className="pt-2 border-t border-slate-100 space-y-2">
              {currentUser ? (
                <>
                  <button
                    onClick={() => handleLinkClick('/account')}
                    className="w-full py-2 px-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-[#C6A76A]" />
                    <span>Account ({currentUser.name})</span>
                  </button>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleLinkClick('/admin')}
                      className="w-full py-2 px-3 text-left text-sm font-semibold text-blue-700 hover:bg-slate-100 rounded-lg"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="w-full py-2 px-3 text-left text-sm font-medium text-red-600 hover:bg-slate-100 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-4 bg-[#0B132B] text-white text-xs font-semibold rounded-lg text-center"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
