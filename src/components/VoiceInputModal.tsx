import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Check,
  Sparkles,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface VoiceInputModalProps {
  onClose: () => void;
  onAddIngredients: (items: string[]) => void;
  language: SupportedLanguage;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  onClose,
  onAddIngredients,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [extractedList, setExtractedList] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Voice recognition is not supported in this browser. You can type ingredients directly.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'ar' ? 'ar-SA' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg(null);
    };

    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript + ' ';
      }
      setTranscript(current.trim());
      parseIngredients(current.trim());
    };

    recognition.onerror = (e: any) => {
      console.warn('Speech recognition error:', e);
      if (e.error === 'not-allowed') {
        setErrorMsg('Microphone access was denied. Please allow microphone permissions.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.warn(e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [language]);

  const parseIngredients = (text: string) => {
    // Split by commas, "and", "plus", or pauses
    const tokens = text
      .split(/,| and | plus | with |\n/gi)
      .map((item) => item.trim())
      .filter((item) => item.length > 1);
    setExtractedList(tokens);
  };

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {}
    }
  };

  const handleAdd = () => {
    if (extractedList.length > 0) {
      onAddIngredients(extractedList);
    } else if (transcript.trim()) {
      onAddIngredients([transcript.trim()]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F6B93B]/20 text-amber-700 dark:text-amber-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {t.voiceInput}
              </h3>
              <p className="text-xs text-stone-500">
                Say what's in your fridge naturally (e.g. "Three eggs, cheddar cheese, baby spinach")
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6">
          {/* Animated Mic Button */}
          <div className="relative inline-block mx-auto">
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full bg-[#E4572E] opacity-25 animate-ping" />
                <span className="absolute -inset-2 rounded-full bg-[#E4572E] opacity-15 animate-pulse" />
              </>
            )}
            <button
              onClick={toggleListen}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                isListening
                  ? 'bg-[#E4572E] text-white scale-105'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
            </button>
          </div>

          <div className="text-xs font-semibold text-stone-500">
            {isListening ? (
              <span className="text-[#E4572E] animate-pulse">
                Listening... Speak your ingredients now
              </span>
            ) : (
              <span>Tap microphone to start speaking</span>
            )}
          </div>

          {/* Transcript Box */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 min-h-20 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Spoken Transcript:
            </span>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-200 italic">
              {transcript || 'Say something like: "I have 4 eggs, some pasta, garlic, and cherry tomatoes"...'}
            </p>
          </div>

          {/* Extracted Chips */}
          {extractedList.length > 0 && (
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4C9F70] block mb-2">
                Recognized Ingredients ({extractedList.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {extractedList.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={extractedList.length === 0 && !transcript.trim()}
            className="px-5 py-2.5 bg-[#E4572E] hover:bg-[#d04922] disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Add to Kitchen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
