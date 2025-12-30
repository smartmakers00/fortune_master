
import React, { useState } from 'react';
import { MAJOR_ARCANA, SPREADS } from './constants';
import { SpreadType, SubServiceType, CardReading, Message, UserProfile, ReadingSession } from './types';
import { getTarotInterpretationStream } from './services/geminiService';
import MysticBackground from './components/MysticBackground';
import ChatInterface from './components/ChatInterface';
import LandingView from './components/LandingView';
import ProfileModal from './components/ProfileModal';
import ReadingSideView from './components/ReadingSideView';
import { useUserProfile } from './hooks/useUserProfile';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'consultation' | 'reading' | 'history' | 'subservice'>('landing');
  const [selectedSpread, setSelectedSpread] = useState<any>(SPREADS[0]);
  const [subType, setSubType] = useState<SubServiceType | null>(null);
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<CardReading[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const { userProfile, setUserProfile, showProfileInput, setShowProfileInput, saveProfile } = useUserProfile();

  const reset = () => {
    setView('landing');
    setSubType(null);
    setDrawnCards([]);
    setQuestion('');
    setMessages([]);
  };

  const handleDownload = () => {
    const lastInterpretation = messages[messages.length - 1]?.content || streamingText;
    if (!lastInterpretation) return;
    const genderStr = userProfile.gender === 'male' ? '남성' : '여성';
    const sajuSummary = userProfile.birthDate ? `${userProfile.name}님 (${genderStr})` : '익명';
    
    let title = `${userProfile.name}님의 2026 행운 리포트`;
    const cleanContent = lastInterpretation
      .replace(/### (.*?)\n/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    const htmlContent = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><style>@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');body { font-family: 'Pretendard', sans-serif; background: #0c0a1f; color: #fff; padding: 20px; line-height: 1.8; }.card { background: #13112b; border: 2px solid #d4af37; padding: 30px; border-radius: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }h1 { color: #facc15; text-align: center; font-size: 24px; margin-bottom: 5px; }.saju { text-align: center; color: #888; font-size: 13px; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }h3 { color: #facc15; border-left: 4px solid #facc15; padding-left: 12px; margin-top: 25px; margin-bottom: 12px; font-size: 18px; }p { margin-bottom: 10px; font-size: 16px; }</style></head><body><div class="card"><h1>🌟 ${title}</h1><div class="saju">대상: <b>${sajuSummary}</b></div><div class="content">${cleanContent}</div></div></body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/ /g, '_')}.html`;
    a.click();
  };

  const runInterpretation = async (q: string, type: SpreadType | SubServiceType, cards: CardReading[]) => {
    setIsLoading(true);
    let fullText = "";
    try {
      await getTarotInterpretationStream(q, type, cards, (chunk) => {
        fullText += chunk;
        setStreamingText(fullText);
      }, userProfile);
      setMessages(prev => [...prev, { role: 'model', content: fullText }]);
      setStreamingText('');
      
      const session: ReadingSession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        question: q,
        spreadType: type,
        cards,
        interpretation: fullText,
        userProfile
      };
      const history = JSON.parse(localStorage.getItem('cheonmyeong_history') || '[]');
      localStorage.setItem('cheonmyeong_history', JSON.stringify([session, ...history].slice(0, 15)));
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: "<p>우주의 기운이 잠시 끊겼어. 다시 시도해볼까?</p>" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startConsultation = (spread: any) => {
    setSelectedSpread(spread);
    setDrawnCards([]);
    setSubType(null);
    if (!userProfile.name || !userProfile.birthDate) setShowProfileInput(true);
    else {
      setView('consultation');
      setMessages([{ role: 'model', content: `<p>반가워요 ${userProfile.name}님! 오늘은 어떤 고민이 있나요? <b>${spread.name}</b>로 함께 풀어봐요.</p>` }]);
    }
  };

  const startSubService = (type: SubServiceType) => {
    setSubType(type);
    setDrawnCards([]);
    if (!userProfile.name || !userProfile.birthDate) setShowProfileInput(true);
    else {
      setView('subservice');
      setMessages([{ role: 'model', content: `<p>안녕 ${userProfile.name}님! 너에게 필요한 행운의 메시지를 전해줄게.</p>` }]);
    }
  };

  const drawCard = () => {
    if (selectedSpread.cardCount === 0 || drawnCards.length >= selectedSpread.cardCount) return;
    const usedIds = drawnCards.map(dc => dc.card.id);
    const availableCards = MAJOR_ARCANA.filter(c => !usedIds.includes(c.id));
    const card = availableCards[Math.floor(Math.random() * availableCards.length)];
    const newCard: CardReading = { 
      card, 
      isReversed: Math.random() > 0.7, 
      positionName: selectedSpread.positions[drawnCards.length] 
    };
    const newDrawnCards = [...drawnCards, newCard];
    setDrawnCards(newDrawnCards);
    if (newDrawnCards.length === selectedSpread.cardCount) runInterpretation(question, selectedSpread.type, newDrawnCards);
  };

  const lastModelMsg = messages.filter(m => m.role === 'model').pop();
  const hasFinishedResult = lastModelMsg && lastModelMsg.content.length > 50;

  return (
    <div className="relative min-h-screen text-white pb-20 overflow-x-hidden flex flex-col">
      <MysticBackground />
      <header className="relative z-20 p-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
           <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-700 to-yellow-500 flex items-center justify-center font-black text-lg shadow-lg">天</div>
           <h1 className="text-lg sm:text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent">천명 2026</h1>
        </div>
        <button onClick={() => setView('history')} className="text-[10px] font-black bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest">히스토리</button>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 flex-1 w-full flex flex-col">
        {view === 'landing' && <LandingView onStartConsultation={startConsultation} onStartSubService={startSubService} />}

        {showProfileInput && <ProfileModal userProfile={userProfile} setUserProfile={setUserProfile} onSubmit={() => saveProfile(userProfile)} />}

        {(view === 'consultation' || view === 'reading' || view === 'subservice') && (
          <div className="grid lg:grid-cols-2 gap-4 flex-1 min-h-0 pb-10">
            <ReadingSideView 
              view={view} 
              subType={subType} 
              drawnCards={drawnCards} 
              cardCount={selectedSpread.cardCount} 
              isLoading={isLoading} 
              hasFinishedResult={hasFinishedResult || false}
              onDrawCard={drawCard}
              onRunSubService={() => runInterpretation(subType!, subType!, [])}
            />

            <div className="relative h-full flex flex-col">
              <ChatInterface 
                messages={messages} 
                onSendMessage={(txt) => {
                  if (view === 'consultation') { setQuestion(txt); setView('reading'); if (selectedSpread.cardCount === 0) runInterpretation(txt, selectedSpread.type, []); }
                  else runInterpretation(txt, subType!, []);
                }} 
                isLoading={isLoading} 
                streamingText={streamingText} 
                userProfile={userProfile} 
                onEditProfile={() => setShowProfileInput(true)} 
              />
              
              {hasFinishedResult && !isLoading && (
                <div className="absolute bottom-[68px] left-0 w-full flex gap-2.5 px-3 py-2 z-40 animate-in slide-in-from-bottom-3 duration-500 bg-gradient-to-t from-black/80 to-transparent">
                   <button onClick={handleDownload} className="flex-1 bg-yellow-600 hover:bg-yellow-500 py-3 rounded-xl font-black text-[14px] shadow-xl border border-yellow-400/50 flex items-center justify-center gap-1.5 transition-all active:scale-95">
                     📂 결과 저장
                   </button>
                   <button onClick={reset} className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 py-3 rounded-xl font-black text-[14px] flex items-center justify-center gap-1.5 transition-all active:scale-95">
                     처음으로
                   </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
