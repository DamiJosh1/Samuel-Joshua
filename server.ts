import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { Resend } from "resend";

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

let firestoreDb: any;
try {
  const firebaseConfigStr = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8');
  const firebaseConfig = JSON.parse(firebaseConfigStr);

  const firebaseApp = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
} catch (err) {
  console.error("Failed to initialize Firestore", err);
}


interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  action: string;
  details?: string;
  documentName?: string;
  title?: string;
  status?: string;
}

interface ApplicationInfo {
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
  messages?: { 
    id: string; 
    subject: string; 
    date: string; 
    content: string; 
    isRead: boolean; 
    dateRead?: string;
    transmissionDate?: string;
    transmissionTime?: string;
    transmissionTimezone?: string;
    receiptNumber?: string;
  }[];
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
  showDocumentStatus?: boolean;
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

interface UserProfile {
  email: string;
  name: string;
  dateCreated?: string;
  timeCreated?: string;
  uci?: string;
  phone?: string;
  dob?: string;
}

// In-memory simple storage to act as the backend database
const db = {
  users: new Map<string, UserProfile>(),
  applications: new Map<string, ApplicationInfo[]>(),

  news: [
    {
      id: 'news-1',
      title: 'Canada announces biometrics automation support expansion',
      titleFr: 'Le Canada annonce l\'expansion du soutien à l\'automatisation de la biométrie',
      category: 'Immigration',
      categoryFr: 'Immigration',
      date: '2026-06-15',
      summary: 'Starting next month, digital Biometrics Instruction Letters will be generated in real-time for temporary worker permit applications.',
      summaryFr: 'Dès le mois prochain, des lettres d\'instructions biométriques seront générées en temps réel pour le permis de travail.',
      content: 'Ottawa is streamlining application checks by connecting the Express Entry and biometrics systems seamlessly inside My Service Accounts.',
      contentFr: 'Ottawa rationalise les contrôles en connectant de manière fluide les systèmes Entrée express et biométrie dans Mon Compte Service.'
    },
    {
      id: 'news-2',
      title: 'New tax deadlines and benefits thresholds announced',
      titleFr: 'Annonce des nouvelles dates limites fiscales et seuils de prestations',
      category: 'Taxes',
      categoryFr: 'Impôts',
      date: '2026-06-10',
      summary: 'The Canada Revenue Agency updates personal return caps and increases child tax benefits payouts by 3.2% to match cost indexes.',
      summaryFr: 'L\'Agence du revenu du Canada met à jour les plafonds de remboursement et augmente les allocations pour enfants de 3,2 % pour contrer l\'inflation.',
      content: 'Check your eligibility criteria for the Canada Child Benefit directly through the online Benefits Calculator page.',
      contentFr: 'Vérifiez votre admissibilité à l\'Allocation canadienne pour enfants en utilisant notre calculateur interactif.'
    },
    {
      id: 'news-3',
      title: 'Passport processing centers restore 10-day turnaround standards',
      titleFr: 'Les centres de passeports rétablissent la norme de traitement de 10 jours',
      category: 'Passports',
      categoryFr: 'Passeports',
      date: '2026-06-08',
      summary: 'Mail-in applications are officially seeing regularized processing times of less than 2 weeks nationwide.',
      summaryFr: 'Les demandes papier envoyées par la poste affichent officiellement un délai de traitement de moins de 2 semaines.',
      content: 'Service Canada locations are admitting priority walk-ins with proof of travel itinerary within 48 hours.',
      contentFr: 'Les bureaux de Service Canada accueillent les personnes sans rendez-vous munies d\'une preuve de voyage imminente sous 48h.'
    }
  ],
  processingTimes: [
    { serviceId: 'passport-standard', name: 'Standard Passport Renewal', nameFr: 'Renouvellement de passeport régulier', timeWeeks: 2, feeCAD: 120 },
    { serviceId: 'passport-urgent', name: 'Urgent Passport (Next-day)', nameFr: 'Passeport urgent (Lendemain)', timeWeeks: 1, feeCAD: 230 },
    { serviceId: 'study-permit', name: 'Study Permit (Outside Canada)', nameFr: 'Permis d\'études (Hors Canada)', timeWeeks: 6, feeCAD: 150 },
    { serviceId: 'work-permit', name: 'Work Permit (Standard)', nameFr: 'Permis de travail standard', timeWeeks: 8, feeCAD: 155 },
    { serviceId: 'express-entry-pr', name: 'Express Entry Permanent Residence', nameFr: 'Résidence permanente Entrée express', timeWeeks: 24, feeCAD: 850 },
    { serviceId: 'citizenship-grant', name: 'Citizenship Grant Application', nameFr: 'Demande d\'attribution de citoyenneté', timeWeeks: 48, feeCAD: 630 }
  ],
  advisories: [
    { country: 'United States', countryFr: 'États-Unis', code: 'US', level: 1, advisoryText: 'Normal security precautions apply.', advisoryTextFr: 'Prendre des précautions de sécurité normales.' },
    { country: 'United Kingdom', countryFr: 'Royaume-Uni', code: 'GB', level: 1, advisoryText: 'Take normal security precautions.', advisoryTextFr: 'Prendre des précautions de sécurité normales.' },
    { country: 'France', countryFr: 'France', code: 'FR', level: 2, advisoryText: 'Exercise a high degree of caution due to elevated threat of terrorism.', advisoryTextFr: 'Faire preuve d\'une grande prudence en raison de la menace terroriste.' },
    { country: 'Nigeria', countryFr: 'Nigéria', code: 'NG', level: 3, advisoryText: 'Reconsider travel due to active security situations in specialized regions.', advisoryTextFr: 'Réévaluer le voyage en raison de la situation sécuritaire précaire.' },
    { country: 'Mexico', countryFr: 'Mexique', code: 'MX', level: 2, advisoryText: 'Exercise high degree of caution due to high crime levels.', advisoryTextFr: 'Faire preuve d\'une grande prudence en raison de l\'insécurité locale.' },
    { country: 'Ukraine', countryFr: 'Ukraine', code: 'UA', level: 4, advisoryText: 'Avoid all travel due to ongoing armed conflict.', advisoryTextFr: 'Éviter tout voyage en raison du conflit armé actif.' }
  ],
  searchCatalog: [
    { id: 'sc-1', title: 'Biometrics Instruction Letters (BIL)', titleFr: 'Lettre d\'instructions biométriques (LIB)', url: '/immigration-citizenship/biometrics', category: 'Immigration', categoryFr: 'Immigration', snippet: 'How to obtain and print your official Biometric receipt instructions.', snippetFr: 'Comment obtenir et imprimer votre lettre d\'instructions.' },
    { id: 'sc-2', title: 'Book Biometrics Appointment Online', titleFr: 'Prendre rendez-vous en ligne', url: '/immigration-citizenship/biometrics', category: 'Immigration', categoryFr: 'Immigration', snippet: 'Access search filters to schedule and confirm fingerprints submissions.', snippetFr: 'Accéder aux filtres pour planifier votre séance d\'empreintes.' },
    { id: 'sc-3', title: 'Passport Fees and Deadlines', titleFr: 'Frais de passeport et délais de traitement', url: '/immigration-citizenship/passports', category: 'Passports', categoryFr: 'Passeports', snippet: 'Calculate processing timescales and standard, urgent fees.', snippetFr: 'Calculez vos délais et coûts de renouvellement de passeport.' },
    { id: 'sc-4', title: 'Express Entry Points CRS Assessment', titleFr: 'Calculer les points du système de classement global (SCG)', url: '/immigration-citizenship/permanent-residence', category: 'Immigration', categoryFr: 'Immigration', snippet: 'Use our online simulator to check qualifications scores for economic visas.', snippetFr: 'Estimer vos points de sélection pour la grille Entrée express.' },
    { id: 'sc-5', title: 'Canadian Citizenship Knowledge Mock Practice Exam', titleFr: 'Examen blanc de pratique de la citoyenneté', url: '/immigration-citizenship/citizenship', category: 'Citizenship', categoryFr: 'Citoyenneté', snippet: 'Interactive 5-question mock testing portal verifying physical history standards.', snippetFr: 'Test d\'évaluation interactif de 5 questions sur l\'histoire et le gouvernement.' },
    { id: 'sc-6', title: 'Child Benefits Estimator', titleFr: 'Calculateur d\'allocations canadienne pour enfants', url: '/benefits', category: 'Benefits', categoryFr: 'Prestations', snippet: 'File returns parameters to estimate monthly payouts for children.', snippetFr: 'Entrez vos critères pour estimer vos versements mensuels.' },
    { id: 'sc-7', title: 'Personal Income Tax Brackets 2026', titleFr: 'Paliers d\'impôt fédéral sur le revenu 2026', url: '/taxes', category: 'Taxes', categoryFr: 'Impôts', snippet: 'Deadlines rules and online filing instructions through the Canada Revenue Agency.', snippetFr: 'Date limite et aide pour soumettre votre déclaration d\'impôt.' }
  ]
};

// Default seed applications for fallback
const DEFAULT_APPLICATIONS: ApplicationInfo[] = [
  {
    id: "V348493234",
    type: "Online Application",
    typeFr: "Demande en ligne",
    status: "Refused",
    statusFr: "Refusée",
    lastUpdated: "2023-08-02",
    dateCreated: "2023-08-02",
    dateSubmitted: "2023-08-02",
    fullName: "TESTIMONY ABIOLA NASIRU",
    details: "Your application was refused. Please check your messages below for detailed explanations.",
    detailsFr: "Votre demande a été refusée. Veuillez vérifier vos messages ci-dessous.",
    requestedDocuments: [
      { name: "Passport", status: "Received", dateUpdated: "2023-08-02", remarks: "Completed" }
    ],
    timeline: [
      { id: "evt-1", date: "2023-08-02 10:00 AM", title: "Profile Created", action: "Profile Created", status: "Completed" },
      { id: "evt-2", date: "2023-08-02 10:15 AM", title: "Application Submitted", action: "Application Submitted", status: "Completed" },
      { id: "evt-3", date: "2023-08-02 11:30 AM", title: "Refusal Letter Issued", action: "Admin Action", status: "Completed" }
    ],
    messages: [
      {
        id: "msg-confirm-1",
        subject: "Confirmation of Online Application Transmission",
        date: "August 2, 2023",
        isRead: true,
        content: "<p>Hello,</p><p>You have successfully transmitted your Online Application on 2 August 2023 06:40:02 p.m. EDT.</p><p>Your payment receipt number is # O689745557.</p>",
        transmissionDate: "2 August 2023",
        transmissionTime: "06:40:02 p.m.",
        transmissionTimezone: "EDT",
        receiptNumber: "O689745557"
      },
      {
        id: "msg-1",
        subject: "Refusal Letter",
        date: "August 2, 2023",
        isRead: true,
        content: "<p>Dear <strong>TESTIMONY ABIOLA NASIRU</strong>,</p><p>Thank you for your interest in coming to Canada. After careful review of your online application, we regret to inform you that your application has been refused.</p><p>A formal letter has been uploaded to your messages with details of this decision.</p>"
      }
    ]
  },
  {
    id: "S305581163",
    type: "Online Application",
    typeFr: "Demande en ligne",
    status: "Refused",
    statusFr: "Refusée",
    lastUpdated: "2022-12-01",
    dateCreated: "2022-12-01",
    dateSubmitted: "2022-12-01",
    fullName: "TESTIMONY ABIOLA NASIRU",
    details: "Your application was refused. Please check your messages below for detailed explanations.",
    detailsFr: "Votre demande a été refusée. Veuillez vérifier vos messages ci-dessous.",
    requestedDocuments: [],
    timeline: [
      { id: "evt-4", date: "2022-12-01 09:00 AM", title: "Profile Created", action: "Profile Created", status: "Completed" },
      { id: "evt-5", date: "2022-12-01 09:15 AM", title: "Application Submitted", action: "Application Submitted", status: "Completed" }
    ],
    messages: [
      {
        id: "msg-confirm-2",
        subject: "Confirmation of Online Application Transmission",
        date: "December 1, 2022",
        isRead: true,
        content: "<p>Hello,</p><p>You have successfully transmitted your Online Application on 1 December 2022 09:15:00 a.m. EST.</p><p>Your payment receipt number is # O309183021.</p>",
        transmissionDate: "1 December 2022",
        transmissionTime: "09:15:00 a.m.",
        transmissionTimezone: "EST",
        receiptNumber: "O309183021"
      },
      {
        id: "msg-2",
        subject: "Refusal Letter",
        date: "December 1, 2022",
        isRead: true,
        content: "<p>Dear <strong>TESTIMONY ABIOLA NASIRU</strong>,</p><p>Thank you for your interest in coming to Canada. After careful review of your online application, we regret to inform you that your application has been refused.</p>"
      }
    ]
  }
];

const DATA_FILE = path.join(process.cwd(), "db_data.json");

function formatHumanDate(dateStr: string): string {
  if (!dateStr) return "August 2, 2023";
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
}

function createDefaultApplicationsForUser(email: string): ApplicationInfo[] {
  return DEFAULT_APPLICATIONS;
}

// Helper to get all users
async function getUsers() {
  if (!firestoreDb) return Array.from(db.users.values());
  const snapshot = await getDocs(collection(firestoreDb, 'users'));
  return snapshot.docs.map(d => d.data() as UserProfile);
}

async function getUser(email: string) {
  if (!firestoreDb) return db.users.get(email);
  const d = await getDoc(doc(firestoreDb, 'users', email));
  return d.exists() ? d.data() as UserProfile : undefined;
}

async function saveUser(email: string, data: UserProfile) {
  if (!firestoreDb) { db.users.set(email, data); return; }
  await setDoc(doc(firestoreDb, 'users', email), data);
}

async function deleteUser(email: string) {
  if (!firestoreDb) { db.users.delete(email); return; }
  await deleteDoc(doc(firestoreDb, 'users', email));
}

async function getApplications(email: string) {
  if (!firestoreDb) return db.applications.get(email);
  const d = await getDoc(doc(firestoreDb, 'applications', email));
  return d.exists() ? d.data()?.apps as ApplicationInfo[] : undefined;
}

async function saveApplications(email: string, apps: ApplicationInfo[]) {
  if (!firestoreDb) { db.applications.set(email, apps); return; }
  await setDoc(doc(firestoreDb, 'applications', email), { apps });
}

async function deleteApplications(email: string) {
  if (!firestoreDb) { db.applications.delete(email); return; }
  await deleteDoc(doc(firestoreDb, 'applications', email));
}

async function getAllApplications() {
  if (!firestoreDb) {
    const allApps: { email: string; app: ApplicationInfo }[] = [];
    db.applications.forEach((apps, email) => {
      apps.forEach(app => allApps.push({ email, app }));
    });
    return allApps;
  }
  const snapshot = await getDocs(collection(firestoreDb, 'applications'));
  const allApps: { email: string; app: ApplicationInfo }[] = [];
  snapshot.docs.forEach(d => {
    const email = d.id;
    const apps = d.data().apps || [];
    apps.forEach((app: ApplicationInfo) => allApps.push({ email, app }));
  });
  return allApps;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Authentication and User API
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (email.toLowerCase() === "admin@canada.ca") {
      if (password === "admin") {
        return res.json({ email: "admin@canada.ca", name: "Administrator" });
      } else {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
    }

    const lowerEmail = email.toLowerCase();
    const user = await getUser(lowerEmail);
    if (!user) {
      return res.status(401).json({ error: "Account not found. Only administrators can create applicant profiles. Please contact your immigration officer." });
    }

    res.json({ email: user?.email, name: user?.name, dateCreated: user?.dateCreated, timeCreated: user?.timeCreated });
  });

