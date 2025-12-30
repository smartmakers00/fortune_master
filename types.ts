
export enum SpreadType {
  ONE_CARD = 'one-card',
  THREE_CARDS = 'three-cards',
  CELTIC_CROSS = 'celtic-cross',
  NEW_YEAR_2026 = 'new-year-2026',
  TOJEONG_2026 = 'tojeong-2026'
}

export enum SubServiceType {
  LOTTO = 'lotto',
  SEBAEDON = 'sebaedon',
  RESOLVE = 'resolve',
  HOROSCOPE = 'horoscope',
  DREAM = 'dream',
  FOOD = 'food'
}

export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  isLunar: boolean;
  gender: 'male' | 'female' | 'other';
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
  isReversed: boolean;
  positionName?: string;
}

export interface ReadingSession {
  id: string;
  timestamp: number;
  question: string;
  spreadType: SpreadType | SubServiceType;
  cards: CardReading[];
  interpretation: string;
  userProfile?: UserProfile;
  imageUrl?: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  imageUrl?: string;
}
