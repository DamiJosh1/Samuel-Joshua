import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Find the start of the return (
start_idx = content.find('  return (\n    <main')

# We'll just replace the `<main>` structure.
# Currently, it has:
# <main ...>
#   <h1 ...>
#   <div className="max-w-xl bg-gray-100 ...> (Create Applicant Profile)
#     ...
#   </div>
#   {loading ? ( ...

# We want to change the top structure.
replacement = '''  return (
    <div className="min-h-screen bg-gray-50 font-sans text-[#333]">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#26374a] flex items-center gap-2">
            <svg className="w-6 h-6 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Immigration Admin
          </h1>
          <div className="flex gap-4">
            <button 
               onClick={() => { setViewMode('profiles'); setSelectedAppId(null); setSelectedProfileEmail(null); }} 
               className={`px-3 py-1.5 text-sm font-bold rounded transition-colors ${viewMode === 'profiles' ? 'bg-[#26374a] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Profiles
            </button>
            <button 
               onClick={() => { setViewMode('applications'); setSelectedAppId(null); setSelectedProfileEmail(null); }} 
               className={`px-3 py-1.5 text-sm font-bold rounded transition-colors ${viewMode === 'applications' ? 'bg-[#26374a] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Applications
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-[350px] xl:w-[400px] flex-shrink-0 space-y-6">
            
            {/* Create Applicant Profile Panel */}
            <div className="bg-white p-5 border border-gray-200 shadow-sm rounded-md">
              <h2 className="text-lg font-bold mb-4 text-[#26374a] border-b border-gray-100 pb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                New Applicant
              </h2>
'''

# The rest of the form needs to be injected. We can extract the form from the original content.
import re
form_match = re.search(r'<form onSubmit=\{handleCreateProfile\}.*?</form>', content, flags=re.DOTALL)
if form_match:
    form_content = form_match.group(0)
    # add to replacement
    replacement += "              " + form_content.replace('\n', '\n              ') + "\n"
    
replacement += '''            </div>
            
            {/* Sidebar List (Profiles or Applications depending on mode) */}
            {(!selectedAppId || showSidebar) && (
              <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-md flex flex-col max-h-[800px]">
'''

# Add the rest of the layout logic. This is getting complex to write as a raw string replacement.
