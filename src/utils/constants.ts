import { SharkHat, SharkSkin, MapTheme, MapThemeId } from '../types/game';

export const SHARK_HATS: SharkHat[] = [
  {
    id: 'none',
    name: 'Natural Shark',
    icon: '🦈',
    requiredVeggies: 0,
    description: 'Pure, aerodynamic, salad-craving sea predator.'
  },
  {
    id: 'salad_band',
    name: 'Lettuce Headband',
    icon: '🥬',
    requiredVeggies: 10,
    description: 'Fashioned from fresh crisp romaine leaves.'
  },
  {
    id: 'sunglasses',
    name: 'Meme Shades',
    icon: '🕶️',
    requiredVeggies: 25,
    description: 'Deal with the veggie lifestyle with cool pixel swag.'
  },
  {
    id: 'chef_toque',
    name: 'Salad Chef Hat',
    icon: '👨‍🍳',
    requiredVeggies: 50,
    description: 'Certified 5-star herbivorous Michelin master.'
  },
  {
    id: 'flower_bloom',
    name: 'Tropical Hibiscus',
    icon: '🌺',
    requiredVeggies: 80,
    description: 'A cute vibrant floral bloom behind the fin.'
  },
  {
    id: 'golden_crown',
    name: 'Vegan King Crown',
    icon: '👑',
    requiredVeggies: 120,
    description: 'Royalty of the underwater vegetable kingdom.'
  },
  {
    id: 'party_hat',
    name: 'Frenzy Party Cone',
    icon: '🎉',
    requiredVeggies: 180,
    description: 'Unlocks maximum chaotic party celebration.'
  }
];

export const SHARK_SKINS: SharkSkin[] = [
  {
    id: 'natural',
    name: 'Classic Salad Shark',
    tagline: 'The Original Herbivore Hero',
    priceCoins: 0,
    icon: '🦈',
    badge: 'DEFAULT',
    colorPrimary: '#38bdf8',     // Sky cyan
    colorSecondary: '#0284c7',   // Ocean blue
    colorBelly: '#f0fdf4',       // Soft mint white
    passiveName: 'Agile Swimmer',
    passiveDesc: '+15% Base Movement & Leap recovery speed',
    activeName: 'Bubble Dash',
    activeDesc: 'Quick surge forward creating a protective bubble trail',
    activeCooldown: 14,
    isInvertedDiet: false
  },
  {
    id: 'lettuce_frenzy',
    name: 'Lettuce Lurker',
    tagline: 'Camouflaged in Crispy Greens',
    priceCoins: 150,
    icon: '🥬',
    badge: 'VEGGIE FAVORITE',
    colorPrimary: '#22c55e',     // Emerald green
    colorSecondary: '#15803d',   // Deep leafy green
    colorBelly: '#dcfce7',       // Pale lettuce
    passiveName: 'Fiber Gravitation',
    passiveDesc: '+35% Magnet & Attraction radius for vegetables',
    activeName: 'Salad Vortex',
    activeDesc: 'Summons a swirling whirlpool that pulls all screen veggies directly to you!',
    activeCooldown: 16,
    isInvertedDiet: false
  },
  {
    id: 'master_chef',
    name: 'Master Chef Shark',
    tagline: '5-Star Michelin Marine Saladier',
    priceCoins: 300,
    icon: '👨‍🍳',
    badge: 'EPIC CHEF',
    colorPrimary: '#f97316',     // Bright apron orange
    colorSecondary: '#ea580c',   // Deep rust
    colorBelly: '#fff7ed',       // Clean chef white
    passiveName: 'Culinary Bounty',
    passiveDesc: 'Earn +2 extra Gold Coins on every combo milestone & power-up',
    activeName: 'Gourmet Feast',
    activeDesc: 'Rains down 4 rare Golden Veggies & Avocados across the screen!',
    activeCooldown: 18,
    isInvertedDiet: false
  },
  {
    id: 'royal_king',
    name: 'Vegan King Megalodon',
    tagline: 'Sovereign of the Underwater Greens',
    priceCoins: 500,
    icon: '👑',
    badge: 'LEGENDARY',
    colorPrimary: '#eab308',     // Imperial gold
    colorSecondary: '#ca8a04',   // Dark gold
    colorBelly: '#fefce8',       // Radiant ivory
    passiveName: 'Royal Decree',
    passiveDesc: 'Power-up durations last 50% longer & Deflects 1 extra hit per round',
    activeName: 'Midas Touch',
    activeDesc: 'Transmutes up to 4 nearest meat hazards into Golden Carrots (+5 pts)!',
    activeCooldown: 20,
    isInvertedDiet: false
  },
  {
    id: 'carnivore_megalodon',
    name: 'Carnivore Megalodon',
    tagline: 'The Inverted Predator (Carnivore Mode!)',
    priceCoins: 800,
    priceUsd: 2.99,
    isPremium: true,
    icon: '🥩',
    badge: 'PREMIUM INVERTED',
    colorPrimary: '#dc2626',     // Crimson red
    colorSecondary: '#991b1b',   // Blood burgundy
    colorBelly: '#450a0a',       // Dark obsidian
    passiveName: 'Inverted Appetite!',
    passiveDesc: 'Meat satisfies you (+1 pt & healing)! Veggies disgust you (-1 life)!',
    activeName: 'Blood Frenzy',
    activeDesc: 'Roars, vaporizes all falling veggies, and multiplies meat score 4X for 8 seconds!',
    activeCooldown: 22,
    isInvertedDiet: true
  }
];

