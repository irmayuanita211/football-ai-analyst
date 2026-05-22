'use client';

import { useState, useEffect, useCallback } from 'react';

interface Match {
  id: number;
  homeTeam: { name: string; crest: string; id: number };
  awayTeam: { name: string; crest: string; id: number };
  score: { fullTime: { home: number; away: number }; halfTime: { home: number; away: number } };
  status: string;
  utcDate: string;
  competition: { name: string; emblem: string; id: number };
  minute?: number;
}

const MOCK_LIVE: Match[] = [
  { id: 1, homeTeam: { name: 'Manchester United', crest: 'https://crests.football-data.org/66.png', id: 66 }, awayTeam: { name: 'Liverpool', crest: 'https://crests.football-data.org/64.png', id: 64 }, score: { fullTime: { home: 2, away: 1 }, halfTime: { home: 1, away: 0 } }, status: 'IN_PLAY', utcDate: new Date().toISOString(), competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png', id: 2021 }, minute: 67 },
  { id: 2, homeTeam: { name: 'Real Madrid', crest: 'https://crests.football-data.org/86.png', id: 86 }, awayTeam: { name: 'Barcelona', crest: 'https://crests.football-data.org/81.png', id: 81 }, score: { fullTime: { home: 1, away: 1 }, halfTime: { home: 0, away: 1 } }, status: 'IN_PLAY', utcDate: new Date().toISOString(), competition: { name: 'La Liga', emblem: 'https://crests.football-data.org/PD.png', id: 2014 }, minute: 34 },
  { id: 3, homeTeam: { name: 'Inter Milan', crest: 'https://crests.football-data.org/108.png', id: 108 }, awayTeam: { name: 'AC Milan', crest: 'https://crests.football-data.org/98.png', id: 98 }, score: { fullTime: { home: 0, away: 0 }, halfTime: { home: 0, away: 0 } }, status: 'IN_PLAY', utcDate: new Date().toISOString(), competition: { name: 'Serie A', emblem: 'https://crests.football-data.org/SA.png', id: 2019 }, minute: 15 },
];

const COMPETITIONS = ['All', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Champions League'];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    IN_PLAY: 'bg-red-500/20 text-red-400 border-red-500/30',
    FINISHED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    TIMED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    SCHEDULED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  const labels: Record<string, string> = { IN_PLAY: 'LIVE', FINISHED: 'FT', TIMED: 'UPCOMING', SCHEDULED: 'SCHEDULED' };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[status] || styles.SCHEDULED}`}>
      {status === 'IN_PLAY' && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse" />}
      {labels[status] || status}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-32 shimmer" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-800 rounded-full shimmer" /><div className="h-4 bg-gray-800 rounded w-24 shimmer" /></div>
        <div className="h-8 w-12 bg-gray-800 rounded shimmer" />
        <div className="flex items-center gap-3"><div className="h-4 bg-gray-800 rounded w-24 shimmer" /><div className="w-10 h-10 bg-gray-800 rounded-full shimmer" /></div>
      </div>
    </div>
  );
}

export default function LiveScores() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [countdown, setCountdown] = useState(30);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/football?endpoint=matches?status=LIVE');
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setMatches(data.matches || data || []);
    } catch {
      setMatches(MOCK_LIVE);
    } finally {
      setLoading(false);
      setCountdown(30);
    }
  }, []);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { fetchMatches(); return 30; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchMatches]);

  const filtered = activeFilter === 'All' ? matches : matches.filter((m) => m.competition.name === activeFilter);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">⚽ Live Scores</h2>
          <p className="text-gray-400 text-sm mt-1">Refresh dalam {countdown}s</p>
        </div>
        <button onClick={fetchMatches} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 transition-all text-sm font-medium">
          🔄 Refresh
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {COMPETITIONS.map((comp) => (
          <button key={comp} onClick={() => setActiveFilter(comp)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeFilter === comp ? 'bg-emerald-500 text-white' : 'bg-gray-900/80 text-gray-400 border border-gray-800 hover:border-emerald-500/30'}`}>
            {comp}
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
        <div className="space-y-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">Tidak ada pertandingan live saat ini ⚽</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((match) => (
            <div key={match.id} className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/30 hover:scale-[1.01] transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {match.competition.emblem && <img src={match.competition.emblem} alt="" className="w-5 h-5 object-contain" />}
                  <span className="text-gray-400 text-sm">{match.competition.name}</span>
                </div>
                <StatusBadge status={match.status} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {match.homeTeam.crest && <img src={match.homeTeam.crest} alt="" className="w-10 h-10 object-contain" />}
                  <span className="text-white font-medium">{match.homeTeam.name}</span>
                </div>

                <div className="flex flex-col items-center mx-6">
                  <div className="flex items-center gap-2 text-2xl font-bold text-white">
                    <span>{match.score.fullTime.home}</span>
                    <span className="text-gray-600">-</span>
                    <span>{match.score.fullTime.away}</span>
                  </div>
                  {match.status === 'IN_PLAY' && match.minute && (
                    <span className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      {match.minute}&apos;
                    </span>
                  )}
                  <span className="text-xs text-gray-500 mt-0.5">
                    HT {match.score.halfTime.home}-{match.score.halfTime.away}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end">
                  <span className="text-white font-medium text-right">{match.awayTeam.name}</span>
                  {match.awayTeam.crest && <img src={match.awayTeam.crest} alt="" className="w-10 h-10 object-contain" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
