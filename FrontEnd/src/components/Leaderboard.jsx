import React, { useState, useMemo } from 'react';
import { Award, Zap, ChevronUp, ChevronDown, Percent, Info, Flame } from 'lucide-react';

export default function Leaderboard({ user, userInvestment, setUserInvestment }) {
  // Let the user simulate their monthly investment amount within their surplus limit
  const maxInvestment = Math.max(200, user.income - user.expenses);
  const userStreak = 1.6; // 6-week streak multiplier (1.6x)

  // Calculations for current user
  const userInvestedPercent = parseFloat(((userInvestment / user.income) * 100).toFixed(1));
  const userScore = parseFloat((userInvestedPercent * userStreak).toFixed(1));

  // High-fidelity mock leaderboard data showing the proportional sorting mechanic
  const mockLeaderboard = [
    {
      id: 'aria',
      name: 'Aria (Stipend Earner)',
      class: 'Gilt Defender',
      income: 1200,
      invested: 300,
      investedPercent: 25.0,
      streak: 1.7, // 7-week streak
      score: 42.5,
      isCurrentUser: false,
    },
    {
      id: 'leo',
      name: 'Leo (Freelancer)',
      class: 'Compounding Squire',
      income: 4500,
      invested: 900,
      investedPercent: 20.0,
      streak: 1.5, // 5-week streak
      score: 30.0,
      isCurrentUser: false,
    },
    {
      id: 'marcus',
      name: 'Marcus (Tech Exec)',
      class: 'Leveraged Knight',
      income: 16000,
      invested: 1920,
      investedPercent: 12.0,
      streak: 1.3, // 3-week streak
      score: 15.6,
      isCurrentUser: false,
    },
    {
      id: 'seraphina',
      name: 'Seraphina (Barista)',
      class: 'Arbitrage Wizard',
      income: 1800,
      invested: 450,
      investedPercent: 25.0,
      streak: 1.4,
      score: 35.0,
      isCurrentUser: false,
    }
  ];

  // Merge current user with the leaderboard list and sort dynamically
  const sortedLeaderboard = useMemo(() => {
    const currentUserData = {
      id: 'current-user',
      name: `You (${user.characterClass})`,
      class: user.characterClass,
      income: user.income,
      invested: userInvestment,
      investedPercent: userInvestedPercent,
      streak: userStreak,
      score: userScore,
      isCurrentUser: true,
    };

    return [...mockLeaderboard, currentUserData].sort((a, b) => b.score - a.score);
  }, [userInvestment, userInvestedPercent, userScore, user]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-left">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <h2 className="font-display text-2xl font-extrabold text-slate-800">
            Proportional Leaderboard
          </h2>
        </div>
        <p className="text-slate-400 text-xs mt-1">
          A competitive arena focused on commitment percentage, not absolute wallets. High earners do not buy their rank.
        </p>
      </div>

      {/* Info Card explaining the math */}
      <div className="p-4 rounded-xl bg-amber-50/20 border border-amber-200/35 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              The Commitment Score Engine
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
              Formula: <code className="bg-amber-50 font-bold px-1.5 py-0.5 rounded text-amber-800">Score = (% of Income Invested) × Streak Multiplier</code>.
              This rewards disciplined habits relative to your earnings tier.
            </p>
          </div>
        </div>
        <div className="text-left md:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100/50 px-2 py-1 rounded-md">
            Active Multiplier: 1.6x Streak
          </span>
        </div>
      </div>

      {/* Dynamic Simulator Sliders */}
      <div className="gold-card p-5 md:p-6 rounded-2xl">
        <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-700 mb-4 text-left">
          Interactive Rank Simulator
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
              <span>Simulate Monthly Invested Amount</span>
              <span className="text-amber-800 font-bold">
                ${userInvestment.toLocaleString()} / mo ({userInvestedPercent}%)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={maxInvestment}
              step="50"
              value={userInvestment}
              onChange={(e) => setUserInvestment(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Min ($0)</span>
              <span>Available Surplus: ${maxInvestment.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="gold-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-4">Player & Class</th>
                <th className="py-4 px-4">Monthly Income</th>
                <th className="py-4 px-4">Monthly Invested</th>
                <th className="py-4 px-4 text-center">% Invested</th>
                <th className="py-4 px-4 text-center">Streak</th>
                <th className="py-4 px-6 text-right">Commitment Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedLeaderboard.map((player, index) => {
                const rank = index + 1;
                const isUser = player.isCurrentUser;

                // Rank style helpers
                let rankBadge = (
                  <span className="font-display font-extrabold text-sm text-slate-500">
                    #{rank}
                  </span>
                );
                if (rank === 1) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-black text-xs border border-amber-300">
                      🥇
                    </span>
                  );
                } else if (rank === 2) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-black text-xs border border-slate-300">
                      🥈
                    </span>
                  );
                } else if (rank === 3) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-600 font-black text-xs border border-amber-200">
                      🥉
                    </span>
                  );
                }

                return (
                  <tr
                    key={player.id}
                    className={`transition-colors duration-150 ${
                      isUser
                        ? 'bg-amber-50/30 font-medium border-l-2 border-l-amber-500'
                        : 'hover:bg-slate-50/30'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-6 text-center">{rankBadge}</td>

                    {/* Name / Class */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isUser ? 'text-amber-800' : 'text-slate-800'}`}>
                          {player.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {player.class}
                        </span>
                      </div>
                    </td>

                    {/* Monthly Income */}
                    <td className="py-4 px-4 text-sm text-slate-500">
                      ${player.income.toLocaleString()}
                    </td>

                    {/* Monthly Invested */}
                    <td className="py-4 px-4 text-sm text-slate-700 font-medium">
                      ${player.invested.toLocaleString()}
                    </td>

                    {/* Invested % */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                        <Percent className="w-3 h-3 text-slate-400" />
                        {player.investedPercent}%
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                        <Flame className="w-3.5 h-3.5 fill-amber-100" />
                        {player.streak}x
                      </span>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-6 text-right">
                      <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-display font-black text-sm rounded-lg">
                        {player.score}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Proof of Concept Callout */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 text-xs leading-relaxed text-left">
        <strong>Mechanic Demonstration:</strong> Notice that <strong>Aria (Stipend Earner)</strong> ranks higher than <strong>Marcus (Tech Exec)</strong>. Aria earns a modest $1,200/mo but invests $300 (<strong>25%</strong> of income) with a high streak, whereas Marcus earns a high $16,000/mo but only invests $1,920 (<strong>12%</strong> of income). In absolute cash, Marcus invests 6x more than Aria, but Aria ranks higher due to her superior commitment ratio.
      </div>
    </div>
  );
}
