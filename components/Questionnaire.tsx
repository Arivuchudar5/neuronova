
import React, { useState } from 'react';
import { SCREENING_QUESTIONS, SCORING_OPTIONS, MAX_SCORE } from '../constants';
import { Domain, Assessment, PatientProfile } from '../types';
import { analyzeAssessment } from '../services/geminiService';

interface QuestionnaireProps {
  profile: PatientProfile;
  history: Assessment[];
  onComplete: (assessment: Assessment) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ profile, history, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateResults = async () => {
    setIsSubmitting(true);
    
    const domainScores: Record<Domain, number> = {
      [Domain.SOCIAL]: 0,
      [Domain.COMMUNICATION]: 0,
      [Domain.BEHAVIOR]: 0,
      [Domain.SENSORY]: 0,
      [Domain.DEVELOPMENTAL]: 0,
    };

    let totalScore = 0;
    SCREENING_QUESTIONS.forEach(q => {
      let score = answers[q.id] || 0;
      if (q.isReverse) {
        // Reverse scoring: Always(3) becomes 0, Never(0) becomes 3
        score = 3 - score;
      }
      domainScores[q.domain] += score;
      totalScore += score;
    });

    const riskPercentage = (totalScore / MAX_SCORE) * 100;
    let riskCategory: Assessment['riskCategory'] = 'Low Risk';
    if (riskPercentage >= 75) riskCategory = 'High Alert';
    else if (riskPercentage >= 40) riskCategory = 'Moderate Risk';

    const newAssessment: Assessment = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      scores: domainScores,
      totalScore,
      riskPercentage,
      riskCategory,
      answers
    };

    // AI Analysis
    const aiAnalysis = await analyzeAssessment(newAssessment, profile, history);
    newAssessment.aiAnalysis = aiAnalysis;

    onComplete(newAssessment);
  };

  const progress = (Object.keys(answers).length / SCREENING_QUESTIONS.length) * 100;
  const currentQuestion = SCREENING_QUESTIONS[currentStep];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-indigo-600">{Math.round(progress)}% Completed</span>
          <span className="text-sm text-slate-500">Question {currentStep + 1} of {SCREENING_QUESTIONS.length}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
            {currentQuestion.domain}
          </span>
          <h2 className="text-2xl font-semibold text-slate-900 leading-tight">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {SCORING_OPTIONS.map((option) => (
            <button
              key={option.value + option.label}
              onClick={() => handleAnswer(currentQuestion.id, option.value)}
              className={`w-full p-4 text-left rounded-xl border transition-all ${
                answers[currentQuestion.id] === option.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600 ring-opacity-10 font-semibold'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 font-medium text-slate-600 hover:text-indigo-600 disabled:opacity-30"
          >
            Previous
          </button>
          
          {currentStep === SCREENING_QUESTIONS.length - 1 ? (
            <button
              onClick={calculateResults}
              disabled={Object.keys(answers).length < SCREENING_QUESTIONS.length || isSubmitting}
              className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-md shadow-green-100 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : 'Complete Assessment'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={answers[currentQuestion.id] === undefined}
              className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md shadow-indigo-100"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Answer honestly based on your child's typical behavior over the past few months. This is a screening tool, not a diagnostic instrument.</p>
      </div>
    </div>
  );
};

export default Questionnaire;
