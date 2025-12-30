
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  streamingText?: string;
  userProfile: UserProfile;
  onEditProfile: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  streamingText,
  userProfile,
  onEditProfile
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  // 공백 최적화: mb(하단 여백) 수치를 낮추어 텍스트 밀도를 높임
  const formatContent = (text: string) => {
    if (!text) return "";
    let formatted = text
      .replace(/### (.*?)\n/g, '<h3 class="text-yellow-400 font-black text-lg mt-2 mb-1.5 border-l-4 border-yellow-500 pl-3 tracking-tighter">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<b class="text-orange-300 font-black">$1</b>')
      .replace(/^- (.*?)\n/gm, '<li class="ml-4 mb-0.5 text-[16px] leading-relaxed list-disc text-gray-200">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-1.5 leading-relaxed text-[16px] text-gray-200">')
      .replace(/\n/g, '<br/>');

    if (!formatted.startsWith('<h3') && !formatted.startsWith('<p')) {
      formatted = `<p class="mb-1.5 leading-relaxed text-[16px] text-gray-200">${formatted}</p>`;
    }
    return formatted;
  };

  const hasProfile = userProfile.name !== '' && userProfile.birthDate !== '';
  const genderDisplay = userProfile.gender === 'male' ? '남성' : userProfile.gender === 'female' ? '여성' : '정보 없음';

  return (
    <div className="flex flex-col h-full glass rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative">
      <div className="px-5 py-3 sm:p-4 border-b border-white/10 bg-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
          <span className="font-black text-[10px] sm:text-xs tracking-widest text-white/90 uppercase">Celestial Master</span>
        </div>
        <div 
          onClick={onEditProfile}
          className="flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/10 transition-all active:scale-95"
        >
          <span className="text-[10px] text-yellow-400 font-black">
            {hasProfile ? `${userProfile.name}님 (${genderDisplay})` : '내 정보 입력'}
          </span>
          <div className="w-[1px] h-2 bg-white/20 mx-0.5" />
          <span className="text-[10px] text-gray-400 font-bold">수정</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scroll-smooth custom-scrollbar bg-black/10">
        {messages.length === 0 && !streamingText && (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-6 opacity-40">
            <span className="text-5xl animate-float">✨</span>
            <p className="text-sm font-medium tracking-tight">당신의 이름을 알려주시면<br/>2026년의 행운을 불러올게요.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            <div className={`max-w-[92%] sm:max-w-[85%] p-4 sm:p-5 rounded-[1.5rem] shadow-xl ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-red-800 to-orange-700 text-white rounded-tr-none border border-white/20 ml-6' 
                : 'bg-white/5 text-gray-100 rounded-tl-none border border-white/10 mr-6'
            }`}>
              {msg.role === 'user' ? (
                <p className="font-bold tracking-tight text-[16px] leading-snug">{msg.content}</p>
              ) : (
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} 
                />
              )}
            </div>
          </div>
        ))}
        
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[92%] sm:max-w-[85%] p-4 sm:p-5 rounded-[1.5rem] rounded-tl-none bg-white/5 text-gray-100 border border-white/10 mr-6 shadow-xl">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContent(streamingText) }} 
              />
              <span className="inline-block w-1.5 h-4 ml-1 bg-yellow-400 animate-pulse align-middle" />
            </div>
          </div>
        )}

        {isLoading && !streamingText && (
          <div className="flex justify-start">
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div className="h-10" />
      </div>

      <div className="bg-black/40 border-t border-white/10 p-4 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={hasProfile ? `${userProfile.name}님, 무엇이 궁금하신가요?` : "정보를 먼저 입력해주세요"}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[16px] focus:outline-none focus:ring-1 focus:ring-yellow-500/20 transition-all h-[52px] resize-none text-white placeholder:text-gray-600 font-medium custom-scrollbar"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !hasProfile}
            className={`bg-gradient-to-br from-red-700 to-orange-600 text-white px-4 h-[52px] rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 flex-shrink-0 min-w-[64px] ${
              (isLoading || !input.trim() || !hasProfile) ? 'opacity-20 grayscale' : 'hover:brightness-110 shadow-red-900/20'
            }`}
          >
            <span className="text-sm font-black tracking-tighter leading-none">풀이</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
