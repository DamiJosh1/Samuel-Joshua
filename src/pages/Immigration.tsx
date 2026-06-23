import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  Fingerprint, 
  BookOpen, 
  Map, 
  Sparkles, 
  Globe, 
  Milestone, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Clock
} from 'lucide-react';

export default function Immigration() {
  const { currentLang } = useApp();

  const subroutes = [
    {
      to: "/immigration-citizenship/biometrics",
      titleEn: "Biometrics fingerprints & photos",
      titleFr: "Données biométriques, empreintes et photos",
      descEn: "Use our interactive validator to calculate 30-day deadlines, verify 10-year exemptions, and locate global ASC / VAC center offices.",
      descFr: "Utilisez notre outil interactif pour calculer la date limite de 30 jours, vérifier la réutilisation et de repérer les centres.",
      icon: Fingerprint,
      badgeEn: "Interactive Tool",
      badgeFr: "Outil interactif"
    },
    {
      to: "/immigration-citizenship/passports",
      titleEn: "Passports renewal & tracking",
      titleFr: "Renouvellement et suivi de passeport",
      descEn: "Check application turnaround estimates, examine urgent next-day processing fees, and calculate pricing guidelines.",
      descFr: "Vérifiez les délais de traitement, déterminez les frais pour traitement urgent et estimez le coût de renouvellement.",
      icon: Clock,
      badgeEn: "Processing Times",
      badgeFr: "Délais de traitement"
    },
    {
      to: "/immigration-citizenship/work-permits",
      titleEn: "Work permits application desk",
      titleFr: "Permis de travail et d'embauche",
      descEn: "Explore foreign worker programs, LMIA requirements, and our interactive employer visa matching selector.",
      descFr: "Explorez les programmes de travail, l'EIMT, et notre simulateur interactif de sélection d'embauche.",
      icon: CheckCircle2,
      badgeEn: "Labour Market",
      badgeFr: "Marché du travail"
    },
    {
      to: "/immigration-citizenship/study-permits",
      titleEn: "Study permits and student visas",
      titleFr: "Permis d'études et visas d'étudiant",
      descEn: "Inspect guidelines for Designated Learning Institutions, study permit eligibility checklists, and visa tracking.",
      descFr: "Consultez la liste des Établissements d'enseignement désignés, les critères d'admissibilité et la validation.",
      icon: BookOpen,
      badgeEn: "Education Desk",
      badgeFr: "Éducation"
    },
    {
      to: "/immigration-citizenship/permanent-residence",
      titleEn: "Express Entry & Permanent Residence",
      titleFr: "Entrée express et résidence permanente",
      descEn: "Assess your economic credentials using our Comprehensive Ranking System (CRS) score points simulator.",
      descFr: "Estimez votre admissibilité économique en calculant vos points du Système de classement global (SCG).",
      icon: Milestone,
      badgeEn: "Score Estimator",
      badgeFr: "Simulateur SCG"
    },
    {
      to: "/immigration-citizenship/citizenship",
      titleEn: "Canadian Citizenship Knowledge Test",
      titleFr: "Examen d'évaluation de la citoyenneté",
      descEn: "Prepare for your official test using our interactive 5-question mock simulator on physical history and government.",
      descFr: "Préparez votre examen en testant vos compétences sur l'histoire, la géographie et les lois canadiennes.",
      icon: Globe,
      badgeEn: "Mock Exam Quiz",
      badgeFr: "Examen blanc"
    }
  ];

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Immigration and citizenship' : 'Immigration et citoyenneté'}
        </h1>
        <p className="text-gray-700 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Official guidelines from Immigration, Refugees and Citizenship Canada (IRCC). Estimate requirements, book collection services, calculate points grids, and check citizenship requirements here.'
            : 'Fiches d\'information d\'Immigration, Réfugiés et Citoyenneté Canada (IRCC). Estimez les frais d\'empreintes, réservez des créneaux, testez vos compétences et explorez les permis.'}
        </p>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border-l-4 border-[#2572b4] p-4 text-xs md:text-sm text-blue-900 rounded-r-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#2572b4] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            {currentLang === 'en' ? 'Important: Biometrics requirements' : 'Important : Exigences biométriques'}
          </p>
          <p className="text-blue-800 leading-relaxed">
            {currentLang === 'en'
              ? 'Unless exempt, you must provide fingerprints and a photo if you apply for a visitor visa, study permit, or work permit. Choose our biometrics calculator tool below to verify details.'
              : 'Sauf exemption, vous devez fournir vos empreintes et photo pour un visa touristique, permis d\'études ou de travail. Chargez notre calculateur ci-dessous.'}
          </p>
        </div>
      </div>

      {/* Grid Menu */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#333] border-b pb-2">
          {currentLang === 'en' ? 'Select an IRCC stream or tool' : 'Sélectionnez un portail d\'action ou outil'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="immigration-hub-grid">
          {subroutes.map((sub, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200 hover:border-gray-200 hover:shadow-sm transition-all rounded-lg p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="bg-gray-100 p-2 text-[#335075] rounded-md">
                    <sub.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase py-0.5 px-2.5 bg-gray-100 border text-gray-500 rounded-full">
                    {currentLang === 'en' ? sub.badgeEn : sub.badgeFr}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#2572b4] hover:text-[#05355c]">
                  <Link to={sub.to} className="hover:underline flex items-center gap-1.5">
                    <span>{currentLang === 'en' ? sub.titleEn : sub.titleFr}</span>
                  </Link>
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {currentLang === 'en' ? sub.descEn : sub.descFr}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-150 flex justify-between items-center">
                <Link 
                  to={sub.to}
                  className="text-xs font-bold text-[#af3c43] hover:text-[#8f2f35] flex items-center gap-1.5 transition-colors group"
                >
                  <span>{currentLang === 'en' ? 'Open Application Portal' : 'Ouvrir le portail'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#af3c43] group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <HelpCircle className="w-3.5 h-3.5 text-gray-300 cursor-help" />
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Helpful links Column */}
      <section className="bg-gray-50 rounded-xl p-6 border flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-2 max-w-2xl">
          <h3 className="font-bold text-[#333] text-base">
            {currentLang === 'en' ? 'General electronic application tracking (GCKey)' : 'Suivi de demande générale (CléGC)'}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {currentLang === 'en'
              ? 'Are you an existing applicant checking your profile status? Securely log in using our GCKey validation credentials partner.'
              : 'Êtes-vous un demandeur enregistré ? Connectez-vous en toute sécurité en utilisant le système d\'authentification CléGC.'}
          </p>
        </div>
        <Link 
          to="/auth/login" 
          className="bg-[#335075] hover:bg-[#1c3552] text-white font-bold text-xs px-4 py-2.5 rounded transition-colors shrink-0"
        >
          {currentLang === 'en' ? 'Sign In with GCKey Partner' : 'Se connecter via CléGC'}
        </Link>
      </section>

    </main>
  );
}
