
// 캐시 키 생성
export function createCacheKey(
    type: 'tojeong' | 'saju',
    data: Record<string, any>
): string {
    // type + 정렬된 데이터 조합으로 해시 생성
    const sortedData = Object.keys(data)
        .sort()
        .map(key => `${key}:${data[key]}`)
        .join('|');

    // Base64로 인코딩하여 키 생성 (한글 지원을 위해 encodeURIComponent 활용)
    const encodedData = btoa(encodeURIComponent(sortedData));
    return `fortune_${type}_${encodedData}`;
}

// 캐시에서 결과 조회
export function getCachedResult(cacheKey: string): string | null {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    try {
        const { result, timestamp } = JSON.parse(cached);

        // 30일 이상 된 캐시는 무효화
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp > THIRTY_DAYS) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return result;
    } catch {
        return null;
    }
}

// 결과 캐싱
export function cacheResult(cacheKey: string, result: string): void {
    try {
        localStorage.setItem(cacheKey, JSON.stringify({
            result,
            timestamp: Date.now()
        }));
    } catch (error) {
        // localStorage가 가득 찼을 경우 오래된 캐시 삭제
        console.warn('Failed to cache result:', error);
    }
}

// 모든 캐시 삭제 (선택적)
export function clearAllCache(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('fortune_')) {
            localStorage.removeItem(key);
        }
    });
}
