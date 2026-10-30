import React from 'react';
import {
  ChefHat,
  Refrigerator,
  ShoppingBag,
  Calendar,
  Bookmark,
  Sun,
  Moon,
  Globe,
  User,
} from 'lucide-react';
import { SavoraLogo } from './SavoraLogo';
import { SupportedLanguage, UserProfile } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

export type ActiveTab = 'cook' | 'kitchen' | 'shopping' | 'planner' | 'favorites';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  shoppingCount: number;
  profile: UserProfile;
  onOpenProfile: () => void;
  expiringCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  language,
  onChangeLanguage,
  theme,
  onToggleTheme,
  shoppingCount,
  profile,
  onOpenProfile,
  expiringCount,
}) => {
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'cook' as ActiveTab, label: 'Cook', icon: ChefHat },
    {
      id: 'kitchen' as ActiveTab,
      label: t.myKitchen,
      icon: Refrigerator,
      badge: expiringCount > 0 ? expiringCount : undefined,
      badgeColor: 'bg-[#E4572E]',
    },
    {
      id: 'shopping' as ActiveTab,
      label: t.shoppingList,
      icon: ShoppingBag,
      badge: shoppingCount > 0 ? shoppingCount : undefined,
      badgeColor: 'bg-[#4C9F70]',
    },
    { id: 'planner' as ActiveTab, label: t.planner, icon: Calendar },
    { id: 'favorites' as ActiveTab, label: t.favorites, icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFF8F0]/90 dark:bg-stone-950/90 border-b border-[#E4572E]/10 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <button
            onClick={() => onSelectTab('cook')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E] rounded-xl p-1"
          >
            <SavoraLogo size="md" />
            <span className="hidden md:inline-block text-xs text-stone-500 dark:text-stone-400 font-serif italic border-l border-stone-300 dark:border-stone-700 pl-3">
              "{t.tagline}"
            </span>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-200/60 dark:bg-stone-900/80 p-1.5 rounded-full border border-stone-300/40 dark:border-stone-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none ${
                    isActive
                      ? 'bg-white dark:bg-stone-800 text-[#E4572E] shadow-sm font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:text-[#E4572E] dark:hover:text-[#E4572E] hover:bg-white/40 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E4572E]' : 'text-stone-500 dark:text-stone-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold text-white rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-[#E4572E]/40"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#4C9F70]" />
                <span className="uppercase">{language}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-32 py-1 bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 hidden group-hover:block z-50">
                <button
                  onClick={() => onChangeLanguage('en')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 ${language === 'en' ? 'text-[#E4572E] font-bold' : ''}`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => onChangeLanguage('es')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 ${language === 'es' ? 'text-[#E4572E] font-bold' : ''}`}
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => onChangeLanguage('fr')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 ${language === 'fr' ? 'text-[#E4572E] font-bold' : ''}`}
                >
                  🇫🇷 Français
                </button>
                <button
                  onClick={() => onChangeLanguage('ar')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 ${language === 'ar' ? 'text-[#E4572E] font-bold' : ''}`}
                >
                  🇸🇦 العربية (RTL)
                </button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F6B93B]" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/70 hover:border-[#E4572E]/50 transition-all text-xs font-medium text-stone-700 dark:text-stone-300"
            >
              <div className="w-6 h-6 rounded-full bg-[#E4572E] text-white flex items-center justify-center text-[11px] font-bold">
                {profile.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-sans">{profile.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for Native Mobile App Feel */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF8F0]/95 dark:bg-stone-950/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 pb-safe">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
                  isActive ? 'text-[#E4572E]' : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-[#E4572E]' : ''}`} />
                  {item.badge !== undefined && (
                    <span
                      className={`absolute -top-1.5 -right-2 min-w-4 h-4 px-1 text-[9px] font-bold text-white rounded-full flex items-center justify-center ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium truncate max-w-[62px] ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
