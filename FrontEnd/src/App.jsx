import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import { API_BASE_URL } from './config';

import Dashboard from './components/Dashboard';
import QuestBoard from './components/QuestBoard';
import Leaderboard from './components/Leaderboard';
import RoadmapModal from './components/RoadmapModal';
import XpCelebration from './components/XpCelebration';
import RewardsVault from './components/RewardsVault';
import AIChatbot from './components/AIChatbot';
import { Sparkles, HelpCircle, Shield, Award, LayoutDashboard, ShoppingBag } from 'lucide-react';

const calculateActualInvestment = (income, expenses, riskProfile, completedQuestsList) => {
  const maxInvestment = Math.max(200, (income || 0) - (expenses || 0));
  let total = Math.round(maxInvestment * 0.4);
  
  (completedQuestsList || []).forEach(questId => {
    if (questId === 'default-1') {
      total += Math.round((income || 0) * 0.02);
    } else if (questId === 'default-2') {
      total += 40;
    } else if (questId === 'custom-1') {
      if (riskProfile === 'Conservative') total += 50;
      else if (riskProfile === 'Growth') total += 150;
      else if (riskProfile === 'Speculative') total += Math.round(maxInvestment * 0.05);
      else total += 100; // Balanced
    }
  });
  return total;
};

function App() {
  const [user, setUser] = useState({
    id: null,
    email: '',
    name: '',
    profilePicture: '',
    income: 0,
    expenses: 0,
    riskProfile: '',
    characterClass: '',
    hasOnboarded: false,
    isAuthenticated: false
  });

  const [xp, setXp] = useState(350); // Start user with 350 XP
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [completedQuests, setCompletedQuests] = useState([]);

  // Handle OAuth Popup Callback Redirect
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash && window.opener) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const state = params.get('state');
      if (accessToken) {
        window.opener.postMessage({
          type: 'oauth-token',
          accessToken,
          provider: state || 'google'
        }, window.location.origin);
        window.close();
      }
    }
  }, []);

  // Check for existing token and retrieve user profile on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || '',
            profilePicture: data.user.profilePicture || '',
            income: data.user.income || 0,
            expenses: data.user.expenses || 0,
            riskProfile: data.user.riskProfile || '',
            characterClass: data.user.characterClass || '',
            hasOnboarded: data.user.baselineConfigured,
            isAuthenticated: true
          });
          setXp(data.user.xp !== undefined ? data.user.xp : 350);
          setCompletedQuests(data.user.completedQuests || []);
          if (data.user.baselineConfigured) {
            const initialInvestment = calculateActualInvestment(
              data.user.income,
              data.user.expenses,
              data.user.riskProfile,
              data.user.completedQuests || []
            );
            setUserInvestment(initialInvestment);
          }
        } else {
          // Token is invalid/expired, clear it
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const syncUserProgress = async (newXp, newCompletedQuests) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/user/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          xp: newXp,
          completedQuests: newCompletedQuests
        })
      });
    } catch (err) {
      console.error('Failed to sync progress:', err);
    }
  };

  const handleAuthSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    setUser({
      id: userData.id,
      email: userData.email,
      name: userData.name || '',
      profilePicture: userData.profilePicture || '',
      income: userData.income || 0,
      expenses: userData.expenses || 0,
      riskProfile: userData.riskProfile || '',
      characterClass: userData.characterClass || '',
      hasOnboarded: userData.baselineConfigured,
      isAuthenticated: true
    });
    setXp(userData.xp !== undefined ? userData.xp : 350);
    setCompletedQuests(userData.completedQuests || []);
    if (userData.baselineConfigured) {
      const initialInvestment = calculateActualInvestment(
        userData.income,
        userData.expenses,
        userData.riskProfile,
        userData.completedQuests || []
      );
      setUserInvestment(initialInvestment);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({
      id: null,
      email: '',
      name: '',
      profilePicture: '',
      income: 0,
      expenses: 0,
      riskProfile: '',
      characterClass: '',
      hasOnboarded: false,
      isAuthenticated: false
    });
    setXp(350);
    setCompletedQuests([]);
    setActiveTab('dashboard');
  };

  // Simulated investment metrics for Commitment Score
  const [userInvestment, setUserInvestment] = useState(0);
  const userStreak = 1.6;
  const userInvestedPercent = user.income > 0 ? parseFloat(((userInvestment / user.income) * 100).toFixed(1)) : 0;
  const commitmentScore = parseFloat((userInvestedPercent * userStreak).toFixed(1));

  // Celebration overlay state
  const [celebration, setCelebration] = useState({
    isOpen: false,
    xpAmount: 0,
    reason: ''
  });

  // Redeemed vault items state
  const [redeemedItems, setRedeemedItems] = useState([]);

  // Handles onboarding completion
  const handleOnboardingComplete = (userData) => {
    setUser({
      id: userData.id,
      email: userData.email,
      name: userData.name || '',
      profilePicture: userData.profilePicture || '',
      income: userData.income,
      expenses: userData.expenses,
      riskProfile: userData.riskProfile,
      characterClass: userData.characterClass,
      hasOnboarded: true,
      isAuthenticated: true
    });
    const initialInvestment = calculateActualInvestment(
      userData.income,
      userData.expenses,
      userData.riskProfile,
      []
    );
    setUserInvestment(initialInvestment);
  };

  // Handles quest completion
  const handleClaimQuest = (questId, rewardXp) => {
    const nextQuests = [...completedQuests, questId];
    const nextXp = xp + rewardXp;

    setCompletedQuests(nextQuests);
    setXp(nextXp);

    // Recalculate actual investment based on new quest list
    const nextInvestment = calculateActualInvestment(
      user.income,
      user.expenses,
      user.riskProfile,
      nextQuests
    );
    setUserInvestment(nextInvestment);

    setCelebration({
      isOpen: true,
      xpAmount: rewardXp,
      reason: 'Quest Completed!'
    });

    syncUserProgress(nextXp, nextQuests);
  };

  // Intercepts Dashboard XP upgrades to show victory popup
  const handleDashboardXpChange = (updater) => {
    if (typeof updater === 'function') {
      setXp((prev) => {
        const next = updater(prev);
        const diff = next - prev;
        if (diff > 0) {
          let reason = 'Achievement Completed!';
          if (diff === 25) reason = 'Vault Deposit Added!';
          if (diff === 35) reason = 'Debt Payments Trimmed!';
          setCelebration({
            isOpen: true,
            xpAmount: diff,
            reason: reason
          });
        }
        syncUserProgress(next, completedQuests);
        return next;
      });
    } else {
      const diff = updater - xp;
      if (diff > 0) {
        setCelebration({
          isOpen: true,
          xpAmount: diff,
          reason: 'Level Progression Boosted!'
        });
      }
      setXp(updater);
      syncUserProgress(updater, completedQuests);
    }
  };

  // Handles shop redemption
  const handleRedeemItem = (item) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'FORGE-';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
      if (i === 3) code += '-';
    }
    
    setRedeemedItems((prev) => [...prev, { id: item.id, code }]);
    
    setCelebration({
      isOpen: true,
      xpAmount: 0,
      reason: `Unlocked: ${item.title}!`
    });
  };



  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-amber-100 selection:text-amber-900 transition-colors duration-500 ${
      user.hasOnboarded ? 'bg-[#F3EDE2]' : 'bg-[#FCFBF9]'
    }`}>
      
      {/* DYNAMIC LAYOUT WRAPPER */}
      <div className="relative flex-1 flex flex-col justify-between w-full transition-all duration-300">
        
        {/* HEADER */}
        <header className="sticky top-0 z-35 bg-white/95 border-b border-amber-500/10 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
              <span className="font-display font-black text-xl tracking-tight uppercase gold-text-gradient">
                FortuneForge
              </span>
            </div>

            {/* Navigation Tabs (Only show if onboarded) */}
            {user.hasOnboarded && (
              <nav className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-amber-800 shadow-xs border border-amber-500/15'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeTab === 'leaderboard'
                      ? 'bg-white text-amber-800 shadow-xs border border-amber-500/15'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  Leaderboard
                </button>
                <button
                  onClick={() => setActiveTab('redeem')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeTab === 'redeem'
                      ? 'bg-white text-amber-800 shadow-xs border border-amber-500/15'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Vault Shop
                </button>
              </nav>
            )}

            {/* Action Bar / Easter Egg Trigger */}
            <div className="flex items-center gap-3">
              {user.isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-red-200 hover:border-red-300 bg-red-50/50 hover:bg-red-100/50 text-red-700 font-display font-bold text-[10px] uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer animate-fade-in"
                >
                  Log Out
                </button>
              )}

            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
          {!user.hasOnboarded ? (
            <Onboarding 
              user={user} 
              onAuthSuccess={handleAuthSuccess} 
              onComplete={handleOnboardingComplete} 
            />
          ) : (
            <div className="space-y-12">
              {/* Tab Content Router */}
              {activeTab === 'dashboard' ? (
                <>
                  <Dashboard
                    user={user}
                    xp={xp}
                    setXp={handleDashboardXpChange}
                    onOpenRoadmap={setIsRoadmapOpen}
                    completedQuests={completedQuests}
                    commitmentScore={commitmentScore}
                    setUserInvestment={setUserInvestment}
                  />
                  <hr className="border-amber-500/10" />
                  <QuestBoard
                    user={user}
                    xp={xp}
                    setXp={handleDashboardXpChange}
                    completedQuests={completedQuests}
                    onClaimQuest={handleClaimQuest}
                  />
                </>
              ) : activeTab === 'leaderboard' ? (
                <Leaderboard
                  user={user}
                  userInvestment={userInvestment}
                  setUserInvestment={setUserInvestment}
                />
              ) : (
                <RewardsVault
                  commitmentScore={commitmentScore}
                  redeemedItems={redeemedItems}
                  onRedeemItem={handleRedeemItem}
                />
              )}
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-amber-500/10 bg-white py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm text-slate-800">FortuneForge</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-400 font-sans">© 2026 Forge Labs. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsRoadmapOpen(true)}
                className="text-xs font-semibold text-slate-500 hover:text-amber-800 hover:underline transition cursor-pointer"
              >
                Future Roadmap
              </button>

            </div>
          </div>
        </footer>

      </div>

      {/* ROADMAP MODAL */}
      <RoadmapModal isOpen={isRoadmapOpen} onClose={() => setIsRoadmapOpen(false)} />

      {/* XP CELEBRATION MODAL */}
      <XpCelebration
        isOpen={celebration.isOpen}
        xpAmount={celebration.xpAmount}
        reason={celebration.reason}
        onClose={() => setCelebration({ isOpen: false, xpAmount: 0, reason: '' })}
      />

      {/* AI CHATBOT COACH */}
      {user.isAuthenticated && <AIChatbot />}
    </div>
  );
}

export default App;
