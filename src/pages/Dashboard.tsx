import { useState } from 'react';
import { useApp, ApplicationInfo } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle, 
  XSquare, 
  Activity, 
  PlusCircle, 
  ArrowRight,
  Download
} from 'lucide-react';

export default function Dashboard() {
  const { currentLang, user, applications, addApplication } = useApp();
  const navigate = useNavigate();

  // Create mock forms state to submit a new tracker application ticket
  const [formType, setFormType] = useState<'Passport' | 'Biometrics' | 'Study Permit' | 'Express Entry'>('Passport');
  const [addSuccess, setAddSuccess] = useState(false);

  const handleAddTicket = (e: any) => {
    e.preventDefault();
    const mockId = `APP-${Math.floor(10000 + Math.random() * 90000)}`;

    let typeFr: ApplicationInfo['typeFr'] = 'Passeport';
    if (formType === 'Biometrics') typeFr = 'Biométrie';
    if (formType === 'Study Permit') typeFr = 'Permis d\'études';
    if (formType === 'Express Entry') typeFr = 'Entrée express';

    const newTicket: ApplicationInfo = {
      id: mockId,
      type: formType,
      typeFr,
      status: 'Received',
      statusFr: 'Reçu',
      lastUpdated: new Date().toISOString().split('T')[0],
      details: "Application received and assigned to a processing officer.",
      detailsFr: "Demande reçue et affectée à un agent de traitement."
    };

    addApplication(newTicket);
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

  const getStatusBadge = (status: ApplicationInfo['status']) => {
    if (status === 'Approved') return 'bg-green-150 text-green-900 border-green-300';
    if (status === 'In Progress') return 'bg-blue-50 text-blue-900 border-blue-200';
    if (status === 'Action Required') return 'bg-red-100 text-red-900 border-red-300 animate-pulse';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getProgressPercent = (status: ApplicationInfo['status']) => {
    if (status === 'Approved') return 100;
    if (status === 'In Progress') return 50;
    if (status === 'Action Required') return 25;
    return 10;
  };

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Greeting row */}
      <div className="bg-[#f0f4f8] border border-blue-200/40 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">{currentLang === 'en' ? 'Console Hub' : 'Console d\'accès'}</span>
          <h1 className="text-2xl font-bold text-[#335075]">
            {currentLang === 'en' ? `Welcome to My Service Canada Account, ${user?.name || 'Guest'}` : `Bienvenue dans votre dossier Service Canada, ${user?.name || 'Invité'}`}
          </h1>
          <p className="text-xs text-gray-400">
            {currentLang === 'en' ? 'Secure login session active' : 'Session sécurisée active'} &bull; ID: {user?.email || 'guest-session'}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => navigate('/immigration-citizenship/biometrics')} 
            className="bg-white text-[#2572b4] hover:bg-gray-55 font-bold text-xs px-4 py-2 border rounded shadow-2xs cursor-pointer"
          >
            {currentLang === 'en' ? 'Calculator Options' : 'Options de calcul'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Active applications log timeline list (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-base font-bold text-[#333] border-b pb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#af3c43]" />
              {currentLang === 'en' ? 'Track Active Application Files Status' : 'Gérer l\'état d\'avancement de mes dossiers'}
            </h2>

            <div className="space-y-6">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app.id} className="border border-gray-150 rounded-lg p-5 bg-white space-y-4 shadow-3xs" id={`app-ticket-${app.id}`}>
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Ticket Registry No: {app.id}</span>
                        <h3 className="text-sm font-extrabold text-gray-800">
                          {currentLang === 'en' ? app.type : app.typeFr}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400">{currentLang === 'en' ? 'Last modified:' : 'Mis à jour :'} {app.lastUpdated}</span>
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border ${getStatusBadge(app.status)}`}>
                          {currentLang === 'en' ? app.status : app.statusFr}
                        </span>
                      </div>
                    </div>

                    {/* Progress slider bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                        <span>{currentLang === 'en' ? 'Verification Stage' : 'Étape d\'analyse'}</span>
                        <span>{getProgressPercent(app.status)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#2572b4] to-[#af3c43] rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercent(app.status)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Details and Actions links */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2.5 bg-gray-50 px-4 rounded-lg gap-2 text-xs">
                      <p className="text-gray-700 leading-relaxed font-semibold">
                        {currentLang === 'en' ? app.details : app.detailsFr}
                      </p>
                      
                      {app.type === 'Biometrics' && (
                        <button 
                          onClick={() => navigate('/immigration-citizenship/biometrics')}
                          className="text-[#af3c43] hover:underline hover:text-[#8f2f35] shrink-0 font-bold flex items-center gap-1"
                        >
                          <span>{currentLang === 'en' ? 'Manage Bookings' : 'Prendre Rendez-vous'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400 text-xs italic">No active application logs. Submit one below.</div>
              )}
            </div>

          </div>
        </div>

        {/* Right Columns: adding dummy tracker entries (col-span 1) */}
        <div className="space-y-6">
          
          {/* Add simulated application ticket */}
          <div className="bg-white border rounded-lg shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase border-b pb-2 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              {currentLang === 'en' ? 'Simulate New Application' : 'Simuler une nouvelle demande'}
            </h3>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              {currentLang === 'en' 
                ? 'Choose a program to simulate submission and instantly track progress in the active dashboard table above.'
                : 'Sélectionnez un programme d\'immigration ou de dossier pour simuler son dépôt et suivre son état.'}
            </p>

            {addSuccess && (
              <div className="bg-green-50 text-green-800 p-2.5 rounded text-[11px] font-semibold border border-green-200">
                {currentLang === 'en' ? '✓ Mock application logged successfully!' : '✓ Dossier de simulation enregistré !'}
              </div>
            )}

            <form onSubmit={handleAddTicket} className="space-y-3">
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-gray-50 outline-none focus:border-[#2572b4] text-[#333]"
              >
                <option value="Passport">{currentLang === 'en' ? 'Canadian Biometric Passport' : 'Passeport canadien biométrique'}</option>
                <option value="Biometrics">{currentLang === 'en' ? 'Biometrics Collection Letter' : 'Lettre d\'empreintes biométriques'}</option>
                <option value="Study Permit">{currentLang === 'en' ? 'Study Permit Student Visa' : 'Permis d\'études d\'étudiant'}</option>
                <option value="Express Entry">{currentLang === 'en' ? 'Express Entry PR (Permanent Res)' : 'Résidence permanente Entrée express'}</option>
              </select>
              
              <button
                type="submit"
                className="w-full bg-[#335075] hover:bg-[#1c3552] text-white text-xs font-bold py-2 rounded transition-colors cursor-pointer"
              >
                {currentLang === 'en' ? 'Submit Simulated File' : 'Soumettre le dossier de test'}
              </button>
            </form>
          </div>

          {/* Secure Instruction Documents portal */}
          <div className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#333] border-b pb-1.5 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-blue-500" />
              {currentLang === 'en' ? 'My Security Letters' : 'Mes documents sécurisés'}
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-colors">
                <span className="font-semibold text-gray-700">Biometric_Instruction_BIL.pdf</span>
                <span className="text-[10px] text-blue-700 font-bold hover:underline cursor-pointer">Download</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-colors">
                <span className="font-semibold text-gray-700">Payment_Receipt_901.pdf</span>
                <span className="text-[10px] text-blue-700 font-bold hover:underline cursor-pointer">Download</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
