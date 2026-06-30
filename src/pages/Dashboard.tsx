import React, { useState, useEffect } from 'react';
import { useApp, ApplicationInfo, IMMIGRATION_JOURNEY_STEPS } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ArrowRight,
  Download,
  FileText,
  Clock,
  CheckCircle,
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
    if (Array.isArray(applications) && applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0]?.id || null);
    }
  }, [applications, selectedAppId]);

  const safeApplications = Array.isArray(applications) ? applications : [];
  const selectedApp = safeApplications.find(a => a.id === selectedAppId) || safeApplications[0];

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-grow font-sans text-[#333]">
      
      {/* Top Breadcrumb & User Menu */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[13px] mb-8">
        <div className="text-[#26374a] mb-4 sm:mb-0">
          <span className="underline cursor-pointer">Home</span> <span className="no-underline text-black px-1">&rarr;</span> Your Account
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-gray-600">Signed in as <span className="uppercase">{user?.name}</span></span>
          <span className="text-[#26374a] underline cursor-pointer font-bold">Account Home</span>
          <span className="text-[#26374a] underline cursor-pointer font-bold">Account Profile</span>
          <span className="text-[#26374a] underline cursor-pointer font-bold">Logout</span>
        </div>
      </div>

      <h1 className="text-3xl font-medium text-[#333] mb-4">
        <span className="uppercase">{user?.name}</span> account
      </h1>
      
      <hr className="border-gray-300 mb-8" />

      {/* View the applications you submitted */}
      <div className="space-y-2 mb-10">
        <h2 className="text-2xl font-medium text-[#333]">View the applications you submitted</h2>
        <p className="text-[13px] text-gray-700">Review, check the status or read messages about your submitted application.</p>
        
        <div className="flex items-center gap-2 text-[13px] mt-4">
          <label className="font-bold">Search</label>
          <input type="text" className="border border-gray-400 p-1 w-48 focus:outline-none focus:border-blue-500" />
          <span className="text-gray-600 ml-4">Showing 1 to {safeApplications.length} of {safeApplications.length} entries |</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-t-2 border-b-2 border-gray-300 text-gray-700">
                <th className="py-2 px-2 font-bold whitespace-nowrap">Application type <span className="text-[10px] text-gray-400">↓↑</span></th>
                <th className="py-2 px-2 font-bold whitespace-nowrap">Application number <span className="text-[10px] text-gray-400">↓↑</span></th>
                <th className="py-2 px-2 font-bold whitespace-nowrap">Applicant name <span className="text-[10px] text-gray-400">↓↑</span></th>
                <th className="py-2 px-2 font-bold whitespace-nowrap">Date Submitted <span className="text-[10px] text-gray-400">↓↑</span></th>
                <th className="py-2 px-2 font-bold whitespace-nowrap">Current status <span className="text-[10px] text-gray-400">↓↑</span></th>
                <th className="py-2 px-2 font-bold whitespace-nowrap">Messages <span className="text-[10px] text-gray-400">↓↑</span></th>
                <th className="py-2 px-2 font-bold whitespace-nowrap">Action <span className="text-[10px] text-gray-400">↓↑</span></th>
              </tr>
            </thead>
            <tbody>
              {safeApplications.length > 0 ? (
                safeApplications.map((app) => (
                  <tr 
                    key={app.id || Math.random()} 
                    className={`border-b border-gray-300 hover:bg-gray-50 cursor-pointer ${selectedAppId === app.id ? 'bg-gray-100 font-bold' : ''}`}
                    onClick={() => setSelectedAppId(app.id)}
                  >
                    <td className="py-3 px-2 text-[#26374a] underline uppercase font-bold">{app.type || 'WORK VISA'}</td>
                    <td className="py-3 px-2">{app.id}</td>
                    <td className="py-3 px-2 uppercase">{user?.name}</td>
                    <td className="py-3 px-2 whitespace-nowrap">{app.dateCreated}</td>
                    <td className="py-3 px-2 font-semibold text-gray-800">{app.status}</td>
                    <td className="py-3 px-2">New</td>
                    <td 
                      className="py-3 px-2 text-[#26374a] underline cursor-pointer font-bold"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent setting selection again
                        navigate(`/application/${app.id}`);
                      }}
                    >
                      Check full application status
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500 italic">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-2">
          <button className="bg-[#26374a] text-white px-3 py-1 text-sm font-bold">1</button>
        </div>
      </div>

      {/* Activity History of Selected Application */}
      {selectedApp && (
        <div className="mt-10 border-t border-gray-300 pt-8">
          <h2 className="text-xl font-bold text-[#333] mb-2">
            Activity history for application {selectedApp.id}
          </h2>
          <p className="text-[13px] text-gray-700 mb-4">
            This section lists the timeline of official status updates, document submissions, and biometric actions for the selected application. Click on any row above to view its specific history.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-t-2 border-b-2 border-gray-300 text-gray-900">
                  <th className="py-2.5 px-3 font-bold w-36">Date</th>
                  <th className="py-2.5 px-3 font-bold w-32">Time</th>
                  <th className="py-2.5 px-3 font-bold">Activity / Update</th>
                  <th className="py-2.5 px-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedApp.timeline && selectedApp.timeline.length > 0 ? (
                  selectedApp.timeline.map((evt, idx) => {
                    const parts = (evt.date || "").split(" ");
                    const dStr = parts[0] || evt.date || "—";
                    const tStr = parts[1] ? parts.slice(1).join(" ") : evt.time || "—";
                    return (
                      <tr key={evt.id || idx} className="border-b border-gray-300">
                        <td className="py-2.5 px-3 font-medium whitespace-nowrap">{dStr}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{tStr}</td>
                        <td className="py-2.5 px-3 text-gray-800">{evt.title || evt.action}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-gray-900 border border-gray-300 px-2 py-0.5 rounded-sm text-xs bg-gray-50 font-semibold">
                            {evt.status || 'Completed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 px-3 text-gray-500 italic text-center">No timeline records found for this application.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </main>
  );
}
