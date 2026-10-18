import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameStats, SharkSkin } from './types/game';
import { HeaderBar } from './components/HeaderBar';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { TitleMenu } from './components/TitleMenu';
import { GameOverModal } from './components/GameOverModal';
import { WardrobeModal } from './components/WardrobeModal';
import { SettingsModal } from './components/SettingsModal';
import { SkinShopModal } from './components/SkinShopModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { RulesGuide } from './components/RulesGuide';
import { soundEngine } from './audio/soundEngine';
import { SHARK_SKINS, SECRET_CODES, getMapThemeForLevel } from './utils/constants';
import lagoonBackdrop from './assets/images/underwater_veggie_lagoon_1791130669429.jpg';

const STORAGE_KEYS = {
  HIGH_SCORE: 'salad_shark_highscore',
  TOTAL_VEGGIES: 'salad_shark_total_veggies',
  ACTIVE_HAT: 'salad_shark_active_hat',
  ACTIVE_SKIN: 'salad_shark_active_skin',
  UNLOCKED_SKINS: 'salad_shark_unlocked_skins',
  COINS: 'salad_shark_coins',
  LEVEL: 'salad_shark_level',
  XP: 'salad_shark_xp',
  REDEEMED_CODES: 'salad_shark_redeemed_codes',
  MUTED: 'salad_shark_muted',
  BGM_ENABLED: 'salad_shark_bgm_enabled',
  SFX_ENABLED: 'salad_shark_sfx_enabled',
  BGM_VOL: 'salad_shark_bgm_vol',
  SFX_VOL: 'salad_shark_sfx_vol',
};

