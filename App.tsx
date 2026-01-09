import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { PlanList } from './components/PlanList';
import { WeeklyEditor } from './components/WeeklyEditor';
import { PrintPreview } from './components/PrintPreview';
import { Library } from './components/Library';
import { NewsletterEditor } from './components/NewsletterEditor';
import { DocumentEditor } from './components/DocumentEditor';
import { OnboardingModal } from './components/OnboardingModal';
import { LegalModal } from './components/LegalModal';
import { WeeklyPlan, AgeGroup, Activity, Newsletter, Document } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor' | 'print' | 'library' | 'newsletter_editor' | 'document_editor'>('dashboard');
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null);
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(null);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [library, setLibrary] = useState<Activity[]>([]);

  // State for Disclaimers
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  // Load data on mount
  useEffect(() => {
    if (!StorageService.getHasSeenOnboarding()) {
        setShowOnboarding(true);
    }
    refreshData();
  }, [view]);

  const handleOnboardingAccept = () => {
      StorageService.setHasSeenOnboarding();
      setShowOnboarding(false);
  };

  const refreshData = () => {
    setPlans(StorageService.getPlans());
    setNewsletters(StorageService.getNewsletters());
    setLibrary(StorageService.getLibrary());
  };

  // --- Plans Logic ---
  const handleCreatePlan = (ageGroup: AgeGroup, weekOf: string) => {
    const newPlan = StorageService.createPlan(weekOf, ageGroup);
    StorageService.savePlan(newPlan);
    setPlans(StorageService.getPlans());
    setCurrentPlan(newPlan);
    setView('editor');
  };

  const handleUseWeeklyTemplate = (template: WeeklyPlan) => {
    const weekOf = prompt("Enter Week Of (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
    if (!weekOf) return;

    // Create a deep copy of the template with new IDs
    const newPlan: WeeklyPlan = {
      ...template,
      id: `plan_${Date.now()}`,
      weekOf: weekOf,
      status: 'Draft',
      isTemplate: false,
      days: template.days.map(d => ({
        ...d,
        activities: d.activities.map(a => ({ ...a, id: `act_${Date.now()}_${Math.random()}` }))
      }))
    };
    
    StorageService.savePlan(newPlan);
    setCurrentPlan(newPlan);
    setView('editor');
  };

  const handleSelectPlan = (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (plan) {
      setCurrentPlan(plan);
      setView('editor');
    }
  };

  const handleDeletePlan = (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan? This cannot be undone.")) {
      StorageService.deletePlan(id);
      setPlans(StorageService.getPlans());
      if (currentPlan?.id === id) {
        setCurrentPlan(null);
        setView('dashboard');
      }
    }
  };

  const handleSavePlan = (plan: WeeklyPlan) => {
    StorageService.savePlan(plan);
    setPlans(StorageService.getPlans()); 
  };

  // --- Newsletters Logic ---
  const handleCreateNewsletter = () => {
     const newNl = StorageService.createNewsletter();
     StorageService.saveNewsletter(newNl);
     setNewsletters(StorageService.getNewsletters());
     setCurrentNewsletter(newNl);
     setView('newsletter_editor');
  };

  const handleSelectNewsletter = (id: string) => {
      const nl = newsletters.find(n => n.id === id);
      if (nl) {
          setCurrentNewsletter(nl);
          setView('newsletter_editor');
      }
  };

  const handleDeleteNewsletter = (id: string) => {
      if (confirm("Delete this newsletter?")) {
          StorageService.deleteNewsletter(id);
          setNewsletters(StorageService.getNewsletters());
      }
  };

  const handleSaveNewsletter = (nl: Newsletter) => {
      StorageService.saveNewsletter(nl);
      setNewsletters(StorageService.getNewsletters());
  };

  // --- Document Logic ---
  const handleEditDocument = (doc: Document) => {
     setCurrentDocument(doc);
     setView('document_editor');
  };

  const handleSaveDocument = (doc: Document) => {
      StorageService.saveDocument(doc);
  };

  const handlePrint = () => {
     if (currentPlan) {
        setView('print');
     }
  };

  if (showOnboarding) {
      return <OnboardingModal onAccept={handleOnboardingAccept} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {view === 'dashboard' && (
        <PlanList 
          plans={plans}
          newsletters={newsletters}
          onCreatePlan={handleCreatePlan}
          onCreateNewsletter={handleCreateNewsletter}
          onSelectPlan={handleSelectPlan}
          onSelectNewsletter={handleSelectNewsletter}
          onDeletePlan={handleDeletePlan}
          onDeleteNewsletter={handleDeleteNewsletter}
          onViewLibrary={() => setView('library')}
          onOpenLegal={() => setShowLegal(true)}
        />
      )}

      {view === 'library' && (
         <Library 
            onBack={() => setView('dashboard')} 
            onUseWeeklyTemplate={handleUseWeeklyTemplate}
            onEditDocument={handleEditDocument}
         />
      )}

      {view === 'editor' && currentPlan && (
        <WeeklyEditor 
          plan={currentPlan}
          library={library}
          onSave={handleSavePlan}
          onBack={() => setView('dashboard')}
          onPrint={handlePrint}
        />
      )}

      {view === 'newsletter_editor' && currentNewsletter && (
          <NewsletterEditor 
             newsletter={currentNewsletter}
             onSave={handleSaveNewsletter}
             onBack={() => setView('dashboard')}
          />
      )}

      {view === 'document_editor' && currentDocument && (
        <DocumentEditor 
          document={currentDocument}
          onSave={handleSaveDocument}
          onBack={() => setView('library')}
        />
      )}

      {view === 'print' && currentPlan && (
        <PrintPreview 
           plan={currentPlan}
           onClose={() => setView('editor')}
        />
      )}

      <LegalModal isOpen={showLegal} onClose={() => setShowLegal(false)} />
    </div>
  );
};

export default App;
