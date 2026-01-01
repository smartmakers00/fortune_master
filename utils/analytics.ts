import { supabase } from '../services/supabase';

// 통계 데이터 구조
export interface FortuneStats {
    tojeong: number;
    saju: number;
    tarot: number;
    face: number;
    palm: number;
    shaman: number;
    body: number;
}

// 세션 ID 생성 (브라우저 세션별 고유 ID)
function getSessionId(): string {
    let sessionId = sessionStorage.getItem('fortune_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('fortune_session_id', sessionId);
    }
    return sessionId;
}

// 통계 기록 (로컬 + Supabase 키-밸류)
export async function trackFortuneUsage(type: keyof FortuneStats): Promise<void> {
    // 1. 로컬 스토리지에 저장 (오프라인 백업)
    const stats = getFortuneStats();
    stats[type]++;
    localStorage.setItem('fortune_stats', JSON.stringify(stats));

    // 2. Supabase에 원자적 카운트 증가
    if (supabase) {
        try {
            // PostgreSQL RPC 함수 호출 (원자적 증가로 race condition 방지)
            const { data, error } = await supabase.rpc('increment_fortune_count', {
                p_fortune_type: type
            });

            if (error) throw error;

            console.log(`✅ 통계 기록됨: ${type} (새 카운트: ${data})`);
        } catch (error) {
            console.warn('⚠️ Supabase 통계 저장 실패 (로컬만 저장):', error);
        }
    }
}

// 로컬 통계 조회
export function getFortuneStats(): FortuneStats {
    const stored = localStorage.getItem('fortune_stats');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return getDefaultStats();
        }
    }
    return getDefaultStats();
}

// Supabase에서 전체 통계 조회 (관리자용 - 키-밸류 구조)
export async function getGlobalFortuneStats(): Promise<FortuneStats> {
    if (!supabase) {
        console.warn('⚠️ Supabase 미설정 - 로컬 통계만 반환');
        return getFortuneStats();
    }

    try {
        const { data, error } = await supabase
            .from('fortune_master')
            .select('fortune_type, count');

        if (error) throw error;

        // 키-밸류 데이터를 FortuneStats 형태로 변환
        const stats = getDefaultStats();
        data?.forEach((row: { fortune_type: keyof FortuneStats; count: number }) => {
            if (row.fortune_type in stats) {
                stats[row.fortune_type] = row.count || 0;
            }
        });

        return stats;
    } catch (error) {
        console.error('❌ 전체 통계 조회 실패:', error);
        return getFortuneStats(); // 실패시 로컬 통계 반환
    }
}

// 기본 통계 값
function getDefaultStats(): FortuneStats {
    return {
        tojeong: 0,
        saju: 0,
        tarot: 0,
        face: 0,
        palm: 0,
        shaman: 0,
        body: 0,
    };
}

// 로컬 통계 초기화
export function resetFortuneStats(): void {
    localStorage.removeItem('fortune_stats');
}

// Supabase 전체 통계 초기화 (관리자 전용)
export async function resetGlobalFortuneStats(): Promise<void> {
    if (!supabase) {
        console.warn('⚠️ Supabase 미설정');
        return;
    }

    try {
        // 모든 카운트를 0으로 리셋
        const fortuneTypes: (keyof FortuneStats)[] = ['tojeong', 'saju', 'tarot', 'face', 'palm', 'shaman', 'body'];

        for (const type of fortuneTypes) {
            const { error } = await supabase
                .from('fortune_master')
                .update({ count: 0 })
                .eq('fortune_type', type);

            if (error) throw error;
        }

        console.log('✅ 전체 통계 초기화 완료');
    } catch (error) {
        console.error('❌ 전체 통계 초기화 실패:', error);
        throw error;
    }
}
