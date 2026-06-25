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
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans text-[#333]">
      
      {/* Greeting row */}
      <div className="bg-white border border-gray-400 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest block">{currentLang === 'en' ? 'Console Hub' : 'Console d\'accès'}</span>
          <h1 className="text-2xl font-bold text-black">
            {currentLang === 'en' ? `Welcome to My Service Canada Account, ${user?.name || 'Guest'}` : `Bienvenue dans votre dossier Service Canada, ${user?.name || 'Invité'}`}
          </h1>
          <p className="text-xs text-gray-600">
            {currentLang === 'en' ? 'Secure login session active' : 'Session sécurisée active'} &bull; ID: {user?.email || 'guest-session'}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => navigate('/immigration-citizenship/biometrics')} 
            className="bg-[#26374a] text-white font-bold text-xs px-4 py-2 border border-[#26374a] cursor-pointer"
          >
            {currentLang === 'en' ? 'Calculator Options' : 'Options de calcul'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Active applications log timeline list (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-400 p-6 space-y-6">
            <h2 className="text-lg font-bold text-black border-b border-gray-400 pb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-black" />
              {currentLang === 'en' ? 'Track Active Application Files Status' : 'Gérer l\'état d\'avancement de mes dossiers'}
            </h2>

            <div className="space-y-6">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app.id} className="border border-gray-300 p-5 bg-white space-y-4" id={`app-ticket-${app.id}`}>
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-300 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-gray-600 uppercase font-mono block">Ticket Registry No: {app.id}</span>
                        <h3 className="text-base font-bold text-black">
                          {currentLang === 'en' ? app.type : app.typeFr}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600">{currentLang === 'en' ? 'Last modified:' : 'Mis à jour :'} {app.lastUpdated}</span>
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 border ${getStatusBadge(app.status)}`}>
                          {currentLang === 'en' ? app.status : app.statusFr}
                        </span>
                      </div>
                    </div>

                    {/* Progress slider bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase">
                        <span>{currentLang === 'en' ? 'Verification Stage' : 'Étape d\'analyse'}</span>
                        <span>{getProgressPercent(app.status)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 border border-gray-300">
                        <div 
                          className="h-full bg-[#26374a] transition-all duration-500"
                          style={{ width: `${getProgressPercent(app.status)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Details and Actions links */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2.5 bg-gray-100 px-4 gap-2 text-xs border border-gray-300">
                      <p className="text-black leading-relaxed font-semibold">
                        {currentLang === 'en' ? app.details : app.detailsFr}
                      </p>
                      
                      {app.type === 'Biometrics' && (
                        <button 
                          onClick={() => navigate('/immigration-citizenship/biometrics')}
                          className="text-[#284162] hover:underline shrink-0 font-bold flex items-center gap-1"
                        >
                          <span>{currentLang === 'en' ? 'Manage Bookings' : 'Prendre Rendez-vous'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-600 text-xs italic">No active application logs. Submit one below.</div>
              )}
            </div>

          </div>
        </div>

        {/* Right Columns: adding dummy tracker entries (col-span 1) */}
        <div className="space-y-6">
          
          {/* Add simulated application ticket */}
          <div className="bg-white border border-gray-400 p-5 space-y-4">
            <h3 className="text-sm font-bold text-black uppercase border-b border-gray-400 pb-2 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-black" />
              {currentLang === 'en' ? 'Simulate New Application' : 'Simuler une nouvelle demande'}
            </h3>
            
            <p className="text-xs text-black leading-relaxed">
              {currentLang === 'en' 
                ? 'Choose a program to simulate submission and instantly track progress in the active dashboard table above.'
                : 'Sélectionnez un programme d\'immigration ou de dossier pour simuler son dépôt et suivre son état.'}
            </p>

            {addSuccess && (
              <div className="bg-gray-100 text-black p-2.5 text-[11px] font-bold border border-gray-400">
                {currentLang === 'en' ? '✓ Mock application logged successfully!' : '✓ Dossier de simulation enregistré !'}
              </div>
            )}

            <form onSubmit={handleAddTicket} className="space-y-3">
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full text-xs p-2 border border-gray-400 bg-white outline-none focus:border-black text-black"
              >
                <option value="Passport">{currentLang === 'en' ? 'Canadian Biometric Passport' : 'Passeport canadien biométrique'}</option>
                <option value="Biometrics">{currentLang === 'en' ? 'Biometrics Collection Letter' : 'Lettre d\'empreintes biométriques'}</option>
                <option value="Study Permit">{currentLang === 'en' ? 'Study Permit Student Visa' : 'Permis d\'études d\'étudiant'}</option>
                <option value="Express Entry">{currentLang === 'en' ? 'Express Entry PR (Permanent Res)' : 'Résidence permanente Entrée express'}</option>
              </select>
              
              <button
                type="submit"
                className="w-full bg-[#26374a] text-white text-xs font-bold py-2 border border-[#26374a] cursor-pointer"
              >
                {currentLang === 'en' ? 'Submit Simulated File' : 'Soumettre le dossier de test'}
              </button>
            </form>
          </div>

          {/* Secure Instruction Documents portal */}
          <div className="bg-white border border-gray-400 p-5 space-y-3">
            <h3 className="text-sm font-bold text-black border-b border-gray-400 pb-1.5 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-black" />
              {currentLang === 'en' ? 'My Security Letters & Documents' : 'Mes documents sécurisés'}
            </h3>
            <div className="space-y-2 text-xs">
              {applications.some(app => app.documents && app.documents.length > 0) ? (
                applications.map(app => 
                  app.documents?.map((doc, idx) => (
                    <div key={`${app.id}-doc-${idx}`} className="flex flex-col border-b border-gray-200 py-2 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">{doc.name}</span>
                        <span className="text-[10px] text-[#284162] font-bold hover:underline cursor-pointer">Download</span>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1">Uploaded: {doc.date} at {doc.time}</span>
                    </div>
                  ))
                )
              ) : (
                <div className="text-gray-500 italic py-2">
                  {currentLang === 'en' ? 'No documents available yet.' : 'Aucun document disponible pour le moment.'}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
