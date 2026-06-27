import React, { useState, useEffect } from 'react';
import { useApp, ApplicationInfo, TimelineEvent, IMMIGRATION_JOURNEY_STEPS } from '../context/AppContext';

export default function AdminDashboard() {
  const { currentLang, user } = useApp();
  const [allApplications, setAllApplications] = useState<{email: string, app: ApplicationInfo}[]>([]);
  const [allUsers, setAllUsers] = useState<{email: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'profiles' | 'applications'>('profiles');
  const [selectedProfileEmail, setSelectedProfileEmail] = useState<string | null>(null);

  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState('Custom Document');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  // New App Form
  const [newAppEmail, setNewAppEmail] = useState('');
  const [newAppType, setNewAppType] = useState('Work Permit');

  // New Profile Form
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileEmail, setNewProfileEmail] = useState('');
  const [newProfileAppType, setNewProfileAppType] = useState('Work Permit');

  const [subStatusEdits, setSubStatusEdits] = useState<Record<string, string>>({});

  const fetchApps = () => {
    Promise.all([
      fetch('/api/admin/applications').then(res => res.json()),
      fetch('/api/admin/users').then(res => res.json())
    ])
      .then(([appsData, usersData]) => {
        setAllApplications(appsData);
        setAllUsers(usersData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileEmail || !newProfileName) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newProfileEmail, name: newProfileName, appType: newProfileAppType })
      });
      if (res.ok) {
        alert("Applicant profile created successfully! Application created.");
        setNewProfileEmail('');
        setNewProfileName('');
        fetchApps();
      } else {
        alert("Failed to create profile.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendEmailNotification = async (to: string, subject: string, text: string) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, text })
      });
    } catch (e) {
      console.error("Email failed:", e);
    }
  };

  const handleUpdateApp = async (email: string, appId: string, updates: Partial<ApplicationInfo>, actionDesc: string) => {
    const targetAppItem = allApplications.find(a => a.app.id === appId);
    if (!targetAppItem) return;
    
    const now = new Date();
    const newTimelineEvent: TimelineEvent = {
      id: `evt-${Date.now()}`,
      date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      action: actionDesc
    };

    const currentTimeline = targetAppItem.app.timeline || [];
    
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          ...updates,
          timeline: [newTimelineEvent, ...currentTimeline]
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setAllApplications(prev => prev.map(item => item.app.id === appId ? { email, app: updated } : item));
        
        // Notify user via email
        sendEmailNotification(email, `Application Update: ${appId}`, `Your application has been updated: ${actionDesc}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!window.confirm(`Are you sure you want to completely delete the profile for ${email}? This action cannot be undone and will delete all their applications.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${email}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("User profile deleted.");
        if (selectedProfileEmail === email) {
          setSelectedProfileEmail(null);
        }
        fetchApps();
      } else {
        alert("Failed to delete user profile.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting profile.");
    }
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppEmail || !newAppType) return;
    
    const newApp: ApplicationInfo = {
      id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
      type: newAppType,
      typeFr: newAppType,
      status: IMMIGRATION_JOURNEY_STEPS[0],
      statusFr: 'Consultation initiale',
      lastUpdated: new Date().toISOString().split('T')[0],
      details: 'Application created by administration.',
      detailsFr: 'Demande créée par l\'administration.',
      documents: [],
      timeline: [{
        id: `evt-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: 'Application Profile Created'
      }]
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAppEmail, application: newApp })
      });
      if (res.ok) {
        fetchApps();
        setNewAppEmail('');
        alert("Application profile created successfully.");
        sendEmailNotification(newAppEmail, "New Application Profile Created", `An application profile (${newApp.id}) has been created for you.`);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !selectedUserEmail || !docName || !docCategory) return;

    const targetAppItem = allApplications.find(a => a.app.id === selectedAppId);
    if (!targetAppItem) return;
    
    const targetApp = targetAppItem.app;
    const now = new Date();
    const newDoc = {
      name: docName,
      category: docCategory,
      date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedDocs = [newDoc, ...(targetApp.documents || [])];

    const newTimelineEvent: TimelineEvent = {
      id: `evt-${Date.now()}`,
      date: newDoc.date,
      time: newDoc.time,
      action: `${docCategory} Uploaded`,
      documentName: docName
    };

    const currentTimeline = targetApp.timeline || [];

    try {
      const res = await fetch(`/api/applications/${selectedAppId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: selectedUserEmail, 
          documents: updatedDocs,
          timeline: [newTimelineEvent, ...currentTimeline]
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setAllApplications(prev => prev.map(item => item.app.id === selectedAppId ? { email: selectedUserEmail, app: updated } : item));
        setDocName('');
        alert("Document uploaded successfully");
        sendEmailNotification(selectedUserEmail, "New Document Uploaded", `A new document (${docName}) has been uploaded to your application ${selectedAppId}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserEmail || !emailSubject || !emailText) return;

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedUserEmail,
          subject: emailSubject,
          text: emailText
        })
      });
      
      setEmailSuccess(true);
      setEmailSubject('');
      setEmailText('');
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Failed to send email");
    }
  };

  if (user?.email?.toLowerCase() !== 'admin@canada.ca') {
    return (
      <main className="mx-auto max-w-6xl w-full px-4 py-8">
        <h1 className="text-xl font-bold">Unauthorized</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 space-y-8 font-sans text-[#333]">
      <h1 className="text-3xl font-bold border-b border-gray-300 pb-2">Immigration Case Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-6 border border-gray-300">
          <h2 className="text-xl font-bold mb-4">1. Create Applicant Profile</h2>
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Applicant Name</label>
              <input 
                type="text" 
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                className="w-full border border-gray-400 p-2"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Applicant Email (Used for Sign In)</label>
              <input 
                type="email" 
                value={newProfileEmail}
                onChange={e => setNewProfileEmail(e.target.value)}
                className="w-full border border-gray-400 p-2"
                placeholder="name@domain.ca"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Initial Application Type</label>
              <select 
                value={newProfileAppType}
                onChange={e => setNewProfileAppType(e.target.value)}
                className="w-full border border-gray-400 p-2"
              >
                <option value="Work Permit">Work Permit</option>
                <option value="Visitor Visa">Visitor Visa</option>
                <option value="Study Permit">Study Permit</option>
                <option value="Permanent Residence">Permanent Residence</option>
                <option value="Citizenship">Citizenship</option>
                <option value="Passport">Passport</option>
                <option value="Biometrics">Biometrics</option>
              </select>
            </div>
            <button type="submit" className="bg-[#26374a] text-white px-4 py-2 font-bold hover:bg-[#111820] w-full">
              Create Profile
            </button>
            <p className="text-xs text-gray-600 mt-2">After creating, provide the email and password to the user.</p>
          </form>
        </div>

        <div className="bg-gray-100 p-6 border border-gray-300">
          <h2 className="text-xl font-bold mb-4">2. Create New Application Record</h2>
          <form onSubmit={handleCreateApp} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Assign to Email</label>
              <input 
                type="email" 
                value={newAppEmail}
                onChange={e => setNewAppEmail(e.target.value)}
                className="w-full border border-gray-400 p-2"
                placeholder="Must match an existing profile"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Application Type</label>
              <select 
                value={newAppType}
                onChange={e => setNewAppType(e.target.value)}
                className="w-full border border-gray-400 p-2"
              >
                <option value="Work Permit">Work Permit</option>
                <option value="Study Permit">Study Permit</option>
                <option value="Visitor Visa">Visitor Visa</option>
                <option value="Express Entry">Express Entry</option>
              </select>
            </div>
            <button type="submit" className="bg-[#26374a] text-white px-4 py-2 font-bold hover:bg-[#111820] w-full">
              Create Application Record
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-4 border-b border-gray-300">
            <button 
              onClick={() => { setViewMode('profiles'); setSelectedAppId(null); }} 
              className={`pb-2 px-2 font-bold ${viewMode === 'profiles' ? 'border-b-4 border-[#26374a] text-[#26374a]' : 'text-gray-500 hover:text-black'}`}
            >
              Applicant Profiles
            </button>
            <button 
              onClick={() => { setViewMode('applications'); setSelectedAppId(null); setSelectedProfileEmail(null); }} 
              className={`pb-2 px-2 font-bold ${viewMode === 'applications' ? 'border-b-4 border-[#26374a] text-[#26374a]' : 'text-gray-500 hover:text-black'}`}
            >
              All Applications
            </button>
          </div>

          {viewMode === 'profiles' && !selectedProfileEmail && (
            <div>
              <h2 className="text-xl font-bold mb-4">Applicant Profiles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allUsers.map(userItem => (
                  <div key={userItem.email} className="bg-white p-5 border border-gray-300 hover:border-[#26374a] hover:shadow-sm flex flex-col justify-between">
                    <div onClick={() => setSelectedProfileEmail(userItem.email)} className="cursor-pointer">
                      <div className="font-bold text-lg break-all">{userItem.name}</div>
                      <div className="text-sm text-gray-600 break-all">{userItem.email}</div>
                      <div className="text-sm font-bold text-[#26374a] mt-2">
                        Applications: {allApplications.filter(a => a.email === userItem.email).length}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteUser(userItem.email); }}
                        className="text-red-600 hover:text-red-800 text-sm font-bold"
                      >
                        Delete Profile
                      </button>
                    </div>
                  </div>
                ))}
                {allUsers.length === 0 && (
                   <p className="text-gray-500 italic">No profiles created yet.</p>
                )}
              </div>
            </div>
          )}

          {viewMode === 'profiles' && selectedProfileEmail && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-100 p-4 border border-gray-300">
                <h2 className="text-xl font-bold break-all">Profile: {selectedProfileEmail}</h2>
                <button onClick={() => setSelectedProfileEmail(null)} className="text-sm font-bold text-[#26374a] hover:underline whitespace-nowrap ml-4">
                  &larr; Back to Profiles
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Applications / Records for this Profile</h3>
                {allApplications.filter(a => a.email === selectedProfileEmail).map((item) => (
                  <div key={item.app.id} className="bg-white border border-gray-300 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="font-bold text-lg">{item.app.type}</div>
                      <div className="text-sm text-gray-600">ID: {item.app.id} &bull; Status: {item.app.status}</div>
                    </div>
                    <button 
                      onClick={() => { setViewMode('applications'); setSelectedAppId(item.app.id); setSelectedUserEmail(item.email); setSubStatusEdits({}); }}
                      className="bg-[#26374a] hover:bg-[#111820] text-white px-4 py-2 font-bold text-sm whitespace-nowrap"
                    >
                      Manage File
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'applications' && (
            <div>
              <h2 className="text-xl font-bold mb-4">All Applications</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-300 min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-200 border-b border-gray-400">
                      <th className="p-3 border-r border-gray-300 font-bold">App ID</th>
                      <th className="p-3 border-r border-gray-300 font-bold">Applicant Email</th>
                      <th className="p-3 border-r border-gray-300 font-bold">Type</th>
                      <th className="p-3 border-r border-gray-300 font-bold">Overall Status</th>
                      <th className="p-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allApplications.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="p-3 border-r border-gray-300">{item.app.id}</td>
                        <td className="p-3 border-r border-gray-300 break-all">{item.email}</td>
                        <td className="p-3 border-r border-gray-300">{item.app.type}</td>
                        <td className="p-3 border-r border-gray-300">
                          <select 
                            value={item.app.status}
                            onChange={(e) => handleUpdateApp(item.email, item.app.id, { status: e.target.value }, `Application Progress Updated to: ${e.target.value}`)}
                            className="border border-gray-400 p-1 w-full max-w-[200px]"
                          >
                            <option value="Pending">Pending</option>
                            {IMMIGRATION_JOURNEY_STEPS.map(step => (
                              <option key={step} value={step}>{step}</option>
                            ))}
                            <option value="Approved">Approved</option>
                            <option value="Refused">Refused</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <button 
                            onClick={() => { setSelectedAppId(item.app.id); setSelectedUserEmail(item.email); setSubStatusEdits({}); }}
                            className="bg-[#26374a] hover:bg-[#111820] text-white px-3 py-1 font-bold whitespace-nowrap"
                          >
                            Manage File
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedAppId && selectedUserEmail && (
            <div className="border border-gray-400 p-6 space-y-8 bg-gray-50 mt-8">
              <h2 className="text-2xl font-bold border-b border-gray-300 pb-2">
                Managing: {selectedAppId} ({selectedUserEmail})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Specific Status Updates */}
                <div className="space-y-4 bg-white p-4 border border-gray-300">
                  <h3 className="font-bold text-lg border-b border-gray-300 pb-1">Sub-Statuses</h3>
                  
                  {['workPermitStatus', 'visitorVisaStatus', 'studyPermitStatus', 'passportRequestStatus', 'medicalRequestStatus', 'biometricStatus'].map((statusKey) => {
                    const originalVal = allApplications.find(a => a.app.id === selectedAppId)?.app[statusKey as keyof ApplicationInfo] as string || '';
                    const currentVal = subStatusEdits[statusKey] !== undefined ? subStatusEdits[statusKey] : originalVal;
                    const label = statusKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <div key={statusKey} className="flex justify-between items-center">
                        <label className="text-sm font-bold w-1/2">{label}</label>
                        <select 
                          value={currentVal}
                          onChange={(e) => setSubStatusEdits({ ...subStatusEdits, [statusKey]: e.target.value })}
                          className="w-1/2 border border-gray-400 p-1 text-sm"
                        >
                          <option value="">-- Not Set --</option>
                          <option value="Requested">Requested</option>
                          <option value="Completed">Completed</option>
                          <option value="Approved">Approved</option>
                          <option value="Refused">Refused</option>
                        </select>
                      </div>
                    );
                  })}
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        Object.keys(subStatusEdits).forEach(key => {
                          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                          handleUpdateApp(selectedUserEmail, selectedAppId, { [key]: subStatusEdits[key] }, `${label} Updated to ${subStatusEdits[key] || 'None'}`);
                        });
                        setSubStatusEdits({});
                        alert("Sub-statuses saved.");
                      }}
                      disabled={Object.keys(subStatusEdits).length === 0}
                      className="w-full bg-[#26374a] hover:bg-[#111820] disabled:bg-gray-400 text-white px-4 py-2 font-bold text-sm"
                    >
                      Save Sub-Statuses
                    </button>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-4 bg-white p-4 border border-gray-300">
                  <h3 className="font-bold text-lg border-b border-gray-300 pb-1">Upload Document</h3>
                  <form onSubmit={handleUploadDoc} className="space-y-3">
                    <div>
                      <label className="block text-sm font-bold mb-1">Document Category</label>
                      <select 
                        value={docCategory}
                        onChange={(e) => setDocCategory(e.target.value)}
                        className="w-full border border-gray-400 p-2"
                      >
                        <option value="Custom Document">Custom Document</option>
                        <option value="Passport">Passport</option>
                        <option value="Passport Bio Data Page">Passport Bio Data Page</option>
                        <option value="Passport Request Letter">Passport Request Letter</option>
                        <option value="Work Permit Letter">Work Permit Letter</option>
                        <option value="Visitor Visa Documents">Visitor Visa Documents</option>
                        <option value="Study Permit Documents">Study Permit Documents</option>
                        <option value="Biometrics Instruction Letter (BIL)">Biometrics Instruction Letter (BIL)</option>
                        <option value="Biometrics Confirmation">Biometrics Confirmation</option>
                        <option value="Medical Request Letter">Medical Request Letter</option>
                        <option value="Medical Results">Medical Results</option>
                        <option value="IELTS Test Report">IELTS Test Report</option>
                        <option value="Educational Certificates">Educational Certificates</option>
                        <option value="Police Clearance Certificate">Police Clearance Certificate</option>
                        <option value="Proof of Funds">Proof of Funds</option>
                        <option value="Employment Letter">Employment Letter</option>
                        <option value="Invitation Letter">Invitation Letter</option>
                        <option value="Marriage Certificate">Marriage Certificate</option>
                        <option value="Birth Certificate">Birth Certificate</option>
                        <option value="Additional Supporting Documents">Additional Supporting Documents</option>
                        <option value="Approval Letter">Approval Letter</option>
                        <option value="Refusal Letter">Refusal Letter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Filename (e.g. letter.pdf)</label>
                      <input 
                        type="text" 
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className="w-full border border-gray-400 p-2"
                        required
                      />
                    </div>
                    <button type="submit" className="bg-[#26374a] text-white font-bold px-4 py-2 hover:bg-[#111820]">
                      Upload to Applicant
                    </button>
                  </form>
                </div>

                {/* Email Sender */}
                <div className="space-y-4 bg-white p-4 border border-gray-300">
                  <h3 className="font-bold text-lg border-b border-gray-300 pb-1">Send Follow-up Email</h3>
                  {emailSuccess && <div className="bg-green-100 border border-green-400 text-green-700 p-2 font-bold text-sm">Email sent!</div>}
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
                    <button type="submit" className="bg-[#26374a] text-white font-bold px-4 py-2 hover:bg-[#111820]">
                      Send Email
                    </button>
                  </form>
                </div>
                
                {/* Notes & Next Action */}
                <div className="space-y-4 bg-white p-4 border border-gray-300">
                  <h3 className="font-bold text-lg border-b border-gray-300 pb-1">Update Notes / Next Action</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;
                    handleUpdateApp(selectedUserEmail, selectedAppId, { details: notes, detailsFr: notes }, `Notes Updated: ${notes.substring(0,20)}...`);
                    form.reset();
                  }} className="space-y-3">
                    <textarea 
                      name="notes"
                      className="w-full border border-gray-400 p-2 h-24"
                      placeholder="Enter next required action or note..."
                      required
                    />
                    <button type="submit" className="bg-[#26374a] text-white font-bold px-4 py-2 hover:bg-[#111820]">
                      Save Note
                    </button>
                  </form>
                </div>

              </div>
              
              {/* Timeline Preview */}
              <div className="bg-white p-4 border border-gray-300">
                <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4">Application Timeline</h3>
                <div className="space-y-4">
                  {(allApplications.find(a => a.app.id === selectedAppId)?.app.timeline || []).map((evt, idx) => (
                    <div key={idx} className="border-l-4 border-[#26374a] pl-4 py-1">
                      <div className="text-sm font-bold text-gray-800">{evt.date} - {evt.time}</div>
                      <div className="text-base text-black mt-1">{evt.action}</div>
                      {evt.documentName && <div className="text-sm text-gray-600 mt-1">File: {evt.documentName}</div>}
                    </div>
                  ))}
                  {!(allApplications.find(a => a.app.id === selectedAppId)?.app.timeline?.length) && (
                    <p className="text-sm text-gray-500 italic">No timeline events yet.</p>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </main>
  );
}
