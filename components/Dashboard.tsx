import React from 'react';
import { Assessment, PatientProfile, Domain } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface DashboardProps {
  profile: PatientProfile;
  history: Assessment[];
  onStartTest: () => void;
  onViewReport: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, history, onStartTest, onViewReport }) => {
  const latest = history.length > 0 ? history[history.length - 1] : null;
  const previous = history.length > 1 ? history[history.length - 2] : null;

  const chartData = history.map(h => ({
    date: new Date(h.date).toLocaleDateString(),
    risk: Math.round(h.riskPercentage),
  }));

  // Fix: Explicitly cast score to number to avoid 'unknown' comparison error
  const domainData = latest ? Object.entries(latest.scores).map(([name, score]) => ({
    name: name.split(' ')[0],
    score: score as number,
    max: 15
  })) : [];

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'High Alert': return 'text-red-600 bg-red-50 border-red-200';
      case 'Moderate Risk': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const calculateImprovement = () => {
    if (!latest || !previous) return null;
    const diff = previous.riskPercentage - latest.riskPercentage;
    const improvement = (diff / previous.riskPercentage) * 100;
    
    if (improvement > 20) return { label: 'Significant Improvement', color: 'text-green-600' };
    if (improvement > 5) return { label: 'Mild Improvement', color: 'text-green-600' };
    if (improvement < -10) return { label: 'Concerning Regression', color: 'text-red-600' };
    return { label: 'Stable', color: 'text-blue-600' };
  };

  const progressInfo = calculateImprovement();

  return (
    <div className="space-y-8">
      {/* Header Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900">{profile.childName}</h2>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-4 text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {profile.age}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                {profile.location}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                {profile.contact}
              </span>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <button 
              onClick={onStartTest}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Screening
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Risk Level</p>
          {latest ? (
            <>
              <div className={`inline-block mx-auto px-4 py-2 rounded-full border font-bold text-lg mb-4 ${getRiskColor(latest.riskCategory)}`}>
                {latest.riskCategory}
              </div>
              <div className="text-5xl font-black text-slate-900 mb-1">{Math.round(latest.riskPercentage)}%</div>
              <p className="text-slate-400 text-sm">Based on assessment on {new Date(latest.date).toLocaleDateString()}</p>
            </>
          ) : (
            <p className="text-slate-400">No assessments yet.</p>
          )}
        </div>
      </div>

      {latest && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Longitudinal Trend */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Risk Progression Trend</h3>
              {progressInfo && (
                <span className={`text-sm font-semibold px-2 py-1 rounded ${progressInfo.color} bg-opacity-10`}>
                  {progressInfo.label}
                </span>
              )}
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Domain Analysis */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Latest Domain Breakdown</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 15]} hide />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={100} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {domainData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score > 10 ? '#ef4444' : entry.score > 5 ? '#f97316' : '#22c55e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Assessment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.slice().reverse().map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-4 text-sm text-slate-900 font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-600">
                    {item.totalScore} / 75 ({Math.round(item.riskPercentage)}%)
                  </td>
                  <td className="px-8 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getRiskColor(item.riskCategory)}`}>
                      {item.riskCategory}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button 
                      onClick={() => onViewReport(item.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">
                    No assessments conducted yet. Click "New Screening" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
