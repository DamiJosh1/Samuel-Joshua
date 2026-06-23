import { useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { placeholderApi, SearchResult } from '../services/placeholderApi';
import { Search, SlidersHorizontal, ListFilter, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SearchPage() {
  const { currentLang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    placeholderApi.queryAll(query, currentLang).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [query, currentLang]);

  const handleLocalSubmit = (e: any) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  // Get distinct categories in results
  const categories = ['All', ...Array.from(new Set(results.map(r => r.category)))];

  // Filtering results based on Active Category selection
  const filtered = activeCategory === 'All' 
    ? results 
    : results.filter(item => item.category === activeCategory);

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Search results' : 'Résultats de la recherche'}
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed font-sans font-semibold">
          {currentLang === 'en' 
            ? 'Access unified search answers across Canada.ca programs, tax indices, travel advisories, and service guides.'
            : 'Recherche fédérale unifiée dans l\'ensemble des ministères, barèmes d\'imposition, avis et visas.'}
        </p>
      </div>

      {/* Main double search input block */}
      <form onSubmit={handleLocalSubmit} className="flex max-w-2xl bg-white border border-gray-300 rounded overflow-hidden p-0.5 shadow-2xs">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder={currentLang === 'en' ? 'Search programs, documents, forms...' : 'Recherche par mots-clés...'}
          className="w-full px-4 py-2.5 text-sm text-[#333] outline-none"
        />
        <button
          type="submit"
          className="bg-[#af3c43] hover:bg-[#8f2f35] text-white px-5 text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>{currentLang === 'en' ? 'Search' : 'Rechercher'}</span>
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left column: Filters & Categories (col-span 1) */}
        <div className="bg-white border rounded-lg p-5 space-y-4" id="search-filters-panel">
          
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest border-b pb-2 flex items-center gap-1.5">
            <ListFilter className="w-4 h-4 text-gray-400" />
            <span>{currentLang === 'en' ? 'Category Filters' : 'Filtrer par catégorie'}</span>
          </h3>

          <div className="flex flex-col gap-1.5" id="categories-filter-list">
            {categories.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded transition-colors w-full cursor-pointer flex items-center justify-between ${isActive ? 'bg-[#335075] text-white' : 'hover:bg-gray-50 text-[#335075]'}`}
                >
                  <span>{cat === 'All' ? (currentLang === 'en' ? 'All Matches' : 'Tous les résultats') : cat}</span>
                  {cat !== 'All' && isActive && (
                    <span className="text-[10px] bg-white/20 text-white rounded px-1.5">Active</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t text-[10px] text-gray-400 leading-relaxed font-semibold">
            {currentLang === 'en' 
              ? 'Results are updated in real-time from Service Canada register logs.' 
              : 'Données actualisées en continu d\'après les registres officiels.'}
          </div>
        </div>

        {/* Right column: Results list & Pagination (col-span 3) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex justify-between items-center text-xs text-gray-500 border-b pb-2">
            <div>
              {currentLang === 'en' ? 'Matching Terms for:' : 'Mots recherchés :'} <span className="font-bold text-[#af3c43] italic font-mono">"{query}"</span>
            </div>
            <div className="font-medium">
              {currentLang === 'en' ? `Showing ${filtered.length} matches` : `Affichage de ${filtered.length} résultats`}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#af3c43]"></div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">querying canada.ca...</span>
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-6" id="search-results-list">
              {filtered.map((item) => (
                <article key={item.id} className="space-y-1.5 hover:bg-gray-50/40 p-3 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-extrabold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.categoryFr}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">ID: {item.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#2572b4] hover:text-[#05355c] hover:underline">
                    <Link to={item.url}>
                      {currentLang === 'en' ? item.title : item.titleFr}
                    </Link>
                  </h3>
                  <p className="text-xs text-gray-650 leading-relaxed max-w-3xl">
                    {currentLang === 'en' ? item.snippet : item.snippetFr}
                  </p>
                  <Link to={item.url} className="text-[11px] font-bold text-gray-400 hover:text-gray-600 block pt-1 font-mono">
                    canada.ca{item.url}
                  </Link>
                </article>
              ))}

              {/* Simple pagination mockup */}
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-150 text-xs text-gray-500">
                <button 
                  disabled 
                  className="flex items-center gap-1 cursor-not-allowed opacity-50 px-3 py-1 bg-white border rounded font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Previous' : 'Précédent'}</span>
                </button>
                <span className="font-bold">Page 1 of 1</span>
                <button 
                  disabled 
                  className="flex items-center gap-1 cursor-not-allowed opacity-50 px-3 py-1 bg-white border rounded font-semibold"
                >
                  <span>{currentLang === 'en' ? 'Next' : 'Suivant'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed text-gray-500 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <div className="space-y-1 max-w-md mx-auto">
                <p className="font-extrabold text-sm text-gray-800">
                  {currentLang === 'en' ? 'No results found match your terms' : 'Aucun résultat ne correspond à votre recherche'}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Check spelling, retry with words like "biometrics", "passport", "CRS score", "citizenship mock", "child benefits" or clear filtered lists.'
                    : 'Ajustez l\'orthographe des mots recherchés pour obtenir des résultats.'}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </main>
  );
}
