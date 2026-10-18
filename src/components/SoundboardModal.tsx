import React from 'react';
import { Volume2, Play, Sparkles, Music, Activity } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface SoundboardModalProps {
  onClose: () => void;
}

export const SoundboardModal: React.FC<SoundboardModalProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Meme Soundboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tap to test the Web Audio synthesizer SFX and frenetic chiptune melodies!
          </p>
        </div>
      </div>

      {/* SFX Category 1: Crunchy Veggies */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
          🥬 Veggie Crunchy Munch SFX
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => soundEngine.playVeggieMunch('lettuce')}
            className="p-3 bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🥬</div>
            <div className="font-display font-semibold text-white text-sm">Crisp Lettuce</div>
            <div className="text-[10px] text-slate-400">High-pass crunch</div>
          </button>

          <button
            onClick={() => soundEngine.playVeggieMunch('tomato')}
            className="p-3 bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🍅</div>
            <div className="font-display font-semibold text-white text-sm">Juicy Tomato</div>
            <div className="text-[10px] text-slate-400">Squishy pop</div>
          </button>

          <button
            onClick={() => soundEngine.playVeggieMunch('broccoli')}
            className="p-3 bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🥦</div>
            <div className="font-display font-semibold text-white text-sm">Deep Broccoli</div>
            <div className="text-[10px] text-slate-400">Woody solid crunch</div>
          </button>

          <button
            onClick={() => soundEngine.playVeggieMunch('avocado')}
            className="p-3 bg-slate-900 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🥑</div>
            <div className="font-display font-semibold text-white text-sm">Golden Avocado</div>
            <div className="text-[10px] text-slate-400">Sparkle shimmer</div>
          </button>
        </div>
      </div>

      {/* SFX Category 2: Disgusted Raw Meat & Chaos */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
          🥩 Disgusted Meat Hits & Memes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => soundEngine.playMeatHit()}
            className="p-3 bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🤮🥩</div>
            <div className="font-display font-semibold text-white text-sm">"BLEGH!" Meat Hit</div>
            <div className="text-[10px] text-slate-400">Descending buzz & splat</div>
          </button>

          <button
            onClick={() => soundEngine.playGameOver()}
            className="p-3 bg-slate-900 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🎺😭</div>
            <div className="font-display font-semibold text-white text-sm">Sad Trombone</div>
            <div className="text-[10px] text-slate-400">Game over failure stinger</div>
          </button>

          <button
            onClick={() => soundEngine.playComboMultiplier(10)}
            className="p-3 bg-slate-900 hover:bg-teal-950/50 border border-slate-800 hover:border-teal-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">✨🔥</div>
            <div className="font-display font-semibold text-white text-sm">10x Combo Fanfare</div>
            <div className="text-[10px] text-slate-400">Ascending arpeggio sparkle</div>
          </button>
        </div>
      </div>

      {/* SFX Category 3: Power-Ups & Leaping */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-3">
          ⚡ Power-Ups & Shark Leap SFX
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => soundEngine.playSharkLeap()}
            className="p-3 bg-slate-900 hover:bg-sky-950/50 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🚀🌊</div>
            <div className="font-display font-semibold text-white text-sm">Shark Leap</div>
            <div className="text-[10px] text-slate-400">Air whoosh & water glide</div>
          </button>

          <button
            onClick={() => soundEngine.playPowerUpPickup('magnet')}
            className="p-3 bg-slate-900 hover:bg-sky-950/50 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🧲⚡</div>
            <div className="font-display font-semibold text-white text-sm">Magnet Pickup</div>
            <div className="text-[10px] text-slate-400">Electric buzz zips</div>
          </button>

          <button
            onClick={() => soundEngine.playShieldDeflect()}
            className="p-3 bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🛡️💥</div>
            <div className="font-display font-semibold text-white text-sm">Shield Deflect</div>
            <div className="text-[10px] text-slate-400">Forcefield bounce ring</div>
          </button>

          <button
            onClick={() => soundEngine.playPowerUpPickup('multiplier')}
            className="p-3 bg-slate-900 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">2️⃣🔥</div>
            <div className="font-display font-semibold text-white text-sm">2X Multiplier</div>
            <div className="text-[10px] text-slate-400">Double score fanfare</div>
          </button>
        </div>
      </div>

      {/* Dynamic BGM Demo */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-emerald-400" />
            <span className="font-display font-bold text-white text-sm">Frenetic BGM Synthesizer</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Procedural chiptune engine that dynamically speeds up and modulates as the game becomes more intense!
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => soundEngine.startBgm()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Start BGM Track</span>
          </button>

          <button
            onClick={() => soundEngine.setDynamicTempo(1.0)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition-colors"
          >
            132 BPM (Normal)
          </button>

          <button
            onClick={() => soundEngine.setDynamicTempo(2.2)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition-colors"
          >
            185 BPM (Frenzy Mode!)
          </button>

          <button
            onClick={() => soundEngine.stopBgm()}
            className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-medium rounded-lg cursor-pointer transition-colors"
          >
            Stop BGM
          </button>
        </div>
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
