import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, FileText, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';

export default function WorkPermit() {
  const { currentLang } = useApp();

  // Simple state tool
  const [skillLevel, setSkillLevel] = useState('TEER0');
  const [hasLmia, setHasLmia] = useState<'yes' | 'no' | 'exempt'>('yes');

  const getExamineDecision = () => {
    if (hasLmia === 'yes') {
      return currentLang === 'en' 
        ? "✓ Eligible for standard Employer-Specific Work Permit. Your employer holds an approved Labour Market Impact Assessment." 
        : "✓ Admissible pour un permis de travail fermé lié à un employeur donné. L'employeur possède une EIMT approuvée.";
    }
    if (hasLmia === 'exempt') {
      return currentLang === 'en'
        ? "✓ Open Work Permit / High Mobility Option fits. International mobility agreements apply (e.g. USMCA, CETA, IEC)."
        : "✓ Permis de travail ouvert ou accords de mobilité admissibles (ex : l'Accord Canada-États-Unis-Mexique).";
    }
    return currentLang === 'en' 
      ? "⚠ Refusal flag: Most Canadian work permits require a valid LMIA. Check exemptions or get an LMIA from your employer."
      : "⚠ Risque de refus : La majorité des permis ferment nécessite une EIMT. Vérifiez les clauses d'exemptions.";
  };

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Canadian work permits application' : 'Permis de travail au Canada'}
        </h1>
        <p className="text-gray-700 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en' 
            ? 'Discover streams to acquire legal employment rights inside Canada, understand employer LMIA sponsorships, and trace open options.'
            : 'Explorez les options légales pour occuper un emploi au Canada, comprenez l\'EIMT et suivez les permis de travail ouverts.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: LMIA Checker (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#2572b4]" />
              {currentLang === 'en' ? 'Work Permit Eligibility Analyser' : 'Analyseur d\'admissibilité au permis de travail'}
            </h2>

            <div className="space-y-4">
              
              {/* LMIA selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase block">{currentLang === 'en' ? 'Do you hold an LMIA file from your employer?' : 'Détenez-vous une EIMT de votre employeur ?'}</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs text-gray-750 cursor-pointer">
                    <input 
                      type="radio" 
                      name="lmia" 
                      checked={hasLmia === 'yes'} 
                      onChange={() => setHasLmia('yes')}
                      className="accent-[#2572b4]" 
                    />
                    <span>{currentLang === 'en' ? 'Yes, I hold an approved positive LMIA reference letter' : 'Oui, je possède une lettre d\'EIMT positive et active'}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-750 cursor-pointer">
                    <input 
                      type="radio" 
                      name="lmia" 
                      checked={hasLmia === 'exempt'} 
                      onChange={() => setHasLmia('exempt')}
                      className="accent-[#2572b4]" 
                    />
                    <span>{currentLang === 'en' ? 'No, but I qualify for LMIA exemptions (e.g. spouse, Working Holiday)' : 'Non, mais je suis exempté de l\'EIMT (ex : étudiant/conjoint, PVT)'}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-750 cursor-pointer">
                    <input 
                      type="radio" 
                      name="lmia" 
                      checked={hasLmia === 'no'} 
                      onChange={() => setHasLmia('no')}
                      className="accent-[#2572b4]" 
                    />
                    <span>{currentLang === 'en' ? 'No, I currently do not hold an LMIA or exemption code' : 'Non, je ne possède aucune EIMT ni code d\'exemption'}</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Decision output */}
            <div className="bg-[#f3f8fc] border border-blue-105 rounded-lg p-5">
              <h3 className="text-xs font-bold text-[#335075] uppercase block mb-1">{currentLang === 'en' ? 'Officer Recommendation:' : 'Avis d\'admissibilité préliminaire :'}</h3>
              <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                {getExamineDecision()}
              </p>
            </div>

          </div>
        </div>

        {/* Right Info columns (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-[#333] tracking-widest uppercase border-b pb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#af3c43]" />
              {currentLang === 'en' ? 'TEER Categories' : 'Niveaux de compétence FéER'}
            </h3>

            <div className="space-y-3.5 text-gray-650 leading-relaxed font-sans">
              <p>
                {currentLang === 'en'
                  ? 'FEER (TEER Categories 0 to 5) defines jobs skill metrics. TEER 0, 1, 2, 3 classify high-skill profiles eligible for faster Express Entry streams.'
                  : 'FéER (TEER 0 à 5) classe les emplois selon les compétences. Les niveaux FéER 0 à 3 facilitent l\'admission au Programme Entrée express.'}
              </p>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
