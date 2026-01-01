
import React, { useState, useEffect } from 'react';
import { TAROT_CARDS } from '../constants';
import { getFortuneText } from '../services/gemini';
import Loading from '../components/Loading';
import { downloadResultAsHtml } from '../utils/download';
import MarkdownView from '../components/MarkdownView';
import { trackFortuneUsage } from '../utils/analytics';

const TarotView: React.FC = () => {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackFortuneUsage('tarot');
  }, []);
  const [result, setResult] = useState<string | null>(null);

  const handleCardClick = (id: number) => {
    if (selectedCards.includes(id)) return;
    if (selectedCards.length >= 3) return;
    setSelectedCards([...selectedCards, id]);
  };

  const handleInterpret = async () => {
    setLoading(true);
    const names = selectedCards.map(id => TAROT_CARDS[id].name).join(', ');
    const prompt = `내가 뽑은 타로 카드는 ${names} 야.성인 사용자의 현실적인 고민(사업, 관계, 재물 등)을 고려해서 2026년 운세를 마크다운으로 아주 명쾌하고 쉽게 리딩해줘.`;
    const data = await getFortuneText('tarot', prompt);
    setResult(data);
    setLoading(false);
  };

  if (loading) return <Loading message="카드 속에 숨겨진 운명을 해석 중입니다..." />;

  if (result) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex justify-center gap-4 overflow-x-auto py-8">
          {selectedCards.map(id => (
            <div key={id} className="flex-shrink-0 w-36 sm:w-44 space-y-4 text-center">
              <div className="aspect-[2/3] bg-stone-800 rounded-2xl overflow-hidden border-2 border-amber-500/50 animate-flip shadow-2xl overflow-hidden group">
                <img
                  src={TAROT_CARDS[id].image}
                  alt={TAROT_CARDS[id].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <p className="text-sm text-amber-500 font-serif font-bold gold-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {TAROT_CARDS[id].name}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-stone-900/80 p-6 sm:p-10 rounded-3xl border border-stone-800 shadow-2xl backdrop-blur-sm">
          <h3 className="text-2xl font-serif font-bold gold-text mb-8 text-center">운명의 리딩 결과</h3>
          <MarkdownView content={result} theme="indigo" />
        </div>
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => downloadResultAsHtml(`타로 리딩 결과`, result)}
            className="py-5 bg-indigo-700 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>📥</span> 결과 이미지 저장
          </button>
          <button
            onClick={() => { setSelectedCards([]); setResult(null); }}
            className="py-5 bg-stone-800 text-stone-300 rounded-2xl font-bold hover:bg-stone-700 transition-all border border-white/5"
          >
            다시 한 번 기회를...
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-serif font-bold gold-text">마음을 가라앉히고 세 장의 카드를 선택하세요</h3>
        <div className="flex justify-center items-center gap-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
          <span className="text-amber-500 font-serif font-medium tracking-widest uppercase text-sm">
            Cards {selectedCards.length} / 3
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-0">
        {TAROT_CARDS.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={selectedCards.length >= 3 || selectedCards.includes(card.id)}
            className={`aspect-[2/3] rounded-2xl transition-all duration-500 transform relative overflow-hidden flex flex-col items-center justify-center shadow-xl group ${selectedCards.includes(card.id)
                ? 'tarot-card-selected'
                : 'tarot-card-back hover:scale-[1.02] hover:-translate-y-1'
              }`}
          >
            {/* Mystical details */}
            {!selectedCards.includes(card.id) && (
              <>
                <div className="mystic-ring" />
                <div className="mystic-ring w-[60%] h-[60%] border-amber-500/10 [animation-direction:reverse]" />
                <span className="text-3xl text-amber-500/30 group-hover:text-amber-500/50 transition-colors z-10 animate-pulse">✨</span>
              </>
            )}

            {/* Selection indicator */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${selectedCards.includes(card.id) ? 'opacity-100' : 'opacity-0'
              }`}>
              <div className="w-12 h-12 rounded-full border-2 border-amber-500 flex items-center justify-center">
                <span className="text-amber-500 text-xl font-bold">✓</span>
              </div>
            </div>

            {/* Corner decorations */}
            {!selectedCards.includes(card.id) && (
              <>
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-amber-500/30 rounded-tl" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-500/30 rounded-tr" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber-500/30 rounded-bl" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber-500/30 rounded-br" />
              </>
            )}
          </button>
        ))}
      </div>

      <div className={`transition-all duration-700 transform ${selectedCards.length === 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}>
        <button
          onClick={handleInterpret}
          className="w-full py-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-stone-900 rounded-2xl font-serif font-black text-xl hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(217,119,6,0.4)] gold-glow"
        >
          운명의 리딩 시작하기
        </button>
      </div>
    </div>
  );
};

export default TarotView;
