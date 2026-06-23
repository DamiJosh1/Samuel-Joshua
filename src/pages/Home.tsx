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
      id: "immig",
      titleEn: "Immigration and citizenship",
      titleFr: "Immigration et citoyenneté",
      descEn: "Apply to travel, study, work or immigrate to Canada, calculate biometrics, track passports.",
      descFr: "Présentez une demande de voyage, d'études ou de permis, calculez la biométrie et suivez les passeports.",
      to: "/immigration-citizenship",
      icon: Globe,
      color: "border-[#af3c43]"
    },
    {
      id: "taxes",
      titleEn: "Taxes",
      titleFr: "Impôts",
      descEn: "File your annual personal income returns, look up rates brackets, find dates guidelines.",
      descFr: "Déclarez vos revenus, consultez les tranches d'imposition et trouvez les dates limites.",
      to: "/taxes",
      icon: FileText,
      color: "border-[#335075]"
    },
    {
      id: "benefits",
      titleEn: "Benefits",
      titleFr: "Prestations",
      descEn: "Calculate Canada Child Credit estimators, examine EI criteria, old-age assistance parameters.",
      descFr: "Calculez l'allocation pour enfants, étudiez l'assurance-emploi et la pension de vieillesse.",
      to: "/benefits",
      icon: Heart,
      color: "border-teal-600"
    },
    {
      id: "employment",
      titleEn: "Jobs and employment",
      titleFr: "Emplois et perfectionnement",
      descEn: "Search vacancies in Job Bank, download training grants, inspect workplace standard codes.",
      descFr: "Parcourez le Guichet-Emploi, trouvez des subventions de formation et les normes du travail.",
      to: "/employment",
      icon: Briefcase,
      color: "border-amber-600"
    },
    {
      id: "travel",
      titleEn: "Travel and tourism",
      titleFr: "Voyage et tourisme",
      descEn: "Look up interactive country security advisory statuses, declare custom listings.",
      descFr: "Consultez les avertissements de sécurité par pays et remplissez les déclarations de douane.",
      to: "/travel",
      icon: Plane,
      color: "border-sky-600"
    },
    {
      id: "business",
      titleEn: "Business and industry",
      titleFr: "Entreprises et industrie",
      descEn: "Register commercial numbers, examine business grants, study import-export criteria.",
      descFr: "Enregistrez votre entreprise, demandez du financement et apprenez les règles d'importation.",
      to: "/business",
      icon: Building2,
      color: "border-purple-600"
    }
  ];

  return (
    <div className="bg-white min-h-screen text-[#333] font-sans">
      
      {/* 1. SECTOR HERO BANNER: Solid, Clean, Authoritative WET Background */}
      <section className="bg-[#335075] text-white py-12 md:py-16" id="home-hero-section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded">
              {currentLang === 'en' ? 'Official Portal' : 'Portail Officiel'}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {currentLang === 'en' ? 'Canada.ca - Services and benefits' : 'Canada.ca - Services et prestations'}
            </h1>
            <p className="text-gray-100 text-sm md:text-base leading-relaxed max-w-2xl">
              {currentLang === 'en'
                ? 'Access central directories and interactive service tools of the Government of Canada: calculate biometrics deadlines, search job vacancy banks, estimate tax returns, and verify travel advice.'
                : 'Accédez aux répertoires centraux et aux outils de service interactifs du gouvernement du Canada : calculez les délais biométriques, consultez le Guichet-Emploi, estimez vos impôts et vérifiez les avis de voyage.'}
            </p>

            {/* Flat search input without high-contrast animations */}
            <form onSubmit={handleHeroSearchSubmit} className="flex max-w-xl pt-2" id="hero-search-form">
              <input
                type="text"
                placeholder={currentLang === 'en' ? 'Search Canada.ca...' : 'Rechercher dans Canada.ca...'}
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full text-black px-4 py-3 rounded-l border border-r-0 border-gray-300 outline-none text-sm md:text-base bg-white"
                aria-label={currentLang === 'en' ? 'Search query' : 'Requête de recherche'}
              />
              <button
                type="submit"
                className="bg-[#af3c43] hover:bg-[#8f2f35] text-white px-6 font-bold flex items-center gap-2 transition-colors rounded-r cursor-pointer"
                id="hero-search-submit-btn"
              >
                <Search className="w-5 h-5" />
                <span>{currentLang === 'en' ? 'Search' : 'Rechercher'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. CHOOSE A SECTOR: Pristine WET-Style Directory Links (Minimalistic & High-Contrast) */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-[#333] border-b border-gray-200 pb-3">
            {currentLang === 'en' ? 'Departments and areas' : 'Ministères et services de confiance'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sec) => (
            <div
              key={sec.id}
              className="space-y-2 group"
            >
              <h3 className="text-lg font-bold text-[#2572b4] hover:text-[#05355c]">
                <Link to={sec.to} className="hover:underline flex items-baseline gap-1" id={`sector-link-${sec.id}`}>
                  <span>{currentLang === 'en' ? sec.titleEn : sec.titleFr}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 self-center" />
                </Link>
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {currentLang === 'en' ? sec.descEn : sec.descFr}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LATEST NEWS FEED: Clean, Standard Federal Announcement Block */}
      <section className="bg-[#f5f5f5] border-t border-b border-gray-200 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 space-y-8">
          
          <div className="flex items-center justify-between border-b border-gray-300 pb-3">
            <h2 className="text-2xl font-bold text-[#333] flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-[#af3c43]" />
              {currentLang === 'en' ? 'Latest federal announcements' : 'Nouvelles du gouvernement fédéral'}
            </h2>
            <span className="text-xs font-bold text-gray-500 bg-white border border-gray-300 px-3 py-1 rounded">
              {currentLang === 'en' ? 'Newsroom' : 'Salle de presse'}
            </span>
          </div>

          {loadingNews ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#af3c43]"></div>
              <span className="text-xs text-gray-500 font-semibold">{currentLang === 'en' ? 'Loading news...' : 'Chargement...'}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="news-grid-section">
              {news.map((item) => (
                <article key={item.id} className="bg-white border border-gray-200 rounded p-5 flex flex-col justify-between shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#af3c43] uppercase tracking-wider">
                      <span>{currentLang === 'en' ? item.category : item.categoryFr}</span>
                      <span className="text-gray-400 font-normal">{item.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#333] hover:text-[#2572b4] leading-snug">
                      <span className="cursor-pointer">{currentLang === 'en' ? item.title : item.titleFr}</span>
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {currentLang === 'en' ? item.summary : item.summaryFr}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
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

      {/* 4. CLINICAL PROMPT Callout instead of sparkly overdesigned box (WET Standard Alert Box) */}
      <section className="mx-auto max-w-4xl px-4 py-12" id="government-migration-tracker">
        <div className="bg-[#f3f8fc] border-l-6 border-[#269abc] rounded-r p-6 space-y-3">
          <h3 className="font-bold text-[#004d66] text-lg">
            {currentLang === 'en' ? 'Biometrics Service Assistant' : 'Assistant de service de biométrie'}
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {currentLang === 'en' 
              ? 'Are you requested to submit fingerprints and facial photography? Use our official interactive assistant to calculate precise 30-day deadlines, verify previous biometrics validity, and locate ASC / VAC collection centers globally.'
              : 'Vous devez fournir vos empreintes et votre photo ? Utilisez notre assistant interactif officiel pour calculer vos délais précis de 30 jours, vérifier la validité de vos empreintes et repérer les centres d\'admission.'}
          </p>
          <div className="pt-2">
            <Link 
              to="/immigration-citizenship/biometrics" 
              className="inline-block bg-[#2572b4] hover:bg-[#05355c] text-white font-bold text-sm px-5 py-2.5 rounded transition-colors focus:ring-2 focus:ring-[#2572b4]"
            >
              {currentLang === 'en' ? 'Verify biometrics requirements' : 'Vérifier vos exigences de biométrie'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
