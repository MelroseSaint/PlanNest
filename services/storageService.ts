import { WeeklyPlan, Activity, AgeGroup, DayTemplate, Newsletter, Document, DayEntry } from '../types';

const PLANS_KEY = 'dpb_plans_v1';
const LIBRARY_KEY = 'dpb_library_v1';
const DAY_TEMPLATES_KEY = 'dpb_day_templates_v1';
const WEEKLY_TEMPLATES_KEY = 'dpb_weekly_templates_v1';
const DOCUMENTS_KEY = 'dpb_documents_v1';
const NEWSLETTERS_KEY = 'dpb_newsletters_v1';
const ONBOARDING_KEY = 'dpb_onboarding_seen_v1';

// --- SEED DATA ---

const SEED_ACTIVITIES: Activity[] = [
  {
    id: 'act_seed_001',
    title: 'Finger Painting',
    type: 'Art',
    objective: 'Develop fine motor skills and color recognition',
    materials: 'Paper, Non-toxic paint, Aprons',
    description: 'Allow children to explore mixing primary colors on large sheets of paper.',
    ageGroup: 'Toddler',
    isTemplate: true,
  },
  {
    id: 'act_seed_002',
    title: 'Nature Walk & Sort',
    type: 'Sensory',
    objective: 'Explore textures and nature; Classification skills',
    materials: 'Collection bags, Bins for sorting',
    description: 'Walk outside to collect leaves/rocks. Return to class and sort by size/color.',
    ageGroup: 'Preschool',
    isTemplate: true,
  },
  {
    id: 'act_seed_003',
    title: 'Parachute Play',
    type: 'Gross Motor',
    objective: 'Cooperation and large muscle movement',
    materials: 'Large Parachute',
    description: 'Group lifts parachute up and down. Run underneath on cue.',
    ageGroup: 'Pre-K',
    isTemplate: true,
  },
  {
    id: 'act_seed_004',
    title: 'Tummy Time Sensory',
    type: 'Sensory',
    objective: 'Neck strength and visual tracking',
    materials: 'Sensory mat, mirror',
    description: 'Place infant on stomach with mirror or high-contrast cards in front.',
    ageGroup: 'Infant',
    isTemplate: true,
  }
];

const SEED_DAY_TEMPLATES: DayTemplate[] = [
  {
    id: 'day_seed_001',
    templateName: 'Full-Day Schedule (Toddler)',
    ageGroup: 'Toddler',
    notes: '09:00 Snack | 12:00 Lunch | 12:30 Nap',
    activities: [
      { id: 't_01', title: 'Morning Circle', type: 'Circle Time', objective: 'Greeting & Song', materials: 'Carpet', description: 'Welcome song and weather check.', ageGroup: 'Toddler' },
      { id: 't_02', title: 'Outdoor Play', type: 'Outdoor', objective: 'Gross Motor', materials: 'Playground', description: 'Free play on structure.', ageGroup: 'Toddler' },
      { id: 't_03', title: 'Sensory Bin', type: 'Sensory', objective: 'Tactile exploration', materials: 'Rice/Water bin', description: 'Scooping and pouring.', ageGroup: 'Toddler' }
    ]
  },
  {
    id: 'day_seed_002',
    templateName: 'Rainy Day / Indoor Plan',
    ageGroup: 'Preschool',
    notes: 'Indoor Recess Schedule Active',
    activities: [
      { id: 'r_01', title: 'Indoor Obstacle Course', type: 'Gross Motor', objective: 'Movement', materials: 'Cushions, Tunnels', description: 'Set up safe path in classroom.', ageGroup: 'Preschool' },
      { id: 'r_02', title: 'Freeze Dance', type: 'Music', objective: 'Listening skills', materials: 'Music player', description: 'Dance until music stops.', ageGroup: 'Preschool' }
    ]
  }
];

