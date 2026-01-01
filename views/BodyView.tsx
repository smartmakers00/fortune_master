
import React, { useState, useEffect } from 'react';
import { getFortuneText } from '../services/gemini';
import Loading from '../components/Loading';
import { downloadResultAsHtml, shareResultAsHtml } from '../utils/download';
import { trackFortuneUsage } from '../utils/analytics';

// 설문 데이터
const QUESTIONS = [
    {
        id: 1,
        question: "평소 체온이 어떤가요?",
        options: [
            { value: "hot", label: "🔥 더위를 많이 타고 땀을 자주 흘려요" },
            { value: "cold", label: "❄️ 추위를 많이 타고 손발이 차가워요" },
            { value: "normal", label: "🌡️ 보통이에요" }
        ]
    },
    {
        id: 2,
        question: "식사 후 소화는 어떤가요?",
        options: [
            { value: "good", label: "💪 소화가 빠르고 금방 배고파요" },
            { value: "slow", label: "😴 소화가 느리고 더부룩해요" },
            { value: "normal", label: "😊 보통이에요" }
        ]
    },
    {
        id: 3,
        question: "체중 변화는 어떤가요?",
        options: [
            { value: "gain", label: "📈 살이 잘 찌는 편이에요" },
            { value: "lose", label: "📉 살이 안 찌거나 빠지기 쉬워요" },
            { value: "stable", label: "⚖️ 체중이 안정적이에요" }
        ]
    },
    {
        id: 4,
        question: "에너지 레벨은 언제 가장 높나요?",
        options: [
            { value: "morning", label: "🌅 아침에 활력이 넘쳐요" },
            { value: "evening", label: "🌙 저녁에 더 활동적이에요" },
            { value: "stable", label: "😌 하루 종일 비슷해요" }
        ]
    },
    {
        id: 5,
        question: "스트레스 받을 때 주로 어떻게 되나요?",
        options: [
            { value: "appetite", label: "🍔 식욕이 증가해요" },
            { value: "lose_appetite", label: "🚫 식욕이 없어져요" },
            { value: "unchanged", label: "😐 별 변화 없어요" }
        ]
    },
    {
        id: 6,
        question: "선호하는 운동 스타일은?",
        options: [
            { value: "intense", label: "🏃 격렬한 유산소 운동" },
            { value: "strength", label: "💪 근력 운동" },
            { value: "gentle", label: "🧘 요가, 스트레칭 같은 부드러운 운동" }
        ]
    },
    {
        id: 7,
        question: "수면 패턴은 어떤가요?",
        options: [
            { value: "deep", label: "😴 깊게 자고 아침에 개운해요" },
            { value: "light", label: "😪 자주 깨고 피곤해요" },
            { value: "irregular", label: "🌀 불규칙해요" }
        ]
    },
    {
        id: 8,
        question: "물은 하루에 얼마나 마시나요?",
        options: [
            { value: "much", label: "💧 2L 이상" },
            { value: "normal", label: "💦 1-2L 정도" },
            { value: "little", label: "💤 1L 미만" }
        ]
    }
];

