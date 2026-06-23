import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Building2, Search, Sparkles, MapPin, BadgeDollarSign } from 'lucide-react';

interface JobVacancy {
  title: string;
  employer: string;
  location: string;
  salary: string;
  type: string;
}

export default function Employment() {
  const { currentLang } = useApp();
  const [query, setQuery] = useState('');

  const mockJobs: JobVacancy[] = [
    { title: "Software Developer (NOC 21232)", employer: "Luminatech Corp", location: "Vancouver, BC", salary: "$48.50 / hour", type: "Full-time" },
    { title: "Administrative Assistant (NOC 13110)", employer: "Global Logistics Group", location: "Halifax, NS", salary: "$22.00 / hour", type: "Full-time" },
    { title: "Financial Analyst (NOC 11101)", employer: "Royal Atlantic Bank", location: "Toronto, ON", salary: "$41.00 / hour", type: "Full-time" },
    { title: "Registered Nurse (NOC 31301)", employer: "Metro General Hospital", location: "Montreal, QC", salary: "$39.00 / hour", type: "Part-time" },
    { title: "Logistics Coordinator (NOC 12102)", employer: "FastForward Freight", location: "Calgary, AB", salary: "$26.50 / hour", type: "Full-time" }
  ];

  const filtered = mockJobs.filter(job => 
    job.title.toLowerCase().includes(query.toLowerCase()) || 
    job.employer.toLowerCase().includes(query.toLowerCase()) ||
    job.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Jobs, recruitment, and employment standards' : 'Emploi, recrutement et normes du travail'}
        </h1>
        <p className="text-gray-750 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Query active Job Bank vacancies, discover federal employment training grants, and inspect workplace standard codes.'
            : 'Faites des recherches sur les postes du Guichet-Emploi, découvrez les subventions d\'apprentissage et lisez les normes.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Job search (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              {currentLang === 'en' ? 'Search Vacancies on the Canada Job Bank' : 'Guichet-Emploi - Recherche de postes'}
            </h2>

            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={currentLang === 'en' ? 'Search title, employer, city...' : 'Titre du poste, employeur ou ville...'}
                className="w-full border border-gray-300 rounded pl-9 pr-3 py-2.5 text-sm bg-gray-50 text-[#333] outline-none focus:border-amber-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>

            {/* Job entries grid */}
            <div className="space-y-4" id="employment-jobs-list">
              {filtered.map((job, idx) => (
                <div key={idx} className="border border-gray-150 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-bold text-[#2572b4] hover:underline cursor-pointer text-sm">
                      {job.title}
                    </h3>
                    <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                      {job.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{job.employer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-gray-700">
                      <BadgeDollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Columns: training help (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-[#333] tracking-widest uppercase border-b pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              {currentLang === 'en' ? 'Training Assistance' : 'Prêts aux apprentis'}
            </h3>

            <div className="space-y-3 text-gray-650 leading-relaxed font-sans">
              <div className="space-y-0.5">
                <span className="font-bold text-amber-700 block">Canada Apprentice Loan</span>
                <p className="text-gray-500">Up to $4,000 per period of training available in interest-free loans to support designated Red Seal trades.</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-amber-700 block">Federal Student Grants</span>
                <p className="text-gray-500">Non-repayable grant options for full-time students of low and middle-income households.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
