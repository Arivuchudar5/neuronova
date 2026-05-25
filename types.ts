
export interface User {
  id: string;
  name: string;
  role: 'Parent' | 'Caregiver';
}

export interface PatientProfile {
  childName: string;
  age: string;
  gender: string;
  location: string;
  parentName: string;
  contact: string;
  date: string;
}

export enum Domain {
  SOCIAL = 'Social Interaction',
  COMMUNICATION = 'Communication',
  BEHAVIOR = 'Repetitive Behaviors',
  SENSORY = 'Sensory Sensitivity',
  DEVELOPMENTAL = 'Developmental Milestones'
}

export interface Question {
  id: number;
  text: string;
  domain: Domain;
  isReverse?: boolean;
}

export interface Assessment {
  id: string;
  date: string;
  scores: Record<Domain, number>;
  totalScore: number;
  riskPercentage: number;
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Alert';
  answers: Record<number, number>;
  aiAnalysis?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
