import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  action: string;
  details?: string;
  documentName?: string;
}

interface ApplicationInfo {
  id: string;
  type: string;
  typeFr: string;
  status: string;
  statusFr: string;
  lastUpdated: string;
  details: string;
  detailsFr: string;
  documents?: { name: string; category?: string; date: string; time: string }[];
  timeline?: TimelineEvent[];
  biometricStatus?: string;
  workPermitStatus?: string;
  visitorVisaStatus?: string;
  studyPermitStatus?: string;
  passportRequestStatus?: string;
  medicalRequestStatus?: string;
}

interface UserProfile {
  email: string;
  name: string;
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
    id: "APP-40291",
    type: "Work Permit",
    typeFr: "Permis de travail",
    status: "Background Verification",
    statusFr: "Vérification des antécédents",
    lastUpdated: "2026-06-21",
    details: "Your background check is currently underway. No action is required from you at this moment.",
    detailsFr: "La vérification de vos antécédents est en cours. Aucune action n'est requise de votre part pour le moment."
  }
];

// Seed initial database
db.users.set("applicant@domain.ca", { email: "applicant@domain.ca", name: "Jean Dupont" });
db.applications.set("applicant@domain.ca", [...DEFAULT_APPLICATIONS]);

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
    res.json({ email: user?.email, name: user?.name });
  });

  app.post("/api/admin/users", (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ error: "Email and name required" });
    
    const lowerEmail = email.toLowerCase();
    db.users.set(lowerEmail, { email: lowerEmail, name });
    
    // Auto-create empty application array for them
    if (!db.applications.has(lowerEmail)) {
      db.applications.set(lowerEmail, []);
    }
    
    res.status(201).json({ success: true });
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

    if (!db.applications.has(email)) {
      db.applications.set(email, [...DEFAULT_APPLICATIONS]);
    }

    const currentList = db.applications.get(email) || [];
    // Prepend new application status tracker ticket
    const updatedList = [newApp, ...currentList];
    db.applications.set(email, updatedList);

    res.status(201).json(updatedList);
  });

  app.patch("/api/applications/:id", (req, res) => {
    const email = String(req.body.email || "guest").trim().toLowerCase();
    const id = req.params.id;
    const { 
      status, statusFr, details, detailsFr, documents, timeline,
      biometricStatus, workPermitStatus, visitorVisaStatus, studyPermitStatus, passportRequestStatus, medicalRequestStatus 
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
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    db.applications.set(email, currentList);
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
    const { to, subject, text } = req.body;
    
    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing email parameters" });
    }

    try {
      // For demonstration, use ethereal email or console.log if no auth provided.
      // Nodemailer requires an SMTP server (like Gmail, Outlook, AWS SES).
      // Here we will mock it if no env var is set.
      let transporter;
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else {
        // Create a test account if no real SMTP provided
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });
      }

      const info = await transporter.sendMail({
        from: '"Canada Immigration Services" <no-reply@canada.ca.example>',
        to,
        subject,
        text,
      });

      console.log("Message sent: %s", info.messageId);
      // ethereal url
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.json({ success: true, messageId: info.messageId });
    } catch (err) {
      console.error("Email send failed:", err);
      res.status(500).json({ error: "Failed to send email" });
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
