import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RotateCcw, Pencil, Printer, AlertTriangle, HelpCircle, Info, CheckCircle2, Upload, ExternalLink } from 'lucide-react';

interface ChecklistItem {
  key: string;
  name: string;
  category: string;
  required: boolean;
}

export default function DocumentChecklist() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, applications, updateApplication } = useApp();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  const selectedApp = useMemo(() => {
    const safeApps = Array.isArray(applications) ? applications : [];
    return safeApps.find(a => a.id === id);
  }, [applications, id]);

  // Hidden file inputs refs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Help/Instruction dialog or tooltip state
  const [activeHelp, setActiveHelp] = useState<string | null>(null);

  // Accordion status states for the bottom links
  const [expandedFAQ, setExpandedFAQ] = useState<{ [key: string]: boolean }>({
    save: false,
    upload: false,
    size: false,
  });

  // Track currently active item for file upload
  const [uploadingItemKey, setUploadingItemKey] = useState<string | null>(null);

  // Definition of checklist items
  const formItems: ChecklistItem[] = [
    {
      key: 'imm5257',
      name: 'Application for Visitor Visa (Temporary Resident Visa) Made Outside of Canada (IMM5257) (required)',
      category: 'Application Form IMM5257',
      required: true
    }
  ];

  const supportingItems: ChecklistItem[] = [
    { key: 'travel_history', name: 'Travel History (required)', category: 'Travel History', required: true },
    { key: 'passport', name: 'Passport (required)', category: 'Passport', required: true },
    { key: 'invitation_letter', name: 'Invitation Letter (required)', category: 'Invitation Letter', required: true },
    { key: 'financial_support', name: 'Proof of Means of Financial Support (required)', category: 'Financial Support', required: true },
    { key: 'digital_photo', name: 'Digital photo (required)', category: 'Digital photo', required: true },
    { key: 'purpose_of_travel', name: 'Purpose of Travel - Other (required)', category: 'Purpose of Travel', required: true },
    { key: 'imm5645', name: 'Family Information (IMM5645) (required)', category: 'Family Information IMM5645', required: true },
    { key: 'proof_of_relationship', name: 'Proof of Relationship (required)', category: 'Proof of Relationship', required: true }
  ];

  const optionalItems: ChecklistItem[] = [
    { key: 'schedule_1', name: 'Schedule 1 - Application for a Temporary Resident Visa Made Outside Canada (IMM 5257)', category: 'Schedule 1 IMM5257', required: false },
    { key: 'client_info', name: 'Client Information', category: 'Client Information', required: false }
  ];

  if (!selectedApp) {
    return (
      <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-grow font-sans text-[#333]">
        <div className="text-[#284162] text-sm mb-6 font-medium">
          <span className="underline cursor-pointer" onClick={() => navigate('/')}>Home</span> 
          <span className="no-underline text-black px-2">&gt;</span> 
          <span className="underline cursor-pointer" onClick={() => navigate('/dashboard')}>Your Account</span>
          <span className="no-underline text-black px-2">&gt;</span> Checklist Not Found
        </div>
        <h1 className="text-3xl font-bold mb-4">Application Checklist Not Found</h1>
        <p>The application checklist you are looking for does not exist or you do not have permission to view it.</p>
      </main>
    );
  }

  // Find if a document is already uploaded in the application status tracker
  const getDocumentStatus = (categoryName: string) => {
    const existing = selectedApp.documents?.find(d => d.category === categoryName);
    if (existing) {
      return {
        uploaded: true,
        fileName: existing.name,
        date: existing.date,
        time: existing.time
      };
    }
    return { uploaded: false, fileName: null };
  };

  const handleUploadClick = (itemKey: string) => {
    setUploadingItemKey(itemKey);
    const input = fileInputRefs.current[itemKey];
    if (input) {
      input.click();
    }
  };

  const handleFileChange = async (itemKey: string, categoryName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Build the new document entry
    const newDoc = {
      name: file.name,
      category: categoryName,
      date: dateStr,
      time: timeStr
    };

    // Append to existing documents or replace if already exists
    const currentDocs = selectedApp.documents || [];
    const filteredDocs = currentDocs.filter(d => d.category !== categoryName);
    const updatedDocs = [newDoc, ...filteredDocs];

    // Add timeline event
    const newTimelineEvent = {
      id: `evt-checklist-${Date.now()}`,
      date: `${dateStr} ${timeStr}`,
      time: timeStr,
      title: `Uploaded document: ${categoryName}`,
      action: `Checklist Upload`,
      status: `Completed`,
      details: `File: ${file.name}`
    };
    const updatedTimeline = [newTimelineEvent, ...(selectedApp.timeline || [])];

    // If this document is also in "requestedDocuments", mark it as "Submitted"
    const updatedRequested = (selectedApp.requestedDocuments || []).map(r => {
      // Fuzzy match requested doc name or category
      if (r.name.toLowerCase().includes(categoryName.toLowerCase()) || categoryName.toLowerCase().includes(r.name.toLowerCase())) {
        return {
          ...r,
          status: 'Submitted' as const,
          dateUpdated: dateStr,
          remarks: `Submitted on ${dateStr} via checklist.`
        };
      }
      return r;
    });

    try {
      await updateApplication(selectedApp.id, {
        documents: updatedDocs,
        timeline: updatedTimeline,
        requestedDocuments: updatedRequested
      });
      alert(`Successfully uploaded "${file.name}" for "${categoryName}".`);
    } catch (e) {
      console.error(e);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingItemKey(null);
    }
  };

  const toggleFAQ = (key: string) => {
    setExpandedFAQ(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderTableRows = (items: ChecklistItem[]) => {
    return items.map((item) => {
      const status = getDocumentStatus(item.category);
      return (
        <tr key={item.key} className="border-b border-gray-300 hover:bg-gray-50 text-[13px]">
          {/* Details Column */}
          <td className="py-2.5 px-3 border-r border-gray-300 font-normal">
            {status.uploaded ? (
              <span className="text-[#3c763d] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#3c763d] flex-shrink-0" />
                Provided
              </span>
            ) : (
              <span className="text-gray-500 font-normal">Not provided</span>
            )}
          </td>

          {/* Document name Column */}
          <td className="py-2.5 px-3 border-r border-gray-300">
            <div className="font-normal text-gray-800">{item.name}</div>
            {status.uploaded && (
              <div className="text-[11px] text-[#31708f] mt-1 font-mono break-all bg-sky-50/50 p-1 border border-sky-100 rounded">
                Attached file: <strong>{status.fileName}</strong> ({status.date} at {status.time})
              </div>
            )}
          </td>

          {/* Instructions Column */}
          <td className="py-2.5 px-3 border-r border-gray-300 text-center w-20 select-none">
            <button
              onClick={() => setActiveHelp(activeHelp === item.key ? null : item.key)}
              className="text-[#2572b5] hover:text-[#1c5485] focus:outline-none transition-colors"
              title="Click for instructions"
            >
              <HelpCircle className="w-5 h-5 mx-auto" />
            </button>
            {activeHelp === item.key && (
              <div className="absolute z-10 mt-2 p-3 bg-white border border-gray-300 shadow-lg text-left text-xs max-w-sm rounded text-gray-800 leading-relaxed">
                <h4 className="font-bold border-b border-gray-200 pb-1 mb-1 text-gray-900">{item.category} Instructions:</h4>
                <p className="mb-2">Ensure the document is completely legible, not password-protected, and in PDF, JPG, PNG, or DOC format.</p>
                <p>The total file size must be less than 4MB. Only one file can be submitted per slot.</p>
                <button
                  onClick={() => setActiveHelp(null)}
                  className="mt-2 text-[#2572b5] underline font-bold float-right"
                >
                  Close
                </button>
              </div>
            )}
          </td>

          {/* Options Column */}
          <td className="py-2.5 px-3 w-40 text-center">
            <button
              onClick={() => handleUploadClick(item.key)}
              className="bg-[#2b3e50] hover:bg-[#1a2530] text-white text-[12.5px] px-3 py-1.5 font-semibold transition-colors shadow-sm focus:outline-none flex items-center justify-center gap-1.5 mx-auto rounded-none w-full"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload file
            </button>
            <input
              type="file"
              ref={el => fileInputRefs.current[item.key] = el}
              onChange={(e) => handleFileChange(item.key, item.category, e)}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </td>
        </tr>
      );
    });
  };

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-grow font-sans text-[#333]">
      

      {/* 2. Standard Action Wizard Button Panel from GC Portal */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        <button 
          onClick={() => { if(confirm('Are you sure you want to start this checklist session again?')) { navigate('/dashboard'); } }}
          className="bg-[#f5f5f5] hover:bg-gray-200 text-gray-800 border border-gray-300 text-[12.5px] font-medium px-3 py-1.5 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
          Start Again
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-[#f5f5f5] hover:bg-gray-200 text-gray-800 border border-gray-300 text-[12.5px] font-medium px-3 py-1.5 flex items-center gap-1.5"
        >
          <Pencil className="w-3.5 h-3.5 text-gray-600" />
          Modify my Answers
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-[#f5f5f5] hover:bg-gray-200 text-gray-800 border border-gray-300 text-[12.5px] font-medium px-3 py-1.5 flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5 text-gray-600" />
          Print
        </button>
        <button 
          onClick={() => alert('Technical issue report logged. Our team is investigating.')}
          className="bg-[#f5f5f5] hover:bg-gray-200 text-gray-800 border border-gray-300 text-[12.5px] font-medium px-3 py-1.5 flex items-center gap-1.5 mr-auto"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-gray-600" />
          Report a Technical Issue
        </button>
        <button 
          onClick={() => window.open('/help', '_blank')}
          className="bg-[#f5f5f5] hover:bg-gray-200 text-gray-800 border border-gray-300 text-[12.5px] font-medium px-3 py-1.5 flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5 text-gray-600" />
          Help
        </button>
      </div>

      {/* 3. Document Checklist Header */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-[#333] mb-1 leading-tight">Your document checklist</h1>
        <div className="h-[2px] bg-[#af3c43] w-full mt-2"></div>
      </div>

      {/* Subheading: Your Documents */}
      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-[#333] mb-2.5">Your documents</h2>
        <p className="text-[14px] text-gray-800 leading-relaxed font-normal mb-3">
          This is the list of documents you need to submit in order to apply. You cannot proceed until each file has been uploaded. Select the question mark button to learn more about each document.
        </p>
        <p className="mb-3">
          <span className="text-[#2572b5] underline font-medium hover:text-blue-800 cursor-pointer text-[14px] flex items-center gap-1">
            Are you having difficulty downloading a form? <ExternalLink className="w-3.5 h-3.5 inline" />
          </span>
        </p>
        <p className="text-[13.5px] text-gray-700 leading-relaxed font-normal mb-4 italic">
          Versions of application forms for study permits dated November 2023 (11-2023), work permits dated November 2013 (11-2013), or later, and applications for temporary resident visas dated March 2014 (03-2014), or later, can only be uploaded to the IRCC Portal.
        </p>
      </div>

      {/* Note text box exactly as shown in screenshot */}
      <div className="bg-[#f9f9f9] border border-gray-300 p-4 mb-8 text-[13.5px] text-gray-800 leading-relaxed font-normal">
        <p className="mb-2">
          <strong>Note:</strong> You are responsible for ensuring that the documents you submit are correct. Carefully review the documents you have attached to this application. A decision concerning your application will be made based upon the information you submit.
        </p>
        <p className="mb-2">
          You will not be able to make changes to your application once it has been submitted.
        </p>
        <p>
          Please ensure that you scan and attach all relevant documents to your online submission. Any documents received by mail related to this application will not be considered.
        </p>
      </div>

      {/* Table for Documents requested by the officer */}
      {selectedApp.requestedDocuments && selectedApp.requestedDocuments.length > 0 && (
        <div className="mb-8">
          <div className="bg-[#af3c43] text-white font-bold text-[18px] px-4 py-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-white" />
              Documents Requested by the Officer
            </span>
            <span className="bg-white text-[#af3c43] text-xs font-bold px-2.5 py-0.5 rounded-full select-none uppercase tracking-wider">Action Required</span>
          </div>
          <div className="bg-[#f5f5f5] font-semibold text-[15px] px-4 py-2 border-l border-r border-gray-300 text-gray-800">
            Additional requested documents
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 min-w-[700px]">
              <thead>
                <tr className="bg-[#e8e8e8] border-b border-gray-300 text-[13.5px] text-gray-800 text-left font-bold">
                  <th className="py-2.5 px-3 border-r border-gray-300 w-36">Status / Details</th>
                  <th className="py-2.5 px-3 border-r border-gray-300">Document name</th>
                  <th className="py-2.5 px-3 border-r border-gray-300 text-center w-24">Instructions</th>
                  <th className="py-2.5 px-3 text-center w-40">Options</th>
                </tr>
              </thead>
              <tbody>
                {selectedApp.requestedDocuments.map((reqDoc, idx) => {
                  const status = getDocumentStatus(reqDoc.name);
                  const displayStatus = reqDoc.status || 'Pending';
                  
                  return (
                    <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50 text-[13px]">
                      {/* Details Column */}
                      <td className="py-2.5 px-3 border-r border-gray-300 font-normal">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block text-center min-w-[90px] ${
                          displayStatus === 'Received' ? 'bg-green-100 text-[#3c763d] border border-green-300' :
                          displayStatus === 'Submitted' ? 'bg-blue-100 text-[#31708f] border border-blue-300' :
                          'bg-yellow-100 text-[#8a6d3b] border border-yellow-300'
                        }`}>
                          {displayStatus === 'Received' ? 'Received' : (displayStatus === 'Submitted' ? 'Submitted' : 'Pending')}
                        </span>
                      </td>

                      {/* Document name Column */}
                      <td className="py-2.5 px-3 border-r border-gray-300">
                        <div className="font-bold text-gray-900 text-[14px]">{reqDoc.name}</div>
                        {reqDoc.remarks && (
                          <div className="text-[12px] text-[#8a6d3b] mt-1 bg-yellow-50/50 p-2 border border-yellow-100 rounded leading-relaxed">
                            <strong>Officer Remarks:</strong> {reqDoc.remarks}
                          </div>
                        )}
                        {status.uploaded && (
                          <div className="text-[11.5px] text-[#31708f] mt-1.5 font-mono break-all bg-sky-50/50 p-1.5 border border-sky-100 rounded">
                            Attached file: <strong>{status.fileName}</strong> ({status.date} at {status.time})
                          </div>
                        )}
                      </td>

                      {/* Instructions Column */}
                      <td className="py-2.5 px-3 border-r border-gray-300 text-center w-20 select-none relative">
                        <button
                          onClick={() => setActiveHelp(activeHelp === `req-${idx}` ? null : `req-${idx}`)}
                          className="text-[#2572b5] hover:text-[#1c5485] focus:outline-none transition-colors"
                          title="Click for instructions"
                        >
                          <HelpCircle className="w-5 h-5 mx-auto" />
                        </button>
                        {activeHelp === `req-${idx}` && (
                          <div className="absolute right-0 z-20 mt-2 p-3 bg-white border border-gray-300 shadow-lg text-left text-xs w-64 rounded text-gray-800 leading-relaxed">
                            <h4 className="font-bold border-b border-gray-200 pb-1 mb-1 text-gray-900">{reqDoc.name} Instructions:</h4>
                            <p className="mb-2">This is an additional document explicitly requested by the immigration officer reviewing your application.</p>
                            <p>Please upload a clear scan/copy. PDF, JPG, PNG, or DOC format are supported (max 4MB).</p>
                            <button
                              onClick={() => setActiveHelp(null)}
                              className="mt-2 text-[#2572b5] underline font-bold float-right"
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Options Column */}
                      <td className="py-2.5 px-3 w-40 text-center">
                        {displayStatus === 'Received' ? (
                          <span className="text-gray-500 font-bold text-xs flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Approved & Received
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setUploadingItemKey(`req-${idx}`);
                                const input = fileInputRefs.current[`req-${idx}`];
                                if (input) {
                                  input.click();
                                }
                              }}
                              className="bg-[#2b3e50] hover:bg-[#1a2530] text-white text-[12.5px] px-3 py-1.5 font-semibold transition-colors shadow-sm focus:outline-none flex items-center justify-center gap-1.5 mx-auto rounded-none w-full"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              {status.uploaded ? 'Re-upload' : 'Upload file'}
                            </button>
                            <input
                              type="file"
                              ref={el => fileInputRefs.current[`req-${idx}`] = el}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const now = new Date();
                                const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                                const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                                // Build the new document entry
                                const newDoc = {
                                  name: file.name,
                                  category: reqDoc.name,
                                  date: dateStr,
                                  time: timeStr
                                };

                                // Append to existing documents or replace if already exists
                                const currentDocs = selectedApp.documents || [];
                                const filteredDocs = currentDocs.filter(d => d.category !== reqDoc.name);
                                const updatedDocs = [newDoc, ...filteredDocs];

                                // Add timeline event
                                const newTimelineEvent = {
                                  id: `evt-checklist-${Date.now()}`,
                                  date: `${dateStr} ${timeStr}`,
                                  time: timeStr,
                                  title: `Uploaded requested document: ${reqDoc.name}`,
                                  action: `Checklist Upload`,
                                  status: `Completed`,
                                  details: `File: ${file.name}`
                                };
                                const updatedTimeline = [newTimelineEvent, ...(selectedApp.timeline || [])];

                                // Update requested document status to Submitted
                                const updatedRequested = selectedApp.requestedDocuments.map((r, rIdx) => {
                                  if (rIdx === idx) {
                                    return {
                                      ...r,
                                      status: 'Submitted' as const,
                                      dateUpdated: dateStr,
                                      remarks: `Submitted on ${dateStr} via checklist.`
                                    };
                                  }
                                  return r;
                                });

                                try {
                                  await updateApplication(selectedApp.id, {
                                    documents: updatedDocs,
                                    timeline: updatedTimeline,
                                    requestedDocuments: updatedRequested
                                  });
                                  alert(`Successfully uploaded "${file.name}" for requested document "${reqDoc.name}".`);
                                } catch (err) {
                                  console.error(err);
                                  alert('Failed to upload document. Please try again.');
                                } finally {
                                  setUploadingItemKey(null);
                                }
                              }}
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table 1: Application Form(s) */}
      <div className="mb-8">
        <div className="bg-[#2572b5] text-white font-bold text-[18px] px-4 py-2 flex items-center justify-between">
          <span>Application Form(s)</span>
        </div>
        <div className="bg-[#f5f5f5] font-semibold text-[15px] px-4 py-2 border-l border-r border-gray-300 text-gray-800">
          Application Form(s)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 min-w-[700px]">
            <thead>
              <tr className="bg-[#e8e8e8] border-b border-gray-300 text-[13.5px] text-gray-800 text-left">
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold w-36">Details</th>
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold">Document name</th>
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold text-center w-24">Instructions</th>
                <th className="py-2.5 px-3 font-bold text-center w-40">Options</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRows(formItems)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Supporting documents */}
      <div className="mb-8">
        <div className="bg-[#2572b5] text-white font-bold text-[18px] px-4 py-2">
          <span>Supporting documents</span>
        </div>
        <div className="bg-[#f5f5f5] font-semibold text-[15px] px-4 py-2 border-l border-r border-gray-300 text-gray-800">
          Supporting documents
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 min-w-[700px]">
            <thead>
              <tr className="bg-[#e8e8e8] border-b border-gray-300 text-[13.5px] text-gray-800 text-left">
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold w-36">Details</th>
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold">Document name</th>
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold text-center w-24">Instructions</th>
                <th className="py-2.5 px-3 font-bold text-center w-40">Options</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRows(supportingItems)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 3: Optional documents */}
      <div className="mb-8">
        <div className="bg-[#2572b5] text-white font-bold text-[18px] px-4 py-2">
          <span>Optional documents</span>
        </div>
        <div className="bg-[#f5f5f5] font-semibold text-[15px] px-4 py-2 border-l border-r border-gray-300 text-gray-800">
          Optional documents
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 min-w-[700px]">
            <thead>
              <tr className="bg-[#e8e8e8] border-b border-gray-300 text-[13.5px] text-gray-800 text-left">
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold w-36">Details</th>
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold">Document name</th>
                <th className="py-2.5 px-3 border-r border-gray-300 font-bold text-center w-24">Instructions</th>
                <th className="py-2.5 px-3 font-bold text-center w-40">Options</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRows(optionalItems)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 4: Fees */}
      <div className="mb-10">
        <div className="bg-[#2572b5] text-white font-bold text-[18px] px-4 py-2">
          <span>Fees</span>
        </div>
        <div className="bg-[#f5f5f5] font-semibold text-[15px] px-4 py-2 border-l border-r border-gray-300 text-gray-800">
          Fees
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-left text-[13.5px] min-w-[700px]">
            <thead>
              <tr className="bg-[#e8e8e8] border-b border-gray-300 text-gray-800 font-bold">
                <th className="py-2.5 px-3 border-r border-gray-300">Application</th>
                <th className="py-2.5 px-3 border-r border-gray-300 text-center w-28">Quantity</th>
                <th className="py-2.5 px-3 border-r border-gray-300 text-right w-44">Price (CAD) per unit</th>
                <th className="py-2.5 px-3 text-right w-44">Total (CAD)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300 text-gray-800">
                <td className="py-2.5 px-3 border-r border-gray-300">Visitor (includes SE, ME and EXT)</td>
                <td className="py-2.5 px-3 border-r border-gray-300 text-center">1</td>
                <td className="py-2.5 px-3 border-r border-gray-300 text-right">$100</td>
                <td className="py-2.5 px-3 text-right font-medium">$100</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="text-[12.5px] text-gray-600 mt-2 italic leading-relaxed">
          The fee shown is an estimate based on the fees in effect on the day that this Personal Reference Code is issued. The actual fees to be paid will be calculated on the day of submission.
        </p>

        {/* Total Box */}
        <div className="flex justify-end mt-4 text-[16px] text-gray-900">
          <div className="border border-gray-300 p-3 bg-[#fdfdfd] min-w-[280px]">
            <div className="flex justify-between font-bold">
              <span>Total price (CAD)</span>
              <span>$100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Collapsible Help Accordions */}
      <div className="border-t border-gray-300 pt-6 space-y-3 mb-8 text-[14px]">
        {/* FAQ 1 */}
        <div className="border-b border-gray-200 pb-3">
          <button
            onClick={() => toggleFAQ('save')}
            className="text-[#2572b5] font-bold underline hover:text-blue-800 text-left focus:outline-none w-full"
          >
            Can I save my application and return to complete it later?
          </button>
          {expandedFAQ.save && (
            <div className="mt-2 text-gray-700 leading-relaxed pl-2 border-l-2 border-gray-300">
              Yes, any document you upload is automatically synced and saved to your application dossier in real-time. You can safely sign out of your account or navigate home and return to this checklist page at any time to complete your uploads.
            </div>
          )}
        </div>

        {/* FAQ 2 */}
        <div className="border-b border-gray-200 pb-3">
          <button
            onClick={() => toggleFAQ('upload')}
            className="text-[#2572b5] font-bold underline hover:text-blue-800 text-left focus:outline-none w-full"
          >
            How do I upload my documents?
          </button>
          {expandedFAQ.upload && (
            <div className="mt-2 text-gray-700 leading-relaxed pl-2 border-l-2 border-gray-300">
              Simply click the dark "Upload file" button on the right-hand column corresponding to the document type. This will open your device's native file selector. Select the document, and it will upload and update to "Provided" status automatically.
            </div>
          )}
        </div>

        {/* FAQ 3 */}
        <div className="border-b border-gray-200 pb-3">
          <button
            onClick={() => toggleFAQ('size')}
            className="text-[#2572b5] font-bold underline hover:text-blue-800 text-left focus:outline-none w-full"
          >
            My documents are too large to upload. How do I reduce the file size?
          </button>
          {expandedFAQ.size && (
            <div className="mt-2 text-gray-700 leading-relaxed pl-2 border-l-2 border-gray-300">
              Try converting colored scans to grayscale, saving PDF documents using the "Optimize" or "Reduce File Size" setting in Adobe Acrobat, or compressing image files to JPG with slightly lower quality settings before uploading.
            </div>
          )}
        </div>
      </div>

      {/* Return to application details button */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate(`/application/${selectedApp.id}`)}
          className="bg-gray-100 border border-gray-400 text-gray-800 hover:bg-gray-200 text-[13.5px] font-bold px-4 py-2 cursor-pointer transition-colors"
        >
          &larr; Return to Application Details
        </button>
      </div>

    </main>
  );
}
