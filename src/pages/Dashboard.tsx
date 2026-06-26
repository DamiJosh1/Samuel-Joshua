import { useApp, ApplicationInfo, IMMIGRATION_JOURNEY_STEPS } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ArrowRight,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  Circle
} from 'lucide-react';

export default function Dashboard() {
  const { currentLang, user, applications } = useApp();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    if (status === 'Approved') return 'bg-[#26374a] text-white border-[#26374a] border-2';
    if (status === 'Refused') return 'bg-red-700 text-white border-red-700 border-2';
    if (status === 'Action Required') return 'bg-[#d3080c] text-white border-[#d3080c] border-2';
    return 'bg-white text-black border-black border-2';
  };

  const getStepProgress = (status: string) => {
    const idx = IMMIGRATION_JOURNEY_STEPS.indexOf(status);
    if (idx === -1) {
      if (status === 'Approved') return IMMIGRATION_JOURNEY_STEPS.length;
      return -1; // If "Pending" or something else
    }
    return idx;
  };

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans text-[#333]">
      
      {/* Greeting row */}
      <div className="bg-white border border-gray-400 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest block">{currentLang === 'en' ? 'Client Portal Dashboard' : 'Portail Client'}</span>
          <h1 className="text-2xl font-bold text-black">
            {currentLang === 'en' ? `Applicant Profile: ${user?.name || 'Guest'}` : `Profil du candidat: ${user?.name || 'Invité'}`}
          </h1>
          <p className="text-xs text-gray-600">
            {currentLang === 'en' ? 'Secure login session active' : 'Session sécurisée active'} &bull; ID: {user?.email || 'guest-session'} &bull; Created: {applications[0]?.lastUpdated || 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Active applications log timeline list (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-400 p-6 space-y-6">
            <h2 className="text-lg font-bold text-black border-b border-gray-400 pb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-black" />
              {currentLang === 'en' ? 'My Immigration Applications' : 'Mes demandes d\'immigration'}
            </h2>

            <div className="space-y-8">
              {applications.length > 0 ? (
                applications.map((app) => {
                  const currentStepIndex = getStepProgress(app.status);
                  
                  return (
                    <div key={app.id} className="border border-gray-300 p-0 bg-white" id={`app-ticket-${app.id}`}>
                      
                      {/* Header */}
                      <div className="p-5 border-b border-gray-300">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-gray-600 uppercase font-mono block">Client ID / App No: {app.id}</span>
                            <h3 className="text-xl font-bold text-black mt-1">
                              {currentLang === 'en' ? app.type : app.typeFr}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <span className={`text-xs uppercase font-bold px-3 py-1 ${getStatusBadge(app.status)}`}>
                              Status: {currentLang === 'en' ? app.status : app.statusFr}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Application Process Journey */}
                      <div className="p-5 bg-gray-50 border-b border-gray-300">
                        <h4 className="font-bold text-sm mb-4 uppercase text-gray-600 border-b border-gray-300 pb-2">
                          {currentLang === 'en' ? 'Application Process Journey' : 'Parcours de la demande'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                          {IMMIGRATION_JOURNEY_STEPS.map((step, idx) => {
                            const isCompleted = currentStepIndex >= idx;
                            const isCurrent = currentStepIndex === idx;
                            return (
                              <div key={step} className={`flex items-center gap-2 ${isCurrent ? 'font-bold text-[#26374a]' : (isCompleted ? 'text-gray-800' : 'text-gray-400')}`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#1a5b28] shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                                )}
                                <span className="text-sm">{step}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Next Action / Details */}
                      <div className="p-5 border-b border-gray-300">
                        <h4 className="font-bold text-sm mb-2 uppercase text-gray-600">Current Notes / Next Required Action</h4>
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
                  );
                })
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
