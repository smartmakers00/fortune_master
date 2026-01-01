
import React, { useState, useEffect } from 'react';
import { getFortuneText } from '../services/gemini';
import Loading from '../components/Loading';
import { downloadResultAsHtml } from '../utils/download';
import MarkdownView from '../components/MarkdownView';
import { trackFortuneUsage } from '../utils/analytics';
import { createCacheKey, getCachedResult, cacheResult } from '../utils/cache';
import CustomDatePicker from '../components/CustomDatePicker';

const SajuView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: 'unknown',
    gender: 'male',
    isLunar: false
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackFortuneUsage('saju');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 캐시 키 생성
    const cacheKey = createCacheKey('saju', formData);

    // 캐시 확인
    const cachedResult = getCachedResult(cacheKey);
    if (cachedResult) {
      setResult(cachedResult);
      return; // 캐시된 결과 사용
    }

    // API 호출
    setLoading(true);
    const prompt = `성함: ${formData.name}, 생년월일: ${formData.birthDate}, 탄생시: ${formData.birthTime}, 성별: ${formData.gender}, ${formData.isLunar ? '음력' : '양력'}. 이 정보를 바탕으로 일반 성인의 삶(직장, 재물, 가정 등)을 고려하여 2026년 운세를 포함한 정통 사주를 마크다운으로 아주 쉽고 명확하게 풀이해줘.`;
    const data = await getFortuneText('saju', prompt);

    // 결과 캐싱
    cacheResult(cacheKey, data);
    setResult(data);
    setLoading(false);
  };

  if (loading) return <Loading message="천기를 읽는 중입니다. 잠시만 기다려주세요..." />;

  if (result) {
    return (
      <div className="space-y-6">
        <div className="bg-stone-900/80 p-8 rounded-3xl border border-amber-900/30 shadow-2xl">
          <h3 className="text-2xl font-serif font-bold gold-text mb-6 text-center">강현우 선생님의 사주 풀이</h3>
          <MarkdownView content={result} theme="amber" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => downloadResultAsHtml(`${formData.name}님의 사주 풀이`, result)}
            className="py-4 bg-amber-700 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
          >
            <span>📥</span> HTML 다운로드
          </button>
          <button
            onClick={() => setResult(null)}
            className="py-4 bg-stone-800 text-white rounded-xl font-bold hover:bg-stone-700 transition-colors"
          >
            다시 확인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-stone-900/50 p-6 rounded-2xl border border-stone-800">
      <div className="space-y-2">
        <label className="text-sm text-stone-400">성함</label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-white"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomDatePicker
          label="생년월일"
          value={formData.birthDate}
          onChange={(date) => setFormData({ ...formData, birthDate: date })}
        />
        <div className="space-y-2">
          <label className="text-sm text-stone-400">태어난 시</label>
          <div className="relative group">
            <select
              value={formData.birthTime}
              onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-white appearance-none transition-all"
            >
              <option value="unknown">모름</option>
              <option value="00:00">자시 (23:30 ~ 01:30)</option>
              <option value="02:00">축시 (01:30 ~ 03:30)</option>
              <option value="04:00">인시 (03:30 ~ 05:30)</option>
              <option value="06:00">묘시 (05:30 ~ 07:30)</option>
              <option value="08:00">진시 (07:30 ~ 09:30)</option>
              <option value="10:00">사시 (09:30 ~ 11:30)</option>
              <option value="12:00">오시 (11:30 ~ 13:30)</option>
              <option value="14:00">미시 (13:30 ~ 15:30)</option>
              <option value="16:00">신시 (15:30 ~ 17:30)</option>
              <option value="18:00">유시 (17:30 ~ 19:30)</option>
              <option value="20:00">술시 (19:30 ~ 21:30)</option>
              <option value="22:00">해시 (21:30 ~ 23:30)</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">▼</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm text-stone-400">성별</label>
          <div className="flex bg-stone-800 rounded-xl p-1 border border-stone-700">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: 'male' })}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${formData.gender === 'male' ? 'bg-amber-600 text-white' : 'text-stone-500'}`}
            >남성</button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: 'female' })}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${formData.gender === 'female' ? 'bg-amber-600 text-white' : 'text-stone-500'}`}
            >여성</button>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm text-stone-400">달력 기준</label>
          <div className="flex bg-stone-800 rounded-xl p-1 border border-stone-700">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isLunar: false })}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${!formData.isLunar ? 'bg-amber-600 text-white' : 'text-stone-500'}`}
            >양력</button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isLunar: true })}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${formData.isLunar ? 'bg-amber-600 text-white' : 'text-stone-500'}`}
            >음력</button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold text-lg hover:from-amber-500 hover:to-amber-600 transition-all gold-glow"
      >
        사주 분석 시작
      </button>
    </form>
  );
};

export default SajuView;
