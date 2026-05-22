'use client'

import { useState, useEffect, useRef } from 'react'

const QUICK_SCENARIOS = [
  { emoji: '⚽', text: 'Gol dramatis di menit akhir pertandingan final' },
  { emoji: '🔴', text: 'Kartu merah untuk pemain bintang' },
  { emoji: '🧤', text: 'Penyelamatan luar biasa dari kiper' },
  { emoji: '🏃', text: 'Counter-attack cepat dari tengah lapangan' },
  { emoji: '🏟️', text: 'Gol bunuh diri di Derby' },
  { emoji: '🏆', text: 'Gol penyama kedudulan di injury time' },
]

const STYLES = [
  { id: 'indonesia', label: '🇮🇩 Indonesia TV', emoji: '📺' },
  { id: 'english', label: '🇬🇧 English Broadcast', emoji: '🎙️' },
  { id: 'anime', label: '🇯🇵 Japanese Anime', emoji: '⚡' },
  { id: 'novel', label: '📖 Dramatic Novel', emoji: '✍️' },
]

interface Commentary {
  text: string
  style: string
  intensity: number
  wordCount: number
  timestamp: Date
}

function generateMockCommentary(scenario: string, style: string): string {
  const commentaries: Record<string, string> = {
    indonesia: `DAN GOLLL!!! LUAR BIASA!!! Di menit ke-92, dengan satu sentuhan ajaib, dia berhasil menaklukkan seluruh pertahanan lawan! Stadion meledak! Penonton berdiri dari kursi mereka! Ini adalah gol yang akan dikenang sepanjang masa! Belum pernah saya lihat yang seperti ini dalam 30 tahun saya menjadi komentator! GOL YANG SEMPURNA!!! Ball bouncing... off the post... AND IN!!! UNBELIEVABLE!!!`,
    english: `AND IT'S IN! UNBELIEVABLE! In the dying moments of the match, with everything on the line, he's produced a moment of pure magic! The stadium erupts! What a time to score! What a player! This is why we love football! The keeper had no chance! Absolutely none! What a finish! What a moment! This is going to be replayed for years to come!`,
    anime: `SOOOOKEEEE!!! Tsubasa-ouji no senshuukan ga hikari ni somatta! Kono shunkan, subete ga tomatteita! Kōri ga yabureru you ni, ganriki no shotto ga yuuyake ni somatta! NAMIDA ga nagareru... KONO SHUNKAN WO WASURENAI! Chikara ga afurederu... SORE GA HOOHOO DESU!!!`,
    novel: `The ball hung in the air for what felt like an eternity. Time itself seemed to hold its breath. The entire stadium — sixty thousand souls united in a single, trembling silence. And then — contact. The sweet, perfect sound of leather meeting the back of the net. In that moment, everything changed. The roar that followed was not merely noise; it was the sound of history being written in real time, the primal scream of pure, unadulterated joy echoing across the ages...`,
  }

  return commentaries[style] || commentaries.indonesia
}

function calculateIntensity(text: string): number {
  const intensityMarkers = [
    '!!!', 'GOL', 'UNBELIEVABLE', 'LUAR BIASA', 'MAGIC', 'PERFECT',
    'SOOOOKEEEE', 'LUAR BIASA', 'EXPLODES', 'ERUPTS',
  ]
  let count = 0
  const upperText = text.toUpperCase()
  intensityMarkers.forEach((marker) => {
    if (upperText.includes(marker.toUpperCase())) count++
  })
  const exclamationCount = (text.match(/!/g) || []).length
  count += Math.floor(exclamationCount / 3)
  return Math.min(10, Math.max(5, count + 3))
}

function IntensityMeter({ intensity }: { intensity: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">🔥 Intensitas:</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-6 rounded-sm transition-all duration-300 ${
              i < intensity
                ? intensity >= 8
                  ? 'bg-red-500 animate-pulse'
                  : intensity >= 6
                  ? 'bg-orange-500'
                  : 'bg-yellow-500'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-white">{intensity}/10</span>
    </div>
  )
}

