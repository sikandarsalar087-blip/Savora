import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Check,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface DetectedIngredient {
  name: string;
  estimatedQuantity?: string;
  category: string;
  confidence: number;
}

interface PhotoScanModalProps {
  onClose: () => void;
  onAddDetectedIngredients: (items: { name: string; quantity?: string }[]) => void;
  language: SupportedLanguage;
}

export const PhotoScanModal: React.FC<PhotoScanModalProps> = ({
  onClose,
  onAddDetectedIngredients,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedItems, setDetectedItems] = useState<DetectedIngredient[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageSrc(base64);
      scanImageWithGemini(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const scanImageWithGemini = async (base64: string, mimeType: string) => {
    setIsScanning(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/vision/detect-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
        }),
      });
      const data = await res.json();
      if (data.ingredients && data.ingredients.length > 0) {
        setDetectedItems(data.ingredients);
        // Default select all
        const sel: Record<string, boolean> = {};
        data.ingredients.forEach((item: DetectedIngredient) => {
          sel[item.name] = true;
        });
        setSelectedItems(sel);
      } else {
        setErrorMsg('No food ingredients clearly recognized. Try a closer, well-lit photo.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not analyze photo. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const toggleSelect = (name: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleAddSelected = () => {
    const toAdd = detectedItems
      .filter((i) => selectedItems[i.name])
      .map((i) => ({
        name: i.name,
        quantity: i.estimatedQuantity,
      }));
    onAddDetectedIngredients(toAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#4C9F70]/10 text-[#4C9F70]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {t.photoScan}
              </h3>
              <p className="text-xs text-stone-500">
                AI Vision automatically identifies ingredients in your fridge or pantry
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#4C9F70]/40 hover:border-[#4C9F70] rounded-3xl p-8 text-center cursor-pointer bg-[#FFF8F0]/50 dark:bg-stone-800/40 hover:bg-[#FFF8F0] transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-[#4C9F70]/10 text-[#4C9F70] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <h4 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
                Snap or Upload a Photo
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 leading-relaxed">
                Take a quick picture of your open fridge, shelf, or produce basket.
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-[#4C9F70] text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select Photo</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview image */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <img
                  src={imageSrc}
                  alt="Scanned fridge"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retake</span>
                </button>
              </div>

              {/* Scanning status */}
              {isScanning && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-[#F6B93B] mx-auto mb-1 animate-spin" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Savora AI Vision is inspecting ingredients...
                  </span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Detected Items List */}
              {detectedItems.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4C9F70]">
                      Found {detectedItems.length} ingredients:
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Uncheck any you don't want
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1">
                    {detectedItems.map((item) => {
                      const isSel = !!selectedItems[item.name];
                      return (
                        <div
                          key={item.name}
                          onClick={() => toggleSelect(item.name)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSel
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                              : 'bg-stone-50 dark:bg-stone-800 border-stone-200 opacity-50'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block truncate">
                              {item.name}
                            </span>
                            {item.estimatedQuantity && (
                              <span className="text-[10px] text-stone-500">
                                {item.estimatedQuantity}
                              </span>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-[#4C9F70] accent-[#4C9F70]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSelected}
            disabled={detectedItems.length === 0 || isScanning}
            className="px-5 py-2.5 bg-[#4C9F70] hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Add Selected to Kitchen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
