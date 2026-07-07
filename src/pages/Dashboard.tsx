import React, { useState, useMemo } from 'react';
import { useApp, ApplicationInfo } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, applications, logout } = useApp();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

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

  const safeApplications = useMemo(() => {
    return Array.isArray(applications) ? applications : [];
  }, [applications]);

  const unsubmittedApps = useMemo(() => {
    return safeApplications.filter(app => app.status === 'Draft' || app.status?.toLowerCase() === 'draft');
  }, [safeApplications]);

  const submittedApps = useMemo(() => {
    return safeApplications.filter(app => app.status !== 'Draft' && app.status?.toLowerCase() !== 'draft');
  }, [safeApplications]);

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
    let result = [...submittedApps];

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
  }, [submittedApps, searchTerm1, sortField1, sortDir1, user?.name]);

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

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField2] || '';
      let valB = b[sortField2] || '';

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDir2 === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir2 === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [unsubmittedApps, searchTerm2, sortField2, sortDir2]);

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

  const renderSortArrows = (field: string, currentField: string, direction: 'asc' | 'desc') => {
    const isSorted = field === currentField;
    if (isSorted) {
      if (direction === 'asc') {
        return (
          <span className="block mt-0.5 text-left font-bold text-[#333333] text-[15px] select-none leading-none">
            ↑
          </span>
        );
      } else {
        return (
          <span className="block mt-0.5 text-left font-bold text-[#333333] text-[15px] select-none leading-none">
            ↓
          </span>
        );
      }
    }
    return (
      <span className="block mt-0.5 text-left font-bold text-[#333333]/80 text-[15px] select-none leading-none tracking-tighter">
        ↓↑
      </span>
    );
  };

  const formatNameWithBreak = (fullName?: string) => {
    const name = (fullName || user?.name || 'TESTIMONY ABIOLA NASIRU').trim();
    const parts = name.split(/\s+/);
    if (parts.length >= 3) {
      const splitIndex = parts.length === 3 ? 1 : Math.ceil(parts.length / 2);
      const firstPart = parts.slice(0, splitIndex).join(' ');
      const secondPart = parts.slice(splitIndex).join(' ');
      return (
        <>
          {firstPart.toUpperCase()}
          <br />
          {secondPart.toUpperCase()}
        </>
      );
    }
    return name.toUpperCase();
  };

  const userName = (user?.name || 'TESTIMONY ABIOLA NASIRU').toUpperCase();

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-4 flex-grow font-sans text-[#333]">
      
      {/* Top User Menu */}
      <div className="flex justify-end items-center text-[13.5px] mt-2 mb-10">
        <div className="flex flex-wrap items-center text-[14px] text-[#333] justify-end w-full">
          <span className="mr-8">Signed in as {userName}</span>
          <span className="text-[#551A8B] underline cursor-pointer hover:text-[#05355c] font-normal" onClick={() => navigate('/dashboard')}>Account home</span>
          <span className="text-[#333] px-1.5">|</span>
          <span className="text-[#551A8B] underline cursor-pointer hover:text-[#05355c] font-normal" onClick={() => navigate('/dashboard')}>Account profile</span>
          <span className="text-[#333] px-1.5">|</span>
          <span className="text-[#005a00] underline cursor-pointer hover:text-[#004000] font-normal" onClick={() => navigate('/immigration-citizenship')}>Help</span>
          <span className="text-[#333] px-1.5">|</span>
          <span className="text-[#005a00] underline cursor-pointer hover:text-[#004000] font-normal" onClick={logout}>Logout</span>
        </div>
      </div>

      {/* Account Owner Page Title */}
      <div className="mb-8">
        <h1 className="text-[34px] font-medium text-[#333] tracking-tight leading-none pb-2 border-b-[1px] border-[#af3c43]">
          {userName}'s account
        </h1>
      </div>

      {/* Section 1: View the applications you submitted */}
      <section className="mb-12">
        <h2 className="text-[24px] font-bold text-[#333] mb-1">
          View the applications you submitted
        </h2>
        <p className="text-[15px] text-[#333] mb-6 leading-relaxed">
          Review, check the status or read messages about your submitted application.
        </p>

        {/* Search and entries display row - Styled exactly like DataTables in screenshot */}
        <div className="flex flex-row justify-start items-center text-[15px] text-[#333] mb-3 gap-x-6">
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
              className="border border-black px-2 py-1 bg-white text-[14.5px] w-[220px] h-[32px] focus:outline-none rounded-none font-normal"
            />
          </div>
          <div className="flex items-center gap-1 text-[14.5px] text-[#333]">
            <span>
              Showing {processedApps1.length === 0 ? '0 to 0' : `${(currentPage1 - 1) * pageSize1 + 1} to ${Math.min(currentPage1 * pageSize1, processedApps1.length)}`} of {processedApps1.length} entries
            </span>
            <span className="mx-1.5 text-[#333]">|</span>
            <span className="font-bold">Show</span>
            <select
              id="pagesize-table-1"
              value={pageSize1}
              onChange={(e) => {
                setPageSize1(Number(e.target.value));
                setCurrentPage1(1);
              }}
              className="border border-[#767676] bg-white px-2 py-1 h-[32px] font-normal rounded-none text-[14.5px] cursor-pointer mx-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* Table 1 - Clean Minimal Style */}
        <div className="overflow-x-auto w-full border-b-[1px] border-[#666]">
          <table className="w-full text-left border-collapse text-[14px] min-w-[950px]">
            <thead>
              <tr className="border-b-[1px] border-[#666] text-[#333] select-none text-[14px]">
                <th 
                  onClick={() => handleSort1('type')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField1 === 'type' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Application</div>
                  <div className="flex items-center gap-1">
                    <span>type</span>
                    {sortField1 === 'type' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir1 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort1('id')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField1 === 'id' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Application</div>
                  <div className="flex items-center gap-1">
                    <span>number</span>
                    {sortField1 === 'id' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir1 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort1('applicantName')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField1 === 'applicantName' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Applicant name</div>
                  <div>
                    {sortField1 === 'applicantName' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir1 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort1('dateSubmitted')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField1 === 'dateSubmitted' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Date submitted</div>
                  <div>
                    {sortField1 === 'dateSubmitted' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir1 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort1('status')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField1 === 'status' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Current</div>
                  <div className="flex items-center gap-1">
                    <span>status</span>
                    {sortField1 === 'status' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir1 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort1('messages')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField1 === 'messages' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Messages</div>
                  <div>
                    {sortField1 === 'messages' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir1 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th className="p-2.5 font-bold text-left select-none bg-white text-[#333]" style={{ verticalAlign: 'bottom' }}>
                  <div>Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedApps1.length > 0 ? (
                paginatedApps1.map((app, idx) => {
                  const isEvenRow = idx % 2 === 1;
                  const rowBgClass = isEvenRow ? 'bg-[#f9f9f9]' : 'bg-white';
                  
                  const getCellBg = (field: string) => {
                    const isSorted = sortField1 === field;
                    if (isEvenRow) {
                      return isSorted ? 'bg-[#f1f1f1]' : 'bg-transparent';
                    } else {
                      return isSorted ? 'bg-[#f5f5f5]' : 'bg-transparent';
                    }
                  };

                  return (
                    <tr key={app.id} className={`${rowBgClass} hover:bg-gray-100/50 border-b border-gray-200`}>
                      <td className={`p-2.5 text-[#333] font-normal align-top ${getCellBg('type')}`} style={{ verticalAlign: 'top' }}>
                        {app.type === 'Online Application' || app.type?.toLowerCase() === 'online application' ? (
                          <>Online<br />Application</>
                        ) : (
                          app.type || 'Online Application'
                        )}
                      </td>
                      <td className={`p-2.5 font-normal text-[#333] align-top ${getCellBg('id')}`} style={{ verticalAlign: 'top' }}>
                        {app.id}
                      </td>
                      <td className={`p-2.5 font-normal text-[#333] align-top ${getCellBg('applicantName')}`} style={{ verticalAlign: 'top' }}>
                        {formatNameWithBreak(app.fullName)}
                      </td>
                      <td className={`p-2.5 text-[#333] whitespace-nowrap font-normal align-top ${getCellBg('dateSubmitted')}`} style={{ verticalAlign: 'top' }}>
                        {formatSubmittedDate(app.dateSubmitted || app.dateCreated || '2023-08-02')}
                      </td>
                      <td className={`p-2.5 font-normal text-[#333] align-top ${getCellBg('status')}`} style={{ verticalAlign: 'top' }}>{app.status || 'Refused'}</td>
                      <td className={`p-2.5 text-[#333] font-normal align-top ${getCellBg('messages')}`} style={{ verticalAlign: 'top' }}>
                        {app.messages && app.messages.some(m => !m.isRead) ? (
                          <span>New</span>
                        ) : (
                          <span>Read</span>
                        )}
                      </td>
                      <td className="p-2.5 font-normal align-top" style={{ verticalAlign: 'top' }}>
                        <button
                          onClick={() => navigate(`/application/${app.id}`)}
                          className="text-[#284162] underline font-normal hover:text-[#05355c] text-left cursor-pointer inline"
                        >
                          Check full application status
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-700 font-normal">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Center pagination box exactly matching screenshot */}
        <div className="flex justify-center my-4">
          <button className="bg-[#284162] hover:bg-[#1a4e7b] text-white font-bold w-9 h-9 flex items-center justify-center rounded-[4px] text-[14px]">
            1
          </button>
        </div>

        {/* Paper Application Link Box */}
        <p className="text-[14px] text-[#333] mt-4 leading-relaxed font-normal">
          Did you apply on paper or don't see your online application in your account?{' '}
          <span 
            className="underline text-[#284162] font-normal cursor-pointer hover:text-[#05355c]"
            onClick={() => navigate('/immigration-citizenship')}
          >
            Add (link) your application to your account
          </span>{' '}
          to access it and check your status online.
        </p>
      </section>

      {/* Section 2: Continue an application you haven't submitted */}
      <section className="mb-12">
        <h2 className="text-[24px] font-bold text-[#333] mb-1">
          Continue an application you haven't submitted
        </h2>
        <p className="text-[15px] text-[#333] mb-6 leading-relaxed">
          Continue working on an application or profile you haven't submitted or delete it from your account.
        </p>

        {/* Search and entries display row - Match screenshot */}
        <div className="flex flex-row justify-start items-center text-[15px] text-[#333] mb-3 gap-x-6">
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
              className="border border-black px-2 py-1 bg-white text-[14.5px] w-[220px] h-[32px] focus:outline-none rounded-none font-normal"
            />
          </div>
          <div className="flex items-center gap-1 text-[14.5px] text-[#333]">
            <span>
              Showing {processedApps2.length === 0 ? '0 to 0' : `${(currentPage2 - 1) * pageSize2 + 1} to ${Math.min(currentPage2 * pageSize2, processedApps2.length)}`} of {processedApps2.length} entries
            </span>
            <span className="mx-1.5 text-[#333]">|</span>
            <span className="font-bold">Show</span>
            <select
              id="pagesize-table-2"
              value={pageSize2}
              onChange={(e) => {
                setPageSize2(Number(e.target.value));
                setCurrentPage2(1);
              }}
              className="border border-[#767676] bg-white px-2 py-1 h-[32px] font-normal rounded-none text-[14.5px] cursor-pointer mx-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* Table 2 - Clean Minimal Style */}
        <div className="overflow-x-auto w-full border-b-[1px] border-[#666]">
          <table className="w-full text-left border-collapse text-[14px] min-w-[800px]">
            <thead>
              <tr className="border-b-[1px] border-[#666] text-[#333] select-none text-[14px]">
                <th 
                  onClick={() => handleSort2('type')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField2 === 'type' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Application</div>
                  <div className="flex items-center gap-1">
                    <span>type</span>
                    {sortField2 === 'type' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir2 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort2('dateCreated')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField2 === 'dateCreated' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Date Created</div>
                  <div>
                    {sortField2 === 'dateCreated' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir2 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort2('daysLeft')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField2 === 'daysLeft' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Days left</div>
                  <div className="flex items-center gap-1">
                    <span>to submit</span>
                    {sortField2 === 'daysLeft' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir2 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort2('dateSaved')}
                  className={`p-2.5 font-bold cursor-pointer text-left select-none transition-colors ${sortField2 === 'dateSaved' ? 'bg-[#e6e6e6]' : 'bg-white hover:bg-[#eaeaea]'}`}
                  style={{ verticalAlign: 'bottom' }}
                >
                  <div>Date last</div>
                  <div className="flex items-center gap-1">
                    <span>saved</span>
                    {sortField2 === 'dateSaved' ? (
                      <span className="text-[#333] font-bold ml-1">{sortDir2 === 'asc' ? '↑' : '↓'}</span>
                    ) : (
                      <span className="text-[#666] ml-1 font-normal text-[14px]">↓↑</span>
                    )}
                  </div>
                </th>
                <th className="p-2.5 font-bold text-left select-none bg-white text-[#333]" style={{ verticalAlign: 'bottom' }}>
                  <div>Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedApps2.length > 0 ? (
                paginatedApps2.map((app, idx) => {
                  const isEvenRow = idx % 2 === 1;
                  const rowBgClass = isEvenRow ? 'bg-[#f9f9f9]' : 'bg-white';
                  
                  const getCellBg = (field: string) => {
                    const isSorted = sortField2 === field;
                    if (isEvenRow) {
                      return isSorted ? 'bg-[#f1f1f1]' : 'bg-transparent';
                    } else {
                      return isSorted ? 'bg-[#f5f5f5]' : 'bg-transparent';
                    }
                  };

                  return (
                    <tr key={idx} className={`${rowBgClass} hover:bg-gray-100/50 border-b border-gray-200`}>
                      <td className={`p-2.5 text-[#333] font-normal align-top uppercase ${getCellBg('type')}`} style={{ verticalAlign: 'top' }}>{app.type}</td>
                      <td className={`p-2.5 text-[#333] font-normal align-top ${getCellBg('dateCreated')}`} style={{ verticalAlign: 'top' }}>{app.dateCreated}</td>
                      <td className={`p-2.5 text-[#333] font-normal align-top ${getCellBg('daysLeft')}`} style={{ verticalAlign: 'top' }}>{app.daysLeft}</td>
                      <td className={`p-2.5 text-[#333] font-normal align-top ${getCellBg('dateSaved')}`} style={{ verticalAlign: 'top' }}>{app.dateSaved}</td>
                      <td className="p-2.5 font-normal align-top" style={{ verticalAlign: 'top' }}>
                        <button 
                          onClick={() => navigate(`/application/${app.id}`)}
                          className="text-[#284162] underline font-normal hover:text-[#05355c] text-left cursor-pointer inline"
                        >
                          Continue Application
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#333] font-normal">
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
        <h2 className="text-[24px] font-bold text-[#333] mb-6 border-b border-gray-200 pb-2">
          Start an application
        </h2>

        {/* 3-Column Grid for options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[14px]">
          
          {/* Column 1 */}
          <div className="space-y-2">
            <span 
              onClick={() => navigate('/immigration-citizenship')}
              className="text-[#284162] hover:text-[#05355c] underline font-normal text-[16px] block cursor-pointer leading-snug"
            >
              Apply to come to Canada
            </span>
            <p className="text-[#333] leading-relaxed font-normal">
              Includes applications for visitor visas, work and study permits, Express Entry and International Experience Canada. You will need your personal reference code if you have one.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <span 
              onClick={() => navigate('/benefits')}
              className="text-[#284162] hover:text-[#05355c] underline font-normal text-[16px] block cursor-pointer leading-snug"
            >
              Refugees: Apply for temporary health care benefits
            </span>
            <p className="text-[#333] leading-relaxed font-normal">
              Use this application if you are a protected person or refugee claimant who wants to apply for the Interim Federal Health Program.
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            <span 
              onClick={() => navigate('/immigration-citizenship/citizenship')}
              className="text-[#284162] hover:text-[#05355c] underline font-normal text-[16px] block cursor-pointer leading-snug"
            >
              Citizenship: Apply for a search or proof of citizenship
            </span>
            <p className="text-[#333] leading-relaxed font-normal">
              Use this application to apply for proof of citizenship (citizenship certificate) or to search citizenship records.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
