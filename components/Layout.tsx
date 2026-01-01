
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col p-4">
      <header className="py-6 flex items-center justify-between border-b border-stone-800 mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} aria-label="Go back" className="text-stone-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <h1 className="text-2xl font-serif font-bold gold-text">
            {title || "2026 신년운세 마스터"}
          </h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center">
          <span className="text-xs">🔮</span>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-8 text-center text-stone-600 text-sm">
        <p>© 2026 Fortune Master AI. All rights reserved.</p>
        <p className="mt-2">사주, 타로, 관상은 참고용일 뿐입니다.</p>
      </footer>
    </div>
  );
};

export default Layout;
