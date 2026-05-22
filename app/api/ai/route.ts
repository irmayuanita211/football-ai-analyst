import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

function getMockAIResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('prediksi') || lowerPrompt.includes('prediction')) {
    // Extract team names from prompt
    const teamMatch = prompt.match(/antara\s+(.+?)\s+\(home\)\s+vs\s+(.+?)\s+\(away\)/i);
    const home = teamMatch ? teamMatch[1] : 'Home Team';
    const away = teamMatch ? teamMatch[2] : 'Away Team';
    return JSON.stringify({
      homeTeam: home,
      awayTeam: away,
      prediction: {
        homeWin: 45,
        draw: 25,
        awayWin: 30,
        predictedScore: '2-1',
        confidence: 'Medium',
      },
      analysis: `${home} memiliki keunggulan bermain di kandang dengan rekor 14W 2D 1L musim ini. ${away} dalam performa bagus namun kerap kesulitan melawan tim besar di luar kandang. Head-to-head 5 pertemuan terakhir menunjukkan pertandingan yang seimbang. Prediksi skor akhir 2-1 untuk kemenangan ${home}.`,
      keyFactors: [
        `${home}: 8 kemenangan beruntun di kandang`,
        `${away}: 3 pemain kunci cedera`,
        'Cuaca: Hujan diprediksi, menguntungkan taktik pressing',
        'Wasit: Michael Oliver - rata-rata 4.2 kartu kuning/pertandingan',
        'Motivasi: Perebutan posisi 4 besar',
      ],
    }, null, 2);
  }

  if (lowerPrompt.includes('player') || lowerPrompt.includes('pemain')) {
    return JSON.stringify({
      name: 'Marcus Rashford',
      position: 'LW',
      nationality: 'England',
      age: 28,
      rating: 78,
      stats: {
        goals: 12,
        assists: 5,
        passes_per_game: 32,
        tackles_per_game: 0.8,
        dribbles_per_game: 3.1,
        shots_per_game: 3.4,
      },
      strengths: [
        'Kecepatan dan akselerasi luar biasa',
        'Kemampuan dribbling yang menghancurkan pertahanan',
        'Tendangan keras dari luar kotak penalti',
      ],
      weaknesses: [
        'Konsistensi performa masih perlu ditingkatkan',
        'Pemilihan keputusan di momen krusial',
      ],
      comparison: 'Perbandingan dengan Vinícius Jr. dan Mbappé. Keunggulan: Kecepatan dan power. Kekurangan: Konsistensi.',
      recommendation: 'Pemain berkualitas tinggi yang menjadi kunci performa tim. Investasi yang solid untuk jangka panjang.',
      marketValue: '€65M',
      contractUntil: '2027',
    }, null, 2);
  }

  if (lowerPrompt.includes('komentar') || lowerPrompt.includes('commentary')) {
    return JSON.stringify({
      commentary: "⚽ GOL! GOL! GOL! Tendangan bebas yang luar biasa dari jarak 25 meter! Pemain ini membungkam seluruh stadion! Bola melengkung melewati pagar betis dan menghujam pojok kiri gawang! Kiper hanya bisa terpaku melihat bola masuk ke gawang! Ini adalah momen magis yang tidak akan pernah dilupakan oleh para penggemar! 🎉",
      timestamp: new Date().toISOString(),
      mood: 'excited',
    }, null, 2);
  }

  return JSON.stringify({
    analysis: `Berdasarkan analisis data pertandingan, pertandingan ini menjanjikan pertunjukan yang menarik. Tim-tim yang bertanding memiliki kualitas pemain yang setara dan strategi yang berbeda. Diperkirakan akan terjadi pertandingan yang ketat dengan beberapa peluang emas di kedua sisi lapangan.`,
    keyInsights: [
      'Pertandingan diprediksi berlangsung dengan tempo tinggi',
      'Kedua tim memiliki kekuatan di lini tengah',
      'Faktor kunci adalah penguasaan bola dan pressing',
    ],
    recommendedFormation: '4-3-3',
  }, null, 2);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, system } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (GROQ_API_KEY) {
      const messages = [];
      if (system) {
        messages.push({ role: 'system', content: system });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Groq API error');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      return NextResponse.json({ content });
    }

    // Mock AI response
    const content = getMockAIResponse(prompt);
    return NextResponse.json({ content });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
