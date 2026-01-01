
import React, { useState, useRef } from 'react';
import CameraPermissionModal from './CameraPermissionModal';

interface ImageCaptureProps {
    onImageCapture: (imageData: string) => void;
    type?: 'palm' | 'face';
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCapture, type = 'face' }) => {
    const [cameraMode, setCameraMode] = useState<'off' | 'user' | 'environment'>('off');
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAutoMode, setIsAutoMode] = useState(true);
    const [detectionStatus, setDetectionStatus] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const nativeCameraInputRef = useRef<HTMLInputElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const detectorRef = useRef<any>(null);
    const rafRef = useRef<number | null>(null);
    const lastDetectionTimeRef = useRef<number>(0);

    // MediaPipe 초기화 (CDN 활용)
    const initDetection = async () => {
        try {
            const vision = (window as any).tasksVision;
            if (!vision || detectorRef.current) return;

            setDetectionStatus('AI 모델 로딩 중...');

            const filesetResolver = await vision.FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            if (type === 'face') {
                detectorRef.current = await vision.FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numFaces: 1
                });
            } else {
                detectorRef.current = await vision.HandLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
            }
            setDetectionStatus('AI 준비 완료');
        } catch (err) {
            console.error('Detection init error:', err);
            setDetectionStatus('실시간 인식 비활성 (수동 촬영 가능)');
        }
    };

    // 실시간 감지 루프
    const startDetectionLoop = () => {
        if (!videoRef.current || !overlayCanvasRef.current) return;

        const video = videoRef.current;
        const canvas = overlayCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const detect = async () => {
            if (video.paused || video.ended) return;

            // 캔버스 크기 맞춤
            if (canvas.width !== video.videoWidth) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 가이드 사각형 크기 세로형으로 대폭 확대
            const guideWidth = canvas.width * 0.8;
            const guideHeight = Math.min(guideWidth * 1.3, canvas.height * 0.85);
            const x = (canvas.width - guideWidth) / 2;
            const y = (canvas.height - guideHeight) / 2;

            // 가이드 UI 그리기
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
            ctx.lineWidth = 3;
            ctx.setLineDash([15, 10]);
            ctx.strokeRect(x, y, guideWidth, guideHeight);

            // 코너 강조
            const cornerLen = 40; ctx.setLineDash([]); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.moveTo(x, y + cornerLen); ctx.lineTo(x, y); ctx.lineTo(x + cornerLen, y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + guideWidth - cornerLen, y); ctx.lineTo(x + guideWidth, y); ctx.lineTo(x + guideWidth, y + cornerLen); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x, y + guideHeight - cornerLen); ctx.lineTo(x, y + guideHeight); ctx.lineTo(x + cornerLen, y + guideHeight); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + guideWidth - cornerLen, y + guideHeight); ctx.lineTo(x + guideWidth, y + guideHeight); ctx.lineTo(x + guideWidth, y + guideHeight - cornerLen); ctx.stroke();

            // 실제 감지 여부 확인
            let isDetected = false;
            try {
                if (detectorRef.current) {
                    const results = detectorRef.current.detectForVideo(video, performance.now());
                    isDetected = type === 'face'
                        ? (results.faceLandmarks && results.faceLandmarks.length > 0)
                        : (results.landmarks && results.landmarks.length > 0);
                }
            } catch (e) {
                isDetected = false;
            }

            if (isAutoMode) {
                const now = Date.now();
                if (isDetected) {
                    if (lastDetectionTimeRef.current === 0) lastDetectionTimeRef.current = now;
                    const elapsed = (now - lastDetectionTimeRef.current) / 1000;

                    if (elapsed > 0.5) {
                        const progress = Math.min((elapsed - 0.5) / 1.5, 1);
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; ctx.fillRect(x, y + guideHeight + 10, guideWidth, 8);
                        ctx.fillStyle = '#fbbf24'; ctx.fillRect(x, y + guideHeight + 10, guideWidth * progress, 8);

                        if (progress < 1) {
                            setDetectionStatus(`${type === 'face' ? '얼굴' : '손'} 인식됨! 잠시 정지...`);
                        } else {
                            setDetectionStatus('📸 촬영!');
                            capturePhoto();
                            lastDetectionTimeRef.current = 0;
                            return;
                        }
                    }
                } else {
                    if (lastDetectionTimeRef.current === 0) lastDetectionTimeRef.current = now;
                    const totalElapsed = (now - lastDetectionTimeRef.current) / 1000;

                    if (totalElapsed > 3.5) {
                        setDetectionStatus('자동 촬영 중...');
                        capturePhoto();
                        lastDetectionTimeRef.current = 0;
                        return;
                    } else {
                        setDetectionStatus(type === 'face' ? '박스 안에 얼굴을 맞춰주세요' : '박스 안에 손바닥을 펼쳐주세요');
                    }
                }
            }

            rafRef.current = requestAnimationFrame(detect);
        };

        detect();
    };

    const startCamera = async (facingMode: 'user' | 'environment') => {
        setCameraMode(facingMode);
        setIsInitializing(true);
        setError(null);
        lastDetectionTimeRef.current = 0;

        try {
            await initDetection();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                videoRef.current.onloadedmetadata = () => {
                    setIsInitializing(false);
                    startDetectionLoop();
                };
            }
        } catch (err: any) {
            console.error('Camera error:', err);
            if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                setError('카메라를 시작할 수 없습니다. 다른 앱에서 카메라를 사용 중인지 확인해 주세요.');
            } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError('카메라 권한이 거부되었습니다.');
            } else {
                setError(`카메라 연결 오류: ${err.message || '알 수 없는 오류'}`);
            }
            setIsInitializing(false);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (cameraMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onImageCapture(imageData);
        stopCamera();
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraMode('off');
        setError(null);
        setIsInitializing(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageCapture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    React.useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="space-y-4">
            <p className="text-stone-300 text-sm text-center">
                {type === 'palm' ? '손바닥 사진을 업로드하거나 촬영하세요' : '얼굴 사진을 업로드하거나 촬영하세요'}
            </p>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="py-4 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors flex items-center justify-center gap-2"
                >
                    📁 사진 선택
                </button>
                <button
                    onClick={() => setShowPermissionModal(true)}
                    className="py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    📸 직접 촬영
                </button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <input ref={nativeCameraInputRef} type="file" accept="image/*" capture={type === 'face' ? 'user' : 'environment'} onChange={handleFileSelect} className="hidden" />

            {cameraMode !== 'off' && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md">
                    <div className="w-full max-w-2xl bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-stone-800 flex justify-between items-center bg-stone-900/50">
                            <span className="text-stone-300 font-bold text-xs uppercase tracking-wider">AI Camera Active</span>
                            <button onClick={stopCamera} className="text-stone-500 hover:text-white p-2">✕</button>
                        </div>
                        <div className="relative aspect-[3/4] bg-black overflow-hidden flex items-center justify-center min-h-[300px]">
                            {isInitializing && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900 z-10">
                                    <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
                                    <p className="text-stone-400 text-sm">카메라 연결 중...</p>
                                </div>
                            )}
                            {error ? (
                                <div className="p-8 text-center space-y-6">
                                    <p className="text-white font-bold">{error}</p>
                                    <button onClick={() => nativeCameraInputRef.current?.click()} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold">기본 카메라 앱 사용</button>
                                </div>
                            ) : (
                                <>
                                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${cameraMode === 'user' ? 'scale-x-[-1]' : ''}`} />
                                    <canvas ref={overlayCanvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${cameraMode === 'user' ? 'scale-x-[-1]' : ''}`} />
                                    {!isInitializing && (
                                        <div className="absolute top-6 left-0 right-0 text-center px-4">
                                            <span className="bg-amber-500 text-stone-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce">
                                                {detectionStatus || '위치를 맞춰주세요'}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="p-6 bg-stone-900 flex justify-center items-center gap-6">
                            <button onClick={stopCamera} className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-stone-400">✕</button>
                            <button onClick={capturePhoto} disabled={isInitializing || !!error} className="w-16 h-16 rounded-full bg-white p-1">
                                <div className="w-full h-full rounded-full border-4 border-stone-900 bg-amber-500 flex items-center justify-center text-2xl">📸</div>
                            </button>
                            <button onClick={() => startCamera(cameraMode === 'user' ? 'environment' : 'user')} className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-stone-400">🔄</button>
                        </div>
                    </div>
                </div>
            )}
            {showPermissionModal && (
                <CameraPermissionModal
                    type={type}
                    onPermissionGranted={() => { setShowPermissionModal(false); startCamera(type === 'face' ? 'user' : 'environment'); }}
                    onPermissionDenied={() => { setShowPermissionModal(false); setError('카메라 권한이 필요합니다.'); }}
                />
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default ImageCapture;
