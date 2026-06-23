import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Milestone, HelpCircle, FileText, ChevronRight, Calculator, CheckCircle2 } from 'lucide-react';

export default function PermanentResidence() {
  const { currentLang } = useApp();

  // CRS Score State parameters
  const [age, setAge] = useState<number>(25); // Age parameter
  const [education, setEducation] = useState<'high' | 'bachelors' | 'masters' | 'phd'>('bachelors');
  const [languageLevel, setLanguageLevel] = useState<number>(9); // CLB level
  const [experience, setExperience] = useState<number>(1); // years of job experience in Canada
  const [hasOffer, setHasOffer] = useState<boolean>(false);

  // Calculate simulated CRS scores based on official-like guidelines
  const calculateCRS = () => {
    let agePoints = 0;
    if (age >= 20 && age <= 29) agePoints = 110;
    else if (age >= 30 && age <= 39) agePoints = 95;
    else if (age >= 40 && age <= 45) agePoints = 40;
    else agePoints = 0;

    let eduPoints = 0;
    if (education === 'high') eduPoints = 30;
    else if (education === 'bachelors') eduPoints = 120;
    else if (education === 'masters') eduPoints = 135;
    else if (education === 'phd') eduPoints = 150;

    let langPoints = 0;
    if (languageLevel >= 9) langPoints = 136;
    else if (languageLevel >= 7) langPoints = 110;
    else if (languageLevel >= 5) langPoints = 60;
    else langPoints = 15;

    let expPoints = 0;
    if (experience === 1) expPoints = 40;
    else if (experience >= 2) expPoints = 80;

    let offerPoints = hasOffer ? 50 : 0;

    return agePoints + eduPoints + langPoints + expPoints + offerPoints;
  };

  const crsScore = calculateCRS();

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Page titles */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Permanent residence in Canada' : 'Résidence permanente au Canada'}
        </h1>
        <p className="text-gray-700 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Discover streams to settle permanently in Canada. Verify qualifications, prepare your application files, and estimate score rankings below.'
            : 'Découvrez les programmes d\'immigration permanente de l\'IRCC. Évaluez votre admissibilité générale et déterminez vos points de sélection.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left main area: CRS score points simulator (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#2572b4]" />
              {currentLang === 'en' ? 'Express Entry CRS Score Simulator Tool' : 'Simulateur de point de sélection Entrée express SCG'}
            </h2>

            <p className="text-xs text-gray-500 leading-relaxed">
              {currentLang === 'en' 
                ? 'Adjust core selection criteria blocks below to estimate your rating on the Comprehensive Ranking System scale (Total maximum: 1200 points).'
                : 'Modifiez les critères fondamentaux d\'âge, d\'études et de maîtrise des langues ci-dessous pour estimer votre score global.'}
            </p>

            <div className="space-y-4">
              
              {/* Age select slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700 uppercase">{currentLang === 'en' ? 'Age Group' : 'Groupe d\'âge'}</span>
                  <span className="font-bold text-[#2572b4]">{age} {currentLang === 'en' ? 'years old' : 'ans'}</span>
                </div>
                <input 
                  type="range" 
                  min="18" 
                  max="50" 
                  value={age} 
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-[#2572b4]"
                />
              </div>

              {/* Education Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase block">{currentLang === 'en' ? 'Highest Level of Education' : 'Niveau de scolarité le plus élevé'}</label>
                <select 
                  value={education} 
                  onChange={(e) => setEducation(e.target.value as any)}
                  className="w-full border p-2 text-sm rounded bg-gray-50 text-[#333] outline-none"
                >
                  <option value="high">{currentLang === 'en' ? 'Secondary School / High School Diploma' : 'Diplôme d\'études secondaires'}</option>
                  <option value="bachelors">{currentLang === 'en' ? 'Bachelor Degree (Three or more years)' : 'Baccalauréat universitaire'}</option>
                  <option value="masters">{currentLang === 'en' ? 'Master Degree or Professional Degree' : 'Maîtrise universitaire'}</option>
                  <option value="phd">{currentLang === 'en' ? 'Doctoral Degree (PhD)' : 'Doctorat universitaire'}</option>
                </select>
              </div>

              {/* Language skills */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700 uppercase">{currentLang === 'en' ? 'Official Languages competency (CLB Scale)' : 'Compétences linguistiques (Niveaux NCLC/CLB)'}</span>
                  <span className="font-bold text-[#2572b4]">CLB {languageLevel}</span>
                </div>
                <select 
                  value={languageLevel} 
                  onChange={(e) => setLanguageLevel(Number(e.target.value))}
                  className="w-full border p-2 text-sm rounded bg-gray-50 text-[#333] outline-none"
                >
                  <option value="10">{currentLang === 'en' ? 'CLB 10 (Advanced / Fluent)' : 'NCLC 10 (Avancé)'}</option>
                  <option value="9">{currentLang === 'en' ? 'CLB 9 (High Intermediate)' : 'NCLC 9 (Intermédiaire supérieur)'}</option>
                  <option value="7">{currentLang === 'en' ? 'CLB 7 (Minimum Express Entry Standard)' : 'NCLC 7 (Seuil minimal d\'admissibilité)'}</option>
                  <option value="5">{currentLang === 'en' ? 'CLB 5 (Basic Competency)' : 'NCLC 5 (Intermédiaire intermédiaire)'}</option>
                </select>
              </div>

              {/* Job history experience in Canada */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase block">{currentLang === 'en' ? 'Canadian Work Experience' : 'Expérience de travail au Canada'}</label>
                <div className="flex gap-4">
                  {[0, 1, 2].map(yr => (
                    <label key={yr} className="flex items-center gap-1.5 text-xs text-gray-750 cursor-pointer">
                      <input 
                        type="radio" 
                        name="exp" 
                        checked={experience === yr}
                        onChange={() => setExperience(yr)}
                        className="accent-[#2572b4]"
                      />
                      <span>{yr === 0 ? (currentLang === 'en' ? 'None' : 'Aucune') : (currentLang === 'en' ? `${yr}+ Year(s)` : `${yr}+ An(s)`)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job offer checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer font-semibold">
                  <input 
                    type="checkbox"
                    checked={hasOffer}
                    onChange={(e) => setHasOffer(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2572b4] focus:ring-[#2572b4] border-gray-300 accent-[#2572b4]"
                  />
                  <span>{currentLang === 'en' ? 'I hold a valid supported job offer in Canada (LMIA approved)' : 'Je possède une offre d\'emploi validée au Canada (avec EIMT)'}</span>
                </label>
              </div>

            </div>

            {/* Simulated Score Output */}
            <div className="bg-[#f0f4f8] border border-blue-150 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#335075] uppercase block">{currentLang === 'en' ? 'Estimated CRS Point Score:' : 'Points de classement SCG estimés :'}</span>
                <span className="text-[10px] text-gray-500 font-medium leading-snug block">
                  {currentLang === 'en' 
                    ? 'Recent express entry draws averaged cut-off thresholds around 480 - 520 points.'
                    : 'Les récents tirages d\'Entrée express affichent un seuil minimal d\'environ 480 à 520 points.'}
                </span>
              </div>
              <div className="text-center shrink-0">
                <span className="text-4xl font-extrabold text-[#af3c43]">{crsScore}</span>
                <span className="text-[10px] font-bold text-gray-400 block uppercase mt-0.5">{currentLang === 'en' ? 'Points Total' : 'Points au total'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right side guides list (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-[#333] tracking-wider uppercase border-b pb-2 flex items-center gap-1">
              <FileText className="w-4 h-4 text-[#af3c43]" />
              {currentLang === 'en' ? 'Immigration Streams' : 'Parcours d\'immigration'}
            </h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="font-bold text-[#2572b4] block">Federal Skilled Worker Program</span>
                <p className="text-gray-500 line-clamp-2">For skilled workers with foreign work experience who want to immigrate permanently.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[#2572b4] block">Canadian Experience Class</span>
                <p className="text-gray-500 line-clamp-2">For skilled workers who have registered active employment history inside Canada.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[#2572b4] block">Provincial Nominee Program (PNP)</span>
                <p className="text-gray-500 line-clamp-2 font-medium">Nomination from a Canadian province boosts your CRS rating score directly by +600 points.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
