import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, ShieldCheck, BadgeHelp, FileText, Landmark, Clock } from 'lucide-react';

export default function Taxes() {
  const { currentLang } = useApp();

  // Tax brackets calculate state
  const [grossIncome, setGrossIncome] = useState<number>(55000);

  // Simple Canadian Federal 2026 tax bracket calculator simulator
  const calculateFederalTax = () => {
    let tax = 0;
    let income = grossIncome;

    const brackets = [
      { limit: 55867, rate: 0.15 },
      { limit: 111733, rate: 0.205 },
      { limit: 173205, rate: 0.26 },
      { limit: 246752, rate: 0.29 },
      { limit: Infinity, rate: 0.33 }
    ];

    let prevLimit = 0;
    for (let b of brackets) {
      if (income > b.limit) {
        tax += (b.limit - prevLimit) * b.rate;
        prevLimit = b.limit;
      } else {
        tax += (income - prevLimit) * b.rate;
        break;
      }
    }
    return Math.max(0, parseFloat(tax.toFixed(2)));
  };

  const taxPayable = calculateFederalTax();
  const effectiveRate = grossIncome > 0 ? parseFloat(((taxPayable / grossIncome) * 100).toFixed(1)) : 0;

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Taxes and personal income filings' : 'Impôts et déclarations de revenus'}
        </h1>
        <p className="text-gray-750 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Access the Canada Revenue Agency (CRA) filing gates, inspect 2026 tax brackets, calculate gross income thresholds, and check deadlines.'
            : 'Accédez au dépôt de l\'Agence du revenu du Canada (ARC), consultez les taux d\'imposition et estimez vos impôts dus.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left main: interactive brackets estimator (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#2572b4]" />
              {currentLang === 'en' ? 'Interactive Federal Tax brackets estimation tool' : 'Estimateur d\'impôt fédéral interactif'}
            </h2>

            <div className="space-y-3 max-w-md">
              <label className="text-xs font-bold text-gray-700 block uppercase">
                {currentLang === 'en' ? 'Your annual taxable gross income (CAD):' : 'Votre revenu imposable annuel brut (CAD) :'}
              </label>
              <div className="flex items-center">
                <span className="bg-gray-150 border border-gray-300 border-r-0 rounded-l px-3.5 py-2 text-sm text-gray-500 font-bold">$</span>
                <input
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
                  className="w-full border border-gray-300 rounded-r p-2 text-sm outline-none focus:border-[#2572b4] text-[#333]"
                  placeholder="e.g., 55000"
                />
              </div>
            </div>

            {/* Simulated Calculations Report Display */}
            <div className="bg-[#f3f8fc] border border-blue-100 rounded-lg p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase block">{currentLang === 'en' ? 'Estimated Federal Tax Payable:' : 'Impôt fédéral estimé :'}</span>
                  <span className="text-2xl font-extrabold text-[#af3c43]">${taxPayable.toLocaleString()} CAD</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase block">{currentLang === 'en' ? 'Effective Federal Tax Rate:' : 'Taux d\'imposition effectif :'}</span>
                  <span className="text-lg font-bold text-[#335075]">{effectiveRate}%</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 leading-relaxed border-t sm:border-t-0 sm:border-l pl-0 sm:pl-4 pt-4 sm:pt-0 space-y-1.5">
                <p className="font-bold flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-blue-500" />
                  <span>{currentLang === 'en' ? 'Calculated Brackets Breakdown:' : 'Tranches d\'imposition de base :'}</span>
                </p>
                <ul className="space-y-1 list-disc pl-4 text-[10px]">
                  <li>{currentLang === 'en' ? 'First $55,867 taxed in pool at 15.0%' : 'Premiers 55 867 $ imposés à 15 %'}</li>
                  <li>{currentLang === 'en' ? 'Next dollars up to $111,733 at 20.5%' : 'Dollars suivants jusqu\'à 111 733 $ à 20,5 %'}</li>
                </ul>
              </div>
            </div>

            <div className="text-xs text-gray-500 italic bg-amber-50 p-2.5 rounded border border-amber-150">
              {currentLang === 'en' 
                ? 'Disclaimer: Calculations represent approximations of federal rates only. Provincial taxes, deductions, and tax credits are not integrated.'
                : 'Avertissement : Les calculs représentent des estimations des taux fédéraux uniquement. Les impôts provinciaux ne sont pas intégrés.'}
            </div>

          </div>
        </div>

        {/* Right Info Bar widget (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-[#333] tracking-widest uppercase border-b pb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#af3c43]" />
              {currentLang === 'en' ? 'Upcoming Deadlines' : 'Dates d\'échéance importantes'}
            </h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="font-bold text-gray-700 block">April 30, 2027</span>
                <p className="text-gray-500">Standard filing and payment deadline for personal tax returns to the Canada Revenue Agency.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-gray-700 block">June 15, 2027</span>
                <p className="text-gray-500">Filing deadline for self-employed individuals and business partnerships profiles.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
