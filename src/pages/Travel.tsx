import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { placeholderApi, TravelAdvisory } from '../services/placeholderApi';
import { Plane, AlertTriangle, ShieldCheck, Search, ShieldAlert, Globe } from 'lucide-react';

export default function Travel() {
  const { currentLang } = useApp();
  const [advisories, setAdvisories] = useState<TravelAdvisory[]>([]);
  const [selectedCode, setSelectedCode] = useState('FR');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    placeholderApi.getTravelAdvisories().then((data) => {
      setAdvisories(data);
      setLoading(false);
    });
  }, []);

  const curAdvisory = advisories.find(a => a.code === selectedCode);

  const getLevelColor = (level: number) => {
    if (level === 1) return { bg: 'bg-green-50 border-green-200 text-green-900', label: 'Level 1: Normal Security Precautions' };
    if (level === 2) return { bg: 'bg-yellow-50 border-yellow-200 text-yellow-900', label: 'Level 2: High Degree of Caution' };
    if (level === 3) return { bg: 'bg-orange-50 border-orange-200 text-orange-950', label: 'Level 3: Reconsider Travel' };
    return { bg: 'bg-red-50 border-red-200 text-red-900', label: 'Level 4: Avoid All Travel (Do Not Visit)' };
  };

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Travel advice and international advisories' : 'Conseils aux voyageurs et avertissements'}
        </h1>
        <p className="text-gray-750 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Official security advisories for destinations worldwide, customs regulations, and border declarations rules.'
            : 'Fiches et avertissements officiels de sécurité par pays, règlements des douanes et déclarations d\'entrée.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Destination Advisory checker (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-600" />
              {currentLang === 'en' ? 'Interactive Travel Risk Destination Directory' : 'Répertoire interactif des risques de voyage'}
            </h2>

            {loading ? (
              <div className="text-center py-6 text-gray-500 text-xs">Loading advisor database...</div>
            ) : (
              <div className="space-y-5">
                
                {/* Selector */}
                <div className="space-y-1.5 max-w-md">
                  <label className="text-xs font-bold text-gray-700 block uppercase">
                    {currentLang === 'en' ? 'Select Destination Country:' : 'Sélectionnez un pays de destination :'}
                  </label>
                  <select
                    value={selectedCode}
                    onChange={(e) => setSelectedCode(e.target.value)}
                    className="w-full border p-2.5 text-sm rounded bg-gray-50 text-[#333] outline-none"
                  >
                    {advisories.map(item => (
                      <option key={item.code} value={item.code}>
                        {currentLang === 'en' ? item.country : item.countryFr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected advisory display */}
                {curAdvisory && (
                  <div className={`p-5 rounded-lg border space-y-3.5 ${getLevelColor(curAdvisory.level).bg}`}>
                    <div className="flex justify-between items-center border-b border-gray-200/40 pb-2">
                      <h3 className="font-extrabold text-base">
                        {currentLang === 'en' ? curAdvisory.country : curAdvisory.countryFr}
                      </h3>
                      <span className="text-xs font-bold uppercase py-0.5 px-2.5 rounded-full bg-white/40 border text-gray-800">
                        {getLevelColor(curAdvisory.level).label}
                      </span>
                    </div>

                    <p className="text-xs font-bold leading-relaxed">
                      {currentLang === 'en' ? curAdvisory.advisoryText : curAdvisory.advisoryTextFr}
                    </p>

                    <div className="text-[11px] leading-relaxed text-gray-600 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        {currentLang === 'en'
                          ? 'Emergency Support: Consult your local embassy or consulate immediately if you encounter distress abroad.'
                          : 'Soutien d\'urgence : Contactez l\'ambassade du Canada en cas de problème à l\'étranger.'}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

        {/* Right Columns: custom guidelines (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-[#333] tracking-widest uppercase border-b pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              {currentLang === 'en' ? 'Customs & Entering' : 'Douanes et entrée'}
            </h3>

            <div className="space-y-3 text-gray-650 leading-relaxed font-sans">
              <div className="space-y-0.5">
                <span className="font-bold text-sky-700 block">Arriving Declarations (CBSA)</span>
                <p className="text-gray-500">Submit your customs and immigration declaration up to 72 hours before arrival using our online gates.</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-sky-700 block">Biometric Scans on Entrance</span>
                <p className="text-gray-500 font-medium">Temporary resident applicants hold a confirmation biometric matching check inside airport primary collection kiosks.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
