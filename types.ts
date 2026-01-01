export type FortuneType = 'home' | 'tojeong' | 'saju' | 'tarot' | 'face' | 'palm' | 'shaman' | 'body' | 'admin';

export enum SpreadType {
  TOJEONG_2026 = 'tojeong_2026',
  NEW_YEAR_2026 = 'new_year_2026',
  THREE_CARDS = 'three_cards',
  ONE_CARD = 'one_card'
}

export enum SubServiceType {
  SAJU = 'saju',
  TOJEONG = 'tojeong',
  FACE = 'face',
  PALM = 'palm',
  SHAMAN = 'shaman',
  DREAM = 'dream',
  BODY = 'body'
}

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

export interface TarotCardData {
  id: number;
  name: string;
  englishName: string;
  keyword: string;
  meaningUp: string;
  meaningRev: string;
}

export interface CardReading {
  card: TarotCardData;
  position: string;
  positionName: string;
  isReversed: boolean;
  interpretation?: string;
}
