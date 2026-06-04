import React, { useMemo } from 'react';
import { Award, Trophy, Star, Sparkles } from 'lucide-react';

export default function XpCelebration({ isOpen, xpAmount, reason, onClose }) {
  if (!isOpen) return null;

  // Generate a random set of coins for the victory cascade animation
  const coins = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 92 + 4, // Horizontal position (%)
      delay: Math.random() * 1.5, // Start delay offset (seconds)
      size: Math.random() * 18 + 18, // Diameter (px)
      duration: Math.random() * 1.2 + 2.0 // Velocity (float duration)
    }));
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1409]/75 backdrop-blur-md sepia-[25%] animate-fade-in pointer-events-auto select-none">
      
      {/* RISING COINS ANIMATION CONTAINER */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="fixed bottom-0 floating-coin pointer-events-none z-10"
            style={{
              left: `${coin.left}%`,
              animationDelay: `${coin.delay}s`,
              animationDuration: `${coin.duration}s`,
              width: `${coin.size}px`,
              height: `${coin.size}px`
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_4px_10px_rgba(212,175,55,0.45)]">
              <circle cx="12" cy="12" r="10" fill="#D4AF37" stroke="#AA771C" strokeWidth="2" />
              <circle cx="12" cy="12" r="7" fill="#F7D054" stroke="#AA771C" strokeWidth="1" />
              <text x="12" y="16" fontSize="11" fontWeight="extrabold" textAnchor="middle" fill="#7A5813">$</text>
            </svg>
          </div>
        ))}
      </div>

      {/* CENTER CELEBRATION CARD */}
      <div className="bg-white border border-amber-500/25 max-w-sm w-full p-8 rounded-2xl shadow-[0_0_60px_rgba(212,175,55,0.35)] text-center flex flex-col items-center relative z-20 animate-scale-up border-b-4 border-b-amber-500">
        
        {/* Floating XP Star sparkles */}
        <div className="absolute -top-10 bg-amber-50 border border-amber-500/35 w-20 h-20 rounded-full flex items-center justify-center shadow-lg text-amber-700 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="mt-8 mb-6 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-800">
            <Sparkles className="w-3.5 h-3.5" />
            Victory Achieved
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          
          <h2 className="font-display font-extrabold text-2xl text-slate-800 uppercase tracking-tight">
            {reason || 'Quest Cleared!'}
          </h2>
          
          <p className="text-slate-500 text-xs leading-normal font-sans">
            Your character's discipline has forged new compound gains. Level progression has advanced.
          </p>
        </div>

        {/* Large XP Reward Badge */}
        <div className="w-full bg-amber-50/50 border border-amber-200/50 py-5 rounded-2xl mb-8 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <Star className="w-6 h-6 text-amber-700 fill-amber-300" />
            <span className="font-display font-black text-4xl text-amber-800 tracking-tight">
              +{xpAmount}
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-700/80 uppercase tracking-widest mt-1">
            Experience Points Gained
          </span>
        </div>

        {/* Collect Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          Collect Loot & Resume
        </button>
      </div>

    </div>
  );
}
