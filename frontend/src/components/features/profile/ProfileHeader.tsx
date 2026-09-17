import React from 'react';
import { User } from '../../../types/user';
import { Avatar } from '../../common/Avatar';
import { Button } from '../../common/Button';

interface ProfileHeaderProps {
  user: User;
  onEditClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick }) => {
  const isImageCover = user.cover_image?.startsWith('http') || user.cover_image?.startsWith('data:');
  const coverStyle = isImageCover
    ? { backgroundImage: `url("${user.cover_image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: user.cover_image || 'linear-gradient(135deg, #00D285 0%, #059669 50%, #064E3B 100%)' };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Cover Gradient / Image Banner */}
      <div
        className="h-44 sm:h-56 w-full relative transition-all"
        style={coverStyle}
      >
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px]" />
        
        {/* Quick upload / change banner button */}
        <button
          type="button"
          onClick={onEditClick}
          className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
        >
          <i className="fa-solid fa-arrow-up-from-bracket text-xs text-[#00D285]" />
          <span>Upload / Change Banner</span>
        </button>
      </div>

      {/* Profile Details Container */}
      <div className="px-6 sm:px-8 pb-8 pt-0 relative">
        {/* Top Row: ONLY Avatar gets negative margin to overlap banner. Edit button sits on the right */}
        <div className="flex items-end justify-between mb-4">
          {/* Avatar with Camera Badge */}
          <div className="-mt-16 sm:-mt-20 relative shrink-0">
            <Avatar
              name={user.full_name}
              src={user.profile_image}
              size="2xl"
              className="ring-4 ring-white dark:ring-slate-900 shadow-2xl rounded-full bg-white dark:bg-slate-900"
            />
            <button
              type="button"
              onClick={onEditClick}
              title="Upload / Change Profile Photo"
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#00D285] hover:bg-[#00BA76] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all text-xs border-2 border-white dark:border-slate-900 font-bold z-10"
            >
              <i className="fa-solid fa-camera" />
            </button>
          </div>

          {/* Edit Profile Action Button */}
          <div className="pt-3">
            <Button
              onClick={onEditClick}
              variant="secondary"
              size="md"
              className="!rounded-2xl !bg-[#00D285]/15 !text-[#00D285] hover:!bg-[#00D285] hover:!text-white !border !border-[#00D285]/30 font-bold transition-all shadow-sm shrink-0"
            >
              <i className="fa-solid fa-pen-to-square mr-2 text-xs" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* User Info Block: 100% on the card background, NEVER in the banner */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {user.full_name}
            </h1>
            {user.is_verified && (
              <span
                title="Verified Peer Mentor"
                className="inline-flex items-center gap-1.5 text-[#00D285] text-xs font-bold bg-[#00D285]/10 px-3 py-1 rounded-full border border-[#00D285]/25 shadow-xs"
              >
                <i className="fa-solid fa-circle-check text-xs" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Headline / Title */}
          {user.headline ? (
            <p className="text-sm font-semibold text-[#00D285]">
              {user.headline}
            </p>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Passionate Peer Mentor & Skill Explorer
            </p>
          )}

          {/* Meta information row: Email, Location, Phone */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-envelope text-slate-400 text-xs" />
              {user.email}
            </span>

            {user.location && (
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-[#00D285] text-xs" />
                {user.location}
              </span>
            )}

            {user.phone && (
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-phone text-[#00D285] text-xs" />
                {user.phone}
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-6">
          {user.bio || 'Passionate skill exchange participant. Eager to collaborate, teach my expertise, and explore new learning opportunities!'}
        </p>

        {/* Social & Professional Links (if provided) */}
        {(user.website || user.github || user.linkedin) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-slate-400 mr-1">Connect:</span>
            {user.website && (
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-[#00D285] dark:hover:text-[#00D285] border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <i className="fa-solid fa-globe text-xs" />
                <span>Portfolio</span>
              </a>
            )}
            {user.github && (
              <a
                href={user.github.startsWith('http') ? user.github : `https://${user.github}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-[#00D285] dark:hover:text-[#00D285] border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <i className="fa-brands fa-github text-xs" />
                <span>GitHub</span>
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-[#00D285] dark:hover:text-[#00D285] border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <i className="fa-brands fa-linkedin text-xs text-blue-500" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        )}

        {/* Reputation & Joined Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 font-bold">
            <i className="fa-solid fa-star text-amber-400" />
            <span>{typeof user.rating === 'number' ? user.rating.toFixed(1) : '5.0'} Rating</span>
            <span className="text-slate-400 font-normal">({user.review_count ?? 0} {user.review_count === 1 ? 'review' : 'reviews'})</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 font-medium">
            <i className="fa-solid fa-calendar-days text-[#00D285]" />
            <span>Member since {user.created_at ? new Date(user.created_at).toLocaleDateString([], { month: 'short', year: 'numeric' }) : '2026'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