export const MAP_THEMES: Record<MapThemeId, MapTheme> = {
  coral_lagoon: {
    id: 'coral_lagoon',
    name: 'Coral Lagoon',
    realmNumber: 1,
    levelRange: 'Levels 1–5',
    minLevel: 1,
    bgGradTop: '#0284c7',        // Vibrant sky cyan
    bgGradMid: '#0369a1',        // Lagoon blue
    bgGradBottom: '#082f49',     // Deep reef
    causticColor: 'rgba(255, 255, 255, 0.18)',
    seabedTop: '#14b8a6',
    seabedBottom: '#0f766e',
    seaweedColor: '#10b981',
    ambientBubbleColor: 'rgba(224, 242, 254, 0.4)',
    tagline: 'Sunlit coral reef with crisp falling garden greens'
  },
  sunken_atlantis: {
    id: 'sunken_atlantis',
    name: 'Sunken Atlantis',
    realmNumber: 2,
    levelRange: 'Levels 6–10',
    minLevel: 6,
    bgGradTop: '#1e1b4b',        // Midnight indigo
    bgGradMid: '#0f172a',        // Deep abyssal navy
    bgGradBottom: '#020617',     // Void black
    causticColor: 'rgba(129, 140, 248, 0.22)',
    seabedTop: '#312e81',
    seabedBottom: '#1e1b4b',
    seaweedColor: '#6366f1',
    ambientBubbleColor: 'rgba(199, 210, 254, 0.45)',
    tagline: 'Mystic ancient sunken ruins with glowing phosphorescent pillars'
  },
  magma_sea: {
    id: 'magma_sea',
    name: 'Magma Sea',
    realmNumber: 3,
    levelRange: 'Levels 11+',
    minLevel: 11,
    bgGradTop: '#7f1d1d',        // Volcanic crimson
    bgGradMid: '#450a0a',        // Molten abyss
    bgGradBottom: '#1c1917',     // Smoldering basalt
    causticColor: 'rgba(251, 146, 60, 0.25)',
    seabedTop: '#dc2626',
    seabedBottom: '#7f1d1d',
    seaweedColor: '#ea580c',
    ambientBubbleColor: 'rgba(254, 215, 170, 0.5)',
    tagline: 'Hyper-intense geothermal volcanic rift with boiling magma bubbles'
  }
};

export function getMapThemeForLevel(level: number): MapTheme {
  if (level >= 11) return MAP_THEMES.magma_sea;
  if (level >= 6) return MAP_THEMES.sunken_atlantis;
  return MAP_THEMES.coral_lagoon;
}

export const SECRET_CODES: Record<string, { rewardCoins: number; label: string }> = {
  UPDATE1: {
    rewardCoins: 500,
    label: 'Update 1 Celebration Bonus'
  },
  SharkSalad: {
    rewardCoins: 150,
    label: 'Salad Shark Community Code'
  }
};

