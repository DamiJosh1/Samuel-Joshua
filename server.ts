import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { Resend } from "resend";

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
    id: "W4392630150",
    type: "WORK VISA",
    typeFr: "VISA DE TRAVAIL",
    status: "Submitted",
    statusFr: "Soumise",
    lastUpdated: "2026-03-18",
    dateCreated: "2026-03-18",
    timeCreated: "09:00 AM",
    details: "Your application is in progress. We will send you a message once the final decision has been made.",
    detailsFr: "Votre demande est en cours de traitement. Nous vous enverrons un message une fois la décision finale prise.",
    requestedDocuments: [
      { name: "Passport", status: "Pending", dateUpdated: "2026-03-18", remarks: "Please upload a clear copy of your passport bio-data page." },
      { name: "Biometrics", status: "Pending", dateUpdated: "2026-03-20", remarks: "Biometrics Instruction Letter issued. Please scheduled appointment." },
      { name: "Medical report", status: "Pending", dateUpdated: "2026-03-22", remarks: "Medical examination requested. Please complete at authorized physician." }
    ],
    timeline: [
      { id: "evt-1", date: "2026-03-18 09:00 AM", title: "Profile Created", action: "Profile Created", status: "Completed" },
      { id: "evt-2", date: "2026-03-18 09:15 AM", title: "Application Submitted", action: "Application Submitted", status: "Completed" },
      { id: "evt-3", date: "2026-03-18 09:30 AM", title: "Confirmation of Transmission Sent", action: "System Action", status: "Completed" },
      { id: "evt-4", date: "2026-03-20 10:00 AM", title: "Biometrics Instruction Letter Issued", action: "Admin Action", status: "Completed" },
      { id: "evt-5", date: "2026-03-22 11:30 AM", title: "Medical Examination Requested", action: "Admin Action", status: "Completed" }
    ],
    messages: [
      {
        id: "msg-1",
        subject: "Confirmation of Online Application Transmission",
        date: "March 18, 2026",
        isRead: false,
        content: "<p>Dear <strong>YASIR IQBAL</strong>,</p><p>This confirms that your application has been received by Immigration, Refugees and Citizenship Canada (IRCC).</p><p>Please note that this message does not mean your application is complete or that you are eligible for the program. We will review your application to make sure it is complete.</p><p>You can check the status of your application in your account.</p><p>Thank you,</p><p>Immigration, Refugees and Citizenship Canada</p>"
      },
      {
        id: "msg-2",
        subject: "Biometrics Collection Letter",
        date: "March 20, 2026",
        isRead: false,
        content: "<p>Dear <strong>YASIR IQBAL</strong>,</p><p>This letter is to inform you that you are required to provide your biometrics (fingerprints and photograph).</p><p>Please bring this letter with you to a biometric collection service point. You have 30 days from the date of this letter to provide your biometrics.</p><p>Failure to provide your biometrics within this timeframe may result in your application being refused.</p><p>Thank you,</p><p>Immigration, Refugees and Citizenship Canada</p>"
      }
    ]
  }
];

const DATA_FILE = path.join(process.cwd(), "db_data.json");

function saveData() {
  const data = {
    users: Array.from(db.users.entries()),
    applications: Array.from(db.applications.entries()),
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      db.users = new Map(fileData.users);
      db.applications = new Map(fileData.applications);
      return;
    } catch (e) {
      console.error("Error loading data file:", e);
    }
  }
  
  // Seed initial database if no file exists
  db.users.set("applicant@domain.ca", { email: "applicant@domain.ca", name: "YASIR IQBAL", dateCreated: "2026-03-18", timeCreated: "09:00 AM" });
  db.applications.set("applicant@domain.ca", [...DEFAULT_APPLICATIONS]);
  saveData();
}

loadData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Authentication and User API
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (email.toLowerCase() === "admin@canada.ca") {
      if (password === "admin") { // simple mock password for admin
        return res.json({ email: "admin@canada.ca", name: "Administrator" });
      } else {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
    }

    // Normal user check
    const lowerEmail = email.toLowerCase();
    if (!db.users.has(lowerEmail)) {
      return res.status(401).json({ error: "Account not found. Only administrators can create applicant profiles. Please contact your immigration officer." });
    }

    // We can just accept any password for now or set a temporary one, let's just accept any for mock since we are not storing passwords
    const user = db.users.get(lowerEmail);
    res.json({ email: user?.email, name: user?.name, dateCreated: user?.dateCreated, timeCreated: user?.timeCreated });
  });

  app.post("/api/admin/users", (req, res) => {
    const { email, name, appType, appNumber, uci, dateCreated, dateSubmitted, status } = req.body;
    if (!email || !name) return res.status(400).json({ error: "Email and name required" });
    
    const lowerEmail = email.toLowerCase();
    const finalDateCreated = dateCreated || new Date().toISOString().split('T')[0];
    const timeCreated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    db.users.set(lowerEmail, { email: lowerEmail, name, dateCreated: finalDateCreated, timeCreated, uci: uci || "" });
    
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
      requestedDocuments: [],
      documents: [],
      messages: [],
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

    db.applications.set(lowerEmail, applications);
    saveData();
    
    res.status(201).json({ success: true });
  });

  app.delete("/api/admin/users/:email", (req, res) => {
    const email = req.params.email.toLowerCase();
    if (!email) return res.status(400).json({ error: "Email required" });
    
    if (db.users.has(email)) {
      db.users.delete(email);
      db.applications.delete(email);
      saveData();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.get("/api/admin/users", (req, res) => {
    const usersList = Array.from(db.users.values());
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
  app.get("/api/applications", (req, res) => {
    const email = String(req.query.email || "guest").trim().toLowerCase();
    if (!db.applications.has(email)) {
      db.applications.set(email, [...DEFAULT_APPLICATIONS]);
    }
    res.json(db.applications.get(email));
  });

  app.post("/api/applications", (req, res) => {
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

    if (!db.applications.has(email)) {
      db.applications.set(email, [...DEFAULT_APPLICATIONS]);
    }

    const currentList = db.applications.get(email) || [];
    // Prepend new application status tracker ticket
    const updatedList = [newApp, ...currentList];
    db.applications.set(email, updatedList);
    saveData();

    res.status(201).json(updatedList);
  });

  app.patch("/api/applications/:id", (req, res) => {
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

    if (!db.applications.has(email)) {
      db.applications.set(email, [...DEFAULT_APPLICATIONS]);
    }

    const currentList = db.applications.get(email) || [];
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

    db.applications.set(email, currentList);
    saveData();
    res.json(currentList[index]);
  });

  // 6. API: Admin GET all applications across all users
  app.get("/api/admin/applications", (req, res) => {
    const allApps: { email: string; app: ApplicationInfo }[] = [];
    db.applications.forEach((apps, email) => {
      apps.forEach(app => {
        allApps.push({ email, app });
      });
    });
    res.json(allApps);
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
