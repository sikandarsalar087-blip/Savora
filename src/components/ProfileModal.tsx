import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  Award,
  DollarSign,
  Trash2,
  Sparkles,
  LogOut,
  LogIn,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onUpdateProfile,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: name.trim() || 'Home Chef',
      email: email.trim() || 'chef@savora.kitchen',
      isGuest: false,
    });
    setIsEditing(false);
  };

  const handleSignInGoogle = () => {
    // Simulated Google OAuth login
    onUpdateProfile({
      ...profile,
      name: 'Alex Rivera',
      email: 'alex.rivera@gmail.com',
      isGuest: false,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    });
    setIsEditing(false);
  };

  const handleSwitchToGuest = () => {
    onUpdateProfile({
      ...profile,
      name: 'Guest Cook',
      email: 'guest@savora.kitchen',
      isGuest: true,
      avatarUrl: undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-[#FFF8F0] to-[#FFE8DF] dark:from-stone-900 dark:to-stone-800 border-b border-stone-200 dark:border-stone-800 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-stone-800/80 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-full bg-[#E4572E] text-white flex items-center justify-center text-2xl font-bold font-serif mx-auto shadow-lg mb-3">
            {profile.name.charAt(0)}
          </div>

          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
            {profile.name}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">{profile.email}</p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/80 dark:bg-stone-800/80 shadow-xs">
            {profile.isGuest ? (
              <span className="text-amber-600">👤 Guest Mode (Local Storage)</span>
            ) : (
              <span className="text-[#4C9F70] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Account</span>
              </span>
            )}
          </div>
        </div>

        {/* Sustainability & Kitchen Stats */}
        <div className="p-6 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2.5">
              Your Kitchen Impact
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
                <span className="text-2xl font-black text-[#4C9F70]">
                  {profile.stats.mealsCooked}
                </span>
                <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 block mt-0.5">
                  Meals Cooked
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-center">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {profile.stats.ingredientsSaved}
                </span>
                <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200 block mt-0.5">
                  Ingredients Saved
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF8F0] dark:bg-stone-800 border border-[#E4572E]/20 text-center">
                <span className="text-2xl font-black text-[#E4572E]">
                  ${profile.stats.moneySavedUsd}
                </span>
                <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 block mt-0.5">
                  Estimated $ Saved
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 text-center">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {profile.stats.wasteReducedKg} kg
                </span>
                <span className="text-[11px] font-semibold text-blue-900 dark:text-blue-200 block mt-0.5">
                  Food Waste Prevented
                </span>
              </div>
            </div>
          </div>

          {/* Account Authentication Options */}
          {profile.isGuest ? (
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Save your kitchen across devices
              </span>
              <button
                onClick={handleSignInGoogle}
                className="w-full py-3 px-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Sign in with Email</span>
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={handleSwitchToGuest}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch to Guest Mode</span>
              </button>
            </div>
          )}

          {isEditing && (
            <form onSubmit={handleSave} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-700 border border-stone-200 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-700 border border-stone-200 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4C9F70] text-white text-xs font-bold rounded-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
