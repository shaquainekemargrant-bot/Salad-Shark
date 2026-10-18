import React, { useEffect } from 'react';
import { SharkSkin } from '../types/game';
import { Sparkles, Zap, Shield, Check, Flame, Trophy } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface SkinCutsceneModalProps {
  skin: SharkSkin;
  onEquip: () => void;
  onClose: () => void;
}

export const SkinCutsceneModal: React.FC<SkinCutsceneModalProps> = ({
  skin,
  onEquip,
  onClose,
}) => {
  useEffect(() => {
    soundEngine.playSkinUnlockCutscene();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in overflow-hidden">
      {/* Background Rotating Sunburst / Light Rays */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-35">
        <div
          className="w-[850px] h-[850px] rounded-full animate-spin"
          style={{
            animationDuration: '24s',
            background: `conic-gradient(from 0deg, ${skin.colorPrimary} 0deg 20deg, transparent 20deg 45deg, ${skin.colorSecondary} 45deg 65deg, transparent 65deg 90deg, ${skin.colorPrimary} 90deg 110deg, transparent 110deg 135deg, ${skin.colorSecondary} 135deg 155deg, transparent 155deg 180deg, ${skin.colorPrimary} 180deg 200deg, transparent 200deg 225deg, ${skin.colorSecondary} 225deg 245deg, transparent 245deg 270deg, ${skin.colorPrimary} 270deg 290deg, transparent 290deg 315deg, ${skin.colorSecondary} 315deg 335deg, transparent 335deg 360deg)`
          }}
        />
      </div>

      {/* Floating Sparkles & Ambient Glow */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ backgroundColor: skin.colorPrimary }}
      />

      {/* Main Cutscene Stage Card */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900/90 border-2 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center animate-bounce-in"
        style={{ borderColor: skin.colorPrimary }}
      >
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4 shadow-lg"
          style={{ backgroundColor: `${skin.colorPrimary}25`, color: skin.colorPrimary, border: `1px solid ${skin.colorPrimary}60` }}
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>NEW SKIN UNLOCKED!</span>
        </div>

        {/* Big Animated Shark Avatar Circle */}
        <div className="relative my-2">
          <div
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center text-6xl sm:text-7xl shadow-2xl border-4 transform hover:scale-105 transition-transform"
            style={{
              backgroundColor: skin.colorSecondary,
              borderColor: skin.colorPrimary,
              boxShadow: `0 0 35px ${skin.colorPrimary}60`,
            }}
          >
            <span className="animate-wiggle">{skin.icon}</span>
          </div>

          <div
            className="absolute -bottom-2 -right-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-950 font-display shadow-md"
            style={{ backgroundColor: skin.colorPrimary }}
          >
            {skin.badge}
          </div>
        </div>

        {/* Skin Title & Tagline */}
        <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-3">
          {skin.name}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-medium mb-6">
          {skin.tagline}
        </p>

        {/* Dual Abilities Spotlight Container */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-6">
          {/* Passive Ability Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PASSIVE PERK
                </span>
                <span className="font-display text-sm font-bold text-white block leading-tight">
                  {skin.passiveName}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              {skin.passiveDesc}
            </p>
          </div>

          {/* Active Ability Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    ACTIVE ABILITY
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-1 rounded">
                    {skin.activeCooldown}s CD
                  </span>
                </div>
                <span className="font-display text-sm font-bold text-white block leading-tight">
                  {skin.activeName}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              {skin.activeDesc}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              soundEngine.playPowerUp();
              onEquip();
            }}
            className="flex-1 py-3.5 rounded-xl font-display font-black text-slate-950 text-base cursor-pointer shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
            style={{ backgroundColor: skin.colorPrimary }}
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>EQUIP THIS SKIN NOW</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="py-3.5 px-6 rounded-xl font-display font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};