const SEED_DOCUMENTS: Document[] = [
  {
    id: 'doc_seed_001',
    title: 'Substitute Teacher Instructions',
    type: 'Substitute',
    lastModified: new Date().toISOString(),
    sections: [
      { title: 'Daily Schedule Overview', content: '8:00 Arrival\n9:00 Breakfast\n10:00 Circle Time\n11:00 Outside\n12:00 Lunch\n1:00 Nap' },
      { title: 'Medical / Allergies', content: 'See red binder on desk for specific EpiPen locations.\nList specific allergies here:' },
      { title: 'Emergency Contacts', content: 'Director: 555-0100\nFront Desk: 555-0101' },
      { title: 'Key Rules', content: '1. Never leave children unattended.\n2. Head count every 15 minutes.\n3. Hand washing before all meals.' }
    ]
  },
  {
    id: 'doc_seed_002',
    title: 'Monthly Theme Overview',
    type: 'Planning',
    lastModified: new Date().toISOString(),
    sections: [
      { title: 'Month & Theme', content: 'Month: \nTheme: ' },
      { title: 'Key Concepts / Goals', content: '1. \n2. \n3. ' },
      { title: 'Special Events / Holidays', content: '' },
      { title: 'Book List', content: '' }
    ]
  },
  {
    id: 'doc_seed_003',
    title: 'Inspector Walk-In Summary',
    type: 'Licensing',
    lastModified: new Date().toISOString(),
    sections: [
      { title: 'Ratios Check', content: 'Room: \nTime: \nStaff Present: \nChildren Present: \nRatio Met: Yes / No' },
      { title: 'Environment Safety', content: '[ ] Outlets covered\n[ ] Chemicals/Cleaners locked\n[ ] First Aid Kit accessible\n[ ] Walkways clear\n[ ] Heavy furniture secured' },
      { title: 'Documentation Check', content: '[ ] Attendance Log updated (Time In/Out)\n[ ] Allergy/Dietary list posted\n[ ] Daily Health Checks complete\n[ ] Emergency Cards accessible' }
    ]
  },
  {
    id: 'doc_seed_004',
    title: 'Weekly Reflection Notes',
    type: 'Observation',
    lastModified: new Date().toISOString(),
    sections: [
      { title: 'What worked well this week?', content: '' },
      { title: 'What did not work?', content: '' },
      { title: 'Individual Child Notes', content: '' },
      { title: 'Adjustments for next week', content: '' }
    ]
  },
  {
    id: 'doc_seed_005',
    title: 'Lesson Plan Coverage Summary',
    type: 'Licensing',
    lastModified: new Date().toISOString(),
    sections: [
      { title: 'Social & Emotional Development', content: '[ ] Cooperative Play\n[ ] Self-Regulation Activity\n[ ] Group Circle Time\n[ ] Sharing / Turn Taking' },
      { title: 'Language & Literacy', content: '[ ] Story Time\n[ ] Vocabulary Building\n[ ] Letter Recognition\n[ ] Rhyming / Songs' },
      { title: 'Physical Development', content: '[ ] Gross Motor (Running/Jumping)\n[ ] Fine Motor (Writing/Pinching)\n[ ] Sensory Exploration\n[ ] Outdoor Play' },
      { title: 'Cognitive / Math', content: '[ ] Counting/Sorting\n[ ] Pattern Recognition\n[ ] Science/Nature Discovery\n[ ] Problem Solving' }
    ]
  },
  {
    id: 'doc_seed_006',
    title: 'Daily Activity Log',
    type: 'Licensing',
    lastModified: new Date().toISOString(),
    sections: [
      { title: 'Date', content: '' },
      { title: 'Scheduled Activities Completed', content: '1. \n2. \n3. ' },
      { title: 'Modifications Made', content: 'Changed outdoor play to indoor due to weather: Yes/No' },
      { title: 'Unusual Incidents', content: 'None reported.' }
    ]
  },
  {
    id: 'doc_seed_007',
    title: 'Materials & Safety Checklist',
    type: 'Licensing',
    lastModified: new Date().toISOString(),
    sections: [
      { title: 'Indoor Safety', content: '[ ] Electrical outlets covered\n[ ] Exits unblocked\n[ ] Floor clean/dry\n[ ] Heavy furniture secured' },
      { title: 'Outdoor Safety', content: '[ ] Fences secure\n[ ] Play equipment dry/safe\n[ ] No hazardous debris' },
      { title: 'Emergency Supplies', content: '[ ] First Aid Kit stocked\n[ ] Emergency contacts updated\n[ ] Flashlight working' }
    ]
  },
  {
    id: 'doc_seed_008',
    title: 'Incident/Injury Report',
    type: 'Licensing',
    lastModified: new Date().toISOString(),
    sections: [
      { title: 'Child Name', content: '' },
      { title: 'Date', content: '' },
      { title: 'Time', content: '' },
      { title: 'Description of Incident', content: 'Where did it happen?\nWhat happened details:' },
      { title: 'Action Taken', content: 'First aid administered:\nBy whom:' },
      { title: 'Parent Notification', content: 'Time notified:\nMethod (Phone/In-Person):\nPerson contacted:' },
      { title: 'Staff Signature', content: '' }
    ]
  },
  {
    id: 'doc_seed_009',
    title: 'Policy Acknowledgement',
    type: 'Admin',
    lastModified: new Date().toISOString(),
    sections: [
      { title: 'Policy Name', content: '' },
      { title: 'Employee Statement', content: 'I have read and understood the policies regarding...' },
      { title: 'Signature & Date', content: '' }
    ]
  }
];

