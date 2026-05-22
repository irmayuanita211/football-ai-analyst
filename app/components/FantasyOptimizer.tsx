'use client';

import { useState, useEffect } from 'react';

interface Player {
  name: string;
  team: string;
  position: string;
  price: number;
  projectedPoints: number;
}

interface FantasyTeam {
  formation: string;
  players: Player[];
  totalCost: number;
  totalProjectedPoints: number;
  explanation: string;
}

const MOCK_FANTASY: FantasyTeam = {
  formation: '4-3-3',
  players: [
    { name: 'Alisson', team: 'Liverpool', position: 'GK', price: 5.5, projectedPoints: 180 },
    { name: 'Alexander-Arnold', team: 'Liverpool', position: 'DEF', price: 8.0, projectedPoints: 195 },
    { name: 'Saliba', team: 'Arsenal', position: 'DEF', price: 6.0, projectedPoints: 175 },
    { name: 'Van Dijk', team: 'Liverpool', position: 'DEF', price: 6.5, projectedPoints: 165 },
    { name: 'Gabriel', team: 'Arsenal', position: 'DEF', price: 5.5, projectedPoints: 155 },
    { name: 'Saka', team: 'Arsenal', position: 'MID', price: 10.0, projectedPoints: 210 },
    { name: 'Odegaard', team: 'Arsenal', position: 'MID', price: 9.5, projectedPoints: 190 },
    { name: 'Salah', team: 'Liverpool', position: 'MID', price: 12.0, projectedPoints: 230 },
    { name: 'Haaland', team: 'Man City', position: 'FWD', price: 14.0, projectedPoints: 250 },
    { name: 'Palmer', team: 'Chelsea', position: 'FWD', price: 8.5, projectedPoints: 200 },
    { name: 'Son', team: 'Tottenham', position: 'FWD', price: 9.0, projectedPoints: 185 },
  ],
  totalCost: 94.5,
  totalProjectedPoints: 2135,
  explanation: 'AI telah menganalisis performa, fixture, dan value setiap pemain. Tim ini menggunakan formasi 4-3-3 dengan fokus pada pemain Liverpool dan Arsenal yang memiliki fixture mudah di gameweek berikutnya. Haaland dipilih sebagai kapten karena rekor golnya yang luar biasa.',
};

const POSITIONS = ['All', 'GK', 'DEF', 'MID', 'FWD'];
const LEAGUES = ['Premier League', 'La Liga', 'All'];

function getPitchPosition(player: Player, index: number, total: Record<string, number>, positions: { pos: string; indices: number[] }) {
  const playersInRow = positions.indices;
  const posIndex = positions.indices.indexOf(index);
  const cols = playersInRow.length;
  const row = positions.pos === 'GK' ? 0 : positions.pos === 'DEF' ? 1 : positions.pos === 'MID' ? 2 : 3;
  const rowY = [85, 62, 40, 18][row];
  const colX = cols === 1 ? 50 : 15 + (posIndex * (70 / (cols - 1 || 1)));
  return { top: `${rowY}%`, left: `${colX}%` };
}

