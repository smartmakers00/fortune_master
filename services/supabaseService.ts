
import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

// 환경 변수에서 Supabase 설정 정보를 가져옵니다.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Supabase 클라이언트를 설정이 있을 때만 생성하여 'supabaseUrl is required' 에러를 방지합니다.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * 사용자의 프로필 정보를 Supabase 'user_profiles' 테이블에 저장합니다.
 * 현재 단계에서는 연결을 제외하거나 설정이 없을 경우 로깅만 수행합니다.
 */
export const saveUserProfileToSupabase = async (profile: UserProfile) => {
  if (!supabase) {
    console.debug("Supabase 설정이 활성화되지 않았습니다. (건너뜀)");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        { 
          birth_date: profile.birthDate, 
          birth_time: profile.birthTime, 
          is_lunar: profile.isLunar,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      throw error;
    }
    
    console.debug('사용자 프로필이 Supabase에 성공적으로 저장되었습니다:', data);
    return data;
  } catch (err) {
    console.error('Supabase 저장 중 오류 발생:', err);
  }
};
