import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Clock, Hourglass, Circle, Info } from 'lucide-react';

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, applications } = useApp();

  const safeApplications = Array.isArray(applications) ? applications : [];
  const selectedApp = safeApplications.find(a => a.id === id);

  const [selectedMessage, setSelectedMessage] = React.useState<any>(null);

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

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-grow font-sans text-[#333]">
      
      {/* 1. Breadcrumb Navigation */}
      <div className="text-[#284162] text-sm mb-6 font-medium">
        <span className="underline cursor-pointer" onClick={() => navigate('/')}>Home</span> 
        <span className="no-underline text-black px-2">&gt;</span> 
        <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Your Account</span>
        <span className="no-underline text-black px-2">&gt;</span> Application Details
      </div>

      <div className="border-b-2 border-[#26374a] pb-2 mb-4">
        <h1 className="text-[32px] font-bold text-[#333] mb-2">Application details</h1>
        <p className="text-[16px]">Check the status, review the details and read messages about your application.</p>
      </div>
      
      {/* 2. Applicant Information */}
      <h2 className="text-xl font-bold mb-4 mt-8">Applicant information</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse text-[14px]">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-2 font-bold w-1/4">Full name</td>
              <td className="py-2 px-2 w-1/4 uppercase">{user?.name || 'Applicant Name'}</td>
              <td className="py-2 px-2 font-bold w-1/4">Last updated</td>
              <td className="py-2 px-2 w-1/4">{selectedApp.timeline?.[0]?.date?.split(' ')[0] || selectedApp.dateCreated?.split(' ')[0] || 'N/A'}</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="py-2 px-2 font-bold">Application number</td>
              <td className="py-2 px-2">{selectedApp.id}</td>
              <td className="py-2 px-2 font-bold">Current status</td>
              <td className="py-2 px-2">{selectedApp.status || 'Submitted'}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-2 font-bold">Application type</td>
              <td className="py-2 px-2">{selectedApp.type || 'N/A'}</td>
              <td className="py-2 px-2 font-bold">Submitted location</td>
              <td className="py-2 px-2">Online</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="py-2 px-2 font-bold">Date created</td>
              <td className="py-2 px-2">{user?.createdAt?.split(' ')[0] || selectedApp.dateCreated?.split(' ')[0] || 'N/A'}</td>
              <td className="py-2 px-2 font-bold">Visa office</td>
              <td className="py-2 px-2">CPC-Ottawa</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-2 font-bold">Date submitted</td>
              <td className="py-2 px-2">{selectedApp.dateCreated?.split(' ')[0] || 'N/A'}</td>
              <td className="py-2 px-2 font-bold">Payment status</td>
              <td className="py-2 px-2">Paid in full</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Details About Your Application */}
      <h2 className="text-xl font-bold mb-4">Details about your application</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="border-t-2 border-b-2 border-gray-300 text-gray-900">
              <th className="py-2.5 px-3 font-bold">Application step</th>
              <th className="py-2.5 px-3 font-bold text-center w-40">Status</th>
              <th className="py-2.5 px-3 font-bold">Date updated</th>
              <th className="py-2.5 px-3 font-bold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {selectedApp.requestedDocuments && selectedApp.requestedDocuments.length > 0 ? (
              selectedApp.requestedDocuments.map((doc, idx) => {
                let displayStatus = 'Requested';
                if (doc.status === 'Submitted') {
                  displayStatus = 'Pending';
                } else if (doc.status === 'Received') {
                  displayStatus = 'Completed';
                }
                return (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="py-2.5 px-3 font-medium">{doc.name}</td>
                    <td className="py-2.5 px-3 text-center w-40">
                      <div className="flex items-center justify-center">
                        {getStatusIcon(displayStatus)}
                        <span className="font-medium">{displayStatus}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">{doc.dateUpdated || selectedApp.lastUpdated || 'N/A'}</td>
                    <td className="py-2.5 px-3">{doc.remarks || `The administrator requires your ${doc.name} to continue processing.`}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-6 px-3 text-gray-500 italic text-center">
                  No steps or documents have been requested by the administrator yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Uploaded Documents */}
      <h2 className="text-xl font-bold mb-4">Documents</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="border-t-2 border-b-2 border-gray-300 text-gray-900">
              <th className="py-2.5 px-3 font-bold">Document Name</th>
              <th className="py-2.5 px-3 font-bold">Upload Date</th>
              <th className="py-2.5 px-3 font-bold">File Type</th>
              <th className="py-2.5 px-3 font-bold">Download</th>
            </tr>
          </thead>
          <tbody>
            {selectedApp.documents && selectedApp.documents.length > 0 ? (
              selectedApp.documents.map((doc, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="py-2.5 px-3">{doc.name}</td>
                  <td className="py-2.5 px-3">{doc.date || '—'}</td>
                  <td className="py-2.5 px-3">PDF</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[#333] underline cursor-pointer font-bold">Download</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-3 text-gray-500 italic">No documents found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 6. Messages */}
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      <div className="overflow-x-auto mb-2">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="border-t-2 border-b-2 border-gray-300 text-gray-900">
              <th className="py-2.5 px-3 font-bold">Date</th>
              <th className="py-2.5 px-3 font-bold">Subject</th>
              <th className="py-2.5 px-3 font-bold">Message Preview</th>
              <th className="py-2.5 px-3 font-bold">Read Status</th>
            </tr>
          </thead>
          <tbody>
            {selectedApp.messages && selectedApp.messages.length > 0 ? (
              selectedApp.messages.map((msg, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="py-2.5 px-3">{msg.date}</td>
                  <td className="py-2.5 px-3 font-bold text-[#333] underline cursor-pointer" onClick={() => setSelectedMessage(msg)}>{msg.subject}</td>
                  <td className="py-2.5 px-3">
                    <div className="truncate w-64 text-gray-700">
                      {msg.content.replace(/<[^>]+>/g, '').substring(0, 50)}...
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-medium">
                    {msg.isRead ? 'Read' : 'Unread'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-3 text-gray-500 italic">No messages found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mb-8">
        <span className="text-[#284162] underline cursor-pointer text-sm">View all messages</span>
      </div>

      {/* 8. Next Required Action */}
      <h2 className="text-xl font-bold mb-4">Next required action</h2>
      <div className="border border-gray-300 mb-8 flex flex-col sm:flex-row p-4 bg-gray-50">
        <div className="flex-shrink-0 mr-4 mb-4 sm:mb-0 mt-1">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
            <Info className="text-gray-700 w-8 h-8" />
          </div>
        </div>
        <div className="text-[14px] flex-grow">
          {selectedApp.requestedDocuments && selectedApp.requestedDocuments.filter(d => d.status === 'Pending').length > 0 ? (
            <div>
              <p className="font-bold text-[16px] mb-2 text-[#333]">Action is required from you at this time.</p>
              <p className="mb-4">Please upload the following required documents directly here to submit them to the visa officer:</p>
              
              <div className="space-y-4">
                {selectedApp.requestedDocuments.filter(d => d.status === 'Pending').map((doc, idx) => (
                  <div key={idx} className="border border-gray-300 bg-white p-4 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-bold text-[#333]">{doc.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{doc.remarks || 'Upload your file as requested by the visa office.'}</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <input 
                        type="file" 
                        id={`file-input-${idx}`} 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleUserUploadDoc(doc.name, e.target.files[0]);
                          }
                        }}
                      />
                      <button
                        onClick={() => document.getElementById(`file-input-${idx}`)?.click()}
                        className="bg-white border border-gray-400 text-gray-800 hover:bg-gray-100 px-3 py-1.5 font-bold transition duration-200 text-xs flex items-center gap-1.5 whitespace-nowrap"
                      >
                        Choose File & Submit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="font-bold text-[16px] mb-1 text-[#333]">No action is required from you at this time.</p>
              <p>We will contact you if we need more information or if further actions are required.</p>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
