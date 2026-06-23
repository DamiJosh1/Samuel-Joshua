import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { HelpCircle, CheckCircle, AlertTriangle, RefreshCw, Info } from 'lucide-react';

interface EligibilityCheckerProps {
  currentLang: Language;
}

const COUNTRIES = [
  { code: 'CA', nameEn: 'Canada', nameFr: 'Canada', exempt: true },
  { code: 'US', nameEn: 'United States', nameFr: 'États-Unis', exempt: true },
  { code: 'IN', nameEn: 'India', nameFr: 'Inde', exempt: false },
  { code: 'PH', nameEn: 'Philippines', nameFr: 'Philippines', exempt: false },
  { code: 'CN', nameEn: 'China', nameFr: 'Chine', exempt: false },
  { code: 'FR', nameEn: 'France', nameFr: 'France', exempt: false },
  { code: 'GB', nameEn: 'United Kingdom', nameFr: 'Royaume-Uni', exempt: false },
  { code: 'NG', nameEn: 'Nigeria', nameFr: 'Nigéria', exempt: false },
  { code: 'MX', nameEn: 'Mexico', nameFr: 'Mexique', exempt: false },
  { code: 'BR', nameEn: 'Brazil', nameFr: 'Brésil', exempt: false },
  { code: 'MA', nameEn: 'Morocco', nameFr: 'Maroc', exempt: false },
  { code: 'VN', nameEn: 'Vietnam', nameFr: 'Vietnam', exempt: false },
  { code: 'DE', nameEn: 'Germany', nameFr: 'Allemagne', exempt: false },
  { code: 'AU', nameEn: 'Australia', nameFr: 'Australie', exempt: false },
  { code: 'OTHER', nameEn: 'Other Country / Territory', nameFr: 'Autre pays / territoire', exempt: false },
];

