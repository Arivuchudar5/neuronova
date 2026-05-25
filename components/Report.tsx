
import React, { useState, useEffect } from 'react';
import { Assessment, PatientProfile, Domain } from '../types';
import { findSpecialists } from '../services/geminiService';

interface ReportProps {
  assessment: Assessment;
  profile: PatientProfile;
  onBack: () => void;
}

const Report: React.FC<ReportProps> = ({ assessment, profile, onBack }) => {
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [loadingMaps, setLoadingMaps] = useState(false);

  useEffect(() => {
    if (assessment.riskCategory !== 'Low Risk') {
      loadSpecialists();
    }
  }, [assessment]);

  const loadSpecialists = async () => {
    setLoadingMaps(true);
    const results = await findSpecialists(profile.location);
    setSpecialists(results);
    setLoadingMaps(false);
  };

  const getRiskGradient = () => {
    if (assessment.riskCategory === 'High Alert') return 'from-red-600 to-red-500';
    if (assessment.riskCategory === 'Moderate Risk') return 'from-orange-500 to-orange-400';
    return 'from-green-500 to-green-400';
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Report Header */}
        <div className={`bg-gradient-to-r ${getRiskGradient()} p-8 text-white`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-1">Clinical Screening Report</p>
              <h1 className="text-4xl font-black">{profile.childName}</h1>
              <p className="mt-2 flex items-center gap-4 text-white/90">
                <span>Age: {profile.age}</span>
                <span>•</span>
                <span>Date: {new Date(assessment.date).toLocaleDateString()}</span>
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center border border-white/30">
              <p className="text-xs font-bold uppercase mb-1">Risk Percentage</p>
              <div className="text-4xl font-black">{Math.round(assessment.riskPercentage)}%</div>
              <div className="text-xs font-semibold mt-1 px-2 py-0.5 bg-white/30 rounded-full">{assessment.riskCategory}</div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Executive Summary */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Clinical Summary
            </h2>
            <div className="bg-slate-50 rounded-2xl p-6 prose prose-slate max-w-none">
              <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                {assessment.aiAnalysis || "Analysis loading..."}
              </div>
            </div>
          </section>

          {/* Domain Breakdown */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Domain-wise Performance Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(assessment.scores).map(([domain, scoreValue]) => {
                // Fix: Explicitly cast scoreValue to number to avoid 'unknown' comparison/arithmetic errors
                const score = scoreValue as number;
                return (
                  <div key={domain} className="p-5 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{domain}</p>
                    <div className="flex justify-between items-end">
                      <div className="text-2xl font-black text-slate-900">{score} <span className="text-sm font-normal text-slate-400">/ 15</span></div>
                      <div className="w-full max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${score > 10 ? 'bg-red-500' : score > 5 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${(score/15) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Specialist Recommendations */}
          {assessment.riskCategory !== 'Low Risk' && (
            <section className="bg-indigo-50/50 rounded-2xl p-8 border border-indigo-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                Specialists Near {profile.location}
              </h2>
              
              {loadingMaps ? (
                <div className="flex justify-center py-10">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-48 bg-indigo-200 rounded mb-4"></div>
                    <p className="text-slate-400 text-sm">Searching for local specialists...</p>
                  </div>
                </div>
              ) : specialists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specialists.map((chunk, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col">
                      <h4 className="font-bold text-slate-900 mb-1">{chunk.maps?.title || "Specialist Location"}</h4>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{chunk.maps?.uri}</p>
                      <a 
                        href={chunk.maps?.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        View Details & Contact
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 italic p-6 bg-white rounded-xl border border-slate-200 text-center">
                  Consult your local health directory or pediatrician for specialists in {profile.location}.
                </div>
              )}

              <div className="mt-8 bg-white p-6 rounded-xl border border-red-200 flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Urgent Intervention Recommended</h4>
                  <p className="text-sm text-slate-600 mt-1">Research shows that starting intervention as early as possible significantly improves long-term outcomes for children with developmental differences.</p>
                </div>
              </div>
            </section>
          )}

          {/* Mandatory Disclaimer */}
          <div className="pt-8 border-t border-slate-100">
            <div className="bg-slate-900 text-slate-400 p-6 rounded-2xl text-xs text-center leading-relaxed">
              <p className="font-bold text-slate-200 mb-2 uppercase tracking-widest">Medical Disclaimer</p>
              This is a preliminary AI-based screening and not a medical diagnosis. Please consult a qualified healthcare professional for a formal evaluation. NeuroCare-AI provides informational insights and should not replace professional clinical judgment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
