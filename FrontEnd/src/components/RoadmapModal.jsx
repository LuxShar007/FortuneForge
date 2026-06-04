import React from 'react';
import { X, Award, ShieldAlert, Gift, Sparkles, Star } from 'lucide-react';

export default function RoadmapModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const features = [
    {
      icon: Award,
      title: 'Milestone Achievements',
      desc: 'Unlock special title modifiers (e.g. "Compounder Overlord") and rare badge graphics as you hit savings thresholds.'
    },
    {
      icon: ShieldAlert,
      title: 'Unlockable Badges',
      desc: 'Showcase financial achievements on your public profile, such as the "Debt Annihilator" or "6-Month Shield Guardian".'
    },
    {
      icon: Gift,
      title: 'Cashback Incentives',
      desc: 'Earn real cashback rewards direct to your emergency fund when completing high-tier quests with sponsored retail partners.'
    },
    {
      icon: Sparkles,
      title: 'Partner-Sponsored Benefits',
      desc: 'Exclusive discounts on insurance, high-yield savings accounts, and tax-prep software based on your Commitment Score.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-filter backdrop-blur-md">
      <div className="bg-white border border-amber-500/20 max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-600 fill-amber-100" />
            <h3 className="font-display font-extrabold text-lg text-slate-800">
              Future Rewards Roadmap
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <p className="text-slate-500 text-xs leading-relaxed font-sans">
            Here is what our developers are forging next. Level up your squire today to secure early access to these premium mechanics as they launch!
          </p>

          <div className="space-y-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="flex gap-4 p-4 bg-amber-50/20 border border-amber-200/20 rounded-xl hover:border-amber-300/40 transition">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-700 h-fit shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-display font-extrabold text-sm text-slate-800">
                      {feat.title}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1 font-sans">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
