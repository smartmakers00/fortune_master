
import React from 'react';
import { FortuneType } from '../types';

interface HomeProps {
  onSelect: (type: FortuneType) => void;
}

const CATEGORIES = [
  { id: 'tojeong', icon: '📜', title: '토정비결', desc: '2026년 병오년 신년 운세 비결', color: 'bg-orange-900/20' },
  { id: 'saju', icon: '📅', title: '정통 사주', desc: '생년월일로 풀어보는 평생운', color: 'bg-amber-900/20' },
  { id: 'tarot', icon: '🃏', title: '신비 타로', desc: '카드에 담긴 2026년의 조언', color: 'bg-indigo-900/20' },
  { id: 'palm', icon: '✋', title: '인공지능 손금', desc: '손바닥에 새겨진 운명의 선', color: 'bg-cyan-900/20' },
  { id: 'face', icon: '👁️', title: '인공지능 관상', desc: '얼굴의 길흉화복 분석', color: 'bg-emerald-900/20' },
  { id: 'shaman', icon: '🎭', title: '예리한 신점', desc: '답답한 속을 뻥 뚫어주는 일침', color: 'bg-rose-900/20' },
];

const Home: React.FC<HomeProps> = ({ onSelect }) => {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h2 className="text-4xl font-serif font-bold text-white leading-tight">
          당신의 <span className="gold-text">2026년</span>,<br />운명의 지도를 그려드립니다
        </h2>
        <p className="text-stone-400">전통의 지혜와 최첨단 AI의 만남</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id as FortuneType)}
            className={`flex items-center p-5 rounded-2xl border border-stone-800 hover:border-amber-500/50 transition-all text-left group hover:gold-glow ${cat.color}`}
          >
            <span className="text-3xl mr-4 shrink-0">{cat.icon}</span>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-stone-100 mb-0.5 group-hover:gold-text truncate">{cat.title}</h3>
              <p className="text-xs text-stone-400 line-clamp-1">{cat.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <section className="bg-stone-900/50 p-6 rounded-2xl border border-stone-800">
        <h4 className="text-stone-300 font-bold mb-4 flex items-center gap-2">
          <span>🔥</span> 2026년 인기 키워드
        </h4>
        <div className="flex flex-wrap gap-2">
          {['#2026 병오년', '#붉은말띠', '#재물운대통', '#손금비밀', '#토정비결무료'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-stone-800 rounded-full text-xs text-stone-400 cursor-pointer hover:text-amber-400 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <div className="text-center mt-12">
        <button
          onClick={() => onSelect('admin')}
          className="text-xs text-stone-600 hover:text-amber-400 transition-colors"
        >
          ⚙️ 관리자
        </button>
      </div>
    </div>
  );
};

export default Home;
