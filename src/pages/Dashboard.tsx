import { useApp, ApplicationInfo } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ArrowRight,
  Download,
  FileText,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { currentLang, user, applications } = useApp();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    if (status === 'Approved') return 'bg-gray-200 text-black border-black border-2';
    if (status === 'Refused') return 'bg-gray-200 text-black border-black border-2';
    if (status === 'Action Required') return 'bg-black text-white border-black border-2';
    return 'bg-white text-black border-black border-2';
  };

  const getProgressPercent = (status: string) => {
    if (status === 'Approved' || status === 'Refused') return 100;
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Active applications log timeline list (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-400 p-6 space-y-6">
            <h2 className="text-lg font-bold text-black border-b border-gray-400 pb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-black" />
              {currentLang === 'en' ? 'Track Active Application Files Status' : 'Gérer l\'état d\'avancement de mes dossiers'}
            </h2>

            <div className="space-y-8">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app.id} className="border border-gray-300 p-0 bg-white" id={`app-ticket-${app.id}`}>
                    
                    {/* Header */}
                    <div className="p-5 border-b border-gray-300">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-gray-600 uppercase font-mono block">Application No: {app.id}</span>
                          <h3 className="text-xl font-bold text-black">
                            {currentLang === 'en' ? app.type : app.typeFr}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs uppercase font-bold px-3 py-1 ${getStatusBadge(app.status)}`}>
                            {currentLang === 'en' ? app.status : app.statusFr}
                          </span>
                        </div>
                      </div>

                      {/* Progress slider bar */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase">
                          <span>{currentLang === 'en' ? 'Processing Stage' : 'Étape d\'analyse'}</span>
                          <span>{getProgressPercent(app.status)}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 border border-gray-300">
                          <div 
                            className="h-full bg-[#26374a] transition-all duration-500"
                            style={{ width: `${getProgressPercent(app.status)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Specific Statuses Grid */}
                    <div className="bg-gray-50 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-300 text-sm">
                      {app.biometricStatus && (
                        <div className="border border-gray-300 p-2 bg-white">
                          <span className="font-bold block text-xs uppercase text-gray-600">Biometrics</span>
                          <span className="font-semibold">{app.biometricStatus}</span>
                        </div>
                      )}
                      {app.medicalRequestStatus && (
                        <div className="border border-gray-300 p-2 bg-white">
                          <span className="font-bold block text-xs uppercase text-gray-600">Medical Exam</span>
                          <span className="font-semibold">{app.medicalRequestStatus}</span>
                        </div>
                      )}
                      {app.workPermitStatus && (
                        <div className="border border-gray-300 p-2 bg-white">
                          <span className="font-bold block text-xs uppercase text-gray-600">Work Permit</span>
                          <span className="font-semibold">{app.workPermitStatus}</span>
                        </div>
                      )}
                      {app.studyPermitStatus && (
                        <div className="border border-gray-300 p-2 bg-white">
                          <span className="font-bold block text-xs uppercase text-gray-600">Study Permit</span>
                          <span className="font-semibold">{app.studyPermitStatus}</span>
                        </div>
                      )}
                      {app.visitorVisaStatus && (
                        <div className="border border-gray-300 p-2 bg-white">
                          <span className="font-bold block text-xs uppercase text-gray-600">Visitor Visa</span>
                          <span className="font-semibold">{app.visitorVisaStatus}</span>
                        </div>
                      )}
                      {app.passportRequestStatus && (
                        <div className="border border-gray-300 p-2 bg-white">
                          <span className="font-bold block text-xs uppercase text-gray-600">Passport Request</span>
                          <span className="font-semibold">{app.passportRequestStatus}</span>
                        </div>
                      )}
                    </div>

                    {/* Next Action / Details */}
                    <div className="p-5 border-b border-gray-300">
                      <h4 className="font-bold text-sm mb-2 uppercase text-gray-600">Current Notes / Next Action</h4>
                      <p className="text-black text-sm">
                        {currentLang === 'en' ? app.details : app.detailsFr}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="p-5 bg-white">
                      <h4 className="font-bold text-sm mb-4 uppercase text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Application Timeline
                      </h4>
                      <div className="space-y-4">
                        {app.timeline && app.timeline.length > 0 ? (
                          app.timeline.map((evt, idx) => (
                            <div key={idx} className="border-l-4 border-[#26374a] pl-4 py-1">
                              <div className="text-xs font-bold text-gray-600">{evt.date} - {evt.time}</div>
                              <div className="text-sm font-bold text-black mt-1">{evt.action}</div>
                              {evt.documentName && <div className="text-xs text-[#26374a] mt-1 italic">Attached File: {evt.documentName}</div>}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-500 italic">No timeline history available.</div>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-10 border border-gray-300 bg-gray-50 text-gray-600 text-sm">
                  No active application logs found for your account. Wait for an administrator to create one.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Documents */}
        <div className="space-y-6">
          
          <div className="bg-white border border-gray-400 p-5 space-y-4">
            <h3 className="text-sm font-bold text-black border-b border-gray-400 pb-2 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-black" />
              {currentLang === 'en' ? 'My Uploaded Documents' : 'Mes documents sécurisés'}
            </h3>
            
            <div className="space-y-3 text-sm">
              {applications.some(app => app.documents && app.documents.length > 0) ? (
                applications.map(app => 
                  app.documents?.map((doc, idx) => (
                    <div key={`${app.id}-doc-${idx}`} className="flex flex-col border border-gray-300 p-3 hover:bg-gray-50">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-0.5 text-[#26374a]" />
                        <div className="flex-1">
                          <span className="font-bold text-black block">{doc.category || 'Document'}</span>
                          <span className="text-sm text-[#26374a] underline cursor-pointer">{doc.name}</span>
                          <span className="text-xs text-gray-600 block mt-1">Uploaded: {doc.date} at {doc.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="text-gray-600 italic py-2 text-sm">
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