const BodyView: React.FC = () => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    useEffect(() => {
        trackFortuneUsage('body');
    }, []);

    const handleAnswer = (questionId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleAnalyze = async () => {
        setLoading(true);

        // 설문 응답을 텍스트로 변환
        const answersText = QUESTIONS.map((q, idx) => {
            const answer = q.options.find(opt => opt.value === answers[q.id]);
            return `${idx + 1}. ${q.question}\n   답변: ${answer?.label || '미응답'}`;
        }).join('\n\n');

        const prompt = `다음은 사용자의 체질 설문 응답입니다:\n\n${answersText}\n\n위 응답을 바탕으로 사용자의 대사 유형을 분석하고, 2026년에 맞춤형 다이어트 방법과 운동법을 HTML 형식으로 추천해주세요. 실용적이고 따라하기 쉬운 조언을 부탁드립니다.`;

        const data = await getFortuneText('body', prompt);
        setResult(data);
        setLoading(false);
    };

    const allAnswered = QUESTIONS.length === Object.keys(answers).length;

    if (loading) return <Loading message="당신의 체질을 AI로 분석 중입니다..." />;

    if (result) {
        return (
            <div className="space-y-8 pb-12">
                {/* 주의사항 배너 */}
                <div className="bg-amber-900/30 border-2 border-amber-600/50 p-5 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                            <h4 className="text-amber-400 font-bold mb-2">중요 안내</h4>
                            <p className="text-sm text-amber-200/90 leading-relaxed">
                                본 체질 분석은 <b>참고용</b>이며, <b>의학적 진단이나 치료를 대체하지 않습니다</b>.
                                건강 문제나 체중 관리에 대해서는 반드시 <b>의사, 영양사, 운동 전문가</b> 등
                                <span className="text-amber-300 font-bold"> 전문가와 상담</span>하시기 바랍니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 sm:p-10 rounded-3xl border border-green-800 shadow-2xl backdrop-blur-sm">
                    <h3 className="text-2xl font-serif font-bold text-green-400 mb-8 text-center">💪 체질 분석 결과</h3>
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result }} />
                </div>

                {/* 추가 안내 */}
                <div className="bg-stone-900/50 p-5 rounded-xl border border-stone-700">
                    <p className="text-xs text-stone-400 text-center leading-relaxed">
                        💡 <b>더 정확한 체질 진단</b>이 필요하시다면:
                        한의원(사상체질 진단), 병원(건강검진), 전문 트레이너(체성분 분석) 등을 방문하시는 것을 권장합니다.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => shareResultAsHtml(`체질 분석 결과`, result)}
                        className="py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold hover:from-emerald-500 hover:to-green-500 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <span>🔗</span> 결과 공유하기
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => downloadResultAsHtml(`체질 분석 결과`, result)}
                            className="py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            <span>📥</span> 다운로드
                        </button>
                        <button
                            onClick={() => { setAnswers({}); setResult(null); }}
                            className="py-4 bg-stone-800 text-stone-300 rounded-2xl font-bold hover:bg-stone-700 transition-all border border-white/5"
                        >
                            다시 분석
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            <div className="text-center space-y-4">
                <h3 className="text-2xl font-serif font-bold text-green-400">💪 나의 체질 & 건강 분석</h3>
                <p className="text-stone-400">간단한 질문에 답하고 AI 맞춤 다이어트와 운동법을 받아보세요</p>
                <div className="flex justify-center items-center gap-4">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-green-500/50" />
                    <span className="text-green-500 font-medium text-sm">
                        {Object.keys(answers).length} / {QUESTIONS.length} 완료
                    </span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-green-500/50" />
                </div>
            </div>

            {/* 진행률 바 */}
            <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%` }}
                />
            </div>

            {/* 질문 리스트 */}
            <div className="space-y-6">
                {QUESTIONS.map((question, index) => (
                    <div
                        key={question.id}
                        className={`bg-stone-900/50 p-6 rounded-2xl border transition-all ${answers[question.id]
                            ? 'border-green-700 shadow-lg shadow-green-900/20'
                            : 'border-stone-800'
                            }`}
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <span className={`text-2xl font-bold ${answers[question.id] ? 'text-green-400' : 'text-stone-600'
                                }`}>
                                {index + 1}
                            </span>
                            <h4 className="text-lg font-medium text-stone-200 flex-1">{question.question}</h4>
                        </div>
                        <div className="space-y-3 ml-12">
                            {question.options.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswer(question.id, option.value)}
                                    className={`w-full text-left px-6 py-4 rounded-xl transition-all ${answers[question.id] === option.value
                                        ? 'bg-green-700 text-white border-2 border-green-500 shadow-lg'
                                        : 'bg-stone-800/50 text-stone-300 border-2 border-transparent hover:border-green-700/50 hover:bg-stone-800'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 분석 버튼 */}
            <div className={`transition-all duration-700 transform ${allAnswered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
                }`}>
                <button
                    onClick={handleAnalyze}
                    disabled={!allAnswered}
                    className="w-full py-6 bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 text-white rounded-2xl font-serif font-black text-xl hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    💪 AI 체질 분석 시작하기
                </button>
                <p className="text-center text-xs text-stone-500 mt-3">
                    ⚠️ 본 분석은 참고용이며, 의학적 진단을 대체하지 않습니다
                </p>
            </div>
        </div>
    );
};

export default BodyView;
