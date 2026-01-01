
import React, { useState, useEffect } from 'react';
import { getFaceReading } from '../services/gemini';
import Loading from '../components/Loading';
import { downloadResultAsHtml } from '../utils/download';
import MarkdownView from '../components/MarkdownView';
import { trackFortuneUsage } from '../utils/analytics';
import ImageCapture from '../components/ImageCapture';

const FaceView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  useEffect(() => {
    trackFortuneUsage('face');
  }, []);

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);

    const base64 = image.split(',')[1];
    const additionalContext = `
분석 대상: ${gender === 'male' ? '남성' : '여성'}의 얼굴 (정면 기준)
참고: 얼굴 정면을 기준으로 관상을 분석해주세요.
`;

    const data = await getFaceReading(base64, additionalContext);
    setResult(data);
    setLoading(false);
  };

  if (loading) return <Loading message="관상 사진을 분석하여 운명을 읽는 중입니다..." />;

  if (result) {
    return (
      <div className="space-y-6">
        <div className="relative aspect-square w-48 mx-auto rounded-full overflow-hidden border-4 border-amber-500 shadow-xl">
          <img src={image!} alt="관상 사진" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 bg-amber-500 px-2 py-1 rounded-lg text-xs font-bold text-white">
            {gender === 'male' ? '남성' : '여성'}
          </div>
        </div>
        <div className="bg-stone-900/80 p-8 rounded-3xl border border-stone-800 shadow-xl">
          <h3 className="text-2xl font-serif font-bold gold-text mb-6 text-center">박민재 관상가의 분석 결과</h3>
          <MarkdownView content={result} theme="emerald" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => downloadResultAsHtml(`관상 분석 결과`, result)}
            className="py-4 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            <span>📥</span> HTML 다운로드
          </button>
          <button
            onClick={() => { setImage(null); setResult(null); }}
            className="py-4 bg-stone-800 text-white rounded-xl font-bold hover:bg-stone-700"
          >
            다른 사진으로 분석
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">관상 분석을 위해 얼굴 사진을 업로드하세요</h3>
        <p className="text-stone-400 text-sm">정면을 향한 밝고 선명한 얼굴 사진이 가장 정확합니다.</p>
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

      {!image ? (
        <ImageCapture onImageCapture={setImage} type="face" />
      ) : (
        <div className="space-y-4">
          <div className="aspect-square max-w-sm mx-auto rounded-full overflow-hidden border-2 border-amber-500">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleAnalyze}
              className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl font-bold text-lg hover:from-emerald-500 hover:to-emerald-700 transition-all gold-glow"
            >
              관상 분석 시작
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

export default FaceView;
