import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Medal, Sparkles, X, Flame, Compass, RefreshCw, UserCheck } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { SHARK_SKINS, MAP_THEMES } from '../utils/constants';

interface LeaderboardModalProps {
  currentHighScore: number;
  currentLevel: number;
  onClose: () => void;
  onPlayGame?: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentHighScore,
  currentLevel,
  onClose,
  onPlayGame,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) throw new Error('Failed to load leaderboard data');
      const data = await res.json();
      if (data.success && Array.isArray(data.leaderboard)) {
        setEntries(data.leaderboard);
      } else {
        throw new Error('Invalid leaderboard response');
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Could not connect to leaderboard server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full cursor-pointer transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <Trophy className="w-7 h-7 fill-amber-400/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                Global Hall of Fame
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                TOP 10
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live competitive rankings of the highest scoring sharks worldwide!
            </p>
          </div>
        </div>

        {/* Player's Current Benchmark Card */}
        <div className="mb-4 p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Your Personal Record: </span>
              <strong className="text-emerald-400 font-mono font-bold text-sm">{currentHighScore} pts</strong>
              <span className="text-slate-500 ml-1.5">(Level {currentLevel})</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              fetchLeaderboard();
            }}
            disabled={isLoading}
            className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 cursor-pointer transition-colors disabled:opacity-50"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Leaderboard Table Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              <p className="text-xs font-medium">Fetching global rankings from ocean depths...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-rose-400 text-xs">
              <p>{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="mt-3 px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded-xl text-rose-200 cursor-pointer text-xs"
              >
                Try Again
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No scores recorded yet. Be the first to claim #1!
            </div>
          ) : (
            entries.map((entry, idx) => {
              const rank = idx + 1;
              const skin = SHARK_SKINS.find((s) => s.id === entry.skinId) || SHARK_SKINS[0];
              const mapTheme = MAP_THEMES[entry.mapId as keyof typeof MAP_THEMES] || MAP_THEMES.coral_lagoon;

              const isTop3 = rank <= 3;
              const rankBadge =
                rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

              return (
                <div
                  key={entry.id || idx}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    rank === 1
                      ? 'bg-amber-950/25 border-amber-500/50 shadow-md shadow-amber-950/30'
                      : rank === 2
                      ? 'bg-slate-800/60 border-slate-600/50'
                      : rank === 3
                      ? 'bg-amber-950/15 border-amber-700/40'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/60'
                  }`}
                >
                  {/* Left: Rank & Player Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 text-center font-display font-black text-sm shrink-0 ${
                        isTop3 ? 'text-lg' : 'text-slate-400'
                      }`}
                    >
                      {rankBadge}
                    </span>

                    {/* Skin Avatar Icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border"
                      style={{
                        backgroundColor: skin.colorSecondary,
                        borderColor: skin.colorPrimary,
                      }}
                      title={`Skin: ${skin.name}`}
                    >
                      <span>{skin.icon}</span>
                    </div>

                    {/* Player Name and Level */}
                    <div className="min-w-0">
                      <div className="font-display font-bold text-white text-sm truncate flex items-center gap-1.5">
                        <span className="truncate">{entry.playerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="text-amber-400 font-bold font-mono">LVL {entry.level}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate text-slate-400">{mapTheme.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score & Max Combo */}
                  <div className="text-right shrink-0 pl-2">
                    <div className="font-mono text-base sm:text-lg font-black text-emerald-400 leading-tight">
                      {entry.score} <span className="text-[10px] text-emerald-500 font-sans font-bold">PTS</span>
                    </div>
                    {entry.maxCombo > 1 && (
                      <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-amber-400 font-mono">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        <span>{entry.maxCombo}x COMBO</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm rounded-xl cursor-pointer transition-colors"
          >
            Close
          </button>

          {onPlayGame && (
            <button
              onClick={() => {
                soundEngine.playPowerUp();
                onPlayGame();
              }}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg transition-transform active:scale-95"
            >
              Play & Compete!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
