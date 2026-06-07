import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy({ onBack }) {
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
            <Shield className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tight gold-text-gradient">
              Privacy Policy
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Last Updated: June 2026
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-8">
          Welcome to **FortuneForge** ("we", "our", or "us"). We are committed to protecting your privacy and security. This Privacy Policy explains how we collect, use, and protect your information when you interact with our gamified financial engine.
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="border-b border-amber-500/10 pb-6">
            <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
              <Eye className="w-4.5 h-4.5 text-amber-700" />
              1. Information We Collect
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              To operate the FortuneForge simulator and deliver personalized AI feedback, we collect:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
              <li>
                <strong>Account Credentials:</strong> Email, names, and profile pictures when you register manually or authenticate via Google/Microsoft OAuth.
              </li>
              <li>
                <strong>Financial Simulator Inputs:</strong> Income, expenses, simulated investments, and debt values configured in your onboarding dashboard.
              </li>
              <li>
                <strong>Gamification Metrics:</strong> Level progression, accumulated XP points, active streaks, and completed weekly quests.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="border-b border-amber-500/10 pb-6">
            <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
              <Lock className="w-4.5 h-4.5 text-amber-700" />
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
              <li>
                <strong>Personalization:</strong> Adapting your RPG character class, emergency Budget Shield status, and Cash Flow Mana metrics.
              </li>
              <li>
                <strong>AI Mentorship:</strong> Exposing your simulator metrics to the Google Gemini API to construct hyper-personalized budget recommendations.
              </li>
              <li>
                <strong>Leaderboard Competition:</strong> Listing your username, level, and XP on the commitment leaderboard for gamified tracking.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="border-b border-amber-500/10 pb-6">
            <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
              <FileText className="w-4.5 h-4.5 text-amber-700" />
              3. Third-Party Integrations
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              We leverage safe, industry-standard API partnerships:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
              <li>
                <strong>Google Gemini API:</strong> Chat messages and simulator metrics are securely shared with Google AI service nodes to return financial tips. We do not use your data to train public LLMs.
              </li>
              <li>
                <strong>OAuth Providers:</strong> Google and Microsoft verify your identity. We never see or store your primary passwords.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
              🛡️ Security & Retention
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We encrypt passwords using industry-standard bcrypt hashing, encrypt authentication tokens via JSON Web Tokens (JWT), and safeguard data inside SQLite instances. You can request complete deletion of your account and simulated profile at any time by contacting our support team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
