import React from 'react';
import { Volume2, VolumeX, Settings, HelpCircle, Shirt, Trophy, Play, ShoppingBag, Coins } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import sharkIcon from '../assets/images/salad_shark_icon_1791276546339.jpg';

interface HeaderBarProps {
  currentTab: 'game' | 'help' | 'settings' | 'wardrobe' | 'shop' | 'leaderboard';
  onSelectTab: (tab: 'game' | 'help' | 'settings' | 'wardrobe' | 'shop' | 'leaderboard') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  highScore: number;
  coins: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  highScore,
  coins,
}) => {
  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark with icon */}
      <button
        onClick={() => {
          soundEngine.playButtonClick();
          onSelectTab('game');
        }}
        className="text-left group cursor-pointer focus:outline-none flex items-center gap-2 shrink-0"
      >
        <img
          src={sharkIcon}
          alt="Salad Shark Logo"
          className="w-8 h-8 rounded-lg object-cover border border-emerald-500/40 shadow-sm"
          referrerPolicy="no-referrer"
        />
        <div className="flex items-center gap-1.5">
          <span className="font-display text-lg sm:text-xl font-black tracking-tight text-emerald-400 group-hover:text-emerald-300 transition-colors">
            Salad Shark
          </span>
          <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            UPDATE 1
          </span>
        </div>
      </button>

      {/* Zone 2: Navigation links */}
      <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-300">
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onSelectTab('game');
          }}
          className={`cursor-pointer transition-colors ${
            currentTab === 'game'
              ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5'
              : 'hover:text-white'
          }`}
        >
          Play Game
        </button>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onSelectTab('leaderboard');
          }}
          className={`cursor-pointer transition-colors flex items-center gap-1.5 ${
            currentTab === 'leaderboard'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-amber-300 hover:text-amber-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Leaderboard</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onSelectTab('shop');
          }}
          className={`cursor-pointer transition-colors flex items-center gap-1.5 ${
            currentTab === 'shop'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Skin Shop</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onSelectTab('wardrobe');
          }}
          className={`cursor-pointer transition-colors ${
            currentTab === 'wardrobe'
              ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5'
              : 'hover:text-white'
          }`}
        >
          Hats
        </button>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onSelectTab('help');
          }}
          className={`cursor-pointer transition-colors ${
            currentTab === 'help'
              ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5'
              : 'hover:text-white'
          }`}
        >
          Help
        </button>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onSelectTab('settings');
          }}
          className={`cursor-pointer transition-colors ${
            currentTab === 'settings'
              ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5'
              : 'hover:text-white'
          }`}
        >
          Settings
        </button>
      </nav>

      {/* Zone 3: Actions & Mobile Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Mobile Navigation Icons */}
        <div className="flex lg:hidden items-center gap-1">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onSelectTab('leaderboard');
            }}
            title="Global Leaderboard"
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
              currentTab === 'leaderboard'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-850 text-amber-300 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onSelectTab('shop');
            }}
            title="Skin Shop"
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
              currentTab === 'shop'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-850 text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onSelectTab('wardrobe');
            }}
            title="Wardrobe"
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <Shirt className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onSelectTab('settings');
            }}
            title="Settings"
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Currency Coins Badge */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onSelectTab('shop');
          }}
          className="flex items-center gap-1.5 text-xs text-amber-300 font-mono-nums bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors shadow-sm"
          title="Open Skin Shop"
        >
          <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
          <span className="font-bold">{coins}</span>
        </button>

        {/* High Score Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-mono-nums bg-slate-900 border border-slate-700/60 px-2.5 py-1.5 rounded-xl">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>BEST {highScore}</span>
        </div>

        {/* Quick Audio Mute Button */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onToggleMute();
          }}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer border border-slate-700/60"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio'}</span>
        </button>
      </div>
    </header>
  );
};
