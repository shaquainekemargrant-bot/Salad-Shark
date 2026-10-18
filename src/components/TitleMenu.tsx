import React from 'react';
import { Play, HelpCircle, Settings, Shirt, Trophy, Sparkles, Coins, ShoppingBag, Flame } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import sharkIcon from '../assets/images/salad_shark_icon_1791276546339.jpg';

interface TitleMenuProps {
  highScore: number;
  totalVeggies: number;
  coins: number;
  level: number;
  onStartGame: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onOpenWardrobe: () => void;
}

export const TitleMenu: React.FC<TitleMenuProps> = ({
  highScore,
  totalVeggies,
  coins,
  level,
  onStartGame,
  onOpenShop,
  onOpenLeaderboard,
  onOpenHelp,
  onOpenSettings,
  onOpenWardrobe,
}) => {
  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center text-center px-4 py-3 sm:py-5 animate-fade-in">
      {/* Top Level & Coins Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-xl text-xs font-semibold text-slate-300">
          <span className="text-amber-400">⭐</span>
          <span>Account Level {level}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-amber-500/40 px-3 py-1 rounded-xl text-xs font-bold text-amber-300 font-mono-nums">
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{coins} Coins</span>
        </div>
      </div>

      {/* Fixed Icon Showcase with Glow */}
      <div className="relative mb-3 group">
        <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500" />
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-2 border-emerald-400/60 shadow-2xl bg-slate-900">
          <img
            src={sharkIcon}
            alt="Salad Shark Icon"
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Main Title & Tagline */}
      <div className="flex items-center gap-2 mb-1">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tight">
          Salad Shark
        </h1>
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          UPDATE 1
        </span>
      </div>
      <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-3 leading-relaxed">
        Chomp crisp greens, dodge raw meats, snatch power-ups, level up, and unlock awesome shark abilities!
      </p>

      {/* Feature Badges */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-300 font-medium mb-4 flex-wrap">
        <span className="bg-amber-950/60 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md">🏆 Global Leaderboard</span>
        <span className="bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">🛍️ Skin Shop & Cutscenes</span>
        <span className="bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-md">🌊 3 Map Realms</span>
        <span className="bg-rose-950/60 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded-md">🥩 Carnivore Skin</span>
      </div>

      {/* Menu Actions */}
      <div className="flex flex-col gap-2.5 w-full max-w-sm mb-4">
        {/* Start - Play Game */}
        <button
          onClick={() => {
            soundEngine.playPowerUp();
            onStartGame();
          }}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display text-xl font-bold rounded-2xl shadow-xl shadow-emerald-950/60 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>Start - Play Game</span>
        </button>

        {/* Global Leaderboard */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onOpenLeaderboard();
          }}
          className="w-full py-3 px-6 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 hover:text-white font-display text-base font-bold rounded-2xl border border-amber-500/50 cursor-pointer transition-all flex items-center justify-center gap-2.5 shadow-md"
        >
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Global Leaderboard</span>
          <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full ml-1">
            TOP 10
          </span>
        </button>

        {/* Skin Shop */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onOpenShop();
          }}
          className="w-full py-3 px-6 bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-display text-base font-semibold rounded-2xl border border-slate-700/80 cursor-pointer transition-all flex items-center justify-center gap-2.5 hover:border-amber-500/50"
        >
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <span>Skin Shop & Abilities</span>
        </button>

        {/* Help & Rules */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onOpenHelp();
          }}
          className="w-full py-2.5 px-6 bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-display text-sm font-semibold rounded-2xl border border-slate-700/80 cursor-pointer transition-all flex items-center justify-center gap-2.5 hover:border-emerald-500/50"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>Help & Rules</span>
        </button>

        {/* Settings (Audio, SFX, Wipe Data, Codes) */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onOpenSettings();
          }}
          className="w-full py-2.5 px-6 bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-display text-sm font-semibold rounded-2xl border border-slate-700/80 cursor-pointer transition-all flex items-center justify-center gap-2.5 hover:border-teal-500/50"
        >
          <Settings className="w-4 h-4 text-teal-400" />
          <span>Settings (Audio, SFX, Wipe Data, Codes)</span>
        </button>

        {/* Shark Wardrobe */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onOpenWardrobe();
          }}
          className="w-full py-2 px-6 bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-800/80 cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          <Shirt className="w-3.5 h-3.5 text-emerald-400" />
          <span>Shark Wardrobe & Hats</span>
        </button>
      </div>

      {/* High Score & Total Veggies Footer Stats */}
      <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-mono-nums bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Best: {highScore}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono-nums bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>🥗 Munched: {totalVeggies}</span>
        </div>
      </div>
    </div>
  );
};
