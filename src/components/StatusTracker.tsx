import { useState, useMemo } from 'react';
import { Language } from '../types';
import { Calendar, AlertTriangle, CheckCircle2, ShieldCheck, Clock, Sparkles } from 'lucide-react';

interface StatusTrackerProps {
  currentLang: Language;
  mode: 'when' | 'after';
}

export default function StatusTracker({ currentLang, mode }: StatusTrackerProps) {
  // Mode "when": Deadline Calculator States
  const [bilDate, setBilDate] = useState<string>('');
  
  // Mode "after": Validity Checker States
  const [prevBioDate, setPrevBioDate] = useState<string>('');

  // Translations
  const t = useMemo(() => {
    return currentLang === 'en'
      ? {
          // Mode When
          whenTitle: 'When to give your biometrics',
          whenIntro: 'You must provide your biometrics within 30 days of receiving your Biometric Instruction Letter (BIL). Compute your deadline and plan your travel schedule accordingly.',
          calcDeadlineHeader: '30-Day Deadline Calculator',
          calcDeadlineLabel: 'Select the date printed on your Biometric Instruction Letter (BIL):',
          daysRemaining: '{days} days remaining',
          daysOverdue: '{days} days overdue (expired)',
          deadlineResult: 'Your absolute deadline to provide biometrics is:',
          statusSafe: 'Active Period',
          statusUrgent: 'Urgent Action Required',
          statusExpired: 'Deadline Passed',
          whenScheduleTip: 'Tip: Book your appointment immediately upon getting your BIL. Spots at some Visa Application Centres fill up fast.',
          
          // Mode After
          afterTitle: 'What happens after giving biometrics',
          afterIntro: 'Once you give your fingerprints and photo at a collection point, they are securely transmitted to IRCC. For temporary resident applications, they are valid for 10 years.',
          calcValidityHeader: '10-Year Biometrics Validity Checker',
          calcValidityLabel: 'Select the date you last gave your biometrics to Canada:',
          validityResult: 'Your biometrics are valid until:',
          validStatusActive: 'VALID - Reusable',
          validStatusExpired: 'EXPIRED - Must provide new biometrics',
          validExplanation: 'You can reuse these biometrics for any new visitor visa, study permit, or work permit application. You do NOT have to pay the $85 CAD biographical fee again.',
          expiredExplanation: 'Your previous biometrics have expired. You must pay the fee and provide new fingerprints and photos for your next application.',
          validPrDisclaimer: 'Important PR Rule: Even if your biometrics are still valid, temporary biometrics cannot be reused for Permanent Resident (PR) applications. You must give them again.',
          yearsRemaining: '{years} years and {months} months of validity remaining',
        }
      : {
          // Mode When
          whenTitle: 'Quand fournir vos données biométriques',
          whenIntro: 'Vous devez fournir vos données biométriques dans les 30 jours suivant la réception de votre lettre d\'instructions (LIB). Calculez votre date limite pour éviter tout retard.',
          calcDeadlineHeader: 'Calculateur de date limite de 30 jours',
          calcDeadlineLabel: 'Sélectionnez la date imprimée sur votre lettre d\'instructions (LIB) :',
          daysRemaining: '{days} jours restants',
          daysOverdue: '{days} jours de retard (expirée)',
          deadlineResult: 'Votre date limite absolue pour fournir vos données biométriques est le :',
          statusSafe: 'Période active',
          statusUrgent: 'Action urgente requise',
          statusExpired: 'Date limite dépassée',
          whenScheduleTip: 'Conseil : Prenez rendez-vous dès la réception de votre lettre d\'instructions. Les places dans certains centres se remplissent vite.',
          
          // Mode After
          afterTitle: 'Que se passe-t-il après la biométrie',
          afterIntro: 'Une fois vos empreintes et votre photo fournies, elles sont transmises de façon sécurisée à l\'IRCC. Pour les demandes de séjour temporaire, elles restent valides pendant 10 ans.',
          calcValidityHeader: 'Vérificateur de validité de 10 ans',
          calcValidityLabel: 'Sélectionnez la date à laquelle vous avez fourni vos données pour la dernière fois :',
          validityResult: 'Vos données biométriques sont valides jusqu\'au :',
          validStatusActive: 'VALIDE - Réutilisable',
          validStatusExpired: 'EXPIRÉ - Nouvelle biométrie obligatoire',
          validExplanation: 'Vous pouvez réutiliser ces données biométriques pour toute nouvelle demande de visa de visiteur, de permis d\'études ou de travail. Vous n\'avez pas à repayer les frais de 85 $ CAD.',
          expiredExplanation: 'Vos anciennes données biométriques ont expiré. Vous devez repayer les frais et fournir de nouvelles empreintes pour votre prochaine demande.',
          validPrDisclaimer: 'Règle RP importante : Même si vos données sont valides, la biométrie temporaire ne peut pas être réutilisée pour les demandes de résidence permanente (RP). Vous devez la refaire.',
          yearsRemaining: '{years} ans et {months} mois de validité restante',
        };
  }, [currentLang]);

  // Mode "when": calculate target details
  const deadlineAnalysis = useMemo(() => {
    if (!bilDate) return null;
    const dateObj = new Date(bilDate + 'T00:00:00');
    if (isNaN(dateObj.getTime())) return null;

    // Deadline is exactly 30 days later
    const deadlineObj = new Date(dateObj);
    deadlineObj.setDate(deadlineObj.getDate() + 30);

    const today = new Date();
    // Neutralize hours for uniform math
    today.setHours(0, 0, 0, 0);
    deadlineObj.setHours(0, 0, 0, 0);

    const diffTime = deadlineObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: 'safe' | 'urgent' | 'expired' = 'safe';
    if (diffDays < 0) {
      status = 'expired';
    } else if (diffDays <= 7) {
      status = 'urgent';
    }

    const formattedDeadline = deadlineObj.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      deadlineDate: formattedDeadline,
      daysDiff: diffDays,
      status,
    };
  }, [bilDate, currentLang]);

  // Mode "after": calculate validity details
  const validityAnalysis = useMemo(() => {
    if (!prevBioDate) return null;
    const dateObj = new Date(prevBioDate + 'T00:00:00');
    if (isNaN(dateObj.getTime())) return null;

    // Expiry is exactly 10 years later
    const expiryObj = new Date(dateObj);
    expiryObj.setFullYear(expiryObj.getFullYear() + 10);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryObj.setHours(0, 0, 0, 0);

    const isValid = expiryObj.getTime() > today.getTime();

    // calculate approximate remaining years and months
    const totalDiffMonth = (expiryObj.getFullYear() - today.getFullYear()) * 12 + (expiryObj.getMonth() - today.getMonth());
    const remYears = Math.max(0, Math.floor(totalDiffMonth / 12));
    const remMonths = Math.max(0, totalDiffMonth % 12);

    const formattedExpiry = expiryObj.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      expiryDate: formattedExpiry,
      isValid,
      remYears,
      remMonths,
    };
  }, [prevBioDate, currentLang]);

  return (
    <div className="space-y-6 font-sans">
      {/* Dynamic Intro according to mode */}
      <div>
        <h2 className="text-2xl font-bold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {mode === 'when' ? t.whenTitle : t.afterTitle}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          {mode === 'when' ? t.whenIntro : t.afterIntro}
        </p>
      </div>

      {mode === 'when' ? (
        /* MODE: WHEN (Deadline computation) */
        <div className="space-y-5" id="deadline-calculator-section">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-5">
            <h3 className="text-base font-bold text-[#333] border-b border-gray-150 pb-2 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#bf1e2e]" />
              {t.calcDeadlineHeader}
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#333]" htmlFor="bil-date-input">
                  {t.calcDeadlineLabel}
                </label>
                <input
                  id="bil-date-input"
                  type="date"
                  value={bilDate}
                  onChange={(e) => setBilDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm text-[#333] outline-none focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4]"
                />
              </div>

              {deadlineAnalysis && (
                <div className="border-t border-gray-100 pt-4 space-y-3" id="deadline-analysis-result">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                      {t.deadlineResult}
                    </span>
                    <strong className="text-lg text-[#af3c43] font-extrabold block">
                      {deadlineAnalysis.deadlineDate}
                    </strong>
                  </div>

                  {/* Visual Timeline and Alerts */}
                  {deadlineAnalysis.status === 'safe' && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r p-3.5 flex items-start gap-2 text-emerald-900 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs uppercase block tracking-wider text-emerald-700">
                          {t.statusSafe}
                        </span>
                        <span>
                          {t.daysRemaining.replace('{days}', deadlineAnalysis.daysDiff.toString())}
                        </span>
                      </div>
                    </div>
                  )}

                  {deadlineAnalysis.status === 'urgent' && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r p-3.5 flex items-start gap-2 text-amber-900 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs uppercase block tracking-wider text-amber-700">
                          {t.statusUrgent}
                        </span>
                        <span className="font-semibold">
                          {t.daysRemaining.replace('{days}', deadlineAnalysis.daysDiff.toString())}
                        </span>
                      </div>
                    </div>
                  )}

                  {deadlineAnalysis.status === 'expired' && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-r p-3.5 flex items-start gap-2 text-red-950 text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs uppercase block tracking-wider text-red-700">
                          {t.statusExpired}
                        </span>
                        <span className="font-semibold">
                          {t.daysOverdue.replace('{days}', Math.abs(deadlineAnalysis.daysDiff).toString())}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Schedule Tips Panel */}
          <div className="bg-[#fcf8e3] border border-[#fbeed5] rounded-lg p-4 flex gap-3 text-sm text-[#c09853]" id="deadline-schedule-tip-card">
            <Clock className="w-5 h-5 shrink-0 text-[#c09853] mt-0.5" />
            <p className="leading-relaxed font-semibold">
              {t.whenScheduleTip}
            </p>
          </div>
        </div>
      ) : (
        /* MODE: AFTER (10-year validity tracking) */
        <div className="space-y-5" id="validity-tracker-section">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-5">
            <h3 className="text-base font-bold text-[#333] border-b border-gray-150 pb-2 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2572b4]" />
              {t.calcValidityHeader}
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#333]" htmlFor="prev-bio-date">
                  {t.calcValidityLabel}
                </label>
                <input
                  id="prev-bio-date"
                  type="date"
                  value={prevBioDate}
                  onChange={(e) => setPrevBioDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm text-[#333] outline-none focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4]"
                />
              </div>

              {validityAnalysis && (
                <div className="border-t border-gray-100 pt-4 space-y-4" id="validity-analysis-result">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                      {t.validityResult}
                    </span>
                    <strong className="text-lg text-emerald-700 font-extrabold block">
                      {validityAnalysis.expiryDate}
                    </strong>
                  </div>

                  {validityAnalysis.isValid ? (
                    <div className="space-y-3">
                      {/* Validity Active Success Message */}
                      <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r p-3.5 flex items-start gap-2 text-emerald-900 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-xs uppercase block tracking-wider text-emerald-700">
                            {t.validStatusActive}
                          </span>
                          <span className="block font-medium">
                            {t.yearsRemaining
                              .replace('{years}', validityAnalysis.remYears.toString())
                              .replace('{months}', validityAnalysis.remMonths.toString())}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-650 bg-gray-50 border border-gray-100 p-3 rounded leading-relaxed">
                        {t.validExplanation}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Validity Expired Error Message */}
                      <div className="bg-red-50 border-l-4 border-red-500 rounded-r p-3.5 flex items-start gap-2 text-red-950 text-sm">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-xs uppercase block tracking-wider text-red-700">
                            {t.validStatusExpired}
                          </span>
                          <span className="block font-medium">
                            {currentLang === 'en' ? 'These biometrics cannot be reused.' : 'Ces données biométriques ne peuvent plus être réutilisées.'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-650 bg-gray-50 border border-gray-100 p-3 rounded leading-relaxed">
                        {t.expiredExplanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Important PR Exclusion Warning Panel */}
          <div className="bg-red-50/70 border border-red-200/40 rounded-lg p-4 flex gap-3 text-xs text-red-800" id="pr-disclaimer-warning-card">
            <Sparkles className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <p className="leading-relaxed font-semibold">
              {t.validPrDisclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
