
import React, { useState, useEffect } from 'react';
import { getPalmReading } from '../services/gemini';
import Loading from '../components/Loading';
import { downloadResultAsHtml } from '../utils/download';
import MarkdownView from '../components/MarkdownView';
import { trackFortuneUsage } from '../utils/analytics';
import ImageCapture from '../components/ImageCapture';

const PalmView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [hand, setHand] = useState<'left' | 'right'>('left');

  useEffect(() => {
    trackFortuneUsage('palm');
  }, []);

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);

    const base64 = image.split(',')[1];
    const additionalContext = `
분석 대상: ${gender === 'male' ? '남성' : '여성'}
분석 손: ${hand === 'left' ? '왼손' : '오른손'}

[최신 손금 해석 기준]
- 왼손: 선천적 운명 (타고난 성격, 재능, 가문의 영향, 잠재력 - 30세 이전)
- 오른손: 후천적 노력 (현재의 상태, 노력으로 바뀐 운명, 사회적 성취 - 30세 이후)
`;

    const data = await getPalmReading(base64, additionalContext);
    setResult(data);
    setLoading(false);
  };

  if (loading) return <Loading message="손금의 결을 따라 운명의 지도를 그리는 중입니다..." />;

  if (result) {
    return (
      <div className="space-y-6">
        <div className="relative aspect-square w-48 mx-auto rounded-2xl overflow-hidden border-4 border-cyan-500 shadow-xl rotate-12">
          <img src={image!} alt="손금 사진" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 bg-cyan-500 px-2 py-1 rounded-lg text-xs font-bold text-white">
            {gender === 'male' ? '남성' : '여성'} · {hand === 'left' ? '왼손' : '오른손'}
          </div>
        </div>
        <div className="bg-stone-900/80 p-8 rounded-3xl border border-stone-800 shadow-xl">
          <h3 className="text-2xl font-serif font-bold text-cyan-400 mb-6 text-center">수상(手相) 감정 결과</h3>
          <MarkdownView content={result} theme="cyan" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => downloadResultAsHtml(`손금 분석 결과`, result)}
            className="py-4 bg-cyan-700 text-white rounded-xl font-bold hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
          >
            <span>📥</span> HTML 다운로드
          </button>
          <button
            onClick={() => { setImage(null); setResult(null); }}
            className="py-4 bg-stone-800 text-white rounded-xl font-bold hover:bg-stone-700"
          >
            다시 분석하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">손바닥 사진을 업로드하세요</h3>
        <p className="text-stone-400 text-sm">손금이 선명하게 보이도록 밝은 곳에서 찍은 사진이 좋습니다.</p>
      </div>

      {/* 성별 선택 */}
      <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-800">
        <label className="block text-sm text-stone-300 mb-2">성별 선택</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setGender('male')}
            className={`py-3 rounded-xl font-bold transition-all ${gender === 'male'
              ? 'bg-blue-600 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            👨 남성
          </button>
          <button
            onClick={() => setGender('female')}
            className={`py-3 rounded-xl font-bold transition-all ${gender === 'female'
              ? 'bg-pink-600 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            👩 여성
          </button>
        </div>
      </div>

      {/* 손 선택 */}
      <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-800">
        <label className="block text-sm text-stone-300 mb-2">
          어느 손을 분석하시겠습니까?
        </label>
        <p className="text-xs text-stone-500 mb-3">
          왼손: 선천적 운명 (30세 이전) · 오른손: 후천적 노력 (30세 이후)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setHand('left')}
            className={`py-3 rounded-xl font-bold transition-all ${hand === 'left'
              ? 'bg-cyan-600 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            👈 왼손
          </button>
          <button
            onClick={() => setHand('right')}
            className={`py-3 rounded-xl font-bold transition-all ${hand === 'right'
              ? 'bg-cyan-600 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            👉 오른손
          </button>
        </div>
      </div>

      {!image ? (
        <ImageCapture onImageCapture={setImage} type="palm" />
      ) : (
        <div className="space-y-4">
          <div className="aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden border-2 border-cyan-500">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleAnalyze}
              className="w-full py-5 bg-gradient-to-r from-cyan-600 to-cyan-800 text-white rounded-xl font-bold text-lg hover:from-cyan-500 hover:to-cyan-700 transition-all shadow-lg"
            >
              손금 분석 시작
            </button>
            <button
              onClick={() => setImage(null)}
              className="py-5 bg-stone-700 text-white rounded-xl hover:bg-stone-600 transition-colors"
            >
              다시 촬영
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PalmView;
