
import React from 'react';
import { SPREADS } from '../constants';
import { SpreadType, SubServiceType } from '../types';

interface LandingViewProps {
  onStartConsultation: (spread: any) => void;
  onStartSubService: (type: SubServiceType) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStartConsultation, onStartSubService }) => {
  return (
    <div className="py-6 sm:py-16 space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-3">
        <h2 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tighter italic">당신의<br/><span className="text-yellow-400">병오년</span><br/> 운명을 읽다</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {SPREADS.map(spread => (
          <div key={spread.type} onClick={() => onStartConsultation(spread)} className="glass p-5 rounded-[2rem] hover:border-yellow-400/40 cursor-pointer text-center group transition-all">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              {spread.type === SpreadType.TOJEONG_2026 ? '📖' : '🔮'}
            </div>
            <h3 className="text-[13px] font-black mb-1">{spread.name}</h3>
            <p className="text-[9px] text-gray-400 line-clamp-2 leading-relaxed">{spread.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        <h3 className="text-[10px] font-black text-center text-orange-400/80 tracking-[0.3em] uppercase">행운의 테마</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5">
           {[
             { type: SubServiceType.LOTTO, icon: '🎰', name: '로또' },
             { type: SubServiceType.SEBAEDON, icon: '🧧', name: '세뱃돈' },
             { type: SubServiceType.HOROSCOPE, icon: '✨', name: '별자리' },
             { type: SubServiceType.DREAM, icon: '☁️', name: '해몽' },
             { type: SubServiceType.FOOD, icon: '🍚', name: '식단' },
           ].map(item => (
             <div key={item.type} onClick={() => onStartSubService(item.type)} className="glass p-4 rounded-[1.5rem] hover:bg-white/10 cursor-pointer text-center group transition-all border-white/5">
                <div className="text-2xl mb-1.5 group-hover:rotate-6 transition-transform">{item.icon}</div>
                <h4 className="text-[9px] font-black text-white/70">{item.name}</h4>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default LandingView;
