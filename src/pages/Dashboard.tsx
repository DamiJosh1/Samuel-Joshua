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

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  useEffect(() => {
    if (applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0].id);
    }
  }, [applications]);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  return (
    <main className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans text-[#333]">
      
      {/* Greeting row */}
      <div className="bg-white border border-gray-400 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest block">{currentLang === 'en' ? 'Client Portal Dashboard' : 'Portail Client'}</span>
          <h1 className="text-3xl font-bold text-black">
            {currentLang === 'en' ? `Applicant Profile: ${user?.name || 'Guest'}` : `Profil du candidat: ${user?.name || 'Invité'}`}
          </h1>
          <div className="text-sm text-gray-700 flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
            <span><strong>Account Created:</strong> {user?.dateCreated || 'N/A'} at {user?.timeCreated || 'N/A'}</span>
            <span><strong>Secure Session ID:</strong> {user?.email || 'guest-session'}</span>
          </div>
        </div>
      </div>

      {/* 1. Applications Submitted Table */}
      <div className="bg-white border border-gray-400 p-6 space-y-4">
        <h2 className="text-xl font-bold text-black border-b border-gray-400 pb-2">
          {currentLang === 'en' ? 'Applications Submitted' : 'Demandes soumises'}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300 min-w-[800px] text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400">
                <th className="p-3 border-r border-gray-300 font-bold">Application Type</th>
                <th className="p-3 border-r border-gray-300 font-bold">Application Number</th>
                <th className="p-3 border-r border-gray-300 font-bold">Applicant Name</th>
                <th className="p-3 border-r border-gray-300 font-bold">Date & Time Submitted</th>
                <th className="p-3 border-r border-gray-300 font-bold">Current Status</th>
                <th className="p-3 border-r border-gray-300 font-bold">Messages</th>
                <th className="p-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className={`border-b border-gray-300 hover:bg-gray-50 ${selectedAppId === app.id ? 'bg-blue-50' : ''}`}>
                    <td className="p-3 border-r border-gray-300 font-semibold">{app.type}</td>
                    <td className="p-3 border-r border-gray-300 font-mono">{app.id}</td>
                    <td className="p-3 border-r border-gray-300">{user?.name}</td>
                    <td className="p-3 border-r border-gray-300 whitespace-nowrap">
                      {app.dateCreated || 'N/A'} <br/><span className="text-xs text-gray-500">{app.timeCreated || 'N/A'}</span>
                    </td>
                    <td className="p-3 border-r border-gray-300">
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 border-r border-gray-300 text-xs line-clamp-2 max-w-xs" title={app.details}>
                      {app.details}
                    </td>
                    <td className="p-3 whitespace-nowrap space-y-1">
                      <button 
                        onClick={() => setSelectedAppId(app.id)}
                        className="block w-full text-left text-sm font-bold text-[#26374a] hover:underline"
                      >
                        View Application
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedAppId(app.id);
                          document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="block w-full text-left text-sm font-bold text-[#26374a] hover:underline"
                      >
                        View Timeline
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500 italic">
                    No applications submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Application Progress Tracker */}
            <div className="bg-white border border-gray-400 p-6 space-y-6">
              <div className="flex justify-between items-end border-b border-gray-400 pb-2">
                <h2 className="text-xl font-bold text-black flex items-center gap-2">
                  <Activity className="w-6 h-6 text-black" />
                  Application Progress Tracker
                </h2>
                <div className="text-sm font-mono text-gray-600">APP NO: {selectedApp.id}</div>
              </div>

              <div className="p-5 bg-gray-50 border border-gray-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  {IMMIGRATION_JOURNEY_STEPS.map((step, idx) => {
                    const currentStepIndex = getStepProgress(selectedApp.status);
                    const isCompleted = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;
                    return (
                      <div key={step} className={`flex items-center gap-3 ${isCurrent ? 'font-bold text-[#26374a]' : (isCompleted ? 'text-gray-800' : 'text-gray-400')}`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#1a5b28] shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                        )}
                        <span className="text-sm">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div id="timeline-section" className="bg-white border border-gray-400 p-6 space-y-6">
              <h2 className="text-xl font-bold text-black border-b border-gray-400 pb-2 flex items-center gap-2">
                <Clock className="w-6 h-6 text-black" /> 
                Activity History
              </h2>
              <div className="space-y-6 p-4">
                {selectedApp.timeline && selectedApp.timeline.length > 0 ? (
                  selectedApp.timeline.map((evt, idx) => (
                    <div key={idx} className="border-l-4 border-[#26374a] pl-5 py-1 relative">
                      <div className="absolute w-3 h-3 bg-[#26374a] rounded-full -left-[8px] top-1.5"></div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{evt.date} &bull; {evt.time}</div>
                      <div className="text-base font-bold text-black mt-1">{evt.action}</div>
                      <div className="text-sm font-medium mt-1">Current Status: {selectedApp.status}</div>
                      {evt.documentName && <div className="text-sm text-[#26374a] mt-2 inline-flex items-center gap-1 font-semibold"><FileText className="w-4 h-4" /> Attached File: {evt.documentName}</div>}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic p-4 bg-gray-50 border border-gray-200">No activity history available.</div>
                )}
              </div>
            </div>

          </div>

          <div className="space-y-8">
            
            {/* Next Required Action */}
            <div className="bg-[#26374a] text-white p-6 space-y-4">
              <h3 className="text-lg font-bold border-b border-white/30 pb-2 flex items-center gap-2">
                <ArrowRight className="w-5 h-5" /> Next Required Action
              </h3>
              <p className="text-sm leading-relaxed">
                {selectedApp.details || 'No action required at this time. We are processing your application.'}
              </p>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-gray-400 p-6 space-y-4">
              <h3 className="text-lg font-bold border-b border-gray-400 pb-2 text-black">
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-300 p-3 text-sm flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#d3080c] mt-1.5 shrink-0"></div>
                  <div>
                    <span className="font-bold text-black block mb-1">New Message</span>
                    <span className="text-gray-700">Check your Activity History for recent updates to your application.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="bg-white border border-gray-400 p-6 space-y-4">
              <h3 className="text-lg font-bold text-black border-b border-gray-400 pb-2 flex items-center gap-2">
                <Download className="w-5 h-5 text-black" />
                Uploaded Documents
              </h3>
              
              <div className="space-y-3">
                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                  selectedApp.documents.map((doc, idx) => (
                    <div key={`${selectedApp.id}-doc-${idx}`} className="flex flex-col border border-gray-300 p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start gap-3">
                        <FileText className="w-6 h-6 text-[#26374a] shrink-0" />
                        <div className="flex-1 space-y-1">
                          <span className="font-bold text-black text-sm block">{doc.category || 'Document'}</span>
                          <span className="text-sm font-semibold text-[#26374a] hover:underline cursor-pointer block">{doc.name}</span>
                          <span className="text-xs text-gray-500 font-mono">Uploaded: {doc.date} &bull; {doc.time}</span>
                          <button className="text-xs font-bold bg-white border border-gray-400 px-3 py-1 mt-2 hover:bg-gray-200">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600 italic p-4 text-sm bg-gray-50 border border-gray-200">
                    No documents uploaded yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
