import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  action: string;
  details?: string;
  documentName?: string;
  title?: string;
  status?: string;
}

export const IMMIGRATION_JOURNEY_STEPS = [
  "Draft",
  "Documents Requested",
  "Documents Received",
  "Under Review",
  "Application Submitted",
  "Processing",
  "Additional Documents Required",
  "Medical Requested",
  "Medical Results Received",
  "Biometrics Requested",
  "Biometrics Scheduled",
  "Biometrics Completed",
  "Decision Made",
  "Approved",
  "Refused",
  "Completed"
];

export interface ApplicationInfo {
  id: string;
  type: string;
  typeFr: string;
  status: string;
  statusFr: string;
  lastUpdated: string;
  dateCreated?: string;
  timeCreated?: string;
  details: string;
  detailsFr: string;
  documents?: { name: string; category?: string; date: string; time: string }[];
  requestedDocuments?: { name: string; status: 'Pending' | 'Submitted' | 'Received'; dateUpdated?: string; remarks?: string }[];
  messages?: { id: string; subject: string; date: string; content: string; isRead: boolean; dateRead?: string }[];
  timeline?: TimelineEvent[];
  biometricStatus?: string;
  workPermitStatus?: string;
  visitorVisaStatus?: string;
  studyPermitStatus?: string;
  passportRequestStatus?: string;
  medicalRequestStatus?: string;

  // Admin controlled fields:
  fullName?: string;
  uci?: string;
  dateReceived?: string;
  dateSubmitted?: string;
  biometricsNumber?: string;
  biometricsDate?: string;
  biometricsExpiry?: string;
  statusSummary?: string;
  latestUpdate?: string;
  stages?: {
    eligibilityStatus?: string;
    eligibilityDesc?: string;
    eligibilityDate?: string;
    
    medicalStatus?: string;
    medicalDesc?: string;
    medicalDate?: string;
    
    additionalDocsStatus?: string;
    additionalDocsDesc?: string;
    additionalDocsDate?: string;
    
    interviewStatus?: string;
    interviewDesc?: string;
    interviewDate?: string;
    
    biometricsStatus?: string;
    biometricsDesc?: string;
    biometricsDate?: string;
    
    backgroundStatus?: string;
    backgroundDesc?: string;
    backgroundDate?: string;
    
    finalDecisionStatus?: string;
    finalDecisionDesc?: string;
    finalDecisionDate?: string;
  };
  documentStatuses?: {
    id: string;
    name: string;
    uci: string;
    documentType: string;
    documentNumber: string;
    status: string;
    expiryDate: string;
    statusUpdatedDate: string;
    travelDocumentNumber: string;
    countryOfIssue: string;
  }[];
}

interface AppContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  user: { email: string; name: string; dateCreated?: string; timeCreated?: string } | null;
  login: (email: string, name: string, dateCreated?: string, timeCreated?: string) => void;
  logout: () => void;
  applications: ApplicationInfo[];
  addApplication: (app: ApplicationInfo) => void;
  updateApplication: (id: string, updates: Partial<ApplicationInfo>) => void;
  hasEntered: boolean;
  setHasEntered: (entered: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [user, setUser] = useState<{ email: string; name: string; dateCreated?: string; timeCreated?: string } | null>(null);
  const [hasEntered, setHasEnteredState] = useState<boolean>(() => {
    return sessionStorage.getItem('gov_gate_entered') === 'true';
  });

  const setHasEntered = (entered: boolean) => {
    setHasEnteredState(entered);
    if (entered) {
      sessionStorage.setItem('gov_gate_entered', 'true');
    } else {
      sessionStorage.removeItem('gov_gate_entered');
    }
  };
  
  // Starting Applications database
  const [applications, setApplications] = useState<ApplicationInfo[]>([]);

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

  // Sync tracked application status with the Express Backend
  useEffect(() => {
    const fetchApps = () => {
      const email = user?.email || "guest";
      fetch(`/api/applications?email=${encodeURIComponent(email)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not fetch applications from backend");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setApplications(data);
          } else {
            console.error("Applications backend did not return an array, ignoring:", data);
          }
        })
        .catch((err) => {
          // Use console.warn to indicate fallback, preventing false-positive error alerts during transient dev server restarts
          console.warn("Backend sync status: running with offline client state.", err.message || err);
        });
    };

    fetchApps();
    // Poll every 3 seconds to keep UI live
    const interval = setInterval(fetchApps, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('gov_lang', lang);
  };

  const login = (email: string, name: string, dateCreated?: string, timeCreated?: string) => {
    const newUser = { email, name, dateCreated, timeCreated };
    setUser(newUser);
    localStorage.setItem('gov_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gov_user');
  };

  const addApplication = async (app: ApplicationInfo) => {
    const email = user?.email || "guest";
    // Optimistic UI update
    setApplications((prev) => [app, ...prev]);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, application: app }),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setApplications(data);
        }
      }
    } catch (err) {
      console.error("Failed to persist application creation to backend:", err);
    }
  };

  const updateApplication = async (
    id: string,
    updates: Partial<ApplicationInfo>
  ) => {
    const email = user?.email || "guest";
    
    // Optimistic UI update
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              ...updates,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : app
      )
    );

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          ...updates
        }),
      });
      if (response.ok) {
        const updatedItem = await response.json();
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? updatedItem : app))
        );
      }
    } catch (err) {
      console.error("Failed to update status on backend:", err);
    }
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
      updateApplication,
      hasEntered,
      setHasEntered
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
