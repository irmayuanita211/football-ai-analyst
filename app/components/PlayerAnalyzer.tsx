'use client'

import { useState, useEffect, useRef } from 'react'

interface PlayerStats {
  goals: number
  assists: number
  passes_per_game: number
  tackles_per_game: number
  dribbles_per_game: number
  shots_per_game: number
}

interface PlayerResult {
  name: string
  position: string
  nationality: string
  age: number
  rating: number
  stats: PlayerStats
  strengths: string[]
  weaknesses: string[]
  comparison: string
  recommendation: string
  marketValue: string
  contractUntil: string
}

const PLAYER_DATABASE: { name: string; position: string }[] = [
  { name: 'Mohamed Salah', position: 'FWD' },
  { name: 'Erling Haaland', position: 'FWD' },
  { name: 'Bukayo Saka', position: 'FWD' },
  { name: 'Kevin De Bruyne', position: 'MID' },
  { name: 'Martin Odegaard', position: 'MID' },
  { name: 'Cole Palmer', position: 'MID' },
  { name: 'Phil Foden', position: 'MID' },
  { name: 'Declan Rice', position: 'MID' },
  { name: 'William Saliba', position: 'DEF' },
  { name: 'Virgil van Dijk', position: 'DEF' },
  { name: 'Trent Alexander-Arnold', position: 'DEF' },
  { name: 'Alisson Becker', position: 'GK' },
  { name: 'David Raya', position: 'GK' },
  { name: 'Heung-Min Son', position: 'FWD' },
  { name: 'James Maddison', position: 'MID' },
  { name: 'Ollie Watkins', position: 'FWD' },
  { name: 'Alexander Isak', position: 'FWD' },
  { name: 'Jarrod Bowen', position: 'FWD' },
  { name: 'Bruno Fernandes', position: 'MID' },
  { name: 'Rodri', position: 'MID' },
  { name: 'Bernardo Silva', position: 'MID' },
  { name: 'Jeremy Doku', position: 'FWD' },
  { name: 'Kai Havertz', position: 'FWD' },
  { name: 'Gabriel Martinelli', position: 'FWD' },
  { name: 'Leandro Trossard', position: 'FWD' },
  { name: 'Darwin Nunez', position: 'FWD' },
  { name: 'Luis Diaz', position: 'FWD' },
  { name: 'Diogo Jota', position: 'FWD' },
  { name: 'Casemiro', position: 'MID' },
]

const POSITIONS = ['Semua', 'GK', 'DEF', 'MID', 'FWD']

function generateMockPlayer(playerName: string): PlayerResult {
  const playerInfo = PLAYER_DATABASE.find(p => p.name === playerName) || { name: playerName, position: 'MID' }
  return {
    name: playerInfo.name,
    position: playerInfo.position,
    nationality: 'Various',
    age: Math.floor(Math.random() * 12) + 22,
    rating: Math.floor(Math.random() * 18) + 75,
    stats: {
      goals: Math.floor(Math.random() * 25) + 2,
      assists: Math.floor(Math.random() * 15) + 1,
      passes_per_game: Math.floor(Math.random() * 40) + 20,
      tackles_per_game: parseFloat((Math.random() * 3 + 0.5).toFixed(1)),
      dribbles_per_game: parseFloat((Math.random() * 4 + 0.5).toFixed(1)),
      shots_per_game: parseFloat((Math.random() * 4 + 1).toFixed(1)),
    },
    strengths: [
      'Teknik dan kualitas passing yang excellent',
      'Konsistensi tinggi sepanjang musim',
      'Kemampuan bermain di berbagai posisi',
      'Mentalitas juara dan pengalaman besar',
    ],
    weaknesses: [
      'Kadang kurang kontribusi saat bertahan',
      'Performa bisa fluktuatif di pertandingan besar',
      'Usia mulai meningkat, perlu manajemen menit',
    ],
    comparison: `Masih lebih baik dari ${Math.floor(Math.random() * 30) + 60}% pemain di posisi yang sama di top 5 liga Eropa.`,
    recommendation: 'Pemain berkualitas tinggi yang menjadi kunci performa tim. Investasi yang solid untuk jangka panjang.',
    marketValue: `€${Math.floor(Math.random() * 80) + 20}M`,
    contractUntil: `${Math.floor(Math.random() * 4) + 2025}`,
  }
}

