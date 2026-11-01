
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePlayground } from '../../context/PlaygroundContext';
import { CloseIcon, UserIcon, TrashIcon, CheckIcon } from '../icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtendedProfile {
  name: string;
  email: string;
  bio: string;
  avatar?: string;
  username: string;
  pronouns: string;
  location: string;
  website: string;
}

const emptyProfile: ExtendedProfile = {
  name: '',
  email: '',
  bio: '',
  avatar: undefined,
  username: '',
  pronouns: '',
  location: '',
  website: '',
};

const normalizeProfile = (user: any): ExtendedProfile => ({
  name: user?.name ?? '',
  email: user?.email ?? '',
  bio: user?.bio ?? '',
  avatar: user?.avatar || undefined,
  username: user?.username ?? '',
  pronouns: user?.pronouns ?? '',
  location: user?.location ?? '',
  website: user?.website ?? '',
});

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = usePlayground();

  const [form, setForm] = useState<ExtendedProfile>(emptyProfile);
  const [initialForm, setInitialForm] = useState<ExtendedProfile>(emptyProfile);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const profile = normalizeProfile(user);
    setForm(profile);
    setInitialForm(profile);
    setError('');
    setActiveTab('personal');
  }, [isOpen, user]);

  if (!isOpen) return null;

  const hasChanges = JSON.stringify(form) !== JSON.stringify(initialForm);

  const updateField = (field: keyof ExtendedProfile, value: string | undefined) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'U';
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  const completionFields = [
    form.name,
    form.email,
    form.username,
    form.bio,
    form.location,
    form.website,
    form.avatar,
  ];

  const completedCount = completionFields.filter((value) =>
    String(value ?? '').trim()
  ).length;

  const completion = Math.round(
    (completedCount / completionFields.length) * 100
  );

  const requestClose = () => {
    if (isSaving) return;

    if (hasChanges) {
      const discard = window.confirm(
        'You have unsaved changes. Discard them and close your profile?'
      );
      if (!discard) return;
    }

    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0];

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      setError('Choose a JPEG, PNG, or WebP image.');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxDimension = 256;
        const scale = Math.min(
          1,
          maxDimension / Math.max(image.width, image.height)
        );

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext('2d');

        if (!context) {
          setError('Could not process this image. Please try another.');
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        try {
          updateField('avatar', canvas.toDataURL('image/jpeg', 0.82));
        } catch {
          setError('Could not process this image. Please try another.');
        }
      };

      image.onerror = () => setError('The selected image could not be opened.');
      image.src = String(reader.result);
    };

    reader.onerror = () => setError('Could not read the selected image.');
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    updateField('avatar', undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Full name is required.';
    if (form.name.trim().length < 2) {
      return 'Full name must contain at least 2 characters.';
    }

    if (!form.email.trim()) return 'Email address is required.';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      return 'Enter a valid email address.';
    }

    if (
      form.username &&
      !/^[a-zA-Z0-9_.-]{3,24}$/.test(form.username)
    ) {
      return 'Username must be 3–24 characters using letters, numbers, dots, underscores, or hyphens.';
    }

    if (form.website) {
      try {
        const parsedUrl = new URL(
          /^https?:\/\//i.test(form.website)
            ? form.website
            : `https://${form.website}`
        );

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          return 'Enter a valid website URL.';
        }
      } catch {
        return 'Enter a valid website or portfolio URL.';
      }
    }

    if (form.bio.length > 200) {
      return 'Bio must be 200 characters or fewer.';
    }

    return '';
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar,
        username: form.username.trim(),
        pronouns: form.pronouns.trim(),
        location: form.location.trim(),
        website: form.website.trim(),
      };

      // AuthContext must persist the additional profile fields too.
      const success = await Promise.resolve(
        updateProfile(payload as Parameters<typeof updateProfile>[0])
      );

      if (!success) {
        setError('Profile could not be saved. Please try again.');
        return;
      }

      setForm(payload);
      setInitialForm(payload);
      showToast('Profile updated successfully!', 'success');
      onClose();
    } catch {
      setError('Something went wrong while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset all unsaved edits to the last saved profile?'
    );

    if (!confirmed) return;

    setForm({ ...initialForm });
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#12345C] bg-[#07152B] px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20';

  const labelClass =
    'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm animate-fade-in sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="modal-surface relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#12345C] bg-[#0B1D3A] text-left shadow-[0_25px_80px_rgba(0,0,0,0.75)] animate-scale-up"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#12345C]/70 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/40 bg-purple-600/20 text-purple-300">
              <UserIcon size={21} />
            </div>
            <div>
              <h2
                id="profile-modal-title"
                className="text-lg font-bold tracking-tight text-white"
              >
                Edit Profile
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Personalize your UI Playground account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={requestClose}
            disabled={isSaving}
            aria-label="Close profile editor"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-[#12345C]/60 hover:text-white disabled:opacity-50"
          >
            <CloseIcon size={19} />
          </button>
        </header>

        {/* Profile completion */}
        <div className="border-b border-[#12345C]/50 px-5 py-4 sm:px-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">
              Profile completion
            </span>
            <span className="font-bold text-purple-300">{completion}%</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-[#07152B]"
            role="progressbar"
            aria-label="Profile completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={completion}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Add a username, bio, and photo to personalize your profile.
          </p>
        </div>

        {/* Tabs */}
        <nav className="flex gap-2 border-b border-[#12345C]/50 px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'personal'
                ? 'border border-purple-500/40 bg-purple-600/20 text-purple-200'
                : 'text-slate-400 hover:bg-[#07152B] hover:text-white'
            }`}
          >
            Personal details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'security'
                ? 'border border-purple-500/40 bg-purple-600/20 text-purple-200'
                : 'text-slate-400 hover:bg-[#07152B] hover:text-white'
            }`}
          >
            Security & actions
          </button>
        </nav>

        {/* Scrollable content */}
        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-sm text-rose-300"
              >
                <strong className="mr-1">Please check:</strong>
                {error}
              </div>
            )}

            {activeTab === 'personal' ? (
              <>
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#12345C]/70 bg-[#07152B]/80 p-4 sm:flex-row">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-purple-500 bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 text-2xl font-extrabold text-white shadow-[0_0_25px_rgba(124,58,237,0.25)]">
                    {form.avatar ? (
                      <img
                        src={form.avatar}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(form.name || user?.name || '')
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Profile photo
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      JPEG, PNG, or WebP. Maximum 2 MB. Your image is resized
                      before saving.
                    </p>

                    <input
                      ref={fileInputRef}
                      id="profile-avatar-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <label
                        htmlFor="profile-avatar-upload"
                        className="cursor-pointer rounded-xl border border-purple-500/50 bg-purple-600/30 px-3 py-2 text-xs font-semibold text-purple-200 transition hover:bg-purple-600 hover:text-white"
                      >
                        Upload photo
                      </label>

                      {form.avatar && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="flex items-center gap-1.5 rounded-xl border border-rose-800/50 bg-rose-950/30 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-600 hover:text-white"
                        >
                          <TrashIcon size={13} />
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name and username */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="profile-name" className={labelClass}>
                      Full name *
                    </label>
                    <input
                      id="profile-name"
                      autoComplete="name"
                      required
                      maxLength={80}
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-username" className={labelClass}>
                      Username
                    </label>
                    <input
                      id="profile-username"
                      autoComplete="username"
                      maxLength={24}
                      value={form.username}
                      onChange={(e) => updateField('username', e.target.value)}
                      placeholder="e.g. bhavya_designs"
                      className={inputClass}
                    />
                    <p className="mt-1.5 text-[10px] text-slate-500">
                      3–24 letters, numbers, dots, _ or -
                    </p>
                  </div>
                </div>

                {/* Email and pronouns */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="profile-email" className={labelClass}>
                      Email address *
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                    <p className="mt-1.5 text-[10px] text-slate-500">
                      In demo authentication, changing this may only update
                      the local profile.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="profile-pronouns" className={labelClass}>
                      Pronouns
                    </label>
                    <select
                      id="profile-pronouns"
                      value={form.pronouns}
                      onChange={(e) => updateField('pronouns', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="she/her">She / her</option>
                      <option value="he/him">He / him</option>
                      <option value="they/them">They / them</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Location and website */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="profile-location" className={labelClass}>
                      Location
                    </label>
                    <input
                      id="profile-location"
                      autoComplete="address-level2"
                      maxLength={100}
                      value={form.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="City, country"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-website" className={labelClass}>
                      Website / portfolio
                    </label>
                    <input
                      id="profile-website"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      maxLength={200}
                      value={form.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="yourportfolio.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label htmlFor="profile-bio" className={labelClass + ' mb-0'}>
                      Bio / about me
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {form.bio.length}/200
                    </span>
                  </div>
                  <textarea
                    id="profile-bio"
                    rows={4}
                    maxLength={200}
                    value={form.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    placeholder="Tell people a little about yourself..."
                    className={inputClass + ' resize-y'}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                  <h3 className="text-sm font-semibold text-amber-200">
                    Password and sign-in security
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-300">
                    This project currently uses its existing authentication
                    context. A real password change must be implemented by the
                    authentication provider; changing profile fields here does
                    not change your password.
                  </p>
                  <button
                    type="button"
                    disabled
                    title="Requires a real authentication provider"
                    className="mt-3 cursor-not-allowed rounded-xl border border-[#12345C] bg-[#07152B] px-4 py-2 text-xs font-semibold text-slate-500"
                  >
                    Change password unavailable
                  </button>
                </div>

                <div className="rounded-2xl border border-[#12345C]/70 bg-[#07152B]/70 p-4">
                  <h3 className="text-sm font-semibold text-slate-100">
                    Discard unsaved edits
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Restore the form to the last saved profile values. This
                    does not delete your account or saved designs.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-3 rounded-xl border border-[#12345C] bg-[#0B1D3A] px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-purple-500/50 hover:text-white"
                  >
                    Reset unsaved changes
                  </button>
                </div>

                <div className="rounded-2xl border border-rose-800/40 bg-rose-950/20 p-4">
                  <h3 className="text-sm font-semibold text-rose-200">
                    Account deletion
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Account deletion is intentionally not included here.
                    Removing a local profile is not the same as securely
                    deleting an authenticated account and its data.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <footer className="flex flex-col gap-3 border-t border-[#12345C]/70 bg-[#07152B]/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  hasChanges ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              <span className="text-slate-400">
                {hasChanges ? 'Unsaved changes' : 'All changes saved'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={requestClose}
                disabled={isSaving}
                className="rounded-xl border border-[#12345C] bg-[#07152B] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-[#12345C]/50 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.25)] transition hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckIcon size={14} />
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
};
