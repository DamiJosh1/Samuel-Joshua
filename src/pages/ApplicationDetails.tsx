import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Clock, Hourglass, Circle, Info, FileText, Activity, Files, Users, Fingerprint, UserCheck, Scale, HelpCircle, X, AlertTriangle } from 'lucide-react';

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, applications, logout } = useApp();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  const safeApplications = Array.isArray(applications) ? applications : [];
  const selectedApp = safeApplications.find(a => a.id === id);

  const [selectedMessage, setSelectedMessage] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortField, setSortField] = React.useState<string>('date');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = React.useState(10);

  const formatSubmittedDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (/[a-zA-Z]/.test(dateStr)) {
      return dateStr;
    }
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const dateObj = new Date(year, month, day);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
      }
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  };

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

  const handleSelectMessage = async (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      const today = new Date();
      const dateReadStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const updatedMessages = (selectedApp.messages || []).map(m => 
        m.id === msg.id ? { ...m, isRead: true, dateRead: dateReadStr } : m
      );
      try {
        await fetch(`/api/applications/${selectedApp.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email || 'applicant@domain.ca',
            messages: updatedMessages
          })
        });
      } catch (e) {
        console.error("Failed to mark message as read:", e);
      }
    }
  };

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

  const parseDate = (dateStr: string) => {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const sortedMessages = React.useMemo(() => {
    return [...filteredMessages].sort((a, b) => {
      let valA = '';
      let valB = '';

      if (sortField === 'subject') {
        valA = a.subject || '';
        valB = b.subject || '';
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortField === 'date') {
        const timeA = parseDate(a.date);
        const timeB = parseDate(b.date);
        return sortDir === 'asc' ? timeA - timeB : timeB - timeA;
      } else if (sortField === 'dateRead') {
        const readA = !a.isRead ? 'New Message' : (a.dateRead || a.date || '');
        const readB = !b.isRead ? 'New Message' : (b.dateRead || b.date || '');
        if (readA === 'New Message' && readB !== 'New Message') return sortDir === 'asc' ? -1 : 1;
        if (readA !== 'New Message' && readB === 'New Message') return sortDir === 'asc' ? 1 : -1;
        const timeA = parseDate(readA);
        const timeB = parseDate(readB);
        return sortDir === 'asc' ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });
  }, [filteredMessages, sortField, sortDir]);

  const paginatedMessages = React.useMemo(() => {
    return sortedMessages.slice(0, pageSize);
  }, [sortedMessages, pageSize]);

  const unreadCount = (selectedApp.messages || []).filter(msg => !msg.isRead).length;
  const userName = (user?.name || 'TESTIMONY ABIOLA NASIRU').toUpperCase();

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-4 flex-grow font-sans text-[#333]">
      
      {/* Top User Menu */}
      <div className="flex justify-end items-center text-[13.5px] mt-2 mb-10">
        <div className="flex flex-wrap items-center text-[14px] text-[#333] justify-end w-full">
          <span className="mr-8">Signed in as {userName}</span>
          <span className="text-[#8A2BE2] underline cursor-pointer hover:text-[#551A8B] font-normal" onClick={() => navigate('/dashboard')}>Account home</span>
          <span className="text-[#333] px-1.5">|</span>
          <span className="text-[#8A2BE2] underline cursor-pointer hover:text-[#551A8B] font-normal" onClick={() => navigate('/dashboard')}>Account profile</span>
          <span className="text-[#333] px-1.5">|</span>
          <span className="text-[#005a00] underline cursor-pointer hover:text-[#004000] font-normal" onClick={() => navigate('/immigration-citizenship')}>Help</span>
          <span className="text-[#333] px-1.5">|</span>
          <span className="text-[#005a00] underline cursor-pointer hover:text-[#004000] font-normal" onClick={logout}>Logout</span>
        </div>
      </div>

      {/* Title Section */}
      <div className="border-b border-gray-300 pb-4 mb-4">
        <h1 className="text-[32px] font-normal text-[#333] mb-2 leading-snug">Application status and messages</h1>
        <p className="text-[14px] text-gray-700 leading-normal font-normal">
          Check the status, review the details and read messages for your application.{' '}
          <span 
            onClick={() => navigate(`/application/${selectedApp.id}/checklist`)}
            className="text-[#2572b4] underline font-normal cursor-pointer hover:text-[#05355c]"
          >
            View submitted application or upload documents
          </span>
          {selectedApp.requestedDocuments && selectedApp.requestedDocuments.length > 0 && (
            <span className="ml-1 text-gray-600 font-semibold">
              {' '}(Upload Status:{' '}
              {(() => {
                const pending = selectedApp.requestedDocuments.filter(d => d.status === 'Pending').length;
                const submitted = selectedApp.requestedDocuments.filter(d => d.status === 'Submitted').length;
                const received = selectedApp.requestedDocuments.filter(d => d.status === 'Received').length;
                
                if (pending > 0) {
                  return <span className="text-amber-700 font-bold">{pending} Pending Request(s)</span>;
                }
                if (submitted > 0) {
                  return <span className="text-[#2572b4] font-bold">{submitted} Submitted - Under Review</span>;
                }
                return <span className="text-green-700 font-bold">All Received & Approved</span>;
              })()}
              )
            </span>
          )}
        </p>
      </div>

      {/* Unread Message Notification Bar */}
      {unreadCount > 0 && (
        <div className="border-l-4 border-gray-400 pl-4 py-2 my-5 text-[14px] text-[#333] font-normal">
          You have <a href="#messages-table-section" className="text-[#2572b4] underline hover:text-[#05355c] font-normal">{unreadCount} unread message(s).</a>
        </div>
      )}

      {/* Requested Documents Action Required Alert */}
      {selectedApp.requestedDocuments && selectedApp.requestedDocuments.some(d => d.status === 'Pending') && (
        <div className="border-l-4 border-[#af3c43] pl-4 py-3 my-5 text-[14px] text-[#333] font-normal bg-red-50/20">
          <div className="font-bold text-[#af3c43] flex items-center gap-1.5 mb-1 text-[15px]">
            <AlertTriangle className="w-4 h-4" />
            Action Required: Additional Documents Requested
          </div>
          <p className="text-gray-700 leading-normal mb-2">
            The reviewing officer has requested additional documents to process your application. Please check your document checklist to see the requests and upload the required files.
          </p>
          <span 
            onClick={() => navigate(`/application/${selectedApp.id}/checklist`)}
            className="text-[#2572b4] font-bold underline cursor-pointer hover:text-[#05355c]"
          >
            Go to Document Checklist &rarr;
          </span>
        </div>
      )}

      {/* 2. Side-by-Side Status & Information panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-[14px]">
        {/* Application status Box */}
        <div className="border border-gray-300 rounded-none shadow-none bg-white overflow-hidden">
          <div className="bg-[#f5f5f5] px-4 py-2 border-b border-gray-300">
            <h2 className="font-bold text-[15px] text-gray-900">Application status</h2>
          </div>
          <div className="p-4">
            <p className="text-gray-800 font-normal leading-relaxed mb-4">
              {selectedApp.statusSummary || selectedApp.details || 'Your application is in progress. We will send you a message if we need more information or if further actions are required.'}
            </p>
            <div>
              <span className="font-bold text-gray-900 block mb-0.5">Latest update:</span>
              {(() => {
                let text = selectedApp.latestUpdate || 'Your application is in progress.';
                // Remove time component from the displayed latest update string
                text = text.replace(/\s+at\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm|a\.m\.|p\.m\.)?/i, '');
                text = text.replace(/\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm|a\.m\.|p\.m\.)?/i, '');

                let idx = text.indexOf(': ');
                if (idx === -1) {
                  for (let i = 0; i < text.length; i++) {
                    if (text[i] === ':') {
                      const isTime = i > 0 && i < text.length - 1 && /\d/.test(text[i - 1]) && /\d/.test(text[i + 1]);
                      if (!isTime) {
                        idx = i;
                        break;
                      }
                    }
                  }
                }
                if (idx !== -1) {
                  const prefix = text.slice(0, idx + 1);
                  const body = text.slice(idx + 1);
                  return (
                    <p className="text-gray-800 leading-relaxed font-normal">
                      <strong className="font-bold">{prefix}</strong>{body}
                    </p>
                  );
                }
                return (
                  <p className="text-gray-800 leading-relaxed font-normal">
                    {text}
                  </p>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Applicant information Box */}
        <div className="border border-gray-300 rounded-none shadow-none bg-white overflow-hidden">
          <div className="bg-[#f5f5f5] px-4 py-2 border-b border-gray-300">
            <h2 className="font-bold text-[15px] text-gray-900">Applicant information</h2>
          </div>
          <div className="p-4 text-gray-800 space-y-2 leading-normal">
            <div>
              <span className="font-bold text-gray-900">Principal Applicant:</span>{" "}
              <span className="uppercase">{selectedApp.fullName || user?.name || 'Applicant Name'}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">Unique Client Identifier (UCI):</span>{" "}
              <span>{selectedApp.uci || '—'}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">Application number:</span>{" "}
              <span className="app-number-font text-[16px]">{selectedApp.id}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">Date Received:</span>{" "}
              <span>{formatSubmittedDate(selectedApp.dateReceived || selectedApp.dateCreated || '') || '—'}</span>
            </div>

            {/* Structured exactly like the image template */}
            {(selectedApp.biometricsNumber || selectedApp.biometricsDate || selectedApp.biometricsExpiry) && (
              <div className="pt-0.5">
                <div className="font-bold text-gray-900">Biometrics:</div>
                <div className="pl-6 flex flex-col space-y-1 mt-1">
                  {selectedApp.biometricsNumber && (
                    <div>
                      <span className="font-bold text-gray-900">Biometrics Number:</span>{" "}
                      <span>{selectedApp.biometricsNumber}</span>
                    </div>
                  )}
                  {selectedApp.biometricsDate && (
                    <div>
                      <span className="font-bold text-gray-900">Date of Biometrics Enrolment:</span>{" "}
                      <span>{selectedApp.biometricsDate}</span>
                    </div>
                  )}
                  {selectedApp.biometricsExpiry && (
                    <div>
                      <span className="font-bold text-gray-900">Expiry Date:</span>{" "}
                      <span>{selectedApp.biometricsExpiry}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Details About Your Application Status */}
      <div className="mb-10 text-[14px]">
        <h2 className="text-[22px] font-bold mb-2 text-[#333]">Details about your application status</h2>
        <p className="text-gray-700 mb-6 font-normal leading-relaxed">
          When we get your application, there are a series of steps it may go through before we make a decision. Use the following table to find out the current status of each application step.
        </p>

        <div className="mt-4 border-t border-gray-200">
          {renderStep(
            "Review of eligibility",
            selectedApp.stages?.eligibilityStatus || "We are reviewing whether you meet the eligibility requirements.",
            selectedApp.stages?.eligibilityDate,
            <FileText className="w-7 h-7 text-gray-600" />
          )}
          {renderStep(
            "Review of medical results",
            selectedApp.stages?.medicalStatus || "You do not need a medical exam. We will send you a message if this changes.",
            selectedApp.stages?.medicalDate,
            <Activity className="w-7 h-7 text-gray-600" />
          )}
          {renderStep(
            "Review of additional documents",
            selectedApp.stages?.additionalDocsStatus || (() => {
              const reqs = selectedApp.requestedDocuments || [];
              if (reqs.length === 0) {
                return "We do not need additional documents.";
              }
              const pending = reqs.filter(d => d.status === 'Pending').length;
              const submitted = reqs.filter(d => d.status === 'Submitted').length;
              const received = reqs.filter(d => d.status === 'Received').length;

              if (pending > 0) {
                return `We have requested additional documents. Action Required: Please upload the required documents.`;
              }
              if (submitted > 0) {
                return `We are reviewing the additional documents you submitted.`;
              }
              if (received > 0) {
                return `We have received and approved your additional documents.`;
              }
              return "We do not need additional documents.";
            })(),
            selectedApp.stages?.additionalDocsDate || (() => {
              const reqs = selectedApp.requestedDocuments || [];
              const dates = reqs.map(d => d.dateUpdated).filter(Boolean);
              return dates.length > 0 ? dates[dates.length - 1] : undefined;
            })(),
            <Files className="w-7 h-7 text-gray-600" />
          )}
          {renderStep(
            "Interview",
            selectedApp.stages?.interviewStatus || "You do not need an interview. We will send you a message if this changes.",
            selectedApp.stages?.interviewDate,
            <Users className="w-7 h-7 text-gray-600" />
          )}
          {renderStep(
            "Biometrics",
            selectedApp.stages?.biometricsStatus || "We do not need your fingerprints. We will send you a message if this changes.",
            selectedApp.stages?.biometricsDate,
            <Fingerprint className="w-7 h-7 text-gray-600" />
          )}
          {renderStep(
            "Background check",
            selectedApp.stages?.backgroundStatus || "Not applicable.",
            selectedApp.stages?.backgroundDate,
            <UserCheck className="w-7 h-7 text-gray-600" />
          )}
          {renderStep(
            "Final decision",
            selectedApp.stages?.finalDecisionStatus || "Your application is in progress. We will send you a message once a final decision has been made.",
            selectedApp.stages?.finalDecisionDate,
            <Scale className="w-7 h-7 text-gray-600" />
          )}
        </div>
      </div>

      {/* 4. Document Status Section */}
      {(selectedApp.showDocumentStatus || (selectedApp.documentStatuses && selectedApp.documentStatuses.length > 0)) && (
        <div className="mb-10 text-[14px]">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[22px] font-bold text-[#333]">Document Status</h2>
            <span className="w-4 h-4 rounded-full bg-[#2572b5] text-white flex items-center justify-center text-[10px] font-bold cursor-pointer select-none" title="Help">?</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px] border border-gray-300 rounded-none min-w-[1200px]">
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
      )}

      {/* 5. Messages about your application */}
      <div className="mb-10 text-[14px]" id="messages-table-section">
        <h2 className="text-[32px] font-normal mb-2 text-[#333]">Messages about your application</h2>
        
        {/* Help Banner */}
        <div className="flex items-start mb-6 mt-2" id="messages-help-banner">
          <div className="flex flex-col items-center flex-shrink-0 mr-3 mt-1" style={{ width: '20px' }}>
            <div className="w-[4px] h-[15px] bg-[#007da3] mb-[2px] rounded-t-[1px]"></div>
            <div className="w-[18px] h-[18px] rounded-full bg-[#007da3] text-white flex items-center justify-center text-[11px] font-bold select-none font-sans leading-none pl-[0.5px]">i</div>
          </div>
          <p className="text-gray-900 leading-normal font-sans text-[15px] font-normal pt-[1px]">
            Links and document titles are shown in the language you chose for your portal account when they were generated.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-[14px] text-gray-900 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-bold">Search:</span>
            <input 
              id="search-messages"
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-900 px-2 py-0.5 w-[150px] sm:w-[220px] bg-white text-[14px] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 font-normal text-gray-900">
            <span>Showing 1 to {paginatedMessages.length} of {paginatedMessages.length} entries</span>
            <span className="text-gray-300 font-light mx-2">|</span>
            <span>Show</span>
            <select 
              value={pageSize} 
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-gray-400 rounded-none px-1 py-0.5 bg-white font-normal"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* Messages table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px] border-t border-b border-gray-400 rounded-none">
            <thead>
              <tr className="border-b border-gray-400 text-gray-800">
                <th 
                  onClick={() => {
                    if (sortField === 'subject') {
                      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('subject');
                      setSortDir('desc');
                    }
                  }}
                  className={`py-2 px-3 font-bold cursor-pointer select-none text-[14px] ${sortField === 'subject' ? 'bg-[#ebebeb] text-gray-900' : 'bg-white text-gray-800'}`}
                >
                  <span className="flex items-center justify-start gap-1">
                    Subject <span className="text-gray-400 font-light text-[11px]">{sortField === 'subject' ? (sortDir === 'desc' ? '↓' : '↑') : '↓↑'}</span>
                  </span>
                </th>
                <th 
                  onClick={() => {
                    if (sortField === 'date') {
                      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('date');
                      setSortDir('desc');
                    }
                  }}
                  className={`py-2 px-3 font-bold cursor-pointer select-none text-[14px] ${sortField === 'date' ? 'bg-[#ebebeb] text-gray-900' : 'bg-white text-gray-800'}`}
                >
                  <span className="flex items-center justify-start gap-1">
                    Date sent <span className="text-gray-700 font-bold text-[11px]">{sortField === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : '↓↑'}</span>
                  </span>
                </th>
                <th 
                  onClick={() => {
                    if (sortField === 'dateRead') {
                      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('dateRead');
                      setSortDir('desc');
                    }
                  }}
                  className={`py-2 px-3 font-bold cursor-pointer select-none text-[14px] ${sortField === 'dateRead' ? 'bg-[#ebebeb] text-gray-900' : 'bg-white text-gray-800'}`}
                >
                  <span className="flex items-center justify-start gap-1">
                    Date read <span className="text-gray-400 font-light text-[11px]">{sortField === 'dateRead' ? (sortDir === 'desc' ? '↓' : '↑') : '↓↑'}</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedMessages.length > 0 ? (
                paginatedMessages.map((msg, idx) => {
                  const isEven = idx % 2 === 1;
                  const getBg = (field: string) => {
                    if (sortField === field) {
                      return isEven ? 'bg-[#ebebeb]' : 'bg-[#f1f1f1]';
                    }
                    return isEven ? 'bg-[#f9f9f9]' : 'bg-white';
                  };
                  return (
                    <tr key={msg.id || idx} className="border-b border-gray-200 hover:bg-gray-50/50">
                      <td className={`py-2.5 px-3 font-normal ${getBg('subject')}`}>
                        <span 
                          className="text-[#2572b4] underline cursor-pointer hover:text-[#05355c] font-normal" 
                          onClick={() => handleSelectMessage(msg)}
                        >
                          {msg.subject}
                        </span>
                      </td>
                      <td className={`py-2.5 px-3 font-normal ${getBg('date')}`}>{msg.date}</td>
                      <td className={`py-2.5 px-3 font-normal text-[#333] ${getBg('dateRead')}`}>
                        {!msg.isRead ? (
                          <span className="font-semibold text-gray-900">New Message</span>
                        ) : (
                          msg.dateRead || msg.date
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 px-3 text-gray-500 italic text-center bg-white">No messages matching search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Center pagination box */}
        <div className="flex justify-center my-6">
          <button className="bg-[#2572b4] hover:bg-[#1a4e7b] text-white font-normal w-9 h-9 flex items-center justify-center rounded-[4px] text-[15px]">
            1
          </button>
        </div>

        {/* Small report problem block at bottom left */}
        <div className="mt-8">
          <button className="bg-[#eaebed] hover:bg-[#dcdee1] text-gray-800 px-4 py-2 border border-[#ccc] font-normal text-[14px] rounded-[4px] select-none cursor-pointer">
            Report a problem or mistake on this page
          </button>
        </div>

        {/* Date Modified Footer */}
        <div className="mt-12 text-[14px] text-gray-700 font-normal">
          Date modified: 2026-05-05
        </div>

      </div>

      {/* Message Modal Overlay */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto" 
          onClick={() => setSelectedMessage(null)}
          id="message-modal-overlay"
        >
          <div 
            className="bg-white w-full max-w-[620px] shadow-2xl relative flex flex-col my-auto rounded-[4px] overflow-hidden border border-gray-300"
            onClick={(e) => e.stopPropagation()}
            id="message-modal-container"
          >
            {/* Modal Header */}
            <div className="bg-[#2d5073] text-white px-5 py-4 flex items-start justify-between select-none">
              <span className="font-semibold text-[17px] sm:text-[18px] leading-snug select-text pr-6">
                {selectedMessage.subject}
              </span>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="text-white/90 hover:text-white focus:outline-none cursor-pointer mt-0.5 transition-colors"
                aria-label="Close"
                id="message-modal-close-button-header"
              >
                <X className="w-[18px] h-[18px] stroke-[2.5]" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[85vh] text-[#333333] text-[15.5px] leading-relaxed">
              {selectedMessage.subject === 'Confirmation of Online Application Transmission' ? (
                <div className="space-y-5 font-normal text-[#333333]">
                  <p>Hello,</p>
                  
                  <p>
                    You have successfully transmitted your Online Application on {selectedMessage.transmissionDate || '2 August 2023'} {selectedMessage.transmissionTime || '06:40:02 p.m.'} <span className="underline select-text decoration-dotted cursor-help" title="Eastern Daylight Time">{selectedMessage.transmissionTimezone || 'EDT'}</span>.
                  </p>
                  
                  <p>
                    Your payment receipt number is # <span className="underline font-normal text-[#2572b4] hover:text-[#05355c] cursor-pointer">{selectedMessage.receiptNumber || 'O689745557'}</span>.
                  </p>
                  
                  <div className="pt-1.5">
                    <h3 className="font-bold text-gray-900 text-[15.5px] mb-1">What happens next?</h3>
                    <p>We will review the information and documents that you provided and processing will begin.</p>
                  </div>
                  
                  <p>
                    We will notify you by e-mail if we require additional information or documents. You do not need to log into your account to check for messages or updates until you receive an e-mail advising you that you have one. .
                  </p>
                  
                  <div className="pt-1.5">
                    <h3 className="font-bold text-[#333333] text-[15.5px] mb-1">What if information regarding my application changes?</h3>
                    <p>
                      It is your responsibility to notify us of any changes to your application. Examples of changes include if you move, get a new phone number, etc.
                    </p>
                  </div>
                  
                  <div className="pt-1.5">
                    <h3 className="font-bold text-[#333333] text-[15.5px] mb-1">How long will it take to process my application?</h3>
                    <p>
                      Processing times vary. <span className="underline font-normal text-[#2572b4] hover:text-[#05355c] cursor-pointer">Find out what the average processing times are.</span>
                    </p>
                  </div>
                  
                  <p className="pt-1.5">
                    If you require additional information on the status of your application after consulting the processing times, contact the <span className="underline font-normal text-[#2572b4] hover:text-[#05355c] cursor-pointer">Call Centre.</span>
                  </p>
                </div>
              ) : (
                <div 
                  className="prose max-w-none text-[#333333] custom-message-content" 
                  dangerouslySetInnerHTML={{ __html: selectedMessage.content }} 
                />
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
