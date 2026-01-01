
import React, { useState } from 'react';

interface CameraPermissionModalProps {
    type: 'palm' | 'face';
    onPermissionGranted: () => void;
    onPermissionDenied: () => void;
}

const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({
    type,
    onPermissionGranted,
    onPermissionDenied,
}) => {
    const [isRequesting, setIsRequesting] = useState(false);

    const requestPermission = async () => {
        setIsRequesting(true);

        try {
            // 카메라 권한 요청
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            // 권한 획득 성공, 즉시 스트림 종료
            stream.getTracks().forEach((track) => track.stop());
            onPermissionGranted();
        } catch (error) {
            console.error('Camera permission denied:', error);
            onPermissionDenied();
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-stone-900 p-8 rounded-2xl border border-stone-700 max-w-md w-full">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <span className="text-6xl">📷</span>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-stone-900 animate-pulse"></div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">카메라 권한 요청</h2>
                        <p className="text-stone-300">
                            AI ${type === 'palm' ? '손금' : '관상'} 분석을 위해 사진 촬영이 필요합니다.
                        </p>
                    </div>

                    <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700 text-left space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="text-blue-400 mt-1">🔒</span>
                            <div>
                                <p className="text-sm font-bold text-white">철저한 개인정보 보호</p>
                                <p className="text-xs text-stone-400 leading-relaxed">
                                    사용자의 사진은 절대 서버에 저장되지 않습니다. AI 분석이 끝나는 즉시 메모리에서 삭제되어 익명성이 보장됩니다.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-amber-400 mt-1">💡</span>
                            <div>
                                <p className="text-sm font-bold text-white">촬영이 안 될 경우</p>
                                <p className="text-xs text-stone-400 leading-relaxed">
                                    브라우저 주소창 왼쪽의 자물쇠 아이콘을 눌러 카메라 권한이 '허용'되어 있는지 확인해 주세요.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={requestPermission}
                            disabled={isRequesting}
                            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {isRequesting ? '권한 확인 중...' : '동의하고 시작하기'}
                        </button>

                        <button
                            onClick={onPermissionDenied}
                            className="w-full py-3 text-stone-500 hover:text-stone-300 transition-colors text-sm font-medium"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CameraPermissionModal;
