import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Avatar } from '../../common/Avatar';
import { User } from '../../../types/user';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updated: Partial<User>) => Promise<void>;
}

// Preset cover gradients/styles
const COVER_PRESETS = [
  { id: 'emerald', name: 'Emerald Aura', value: 'linear-gradient(135deg, #00D285 0%, #059669 50%, #064E3B 100%)' },
  { id: 'ocean', name: 'Deep Ocean', value: 'linear-gradient(135deg, #0284c7 0%, #1e40af 50%, #0f172a 100%)' },
  { id: 'sunset', name: 'Sunset Glow', value: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #7c3aed 100%)' },
  { id: 'cyber', name: 'Cyber Slate', value: 'linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  // Form fields
  const [fullName, setFullName] = useState(user.full_name || '');
  const [headline, setHeadline] = useState(user.headline || '');
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [website, setWebsite] = useState(user.website || '');
  const [github, setGithub] = useState(user.github || '');
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  
  // Images (Avatar & Banner)
  const [profileImage, setProfileImage] = useState<string | null>(user.profile_image || null);
  const [coverImage, setCoverImage] = useState<string | null>(user.cover_image || COVER_PRESETS[0].value);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever user prop updates or modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName(user.full_name || '');
      setHeadline(user.headline || '');
      setBio(user.bio || '');
      setLocation(user.location || '');
      setPhone(user.phone || '');
      setWebsite(user.website || '');
      setGithub(user.github || '');
      setLinkedin(user.linkedin || '');
      setProfileImage(user.profile_image || null);
      setCoverImage(user.cover_image || COVER_PRESETS[0].value);
      setErrorMessage(null);
    }
  }, [isOpen, user]);

  // Client-side image compressor: resize image to max dimension & convert to crisp JPEG data URL
  const processImageFile = (file: File, maxDim = 600, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Please select a valid image file (JPG, PNG, WebP).'));
      }
      if (file.size > 10 * 1024 * 1024) {
        return reject(new Error('Image file is larger than 10MB. Please choose a smaller photo.'));
      }

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Scale down proportionally
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(readerEvent.target?.result as string);
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to decode image file.'));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  };

  // Handle avatar file selection
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    try {
      const dataUrl = await processImageFile(file, 400, 0.85);
      setProfileImage(dataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process avatar photo');
    }
  };

  // Handle banner file selection
  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    try {
      // Banner: allow wider aspect ratio up to 1200px width
      const dataUrl = await processImageFile(file, 1200, 0.82);
      setCoverImage(dataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process banner image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      await onSave({
        full_name: fullName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim(),
        phone: phone.trim(),
        website: website.trim(),
        github: github.trim(),
        linkedin: linkedin.trim(),
        profile_image: profileImage,
        cover_image: coverImage,
      });
      onClose();
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorMessage(err?.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCoverAnImage = coverImage?.startsWith('http') || coverImage?.startsWith('data:');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile & Visuals"
      description="Upload your personal photo, custom banner, and update your skill identity"
      maxWidth="lg"
    >
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-sm" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ======================================================== */}
        {/* 1. CLEAN BANNER PREVIEW & UPLOAD */}
        {/* ======================================================== */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Cover Banner
          </label>
          
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm">
            {/* Banner Preview Area */}
            <div
              className="h-32 sm:h-40 w-full relative transition-all flex items-start justify-between p-3.5"
              style={{
                background: isCoverAnImage
                  ? `url("${coverImage}") center/cover no-repeat`
                  : (coverImage || COVER_PRESETS[0].value),
              }}
            >
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />

              {/* Hidden file input for banner */}
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerFileChange}
                className="hidden"
              />

              <span className="relative z-10 text-[11px] font-bold text-white/90 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/15">
                Banner Preview
              </span>

              {/* Banner Action Buttons */}
              <div className="relative z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/25 shadow-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <i className="fa-solid fa-arrow-up-from-bracket text-xs text-[#00D285]" />
                  <span>Upload Banner</span>
                </button>

                {isCoverAnImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage(COVER_PRESETS[0].value)}
                    className="px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-rose-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all"
                    title="Reset to default gradient"
                  >
                    <i className="fa-solid fa-rotate-left" />
                  </button>
                )}
              </div>
            </div>

            {/* Gradient Theme Swatches Bar */}
            <div className="px-4 py-2.5 bg-white dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Or choose a gradient theme:
              </span>
              <div className="flex items-center gap-2">
                {COVER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setCoverImage(preset.value)}
                    title={`Apply ${preset.name}`}
                    className={`w-7 h-7 rounded-lg shadow-sm border transition-all ${
                      coverImage === preset.value
                        ? 'ring-2 ring-[#00D285] scale-110 border-white'
                        : 'border-white/40 opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ background: preset.value }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. DEDICATED PROFILE PHOTO CARD (NO COLLIDING OVERLAYS) */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center gap-5">
          {/* Avatar Preview with Camera Trigger */}
          <div className="relative shrink-0">
            <Avatar
              name={fullName || 'User'}
              src={profileImage}
              size="xl"
              className="ring-4 ring-white dark:ring-slate-800 shadow-lg rounded-full"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              title="Upload Profile Photo"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00D285] hover:bg-[#00BA76] text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all text-xs border-2 border-white dark:border-slate-900 font-bold z-10"
            >
              <i className="fa-solid fa-camera" />
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFileChange}
            className="hidden"
          />

          {/* Photo Controls */}
          <div className="space-y-1.5 flex-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile Photo</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload a clear photo or avatar (JPG, PNG, WebP up to 10MB).
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="px-4 py-1.5 rounded-xl bg-[#00D285] hover:bg-[#00BA76] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <i className="fa-solid fa-upload text-[11px]" />
                <span>Choose Photo</span>
              </button>

              {profileImage && (
                <button
                  type="button"
                  onClick={() => setProfileImage(null)}
                  className="px-3 py-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-semibold transition-all"
                >
                  <i className="fa-solid fa-trash-can mr-1 text-[11px]" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. PERSONAL DETAILS & BIO */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Professional Headline / Title
              </label>
              <div className="relative">
                <i className="fa-solid fa-briefcase absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer & React Mentor"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Location (City, Country)
              </label>
              <div className="relative">
                <i className="fa-solid fa-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <i className="fa-solid fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +880 1712 345678"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                About Me / Bio
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                {bio.length}/500 chars
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other members what you love building, your teaching philosophy, and what you're excited to learn..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 leading-relaxed resize-none font-medium"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. SOCIAL & PORTFOLIO PROFILES */}
        {/* ======================================================== */}
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <i className="fa-solid fa-share-nodes text-[#00D285]" />
            <span>Portfolios & Social Links</span>
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Website / Portfolio
              </label>
              <div className="relative">
                <i className="fa-solid fa-globe absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://portfolio.me"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-2.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                GitHub Handle / Link
              </label>
              <div className="relative">
                <i className="fa-brands fa-github absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-2.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                LinkedIn Handle / Link
              </label>
              <div className="relative">
                <i className="fa-brands fa-linkedin absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-2.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClose}
            className="text-slate-600 dark:text-slate-400 font-semibold"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={loading}
            className="!bg-[#00D285] hover:!bg-[#00BA76] !text-white font-bold px-6 shadow-lg shadow-[#00D285]/25 !rounded-xl"
          >
            <i className="fa-solid fa-check mr-2 text-xs" />
            Save Profile & Photos
          </Button>
        </div>
      </form>
    </Modal>
  );
};