// Seed Helper for Weekly Templates
const createWeeklyTemplate = (age: AgeGroup, title: string, defaultActivities: string[]): WeeklyPlan => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => ({
    dayOfWeek: d as any,
    notes: '',
    reflection: '',
    activities: defaultActivities.map((actTitle, i) => ({
      id: `wt_${age}_${d}_${i}`,
      title: actTitle,
      type: 'General',
      objective: '',
      materials: '',
      description: '',
      ageGroup: age
    }))
  }));

  return {
    id: `wt_seed_${age}`,
    weekOf: 'TEMPLATE',
    ageGroup: age,
    teacherName: 'TEMPLATE',
    theme: title,
    status: 'Draft',
    isTemplate: true,
    days: days as DayEntry[]
  };
};

const SEED_WEEKLY_TEMPLATES: WeeklyPlan[] = [
  createWeeklyTemplate('Infant', 'Infant Routine Template', ['Arrival / Health Check', 'Tummy Time', 'Sensory Exploration', 'Stroller Walk / Outdoor', 'Music & Cuddle']),
  createWeeklyTemplate('Toddler', 'Toddler Activity Template', ['Morning Circle', 'Art Activity', 'Outdoor Play', 'Story Time', 'Music & Movement']),
  createWeeklyTemplate('Preschool', 'Preschool Structured Template', ['Morning Meeting', 'Small Group Literacy', 'Centers / Free Play', 'Outdoor Gross Motor', 'Math Activity'])
];


