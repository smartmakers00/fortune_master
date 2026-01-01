
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import SajuView from './views/SajuView';
import TarotView from './views/TarotView';
import FaceView from './views/FaceView';
import ShamanView from './views/ShamanView';
import TojeongView from './views/TojeongView';
import PalmView from './views/PalmView';
import AdminView from './views/AdminView';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { FortuneType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<FortuneType>('home');

  const getTitle = () => {
    switch (view) {
      case 'tojeong': return '2026 토정비결';
      case 'saju': return '정통 사주 풀이';
      case 'tarot': return '2026 타로 리딩';
      case 'face': return '인공지능 관상 분석';
      case 'palm': return '인공지능 손금 분석';
      case 'shaman': return '무속인 신점 상담';
      case 'admin': return '관리자 대시보드';
      default: return '2026 신년운세 마스터';
    }
  };

  const renderView = () => {
    switch (view) {
      case 'home': return <Home onSelect={setView} />;
      case 'tojeong': return <TojeongView />;
      case 'saju': return <SajuView />;
      case 'tarot': return <TarotView />;
      case 'face': return <FaceView />;
      case 'palm': return <PalmView />;
      case 'shaman': return <ShamanView />;
      case 'admin': return <AdminView />;
      default: return <Home onSelect={setView} />;
    }
  };

  return (
    <>
      <Layout
        title={getTitle()}
        onBack={view !== 'home' ? () => setView('home') : undefined}
      >
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderView()}
        </div>
      </Layout>
      <PWAInstallPrompt />
    </>
  );
};

export default App;
