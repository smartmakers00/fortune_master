
import React from 'react';
import { TarotCardData } from '../types';

interface TarotCardViewProps {
  card?: TarotCardData;
  isFlipped: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  className?: string;
  label?: string;
  isDrawing?: boolean;
}

const TarotCardView: React.FC<TarotCardViewProps> = ({ 
  card, 
  isFlipped, 
  isReversed, 
  onClick, 
  className = "",
  label,
  isDrawing = false
}) => {
  return (
    <div 
      className={`relative w-28 h-44 sm:w-32 sm:h-52 md:w-40 md:h-64 perspective-1000 cursor-pointer group select-none ${isFlipped ? 'card-flipped' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`card-inner relative w-full h-full shadow-2xl rounded-xl border-2 ${isDrawing ? 'border-yellow-400/50 animate-pulse' : 'border-transparent'}`}>
        {/* Back of the card (Face Down) */}
        <div className="card-front bg-indigo-950 border border-yellow-400/30 flex flex-col items-center justify-center p-1 sm:p-2 overflow-hidden">
          <div className="w-full h-full border border-yellow-400/20 rounded-lg flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent" />
             <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-yellow-400/40 rounded-full flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse" />
             </div>
             <p className="mt-3 sm:mt-4 text-[8px] sm:text-[10px] text-yellow-200/50 tracking-[0.2em] uppercase z-10 font-medium">Starlight</p>
          </div>
        </div>

        {/* Front of the card (Actual Card Content) */}
        <div className="card-back bg-white text-indigo-950 overflow-hidden flex flex-col shadow-inner">
          <div className={`flex-1 flex flex-col items-center justify-center p-2 ${isReversed ? 'rotate-180' : ''}`}>
             <div className="w-full h-full border-2 sm:border-4 border-indigo-900/5 rounded flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50/50 to-white relative p-1.5 overflow-hidden">
                <span className="text-2xl sm:text-4xl mb-1 sm:mb-3">✨</span>
                <div className="flex flex-col items-center justify-center max-w-full px-1">
                  <p className="text-[11px] sm:text-[13px] md:text-sm font-extrabold text-center leading-tight mb-1 break-keep">
                    {card?.name}
                  </p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-tighter text-center leading-none max-w-full truncate px-1">
                    {card?.englishName}
                  </p>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] text-center text-[7px] sm:text-[8px] md:text-[9px] font-black px-1.5 py-1 bg-indigo-900 text-white rounded-sm shadow-sm truncate">
                  {card?.keyword}
                </div>
             </div>
          </div>
        </div>
      </div>
      {label && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] sm:text-[11px] font-black text-yellow-400 bg-indigo-950/90 px-3 py-1 rounded-full border border-yellow-500/30 shadow-2xl z-20">
          {label}
        </div>
      )}
    </div>
  );
};

export default TarotCardView;