export default function EligibilityChecker({ currentLang }: EligibilityCheckerProps) {
  const [country, setCountry] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [previousBiometrics, setPreviousBiometrics] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);

  const t = useMemo(() => {
    return currentLang === 'en'
      ? {
          title: 'Find out if you need to give biometrics',
          subtitle: 'Answer a few questions to see if you have to provide your fingerprints and photo.',
          qCountry: '1. Select the country or territory of your custom passport/travel document:',
          placeholderCountry: '-- Select Country --',
          qAge: '2. How old is the applicant?',
          ageUnder14: 'Under 14 years old (exempt)',
          age14To79: 'Between 14 and 79 years old',
          age80OrOlder: '80 years old or older (exempt)',
          qPurpose: '3. What visa or permit are you applying for?',
          purposeVisitor: 'Visitor Card / Transit / Vacation / Holiday Visa',
          purposeStudy: 'Study Permit',
          purposeWork: 'Work Permit',
          purposePR: 'Permanent Residence (PR)',
          qPrev: '4. Have you given biometrics to Canada in the last 10 years?',
          yes: 'Yes, and they are still within the 10-year validity',
          no: 'No, or they have expired/never given',
          btnCheck: 'Check Eligibility',
          btnReset: 'Start Over',
          resultHeader: 'Eligibility Results',
          exemptTitle: 'You are EXEMPT from biometrics',
          requiredTitle: 'You MUST provide biometrics',
          reasonAge: 'Individuals aged under 14 or 80 and older are exempt from biometrics.',
          reasonCountry: 'Canadian citizens and citizens of the United States are exempt from giving biometrics.',
          reasonPR: 'Previous biometrics for temporary entries cannot be reused for permanent residence applications. You must give biometrics again.',
          reasonPrev: 'Your biometrics are valid for 10 years for temporary entries (visitor, student, worker). You do not need to give them again if they are still valid.',
          reasonRequired: 'Based on your age and visa category, you must pay the biometrics fee ($85 CAD single, $170 family) and give your biometrics.',
          nextSteps: 'Next Steps',
          nextStepsExempt: 'You do not need to pay the $85 fee or book an appointment. Simply submit your application as normal.',
          nextStepsRequired: '1. Pay the biometrics fee ($85 CAD) when submitting your visa application. 2. Receive your Biometric Instruction Letter (BIL). 3. Book your appointment at an official location.',
          feeNotice: 'Standard fee: $85 CAD per person. Maximum $170 CAD for families applying together.',
        }
      : {
          title: 'Vérifiez si vous devez fournir vos données biométriques',
          subtitle: 'Répondez à quelques questions pour savoir si vous devez fournir vos empreintes et votre photo.',
          qCountry: '1. Sélectionnez le pays ou territoire de votre passeport ou document de voyage :',
          placeholderCountry: '-- Sélectionner le pays --',
          qAge: '2. Quel âge a le demandeur ?',
          ageUnder14: 'Moins de 14 ans (exempté)',
          age14To79: 'Entre 14 et 79 ans',
          age80OrOlder: '80 ans ou plus (exempté)',
          qPurpose: '3. Quel visa ou permis demandez-vous ?',
          purposeVisitor: 'Visa de visiteur / Transit / Vacances / Séjour',
          purposeStudy: 'Permis d\'études',
          purposeWork: 'Permis de travail',
          purposePR: 'Résidence permanente',
          qPrev: '4. Avez-vous fourni vos données biométriques au Canada ces 10 dernières années ?',
          yes: 'Oui, et elles sont encore valides (moins de 10 ans)',
          no: 'Non, ou elles ont expiré / jamais fournies',
          btnCheck: 'Vérifier l\'admissibilité',
          btnReset: 'Recommencer',
          resultHeader: 'Résultats d\'admissibilité',
          exemptTitle: 'Vous êtes EXEMPTÉ de fournir vos données biométriques',
          requiredTitle: 'Vous DEVEZ fournir vos données biométriques',
          reasonAge: 'Les personnes de moins de 14 ans ou de 80 ans et plus sont exemptées de la biométrie.',
          reasonCountry: 'Les citoyens canadiens et les citoyens des États-Unis sont exemptés de fournir des données biométriques.',
          reasonPR: 'Les anciennes données biométriques pour les séjours temporaires ne peuvent pas être réutilisées pour les demandes de résidence permanente. Vous devez les fournir à nouveau.',
          reasonPrev: 'Vos données biométriques sont valides pendant 10 ans pour les demandes de visa de visiteur, d\'étudiant ou de travailleur. Vous n\'avez pas besoin de les donner à nouveau.',
          reasonRequired: 'Compte tenu de votre âge et de votre catégorie de visa, vous devez payer les frais de biométrie (85 $ CAD par personne) et fournir vos données.',
          nextSteps: 'Prochaines étapes',
          nextStepsExempt: 'Vous n\'avez pas besoin de payer les frais de 85 $ ni de prendre de rendez-vous. Soumettez simplement votre demande normalement.',
          nextStepsRequired: '1. Payez les frais de biométrie (85 $ CAD) lors du dépôt de votre demande de visa. 2. Recevez votre lettre d\'instructions (LIB). 3. Prenez rendez-vous dans un centre de collecte officiel.',
          feeNotice: 'Frais standards : 85 $ CAD par personne. Maximum de 170 $ CAD pour les familles présentant une demande conjointe.',
        };
  }, [currentLang]);

  const assessment = useMemo(() => {
    if (!checked) return null;

    const selectedCountry = COUNTRIES.find((c) => c.code === country);
    
    // 1. Check citizenship exemptions (Canada / US citizens are exempt)
    if (selectedCountry?.exempt) {
      return {
        exempt: true,
        reason: t.reasonCountry,
      };
    }

    // 2. Check age exemptions
    if (ageGroup === 'under14' || ageGroup === '80orOlder') {
      return {
        exempt: true,
        reason: t.reasonAge,
      };
    }

    // 3. For Permanent Residence, previous biometrics cannot be reused (even if within 10 years)
    if (purpose === 'pr') {
      return {
        exempt: false,
        reason: t.reasonPR,
      };
    }

    // 4. Temporary resident (visitor/student/worker) with active previous biometrics
    if (previousBiometrics === 'yes') {
      return {
        exempt: true,
        reason: t.reasonPrev,
      };
    }

    // 5. Default requirement
    return {
      exempt: false,
      reason: t.reasonRequired,
    };
  }, [checked, country, ageGroup, purpose, previousBiometrics, t]);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (country && ageGroup && purpose && (ageGroup === '14to79' ? previousBiometrics : true)) {
      setChecked(true);
    }
  };

  const handleReset = () => {
    setCountry('');
    setAgeGroup('');
    setPurpose('');
    setPreviousBiometrics('');
    setChecked(false);
  };

  const isFormComplete = 
    country && 
    ageGroup && 
    purpose && 
    (ageGroup !== '14to79' || previousBiometrics);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Who needs to give biometrics' : 'Qui doit fournir ses données biométriques'}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {currentLang === 'en'
            ? 'In general, you need to give biometrics if you apply for a visitor visa, a study or work permit, or permanent residence. However, several exceptions apply based on your nationality, your age, or whether you have given biometrics to Canada before.'
            : 'En général, vous devez fournir vos données biométriques si vous demandez un visa de visiteur, un permis d\'études ou de travail, ou la résidence permanente. Cependant, plusieurs exceptions s\'appliquent en fonction de votre nationalité, de votre âge ou du fait que vous les ayez déjà fournies.'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#335075] text-white px-5 py-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-200" />
          <h3 className="text-lg font-bold">{t.title}</h3>
        </div>
        
        <form onSubmit={handleCheck} className="p-5 space-y-5">
          <p className="text-sm text-gray-500">{t.subtitle}</p>

          {/* Q1: Country */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#333]" htmlFor="country-select">
              {t.qCountry}
            </label>
            <select
              id="country-select"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setChecked(false);
              }}
              className="w-full max-w-md border border-gray-300 rounded px-3 py-2 text-sm text-[#333] bg-white focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4] outline-none"
            >
              <option value="">{t.placeholderCountry}</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {currentLang === 'en' ? c.nameEn : c.nameFr}
                </option>
              ))}
            </select>
          </div>

          {country && (
            /* Q2: Age */
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <span className="block text-sm font-bold text-[#333]">
                {t.qAge}
              </span>
              <div className="space-y-2">
                {[
                  { value: 'under14', label: t.ageUnder14 },
                  { value: '14to79', label: t.age14To79 },
                  { value: '80orOlder', label: t.age80OrOlder },
                ].map((age) => (
                  <label key={age.value} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                    <input
                      type="radio"
                      name="ageGroup"
                      value={age.value}
                      checked={ageGroup === age.value}
                      onChange={(e) => {
                        setAgeGroup(e.target.value);
                        setChecked(false);
                        if (age.value !== '14to79') {
                          setPreviousBiometrics('');
                        }
                      }}
                      className="w-4 h-4 text-[#2572b4] border-gray-300 focus:ring-[#2572b4]"
                    />
                    <span className="text-[#333]">{age.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {country && ageGroup && (
            /* Q3: Purpose */
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <span className="block text-sm font-bold text-[#333]">
                {t.qPurpose}
              </span>
              <div className="space-y-2">
                {[
                  { value: 'visitor', label: t.purposeVisitor },
                  { value: 'study', label: t.purposeStudy },
                  { value: 'work', label: t.purposeWork },
                  { value: 'pr', label: t.purposePR },
                ].map((p) => (
                  <label key={p.value} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                    <input
                      type="radio"
                      name="purpose"
                      value={p.value}
                      checked={purpose === p.value}
                      onChange={(e) => {
                        setPurpose(e.target.value);
                        setChecked(false);
                      }}
                      className="w-4 h-4 text-[#2572b4] border-gray-300 focus:ring-[#2572b4]"
                    />
                    <span className="text-[#333]">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {country && ageGroup === '14to79' && purpose && (
            /* Q4: Previous Biometrics */
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <span className="block text-sm font-bold text-[#333]">
                {t.qPrev}
              </span>
              <div className="space-y-2">
                {[
                  { value: 'yes', label: t.yes },
                  { value: 'no', label: t.no },
                ].map((b) => (
                  <label key={b.value} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                    <input
                      type="radio"
                      name="previousBiometrics"
                      value={b.value}
                      checked={previousBiometrics === b.value}
                      onChange={(e) => {
                        setPreviousBiometrics(e.target.value);
                        setChecked(false);
                      }}
                      className="w-4 h-4 text-[#2572b4] border-gray-300 focus:ring-[#2572b4]"
                    />
                    <span className="text-[#333]">{b.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={!isFormComplete || checked}
              className={`px-5 py-2 rounded font-bold text-sm text-white transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-[#335075] outline-none ${
                isFormComplete && !checked
                  ? 'bg-[#335075] hover:bg-[#1c3552] cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              id="eligibility-check-submit-btn"
            >
              {t.btnCheck}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded font-medium text-sm transition-colors cursor-pointer flex items-center gap-1.5 focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 outline-none"
              id="eligibility-reset-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.btnReset}</span>
            </button>
          </div>
        </form>

        {/* Results Panel */}
        {checked && assessment && (
          <div className="bg-gray-50 border-t border-gray-200 p-5 space-y-4" id="eligibility-results-panel">
            <h4 className="text-base font-bold text-[#333] uppercase tracking-wide border-b border-gray-200 pb-1.5">
              {t.resultHeader}
            </h4>

            {assessment.exempt ? (
              <div className="bg-[#f3f9f3] border-l-6 border-[#2b8a3e] rounded-r p-4 space-y-3">
                <div className="flex items-center gap-2.5 text-[#2b8a3e]">
                  <CheckCircle className="w-5, h-5 shrink-0" />
                  <span className="font-bold text-base">{t.exemptTitle}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {assessment.reason}
                </p>
                <div className="bg-white/80 rounded p-3 text-xs text-gray-600 border border-emerald-100/60 leading-relaxed">
                  <div className="font-bold text-[#c23e45] uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> {t.nextSteps}
                  </div>
                  {t.nextStepsExempt}
                </div>
              </div>
            ) : (
              <div className="bg-[#fdf6f2] border-l-6 border-[#d9480f] rounded-r p-4 space-y-3">
                <div className="flex items-center gap-2.5 text-[#d9480f]">
                  <AlertTriangle className="w-5, h-5 shrink-0" />
                  <span className="font-bold text-base">{t.requiredTitle}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {assessment.reason}
                </p>
                <div className="bg-white/85 rounded p-3 text-xs font-semibold text-gray-700 border border-orange-100/50 leading-relaxed">
                  <div className="font-bold text-[#af3c43] uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> {t.nextSteps}
                  </div>
                  {t.nextStepsRequired}
                </div>
                <div className="text-xs text-gray-500 italic mt-1 bg-white/50 px-3 py-1.5 rounded">
                  {t.feeNotice}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
