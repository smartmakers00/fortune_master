
import React from 'react';

const Loading: React.FC<{ message?: string }> = ({ message = "기운을 모으는 중입니다..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-stone-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🔮</div>
      </div>
      <p className="text-stone-400 animate-pulse font-serif italic text-lg">{message}</p>
    </div>
  );
};

export default Loading;
