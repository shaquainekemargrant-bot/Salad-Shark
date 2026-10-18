import React from 'react';
import { Heart, Sparkles, MoveHorizontal, Zap, ArrowUp, Shield, Compass, ShoppingBag, Gift, Coins } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface RulesGuideProps {
  onClose: () => void;
  onStartGame: () => void;
}

export const RulesGuide: React.FC<RulesGuideProps> = ({ onClose, onStartGame }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 max-h-[85vh] overflow-y-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              How to Play Salad Shark
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              UPDATE 1
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Steer your shark, leap to catch items, trigger dual abilities, and journey across 3 ocean realms!
          </p>
        </div>
      </div>

      {/* Control Mechanics (Movement, Leaping & Abilities) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
              <MoveHorizontal className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-white text-xs">
              1. Steer Shark
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Drag your finger across the screen or use <strong>A / D / Arrow Keys</strong>.
          </p>
        </div>

        <div className="p-3.5 bg-sky-950/40 rounded-2xl border border-sky-500/30 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-sky-500/20 rounded-xl border border-sky-500/30 text-sky-300 shrink-0">
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-display font-bold text-sky-200 text-xs">
              2. Leap High! 🚀
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Tap the <strong>LEAP</strong> button or press <strong>Spacebar / W</strong> to snatch items mid-air!
          </p>
        </div>

        <div className="p-3.5 bg-amber-950/40 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 text-amber-300 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-amber-200 text-xs">
              3. Trigger Skill ⚡
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Press <strong>[E] Key</strong> or tap the <strong>SKILL</strong> button to unleash your skin's active power!
          </p>
        </div>
      </div>

      {/* UPDATE 1: 3 Ocean Map Realms */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Compass className="w-4 h-4" />
          <span>Leveling & 3 Map Realms (Transitions Every 5 Levels!)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 bg-sky-950/30 border border-sky-500/30 rounded-2xl">
            <span className="text-base font-bold text-sky-300">Levels 1–5</span>
            <div className="font-display font-bold text-white text-sm">Coral Lagoon</div>
            <p className="text-slate-300 text-[11px] mt-1 leading-snug">
              Sunlit turquoise waters with gentle waves and fresh garden salads.
            </p>
          </div>
          <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl">
            <span className="text-base font-bold text-indigo-300">Levels 6–10</span>
            <div className="font-display font-bold text-white text-sm">Sunken Atlantis</div>
            <p className="text-slate-300 text-[11px] mt-1 leading-snug">
              Deep sapphire abyss with glowing ancient temple ruin pillars.
            </p>
          </div>
          <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-2xl">
            <span className="text-base font-bold text-red-300">Levels 11+</span>
            <div className="font-display font-bold text-white text-sm">Magma Sea</div>
            <p className="text-slate-300 text-[11px] mt-1 leading-snug">
              Volcanic rift with smoking vents, magma bubbles, and extreme speed!
            </p>
          </div>
        </div>
      </div>

      {/* Power-Ups Section */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
          ⚡ Power-Ups (Fall Randomly)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-xl mb-1">🧲</div>
            <div className="font-bold text-sky-300 text-xs">Magnet</div>
            <p className="text-slate-400 text-[10px] leading-tight">Pulls food directly to mouth.</p>
          </div>
          <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-xl mb-1">🛡️</div>
            <div className="font-bold text-emerald-300 text-xs">1-Hit Shield</div>
            <p className="text-slate-400 text-[10px] leading-tight">Absorbs 1 hazard collision.</p>
          </div>
          <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-xl mb-1">⚡</div>
            <div className="font-bold text-amber-300 text-xs">2X Multiplier</div>
            <p className="text-slate-400 text-[10px] leading-tight">Doubles score for 10s.</p>
          </div>
          <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-xl mb-1">⏱️</div>
            <div className="font-bold text-cyan-300 text-xs">Time Freeze</div>
            <p className="text-slate-400 text-[10px] leading-tight">Slows falling items by 55%.</p>
          </div>
        </div>
      </div>

      {/* Carnivore Megalodon Inverted Diet Note */}
      <div className="mb-6 p-3.5 bg-red-950/30 border border-red-500/40 rounded-2xl flex items-start gap-3 text-xs">
        <span className="text-2xl shrink-0">🥩</span>
        <div>
          <strong className="text-red-300 font-display block text-sm">
            PREMIUM CARNIVORE MEGALODON (Inverted Diet!):
          </strong>
          <span className="text-slate-300 text-xs leading-relaxed">
            When playing as the Carnivore Shark, the rules invert! Chomping raw meats rewards points and heals your lives. Touching vegetables damages your shark!
          </span>
        </div>
      </div>

      {/* Codes reminder */}
      <div className="mb-6 p-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">
            Redeem codes <strong className="text-amber-300 font-mono">UPDATE1</strong> (500🪙) and <strong className="text-amber-300 font-mono">SharkSalad</strong> (150🪙) in Settings!
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
        <button
          onClick={() => {
            soundEngine.playPowerUp();
            onStartGame();
          }}
          className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-base rounded-xl cursor-pointer shadow-lg transition-colors"
        >
          START PLAYING
        </button>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl cursor-pointer border border-slate-700 transition-colors"
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};