  app.post("/api/admin/users", async (req, res) => {
    const { email, name, appType, appNumber, uci, dateCreated, dateSubmitted, status } = req.body;
    if (!email || !name) return res.status(400).json({ error: "Email and name required" });
    
    const lowerEmail = email.toLowerCase();
    const finalDateCreated = dateCreated || new Date().toISOString().split('T')[0];
    const timeCreated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    await saveUser(lowerEmail, { email: lowerEmail, name, dateCreated: finalDateCreated, timeCreated, uci: uci || "" });
    
    const applications = [];
    const finalAppNumber = appNumber || ("W" + Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join(""));

    applications.push({
      id: finalAppNumber,
      type: appType || "Work Permit",
      typeFr: appType || "Work Permit",
      status: status || "Submitted",
      statusFr: status || "Submitted",
      lastUpdated: finalDateCreated,
      dateCreated: finalDateCreated,
      timeCreated,
      fullName: name,
      uci: uci || "",
      dateReceived: finalDateCreated,
      dateSubmitted: dateSubmitted || finalDateCreated,
      details: "Your application is in progress. We will send you a message once a final decision has been made.",
      detailsFr: "Votre demande est en cours de traitement. Nous vous enverrons un message une fois la décision finale prise.",
      statusSummary: "Your application is in progress. We will send you a message once a final decision has been made.",
      latestUpdate: "Application profile created.",
      biometricsNumber: "",
      biometricsDate: "",
      biometricsExpiry: "",
      showDocumentStatus: false,
      requestedDocuments: [],
      documents: [],
      messages: (() => {
        const msgDateStr = formatHumanDate(dateSubmitted || finalDateCreated);
        const list: any[] = [
          {
            id: `msg-${Date.now()}-confirm`,
            subject: "Confirmation of Online Application Transmission",
            date: msgDateStr,
            isRead: false,
            content: "<p>Hello,</p><p>You have successfully transmitted your Online Application on 2 August 2023 06:40:02 p.m. EDT.</p><p>Your payment receipt number is # O689745557.</p>",
            transmissionDate: "2 August 2023",
            transmissionTime: "06:40:02 p.m.",
            transmissionTimezone: "EDT",
            receiptNumber: "O689745557"
          }
        ];
        if (status === "Refused") {
          list.push({
            id: `msg-${Date.now()}-refusal`,
            subject: "Refusal Letter",
            date: msgDateStr,
            isRead: false,
            content: `<p>Dear <strong>${name}</strong>,</p><p>Thank you for your interest in coming to Canada. After careful review of your online application, we regret to inform you that your application has been refused.</p><p>A formal letter has been uploaded to your messages with details of this decision.</p>`
          });
        }
        return list;
      })(),
      timeline: [{
        id: `evt-${Date.now()}`,
        date: finalDateCreated,
        time: timeCreated,
        action: "Application Profile Created"
      }],
      stages: {
        eligibilityStatus: "We are reviewing whether you meet the eligibility requirements.",
        eligibilityDesc: "Our immigration officers are assessing your profile against the standard visa eligibility criteria.",
        eligibilityDate: finalDateCreated,
        medicalStatus: "You do not need a medical exam. We will send you a message if this changes.",
        medicalDesc: "Most temporary visa applicants do not need a medical exam unless specifically requested.",
        medicalDate: finalDateCreated,
        additionalDocsStatus: "We do not need additional documents. We will send you a message if this changes.",
        additionalDocsDesc: "We will let you know if we require any supporting documentation to make a decision.",
        additionalDocsDate: finalDateCreated,
        interviewStatus: "You do not need an interview. We will send you a message if this changes.",
        interviewDesc: "Interviews are only scheduled in rare cases if an officer requires clarification on your file.",
        interviewDate: finalDateCreated,
        biometricsStatus: "We do not need your fingerprints. We will send you a message if this changes.",
        biometricsDesc: "We will notify you if we require a Biometrics Collection (fingerprints and photograph) for your application.",
        biometricsDate: finalDateCreated,
        backgroundStatus: "We are processing your background check. We will send you a message if this changes.",
        backgroundDesc: "We conduct security and criminality background checks on all applicants as part of our processing procedures.",
        backgroundDate: finalDateCreated,
        finalDecisionStatus: "Your application is in progress. We will send you a message once a final decision has been made.",
        finalDecisionDesc: "Once a decision is rendered, a final notification and official correspondence will be sent to your account.",
        finalDecisionDate: finalDateCreated
      },
      documentStatuses: []
    });

    await saveApplications(lowerEmail, applications);
    res.status(201).json({ success: true });
  });

