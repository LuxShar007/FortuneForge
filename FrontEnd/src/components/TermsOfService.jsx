import React from 'react';
import { ArrowLeft, BookOpen, AlertTriangle, UserCheck, ShieldAlert } from 'lucide-react';

export default function TermsOfService({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto py-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-950 mb-6 transition duration-200 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-amber-500/10 shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to App
      </button>

      {/* Main Container */}
      <div className="bg-white border border-amber-500/15 rounded-3xl p-8 md:p-12 shadow-md text-left">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-500/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tight gold-text-gradient">
              Terms of Service
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Last Updated: June 2026
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-8">
          Welcome to **FortuneForge**. By accessing, registering, or interacting with our website and application services, you agree to comply with and be bound by the following Terms of Service. Please review them carefully.
        </p>

        {/* Financial Disclaimer Banner */}
        <div className="mb-8 p-4 bg-amber-50/50 border border-amber-500/20 rounded-2xl flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed font-sans">
            <strong className="font-display font-bold uppercase tracking-wider block mb-1">⚠️ IMPORTANT SIMULATOR DISCLAIMER</strong>
            FortuneForge is an educational game and financial simulation environment. The data input (income, expenses, debt) and outcomes do not represent real-world bank products, legally binding investments, or certified tax profiles. All advice delivered by the AI Coach is powered by Google Gemini and should NOT be treated as professional, certified financial or investment advice. Always consult a certified advisor before making real-world financial decisions.
          </div>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="border-b border-amber-500/10 pb-6">
            <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
              <UserCheck className="w-4.5 h-4.5 text-amber-700" />
              1. Account Eligibility & Behavior
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              You must provide accurate account information during onboarding to participate in our simulator leaderboard. You are responsible for protecting your account keys and JWT authorization headers. Any abuse of the game engine (e.g., botting XP, SQL injection, or script manipulation) will lead to immediate account suspension.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-b border-amber-500/10 pb-6">
            <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
              ⚔️ Quest & Relic Rewards
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              XP, levels, and "Vault Shop" relics are virtual game items. They have absolutely **no real-world cash value**, cannot be redeemed for fiat currency, and are non-transferable between accounts.
            </p>
          </section>

          {/* Section 3 */}
          <section className="border-b border-amber-500/10 pb-6">
            <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-700" />
              3. Service Availability & Modification
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We reserve the right to modify, pause, or terminate the simulator engine, leaderboard tiers, or AI coach integrations at any time without prior notice. We are not liable for any service interruptions caused by third-party hosting partners (Render, Vercel, or Google Gemini nodes).
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-display font-bold text-lg text-slate-800 mb-3">
              ⚖️ Governing Law
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              These terms are governed by and construed in accordance with local regulations, without regard to conflict of law principles. Any updates to these terms will be posted directly to this web page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
