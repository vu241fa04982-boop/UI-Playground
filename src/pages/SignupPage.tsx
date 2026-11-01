
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  WaveformLogo,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
} from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { usePlayground } from '../context/PlaygroundContext';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = usePlayground();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);

      const success = await signup(name.trim(), email.trim(), password);

      if (success) {
        showToast('Account created successfully.', 'success');

        // If email confirmation is enabled, Supabase may not create a session yet.
        // In that case, send the user to login after they verify their email.
        navigate('/login');
      } else {
        setErrorMessage(
          'Unable to create account. This email may already be registered.'
        );
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-10 bg-[#020817] text-slate-100 relative overflow-hidden transition-colors auth-page-enter auth-scene">

      {/* Animated background atmosphere */}
      <div className="auth-orb auth-orb-purple absolute w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none" />
      <div className="auth-orb auth-orb-pink absolute w-[350px] h-[350px] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />
      <div className="auth-orb auth-orb-blue absolute w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Animated Glass Signup Card */}
      <div className="w-full max-w-md bg-[#0B1D3A]/70 border border-[#12345C]/70 rounded-3xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative z-10 backdrop-blur-2xl space-y-5 auth-glass-card">

        {/* Brand Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2.5 mb-2 auth-brand">
            <div className="auth-logo-glow">
              <WaveformLogo size={36} />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              UI Playground
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your Account
          </h2>

          <p className="text-xs sm:text-sm text-slate-400">
            Start designing and generating real-time CSS.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div
            className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 animate-fade-in relative z-10"
            role="alert"
          >
            <span className="font-bold">Notice:</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4 relative z-10">

          {/* Full Name */}
          <div className="auth-field">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMessage('');
              }}
              placeholder="Jordan Daniels"
              autoComplete="name"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-[#07152B]/70 border border-[#12345C] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all auth-input disabled:opacity-60"
            />
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              placeholder="jordan@design.io"
              autoComplete="email"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-[#07152B]/70 border border-[#12345C] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all auth-input disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                minLength={6}
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#07152B]/70 border border-[#12345C] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all auth-input disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Confirm Password
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMessage('');
              }}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-[#07152B]/70 border border-[#12345C] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all auth-input disabled:opacity-60"
            />
          </div>

          {/* Signup Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2 active:scale-98 auth-primary-btn disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </span>

              {!isLoading && <ArrowRightIcon size={16} />}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center pt-4 border-t border-[#12345C]/60 text-xs relative z-10">
          <p className="text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-purple-400 hover:text-purple-300 transition-colors auth-link"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-[10px] text-slate-600 tracking-[0.25em] uppercase auth-footer-text">
        Create • Design • Animate
      </p>
    </div>
  );
};
