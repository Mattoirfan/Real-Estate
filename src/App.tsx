import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { AuthModal } from './components/modals/AuthModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { EnquiryModal } from './components/modals/EnquiryModal';
import { ViewingModal } from './components/modals/ViewingModal';

import { User, MembershipPlan, Property } from './types';
import { api } from './services/api';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [queryString, setQueryString] = useState<string>(window.location.search || '');
  const [currentUser, setCurrentUser] = useState<User | null>(api.getCurrentUser());

  // Global Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<MembershipPlan | null>(null);

  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedPropertyForEnquiry, setSelectedPropertyForEnquiry] = useState<Property | null>(null);

  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [selectedPropertyForViewing, setSelectedPropertyForViewing] = useState<Property | null>(null);

  // Subscribe to user authentication changes
  useEffect(() => {
    const unsubscribe = api.subscribeUser((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to popstate (back/forward browser navigation)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setQueryString(window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Handler
  const navigate = (fullUrl: string) => {
    const [pathPart, queryPart] = fullUrl.split('?');
    setCurrentPath(pathPart || '/');
    setQueryString(queryPart ? `?${queryPart}` : '');
    window.history.pushState(null, '', fullUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Checkout Modal
  const handleOpenCheckout = (plan: MembershipPlan) => {
    setSelectedPlanForCheckout(plan);
    setCheckoutModalOpen(true);
  };

  // Open Enquiry Modal
  const handleOpenEnquiry = (property?: Property) => {
    setSelectedPropertyForEnquiry(property || null);
    setEnquiryModalOpen(true);
  };

  // Open Viewing Modal
  const handleOpenViewing = (property: Property) => {
    setSelectedPropertyForViewing(property);
    setViewingModalOpen(true);
  };

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Home: /
    if (currentPath === '/') {
      return (
        <HomePage
          onNavigate={navigate}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenCheckout={handleOpenCheckout}
          onOpenEnquiry={handleOpenEnquiry}
        />
      );
    }

    // 2. Properties Listing: /properties
    if (currentPath === '/properties') {
      return (
        <PropertiesPage
          onNavigate={navigate}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenEnquiry={handleOpenEnquiry}
          searchQueryString={queryString}
        />
      );
    }

    // 3. Property Details: /properties/:slug
    if (currentPath.startsWith('/properties/')) {
      const slug = currentPath.replace('/properties/', '');
      return (
        <PropertyDetailPage
          slug={slug}
          onNavigate={navigate}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenEnquiry={handleOpenEnquiry}
          onOpenViewing={handleOpenViewing}
        />
      );
    }

    // 4. Services & Memberships: /services
    if (currentPath === '/services') {
      return (
        <ServicesPage
          onNavigate={navigate}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenCheckout={handleOpenCheckout}
          onOpenEnquiry={handleOpenEnquiry}
        />
      );
    }

    // 5. About: /about
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    // 6. Contact: /contact
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} currentUser={currentUser} />;
    }

    // 7. Customer Account: /account
    if (currentPath === '/account') {
      const params = new URLSearchParams(queryString);
      const tab = params.get('tab') || 'overview';
      return (
        <AccountPage
          currentUser={currentUser}
          onNavigate={navigate}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={() => {
            api.logout();
            navigate('/');
          }}
          initialTab={tab}
        />
      );
    }

    // 8. Admin Dashboard: /admin
    if (currentPath === '/admin') {
      return (
        <AdminPage
          currentUser={currentUser}
          onNavigate={navigate}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      );
    }

    // 9. Blog Listing: /blog
    if (currentPath === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }

    // 10. Blog Detail: /blog/:slug
    if (currentPath.startsWith('/blog/')) {
      const blogSlug = currentPath.replace('/blog/', '');
      return <BlogPostPage slug={blogSlug} onNavigate={navigate} />;
    }

    // 11. Privacy: /privacy
    if (currentPath === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }

    // 12. Terms: /terms
    if (currentPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }

    // Fallback: 404
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-[#FAFAF8]">
      {/* Global Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={() => {
          api.logout();
          navigate('/');
        }}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        plan={selectedPlanForCheckout}
        currentUser={currentUser}
        onSuccess={(updatedUser) => {
          setCurrentUser(updatedUser);
          navigate('/account?tab=membership');
        }}
        onOpenAuth={() => {
          setCheckoutModalOpen(false);
          setAuthModalOpen(true);
        }}
      />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        property={selectedPropertyForEnquiry}
      />

      <ViewingModal
        isOpen={viewingModalOpen}
        onClose={() => setViewingModalOpen(false)}
        property={selectedPropertyForViewing}
      />
    </div>
  );
}

export default App;
