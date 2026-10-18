/**
 * Game Types & Interfaces for Salad Shark - Update 1
 */

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type VeggieKind = 'lettuce' | 'tomato' | 'broccoli' | 'carrot' | 'avocado' | 'rainbow_salad';

export type MeatKind =
  | 'steak'
  | 'bacon'
  | 'chicken'
  | 'sausage'
  | 'meatball'
  | 'bacon_bomb'
  | 'toxic_meatball'
  | 'flying_cleaver';

export type PowerUpKind =
  | 'magnet'
  | 'shield'
  | 'score_multiplier'
  | 'freeze_clock'
  | 'lucky_clover'
  | 'bubble_tornado';

export interface FallingItem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  isMeat: boolean;
  isPowerUp?: boolean;
  kind: VeggieKind | MeatKind | PowerUpKind;
  points: number;
  wobblePhase: number;
  wobbleSpeed: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape: 'leaf' | 'spark' | 'bubble' | 'splat' | 'star' | 'ring' | 'electric' | 'coin' | 'freeze';
  rotation: number;
  rotSpeed: number;
}

export interface FloatingMemeText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  rotation: number;
  life: number;
  maxLife: number;
  scale: number;
}

export interface SharkHat {
  id: string;
  name: string;
  icon: string;
  requiredVeggies: number;
  description: string;
}

export interface SharkSkin {
  id: string;
  name: string;
  tagline: string;
  priceCoins: number;
  priceUsd?: number;
  isPremium?: boolean;
  icon: string;
  badge: string;
  colorPrimary: string;
  colorSecondary: string;
  colorBelly: string;
  passiveName: string;
  passiveDesc: string;
  activeName: string;
  activeDesc: string;
  activeCooldown: number; // in seconds
  isInvertedDiet?: boolean; // True for Carnivore Megalodon!
}

export type MapThemeId = 'coral_lagoon' | 'sunken_atlantis' | 'magma_sea';

export interface MapTheme {
  id: MapThemeId;
  name: string;
  realmNumber: number;
  levelRange: string;
  minLevel: number;
  bgGradTop: string;
  bgGradMid: string;
  bgGradBottom: string;
  causticColor: string;
  seabedTop: string;
  seabedBottom: string;
  seaweedColor: string;
  ambientBubbleColor: string;
  tagline: string;
}

export interface ActivePowerUps {
  magnet: number;     // Remaining seconds
  shield: number;     // 1 if active, 0 if consumed
  multiplier: number; // Remaining seconds
  freeze: number;     // Remaining seconds
  clover: number;     // Remaining seconds
}

export interface GameStats {
  score: number;
  highScore: number;
  coins: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentMap: MapThemeId;
  lives: number;
  combo: number;
  maxCombo: number;
  totalVeggiesEaten: number;
  frenzyTimer: number;
  activePowerUps: ActivePowerUps;
  abilityCooldownRemaining: number;
  veggieCounts: {
    lettuce: number;
    tomato: number;
    broccoli: number;
    carrot: number;
    avocado: number;
    rainbow_salad: number;
  };
  meatHits: number;
  powerUpsCollected: {
    magnet: number;
    shield: number;
    multiplier: number;
    freeze_clock: number;
    lucky_clover: number;
    bubble_tornado: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  maxCombo: number;
  level: number;
  skinId: string;
  mapId: string;
  createdAt: string;
}
