// Mock Backend-Ready Government Service API
import { Language } from '../types';

export interface NewsArticle {
  id: string;
  title: string;
  titleFr: string;
  category: string;
  categoryFr: string;
  date: string;
  summary: string;
  summaryFr: string;
  content: string;
  contentFr: string;
}

export interface ProcessingTime {
  serviceId: string;
  name: string;
  nameFr: string;
  timeWeeks: number;
  feeCAD: number;
}

export interface TravelAdvisory {
  country: string;
  countryFr: string;
  code: string;
  level: 1 | 2 | 3 | 4; // 1 = Safe, 2 = Exercise Caution, 3 = Reconsider Travel, 4 = Do Not Travel
  advisoryText: string;
  advisoryTextFr: string;
}

export interface SearchResult {
  id: string;
  title: string;
  titleFr: string;
  url: string;
  category: string;
  categoryFr: string;
  snippet: string;
  snippetFr: string;
}

const MOCK_NEWS: NewsArticle[] = [
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
];

const MOCK_PROCESSING_TIMES: ProcessingTime[] = [
  { serviceId: 'passport-standard', name: 'Standard Passport Renewal', nameFr: 'Renouvellement de passeport régulier', timeWeeks: 2, feeCAD: 120 },
  { serviceId: 'passport-urgent', name: 'Urgent Passport (Next-day)', nameFr: 'Passeport urgent (Lendemain)', timeWeeks: 1, feeCAD: 230 },
  { serviceId: 'study-permit', name: 'Study Permit (Outside Canada)', nameFr: 'Permis d\'études (Hors Canada)', timeWeeks: 6, feeCAD: 150 },
  { serviceId: 'work-permit', name: 'Work Permit (Standard)', nameFr: 'Permis de travail standard', timeWeeks: 8, feeCAD: 155 },
  { serviceId: 'express-entry-pr', name: 'Express Entry Permanent Residence', nameFr: 'Résidence permanente Entrée express', timeWeeks: 24, feeCAD: 850 },
  { serviceId: 'citizenship-grant', name: 'Citizenship Grant Application', nameFr: 'Demande d\'attribution de citoyenneté', timeWeeks: 48, feeCAD: 630 }
];

const MOCK_ADVISORIES: TravelAdvisory[] = [
  { country: 'United States', countryFr: 'États-Unis', code: 'US', level: 1, advisoryText: 'Normal security precautions apply.', advisoryTextFr: 'Prendre des précautions de sécurité normales.' },
  { country: 'United Kingdom', countryFr: 'Royaume-Uni', code: 'GB', level: 1, advisoryText: 'Take normal security precautions.', advisoryTextFr: 'Prendre des précautions de sécurité normales.' },
  { country: 'France', countryFr: 'France', code: 'FR', level: 2, advisoryText: 'Exercise a high degree of caution due to elevated threat of terrorism.', advisoryTextFr: 'Faire preuve d\'une grande prudence en raison de la menace terroriste.' },
  { country: 'Nigeria', countryFr: 'Nigéria', code: 'NG', level: 3, advisoryText: 'Reconsider travel due to active security situations in specialized regions.', advisoryTextFr: 'Réévaluer le voyage en raison de la situation sécuritaire précaire.' },
  { country: 'Mexico', countryFr: 'Mexique', code: 'MX', level: 2, advisoryText: 'Exercise high degree of caution due to high crime levels.', advisoryTextFr: 'Faire preuve d\'une grande prudence en raison de l\'insécurité locale.' },
  { country: 'Ukraine', countryFr: 'Ukraine', code: 'UA', level: 4, advisoryText: 'Avoid all travel due to ongoing armed conflict.', advisoryTextFr: 'Éviter tout voyage en raison du conflit armé actif.' }
];

