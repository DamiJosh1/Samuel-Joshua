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
            {/* Elegant Maple Leaf Graphic SVG matching official style proportions */}
            <div className="text-[#af3c43]" aria-hidden="true">
              <svg width="40" height="36" viewBox="0 0 100 90" fill="currentColor">
                {/* Custom highly refined Maple Leaf SVG path */}
                <path d="M50,10 C50,10 52,24 57,28 C61,31 66,22 66,22 C66,22 66,28 72,28 C78,28 74,38 82,38 C90,38 85,46 88,49 C91,52 92,51 90,54 C88,57 74,53 72,58 C70,63 76,78 71,78 C66,78 63,60 62,60 C61,60 59,64 58,74 L54,84 L46,84 L42,74 C41,64 39,60 38,60 C37,60 34,78 29,78 C24,78 30,63 28,58 C26,53 12,57 10,54 C8,51 9,52 12,49 C15,46 10,38 18,38 C26,38 22,28 28,28 C34,28 34,22 34,22 C34,22 39,31 43,28 C48,24 50,10 50,10 Z" />
              </svg>
            </div>
            <div className="flex flex-col font-sans" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              <span className="text-xl font-bold tracking-tight text-[#333] leading-none">
                {t.govOfCanada}
              </span>
              <span className="text-xs font-medium text-[#777] tracking-wider mt-0.5 uppercase leading-none">
                {t.logoSub}
              </span>
            </div>
          </div>

          {/* Controls Panel - Search and Language Toggle */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            
            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(currentLang === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1.5 text-sm font-bold text-[#2572b4] hover:text-[#05355c] hover:underline transition-colors focus:ring-2 focus:ring-[#2572b4] focus:outline-none px-2 py-1 rounded"
              title={t.langToggleLabel}
              aria-label={t.langToggleLabel}
              id="lang-toggle-button"
            >
              <Globe className="w-4 h-4" />
              <span>{t.langToggle}</span>
            </button>

            {/* Quick search form */}
            <form onSubmit={onSearchSubmit} className="flex items-center" id="search-box-form">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-44 md:w-56 border border-[#b3b3b3] border-r-0 rounded-l px-3 py-1.5 text-sm outline-none focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4]"
                  aria-label={t.searchPlaceholder}
                />
              </div>
              <button
                type="submit"
                className="bg-[#335075] hover:bg-[#1c3552] text-white text-sm font-medium px-4 py-1.5 rounded-r cursor-pointer transition-colors border border-[#335075] flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#335075]"
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
  );
}
