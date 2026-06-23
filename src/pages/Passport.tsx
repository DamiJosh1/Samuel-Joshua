import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BadgeHelp, ShieldAlert, Sparkles, Milestone, Calculator, CheckCircle, Search } from 'lucide-react';

export default function Passport() {
  const { currentLang } = useApp();
  
  // Fee Estimator State
  const [ageRange, setAgeRange] = useState<'adult10' | 'adult5' | 'child'>('adult10');
  const [expedite, setExpedite] = useState<'standard' | 'express' | 'urgent'>('standard');
  const [delivery, setDelivery] = useState<'pickup' | 'mail'>('mail');

  // Tracking State
  const [trackingNo, setTrackingNo] = useState('');
  const [trackingResult, setTrackingResult] = useState<{ status: string; statusFr: string; date: string; info: string; infoFr: string; step: number } | null>(null);

  // Fee calculation matrix logic
  const calculateFees = () => {
    let base = 120; // Default Standard adult 5-year
    if (ageRange === 'adult10') base = 160;
    if (ageRange === 'child') base = 57;

    let expediteFee = 0;
    if (expedite === 'express') expediteFee = 50;
    if (expedite === 'urgent') expediteFee = 110;

    let pickupFee = 0;
    if (delivery === 'pickup') pickupFee = 20;

    return base + expediteFee + pickupFee;
  };

  const handleTrack = (e: any) => {
    e.preventDefault();
    if (!trackingNo.trim()) return;

    // Simulated status returned based on format
    if (trackingNo.toUpperCase().includes('ERR')) {
      setTrackingResult({
        status: "Action Required",
        statusFr: "Action requise",
        date: "2026-06-22",
        info: "Address verification failed. Please contact your nearest local Service Canada location with your identification papers.",
        infoFr: "Échec de la vérification de l'adresse. Veuillez contacter votre succursale locale muni de vos pièces d'identité.",
        step: 2
      });
    } else {
      setTrackingResult({
        status: "In Progress (Dispatched to Print Centre)",
        statusFr: "En cours (Transféré à l'impression)",
        date: "2026-06-23",
        info: "Your application has passed review checks. Printing of the biometric passport security page has commenced.",
        infoFr: "Votre demande a été approuvée après vérification. L'impression sécurisée de la puce biométrique a commencé.",
        step: 3
      });
    }
  };

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Page header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Canadian passports application & renewal' : 'Demande et renouvellement de passeport canadien'}
        </h1>
        <p className="text-gray-700 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Access processing times guidelines, renewal requirement forms, and our interactive online passport price calculation utility.'
            : 'Consultez les délais de traitement des livrets, téléchargez les formulaires requis et calculez le coût estimé via notre outil.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Fee Calculator Form Widget (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#2572b4]" />
              {currentLang === 'en' ? 'Interactive Passport Fee Calculator' : 'Calculateur de frais de passeport en ligne'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Type selector */}
              <div className="space-y-1.5Col">
                <label className="text-xs font-bold text-gray-500 uppercase">{currentLang === 'en' ? 'Applicant Age & Term' : 'Âge et durée d\'admissibilité'}</label>
                <select 
                  value={ageRange} 
                  onChange={(e) => setAgeRange(e.target.value as any)}
                  className="w-full border p-2 text-sm rounded bg-gray-50 text-[#333] outline-none focus:border-[#2572b4]"
                >
                  <option value="adult10">{currentLang === 'en' ? 'Adult (10-Year Term)' : 'Adulte (Validité de 10 ans)'}</option>
                  <option value="adult5">{currentLang === 'en' ? 'Adult (5-Year Term)' : 'Adulte (Validité de 5 ans)'}</option>
                  <option value="child">{currentLang === 'en' ? 'Child (0-15 Years old)' : 'Enfant (De 0 à 15 ans)'}</option>
                </select>
              </div>

              {/* Expediting speed */}
              <div className="space-y-1.5Col">
                <label className="text-xs font-bold text-gray-500 uppercase">{currentLang === 'en' ? 'Required Speed' : 'Délai de traitement requis'}</label>
                <select 
                  value={expedite} 
                  onChange={(e) => setExpedite(e.target.value as any)}
                  className="w-full border p-2 text-sm rounded bg-gray-50 text-[#333] outline-none focus:border-[#2572b4]"
                >
                  <option value="standard">{currentLang === 'en' ? 'Standard (10 Business Days)' : 'Régulier (10 jours ouvrés)'}</option>
                  <option value="express">{currentLang === 'en' ? 'Express (2 to 9 Days)' : 'Express (De 2 à 9 jours)'}</option>
                  <option value="urgent">{currentLang === 'en' ? 'Urgent (Next-day Delivery)' : 'Urgent (Livraison sous 24 heures)'}</option>
                </select>
              </div>

              {/* Delivery option */}
              <div className="space-y-1.5Col">
                <label className="text-xs font-bold text-gray-500 uppercase">{currentLang === 'en' ? 'Delivery Mode' : 'Mode de livraison'}</label>
                <select 
                  value={delivery} 
                  onChange={(e) => setDelivery(e.target.value as any)}
                  className="w-full border p-2 text-sm rounded bg-gray-50 text-[#333] outline-none focus:border-[#2572b4]"
                >
                  <option value="mail">{currentLang === 'en' ? 'Regular Postal Mail' : 'Courrier postal régulier'}</option>
                  <option value="pickup">{currentLang === 'en' ? 'In-office Counter Pickup' : 'Retrait en personne au comptoir'}</option>
                </select>
              </div>
            </div>

            {/* Price Output display */}
            <div className="bg-[#f3f8fc] border border-blue-100 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#335075] uppercase tracking-wide block">
                  {currentLang === 'en' ? 'Estimated Renewal Cost:' : 'Coût estimé du renouvellement :'}
                </span>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  {currentLang === 'en' 
                    ? 'Includes basic consular tax, standard administrative review fees, and express postage modifiers if applicable.'
                    : 'Comprend la taxe consulaire de base, les frais administratifs et les suppléments d\'expédition express.'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-3xl font-extrabold text-[#335075] block">${calculateFees()}.00</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Canadian Dollars (CAD)</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 leading-relaxed border-t pt-4 space-y-1">
              <p className="font-bold">{currentLang === 'en' ? 'Note on Walk-ins:' : 'Remarque concernant le sans rendez-vous :'}</p>
              <p>{currentLang === 'en' 
                ? 'Only urgent next-day processing options accept non-scheduled drop-offs. Traditional files must book a date below.'
                : 'Seuls les traitements urgents sous 24h acceptent les dépôts sans rendez-vous.'}</p>
            </div>
          </div>

          {/* Standard steps panel */}
          <div className="bg-gray-50 rounded-lg p-5 border space-y-3">
            <h3 className="font-bold text-[#333] text-sm">{currentLang === 'en' ? 'Required application documents list:' : 'Documents requis à joindre :'}</h3>
            <ul className="text-xs text-gray-650 space-y-2 list-disc pl-5">
              <li>{currentLang === 'en' ? 'Form PPTC 150 (Adult General Passport Application).' : 'Formulaire PPTC 150 (Demande de passeport pour adulte).'}</li>
              <li>{currentLang === 'en' ? 'Original proof of Canadian citizenship (Birth Certificate or Citizenship Card).' : 'Preuve originale de citoyenneté (Certificat de naissance ou carte).'}</li>
              <li>{currentLang === 'en' ? 'Two identical passport photos meeting strict biometrics alignment guidelines.' : 'Deux photos d\'identité identiques conformes aux règles biométriques.'}</li>
              <li>{currentLang === 'en' ? 'A valid declaration signed by an eligible guarantor.' : 'Une déclaration valide signée par un garant admissible.'}</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Online Status Tracker Portal Widget (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#333] tracking-tight uppercase border-b pb-2 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#af3c43]" />
              {currentLang === 'en' ? 'Track Passport Status' : 'Suivre ma demande'}
            </h3>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              {currentLang === 'en'
                ? 'Enter your 10-digit Government reference code (printed on your application fee receipt) to lookup database status updates.'
                : 'Entrez votre code de référence à 10 chiffres pour interroger la base de données et connaître l\'avancement.'}
            </p>

            <form onSubmit={handleTrack} className="space-y-3">
              <input
                type="text"
                placeholder={currentLang === 'en' ? 'e.g., PPT-902-192' : 'ex : PPT-902-192'}
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                className="w-full text-xs p-2.5 border rounded outline-none focus:border-[#af3c43] uppercase font-mono"
              />
              <button
                type="submit"
                className="w-full bg-[#335075] hover:bg-[#1c3552] text-white text-xs font-bold py-2 rounded transition-colors cursor-pointer"
              >
                {currentLang === 'en' ? 'Interrogate Registry' : 'Interroger le registre'}
              </button>
            </form>

            <div className="bg-amber-50 text-[10px] text-amber-800 p-2 rounded border border-amber-200 leading-snug">
              {currentLang === 'en' 
                ? 'Tip: Input "ERR" to test dynamic "Action Required" application status tracking notifications.'
                : 'Astuce : Saisissez « ERR » pour tester la notification d\'action requise.'}
            </div>

            {/* Tracking Result Box output */}
            {trackingResult && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-xs space-y-2 mt-2 animate-fadeIn">
                <div className="flex justify-between items-center border-b pb-1.5 font-bold">
                  <span className="text-gray-500">Ref: {trackingNo.toUpperCase()}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${trackingResult.status.startsWith('Action') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {currentLang === 'en' ? trackingResult.status : trackingResult.statusFr}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-semibold">{currentLang === 'en' ? 'Last registry update:' : 'Dernière mise à jour :'} {trackingResult.date}</span>
                  <p className="text-gray-700 leading-relaxed font-semibold">
                    {currentLang === 'en' ? trackingResult.info : trackingResult.infoFr}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </main>
  );
}