export const StorageService = {
  // --- Onboarding ---
  getHasSeenOnboarding: (): boolean => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  },
  setHasSeenOnboarding: (): void => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  },

  // --- Weekly Plans ---
  getPlans: (): WeeklyPlan[] => {
    const data = localStorage.getItem(PLANS_KEY);
    return data ? JSON.parse(data) : [];
  },
  savePlan: (plan: WeeklyPlan): void => {
    const items = StorageService.getPlans();
    const index = items.findIndex((p) => p.id === plan.id);
    if (index >= 0) items[index] = plan;
    else items.push(plan);
    localStorage.setItem(PLANS_KEY, JSON.stringify(items));
  },
  deletePlan: (id: string): void => {
    const items = StorageService.getPlans().filter((p) => p.id !== id);
    localStorage.setItem(PLANS_KEY, JSON.stringify(items));
  },

  // --- Library (Activities) ---
  getLibrary: (): Activity[] => {
    const data = localStorage.getItem(LIBRARY_KEY);
    if (!data) {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(SEED_ACTIVITIES));
      return SEED_ACTIVITIES;
    }
    return JSON.parse(data);
  },
  saveActivityToLibrary: (activity: Activity): void => {
    const items = StorageService.getLibrary();
    const template = { ...activity, isTemplate: true };
    const index = items.findIndex((a) => a.id === activity.id);
    if (index >= 0) items[index] = template;
    else items.push(template);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
  },
  deleteActivityTemplate: (id: string): void => {
    const items = StorageService.getLibrary().filter(a => a.id !== id);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
  },

  // --- Day Templates ---
  getDayTemplates: (): DayTemplate[] => {
    const data = localStorage.getItem(DAY_TEMPLATES_KEY);
    if (!data) {
      localStorage.setItem(DAY_TEMPLATES_KEY, JSON.stringify(SEED_DAY_TEMPLATES));
      return SEED_DAY_TEMPLATES;
    }
    return JSON.parse(data);
  },
  saveDayTemplate: (template: DayTemplate): void => {
    const items = StorageService.getDayTemplates();
    const index = items.findIndex(t => t.id === template.id);
    if (index >= 0) items[index] = template;
    else items.push(template);
    localStorage.setItem(DAY_TEMPLATES_KEY, JSON.stringify(items));
  },
  deleteDayTemplate: (id: string): void => {
    const items = StorageService.getDayTemplates().filter(t => t.id !== id);
    localStorage.setItem(DAY_TEMPLATES_KEY, JSON.stringify(items));
  },

  // --- Weekly Templates ---
  getWeeklyTemplates: (): WeeklyPlan[] => {
    const data = localStorage.getItem(WEEKLY_TEMPLATES_KEY);
    if (!data) {
      localStorage.setItem(WEEKLY_TEMPLATES_KEY, JSON.stringify(SEED_WEEKLY_TEMPLATES));
      return SEED_WEEKLY_TEMPLATES;
    }
    return JSON.parse(data);
  },
  saveWeeklyTemplate: (template: WeeklyPlan): void => {
    const items = StorageService.getWeeklyTemplates();
    const toSave = { ...template, isTemplate: true, weekOf: 'TEMPLATE' };
    const index = items.findIndex(t => t.id === template.id);
    if (index >= 0) items[index] = toSave;
    else items.push(toSave);
    localStorage.setItem(WEEKLY_TEMPLATES_KEY, JSON.stringify(items));
  },
  deleteWeeklyTemplate: (id: string): void => {
    const items = StorageService.getWeeklyTemplates().filter(t => t.id !== id);
    localStorage.setItem(WEEKLY_TEMPLATES_KEY, JSON.stringify(items));
  },

  // --- Documents (Forms) ---
  getDocuments: (): Document[] => {
    const data = localStorage.getItem(DOCUMENTS_KEY);
    
    // If no data, init with seed.
    if (!data) {
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(SEED_DOCUMENTS));
      return SEED_DOCUMENTS;
    }

    // If data exists, merge missing seed items (for users with existing data)
    const items: Document[] = JSON.parse(data);
    let changed = false;
    SEED_DOCUMENTS.forEach(seedDoc => {
      if (!items.some(doc => doc.id === seedDoc.id)) {
        items.push(seedDoc);
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(items));
    }
    return items;
  },
  saveDocument: (doc: Document): void => {
    const items = StorageService.getDocuments();
    const toSave = { ...doc, lastModified: new Date().toISOString() };
    const index = items.findIndex(d => d.id === doc.id);
    if (index >= 0) items[index] = toSave;
    else items.push(toSave);
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(items));
  },
  deleteDocument: (id: string): void => {
    const items = StorageService.getDocuments().filter(d => d.id !== id);
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(items));
  },
  createDocument: (type: Document['type'], title: string): Document => {
    return {
      id: `doc_${Date.now()}`,
      title: title,
      type: type,
      lastModified: new Date().toISOString(),
      sections: [{ title: 'Notes', content: '' }]
    };
  },


  // --- Newsletters ---
  getNewsletters: (): Newsletter[] => {
    const data = localStorage.getItem(NEWSLETTERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveNewsletter: (newsletter: Newsletter): void => {
    const items = StorageService.getNewsletters();
    const index = items.findIndex(n => n.id === newsletter.id);
    if (index >= 0) items[index] = newsletter;
    else items.push(newsletter);
    localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(items));
  },
  deleteNewsletter: (id: string): void => {
    const items = StorageService.getNewsletters().filter(n => n.id !== id);
    localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(items));
  },
  createNewsletter: (): Newsletter => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    return {
      id: `nl_${Date.now()}`,
      month: month,
      title: `${month} Newsletter`,
      overview: '',
      importantDates: '',
      reminders: '',
      createdDate: date.toISOString()
    };
  },

  // --- Helper ---
  createPlan: (weekOf: string, ageGroup: AgeGroup): WeeklyPlan => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => ({
      dayOfWeek: day as any,
      activities: [],
      notes: '',
      reflection: '',
    }));

    return {
      id: Date.now().toString(),
      weekOf,
      ageGroup,
      days,
      status: 'Draft',
      theme: '',
    };
  },

  // --- Backup / Restore ---
  createBackup: (): string => {
    const backup = {
      version: 1,
      timestamp: new Date().toISOString(),
      plans: JSON.parse(localStorage.getItem(PLANS_KEY) || '[]'),
      library: JSON.parse(localStorage.getItem(LIBRARY_KEY) || '[]'),
      dayTemplates: JSON.parse(localStorage.getItem(DAY_TEMPLATES_KEY) || '[]'),
      weeklyTemplates: JSON.parse(localStorage.getItem(WEEKLY_TEMPLATES_KEY) || '[]'),
      documents: JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]'),
      newsletters: JSON.parse(localStorage.getItem(NEWSLETTERS_KEY) || '[]'),
    };
    return JSON.stringify(backup, null, 2);
  },

  restoreBackup: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      // Basic validation
      if (!data || !data.version) {
        throw new Error("Invalid backup file format");
      }

      // Restore keys
      if (data.plans) localStorage.setItem(PLANS_KEY, JSON.stringify(data.plans));
      if (data.library) localStorage.setItem(LIBRARY_KEY, JSON.stringify(data.library));
      if (data.dayTemplates) localStorage.setItem(DAY_TEMPLATES_KEY, JSON.stringify(data.dayTemplates));
      if (data.weeklyTemplates) localStorage.setItem(WEEKLY_TEMPLATES_KEY, JSON.stringify(data.weeklyTemplates));
      if (data.documents) localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(data.documents));
      if (data.newsletters) localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(data.newsletters));
      
      return true;
    } catch (e) {
      console.error("Restore failed", e);
      return false;
    }
  }
};
