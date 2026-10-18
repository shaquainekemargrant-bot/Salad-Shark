import React, { useState } from 'react';
import { RotateCcw, Trophy, Share2, Check, Sparkles, Flame, ShieldAlert, ShoppingBag, Coins, Send, Dice5 } from 'lucide-react';
import { GameStats } from '../types/game';
import { getRankTitle, MAP_THEMES } from '../utils/constants';
import { soundEngine } from '../audio/soundEngine';

interface GameOverModalProps {
  stats: GameStats;
  activeSkinId: string;
  onPlayAgain: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenWardrobe: () => void;
}

const RANDOM_NICKNAMES = [
  'RomaineRebel',
  'ApexGrazer',
  'SaladSultan',
  'KaleKnight',
  'CrunchMaster',
  'AvocadoAce',
  'SaltyChomper',
  'BroccoliBoss',
  'MegalodonMunch',
  'HydroHerbivore',
];

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  activeSkinId,
  onPlayAgain,
  onOpenShop,
  onOpenLeaderboard,
  onOpenWardrobe,
}) => {
  const [copied, setCopied] = useState(false);
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('salad_shark_player_name') || 'SaladHero';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);

  const isNewHighScore = stats.score >= stats.highScore && stats.score > 0;
  const rank = getRankTitle(stats.score);
  const currentMapTheme = MAP_THEMES[stats.currentMap || 'coral_lagoon'] || MAP_THEMES.coral_lagoon;

  const handleRandomizeName = () => {
    soundEngine.playButtonClick();
    const rand = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    const suffixed = `${rand}${Math.floor(Math.random() * 90 + 10)}`;
    setPlayerName(suffixed);
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || submittedRank !== null) return;

    const trimmedName = playerName.trim() || 'Anonymous Shark';
    localStorage.setItem('salad_shark_player_name', trimmedName);

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: trimmedName,
          score: stats.score,
          maxCombo: stats.maxCombo,
          level: stats.level,
          skinId: activeSkinId,
          mapId: stats.currentMap || 'coral_lagoon',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        soundEngine.playLevelUp();
        setSubmittedRank(data.rank || 1);
      }
    } catch (err) {
      console.error('Failed to submit score:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    soundEngine.playButtonClick();
    const shareText = `🦈 Salad Shark!\n🏆 Score: ${stats.score} | Max Combo: ${stats.maxCombo}x\n⭐ Level: ${stats.level} in ${currentMapTheme.name}\n🎖️ Title: ${rank.title} ${rank.icon}\n🪙 Coins: ${stats.coins}\nPlay Salad Shark!`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-center relative overflow-hidden my-auto">
        {/* Background top glow */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-500 via-emerald-400 to-amber-400" />

        {/* Header Title */}
        <div className="mb-3">
          <div className="text-3xl sm:text-4xl mb-1">😵🦈🥗</div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Game Over!
          </h2>
          <p className="text-xs text-slate-400">
            Retreated to the underwater sanctuary! Good run!
          </p>
        </div>

        {/* Score Showcase */}
        <div className="my-3 p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            Final Score
          </div>
          <div className="font-mono-nums text-4xl sm:text-5xl font-black text-emerald-400">
            {stats.score}
          </div>

          {isNewHighScore && (
            <div className="mt-1 inline-flex items-center gap-1.5 text-amber-300 text-xs font-semibold bg-amber-500/20 border border-amber-500/30 px-3 py-0.5 rounded-full animate-bounce">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>NEW PERSONAL BEST!</span>
            </div>
          )}

          {/* Stats Bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-xs text-slate-300 font-mono-nums">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 uppercase">High Score</span>
              <span className="font-bold text-slate-200">{stats.highScore}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 uppercase">Max Combo</span>
              <span className="font-bold text-amber-400">{stats.maxCombo}x</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 uppercase">Total Coins</span>
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" />
                {stats.coins}
              </span>
            </div>
          </div>
        </div>

        {/* Global Leaderboard Submission Form */}
        <div className="mb-3 p-3 bg-amber-950/25 border border-amber-500/40 rounded-2xl text-left">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Global Leaderboard</span>
            </div>
            {submittedRank !== null && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Ranked #{submittedRank}!</span>
              </span>
            )}
          </div>

          {submittedRank === null ? (
            <form onSubmit={handleSubmitScore} className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={18}
                  placeholder="Your Shark Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 font-medium pr-8"
                />
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="absolute right-2 top-2 text-slate-400 hover:text-amber-400 transition-colors"
                  title="Randomize Nickname"
                >
                  <Dice5 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-1 shrink-0"
              >
                {isSubmitting ? (
                  <span>Posting...</span>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Post Score</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-300 pt-0.5">
              <span>Your score of <strong>{stats.score}</strong> is ranked <strong>#{submittedRank}</strong> globally!</span>
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  onOpenLeaderboard();
                }}
                className="text-amber-400 font-bold hover:underline shrink-0 text-xs"
              >
                View Hall of Fame →
              </button>
            </div>
          )}
        </div>

        {/* Level & Realm Reached */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3 font-semibold">
          <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-400">Account Level:</span>
            <span className="text-amber-300 font-bold font-mono-nums">LVL {stats.level}</span>
          </div>
          <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-400">Current Realm:</span>
            <span className="text-sky-300 font-bold truncate max-w-[110px]">{currentMapTheme.name}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playPowerUp();
              onPlayAgain();
            }}
            className="w-full sm:flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display text-base font-black rounded-xl cursor-pointer shadow-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenLeaderboard();
            }}
            className="w-full sm:w-auto py-3 px-3.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl cursor-pointer border border-amber-500/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Rankings</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenShop();
            }}
            className="w-full sm:w-auto py-3 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Skins</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer border border-slate-700 transition-colors flex items-center justify-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
