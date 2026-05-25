
import React, { useState, useEffect } from 'react';
import { User, AuthState, PatientProfile, Assessment } from './types';
import { storage } from './services/storageService';
import Layout from './components/Layout';
import Auth from './components/Auth';
import ProfileForm from './components/ProfileForm';
import Questionnaire from './components/Questionnaire';
import Dashboard from './components/Dashboard';
import Report from './components/Report';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: storage.getUser(),
    isAuthenticated: !!storage.getUser()
  });
  
  const [profile, setProfile] = useState<PatientProfile | null>(storage.getProfile());
  const [history, setHistory] = useState<Assessment[]>(storage.getHistory());
  const [view, setView] = useState<'dashboard' | 'profile' | 'test' | 'report'>('dashboard');
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setProfile(storage.getProfile());
      setHistory(storage.getHistory());
    }
  }, [auth.isAuthenticated]);

  const handleLogin = (user: User) => {
    storage.saveUser(user);
    setAuth({ user, isAuthenticated: true });
  };

  const handleLogout = () => {
    storage.clearUser();
    setAuth({ user: null, isAuthenticated: false });
  };

  const handleProfileComplete = (newProfile: PatientProfile) => {
    storage.saveProfile(newProfile);
    setProfile(newProfile);
    setView('dashboard');
  };

  const handleTestComplete = (assessment: Assessment) => {
    storage.saveAssessment(assessment);
    setHistory(storage.getHistory());
    setCurrentAssessment(assessment);
    setView('report');
  };

  if (!auth.isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  if (!profile && auth.isAuthenticated) {
    return (
      <Layout user={auth.user} onLogout={handleLogout} onNavigate={setView}>
        <ProfileForm onComplete={handleProfileComplete} />
      </Layout>
    );
  }

  return (
    <Layout user={auth.user} onLogout={handleLogout} onNavigate={setView}>
      {view === 'dashboard' && (
        <Dashboard 
          profile={profile!} 
          history={history} 
          onStartTest={() => setView('test')} 
          onViewReport={(id) => {
            const found = history.find(h => h.id === id);
            if (found) {
              setCurrentAssessment(found);
              setView('report');
            }
          }}
        />
      )}
      {view === 'profile' && (
        <ProfileForm initialData={profile!} onComplete={handleProfileComplete} />
      )}
      {view === 'test' && (
        <Questionnaire profile={profile!} onComplete={handleTestComplete} history={history} />
      )}
      {view === 'report' && currentAssessment && (
        <Report 
          assessment={currentAssessment} 
          profile={profile!} 
          onBack={() => setView('dashboard')} 
        />
      )}
    </Layout>
  );
};

export default App;
