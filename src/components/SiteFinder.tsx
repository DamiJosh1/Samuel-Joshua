import { useState, useMemo } from 'react';
import { CollectionSite, COLLECTION_SITES, Language } from '../types';
import { Search, MapPin, Clock, Calendar, AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';

interface SiteFinderProps {
  currentLang: Language;
}

export default function SiteFinder({ currentLang }: SiteFinderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  // Generate dynamic unique countries list for filtering
  const countriesList = useMemo(() => {
    const list = new Set<string>();
    COLLECTION_SITES.forEach((site) => {
      list.add(currentLang === 'en' ? site.country : site.countryFr);
    });
    return Array.from(list).sort();
  }, [currentLang]);

  // Dictionary translations
  const t = useMemo(() => {
    return currentLang === 'en'
      ? {
          title: 'Where to give biometrics',
          subtitle: 'Search for official biometric collection locations near you including Visa Application Centres (VACs) and Support Centres.',
          filterCountry: 'Filter by Country/Territory:',
          filterType: 'Filter by Location Type:',
          searchPlaceholder: 'Search by city, address or site name...',
          typeAll: 'All Location Types',
          typeVac: 'Visa Application Centres (VAC)',
          typeAsc: 'USCIS Application Support Centres (ASC)',
          typeSc: 'Service Canada Centres',
          countryAll: 'All Countries / Regions',
          tblName: 'Location Name',
          tblAddress: 'Address',
          tblHours: 'Operating Hours',
          btnBook: 'Schedule Appointment',
          badgeVac: 'VAC (Visa Site)',
          badgeAsc: 'ASC (US Only)',
          badgeSc: 'Service Canada',
          resultsCount: 'Showing {count} official collection sites',
          noResults: 'No collection locations matched your search criteria. Try modifying your filters.',
          vacHeader: 'Important appointment Booking note',
          vacNotice: 'You MUST receive your Biometric Instruction Letter (BIL) before booking an appointment. VACs and ASCs will not collect biometrics without this letter.'
        }
      : {
          title: 'Où fournir ses données biométriques',
          subtitle: 'Recherchez les centres de collecte officiels près de chez vous, y compris les centres de réception des demandes de visa (CRDV).',
          filterCountry: 'Filtrer par Pays/Territoire :',
          filterType: 'Filtrer par Type d\'emplacement :',
          searchPlaceholder: 'Rechercher par ville, adresse ou nom...',
          typeAll: 'Tous les types de lieux',
          typeVac: 'Centres de réception des demandes de visa (CRDV)',
          typeAsc: 'Centres de soutien aux demandes de l\'USCIS (ASC)',
          typeSc: 'Centres Service Canada',
          countryAll: 'Tous les pays / régions',
          tblName: 'Nom de l\'emplacement',
          tblAddress: 'Adresse',
          tblHours: 'Heures d\'ouverture',
          btnBook: 'Prendre rendez-vous',
          badgeVac: 'CRDV (Espace Visa)',
          badgeAsc: 'ASC (É-U Seuls)',
          badgeSc: 'Service Canada',
          resultsCount: 'Affiche {count} points de collecte officiels',
          noResults: 'Aucun centre de collecte ne correspond à vos critères. Essayez de modifier vos filtres.',
          vacHeader: 'Avis important concernant la prise de rendez-vous',
          vacNotice: 'Vous DEVEZ recevoir votre lettre d\'instructions pour la biométrie (LIB) avant de prendre rendez-vous. Les centres ne recueilleront pas vos données sans cette lettre.'
        };
  }, [currentLang]);

  // Filter logic
  const filteredSites = useMemo(() => {
    return COLLECTION_SITES.filter((site) => {
      // 1. Text search
      const q = searchTerm.toLowerCase();
      const name = (currentLang === 'en' ? site.name : site.nameFr).toLowerCase();
      const city = site.city.toLowerCase();
      const address = (currentLang === 'en' ? site.address : site.addressFr).toLowerCase();
      const notes = (currentLang === 'en' ? site.notes : site.notesFr).toLowerCase();
      
      const matchesSearch =
        !searchTerm ||
        name.includes(q) ||
        city.includes(q) ||
        address.includes(q) ||
        notes.includes(q);

      // 2. Country filter
      const countryName = currentLang === 'en' ? site.country : site.countryFr;
      const matchesCountry = selectedCountry === 'ALL' || countryName === selectedCountry;

      // 3. Type filter
      const matchesType = selectedType === 'ALL' || site.type === selectedType;

      return matchesSearch && matchesCountry && matchesType;
    });
  }, [searchTerm, selectedCountry, selectedType, currentLang]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {t.title}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Appointment Booking Warning Note */}
      <div className="bg-[#f3f8fc] border-l-6 border-[#269abc] rounded-r p-4 text-sm text-[#004d66] flex gap-3">
        <HelpCircle className="w-5 h-5 shrink-0 text-[#269abc] mt-0.5" />
        <div>
          <h4 className="font-bold text-[#1f6f8a] uppercase tracking-wide text-xs mb-1">
            {t.vacHeader}
          </h4>
          <p className="leading-relaxed font-medium">
            {t.vacNotice}
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Keyword Search */}
          <div className="space-y-1.5 col-span-1 md:col-span-1">
            <span className="block text-xs font-bold text-[#333] uppercase">
              {currentLang === 'en' ? 'Search Keywords:' : 'Recherche par mots-clés :'}
            </span>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full border border-gray-300 rounded pl-9 pr-3 py-1.5 text-smoutline-none text-[#333] focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Country Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#333] uppercase" htmlFor="search-country-filter">
              {t.filterCountry}
            </label>
            <select
              id="search-country-filter"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-[#333] bg-white outline-none focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4]"
            >
              <option value="ALL">{t.countryAll}</option>
              {countriesList.map((countryName) => (
                <option key={countryName} value={countryName}>
                  {countryName}
                </option>
              ))}
            </select>
          </div>

          {/* Location Type Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#333] uppercase" htmlFor="search-type-filter">
              {t.filterType}
            </label>
            <select
              id="search-type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-[#333] bg-white outline-none focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4]"
            >
              <option value="ALL">{t.typeAll}</option>
              <option value="vac">{t.typeVac}</option>
              <option value="asc">{t.typeAsc}</option>
              <option value="service-canada">{t.typeSc}</option>
            </select>
          </div>

        </div>

        {/* Results Counter Label */}
        <div className="text-xs text-gray-500 font-semibold italic border-t border-gray-100 pt-3 flex justify-between items-center">
          <span>{t.resultsCount.replace('{count}', filteredSites.length.toString())}</span>
          {(searchTerm || selectedCountry !== 'ALL' || selectedType !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('ALL');
                setSelectedType('ALL');
              }}
              className="text-[#2572b4] hover:underline cursor-pointer not-italic text-xs font-bold hover:text-[#05355c]"
              id="clear-site-filters-btn"
            >
              {currentLang === 'en' ? 'Reset Filters' : 'Réinitialiser les filtres'}
            </button>
          )}
        </div>
      </div>

      {/* Grid of Site Details Cards */}
      {filteredSites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="found-sites-grid">
          {filteredSites.map((site) => {
            // Colors for location types pill badge
            let typeBadgeStyles = 'bg-blue-100 text-blue-800 border-blue-200';
            let typeBadgeName = site.typeLabel;
            if (site.type === 'vac') {
              typeBadgeStyles = 'bg-red-50 text-red-800 border-red-200/60';
              typeBadgeName = currentLang === 'en' ? t.badgeVac : t.badgeVac;
            } else if (site.type === 'asc') {
              typeBadgeStyles = 'bg-gray-100 text-gray-800 border-gray-200';
              typeBadgeName = currentLang === 'en' ? t.badgeAsc : t.badgeAsc;
            } else if (site.type === 'service-canada') {
              typeBadgeStyles = 'bg-blue-50 text-blue-800 border-blue-200/60';
              typeBadgeName = currentLang === 'en' ? t.badgeSc : t.badgeSc;
            }

            return (
              <div
                key={site.id}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
                id={`site-card-${site.id}`}
              >
                <div>
                  {/* Card Title Header with type pill badge */}
                  <div className="bg-[#fdfdfd] border-b border-gray-100 px-5 py-4 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded border ${typeBadgeStyles}`}>
                        {currentLang === 'en' ? site.typeLabel : site.typeLabelFr}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#333] leading-snug">
                      {currentLang === 'en' ? site.name : site.nameFr}
                    </h3>
                  </div>

                  {/* Address and Hours Details */}
                  <div className="p-5 space-y-3.5 text-sm text-gray-700">
                    {/* Address Line */}
                    <div className="flex gap-2.5 items-start">
                      <MapPin className="w-4 h-4 shrink-0 text-[#2572b4] mt-0.5" />
                      <div>
                        <strong className="block text-xs font-bold text-gray-500 uppercase">
                          {currentLang === 'en' ? 'Address' : 'Adresse'}
                        </strong>
                        <span className="leading-relaxed">{currentLang === 'en' ? site.address : site.addressFr}</span>
                      </div>
                    </div>

                    {/* Hours Line */}
                    <div className="flex gap-2.5 items-start">
                      <Clock className="w-4 h-4 shrink-0 text-gray-500 mt-0.5" />
                      <div>
                        <strong className="block text-xs font-bold text-gray-500 uppercase">
                          {currentLang === 'en' ? 'Hours of Operation' : 'Heures de service'}
                        </strong>
                        <span>{currentLang === 'en' ? site.hours : site.hoursFr}</span>
                      </div>
                    </div>

                    {/* Site Notes */}
                    <div className="text-xs text-gray-500 bg-[#f9f9f9] border border-gray-150/60 rounded p-3 italic">
                      {currentLang === 'en' ? site.notes : site.notesFr}
                    </div>
                  </div>
                </div>

                {/* Dynamic Scheduling CTA Button Footer */}
                <div className="px-5 pb-5 pt-1.5 border-t border-gray-50 flex items-center">
                  <a
                    href={site.appointmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#2572b4] hover:bg-[#05355c] hover:underline text-white font-bold text-xs py-2 px-4 rounded transition-colors text-center cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-[#2572b4] outline-none"
                    id={`book-appointment-btn-${site.id}`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t.btnBook}</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty States */
        <div className="bg-amber-50 border border-amber-200/80 text-amber-900 rounded-lg p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left" id="site-finder-empty-panel">
          <AlertCircle className="w-10 h-10 text-amber-600 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-base">
              {currentLang === 'en' ? 'No collection centres found' : 'Aucun centre de collecte trouvé'}
            </h4>
            <p className="text-sm font-medium opacity-90 leading-relaxed">
              {t.noResults}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
