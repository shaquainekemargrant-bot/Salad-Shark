import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Trash2, Check, AlertTriangle, RotateCcw, Gift, Coins, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface SettingsModalProps {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
  redeemedCodes: string[];
  onToggleBgm: () => void;
  onToggleSfx: () => void;
  onChangeBgmVolume: (vol: number) => void;
  onChangeSfxVolume: (vol: number) => void;
  onWipeData: () => void;
  onRedeemCode: (code: string) => { success: boolean; message: string; coins?: number };
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  bgmEnabled,
  sfxEnabled,
  bgmVolume,
  sfxVolume,
  redeemedCodes,
  onToggleBgm,
  onToggleSfx,
  onChangeBgmVolume,
  onChangeSfxVolume,
  onWipeData,
  onRedeemCode,
  onClose,
}) => {
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [wipedSuccess, setWipedSuccess] = useState(false);

  // Secret promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [codeFeedback, setCodeFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  const handleConfirmWipe = () => {
    soundEngine.playMeatHit();
    onWipeData();
    setShowWipeConfirm(false);
    setWipedSuccess(true);
    setTimeout(() => setWipedSuccess(false), 3000);
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCodeInput.trim();
    if (!cleanCode) return;

    const result = onRedeemCode(cleanCode);
    if (result.success) {
      soundEngine.playCodeRedeemSuccess();
      setCodeFeedback({
        isSuccess: true,
        text: result.message,
      });
      setPromoCodeInput('');
    } else {
      soundEngine.playMeatHit();
      setCodeFeedback({
        isSuccess: false,
        text: result.message,
      });
    }

    setTimeout(() => {
      setCodeFeedback(null);
    }, 4500);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            Settings & Promo Codes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure audio levels, redeem secret game codes, or manage local data.
          </p>
        </div>
      </div>

      {/* Settings Group 1: Background Music (BGM) */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-semibold text-white text-base">
                Background Music (Audio)
              </div>
              <div className="text-xs text-slate-400">
                Frenetic arcade chiptune soundtrack
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onToggleBgm();
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              bgmEnabled
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {bgmEnabled ? 'Enabled' : 'Muted'}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-slate-400 w-12 font-mono-nums">
            {Math.round(bgmVolume * 100)}%
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={!bgmEnabled}
            value={bgmVolume}
            onChange={(e) => onChangeBgmVolume(parseFloat(e.target.value))}
            className="flex-1 accent-emerald-400 cursor-pointer disabled:opacity-40"
          />
        </div>
      </div>

      {/* Settings Group 2: Sound Effects (SFX) */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-semibold text-white text-base">
                Sound Effects (SFX)
              </div>
              <div className="text-xs text-slate-400">
                Veggie crunches, meat splats & fanfares
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onToggleSfx();
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              sfxEnabled
                ? 'bg-teal-500 text-slate-950 hover:bg-teal-400'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {sfxEnabled ? 'Enabled' : 'Muted'}
          </button>
        </div>

        {/* SFX Volume Slider */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-slate-400 w-12 font-mono-nums">
            {Math.round(sfxVolume * 100)}%
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={!sfxEnabled}
            value={sfxVolume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChangeSfxVolume(val);
            }}
            onMouseUp={() => soundEngine.playVeggieMunch('lettuce')}
            onTouchEnd={() => soundEngine.playVeggieMunch('lettuce')}
            className="flex-1 accent-teal-400 cursor-pointer disabled:opacity-40"
          />
        </div>
      </div>

      {/* Settings Group 3: Secret Promo Codes Redemption (UPDATE 1!) */}
      <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-500/30 mb-4">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-semibold text-amber-300 text-base flex items-center gap-2">
              <span>Redeem Secret Codes</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                2 NEW CODES!
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Enter promotional codes for free bonus Coral Coins
            </div>
          </div>
        </div>

        {/* Code Input Form */}
        <form onSubmit={handleRedeemSubmit} className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Enter code (e.g. UPDATE1)"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 font-mono uppercase tracking-wider"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-black text-sm rounded-xl cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4" />
            <span>Redeem</span>
          </button>
        </form>

        {/* Feedback Message */}
        {codeFeedback && (
          <div
            className={`mt-2.5 p-2 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
              codeFeedback.isSuccess
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
            }`}
          >
            {codeFeedback.isSuccess ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span className="font-medium">{codeFeedback.text}</span>
          </div>
        )}

        {/* Hint Pill list of Update 1 codes */}
        <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400 font-semibold">Active Codes:</span>
          {['UPDATE1', 'SharkSalad'].map((c) => {
            const isRedeemed = redeemedCodes.includes(c.toUpperCase());
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setPromoCodeInput(c);
                  soundEngine.playButtonClick();
                }}
                className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                  isRedeemed
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 line-through opacity-70'
                    : 'bg-slate-900 border-amber-500/40 text-amber-300 hover:bg-amber-950/40 cursor-pointer'
                }`}
                title={isRedeemed ? 'Already redeemed' : 'Click to autofill'}
              >
                <span>{c}</span>
                {isRedeemed ? (
                  <span className="text-[9px] text-emerald-400 no-underline font-sans">✓ USED</span>
                ) : (
                  <span className="text-[9px] text-amber-400 font-sans">
                    {c === 'UPDATE1' ? '+500' : '+150'}🪙
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Group 4: Wipe Data / Reset Game */}
      <div className="p-4 bg-rose-950/20 rounded-2xl border border-rose-500/30 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-semibold text-rose-200 text-base">
                Wipe Data
              </div>
              <div className="text-xs text-slate-400">
                Clear high scores, coins, unlocked skins, and stats
              </div>
            </div>
          </div>

          {!showWipeConfirm && !wipedSuccess && (
            <button
              onClick={() => setShowWipeConfirm(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded-lg cursor-pointer transition-colors shrink-0"
            >
              Wipe Data
            </button>
          )}
        </div>

        {/* Wipe Confirmation Prompt */}
        {showWipeConfirm && (
          <div className="mt-4 pt-4 border-t border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Are you sure? This cannot be undone.</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setShowWipeConfirm(false)}
                className="px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-md cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWipe}
                className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md cursor-pointer transition-colors"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        )}

        {wipedSuccess && (
          <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-fade-in">
            <Check className="w-4 h-4" />
            <span>All local game data has been wiped clean!</span>
          </div>
        )}
      </div>

      {/* Done / Close Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="px-8 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl cursor-pointer border border-slate-700 transition-colors"
        >
          Close Settings
        </button>
      </div>
    </div>
  );
};
