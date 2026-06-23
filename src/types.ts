export type Language = 'en' | 'fr';

export type SectionId = 'who-needs' | 'when-to-give' | 'how-to-give' | 'where-to-give' | 'what-happens';

export interface Section {
  id: SectionId;
  title: string;
}

export interface CollectionSite {
  id: string;
  name: string;
  nameFr: string;
  type: 'vac' | 'asc' | 'service-canada' | 'other';
  typeLabel: string;
  typeLabelFr: string;
  address: string;
  addressFr: string;
  city: string;
  country: string;
  countryFr: string;
  hours: string;
  hoursFr: string;
  appointmentUrl: string;
  notes: string;
  notesFr: string;
}

export const SECTIONS_DATA: Record<Language, Section[]> = {
  en: [
    { id: 'who-needs', title: 'Who needs to give biometrics' },
    { id: 'when-to-give', title: 'When to give your biometrics' },
    { id: 'how-to-give', title: 'How to give fingerprints & photo' },
    { id: 'where-to-give', title: 'Where to give biometrics' },
    { id: 'what-happens', title: 'What happens after giving biometrics' }
  ],
  fr: [
    { id: 'who-needs', title: 'Qui doit fournir ses données biométriques' },
    { id: 'when-to-give', title: 'Quand fournir vos données biométriques' },
    { id: 'how-to-give', title: 'Comment fournir vos empreintes et photo' },
    { id: 'where-to-give', title: 'Où fournir ses données biométriques' },
    { id: 'what-happens', title: 'Que se passe-t-il après la biométrie' }
  ]
};