function PitchFormation({ team }: { team: FantasyTeam }) {
  const positions: Record<string, number[]> = { GK: [], DEF: [], MID: [], FWD: [] };
  team.players.forEach((p, i) => { positions[p.position]?.push(i); });

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[2/3] rounded-2xl overflow-hidden border-2 border-emerald-600/50" style={{ background: 'linear-gradient(180deg, #1a5c2a 0%, #15662a 50%, #1a5c2a 100%)' }}>
      {/* Pitch markings */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[15%] border-b border-white/20 rounded-b-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[15%] border-t border-white/20 rounded-t-full" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/20" />
      </div>

      {/* Players */}
      {team.players.map((player, i) => {
        let row: number, col: number, cols: number;
        if (player.position === 'GK') { row = 85; cols = 1; col = 50; }
        else if (player.position === 'DEF') { row = 62; const pi = positions.DEF.indexOf(i); cols = positions.DEF.length; col = cols === 1 ? 50 : 15 + (pi * (70 / (cols - 1))); }
        else if (player.position === 'MID') { row = 38; const pi = positions.MID.indexOf(i); cols = positions.MID.length; col = cols === 1 ? 50 : 15 + (pi * (70 / (cols - 1))); }
        else { row = 15; const pi = positions.FWD.indexOf(i); cols = positions.FWD.length; col = cols === 1 ? 50 : 15 + (pi * (70 / (cols - 1))); }

        return (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 transition-all hover:scale-110" style={{ top: `${row}%`, left: `${col}%` }}>
            <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white/60 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {i + 1}
            </div>
            <span className="text-[9px] text-white font-medium bg-black/50 px-1 rounded whitespace-nowrap">{player.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function FantasyOptimizer() {
  const [budget, setBudget] = useState(100.0);
  const [league, setLeague] = useState('Premier League');
  const [positionFilter, setPositionFilter] = useState('All');
  const [team, setTeam] = useState<FantasyTeam | null>(null);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loadingText, setLoadingText] = useState('⚽ AI sedang menganalisis pemain...');

  useEffect(() => {
    if (!loading) return;
    const texts = [
      '⚽ AI sedang menganalisis pemain...',
      '📊 Menghitung expected points...',
      '🧠 Evaluasi formasi optimal...',
      '💰 Mengoptimalkan budget allocation...',
      '✨ Memilih kapten & wakil kapten...',
    ];
    let i = 0;
    const interval = setInterval(() => { i = (i + 1) % texts.length; setLoadingText(texts[i]); }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fantasy-team');
      if (saved) setTeam(JSON.parse(saved));
    } catch {}
  }, []);

  const generateTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Generate optimal fantasy XI for ${league} with budget ${budget}m. Position preference: ${positionFilter}. Return JSON with formation, players array (name, team, position, price, projectedPoints), totalCost, totalProjectedPoints, explanation.` }),
      });
      if (!res.ok) throw new Error('AI API error');
      const data = await res.json();
      setTeam(data.team || MOCK_FANTASY);
      localStorage.setItem('fantasy-team', JSON.stringify(data.team || MOCK_FANTASY));
    } catch {
      setTeam(MOCK_FANTASY);
      localStorage.setItem('fantasy-team', JSON.stringify(MOCK_FANTASY));
    } finally {
      setLoading(false);
    }
  };

  const copyTeam = () => {
    if (!team) return;
    const text = `${team.formation} Fantasy Team (${team.totalProjectedPoints} pts)\n\n` +
      team.players.map((p) => `${p.position} | ${p.name} (${p.team}) - £${p.price}m - ${p.projectedPoints}pts`).join('\n') +
      `\n\nTotal Cost: £${team.totalCost}m | Projected: ${team.totalProjectedPoints}pts`;
    navigator.clipboard.writeText(text);
  };

  const filteredPlayers = team?.players.filter((p) => positionFilter === 'All' || p.position === positionFilter);

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-2xl font-bold text-white">🤖 Fantasy Optimizer</h2>

      {/* Controls */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Budget (£m)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} step={0.5} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:border-emerald-500 focus:outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Liga</label>
            <select value={league} onChange={(e) => setLeague(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:border-emerald-500 focus:outline-none transition-all">
              {LEAGUES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Posisi</label>
            <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:border-emerald-500 focus:outline-none transition-all">
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <button onClick={generateTeam} disabled={loading} className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="animate-spin">⚽</span> {loadingText}
            </>
          ) : '🧠 Generate AI Team'}
        </button>
      </div>

      {loading && (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4 animate-bounce">⚽</div>
          <p className="text-white text-lg font-medium">{loadingText}</p>
          <div className="mt-4 w-48 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      )}

      {team && !loading && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{team.formation}</p>
              <p className="text-gray-400 text-xs mt-1">Formasi</p>
            </div>
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">£{team.totalCost}m</p>
              <p className="text-gray-400 text-xs mt-1">Total Cost</p>
              <p className="text-xs text-emerald-400 mt-0.5">Sisa £{(budget - team.totalCost).toFixed(1)}m</p>
            </div>
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{team.totalProjectedPoints}</p>
              <p className="text-gray-400 text-xs mt-1">Projected Pts</p>
            </div>
          </div>

          {/* Pitch View */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 text-center">⚽ Pitch View — {team.formation}</h3>
            <PitchFormation team={team} />
          </div>

          {/* Player List */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_60px_80px_80px] gap-2 px-4 py-3 border-b border-gray-800 text-xs text-gray-500 font-medium">
              <span>#</span><span>Pemain</span><span>Pos</span><span>Harga</span><span className="text-right">Pts</span>
            </div>
            {filteredPlayers?.map((player, i) => (
              <div key={i} className="grid grid-cols-[40px_1fr_60px_80px_80px] gap-2 px-4 py-3 border-b border-gray-800/50 items-center hover:bg-gray-800/30 transition-all">
                <span className="text-gray-400 text-sm">{team.players.indexOf(player) + 1}</span>
                <div>
                  <p className="text-white text-sm font-medium">{player.name}</p>
                  <p className="text-gray-500 text-xs">{player.team}</p>
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">{player.position}</span>
                <span className="text-white text-sm">£{player.price}m</span>
                <span className="text-white font-bold text-sm text-right">{player.projectedPoints}</span>
              </div>
            ))}
          </div>

          {/* AI Explanation */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
            <button onClick={() => setShowExplanation(!showExplanation)} className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-all">
              <span className="text-white font-medium text-sm">🧠 AI Explanation</span>
              <span className="text-gray-400 text-sm">{showExplanation ? '▲' : '▼'}</span>
            </button>
            {showExplanation && (
              <div className="px-4 pb-4 border-t border-gray-800">
                <p className="text-gray-300 text-sm mt-3 leading-relaxed">{team.explanation}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={copyTeam} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2">
              📋 Copy Team
            </button>
            <button onClick={generateTeam} disabled={loading} className="flex-1 px-4 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-xl transition-all text-sm font-medium">
              🔄 Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
