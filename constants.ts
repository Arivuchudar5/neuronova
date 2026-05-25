
import { Domain, Question } from './types';

export const SCREENING_QUESTIONS: Question[] = [
  // Domain A: Social
  { id: 1, text: "Does your child avoid eye contact when interacting with others?", domain: Domain.SOCIAL },
  { id: 2, text: "Does your child rarely respond when their name is called?", domain: Domain.SOCIAL },
  { id: 3, text: "Does your child show little interest in playing with other children?", domain: Domain.SOCIAL },
  { id: 4, text: "Does your child prefer playing alone most of the time?", domain: Domain.SOCIAL },
  { id: 5, text: "Does your child struggle to understand facial expressions or emotions?", domain: Domain.SOCIAL },
  // Domain B: Communication
  { id: 6, text: "Is your child delayed in speaking compared to same-age children?", domain: Domain.COMMUNICATION },
  { id: 7, text: "Does your child repeat words or phrases frequently?", domain: Domain.COMMUNICATION },
  { id: 8, text: "Does your child have difficulty maintaining a two-way conversation?", domain: Domain.COMMUNICATION },
  { id: 9, text: "Does your child use limited gestures like pointing or waving?", domain: Domain.COMMUNICATION },
  { id: 10, text: "Does your child struggle to express needs clearly?", domain: Domain.COMMUNICATION },
  // Domain C: Behavior
  { id: 11, text: "Does your child flap hands, rock, or spin repeatedly?", domain: Domain.BEHAVIOR },
  { id: 12, text: "Does your child line up toys in a specific order repeatedly?", domain: Domain.BEHAVIOR },
  { id: 13, text: "Does your child insist on strict routines and become upset with small changes?", domain: Domain.BEHAVIOR },
  { id: 14, text: "Does your child repeat the same activity over and over?", domain: Domain.BEHAVIOR },
  { id: 15, text: "Does your child show intense focus on specific objects or topics?", domain: Domain.BEHAVIOR },
  // Domain D: Sensory
  { id: 16, text: "Is your child overly sensitive to loud sounds?", domain: Domain.SENSORY },
  { id: 17, text: "Does your child react strongly to certain textures (clothes, food)?", domain: Domain.SENSORY },
  { id: 18, text: "Does your child avoid bright lights or crowded places?", domain: Domain.SENSORY },
  { id: 19, text: "Does your child seek unusual sensory input (spinning, smelling objects)?", domain: Domain.SENSORY },
  { id: 20, text: "Does your child show unusual pain sensitivity (very high or very low)?", domain: Domain.SENSORY },
  // Domain E: Developmental
  { id: 21, text: "Did your child start speaking later than 18 months?", domain: Domain.DEVELOPMENTAL },
  { id: 22, text: "Did your child start walking later than 18 months?", domain: Domain.DEVELOPMENTAL },
  { id: 23, text: "Does your child engage in pretend play?", domain: Domain.DEVELOPMENTAL, isReverse: true },
  { id: 24, text: "Does your child point to show interest in objects?", domain: Domain.DEVELOPMENTAL, isReverse: true },
  { id: 25, text: "Does your child follow simple instructions appropriately?", domain: Domain.DEVELOPMENTAL, isReverse: true },
];

export const SCORING_OPTIONS = [
  { label: 'Never', value: 0 },
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Always', value: 3 },
];

export const MAX_SCORE = 75;

export const SYSTEM_INSTRUCTION = `
You are an AI-powered Autism Care Clinical Assistant (NEUROCARE-AI).
You act as a senior developmental pediatric specialist with 15+ years of experience.
Your goal is to provide preliminary screening insights based on assessment data.
Guidelines:
1. Do NOT provide medical diagnosis.
2. Use compassionate, non-alarming, parent-friendly language.
3. Identify highest scoring domains and explain them simply.
4. Detect patterns (social, communication, sensory, behavioral).
5. Provide predictive insights and longitudinal tracking logic if history is provided.
6. Provide specific recommendations based on risk level.
7. Always end with the mandatory disclaimer: "This is a preliminary AI-based screening and not a medical diagnosis. Please consult a qualified healthcare professional for a formal evaluation."
`;