export const MEME_CRUNCH_PHRASES = [
  'CRUNCH!',
  'FIBER GAINS!',
  'YUMMY GREENS!',
  'KALE YEAH!',
  'CRUNCH-TASTIC!',
  'NOM NOM!',
  '100% ORGANIC!',
  'VITAMIN BOOST!',
  'ANTIOXIDANTS!',
  'CRISP & FRESH!',
  'SALAD SUPREMACY!',
  'DELICIOUS CHLOROPHYLL!'
];

export const MEME_CARNIVORE_CRUNCH_PHRASES = [
  'MEAT CHOMP! 🥩',
  'JUICY STEAK! 🍖',
  'RAW POWER! ⚡',
  'CARNIVORE FRENZY! 🔥',
  'BACON CRUNCH! 🥓',
  'APEX PREDATOR! 🦈',
  'PROTEIN OVERLOAD! 💪'
];

export const MEME_MEAT_PHRASES = [
  'EW RAW MEAT!',
  'GROSS BLEGH!',
  'DISGUSTING!',
  'NOT VEGAN!',
  'CARNIVORE TRAP!',
  'MY DIGESTION!',
  'TAKE IT AWAY!',
  'SALAD RUINED!',
  'GREASY DISASTER!'
];

export const MEME_CARNIVORE_VEGGIE_HURT_PHRASES = [
  'YUCK VEGGIES! 🤮',
  'EW FIBER BURNS! 🤢',
  'GET THAT SALAD AWAY! 🥬',
  'POISONOUS GREENS! 💀',
  'MY ALLERGIES! 🍅'
];

export const MEME_COMBO_PHRASES = [
  'COMBO x2!',
  'SALAD SPREE!',
  'VEGAN RAMPAGE!',
  'MEGA CRUNCH!',
  'UNSTOPPABLE HERBIVORE!',
  'LEGENDARY GRAZER!'
];

export const MEME_LEAP_PHRASES = [
  'LEAP! 🚀',
  'AIR CHOMP! ✈️',
  'SKY SHARK! 🌊',
  'SUPER JUMP! 💥',
  'AEROBIC GREENS! ✨',
  'MID-AIR SNATCH! 🦈'
];

export const MEME_POWERUP_PHRASES: Record<string, string> = {
  magnet: '🧲 VEGGIE MAGNET!',
  shield: '🛡️ DEFLECTION SHIELD!',
  score_multiplier: '⚡ 2X DOUBLE SCORE!',
  freeze_clock: '⏱️ TIME FREEZE!',
  lucky_clover: '🍀 LUCKY CLOVER RAIN!',
  bubble_tornado: '🌪️ BUBBLE TORNADO!'
};

export const MEME_ABILITY_PHRASES: Record<string, string> = {
  natural: '💨 BUBBLE DASH!',
  lettuce_frenzy: '🌪️ SALAD VORTEX!',
  master_chef: '👨‍🍳 GOURMET FEAST!',
  royal_king: '👑 MIDAS TOUCH!',
  carnivore_megalodon: '🩸 BLOOD FRENZY!'
};

export function getRankTitle(score: number): { title: string; subtitle: string; icon: string } {
  if (score >= 120) {
    return {
      title: 'Supreme Vegan Megalodon',
      subtitle: 'Legendary guardian of the underwater organic sanctuary!',
      icon: '👑'
    };
  } else if (score >= 80) {
    return {
      title: 'Grand Herbivore Overlord',
      subtitle: 'The ocean bows before your relentless veggie appetite!',
      icon: '🥦'
    };
  } else if (score >= 50) {
    return {
      title: 'Broccoli Boss',
      subtitle: 'Master of fiber, dodger of unwholesome meats!',
      icon: '🥑'
    };
  } else if (score >= 25) {
    return {
      title: 'Romaine Rebel',
      subtitle: 'Snapping fresh greens and building serious momentum!',
      icon: '🥬'
    };
  } else if (score >= 10) {
    return {
      title: 'Sprout Nibbler',
      subtitle: 'Getting the hang of healthy marine dining.',
      icon: '🌱'
    };
  } else {
    return {
      title: 'Plankton Muncher',
      subtitle: 'Keep practicing your veggie chomping reflexes!',
      icon: '🫧'
    };
  }
}
