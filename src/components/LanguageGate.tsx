import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function LanguageGate() {
  const { setLanguage, setHasEntered } = useApp();

  const handleSelectLanguage = (lang: 'en' | 'fr') => {
    setLanguage(lang);
    setHasEntered(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cover bg-center font-sans"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80')`
      }}
    >
      {/* Dark tint overlay for readability */}
      <div className="absolute inset-0 bg-[#0f172a]/20 backdrop-blur-[1px]"></div>

      {/* Language Selection Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-xl bg-[#f8f8f6] rounded border border-gray-300 shadow-2xl p-8 md:p-12 space-y-8 flex flex-col justify-between min-h-[420px]"
        id="language-gate-card"
      >
        {/* Government of Canada Bilingual Signature Logo */}
        <div className="w-full flex justify-center py-2">
          <img 
            src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-spl.svg" 
            alt="Government of Canada / Gouvernement du Canada" 
            className="h-10 md:h-12 w-auto object-contain"
            id="gov-canada-sig-logo"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Buttons for selecting language */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch w-full py-4">
          <button
            onClick={() => handleSelectLanguage('en')}
            className="flex-1 py-3 px-6 bg-[#26374a] hover:bg-[#1a2532] text-white font-semibold text-center text-base rounded transition-colors duration-200 border border-[#1e2a38] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#26374a]"
            id="lang-select-en"
          >
            English
          </button>
          <button
            onClick={() => handleSelectLanguage('fr')}
            className="flex-1 py-3 px-6 bg-[#26374a] hover:bg-[#1a2532] text-white font-semibold text-center text-base rounded transition-colors duration-200 border border-[#1e2a38] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#26374a]"
            id="lang-select-fr"
          >
            Français
          </button>
        </div>

        {/* Footer containing Terms/Avis and the official Canada wordmark */}
        <div className="border-t border-gray-200 pt-6 flex items-center justify-between gap-4 w-full">
          <div>
            <a 
              href="#/terms"
              onClick={(e) => {
                e.preventDefault();
                // Set default English and enter, but route to terms
                handleSelectLanguage('en');
                window.location.hash = '/terms';
              }}
              className="text-sm font-medium text-[#26374a] hover:underline hover:text-blue-800"
              id="lang-gate-terms-link"
            >
              Terms & conditions <span className="text-gray-400 mx-1">•</span> Avis
            </a>
          </div>

          <div>
            <img 
              src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-spl.svg" 
              alt="Canada Wordmark" 
              className="h-8 md:h-9 w-auto object-contain"
              id="canada-wordmark-logo"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
