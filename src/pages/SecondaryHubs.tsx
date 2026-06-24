import { useApp } from '../context/AppContext';
import { Mail, HelpCircle, Shield, Settings, Info, LifeBuoy, HeartPulse, ShieldAlert, Sparkles } from 'lucide-react';

// -----------------------------------------------------------------
// 1. VISIT CANADA PAGE
// -----------------------------------------------------------------
export function VisitCanada() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2">
        {currentLang === 'en' ? 'Visit Canada as a Tourist' : 'Visiter le Canada comme touriste'}
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-3xl">
        {currentLang === 'en'
          ? 'Apply for a visitor visa (subclass Temporary Resident Visa) or electronic Travel Authorization (eTA) to travel to Canada. Most tourist files require biometrics fingerprints collection at an official ASC or VAC center.'
          : 'Déposez votre demande de visa de visiteur ou d\'autorisation de voyage électronique (AVE). Plusieurs profils requièrent la collecte d\'empreintes.'}
      </p>
      <div className="bg-gray-50 border rounded-lg p-5 max-w-2xl text-xs space-y-2">
        <h3 className="font-bold text-gray-800 uppercase">{currentLang === 'en' ? 'Basic requirements checklist:' : 'Critères obligatoires :'}</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-500">
          <li>{currentLang === 'en' ? 'Hold a valid international passport.' : 'Passeport international valide.'}</li>
          <li>{currentLang === 'en' ? 'Prove sufficient funds to support yourself during your stay.' : 'Capacité financière d\'entretien de séjour.'}</li>
          <li>{currentLang === 'en' ? 'Submit biometrics fingerprints letters within 30 days.' : 'Soumission de données biométriques sous 30 jours.'}</li>
        </ul>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------
// 2. HEALTH PAGE
// -----------------------------------------------------------------
export function Health() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 flex items-center gap-2">
        <HeartPulse className="w-7 h-7 text-gray-700" />
        <span>{currentLang === 'en' ? 'Health care services and medical exams' : 'Santé et soins de santé publics'}</span>
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-3xl">
        {currentLang === 'en'
          ? 'Find public healthcare parameters, recall notices, look up panel physicians for immigration medical exams, and explore Canada Health Act credits.'
          : 'Consultez la réglementation sur la santé publique, trouvez un médecin agréé pour l\'évaluation médicale d\'immigration.'}
      </p>
      <div className="p-4 bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg max-w-lg">
        <strong>{currentLang === 'en' ? 'Medical Exams for Immigration:' : 'Examen médical d\'immigration :'}</strong>{' '}
        {currentLang === 'en' 
          ? 'If you plan to stay in Canada for more than 6 months, you must undergo medical checks conducted exclusively by official panel physicians.'
          : 'Pour tout séjour excédant un semestre, vous devez passer un examen médical réglementaire auprès de praticiens désignés.'}
      </div>
    </main>
  );
}

// -----------------------------------------------------------------
// 3. ENVIRONMENT PAGE
// -----------------------------------------------------------------
export function Environment() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2">
        {currentLang === 'en' ? 'Environment and natural resources' : 'Environnement et ressources naturelles'}
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-3xl">
        {currentLang === 'en'
          ? 'Monitor local weather advisories, national parks directories, environmental protection tax credits, and wildlife conservation policies.'
          : 'Consultez la météo nationale, réservez des laissez-passer de parcs ou étudiez les taxes climatiques.'}
      </p>
    </main>
  );
}

// -----------------------------------------------------------------
// 4. JUSTICE PAGE
// -----------------------------------------------------------------
export function Justice() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2">
        {currentLang === 'en' ? 'Justice, laws, and legal system' : 'Justice, droit et système judiciaire'}
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-3xl">
        {currentLang === 'en'
          ? 'Explore Canadian charter rights, national legislation statutes, court directories, and police record clean certificates.'
          : 'Renseignez-vous sur la Charte canadienne des droits et libertés, les lois en vigueur et l\'obtention de certificats de police.'}
      </p>
    </main>
  );
}

// -----------------------------------------------------------------
// 5. PUBLIC SAFETY PAGE
// -----------------------------------------------------------------
export function PublicSafety() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 flex items-center gap-2">
        <ShieldAlert className="w-7 h-7 text-gray-700" />
        <span>{currentLang === 'en' ? 'Public safety, policing, and emergency defense' : 'Sécurité publique et urgences'}</span>
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-3xl">
        {currentLang === 'en'
          ? 'Borders administration registries, cyber defense protocols, policing agencies, and royal mounted police notifications.'
          : 'Contrôle douanier aux frontières d\'après l\'ASFC, protection informatique et bulletins d\'urgence de la Gendarmerie royale.'}
      </p>
    </main>
  );
}

