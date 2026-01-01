import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
    import.meta.env.VITE__PUBLIC_SUPABASE_ANON_KEY || ''; // Double underscore fallback

// URL과 Key가 모두 있을 때만 클라이언트 생성
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
    console.warn('⚠️ Supabase URL 또는 Anon Key가 누락되었거나 형식이 잘못되었습니다. 관리자 기능이 제한될 수 있습니다.');
}
