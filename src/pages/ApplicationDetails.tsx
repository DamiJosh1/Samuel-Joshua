import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

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
        <div className="text-[#26374a] text-[13px] mb-8">
          <span className="underline cursor-pointer" onClick={() => navigate('/')}>Home</span> 
          <span className="no-underline text-black px-1">&gt;</span> 
          <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Your Account</span>
          <span className="no-underline text-black px-1">&gt;</span> 
          <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Applications Submitted</span>
          <span className="no-underline text-black px-1">&gt;</span> Application Details
        </div>
        <h1 className="text-3xl font-bold mb-4">Application Not Found</h1>
        <p>The application you are looking for does not exist or you do not have permission to view it.</p>
      </main>
    );
  }

  if (selectedMessage) {
    return (
      <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-grow font-sans text-[#333]">
        <div className="text-[13px] mb-8 text-[#26374a]">
          <span className="underline cursor-pointer" onClick={() => navigate('/')}>Home</span> 
          <span className="no-underline text-black px-1">&gt;</span> 
          <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Your Account</span>
          <span className="no-underline text-black px-1">&gt;</span> 
          <span className="underline cursor-pointer" onClick={() => setSelectedMessage(null)}>Application Details</span>
          <span className="no-underline text-black px-1">&gt;</span> Message
        </div>
        <h1 className="text-3xl font-bold mb-6 text-[#333]">{selectedMessage.subject}</h1>
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

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-grow font-sans text-[#333]">
      
      {/* 1. Breadcrumb Navigation */}
      <div className="text-[13px] mb-8 text-[#26374a]">
        <span className="underline cursor-pointer" onClick={() => navigate('/')}>Home</span> 
        <span className="no-underline text-black px-1">&gt;</span> 
        <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Your Account</span>
        <span className="no-underline text-black px-1">&gt;</span> 
        <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Applications Submitted</span>
        <span className="no-underline text-black px-1">&gt;</span> Application Details
      </div>

      <h1 className="text-3xl font-medium mb-6">Application Details</h1>
      
      {/* 2. Applicant Information */}
      <div className="mb-8 border-b-2 border-[#26374a] pb-2">
        <h2 className="text-xl font-bold">Applicant Information</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] mb-8">
        <div>
          <div className="font-bold">Full Name</div>
          <div>{user?.name || 'Applicant Name'}</div>
        </div>
        <div>
          <div className="font-bold">Application Number</div>
          <div>{selectedApp.id}</div>
        </div>
        <div>
          <div className="font-bold">Application Type</div>
          <div>{selectedApp.type || 'N/A'}</div>
        </div>
        <div>
          <div className="font-bold">Account Created Date</div>
          <div>{user?.createdAt?.split(' ')[0] || 'N/A'}</div>
        </div>
        <div>
          <div className="font-bold">Account Created Time</div>
          <div>{user?.createdAt?.split(' ')[1] || 'N/A'}</div>
        </div>
        <div>
          <div className="font-bold">Application Submitted Date</div>
          <div>{selectedApp.dateCreated?.split(' ')[0] || 'N/A'}</div>
        </div>
        <div>
          <div className="font-bold">Application Submitted Time</div>
          <div>{selectedApp.dateCreated?.split(' ')[1] || 'N/A'}</div>
        </div>
        <div>
          <div className="font-bold">Last Updated</div>
          <div>{selectedApp.timeline?.[0]?.date || selectedApp.dateCreated}</div>
        </div>
        <div>
          <div className="font-bold">Current Status</div>
          <div>{selectedApp.status || 'Submitted'}</div>
        </div>
      </div>

      {/* 3. Application Summary */}
      <div className="mb-8 border-b-2 border-[#26374a] pb-2">
        <h2 className="text-xl font-bold">Application Summary</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] mb-8">
        <div>
          <div className="font-bold">Application Type</div>
          <div>{selectedApp.type || 'N/A'}</div>
        </div>
        <div>
          <div className="font-bold">Current Processing Stage</div>
          <div>{selectedApp.status || 'Processing'}</div>
        </div>
        <div>
          <div className="font-bold">Current Status</div>
          <div>{selectedApp.status || 'In Progress'}</div>
        </div>
        <div>
          <div className="font-bold">Estimated Next Step</div>
          <div>Wait for processing updates.</div>
        </div>
        <div>
          <div className="font-bold">Number of Uploaded Documents</div>
          <div>{selectedApp.documents?.length || 0}</div>
        </div>
        <div>
          <div className="font-bold">Number of Unread Messages</div>
          <div>{selectedApp.messages?.filter(m => !m.isRead).length || 0}</div>
        </div>
      </div>

      {/* 4. Details About Your Application */}
      <div className="mb-8 border-b-2 border-[#26374a] pb-2">
        <h2 className="text-xl font-bold">Details About Your Application</h2>
      </div>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse text-[13px] border-t-2 border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-800">
              <th className="py-2 px-3 font-bold border-r border-gray-300">Processing Step</th>
              <th className="py-2 px-3 font-bold border-r border-gray-300">Current Status</th>
              <th className="py-2 px-3 font-bold border-r border-gray-300">Date Updated</th>
              <th className="py-2 px-3 font-bold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 border-r border-gray-300">Eligibility Review</td>
              <td className="py-2 px-3 border-r border-gray-300">{selectedApp.status || 'In Progress'}</td>
              <td className="py-2 px-3 border-r border-gray-300">{selectedApp.dateCreated}</td>
              <td className="py-2 px-3">We are reviewing whether you meet the eligibility requirements.</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="py-2 px-3 border-r border-gray-300">Medical Results</td>
              <td className="py-2 px-3 border-r border-gray-300">{selectedApp.medicalRequestStatus || 'Not Started'}</td>
              <td className="py-2 px-3 border-r border-gray-300">-</td>
              <td className="py-2 px-3">You do not need a medical exam. We will send you a message if this changes.</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 border-r border-gray-300">Passport Request</td>
              <td className="py-2 px-3 border-r border-gray-300">{selectedApp.passportRequestStatus || 'Not Started'}</td>
              <td className="py-2 px-3 border-r border-gray-300">-</td>
              <td className="py-2 px-3">We will send you a message if we need your passport.</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="py-2 px-3 border-r border-gray-300">Additional Documents</td>
              <td className="py-2 px-3 border-r border-gray-300">Not Started</td>
              <td className="py-2 px-3 border-r border-gray-300">-</td>
              <td className="py-2 px-3">We do not need additional documents.</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 border-r border-gray-300">Interview</td>
              <td className="py-2 px-3 border-r border-gray-300">Not Started</td>
              <td className="py-2 px-3 border-r border-gray-300">-</td>
              <td className="py-2 px-3">You do not need an interview. We will send you a message if this changes.</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="py-2 px-3 border-r border-gray-300">Biometrics</td>
              <td className="py-2 px-3 border-r border-gray-300">{selectedApp.biometricStatus || 'Not Started'}</td>
              <td className="py-2 px-3 border-r border-gray-300">-</td>
              <td className="py-2 px-3">We do not need your fingerprints. We will send you a message if this changes.</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 border-r border-gray-300">Background Verification</td>
              <td className="py-2 px-3 border-r border-gray-300">{selectedApp.status || 'In Progress'}</td>
              <td className="py-2 px-3 border-r border-gray-300">{selectedApp.dateCreated}</td>
              <td className="py-2 px-3">We are processing your background check. We will send you a message if we need more information.</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="py-2 px-3 border-r border-gray-300">Final Decision</td>
              <td className="py-2 px-3 border-r border-gray-300">{selectedApp.status === 'Approved' || selectedApp.status === 'Refused' ? 'Completed' : 'Pending'}</td>
              <td className="py-2 px-3 border-r border-gray-300">-</td>
              <td className="py-2 px-3">Your application is in progress. We will send you a message once the final decision has been made.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. Uploaded Documents */}
      <div className="mb-8 border-b-2 border-[#26374a] pb-2">
        <h2 className="text-xl font-bold">Uploaded Documents</h2>
      </div>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse text-[13px] border-t-2 border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-800">
              <th className="py-2 px-3 font-bold border-r border-gray-300">Document Name</th>
              <th className="py-2 px-3 font-bold border-r border-gray-300">Upload Date</th>
              <th className="py-2 px-3 font-bold border-r border-gray-300">Upload Time</th>
              <th className="py-2 px-3 font-bold border-r border-gray-300">File Type</th>
              <th className="py-2 px-3 font-bold">Download</th>
            </tr>
          </thead>
          <tbody>
            {selectedApp.documents && selectedApp.documents.length > 0 ? (
              selectedApp.documents.map((doc, idx) => (
                <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-2 px-3 border-r border-gray-300">{doc.name}</td>
                  <td className="py-2 px-3 border-r border-gray-300">{doc.date || 'N/A'}</td>
                  <td className="py-2 px-3 border-r border-gray-300">{doc.time || 'N/A'}</td>
                  <td className="py-2 px-3 border-r border-gray-300">PDF</td>
                  <td className="py-2 px-3 text-[#26374a] underline cursor-pointer">Download</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500 italic">No documents found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 6. Messages */}
      <div className="mb-8 border-b-2 border-[#26374a] pb-2">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse text-[13px] border-t-2 border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-800">
              <th className="py-2 px-3 font-bold border-r border-gray-300">Date</th>
              <th className="py-2 px-3 font-bold border-r border-gray-300">Subject</th>
              <th className="py-2 px-3 font-bold border-r border-gray-300">Status</th>
              <th className="py-2 px-3 font-bold">View Message</th>
            </tr>
          </thead>
          <tbody>
            {selectedApp.messages && selectedApp.messages.length > 0 ? (
              selectedApp.messages.map((msg, idx) => (
                <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-2 px-3 border-r border-gray-300">{msg.date}</td>
                  <td className="py-2 px-3 border-r border-gray-300">{msg.subject}</td>
                  <td className="py-2 px-3 border-r border-gray-300">{msg.isRead ? 'Read' : 'Unread'}</td>
                  <td 
                    className="py-2 px-3 text-[#26374a] underline cursor-pointer"
                    onClick={() => setSelectedMessage(msg)}
                  >
                    View Message
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500 italic">No messages found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 7. Activity History */}
      <div className="mb-8 border-b-2 border-[#26374a] pb-2">
        <h2 className="text-xl font-bold">Activity History</h2>
      </div>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse text-[13px] border-t-2 border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-800">
              <th className="py-2 px-3 font-bold border-r border-gray-300">Date</th>
              <th className="py-2 px-3 font-bold border-r border-gray-300">Time</th>
              <th className="py-2 px-3 font-bold border-r border-gray-300">Activity</th>
              <th className="py-2 px-3 font-bold">Current Status</th>
            </tr>
          </thead>
          <tbody>
            {selectedApp.timeline && selectedApp.timeline.length > 0 ? (
              selectedApp.timeline.map((evt, idx) => {
                const dateParts = evt.date.split(' ');
                const activityDate = dateParts[0];
                const activityTime = dateParts[1] || 'N/A';
                return (
                  <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-2 px-3 border-r border-gray-300">{activityDate}</td>
                    <td className="py-2 px-3 border-r border-gray-300">{activityTime}</td>
                    <td className="py-2 px-3 border-r border-gray-300">{evt.title}</td>
                    <td className="py-2 px-3">{evt.status || 'Completed'}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500 italic">No activity history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 8. Next Required Action */}
      <div className="mb-8 border-b-2 border-[#26374a] pb-2">
        <h2 className="text-xl font-bold">Next Required Action</h2>
      </div>
      <div className="text-[13px] mb-8">
        {selectedApp.requestedDocuments && selectedApp.requestedDocuments.filter(d => d.status === 'Pending').length > 0 ? (
          <div>
            <p className="mb-2"><strong>Upload additional documents:</strong></p>
            <ul className="list-disc pl-5">
              {selectedApp.requestedDocuments.filter(d => d.status === 'Pending').map((doc, idx) => (
                <li key={idx}>{doc.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Wait for processing.</p>
        )}
      </div>

      {/* Return to Dashboard */}
      <div className="mt-8 mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-gray-200 text-black px-4 py-2 border border-gray-400 hover:bg-gray-300 font-bold text-[13px]"
        >
          Return to Your Account
        </button>
      </div>

    </main>
  );
}
