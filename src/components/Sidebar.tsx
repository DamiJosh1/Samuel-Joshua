import { SectionId, SECTIONS_DATA, Language, GENERAL_TRANSLATIONS } from '../types';

interface SidebarProps {
  currentLang: Language;
  activeSection: SectionId;
  onSectionSelect: (sectionId: SectionId) => void;
}

export default function Sidebar({ currentLang, activeSection, onSectionSelect }: SidebarProps) {
  const sections = SECTIONS_DATA[currentLang];
  const t = GENERAL_TRANSLATIONS[currentLang];

  return (
    <aside className="w-full lg:w-auto" id="sections-sidebar">
      <div className="bg-[#f5f5f5] border border-[#e0e0e0] rounded p-5 shadow-xs font-sans" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
        <h2 className="text-lg font-bold text-[#333] border-b border-[#ccc] pb-2 mb-4">
          {t.asideHeading}
        </h2>
        
        <ul className="space-y-1">
          {sections.map((section) => {
            const isActive = section.id === activeSection;
            return (
              <li key={section.id} className="text-[15px]">
                <button
                  type="button"
                  onClick={() => onSectionSelect(section.id)}
                  className={`w-full text-left py-2 px-1 transition-all focus:outline-none focus:ring-1 focus:ring-[#2572b4] hover:bg-gray-100/50 rounded cursor-pointer ${
                    isActive
                      ? 'font-bold text-[#333] border-l-4 border-[#af3c43] pl-3.5 bg-gray-50'
                      : 'text-[#2572b4] hover:text-[#05355c] pl-1 hover:underline'
                  }`}
                  id={`sidebar-link-${section.id}`}
                >
                  {section.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