export const COLLECTION_SITES: CollectionSite[] = [
  {
    id: 'vac-london',
    name: 'Visa Application Centre (VFS Global) - London',
    nameFr: 'Centre de réception des visas (VFS Global) - Londres',
    type: 'vac',
    typeLabel: 'Visa Application Centre (VAC)',
    typeLabelFr: 'Centre de réception des demandes de visa (CRDV)',
    address: '66 Wilson Street, London, EC2A 2BT, United Kingdom',
    addressFr: '66 Wilson Street, Londres, EC2A 2BT, Royaume-Uni',
    city: 'London',
    country: 'United Kingdom',
    countryFr: 'Royaume-Uni',
    hours: 'Monday to Friday: 08:30 - 16:30',
    hoursFr: 'Lundi au vendredi: 08h30 - 16h30',
    appointmentUrl: 'https://vfsglobal.com/canada/unitedkingdom',
    notes: 'Prior booking is mandatory. Bring your original valid passport and Biometric Instruction Letter (BIL).',
    notesFr: 'La réservation préalable est obligatoire. Apportez votre passeport original valide et votre lettre d\'instructions pour la biométrie (LIB).'
  },
  {
    id: 'vac-paris',
    name: 'Visa Application Centre (VFS Global) - Paris',
    nameFr: 'Centre de réception des visas (VFS Global) - Paris',
    type: 'vac',
    typeLabel: 'Visa Application Centre (VAC)',
    typeLabelFr: 'Centre de réception des demandes de visa (CRDV)',
    address: '82 Rue d\'Hauteville, 75010 Paris, France',
    addressFr: '82 Rue d\'Hauteville, 75010 Paris, France',
    city: 'Paris',
    country: 'France',
    countryFr: 'France',
    hours: 'Monday to Friday: 09:00 - 17:00',
    hoursFr: 'Lundi au vendredi: 09h00 - 17h00',
    appointmentUrl: 'https://vfsglobal.com/canada/france',
    notes: 'Requires online appointment scheduling. Digital and printed copies of BIL accepted.',
    notesFr: 'Requiert la prise de rendez-vous en ligne. Les copies numériques et imprimées de la LIB de biométrie sont acceptées.'
  },
  {
    id: 'vac-delhi',
    name: 'Visa Application Centre (VFS Global) - New Delhi',
    nameFr: 'Centre de réception des visas (VFS Global) - New Delhi',
    type: 'vac',
    typeLabel: 'Visa Application Centre (VAC)',
    typeLabelFr: 'Centre de réception des demandes de visa (CRDV)',
    address: 'Shivaji Stadium Metro Station, Concourse Level, Baba Kharak Singh Marg, Connaught Place, New Delhi, 110001, India',
    addressFr: 'Shivaji Stadium Metro Station, Niveau Concourse, Baba Kharak Singh Marg, Connaught Place, New Delhi, 110001, Inde',
    city: 'New Delhi',
    country: 'India',
    countryFr: 'Inde',
    hours: 'Monday to Saturday: 08:00 - 17:00',
    hoursFr: 'Lundi au samedi: 08h00 - 17h00',
    appointmentUrl: 'https://vfsglobal.com/canada/india',
    notes: 'High demand area. Book appointments well in advance. Fast-track options available.',
    notesFr: 'Zone à forte demande. Réservez vos rendez-vous longtemps à l\'avance. Options accélérées disponibles.'
  },
  {
    id: 'vac-manila',
    name: 'Visa Application Centre (VFS Global) - Manila',
    nameFr: 'Centre de réception des visas (VFS Global) - Manille',
    type: 'vac',
    typeLabel: 'Visa Application Centre (VAC)',
    typeLabelFr: 'Centre de réception des demandes de visa (CRDV)',
    address: '29th Floor, The World Centre, Sen. Gil Puyat Avenue, Makati City, Metro Manila, Philippines',
    addressFr: '29th Floor, The World Centre, Sen. Gil Puyat Avenue, Makati City, Metro Manila, Philippines',
    city: 'Manila',
    country: 'Philippines',
    countryFr: 'Philippines',
    hours: 'Monday to Friday: 07:00 - 16:00',
    hoursFr: 'Lundi au vendredi: 07h00 - 16h00',
    appointmentUrl: 'https://vfsglobal.com/canada/philippines',
    notes: 'Bring visa application fee receipt if already paid, or prepare card payment at the counters.',
    notesFr: 'Apportez le reçu des frais de demande de visa s\'il est déjà payé, ou préparez un paiement par carte aux guichets.'
  },
  {
    id: 'vac-beijing',
    name: 'Visa Application Centre (VFS Global) - Beijing',
    nameFr: 'Centre de réception des visas (VFS Global) - Pékin',
    type: 'vac',
    typeLabel: 'Visa Application Centre (VAC)',
    typeLabelFr: 'Centre de réception des demandes de visa (CRDV)',
    address: '12F, Building B, Central Point Plaza, No. 11 Dongzhimen South Avenue, Dongcheng District, Beijing, China',
    addressFr: '12F, Building B, Central Point Plaza, No. 11 Dongzhimen South Avenue, Dongcheng District, Pékin, Chine',
    city: 'Beijing',
    country: 'China',
    countryFr: 'Chine',
    hours: 'Monday to Friday: 08:00 - 16:00',
    hoursFr: 'Lundi au vendredi: 08h00 - 16h00',
    appointmentUrl: 'https://vfsglobal.com/canada/china',
    notes: 'National identification card required in additional to international passport for entry.',
    notesFr: 'Carte d\'identité nationale requise en plus du passeport international pour l\'entrée.'
  },
  {
    id: 'asc-new-york',
    name: 'USCIS Application Support Center - Manhattan',
    nameFr: 'USCIS Application Support Center - Manhattan',
    type: 'asc',
    typeLabel: 'Application Support Center (ASC)',
    typeLabelFr: 'Centre de soutien aux demandes (ASC)',
    address: '201 Varick Street, 10th Floor, New York, NY 10014, United States',
    addressFr: '201 Varick Street, 10e étage, New York, NY 10014, États-Unis',
    city: 'New York',
    country: 'United States',
    countryFr: 'États-Unis',
    hours: 'Monday to Friday: 08:00 - 16:00',
    hoursFr: 'Lundi au vendredi: 08h00 - 16h00',
    appointmentUrl: 'https://www.uscis.gov/about-us/find-a-uscis-office',
    notes: 'Only collects biometrics on behalf of IRCC for applicants present in the USA. Requires valid BIL and pre-scheduled ASC date.',
    notesFr: 'Recueille uniquement les données biométriques pour le compte d\'IRCC pour les demandeurs situés aux États-Unis. Nécessite une LIB valide et un rendez-vous ASC pré-programmé.'
  },
  {
    id: 'asc-los-angeles',
    name: 'USCIS Application Support Center - Los Angeles',
    nameFr: 'USCIS Application Support Center - Los Angeles',
    type: 'asc',
    typeLabel: 'Application Support Center (ASC)',
    typeLabelFr: 'Centre de soutien aux demandes (ASC)',
    address: '5757 Wilshire Boulevard, Suite 100, Los Angeles, CA 90036, United States',
    addressFr: '5757 Wilshire Boulevard, Bureau 100, Los Angeles, CA 90036, États-Unis',
    city: 'Los Angeles',
    country: 'United States',
    countryFr: 'États-Unis',
    hours: 'Monday to Friday: 08:00 - 16:00',
    hoursFr: 'Lundi au vendredi: 08h00 - 16h00',
    appointmentUrl: 'https://www.uscis.gov/about-us/find-a-uscis-office',
    notes: 'Applicants must present original immigration credentials and printout of the appointment receipt.',
    notesFr: 'Les demandeurs doivent présenter leurs documents originaux d\'immigration et un imprimé de la confirmation de rendez-vous.'
  },
  {
    id: 'sc-ottawa',
    name: 'Service Canada Centre - Ottawa City Hall',
    nameFr: 'Centre Service Canada - Hôtel de Ville d\'Ottawa',
    type: 'service-canada',
    typeLabel: 'Service Canada Centre',
    typeLabelFr: 'Centre Service Canada',
    address: '110 Laurier Avenue West, Ottawa, ON K1P 1J1, Canada',
    addressFr: '110, avenue Laurier Ouest, Ottawa, ON K1P 1J1, Canada',
    city: 'Ottawa',
    country: 'Canada',
    countryFr: 'Canada',
    hours: 'Monday to Friday: 08:30 - 16:00',
    hoursFr: 'Lundi au vendredi: 08h30 - 16h00',
    appointmentUrl: 'https://eservices.canada.ca/en/service/',
    notes: 'Biometrics services provided inside Canada for temporary residence, extension/restoration applications.',
    notesFr: 'Services biométriques offerts au Canada pour les demandes de résidence temporaire, de prolongation ou de rétablissement.'
  },
  {
    id: 'sc-vancouver',
    name: 'Service Canada Centre - Vancouver Sinclair Centre',
    nameFr: 'Centre Service Canada - Sinclair Centre Vancouver',
    type: 'service-canada',
    typeLabel: 'Service Canada Centre',
    typeLabelFr: 'Centre Service Canada',
    address: '757 West Hastings Street, Suite 125, Vancouver, BC V6C 1A1, Canada',
    addressFr: '757 West Hastings Street, Suite 125, Vancouver, BC V6C 1A1, Canada',
    city: 'Vancouver',
    country: 'Canada',
    countryFr: 'Canada',
    hours: 'Monday to Friday: 08:30 - 16:00',
    hoursFr: 'Lundi au vendredi: 08h30 - 16h00',
    appointmentUrl: 'https://eservices.canada.ca/en/service/',
    notes: 'Convenient downtown transit-accessible location. Online appointment scheduling highly recommended.',
    notesFr: 'Emplacement pratique au centre-ville, accessible en transport en commun. Prise de rendez-vous en ligne fortement recommandée.'
  },
  {
    id: 'sc-toronto',
    name: 'Service Canada Centre - Toronto City Hall',
    nameFr: 'Centre Service Canada - Hôtel de Ville de Toronto',
    type: 'service-canada',
    typeLabel: 'Service Canada Centre',
    typeLabelFr: 'Centre Service Canada',
    address: '100 Queen Street West, Floor 1, Toronto, ON M5H 2N2, Canada',
    addressFr: '100 Queen Street West, 1er étage, Toronto, ON M5H 2N2, Canada',
    city: 'Toronto',
    country: 'Canada',
    countryFr: 'Canada',
    hours: 'Monday to Friday: 08:30 - 16:00',
    hoursFr: 'Lundi au vendredi: 08h30 - 16h00',
    appointmentUrl: 'https://eservices.canada.ca/en/service/',
    notes: 'Walk-ins are extremely limited and discouraged. Priority is given to individuals with appointment schedules.',
    notesFr: 'Les personnes sans rendez-vous sont extrêmement limitées et découragées. La priorité est accordée aux personnes ayant réservé.'
  }
];

