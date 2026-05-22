'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import LiveScores from '@/app/components/LiveScores';
import MatchSchedule from '@/app/components/MatchSchedule';
import MatchPredictor from '@/app/components/MatchPredictor';
import PlayerAnalyzer from '@/app/components/PlayerAnalyzer';
import AICommentator from '@/app/components/AICommentator';
import TeamPerformance from '@/app/components/TeamPerformance';
import FantasyOptimizer from '@/app/components/FantasyOptimizer';

const tabs = [
  { id: 'live', label: 'Live Score', icon: '🔴' },
  { id: 'schedule', label: 'Jadwal Hari Ini', icon: '📅' },
  { id: 'predictor', label: 'Prediksi Pertandingan', icon: '🔮' },
  { id: 'player', label: 'Analisis Pemain', icon: '⚽' },
  { id: 'commentator', label: 'Komentator AI', icon: '🎙️' },
  { id: 'performance', label: 'Performa Tim', icon: '📊' },
  { id: 'fantasy', label: 'Fantasy XI', icon: '🏆' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('live');

  const renderContent = () => {
    switch (activeTab) {
      case 'live':
        return <LiveScores />;
      case 'schedule':
        return <MatchSchedule />;
      case 'predictor':
        return <MatchPredictor />;
      case 'player':
        return <PlayerAnalyzer />;
      case 'commentator':
        return <AICommentator />;
      case 'performance':
        return <TeamPerformance />;
      case 'fantasy':
        return <FantasyOptimizer />;
      default:
        return <LiveScores />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0f1a]">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="p-4 md:p-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">
              ⚽ Football AI Analyst
            </h1>
            <p className="text-gray-400 mt-1">Powered by AI • Live Data</p>
          </header>

          <div className="fade-in" key={activeTab}>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
