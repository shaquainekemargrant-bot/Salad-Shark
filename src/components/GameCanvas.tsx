import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FallingItem, Particle, FloatingMemeText, GameStats, VeggieKind, MeatKind, PowerUpKind } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import {
  SHARK_SKINS,
  MAP_THEMES,
  getMapThemeForLevel,
  MEME_CRUNCH_PHRASES,
  MEME_MEAT_PHRASES,
  MEME_COMBO_PHRASES,
  MEME_LEAP_PHRASES,
  MEME_POWERUP_PHRASES,
  MEME_ABILITY_PHRASES,
  MEME_CARNIVORE_CRUNCH_PHRASES,
  MEME_CARNIVORE_VEGGIE_HURT_PHRASES,
} from '../utils/constants';

interface GameCanvasProps {
  stats: GameStats;
  onUpdateStats: (updater: (prev: GameStats) => GameStats) => void;
  onGameOver: () => void;
  activeHat: string;
  activeSkinId: string;
  isPaused: boolean;
  leapTriggerRef?: React.MutableRefObject<(() => void) | null>;
  abilityTriggerRef?: React.MutableRefObject<(() => void) | null>;
}

// Map Dimensions
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 680;
const BASE_Y = 570;

export const GameCanvas: React.FC<GameCanvasProps> = ({
  stats,
  onUpdateStats,
  onGameOver,
  activeHat,
  activeSkinId,
  isPaused,
  leapTriggerRef,
  abilityTriggerRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active Skin Definition
  const activeSkin = SHARK_SKINS.find((s) => s.id === activeSkinId) || SHARK_SKINS[0];

  // Shark physics & position
  const sharkRef = useRef({
    x: MAP_WIDTH / 2,
    y: BASE_Y,
    baseY: BASE_Y,
    vy: 0,
    isLeaping: false,
    targetX: MAP_WIDTH / 2,
    width: 124,
    height: 72,
    tilt: 0,
    swimPhase: 0,
    chompTimer: 0,
    hitTimer: 0,
    facingLeft: false,
    mouthOpen: 0,
  });

  const gameStateRef = useRef({
    items: [] as FallingItem[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingMemeText[],
    ambientBubbles: [] as { x: number; y: number; size: number; speed: number; phase: number }[],
    nextItemId: 1,
    nextParticleId: 1,
    nextTextId: 1,
    lastSpawnTime: 0,
    lastPowerUpSpawnTime: 0,
    gameStartTime: Date.now(),
    screenShake: 0,
    comboStreak: 0,
    lives: stats.lives,
    coins: stats.coins,
    level: stats.level,
    xp: stats.xp,
    xpToNextLevel: stats.xpToNextLevel || 10,
    magnetTimer: 0,
    hasShield: false,
    multiplierTimer: 0,
    freezeTimer: 0,
    cloverTimer: 0,
    abilityCooldownRemaining: 0,
    bloodFrenzyTimer: 0,
    statSyncTimer: 0,
    carnivoreMeatStreak: 0,
  });

  // Sync ref values with stats prop
  useEffect(() => {
    gameStateRef.current.lives = stats.lives;
    gameStateRef.current.coins = stats.coins;
    gameStateRef.current.level = stats.level;
    gameStateRef.current.xp = stats.xp;
    gameStateRef.current.xpToNextLevel = stats.xpToNextLevel || 10;
  }, [stats.lives, stats.coins, stats.level, stats.xp, stats.xpToNextLevel]);

  const [shakeClass, setShakeClass] = useState('');

  // Setup ambient bubbles across map
  useEffect(() => {
    const bubbles = [];
    for (let i = 0; i < 48; i++) {
      bubbles.push({
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        size: 3 + Math.random() * 9,
        speed: 0.6 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    gameStateRef.current.ambientBubbles = bubbles;
    gameStateRef.current.gameStartTime = Date.now();
  }, []);

  // Trigger floating meme text
  const addFloatingText = useCallback(
    (text: string, x: number, y: number, color: string, scale = 1) => {
      gameStateRef.current.floatingTexts.push({
        id: gameStateRef.current.nextTextId++,
        text,
        x: Math.max(90, Math.min(MAP_WIDTH - 90, x)),
        y,
        color,
        rotation: (Math.random() - 0.5) * 16,
        life: 0,
        maxLife: 48,
        scale,
      });
    },
    []
  );

  // Trigger particles
  const spawnParticles = useCallback(
    (x: number, y: number, color: string, count: number, shape: Particle['shape'] = 'leaf') => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6.5;
        gameStateRef.current.particles.push({
          id: gameStateRef.current.nextParticleId++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          life: 0,
          maxLife: 20 + Math.random() * 26,
          color,
          size: shape === 'ring' ? 9 + Math.random() * 9 : 4 + Math.random() * 6,
          shape,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.3,
        });
      }
    },
    []
  );

  // --- LEAP ACTION TRIGGER ---
  const triggerLeap = useCallback(() => {
    const shark = sharkRef.current;
    if (isPaused) return;

    if (!shark.isLeaping || (shark.y > shark.baseY - 55 && shark.vy > 0)) {
      shark.isLeaping = true;
      // Passive speed bonus for natural shark
      const leapVel = activeSkin.id === 'natural' ? -780 : -730;
      shark.vy = leapVel;
      soundEngine.playSharkLeap();

      // Spawn takeoff splash bubbles
      spawnParticles(shark.x, shark.y + 15, 'rgba(255, 255, 255, 0.9)', 16, 'bubble');
      spawnParticles(shark.x - 22, shark.y + 10, activeSkin.colorPrimary, 10, 'spark');
      spawnParticles(shark.x + 22, shark.y + 10, activeSkin.colorPrimary, 10, 'spark');

      const leapPhrase = MEME_LEAP_PHRASES[Math.floor(Math.random() * MEME_LEAP_PHRASES.length)];
      addFloatingText(leapPhrase, shark.x, shark.y - 50, activeSkin.colorPrimary, 1.25);
    }
  }, [isPaused, activeSkin, spawnParticles, addFloatingText]);

  // --- ACTIVE ABILITY TRIGGER ---
  const triggerActiveAbility = useCallback(() => {
    if (isPaused) return;
    const state = gameStateRef.current;
    const shark = sharkRef.current;

    if (state.abilityCooldownRemaining > 0) {
      soundEngine.playMeatHit();
      return;
    }

    // Set cooldown
    state.abilityCooldownRemaining = activeSkin.activeCooldown;
    soundEngine.playAbilityTrigger(activeSkin.id);

    const phrase = MEME_ABILITY_PHRASES[activeSkin.id] || '⚡ SKILL ACTIVATED!';
    addFloatingText(phrase, shark.x, shark.y - 75, activeSkin.colorPrimary, 1.45);

    // Specific Ability Implementations
    if (activeSkin.id === 'natural') {
      // BUBBLE DASH: Rapid surge forward + bubble barrier
      shark.targetX = shark.facingLeft ? Math.max(100, shark.x - 360) : Math.min(MAP_WIDTH - 100, shark.x + 360);
      shark.x = shark.targetX;
      spawnParticles(shark.x, shark.y, '#38bdf8', 35, 'bubble');
      spawnParticles(shark.x, shark.y, '#ffffff', 20, 'spark');
      // Snatches any items within 240px
      state.items.forEach((item) => {
        if (Math.abs(item.x - shark.x) < 220) {
          item.y = shark.y - 10;
        }
      });
    } else if (activeSkin.id === 'lettuce_frenzy') {
      // SALAD VORTEX: Sucks all on-screen veggies straight to the shark!
      state.items.forEach((item) => {
        if (!item.isMeat) {
          item.vx = (shark.x - item.x) * 4;
          item.vy = (shark.y - item.y) * 4;
        }
      });
      spawnParticles(shark.x, shark.y, '#22c55e', 36, 'leaf');
      spawnParticles(shark.x, shark.y, '#15803d', 20, 'ring');
    } else if (activeSkin.id === 'master_chef') {
      // GOURMET FEAST: Drops 4 Golden Avocados & Carrots from the top!
      for (let g = 0; g < 4; g++) {
        state.items.push({
          id: state.nextItemId++,
          x: 150 + g * 280 + (Math.random() - 0.5) * 60,
          y: -50 - g * 35,
          vx: (Math.random() - 0.5) * 20,
          vy: 180,
          size: 46,
          rotation: 0,
          vRot: (Math.random() - 0.5) * 2,
          isMeat: false,
          isPowerUp: false,
          kind: g % 2 === 0 ? 'avocado' : 'carrot',
          points: 5,
          wobblePhase: Math.random() * Math.PI,
          wobbleSpeed: 2.5,
        });
      }
      spawnParticles(shark.x, shark.y, '#f97316', 25, 'star');
    } else if (activeSkin.id === 'royal_king') {
      // MIDAS TOUCH: Turns up to 4 nearest meats into Golden Carrots (+5 pts)!
      let transmuted = 0;
      state.items.forEach((item) => {
        if (item.isMeat && transmuted < 4) {
          item.isMeat = false;
          item.kind = 'carrot';
          item.points = 5;
          transmuted++;
          spawnParticles(item.x, item.y, '#eab308', 18, 'ring');
          spawnParticles(item.x, item.y, '#ffffff', 10, 'spark');
        }
      });
      spawnParticles(shark.x, shark.y, '#eab308', 35, 'star');
    } else if (activeSkin.id === 'carnivore_megalodon') {
      // BLOOD FRENZY: Clears all falling veggies and 4X meat score for 8 seconds!
      state.bloodFrenzyTimer = 8;
      // Vaporize veggies
      state.items = state.items.filter((item) => {
        if (!item.isMeat && !item.isPowerUp) {
          spawnParticles(item.x, item.y, '#dc2626', 10, 'spark');
          return false;
        }
        return true;
      });
      spawnParticles(shark.x, shark.y, '#dc2626', 40, 'splat');
      spawnParticles(shark.x, shark.y, '#7f1d1d', 20, 'ring');
    }
  }, [isPaused, activeSkin, addFloatingText, spawnParticles]);

  // Connect external refs
  useEffect(() => {
    if (leapTriggerRef) leapTriggerRef.current = triggerLeap;
    if (abilityTriggerRef) abilityTriggerRef.current = triggerActiveAbility;
    return () => {
      if (leapTriggerRef) leapTriggerRef.current = null;
      if (abilityTriggerRef) abilityTriggerRef.current = null;
    };
  }, [leapTriggerRef, abilityTriggerRef, triggerLeap, triggerActiveAbility]);

  // Keyboard navigation & Shortcuts (Space: Leap, E: Ability)
  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
        keysPressed[e.code] = true;
      }
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        triggerLeap();
      }
      if (['KeyE', 'KeyQ'].includes(e.code)) {
        e.preventDefault();
        triggerActiveAbility();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
        keysPressed[e.code] = false;
      }
    };

    const keyInterval = setInterval(() => {
      if (isPaused) return;
      // Passive speed bonus for natural shark
      const speed = activeSkin.id === 'natural' ? 28 : 24;
      if (keysPressed['ArrowLeft'] || keysPressed['KeyA']) {
        sharkRef.current.targetX = Math.max(70, sharkRef.current.targetX - speed);
      }
      if (keysPressed['ArrowRight'] || keysPressed['KeyD']) {
        sharkRef.current.targetX = Math.min(MAP_WIDTH - 70, sharkRef.current.targetX + speed);
      }
    }, 16);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      clearInterval(keyInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, triggerLeap, triggerActiveAbility, activeSkin]);

  // Pointer drag controls (Mouse & Touch)
  const handlePointerMove = (clientX: number) => {
    if (isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = MAP_WIDTH / rect.width;
    const canvasX = (clientX - rect.left) * scaleX;
    sharkRef.current.targetX = Math.max(70, Math.min(MAP_WIDTH - 70, canvasX));
  };

  // Main Canvas Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = MAP_WIDTH;
    canvas.height = MAP_HEIGHT;

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      if (!isPaused) {
        updateGame(dt);
      }

      renderGame(ctx, MAP_WIDTH, MAP_HEIGHT);
      animationFrameId = requestAnimationFrame(loop);
    };

    // --- GAME UPDATE LOGIC ---
    const updateGame = (dt: number) => {
      const shark = sharkRef.current;
      const state = gameStateRef.current;

      // Update Timed Power-Ups & Ability Cooldown
      if (state.magnetTimer > 0) state.magnetTimer = Math.max(0, state.magnetTimer - dt);
      if (state.multiplierTimer > 0) state.multiplierTimer = Math.max(0, state.multiplierTimer - dt);
      if (state.freezeTimer > 0) state.freezeTimer = Math.max(0, state.freezeTimer - dt);
      if (state.cloverTimer > 0) state.cloverTimer = Math.max(0, state.cloverTimer - dt);
      if (state.bloodFrenzyTimer > 0) state.bloodFrenzyTimer = Math.max(0, state.bloodFrenzyTimer - dt);
      if (state.abilityCooldownRemaining > 0) {
        state.abilityCooldownRemaining = Math.max(0, state.abilityCooldownRemaining - dt);
      }

      // Periodically sync powerup timers and stats with React state
      state.statSyncTimer += dt;
      if (state.statSyncTimer >= 0.1) {
        state.statSyncTimer = 0;
        onUpdateStats((prev) => ({
          ...prev,
          abilityCooldownRemaining: state.abilityCooldownRemaining,
          activePowerUps: {
            magnet: Math.ceil(state.magnetTimer),
            shield: state.hasShield ? 1 : 0,
            multiplier: Math.ceil(state.multiplierTimer),
            freeze: Math.ceil(state.freezeTimer),
            clover: Math.ceil(state.cloverTimer),
          },
        }));
      }

      // Smooth horizontal lerp towards targetX
      const prevX = shark.x;
      const lerpSpeed = activeSkin.id === 'natural' ? 0.25 : 0.22;
      shark.x += (shark.targetX - shark.x) * lerpSpeed;
      const dx = shark.x - prevX;

      // Leaping Physics
      if (shark.isLeaping) {
        shark.vy += 1520 * dt;
        shark.y += shark.vy * dt;

        if (Math.random() < 0.6) {
          spawnParticles(shark.x - 30, shark.y + 10, 'rgba(255, 255, 255, 0.75)', 1, 'bubble');
        }

        if (shark.y >= shark.baseY) {
          shark.y = shark.baseY;
          shark.vy = 0;
          shark.isLeaping = false;

          spawnParticles(shark.x, shark.baseY + 12, 'rgba(255, 255, 255, 0.85)', 12, 'bubble');
          spawnParticles(shark.x, shark.baseY + 12, activeSkin.colorPrimary, 8, 'splat');
        }
      } else {
        shark.y = shark.baseY;
      }

      // Dynamics & Animations
      shark.swimPhase += dt * 8;
      shark.facingLeft = dx < -0.3 ? true : dx > 0.3 ? false : shark.facingLeft;

      const targetTilt = shark.isLeaping
        ? Math.max(-35, Math.min(35, shark.vy * 0.05 + dx * 0.8))
        : Math.max(-15, Math.min(15, dx * 1.8));
      shark.tilt += (targetTilt - shark.tilt) * 0.25;

      if (shark.chompTimer > 0) {
        shark.chompTimer -= dt;
        shark.mouthOpen = Math.sin(shark.chompTimer * 25) * 0.5 + 0.5;
      } else {
        shark.mouthOpen = 0;
      }

      if (shark.hitTimer > 0) {
        shark.hitTimer -= dt;
      }

      // Dynamic Tempo scaling based on score
      const currentScore = stats.score;
      const speedMultiplier = 1 + Math.min(currentScore * 0.025, 2.5);
      soundEngine.setDynamicTempo(speedMultiplier);

      // --- SPAWN FALLING ITEMS & POWER-UPS ---
      const now = Date.now();
      const dynamicSpawnRate = Math.max(320, 950 - currentScore * 14);

      if (now - state.lastSpawnTime > dynamicSpawnRate) {
        state.lastSpawnTime = now;

        const timeSincePowerUp = now - state.lastPowerUpSpawnTime;
        const spawnPowerUp = Math.random() < 0.1 || (timeSincePowerUp > 10000 && Math.random() < 0.5);

        if (spawnPowerUp) {
          state.lastPowerUpSpawnTime = now;
          const powerUpTypes: PowerUpKind[] = [
            'magnet',
            'shield',
            'score_multiplier',
            'freeze_clock',
            'lucky_clover',
          ];
          const pKind = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

          state.items.push({
            id: state.nextItemId++,
            x: 80 + Math.random() * (MAP_WIDTH - 160),
            y: -45,
            vx: (Math.random() - 0.5) * 35,
            vy: 140 * speedMultiplier,
            size: 48,
            rotation: 0,
            vRot: (Math.random() - 0.5) * 2,
            isMeat: false,
            isPowerUp: true,
            kind: pKind,
            points: 0,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 2.5,
          });
        } else {
          // Meat vs Veggie logic (Meat frequency higher if Carnivore to feed, or higher at deep levels)
          const meatChance = activeSkin.isInvertedDiet
            ? 0.52
            : Math.min(0.48, 0.22 + currentScore * 0.0035 + (state.level - 1) * 0.02);
          const isMeat = Math.random() < meatChance;

          let kind: VeggieKind | MeatKind;
          let points = 1;

          if (isMeat) {
            // New Meat variants: bacon_bomb, toxic_meatball, flying_cleaver!
            const meats: MeatKind[] = [
              'steak',
              'bacon',
              'chicken',
              'sausage',
              'meatball',
              'bacon_bomb',
              'toxic_meatball',
              'flying_cleaver',
            ];
            kind = meats[Math.floor(Math.random() * meats.length)];
          } else {
            const rand = Math.random();
            if (rand < 0.07) {
              kind = 'avocado';
              points = 5;
            } else if (rand < 0.15) {
              kind = 'rainbow_salad';
              points = 3;
            } else if (rand < 0.42) {
              kind = 'lettuce';
            } else if (rand < 0.68) {
              kind = 'tomato';
            } else if (rand < 0.88) {
              kind = 'broccoli';
            } else {
              kind = 'carrot';
            }
          }

          const baseFallSpeed = 160 + Math.random() * 80;
          // If Freeze Clock active, slow time by 55%!
          const timeSlowFactor = state.freezeTimer > 0 ? 0.45 : 1;
          const finalVy = baseFallSpeed * speedMultiplier * timeSlowFactor;

          state.items.push({
            id: state.nextItemId++,
            x: 60 + Math.random() * (MAP_WIDTH - 120),
            y: -40,
            vx: (Math.random() - 0.5) * 45 * timeSlowFactor,
            vy: finalVy,
            size: isMeat ? 42 : kind === 'avocado' ? 46 : 38,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 3,
            isMeat,
            isPowerUp: false,
            kind,
            points,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 2 + Math.random() * 3,
          });
        }
      }

      // Update ambient bubbles
      state.ambientBubbles.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(shark.swimPhase + b.phase) * 0.4;
        if (b.y < -20) {
          b.y = MAP_HEIGHT + 20;
          b.x = Math.random() * MAP_WIDTH;
        }
      });

      // Shark mouth collision coordinates
      const sharkMouthY = shark.y - 12;
      const sharkRadiusX = 56;
      const sharkRadiusY = 36;

      // --- MAGNET EFFECT: ATTRACT ITEMS ---
      const isMagnetActive = state.magnetTimer > 0;
      // Passive attraction bonus for lettuce skin (+35% radius)
      const magnetRadius = (isMagnetActive ? 560 : 0) * (activeSkin.id === 'lettuce_frenzy' ? 1.35 : 1.0);

      if (magnetRadius > 0) {
        state.items.forEach((item) => {
          // Attract food that player wants to eat! (Veggies for normal, Meats for carnivore)
          const isAttracted = activeSkin.isInvertedDiet ? item.isMeat : !item.isMeat && !item.isPowerUp;
          if (isAttracted) {
            const mdx = shark.x - item.x;
            const mdy = sharkMouthY - item.y;
            const dist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (dist < magnetRadius) {
              const pullForce = (magnetRadius - dist) * 2.8 + 280;
              item.x += (mdx / dist) * pullForce * dt;
              item.y += (mdy / dist) * pullForce * dt;

              if (Math.random() < 0.12) {
                spawnParticles(item.x, item.y, activeSkin.colorPrimary, 1, 'spark');
              }
            }
          }
        });
      }

      // --- LEVEL UP CHECK HELPER ---
      const grantXpAndCheckLevelUp = (amount = 1) => {
        state.xp += amount;
        let leveledUp = false;

        while (state.xp >= state.xpToNextLevel) {
          state.level += 1;
          state.xp = state.xp - state.xpToNextLevel;
          state.xpToNextLevel = 10 + state.level * 5;
          // Award +100 Coins on Level Up!
          state.coins += 100;
          leveledUp = true;

          soundEngine.playLevelUp();
          addFloatingText(`⭐ LEVEL UP! LEVEL ${state.level} (+100🪙)`, shark.x, shark.y - 85, '#fbbf24', 1.5);
          spawnParticles(shark.x, shark.y, '#f59e0b', 32, 'star');

          // Check if Map Realm Transitions (Levels 1-5 Lagoon, 6-10 Atlantis, 11+ Magma)
          const newMapTheme = getMapThemeForLevel(state.level);
          if (newMapTheme.id !== stats.currentMap) {
            soundEngine.playMapTransition();
            addFloatingText(
              `🌊 NEW REALM: ${newMapTheme.name.toUpperCase()}!`,
              MAP_WIDTH / 2,
              220,
              newMapTheme.seabedTop,
              1.7
            );
            spawnParticles(MAP_WIDTH / 2, 220, '#ffffff', 40, 'ring');
          }
        }

        return leveledUp;
      };

      // --- UPDATE ITEMS & COLLISION DETECTION ---
      const isShieldActive = state.hasShield;
      const isMultiplierActive = state.multiplierTimer > 0;
      const isBloodFrenzyActive = state.bloodFrenzyTimer > 0;

      for (let i = state.items.length - 1; i >= 0; i--) {
        const item = state.items[i];
        item.y += item.vy * dt;
        item.x += item.vx * dt + Math.sin(shark.swimPhase * 0.5 + item.wobblePhase) * 0.6;
        item.rotation += item.vRot * dt;

        // Bounding check on screen edges
        if (item.x < 35) {
          item.x = 35;
          item.vx = Math.abs(item.vx);
        }
        if (item.x > MAP_WIDTH - 35) {
          item.x = MAP_WIDTH - 35;
          item.vx = -Math.abs(item.vx);
        }

        // Toxic meatball poison particle smoke
        if (item.kind === 'toxic_meatball' && Math.random() < 0.25) {
          spawnParticles(item.x, item.y, '#22c55e', 1, 'bubble');
        }

        // Collision check
        const distX = Math.abs(item.x - shark.x);
        const distY = Math.abs(item.y - sharkMouthY);
        const effectiveRadX = isShieldActive ? sharkRadiusX + 16 : sharkRadiusX;
        const effectiveRadY = isShieldActive ? sharkRadiusY + 16 : sharkRadiusY;
        const isColliding = distX < effectiveRadX + item.size * 0.4 && distY < effectiveRadY + item.size * 0.4;

        if (isColliding) {
          // 1. POWER-UP COLLECTED
          if (item.isPowerUp) {
            const pKind = item.kind as PowerUpKind;
            const soundKey = pKind === 'score_multiplier' ? 'multiplier' : pKind;
            soundEngine.playPowerUpPickup(soundKey as 'magnet' | 'shield' | 'multiplier');
            shark.chompTimer = 0.25;

            // Powerup bonus coins for Master Chef skin
            if (activeSkin.id === 'master_chef') {
              state.coins += 2;
            }

            // Duration multiplier for Royal King skin (+50% duration)
            const durationMultiplier = activeSkin.id === 'royal_king' ? 1.5 : 1.0;

            if (pKind === 'magnet') {
              state.magnetTimer = 10 * durationMultiplier;
              spawnParticles(item.x, item.y, '#38bdf8', 20, 'spark');
              addFloatingText(MEME_POWERUP_PHRASES.magnet, shark.x, shark.y - 70, '#38bdf8', 1.35);
            } else if (pKind === 'shield') {
              state.hasShield = true;
              spawnParticles(item.x, item.y, '#34d399', 24, 'ring');
              addFloatingText('🛡️ 1-HIT SHIELD READY!', shark.x, shark.y - 70, '#34d399', 1.35);
            } else if (pKind === 'score_multiplier') {
              state.multiplierTimer = 10 * durationMultiplier;
              spawnParticles(item.x, item.y, '#fbbf24', 24, 'star');
              addFloatingText(MEME_POWERUP_PHRASES.score_multiplier, shark.x, shark.y - 70, '#fbbf24', 1.4);
            } else if (pKind === 'freeze_clock') {
              state.freezeTimer = 6 * durationMultiplier;
              spawnParticles(item.x, item.y, '#06b6d4', 24, 'bubble');
              addFloatingText(MEME_POWERUP_PHRASES.freeze_clock, shark.x, shark.y - 70, '#06b6d4', 1.4);
            } else if (pKind === 'lucky_clover') {
              state.cloverTimer = 6;
              state.coins += 15;
              soundEngine.playCoinPickup();
              spawnParticles(item.x, item.y, '#10b981', 30, 'star');
              addFloatingText('🍀 LUCKY CLOVER (+15 COINS!)', shark.x, shark.y - 70, '#10b981', 1.4);
            }

            onUpdateStats((prev) => ({
              ...prev,
              coins: state.coins,
              activePowerUps: {
                ...prev.activePowerUps,
                shield: state.hasShield ? 1 : 0,
              },
            }));

            state.items.splice(i, 1);
            continue;
          }

          // 2. INVERTED DIET (CARNIVORE MEGALODON) vs STANDARD HERBIVORE DIET
          const isCarnivore = !!activeSkin.isInvertedDiet;
          const isHarmful = isCarnivore ? !item.isMeat : item.isMeat;

          if (isHarmful) {
            // Player hit something that hurts them (Veggies hurt Carnivore; Meats hurt Herbivore)
            if (isShieldActive) {
              soundEngine.playShieldDeflect();
              state.hasShield = false;

              spawnParticles(shark.x, shark.y, '#34d399', 22, 'ring');
              spawnParticles(item.x, item.y, activeSkin.colorPrimary, 16, 'spark');
              addFloatingText('🛡️ 1-HIT DEFLECTED!', shark.x, shark.y - 65, '#34d399', 1.35);

              onUpdateStats((prev) => ({
                ...prev,
                activePowerUps: {
                  ...prev.activePowerUps,
                  shield: 0,
                },
              }));
            } else {
              // DAMAGE HIT! Lose 1 Life!
              if (isCarnivore) {
                soundEngine.playCarnivoreVeggieHurt();
              } else {
                soundEngine.playMeatHit();
              }

              shark.hitTimer = 0.6;
              state.comboStreak = 0;
              state.carnivoreMeatStreak = 0;

              setShakeClass('screen-shake-intense');
              setTimeout(() => setShakeClass(''), 360);

              const hitColor = isCarnivore ? '#22c55e' : '#ef4444';
              spawnParticles(item.x, item.y, hitColor, 16, 'splat');

              const phrases = isCarnivore ? MEME_CARNIVORE_VEGGIE_HURT_PHRASES : MEME_MEAT_PHRASES;
              const phrase = phrases[Math.floor(Math.random() * phrases.length)];
              addFloatingText(phrase, shark.x, shark.y - 60, hitColor, 1.25);

              onUpdateStats((prev) => {
                const newLives = prev.lives - 1;
                if (newLives <= 0) {
                  soundEngine.playGameOver();
                  setTimeout(() => onGameOver(), 450);
                }
                return {
                  ...prev,
                  lives: Math.max(0, newLives),
                  combo: 0,
                  meatHits: prev.meatHits + 1,
                };
              });
            }

            state.items.splice(i, 1);
            continue;
          }

          // 3. FOOD CHOMP! (Veggie for Herbivore, Meat for Carnivore)
          shark.chompTimer = 0.25;
          state.comboStreak += 1;

          // Coins on each chomp (+1 Coin every 3 chomps, plus bonus for Master Chef)
          let coinsEarned = 0;
          if (state.comboStreak % 3 === 0) {
            coinsEarned += 1;
          }
          if (activeSkin.id === 'master_chef' && state.comboStreak % 5 === 0) {
            coinsEarned += 2;
          }
          state.coins += coinsEarned;
          if (coinsEarned > 0) soundEngine.playCoinPickup();

          // Calculate points
          let itemBasePoints = item.points || 1;
          if (isCarnivore && item.isMeat) {
            // Carnivore eating meat!
            soundEngine.playCarnivoreChomp();
            itemBasePoints = isBloodFrenzyActive ? 4 : 2;
            state.carnivoreMeatStreak += 1;

            // Heal +1 life on high meat streaks if damaged!
            if (state.lives < 3 && state.carnivoreMeatStreak % 8 === 0) {
              state.lives = Math.min(3, state.lives + 1);
              soundEngine.playPowerUp();
              addFloatingText('🥩 HEALED +1 LIFE!', shark.x, shark.y - 80, '#ef4444', 1.4);
            }
          } else {
            const vKind = item.kind as VeggieKind;
            soundEngine.playVeggieMunch(vKind === 'rainbow_salad' ? 'avocado' : vKind);
          }

          const multiplierFactor = isMultiplierActive ? 2 : 1;
          const finalPoints = itemBasePoints * multiplierFactor;
          const isMidAir = shark.isLeaping && shark.y < shark.baseY - 50;

          // Floating Text & Combo Multiplier Trigger
          // Prompt requirement: "On major tier milestones like 3x 5x 10x and 20x" with dynamic scaling and color tiers!
          if ([3, 5, 10, 20].includes(state.comboStreak)) {
            soundEngine.playComboMultiplier(state.comboStreak);
            const tierColor =
              state.comboStreak === 3
                ? '#34d399'
                : state.comboStreak === 5
                ? '#38bdf8'
                : state.comboStreak === 10
                ? '#fbbf24'
                : '#ec4899';
            const tierScale = state.comboStreak >= 10 ? 1.6 : 1.4;
            addFloatingText(`🔥 ${state.comboStreak}X MULTIPLIER!`, shark.x, shark.y - 75, tierColor, tierScale);
            spawnParticles(shark.x, shark.y, tierColor, 20, 'star');
          } else if (state.comboStreak > 1 && state.comboStreak % 5 === 0) {
            soundEngine.playComboMultiplier(state.comboStreak);
            const comboPhrase =
              MEME_COMBO_PHRASES[Math.min(MEME_COMBO_PHRASES.length - 1, Math.floor(state.comboStreak / 5))];
            addFloatingText(`${comboPhrase} (+${state.comboStreak}x)`, shark.x, shark.y - 70, '#34d399', 1.35);
          } else if (isMidAir) {
            addFloatingText(`+${finalPoints} AIR CHOMP! ✈️`, item.x, item.y - 25, '#38bdf8', 1.25);
          } else if (isMultiplierActive) {
            addFloatingText(`+${finalPoints} (2X BONUS!)`, item.x, item.y - 25, '#fbbf24', 1.25);
          } else {
            const phrases = isCarnivore ? MEME_CARNIVORE_CRUNCH_PHRASES : MEME_CRUNCH_PHRASES;
            const phrase = phrases[Math.floor(Math.random() * phrases.length)];
            addFloatingText(`+${finalPoints} ${phrase}`, item.x, item.y - 20, activeSkin.colorPrimary, 1.1);
          }

          // Particles
          const particleColor = isCarnivore
            ? '#ef4444'
            : item.kind === 'tomato'
            ? '#f43f5e'
            : item.kind === 'carrot'
            ? '#f97316'
            : item.kind === 'avocado'
            ? '#fbbf24'
            : item.kind === 'broccoli'
            ? '#22c55e'
            : '#4ade80';

          spawnParticles(item.x, item.y, particleColor, 12, item.kind === 'avocado' ? 'star' : 'leaf');

          // Grant XP towards Permanent Account Level!
          const xpEarned = item.kind === 'rainbow_salad' ? 3 : item.kind === 'avocado' ? 2 : 1;
          grantXpAndCheckLevelUp(xpEarned);

          onUpdateStats((prev) => {
            const newScore = prev.score + finalPoints;
            const newHighScore = Math.max(prev.highScore, newScore);
            const newMaxCombo = Math.max(prev.maxCombo, state.comboStreak);
            const breakdownKey = item.kind as keyof GameStats['veggieCounts'];
            const activeTheme = getMapThemeForLevel(state.level);

            return {
              ...prev,
              score: newScore,
              highScore: newHighScore,
              coins: state.coins,
              level: state.level,
              xp: state.xp,
              xpToNextLevel: state.xpToNextLevel,
              currentMap: activeTheme.id,
              lives: state.lives,
              combo: state.comboStreak,
              maxCombo: newMaxCombo,
              totalVeggiesEaten: prev.totalVeggiesEaten + 1,
              veggieCounts: {
                ...prev.veggieCounts,
                ...(prev.veggieCounts[breakdownKey] !== undefined
                  ? { [breakdownKey]: prev.veggieCounts[breakdownKey] + 1 }
                  : {}),
              },
            };
          });

          state.items.splice(i, 1);
          continue;
        }

        // Remove off-screen items
        if (item.y > MAP_HEIGHT + 60) {
          state.items.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.rotation += p.rotSpeed;
        p.life += 1;
        if (p.life >= p.maxLife) {
          state.particles.splice(i, 1);
        }
      }

      // Update Floating Texts
      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y -= 1.4;
        ft.life += 1;
        if (ft.life >= ft.maxLife) {
          state.floatingTexts.splice(i, 1);
        }
      }
    };

    // --- GAME RENDER LOGIC ---
    const renderGame = (c: CanvasRenderingContext2D, w: number, h: number) => {
      c.clearRect(0, 0, w, h);

      // 1. Dynamic Map Realm Ocean Environment (Lagoon, Atlantis, Magma Sea)
      const currentMapTheme = getMapThemeForLevel(stats.level);

      const oceanGrad = c.createLinearGradient(0, 0, 0, h);
      oceanGrad.addColorStop(0, currentMapTheme.bgGradTop);
      oceanGrad.addColorStop(0.55, currentMapTheme.bgGradMid);
      oceanGrad.addColorStop(1, currentMapTheme.bgGradBottom);
      c.fillStyle = oceanGrad;
      c.fillRect(0, 0, w, h);

      // Dynamic Underwater Sunbeams / Magma Vents
      c.save();
      c.globalAlpha = 0.22;
      for (let i = 0; i < 6; i++) {
        c.fillStyle = currentMapTheme.causticColor;
        c.beginPath();
        const startX = 140 + i * 190;
        const drift = Math.sin(sharkRef.current.swimPhase * 0.3 + i) * 35;
        c.moveTo(startX + drift, 0);
        c.lineTo(startX + 90 + drift, 0);
        c.lineTo(startX + 210 + drift, h);
        c.lineTo(startX + 60 + drift, h);
        c.closePath();
        c.fill();
      }
      c.restore();

      // Ancient Atlantean Columns for Sunken Atlantis (Levels 6-10)
      if (currentMapTheme.id === 'sunken_atlantis') {
        c.save();
        c.fillStyle = 'rgba(30, 27, 75, 0.45)';
        c.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        c.lineWidth = 3;
        [120, 980].forEach((colX) => {
          c.fillRect(colX - 35, 180, 70, 420);
          c.strokeRect(colX - 35, 180, 70, 420);
          // Pillar Cap
          c.fillRect(colX - 45, 160, 90, 25);
          c.strokeRect(colX - 45, 160, 90, 25);
        });
        c.restore();
      }

      // Molten Hydrothermal Vents for Magma Sea (Levels 11+)
      if (currentMapTheme.id === 'magma_sea') {
        c.save();
        [200, 600, 1000].forEach((vx) => {
          c.fillStyle = '#292524';
          c.beginPath();
          c.moveTo(vx - 40, h - 30);
          c.lineTo(vx - 15, h - 110);
          c.lineTo(vx + 15, h - 110);
          c.lineTo(vx + 40, h - 30);
          c.closePath();
          c.fill();
          // Molten Vent Glow
          c.fillStyle = 'rgba(239, 68, 68, 0.6)';
          c.beginPath();
          c.ellipse(vx, h - 110, 18, 6, 0, 0, Math.PI * 2);
          c.fill();
        });
        c.restore();
      }

      // Ambient Bubbles
      gameStateRef.current.ambientBubbles.forEach((b) => {
        c.save();
        c.fillStyle = currentMapTheme.ambientBubbleColor;
        c.beginPath();
        c.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        c.lineWidth = 1;
        c.stroke();
        c.restore();
      });

      // Seabed Gradient & Terrain
      const seabedGrad = c.createLinearGradient(0, h - 60, 0, h);
      seabedGrad.addColorStop(0, currentMapTheme.seabedTop);
      seabedGrad.addColorStop(1, currentMapTheme.seabedBottom);
      c.fillStyle = seabedGrad;
      c.beginPath();
      c.moveTo(0, h - 50);
      for (let x = 0; x <= w; x += 100) {
        const yOffset = Math.sin(x * 0.008 + sharkRef.current.swimPhase * 0.1) * 14;
        c.lineTo(x, h - 50 + yOffset);
      }
      c.lineTo(w, h);
      c.lineTo(0, h);
      c.closePath();
      c.fill();

      // Seaweed Fronds
      for (let i = 0; i < 9; i++) {
        const sx = 70 + i * 135;
        const wave = Math.sin(sharkRef.current.swimPhase * 0.8 + i) * 18;
        c.strokeStyle = currentMapTheme.seaweedColor;
        c.lineWidth = 11;
        c.lineCap = 'round';
        c.beginPath();
        c.moveTo(sx, h - 35);
        c.quadraticCurveTo(sx + wave, h - 90, sx - wave * 0.5, h - 135);
        c.quadraticCurveTo(sx + wave * 1.5, h - 170, sx, h - 200);
        c.stroke();
      }

      // 2. Render Falling Items & Power-ups
      gameStateRef.current.items.forEach((item) => {
        renderItem(c, item);
      });

      // 3. Render Shark Character with Active Skin & Power-Up Auras
      renderShark(
        c,
        sharkRef.current,
        activeHat,
        activeSkin,
        gameStateRef.current.hasShield,
        gameStateRef.current.magnetTimer > 0,
        gameStateRef.current.multiplierTimer > 0,
        gameStateRef.current.freezeTimer > 0,
        gameStateRef.current.bloodFrenzyTimer > 0
      );

      // 4. Render Active Particles
      gameStateRef.current.particles.forEach((p) => {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rotation);
        const alpha = 1 - p.life / p.maxLife;
        c.globalAlpha = Math.max(0, alpha);

        if (p.shape === 'leaf') {
          c.fillStyle = p.color;
          c.beginPath();
          c.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          c.fill();
        } else if (p.shape === 'star') {
          c.fillStyle = p.color;
          c.beginPath();
          for (let s = 0; s < 5; s++) {
            c.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size);
            c.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.5), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.5));
          }
          c.closePath();
          c.fill();
        } else if (p.shape === 'bubble' || p.shape === 'ring') {
          c.strokeStyle = p.color;
          c.lineWidth = 2;
          c.beginPath();
          c.arc(0, 0, p.size, 0, Math.PI * 2);
          c.stroke();
        } else {
          c.fillStyle = p.color;
          c.beginPath();
          c.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      });

      // 5. Render Floating Meme Comic Texts
      gameStateRef.current.floatingTexts.forEach((ft) => {
        c.save();
        c.translate(ft.x, ft.y);
        c.rotate((ft.rotation * Math.PI) / 180);
        const alpha = 1 - ft.life / ft.maxLife;
        c.globalAlpha = Math.max(0, alpha);

        const currentScale = ft.scale * (1 + Math.sin((ft.life / ft.maxLife) * Math.PI) * 0.15);
        c.scale(currentScale, currentScale);

        c.font = '900 18px "Fredoka", cursive, sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';

        c.lineWidth = 4;
        c.strokeStyle = '#090d16';
        c.strokeText(ft.text, 0, 0);

        c.fillStyle = ft.color;
        c.fillText(ft.text, 0, 0);
        c.restore();
      });
    };

    // --- ITEM & POWER-UP RENDERER ---
    const renderItem = (c: CanvasRenderingContext2D, item: FallingItem) => {
      c.save();
      c.translate(item.x, item.y);
      c.rotate(item.rotation);

      if (item.isPowerUp) {
        const pKind = item.kind as PowerUpKind;
        const pulse = Math.sin(Date.now() * 0.008) * 4;

        c.save();
        c.beginPath();
        c.arc(0, 0, 26 + pulse, 0, Math.PI * 2);
        c.fillStyle =
          pKind === 'magnet'
            ? 'rgba(56, 189, 248, 0.25)'
            : pKind === 'shield'
            ? 'rgba(52, 211, 153, 0.3)'
            : pKind === 'freeze_clock'
            ? 'rgba(6, 182, 212, 0.35)'
            : pKind === 'lucky_clover'
            ? 'rgba(16, 185, 129, 0.35)'
            : 'rgba(251, 191, 36, 0.35)';
        c.fill();
        c.restore();

        if (pKind === 'magnet') {
          c.lineWidth = 9;
          c.strokeStyle = '#ef4444';
          c.beginPath();
          c.arc(0, -2, 14, Math.PI, 0, false);
          c.stroke();

          c.fillStyle = '#f1f5f9';
          c.fillRect(-18, -4, 9, 12);
          c.fillRect(9, -4, 9, 12);
        } else if (pKind === 'shield') {
          const shGrad = c.createRadialGradient(-4, -4, 2, 0, 0, 22);
          shGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          shGrad.addColorStop(0.3, 'rgba(52, 211, 153, 0.6)');
          shGrad.addColorStop(1, '#059669');

          c.fillStyle = shGrad;
          c.beginPath();
          c.arc(0, 0, 20, 0, Math.PI * 2);
          c.fill();
          c.strokeStyle = '#a7f3d0';
          c.lineWidth = 2.5;
          c.stroke();
        } else if (pKind === 'score_multiplier') {
          c.fillStyle = '#f59e0b';
          c.beginPath();
          c.arc(0, 0, 21, 0, Math.PI * 2);
          c.fill();

          c.fillStyle = '#fde047';
          c.beginPath();
          c.arc(0, 0, 17, 0, Math.PI * 2);
          c.fill();

          c.fillStyle = '#78350f';
          c.font = '900 16px "Fredoka", sans-serif';
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText('2X', 0, 1);
        } else if (pKind === 'freeze_clock') {
          c.fillStyle = '#06b6d4';
          c.beginPath();
          c.arc(0, 0, 20, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#cffafe';
          c.beginPath();
          c.arc(0, 0, 16, 0, Math.PI * 2);
          c.fill();
          c.strokeStyle = '#0891b2';
          c.lineWidth = 2.5;
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(0, -10);
          c.moveTo(0, 0);
          c.lineTo(7, 0);
          c.stroke();
        } else if (pKind === 'lucky_clover') {
          c.fillStyle = '#10b981';
          c.font = '28px serif';
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText('🍀', 0, 0);
        }

        c.restore();
        return;
      }

      if (item.isMeat) {
        const mKind = item.kind as MeatKind;

        if (mKind === 'steak') {
          c.fillStyle = '#dc2626';
          c.beginPath();
          c.ellipse(0, 0, 22, 16, 0.2, 0, Math.PI * 2);
          c.fill();
          c.lineWidth = 2.5;
          c.strokeStyle = '#7f1d1d';
          c.stroke();

          c.fillStyle = '#fef2f2';
          c.beginPath();
          c.arc(-4, -2, 4, 0, Math.PI * 2);
          c.arc(3, 3, 3, 0, Math.PI * 2);
          c.fill();
        } else if (mKind === 'bacon' || mKind === 'bacon_bomb') {
          c.fillStyle = '#b91c1c';
          c.beginPath();
          c.roundRect(-22, -10, 44, 20, 6);
          c.fill();
          c.fillStyle = '#fecaca';
          c.beginPath();
          c.rect(-20, -4, 40, 4);
          c.rect(-20, 3, 40, 3);
          c.fill();
          if (mKind === 'bacon_bomb') {
            c.fillStyle = '#f59e0b';
            c.font = '14px sans-serif';
            c.fillText('💣', 6, -6);
          }
        } else if (mKind === 'chicken') {
          c.fillStyle = '#b45309';
          c.beginPath();
          c.ellipse(-4, 0, 16, 12, 0, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#f8fafc';
          c.beginPath();
          c.rect(10, -4, 12, 8);
          c.arc(22, -4, 4, 0, Math.PI * 2);
          c.arc(22, 4, 4, 0, Math.PI * 2);
          c.fill();
        } else if (mKind === 'flying_cleaver') {
          // Sharp metal cleaver obstacle
          c.fillStyle = '#94a3b8';
          c.fillRect(-18, -12, 28, 24);
          c.fillStyle = '#78350f';
          c.fillRect(10, -5, 14, 10);
          c.strokeStyle = '#f8fafc';
          c.lineWidth = 2;
          c.strokeRect(-18, -12, 28, 24);
        } else if (mKind === 'toxic_meatball') {
          // Green toxic smoke meatball
          c.fillStyle = '#3f3f46';
          c.beginPath();
          c.arc(0, 0, 19, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#22c55e';
          c.beginPath();
          c.arc(-4, -4, 4, 0, Math.PI * 2);
          c.arc(5, 5, 5, 0, Math.PI * 2);
          c.fill();
        } else {
          c.fillStyle = '#991b1b';
          c.beginPath();
          c.arc(0, 0, 18, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#fca5a5';
          c.beginPath();
          c.arc(-4, -4, 3, 0, Math.PI * 2);
          c.arc(4, 2, 2.5, 0, Math.PI * 2);
          c.fill();
        }
      } else {
        const vKind = item.kind as VeggieKind;

        if (vKind === 'lettuce') {
          c.fillStyle = '#22c55e';
          c.beginPath();
          c.arc(0, 0, 18, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#86efac';
          c.beginPath();
          c.arc(-4, -2, 10, 0, Math.PI * 2);
          c.fill();
        } else if (vKind === 'tomato') {
          c.fillStyle = '#ef4444';
          c.beginPath();
          c.arc(0, 2, 18, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#15803d';
          c.beginPath();
          c.moveTo(0, -14);
          c.lineTo(-6, -8);
          c.lineTo(6, -8);
          c.closePath();
          c.fill();
        } else if (vKind === 'broccoli') {
          c.fillStyle = '#16a34a';
          c.beginPath();
          c.arc(-8, -4, 10, 0, Math.PI * 2);
          c.arc(8, -4, 10, 0, Math.PI * 2);
          c.arc(0, -12, 12, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#86efac';
          c.fillRect(-4, 2, 8, 14);
        } else if (vKind === 'carrot') {
          c.fillStyle = '#f97316';
          c.beginPath();
          c.moveTo(0, 16);
          c.lineTo(12, -14);
          c.lineTo(-12, -14);
          c.closePath();
          c.fill();
          c.fillStyle = '#22c55e';
          c.beginPath();
          c.moveTo(0, -14);
          c.lineTo(-6, -24);
          c.lineTo(0, -20);
          c.lineTo(6, -24);
          c.closePath();
          c.fill();
        } else if (vKind === 'avocado') {
          c.fillStyle = '#eab308';
          c.shadowColor = '#fde047';
          c.shadowBlur = 15;
          c.beginPath();
          c.ellipse(0, 0, 18, 24, 0, 0, Math.PI * 2);
          c.fill();
          c.shadowBlur = 0;
          c.fillStyle = '#854d0e';
          c.beginPath();
          c.arc(0, 4, 9, 0, Math.PI * 2);
          c.fill();
        } else {
          // Rainbow Salad Bowl
          c.fillStyle = '#b45309';
          c.beginPath();
          c.arc(0, 4, 18, 0, Math.PI);
          c.fill();
          c.fillStyle = '#22c55e';
          c.beginPath();
          c.arc(-8, 0, 8, 0, Math.PI * 2);
          c.arc(8, 0, 8, 0, Math.PI * 2);
          c.arc(0, -5, 9, 0, Math.PI * 2);
          c.fill();
        }
      }

      c.restore();
    };

    // --- SHARK MASCOT RENDERER WITH SKINS ---
    const renderShark = (
      c: CanvasRenderingContext2D,
      shark: typeof sharkRef.current,
      hat: string,
      skin: typeof activeSkin,
      hasShield: boolean,
      hasMagnet: boolean,
      hasMultiplier: boolean,
      hasFreeze: boolean,
      hasBloodFrenzy: boolean
    ) => {
      c.save();
      c.translate(shark.x, shark.y);
      c.rotate((shark.tilt * Math.PI) / 180);
      if (shark.facingLeft) {
        c.scale(-1, 1);
      }

      // Blood Frenzy Crimson Aura
      if (hasBloodFrenzy) {
        c.save();
        c.fillStyle = 'rgba(220, 38, 38, 0.4)';
        c.beginPath();
        c.arc(0, 0, 68 + Math.sin(Date.now() * 0.02) * 8, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#ef4444';
        c.lineWidth = 3;
        c.stroke();
        c.restore();
      }

      // Multiplier Gold Aura
      if (hasMultiplier) {
        c.save();
        const mTime = Date.now() * 0.01;
        c.fillStyle = 'rgba(251, 191, 36, 0.35)';
        c.beginPath();
        c.arc(0, 0, 62 + Math.sin(mTime) * 6, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#f59e0b';
        c.lineWidth = 3;
        c.setLineDash([8, 8]);
        c.stroke();
        c.restore();
      }

      // Magnet Blue Aura
      if (hasMagnet) {
        c.save();
        const magPhase = (Date.now() * 0.005) % 1;
        c.strokeStyle = `rgba(56, 189, 248, ${0.8 - magPhase * 0.7})`;
        c.lineWidth = 2.5;
        c.beginPath();
        c.arc(22, 0, 38 + magPhase * 44, -1, 1);
        c.stroke();
        c.restore();
      }

      // Time Freeze Cyan Ice Aura
      if (hasFreeze) {
        c.save();
        c.strokeStyle = 'rgba(6, 182, 212, 0.8)';
        c.lineWidth = 3;
        c.beginPath();
        c.arc(0, 0, 56, 0, Math.PI * 2);
        c.stroke();
        c.restore();
      }

      // 1-Hit Shield Energy Forcefield Bubble
      if (hasShield) {
        c.save();
        const sTime = Date.now() * 0.006;
        const shieldPulse = Math.sin(sTime) * 3;
        c.fillStyle = 'rgba(52, 211, 153, 0.28)';
        c.beginPath();
        c.arc(0, 0, 64 + shieldPulse, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#34d399';
        c.lineWidth = 3;
        c.stroke();
        c.restore();
      }

      const isHit = shark.hitTimer > 0;
      const primaryCol = isHit ? '#f87171' : skin.colorPrimary;
      const secondaryCol = isHit ? '#ef4444' : skin.colorSecondary;
      const bellyCol = isHit ? '#fee2e2' : skin.colorBelly;

      // 1. Animated Tail Fin
      const tailWiggle = Math.sin(shark.swimPhase) * (shark.isLeaping ? 16 : 12);
      c.save();
      c.translate(-48, 0);
      c.rotate((tailWiggle * Math.PI) / 180);
      c.fillStyle = primaryCol;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-26, -22);
      c.quadraticCurveTo(-15, 0, -26, 22);
      c.closePath();
      c.fill();
      c.restore();

      // 2. Main Shark Body
      c.fillStyle = primaryCol;
      c.beginPath();
      c.moveTo(-48, 0);
      c.quadraticCurveTo(-22, -34, 22, -28);
      c.quadraticCurveTo(58, -13, 57, 4);
      c.quadraticCurveTo(48, 30, 0, 28);
      c.quadraticCurveTo(-38, 22, -48, 0);
      c.closePath();
      c.fill();

      // Top Dorsal Fin
      c.fillStyle = secondaryCol;
      c.beginPath();
      c.moveTo(-4, -28);
      c.quadraticCurveTo(-14, -50, 6, -48);
      c.quadraticCurveTo(4, -34, 15, -26);
      c.closePath();
      c.fill();

      // Shark Underbelly
      c.fillStyle = bellyCol;
      c.beginPath();
      c.moveTo(-38, 2);
      c.quadraticCurveTo(0, 4, 32, 0);
      c.quadraticCurveTo(50, 13, 38, 26);
      c.quadraticCurveTo(0, 28, -32, 18);
      c.closePath();
      c.fill();

      // Side Pectoral Fin
      const finFlap = Math.sin(shark.swimPhase * 1.2) * (shark.isLeaping ? 12 : 5);
      c.save();
      c.translate(5, 11);
      c.rotate((finFlap * Math.PI) / 180);
      c.fillStyle = secondaryCol;
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(-9, 22, 13, 20);
      c.quadraticCurveTo(9, 9, 4, 0);
      c.closePath();
      c.fill();
      c.restore();

      // Gills
      c.strokeStyle = secondaryCol;
      c.lineWidth = 2;
      for (let g = 0; g < 3; g++) {
        c.beginPath();
        c.arc(9 - g * 6, 2, 8, -0.6, 0.6);
        c.stroke();
      }

      // 3. Cute / Menacing Eye
      c.save();
      c.translate(34, -11);

      if (isHit) {
        c.strokeStyle = '#7f1d1d';
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(-5, -5);
        c.lineTo(5, 5);
        c.moveTo(5, -5);
        c.lineTo(-5, 5);
        c.stroke();
      } else {
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(0, 0, 8, 0, Math.PI * 2);
        c.fill();

        // Eye pupil (red if Carnivore Megalodon!)
        c.fillStyle = skin.isInvertedDiet ? '#991b1b' : '#0f172a';
        c.beginPath();
        c.arc(1.5, 0, 5, 0, Math.PI * 2);
        c.fill();

        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(3, -2, 2, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();

      // 4. Animated Chomping Mouth & Sharp Teeth
      c.save();
      c.translate(46, 9);
      const openAmount = shark.mouthOpen * 14;

      if (isHit) {
        c.strokeStyle = '#7f1d1d';
        c.lineWidth = 2.5;
        c.beginPath();
        c.arc(0, 4, 9, Math.PI * 0.9, Math.PI * 2.1);
        c.stroke();
      } else {
        c.fillStyle = skin.isInvertedDiet ? '#450a0a' : '#1e293b';
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(10, 6 + openAmount);
        c.lineTo(-6, 8 + openAmount);
        c.closePath();
        c.fill();

        // Sharp White Teeth
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.moveTo(2, 0);
        c.lineTo(4, 5);
        c.lineTo(6, 0);
        c.moveTo(-2, 0);
        c.lineTo(0, 5);
        c.lineTo(2, 0);
        c.fill();
      }
      c.restore();

      // 5. Render Equipped Hat
      if (hat !== 'none') {
        renderHat(c, hat);
      }

      c.restore();
    };

    // --- HAT ACCESSORY RENDERER ---
    const renderHat = (c: CanvasRenderingContext2D, hatId: string) => {
      c.save();
      if (hatId === 'salad_band') {
        c.translate(12, -26);
        c.rotate(-0.1);
        c.fillStyle = '#22c55e';
        c.fillRect(-22, -4, 44, 7);
        c.fillStyle = '#86efac';
        c.beginPath();
        c.ellipse(12, -8, 8, 5, 0.4, 0, Math.PI * 2);
        c.ellipse(-10, -7, 7, 4, -0.3, 0, Math.PI * 2);
        c.fill();
      } else if (hatId === 'sunglasses') {
        c.translate(34, -11);
        c.fillStyle = '#0f172a';
        c.fillRect(-4, -6, 16, 12);
        c.fillRect(-18, -4, 12, 10);
        c.fillRect(-6, -2, 4, 3);
        c.fillStyle = '#38bdf8';
        c.fillRect(-2, -4, 3, 8);
      } else if (hatId === 'chef_toque') {
        c.translate(14, -28);
        c.fillStyle = '#f8fafc';
        c.fillRect(-14, -8, 28, 8);
        c.beginPath();
        c.arc(-8, -14, 10, 0, Math.PI * 2);
        c.arc(8, -14, 10, 0, Math.PI * 2);
        c.arc(0, -18, 12, 0, Math.PI * 2);
        c.fill();
      } else if (hatId === 'golden_crown') {
        c.translate(14, -30);
        c.fillStyle = '#eab308';
        c.beginPath();
        c.moveTo(-16, 0);
        c.lineTo(-16, -16);
        c.lineTo(-8, -6);
        c.lineTo(0, -20);
        c.lineTo(8, -6);
        c.lineTo(16, -16);
        c.lineTo(16, 0);
        c.closePath();
        c.fill();
        c.fillStyle = '#ef4444';
        c.beginPath();
        c.arc(0, -6, 3, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, activeSkin, activeHat, stats.level, stats.score, stats.currentMap, onUpdateStats, onGameOver, spawnParticles, addFloatingText]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden touch-none ${shakeClass}`}
      onPointerDown={(e) => handlePointerMove(e.clientX)}
      onPointerMove={(e) => {
        if (e.buttons > 0 || e.pointerType === 'touch') {
          handlePointerMove(e.clientX);
        }
      }}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          handlePointerMove(e.touches[0].clientX);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          handlePointerMove(e.touches[0].clientX);
        }
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain rounded-2xl cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
