import { useState, useEffect } from 'react';
import { useApp, ApplicationInfo } from '../context/AppContext';

export default function AdminDashboard() {
  const { currentLang, user } = useApp();
  const [allApplications, setAllApplications] = useState<{email: string, app: ApplicationInfo}[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  
  // Document upload state
  const [docName, setDocName] = useState('');
  
  // Email state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/applications')
      .then(res => res.json())
      .then(data => {
        setAllApplications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (email: string, appId: string, newStatus: ApplicationInfo['status']) => {
    let statusFr: ApplicationInfo['statusFr'] = 'En cours';
    if (newStatus === 'Received') statusFr = 'Reçu';
    if (newStatus === 'Approved') statusFr = 'Approuvé';
    if (newStatus === 'Action Required') statusFr = 'Action requise';

    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status: newStatus, statusFr })
      });
      if (res.ok) {
        const updated = await res.json();
        setAllApplications(prev => prev.map(item => item.app.id === appId ? { email, app: updated } : item));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !selectedUserEmail || !docName) return;

    const targetAppItem = allApplications.find(a => a.app.id === selectedAppId);
    if (!targetAppItem) return;
    
    const targetApp = targetAppItem.app;
    const now = new Date();
    const newDoc = {
      name: docName,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString()
    };

    const updatedDocs = [...(targetApp.documents || []), newDoc];

    try {
      const res = await fetch(`/api/applications/${selectedAppId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedUserEmail, documents: updatedDocs })
      });
      if (res.ok) {
        const updated = await res.json();
        setAllApplications(prev => prev.map(item => item.app.id === selectedAppId ? { email: selectedUserEmail, app: updated } : item));
        setDocName('');
        alert("Document uploaded successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserEmail || !emailSubject || !emailText) return;

    setEmailLoading(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedUserEmail,
          subject: emailSubject,
          text: emailText
        })
      });
      
      if (res.ok) {
        setEmailSuccess(true);
        setEmailSubject('');
        setEmailText('');
        setTimeout(() => setEmailSuccess(false), 3000);
      } else {
        alert("Failed to send email");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to send email");
    } finally {
      setEmailLoading(false);
    }
  };

  if (user?.email !== 'admin@canada.ca') {
    return (
      <main className="mx-auto max-w-6xl w-full px-4 py-8">
        <h1 className="text-xl font-bold">Unauthorized / Non autorisé</h1>
        <p>You must log in as admin@canada.ca to view this page.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 space-y-8 font-sans text-[#333]">
      <h1 className="text-3xl font-bold border-b border-gray-300 pb-2">Admin Dashboard</h1>

      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <div className="space-y-6">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 border-r border-gray-300 font-bold">ID</th>
                <th className="p-3 border-r border-gray-300 font-bold">User Email</th>
                <th className="p-3 border-r border-gray-300 font-bold">Type</th>
                <th className="p-3 border-r border-gray-300 font-bold">Status</th>
                <th className="p-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allApplications.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300 font-mono text-sm">{item.app.id}</td>
                  <td className="p-3 border-r border-gray-300">{item.email}</td>
                  <td className="p-3 border-r border-gray-300">{item.app.type}</td>
                  <td className="p-3 border-r border-gray-300">
                    <select 
                      value={item.app.status}
                      onChange={(e) => handleStatusChange(item.email, item.app.id, e.target.value as any)}
                      className="border border-gray-400 p-1"
                    >
                      <option value="Received">Received</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Action Required">Action Required</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </td>
                  <td className="p-3 space-x-2">
                    <button 
                      onClick={() => { setSelectedAppId(item.app.id); setSelectedUserEmail(item.email); }}
                      className="bg-[#26374a] text-white px-3 py-1 text-sm font-bold border border-[#26374a]"
                    >
                      Manage Docs / Email
                    </button>
                  </td>
                </tr>
              ))}
              {allApplications.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {selectedAppId && selectedUserEmail && (
            <div className="border border-gray-400 p-6 space-y-6">
              <h2 className="text-xl font-bold">Manage Application: {selectedAppId} ({selectedUserEmail})</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Document Upload */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b border-gray-300 pb-1">Upload Document</h3>
                  <form onSubmit={handleUploadDoc} className="space-y-3">
                    <div>
                      <label className="block text-sm font-bold mb-1">Document Name</label>
                      <input 
                        type="text" 
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className="w-full border border-gray-400 p-2"
                        placeholder="e.g. Approved_Visa_Letter.pdf"
                        required
                      />
                    </div>
                    <button type="submit" className="bg-[#26374a] text-white font-bold px-4 py-2 border border-[#26374a]">
                      Upload
                    </button>
                  </form>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-bold text-sm">Existing Documents:</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {allApplications.find(a => a.app.id === selectedAppId)?.app.documents?.map((doc, idx) => (
                        <li key={idx}>
                          {doc.name} (Uploaded: {doc.date} at {doc.time})
                        </li>
                      )) || <li className="text-gray-500 italic">No documents uploaded yet.</li>}
                    </ul>
                  </div>
                </div>

                {/* Email Sender */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b border-gray-300 pb-1">Send Email to User</h3>
                  {emailSuccess && <div className="bg-green-100 border border-green-400 text-green-700 p-2 font-bold text-sm">Email sent successfully!</div>}
                  <form onSubmit={handleSendEmail} className="space-y-3">
                    <div>
                      <label className="block text-sm font-bold mb-1">Subject</label>
                      <input 
                        type="text" 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full border border-gray-400 p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Message</label>
                      <textarea 
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        className="w-full border border-gray-400 p-2 h-24"
                        required
                      />
                    </div>
                    <button type="submit" disabled={emailLoading} className="bg-[#26374a] text-white font-bold px-4 py-2 border border-[#26374a] disabled:opacity-50">
                      {emailLoading ? 'Sending...' : 'Send Email'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
