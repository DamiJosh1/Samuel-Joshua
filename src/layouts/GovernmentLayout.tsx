import { useState, FormEvent, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GENERAL_TRANSLATIONS } from '../types';
import { Search, Globe, ChevronRight } from 'lucide-react';

export default function GovernmentLayout() {
  const { currentLang, setLanguage, user, logout } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const t = GENERAL_TRANSLATIONS[currentLang];

  // Sync search input if we are on search page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchVal(query);
    } else if (location.pathname !== '/search') {
      setSearchVal('');
    }
  }, [location]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleLangToggle = () => {
    setLanguage(currentLang === 'en' ? 'fr' : 'en');
  };

  // Generate Breadcrumbs Array based on current location path
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const list = [{ label: t.home, url: '/' }];

    let currentUrl = '';
    paths.forEach((p, idx) => {
      currentUrl += `/${p}`;
      
      let label = p.replace(/-/g, ' ');
      // Capitalize label
      label = label.charAt(0).toUpperCase() + label.slice(1);

      // Translate common path segments
      if (p === 'immigration-citizenship') {
        label = currentLang === 'en' ? 'Immigration & Citizenship' : 'Immigration et citoyenneté';
      } else if (p === 'biometrics') {
        label = currentLang === 'en' ? 'Biometrics' : 'Biométrie';
      } else if (p === 'passports') {
        label = currentLang === 'en' ? 'Passports' : 'Passeports';
      } else if (p === 'work-permits') {
        label = currentLang === 'en' ? 'Work Permits' : 'Permis de travail';
      } else if (p === 'study-permits') {
        label = currentLang === 'en' ? 'Study Permits' : 'Permis d\'études';
      } else if (p === 'permanent-residence') {
        label = currentLang === 'en' ? 'Permanent Residence' : 'Résidence permanente';
      } else if (p === 'citizenship') {
        label = currentLang === 'en' ? 'Citizenship' : 'Citoyenneté';
      } else if (p === 'services') {
        label = currentLang === 'en' ? 'Services' : 'Services globaux';
      } else if (p === 'taxes') {
        label = currentLang === 'en' ? 'Taxes' : 'Impôts';
      } else if (p === 'benefits') {
        label = currentLang === 'en' ? 'Benefits' : 'Prestations';
      } else if (p === 'employment') {
        label = currentLang === 'en' ? 'Employment' : 'Emploi';
      } else if (p === 'travel') {
        label = currentLang === 'en' ? 'Travel' : 'Voyage';
      } else if (p === 'business') {
        label = currentLang === 'en' ? 'Business' : 'Entreprises';
      } else if (p === 'auth') {
        return; // skip intermediate auth segment
      } else if (p === 'login') {
        label = currentLang === 'en' ? 'Sign In' : 'Connexion';
      } else if (p === 'register') {
        label = currentLang === 'en' ? 'Register' : 'S\'inscrire';
      } else if (p === 'dashboard') {
        label = currentLang === 'en' ? 'My Console' : 'Mon Tableau de bord';
      } else if (p === 'search') {
        label = currentLang === 'en' ? 'Search Results' : 'Résultats de recherche';
      }

      list.push({ label, url: currentUrl });
    });

    return list;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#333] font-sans antialiased" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
      
      {/* 2-TIERED WET GOVERNMENT HEADER */}
      <header className="border-b border-[#e0e0e0] bg-white text-[#333]">
        <div className="h-1.5 bg-[#af3c43]" id="header-top-accent"></div>
        
        <div className="mx-auto max-w-6xl px-4 py-4 md:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            {/* Logo Signature Section */}
            <Link to="/" className="flex items-center gap-3 select-none hover:opacity-90 transition-opacity" id="gov-can-logo">
              <div className="text-[#af3c43]" aria-hidden="true">
                <svg width="42" height="38" viewBox="0 0 100 90" fill="currentColor">
                  <path d="M50,10 C50,10 52,24 57,28 C61,31 66,22 66,22 C66,22 66,28 72,28 C78,28 74,38 82,38 C90,38 85,46 88,49 C91,52 92,51 90,54 C88,57 74,53 72,58 C70,63 76,78 71,78 C66,78 63,60 62,60 C61,60 59,64 58,74 L54,84 L46,84 L42,74 C41,64 39,60 38,60 C37,60 34,78 29,78 C24,78 30,63 28,58 C26,53 12,57 10,54 C8,51 9,52 12,49 C15,46 10,38 18,38 C26,38 22,28 28,28 C34,28 34,22 34,22 C34,22 39,31 43,28 C48,24 50,10 50,10 Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#333] leading-none">
                  {t.govOfCanada}
                </span>
                <span className="text-[10px] font-bold text-[#777] tracking-wider mt-0.5 uppercase leading-none">
                  {t.logoSub}
                </span>
              </div>
            </Link>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              
              {/* Account State Greeting */}
              {user ? (
                <div className="flex items-center gap-3 text-xs md:text-sm bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                  <span className="font-semibold text-gray-700">
                    {currentLang === 'en' ? `Hello, ${user.name}` : `Bonjour, ${user.name}`}
                  </span>
                  <Link to="/dashboard" className="text-[#2572b4] hover:underline font-bold border-l border-gray-300 pl-2">
                    {currentLang === 'en' ? 'Console' : 'Console'}
                  </Link>
                  <button 
                    onClick={logout} 
                    className="text-red-700 hover:text-red-900 font-bold hover:underline ml-1 cursor-pointer"
                  >
                    {currentLang === 'en' ? 'Sign Out' : 'Quitter'}
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  className="text-xs md:text-sm font-bold text-[#335075] hover:text-[#1c3552] border border-[#335075]/30 rounded px-2.5 py-1.5 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  id="header-signin-btn"
                >
                  {currentLang === 'en' ? 'My Account Sign In' : 'Connexion à mon compte'}
                </Link>
              )}

              {/* Language Toggle Button */}
              <button
                onClick={handleLangToggle}
                className="flex items-center gap-1.5 text-sm font-bold text-[#2572b4] hover:text-[#05355c] hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-[#2572b4] px-2 py-1 rounded cursor-pointer"
                title={t.langToggleLabel}
                aria-label={t.langToggleLabel}
                id="lang-toggle-button"
              >
                <Globe className="w-4 h-4" />
                <span>{t.langToggle}</span>
              </button>

              {/* Central Header Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex items-center" id="search-box-form">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-36 md:w-52 border border-[#b3b3b3] border-r-0 rounded-l px-3 py-1.5 text-sm outline-none focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4]"
                  aria-label={t.searchPlaceholder}
                />
                <button
                  type="submit"
                  className="bg-[#335075] hover:bg-[#1c3552] text-white text-sm font-medium px-4 py-1.5 rounded-r cursor-pointer transition-colors border border-[#335075] flex items-center gap-1 focus:outline-none"
                  id="search-submit-btn"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{t.searchButton}</span>
                </button>
              </form>

            </div>
          </div>
        </div>
      </header>

      {/* TOP NAVIGATION BAR LINKS (Mandated header categories navigation) */}
      <nav className="bg-[#335075] text-white text-xs md:text-sm font-bold border-b border-[#21354e] shadow-sm select-none" id="header-categories-nav">
        <div className="mx-auto max-w-6xl px-4 flex flex-wrap items-center">
          <Link to="/" className="hover:bg-[#1c3552] py-3.5 px-4 block transition-colors border-r border-[#21354e]">
            {currentLang === 'en' ? 'Home' : 'Accueil'}
          </Link>
          <Link to="/services" className="hover:bg-[#1c3552] py-3.5 px-4 block transition-colors border-r border-[#21354e]">
            {currentLang === 'en' ? 'Services' : 'Services'}
          </Link>
          <Link to="/immigration-citizenship" className="hover:bg-[#1c3552] py-3.5 px-4 block transition-colors border-r border-[#21354e]">
            {currentLang === 'en' ? 'Immigration' : 'Immigration'}
          </Link>
          <Link to="/taxes" className="hover:bg-[#1c3552] py-3.5 px-4 block transition-colors border-r border-[#21354e]">
            {currentLang === 'en' ? 'Taxes' : 'Impôts'}
          </Link>
          <Link to="/benefits" className="hover:bg-[#1c3552] py-3.5 px-4 block transition-colors border-r border-[#21354e]">
            {currentLang === 'en' ? 'Benefits' : 'Prestations'}
          </Link>
          <Link to="/employment" className="hover:bg-[#1c3552] py-3.5 px-4 block transition-colors border-r border-[#21354e]">
            {currentLang === 'en' ? 'Employment' : 'Emploi'}
          </Link>
          <Link to="/travel" className="hover:bg-[#1c3552] py-3.5 px-4 block transition-colors border-r border-[#21354e]">
            {currentLang === 'en' ? 'Travel' : 'Voyage'}
          </Link>
          <Link to="/business" className="hover:bg-[#1c3552] py-3.5 px-4 block transition-colors border-r border-[#21354e]">
            {currentLang === 'en' ? 'Business' : 'Entreprises'}
          </Link>
          <Link to="/contact" className="hover:bg-[#1c3552] py-3.5 px-4 block transition-colors">
            {currentLang === 'en' ? 'Contact' : 'Contact'}
          </Link>
        </div>
      </nav>

      {/* DYNAMIC BREADCRUMBS BAR */}
      <div className="bg-[#f5f5f5] border-b border-[#e5e5e5] py-2.5 text-xs text-[#555]" id="breadcrumbs-container">
        <div className="mx-auto max-w-6xl px-4 flex flex-wrap items-center gap-1.5 font-sans">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={crumb.url} className="flex items-center gap-1.5">
                {isLast ? (
                  <span className="text-[#333] font-semibold truncate max-w-xs">{crumb.label}</span>
                ) : (
                  <>
                    <Link to={crumb.url} className="text-[#2572b4] hover:text-[#05355c] hover:underline focus:underline">
                      {crumb.label}
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CORE OUTLET FOR SUBPAGE ROUTE PAGES */}
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>

      {/* FEDERAL DEEP BLUE FOOTER SYSTEM */}
      <footer className="bg-[#26374a] text-white py-12 mt-auto font-sans text-sm" id="canada-footer">
        <div className="mx-auto max-w-6xl px-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#455e7a]">
            
            {/* Column 1: Government Services */}
            <div className="space-y-4">
              <h3 className="font-bold text-base border-b border-[#455e7a] pb-2 text-white">
                {currentLang === 'en' ? 'Government Services' : 'Services gouvernementaux'}
              </h3>
              <ul className="space-y-2.5 text-gray-300">
                <li><Link to="/immigration-citizenship" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Immigration & Citizenship' : 'Immigration et citoyenneté'}</Link></li>
                <li><Link to="/immigration-citizenship/passports" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Passports Office' : 'Bureau des passeports'}</Link></li>
                <li><Link to="/taxes" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Personal/Business Taxes' : 'Impôts sur le revenu'}</Link></li>
                <li><Link to="/benefits" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Benefits Programs' : 'Programmes d\'aide sociale'}</Link></li>
                <li><Link to="/employment" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Employment Insurance' : 'Assurance-emploi'}</Link></li>
                <li><Link to="/travel" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Travel Advices' : 'Avis aux voyageurs'}</Link></li>
              </ul>
            </div>

            {/* Column 2: About Government */}
            <div className="space-y-4">
              <h3 className="font-bold text-base border-b border-[#455e7a] pb-2 text-white">
                {currentLang === 'en' ? 'About Government' : 'À propos du gouvernement'}
              </h3>
              <ul className="space-y-2.5 text-gray-300">
                <li><Link to="/services" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'About Canada.ca' : 'À propos de Canada.ca'}</Link></li>
                <li><Link to="/contact" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Departments & Agencies' : 'Ministères et organismes'}</Link></li>
                <li><Link to="/services" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Public Service Careers' : 'Emplois dans la fonction publique'}</Link></li>
                <li><Link to="/services" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Open Government' : 'Gouvernement ouvert'}</Link></li>
                <li><Link to="/help" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Federal News Announcements' : 'Nouvelles du gouvernement'}</Link></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="space-y-4">
              <h3 className="font-bold text-base border-b border-[#455e7a] pb-2 text-white">
                {currentLang === 'en' ? 'Support Portal' : 'Soutien technique'}
              </h3>
              <ul className="space-y-2.5 text-gray-300">
                <li><Link to="/contact" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Contact Us / Directory' : 'Contactez-nous'}</Link></li>
                <li><Link to="/help" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Help Centre Knowledge' : 'Centre d\'aide'}</Link></li>
                <li><Link to="/accessibility" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Accessibility Standards' : 'Normes d\'accessibilité'}</Link></li>
                <li><Link to="/contact" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Give Feedback' : 'Donner des commentaires'}</Link></li>
                <li><Link to="/contact" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Report a Portal Problem' : 'Signaler un problème technique'}</Link></li>
              </ul>
            </div>

            {/* Column 4: Legal & Standards */}
            <div className="space-y-4">
              <h3 className="font-bold text-base border-b border-[#455e7a] pb-2 text-white">
                {currentLang === 'en' ? 'Legal & Bureaucracy' : 'Lois et transparence'}
              </h3>
              <ul className="space-y-2.5 text-gray-300">
                <li><Link to="/privacy" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Privacy Policies' : 'Politique de confidentialité'}</Link></li>
                <li><Link to="/terms" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Terms & Usage' : 'Avis généraux'}</Link></li>
                <li><Link to="/privacy" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Proactive Disclosure' : 'Divulgation proactive'}</Link></li>
                <li><Link to="/terms" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Information Security' : 'Sécurité de l\'information'}</Link></li>
                <li><Link to="/accessibility" className="hover:text-[#bce1f2] hover:underline">{currentLang === 'en' ? 'Official Languages Act' : 'Lois sur les langues officielles'}</Link></li>
              </ul>
            </div>

          </div>

          {/* Social Links Row */}
          <div className="pt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs text-gray-400">
            <span className="font-semibold text-gray-300">{currentLang === 'en' ? 'Other Platforms:' : 'Autres plateformes :'}</span>
            <span className="hover:text-white cursor-pointer hover:underline">{currentLang === 'en' ? 'Social Media accounts' : 'Comptes de médias sociaux'}</span>
            <span className="hover:text-white cursor-pointer hover:underline">{currentLang === 'en' ? 'Mobile apps directory' : 'Répertoire des applications mobiles'}</span>
            <span className="hover:text-white cursor-pointer hover:underline">{currentLang === 'en' ? 'RSS feeds feeds' : 'Fils RSS'}</span>
            <span className="hover:text-white cursor-pointer hover:underline">{currentLang === 'en' ? 'Accessibility Statement' : 'Déclaration d\'accessibilité'}</span>
          </div>

          {/* Corporate bottom copyright & wordmark */}
          <div className="pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-400">
            <div className="space-y-1">
              <div>
                {t.rights} / {t.copyrightSub}
              </div>
              <div className="text-[11px] text-[#86a1bd]">
                {t.lastModified} &bull; v2.1.2
              </div>
              <div className="text-[10px] text-gray-400 max-w-2xl border-t border-white/10 pt-2 mt-2 leading-relaxed italic">
                {currentLang === 'en' ? t.disclaimers : t.disclaimersFr}
              </div>
            </div>
            
            <div className="flex items-center gap-1 select-none font-bold text-3xl tracking-normal text-white">
              <span>Canada</span>
              <span className="text-[#af3c43]" id="footer-canada-dot">.ca</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
