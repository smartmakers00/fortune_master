
import React from 'react';
import TarotCardView from './TarotCardView';
import { SubServiceType, CardReading } from '../types';

interface ReadingSideViewProps {
  view: string;
  subType: SubServiceType | null;
  drawnCards: CardReading[];
  cardCount: number;
  isLoading: boolean;
  hasFinishedResult: boolean;
  onDrawCard: () => void;
  onRunSubService: () => void;
}

const ReadingSideView: React.FC<ReadingSideViewProps> = ({
  view, subType, drawnCards, cardCount, isLoading, hasFinishedResult, onDrawCard, onRunSubService
}) => {
  return (
    <div className={`glass rounded-[2rem] p-5 flex flex-col items-center justify-center overflow-y-auto shadow-2xl relative ${view === 'consultation' ? 'hidden lg:flex' : ''}`}>
       {view === 'subservice' ? (
         <div className="text-center space-y-6">
            <div className="text-9xl animate-float drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              {subType === SubServiceType.LOTTO ? '🎰' : subType === SubServiceType.HOROSCOPE ? '✨' : subType === SubServiceType.DREAM ? '☁️' : subType === SubServiceType.FOOD ? '🍚' : '🧧'}
            </div>
            {!hasFinishedResult && (
              <button onClick={onRunSubService} disabled={isLoading} className="bg-gradient-to-r from-blue-700 to-indigo-700 px-10 py-4 rounded-[1.5rem] font-black text-lg hover:scale-105 disabled:opacity-50 shadow-xl border border-white/10">
                {isLoading ? '운명 읽는 중...' : '행운 확인하기'}
              </button>
            )}
         </div>
       ) : view === 'reading' ? (
          <div className="w-full flex flex-col items-center space-y-8">
            <div className="flex flex-wrap justify-center gap-4">
              {drawnCards.map((rc, idx) => (
                <TarotCardView key={idx} card={rc.card} isFlipped={true} isReversed={rc.isReversed} label={rc.positionName} className="scale-90" />
              ))}
              {drawnCards.length < cardCount && (
                <div onClick={isLoading ? undefined : onDrawCard}><TarotCardView isFlipped={false} isDrawing={!isLoading} className="scale-90" /></div>
              )}
            </div>
          </div>
       ) : (
         <div className="text-center space-y-3 opacity-30">
            <div className="text-8xl mb-2 animate-pulse">🔮</div>
            <p className="text-xl font-black italic tracking-tighter">당신의 카드를 선택하세요</p>
         </div>
       )}
    </div>
  );
};

export default ReadingSideView;
