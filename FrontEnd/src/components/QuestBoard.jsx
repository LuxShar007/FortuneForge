import React, { useState } from 'react';
import { Sparkles, Trophy, Check, ArrowRight, Play } from 'lucide-react';

export default function QuestBoard({ user, xp, setXp, completedQuests, onClaimQuest }) {
  const [particles, setParticles] = useState([]);

  // Generate personalized third quest based on character class / risk profile
  const getPersonalizedQuest = (profile) => {
    switch (profile) {
      case 'Conservative':
        return {
          id: 'custom-1',
          title: 'Shield Charger',
          desc: 'Establish an automated $50 deposit to your emergency fund to reinforce your Budget Shield.',
          difficulty: 'Easy',
          xpReward: 120,
          goldReward: 25
        };
      case 'Growth':
        return {
          id: 'custom-1',
          title: 'Equities Crusade',
          desc: 'Allocate an extra $150 towards a low-cost global equity index fund.',
          difficulty: 'Hard',
          xpReward: 220,
          goldReward: 60
        };
      case 'Speculative':
        return {
          id: 'custom-1',
          title: 'Arbitrage Venture',
          desc: 'Allocate 5% of this week\'s spare surplus cash to high-conviction speculative holdings.',
          difficulty: 'Expert',
          xpReward: 280,
          goldReward: 90
        };
      case 'Balanced':
      default:
        return {
          id: 'custom-1',
          title: 'Squire\'s Ledger',
          desc: 'Review and categorize your last 30 days of transactions to optimize essential expenses.',
          difficulty: 'Medium',
          xpReward: 160,
          goldReward: 40
        };
    }
  };

  const defaultQuests = [
    {
      id: 'default-1',
      title: 'The Copper Coin Challenge',
      desc: `Allocate an extra 2% of this week's stipend ($${Math.round(user.income * 0.02)}) to your index fund stash.`,
      difficulty: 'Easy',
      xpReward: 100,
      goldReward: 20
    },
    {
      id: 'default-2',
      title: 'Inflation Vanguard',
      desc: 'Limit dining out or takeout to restore your character\'s budget shield by $40.',
      difficulty: 'Medium',
      xpReward: 150,
      goldReward: 35
    }
  ];

  const activeQuests = [...defaultQuests, getPersonalizedQuest(user.riskProfile)];

  const handleClaim = (questId, rewardXp, event) => {
    if (completedQuests.includes(questId)) return;

    // Get click coordinates to fire particle animation
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newParticle = {
      id: Date.now(),
      x,
      y,
      text: `+${rewardXp} XP`
    };

    setParticles((prev) => [...prev, newParticle]);

    // Remove particle after animation ends
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);

    onClaimQuest(questId, rewardXp);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="font-display text-2xl font-extrabold text-slate-800">
              AI Quest Board
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            RPG-style financial challenges curated for the <strong className="text-slate-600">{user.characterClass}</strong> class.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/50 border border-amber-200/50 rounded-xl">
          <Trophy className="w-4 h-4 text-amber-700" />
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
            Active Quest Buff: 1.2x Multiplier
          </span>
        </div>
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeQuests.map((quest) => {
          const isCompleted = completedQuests.includes(quest.id);

          return (
            <div
              key={quest.id}
              className={`gold-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                isCompleted ? 'opacity-65 bg-slate-50/50 border-slate-200' : 'bg-white'
              }`}
            >
              {/* Difficulty Tag */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    quest.difficulty === 'Easy'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : quest.difficulty === 'Medium'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  {quest.difficulty}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                  <span>+{quest.xpReward} XP</span>
                </div>
              </div>

              {/* Quest Title & Description */}
              <div className="mb-6">
                <h3 className="font-display font-extrabold text-slate-800 text-base mb-2 flex items-center gap-2">
                  {quest.title}
                  {isCompleted && <Check className="w-4 h-4 text-emerald-600" />}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-sans">
                  {quest.desc}
                </p>
              </div>

              {/* Action Button */}
              <div className="relative">
                {/* Floating Particles Container */}
                {particles.map((p) => (
                  <span
                    key={p.id}
                    style={{ left: `${p.x}px`, top: `${p.y}px` }}
                    className="absolute xp-particle font-display font-black text-amber-700 text-sm pointer-events-none drop-shadow-xs"
                  >
                    {p.text}
                  </span>
                ))}

                {isCompleted ? (
                  <div className="w-full py-2.5 bg-slate-100 border border-slate-200 text-slate-400 font-display font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Quest Cleared
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleClaim(quest.id, quest.xpReward, e)}
                    className="w-full py-2.5 bg-white hover:bg-amber-500 hover:text-white border border-amber-300 hover:border-amber-500 text-amber-800 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 ease-out cursor-pointer flex items-center justify-center gap-2 hover:gap-3 hover:scale-[1.03] active:scale-[0.96] hover:shadow-md"
                  >
                    Claim XP & Rewards <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
