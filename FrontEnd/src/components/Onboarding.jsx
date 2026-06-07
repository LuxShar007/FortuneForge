import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldAlert, TrendingUp, Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '../config';


export default function Onboarding({ user, onAuthSuccess, onComplete, onNavigate }) {
  // Authentication states
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Baseline configuration states
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState(2500);
  const [riskProfile, setRiskProfile] = useState('Balanced');
  const [error, setError] = useState('');

  // Mock OAuth states
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockProvider, setMockProvider] = useState('');
  const [mockEmail, setMockEmail] = useState('');
  const [mockName, setMockName] = useState('Hero Explorer');

  // OTP states
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingRegData, setPendingRegData] = useState(null);

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

  // Listen for real OAuth popup callbacks
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'oauth-token') {
        const { provider, accessToken } = event.data;
        await handleBackendOAuth(provider, accessToken);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Initiates OAuth Flow (Real Redirect Popup or Mock Fallback Modal)
  const handleOAuthClick = (provider) => {
    setError('');
    const isGoogle = provider.toLowerCase() === 'google';
    const clientId = isGoogle
      ? import.meta.env.VITE_GOOGLE_CLIENT_ID
      : import.meta.env.VITE_MICROSOFT_CLIENT_ID;

    if (!clientId) {
      // Demo Mode: Trigger mock authentication modal
      setMockProvider(provider);
      setMockEmail(isGoogle ? 'explorer@gmail.com' : 'explorer@outlook.com');
      setMockName('Hero Explorer');
      setShowMockModal(true);
      return;
    }

    // Production Mode: Open OAuth popup window
    const width = 500, height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const redirectUri = encodeURIComponent(window.location.origin);

    let url = '';
    if (isGoogle) {
      url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile&state=google`;
    } else {
      url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=openid%20email%20profile%20User.Read&state=microsoft`;
    }

    window.open(url, `${provider}-login`, `width=${width},height=${height},left=${left},top=${top}`);
  };

  // Handles production OAuth verify & user creation
  const handleBackendOAuth = async (provider, accessToken) => {
    setLoading(true);
    setError('');
    try {
      let email = '';
      let externalId = '';
      let name = '';
      let picture = null;

      if (provider.toLowerCase() === 'google') {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error('Failed to fetch Google profile details.');
        const googleData = await res.json();
        email = googleData.email;
        externalId = googleData.sub;
        name = googleData.name || 'Google User';
        picture = googleData.picture || null;
      } else {
        const res = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error('Failed to fetch Microsoft profile details.');
        const msData = await res.json();
        email = msData.mail || msData.userPrincipalName;
        externalId = msData.id;
        name = msData.displayName || 'Microsoft User';
        picture = msData.picture || null;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email,
          externalId,
          name,
          picture,
          token: accessToken
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.detail || 'OAuth processing failed.');
      }

      if (data.otp_required) {
        setOtpRequired(true);
        setPendingRegData({
          type: 'oauth',
          provider,
          email,
          externalId,
          name,
          picture,
          token: accessToken
        });
        setLoading(false);
        return;
      }

      onAuthSuccess(data.token, data.user);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handles simulated Demo Mode oauth submit
  const handleMockSubmit = async (provider) => {
    setError('');
    const emailToUse = mockEmail || (provider === 'Google' ? 'explorer@gmail.com' : 'explorer@outlook.com');
    const mockExtId = `${provider.toLowerCase()}_mock_${Math.random().toString(36).substring(2, 9)}`;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: emailToUse,
          name: mockName || 'Hero Explorer',
          externalId: mockExtId,
          token: 'mock_token'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Failed to authenticate on mock server');
      }

      setShowMockModal(false);

      if (data.otp_required) {
        setOtpRequired(true);
        setPendingRegData({
          type: 'oauth',
          provider,
          email: emailToUse,
          name: mockName || 'Hero Explorer',
          externalId: mockExtId,
          token: 'mock_token'
        });
        setLoading(false);
        return;
      }

      onAuthSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handles Email/Password sign up & log in forms
  const handleEmailAuthSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.detail || `Authentication failed during ${endpoint}`);
      }

      if (data.otp_required) {
        setOtpRequired(true);
        setPendingRegData({ type: 'email', email, password });
        setLoading(false);
        return;
      }

      onAuthSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handles OTP form submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let response;
      if (pendingRegData.type === 'email') {
        response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: pendingRegData.email,
            password: pendingRegData.password,
            otp: otpCode
          })
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/auth/oauth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: pendingRegData.provider,
            email: pendingRegData.email,
            externalId: pendingRegData.externalId,
            name: pendingRegData.name,
            picture: pendingRegData.picture,
            token: pendingRegData.token,
            otp: otpCode
          })
        });
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Verification failed.');
      }

      setOtpRequired(false);
      setOtpCode('');
      setPendingRegData(null);
      
      onAuthSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Handles baseline metrics configuration form submit
  const handleBaselineSubmit = async (e) => {
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
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/baseline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          income: Number(income),
          expenses: Number(expenses),
          riskProfile,
          characterClass: riskClasses[riskProfile].title
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save baseline settings');
      }

      onComplete(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 py-12 md:py-16">
      {/* Full Background Video - 100% Opaque */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          src={`${import.meta.env.BASE_URL}sparrow.mp4`}
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

        {/* AUTHENTICATION VIEW CARD */}
        {!user.isAuthenticated ? (
          <div className="gold-card p-6 md:p-8 rounded-2xl mb-8">
            {otpRequired ? (
              <div>
                <h2 className="font-display text-lg font-bold text-slate-800 mb-2 text-center">
                  Verify Your Email
                </h2>
                <p className="text-xs text-slate-400 text-center mb-6 max-w-sm mx-auto leading-normal">
                  A verification code has been sent to <strong>{pendingRegData?.email}</strong>. Please enter the 6-digit code below.
                </p>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 mb-4 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg text-center animate-fade-in">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="block w-full text-center tracking-widest text-2xl font-bold py-3 bg-white border border-slate-200 rounded-xl gold-border-focus transition duration-200"
                      placeholder="000000"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3.5 px-6 font-display font-bold text-sm tracking-wider uppercase rounded-xl cursor-pointer gold-btn-gradient flex justify-center items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                </form>

                <div className="text-center mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpRequired(false);
                      setOtpCode('');
                      setPendingRegData(null);
                      setError('');
                    }}
                    className="text-xs font-bold text-slate-500 hover:underline cursor-pointer"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-display text-lg font-bold text-slate-800 mb-4 text-center">
                  {isLogin ? 'Sign In to Your Account' : 'Secure Instant Access'}
                </h2>

                {error && (
                  <div className="p-3 mb-4 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    {error}
                  </div>
                )}

                {/* Google Authentication Button */}
                <div className="flex flex-col gap-3">
                  {/* Google Button */}
                  <button
                    onClick={() => handleOAuthClick('Google')}
                    className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-slate-200 hover:border-amber-300 rounded-xl font-sans text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50/50 transition duration-200 cursor-pointer"
                    disabled={loading}
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
                </div>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200/80"></div>
                  </div>
                  <span className="relative px-3 bg-[#FCFBF9] text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    or continue with email
                  </span>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-sans text-slate-800 text-sm gold-border-focus transition duration-200"
                        placeholder="name@example.com"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl font-sans text-slate-800 text-sm gold-border-focus transition duration-200"
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3.5 px-6 font-display font-bold text-sm tracking-wider uppercase rounded-xl cursor-pointer gold-btn-gradient flex justify-center items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
                  </button>
                </form>

                <div className="text-center mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setIsLogin(!isLogin);
                    }}
                    className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
                  >
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
                  </button>
                </div>
              </>
            )}
            <div className="text-center mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-semibold">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('privacy')}
                className="hover:text-amber-800 hover:underline transition cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-slate-200">|</span>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('terms')}
                className="hover:text-amber-800 hover:underline transition cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        ) : (
          /* BASELINE CONFIGURATION FORM (ONLY SHOWN AFTER AUTHENTICATED) */
          <div className="gold-card p-6 md:p-8 rounded-2xl mb-8">
            <h2 className="font-display text-lg font-bold text-slate-800 mb-2 text-center">
              Configure Baseline Metrics
            </h2>
            <p className="text-xs text-slate-400 text-center mb-6 max-w-sm mx-auto leading-normal">
              Logged in as <span className="font-bold text-slate-600">{user.email}</span>. Configure your baseline variables to forge your character class.
            </p>

            <form onSubmit={handleBaselineSubmit} className="space-y-6">
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
                    disabled={loading}
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
                    disabled={loading}
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
                        disabled={loading}
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
                className="w-full py-3.5 px-6 font-display font-bold text-sm tracking-wider uppercase rounded-xl cursor-pointer gold-btn-gradient flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Forge Your Destiny'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MOCK AUTHENTICATION WINDOW OVERLAY */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in pointer-events-auto">
          {/* Google Mock Modal */}
          <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-2xl border border-slate-100 flex flex-col font-sans text-slate-800">
            <div className="flex justify-center mb-6">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
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
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 mb-1">Sign in with Google</h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              to continue to <span className="font-bold text-amber-600">FortuneForge</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={mockEmail}
                  onChange={(e) => setMockEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  placeholder="guest@gmail.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={mockName}
                  onChange={(e) => setMockName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Guest Hero"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setShowMockModal(false)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleMockSubmit('Google')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
