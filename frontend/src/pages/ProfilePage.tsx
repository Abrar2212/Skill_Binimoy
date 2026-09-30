import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AppLayout } from '../components/layout/AppLayout';
import { ProfileHeader } from '../components/features/profile/ProfileHeader';
import { SkillManager } from '../components/features/profile/SkillManager';
import { EditProfileModal } from '../components/features/profile/EditProfileModal';
import { ReviewsList } from '../components/features/profile/ReviewsList';
import { ProfileForumPosts } from '../components/features/profile/ProfileForumPosts';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/user';
import { Skill } from '../types/skill';

export const ProfilePage: React.FC = () => {
  const { updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    userService.getProfile()
      .then((data) => {
        setUser(data.user);
        setSkills(data.skills || []);
      })
      .catch((err) => {
        console.error('Failed to load profile details:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  useGSAP(
    () => {
      if (!loading && user) {
        gsap.from('.profile-reveal', {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power3.out',
        });
      }
    },
    { scope: containerRef, dependencies: [loading, user] }
  );

  const handleAddSkill = async (newSkill: Omit<Skill, 'id'>) => {
    const res = await userService.addSkill(newSkill);
    setSkills((prev) => [...prev, res.skill]);
    showToast(`Skill "${newSkill.skill_name}" added successfully!`);
  };

  const handleDeleteSkill = async (id: string | number) => {
    await userService.deleteSkill(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
    showToast('Skill removed from your portfolio.');
  };

  const handleSaveProfile = async (updated: Partial<User>) => {
    const res = await userService.updateProfile(updated);
    const updatedUser = res.user || { ...user, ...updated } as User;
    setUser(updatedUser);
    updateUser(updatedUser);
    showToast('Profile and photos updated successfully!');
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  if (!user && !loading) {
    return (
      <AppLayout showSidebar={false} variant="landing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fa-solid fa-circle-exclamation" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Failed to Load Profile
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            We couldn't retrieve your profile data. Please verify your connection or sign in again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full bg-[#00D285] text-slate-950 font-bold text-xs hover:bg-[#00be77] transition-all"
          >
            Reload Page
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showSidebar={false} variant="landing">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-2xl border border-slate-700 dark:border-slate-200 text-xs font-bold animate-bounce">
          <i className="fa-solid fa-circle-check text-[#00D285]" />
          <span>{successToast}</span>
        </div>
      )}

      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {loading ? (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        ) : (
          user && (
            <>
              {/* Profile Header */}
              <div className="profile-reveal">
                <ProfileHeader
                  user={user}
                  onEditClick={() => setIsEditModalOpen(true)}
                />
              </div>

              {/* Skill Manager Section */}
              <div className="profile-reveal">
                <SkillManager
                  skills={skills}
                  onAddSkill={handleAddSkill}
                  onDeleteSkill={handleDeleteSkill}
                />
              </div>

              {/* Reviews & Endorsements */}
              <div className="profile-reveal">
                <ReviewsList userId={user.id} />
              </div>

              {/* Forum Discussions & Questions */}
              <div className="profile-reveal">
                <ProfileForumPosts userId={user.id} isOwnProfile={true} />
              </div>

              {/* Complete Edit Profile Modal */}
              <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onSave={handleSaveProfile}
              />
            </>
          )
        )}
      </div>
    </AppLayout>
  );
};
