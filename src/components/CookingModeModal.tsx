import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Volume2,
  Eye,
  Sparkles,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface CookingModeModalProps {
  recipe: Recipe;
  servings: number;
  onClose: () => void;
  onFinishCooking: (rating?: number, notes?: string) => void;
  language: SupportedLanguage;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  servings,
  onClose,
  onFinishCooking,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');

  const wakeLockSentinelRef = useRef<any>(null);
  const currentStep = recipe.steps[currentStepIndex];
  const totalSteps = recipe.steps.length;

  // Initialize timer when step changes
  useEffect(() => {
    if (currentStep?.timerRequired && currentStep.timerSeconds) {
      setTimerSecondsLeft(currentStep.timerSeconds);
    } else {
      setTimerSecondsLeft(0);
    }
    setTimerActive(false);
  }, [currentStepIndex, currentStep]);

  // Timer interval countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            playChime();
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSecondsLeft]);

  // Audio Chime using Web Audio API (safe, no external mp3 needed)
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio chime unsupported:', e);
    }
  };

  // Screen Wake Lock API
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockSentinelRef.current = await (navigator as any).wakeLock.request('screen');
          setWakeLockActive(true);
        }
      } catch (err) {
        console.warn('Wake lock error:', err);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLockSentinelRef.current) {
        wakeLockSentinelRef.current.release();
        wakeLockSentinelRef.current = null;
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        setCurrentStepIndex((prev) => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, totalSteps, onClose]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all steps!
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E4572E', '#4C9F70', '#F6B93B', '#2B2B2B'],
        });
      } catch (e) {}
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-xl text-stone-100 flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
      {/* Top Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#E4572E] animate-pulse" />
          <div>
            <span className="text-xs uppercase tracking-widest text-[#F6B93B] font-bold">
              {t.cookingModeTitle}
            </span>
            <h2 className="text-sm sm:text-base font-serif font-bold text-stone-200 truncate max-w-[240px] sm:max-w-md">
              {recipe.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {wakeLockActive && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium"
              title="Screen will stay awake while you cook"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Screen Awake</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            title="Exit cooking mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl w-full mx-auto my-4">
        <div className="flex items-center justify-between text-xs text-stone-400 font-semibold mb-2">
          <span>
            {t.step} {currentStepIndex + 1} {t.of} {totalSteps}
          </span>
          <span>{Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden flex">
          {recipe.steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx <= currentStepIndex ? 'bg-[#E4572E]' : 'bg-transparent'
              } ${idx < currentStepIndex ? 'border-r border-stone-900' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Main Center Content */}
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center items-center text-center my-6">
        {!isCompleted ? (
          <div className="space-y-6 w-full px-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E4572E]/20 text-[#E4572E] text-xs sm:text-sm font-bold uppercase tracking-wider">
              {currentStep.title || `${t.step} ${currentStep.number}`}
            </span>

            {/* Large Step Text */}
            <p className="text-2xl sm:text-4xl font-serif font-medium leading-relaxed sm:leading-snug text-stone-50 max-w-2xl mx-auto selection:bg-[#E4572E]">
              {currentStep.instruction}
            </p>

            {/* Countdown Timer (if step has timer) */}
            {currentStep.timerRequired && (
              <div className="pt-4 flex flex-col items-center">
                <div className="inline-flex flex-col items-center p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl">
                  <span className="text-xs font-semibold text-stone-400 mb-1 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#F6B93B]" />
                    <span>Active Step Timer</span>
                  </span>
                  <div
                    className={`font-mono text-5xl sm:text-6xl font-black tracking-tight my-2 ${
                      timerSecondsLeft <= 10 && timerSecondsLeft > 0
                        ? 'text-red-400 animate-pulse'
                        : timerSecondsLeft === 0
                        ? 'text-[#4C9F70]'
                        : 'text-stone-100'
                    }`}
                  >
                    {formatTimer(timerSecondsLeft)}
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => setTimerActive(!timerActive)}
                      className={`px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${
                        timerActive
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-[#4C9F70] hover:bg-emerald-500 text-white shadow-lg shadow-[#4C9F70]/30'
                      }`}
                    >
                      {timerActive ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Start Timer</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTimerActive(false);
                        setTimerSecondsLeft(currentStep.timerSeconds || 180);
                      }}
                      className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200"
                      title="Reset timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Completion Screen */
          <div className="max-w-lg w-full bg-stone-900/90 rounded-3xl p-6 sm:p-8 border border-stone-800 text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-[#4C9F70]/20 text-[#4C9F70] flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-[#F6B93B]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {t.finishCooking}
            </h3>
            <p className="text-sm text-stone-300">
              You just cooked <span className="font-semibold text-[#F6B93B]">{recipe.name}</span> with what you had!
            </p>

            {/* Star Rating */}
            <div className="pt-2">
              <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-2">
                Rate this recipe:
              </span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-[#F6B93B] text-[#F6B93B]'
                          : 'text-stone-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Chef Notes */}
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Personal notes (e.g. Added extra garlic, needed 2 mins less...)"
                rows={2}
                className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E4572E]"
              />
            </div>

            <button
              onClick={() => onFinishCooking(rating, notes)}
              className="w-full py-3.5 bg-[#E4572E] hover:bg-[#d04922] text-white rounded-2xl font-bold text-sm shadow-xl transition-all"
            >
              Save to Cooking History & Exit
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {!isCompleted && (
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between pt-4 border-t border-stone-800/80">
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-800/80 hover:bg-stone-700 disabled:opacity-30 text-stone-200 font-medium text-sm transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.prevStep}</span>
          </button>

          <span className="text-xs text-stone-400 font-sans hidden sm:inline">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px]">→</kbd> to navigate
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#E4572E] hover:bg-[#d04922] text-white font-bold text-sm shadow-lg shadow-[#E4572E]/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>{currentStepIndex === totalSteps - 1 ? t.finishCooking : t.nextStep}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
