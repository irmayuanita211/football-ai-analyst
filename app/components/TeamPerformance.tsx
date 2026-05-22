'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Team {
  position: number;
  team: { id: number; name: string; crest: string };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}

const COMPETITIONS = [
  { name: 'Premier League', id: '2021' },
  { name: 'La Liga', id: '2014' },
  { name: 'Bundesliga', id: '2002' },
  { name: 'Serie A', id: '2019' },
  { name: 'Ligue 1', id: '2015' },
];

function generateMockStandings(): Team[] {
  const data = [
    { name: 'Arsenal', crest: 'https://crests.football-data.org/57.png', p: 38, w: 27, d: 8, l: 3, gf: 89, ga: 28 },
    { name: 'Manchester City', crest: 'https://crests.football-data.org/65.png', p: 38, w: 26, d: 6, l: 6, gf: 91, ga: 34 },
    { name: 'Liverpool', crest: 'https://crests.football-data.org/64.png', p: 38, w: 25, d: 7, l: 6, gf: 85, ga: 38 },
    { name: 'Chelsea', crest: 'https://crests.football-data.org/61.png', p: 38, w: 21, d: 8, l: 9, gf: 77, ga: 44 },
    { name: 'Tottenham', crest: 'https://crests.football-data.org/73.png', p: 38, w: 20, d: 6, l: 12, gf: 74, ga: 54 },
    { name: 'Newcastle', crest: 'https://crests.football-data.org/57.png', p: 38, w: 19, d: 6, l: 13, gf: 65, ga: 47 },
    { name: 'Man United', crest: 'https://crests.football-data.org/66.png', p: 38, w: 18, d: 6, l: 14, gf: 57, ga: 58 },
    { name: 'Brighton', crest: 'https://crests.football-data.org/397.png', p: 38, w: 17, d: 7, l: 14, gf: 62, ga: 55 },
    { name: 'Aston Villa', crest: 'https://crests.football-data.org/58.png', p: 38, w: 16, d: 7, l: 15, gf: 58, ga: 58 },
    { name: 'West Ham', crest: 'https://crests.football-data.org/56.png', p: 38, w: 15, d: 7, l: 16, gf: 52, ga: 55 },
    { name: 'Crystal Palace', crest: 'https://crests.football-data.org/354.png', p: 38, w: 13, d: 9, l: 16, gf: 49, ga: 54 },
    { name: 'Fulham', crest: 'https://crests.football-data.org/63.png', p: 38, w: 13, d: 8, l: 17, gf: 51, ga: 59 },
    { name: 'Wolves', crest: 'https://crests.football-data.org/56.png', p: 38, w: 12, d: 8, l: 18, gf: 46, ga: 62 },
    { name: 'Bournemouth', crest: 'https://crests.football-data.org/1048.png', p: 38, w: 12, d: 7, l: 19, gf: 42, ga: 61 },
    { name: 'Brentford', crest: 'https://crests.football-data.org/402.png', p: 38, w: 11, d: 9, l: 18, gf: 55, ga: 62 },
    { name: 'Everton', crest: 'https://crests.football-data.org/62.png', p: 38, w: 10, d: 9, l: 19, gf: 40, ga: 55 },
    { name: "Nottm Forest", crest: 'https://crests.football-data.org/351.png', p: 38, w: 9, d: 9, l: 20, gf: 49, ga: 66 },
    { name: 'Burnley', crest: 'https://crests.football-data.org/328.png', p: 38, w: 8, d: 6, l: 24, gf: 33, ga: 65 },
    { name: 'Sheffield United', crest: 'https://crests.football-data.org/356.png', p: 38, w: 6, d: 8, l: 24, gf: 34, ga: 78 },
    { name: 'Luton Town', crest: 'https://crests.football-data.org/389.png', p: 38, w: 6, d: 8, l: 24, gf: 32, ga: 74 },
  ];
  return data.map((d, i) => ({
    position: i + 1,
    team: { id: i + 100, name: d.name, crest: d.crest },
    playedGames: d.p, won: d.w, draw: d.d, lost: d.l,
    goalsFor: d.gf, goalsAgainst: d.ga, goalDifference: d.gf - d.ga,
    points: d.w * 3 + d.d,
    form: '',
  }));
}

const COLORS = ['#10b981', '#6b7280', '#ef4444'];

