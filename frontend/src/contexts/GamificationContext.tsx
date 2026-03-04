import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import type { GamificationProfile, VolunteerBadge, Achievement, LeaderboardEntry, VolunteerLevel } from '../types';
import { UserRole } from '../types';

// ─── Level Thresholds ─────────────────────────────────────────────────────────
export const LEVEL_THRESHOLDS: Record<VolunteerLevel, { min: number; max: number; label: string; color: string; bg: string; icon: string }> = {
  BRONZE:   { min: 0,    max: 100,  label: 'Bronze',   color: 'text-orange-700',  bg: 'bg-orange-100 dark:bg-orange-900/30',  icon: '🥉' },
  SILVER:   { min: 101,  max: 500,  label: 'Silver',   color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-700',        icon: '🥈' },
  GOLD:     { min: 501,  max: 2000, label: 'Gold',     color: 'text-yellow-600',  bg: 'bg-yellow-100 dark:bg-yellow-900/30',  icon: '🥇' },
  PLATINUM: { min: 2001, max: 9999, label: 'Platinum', color: 'text-purple-600',  bg: 'bg-purple-100 dark:bg-purple-900/30',  icon: '💎' },
};

export function getLevel(points: number): VolunteerLevel {
  if (points >= 2001) return 'PLATINUM';
  if (points >= 501)  return 'GOLD';
  if (points >= 101)  return 'SILVER';
  return 'BRONZE';
}

export function getNextLevelThreshold(level: VolunteerLevel): number {
  const thresholds: Record<VolunteerLevel, number> = { BRONZE: 101, SILVER: 501, GOLD: 2001, PLATINUM: 9999 };
  return thresholds[level];
}

export function getLevelProgress(points: number, level: VolunteerLevel): number {
  const info = LEVEL_THRESHOLDS[level];
  if (level === 'PLATINUM') return 100;
  return Math.min(100, Math.round(((points - info.min) / (info.max - info.min)) * 100));
}

// ─── All Possible Badges ──────────────────────────────────────────────────────
export const ALL_BADGES: VolunteerBadge[] = [
  { badgeId: 'first_helper',    name: 'First Helper',     description: 'Completed your first assignment',         icon: '🌟', rarity: 'COMMON'    },
  { badgeId: 'quick_responder', name: 'Quick Responder',  description: 'Responded within 1 hour to a request',    icon: '⚡', rarity: 'RARE'      },
  { badgeId: 'top_helper',      name: 'Top Helper',       description: 'Completed 50+ assignments',               icon: '🏆', rarity: 'EPIC'      },
  { badgeId: 'community_star',  name: 'Community Star',   description: 'Rated 5 stars by 10+ citizens',           icon: '⭐', rarity: 'RARE'      },
  { badgeId: 'week_warrior',    name: 'Week Warrior',     description: 'Completed 5 assignments in one week',     icon: '🗡️', rarity: 'RARE'      },
  { badgeId: 'century_helper',  name: 'Century Helper',   description: 'Completed 100+ assignments',              icon: '💯', rarity: 'EPIC'      },
  { badgeId: 'legend',          name: 'Community Legend', description: 'Reached Platinum level',                  icon: '💎', rarity: 'LEGENDARY' },
  { badgeId: 'helper_month',    name: 'Helper of Month',  description: 'Top volunteer for a full month',          icon: '📅', rarity: 'LEGENDARY' },
  { badgeId: 'skill_master',    name: 'Skill Master',     description: 'Used 5+ different skills',                icon: '🎓', rarity: 'EPIC'      },
  { badgeId: 'punctual',        name: 'Always Punctual',  description: 'No late completions in 10 assignments',   icon: '⏰', rarity: 'COMMON'    },
];

// ─── Mock Leaderboard Data ────────────────────────────────────────────────────
function generateMockLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, user: { userId: 101, name: 'Amina Uwase',    email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 1, province: 'Kigali', district: 'Gasabo', provinceCode: 'KGL' } }, points: 3240, completedAssignments: 87, level: 'PLATINUM', averageRating: 4.9, badges: [ALL_BADGES[0], ALL_BADGES[2], ALL_BADGES[6]] },
    { rank: 2, user: { userId: 102, name: 'Jean Habimana', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 2, province: 'Kigali', district: 'Kicukiro', provinceCode: 'KGL' } }, points: 2870, completedAssignments: 72, level: 'PLATINUM', averageRating: 4.8, badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[2]] },
    { rank: 3, user: { userId: 103, name: 'Marie Mukamana', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 3, province: 'Northern', district: 'Musanze', provinceCode: 'N' } }, points: 1850, completedAssignments: 56, level: 'GOLD', averageRating: 4.7, badges: [ALL_BADGES[0], ALL_BADGES[3]] },
    { rank: 4, user: { userId: 104, name: 'Patrick Niyonzima', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 4, province: 'Southern', district: 'Huye', provinceCode: 'S' } }, points: 1420, completedAssignments: 43, level: 'GOLD', averageRating: 4.6, badges: [ALL_BADGES[0], ALL_BADGES[4]] },
    { rank: 5, user: { userId: 105, name: 'Claudine Ingabire', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 5, province: 'Eastern', district: 'Rwamagana', provinceCode: 'E' } }, points: 980, completedAssignments: 31, level: 'GOLD', averageRating: 4.5, badges: [ALL_BADGES[0]] },
    { rank: 6, user: { userId: 106, name: 'Thierry Rutaganda', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 1, province: 'Kigali', district: 'Nyarugenge', provinceCode: 'KGL' } }, points: 620, completedAssignments: 19, level: 'GOLD', averageRating: 4.4, badges: [ALL_BADGES[0]] },
    { rank: 7, user: { userId: 107, name: 'Olive Tuyishime', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 2, province: 'Western', district: 'Rubavu', provinceCode: 'W' } }, points: 380, completedAssignments: 12, level: 'SILVER', averageRating: 4.3, badges: [ALL_BADGES[0]] },
    { rank: 8, user: { userId: 108, name: 'Eric Nshimiyimana', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 3, province: 'Northern', district: 'Gicumbi', provinceCode: 'N' } }, points: 210, completedAssignments: 7, level: 'SILVER', averageRating: 4.2, badges: [] },
    { rank: 9, user: { userId: 109, name: 'Grace Uwimana', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 4, province: 'Kigali', district: 'Gasabo', provinceCode: 'KGL' } }, points: 140, completedAssignments: 5, level: 'SILVER', averageRating: 4.0, badges: [] },
    { rank: 10, user: { userId: 110, name: 'David Bizimana', email: '', phoneNumber: '', role: 'VOLUNTEER', createdAt: '', location: { locationId: 5, province: 'Southern', district: 'Gisagara', provinceCode: 'S' } }, points: 80, completedAssignments: 3, level: 'BRONZE', averageRating: 3.8, badges: [] },
  ];
}

