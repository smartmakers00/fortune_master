import { supabase } from '../services/supabase';

// 통계 데이터 구조
export interface FortuneStats {
    tojeong: number;
    saju: number;
    tarot: number;
    face: number;
    palm: number;
    shaman: number;
}

// 사용 로그 인터페이스 (Supabase DB용)
export interface UsageLog {
    id?: string;
    fortune_type: keyof FortuneStats;
    created_at?: string;
    user_agent?: string;
    session_id?: string;
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

// 통계 기록 (로컬 + Supabase)
export async function trackFortuneUsage(type: keyof FortuneStats): Promise<void> {
    // 1. 로컬 스토리지에 저장 (오프라인 백업)
    const stats = getFortuneStats();
    stats[type]++;
    localStorage.setItem('fortune_stats', JSON.stringify(stats));

    // 2. Supabase에 익명 로그 저장
    if (supabase) {
        try {
            await supabase.from('fortune_usage_logs').insert({
                fortune_type: type,
                user_agent: navigator.userAgent,
                session_id: getSessionId(),
            });
            console.log(`✅ 통계 기록됨: ${type}`);
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

// Supabase에서 전체 통계 조회 (관리자용)
export async function getGlobalFortuneStats(): Promise<FortuneStats> {
    if (!supabase) {
        console.warn('⚠️ Supabase 미설정 - 로컬 통계만 반환');
        return getFortuneStats();
    }

    try {
        const { data, error } = await supabase
            .from('fortune_usage_logs')
            .select('fortune_type');

        if (error) throw error;

        // 데이터 집계
        const stats = getDefaultStats();
        data?.forEach((log: UsageLog) => {
            if (log.fortune_type in stats) {
                stats[log.fortune_type]++;
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
        const { error } = await supabase
            .from('fortune_usage_logs')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // 모든 레코드 삭제

        if (error) throw error;
        console.log('✅ 전체 통계 초기화 완료');
    } catch (error) {
        console.error('❌ 전체 통계 초기화 실패:', error);
        throw error;
    }
}