const INITIAL_STATS: GameStats = {
  score: 0,
  highScore: 0,
  coins: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 10,
  currentMap: 'coral_lagoon',
  lives: 3,
  combo: 0,
  maxCombo: 0,
  totalVeggiesEaten: 0,
  frenzyTimer: 0,
  abilityCooldownRemaining: 0,
  activePowerUps: {
    magnet: 0,
    shield: 0,
    multiplier: 0,
    freeze: 0,
    clover: 0,
  },
  veggieCounts: {
    lettuce: 0,
    tomato: 0,
    broccoli: 0,
    carrot: 0,
    avocado: 0,
    rainbow_salad: 0,
  },
  meatHits: 0,
  powerUpsCollected: {
    magnet: 0,
    shield: 0,
    multiplier: 0,
    freeze_clock: 0,
    lucky_clover: 0,
    bubble_tornado: 0,
  },
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [currentTab, setCurrentTab] = useState<'game' | 'help' | 'settings' | 'wardrobe' | 'shop' | 'leaderboard'>('game');
  const [isMuted, setIsMuted] = useState(false);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [bgmVolume, setBgmVolumeState] = useState(0.55);
  const [sfxVolume, setSfxVolumeState] = useState(0.8);
  const [activeHat, setActiveHat] = useState('none');
  const [activeSkinId, setActiveSkinId] = useState('natural');
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(['natural']);
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>([]);
  const [cumulativeVeggies, setCumulativeVeggies] = useState(0);

  // Permanent Account Level & XP
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  const leapTriggerRef = useRef<(() => void) | null>(null);
  const abilityTriggerRef = useRef<(() => void) | null>(null);

  const handleLeap = useCallback(() => {
    if (leapTriggerRef.current) {
      leapTriggerRef.current();
    }
  }, []);

  const handleTriggerAbility = useCallback(() => {
    if (abilityTriggerRef.current) {
      abilityTriggerRef.current();
    }
  }, []);

  const [stats, setStats] = useState<GameStats>(() => {
    const savedHighScore = parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '0', 10);
    const savedCoins = parseInt(localStorage.getItem(STORAGE_KEYS.COINS) || '0', 10);
    const savedLevel = parseInt(localStorage.getItem(STORAGE_KEYS.LEVEL) || '1', 10);
    const savedXp = parseInt(localStorage.getItem(STORAGE_KEYS.XP) || '0', 10);
    const finalLevel = Number.isNaN(savedLevel) || savedLevel < 1 ? 1 : savedLevel;
    const currentTheme = getMapThemeForLevel(finalLevel);

    return {
      ...INITIAL_STATS,
      highScore: Number.isNaN(savedHighScore) ? 0 : savedHighScore,
      coins: Number.isNaN(savedCoins) ? 0 : savedCoins,
      level: finalLevel,
      xp: Number.isNaN(savedXp) ? 0 : savedXp,
      xpToNextLevel: 10 + finalLevel * 5,
      currentMap: currentTheme.id,
    };
  });

  // Load persistent settings & permanent account level
  useEffect(() => {
    const savedHat = localStorage.getItem(STORAGE_KEYS.ACTIVE_HAT);
    if (savedHat) setActiveHat(savedHat);

    const savedSkin = localStorage.getItem(STORAGE_KEYS.ACTIVE_SKIN);
    if (savedSkin) setActiveSkinId(savedSkin);

    const savedUnlockedSkins = localStorage.getItem(STORAGE_KEYS.UNLOCKED_SKINS);
    if (savedUnlockedSkins) {
      try {
        const parsed = JSON.parse(savedUnlockedSkins);
        if (Array.isArray(parsed)) setUnlockedSkins(parsed);
      } catch {
        // fallback
      }
    }

    const savedRedeemedCodes = localStorage.getItem(STORAGE_KEYS.REDEEMED_CODES);
    if (savedRedeemedCodes) {
      try {
        const parsed = JSON.parse(savedRedeemedCodes);
        if (Array.isArray(parsed)) setRedeemedCodes(parsed);
      } catch {
        // fallback
      }
    }

    const savedTotal = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_VEGGIES) || '0', 10);
    if (!Number.isNaN(savedTotal)) setCumulativeVeggies(savedTotal);

    const savedCoins = parseInt(localStorage.getItem(STORAGE_KEYS.COINS) || '0', 10);
    if (!Number.isNaN(savedCoins)) {
      setCoins(savedCoins);
      setStats((prev) => ({ ...prev, coins: savedCoins }));
    }

    const savedLevel = parseInt(localStorage.getItem(STORAGE_KEYS.LEVEL) || '1', 10);
    if (!Number.isNaN(savedLevel) && savedLevel >= 1) {
      setLevel(savedLevel);
      setStats((prev) => ({ ...prev, level: savedLevel, currentMap: getMapThemeForLevel(savedLevel).id }));
    }

    const savedXp = parseInt(localStorage.getItem(STORAGE_KEYS.XP) || '0', 10);
    if (!Number.isNaN(savedXp)) {
      setXp(savedXp);
      setStats((prev) => ({ ...prev, xp: savedXp }));
    }

    const savedMuted = localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
    setIsMuted(savedMuted);
    soundEngine.setMute(savedMuted);

    const savedBgmEnabled = localStorage.getItem(STORAGE_KEYS.BGM_ENABLED);
    if (savedBgmEnabled !== null) {
      const isEnabled = savedBgmEnabled === 'true';
      setBgmEnabled(isEnabled);
      soundEngine.setBgmEnabled(isEnabled);
    }

    const savedSfxEnabled = localStorage.getItem(STORAGE_KEYS.SFX_ENABLED);
    if (savedSfxEnabled !== null) {
      const isEnabled = savedSfxEnabled === 'true';
      setSfxEnabled(isEnabled);
      soundEngine.setSfxEnabled(isEnabled);
    }

    const savedBgmVol = parseFloat(localStorage.getItem(STORAGE_KEYS.BGM_VOL) || '0.55');
    if (!Number.isNaN(savedBgmVol)) {
      setBgmVolumeState(savedBgmVol);
      soundEngine.setBgmVolume(savedBgmVol);
    }

    const savedSfxVol = parseFloat(localStorage.getItem(STORAGE_KEYS.SFX_VOL) || '0.8');
    if (!Number.isNaN(savedSfxVol)) {
      setSfxVolumeState(savedSfxVol);
      soundEngine.setSfxVolume(savedSfxVol);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (stats.highScore > 0) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, stats.highScore.toString());
    }
  }, [stats.highScore]);

  useEffect(() => {
    if (stats.coins >= 0) {
      setCoins(stats.coins);
      localStorage.setItem(STORAGE_KEYS.COINS, stats.coins.toString());
    }
  }, [stats.coins]);

  // Synchronize permanent account level and XP
  useEffect(() => {
    if (stats.level >= 1) {
      setLevel(stats.level);
      localStorage.setItem(STORAGE_KEYS.LEVEL, stats.level.toString());
    }
  }, [stats.level]);

  useEffect(() => {
    if (stats.xp >= 0) {
      setXp(stats.xp);
      localStorage.setItem(STORAGE_KEYS.XP, stats.xp.toString());
    }
  }, [stats.xp]);

  useEffect(() => {
    if (cumulativeVeggies > 0) {
      localStorage.setItem(STORAGE_KEYS.TOTAL_VEGGIES, cumulativeVeggies.toString());
    }
  }, [cumulativeVeggies]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMute(next);
      localStorage.setItem(STORAGE_KEYS.MUTED, next.toString());
      return next;
    });
  }, []);

  const handleToggleBgm = useCallback(() => {
    setBgmEnabled((prev) => {
      const next = !prev;
      soundEngine.setBgmEnabled(next);
      localStorage.setItem(STORAGE_KEYS.BGM_ENABLED, next.toString());
      return next;
    });
  }, []);

  const handleToggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev;
      soundEngine.setSfxEnabled(next);
      localStorage.setItem(STORAGE_KEYS.SFX_ENABLED, next.toString());
      return next;
    });
  }, []);

  const handleChangeBgmVolume = useCallback((vol: number) => {
    setBgmVolumeState(vol);
    soundEngine.setBgmVolume(vol);
    localStorage.setItem(STORAGE_KEYS.BGM_VOL, vol.toString());
  }, []);

  const handleChangeSfxVolume = useCallback((vol: number) => {
    setSfxVolumeState(vol);
    soundEngine.setSfxVolume(vol);
    localStorage.setItem(STORAGE_KEYS.SFX_VOL, vol.toString());
  }, []);

  const handleSelectHat = useCallback((hatId: string) => {
    setActiveHat(hatId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_HAT, hatId);
  }, []);

  const handleSelectSkin = useCallback((skinId: string) => {
    setActiveSkinId(skinId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SKIN, skinId);
  }, []);

  // Purchase skin with in-game Coins
  const handleBuySkinWithCoins = useCallback((skin: SharkSkin) => {
    setStats((prev) => {
      const newCoins = Math.max(0, prev.coins - skin.priceCoins);
      localStorage.setItem(STORAGE_KEYS.COINS, newCoins.toString());
      return { ...prev, coins: newCoins };
    });
    setCoins((prev) => Math.max(0, prev - skin.priceCoins));

    setUnlockedSkins((prev) => {
      const updated = Array.from(new Set([...prev, skin.id]));
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_SKINS, JSON.stringify(updated));
      return updated;
    });
    setActiveSkinId(skin.id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SKIN, skin.id);
  }, []);

  // Purchase skin with simulated Credit Card
  const handleBuySkinWithCard = useCallback((skin: SharkSkin) => {
    setUnlockedSkins((prev) => {
      const updated = Array.from(new Set([...prev, skin.id]));
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_SKINS, JSON.stringify(updated));
      return updated;
    });
    setActiveSkinId(skin.id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SKIN, skin.id);
  }, []);

  // Redeem Promo Codes: UPDATE1 (+500 Coins) and SharkSalad (+150 Coins)
  const handleRedeemCode = useCallback(
    (inputCode: string): { success: boolean; message: string; coins?: number } => {
      const codeUpper = inputCode.trim();
      const codeKey = Object.keys(SECRET_CODES).find((k) => k.toUpperCase() === codeUpper.toUpperCase());

      if (!codeKey) {
        return {
          success: false,
          message: 'Invalid code! Please check your spelling.',
        };
      }

      if (redeemedCodes.includes(codeKey.toUpperCase())) {
        return {
          success: false,
          message: `Code "${codeKey}" has already been redeemed on this account!`,
        };
      }

      const reward = SECRET_CODES[codeKey];
      const rewardAmount = reward.rewardCoins;

      const newRedeemed = [...redeemedCodes, codeKey.toUpperCase()];
      setRedeemedCodes(newRedeemed);
      localStorage.setItem(STORAGE_KEYS.REDEEMED_CODES, JSON.stringify(newRedeemed));

      setStats((prev) => {
        const nextCoins = prev.coins + rewardAmount;
        localStorage.setItem(STORAGE_KEYS.COINS, nextCoins.toString());
        return { ...prev, coins: nextCoins };
      });
      setCoins((prev) => prev + rewardAmount);

      return {
        success: true,
        message: `🎉 Success! +${rewardAmount} Coral Coins added to your pouch!`,
        coins: rewardAmount,
      };
    },
    [redeemedCodes]
  );

  // Wipe Data handler
  const handleWipeData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
    localStorage.removeItem(STORAGE_KEYS.TOTAL_VEGGIES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_HAT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SKIN);
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED_SKINS);
    localStorage.removeItem(STORAGE_KEYS.COINS);
    localStorage.removeItem(STORAGE_KEYS.LEVEL);
    localStorage.removeItem(STORAGE_KEYS.XP);
    localStorage.removeItem(STORAGE_KEYS.REDEEMED_CODES);

    setStats((prev) => ({
      ...INITIAL_STATS,
      highScore: 0,
      coins: 0,
      level: 1,
      xp: 0,
      currentMap: 'coral_lagoon',
    }));
    setCumulativeVeggies(0);
    setCoins(0);
    setLevel(1);
    setXp(0);
    setActiveHat('none');
    setActiveSkinId('natural');
    setUnlockedSkins(['natural']);
    setRedeemedCodes([]);
  }, []);

  // Start new round (PERMANENT ACCOUNT LEVEL PRESERVED)
  const handleStartGame = useCallback(() => {
    soundEngine.unlockAudio();
    const currentTheme = getMapThemeForLevel(level);
    setStats((prev) => ({
      ...INITIAL_STATS,
      highScore: prev.highScore,
      coins: prev.coins,
      level: level,
      xp: xp,
      xpToNextLevel: 10 + level * 5,
      currentMap: currentTheme.id,
    }));
    setGameState('PLAYING');
    setCurrentTab('game');
    soundEngine.startBgm();
  }, [level, xp]);

  // Game over triggered from canvas
  const handleGameOver = useCallback(() => {
    soundEngine.stopBgm();
    setGameState('GAME_OVER');
    setCumulativeVeggies((prev) => prev + stats.totalVeggiesEaten);
  }, [stats.totalVeggiesEaten]);

  // Pause / Resume toggle
  const handleTogglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === 'PLAYING') {
        soundEngine.stopBgm();
        return 'PAUSED';
      } else if (prev === 'PAUSED') {
        soundEngine.startBgm();
        return 'PLAYING';
      }
      return prev;
    });
  }, []);

  const activeSkin = SHARK_SKINS.find((s) => s.id === activeSkinId) || SHARK_SKINS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar Header */}
      <HeaderBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'game' && gameState === 'PLAYING') {
            handleTogglePause();
          }
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        highScore={stats.highScore}
        coins={coins}
      />

      {/* Main Game & App Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-6xl w-full mx-auto relative overflow-hidden">
        {/* Help & Rules Tab */}
        {currentTab === 'help' && (
          <RulesGuide
            onClose={() => setCurrentTab('game')}
            onStartGame={handleStartGame}
          />
        )}

        {/* Global Leaderboard Tab */}
        {currentTab === 'leaderboard' && (
          <LeaderboardModal
            currentHighScore={stats.highScore}
            currentLevel={level}
            onClose={() => setCurrentTab('game')}
            onPlayGame={handleStartGame}
          />
        )}

        {/* Settings Tab (Audio, SFX, Wipe Data, Codes) */}
        {currentTab === 'settings' && (
          <SettingsModal
            bgmEnabled={bgmEnabled}
            sfxEnabled={sfxEnabled}
            bgmVolume={bgmVolume}
            sfxVolume={sfxVolume}
            redeemedCodes={redeemedCodes}
            onToggleBgm={handleToggleBgm}
            onToggleSfx={handleToggleSfx}
            onChangeBgmVolume={handleChangeBgmVolume}
            onChangeSfxVolume={handleChangeSfxVolume}
            onWipeData={handleWipeData}
            onRedeemCode={handleRedeemCode}
            onClose={() => setCurrentTab('game')}
          />
        )}

        {/* Skin Shop Tab */}
        {currentTab === 'shop' && (
          <SkinShopModal
            coins={coins}
            unlockedSkins={unlockedSkins}
            activeSkinId={activeSkinId}
            onSelectSkin={handleSelectSkin}
            onBuySkinWithCoins={handleBuySkinWithCoins}
            onBuySkinWithCard={handleBuySkinWithCard}
            onClose={() => setCurrentTab('game')}
            onOpenSettings={() => setCurrentTab('settings')}
          />
        )}

        {/* Wardrobe Tab */}
        {currentTab === 'wardrobe' && (
          <WardrobeModal
            totalVeggies={cumulativeVeggies + stats.totalVeggiesEaten}
            activeHat={activeHat}
            onSelectHat={handleSelectHat}
            onClose={() => setCurrentTab('game')}
          />
        )}

        {/* Game Tab */}
        {currentTab === 'game' && (
          <div className="w-full flex flex-col items-center justify-center">
            {gameState === 'TITLE_MENU' && (
              <TitleMenu
                highScore={stats.highScore}
                totalVeggies={cumulativeVeggies}
                coins={coins}
                level={level}
                onStartGame={handleStartGame}
                onOpenShop={() => setCurrentTab('shop')}
                onOpenLeaderboard={() => setCurrentTab('leaderboard')}
                onOpenHelp={() => setCurrentTab('help')}
                onOpenSettings={() => setCurrentTab('settings')}
                onOpenWardrobe={() => setCurrentTab('wardrobe')}
              />
            )}

            {(gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAME_OVER') && (
              <div className="relative w-full max-w-5xl h-[68vh] sm:h-[74vh] md:h-[76vh] min-h-[420px] max-h-[820px] md:aspect-[16/9] flex items-center justify-center bg-slate-900 rounded-3xl p-1 border-2 border-slate-800 shadow-2xl overflow-hidden touch-none">
                {/* Backdrop image overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none rounded-3xl"
                  style={{ backgroundImage: `url(${lagoonBackdrop})` }}
                />

                {/* In-Game HUD */}
                <HUD
                  stats={stats}
                  isPaused={gameState === 'PAUSED'}
                  activeSkin={activeSkin}
                  onTogglePause={handleTogglePause}
                  onLeap={handleLeap}
                  onTriggerAbility={handleTriggerAbility}
                />

                {/* Core 2D Canvas Engine */}
                <GameCanvas
                  stats={stats}
                  onUpdateStats={setStats}
                  onGameOver={handleGameOver}
                  activeHat={activeHat}
                  activeSkinId={activeSkinId}
                  isPaused={gameState === 'PAUSED'}
                  leapTriggerRef={leapTriggerRef}
                  abilityTriggerRef={abilityTriggerRef}
                />

                {/* Pause Modal Overlay */}
                {gameState === 'PAUSED' && (
                  <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6 text-center animate-fade-in">
                    <h3 className="font-display text-3xl sm:text-4xl font-black text-white mb-2">
                      Game Paused
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 max-w-xs">
                      Take a breath! Sharky is waiting for the frenzy to resume.
                    </p>
                    <button
                      onClick={handleTogglePause}
                      className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-lg rounded-xl cursor-pointer shadow-lg transition-colors"
                    >
                      RESUME GAME
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Touch & Desktop Controls Info Bar */}
            {gameState === 'PLAYING' && (
              <div className="mt-2.5 flex items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-400 text-center flex-wrap px-2">
                <span>👆 Drag anywhere to steer</span>
                <span aria-hidden="true">·</span>
                <span className="text-sky-300 font-semibold">🚀 LEAP Button / Space to jump</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300 font-semibold">⚡ SKILL Button / [E] for {activeSkin.activeName}</span>
                {activeSkin.isInvertedDiet && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-red-400 font-bold">🥩 Inverted: Eat Meat, Avoid Greens!</span>
                  </>
                )}
              </div>
            )}

            {/* Game Over Summary Modal */}
            {gameState === 'GAME_OVER' && (
              <GameOverModal
                stats={stats}
                activeSkinId={activeSkinId}
                onPlayAgain={handleStartGame}
                onOpenShop={() => setCurrentTab('shop')}
                onOpenLeaderboard={() => setCurrentTab('leaderboard')}
                onOpenWardrobe={() => setCurrentTab('wardrobe')}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-2 px-4 text-center border-t border-slate-900 text-xs text-slate-500 flex items-center justify-center gap-3">
        <span>Salad Shark</span>
        <span aria-hidden="true">·</span>
        <span>Global Hall of Fame & Multi-Platform Arcade</span>
      </footer>
    </div>
  );
}
