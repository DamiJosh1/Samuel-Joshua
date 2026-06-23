import { Language, GENERAL_TRANSLATIONS } from '../types';

interface BreadcrumbsProps {
  currentLang: Language;
  onNavigateHome: () => void;
}

export default function Breadcrumbs({ currentLang, onNavigateHome }: BreadcrumbsProps) {
  const t = GENERAL_TRANSLATIONS[currentLang];

  return (
    <div className="bg-[#f5f5f5] border-b border-[#e5e5e5] py-2.5 text-xs text-[#555]" id="breadcrumbs-container">
      <div className="mx-auto max-w-6xl px-4 flex flex-wrap items-center gap-1.5 font-sans" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
        <button
          onClick={onNavigateHome}
          className="text-[#2572b4] hover:text-[#05355c] hover:underline focus:outline-none focus:underline"
          id="breadcrumb-home-btn"
        >
          {t.home}
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-[#2572b4]" id="breadcrumb-immig-text">
          {t.immigrationAndCitizenship}
        </span>
        <span className="text-gray-300">/</span>
        <span className="text-[#555] font-semibold" id="breadcrumb-bio-text">
          {currentLang === 'en' ? 'Biometrics' : 'Biométrie'}
        </span>
      </div>
    </div>
  );
}