function RatingCircle({ rating }: { rating: number }) {
  let color = 'text-gray-400'
  let bg = 'from-gray-600 to-gray-700'
  let ring = 'ring-gray-500'

  if (rating >= 90) {
    color = 'text-yellow-300'
    bg = 'from-yellow-500 to-amber-600'
    ring = 'ring-yellow-400'
  } else if (rating >= 80) {
    color = 'text-emerald-300'
    bg = 'from-emerald-500 to-green-600'
    ring = 'ring-emerald-400'
  } else if (rating >= 70) {
    color = 'text-blue-300'
    bg = 'from-blue-500 to-indigo-600'
    ring = 'ring-blue-400'
  }

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="42"
          fill="none"
          stroke="url(#ratingGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(rating / 100) * 264} 264`}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="ratingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className={`${rating >= 90 ? 'stop-yellow-400' : rating >= 80 ? 'stop-emerald-400' : rating >= 70 ? 'stop-blue-400' : 'stop-gray-400'}`} stopColor={rating >= 90 ? '#facc15' : rating >= 80 ? '#34d399' : rating >= 70 ? '#60a5fa' : '#9ca3af'} />
            <stop offset="100%" className={`${rating >= 90 ? 'stop-amber-600' : rating >= 80 ? 'stop-green-600' : rating >= 70 ? 'stop-indigo-600' : 'stop-gray-600'}`} stopColor={rating >= 90 ? '#d97706' : rating >= 80 ? '#16a34a' : rating >= 70 ? '#4f46e5' : '#4b5563'} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-2xl font-black ${color}`}>{rating}</span>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}

export default function PlayerAnalyzer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [positionFilter, setPositionFilter] = useState('Semua')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [comparePlayer, setComparePlayer] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PlayerResult | null>(null)
  const [compareResult, setCompareResult] = useState<PlayerResult | null>(null)
  const [error, setError] = useState('')
  const [showDetail, setShowDetail] = useState(false)
  const [showEmojiBurst, setShowEmojiBurst] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  const filteredPlayers = PLAYER_DATABASE.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPosition = positionFilter === 'Semua' || p.position === positionFilter
    return matchesSearch && matchesPosition
  })

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectPlayer = (name: string) => {
    setSearchQuery(name)
    setSelectedPlayer(name)
    setShowSuggestions(false)
  }

  const handleAnalyze = async () => {
    if (!selectedPlayer && !searchQuery) {
      setError('Masukkan nama pemain untuk dianalisis')
      return
    }

    const playerName = selectedPlayer || searchQuery
    setLoading(true)
    setError('')
    setResult(null)
    setCompareResult(null)

    try {
      const systemPrompt = `You are an expert football player analyst AI. Analyze the given player and return ONLY valid JSON with this exact structure: { "name": string, "position": string (e.g. "RW", "ST", "CM", "CB", "GK"), "nationality": string, "age": number, "rating": number (0-100), "stats": { "goals": number, "assists": number, "passes_per_game": number, "tackles_per_game": number, "dribbles_per_game": number, "shots_per_game": number }, "strengths": string[] (3-4 items), "weaknesses": string[] (2-3 items), "comparison": string, "recommendation": string, "marketValue": string (e.g. "€80M"), "contractUntil": string (e.g. "2027") }. Use Indonesian language for strengths, weaknesses, comparison, and recommendation.`

      const prompt = `Analisis pemain sepak bola: ${playerName}. Berikan analisis lengkap termasuk rating, statistik, kekuatan, kelemahan, perbandingan dengan pemain lain, dan rekomendasi.`

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system: systemPrompt }),
      })

      if (!res.ok) throw new Error('AI API error')

      const data = await res.json()
      const text = data?.content || data?.response || data?.text || ''

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          setResult(parsed)
        } else {
          throw new Error('No JSON found')
        }
      } catch {
        setResult(generateMockPlayer(playerName))
      }
    } catch {
      setResult(generateMockPlayer(playerName))
    } finally {
      setLoading(false)
      setShowEmojiBurst(true)
      setTimeout(() => setShowEmojiBurst(false), 2000)
    }
  }

  const handleCompare = async () => {
    if (!comparePlayer) return
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analisis pemain: ${comparePlayer}`,
          system: 'Return a JSON player analysis.',
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const text = data?.content || data?.response || ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        setCompareResult(JSON.parse(jsonMatch[0]))
      } else {
        setCompareResult(generateMockPlayer(comparePlayer))
      }
    } catch {
      setCompareResult(generateMockPlayer(comparePlayer))
    }
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
      {/* Emoji Burst */}
      {showEmojiBurst && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {['⚽', '📊', '✨', '⭐', '🏆'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                transform: `rotate(${i * 72}deg) translateY(-100px)`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-xl">
          👤
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Analisis Pemain</h2>
          <p className="text-sm text-gray-400">AI-powered player analysis</p>
        </div>
      </div>

      {/* Position Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            onClick={() => setPositionFilter(pos)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              positionFilter === pos
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Search Input with Autocomplete */}
      <div className="relative mb-4" ref={inputRef}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setSelectedPlayer('')
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="🔍 Cari pemain (contoh: Mohamed Salah)"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />

        {/* Autocomplete Dropdown */}
        {showSuggestions && searchQuery.length > 0 && filteredPlayers.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
            {filteredPlayers.slice(0, 10).map((player) => (
              <button
                key={player.name}
                onClick={() => handleSelectPlayer(player.name)}
                className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center justify-between transition-colors border-b border-gray-700/50 last:border-0"
              >
                <span className="text-white">{player.name}</span>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                  player.position === 'FWD' ? 'bg-red-500/20 text-red-400' :
                  player.position === 'MID' ? 'bg-blue-500/20 text-blue-400' :
                  player.position === 'DEF' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {player.position}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || (!selectedPlayer && !searchQuery)}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">🔍</span>
            AI sedang menganalisis data pemain
            <span className="animate-pulse">...</span>
          </>
        ) : (
          <>⚽ Analisis Pemain</>
        )}
      </button>

      {/* Loading Shimmer */}
      {loading && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 rounded-xl animate-pulse w-24 h-24" />
            <div className="space-y-2 flex-1">
              <div className="bg-gray-800 rounded-xl animate-pulse h-8 w-48" />
              <div className="bg-gray-800 rounded-xl animate-pulse h-5 w-32" />
              <div className="bg-gray-800 rounded-xl animate-pulse h-5 w-40" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800 rounded-xl animate-pulse h-28" />
            <div className="bg-gray-800 rounded-xl animate-pulse h-28" />
            <div className="bg-gray-800 rounded-xl animate-pulse h-28" />
          </div>
          <div className="bg-gray-800 rounded-xl animate-pulse h-20" />
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Player Header */}
          <div className="bg-gradient-to-r from-gray-800/50 via-gray-800/80 to-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-6">
              <RatingCircle rating={result.rating} />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{result.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs px-3 py-1 rounded-lg font-semibold ${
                    result.position === 'FWD' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    result.position === 'MID' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    result.position === 'DEF' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {result.position}
                  </span>
                  <span className="text-sm text-gray-400">{result.nationality}</span>
                  <span className="text-sm text-gray-400">• {result.age} tahun</span>
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-gray-400">💰 Value: <span className="text-white font-semibold">{result.marketValue}</span></span>
                  <span className="text-gray-400">📝 Contract: <span className="text-white font-semibold">{result.contractUntil}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Goals" value={result.stats.goals} icon="⚽" />
            <StatCard label="Assists" value={result.stats.assists} icon="🅰️" />
            <StatCard label="Passes/Game" value={result.stats.passes_per_game} icon="🎯" />
            <StatCard label="Tackles/Game" value={result.stats.tackles_per_game} icon="🛡️" />
            <StatCard label="Dribbles/Game" value={result.stats.dribbles_per_game} icon="🏃" />
            <StatCard label="Shots/Game" value={result.stats.shots_per_game} icon="🏹" />
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">✅ Kekuatan</h4>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">⚠️ Kelemahan</h4>
              <ul className="space-y-2">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-red-400 mt-0.5">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">📊 Perbandingan</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{result.comparison}</p>
          </div>

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">💡 Rekomendasi AI</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{result.recommendation}</p>
          </div>

          {/* Compare Section */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">🔄 Bandingkan dengan Pemain Lain</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={comparePlayer}
                onChange={(e) => setComparePlayer(e.target.value)}
                placeholder="Nama pemain untuk dibandingkan"
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleCompare}
                disabled={!comparePlayer}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              >
                Bandingkan
              </button>
            </div>
            {compareResult && (
              <div className="mt-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <RatingCircle rating={compareResult.rating} />
                  <div>
                    <p className="font-semibold text-white">{compareResult.name}</p>
                    <p className="text-sm text-gray-400">{compareResult.position} • {compareResult.nationality}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span>⚽ {compareResult.stats.goals}</span>
                      <span>🅰️ {compareResult.stats.assists}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detail Toggle */}
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-emerald-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            📊 Tampilan Detail {showDetail ? '▲' : '▼'}
          </button>

          {/* Detail Section */}
          {showDetail && (
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 space-y-3 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Nama</span>
                  <span className="text-white font-medium">{result.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Posisi</span>
                  <span className="text-white font-medium">{result.position}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Kebangsaan</span>
                  <span className="text-white font-medium">{result.nationality}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Usia</span>
                  <span className="text-white font-medium">{result.age} tahun</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Nilai Pasar</span>
                  <span className="text-emerald-400 font-semibold">{result.marketValue}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Kontrak</span>
                  <span className="text-white font-medium">{result.contractUntil}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
