import React from 'react';
import { SHARK_HATS } from '../utils/constants';
import { Sparkles, Check, Lock } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface WardrobeModalProps {
  totalVeggies: number;
  activeHat: string;
  onSelectHat: (hatId: string) => void;
  onClose: () => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  totalVeggies,
  activeHat,
  onSelectHat,
  onClose,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Shark Wardrobe & Hats
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Unlock stylish headwear by chomping more veggies in the arcade!
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Veggies Munched</div>
          <div className="font-mono-nums text-xl font-bold text-emerald-400">
            🥗 {totalVeggies}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
        {SHARK_HATS.map((hat) => {
          const isUnlocked = totalVeggies >= hat.requiredVeggies;
          const isEquipped = activeHat === hat.id;
          const remaining = hat.requiredVeggies - totalVeggies;

          return (
            <div
              key={hat.id}
              className={`p-4 rounded-2xl border transition-all ${
                isEquipped
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                  : isUnlocked
                  ? 'bg-slate-900/80 border-slate-700/60 hover:border-slate-600'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl shadow-inner">
                    {hat.icon}
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-base">
                      {hat.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {hat.description}
                    </div>
                  </div>
                </div>

                <div>
                  {isEquipped ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5" />
                      Worn
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playButtonClick();
                        onSelectHat(hat.id);
                      }}
                      className="text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Wear
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono-nums bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      <Lock className="w-3 h-3" />
                      {remaining} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl cursor-pointer border border-slate-700 transition-colors"
        >
          Back to Game
        </button>
      </div>
    </div>
  );
};
