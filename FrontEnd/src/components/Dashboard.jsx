import React, { useState } from 'react';
import { Shield, Zap, TrendingUp, Award, Coins, HelpCircle } from 'lucide-react';

export default function Dashboard({ user, xp, setXp, onOpenRoadmap, completedQuests = [], commitmentScore = 0 }) {
  // Let the user interactively simulate saving towards their emergency fund
  const recommendedEmergencyFund = user.expenses * 3;
  const [emergencyFund, setEmergencyFund] = useState(user.expenses * 1.5); // Start with half of recommended (1.5 months)
  const [debtPayments, setDebtPayments] = useState(Math.round(user.expenses * 0.15)); // Start with 15% of expenses as debt

  // Calculate Shield (Emergency Fund) Health percentage
  const shieldPercent = Math.min(Math.round((emergencyFund / recommendedEmergencyFund) * 100), 100);

  // Calculate Cash Flow (Mana/Health) Health percentage
  // If debt payments are high, Cash Flow decreases. Cash Flow = (Income - Expenses - DebtPayments) / Income
  const savingsAmount = user.income - user.expenses - debtPayments;
  const cashFlowPercent = Math.max(
    0,
    Math.min(Math.round((savingsAmount / user.income) * 100 * 2.5), 100) // Multiplied by 2.5 to scale up for gamified sensitivity
  );

  // XP calculations (500 XP per level)
  const xpPerLevel = 500;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const xpInCurrentLevel = xp % xpPerLevel;
  const percentToNextLevel = Math.round((xpInCurrentLevel / xpPerLevel) * 100);

  // Simulators
  const depositEmergency = () => {
    setEmergencyFund((prev) => Math.min(prev + 200, recommendedEmergencyFund * 1.2));
    setXp((prev) => prev + 25);
  };

  const payDebt = () => {
    setDebtPayments((prev) => Math.max(prev - 50, 0));
    setXp((prev) => prev + 35);
  };

  // Circular progress stroke calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (shieldPercent / 100) * circumference;

  return (
    <div className="space-y-8">
      {/* Profile Section & XP Bar */}
      <div className="gold-card p-6 md:p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            {/* Avatar with level overlay badge */}
            <div className="relative">
              <img 
                src={user.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email || 'Squire'}`} 
                alt="Profile Avatar" 
                className="w-20 h-20 rounded-2xl border-2 border-amber-500/30 object-cover shadow-md bg-amber-50/20"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-amber-500 border border-white flex items-center justify-center shadow-md">
                <span className="font-display font-black text-xs text-white">L{level}</span>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-0.5">
                <span className="font-sans font-extrabold text-lg text-slate-800 leading-tight">
                  {user.name || (user.email ? user.email.split('@')[0] : 'Squire')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-sm uppercase tracking-wider gold-text-gradient">
                    {user.characterClass || 'Compounding Squire'}
                  </span>
                  <span className="text-[9px] font-bold text-amber-800/80 px-1.5 py-0.2 bg-amber-50 border border-amber-200/50 rounded-full uppercase">
                    Lv.{level}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-1 leading-normal font-sans">
                Logged in as <span className="font-bold text-slate-500">{user.email}</span>. Playstyle matches <strong className="text-slate-600">{user.riskProfile}</strong>.
              </p>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
              <span>XP to Level {level + 1}</span>
              <span className="text-amber-800">{xpInCurrentLevel} / {xpPerLevel} XP</span>
            </div>
            {/* Rich Gold Gradient Progress Bar */}
            <div className="h-3 w-full bg-slate-100 border border-slate-200/60 rounded-full overflow-hidden p-[1px]">
              <div
                style={{ width: `${percentToNextLevel}%` }}
                className="h-full rounded-full gold-bg-gradient transition-all duration-500 ease-out"
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Progress: {percentToNextLevel}%</span>
              <button
                onClick={() => onOpenRoadmap(true)}
                className="font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                View Rewards Roadmap <Award className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Status Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SHIELD (Emergency Fund Health) */}
        <div className="gold-card p-6 md:p-8 rounded-2xl flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-700" />
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-700">
                Budget Shield
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Emergency Fund</span>
            </div>
          </div>

          {/* SVG Circular Ring Indicator */}
          <div className="relative w-36 h-36 flex items-center justify-center my-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-amber-500/80 transition-all duration-500 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.2))' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-extrabold text-slate-800">{shieldPercent}%</span>
              <span className="text-[10px] font-bold text-amber-800/80 uppercase tracking-wider">Shield Health</span>
            </div>
          </div>

          <div className="w-full mt-4 space-y-4">
            <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
              <span className="text-slate-400">Current Reserve:</span>
              <span className="font-semibold text-slate-700">${emergencyFund.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
              <span className="text-slate-400">Target (3 Months):</span>
              <span className="font-semibold text-slate-700">${recommendedEmergencyFund.toLocaleString()}</span>
            </div>

            {/* Simulating deposits */}
            <div className="pt-2">
              <button
                onClick={depositEmergency}
                className="w-full py-2.5 bg-slate-50 border border-amber-200/60 hover:bg-amber-50/80 text-amber-800 hover:text-amber-900 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.96] hover:shadow-xs hover:border-amber-400 cursor-pointer flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" /> Deposit $200 (+25 XP)
              </button>
            </div>
          </div>
        </div>

        {/* MANA/HEALTH (Debt & Cash Flow) */}
        <div className="gold-card p-6 md:p-8 rounded-2xl flex flex-col justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-700" />
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-700">
                Cash Flow Mana
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Savings Rate</span>
            </div>
          </div>

          <div className="my-auto space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
                <span>Mana Output</span>
                <span className="text-amber-800">{cashFlowPercent}% Health</span>
              </div>
              {/* Horizontal Bar Indicator */}
              <div className="h-5 w-full bg-slate-100 border border-slate-200/60 rounded-xl overflow-hidden p-[1px]">
                <div
                  style={{ width: `${cashFlowPercent}%` }}
                  className="h-full rounded-lg gold-bg-gradient transition-all duration-500 ease-out"
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Higher Mana recovery unlocks better quest rewards and buffs compound interest growth. Keep essential expenses & debt down.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-400">Monthly Surplus Cash:</span>
                <span className={`font-semibold ${savingsAmount >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  ${savingsAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-400">Active Debt Burden (Monthly):</span>
                <span className="font-semibold text-slate-700">${debtPayments.toLocaleString()}</span>
              </div>

              {/* Debt simulator */}
              {debtPayments > 0 ? (
                <div className="pt-2">
                  <button
                    onClick={payDebt}
                    className="w-full py-2.5 bg-slate-50 border border-amber-200/60 hover:bg-amber-50/80 text-amber-800 hover:text-amber-900 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.96] hover:shadow-xs hover:border-amber-400 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" /> Pay off $50 Debt (+35 XP)
                  </button>
                </div>
              ) : (
                <div className="pt-2 p-3 text-center bg-emerald-50 border border-emerald-100 rounded-xl">
                  <span className="text-[11px] font-bold text-emerald-800">
                    🎉 Zero Debt Burden! Cash Flow Mana is fully optimized.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements & Badges Panel */}
      <div className="gold-card p-6 md:p-8 rounded-2xl">
        <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-700 mb-6 text-left flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-700" /> Character Achievements & Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            {
              id: 'badge-1',
              name: 'Squire\'s Initiation',
              desc: 'Claim your first weekly AI Quest.',
              isUnlocked: completedQuests.length > 0,
              emoji: '📜'
            },
            {
              id: 'badge-2',
              name: 'Shield Sentry',
              desc: 'Reach 100% Budget Shield health.',
              isUnlocked: shieldPercent >= 100,
              emoji: '🛡️'
            },
            {
              id: 'badge-3',
              name: 'Debt Annihilator',
              desc: 'Pay off all active simulator debt.',
              isUnlocked: debtPayments === 0,
              emoji: '🗡️'
            },
            {
              id: 'badge-4',
              name: 'Committer Legend',
              desc: 'Achieve a Commitment Score of 30+.',
              isUnlocked: commitmentScore >= 30,
              emoji: '👑'
            },
            {
              id: 'badge-5',
              name: 'Compounding Squire',
              desc: 'Unlock at least 2 weekly quests.',
              isUnlocked: completedQuests.length >= 2,
              emoji: '🌟'
            }
          ].map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 relative ${
                badge.isUnlocked
                  ? 'bg-amber-50/20 border-amber-500/35 shadow-xs hover:border-amber-400 hover:shadow-md'
                  : 'bg-slate-50/50 border-slate-100 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{badge.isUnlocked ? badge.emoji : '🔒'}</div>
              <span className="font-display font-extrabold text-xs text-slate-800 leading-tight">
                {badge.name}
              </span>
              <span className="text-[9px] text-slate-400 leading-tight mt-1.5 font-sans">
                {badge.desc}
              </span>
              {badge.isUnlocked && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Financial Status Summary Banner */}
      <div className="p-4 rounded-xl bg-amber-50/30 border border-amber-200/40 flex items-center gap-3">
        <HelpCircle className="w-5 h-5 text-amber-700 shrink-0" />
        <p className="text-xs text-amber-900/80 leading-normal">
          <strong>Pro Tip:</strong> Your characters overall health is directly tied to the ratio of your expenses to income. Complete weekly AI Quest Challenges below to earn massive XP gains and level up your squire!
        </p>
      </div>
    </div>
  );
}
