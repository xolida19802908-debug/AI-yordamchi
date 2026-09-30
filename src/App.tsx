import React, { useState, useEffect } from 'react';
import { Sidebar, NavSection } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Dashboard } from './components/dashboard/Dashboard';
import { LessonGenerator } from './components/generators/LessonGenerator';
import { TestGenerator } from './components/generators/TestGenerator';
import { QuestionGenerator } from './components/generators/QuestionGenerator';
import { HomeworkGenerator } from './components/generators/HomeworkGenerator';
import { InteractiveGenerator } from './components/generators/InteractiveGenerator';
import { TopicExplainer } from './components/generators/TopicExplainer';
import { AssessmentGenerator } from './components/generators/AssessmentGenerator';
import { SavedMaterials } from './components/saved/SavedMaterials';
import { MaterialDetailModal } from './components/saved/MaterialDetailModal';
import { SettingsView } from './components/settings/SettingsView';
import { SavedMaterial, TeacherProfile } from './types';
import { getSavedMaterials, getTeacherProfile } from './services/storage';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [savedMaterials, setSavedMaterials] = useState<SavedMaterial[]>([]);
  const [profile, setProfile] = useState<TeacherProfile>(getTeacherProfile());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [detailModalMaterial, setDetailModalMaterial] = useState<SavedMaterial | null>(null);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  // Load saved materials on mount
  useEffect(() => {
    refreshMaterials();
  }, []);

  const refreshMaterials = () => {
    setSavedMaterials(getSavedMaterials());
  };

  const handleShowToast = (type: 'success' | 'error' | 'info', message: string) => {
    const newToast: ToastMessage = {
      id: 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigateToSaved = (searchQuery?: string) => {
    if (searchQuery !== undefined) {
      setInitialSearchQuery(searchQuery);
    }
    setActiveSection('saved');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMaterialDetail = (material: SavedMaterial) => {
    setDetailModalMaterial(material);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard
            profile={profile}
            savedMaterials={savedMaterials}
            onNavigate={(sec) => {
              setActiveSection(sec);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenMaterial={handleOpenMaterialDetail}
          />
        );
      case 'lesson':
        return (
          <LessonGenerator
            profile={profile}
            onShowToast={handleShowToast}
          />
        );
      case 'test':
        return (
          <TestGenerator
            profile={profile}
            onShowToast={handleShowToast}
          />
        );
      case 'questions':
        return (
          <QuestionGenerator
            profile={profile}
            onShowToast={handleShowToast}
          />
        );
      case 'homework':
        return (
          <HomeworkGenerator
            profile={profile}
            onShowToast={handleShowToast}
          />
        );
      case 'interactive':
        return (
          <InteractiveGenerator
            profile={profile}
            onShowToast={handleShowToast}
          />
        );
      case 'assessment':
        return (
          <AssessmentGenerator
            profile={profile}
            onShowToast={handleShowToast}
          />
        );
      case 'explanation':
        return (
          <TopicExplainer
            profile={profile}
            onShowToast={handleShowToast}
          />
        );
      case 'saved':
        return (
          <SavedMaterials
            materials={savedMaterials}
            onRefreshMaterials={refreshMaterials}
            onOpenMaterialDetail={handleOpenMaterialDetail}
            onShowToast={handleShowToast}
            initialSearchQuery={initialSearchQuery}
          />
        );
      case 'settings':
        return (
          <SettingsView
            profile={profile}
            onUpdateProfile={(p) => setProfile(p)}
            onShowToast={handleShowToast}
            onRefreshMaterials={refreshMaterials}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      {/* Sidebar (Desktop) */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedMaterials.length}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedMaterials.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          profile={profile}
          activeSection={activeSection}
          savedCount={savedMaterials.length}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateToSaved={handleNavigateToSaved}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActiveSection()}
        </main>
      </div>

      {/* Detail Modal for Saved Materials */}
      <MaterialDetailModal
        material={detailModalMaterial}
        onClose={() => setDetailModalMaterial(null)}
        onShowToast={handleShowToast}
      />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
