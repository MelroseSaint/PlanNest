// Data Models based on PRD

export type AgeGroup = 'Infant' | 'Toddler' | 'Preschool' | 'Pre-K' | 'Grade School';

export interface MaterialList {
  items: string[];
}

export interface Activity {
  id: string;
  title: string;
  type: 'Art' | 'Sensory' | 'Circle Time' | 'Outdoor' | 'Music' | 'General' | 'Literacy' | 'Fine Motor' | 'Gross Motor';
  objective: string;
  materials: string; // Stored as a simple text block for simplicity in V1
  description: string;
  ageGroup: AgeGroup;
  isTemplate?: boolean; // If true, lives in the library
}

export interface DayEntry {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  date?: string; // Optional specific date
  activities: Activity[];
  notes: string; // Logistical notes
  reflection?: string; // Pedagogical reflection (Did they like it? How did it work?)
  startEndTimes?: string; // e.g. "8:00 AM - 5:00 PM"
}

export interface DayTemplate {
  id: string;
  templateName: string;
  activities: Activity[];
  notes: string;
  ageGroup: AgeGroup;
}

export interface WeeklyPlan {
  id: string;
  weekOf: string; // YYYY-MM-DD representing the Monday
  ageGroup: AgeGroup;
  days: DayEntry[];
  teacherName?: string;
  theme?: string;
  status: 'Draft' | 'Finalized';
  isTemplate?: boolean; // If true, this is a Weekly Template (e.g. "Infant Default")
}

export interface Newsletter {
  id: string;
  month: string; // e.g., "October 2024"
  title: string; // e.g., "Fall Updates"
  overview: string; // "What's going on for the month"
  importantDates: string;
  reminders: string;
  createdDate: string;
}

// Generic Document for Licensing, Sub Plans, Monthly Overviews, etc.
export interface Document {
  id: string;
  title: string;
  type: 'Admin' | 'Substitute' | 'Licensing' | 'Planning' | 'Observation';
  sections: { title: string; content: string }[];
  lastModified: string;
}

export interface AppState {
  currentView: 'dashboard' | 'planner' | 'library' | 'print' | 'newsletter_editor' | 'document_editor';
  activePlanId: string | null;
  activeDocumentId: string | null;
  plans: WeeklyPlan[];
  library: Activity[];
  dayTemplates: DayTemplate[];
  weeklyTemplates: WeeklyPlan[];
  documents: Document[];
  newsletters: Newsletter[];
}
