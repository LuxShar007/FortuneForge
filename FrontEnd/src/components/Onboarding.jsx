import React, { useState } from 'react';
import { DollarSign, ShieldAlert, TrendingUp, Sparkles } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState(2500);
  const [riskProfile, setRiskProfile] = useState('Balanced');
  const [error, setError] = useState('');

  const riskClasses = {
    Conservative: {
      title: 'Gilt Defender',
      desc: 'Focused on preservation. High shield health, low mana fluctuation.',
      color: 'from-amber-600 to-amber-700',
      icon: ShieldAlert
    },
    Balanced: {
      title: 'Compounding Squire',
      desc: 'Steady growth. Balanced shield capacity and mana generation.',
      color: 'from-yellow-600 to-amber-600',
      icon: Sparkles
    },
    Growth: {
      title: 'Leveraged Knight',
      desc: 'Aggressive wealth accumulation. Medium shield, high mana multipliers.',
      color: 'from-amber-500 to-yellow-500',
      icon: TrendingUp
    },
    Speculative: {
      title: 'Arbitrage Wizard',
      desc: 'High risk, explosive rewards. Dynamic shield, volatile mana pools.',
      color: 'from-yellow-400 to-amber-500',
      icon: DollarSign
    }
  };

  const handleOAuth = (provider) => {
    // Premium mock OAuth alert toast or transition
    alert(`Initiating secure, premium handshake with ${provider}...`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (income <= 0) {
      setError('Please enter a valid monthly income.');
      return;
    }
    if (expenses < 0) {
      setError('Please enter valid essential expenses.');
      return;
    }
    if (Number(expenses) > Number(income)) {
      setError('Essential expenses cannot exceed monthly income.');
      return;
    }
    setError('');
    onComplete({
      income: Number(income),
      expenses: Number(expenses),
      riskProfile,
      characterClass: riskClasses[riskProfile].title
    });
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 py-12 md:py-16">
      {/* Full Background Video - 100% Opaque */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          src="/sparrow.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover animate-fade-in"
        />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest text-amber-100 uppercase bg-slate-900/60 border border-amber-500/30 backdrop-blur-md rounded-full">
            Gamified Wealth Engine
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Welcome to <span className="gloomy-gold-text">FortuneForge</span>
          </h1>
          <p className="font-sans text-slate-100 text-sm md:text-base max-w-md mx-auto font-medium" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.6)' }}>
            Sign up to forge your financial shield, unlock AI quests, and scale the commitment leaderboard.
          </p>
        </div>

        {/* OAuth UI Card */}
        <div className="gold-card p-6 md:p-8 rounded-2xl mb-8">
          <h2 className="font-display text-lg font-bold text-slate-800 mb-4 text-center">
            Secure Instant Access
          </h2>
          <div className="flex flex-col gap-3">
            {/* Google Button */}
            <button
              onClick={() => handleOAuth('Google')}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-slate-200 hover:border-amber-300 rounded-xl font-sans text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50/50 transition duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.42 7.54l3.8 2.95C6.12 7.02 8.84 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2 3.7-4.96 3.7-8.63z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.22 14.77c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.42 7.28C.51 9.1 0 11.05 0 13s.51 3.9 1.42 5.72l3.8-2.95z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.52 1.18-4.23 1.18-3.16 0-5.88-1.98-6.78-4.96l-3.8 2.95C3.37 20.35 7.35 23 12 23z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Microsoft Button */}
            <button
              onClick={() => handleOAuth('Microsoft')}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-slate-200 hover:border-amber-300 rounded-xl font-sans text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50/50 transition duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 23 23">
                <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                <rect x="0" y="12" width="11" height="11" fill="#00A1F1" />
                <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
              </svg>
              Continue with Microsoft
            </button>

            {/* Apple Button */}
            <button
              onClick={() => handleOAuth('Apple')}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-slate-200 hover:border-amber-300 rounded-xl font-sans text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50/50 transition duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.63.73-1.18 1.87-1.03 2.98 1.1.09 2.22-.55 2.96-1.41z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80"></div>
            </div>
            <span className="relative px-3 bg-[#FCFBF9] text-xs font-semibold text-slate-400 uppercase tracking-widest">
              or configure baseline
            </span>
          </div>

          {/* Onboarding Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Monthly Stipend / Income ($)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="block w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-sans text-slate-800 text-sm gold-border-focus transition duration-200"
                  placeholder="e.g. 3500"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Monthly Essential Expenses ($)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="block w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-sans text-slate-800 text-sm gold-border-focus transition duration-200"
                  placeholder="e.g. 1800"
                  min="0"
                  required
                />
              </div>
              <p className="mt-1 text-slate-400 text-xs">
                Includes rent, bills, groceries, and debt payments.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                RPG Risk Profile Class
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(riskClasses).map((profile) => {
                  const CurrentIcon = riskClasses[profile].icon;
                  const isSelected = riskProfile === profile;
                  return (
                    <button
                      key={profile}
                      type="button"
                      onClick={() => setRiskProfile(profile)}
                      className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/40 border-amber-500/80 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-100/80 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                          <CurrentIcon className="w-4 h-4" />
                        </div>
                        <span className="font-display font-bold text-sm text-slate-800">
                          {profile}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800/80 mb-1">
                        {riskClasses[profile].title}
                      </span>
                      <span className="text-[10px] text-slate-400 leading-tight">
                        {riskClasses[profile].desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 font-display font-bold text-sm tracking-wider uppercase rounded-xl cursor-pointer gold-btn-gradient"
            >
              Forge Your Destiny
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