const SEARCH_CATALOG: SearchResult[] = [
  { id: 'sc-1', title: 'Biometrics Instruction Letters (BIL)', titleFr: 'Lettre d\'instructions biométriques (LIB)', url: '/immigration-citizenship/biometrics', category: 'Immigration', categoryFr: 'Immigration', snippet: 'How to obtain and print your official Biometric receipt instructions.', snippetFr: 'Comment obtenir et imprimer votre lettre d\'instructions.' },
  { id: 'sc-2', title: 'Book Biometrics Appointment Online', titleFr: 'Prendre rendez-vous en ligne', url: '/immigration-citizenship/biometrics', category: 'Immigration', categoryFr: 'Immigration', snippet: 'Access search filters to schedule and confirm fingerprints submissions.', snippetFr: 'Accéder aux filtres pour planifier votre séance d\'empreintes.' },
  { id: 'sc-3', title: 'Passport Fees and Deadlines', titleFr: 'Frais de passeport et délais de traitement', url: '/immigration-citizenship/passports', category: 'Passports', categoryFr: 'Passeports', snippet: 'Calculate processing timescales and standard, urgent fees.', snippetFr: 'Calculez vos délais et coûts de renouvellement de passeport.' },
  { id: 'sc-4', title: 'Express Entry Points CRS Assessment', titleFr: 'Calculer les points du système de classement global (SCG)', url: '/immigration-citizenship/permanent-residence', category: 'Immigration', categoryFr: 'Immigration', snippet: 'Use our online simulator to check qualifications scores for economic visas.', snippetFr: 'Estimer vos points de sélection pour la grille Entrée express.' },
  { id: 'sc-5', title: 'Canadian Citizenship Knowledge Mock Practice Exam', titleFr: 'Examen blanc de pratique de la citoyenneté', url: '/immigration-citizenship/citizenship', category: 'Citizenship', categoryFr: 'Citoyenneté', snippet: 'Interactive 5-question mock testing portal verifying physical history standards.', snippetFr: 'Test d\'évaluation interactif de 5 questions sur l\'histoire et le gouvernement.' },
  { id: 'sc-6', title: 'Child Benefits Estimator', titleFr: 'Calculateur d\'allocations canadienne pour enfants', url: '/benefits', category: 'Benefits', categoryFr: 'Prestations', snippet: 'File returns parameters to estimate monthly payouts for children.', snippetFr: 'Entrez vos critères pour estimer vos versements mensuels.' },
  { id: 'sc-7', title: 'Personal Income Tax Brackets 2026', titleFr: 'Paliers d\'impôt fédéral sur le revenu 2026', url: '/taxes', category: 'Taxes', categoryFr: 'Impôts', snippet: 'Deadlines rules and online filing instructions through the Canada Revenue Agency.', snippetFr: 'Date limite et aide pour soumettre votre déclaration d\'impôt.' }
];

export const placeholderApi = {
  // Retrieve Latest News items
  async getNews(lang: Language): Promise<NewsArticle[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_NEWS), 250);
    });
  },

  // Get estimated processing times and fees
  async getProcessingTimes(): Promise<ProcessingTime[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PROCESSING_TIMES), 150);
    });
  },

  // Get travel advisory levels
  async getTravelAdvisories(): Promise<TravelAdvisory[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ADVISORIES), 150);
    });
  },

  // Dedicated Unified Search matching
  async queryAll(term: string, lang: Language): Promise<SearchResult[]> {
    return new Promise((resolve) => {
      if (!term.trim()) {
        resolve([]);
        return;
      }
      const q = term.toLowerCase();
      const results = SEARCH_CATALOG.filter((item) => {
        const title = (lang === 'en' ? item.title : item.titleFr).toLowerCase();
        const snippet = (lang === 'en' ? item.snippet : item.snippetFr).toLowerCase();
        const category = (lang === 'en' ? item.category : item.categoryFr).toLowerCase();
        return title.includes(q) || snippet.includes(q) || category.includes(q);
      });
      setTimeout(() => resolve(results), 200);
    });
  }
};
