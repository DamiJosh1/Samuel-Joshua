import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Terminal, ShieldCheck, Key, UserPlus, AlertCircle } from 'lucide-react';

export default function Login() {
  const { currentLang, login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterPage = location.pathname.includes('register');

  // Input states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorLine, setErrorLine] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLine('');

    if (!email.trim() || !password.trim()) {
      setErrorLine(currentLang === 'en' ? 'Please complete all required fields.' : 'Veuillez remplir tous les champs requis.');
      return;
    }

    if (email.trim().toLowerCase() === 'admin@canada.ca' && password !== 'Admin@123') {
      setErrorLine(currentLang === 'en' ? 'Invalid admin password.' : 'Mot de passe administrateur invalide.');
      return;
    }

    if (isRegisterPage && !name.trim()) {
      setErrorLine(currentLang === 'en' ? 'Name is required to register.' : 'Le nom est requis pour s\'inscrire.');
      return;
    }

    // Default username if signing in
    const finalName = isRegisterPage ? name.trim() : email.split('@')[0];

    // Log the user into Context memory
    login(email, finalName);
    if (email.trim().toLowerCase() === 'admin@canada.ca') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-12 md:py-20 flex-grow flex items-center justify-center font-sans">
      
      <div className="w-full max-w-md bg-white border border-gray-250 rounded-lg shadow-sm overflow-hidden" id="login-form-container">
        
        {/* Banner */}
        <div className="bg-[#335075] text-white p-5 flex items-center gap-2.5">
          <Key className="w-5 h-5 text-gray-200" />
          <div>
            <h2 className="text-base font-bold">
              {currentLang === 'en' ? 'Government Secure Sign-In Partner' : 'Partenaire de connexion sécurisé GC'}
            </h2>
            <span className="text-[10px] uppercase font-bold text-gray-300 block">
              {isRegisterPage ? (currentLang === 'en' ? 'Create GCKey' : 'Créer une CléGC') : (currentLang === 'en' ? 'Sign In with GCKey' : 'Se connecter via CléGC')}
            </span>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {errorLine && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-xs text-red-900 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorLine}</span>
            </div>
          )}

          {isRegisterPage && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase block">{currentLang === 'en' ? 'Your Full Name:' : 'Votre nom complet :'}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 text-xs rounded bg-gray-50 text-[#333] outline-none focus:bg-white focus:border-[#335075]"
                placeholder={currentLang === 'en' ? 'e.g. Jean Dupont' : 'ex : Jean Dupont'}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase block">{currentLang === 'en' ? 'Email Address:' : 'Adresse de courriel :'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 text-xs rounded bg-gray-50 text-[#333] outline-none focus:bg-white focus:border-[#335075]"
              placeholder="name@domain.ca"
            />
          </div>

          <div className="space-y-1.5 block">
            <label className="text-xs font-bold text-gray-700 uppercase block">{currentLang === 'en' ? 'Password:' : 'Mot de passe :'}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 text-xs rounded bg-gray-50 text-[#333] outline-none focus:bg-white focus:border-[#335075]"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#335075] hover:bg-[#1c3552] text-white text-xs font-bold py-2.5 rounded transition-colors cursor-pointer uppercase tracking-wider"
          >
            {isRegisterPage ? (currentLang === 'en' ? 'Register Account' : 'Créer mon dossier') : (currentLang === 'en' ? 'Sign In Key' : 'S\'authentifier')}
          </button>

          {/* Switch toggle directions */}
          <div className="text-center pt-3 border-t border-gray-100/60 flex flex-col gap-1 text-[11px] text-gray-500 font-sans font-semibold">
            {isRegisterPage ? (
              <>
                <span>{currentLang === 'en' ? 'Already hold a GCKey credentials profile?' : 'Détenteur d\'un compte CléGC ?'}</span>
                <button
                  type="button"
                  onClick={() => navigate('/auth/login')}
                  className="text-[#2572b4] hover:underline hover:text-[#05355c] cursor-pointer"
                >
                  {currentLang === 'en' ? 'Sign In with Existing Profile' : 'Connectez-vous à votre dossier'}
                </button>
              </>
            ) : (
              <>
                <span>{currentLang === 'en' ? 'New applicant to Canada.ca systems?' : 'Nouvel arrivant sur Canada.ca ?'}</span>
                <button
                  type="button"
                  onClick={() => navigate('/auth/register')}
                  className="text-teal-700 hover:underline hover:text-teal-900 cursor-pointer"
                >
                  {currentLang === 'en' ? 'Create a New GCKey Credentials Account' : 'Créer un identifiant CléGC'}
                </button>
              </>
            )}
          </div>

        </form>

        <div className="bg-gray-50 p-4 border-t text-[10px] text-gray-400 leading-relaxed text-center font-bold">
          {currentLang === 'en' 
            ? 'Encryption standards enforced: Session keys expire after 15 minutes of inactivity.'
            : 'Normes de cryptage actives : Les sessions expirent après 15 minutes d\'inactivité.'}
        </div>
      </div>

    </main>
  );
}
