import { FormEvent } from 'react';
import { Language, GENERAL_TRANSLATIONS } from '../types';
import { Search, Globe } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
}

export default function Header({
  currentLang,
  onLanguageChange,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}: HeaderProps) {
  const t = GENERAL_TRANSLATIONS[currentLang];

  return (
    <header className="border-b border-[#e0e0e0] bg-white text-[#333]">
      {/* Top Banner Accent */}
      <div className="h-1 bg-[#af3c43]" id="header-top-accent"></div>
      
      <div className="mx-auto max-w-6xl px-4 py-4 md:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Government of Canada Logo Signature */}
          <div className="flex items-center gap-3 cursor-pointer select-none" id="gov-can-logo">
            <img 
              src={currentLang === 'en' 
                ? "https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-en.svg"
                : "https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-fr.svg"
              }
              alt={currentLang === 'en' ? "Government of Canada" : "Gouvernement du Canada"} 
              className="h-7 md:h-8 w-auto object-contain"
              id="gov-canada-sig-logo-header"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Controls Panel - Search and Language Toggle */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6">
            
            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(currentLang === 'en' ? 'fr' : 'en')}
              className="text-sm font-normal text-[#284162] hover:text-[#05355c] hover:underline focus:outline-none mb-1 sm:mb-0"
              title={t.langToggleLabel}
              aria-label={t.langToggleLabel}
              id="lang-toggle-button"
            >
              <span>{t.langToggle}</span>
            </button>

            {/* Quick search form */}
            <form onSubmit={onSearchSubmit} className="flex items-center" id="search-box-form">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder="Search Canada.ca"
                  className="w-44 md:w-64 border border-[#555] border-r-0 px-3 py-1.5 text-base outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  aria-label="Search Canada.ca"
                />
              </div>
              <button
                type="submit"
                className="bg-[#26374a] hover:bg-[#111820] text-white px-3 py-1.5 cursor-pointer transition-colors border border-[#26374a] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#26374a]"
                id="search-submit-btn"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
