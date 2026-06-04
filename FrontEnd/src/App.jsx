import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import QuestBoard from './components/QuestBoard';
import Leaderboard from './components/Leaderboard';
import RoadmapModal from './components/RoadmapModal';
import XpCelebration from './components/XpCelebration';
import RewardsVault from './components/RewardsVault';
import { ArrowUpCircle, Sparkles, HelpCircle, Shield, Award, LayoutDashboard, ShoppingBag } from 'lucide-react';

function App() {
  const [user, setUser] = useState({
    income: 0,
    expenses: 0,
    riskProfile: '',
    characterClass: '',
    hasOnboarded: false
  });

  const [xp, setXp] = useState(350); // Start user with 350 XP
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isFloatAwayActive, setIsFloatAwayActive] = useState(false);
  const [completedQuests, setCompletedQuests] = useState([]);

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
  const handleOnboardingComplete = (data) => {
    setUser({
      ...data,
      hasOnboarded: true
    });
    const maxInvestment = Math.max(200, data.income - data.expenses);
    setUserInvestment(Math.round(maxInvestment * 0.4)); // Default to 40% of surplus cash
  };

  // Handles quest completion
  const handleClaimQuest = (questId, rewardXp) => {
    setCompletedQuests((prev) => [...prev, questId]);
    setCelebration({
      isOpen: true,
      xpAmount: rewardXp,
      reason: 'Quest Completed!'
    });
    setXp((prev) => prev + rewardXp);
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

  // Trigger Antigravity Egg
  const triggerAntigravity = () => {
    setIsFloatAwayActive(true);
  };

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-amber-100 selection:text-amber-900 transition-colors duration-500 ${
      user.hasOnboarded ? 'bg-[#F3EDE2]' : 'bg-[#FCFBF9]'
    }`}>
      
      {/* EASTER EGG RESET PANEL: Rendered outside the animated wrapper */}
      {isFloatAwayActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in pointer-events-auto">
          <div className="bg-white border border-amber-500/20 max-w-sm w-full p-8 rounded-2xl shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-50 border border-amber-300 rounded-full flex items-center justify-center text-amber-700 mb-4 animate-bounce">
              <ArrowUpCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-slate-800 mb-2">
              Antigravity Activated!
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6 font-sans">
              The layout wrapper has translated <strong>-130vh</strong> with <strong>25deg</strong> rotation. Standard physics have been temporarily overridden.
            </p>
            <button
              onClick={() => setIsFloatAwayActive(false)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              Reset Gravity
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC LAYOUT WRAPPER: Animates away when Easter Egg triggers */}
      <div className={`relative flex-1 flex flex-col justify-between w-full transition-all duration-300 ${isFloatAwayActive ? 'float-away-active' : ''}`}>
        
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
              <button
                onClick={triggerAntigravity}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-100/50 text-amber-800 font-display font-bold text-[10px] uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer"
                title="Trigger global CSS keyframe floatAway animation (-130vh translate, 25deg rotation)"
              >
                <ArrowUpCircle className="w-3.5 h-3.5 animate-pulse" />
                Antigravity Egg
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
          {!user.hasOnboarded ? (
            <Onboarding onComplete={handleOnboardingComplete} />
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
              <button
                onClick={triggerAntigravity}
                className="md:hidden text-xs font-semibold text-amber-800 hover:underline transition cursor-pointer flex items-center gap-1"
              >
                <ArrowUpCircle className="w-3.5 h-3.5" /> Antigravity Egg
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
    </div>
  );
}

export default App;