export default function AICommentator() {
  const [scenario, setScenario] = useState('')
  const [style, setStyle] = useState('indonesia')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState('')
  const [commentaryCount, setCommentaryCount] = useState(0)
  const [showEmojiBurst, setShowEmojiBurst] = useState(false)
  const [copied, setCopied] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [history, setHistory] = useState<Commentary[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const intensity = result ? calculateIntensity(result) : 0
  const wordCount = result ? result.split(/\s+/).filter(Boolean).length : 0

  const handleQuickScenario = (text: string) => {
    setScenario(text)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleGenerate = async () => {
    if (!scenario.trim()) {
      setError('Deskripsikan skenario pertandingan terlebih dahulu')
      return
    }

    setLoading(true)
    setError('')
    setResult('')

    try {
      const styleLabel = STYLES.find(s => s.id === style)?.label || 'Indonesia TV'
      const systemPrompt = `You are a passionate football commentator AI. Generate dramatic, exciting commentary for the described scenario. Style: ${styleLabel}. Write in the style of that language/culture. Make it vivid, emotional, and dramatic. Include stadium atmosphere, crowd reactions, and momentous feeling. Keep it 3-5 sentences. Do NOT include any JSON or formatting, just the raw commentary text.`

      const prompt = `Generate a football commentary for this scenario: "${scenario}". Make it ${styleLabel} style with maximum drama and excitement.`

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system: systemPrompt }),
      })

      if (!res.ok) throw new Error('AI API error')

      const data = await res.json()
      let text = data?.content || data?.response || data?.text || ''
      
      // Try to parse JSON response and extract commentary text
      try {
        const parsed = JSON.parse(text)
        if (parsed.commentary) {
          text = parsed.commentary
        } else if (parsed.text) {
          text = parsed.text
        }
      } catch {
        // Not JSON, use as-is
      }

      if (text.trim()) {
        setResult(text.trim())
        setCommentaryCount((c) => c + 1)
        setHistory((prev) => [
          {
            text: text.trim(),
            style,
            intensity: calculateIntensity(text),
            wordCount: text.split(/\s+/).filter(Boolean).length,
            timestamp: new Date(),
          },
          ...prev,
        ])
      } else {
        throw new Error('Empty response')
      }
    } catch {
      // Fallback to mock commentary
      const mockCommentary = generateMockCommentary(scenario, style)
      setResult(mockCommentary)
      setCommentaryCount((c) => c + 1)
      setHistory((prev) => [
        {
          text: mockCommentary,
          style,
          intensity: calculateIntensity(mockCommentary),
          wordCount: mockCommentary.split(/\s+/).filter(Boolean).length,
          timestamp: new Date(),
        },
        ...prev,
      ])
    } finally {
      setLoading(false)
      setShowEmojiBurst(true)
      setTimeout(() => setShowEmojiBurst(false), 2000)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = result
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePlayAnimation = () => {
    setPlaying(true)
    setTimeout(() => setPlaying(false), 3000)
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
      {/* Emoji Burst */}
      {showEmojiBurst && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {['🎙️', '⚽', '🔥', '📣', '🏟️', '✨', '💥', '🎵'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                animationDelay: `${i * 0.08}s`,
                transform: `rotate(${i * 45}deg) translateY(-${80 + i * 20}px)`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-xl">
            🎙️
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Komentator</h2>
            <p className="text-sm text-gray-400">Dramatic football commentary</p>
          </div>
        </div>
        {commentaryCount > 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-1.5 text-sm">
            <span className="text-gray-400">Komentar: </span>
            <span className="text-white font-bold">{commentaryCount}</span>
          </div>
        )}
      </div>

      {/* Quick Scenarios */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">⚡ Skenario Cepat</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {QUICK_SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleQuickScenario(s.text)}
              className={`text-left p-3 rounded-xl border transition-all duration-300 text-sm ${
                scenario === s.text
                  ? 'bg-orange-600/20 border-orange-500/50 text-orange-300'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <span className="mr-1">{s.emoji}</span> {s.text}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Input */}
      <div className="mb-4">
        <textarea
          ref={textareaRef}
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Deskripsikan skenario pertandingan... (contoh: Pemain sayap kanan melakukan solo run dari tengah lapangan, melewati 4 pemain, dan mencetak gol spektakuler di sudut atas gawang)"
          rows={4}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
        />
      </div>

      {/* Style Selector */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">🎨 Gaya Komentar</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`p-3 rounded-xl border text-center transition-all duration-300 ${
                style === s.id
                  ? 'bg-orange-600/20 border-orange-500/50 shadow-lg shadow-orange-500/10'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className={`text-xs font-medium ${style === s.id ? 'text-orange-300' : 'text-gray-400'}`}>
                {s.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !scenario.trim()}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">🎙️</span>
            Komentator sedang mempersiapkan komentar
            <span className="animate-pulse">...</span>
          </>
        ) : (
          <>🎙️ Generate Komentar</>
        )}
      </button>

      {/* Loading Shimmer */}
      {loading && (
        <div className="mt-6 space-y-3">
          <div className="bg-gray-800 rounded-xl animate-pulse h-6 w-3/4" />
          <div className="bg-gray-800 rounded-xl animate-pulse h-6 w-full" />
          <div className="bg-gray-800 rounded-xl animate-pulse h-6 w-5/6" />
          <div className="bg-gray-800 rounded-xl animate-pulse h-6 w-2/3" />
          <div className="bg-gray-800 rounded-xl animate-pulse h-6 w-4/5" />
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Speech Bubble */}
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
            <div className="absolute -top-3 left-6">
              <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {STYLES.find((s) => s.id === style)?.emoji} {STYLES.find((s) => s.id === style)?.label}
              </span>
            </div>

            <div className="pt-2">
              <p className="text-gray-200 leading-relaxed text-lg italic">"{result}"</p>
            </div>

            {/* Playing animation */}
            {playing && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <span className="text-4xl animate-bounce">🎙️</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-orange-500 rounded-full animate-pulse"
                        style={{
                          height: `${20 + Math.random() * 30}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-orange-400 font-medium">Playing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4">
            <IntensityMeter intensity={intensity} />
            <span className="text-sm text-gray-400">📝 {wordCount} kata</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={handlePlayAnimation}
              disabled={playing}
              className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-emerald-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {playing ? (
                <>
                  <span className="animate-pulse">🔊</span> Playing...
                </>
              ) : (
                <>▶️ Play</>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-blue-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <span>✅</span> Tersalin!
                </>
              ) : (
                <>📋 Copy</>
              )}
            </button>

            <button
              onClick={handleGenerate}
              className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-purple-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              🎲 Versi Lain
            </button>

            <button
              onClick={async () => {
                const shareText = `🎙️ AI Football Commentary\n\n"${result}"\n\n---\nGenerated by Football AI Analyst 🤖⚽`
                try {
                  await navigator.clipboard.writeText(shareText)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                } catch {
                  /* ignore */
                }
              }}
              className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-orange-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              📤 Share
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className="mt-6 bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">📜 Riwayat Komentar</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.slice(1).map((h, i) => (
              <div
                key={i}
                className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/30 cursor-pointer hover:border-gray-600 transition-all"
                onClick={() => setResult(h.text)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">
                    {STYLES.find((s) => s.id === h.style)?.emoji} {h.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    🔥 {h.intensity}/10 • {h.wordCount} kata
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
