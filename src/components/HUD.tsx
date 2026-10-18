import React from 'react';
import { Heart, Flame, Pause, Play, Sparkles, Shield, Zap, ArrowUp, Coins, Compass } from 'lucide-react';
import { GameStats, SharkSkin } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { MAP_THEMES } from '../utils/constants';

interface HUDProps {
  stats: GameStats;
  isPaused: boolean;
  activeSkin?: SharkSkin;
  onTogglePause: () => void;
  onLeap?: () => void;
  onTriggerAbility?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  isPaused,
  activeSkin,
  onTogglePause,
  onLeap,
  onTriggerAbility,
}) => {
  const activePowerUps = stats.activePowerUps || { magnet: 0, shield: 0, multiplier: 0, freeze: 0, clover: 0 };
  const hasActivePowerUp =
    activePowerUps.magnet > 0 ||
    activePowerUps.shield > 0 ||
    activePowerUps.multiplier > 0 ||
    (activePowerUps.freeze && activePowerUps.freeze > 0) ||
    (activePowerUps.clover && activePowerUps.clover > 0);

  const xpProgressPercent = Math.min(100, Math.round((stats.xp / (stats.xpToNextLevel || 10)) * 100));
  const currentMapTheme = MAP_THEMES[stats.currentMap || 'coral_lagoon'] || MAP_THEMES.coral_lagoon;

  const abilityCooldown = stats.abilityCooldownRemaining || 0;
  const isAbilityReady = abilityCooldown <= 0;

  return (
    <>
      {/* Top Bar HUD - Compact & Responsive for Mobile and Desktop (<12% screen height) */}
      <div className="absolute top-2 sm:top-3 inset-x-2 sm:inset-x-4 flex items-center justify-between pointer-events-none z-30 select-none">
        {/* Left Side: Lives & Level Progress */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Lives / Health Display (Max 3 Lives) */}
          <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/60 shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 mr-0.5 hidden md:inline">
              {activeSkin?.isInvertedDiet ? 'CARNIVORE' : 'LIVES'}
            </span>
            {[1, 2, 3].map((lifeIndex) => {
              const hasLife = lifeIndex <= stats.lives;
              return (
                <div
                  key={lifeIndex}
                  className={`transition-all duration-300 transform ${
                    hasLife ? 'scale-100' : 'scale-90 opacity-20 grayscale'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      hasLife
                        ? activeSkin?.isInvertedDiet
                          ? 'fill-red-500 text-red-500 animate-pulse'
                          : 'fill-rose-500 text-rose-500 animate-pulse'
                        : 'fill-slate-600 text-slate-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Level & XP Progress Bar */}
          <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/60 shadow-md">
            <span className="text-[10px] font-black text-amber-400 font-mono">
              LVL {stats.level}
            </span>
            <div className="w-12 sm:w-20 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">
              {stats.xp}/{stats.xpToNextLevel}
            </span>
          </div>
        </div>

        {/* Center: Realm Tag & Combo */}
        <div className="flex items-center gap-2">
          {/* Map Realm Pill */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60 shadow-md text-xs font-semibold text-slate-300 pointer-events-auto">
            <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '24s' }} />
            <span>{currentMapTheme.name}</span>
          </div>

          {/* Combo Multiplier */}
          {stats.combo >= 2 && (
            <div className="flex items-center gap-1 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 px-2.5 sm:px-3 py-1 rounded-xl shadow-lg animate-bounce pointer-events-auto">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="font-display text-[11px] sm:text-xs font-black text-emerald-300">
                {stats.combo}x COMBO
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Score, Coins & Pause */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto">
          {/* Coins Counter */}
          <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-amber-500/30 shadow-md font-mono-nums">
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-amber-300 leading-none">
              {stats.coins}
            </span>
          </div>

          {/* Score Counter */}
          <div className="flex items-center bg-slate-950/85 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-slate-700/60 shadow-lg font-mono-nums">
            <div className="text-right">
              <div className="text-[8px] text-slate-400 font-bold tracking-wider uppercase leading-none mb-0.5">Score</div>
              <div className="text-base sm:text-xl font-black text-emerald-400 leading-none">
                {stats.score}
              </div>
            </div>
          </div>

          {/* Pause Button */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onTogglePause();
            }}
            className="p-2 sm:p-2 bg-slate-900/85 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/60 shadow-lg cursor-pointer transition-colors"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Active Power-Ups Row (Below Top Bar) */}
      {hasActivePowerUp && (
        <div className="absolute top-14 sm:top-16 inset-x-2 sm:inset-x-6 flex items-center justify-center gap-1.5 sm:gap-2.5 pointer-events-none z-30 animate-fade-in flex-wrap select-none">
          {activePowerUps.magnet > 0 && (
            <div className="flex items-center gap-1 bg-sky-950/85 backdrop-blur-md border border-sky-400/50 px-2 py-0.5 rounded-lg shadow-md text-sky-300 text-[10px] font-semibold">
              <span>🧲</span>
              <span className="font-mono-nums">{activePowerUps.magnet}s</span>
            </div>
          )}

          {activePowerUps.shield > 0 && (
            <div className="flex items-center gap-1 bg-emerald-950/85 backdrop-blur-md border border-emerald-400/50 px-2 py-0.5 rounded-lg shadow-md text-emerald-300 text-[10px] font-semibold">
              <Shield className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
              <span>1-HIT SHIELD</span>
            </div>
          )}

          {activePowerUps.multiplier > 0 && (
            <div className="flex items-center gap-1 bg-amber-950/85 backdrop-blur-md border border-amber-400/50 px-2 py-0.5 rounded-lg shadow-md text-amber-300 text-[10px] font-semibold animate-pulse">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-mono-nums">2X ({activePowerUps.multiplier}s)</span>
            </div>
          )}

          {activePowerUps.freeze && activePowerUps.freeze > 0 ? (
            <div className="flex items-center gap-1 bg-cyan-950/85 backdrop-blur-md border border-cyan-400/50 px-2 py-0.5 rounded-lg shadow-md text-cyan-300 text-[10px] font-semibold">
              <span>⏱️</span>
              <span className="font-mono-nums">{activePowerUps.freeze}s</span>
            </div>
          ) : null}
        </div>
      )}

      {/* DUAL ERGONOMIC MOBILE THUMB CONTROLS (Natural Thumb Reach Zone) */}
      {/* Bottom-Left Thumb Button: Active Skill */}
      {activeSkin && onTriggerAbility && (
        <div
          className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 pointer-events-auto z-30 select-none"
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              if (isAbilityReady) {
                onTriggerAbility();
              } else {
                soundEngine.playMeatHit();
              }
            }}
            disabled={!isAbilityReady}
            className={`group relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-display font-black shadow-xl border-2 transition-all cursor-pointer ${
              isAbilityReady
                ? 'bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 border-white/60 text-slate-950 hover:scale-105 active:scale-95 animate-pulse shadow-amber-950/60'
                : 'bg-slate-950/85 border-slate-700/60 text-slate-500 cursor-not-allowed opacity-80'
            }`}
            title={`Active Ability: ${activeSkin.activeName} (Hotkey: E)`}
          >
            {isAbilityReady ? (
              <>
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 stroke-[2.5]" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight leading-none mt-0.5">
                  SKILL
                </span>
                <span className="hidden sm:inline-block absolute -top-1 -right-1 text-[8px] font-mono bg-slate-950 text-amber-300 px-1 rounded border border-amber-400/40">
                  [E]
                </span>
              </>
            ) : (
              <>
                <span className="font-mono text-sm sm:text-base font-black text-amber-300">
                  {Math.ceil(abilityCooldown)}s
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                  WAIT
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Bottom-Right Thumb Button: LEAP! */}
      {onLeap && (
        <div
          className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 pointer-events-auto z-30 select-none"
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onLeap();
            }}
            className="group relative flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 hover:from-sky-500 hover:to-teal-300 active:scale-95 text-slate-950 font-display font-black shadow-xl shadow-sky-950/60 border-2 border-white/50 cursor-pointer transition-all"
            title="Leap Upward (Spacebar / Tap)"
          >
            <div className="absolute -inset-1 rounded-2xl bg-sky-400/30 blur group-hover:bg-sky-400/50 transition-all pointer-events-none" />
            <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3] group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-[11px] sm:text-xs font-black tracking-wider leading-none mt-0.5">
              LEAP!
            </span>
            <span className="hidden sm:inline-block absolute -top-1 -right-1 text-[8px] font-mono bg-slate-950 text-sky-300 px-1 rounded border border-sky-400/40">
              SPACE
            </span>
          </button>
        </div>
      )}
    </>
  );
};
