import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // 페이지 로드 후 5초 후에 프롬프트 표시
            setTimeout(() => setShowPrompt(true), 5000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted PWA install');
        } else {
            console.log('User dismissed PWA install');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // 하루 동안 다시 보지 않기
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    // 하루 이내에 거부한 경우 프롬프트를 표시하지 않음
    useEffect(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed);
            const oneDayInMs = 24 * 60 * 60 * 1000;
            if (Date.now() - dismissedTime < oneDayInMs) {
                setShowPrompt(false);
            }
        }
    }, []);

    if (!showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 rounded-2xl shadow-2xl border-2 border-amber-300">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">🔮</div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">앱으로 설치하기</h3>
                        <p className="text-amber-50 text-sm mb-4">
                            홈 화면에 추가하여 언제든지 빠르게 운세를 확인하세요!
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstall}
                                className="flex-1 bg-white text-amber-700 px-4 py-2 rounded-xl font-bold hover:bg-amber-50 transition-colors"
                            >
                                설치하기
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2 text-white hover:bg-amber-600 rounded-xl transition-colors"
                            >
                                나중에
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