// -----------------------------------------------------------------
// 6. CONTACT PAGE
// -----------------------------------------------------------------
export function Contact() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-8 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2">
        {currentLang === 'en' ? 'Contact Canada.ca / Service directories' : 'Contactez-nous / Répertoires de service'}
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-2xl">
        {currentLang === 'en'
          ? 'Locate regional phone operators, submit online feedback logs, or schedule physical appointments.'
          : 'Trouvez les numéros de téléphone officiels par ministère et transmettez des commentaires en ligne.'}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
        <div className="border p-5 rounded-lg space-y-2">
          <Mail className="w-6 h-6 text-[#2572b4]" />
          <h3 className="font-bold text-sm">{currentLang === 'en' ? 'Phone Support line' : 'Soutien téléphonique'}</h3>
          <p className="text-xs text-gray-550">1-800-O-Canada (1-800-622-6232) &bull; TTY: 1-800-926-9105</p>
        </div>
        <div className="border p-5 rounded-lg space-y-2">
          <HelpCircle className="w-6 h-6 text-[#af3c43]" />
          <h3 className="font-bold text-sm">{currentLang === 'en' ? 'Immigration (IRCC) Desk' : 'Soutien IRCC'}</h3>
          <p className="text-xs text-gray-550">1-888-242-2100 (Inside Canada only for status reports)</p>
        </div>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------
// 7. HELP CENTER PAGE
// -----------------------------------------------------------------
export function Help() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-gray-400 pb-2">
        {currentLang === 'en' ? 'Help Centre and FAQs' : 'Centre d\'aide et questions fréquentes'}
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-3xl">
        {currentLang === 'en'
          ? 'Find answers to common questions about passports processing times, biometrics deadlines, and tax return filing.'
          : 'Trouvez des réponses concernant les délais de passeport, la biométrie ou les remboursements.'}
      </p>
    </main>
  );
}

// -----------------------------------------------------------------
// 8. ACCESSIBILITY STATEMENT PAGE
// -----------------------------------------------------------------
export function Accessibility() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-gray-400 pb-2">
        {currentLang === 'en' ? 'Accessibility Standards and Statement' : 'Accessibilité et égalité des langues'}
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-3xl">
        {currentLang === 'en'
          ? 'The Government of Canada is committed to providing websites that are accessible to all people. Our platform adheres to WCAG 2.1 Level AA criteria and Official Languages Act standards.'
          : 'Le gouvernement du Canada veille à l\'accessibilité universelle de ses portails conformément aux critères PGQ / WCAG 2.1.'}
      </p>
    </main>
  );
}

// -----------------------------------------------------------------
// 9. PRIVACY POLICY PAGE
// -----------------------------------------------------------------
export function Privacy() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-gray-400 pb-2 flex items-center gap-1.5">
        <Shield className="w-6 h-6 text-gray-500" />
        <span>{currentLang === 'en' ? 'Privacy Policy & Proactive Disclosure' : 'Politique de confidentialité'}</span>
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-3xl">
        {currentLang === 'en'
          ? 'We respect your personal privacy. Under the federal Privacy Act, any biometric data or personal logs submitted during applications are encrypted and shielded from public directories.'
          : 'Nous protégeons vos renseignements. En vertu de la Loi sur la protection des renseignements personnels, vos données d\'empreintes sont cryptées.'}
      </p>
    </main>
  );
}

// -----------------------------------------------------------------
// 10. TERMS OF USE PAGE
// -----------------------------------------------------------------
export function Terms() {
  const { currentLang } = useApp();
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#333] border-b-2 border-gray-400 pb-2">
        {currentLang === 'en' ? 'Terms and Conditions' : 'Avis généraux'}
      </h1>
      <p className="text-sm text-gray-750 leading-relaxed max-w-3xl">
        {currentLang === 'en'
          ? 'Terms governing ownership and reproduction of governmental publications, trademarks, and metadata configurations on Canada.ca.'
          : 'Découvrez les règles d\'utilisation des documents officiels, marques et configurations de métadonnées de Canada.ca.'}
      </p>
    </main>
  );
}