  app.delete("/api/admin/users/:email", async (req, res) => {
    const email = req.params.email.toLowerCase();
    if (!email) return res.status(400).json({ error: "Email required" });
    
    const user = await getUser(email);
    if (user) {
      await deleteUser(email);
      await deleteApplications(email);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    const usersList = await getUsers();
    res.json(usersList);
  });

  // 1. API: News Feed
  app.get("/api/news", (req, res) => {
    res.json(db.news);
  });

  // 2. API: Processing Times
  app.get("/api/processing-times", (req, res) => {
    res.json(db.processingTimes);
  });

  // 3. API: Travel Advisories
  app.get("/api/travel-advisories", (req, res) => {
    res.json(db.advisories);
  });

  // 4. API: Unified Search Catalog
  app.get("/api/search", (req, res) => {
    const term = String(req.query.term || "").trim().toLowerCase();
    const lang = req.query.lang === "fr" ? "fr" : "en";

    if (!term) {
      return res.json([]);
    }

    const results = db.searchCatalog.filter((item) => {
      const title = (lang === "en" ? item.title : item.titleFr).toLowerCase();
      const snippet = (lang === "en" ? item.snippet : item.snippetFr).toLowerCase();
      const category = (lang === "en" ? item.category : item.categoryFr).toLowerCase();
      return title.includes(term) || snippet.includes(term) || category.includes(term);
    });

    res.json(results);
  });

  // 5. API: Applications DB persistence by Email
  app.get("/api/applications", async (req, res) => {
    const email = String(req.query.email || "guest").trim().toLowerCase();
    let apps = await getApplications(email);
    if (!apps) {
      apps = createDefaultApplicationsForUser(email);
      await saveApplications(email, apps);
    }
    res.json(apps);
  });

  app.post("/api/applications", async (req, res) => {
    const email = String(req.body.email || "guest").trim().toLowerCase();
    const newApp: ApplicationInfo = req.body.application;

    if (!newApp || !newApp.id) {
      return res.status(400).json({ error: "Invalid application payload" });
    }
    
    if (!newApp.dateCreated || !newApp.timeCreated) {
      const now = new Date();
      newApp.dateCreated = now.toISOString().split('T')[0];
      newApp.timeCreated = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    let currentList = await getApplications(email);
    if (!currentList) {
      currentList = createDefaultApplicationsForUser(email);
    }

    const updatedList = [newApp, ...currentList];
    await saveApplications(email, updatedList);

    res.status(201).json(updatedList);
  });

  app.patch("/api/applications/:id", async (req, res) => {
    const email = String(req.body.email || "guest").trim().toLowerCase();
    const id = req.params.id;
    const { 
      status, statusFr, details, detailsFr, documents, timeline,
      biometricStatus, workPermitStatus, visitorVisaStatus, studyPermitStatus, passportRequestStatus, medicalRequestStatus,
      requestedDocuments, messages,
      fullName, uci, dateReceived, dateSubmitted,
      biometricsNumber, biometricsDate, biometricsExpiry,
      statusSummary, latestUpdate, stages, documentStatuses
    } = req.body;

    let currentList = await getApplications(email);
    if (!currentList) {
      currentList = createDefaultApplicationsForUser(email);
      await saveApplications(email, currentList);
    }

    const index = currentList.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Application file not found" });
    }

    currentList[index] = {
      ...currentList[index],
      status: status ?? currentList[index].status,
      statusFr: statusFr ?? currentList[index].statusFr,
      details: details ?? currentList[index].details,
      detailsFr: detailsFr ?? currentList[index].detailsFr,
      documents: documents ?? currentList[index].documents,
      timeline: timeline ?? currentList[index].timeline,
      biometricStatus: biometricStatus ?? currentList[index].biometricStatus,
      workPermitStatus: workPermitStatus ?? currentList[index].workPermitStatus,
      visitorVisaStatus: visitorVisaStatus ?? currentList[index].visitorVisaStatus,
      studyPermitStatus: studyPermitStatus ?? currentList[index].studyPermitStatus,
      passportRequestStatus: passportRequestStatus ?? currentList[index].passportRequestStatus,
      medicalRequestStatus: medicalRequestStatus ?? currentList[index].medicalRequestStatus,
      requestedDocuments: requestedDocuments ?? currentList[index].requestedDocuments,
      messages: messages ?? currentList[index].messages,
      fullName: fullName ?? currentList[index].fullName,
      uci: uci ?? currentList[index].uci,
      dateReceived: dateReceived ?? currentList[index].dateReceived,
      dateSubmitted: dateSubmitted ?? currentList[index].dateSubmitted,
      biometricsNumber: biometricsNumber ?? currentList[index].biometricsNumber,
      biometricsDate: biometricsDate ?? currentList[index].biometricsDate,
      biometricsExpiry: biometricsExpiry ?? currentList[index].biometricsExpiry,
      statusSummary: statusSummary ?? currentList[index].statusSummary,
      latestUpdate: latestUpdate ?? currentList[index].latestUpdate,
      stages: stages ?? currentList[index].stages,
      documentStatuses: documentStatuses ?? currentList[index].documentStatuses,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    await saveApplications(email, currentList);
    res.json(currentList[index]);
  });

  app.delete("/api/applications/:id", async (req, res) => {
    const email = String(req.query.email || "guest").trim().toLowerCase();
    const id = req.params.id;

    let currentList = await getApplications(email);
    if (!currentList) {
      return res.status(404).json({ error: "No applications found for this user" });
    }

    const index = currentList.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Application file not found" });
    }

    currentList.splice(index, 1);
    await saveApplications(email, currentList);

    res.json({ success: true, applications: currentList });
  });

  // 6. API: Admin GET all applications across all users
  app.get("/api/admin/applications", async (req, res) => {
    const allApps = await getAllApplications();
    res.json(allApps);
  });

  // API: Admin DELETE application by ID
  app.delete("/api/admin/applications/:id", async (req, res) => {
    const id = req.params.id;
    const allApps = await getAllApplications();
    const foundApp = allApps.find(a => a.app.id === id);
    
    if (foundApp) {
      const email = foundApp.email;
      let currentList = await getApplications(email);
      if (currentList) {
        currentList = currentList.filter(a => a.id !== id);
        await saveApplications(email, currentList);
        return res.json({ success: true });
      }
    }
    res.status(404).json({ error: "Application not found" });
  });

  // 7. API: Send email notification
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, text, html } = req.body;
    
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ error: "Missing email parameters" });
    }

    const emailHtml = `
<div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5; border: 1px solid #ccc;">
  <div style="padding: 20px; border-bottom: 2px solid #26374a;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #000; width: 50%;">
          Government<br/>of Canada
        </td>
        <td style="font-size: 18px; font-weight: bold; color: #000; width: 50%; text-align: left;">
          Gouvernement<br/>du Canada
        </td>
      </tr>
    </table>
  </div>
  <div style="padding: 30px 20px;">
    ${html || `<p>${text.replace(/\n/g, '<br/>')}</p>`}
  </div>
  <div style="padding: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #666; background-color: #f5f5f5;">
    <p style="margin-top: 0;">This is an automated message from Immigration, Refugees and Citizenship Canada. Please do not reply to this email.</p>
    <p style="margin-bottom: 0;">Il s'agit d'un message automatisé d'Immigration, Réfugiés et Citoyenneté Canada. Veuillez ne pas y répondre.</p>
    <div style="margin-top: 20px; text-align: right;">
      <span style="font-size: 20px; font-weight: bold; color: #000; font-family: serif;">Canada</span>
    </div>
  </div>
</div>
    `;

    // Try SMTP if credentials are provided
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        console.log("Attempting to send email via SMTP...");
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) === 465 : true),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const fromName = process.env.SMTP_FROM || `"IRCC Portal" <${process.env.SMTP_USER}>`;

        const info = await transporter.sendMail({
          from: fromName,
          to,
          subject,
          text: text || "IRCC Notification",
          html: emailHtml,
        });

        console.log("Email sent successfully via SMTP:", info.messageId);
        return res.json({ success: true, method: "smtp", messageId: info.messageId });
      } catch (smtpErr: any) {
        console.error("SMTP sending failed, falling back to Resend:", smtpErr);
        // continue to Resend
      }
    }

    // Fallback to Resend
    try {
      console.log("Attempting to send email via Resend...");
      const apiKey = process.env.RESEND_API_KEY || 're_g3UP34Qx_2T8JqyQkgyP4ovzFYznE54h5';
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'IRCC / IRCC <onboarding@resend.dev>';
      const resend = new Resend(apiKey);

      const data = await resend.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        html: emailHtml,
      });

      if (data.error) {
        console.warn("Resend email warning (likely unverified address):", data.error);
        return res.json({ success: true, method: "resend", warning: data.error });
      }

      console.log("Email sent successfully via Resend", data);
      res.json({ success: true, method: "resend", data });
    } catch (err: any) {
      console.error("Email send failed completely:", err);
      res.status(500).json({ error: "Failed to send email. Ensure Resend or SMTP environment variables are configured." });
    }
  });

  // Vite integration middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
