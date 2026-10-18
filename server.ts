import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent leaderboard data storage
const DATA_DIR = path.join(__dirname, 'data');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

const INITIAL_LEADERBOARD = [
  { id: 'lb-1', playerName: 'MegalodonKing', score: 260, maxCombo: 35, level: 14, skinId: 'carnivore_megalodon', mapId: 'magma_sea', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'lb-2', playerName: 'RomaineRebel', score: 215, maxCombo: 28, level: 12, skinId: 'royal_king', mapId: 'magma_sea', createdAt: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: 'lb-3', playerName: 'KaleConqueror', score: 185, maxCombo: 24, level: 9, skinId: 'lettuce_frenzy', mapId: 'sunken_atlantis', createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'lb-4', playerName: 'ChefSharky', score: 160, maxCombo: 20, level: 8, skinId: 'master_chef', mapId: 'sunken_atlantis', createdAt: new Date(Date.now() - 3600000 * 30).toISOString() },
  { id: 'lb-5', playerName: 'AvocadoAce', score: 142, maxCombo: 18, level: 7, skinId: 'natural', mapId: 'sunken_atlantis', createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
  { id: 'lb-6', playerName: 'OceanGrazer', score: 125, maxCombo: 16, level: 6, skinId: 'lettuce_frenzy', mapId: 'sunken_atlantis', createdAt: new Date(Date.now() - 3600000 * 60).toISOString() },
  { id: 'lb-7', playerName: 'BroccoliBiter', score: 110, maxCombo: 14, level: 5, skinId: 'master_chef', mapId: 'coral_lagoon', createdAt: new Date(Date.now() - 3600000 * 72).toISOString() },
  { id: 'lb-8', playerName: 'SaladSpinner', score: 95, maxCombo: 12, level: 4, skinId: 'natural', mapId: 'coral_lagoon', createdAt: new Date(Date.now() - 3600000 * 80).toISOString() },
  { id: 'lb-9', playerName: 'CrispyChomper', score: 82, maxCombo: 10, level: 3, skinId: 'natural', mapId: 'coral_lagoon', createdAt: new Date(Date.now() - 3600000 * 95).toISOString() },
  { id: 'lb-10', playerName: 'PlanktonPilot', score: 68, maxCombo: 8, level: 2, skinId: 'natural', mapId: 'coral_lagoon', createdAt: new Date(Date.now() - 3600000 * 110).toISOString() },
];

function getLeaderboardData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADERBOARD_FILE)) {
      fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(INITIAL_LEADERBOARD, null, 2));
      return INITIAL_LEADERBOARD;
    }
    const raw = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(INITIAL_LEADERBOARD, null, 2));
    return INITIAL_LEADERBOARD;
  } catch (err) {
    console.error('Error reading leaderboard file:', err);
    return INITIAL_LEADERBOARD;
  }
}

function saveLeaderboardData(entries: typeof INITIAL_LEADERBOARD) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(entries, null, 2));
  } catch (err) {
    console.error('Error saving leaderboard file:', err);
  }
}

// GET /api/leaderboard - Top 10 high scores
app.get('/api/leaderboard', (_req, res) => {
  const list = getLeaderboardData();
  const sorted = [...list].sort((a, b) => b.score - a.score).slice(0, 10);
  res.json({
    success: true,
    leaderboard: sorted,
    totalEntries: list.length,
  });
});

// POST /api/leaderboard - Submit new score
app.post('/api/leaderboard', (req, res) => {
  const { playerName, score, maxCombo, level, skinId, mapId } = req.body;

  if (typeof score !== 'number' || score < 0) {
    res.status(400).json({ success: false, error: 'Valid score is required' });
    return;
  }

  const cleanName = (playerName && typeof playerName === 'string' ? playerName.trim() : 'Anonymous Shark')
    .slice(0, 20) || 'Anonymous Shark';

  const newEntry = {
    id: `lb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    playerName: cleanName,
    score: Math.floor(score),
    maxCombo: Math.floor(maxCombo || 0),
    level: Math.floor(level || 1),
    skinId: skinId || 'natural',
    mapId: mapId || 'coral_lagoon',
    createdAt: new Date().toISOString(),
  };

  const currentList = getLeaderboardData();
  currentList.push(newEntry);
  currentList.sort((a, b) => b.score - a.score);

  // Keep top 50 in storage
  const trimmed = currentList.slice(0, 50);
  saveLeaderboardData(trimmed);

  const top10 = trimmed.slice(0, 10);
  const userRank = trimmed.findIndex((entry) => entry.id === newEntry.id) + 1;

  res.status(201).json({
    success: true,
    entry: newEntry,
    rank: userRank,
    isTop10: userRank <= 10,
    leaderboard: top10,
  });
});

// Mount Vite or serve static build
async function setupVite() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

setupVite();
