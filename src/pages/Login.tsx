import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Terminal, ShieldCheck, Key, UserPlus, AlertCircle } from 'lucide-react';

export default function Login() {
  const { currentLang, login } = useApp();
  const navigate = useNavigate();

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLine, setErrorLine] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLine('');

    if (!email.trim() || !password.trim()) {
      setErrorLine(currentLang === 'en' ? 'Please complete all required fields.' : 'Veuillez remplir tous les champs requis.');
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
      login(data.email, data.name || email.split('@')[0]);
      if (data.email.toLowerCase() === 'admin@canada.ca') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorLine(currentLang === 'en' ? 'Network error occurred.' : 'Erreur réseau.');
    }
  };

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-12 md:py-20 flex-grow flex items-center justify-center font-sans">
      
      <div className="w-full max-w-md bg-white border border-gray-400 overflow-hidden" id="login-form-container">
        
        {/* Banner */}
        <div className="bg-[#26374a] text-white p-5 flex items-center gap-2.5">
          <Key className="w-5 h-5 text-gray-200" />
          <div>
            <h2 className="text-base font-bold">
              {currentLang === 'en' ? 'Government Secure Sign-In Partner' : 'Partenaire de connexion sécurisé GC'}
            </h2>
            <span className="text-[10px] uppercase font-bold text-gray-300 block">
              {currentLang === 'en' ? 'Sign In with GCKey' : 'Se connecter via CléGC'}
            </span>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {errorLine && (
            <div className="p-3 bg-red-50 border-l-4 border-red-700 text-xs text-red-900 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <span>{errorLine}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase block">{currentLang === 'en' ? 'Email Address:' : 'Adresse de courriel :'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400 p-2 text-xs bg-white text-[#333] outline-none focus:bg-white focus:border-[#26374a]"
              placeholder="name@domain.ca"
            />
          </div>

          <div className="space-y-1.5 block">
            <label className="text-xs font-bold text-gray-700 uppercase block">{currentLang === 'en' ? 'Password:' : 'Mot de passe :'}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-400 p-2 text-xs bg-white text-[#333] outline-none focus:bg-white focus:border-[#26374a]"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#26374a] hover:bg-[#111820] text-white text-xs font-bold py-2.5 transition-colors cursor-pointer uppercase tracking-wider"
          >
            {currentLang === 'en' ? 'Sign In Key' : 'S\'authentifier'}
          </button>

          <div className="text-center pt-3 border-t border-gray-300 flex flex-col gap-1 text-[11px] text-[#333] font-sans font-semibold">
             <span className="text-gray-500 italic">
               {currentLang === 'en' 
                 ? 'Only authorized applicants with pre-created accounts can sign in.' 
                 : 'Seuls les candidats autorisés avec des comptes pré-créés peuvent se connecter.'}
             </span>
          </div>

        </form>

        <div className="bg-gray-100 p-4 border-t border-gray-300 text-[10px] text-gray-600 leading-relaxed text-center font-bold">
          {currentLang === 'en' 
            ? 'Encryption standards enforced: Session keys expire after 15 minutes of inactivity.'
            : 'Normes de cryptage actives : Les sessions expirent après 15 minutes d\'inactivité.'}
        </div>
      </div>

    </main>
  );
}
