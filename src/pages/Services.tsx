import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { FileSearch, Sparkles, Command, HelpCircle, FileText, Globe } from 'lucide-react';

export default function Services() {
  const { currentLang } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const servicesData = [
    { name: "My Service Canada Account (MSCA)", nameFr: "Mon dossier Service Canada (MDSC)", desc: "Secure online portal, check status of your biometrics, passport, study permits, and insurance files.", url: "/dashboard", cat: "Portal" },
    { name: "Immigration biometric calculator", nameFr: "Calculateur de données biométriques d'immigration", desc: "Interactive tool to calculate your 30-day deadline, verify 10-year validity, check exemptions.", url: "/immigration-citizenship/biometrics", cat: "Immigration" },
    { name: "Express Entry Assessment Selector", nameFr: "Simulateur de points pour l'Entrée express", desc: "Self-assessment engine calculating Comprehensive Ranking System scores for worker visas.", url: "/immigration-citizenship/permanent-residence", cat: "Immigration" },
    { name: "Federal Income Tax brackets filing support", nameFr: "Soutien au dépôt d'impôt fédéral sur le revenu", desc: "Access the income tax calculator, inspect margins thresholds, review annual deadlines.", url: "/taxes", cat: "Taxes" },
    { name: "Canadian Citizenship Knowledge Simulator quiz", nameFr: "Examen blanc de pratique pour la citoyenneté canadienne", desc: "Test your skills on physical history, governmental structures, municipal boundaries.", url: "/immigration-citizenship/citizenship", cat: "Citizenship" },
    { name: "Passports Fees and appointment scheduler", nameFr: "Frais de passeport et prise de rendez-vous", desc: "Review processing times, estimated queues turnaround, and schedules at ASC support centers.", url: "/immigration-citizenship/passports", cat: "Passports" },
    { name: "Travel safety advisory status tracking", nameFr: "Suivi des avis de sécurité aux voyageurs", desc: "Database matching safe, high caution, do-not-travel alert levels across world registers.", url: "/travel", cat: "Travel" },
    { name: "Canada Child Benefits monthly estimators", nameFr: "Estimateur d'allocations de garde d'enfants", desc: "Check monthly payment scales, income threshold adjustments, and family eligibility files.", url: "/benefits", cat: "Benefits" },
    { name: "Job Bank listings query directory", nameFr: "Répertoire de recherche d'emploi du Guichet-Emploi", desc: "Locate active employment notices, download training grant forms, read labor rights.", url: "/employment", cat: "Jobs" },
    { name: "Business identifiers registrar assistant", nameFr: "Registre d'immatriculation d'entreprises", desc: "Guidance on registering commercial business numbers, exploring grants and financing schemes.", url: "/business", cat: "Business" }
  ];

  const filtered = servicesData.filter(s => {
    const q = filterQuery.toLowerCase();
    const name = (currentLang === 'en' ? s.name : s.nameFr).toLowerCase();
    const desc = s.desc.toLowerCase();
    const cat = s.cat.toLowerCase();
    return name.includes(q) || desc.includes(q) || cat.includes(q);
  });

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'All services and directories' : 'Tous les services et répertoires'}
        </h1>
        <p className="text-gray-700 leading-relaxed max-w-3xl">
          {currentLang === 'en'
            ? 'Find interactive federal calculators, immigration checklists, tax brackets guides, safety advisories, and the secure Service Canada personal account console.'
            : 'Trouvez les calculateurs fédéraux, fiches de contrôle pour résidents, barèmes d\'impôt, fiches de sécurité routière et de voyage, et le portail Service Canada.'}
        </p>
      </div>

      {/* Interactive Search Tool */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="space-y-1 w-full sm:max-w-md">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
              {currentLang === 'en' ? 'Quick Filter Directory:' : 'Recherche dans le catalogue :'}
            </span>
            <div className="relative">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={currentLang === 'en' ? 'Search by program, category, keyword...' : 'Recherche par programme, catégorie ou mot clé...'}
                className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm outline-none text-[#333] focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4]"
              />
              <FileSearch className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
          
          <div className="text-xs text-gray-500 italic shrink-0 bg-[#f0f4f8] border px-3 py-2 rounded-lg flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>{currentLang === 'en' ? `${filtered.length} entries matched` : `${filtered.length} correspondances trouvées`}</span>
          </div>
        </div>
      </div>

      {/* Services Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((s, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
              id={`service-card-${idx}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold bg-[#f0f4f8] border border-[#dce6f0] text-[#335075] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {s.cat}
                  </span>
                  <Command className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-[#2572b4] hover:text-[#05355c] hover:underline">
                  <Link to={s.url}>
                    {currentLang === 'en' ? s.name : s.nameFr}
                  </Link>
                </h3>
                <p className="text-xs text-gray-650 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100/55 mt-4 flex items-center justify-between">
                <Link 
                  to={s.url}
                  className="text-xs font-bold text-[#335075] hover:text-[#1c3552] flex items-center gap-1"
                >
                  <span>{currentLang === 'en' ? 'Launch Online Service' : 'Accéder au service en ligne'}</span>
                  <span className="text-xs font-bold">&rarr;</span>
                </Link>
                <HelpCircle className="w-4 h-4 text-gray-300 hover:text-gray-400 cursor-help" />
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 text-center py-12 bg-gray-50 rounded-xl border border-dashed text-gray-500 space-y-2">
            <p className="font-bold">{currentLang === 'en' ? 'No matched services found' : 'Aucun service ne correspond à vos critères'}</p>
            <p className="text-xs">{currentLang === 'en' ? 'Try spelling differently or clear filters' : 'Modifiez vos termes de recherche'}</p>
          </div>
        )}
      </div>

    </main>
  );
}
