import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { placeholderApi, NewsArticle } from '../services/placeholderApi';
import { 
  Briefcase, 
  Map, 
  FileText, 
  Heart, 
  Plane, 
  Building2, 
  ShieldCheck, 
  Search, 
  Newspaper, 
  TrendingUp, 
  Globe, 
  Terminal, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { currentLang } = useApp();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    placeholderApi.getNews(currentLang).then((data) => {
      setNews(data);
      setLoadingNews(false);
    });
  }, [currentLang]);

  const handleHeroSearchSubmit = (e: any) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const sectors = [
    {
      id: "jobs",
      titleEn: "Jobs",
      titleFr: "Emplois",
      descEn: "Find a job, training, hiring programs, work permits, Social Insurance Number (SIN)",
      descFr: "Trouver un emploi, formation, programmes d'embauche, permis de travail, numéro d'assurance sociale (NAS)",
      to: "/employment"
    },
    {
      id: "immig",
      titleEn: "Immigration and citizenship",
      titleFr: "Immigration et citoyenneté",
      descEn: "Visit, work, study, immigrate, refugees, permanent residents, apply, check status",
      descFr: "Visiter, travailler, étudier, immigrer, réfugiés, résidents permanents, présenter une demande, vérifier l'état",
      to: "/immigration-citizenship"
    },
    {
      id: "travel",
      titleEn: "Travel and tourism",
      titleFr: "Voyage et tourisme",
      descEn: "In Canada or abroad, advice, advisories, passports, visit Canada, events, attractions",
      descFr: "Au Canada ou à l'étranger, conseils, avertissements, passeports, visiter le Canada, événements, attractions",
      to: "/travel"
    },
    {
      id: "business",
      titleEn: "Business and industry",
      titleFr: "Entreprises et industrie",
      descEn: "Starting a business, permits, copyright, business support, selling to government",
      descFr: "Lancer une entreprise, permis, droit d'auteur, soutien aux entreprises, vendre au gouvernement",
      to: "/business"
    },
    {
      id: "benefits",
      titleEn: "Benefits",
      titleFr: "Prestations",
      descEn: "EI, family and sickness leave, pensions, housing, student aid, disabilities, after a death",
      descFr: "Assurance-emploi, congés familiaux et de maladie, pensions, logement, aide aux étudiants, invalidité, décès",
      to: "/benefits"
    },
    {
      id: "health",
      titleEn: "Health",
      titleFr: "Santé",
      descEn: "Food, nutrition, diseases, vaccines, drugs, product safety and recalls",
      descFr: "Alimentation, nutrition, maladies, vaccins, médicaments, sécurité des produits et rappels",
      to: "/services"
    }
  ];

  const mostRequested = [
    {
      labelEn: "Sign in to an account",
      labelFr: "Ouvrir une session dans un compte",
      to: "/auth/login"
    },
    {
      labelEn: "Employment Insurance and leave",
      labelFr: "Assurance-emploi et congés",
      to: "/benefits"
    },
    {
      labelEn: "Public pensions (CPP and OAS)",
      labelFr: "Pensions publiques (RPC et SV)",
      to: "/benefits"
    },
    {
      labelEn: "Get a passport",
      labelFr: "Obtenir un passeport",
      to: "/immigration-citizenship/passports"
    },
    {
      labelEn: "Biometrics Calculator",
      labelFr: "Calculateur de biométrie",
      to: "/immigration-citizenship/biometrics"
    },
    {
      labelEn: "Work Permits",
      labelFr: "Permis de travail",
      to: "/immigration-citizenship/work-permits"
    },
    {
      labelEn: "Study Permits",
      labelFr: "Permis d'études",
      to: "/immigration-citizenship/study-permits"
    },
    {
      labelEn: "Canadian Citizenship Test",
      labelFr: "Examen de citoyenneté",
      to: "/immigration-citizenship/citizenship"
    }
  ];

  return (
    <div className="bg-white min-h-screen text-[#333] font-sans">
      
      {/* 1. HERO BANNER */}
      <section 
        className="bg-[#26374a] text-white py-12 md:py-20 flex items-center" 
        id="home-hero-section"
      >
        <div className="mx-auto max-w-6xl w-full px-4">
          <div className="max-w-md p-6 sm:p-8 border border-[#111820] bg-[#111820] space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Canada.ca
              </h1>
              <div className="h-1 bg-white w-32" aria-hidden="true"></div>
            </div>
            
            <p className="text-gray-100 text-sm sm:text-base font-normal leading-relaxed">
              {currentLang === 'en'
                ? 'The official website of the Government of Canada'
                : 'Le site officiel du gouvernement du Canada'}
            </p>
            
            <p className="text-gray-200 text-xs leading-relaxed border-t border-gray-600/30 pt-3">
              {currentLang === 'en'
                ? 'Access central IRCC immigration services, passports, biometrics checkers, work permits, tax estimations, and federal support.'
                : 'Accédez aux services d\'immigration d\'IRCC, aux passeports, aux vérificateurs de biométrie, aux permis de travail et au soutien.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. MOST REQUESTED (Light Grey strip of links) */}
      <section className="bg-[#f5f5f5] border-b border-gray-200 py-6 md:py-8" id="most-requested-strip">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-base font-bold text-[#333] mb-4 uppercase tracking-wider">
            {currentLang === 'en' ? 'Most requested' : 'Les plus demandés'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3.5 gap-x-6 text-sm">
            {mostRequested.map((item, idx) => (
              <Link 
                key={idx} 
                to={item.to} 
                className="text-[#2572b4] hover:text-[#05355c] hover:underline font-semibold leading-snug flex items-center gap-1.5"
              >
                <span>&bull;</span>
                <span>{currentLang === 'en' ? item.labelEn : item.labelFr}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTOR SERVICES & CATEGORIES LIST (Strictly plain 3-column layout matching the screenshot) */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16 space-y-8">
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-xl font-bold text-[#333] tracking-tight">
            {currentLang === 'en' ? 'Government Services and Information' : 'Services et renseignements gouvernementaux'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
          {sectors.map((sec) => (
            <div
              key={sec.id}
              className="space-y-1.5"
            >
              <h3 className="text-base font-bold text-[#2572b4] hover:text-[#05355c]">
                <Link to={sec.to} className="hover:underline hover:text-[#05355c]" id={`sector-link-${sec.id}`}>
                  {currentLang === 'en' ? sec.titleEn : sec.titleFr}
                </Link>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                {currentLang === 'en' ? sec.descEn : sec.descFr}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LATEST NEWS FEED: Clean, Standard Federal Announcement Block */}
      <section className="bg-gray-100 border-t border-b border-gray-300 py-12">
        <div className="mx-auto max-w-6xl px-4 space-y-8">
          
          <div className="flex items-center justify-between border-b border-gray-300 pb-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#26374a]" />
              {currentLang === 'en' ? 'Latest federal announcements' : 'Nouvelles du gouvernement fédéral'}
            </h2>
            <span className="text-xs font-bold text-gray-500 bg-white border border-gray-400 px-3 py-1">
              {currentLang === 'en' ? 'Newsroom' : 'Salle de presse'}
            </span>
          </div>

          {loadingNews ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <div className="animate-spin h-8 w-8 border-b-2 border-[#26374a]"></div>
              <span className="text-xs text-gray-500 font-semibold">{currentLang === 'en' ? 'Loading news...' : 'Chargement...'}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="news-grid-section">
              {news.map((item) => (
                <article key={item.id} className="bg-white border border-gray-400 p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#26374a] uppercase tracking-wider">
                      <span>{currentLang === 'en' ? item.category : item.categoryFr}</span>
                      <span className="text-gray-500 font-normal">{item.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-black hover:underline leading-snug">
                      <span className="cursor-pointer text-[#2572b4]">{currentLang === 'en' ? item.title : item.titleFr}</span>
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 font-normal">
                      {currentLang === 'en' ? item.summary : item.summaryFr}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-300 mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2572b4] hover:underline cursor-pointer">
                      {currentLang === 'en' ? 'Read full announcement' : 'Lire le communiqué complet'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#2572b4]" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. CLINICAL PROMPT Callout (WET Standard Info Alert Box) */}
      <section className="mx-auto max-w-4xl px-4 py-12" id="government-migration-tracker">
        <div className="bg-gray-100 border-l-4 border-[#26374a] p-5 space-y-3">
          <h3 className="font-bold text-black text-base">
            {currentLang === 'en' ? 'Biometrics Service Assistant' : 'Assistant de service de biométrie'}
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed font-normal">
            {currentLang === 'en' 
              ? 'Are you requested to submit fingerprints and facial photography? Use our official interactive assistant to calculate precise 30-day deadlines, verify previous biometrics validity, and locate ASC / VAC collection centers globally.'
              : 'Vous devez fournir vos empreintes et votre photo ? Utilisez notre assistant interactif officiel pour calculer vos délais précis de 30 jours, vérifier la validité de vos empreintes et repérer les centres d\'admission.'}
          </p>
          <div className="pt-1">
            <Link 
              to="/immigration-citizenship/biometrics" 
              className="inline-block bg-[#26374a] hover:bg-[#111820] text-white font-bold text-xs px-4 py-2 transition-colors border border-[#26374a]"
            >
              {currentLang === 'en' ? 'Verify biometrics requirements' : 'Vérifier vos exigences de biométrie'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
