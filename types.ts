
export type FortuneType = 'home' | 'tojeong' | 'saju' | 'tarot' | 'face' | 'palm' | 'shaman' | 'admin';

export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: 'male' | 'female';
  isLunar: boolean;
}

export interface FortuneResult {
  type: FortuneType;
  content: string;
  timestamp: string;
}

export interface TarotCard {
  id: number;
  name: string;
  image: string;
  meaning: string;
}
