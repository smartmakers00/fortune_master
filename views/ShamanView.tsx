
import React, { useState, useEffect } from 'react';
import { getFortuneText } from '../services/gemini';
import Loading from '../components/Loading';
import { downloadResultAsHtml } from '../utils/download';
import MarkdownView from '../components/MarkdownView';
import { trackFortuneUsage } from '../utils/analytics';

const ShamanView: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    trackFortuneUsage('shaman');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const data = await getFortuneText('shaman', question);
    setResult(data);
    setLoading(false);
  };

  if (loading) return <Loading message="신령님의 목소리를 듣고 있습니다..." />;

  if (result) {
    return (
      <div className="space-y-6">
        <div className="bg-stone-900/90 p-8 rounded-3xl border-2 border-rose-900/30 shadow-2xl relative">
          <div className="absolute -top-4 -left-4 text-4xl">🎭</div>
          <h3 className="text-2xl font-serif font-bold text-rose-400 mb-6 text-center">이수진 무속인의 일침</h3>
          <MarkdownView content={result} theme="rose" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => downloadResultAsHtml(`신점 상담 결과`, result)}
            className="py-4 bg-rose-800 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>📥</span> HTML 다운로드
          </button>
          <button
            onClick={() => setResult(null)}
            className="py-4 bg-stone-800 text-white rounded-xl font-bold hover:bg-stone-700"
          >
            다른 고민 물어보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-800 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-rose-900/30 flex items-center justify-center text-3xl">👺</div>
          <div>
            <h3 className="text-xl font-bold text-white">무속인 이수진</h3>
            <p className="text-sm text-stone-400">꿰뚫어 보는 통찰력, 든든한 조력자</p>
          </div>
        </div>
        <p className="text-stone-300 italic">"사업이 안 풀리나? 사람이 문제인가? 답답한 게 있으면 솔직하게 말해봐라."</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          required
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="사업운, 이직, 금전 문제, 인간관계 고민... 무엇이든 솔직하게 적어주세요."
          className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-500 text-white resize-none"
        />
        <button
          type="submit"
          className="w-full py-5 bg-gradient-to-r from-rose-700 to-rose-900 text-white rounded-xl font-bold text-lg hover:from-rose-600 hover:to-rose-800 transition-all shadow-lg"
        >
          신점 상담 시작
        </button>
      </form>
    </div>
  );
};

export default ShamanView;
