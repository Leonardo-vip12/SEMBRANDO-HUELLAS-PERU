import { create } from 'zustand';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: { xp: number; badge?: string };
  expiresAt?: string;
}

interface GamificationState {
  xp: number;
  level: number;
  badges: Badge[];
  challenges: Challenge[];
  rank?: number;
  xpToNextLevel: number;
  addXp: (amount: number) => void;
  addBadge: (badge: Badge) => void;
  updateChallenge: (id: string, progress: number) => void;
  loadFromDB: () => Promise<void>;
  saveToDB: () => Promise<void>;
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];

function calculateLevel(xp: number): { level: number; xpToNext: number } {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 5000;
  return { level, xpToNext: nextThreshold - currentThreshold };
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  xp: 0,
  level: 1,
  badges: [],
  challenges: [
    { id: 'first-observation', title: 'Primera Observación', description: 'Registra tu primera observación', progress: 0, target: 1, reward: { xp: 50 } },
    { id: 'five-identifications', title: 'Naturalista', description: 'Identifica 5 especies', progress: 0, target: 5, reward: { xp: 100, badge: 'naturalista' } },
    { id: 'ten-days-streak', title: 'Dedicado', description: 'Usa la app 10 días seguidos', progress: 0, target: 10, reward: { xp: 200, badge: 'dedicado' } },
  ],
  xpToNextLevel: 100,

  addXp: (amount) => {
    const { xp } = get();
    const newXp = xp + amount;
    const { level, xpToNext } = calculateLevel(newXp);
    set({ xp: newXp, level, xpToNextLevel: xpToNext });
  },

  addBadge: (badge) => {
    const { badges } = get();
    if (!badges.find(b => b.id === badge.id)) {
      set({ badges: [...badges, { ...badge, earnedAt: new Date().toISOString() }] });
    }
  },

  updateChallenge: (id, progress) => {
    const { challenges } = get();
    set({
      challenges: challenges.map(c =>
        c.id === id ? { ...c, progress: Math.min(c.target, progress) } : c
      ),
    });
  },

  loadFromDB: async () => {
    try {
      const { initDatabase } = await import('expo-sqlite');
      const db = await initDatabase('sembrando-huellas.db');
      const rows = await db.getAllAsync('SELECT value FROM gamification WHERE key = ?', ['gamification_data']);
      if (rows.length > 0) {
        const data = JSON.parse(rows[0].value);
        set({
          xp: data.xp || 0,
          badges: data.badges || [],
          challenges: data.challenges || get().challenges,
        });
      }
    } catch {}
  },

  saveToDB: async () => {
    try {
      const { initDatabase } = await import('expo-sqlite');
      const db = await initDatabase('sembrando-huellas.db');
      const data = { xp: get().xp, badges: get().badges, challenges: get().challenges };
      await db.runAsync('INSERT OR REPLACE INTO gamification (key, value) VALUES (?, ?)', 'gamification_data', JSON.stringify(data));
    } catch {}
  },
}));
