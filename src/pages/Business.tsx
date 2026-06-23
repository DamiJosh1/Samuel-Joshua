import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Landmark, ShieldCheck, Sparkles, Command, HelpCircle } from 'lucide-react';

interface BusinessGrant {
  name: string;
  nameFr: string;
  industry: string;
  details: string;
  detailsFr: string;
  value: string;
}

export default function Business() {
  const { currentLang } = useApp();
  const [selectedIndustry, setSelectedIndustry] = useState('tech');

  const mockGrants: BusinessGrant[] = [
    {
      name: "Scientific Research and Experimental Development (SR&ED) Tax Incentives",
      nameFr: "Encouragements fiscaux pour la recherche scientifique et le développement expérimental (RS&DE)",
      industry: "tech",
      details: "Claim tax deductions or cash refunds for technology development expenses incurred inside Canada.",
      detailsFr: "Demandez des déductions fiscales ou des remboursements pour vos dépenses technologiques.",
      value: "Up to 35% Refund"
    },
    {
      name: "Canada Digital Adoption Program (CDAP) Micro-Grants",
      nameFr: "Subventions d'adoption du numérique du CDAP",
      industry: "tech",
      details: "Small micro-grants of $2,400 to support e-commerce integration, storefront builders, or digital booking tools.",
      detailsFr: "Micro-subvention de 2 400 $ pour l'intégration de commerce en ligne et d'outils numériques.",
      value: "$2,400 Direct Grant"
    },
    {
      name: "Agrilnnovate Program for Technology Adoption",
      nameFr: "Programme Agri-innover pour l'adoption technologique",
      industry: "agr",
      details: "Interest-free funding for commercializing innovative agricultural technologies that boost yields or cuts emissions.",
      detailsFr: "Financement sans intérêt pour la commercialisation de technologies agricoles innovantes.",
      value: "Up to 50% Financing"
    },
    {
      name: "Clean Technology Manufacturing Investment Tax Credit",
      nameFr: "Crédit d'impôt d'investissement pour la fabrication de technologies propres",
      industry: "energy",
      details: "Refundable tax credits supporting investments in manufacturing machinery or industrial equipment processing clean energies.",
      detailsFr: "Téléchargez les crédits remboursables pour soutenir l'investissement dans les machines d'énergie propre.",
      value: "30% Credit Rate"
    }
  ];

  const matched = mockGrants.filter(item => item.industry === selectedIndustry);

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Business registration, grants, and scaling' : 'Entreprises, immatriculation et subventions'}
        </h1>
        <p className="text-gray-750 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Incorporate your corporation, assign commercial numbers (BN), search import-export criteria, and look up federal grants.'
            : 'Enregistrez votre société, immatriculez un numéro d\'entreprise (NE), consultez les subventions ou importations.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Funding tool (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              {currentLang === 'en' ? 'Federal Business Financing Finder' : 'Recherche de financement fédéral pour entreprises'}
            </h2>

            {/* Industry Selector */}
            <div className="space-y-1.5 max-w-sm">
              <label className="text-xs font-bold text-gray-700 block uppercase">
                {currentLang === 'en' ? 'Choose business sector field:' : 'Sélectionnez le secteur d\'activité :'}
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full border p-2.5 text-sm rounded bg-gray-50 text-[#333] outline-none"
              >
                <option value="tech">{currentLang === 'en' ? 'Technology & Digital Software Innovation' : 'Technologie et innovation de logiciels'}</option>
                <option value="agr">{currentLang === 'en' ? 'Agriculture & Food Processing' : 'Agriculture et transformation alimentaire'}</option>
                <option value="energy">{currentLang === 'en' ? 'Clean Energy & Eco Innovation' : 'Énergie propre et éco-innovation'}</option>
              </select>
            </div>

            {/* Matched Grants display */}
            <div className="space-y-4 pt-2">
              {matched.length > 0 ? (
                matched.map((grant, idx) => (
                  <div key={idx} className="border border-gray-150 rounded-lg p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-[#2572b4] text-sm">
                        {currentLang === 'en' ? grant.name : grant.nameFr}
                      </h3>
                      <p className="text-xs text-gray-500 max-w-lg leading-relaxed">
                        {currentLang === 'en' ? grant.details : grant.detailsFr}
                      </p>
                    </div>
                    <div className="bg-purple-100 border border-purple-200 text-purple-950 font-extrabold text-xs px-3 py-1.5 rounded shrink-0">
                      {grant.value}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400 text-xs">No financing matched.</div>
              )}
            </div>

          </div>
        </div>

        {/* Right Info blocks (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-[#333] tracking-widest uppercase border-b pb-2 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-purple-600" />
              {currentLang === 'en' ? 'Corporate Steps' : 'Démarches d\'entreprise'}
            </h3>

            <div className="space-y-3 text-gray-650 leading-relaxed font-sans">
              <p>
                {currentLang === 'en'
                  ? 'Incorporation: To operate as a federal corporation, you must submit articles of incorporation to Corporations Canada.'
                  : 'Frapper l\'immatriculation : Pour opérer, enregistrez des statuts de constitution auprès de Corporations Canada.'}
              </p>
              <p>
                {currentLang === 'en'
                  ? 'Tax Account: Link your corporation file to your GST/HST tax collection account using the business number.'
                  : 'Numéro d\'entreprise (NE) : Associez votre dossier à votre compte de perception de la TPS/TVH.'}
              </p>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