function buildProfileFromAssignments(completedCount: number): GamificationProfile {
  const points = completedCount * 40;
  const level = getLevel(points);
  const earned: VolunteerBadge[] = [];
  if (completedCount >= 1)  earned.push({ ...ALL_BADGES[0], earnedAt: new Date().toISOString() });
  if (completedCount >= 10) earned.push({ ...ALL_BADGES[4], earnedAt: new Date().toISOString() });
  if (completedCount >= 50) earned.push({ ...ALL_BADGES[2], earnedAt: new Date().toISOString() });
  if (level === 'PLATINUM') earned.push({ ...ALL_BADGES[6], earnedAt: new Date().toISOString() });

  const achievements: Achievement[] = [
    { achievementId: 'complete_1',   name: 'First Steps',       description: 'Complete 1 assignment',   icon: '👣', progress: Math.min(completedCount, 1),   target: 1,   completedAt: completedCount >= 1 ? new Date().toISOString() : undefined,   points: 10  },
    { achievementId: 'complete_10',  name: 'Getting Started',   description: 'Complete 10 assignments',  icon: '🎯', progress: Math.min(completedCount, 10),  target: 10,  completedAt: completedCount >= 10 ? new Date().toISOString() : undefined,  points: 50  },
    { achievementId: 'complete_50',  name: 'Halfway Legend',    description: 'Complete 50 assignments',  icon: '🦅', progress: Math.min(completedCount, 50),  target: 50,  completedAt: completedCount >= 50 ? new Date().toISOString() : undefined,  points: 200 },
    { achievementId: 'complete_100', name: 'Community Legend',  description: 'Complete 100 assignments', icon: '👑', progress: Math.min(completedCount, 100), target: 100, completedAt: completedCount >= 100 ? new Date().toISOString() : undefined, points: 500 },
  ];

  return {
    userId: 0,
    points,
    level,
    badges: earned,
    achievements,
    totalHoursServed: completedCount * 2,
    weeklyPoints: Math.floor(points * 0.1),
    monthlyPoints: Math.floor(points * 0.3),
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface GamificationContextType {
  profile: GamificationProfile | null;
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  addPoints: (pts: number, reason?: string) => void;
  refreshProfile: (completedAssignments: number) => void;
  showConfetti: boolean;
  triggerConfetti: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [leaderboard] = useState<LeaderboardEntry[]>(generateMockLeaderboard());
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (user?.role === UserRole.VOLUNTEER) {
      setIsLoading(true);
      // Simulate fetching from API — replace with real API call when backend supports it
      setTimeout(() => {
        const p = buildProfileFromAssignments(0);
        p.userId = user.userId;
        setProfile(p);
        setIsLoading(false);
      }, 500);
    }
  }, [user]);

  const addPoints = useCallback((pts: number) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const newPoints = prev.points + pts;
      const newLevel = getLevel(newPoints);
      const levelChanged = newLevel !== prev.level;
      if (levelChanged) {
        setTimeout(() => setShowConfetti(true), 100);
      }
      return { ...prev, points: newPoints, level: newLevel };
    });
  }, []);

  const refreshProfile = useCallback((completedAssignments: number) => {
    if (!user) return;
    const p = buildProfileFromAssignments(completedAssignments);
    p.userId = user.userId;
    setProfile(p);
  }, [user]);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  return (
    <GamificationContext.Provider value={{ profile, leaderboard, isLoading, addPoints, refreshProfile, showConfetti, triggerConfetti }}>
      {children}
    </GamificationContext.Provider>
  );
};
