import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

export interface ApplicationInfo {
  id: string;
  type: 'Passport' | 'Biometrics' | 'Study Permit' | 'Express Entry';
  typeFr: 'Passeport' | 'Biométrie' | 'Permis d\'études' | 'Entrée express';
  status: 'Received' | 'In Progress' | 'Approved' | 'Action Required';
  statusFr: 'Reçu' | 'En cours' | 'Approuvé' | 'Action requise';
  lastUpdated: string;
  details: string;
  detailsFr: string;
}

interface AppContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  user: { email: string; name: string } | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  applications: ApplicationInfo[];
  addApplication: (app: ApplicationInfo) => void;
  updateApplicationStatus: (id: string, newStatus: ApplicationInfo['status'], details: string, detailsFr: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  
  // Starting Applications database
  const [applications, setApplications] = useState<ApplicationInfo[]>([
    {
      id: "APP-40291",
      type: "Biometrics",
      typeFr: "Biométrie",
      status: "In Progress",
      statusFr: "En cours",
      lastUpdated: "2026-06-21",
      details: "Waiting for appointment confirmation at USCIS ASC Manhattan.",
      detailsFr: "En attente de confirmation de rendez-vous à l'ASC USCIS de Manhattan."
    },
    {
      id: "APP-82910",
      type: "Passport",
      typeFr: "Passeport",
      status: "Received",
      statusFr: "Reçu",
      lastUpdated: "2026-06-19",
      details: "Application submitted online via Service Canada.",
      detailsFr: "Demande soumise en ligne via Service Canada."
    }
  ]);

  // Read language and session user configuration from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('gov_lang') as Language;
    if (savedLang === 'en' || savedLang === 'fr') {
      setCurrentLang(savedLang);
    }
    const savedUser = localStorage.getItem('gov_user');
    if (savedUser) {
      try {
         setUser(JSON.parse(savedUser));
      } catch (e) {
         // ignore
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('gov_lang', lang);
  };

  const login = (email: string, name: string) => {
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('gov_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gov_user');
  };

  const addApplication = (app: ApplicationInfo) => {
    setApplications(prev => [app, ...prev]);
  };

  const updateApplicationStatus = (id: string, newStatus: ApplicationInfo['status'], details: string, detailsFr: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        let statusFr: ApplicationInfo['statusFr'] = 'En cours';
        if (newStatus === 'Received') statusFr = 'Reçu';
        if (newStatus === 'Approved') statusFr = 'Approuvé';
        if (newStatus === 'Action Required') statusFr = 'Action requise';
        return {
          ...app,
          status: newStatus,
          statusFr,
          details,
          detailsFr,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return app;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentLang,
      setLanguage,
      user,
      login,
      logout,
      applications,
      addApplication,
      updateApplicationStatus
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
