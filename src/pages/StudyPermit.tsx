import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, AlertTriangle, Calculator, Command, Compass } from 'lucide-react';

export default function StudyPermit() {
  const { currentLang } = useApp();

  // Tuition and living cost tracking
  const [tuition, setTuition] = useState<number>(18500);
  const [hasDliOffer, setHasDliOffer] = useState<boolean>(true);

  // Minimum cost of living for study inside Canada is $20,635 (from 2024 revised laws)
  const requiredLivingExps = 20635;
  const totalFundsNeeded = tuition + requiredLivingExps;

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Canadian study permits & student visas' : 'Permis d\'études et visa étudiant canadien'}
        </h1>
        <p className="text-gray-750 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Access Designated Learning Institutions (DLI) directories, verify student eligibility lists, and calculate required living proof of funds.'
            : 'Consultez le répertoire des Établissements d\'enseignement désignés (EED) et calculez la capacité financière d\'entretien requise.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column: Cost checker (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              {currentLang === 'en' ? 'Study Permit Financial Sufficiency Estimator' : 'Calculateur de suffisance de fonds d\'études'}
            </h2>

            <p className="text-xs text-gray-500 leading-relaxed">
              {currentLang === 'en'
                ? 'Under IRCC regulations, students must prove they hold sufficient funds to pay annual tuition plus minimum living standards (currently $20,635 CAD for a single applicant).'
                : 'Selon les règles d\'IRCC, vous devez prouver disposer de fonds pour payer les frais d\'études en plus du coût de l\'entretien (20 635 $ CAD).'}
            </p>

            <div className="space-y-4">
              
              {/* Tuition Input */}
              <div className="space-y-1.5 max-w-sm">
                <label className="text-xs font-bold text-gray-700 block uppercase">
                  {currentLang === 'en' ? 'Your annual tuition fee (CAD):' : 'Frais de scolarité annuels (CAD) :'}
                </label>
                <input
                  type="number"
                  value={tuition}
                  onChange={(e) => setTuition(Math.max(0, Number(e.target.value)))}
                  className="w-full border p-2 text-sm rounded bg-gray-50 text-[#333] outline-none"
                  placeholder="e.g. 18500"
                />
              </div>

              {/* DLI offer letter checkbox */}
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={hasDliOffer}
                    onChange={(e) => setHasDliOffer(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2572b4] border-gray-300 accent-[#2572b4]"
                  />
                  <span>{currentLang === 'en' ? 'I hold an official Letter of Acceptance from a Designated Learning Institution (DLI)' : 'Je dispose d\'une lettre d\'admission d\'un établissement d\'enseignement désigné (EED)'}</span>
                </label>
              </div>

            </div>

            {/* Calculations review */}
            <div className="bg-[#f2fcf7] border border-emerald-100 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <span className="font-bold text-emerald-800 uppercase block">{currentLang === 'en' ? 'Required Proof of Funds:' : 'Prouver la disponibilité de :'}</span>
                <span className="text-gray-500 block">Tuition (${tuition.toLocaleString()}) + Living expenses (${requiredLivingExps.toLocaleString()})</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-extrabold text-[#335075] block">${totalFundsNeeded.toLocaleString()} CAD</span>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">{currentLang === 'en' ? 'Minimum bank statement' : 'Seuil bancaire minimal'}</span>
              </div>
            </div>

            {/* Verification checklist message */}
            {!hasDliOffer && (
              <div className="p-3 bg-red-50 text-red-900 border-l-4 border-red-500 text-xs flex items-center gap-2 rounded-r">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{currentLang === 'en' ? 'Attention: You cannot apply for a study permit without a valid acceptance letter from an official DLI.' : 'Attention : Aucune demande de permis d\'étude n\'est traitée sans lettre d\'EED.'}</span>
              </div>
            )}

          </div>
        </div>

        {/* Right column: guides (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-[#333] tracking-widest uppercase border-b pb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-600" />
              {currentLang === 'en' ? 'Guidelines info' : 'Critères fondamentaux'}
            </h3>

            <div className="space-y-3.5 text-gray-650 leading-relaxed font-sans">
              <p>
                {currentLang === 'en'
                  ? 'PAL Requirement: Most students must attach a Provincial Attestation Letter (PAL) from the province where they plan to study.'
                  : 'Preuve PAL : La majorité des permis nécessitent l\'obtention d\'une lettre d\'attestation provinciale (PAL).'}
              </p>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
