import React, { useState } from 'react';
import {
  Sparkles,
  Leaf,
  ChefHat,
  ArrowRight,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { SavoraLogo } from './SavoraLogo';
import { DIETARY_OPTIONS } from '../data/commonIngredients';

interface OnboardingModalProps {
  onComplete: (selectedDietary: string[]) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const toggleDiet = (id: string) => {
    setSelectedDietary((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 text-center flex flex-col justify-between min-h-[460px]">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-[#E4572E]'
                  : s < step
                  ? 'w-4 bg-[#4C9F70]'
                  : 'w-4 bg-stone-200 dark:bg-stone-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome & Mission */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <SavoraLogo size="lg" className="mx-auto" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#E4572E] block">
              Welcome to Savora
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-50 leading-tight">
              Cook with what you have.
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
              No more opening the fridge and feeling stuck. Tell Savora what's on your shelves, and get realistic chef-quality recipes in seconds.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="p-3 rounded-2xl bg-[#FFF8F0] dark:bg-stone-800 border border-[#E4572E]/10">
                <span className="text-xl block mb-1">⏱️</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">Fast</span>
                <span className="text-[10px] text-stone-500">Under 30 mins</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-stone-800 border border-emerald-200/40">
                <span className="text-xl block mb-1">🌱</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">Zero Waste</span>
                <span className="text-[10px] text-stone-500">Save food & $</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-200/40">
                <span className="text-xl block mb-1">👨‍🍳</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">Step Timers</span>
                <span className="text-[10px] text-stone-500">Guided mode</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dietary Preferences */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#4C9F70]/10 text-[#4C9F70] flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-50">
              Any dietary preferences?
            </h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We'll tailor every recipe recommendation to match your lifestyle. You can always change this later.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 text-left">
              {DIETARY_OPTIONS.map((item) => {
                const isSelected = selectedDietary.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleDiet(item.id)}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#4C9F70] text-white border-[#4C9F70] shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#4C9F70]'
                    }`}
                  >
                    <span>
                      {item.icon} {item.label}
                    </span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Kitchen Ready */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#F6B93B]/20 text-[#E4572E] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-50">
              You're all set to cook!
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
              We loaded your kitchen with a few sample staples (eggs, tomatoes, rice, spinach) so you can start cooking right away. You can also snap a photo of your fridge anytime!
            </p>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-900 dark:text-amber-200 text-left">
              💡 <strong>Pro Tip:</strong> Turn on "Cooking Mode" when you're in front of the stove. It keeps your phone awake with large text so you never miss a step.
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            >
              Back
            </button>
          ) : (
            <button
              onClick={() => onComplete(selectedDietary)}
              className="text-xs font-semibold text-stone-400 hover:text-stone-600"
            >
              Skip
            </button>
          )}

          <button
            onClick={() => {
              if (step < 3) {
                setStep((s) => s + 1);
              } else {
                onComplete(selectedDietary);
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E4572E] hover:bg-[#d04922] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#E4572E]/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>{step === 3 ? "Let's Cook!" : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
