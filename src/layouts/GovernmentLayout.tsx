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
    // Override for application details and checklist pages
    if (location.pathname.startsWith('/application/')) {
      const parts = location.pathname.split('/').filter(Boolean);
      const appId = parts[1];
      const list = [{ label: t.home, url: '/' }];
      
      const appLabel = currentLang === 'en' ? 'Your account' : 'Votre compte';
      
      if (parts[2] === 'checklist') {
        list.push({ label: appLabel, url: `/application/${appId}` });
        list.push({ label: currentLang === 'en' ? 'Document Checklist' : 'Liste de contrôle des documents', url: location.pathname });
      } else {
        list.push({ label: appLabel, url: location.pathname });
      }
      return list;
    }

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
      <header className="bg-white text-[#333] pt-4">
        <div className="mx-auto max-w-6xl px-4 w-full">
          <div className="flex justify-between items-start pb-3">
            
            {/* Logo Signature Section */}
            <Link to="/" className="flex items-center" id="gov-can-logo">
              <img 
                src={currentLang === 'en' 
                  ? "https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-en.svg"
                  : "https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-fr.svg"
                }
                alt={currentLang === 'en' ? "Government of Canada" : "Gouvernement du Canada"} 
                className="h-[30px] w-auto object-contain mt-1"
                id="gov-canada-sig-logo-header"
                referrerPolicy="no-referrer"
              />
            </Link>

            {/* Language Toggle Link */}
            <button
              onClick={handleLangToggle}
              className="text-[14px] font-normal text-[#2b4380] hover:text-[#05355c] underline focus:outline-none cursor-pointer mt-2"
              title={t.langToggleLabel}
              aria-label={t.langToggleLabel}
              id="lang-toggle-button"
            >
              {currentLang === 'en' ? 'Français' : 'English'}
            </button>
            
          </div>
        </div>
        
        {/* Main horizontal rule separating signature from menu */}
        <div className="h-[2px] bg-[#111] w-full"></div>
        
        {/* MENU Bar */}
        <div className="mx-auto max-w-6xl px-4 w-full">
          <div className="flex justify-start items-center">
            {/* Authentic MENU Dropdown Button */}
            <button 
              className="bg-[#26374a] hover:bg-[#1a2938] text-white px-4 py-2 font-normal text-[15px] flex items-center gap-2 transition-colors focus:outline-none select-none rounded-none cursor-pointer"
              id="header-gckey-menu-btn"
            >
              <span>MENU</span>
              <span className="text-[12px] opacity-100 font-bold">˅</span>
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC BREADCRUMBS BAR */}
      <div className="bg-white py-3 text-xs text-[#333]" id="breadcrumbs-container">
        <div className="mx-auto max-w-6xl px-4 flex flex-wrap items-center gap-2 font-sans text-[13.5px]">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={crumb.url} className="flex items-center gap-2">
                {isLast ? (
                  <span className="text-gray-600 truncate font-normal max-w-xs">
                    {crumb.label === 'My Console' || crumb.label === 'Your account' || crumb.label === 'Dashboard' ? 'Your account' : crumb.label}
                  </span>
                ) : (
                  <>
                    <Link to={crumb.url} className="text-[#8A2BE2] hover:text-[#551A8B] underline">
                      {crumb.label === 'Home' ? 'Home' : crumb.label}
                    </Link>
                    <span className="text-gray-500 font-normal text-[12px]">&gt;</span>
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