export default function TeamPerformance() {
  const [standings, setStandings] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComp, setSelectedComp] = useState('2021');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const fetchStandings = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedTeam(null);
    try {
      const res = await fetch(`/api/football?endpoint=competitions/${selectedComp}/standings`);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setStandings(data.standings?.[0]?.table || data.table || []);
    } catch {
      setStandings(generateMockStandings());
    } finally {
      setLoading(false);
    }
  }, [selectedComp]);

  useEffect(() => { fetchStandings(); }, [fetchStandings]);

  const chartData = selectedTeam
    ? [{ name: 'Goals', scored: selectedTeam.goalsFor, conceded: selectedTeam.goalsAgainst }]
    : [];

  const pieData = selectedTeam
    ? [
        { name: 'Menang', value: selectedTeam.won },
        { name: 'Seri', value: selectedTeam.draw },
        { name: 'Kalah', value: selectedTeam.lost },
      ]
    : [];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white">📊 Performa Tim</h2>
        <select value={selectedComp} onChange={(e) => setSelectedComp(e.target.value)} className="bg-gray-900/80 border border-gray-800 text-white rounded-xl px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none transition-all">
          {COMPETITIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-red-400 mb-3">⚠️ {error}</p>
          <button onClick={fetchStandings} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all">Coba Lagi</button>
        </div>
      )}

      {loading ? (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-800">
              <div className="w-6 h-4 bg-gray-800 rounded shimmer" />
              <div className="w-8 h-8 bg-gray-800 rounded-full shimmer" />
              <div className="h-4 bg-gray-800 rounded w-32 shimmer" />
              <div className="flex-1" />
              <div className="h-4 bg-gray-800 rounded w-8 shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Standings Table */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px] gap-2 px-4 py-3 border-b border-gray-800 text-xs text-gray-500 font-medium">
              <span>#</span><span>Tim</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GF</span><span>GA</span><span>GD</span><span className="text-right">Pts</span>
            </div>
            {standings.map((row) => (
              <div
                key={row.team.id}
                onClick={() => setSelectedTeam(selectedTeam?.team.id === row.team.id ? null : row)}
                className={`grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px] gap-2 px-4 py-3 border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/30 transition-all items-center ${
                  selectedTeam?.team.id === row.team.id ? 'bg-emerald-500/10' : ''
                } ${
                  row.position <= 4 ? 'border-l-2 border-l-emerald-500' : row.position >= 18 ? 'border-l-2 border-l-red-500' : ''
                }`}
              >
                <span className="text-gray-400 text-sm">{row.position}</span>
                <div className="flex items-center gap-2">
                  {row.team.crest && <img src={row.team.crest} alt="" className="w-6 h-6 object-contain" />}
                  <span className="text-white text-sm font-medium truncate">{row.team.name}</span>
                </div>
                <span className="text-gray-400 text-sm">{row.playedGames}</span>
                <span className="text-gray-400 text-sm">{row.won}</span>
                <span className="text-gray-400 text-sm">{row.draw}</span>
                <span className="text-gray-400 text-sm">{row.lost}</span>
                <span className="text-gray-400 text-sm">{row.goalsFor}</span>
                <span className="text-gray-400 text-sm">{row.goalsAgainst}</span>
                <span className={`text-sm ${row.goalDifference > 0 ? 'text-emerald-400' : row.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'}`}>{row.goalDifference > 0 ? '+' : ''}{row.goalDifference}</span>
                <span className="text-white font-bold text-sm text-right">{row.points}</span>
              </div>
            ))}
          </div>

          {/* Team Detail Panel */}
          {selectedTeam && (
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 fade-in space-y-6">
              <div className="flex items-center gap-3">
                {selectedTeam.team.crest && <img src={selectedTeam.team.crest} alt="" className="w-12 h-12 object-contain" />}
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedTeam.team.name}</h3>
                  <p className="text-gray-400 text-sm">Posisi #{selectedTeam.position} • {selectedTeam.points} poin</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{((selectedTeam.won / selectedTeam.playedGames) * 100).toFixed(0)}%</p>
                  <p className="text-gray-400 text-xs mt-1">Win Rate</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{(selectedTeam.goalsFor / selectedTeam.playedGames).toFixed(2)}</p>
                  <p className="text-gray-400 text-xs mt-1">Goals/Game</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">{selectedTeam.draw}</p>
                  <p className="text-gray-400 text-xs mt-1">Draws</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{selectedTeam.goalsFor - selectedTeam.goalsAgainst > 0 ? '+' : ''}{selectedTeam.goalsFor - selectedTeam.goalsAgainst}</p>
                  <p className="text-gray-400 text-xs mt-1">Goal Diff</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Goals Scored vs Conceded</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: selectedTeam.team.name, scored: selectedTeam.goalsFor, conceded: selectedTeam.goalsAgainst }]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
                        <Bar dataKey="scored" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="conceded" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Win / Draw / Loss</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                          {pieData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
