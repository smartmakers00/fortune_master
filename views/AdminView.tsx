
import React, { useState, useEffect } from 'react';
import { getFortuneStats, resetFortuneStats, FortuneStats } from '../utils/analytics';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

const AdminView: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState<FortuneStats>(getFortuneStats());

    // 세션 확인
    useEffect(() => {
        if (!supabase) return; // Supabase 클라이언트가 없으면 중단

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
            }
        };
        checkSession();

        // Auth 상태 변경 리스너
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 통계 업데이트
    useEffect(() => {
        if (user) {
            const interval = setInterval(() => {
                setStats(getFortuneStats());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                setUser(data.user);
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setEmail('');
        setPassword('');
    };

    // Supabase 설정이 없는 경우 처리
    if (!supabase) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-stone-900/50 p-8 rounded-2xl border border-stone-800 w-full max-w-md text-center space-y-4">
                    <h2 className="text-2xl font-bold text-red-400">설정 필요</h2>
                    <p className="text-stone-300">
                        Supabase 환경 변수가 설정되지 않았습니다.<br />
                        `.env.local` 파일 또는 배포 환경 설정을 확인해주세요.
                    </p>
                    <div className="bg-stone-800 p-4 rounded-lg text-left text-xs text-stone-400 font-mono">
                        VITE_SUPABASE_URL<br />
                        VITE_SUPABASE_ANON_KEY
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <form onSubmit={handleLogin} className="bg-stone-900/50 p-8 rounded-2xl border border-stone-800 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center">관리자 로그인</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일 주소"
                            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-white"
                            required
                            autoFocus
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-white"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>
                        <p className="text-xs text-stone-500 text-center mt-2">
                            💡 Supabase 관리자 계정으로 로그인하세요
                        </p>
                    </div>
                </form>
            </div>
        );
    }

    const total = Object.values(stats).reduce((sum, val) => sum + val, 0);

    const fortuneNames: Record<keyof FortuneStats, string> = {
        tojeong: '🎋 토정비결',
        saju: '🌟 정통 사주',
        tarot: '🔮 신비 타로',
        face: '👁️ AI 관상',
        palm: '🖐️ AI 손금',
        shaman: '🔥 무속 신점',
    };

    const fortuneColors: Record<keyof FortuneStats, string> = {
        tojeong: 'from-orange-500 to-orange-600',
        saju: 'from-amber-500 to-amber-600',
        tarot: 'from-purple-500 to-purple-600',
        face: 'from-blue-500 to-blue-600',
        palm: 'from-green-500 to-green-600',
        shaman: 'from-red-500 to-red-600',
    };

    return (
        <div className="space-y-6">
            <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-amber-400">운세 사용 통계</h2>
                        <p className="text-xs text-stone-500 mt-1">관리자: {user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-stone-500 hover:text-stone-300 transition-colors px-4 py-2 bg-stone-800 rounded-lg"
                    >
                        로그아웃
                    </button>
                </div>

                {/* 총 사용 횟수 */}
                <div className="text-center mb-8 bg-gradient-to-br from-stone-800/50 to-stone-900/50 p-6 rounded-xl border border-stone-700">
                    <div className="text-5xl font-bold gold-text mb-2">{total.toLocaleString()}</div>
                    <div className="text-stone-400">총 사용 횟수</div>
                </div>

                {/* 통계 차트 */}
                <div className="space-y-4">
                    {(Object.entries(stats) as [keyof FortuneStats, number][])
                        .sort((a, b) => b[1] - a[1]) // 사용량 많은 순으로 정렬
                        .map(([key, value]) => {
                            const percentage = total > 0 ? (value / total * 100).toFixed(1) : '0';
                            return (
                                <div key={key} className="space-y-2 p-4 bg-stone-800/30 rounded-xl hover:bg-stone-800/50 transition-colors">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-stone-200 font-medium">{fortuneNames[key]}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-amber-400 font-bold">{value.toLocaleString()}회</span>
                                            <span className="text-stone-500 w-12 text-right">{percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-stone-900 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`bg-gradient-to-r ${fortuneColors[key]} h-full transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* 통계 초기화 버튼 */}
                <div className="mt-8 pt-6 border-t border-stone-700">
                    <button
                        onClick={() => {
                            if (confirm('정말 모든 통계를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
                                resetFortuneStats();
                                setStats(getFortuneStats());
                            }
                        }}
                        className="w-full py-3 bg-red-600/20 text-red-400 border border-red-600/50 rounded-xl font-bold hover:bg-red-600/30 transition-colors"
                    >
                        ⚠️ 통계 초기화
                    </button>
                </div>
            </div>

            {/* 추가 정보 */}
            <div className="bg-stone-900/30 p-4 rounded-xl border border-stone-800/50">
                <p className="text-xs text-stone-500 text-center">
                    💡 통계는 브라우저의 로컬 저장소에 저장됩니다. 브라우저 데이터를 삭제하면 초기화됩니다.
                </p>
            </div>
        </div>
    );
};

export default AdminView;
