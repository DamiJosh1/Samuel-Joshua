import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Coins, Gift, Calculator, FileText, ChevronRight } from 'lucide-react';

export default function Benefits() {
  const { currentLang } = useApp();

  // Child Benefits Simulator States
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [familyIncome, setFamilyIncome] = useState<number>(45000);

  // CCB Simulated calculation logic
  const calculateCCB = () => {
    if (childrenCount === 0) return 0;
    
    // Base is approx $7,400 per child under 6 per year, phased out based on income
    let baseCCB = childrenCount * 7437;
    let reduction = 0;
    if (familyIncome > 35000) {
      reduction = (familyIncome - 35000) * 0.07 * childrenCount;
    }
    return Math.max(0, Math.floor(baseCCB - reduction));
  };

  const estimatedCCB = calculateCCB();

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Social service benefits & credit allowances' : 'Prestations sociales et allocations'}
        </h1>
        <p className="text-gray-750 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Determine eligibility for Employment Insurance (EI), pensions, and calculate your estimated monthly payments for the Canada Child Benefit.'
            : 'Évaluez votre admissibilité à l\'assurance-emploi, aux pensions de retraite et estimez vos allocations canadiennes pour enfants.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left columns: CCB estimator (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              {currentLang === 'en' ? 'Interactive Canada Child Benefit (CCB) Estimator' : 'Calculateur interactif d\'allocations pour enfants'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Kids count selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block uppercase">
                  {currentLang === 'en' ? 'Number of eligible children:' : 'Nombre d\'enfants à charge :'}
                </label>
                <select 
                  value={childrenCount} 
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full border p-2 text-sm rounded bg-gray-50 text-[#333] outline-none"
                >
                  <option value="0">0 ({currentLang === 'en' ? 'No Children' : 'Aucun enfant'})</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4 ({currentLang === 'en' ? 'Four or more' : 'Quatre ou plus'})</option>
                </select>
              </div>

              {/* Family net income */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block uppercase">
                  {currentLang === 'en' ? 'Adjusted family net income (AFNI):' : 'Revenu net familial ajusté (CAD) :'}
                </label>
                <input
                  type="number"
                  value={familyIncome}
                  onChange={(e) => setFamilyIncome(Math.max(0, Number(e.target.value)))}
                  className="w-full border p-1.5 text-sm rounded bg-gray-50 text-[#333] outline-none"
                  placeholder="e.g., 45000"
                />
              </div>

            </div>

            {/* Simulated CCB calculation output */}
            <div className="bg-[#f2fcf7] border border-emerald-100 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-800 uppercase block">{currentLang === 'en' ? 'Estimated annual credit payment:' : 'Montant annuel estimé de la prestation :'}</span>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  {currentLang === 'en' 
                    ? 'Determined according to custom family income index, paid on a monthly basis by the Canada Revenue Agency.'
                    : 'Déterminé selon les critères du revenu net familial ajusté, versé mensuellement par l\'ARC.'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-3xl font-extrabold text-emerald-700 block">${estimatedCCB.toLocaleString()} CAD</span>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">{currentLang === 'en' ? 'CAD per Year' : 'CAD par année'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Info Bar widget (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-[#333] tracking-widest uppercase border-b pb-2 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-teal-600" />
              {currentLang === 'en' ? 'Major Programs' : 'Programmes majeurs'}
            </h3>

            <div className="space-y-3 font-sans">
              <div className="space-y-0.5">
                <span className="font-bold text-teal-700 block">Employment Insurance (EI)</span>
                <p className="text-gray-500">Provides up to 55% of average weekly earnings (maximum of $668/week) to individuals who lose their jobs through no fault of their own.</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-teal-700 block">Old Age Security (OAS)</span>
                <p className="text-gray-500">A monthly social support payment available to seniors aged 65 and older who meet requirements.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
