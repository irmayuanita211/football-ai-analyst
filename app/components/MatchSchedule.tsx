'use client';

import { useState, useEffect, useCallback } from 'react';

interface Match {
  id: number;
  homeTeam: { name: string; crest: string; id: number };
  awayTeam: { name: string; crest: string; id: number };
  score: { fullTime: { home: number; away: number }; halfTime: { home: number; away: number } } | null;
  status: string;
  utcDate: string;
  competition: { name: string; emblem: string; id: number };
}

const MOCK_SCHEDULE: Match[] = [
  { id: 1, homeTeam: { name: 'Arsenal', crest: 'https://crests.football-data.org/57.png', id: 57 }, awayTeam: { name: 'Chelsea', crest: 'https://crests.football-data.org/61.png', id: 61 }, score: { fullTime: { home: 2, away: 0 }, halfTime: { home: 1, away: 0 } }, status: 'FINISHED', utcDate: new Date().toISOString(), competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png', id: 2021 } },
  { id: 2, homeTeam: { name: 'Tottenham', crest: 'https://crests.football-data.org/73.png', id: 73 }, awayTeam: { name: 'Man City', crest: 'https://crests.football-data.org/65.png', id: 65 }, score: { fullTime: { home: 1, away: 1 }, halfTime: { home: 0, away: 1 } }, status: 'IN_PLAY', utcDate: new Date().toISOString(), competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png', id: 2021 } },
  { id: 3, homeTeam: { name: 'Newcastle', crest: 'https://crests.football-data.org/57.png', id: 57 }, awayTeam: { name: 'Brighton', crest: 'https://crests.football-data.org/397.png', id: 397 }, score: null, status: 'TIMED', utcDate: new Date(new Date().getTime() + 3 * 3600000).toISOString(), competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png', id: 2021 } },
  { id: 4, homeTeam: { name: 'Atletico Madrid', crest: 'https://crests.football-data.org/78.png', id: 78 }, awayTeam: { name: 'Sevilla', crest: 'https://crests.football-data.org/559.png', id: 559 }, score: { fullTime: { home: 1, away: 0 }, halfTime: { home: 0, away: 0 } }, status: 'IN_PLAY', utcDate: new Date().toISOString(), competition: { name: 'La Liga', emblem: 'https://crests.football-data.org/PD.png', id: 2014 } },
  { id: 5, homeTeam: { name: 'Bayern Munich', crest: 'https://crests.football-data.org/5.png', id: 5 }, awayTeam: { name: 'Dortmund', crest: 'https://crests.football-data.org/4.png', id: 4 }, score: null, status: 'TIMED', utcDate: new Date(new Date().getTime() + 5 * 3600000).toISOString(), competition: { name: 'Bundesliga', emblem: 'https://crests.football-data.org/BL1.png', id: 2002 } },
  { id: 6, homeTeam: { name: 'Juventus', crest: 'https://crests.football-data.org/108.png', id: 108 }, awayTeam: { name: 'Napoli', crest: 'https://crests.football-data.org/113.png', id: 113 }, score: null, status: 'SCHEDULED', utcDate: new Date(new Date().getTime() + 24 * 3600000).toISOString(), competition: { name: 'Serie A', emblem: 'https://crests.football-data.org/SA.png', id: 2019 } },
];

function formatDateID(date: Date): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTimeWIB(utcDate: string): string {
  const d = new Date(utcDate);
  d.setHours(d.getHours() + 7);
  return d.toTimeString().slice(0, 5);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    IN_PLAY: 'bg-red-500/20 text-red-400 border-red-500/30',
    FINISHED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    TIMED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    SCHEDULED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  const labels: Record<string, string> = { IN_PLAY: 'LIVE', FINISHED: 'FT', TIMED: 'TIMED', SCHEDULED: 'SCHEDULED' };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[status] || styles.SCHEDULED}`}>
      {status === 'IN_PLAY' && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse" />}
      {labels[status] || status}
    </span>
  );
}

export default function MatchSchedule() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/football?endpoint=matches');
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setMatches(data.matches || data || []);
    } catch {
      setMatches(MOCK_SCHEDULE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const statusOrder: Record<string, number> = { IN_PLAY: 0, TIMED: 1, SCHEDULED: 2, FINISHED: 3 };
  const sorted = [...matches].sort((a, b) => (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4) || new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

  const filtered = filter === 'all' ? sorted
    : filter === 'live' ? sorted.filter((m) => m.status === 'IN_PLAY')
    : filter === 'upcoming' ? sorted.filter((m) => m.status === 'TIMED' || m.status === 'SCHEDULED')
    : sorted.filter((m) => m.status === 'FINISHED');

  const grouped: Record<string, Match[]> = {};
  filtered.forEach((m) => { (grouped[m.competition.name] ??= []).push(m); });

  const filters = [
    { key: 'all', label: 'Semua' },
    { key: 'live', label: 'Sedang Berlangsung' },
    { key: 'upcoming', label: 'Akan Datang' },
    { key: 'finished', label: 'Selesai' },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">📅 Jadwal Pertandingan</h2>
          <p className="text-gray-400 text-sm mt-1">{formatDateID(new Date())} • WIB (GMT+7)</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === f.key ? 'bg-emerald-500 text-white' : 'bg-gray-900/80 text-gray-400 border border-gray-800 hover:border-emerald-500/30'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-red-400 mb-3">⚠️ {error}</p>
          <button onClick={fetchMatches} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all">Coba Lagi</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 animate-pulse space-y-3">
              <div className="h-4 bg-gray-800 rounded w-40 shimmer" />
              <div className="flex justify-between"><div className="h-6 bg-gray-800 rounded w-32 shimmer" /><div className="h-6 bg-gray-800 rounded w-16 shimmer" /></div>
            </div>
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">Tidak ada pertandingan ditemukan 📋</p>
        </div>
      ) : (
        Object.entries(grouped).map(([compName, compMatches]) => (
          <div key={compName}>
            <div className="flex items-center gap-2 mb-3">
              {compMatches[0].competition.emblem && <img src={compMatches[0].competition.emblem} alt="" className="w-6 h-6 object-contain" />}
              <h3 className="text-lg font-semibold text-white">{compName}</h3>
            </div>
            <div className="space-y-3">
              {compMatches.map((match) => (
                <div key={match.id} className={`bg-gray-900/80 backdrop-blur-xl border rounded-2xl p-5 hover:scale-[1.01] transition-all duration-300 ${
                  match.status === 'IN_PLAY' ? 'border-emerald-500/30 hover:border-emerald-500/50' :
                  match.status === 'TIMED' || match.status === 'SCHEDULED' ? 'border-blue-500/20 hover:border-blue-500/40' :
                  'border-gray-800 opacity-70 hover:border-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {match.homeTeam.crest && <img src={match.homeTeam.crest} alt="" className="w-8 h-8 object-contain" />}
                      <span className="text-white font-medium text-sm">{match.homeTeam.name}</span>
                    </div>
                    <div className="flex flex-col items-center mx-4">
                      <span className="text-gray-500 text-xs mb-1">{formatTimeWIB(match.utcDate)}</span>
                      {match.score ? (
                        <span className="text-white font-bold text-lg">{match.score.fullTime.home} - {match.score.fullTime.away}</span>
                      ) : (
                        <span className="text-gray-500 font-medium text-sm">vs</span>
                      )}
                      <StatusBadge status={match.status} />
                    </div>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className="text-white font-medium text-sm">{match.awayTeam.name}</span>
                      {match.awayTeam.crest && <img src={match.awayTeam.crest} alt="" className="w-8 h-8 object-contain" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
