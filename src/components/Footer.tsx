import { Language, GENERAL_TRANSLATIONS } from '../types';

interface FooterProps {
  currentLang: Language;
}

export default function Footer({ currentLang }: FooterProps) {
  const t = GENERAL_TRANSLATIONS[currentLang];

  return (
    <footer className="bg-[#26374a] text-white py-10 text-sm mt-auto font-sans" style={{ fontFamily: '"Noto Sans", sans-serif' }} id="canada-footer">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* Top 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-[#455e7a]">
          
          {/* Column 1: Contact */}
          <div className="space-y-4" id="footer-col-contact">
            <h3 className="font-bold text-base border-b border-[#455e7a] pb-2 text-white">
              {t.contactUs}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-gray-300 hover:text-[#bce1f2] hover:underline cursor-pointer">
                  {t.helpCentre}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-[#bce1f2] hover:underline cursor-pointer">
                  {t.contactImmigration}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-[#bce1f2] hover:underline cursor-pointer">
                  {t.feedback}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Gov of Canada Link list */}
          <div className="space-y-4" id="footer-col-gov">
            <h3 className="font-bold text-base border-b border-[#455e7a] pb-2 text-white">
              {t.aboutGov}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-gray-300 hover:text-[#bce1f2] hover:underline cursor-pointer">
                  {t.allDepartments}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-[#bce1f2] hover:underline cursor-pointer">
                  {t.howGovWorks}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-[#bce1f2] hover:underline cursor-pointer">
                  {t.publicService}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-[#bce1f2] hover:underline cursor-pointer">
                  {t.news}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal stuff */}
          <div className="space-y-4" id="footer-col-legal">
            <h3 className="font-bold text-base border-b border-[#455e7a] pb-2 text-white">
              {t.legal}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-gray-300 hover:text-[#bce1f2] hover:underline cursor-pointer">
                  {t.termsAndConditions}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-[#bce1f2] hover:underline cursor-pointer">
                  {t.privacy}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright of his Majesty and the Canada wordmark */}
        <div className="pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-350">
          <div className="space-y-1.5">
            <div id="footer-copyright-text">
              {t.rights} / {t.copyrightSub}
            </div>
            <div className="text-[11px] text-[#86a1bd]" id="footer-modified-indicator">
              {t.lastModified}
            </div>
          </div>
          
          {/* Canada.ca Logo symbol bottom right with official red flag dot */}
          <div className="flex items-center gap-1 cursor-pointer select-none font-bold text-2xl tracking-normal text-white" id="footer-canada-wordmark">
            <span>Canada</span>
            <span className="text-[#af3c43]" id="footer-canada-dot">.ca</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
