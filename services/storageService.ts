
import { Assessment, PatientProfile, User } from "../types";

const KEYS = {
  USER: 'neurocare_user',
  PROFILE: 'neurocare_profile',
  HISTORY: 'neurocare_history'
};

export const storage = {
  saveUser: (user: User) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  getUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  clearUser: () => localStorage.removeItem(KEYS.USER),

  saveProfile: (profile: PatientProfile) => localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile)),
  getProfile: (): PatientProfile | null => {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },

  saveAssessment: (assessment: Assessment) => {
    const history = storage.getHistory();
    history.push(assessment);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  },
  getHistory: (): Assessment[] => {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  }
};
