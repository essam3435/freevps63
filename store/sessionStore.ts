import { create } from 'zustand';

export interface Session {
  id: string;
  name: string;
  phoneNumber: string;
  appId: string;
  apiHash: string;
  has2FA: boolean;
  createdAt: number;
  lastUsed?: number;
  status: 'active' | 'inactive' | 'terminated';
  otpCodes: string[];
}

export interface SessionStore {
  sessions: Session[];
  addSession: (session: Session) => void;
  removeSession: (id: string) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  cloneSession: (id: string, newName: string) => void;
  addOTPCode: (sessionId: string, code: string) => void;
  terminateSessions: (ids: string[]) => void;
  autoCleanupOldSessions: () => string[];
  getSessionsByAge: (hours: number) => Session[];
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],

  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
    })),

  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    })),

  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  cloneSession: (id, newName) => {
    const state = get();
    const session = state.sessions.find((s) => s.id === id);
    if (session) {
      const newSession: Session = {
        ...session,
        id: `${session.id}_clone_${Date.now()}`,
        name: newName,
        createdAt: Date.now(),
        status: 'active',
        otpCodes: [],
      };
      set((state) => ({
        sessions: [...state.sessions, newSession],
      }));
    }
  },

  addOTPCode: (sessionId, code) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, otpCodes: [code, ...s.otpCodes] }
          : s
      ),
    })),

  terminateSessions: (ids) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        ids.includes(s.id) ? { ...s, status: 'terminated' } : s
      ),
    })),

  getSessionsByAge: (hours) => {
    const state = get();
    const now = Date.now();
    const ageMs = hours * 60 * 60 * 1000;
    return state.sessions.filter((s) => now - s.createdAt > ageMs);
  },

  autoCleanupOldSessions: () => {
    const state = get();
    const oldSessions = state.sessions.filter(
      (s) => Date.now() - s.createdAt > 24 * 60 * 60 * 1000
    );
    const ids = oldSessions.map((s) => s.id);
    if (ids.length > 0) {
      set((state) => ({
        sessions: state.sessions.map((s) =>
          ids.includes(s.id) ? { ...s, status: 'terminated' } : s
        ),
      }));
    }
    return ids;
  },
}));
