import React, { useState, useMemo } from 'react';
import { useApp, ApplicationInfo } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, applications, logout } = useApp();
  const navigate = useNavigate();

  // Search, Pagination, and Sort state for Table 1 (Submitted Applications)
  const [searchTerm1, setSearchTerm1] = useState('');
  const [pageSize1, setPageSize1] = useState(5);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [sortField1, setSortField1] = useState<keyof ApplicationInfo | 'applicantName' | 'dateSubmitted'>('dateSubmitted');
  const [sortDir1, setSortDir1] = useState<'asc' | 'desc'>('desc');

  // Search, Pagination, and Sort state for Table 2 (Unsubmitted Applications)
  const [searchTerm2, setSearchTerm2] = useState('');
  const [pageSize2, setPageSize2] = useState(5);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [sortField2, setSortField2] = useState<'type' | 'dateCreated' | 'daysLeft' | 'dateSaved'>('dateCreated');
  const [sortDir2, setSortDir2] = useState<'asc' | 'desc'>('desc');

  // Static or state-driven empty list for unsubmitted/draft applications
  const unsubmittedApps = useMemo<any[]>(() => [], []);

  const safeApplications = useMemo(() => {
    return Array.isArray(applications) ? applications : [];
  }, [applications]);

  // Handle Sort Toggle for Table 1
  const handleSort1 = (field: keyof ApplicationInfo | 'applicantName' | 'dateSubmitted') => {
    if (sortField1 === field) {
      setSortDir1(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField1(field);
      setSortDir1('desc'); // Default to descending
    }
    setCurrentPage1(1);
  };

  // Handle Sort Toggle for Table 2
  const handleSort2 = (field: 'type' | 'dateCreated' | 'daysLeft' | 'dateSaved') => {
    if (sortField2 === field) {
      setSortDir2(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField2(field);
      setSortDir2('desc');
    }
    setCurrentPage2(1);
  };

  // Filtered & Sorted Applications for Table 1
  const processedApps1 = useMemo(() => {
    let result = [...safeApplications];

    // 1. Filter
    if (searchTerm1.trim()) {
      const term = searchTerm1.toLowerCase().trim();
      result = result.filter(app => {
        const typeStr = (app.type || '').toLowerCase();
        const idStr = (app.id || '').toLowerCase();
        const nameStr = (app.fullName || user?.name || 'ChatWithOlu Webinar').toLowerCase();
        const statusStr = (app.status || '').toLowerCase();
        return typeStr.includes(term) || idStr.includes(term) || nameStr.includes(term) || statusStr.includes(term);
      });
    }

    // 2. Sort
    result.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (sortField1 === 'applicantName') {
        valA = a.fullName || user?.name || 'ChatWithOlu Webinar';
        valB = b.fullName || user?.name || 'ChatWithOlu Webinar';
      } else if (sortField1 === 'dateSubmitted') {
        valA = a.dateSubmitted || a.dateCreated || '';
        valB = b.dateSubmitted || b.dateCreated || '';
      } else {
        valA = a[sortField1] || '';
        valB = b[sortField1] || '';
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDir1 === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir1 === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [safeApplications, searchTerm1, sortField1, sortDir1, user?.name]);

  // Paginated Applications for Table 1
  const paginatedApps1 = useMemo(() => {
    const startIndex = (currentPage1 - 1) * pageSize1;
    return processedApps1.slice(startIndex, startIndex + pageSize1);
  }, [processedApps1, currentPage1, pageSize1]);

  const totalPages1 = Math.ceil(processedApps1.length / pageSize1) || 1;

  // Filtered & Sorted Applications for Table 2 (Unsubmitted)
  const processedApps2 = useMemo(() => {
    let result = [...unsubmittedApps];

    if (searchTerm2.trim()) {
      const term = searchTerm2.toLowerCase().trim();
      result = result.filter(app => {
        const typeStr = (app.type || '').toLowerCase();
        return typeStr.includes(term);
      });
    }

    return result;
  }, [unsubmittedApps, searchTerm2]);

  const paginatedApps2 = useMemo(() => {
    const startIndex = (currentPage2 - 1) * pageSize2;
    return processedApps2.slice(startIndex, startIndex + pageSize2);
  }, [processedApps2, currentPage2, pageSize2]);

  const totalPages2 = Math.ceil(processedApps2.length / pageSize2) || 1;

  const formatSubmittedDate = (dateStr: string) => {
    if (!dateStr) return '';
    // If it already has letters (like 'August 2, 2023'), return it as is
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

  const userName = (user?.name || 'TESTIMONY ABIOLA NASIRU').toUpperCase();

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-4 flex-grow font-sans text-[#333]">
      
      {/* Top Breadcrumb & User Menu */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[13px] mb-6 border-b border-gray-200 pb-3">
        <div className="text-[#2572b4] mb-3 sm:mb-0 font-normal">
          <span className="underline cursor-pointer hover:text-[#05355c]" onClick={() => navigate('/')}>Home</span>
          <span className="no-underline text-gray-400 px-2">&gt;</span>
          <span className="text-gray-600 font-normal">Your account</span>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1 items-center text-[13.5px] text-gray-700">
          <span>Signed in as <span className="font-normal">{userName}</span></span>
          <span className="text-gray-300 px-1">|</span>
          <span className="text-[#2572b4] underline cursor-pointer hover:text-[#05355c] font-normal" onClick={() => navigate('/dashboard')}>Account home</span>
          <span className="text-gray-300 px-1">|</span>
          <span className="text-[#2572b4] underline cursor-pointer hover:text-[#05355c] font-normal" onClick={() => navigate('/dashboard')}>Account profile</span>
          <span className="text-gray-300 px-1">|</span>
          <span className="text-gray-700 hover:text-black cursor-pointer font-normal" onClick={() => navigate('/immigration-citizenship')}>Help</span>
          <span className="text-gray-300 px-1">|</span>
          <span className="text-[#2572b4] underline cursor-pointer hover:text-[#05355c] font-normal" onClick={logout}>Logout</span>
        </div>
      </div>

      {/* Account Owner Page Title with the Canada.ca Red Accent Line */}
      <div className="mb-6">
        <h1 className="text-[32px] font-normal text-[#333] tracking-tight leading-tight">
          {userName}'s account
        </h1>
        <hr className="border-gray-300 mt-3" />
      </div>

      {/* Section 1: View the applications you submitted */}
      <section className="mb-12">
        <h2 className="text-[22px] font-bold text-[#333] mb-1">
          View the applications you submitted
        </h2>
        <p className="text-[14px] text-gray-700 mb-4 leading-normal">
          Review, check the status or read messages about your submitted application.
        </p>

        {/* Search and entries display row - Styled exactly like DataTables in screenshot */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[14px] text-gray-800 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">Search:</span>
            <input
              id="search-table-1"
              type="text"
              value={searchTerm1}
              onChange={(e) => {
                setSearchTerm1(e.target.value);
                setCurrentPage1(1);
              }}
              className="border border-gray-400 px-2 py-0.5 bg-white text-[14px] w-48 focus:outline-none rounded-none"
            />
          </div>
          <div className="flex items-center gap-1 text-[13.5px]">
            <span>
              Showing {processedApps1.length === 0 ? '0 to 0' : `${(currentPage1 - 1) * pageSize1 + 1} to ${Math.min(currentPage1 * pageSize1, processedApps1.length)}`} of {processedApps1.length} entries
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="font-bold">Show</span>
            <select
              id="pagesize-table-1"
              value={pageSize1}
              onChange={(e) => {
                setPageSize1(Number(e.target.value));
                setCurrentPage1(1);
              }}
              className="border border-gray-300 bg-white px-1 py-0.5 font-normal rounded-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* Table 1 - Clean Minimal Style, No Vertical Borders */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-[13.5px]">
            <thead>
              <tr className="border-t border-b border-[#333] text-gray-900 select-none">
                <th 
                  onClick={() => handleSort1('type')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField1 === 'type' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Application type {sortField1 === 'type' ? (sortDir1 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th 
                  onClick={() => handleSort1('id')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField1 === 'id' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Application number {sortField1 === 'id' ? (sortDir1 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th 
                  onClick={() => handleSort1('applicantName')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField1 === 'applicantName' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Applicant name {sortField1 === 'applicantName' ? (sortDir1 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th 
                  onClick={() => handleSort1('dateSubmitted')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField1 === 'dateSubmitted' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Date submitted {sortField1 === 'dateSubmitted' ? (sortDir1 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th 
                  onClick={() => handleSort1('status')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField1 === 'status' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Current status {sortField1 === 'status' ? (sortDir1 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th 
                  onClick={() => handleSort1('messages')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField1 === 'messages' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Messages {sortField1 === 'messages' ? (sortDir1 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th className="py-2 px-3 font-bold text-left whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedApps1.length > 0 ? (
                paginatedApps1.map((app) => {
                  const isRefused = app.status?.toLowerCase() === 'refused';
                  return (
                    <tr key={app.id} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-normal text-gray-800 uppercase">{app.type || 'WORK PERMIT'}</td>
                      <td className="py-2.5 px-3 app-number-font text-[16px]">{app.id}</td>
                      <td className="py-2.5 px-3 text-gray-800 uppercase">{app.fullName || user?.name || 'ChatWithOlu Webinar'}</td>
                      <td className="py-2.5 px-3 text-gray-800 whitespace-nowrap">
                        {formatSubmittedDate(app.dateSubmitted || app.dateCreated || '2026-03-18')}
                      </td>
                      <td className="py-2.5 px-3 font-normal text-gray-800">{app.status}</td>
                      <td className="py-2.5 px-3 text-gray-800 font-normal">
                        {app.messages && app.messages.some(m => !m.isRead) ? (
                          <span>New</span>
                        ) : (
                          <span>Read</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => navigate(`/application/${app.id}`)}
                          className="text-[#2572b4] underline font-normal hover:text-[#05355c] text-left cursor-pointer"
                        >
                          Check full application status
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-700 font-normal border-b border-gray-300">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Center pagination box exactly matching screenshot */}
        <div className="flex justify-center my-4">
          <button className="bg-[#2572b4] hover:bg-[#1a4e7b] text-white font-bold w-9 h-9 flex items-center justify-center rounded-[4px] text-[14px]">
            1
          </button>
        </div>

        {/* Paper Application Link Box */}
        <p className="text-[14px] text-gray-700 mt-4 leading-relaxed font-normal">
          Did you apply on paper or don't see your online application in your account?{' '}
          <span 
            className="underline text-[#2572b4] font-normal cursor-pointer hover:text-[#05355c]"
            onClick={() => navigate('/immigration-citizenship')}
          >
            Add (link) your application to your account
          </span>{' '}
          to access it and check your status online.
        </p>
      </section>

      {/* Section 2: Continue an application you haven't submitted */}
      <section className="mb-12">
        <h2 className="text-[22px] font-bold text-[#333] mb-1">
          Continue an application you haven't submitted
        </h2>
        <p className="text-[14px] text-gray-700 mb-4 leading-normal">
          Continue working on an application or profile you haven't submitted or delete it from your account.
        </p>

        {/* Search and entries display row - Match screenshot */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[14px] text-gray-800 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">Search:</span>
            <input
              id="search-table-2"
              type="text"
              value={searchTerm2}
              onChange={(e) => {
                setSearchTerm2(e.target.value);
                setCurrentPage2(1);
              }}
              className="border border-gray-400 px-2 py-0.5 bg-white text-[14px] w-48 focus:outline-none rounded-none"
            />
          </div>
          <div className="flex items-center gap-1 text-[13.5px]">
            <span>
              Showing {processedApps2.length === 0 ? '0 to 0' : `${(currentPage2 - 1) * pageSize2 + 1} to ${Math.min(currentPage2 * pageSize2, processedApps2.length)}`} of {processedApps2.length} entries
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="font-bold">Show</span>
            <select
              id="pagesize-table-2"
              value={pageSize2}
              onChange={(e) => {
                setPageSize2(Number(e.target.value));
                setCurrentPage2(1);
              }}
              className="border border-gray-300 bg-white px-1 py-0.5 font-normal rounded-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* Table 2 - Clean Minimal Style, No Vertical Borders */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-[13.5px]">
            <thead>
              <tr className="border-t border-b border-[#333] text-gray-900 select-none">
                <th 
                  onClick={() => handleSort2('type')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField2 === 'type' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Application type {sortField2 === 'type' ? (sortDir2 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th 
                  onClick={() => handleSort2('dateCreated')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField2 === 'dateCreated' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Date Created {sortField2 === 'dateCreated' ? (sortDir2 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th 
                  onClick={() => handleSort2('daysLeft')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField2 === 'daysLeft' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Days left to submit {sortField2 === 'daysLeft' ? (sortDir2 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th 
                  onClick={() => handleSort2('dateSaved')}
                  className={`py-2 px-3 font-bold cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left ${sortField2 === 'dateSaved' ? 'bg-[#ebebeb]' : ''}`}
                >
                  Date last saved {sortField2 === 'dateSaved' ? (sortDir2 === 'asc' ? '↑' : '↓') : '⇅'}
                </th>
                <th className="py-2 px-3 font-bold text-left whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedApps2.length > 0 ? (
                paginatedApps2.map((app, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-normal text-gray-800 uppercase">{app.type}</td>
                    <td className="py-2.5 px-3 text-gray-800">{app.dateCreated}</td>
                    <td className="py-2.5 px-3 text-gray-800">{app.daysLeft}</td>
                    <td className="py-2.5 px-3 text-gray-800">{app.dateSaved}</td>
                    <td className="py-2.5 px-3">
                      <button className="text-[#2572b4] underline font-normal hover:text-[#05355c] text-left cursor-pointer">
                        Continue Application
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-700 font-normal border-b border-gray-300">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Start an application */}
      <section className="mb-8">
        <h2 className="text-[22px] font-bold text-[#333] mb-6 border-b border-gray-200 pb-2">
          Start an application
        </h2>

        {/* 3-Column Grid for options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[14px]">
          
          {/* Column 1 */}
          <div className="space-y-2">
            <span 
              onClick={() => navigate('/immigration-citizenship')}
              className="text-[#2572b4] hover:text-[#05355c] underline font-normal text-[16px] block cursor-pointer leading-snug"
            >
              Apply to come to Canada
            </span>
            <p className="text-gray-700 leading-relaxed font-normal">
              Includes applications for visitor visas, work and study permits, Express Entry and International Experience Canada. You will need your personal reference code if you have one.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <span 
              onClick={() => navigate('/benefits')}
              className="text-[#2572b4] hover:text-[#05355c] underline font-normal text-[16px] block cursor-pointer leading-snug"
            >
              Refugees: Apply for temporary health care benefits
            </span>
            <p className="text-gray-700 leading-relaxed font-normal">
              Use this application if you are a protected person or refugee claimant who wants to apply for the Interim Federal Health Program.
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            <span 
              onClick={() => navigate('/immigration-citizenship/citizenship')}
              className="text-[#2572b4] hover:text-[#05355c] underline font-normal text-[16px] block cursor-pointer leading-snug"
            >
              Citizenship: Apply for a search or proof of citizenship
            </span>
            <p className="text-gray-700 leading-relaxed font-normal">
              Use this application to apply for proof of citizenship (citizenship certificate) or to search citizenship records.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
