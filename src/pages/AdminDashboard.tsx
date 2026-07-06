import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, ApplicationInfo, TimelineEvent, IMMIGRATION_JOURNEY_STEPS } from '../context/AppContext';

export default function AdminDashboard() {
  const { currentLang, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.email.toLowerCase() !== 'admin@canada.ca') {
      navigate('/auth/login');
    }
  }, [user, navigate]);
  const [allApplications, setAllApplications] = useState<{email: string, app: ApplicationInfo}[]>([]);
  const [allUsers, setAllUsers] = useState<{email: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'profiles' | 'applications'>('profiles');
  const [selectedProfileEmail, setSelectedProfileEmail] = useState<string | null>(null);

  // Layout states for split-screen / side-by-side editing on desktop and tabbed case views
  const [caseTab, setCaseTab] = useState<'profile' | 'stages' | 'docs' | 'messages'>('profile');
  const [showSidebar, setShowSidebar] = useState(true);

  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState('Custom Document');
  const [selectedPredefinedDoc, setSelectedPredefinedDoc] = useState('ielts certificate');
  const [customRequestedDocName, setCustomRequestedDocName] = useState('ielts certificate');
  const [emailSubject, setEmailSubject] = useState('please submit your original passport.');
  const [emailText, setEmailText] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  // New App Form
  const [newAppEmail, setNewAppEmail] = useState('');
  const [newAppType, setNewAppType] = useState('Work Permit');

  // New Profile Form
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileEmail, setNewProfileEmail] = useState('');
  const [newProfileAppType, setNewProfileAppType] = useState('Online Application');
  const [newProfileAppNumber, setNewProfileAppNumber] = useState('');
  const [newProfileUci, setNewProfileUci] = useState('');
  const [newProfileDateCreated, setNewProfileDateCreated] = useState('');
  const [newProfileDateSubmitted, setNewProfileDateSubmitted] = useState('');
  const [newProfileStatus, setNewProfileStatus] = useState('Submitted');

  // Selected Application Editing States
  const [editFullName, setEditFullName] = useState('');
  const [editUci, setEditUci] = useState('');
  const [editDateReceived, setEditDateReceived] = useState('');
  const [editDateSubmitted, setEditDateSubmitted] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editAppType, setEditAppType] = useState('Work Permit');
  const [editBiometricsNumber, setEditBiometricsNumber] = useState('');
  const [editBiometricsDate, setEditBiometricsDate] = useState('');
  const [editBiometricsExpiry, setEditBiometricsExpiry] = useState('');

  // Confirmation message editing states
  const [confirmDate, setConfirmDate] = useState('');
  const [confirmTime, setConfirmTime] = useState('');
  const [confirmTimezone, setConfirmTimezone] = useState('');
  const [confirmReceiptNumber, setConfirmReceiptNumber] = useState('');
  
  const [editStatusSummary, setEditStatusSummary] = useState('');
  const [editLatestUpdate, setEditLatestUpdate] = useState('');
  const [editShowDocumentStatus, setEditShowDocumentStatus] = useState(false);

  // 7 Stages Edit States
  const [stageEligibilityStatus, setStageEligibilityStatus] = useState('');
  const [stageEligibilityDesc, setStageEligibilityDesc] = useState('');
  const [stageEligibilityDate, setStageEligibilityDate] = useState('');

  const [stageMedicalStatus, setStageMedicalStatus] = useState('');
  const [stageMedicalDesc, setStageMedicalDesc] = useState('');
  const [stageMedicalDate, setStageMedicalDate] = useState('');

  const [stageAdditionalDocsStatus, setStageAdditionalDocsStatus] = useState('');
  const [stageAdditionalDocsDesc, setStageAdditionalDocsDesc] = useState('');
  const [stageAdditionalDocsDate, setStageAdditionalDocsDate] = useState('');

  const [stageInterviewStatus, setStageInterviewStatus] = useState('');
  const [stageInterviewDesc, setStageInterviewDesc] = useState('');
  const [stageInterviewDate, setStageInterviewDate] = useState('');

  const [stageBiometricsStatus, setStageBiometricsStatus] = useState('');
  const [stageBiometricsDesc, setStageBiometricsDesc] = useState('');
  const [stageBiometricsDateState, setStageBiometricsDateState] = useState('');

  const [stageBackgroundStatus, setStageBackgroundStatus] = useState('');
  const [stageBackgroundDesc, setStageBackgroundDesc] = useState('');
  const [stageBackgroundDate, setStageBackgroundDate] = useState('');

  const [stageFinalDecisionStatus, setStageFinalDecisionStatus] = useState('');
  const [stageFinalDecisionDesc, setStageFinalDecisionDesc] = useState('');
  const [stageFinalDecisionDate, setStageFinalDecisionDate] = useState('');

  // New Document Status Table Row States
  const [newDocRowName, setNewDocRowName] = useState('');
  const [newDocRowUci, setNewDocRowUci] = useState('');
  const [newDocRowType, setNewDocRowType] = useState('');
  const [newDocRowNumber, setNewDocRowNumber] = useState('');
  const [newDocRowStatus, setNewDocRowStatus] = useState('');
  const [newDocRowExpiry, setNewDocRowExpiry] = useState('');
  const [newDocRowUpdated, setNewDocRowUpdated] = useState('');
  const [newDocRowTravelNum, setNewDocRowTravelNum] = useState('');
  const [newDocRowCountry, setNewDocRowCountry] = useState('');

  const [subStatusEdits, setSubStatusEdits] = useState<Record<string, string>>({});

  // Custom Timeline states
  const [customTimelineDate, setCustomTimelineDate] = useState('');
  const [customTimelineTime, setCustomTimelineTime] = useState('');
  const [customTimelineAction, setCustomTimelineAction] = useState('');

  // Standard document checklist state (which admin can remove items from)
  const [standardDocs, setStandardDocs] = useState<string[]>([
    "ielts certificate",
    "Proof of Funds"
  ]);

  // Editing requested document state
  const [editingDocName, setEditingDocName] = useState<string | null>(null);
  const [editRemarks, setEditRemarks] = useState('');
  const [editDateUpdated, setEditDateUpdated] = useState('');

  const handleRemoveStandardDoc = (docToRemove: string) => {
    setStandardDocs(prev => {
      const updated = prev.filter(d => d !== docToRemove);
      if (selectedPredefinedDoc === docToRemove) {
        if (updated.length > 0) {
          setSelectedPredefinedDoc(updated[0]);
          setCustomRequestedDocName(updated[0]);
        } else {
          setSelectedPredefinedDoc('Custom Document...');
          setCustomRequestedDocName('');
        }
      }
      return updated;
    });
  };

  const startEditingDoc = (doc: { name: string; status: string; dateUpdated?: string; remarks?: string }) => {
    setEditingDocName(doc.name);
    setEditRemarks(doc.remarks || '');
    if (doc.dateUpdated) {
      setEditDateUpdated(doc.dateUpdated);
    } else {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setEditDateUpdated(`${dateStr} at ${timeStr}`);
    }
  };

  const handleSaveDocEdits = async (email: string | null, appId: string | null, docName: string) => {
    if (!email || !appId) return;
    const targetAppItem = allApplications.find(a => a.app.id === appId);
    if (!targetAppItem) return;
    
    const targetApp = targetAppItem.app;
    const requested = targetApp.requestedDocuments || [];
    
    const updatedRequested = requested.map(d => d.name === docName ? { 
      ...d, 
      dateUpdated: editDateUpdated,
      remarks: editRemarks
    } : d);

    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          requestedDocuments: updatedRequested
        })
      });
      if (res.ok) {
        setAllApplications(prev => prev.map(item => item.app.id === appId ? { 
          email, 
          app: { ...item.app, requestedDocuments: updatedRequested } 
        } : item));
        setEditingDocName(null);
        alert("Document remarks and date/time updated successfully.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving document edits.");
    }
  };

  // Effect to populate states upon choosing an application
  useEffect(() => {
    if (!selectedAppId) return;
    setCaseTab('profile'); // Reset tab view when switching case files
    const item = allApplications.find(a => a.app.id === selectedAppId);
    if (item) {
      const app = item.app;
      setEditFullName(app.fullName || item.app.fullName || '');
      setEditUci(app.uci || '');
      setEditDateReceived(app.dateReceived || app.dateCreated || '');
      setEditDateSubmitted(app.dateSubmitted || '');
      setEditStatus(app.status || '');
      setEditAppType(app.type || 'Work Permit');
      setEditBiometricsNumber(app.biometricsNumber || '');
      setEditBiometricsDate(app.biometricsDate || '');
      setEditBiometricsExpiry(app.biometricsExpiry || '');

      // Populate confirmation message details
      const confirmMsg = app.messages?.find(m => m.subject === "Confirmation of Online Application Transmission");
      setConfirmDate(confirmMsg?.transmissionDate || '2 August 2023');
      setConfirmTime(confirmMsg?.transmissionTime || '06:40:02 p.m.');
      setConfirmTimezone(confirmMsg?.transmissionTimezone || 'EDT');
      setConfirmReceiptNumber(confirmMsg?.receiptNumber || 'O689745557');
      
      setEditStatusSummary(app.statusSummary || app.details || '');
      setEditLatestUpdate(app.latestUpdate || '');
      setEditShowDocumentStatus(!!app.showDocumentStatus);

      setStageEligibilityStatus(app.stages?.eligibilityStatus || '');
      setStageEligibilityDesc(app.stages?.eligibilityDesc || '');
      setStageEligibilityDate(app.stages?.eligibilityDate || '');

      setStageMedicalStatus(app.stages?.medicalStatus || '');
      setStageMedicalDesc(app.stages?.medicalDesc || '');
      setStageMedicalDate(app.stages?.medicalDate || '');

      setStageAdditionalDocsStatus(app.stages?.additionalDocsStatus || '');
      setStageAdditionalDocsDesc(app.stages?.additionalDocsDesc || '');
      setStageAdditionalDocsDate(app.stages?.additionalDocsDate || '');

      setStageInterviewStatus(app.stages?.interviewStatus || '');
      setStageInterviewDesc(app.stages?.interviewDesc || '');
      setStageInterviewDate(app.stages?.interviewDate || '');

      setStageBiometricsStatus(app.stages?.biometricsStatus || '');
      setStageBiometricsDesc(app.stages?.biometricsDesc || '');
      setStageBiometricsDateState(app.stages?.biometricsDate || '');

      setStageBackgroundStatus(app.stages?.backgroundStatus || '');
      setStageBackgroundDesc(app.stages?.backgroundDesc || '');
      setStageBackgroundDate(app.stages?.backgroundDate || '');

      setStageFinalDecisionStatus(app.stages?.finalDecisionStatus || '');
      setStageFinalDecisionDesc(app.stages?.finalDecisionDesc || '');
      setStageFinalDecisionDate(app.stages?.finalDecisionDate || '');

      setNewDocRowUci(app.uci || '');
    }
  }, [selectedAppId, allApplications]);

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
        body: JSON.stringify({ 
          email: newProfileEmail, 
          name: newProfileName, 
          appType: newProfileAppType,
          appNumber: newProfileAppNumber,
          uci: newProfileUci,
          dateCreated: newProfileDateCreated,
          dateSubmitted: newProfileDateSubmitted,
          status: newProfileStatus
        })
      });
      if (res.ok) {
        alert("Applicant profile created successfully! Application created.");
        setNewProfileEmail('');
        setNewProfileName('');
        setNewProfileAppNumber('');
        setNewProfileUci('');
        setNewProfileDateCreated('');
        setNewProfileDateSubmitted('');
        setNewProfileStatus('Submitted');
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

  const handleDeleteApplication = async (appId: string) => {
    if (!window.confirm(`Are you sure you want to delete application ${appId}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("Application deleted.");
        if (selectedAppId === appId) {
          setSelectedAppId(null);
          setSelectedUserEmail(null);
        }
        fetchApps();
      } else {
        alert("Failed to delete application.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting application.");
    }
  };

  const handleRequestDocument = async (email: string, appId: string, docName: string) => {
    const targetAppItem = allApplications.find(a => a.app.id === appId);
    if (!targetAppItem) return;
    
    const targetApp = targetAppItem.app;
    const requested = targetApp.requestedDocuments || [];
    
    if (requested.some(d => d.name === docName)) {
      alert("Document already requested.");
      return;
    }
    
    const newRequested = [...requested, { name: docName, status: 'Pending' as const }];
    
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          requestedDocuments: newRequested 
        })
      });
      if (res.ok) {
        setAllApplications(prev => prev.map(item => item.app.id === appId ? { 
          email, 
          app: { ...item.app, requestedDocuments: newRequested } 
        } : item));
        
        // Also send them a message
        const now = new Date();
        let subject = `Action Required: Please submit your ${docName}`;
        let content = `<p style="margin-bottom: 16px;">Dear Applicant,</p>
<p style="margin-bottom: 16px;">We are currently reviewing your application.</p>
<p style="margin-bottom: 16px;">In order to proceed to the next step, please provide the following document as soon as possible:<br/>- <strong>${docName}</strong></p>
<p style="margin-bottom: 16px;">You can upload this document or send it as instructed.</p>
<p style="margin-bottom: 0;">Thank you,<br/>Immigration, Refugees and Citizenship Canada</p>`;

        const lowerDoc = docName.toLowerCase();
        if (lowerDoc.includes('pof') || lowerDoc.includes('proof of funds')) {
          subject = `Action Required: Additional Proof of Funds (POF) Required`;
          content = `<p style="margin-bottom: 16px;">Dear Applicant,</p>
<p style="margin-bottom: 16px;">Your application is currently under review.</p>
<p style="margin-bottom: 16px;">To continue processing your application, additional proof of funds (POF) is required. Please provide a recent statement from a Canadian financial institution for a bank account held in your name. The account must be designated to receive salary payments from your prospective employer in Canada. The statement must clearly display your full name, the name of the financial institution, the account details, and recent account activity.</p>
<p style="margin-bottom: 16px;">Please submit the requested proof of funds by uploading it through your online account or by using the submission method specified in your request letter within the timeframe provided.</p>
<p style="margin-bottom: 16px;">Failure to provide the requested documentation within the specified period may result in delays in the processing of your application or a decision being made based on the information available on file.</p>
<p style="margin-bottom: 16px;">Sincerely,</p>
<p style="margin-bottom: 0;">Immigration, Refugees and Citizenship Canada (IRCC)</p>`;
        } else if (lowerDoc.includes('ielts')) {
          subject = `Action Required: IELTS Test Report Form Required`;
          content = `<p style="margin-bottom: 16px;">Dear Applicant,</p>
<p style="margin-bottom: 16px;">Your application is currently under review.</p>
<p style="margin-bottom: 16px;">To continue processing your application, we require proof of your English language proficiency. Please provide a copy of your valid International English Language Testing System (IELTS) Test Report Form (TRF).</p>
<p style="margin-bottom: 16px;">Please upload the requested document or send it as requested within the timeframe specified.</p>
<p style="margin-bottom: 16px;">Failure to provide the requested information or documentation within the required period may result in delays in the processing of your application or a decision being made based on the information currently available.</p>
<p style="margin-bottom: 16px;">Sincerely,</p>
<p style="margin-bottom: 0;">Immigration, Refugees and Citizenship Canada (IRCC).</p>`;
        }

        const newMessage = {
          id: `msg-${Date.now()}`,
          subject,
          date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          content,
          isRead: false
        };
        const currentMessages = targetApp.messages || [];
        await fetch(`/api/applications/${appId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            messages: [newMessage, ...currentMessages]
          })
        });
        
        setAllApplications(prev => prev.map(item => item.app.id === appId ? { 
          email, 
          app: { ...item.app, messages: [newMessage, ...currentMessages] } 
        } : item));
        
        alert(`Requested ${docName}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error requesting document.");
    }
  };

  const handleDeleteRequestedDocument = async (email: string, appId: string, docName: string) => {
    if (!window.confirm(`Are you sure you want to cancel the request for "${docName}"?`)) return;
    const targetAppItem = allApplications.find(a => a.app.id === appId);
    if (!targetAppItem) return;
    
    const targetApp = targetAppItem.app;
    const requested = targetApp.requestedDocuments || [];
    const updatedRequested = requested.filter(d => d.name !== docName);
    
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          requestedDocuments: updatedRequested 
        })
      });
      if (res.ok) {
        setAllApplications(prev => prev.map(item => item.app.id === appId ? { 
          email, 
          app: { ...item.app, requestedDocuments: updatedRequested } 
        } : item));
        alert(`Cancelled request for ${docName}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting requested document.");
    }
  };

  const handleUpdateRequestedDocStatus = async (email: string, appId: string, docName: string, newStatus: 'Pending' | 'Submitted' | 'Received') => {
    const targetAppItem = allApplications.find(a => a.app.id === appId);
    if (!targetAppItem) return;
    
    const targetApp = targetAppItem.app;
    const requested = targetApp.requestedDocuments || [];
    
    // Auto-update remarks and timeline when admin changes status
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    let statusTextForRemarks = '';
    let timelineTitle = '';
    if (newStatus === 'Pending') {
      statusTextForRemarks = `Document was requested by the visa officer on ${dateStr}.`;
      timelineTitle = `Requested document: ${docName}`;
    } else if (newStatus === 'Submitted') {
      statusTextForRemarks = `Document was submitted on ${dateStr}. Pending review.`;
      timelineTitle = `Submitted document: ${docName}`;
    } else if (newStatus === 'Received') {
      statusTextForRemarks = `Document was received and approved on ${dateStr}.`;
      timelineTitle = `Approved and received document: ${docName}`;
    }

    const updatedRequested = requested.map(d => d.name === docName ? { 
      ...d, 
      status: newStatus,
      dateUpdated: dateStr,
      remarks: statusTextForRemarks
    } : d);

    // Append a timeline event reflecting the change
    const newEvent = {
      id: `evt-${Date.now()}`,
      date: `${dateStr} ${timeStr}`,
      time: timeStr,
      title: timelineTitle,
      action: `Officer updated ${docName} status to ${newStatus}`,
      status: newStatus === 'Received' ? 'Completed' : (newStatus === 'Submitted' ? 'Pending Review' : 'Requested')
    };
    const updatedTimeline = [newEvent, ...(targetApp.timeline || [])];
    
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          requestedDocuments: updatedRequested,
          timeline: updatedTimeline
        })
      });
      if (res.ok) {
        setAllApplications(prev => prev.map(item => item.app.id === appId ? { 
          email, 
          app: { ...item.app, requestedDocuments: updatedRequested, timeline: updatedTimeline } 
        } : item));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppEmail || !newAppType) return;
    
    const newApp: ApplicationInfo = {
      id: "W" + Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join(""),
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
      // 1. Send the email via Resend (Nested try-catch to ensure failure doesn't block internal system messaging)
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
        if (!res.ok) {
          console.warn("Resend endpoint returned non-OK response status");
        }
      } catch (err) {
        console.warn("External email deliverability failed, falling back to internal system delivery:", err);
      }
      
      // 2. Add it to the user's internal messages
      const targetAppItem = allApplications.find(a => a.app.id === selectedAppId);
      if (targetAppItem) {
        const targetApp = targetAppItem.app;
        const now = new Date();
        const newMessage = {
          id: `msg-${Date.now()}`,
          subject: emailSubject,
          date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          content: `<p>${emailText.replace(/\n/g, '<br/>')}</p>`,
          isRead: false
        };

        const currentMessages = targetApp.messages || [];
        await fetch(`/api/applications/${selectedAppId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: selectedUserEmail, 
            messages: [newMessage, ...currentMessages]
          })
        });
        
        // Update local state
        setAllApplications(prev => prev.map(item => item.app.id === selectedAppId ? { 
          email: selectedUserEmail, 
          app: { ...item.app, messages: [newMessage, ...currentMessages] } 
        } : item));
      }

      setEmailSuccess(true);
      setEmailSubject('');
      setEmailText('');
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Failed to send system message");
    }
  };

  const handleDeleteTimelineEvent = async (userEmail: string, appId: string, eventId: string) => {
    if (!confirm("Are you sure you want to delete this timeline event?")) return;
    try {
      const targetAppItem = allApplications.find(a => a.app.id === appId);
      if (!targetAppItem) return;
      
      const updatedTimeline = (targetAppItem.app.timeline || []).filter(evt => evt.id !== eventId);
      
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userEmail, 
          timeline: updatedTimeline
        })
      });
      
      if (res.ok) {
        setAllApplications(prev => prev.map(item => item.app.id === appId ? {
          email: userEmail,
          app: { ...item.app, timeline: updatedTimeline }
        } : item));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete timeline event");
    }
  };

  const handleAddCustomTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !selectedUserEmail || !customTimelineAction) return;

    const targetAppItem = allApplications.find(a => a.app.id === selectedAppId);
    if (!targetAppItem) return;

    const now = new Date();
    // Use selected date/time or default to now
    let finalDate = customTimelineDate;
    if (finalDate) {
      // Convert YYYY-MM-DD to "Month Day, Year"
      const dateObj = new Date(finalDate + "T12:00:00");
      finalDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } else {
      finalDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    let finalTime = customTimelineTime;
    if (finalTime) {
      // Convert HH:MM to 12-hour AM/PM
      const [hoursStr, minutesStr] = finalTime.split(':');
      const hours = parseInt(hoursStr, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      finalTime = `${formattedHours}:${minutesStr} ${ampm}`;
    } else {
      finalTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    const newTimelineEvent: TimelineEvent = {
      id: `evt-${Date.now()}`,
      date: finalDate,
      time: finalTime,
      action: customTimelineAction
    };

    const currentTimeline = targetAppItem.app.timeline || [];
    const updatedTimeline = [newTimelineEvent, ...currentTimeline];

    try {
      const res = await fetch(`/api/applications/${selectedAppId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: selectedUserEmail, 
          timeline: updatedTimeline
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setAllApplications(prev => prev.map(item => item.app.id === selectedAppId ? { email: selectedUserEmail, app: updated } : item));
        setCustomTimelineAction('');
        setCustomTimelineDate('');
        setCustomTimelineTime('');
        alert("Timeline event added successfully");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to add timeline event");
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

      <div className="max-w-xl bg-gray-100 p-6 border border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-[#26374a] border-b border-gray-300 pb-2">Create Applicant Profile</h2>
        <form onSubmit={handleCreateProfile} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Applicant Full Name</label>
              <input 
                type="text" 
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                className="w-full border border-gray-400 p-2 bg-white"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Email Address</label>
              <input 
                type="email" 
                value={newProfileEmail}
                onChange={e => setNewProfileEmail(e.target.value)}
                className="w-full border border-gray-400 p-2 bg-white"
                placeholder="name@domain.ca"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Application Type</label>
              <select 
                value={newProfileAppType}
                onChange={e => setNewProfileAppType(e.target.value)}
                className="w-full border border-gray-400 p-2 bg-white font-medium"
              >
                <option value="Online Application">Online Application</option>
                <option value="Work Permit">Work Permit</option>
                <option value="Visitor Visa">Visitor Visa</option>
                <option value="Study Permit">Study Permit</option>
                <option value="Permanent Residence">Permanent Residence</option>
                <option value="Citizenship">Citizenship</option>
                <option value="Passport">Passport</option>
                <option value="Biometrics">Biometrics</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Application Number</label>
              <input 
                type="text" 
                value={newProfileAppNumber}
                onChange={e => setNewProfileAppNumber(e.target.value)}
                className="w-full border border-gray-400 p-2 bg-white"
                placeholder="e.g. W123456789 (leave empty for auto)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">UCI (optional)</label>
              <input 
                type="text" 
                value={newProfileUci}
                onChange={e => setNewProfileUci(e.target.value)}
                className="w-full border border-gray-400 p-2 bg-white"
                placeholder="e.g. 11-2222-3333"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Current Status</label>
              <select
                value={newProfileStatus}
                onChange={e => setNewProfileStatus(e.target.value)}
                className="w-full border border-gray-400 p-2 bg-white font-medium"
              >
                <option value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Refused">Refused</option>
                <option value="Documents Requested">Documents Requested</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Date Created / Received</label>
              <input 
                type="date" 
                value={newProfileDateCreated}
                onChange={e => setNewProfileDateCreated(e.target.value)}
                className="w-full border border-gray-400 p-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Date Submitted</label>
              <input 
                type="date" 
                value={newProfileDateSubmitted}
                onChange={e => setNewProfileDateSubmitted(e.target.value)}
                className="w-full border border-gray-400 p-2 bg-white"
              />
            </div>
          </div>

          <button type="submit" className="bg-[#26374a] text-white px-4 py-2 font-bold hover:bg-[#111820] w-full transition-colors">
            Create Profile & Application Record
          </button>
          <p className="text-xs text-gray-600 mt-2">After creating, provide the email to the user. All initial status stages will be prepared automatically.</p>
        </form>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <div className={`grid grid-cols-1 ${selectedAppId && showSidebar ? 'lg:grid-cols-12 gap-8' : ''} items-start`}>
          {(!selectedAppId || showSidebar) && (
            <div className={`space-y-6 ${selectedAppId ? 'lg:col-span-4 bg-white p-4 border border-gray-300 shadow-sm rounded sticky top-4 max-h-[90vh] overflow-y-auto' : 'w-full'}`}>
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
              <h2 className="text-xl font-bold mb-4">
                {selectedAppId ? "Select Profile" : "Applicant Profiles"}
              </h2>
              {selectedAppId ? (
                <div className="space-y-2">
                  {allUsers.map(userItem => {
                    const isSelectedProfile = allApplications.find(a => a.app.id === selectedAppId)?.email === userItem.email;
                    return (
                      <div 
                        key={userItem.email}
                        onClick={() => setSelectedProfileEmail(userItem.email)}
                        className={`p-3 border transition-all cursor-pointer rounded text-sm ${
                          isSelectedProfile 
                            ? 'bg-blue-50 border-[#26374a] shadow-sm ring-1 ring-[#26374a]' 
                            : 'bg-white border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-bold text-gray-800 break-all">{userItem.name}</div>
                        <div className="text-xs text-gray-500 break-all">{userItem.email}</div>
                        <div className="text-xs font-bold text-[#26374a] mt-1.5">
                          Applications: {allApplications.filter(a => a.email === userItem.email).length}
                        </div>
                      </div>
                    );
                  })}
                  {allUsers.length === 0 && (
                    <p className="text-gray-500 italic">No profiles created yet.</p>
                  )}
                </div>
              ) : (
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
              )}
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
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setViewMode('applications'); setSelectedAppId(item.app.id); setSelectedUserEmail(item.email); setSubStatusEdits({}); }}
                        className="bg-[#26374a] hover:bg-[#111820] text-white px-4 py-2 font-bold text-sm whitespace-nowrap"
                      >
                        Manage File
                      </button>
                      <button 
                        onClick={() => handleDeleteApplication(item.app.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-bold text-sm whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'applications' && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {selectedAppId ? "Select Application" : "All Applications"}
              </h2>
              {selectedAppId ? (
                <div className="space-y-2">
                  {allApplications.map((item) => {
                    const isSelected = item.app.id === selectedAppId;
                    return (
                      <div 
                        key={item.app.id}
                        onClick={() => { setSelectedAppId(item.app.id); setSelectedUserEmail(item.email); setSubStatusEdits({}); }}
                        className={`p-3 border transition-all cursor-pointer rounded text-sm ${
                          isSelected 
                            ? 'bg-blue-50 border-[#26374a] shadow-sm ring-1 ring-[#26374a]' 
                            : 'bg-white border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-gray-800 app-number-font break-all">{item.app.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            item.app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            item.app.status === 'Refused' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.app.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 truncate mt-1 break-all">{item.email}</div>
                        <div className="text-xs font-semibold text-[#26374a] mt-1">{item.app.type}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-300 min-w-[850px]">
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
                          <td className="p-3 border-r border-gray-300 app-number-font text-[16px]">{item.app.id}</td>
                          <td className="p-3 border-r border-gray-300 break-all">{item.email}</td>
                          <td className="p-3 border-r border-gray-300">{item.app.type}</td>
                          <td className="p-3 border-r border-gray-300">
                            <select 
                              value={item.app.status}
                              onChange={(e) => handleUpdateApp(item.email, item.app.id, { status: e.target.value }, `Application Progress Updated to: ${e.target.value}`)}
                              className="border border-gray-400 p-1 w-full max-w-[200px]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="SUBMITTED">SUBMITTED</option>
                              {IMMIGRATION_JOURNEY_STEPS.map(step => (
                                <option key={step} value={step}>{step}</option>
                              ))}
                              <option value="Approved">Approved</option>
                              <option value="Refused">Refused</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { setSelectedAppId(item.app.id); setSelectedUserEmail(item.email); setSubStatusEdits({}); }}
                                className="bg-[#26374a] hover:bg-[#111820] text-white px-3 py-1 font-bold whitespace-nowrap"
                              >
                                Manage File
                              </button>
                              <button 
                                onClick={() => handleDeleteApplication(item.app.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 font-bold whitespace-nowrap"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
            </div>
          )}

          {selectedAppId && selectedUserEmail && (
            <div className={`${showSidebar ? 'lg:col-span-8' : 'w-full'} border border-gray-400 p-6 space-y-6 bg-gray-50`}>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-300 pb-4">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Active File Control</div>
                  <h2 className="text-2xl font-bold text-[#26374a] break-all flex items-center gap-2">
                    Case Management: ID <span className="app-number-font">{selectedAppId}</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    type="button"
                    onClick={() => setShowSidebar(prev => !prev)}
                    className="bg-white border border-gray-300 text-gray-700 font-bold px-3 py-1.5 text-xs shadow-sm hover:bg-gray-50 flex items-center gap-1.5 transition-all"
                    title={showSidebar ? "Hide sidebar for full screen editing" : "Show sidebar list"}
                  >
                    {showSidebar ? "👁 Hide Sidebar" : "👁 Show Sidebar"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setSelectedAppId(null); setSelectedUserEmail(null); }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-3 py-1.5 text-xs transition-colors"
                  >
                    Close File
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDeleteApplication(selectedAppId)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 text-xs transition-colors"
                  >
                    Delete File
                  </button>
                </div>
              </div>

              {/* Sub-tab switcher inside Case Management */}
              <div className="flex flex-wrap gap-1 border-b border-gray-300 pb-px">
                <button
                  type="button"
                  onClick={() => setCaseTab('profile')}
                  className={`px-4 py-2.5 text-xs md:text-sm font-bold border-t border-l border-r transition-colors ${
                    caseTab === 'profile'
                      ? 'bg-white border-gray-300 text-[#26374a] -mb-px border-b-2 border-b-white z-10'
                      : 'bg-gray-100 border-transparent text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  Applicant Info & Status
                </button>
                <button
                  type="button"
                  onClick={() => setCaseTab('stages')}
                  className={`px-4 py-2.5 text-xs md:text-sm font-bold border-t border-l border-r transition-colors ${
                    caseTab === 'stages'
                      ? 'bg-white border-gray-300 text-[#26374a] -mb-px border-b-2 border-b-white z-10'
                      : 'bg-gray-100 border-transparent text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  7 Processing Stages
                </button>
                <button
                  type="button"
                  onClick={() => setCaseTab('docs')}
                  className={`px-4 py-2.5 text-xs md:text-sm font-bold border-t border-l border-r transition-colors ${
                    caseTab === 'docs'
                      ? 'bg-white border-gray-300 text-[#26374a] -mb-px border-b-2 border-b-white z-10'
                      : 'bg-gray-100 border-transparent text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  Document Checklist & Rows
                </button>
                <button
                  type="button"
                  onClick={() => setCaseTab('messages')}
                  className={`px-4 py-2.5 text-xs md:text-sm font-bold border-t border-l border-r transition-colors ${
                    caseTab === 'messages'
                      ? 'bg-white border-gray-300 text-[#26374a] -mb-px border-b-2 border-b-white z-10'
                      : 'bg-gray-100 border-transparent text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  Send Messages & Email
                </button>
              </div>

              {caseTab === 'profile' && (
                <>
                  {/* SECTION A: Applicant Profile & Information */}
              <div className="bg-white p-5 border border-gray-300 space-y-4">
                <h3 className="font-bold text-lg text-[#26374a] border-b border-gray-200 pb-2">
                  1. Applicant Information & Metadata
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editFullName}
                      onChange={e => setEditFullName(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white"
                      placeholder="Principal Applicant"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">UCI (Unique Client Identifier)</label>
                    <input 
                      type="text" 
                      value={editUci}
                      onChange={e => setEditUci(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white"
                      placeholder="e.g. 11-2222-3333"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Application Number (Read-only)</label>
                    <input 
                      type="text" 
                      value={selectedAppId}
                      className="w-full border border-gray-300 p-2 bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Application Type</label>
                    <select 
                      value={editAppType}
                      onChange={e => setEditAppType(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white font-medium"
                    >
                      <option value="Online Application">Online Application</option>
                      <option value="Work Permit">Work Permit</option>
                      <option value="Visitor Visa">Visitor Visa</option>
                      <option value="Study Permit">Study Permit</option>
                      <option value="Permanent Residence">Permanent Residence</option>
                      <option value="Citizenship">Citizenship</option>
                      <option value="Passport">Passport</option>
                      <option value="Biometrics">Biometrics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Date Received / Created</label>
                    <input 
                      type="text" 
                      value={editDateReceived}
                      onChange={e => setEditDateReceived(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white"
                      placeholder="e.g. March 18, 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Date Submitted</label>
                    <input 
                      type="text" 
                      value={editDateSubmitted}
                      onChange={e => setEditDateSubmitted(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white"
                      placeholder="e.g. March 18, 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Overall Current Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white font-semibold"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Processing">Processing</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Refused">Refused</option>
                      <option value="Documents Requested">Documents Requested</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Biometrics Number</label>
                    <input 
                      type="text" 
                      value={editBiometricsNumber}
                      onChange={e => setEditBiometricsNumber(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white"
                      placeholder="e.g. 123456789012"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Biometrics Date of Enrolment</label>
                    <input 
                      type="text" 
                      value={editBiometricsDate}
                      onChange={e => setEditBiometricsDate(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white"
                      placeholder="e.g. June 15, 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Biometrics Expiry Date</label>
                    <input 
                      type="text" 
                      value={editBiometricsExpiry}
                      onChange={e => setEditBiometricsExpiry(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white"
                      placeholder="e.g. June 15, 2036"
                    />
                  </div>



                  {/* Confirmation Transmission Info */}
                  <div className="bg-blue-50/50 p-2 border border-blue-200 rounded">
                    <label className="block text-xs font-bold mb-1 text-blue-900">Transmission Date</label>
                    <input 
                      type="text" 
                      value={confirmDate}
                      onChange={e => setConfirmDate(e.target.value)}
                      className="w-full border border-blue-400 p-2 bg-white font-medium"
                      placeholder="e.g. 2 August 2023"
                    />
                  </div>
                  <div className="bg-blue-50/50 p-2 border border-blue-200 rounded">
                    <label className="block text-xs font-bold mb-1 text-blue-900">Transmission Time</label>
                    <input 
                      type="text" 
                      value={confirmTime}
                      onChange={e => setConfirmTime(e.target.value)}
                      className="w-full border border-blue-400 p-2 bg-white font-medium"
                      placeholder="e.g. 06:40:02 p.m."
                    />
                  </div>
                  <div className="bg-blue-50/50 p-2 border border-blue-200 rounded">
                    <label className="block text-xs font-bold mb-1 text-blue-900">Transmission Timezone</label>
                    <input 
                      type="text" 
                      value={confirmTimezone}
                      onChange={e => setConfirmTimezone(e.target.value)}
                      className="w-full border border-blue-400 p-2 bg-white font-medium"
                      placeholder="e.g. EDT"
                    />
                  </div>
                  <div className="bg-blue-50/50 p-2 border border-blue-200 rounded sm:col-span-2 md:col-span-3">
                    <label className="block text-xs font-bold mb-1 text-blue-900">Payment Receipt Number</label>
                    <input 
                      type="text" 
                      value={confirmReceiptNumber}
                      onChange={e => setConfirmReceiptNumber(e.target.value)}
                      className="w-full border border-blue-400 p-2 bg-white font-medium font-mono"
                      placeholder="e.g. O689745557"
                    />
                  </div>
                </div>
                <div className="pt-2 text-right">
                  <button 
                    onClick={async () => {
                      const item = allApplications.find(a => a.app.id === selectedAppId);
                      let updatedMessages = [];
                      if (item) {
                        const currentMessages = item.app.messages || [];
                        const hasConfirm = currentMessages.some(m => m.subject === "Confirmation of Online Application Transmission");
                        
                        if (hasConfirm) {
                          updatedMessages = currentMessages.map(msg => {
                            if (msg.subject === "Confirmation of Online Application Transmission") {
                              return {
                                ...msg,
                                transmissionDate: confirmDate,
                                transmissionTime: confirmTime,
                                transmissionTimezone: confirmTimezone,
                                receiptNumber: confirmReceiptNumber
                              };
                            }
                            return msg;
                          });
                        } else {
                          updatedMessages = [
                            {
                              id: `msg-${Date.now()}-confirm`,
                              subject: "Confirmation of Online Application Transmission",
                              date: confirmDate || "August 2, 2023",
                              isRead: true,
                              content: "<p>Hello,</p><p>You have successfully transmitted your Online Application on 2 August 2023 06:40:02 p.m. EDT.</p><p>Your payment receipt number is # O689745557.</p>",
                              transmissionDate: confirmDate,
                              transmissionTime: confirmTime,
                              transmissionTimezone: confirmTimezone,
                              receiptNumber: confirmReceiptNumber
                            },
                            ...currentMessages
                          ];
                        }
                      }

                      await handleUpdateApp(selectedUserEmail, selectedAppId, {
                        fullName: editFullName,
                        uci: editUci,
                        type: editAppType,
                        typeFr: editAppType,
                        dateReceived: editDateReceived,
                        dateSubmitted: editDateSubmitted,
                        status: editStatus,
                        biometricsNumber: editBiometricsNumber,
                        biometricsDate: editBiometricsDate,
                        biometricsExpiry: editBiometricsExpiry,
                        showDocumentStatus: editShowDocumentStatus,
                        messages: updatedMessages
                      }, "Profile Information Updated");
                      alert("Applicant Information saved!");
                    }}
                    className="bg-[#26374a] text-white font-bold px-5 py-2 hover:bg-[#111820] text-sm"
                  >
                    Save Applicant Info
                  </button>
                </div>
              </div>

              {/* SECTION B: Application Status Summary & Latest Update */}
              <div className="bg-white p-5 border border-gray-300 space-y-4">
                <h3 className="font-bold text-lg text-[#26374a] border-b border-gray-200 pb-2">
                  2. Status Summary & Latest Update text
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold mb-1">Application Status Summary message (appears at top left)</label>
                    <textarea 
                      value={editStatusSummary}
                      onChange={e => setEditStatusSummary(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-400 p-2 bg-white"
                      placeholder="e.g. Your application is in progress. We will send you a message..."
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold">Latest Update text description</label>
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                          const dateTimeStr = `${dateStr}: `;
                          setEditLatestUpdate(prev => prev ? `${dateTimeStr}${prev}` : `${dateTimeStr}`);
                        }}
                        className="text-xs text-[#05355c] hover:underline font-bold"
                        title="Click to prepend the current date to your latest update text."
                      >
                        + Insert Date
                      </button>
                    </div>
                    <textarea 
                      value={editLatestUpdate}
                      onChange={e => setEditLatestUpdate(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-400 p-2 bg-white"
                      placeholder="e.g. Final decision - April 29, 2021: Your application was approved..."
                    />
                  </div>
                </div>
                <div className="pt-2 text-right">
                  <button 
                    onClick={async () => {
                      await handleUpdateApp(selectedUserEmail, selectedAppId, {
                        statusSummary: editStatusSummary,
                        latestUpdate: editLatestUpdate,
                        details: editStatusSummary // Fallback sync
                      }, "Status Summary Updated");
                      alert("Status summaries saved!");
                    }}
                    className="bg-[#26374a] text-white font-bold px-5 py-2 hover:bg-[#111820] text-sm"
                  >
                    Save Status Summaries
                  </button>
                </div>
              </div>
                </>
              )}

              {/* SECTION C: 7 Processing Stages */}
              {caseTab === 'stages' && (
                <div className="bg-white p-5 border border-gray-300 space-y-4">
                <h3 className="font-bold text-lg text-[#26374a] border-b border-gray-200 pb-2">
                  3. Immigration Processing Stages (7 Stages)
                </h3>
                <p className="text-xs text-gray-600">Update each processing stage individually with its current status text, date, and detailed description.</p>
                
                <div className="space-y-6 divide-y divide-gray-200">
                  
                  {/* Stage 1: Eligibility */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="md:col-span-3 font-bold text-[#26374a]">Stage 1: Review of Eligibility</div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Status Message</label>
                      <input type="text" value={stageEligibilityStatus} onChange={e => setStageEligibilityStatus(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" placeholder="e.g. We are reviewing..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Date Update</label>
                      <input type="text" value={stageEligibilityDate} onChange={e => setStageEligibilityDate(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" placeholder="e.g. April 29, 2021" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Stage Description / Help text</label>
                      <input type="text" value={stageEligibilityDesc} onChange={e => setStageEligibilityDesc(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" placeholder="Officer notes or explanatory details" />
                    </div>
                  </div>

                  {/* Stage 2: Medical */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="md:col-span-3 font-bold text-[#26374a]">Stage 2: Review of Medical Results</div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Status Message</label>
                      <input type="text" value={stageMedicalStatus} onChange={e => setStageMedicalStatus(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" placeholder="e.g. You do not need a medical exam..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Date Update</label>
                      <input type="text" value={stageMedicalDate} onChange={e => setStageMedicalDate(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" placeholder="e.g. April 29, 2021" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Stage Description / Help text</label>
                      <input type="text" value={stageMedicalDesc} onChange={e => setStageMedicalDesc(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                  </div>

                  {/* Stage 3: Additional Documents */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="md:col-span-3 font-bold text-[#26374a]">Stage 3: Review of Additional Documents</div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Status Message</label>
                      <input type="text" value={stageAdditionalDocsStatus} onChange={e => setStageAdditionalDocsStatus(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Date Update</label>
                      <input type="text" value={stageAdditionalDocsDate} onChange={e => setStageAdditionalDocsDate(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Stage Description / Help text</label>
                      <input type="text" value={stageAdditionalDocsDesc} onChange={e => setStageAdditionalDocsDesc(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                  </div>

                  {/* Stage 4: Interview */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="md:col-span-3 font-bold text-[#26374a]">Stage 4: Interview</div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Status Message</label>
                      <input type="text" value={stageInterviewStatus} onChange={e => setStageInterviewStatus(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Date Update</label>
                      <input type="text" value={stageInterviewDate} onChange={e => setStageInterviewDate(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Stage Description / Help text</label>
                      <input type="text" value={stageInterviewDesc} onChange={e => setStageInterviewDesc(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                  </div>

                  {/* Stage 5: Biometrics */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="md:col-span-3 font-bold text-[#26374a]">Stage 5: Biometrics</div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Status Message</label>
                      <input type="text" value={stageBiometricsStatus} onChange={e => setStageBiometricsStatus(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Date Update</label>
                      <input type="text" value={stageBiometricsDateState} onChange={e => setStageBiometricsDateState(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Stage Description / Help text</label>
                      <input type="text" value={stageBiometricsDesc} onChange={e => setStageBiometricsDesc(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                  </div>

                  {/* Stage 6: Background check */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="md:col-span-3 font-bold text-[#26374a]">Stage 6: Background Check</div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Status Message</label>
                      <input type="text" value={stageBackgroundStatus} onChange={e => setStageBackgroundStatus(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Date Update</label>
                      <input type="text" value={stageBackgroundDate} onChange={e => setStageBackgroundDate(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Stage Description / Help text</label>
                      <input type="text" value={stageBackgroundDesc} onChange={e => setStageBackgroundDesc(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                  </div>

                  {/* Stage 7: Final decision */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="md:col-span-3 font-bold text-[#26374a]">Stage 7: Final Decision</div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Status Message</label>
                      <input type="text" value={stageFinalDecisionStatus} onChange={e => setStageFinalDecisionStatus(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Date Update</label>
                      <input type="text" value={stageFinalDecisionDate} onChange={e => setStageFinalDecisionDate(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Stage Description / Help text</label>
                      <input type="text" value={stageFinalDecisionDesc} onChange={e => setStageFinalDecisionDesc(e.target.value)} className="w-full border border-gray-400 p-2 bg-white" />
                    </div>
                  </div>

                </div>

                <div className="pt-4 text-right border-t border-gray-200">
                  <button 
                    onClick={async () => {
                      await handleUpdateApp(selectedUserEmail, selectedAppId, {
                        stages: {
                          eligibilityStatus: stageEligibilityStatus,
                          eligibilityDesc: stageEligibilityDesc,
                          eligibilityDate: stageEligibilityDate,
                          medicalStatus: stageMedicalStatus,
                          medicalDesc: stageMedicalDesc,
                          medicalDate: stageMedicalDate,
                          additionalDocsStatus: stageAdditionalDocsStatus,
                          additionalDocsDesc: stageAdditionalDocsDesc,
                          additionalDocsDate: stageAdditionalDocsDate,
                          interviewStatus: stageInterviewStatus,
                          interviewDesc: stageInterviewDesc,
                          interviewDate: stageInterviewDate,
                          biometricsStatus: stageBiometricsStatus,
                          biometricsDesc: stageBiometricsDesc,
                          biometricsDate: stageBiometricsDateState,
                          backgroundStatus: stageBackgroundStatus,
                          backgroundDesc: stageBackgroundDesc,
                          backgroundDate: stageBackgroundDate,
                          finalDecisionStatus: stageFinalDecisionStatus,
                          finalDecisionDesc: stageFinalDecisionDesc,
                          finalDecisionDate: stageFinalDecisionDate
                        }
                      }, "Immigration Stage Progress Updated");
                      alert("7 Processing Stages Saved!");
                    }}
                    className="bg-[#26374a] text-white font-bold px-5 py-2 hover:bg-[#111820] text-sm"
                  >
                    Save 7 Stages Progress
                  </button>
                </div>
              </div>
              )}

              {/* SECTION D: Document Table Row Management */}
              {caseTab === 'docs' && (
                <>
                  <div className="bg-white p-5 border border-gray-300 space-y-4">
                <h3 className="font-bold text-lg text-[#26374a] border-b border-gray-200 pb-2">
                  4. Document Status Table Rows
                </h3>
                <p className="text-xs text-gray-600">
                  Every document listed here will automatically appear inside the applicant's read-only "Document Status" table.
                </p>

                {/* Existing Rows */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-gray-300 min-w-[1100px]">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300 font-bold">
                        <th className="p-2 border-r border-gray-200">Name / Category</th>
                        <th className="p-2 border-r border-gray-200">Doc Type</th>
                        <th className="p-2 border-r border-gray-200">Doc Number</th>
                        <th className="p-2 border-r border-gray-200">Status</th>
                        <th className="p-2 border-r border-gray-200">Expiry</th>
                        <th className="p-2 border-r border-gray-200">Updated</th>
                        <th className="p-2 border-r border-gray-200">Country of Issue</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const target = allApplications.find(a => a.app.id === selectedAppId);
                        const docRows = target?.app.documentStatuses || [];
                        if (docRows.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="p-3 text-center text-gray-500 italic">No document rows generated yet.</td>
                            </tr>
                          );
                        }
                        return docRows.map((docRow) => (
                          <tr key={docRow.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-2 border-r border-gray-200 font-medium">{docRow.name}</td>
                            <td className="p-2 border-r border-gray-200">{docRow.documentType}</td>
                            <td className="p-2 border-r border-gray-200">{docRow.documentNumber || 'N/A'}</td>
                            <td className="p-2 border-r border-gray-200 font-semibold text-blue-800">{docRow.status}</td>
                            <td className="p-2 border-r border-gray-200">{docRow.expiryDate || 'N/A'}</td>
                            <td className="p-2 border-r border-gray-200">{docRow.statusUpdatedDate || 'N/A'}</td>
                            <td className="p-2 border-r border-gray-200">{docRow.countryOfIssue || 'N/A'}</td>
                            <td className="p-2">
                              <button 
                                onClick={async () => {
                                  if (!confirm("Are you sure you want to delete this document row?")) return;
                                  const updated = docRows.filter(r => r.id !== docRow.id);
                                  await handleUpdateApp(selectedUserEmail, selectedAppId, { documentStatuses: updated }, `Deleted Document Record: ${docRow.name}`);
                                  alert("Row deleted!");
                                }}
                                className="text-red-600 hover:text-red-900 font-bold hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Add Row Form */}
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newDocRowName) return;
                    const target = allApplications.find(a => a.app.id === selectedAppId);
                    const docRows = target?.app.documentStatuses || [];
                    const newRow = {
                      id: 'doc-' + Date.now(),
                      name: newDocRowName,
                      uci: newDocRowUci || editUci,
                      documentType: newDocRowType,
                      documentNumber: newDocRowNumber,
                      status: newDocRowStatus,
                      expiryDate: newDocRowExpiry,
                      statusUpdatedDate: newDocRowUpdated,
                      travelDocumentNumber: newDocRowTravelNum,
                      countryOfIssue: newDocRowCountry
                    };
                    const updated = [...docRows, newRow];
                    await handleUpdateApp(selectedUserEmail, selectedAppId, { documentStatuses: updated }, `Added Document Record: ${newDocRowName}`);
                    alert("Document Row Added!");
                    setNewDocRowName('');
                    setNewDocRowType('');
                    setNewDocRowNumber('');
                    setNewDocRowStatus('');
                    setNewDocRowExpiry('');
                    setNewDocRowUpdated('');
                    setNewDocRowTravelNum('');
                    setNewDocRowCountry('');
                  }} 
                  className="bg-gray-100 p-4 border border-gray-300 space-y-3 text-xs font-semibold"
                >
                  <div className="text-sm font-bold text-[#26374a] mb-2">Add Document Status Row</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block mb-1">Document Category / Name</label>
                      <input type="text" value={newDocRowName} onChange={e => setNewDocRowName(e.target.value)} placeholder="e.g. Passport, IELTS Certificate" required className="w-full border border-gray-400 p-1.5 bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block mb-1">UCI (Defaults to Applicant UCI)</label>
                      <input type="text" value={newDocRowUci} onChange={e => setNewDocRowUci(e.target.value)} placeholder="e.g. 11-2222-3333" className="w-full border border-gray-400 p-1.5 bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block mb-1">Document Type</label>
                      <input type="text" value={newDocRowType} onChange={e => setNewDocRowType(e.target.value)} placeholder="e.g. Work Permit, Passport" className="w-full border border-gray-400 p-1.5 bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block mb-1">Document Number</label>
                      <input type="text" value={newDocRowNumber} onChange={e => setNewDocRowNumber(e.target.value)} placeholder="e.g. E819203" className="w-full border border-gray-400 p-1.5 bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block mb-1">Status Message</label>
                      <input type="text" value={newDocRowStatus} onChange={e => setNewDocRowStatus(e.target.value)} placeholder="e.g. Your document is valid." className="w-full border border-gray-400 p-1.5 bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block mb-1">Expiry Date</label>
                      <input type="text" value={newDocRowExpiry} onChange={e => setNewDocRowExpiry(e.target.value)} placeholder="e.g. 2030/12/31" className="w-full border border-gray-400 p-1.5 bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block mb-1">Status Updated Date</label>
                      <input type="text" value={newDocRowUpdated} onChange={e => setNewDocRowUpdated(e.target.value)} placeholder="e.g. 2026/03/18" className="w-full border border-gray-400 p-1.5 bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block mb-1">Travel Document Number</label>
                      <input type="text" value={newDocRowTravelNum} onChange={e => setNewDocRowTravelNum(e.target.value)} placeholder="e.g. 51000000" className="w-full border border-gray-400 p-1.5 bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block mb-1">Country of Issue</label>
                      <input type="text" value={newDocRowCountry} onChange={e => setNewDocRowCountry(e.target.value)} placeholder="e.g. Philippines" className="w-full border border-gray-400 p-1.5 bg-white font-medium" />
                    </div>
                  </div>
                  <button type="submit" className="bg-[#26374a] text-white px-4 py-1.5 font-bold hover:bg-[#111820]">
                    Add Row To Applicant Table
                  </button>
                </form>
              </div>

              {/* SECTION E: Request Documents & Checklist Manager */}
              <div className="bg-white p-5 border border-gray-300 space-y-4">
                <h3 className="font-bold text-lg text-[#26374a] border-b border-gray-200 pb-2">
                  5. Request Documents from Applicant (Checklist & Upload Slots)
                </h3>
                <p className="text-xs text-gray-600">
                  Manage the checklist of files requested from the applicant. Adding a document request here places a slot in the applicant's <strong>Document Checklist</strong> (where they can upload documents) and automatically notifies them.
                </p>

                {/* List of currently requested documents */}
                <div className="bg-gray-50 p-4 border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Currently Requested Documents (Checklist)</div>
                  {(() => {
                    const target = allApplications.find(a => a.app.id === selectedAppId);
                    const requestedList = target?.app.requestedDocuments || [];
                    if (requestedList.length === 0) {
                      return (
                        <p className="text-xs text-gray-500 italic py-2">No documents have been requested for this file yet.</p>
                      );
                    }
                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse border border-gray-300 mt-2 min-w-[950px]">
                          <thead>
                            <tr className="bg-gray-100 border-b border-gray-300 font-bold">
                              <th className="p-2 border-r border-gray-200">Document Name</th>
                              <th className="p-2 border-r border-gray-200 text-center w-24">Status</th>
                              <th className="p-2 border-r border-gray-200 w-48">Date & Time Updated</th>
                              <th className="p-2 border-r border-gray-200">Remarks / Feedback</th>
                              <th className="p-2 text-center w-64">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requestedList.map((doc, idx) => {
                              const isEditing = editingDocName === doc.name;
                              return (
                                <tr key={idx} className="border-b border-gray-200 bg-white hover:bg-gray-50">
                                  <td className="p-2 border-r border-gray-200 font-semibold text-gray-800">{doc.name}</td>
                                  <td className="p-2 border-r border-gray-200 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      doc.status === 'Received' ? 'bg-green-100 text-green-800 border border-green-300' :
                                      doc.status === 'Submitted' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                      'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                    }`}>
                                      {doc.status}
                                    </span>
                                  </td>
                                  <td className="p-2 border-r border-gray-200 text-gray-600">
                                    {isEditing ? (
                                      <input
                                        type="text"
                                        value={editDateUpdated}
                                        onChange={e => setEditDateUpdated(e.target.value)}
                                        className="w-full border border-gray-300 p-1.5 rounded text-xs bg-white font-medium"
                                        placeholder="e.g. July 2, 2026, 10:15 AM"
                                      />
                                    ) : (
                                      doc.dateUpdated || 'N/A'
                                    )}
                                  </td>
                                  <td className="p-2 border-r border-gray-200 text-gray-600 italic">
                                    {isEditing ? (
                                      <textarea
                                        value={editRemarks}
                                        onChange={e => setEditRemarks(e.target.value)}
                                        className="w-full border border-gray-300 p-1.5 rounded text-xs bg-white h-12 font-medium"
                                        placeholder="Enter remarks about this document..."
                                      />
                                    ) : (
                                      doc.remarks || 'No remarks.'
                                    )}
                                  </td>
                                  <td className="p-2">
                                    <div className="flex gap-1 justify-center items-center flex-wrap">
                                      {isEditing ? (
                                        <>
                                          <button
                                            onClick={() => handleSaveDocEdits(selectedUserEmail, selectedAppId, doc.name)}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold rounded px-2.5 py-1 text-[11px] shadow-sm"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={() => setEditingDocName(null)}
                                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded px-2.5 py-1 text-[11px] shadow-sm"
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => startEditingDoc(doc)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded px-2 py-1 text-[11px] font-bold"
                                            title="Edit date/time and remarks directly"
                                          >
                                            Edit Details
                                          </button>
                                          <select
                                            value={doc.status}
                                            onChange={(e) => handleUpdateRequestedDocStatus(selectedUserEmail, selectedAppId, doc.name, e.target.value as any)}
                                            className="border border-gray-300 rounded p-1 text-[11px] font-medium bg-white"
                                          >
                                            <option value="Pending">Pending</option>
                                            <option value="Submitted">Submitted</option>
                                            <option value="Received">Received</option>
                                          </select>
                                          <button
                                            onClick={() => handleDeleteRequestedDocument(selectedUserEmail, selectedAppId, doc.name)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded px-2 py-1 text-[11px] font-bold"
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                {/* Manage Standard Documents Options */}
                <div className="bg-blue-50 p-4 border border-blue-200 space-y-3 rounded">
                  <div className="text-xs font-bold text-[#26374a] uppercase tracking-wider flex justify-between items-center">
                    <span>Standard Documents Checklist Options</span>
                    <span className="text-[10px] text-gray-500 font-normal lowercase italic">(click ✕ to remove any option from the standard checklist)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {standardDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                        <span>{doc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStandardDoc(doc)}
                          className="text-red-500 hover:text-red-700 font-extrabold ml-1 hover:bg-red-50 rounded-full w-4 h-4 flex items-center justify-center transition-colors text-sm"
                          title={`Remove "${doc}" from standard list`}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    {standardDocs.length === 0 && (
                      <p className="text-xs text-gray-500 italic">No standard documents remaining in the option list. You can still request custom documents below.</p>
                    )}
                  </div>
                </div>

                {/* Request New Document Form */}
                <div className="bg-gray-100 p-4 border border-gray-300 space-y-4">
                  <div className="text-sm font-bold text-[#26374a]">Request New Document (Add to Checklist)</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block mb-1 text-gray-700">Select standard document from list:</label>
                      <select
                        value={selectedPredefinedDoc}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedPredefinedDoc(val);
                          if (val !== 'Custom Document...') {
                            setCustomRequestedDocName(val);
                          } else {
                            setCustomRequestedDocName('');
                          }
                        }}
                        className="w-full border border-gray-400 p-2 bg-white font-medium"
                      >
                        {standardDocs.map((doc, idx) => (
                          <option key={idx} value={doc}>{doc}</option>
                        ))}
                        <option value="Custom Document...">-- Custom Document (type custom name below) --</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-gray-700">Document Name to request:</label>
                      <input
                        type="text"
                        value={customRequestedDocName || (selectedPredefinedDoc !== 'Custom Document...' ? selectedPredefinedDoc : '')}
                        onChange={(e) => setCustomRequestedDocName(e.target.value)}
                        placeholder="e.g. Police Clearance Certificate, IELTS Results"
                        className="w-full border border-gray-400 p-2 bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={async () => {
                        const finalName = customRequestedDocName || (selectedPredefinedDoc !== 'Custom Document...' ? selectedPredefinedDoc : '');
                        if (!finalName || !finalName.trim()) {
                          alert("Please specify a document name to request.");
                          return;
                        }
                        await handleRequestDocument(selectedUserEmail, selectedAppId, finalName.trim());
                      }}
                      className="bg-[#26374a] text-white px-5 py-2 font-bold hover:bg-[#111820] text-xs transition-colors"
                    >
                      Send Document Request to Applicant
                    </button>
                  </div>
                </div>
              </div>
                </>
              )}

              {/* SECTION F: System Messaging & Communications */}
              {caseTab === 'messages' && (
                <div className="bg-white p-5 border border-gray-300 space-y-4">
                <h3 className="font-bold text-lg text-[#26374a] border-b border-gray-200 pb-2">
                  6. Compose & Send Messages
                </h3>
                <p className="text-xs text-gray-600">Compose and send messages that appear inside the applicant's "Messages About Your Application" section.</p>
                {emailSuccess && <div className="bg-green-100 border border-green-400 text-green-700 p-2 font-bold text-sm">Message sent successfully to Applicant!</div>}
                <form onSubmit={handleSendEmail} className="space-y-3 text-sm">
                  <div>
                    <label className="block text-xs font-bold mb-1">Subject</label>
                    <input 
                      type="text" 
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      className="w-full border border-gray-400 p-2 bg-white font-medium"
                      placeholder="e.g. Correspondence Letter"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Message Content (HTML Allowed)</label>
                    <textarea 
                      value={emailText}
                      onChange={e => setEmailText(e.target.value)}
                      className="w-full border border-gray-400 p-2 h-32 bg-white"
                      placeholder="Type your official correspondence..."
                      required
                    />
                  </div>
                  <button type="submit" className="bg-[#26374a] text-white font-bold px-4 py-2 hover:bg-[#111820] text-sm">
                    Send System Message
                  </button>
                </form>
              </div>
              )}

            </div>
          )}
        </div>
      )}
    </main>
  );
}
