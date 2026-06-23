import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SectionId, GENERAL_TRANSLATIONS } from '../types';
import Sidebar from '../components/Sidebar';
import EligibilityChecker from '../components/EligibilityChecker';
import SiteFinder from '../components/SiteFinder';
import StatusTracker from '../components/StatusTracker';

export default function Biometrics() {
  const { currentLang } = useApp();
  const [activeSection, setActiveSection] = useState<SectionId>('how-to-give');

  const t = GENERAL_TRANSLATIONS[currentLang];

  const handleSectionSelect = (sectionId: SectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="flex-grow mx-auto max-w-6xl w-full px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 items-start" id="main-wet-grid">
        
        {/* Main Primary Content Panel (Left-side col-span 3) */}
        <div className="lg:col-span-3 space-y-6" id="primary-content-panel">
          
          {activeSection === 'how-to-give' && (
            <div className="space-y-6" id="section-how-to-give">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
                  {currentLang === 'en' ? 'Biometrics fingerprints & photo' : 'Données biométriques, empreintes et photo'}
                </h1>
                <p className="text-lg text-gray-750 leading-relaxed font-normal">
                  {currentLang === 'en'
                    ? 'Biometrics are your fingerprints and a photo. We collect your biometrics so we can confirm your identity and secure the immigration process.'
                    : 'Les données biométriques comprennent vos empreintes et une photo. Nous les recueillons pour confirmer votre identité et sécuriser le processus d\'immigration.'}
                </p>
              </div>

              {/* Important Notice Box matching WET default colors */}
              <div className="bg-[#f3f8fc] border-l-6 border-[#269abc] rounded-r p-5 shadow-xs" id="custom-important-notice">
                <h3 className="font-bold text-[#004d66] text-base mb-1.5 uppercase tracking-wide">
                  {t.importantNotice}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                  {currentLang === 'en' ? (
                    <>
                      You must pay the biometrics fee <strong>before</strong> you go to your collection appointment. Make sure to bring your <strong>Biometric Instruction Letter (BIL)</strong> with you.
                    </>
                  ) : (
                    <>
                      Vous devez payer les frais de biométrie <strong>avant</strong> de vous rendre à votre rendez-vous. Assurez-vous d'apporter votre <strong>lettre d'instructions pour la biométrie (LIB)</strong>.
                    </>
                  )}
                </p>
              </div>

              {/* Content Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#333]">
                  {currentLang === 'en' ? 'How to give your fingerprints and photo' : 'Comment fournir vos empreintes et votre photo'}
                </h2>
                <p className="text-gray-750 leading-relaxed text-sm md:text-base">
                  {currentLang === 'en'
                    ? 'If you need to give biometrics as part of your application, follow the steps below to make sure your application process is not delayed.'
                    : 'Si vous devez fournir vos données biométriques dans le cadre de votre demande, suivez les étapes ci-dessous pour éviter tout retard.'}
                </p>
              </div>

              {/* Left vertical timeline decoration steps progress */}
              <div className="relative pl-8 border-l-2 border-gray-200 space-y-8 mt-6 max-w-2xl" id="wet-steps-timeline">
                
                {/* Step 1 */}
                <div className="relative" id="step-block-1">
                  <div className="absolute -left-12.5 top-0 bg-[#2572b4] text-white font-extrabold w-8 h-8 rounded-full flex items-center justify-center text-sm ring-4 ring-white">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-[#333] mb-1.5">
                    {currentLang === 'en' ? 'Pay the biometrics fee' : 'Payez les frais de biométrie'}
                  </h3>
                  <p className="text-sm text-gray-650 leading-relaxed">
                    {currentLang === 'en'
                      ? 'You must pay the biometrics fee when you submit your application. This ensures that you receive your instruction letter without administrative delays.'
                      : 'Vous devez payer les frais de biométrie lors du dépôt de votre demande. Cela vous garantit de recevoir votre lettre d\'instructions sans délai administratif.'}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative" id="step-block-2">
                  <div className="absolute -left-12.5 top-0 bg-[#2572b4] text-white font-extrabold w-8 h-8 rounded-full flex items-center justify-center text-sm ring-4 ring-white">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-[#333] mb-1.5">
                    {currentLang === 'en' ? 'Get your Biometric Instruction Letter (BIL)' : 'Obtenez votre lettre d\'instructions (LIB)'}
                  </h3>
                  <p className="text-sm text-gray-650 leading-relaxed">
                    {currentLang === 'en'
                      ? 'Once you pay the fee, you will receive a letter confirming you need to give your biometrics. This letter tells you where to go and what documents to bring.'
                      : 'Une fois les frais payés, vous recevrez une lettre confirmant que vous devez fournir vos données biométriques. Elle précise où aller et quels documents apporter.'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative" id="step-block-3">
                  <div className="absolute -left-12.5 top-0 bg-[#2572b4] text-white font-extrabold w-8 h-8 rounded-full flex items-center justify-center text-sm ring-4 ring-white">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-[#333] mb-1.5">
                    {currentLang === 'en' ? 'Book your appointment and go to an official site' : 'Prenez rendez-vous et rendez-vous dans un centre officiel'}
                  </h3>
                  <p className="text-sm text-gray-650 leading-relaxed">
                    {currentLang === 'en'
                      ? 'Find an official biometric collection point near you and book an appointment as soon as possible. Remember to bring your passport and instruction letter.'
                      : 'Trouvez un point de collecte de la biométrie officiel près de chez vous et réservez un créneau dès que possible. N\'oubliez pas d\'apporter votre passeport et la lettre.'}
                  </p>
                </div>

              </div>

              {/* Quick actions row */}
              <div className="pt-6 flex flex-wrap gap-4" id="section-quick-cta-bar">
                <button
                  onClick={() => setActiveSection('who-needs')}
                  className="bg-[#2572b4] hover:bg-[#05355c] hover:underline text-white font-bold text-sm px-5 py-2.5 rounded transition-all cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-[#2572b4]"
                  id="cta-who-needs"
                >
                  {currentLang === 'en' ? 'Check if you need biometrics' : 'Vérifiez si vous devez la fournir'}
                </button>
                <button
                  onClick={() => setActiveSection('where-to-give')}
                  className="border border-[#2572b4] hover:bg-gray-50 text-[#2572b4] font-bold text-sm px-5 py-2.5 rounded transition-all cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-gray-250"
                  id="cta-where-to-give"
                >
                  {currentLang === 'en' ? 'Find collection locations' : 'Trouver un point de collecte'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'who-needs' && (
            <EligibilityChecker currentLang={currentLang} />
          )}

          {activeSection === 'when-to-give' && (
            <StatusTracker currentLang={currentLang} mode="when" />
          )}

          {activeSection === 'where-to-give' && (
            <SiteFinder currentLang={currentLang} />
          )}

          {activeSection === 'what-happens' && (
            <StatusTracker currentLang={currentLang} mode="after" />
          )}

        </div>

        {/* Right-side Section Navigation Sidebar (col-span 1) */}
        <div className="lg:col-span-1" id="aside-sidebar-container">
          <Sidebar
            currentLang={currentLang}
            activeSection={activeSection}
            onSectionSelect={handleSectionSelect}
          />
        </div>

      </div>
    </div>
  );
}
