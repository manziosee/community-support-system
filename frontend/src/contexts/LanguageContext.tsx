import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, TranslationKeys } from '../types';

// ─── Translation Dictionaries ─────────────────────────────────────────────────

const en: TranslationKeys = {
  nav_dashboard: 'Dashboard',
  nav_requests: 'My Requests',
  nav_create_request: 'Create Request',
  nav_available_requests: 'Available Requests',
  nav_assignments: 'My Assignments',
  nav_notifications: 'Notifications',
  nav_profile: 'Profile',
  nav_settings: 'Settings',
  nav_leaderboard: 'Leaderboard',
  nav_community: 'Community Board',
  nav_availability: 'My Availability',
  nav_achievements: 'Achievements',
  nav_sign_out: 'Sign Out',
  nav_my_skills: 'My Skills',
  nav_user_management: 'User Management',
  nav_skill_management: 'Skill Management',
  nav_locations: 'Locations',
  nav_analytics: 'Analytics',
  nav_advanced_reports: 'Advanced Reports',
  nav_system_settings: 'System Settings',
  nav_profile_settings: 'Profile & Settings',
  section_my_services: 'MY SERVICES',
  section_community: 'COMMUNITY',
  section_achievements: 'ACHIEVEMENTS',
  section_users: 'USERS',
  section_requests: 'REQUESTS',
  section_system: 'SYSTEM',
  section_account: 'ACCOUNT',
  action_create: 'Create',
  action_edit: 'Edit',
  action_delete: 'Delete',
  action_save: 'Save',
  action_cancel: 'Cancel',
  action_submit: 'Submit',
  action_view_all: 'View All',
  action_search: 'Search',
  action_filter: 'Filter',
  action_export: 'Export',
  action_loading: 'Loading…',
  action_accept: 'Accept',
  action_complete: 'Complete',
  action_view_details: 'View Details',
  action_assign: 'Assign',
  status_pending: 'Pending',
  status_accepted: 'Accepted',
  status_completed: 'Completed',
  status_cancelled: 'Cancelled',
  status_online: 'Online',
  status_offline: 'Offline',
  status_busy: 'Busy',
  status_urgent: 'Urgent',
  status_normal: 'Normal',
  dashboard_welcome: 'Welcome back',
  dashboard_total_requests: 'Total Requests',
  dashboard_completed: 'Completed',
  dashboard_pending: 'Pending',
  dashboard_notifications: 'Notifications',
  dashboard_my_assignments: 'My Assignments',
  dashboard_active_assignments: 'Active Assignments',
  dashboard_recent_requests: 'Recent Requests',
  dashboard_quick_stats: 'Quick Stats',
  dashboard_status_breakdown: 'Status Breakdown',
  gamification_points: 'Points',
  gamification_level: 'Level',
  gamification_badges: 'Badges',
  gamification_achievements: 'Achievements',
  gamification_leaderboard: 'Leaderboard',
  gamification_rank: 'Rank',
  greeting_morning: 'Good morning',
  greeting_afternoon: 'Good afternoon',
  greeting_evening: 'Good evening',
  misc_no_data: 'No data available',
  misc_loading: 'Loading…',
  misc_error: 'Something went wrong',
  misc_success: 'Success!',
  misc_confirm_delete: 'Are you sure you want to delete this?',
  misc_search_placeholder: 'Search requests, users…',
  common_language: 'Language',
};


const fr: TranslationKeys = {
  nav_dashboard: 'Tableau de bord',
  nav_requests: 'Mes Demandes',
  nav_create_request: 'Créer une Demande',
  nav_available_requests: 'Demandes Disponibles',
  nav_assignments: 'Mes Missions',
  nav_notifications: 'Notifications',
  nav_profile: 'Profil',
  nav_settings: 'Paramètres',
  nav_leaderboard: 'Classement',
  nav_community: 'Tableau Communautaire',
  nav_availability: 'Ma Disponibilité',
  nav_achievements: 'Réalisations',
  nav_sign_out: 'Se Déconnecter',
  nav_my_skills: 'Mes Compétences',
  nav_user_management: 'Gestion des Utilisateurs',
  nav_skill_management: 'Gestion des Compétences',
  nav_locations: 'Emplacements',
  nav_analytics: 'Analytique',
  nav_advanced_reports: 'Rapports Avancés',
  nav_system_settings: 'Paramètres Système',
  nav_profile_settings: 'Profil et Paramètres',
  section_my_services: 'MES SERVICES',
  section_community: 'COMMUNAUTÉ',
  section_achievements: 'RÉALISATIONS',
  section_users: 'UTILISATEURS',
  section_requests: 'DEMANDES',
  section_system: 'SYSTÈME',
  section_account: 'COMPTE',
  action_create: 'Créer',
  action_edit: 'Modifier',
  action_delete: 'Supprimer',
  action_save: 'Enregistrer',
  action_cancel: 'Annuler',
  action_submit: 'Soumettre',
  action_view_all: 'Voir Tout',
  action_search: 'Rechercher',
  action_filter: 'Filtrer',
  action_export: 'Exporter',
  action_loading: 'Chargement…',
  action_accept: 'Accepter',
  action_complete: 'Terminer',
  action_view_details: 'Voir Détails',
  action_assign: 'Assigner',
  status_pending: 'En Attente',
  status_accepted: 'Accepté',
  status_completed: 'Terminé',
  status_cancelled: 'Annulé',
  status_online: 'En Ligne',
  status_offline: 'Hors Ligne',
  status_busy: 'Occupé',
  status_urgent: 'Urgent',
  status_normal: 'Normal',
  dashboard_welcome: 'Bon retour',
  dashboard_total_requests: 'Total des Demandes',
  dashboard_completed: 'Terminées',
  dashboard_pending: 'En Attente',
  dashboard_notifications: 'Notifications',
  dashboard_my_assignments: 'Mes Missions',
  dashboard_active_assignments: 'Missions Actives',
  dashboard_recent_requests: 'Demandes Récentes',
  dashboard_quick_stats: 'Statistiques Rapides',
  dashboard_status_breakdown: 'Répartition par Statut',
  gamification_points: 'Points',
  gamification_level: 'Niveau',
  gamification_badges: 'Badges',
  gamification_achievements: 'Réalisations',
  gamification_leaderboard: 'Classement',
  gamification_rank: 'Rang',
  greeting_morning: 'Bonjour',
  greeting_afternoon: 'Bon après-midi',
  greeting_evening: 'Bonsoir',
  misc_no_data: 'Aucune donnée disponible',
  misc_loading: 'Chargement…',
  misc_error: 'Une erreur est survenue',
  misc_success: 'Succès !',
  misc_confirm_delete: 'Êtes-vous sûr de vouloir supprimer ceci ?',
  misc_search_placeholder: 'Rechercher demandes, utilisateurs…',
  common_language: 'Langue',
};


const TRANSLATIONS: Record<Language, TranslationKeys> = { en, fr };

// ─── Context ──────────────────────────────────────────────────────────────────
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
  availableLanguages: { code: Language; label: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export const AVAILABLE_LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('app-language') as Language | null;
    return stored && ['en', 'fr'].includes(stored) ? stored : 'en';
  });

  // Sync i18next on mount
  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
    document.documentElement.lang = lang;
    // Sync with i18next
    i18n.changeLanguage(lang);
  }, [i18n]);

  const t = useCallback((key: keyof TranslationKeys): string => {
    return TRANSLATIONS[language][key] ?? TRANSLATIONS.en[key] ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages: AVAILABLE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};
