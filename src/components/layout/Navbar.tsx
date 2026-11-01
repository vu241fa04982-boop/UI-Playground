
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  WaveformLogo,
  UserIcon,
  MenuIcon,
  CloseIcon,
} from '../icons';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const accountRef = useRef<HTMLDivElement>(null);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };

    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountMenuOpen]);

  // Hide Navbar on Login and Signup pages
  if (
    location.pathname === '/login' ||
    location.pathname === '/signup'
  ) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // Navigation links
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/playground', label: 'Playground' },
    { to: '/saved', label: 'Saved' },
    { to: '/settings', label: 'Settings' },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'U';

    const parts = name.trim().split(' ');

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#020817]/95 backdrop-blur-md border-b border-[#12345C]/70 header-surface transition-colors">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <WaveformLogo
              size={30}
              className="group-hover:scale-105 transition-transform"
            />

            <span className="text-base font-extrabold tracking-tight text-white group-hover:text-purple-300 transition-colors brand-title">
              UI Playground
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.to ||
                (link.to === '/' && location.pathname === '/home');

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-white nav-link-active'
                      : 'text-slate-400 hover:text-slate-200 nav-link'
                  }`}
                >
                  {link.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Account Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && (
              <div className="relative" ref={accountRef}>

                <button
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all overflow-hidden ${
                    accountMenuOpen
                      ? 'ring-2 ring-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.6)] bg-purple-600 text-white'
                      : 'bg-purple-900/60 border border-purple-500/40 text-purple-200 hover:border-purple-400 hover:scale-105'
                  }`}
                  title="Account menu"
                  aria-label="Account menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : user?.name ? (
                    <span>{getInitials(user.name)}</span>
                  ) : (
                    <UserIcon size={16} />
                  )}
                </button>

                {/* Account Dropdown */}
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0B1D3A] border border-[#12345C] shadow-[0_15px_45px_rgba(0,0,0,0.7)] p-4 space-y-3 z-50 animate-fade-in text-left dropdown-surface">

                    <div className="flex items-center justify-between pb-2 border-b border-[#12345C]/70">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Account
                      </span>

                      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Signed in
                      </span>
                    </div>

                    {/* User Information */}
                    <div className="flex items-center gap-3 pt-1">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-purple-500 shadow-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                          {getInitials(user?.name)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-white truncate user-dropdown-name">
                          {user?.name || 'Designer'}
                        </div>

                        <div className="text-xs text-slate-400 truncate user-dropdown-email">
                          {user?.email || 'user@example.com'}
                        </div>
                      </div>
                    </div>

                    {/* Logout Only */}
                    <div className="pt-2 border-t border-[#12345C]/60">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-600/80 border border-rose-800/40 transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/60 border border-[#12345C]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon size={20} />
              ) : (
                <MenuIcon size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#12345C] bg-[#07152B] p-4 space-y-3 animate-fade-in dropdown-surface">

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.to ||
                  (link.to === '/' && location.pathname === '/home');

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-purple-900/60 text-white border-l-2 border-purple-500'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Information */}
            {isAuthenticated && (
              <div className="pt-3 border-t border-[#12345C] space-y-3">

                <div className="flex items-center gap-3 px-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-purple-400"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {getInitials(user?.name)}
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold text-white user-dropdown-name">
                      {user?.name}
                    </div>

                    <div className="text-[11px] text-slate-400 user-dropdown-email">
                      {user?.email}
                    </div>
                  </div>
                </div>

                {/* Logout Only */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/40 hover:bg-rose-600 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