export const GENERAL_TRANSLATIONS = {
  en: {
    govOfCanada: 'Government of Canada',
    logoSub: 'Gouvernement du Canada',
    langToggle: 'Français',
    langToggleLabel: 'Passer au français',
    searchPlaceholder: 'Search Canada.ca',
    searchButton: 'Search',
    home: 'Home',
    immigrationAndCitizenship: 'Immigration and citizenship',
    activeSectionHeader: 'Biometrics',
    asideHeading: 'Biometrics Sections',
    importantNotice: 'Important Notice',
    disclaimers: 'Disclaimer: This application was created by DamiJosh as an interactive replica of Canada.ca for design demonstration and layout testing purposes.',
    disclaimersFr: 'Avertissement: Cette application a été créée par DamiJosh comme réplication interactive de Canada.ca à des fins de démonstration de conception et de test de mise en page.',
    rights: '© DamiJosh, 2026',
    copyrightSub: '© DamiJosh, 2026',
    contactUs: 'Contact Us',
    helpCentre: 'Help Centre',
    contactImmigration: 'Contact IRCC',
    feedback: 'Give Feedback',
    aboutGov: 'Government of Canada',
    allDepartments: 'All Departments',
    howGovWorks: 'How government works',
    publicService: 'Public service and military',
    news: 'News',
    legal: 'Legal / Transparency',
    termsAndConditions: 'Terms and conditions',
    privacy: 'Privacy policy',
    lastModified: 'Last modified: 2026-06-21',
  },
  fr: {
    govOfCanada: 'Gouvernement du Canada',
    logoSub: 'Government of Canada',
    langToggle: 'English',
    langToggleLabel: 'Switch to English',
    searchPlaceholder: 'Rechercher dans Canada.ca',
    searchButton: 'Rechercher',
    home: 'Accueil',
    immigrationAndCitizenship: 'Immigration et citoyenneté',
    activeSectionHeader: 'Biométrie',
    asideHeading: 'Sections sur la biométrie',
    importantNotice: 'Avis important',
    disclaimers: 'Avertissement: Cette application a été créée par DamiJosh comme réplication interactive de Canada.ca à des fins de démonstration de conception et de test de mise en page.',
    disclaimersFr: 'Avertissement: Cette application a été créée par DamiJosh comme réplication interactive de Canada.ca à des fins de démonstration de conception et de test de mise en page.',
    rights: '© DamiJosh, 2026',
    copyrightSub: '© DamiJosh, 2026',
    contactUs: 'Contactez-nous',
    helpCentre: 'Centre d\'aide',
    contactImmigration: 'Contacter l\'IRCC',
    feedback: 'Donner des commentaires',
    aboutGov: 'Gouvernement du Canada',
    allDepartments: 'Tous les ministères',
    howGovWorks: 'Comment fonctionne le gouvernement',
    publicService: 'Fonction publique et forces militaires',
    news: 'Nouvelles',
    legal: 'Lois et transparence',
    termsAndConditions: 'Avis généraux',
    privacy: 'Politique de confidentialité',
    lastModified: 'Date de modification : 2026-06-21',
  }
};
