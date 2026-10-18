import React, { useState } from 'react';
import { SHARK_SKINS } from '../utils/constants';
import { SharkSkin } from '../types/game';
import { Sparkles, Check, Lock, Zap, Shield, CreditCard, Coins, ArrowRight, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { CreditCardCheckoutModal } from './CreditCardCheckoutModal';
import { SkinCutsceneModal } from './SkinCutsceneModal';

interface SkinShopModalProps {
  coins: number;
  unlockedSkins: string[];
  activeSkinId: string;
  onSelectSkin: (skinId: string) => void;
  onBuySkinWithCoins: (skin: SharkSkin) => void;
  onBuySkinWithCard: (skin: SharkSkin) => void;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const SkinShopModal: React.FC<SkinShopModalProps> = ({
  coins,
  unlockedSkins,
  activeSkinId,
  onSelectSkin,
  onBuySkinWithCoins,
  onBuySkinWithCard,
  onClose,
  onOpenSettings,
}) => {
  const [showCheckoutForSkin, setShowCheckoutForSkin] = useState<SharkSkin | null>(null);
  const [cutsceneSkin, setCutsceneSkin] = useState<SharkSkin | null>(null);

  const handleCardCheckoutSuccess = () => {
    if (showCheckoutForSkin) {
      const skinToUnlock = showCheckoutForSkin;
      onBuySkinWithCard(skinToUnlock);
      setShowCheckoutForSkin(null);
      // Trigger the celebratory Cutscene!
      setCutsceneSkin(skinToUnlock);
    }
  };

  const handleCoinPurchase = (skin: SharkSkin) => {
    if (coins < skin.priceCoins) {
      soundEngine.playMeatHit();
      return;
    }
    soundEngine.playCoinPickup();
    onBuySkinWithCoins(skin);
    // Trigger Cutscene!
    setCutsceneSkin(skin);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 animate-fade-in pb-12">
      {/* Checkout Modal if open */}
      {showCheckoutForSkin && (
        <CreditCardCheckoutModal
          onSuccess={handleCardCheckoutSuccess}
          onClose={() => setShowCheckoutForSkin(null)}
        />
      )}

      {/* Cinematic Cutscene if unlocked */}
      {cutsceneSkin && (
        <SkinCutsceneModal
          skin={cutsceneSkin}
          onEquip={() => {
            onSelectSkin(cutsceneSkin.id);
            setCutsceneSkin(null);
          }}
          onClose={() => setCutsceneSkin(null)}
        />
      )}

      {/* Shop Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              The Shark Skin Shop
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              UPDATE 1
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Unlock distinctive shark styles with unique <strong className="text-white">Passive Traits</strong> & <strong className="text-amber-400">Active Abilities</strong>!
          </p>
        </div>

        {/* Currency & Redeem Codes CTA */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl shadow-lg">
            <Coins className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Coral Coins</div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono-nums leading-none">
                {coins}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenSettings();
            }}
            className="text-xs font-bold text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900/80 px-3 py-2 rounded-xl border border-sky-500/30 cursor-pointer transition-colors"
          >
            Redeem Codes
          </button>
        </div>
      </div>

      {/* Skins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SHARK_SKINS.map((skin) => {
          const isUnlocked = unlockedSkins.includes(skin.id) || skin.priceCoins === 0;
          const isEquipped = activeSkinId === skin.id;
          const canAffordCoins = coins >= skin.priceCoins;

          return (
            <div
              key={skin.id}
              className={`relative rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 border-2 ${
                isEquipped
                  ? 'bg-slate-900/95 shadow-xl shadow-sky-950/40'
                  : 'bg-slate-900/70 hover:bg-slate-900/90'
              }`}
              style={{
                borderColor: isEquipped ? skin.colorPrimary : isUnlocked ? '#334155' : '#1e293b',
              }}
            >
              {/* Badge Top */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm"
                  style={{
                    backgroundColor: `${skin.colorPrimary}25`,
                    color: skin.colorPrimary,
                    border: `1px solid ${skin.colorPrimary}50`,
                  }}
                >
                  {skin.badge}
                </span>

                {isEquipped && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    EQUIPPED
                  </span>
                )}
              </div>

              {/* Shark Visual Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 shrink-0 transition-transform hover:scale-105"
                  style={{
                    backgroundColor: skin.colorSecondary,
                    borderColor: skin.colorPrimary,
                  }}
                >
                  <span>{skin.icon}</span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-black text-white leading-tight">
                    {skin.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {skin.tagline}
                  </p>
                </div>
              </div>

              {/* Inverted Diet Special Banner for Carnivore Megalodon */}
              {skin.isInvertedDiet && (
                <div className="mb-4 p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl flex items-start gap-2 text-red-300 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-red-200">INVERTED DIET ABILITY:</strong>
                    Raw meat rewards points & heals. Veggies deal damage!
                  </div>
                </div>
              )}

              {/* Abilities Showcase */}
              <div className="space-y-2.5 mb-5 flex-1">
                {/* Passive Perk */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-normal">
                      Passive:
                    </span>
                    <span>{skin.passiveName}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-snug">
                    {skin.passiveDesc}
                  </p>
                </div>

                {/* Active Ability */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-normal">
                        Active:
                      </span>
                      <span>{skin.activeName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {skin.activeCooldown}s CD
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-snug">
                    {skin.activeDesc}
                  </p>
                </div>
              </div>

              {/* Action Buttons Area */}
              <div className="pt-2 border-t border-slate-800/80">
                {isEquipped ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-800/80 text-emerald-400 font-display font-bold text-sm rounded-xl cursor-default flex items-center justify-center gap-1.5 border border-emerald-500/30"
                  >
                    <Check className="w-4 h-4" />
                    <span>Equipped</span>
                  </button>
                ) : isUnlocked ? (
                  <button
                    onClick={() => {
                      soundEngine.playPowerUp();
                      onSelectSkin(skin.id);
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-display font-bold text-sm rounded-xl cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Equip Skin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : skin.isPremium ? (
                  /* Premium Skin: Real Credit Card Checkout or Coin Option */
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        soundEngine.playButtonClick();
                        setShowCheckoutForSkin(skin);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-display font-black text-sm rounded-xl cursor-pointer shadow-lg shadow-red-950/40 transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Credit Card ($2.99)</span>
                    </button>

                    <button
                      onClick={() => handleCoinPurchase(skin)}
                      disabled={!canAffordCoins}
                      className={`w-full py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 border ${
                        canAffordCoins
                          ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-500/40 cursor-pointer'
                          : 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Or 🪙 {skin.priceCoins} Coins</span>
                    </button>
                  </div>
                ) : (
                  /* Standard Coin Purchase */
                  <button
                    onClick={() => handleCoinPurchase(skin)}
                    disabled={!canAffordCoins}
                    className={`w-full py-2.5 font-display font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                      canAffordCoins
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canAffordCoins ? (
                      <>
                        <Coins className="w-4 h-4" />
                        <span>Unlock for 🪙 {skin.priceCoins}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Need 🪙 {skin.priceCoins} Coins</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Back Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl cursor-pointer border border-slate-700 transition-colors"
        >
          Return to Game
        </button>
      </div>
    </div>
  );
};
