import React, { useState } from 'react';
import { Gift, BookOpen, UserCheck, ShieldCheck, ShoppingBag, Sparkles, Check } from 'lucide-react';

export default function RewardsVault({ commitmentScore, redeemedItems, onRedeemItem }) {
  const [activeTab, setActiveTab] = useState('all');

  const rewards = [
    {
      id: 'reward-1',
      title: 'Premium Personal Finance E-Book',
      desc: 'Master the art of compounding Squire-style. Comprehensive guide to index investing.',
      type: 'resource',
      scoreRequired: 15,
      icon: BookOpen,
      worth: '$15 Value'
    },
    {
      id: 'reward-2',
      title: '$10 Starbucks Gift Card',
      desc: 'Boost your caffeine mana. Restores stamina for weekly budget challenges.',
      type: 'voucher',
      scoreRequired: 25,
      icon: Gift,
      worth: '$10 Cash Value'
    },
    {
      id: 'reward-3',
      title: '$15 Amazon Gift Card',
      desc: 'Purchase financial planners or books. Direct voucher added to account.',
      type: 'voucher',
      scoreRequired: 35,
      icon: Gift,
      worth: '$15 Cash Value'
    },
    {
      id: 'reward-4',
      title: '1-on-1 AI Financial Coach Consult',
      desc: '30-minute private strategy session with our senior automated asset advisor.',
      type: 'service',
      scoreRequired: 40,
      icon: UserCheck,
      worth: '$75 Value'
    },
    {
      id: 'reward-5',
      title: 'FortuneForge Limited Hoodie',
      desc: 'Premium gold-stitched organic cotton armor for real-world Squires. Free shipping.',
      type: 'physical',
      scoreRequired: 45,
      icon: ShoppingBag,
      worth: '$60 Value'
    }
  ];

  const filteredRewards = rewards.filter((r) => activeTab === 'all' || r.type === activeTab);

  const handleRedeem = (item) => {
    if (commitmentScore < item.scoreRequired) return;
    onRedeemItem(item);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <h2 className="font-display text-2xl font-extrabold text-slate-800">
              Rewards Vault
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Exchange your Commitment Score standing for vouchers, merchandise, and wealth resources.
          </p>
        </div>

        {/* Currency Display Card */}
        <div className="gold-card p-4 rounded-xl flex items-center justify-between gap-6 bg-white">
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Your Commitment Standing
            </span>
            <span className="font-display font-black text-2xl text-amber-800">
              {commitmentScore} Points
            </span>
          </div>
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 font-display font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Tier 2 Squire
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
        {['all', 'voucher', 'resource', 'service', 'physical'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer border ${
              activeTab === tab
                ? 'bg-slate-800 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-500 hover:border-amber-300'
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRewards.map((reward) => {
          const isRedeemed = redeemedItems.some((item) => item.id === reward.id);
          const isLocked = commitmentScore < reward.scoreRequired;
          const Icon = reward.icon;

          // Find redeemed item to show code
          const redeemedRecord = redeemedItems.find((item) => item.id === reward.id);

          return (
            <div
              key={reward.id}
              className={`gold-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                isRedeemed ? 'opacity-80 bg-slate-50/50 border-slate-200' : 'bg-white'
              }`}
            >
              {/* Badge info */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-amber-700/80 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded">
                  {reward.worth}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Requires {reward.scoreRequired} Score
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex gap-4 mb-6 text-left">
                <div className={`p-3 rounded-xl ${isLocked ? 'bg-slate-100 text-slate-400' : 'bg-amber-50 text-amber-700'} h-fit shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-800 text-base mb-1 flex items-center gap-2">
                    {reward.title}
                    {isRedeemed && <Check className="w-4 h-4 text-emerald-600" />}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-sans">
                    {reward.desc}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isRedeemed ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                    <span className="text-xs font-bold text-emerald-800 block">
                      ✓ Redeemed successfully!
                    </span>
                    <code className="mt-1 inline-block text-[11px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      VOUCHER CODE: {redeemedRecord.code}
                    </code>
                  </div>
                ) : isLocked ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-100 border border-slate-200 text-slate-400 font-display font-bold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    🔒 Locked (Requires {reward.scoreRequired} Score)
                  </button>
                ) : (
                  <button
                    onClick={() => handleRedeem(reward)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Claim Reward
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
