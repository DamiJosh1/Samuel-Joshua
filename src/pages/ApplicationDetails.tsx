import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Clock, Hourglass, Circle, Info, FileText, Activity, Files, Users, Fingerprint, UserCheck, Scale, HelpCircle } from 'lucide-react';

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, applications } = useApp();

  const safeApplications = Array.isArray(applications) ? applications : [];
  const selectedApp = safeApplications.find(a => a.id === id);

  const [selectedMessage, setSelectedMessage] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  if (!selectedApp) {
    return (
      <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-grow font-sans text-[#333]">
        <div className="text-[#284162] text-sm mb-6 font-medium">
          <span className="underline cursor-pointer" onClick={() => navigate('/')}>Home</span> 
          <span className="no-underline text-black px-2">&gt;</span> 
          <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Your Account</span>
          <span className="no-underline text-black px-2">&gt;</span> Application Details
        </div>
        <h1 className="text-3xl font-bold mb-4">Application Not Found</h1>
        <p>The application you are looking for does not exist or you do not have permission to view it.</p>
      </main>
    );
  }

  if (selectedMessage) {
    return (
      <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-grow font-sans text-[#333]">
        <div className="text-[#284162] text-sm mb-6 font-medium">
          <span className="underline cursor-pointer" onClick={() => navigate('/')}>Home</span> 
          <span className="no-underline text-black px-2">&gt;</span> 
          <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Your Account</span>
          <span className="no-underline text-black px-2">&gt;</span> 
          <span className="underline cursor-pointer" onClick={() => setSelectedMessage(null)}>Application Details</span>
          <span className="no-underline text-black px-2">&gt;</span> Message
        </div>
        <h1 className="text-3xl font-bold mb-6 text-[#333] border-b-2 border-red-700 pb-2">{selectedMessage.subject}</h1>
        <div className="mb-8 font-medium">
          Date: {selectedMessage.date}<br />
          Application: {selectedApp?.id}
        </div>
        <div className="prose max-w-none text-black leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedMessage.content }} />
        <div className="mt-8">
          <button 
            onClick={() => setSelectedMessage(null)}
            className="bg-gray-200 text-black px-4 py-2 border border-gray-400 hover:bg-gray-300 font-bold text-[13px]"
          >
            Return to Application Details
          </button>
        </div>
      </main>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="inline-block w-4 h-4 text-gray-700 mr-2" />;
      case 'Pending':
        return <Hourglass className="inline-block w-4 h-4 text-gray-500 mr-2" />;
      case 'Requested':
      default:
        return <Circle className="inline-block w-4 h-4 text-gray-300 mr-2" />;
    }
  };

  const handleUserUploadDoc = async (docName: string, file: File) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const updatedRequested = (selectedApp.requestedDocuments || []).map(d => 
      d.name === docName ? { 
        ...d, 
        status: 'Submitted' as const, 
        dateUpdated: dateStr,
        remarks: `Document submitted on ${dateStr}. Pending review.`
      } : d
    );

    const newDoc = {
      name: file.name || `${docName}.pdf`,
      category: docName,
      date: dateStr,
      time: timeStr
    };
    const updatedDocs = [newDoc, ...(selectedApp.documents || [])];

    const newTimelineEvent = {
      id: `evt-${Date.now()}`,
      date: `${dateStr} ${timeStr}`,
      time: timeStr,
      title: `Submitted document: ${docName}`,
      action: `User Submitted ${docName}`,
      status: 'Pending Verification'
    };
    const updatedTimeline = [newTimelineEvent, ...(selectedApp.timeline || [])];

    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || 'applicant@domain.ca',
          requestedDocuments: updatedRequested,
          documents: updatedDocs,
          timeline: updatedTimeline
        })
      });

      if (res.ok) {
        alert("Document submitted successfully. Status is now pending review.");
      } else {
        console.error("Failed to update application.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderStep = (title: string, statusText: string, date: string | undefined, icon: React.ReactNode) => {
    // If the step date is set, concatenate like Image 1: "April 29, 2021 Your eligibility has been reviewed..."
    const displayStatus = (statusText && statusText.trim()) ? (date ? `${date} ${statusText}` : statusText) : '';
    return (
      <div className="flex items-start gap-4 py-3" key={title}>
        <div className="text-gray-700 flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-900 text-[15.5px]">{title}</span>
            <span className="w-4 h-4 rounded-full bg-[#2572b5] text-white flex items-center justify-center text-[10px] font-bold cursor-pointer select-none" title="Help">?</span>
          </div>
          {displayStatus ? (
            <div className="flex items-start text-[14px] text-gray-800 mt-1.5">
              <span className="text-gray-500 mr-2 select-none font-bold">◦</span>
              <span className="font-normal leading-relaxed">{displayStatus}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const filteredMessages = (selectedApp.messages || []).filter(msg => 
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-grow font-sans text-[#333]">
      
      {/* 1. Breadcrumb Navigation */}
      <div className="text-[#284162] text-sm mb-6 font-medium">
        <span className="underline cursor-pointer" onClick={() => navigate('/')}>Home</span> 
        <span className="no-underline text-black px-2">&gt;</span> 
        <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Your Account</span>
        <span className="no-underline text-black px-2">&gt;</span> Application Details
      </div>

      <div className="border-b-2 border-[#26374a] pb-2 mb-6">
        <h1 className="text-[32px] font-bold text-[#333] mb-2">Application details</h1>
        <p className="text-[16px] text-gray-800 leading-relaxed font-normal">
          Check the status, review the details and read messages about your application so the next words will be a clickable link{" "}
          <span 
            onClick={() => navigate(`/application/${selectedApp.id}/checklist`)}
            className="text-[#05355c] underline font-bold cursor-pointer hover:text-blue-800"
          >
            View submitted application or upload documents{" "}
          </span>
          then the link will take them to this place
        </p>
      </div>

      {/* 2. Side-by-Side Status & Information panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-[14px]">
        {/* Application status Box */}
        <div className="border border-gray-300 rounded-none shadow-none bg-white overflow-hidden">
          <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-gray-300">
            <h2 className="font-bold text-[16px] text-gray-900">Application status</h2>
          </div>
          <div className="p-4">
            <p className="text-gray-800 font-normal leading-relaxed mb-4">
              {selectedApp.statusSummary || selectedApp.details || 'Your application is in progress. We will send you a message if we need more information or if further actions are required.'}
            </p>
            <div>
              <span className="font-bold text-gray-900 block mb-1">Latest update:</span>
              <p className="text-gray-800 leading-relaxed font-normal">
                {selectedApp.latestUpdate || 'Your application is in progress.'}
              </p>
            </div>
          </div>
        </div>

        {/* Applicant information Box */}
        <div className="border border-gray-300 rounded-none shadow-none bg-white overflow-hidden">
          <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-gray-300">
            <h2 className="font-bold text-[16px] text-gray-900">Applicant information</h2>
          </div>
          <div className="p-4 text-gray-800 space-y-2 leading-relaxed">
            <div>
              <span className="font-bold text-gray-900">Principal Applicant:</span>{" "}
              <span className="uppercase font-semibold">{selectedApp.fullName || user?.name || 'Applicant Name'}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">Unique Client Identifier (UCI):</span>{" "}
              <span className="font-mono text-xs">{selectedApp.uci || '—'}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">Application number:</span>{" "}
              <span className="font-mono text-xs">{selectedApp.id}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">Date Received:</span>{" "}
              <span>{selectedApp.dateReceived || selectedApp.dateCreated || '—'}</span>
            </div>
            <div className="pt-1">
              <span className="font-bold text-gray-900 block mb-1">Biometrics:</span>
              <div className="pl-4 space-y-1">
                <div>
                  <span className="font-bold text-gray-900">Biometrics Number:</span>{" "}
                  <span className="font-mono text-xs">{selectedApp.biometricsNumber || '—'}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Date of Biometrics Enrolment:</span>{" "}
                  <span>{selectedApp.biometricsDate || '—'}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Expiry Date:</span>{" "}
                  <span>{selectedApp.biometricsExpiry || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Details About Your Application Status */}
      <div className="mb-10 text-[14px]">
        <h2 className="text-[22px] font-bold mb-2 text-[#333]">Details about your application status</h2>
        <p className="text-gray-700 mb-6 font-normal leading-relaxed">
          When we get your application, there are a series of steps it may go through before we make a decision. Use the following table to find out the current status of each application step.
        </p>

        <div className="mt-4">
          {renderStep(
            "Review of eligibility",
            selectedApp.stages?.eligibilityStatus || "We are reviewing whether you meet the eligibility requirements.",
            selectedApp.stages?.eligibilityDate,
            <FileText className="w-7 h-7" />
          )}
          {renderStep(
            "Review of medical results",
            selectedApp.stages?.medicalStatus || "You do not need a medical exam. We will send you a message if this changes.",
            selectedApp.stages?.medicalDate,
            <Activity className="w-7 h-7" />
          )}
          {renderStep(
            "Review of additional documents",
            selectedApp.stages?.additionalDocsStatus || "We do not need additional documents.",
            selectedApp.stages?.additionalDocsDate,
            <Files className="w-7 h-7" />
          )}
          {renderStep(
            "Interview",
            selectedApp.stages?.interviewStatus || "You do not need an interview. We will send you a message if this changes.",
            selectedApp.stages?.interviewDate,
            <Users className="w-7 h-7" />
          )}
          {renderStep(
            "Biometrics",
            selectedApp.stages?.biometricsStatus || "We do not need your fingerprints. We will send you a message if this changes.",
            selectedApp.stages?.biometricsDate,
            <Fingerprint className="w-7 h-7" />
          )}
          {renderStep(
            "Background check",
            selectedApp.stages?.backgroundStatus || "Not applicable.",
            selectedApp.stages?.backgroundDate,
            <UserCheck className="w-7 h-7" />
          )}
          {renderStep(
            "Final decision",
            selectedApp.stages?.finalDecisionStatus || "Your application is in progress. We will send you a message once a final decision has been made.",
            selectedApp.stages?.finalDecisionDate,
            <Scale className="w-7 h-7" />
          )}
        </div>
      </div>

      {/* 4. Document Status Section */}
      <div className="mb-10 text-[14px]">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[22px] font-bold text-[#333]">Document Status</h2>
          <span className="w-4 h-4 rounded-full bg-[#2572b5] text-white flex items-center justify-center text-[10px] font-bold cursor-pointer select-none" title="Help">?</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px] border border-gray-300 rounded-none">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-gray-300 text-gray-800">
                <th className="py-2 px-3 border-r border-gray-300 font-bold leading-tight">Name</th>
                <th className="py-2 px-3 border-r border-gray-300 font-bold leading-tight w-28">Unique Client Identifier (UCI)</th>
                <th className="py-2 px-3 border-r border-gray-300 font-bold leading-tight">Document</th>
                <th className="py-2 px-3 border-r border-gray-300 font-bold leading-tight">Document number</th>
                <th className="py-2 px-3 border-r border-gray-300 font-bold leading-tight">Status</th>
                <th className="py-2 px-3 border-r border-gray-300 font-bold leading-tight">Expiry date</th>
                <th className="py-2 px-3 border-r border-gray-300 font-bold leading-tight">Status Updated Date</th>
                <th className="py-2 px-3 border-r border-gray-300 font-bold leading-tight">Travel document Number</th>
                <th className="py-2 px-3 font-bold leading-tight">Country of Issue</th>
              </tr>
            </thead>
            <tbody>
              {selectedApp.documentStatuses && selectedApp.documentStatuses.length > 0 ? (
                selectedApp.documentStatuses.map((doc, idx) => (
                  <tr key={doc.id || idx} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-2.5 px-3 border-r border-gray-300 font-bold text-[#333] uppercase">{doc.name}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 font-mono text-xs">{doc.uci || selectedApp.uci || '—'}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 text-gray-800">{doc.documentType || '—'}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 font-mono text-xs font-semibold">{doc.documentNumber || '—'}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 font-semibold text-gray-800">{doc.status || '—'}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300">{doc.expiryDate || '—'}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300">{doc.statusUpdatedDate || '—'}</td>
                    <td className="py-2.5 px-3 border-r border-gray-300 font-mono text-xs">{doc.travelDocumentNumber || '—'}</td>
                    <td className="py-2.5 px-3 text-gray-800">{doc.countryOfIssue || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-4 px-3 text-gray-500 italic text-center">No document records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Messages about your application */}
      <div className="mb-10 text-[14px]">
        <h2 className="text-[22px] font-bold mb-4 text-[#333]">Messages about your application</h2>
        
        {/* Help Banner */}
        <div className="bg-[#f5f5f5] border-l-4 border-[#269abc] p-3 mb-6 flex items-start gap-3 rounded-none">
          <Info className="w-5 h-5 text-[#269abc] flex-shrink-0 mt-0.5" />
          <p className="text-gray-800 leading-normal font-normal">
            Links and document titles are shown in the language you chose for your portal account when they were generated.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <label htmlFor="search-messages" className="font-bold text-[#333]">Search:</label>
            <input 
              id="search-messages"
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-400 px-2 py-1 bg-white text-[13px] focus:outline-none focus:border-[#2572b5] rounded-none"
            />
          </div>
          <div className="text-gray-700 text-[13px]">
            Showing {filteredMessages.length > 0 ? 1 : 0} to {filteredMessages.length} of {filteredMessages.length} entries 
            <span className="mx-2">|</span> 
            Show{" "}
            <select className="border border-gray-300 rounded-none px-1 py-0.5 bg-white font-medium" defaultValue="10">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>{" "}
            entries
          </div>
        </div>

        {/* Messages table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13.5px] border border-gray-300 rounded-none">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-gray-300 text-gray-800">
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold">
                  <span className="flex items-center justify-between">
                    Subject <span className="text-gray-400 select-none">⇅</span>
                  </span>
                </th>
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold bg-[#ebebeb]">
                  <span className="flex items-center justify-between">
                    Date sent <span className="text-gray-600 select-none">↓</span>
                  </span>
                </th>
                <th className="py-2.5 px-3 font-bold">
                  <span className="flex items-center justify-between">
                    Date read <span className="text-gray-400 select-none">⇅</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg, idx) => (
                  <tr key={msg.id || idx} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-2.5 px-3 border-r border-gray-300 font-normal">
                      <span 
                        className="text-blue-700 underline cursor-pointer hover:text-blue-900 font-medium" 
                        onClick={() => setSelectedMessage(msg)}
                      >
                        {msg.subject}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 font-normal">{msg.date}</td>
                    <td className="py-2.5 px-3 font-normal">{msg.dateRead || msg.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 px-3 text-gray-500 italic text-center">No messages matching search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
