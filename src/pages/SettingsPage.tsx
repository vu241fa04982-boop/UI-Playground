
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

type ProfileData = {
  name: string;
  username: string;
  email: string;
  pronouns: string;
  location: string;
  website: string;
  avatar: string;
  bio: string;
};

const inputClass =
  'mt-2 w-full rounded-xl border border-slate-700 bg-[#0b1528] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-violet-500/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:shadow-[0_0_18px_rgba(139,92,246,0.12)]';

const cardClass =
  'settings-card rounded-2xl border border-slate-800 bg-[#0b1528] p-5 sm:p-6 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_12px_35px_rgba(124,58,237,0.10)]';

export function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getProfile = (): ProfileData => ({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    pronouns: user?.pronouns || '',
    location: user?.location || '',
    website: user?.website || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
  });

  const [profile, setProfile] = useState<ProfileData>(getProfile);
  const [savedProfile, setSavedProfile] = useState<ProfileData>(getProfile);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<
    'success' | 'error' | 'info'
  >('info');

  useEffect(() => {
    const latest: ProfileData = {
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      pronouns: user?.pronouns || '',
      location: user?.location || '',
      website: user?.website || '',
      avatar: user?.avatar || '',
      bio: user?.bio || '',
    };

    setProfile(latest);
    setSavedProfile(latest);
    setHasSavedProfile(false);
    setMessage('');
  }, [user?.email]);

  const isDirty = (
    Object.keys(profile) as (keyof ProfileData)[]
  ).some((key) => profile[key] !== savedProfile[key]);

  const canSave = !saving && (!hasSavedProfile || isDirty);

  const showMessage = (
    text: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    setMessage(text);
    setMessageType(type);
  };

  const handleFieldChange = (
    key: keyof ProfileData,
    value: string
  ) => {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));

    setMessage('');
  };

  const handlePhotoUpload = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('Please select a valid image file.', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage('Image size must be less than 2 MB.', 'error');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleFieldChange('avatar', reader.result);
        showMessage(
          'Photo selected. Click Save Profile to apply it.',
          'info'
        );
      }
    };

    reader.onerror = () => {
      showMessage('Unable to read this image.', 'error');
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    handleFieldChange('avatar', '');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    showMessage(
      'Photo removed. Click Save Profile to apply changes.',
      'info'
    );
  };

  const saveProfile = () => {
    if (!canSave) return;

    setSaving(true);
    setMessage('');

    const updatedProfile: ProfileData = {
      ...profile,
      name: profile.name.trim(),
      username: profile.username.trim(),
      email: profile.email.trim(),
      pronouns: profile.pronouns.trim(),
      location: profile.location.trim(),
      website: profile.website.trim(),
      bio: profile.bio.trim(),
    };

    try {
      const success = updateProfile(updatedProfile);

      if (!success) {
        throw new Error('Profile update failed');
      }

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setHasSavedProfile(true);

      showMessage('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Profile save error:', error);

      showMessage(
        'Unable to save your profile. Please try again.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const completionFields = [
    profile.name,
    profile.username,
    profile.email,
    profile.pronouns,
    profile.location,
    profile.website,
    profile.avatar,
    profile.bio,
  ];

  const completedFields = completionFields.filter(
    (field) => field.trim() !== ''
  ).length;

  const completion = Math.round(
    (completedFields / 8) * 100
  );

  const messageClass =
    messageType === 'success'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
      : messageType === 'error'
        ? 'border-red-500/30 bg-red-500/10 text-red-300'
        : 'border-violet-500/30 bg-violet-500/10 text-violet-300';

  return (
    <div className="settings-page relative min-h-screen overflow-hidden bg-[#020817] px-4 py-8 text-white sm:px-6 lg:px-8">

      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/5 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 top-96 h-80 w-80 rounded-full bg-cyan-500/5 blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="settings-heading mb-8">
          <p className="text-sm font-medium tracking-widest text-violet-400">
            SETTINGS
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Profile Settings
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage and update your personal profile information.
          </p>
        </div>

        {/* Main Two Column Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

          {/* LEFT SIDE */}
          <div className="space-y-6 lg:col-span-2">

            {/* Profile Completion */}
            <section className={`${cardClass} completion-card`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    Profile Completion
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Complete your profile to make it more informative.
                  </p>
                </div>

                <span
                  key={completion}
                  className="completion-number text-3xl font-bold text-violet-400"
                >
                  {completion}%
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="completion-bar h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-1000 ease-out"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                <span>
                  {completedFields} of 8 fields completed
                </span>

                <span>
                  {completion === 100
                    ? 'Your profile is complete!'
                    : 'Keep going — you are making progress!'}
                </span>
              </div>
            </section>

            {/* Profile Information */}
            <section className={cardClass}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">
                    Profile Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Update your personal details and profile picture.
                  </p>
                </div>

                {isDirty && (
                  <span className="unsaved-badge rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300">
                    Unsaved changes
                  </span>
                )}
              </div>

              {/* Profile Photo */}
              <div className="my-7 flex flex-wrap items-center gap-5">
                <div className="profile-avatar flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-violet-500 bg-violet-600 text-3xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={() =>
                        showMessage(
                          'Unable to load this image. Check the image URL.',
                          'error'
                        )
                      }
                    />
                  ) : (
                    profile.name.charAt(0).toUpperCase() || 'U'
                  )}
                </div>

                <div className="min-w-[180px] flex-1">
                  <p className="font-semibold">
                    Profile Picture
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Upload a photo or paste a direct image URL.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        handlePhotoUpload(event.target.files?.[0])
                      }
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="action-button rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25 active:scale-95"
                    >
                      Upload Photo
                    </button>

                    {profile.avatar && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="action-button rounded-lg border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-400 transition-all duration-300 hover:-translate-y-1 hover:bg-red-500/10 active:scale-95"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Image files · Maximum size 2 MB
                  </p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid gap-5 sm:grid-cols-2">

                <label className="text-sm font-medium text-slate-300">
                  Full Name
                  <input
                    className={inputClass}
                    value={profile.name}
                    onChange={(e) =>
                      handleFieldChange('name', e.target.value)
                    }
                    placeholder="Enter your name"
                  />
                </label>

                <label className="text-sm font-medium text-slate-300">
                  Username
                  <input
                    className={inputClass}
                    value={profile.username}
                    onChange={(e) =>
                      handleFieldChange('username', e.target.value)
                    }
                    placeholder="Enter username"
                  />
                </label>

                <label className="text-sm font-medium text-slate-300">
                  Email Address
                  <input
                    className={`${inputClass} cursor-not-allowed opacity-70`}
                    type="email"
                    value={profile.email}
                    readOnly
                  />
                </label>

                <label className="text-sm font-medium text-slate-300">
                  Pronouns
                  <input
                    className={inputClass}
                    value={profile.pronouns}
                    onChange={(e) =>
                      handleFieldChange('pronouns', e.target.value)
                    }
                    placeholder="e.g. She/Her"
                  />
                </label>

                <label className="text-sm font-medium text-slate-300">
                  Location
                  <input
                    className={inputClass}
                    value={profile.location}
                    onChange={(e) =>
                      handleFieldChange('location', e.target.value)
                    }
                    placeholder="Your location"
                  />
                </label>

                <label className="text-sm font-medium text-slate-300">
                  Website
                  <input
                    className={inputClass}
                    value={profile.website}
                    onChange={(e) =>
                      handleFieldChange('website', e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                </label>

                <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                  Avatar Image URL
                  <input
                    className={inputClass}
                    value={
                      profile.avatar.startsWith('data:')
                        ? ''
                        : profile.avatar
                    }
                    onChange={(e) =>
                      handleFieldChange('avatar', e.target.value)
                    }
                    placeholder="Paste a direct image URL"
                  />
                </label>

                <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                  Bio
                  <textarea
                    className={`${inputClass} min-h-28 resize-y`}
                    value={profile.bio}
                    onChange={(e) =>
                      handleFieldChange('bio', e.target.value)
                    }
                    placeholder="Tell us a little about yourself..."
                    maxLength={250}
                  />

                  <span className="mt-1 block text-right text-xs text-slate-500">
                    {profile.bio.length}/250
                  </span>
                </label>
              </div>

              {/* Save Profile */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6">
                <p className="text-xs text-slate-500">
                  {isDirty
                    ? 'You have unsaved changes.'
                    : 'Your profile is up to date.'}
                </p>

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={!canSave}
                  className="action-button rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </span>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </div>

              {message && (
                <div
                  key={message}
                  role="status"
                  className={`message-animation mt-4 rounded-xl border px-4 py-3 text-sm ${messageClass}`}
                >
                  {message}
                </div>
              )}
            </section>

          </div>

          {/* RIGHT SIDE: Live Profile Preview */}
          <div className="preview-container lg:sticky lg:top-6 lg:col-span-1">
            <section className={`${cardClass} preview-card`}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold">
                  Live Profile Preview
                </h2>

                <span className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-400">
                Your preview updates while you edit your information.
              </p>

              <div className="preview-inner mt-5 flex flex-col gap-4 rounded-xl border border-slate-700 bg-[#071124] p-5 transition-all duration-500 hover:border-violet-500/40">

                <div className="profile-avatar flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-violet-500 bg-violet-600 text-2xl font-bold shadow-[0_0_25px_rgba(139,92,246,0.20)]">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Live profile preview"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    profile.name.charAt(0).toUpperCase() || 'U'
                  )}
                </div>

                <div className="min-w-0">
                  <h3
                    key={profile.name}
                    className="preview-text text-xl font-bold break-words"
                  >
                    {profile.name || 'Your Name'}
                  </h3>

                  <p className="mt-1 text-sm text-violet-300">
                    {profile.username
                      ? `@${profile.username}`
                      : '@username'}
                  </p>

                  <p className="mt-2 text-sm text-slate-400 break-words">
                    {profile.bio || 'Your bio will appear here.'}
                  </p>

                  {profile.location && (
                    <p className="mt-2 text-xs text-slate-500 preview-text">
                      📍 {profile.location}
                    </p>
                  )}

                  {profile.website && (
                    <p className="mt-2 break-all text-xs text-cyan-400 preview-text">
                      {profile.website}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes previewEnter {
          from {
            opacity: 0;
            transform: translateX(25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes textChange {
          from {
            opacity: 0.4;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes badgeEnter {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes messageEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .settings-page {
          animation: pageEnter 0.7s ease-out both;
        }

        .settings-heading {
          animation: cardEnter 0.7s ease-out both;
        }

        .completion-card {
          animation: cardEnter 0.7s ease-out 0.1s both;
        }

        .settings-card:nth-child(2) {
          animation: cardEnter 0.7s ease-out 0.2s both;
        }

        .preview-container {
          animation: previewEnter 0.8s ease-out 0.25s both;
        }

        .completion-number {
          animation: textChange 0.35s ease-out;
        }

        .completion-bar {
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.3);
        }

        .profile-avatar {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .profile-avatar:hover {
          transform: scale(1.06);
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.35);
        }

        .preview-text {
          animation: textChange 0.3s ease-out;
        }

        .unsaved-badge {
          animation: badgeEnter 0.3s ease-out, pulse 2s ease-in-out infinite;
        }

        .message-animation {
          animation: messageEnter 0.35s ease-out both;
        }

        .action-button {
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .settings-page,
          .settings-heading,
          .completion-card,
          .settings-card,
          .preview-container,
          .completion-number,
          .preview-text,
          .unsaved-badge,
          .message-animation {
            animation: none !important;
          }

          .settings-card,
          .profile-avatar,
          .action-button,
          .completion-bar {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
