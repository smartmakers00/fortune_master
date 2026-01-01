
// 통계 데이터 구조
export interface FortuneStats {
    tojeong: number;
    saju: number;
    tarot: number;
    face: number;
    palm: number;
    shaman: number;
}

// 통계 기록
export function trackFortuneUsage(type: keyof FortuneStats): void {
    const stats = getFortuneStats();
    stats[type]++;
    localStorage.setItem('fortune_stats', JSON.stringify(stats));
}

// 통계 조회
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

// 통계 초기화
export function resetFortuneStats(): void {
    localStorage.removeItem('fortune_stats');
}
