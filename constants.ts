
import { TarotCardData, SpreadType } from './types';

export const MAJOR_ARCANA: TarotCardData[] = [
  { id: 0, name: "바보", englishName: "The Fool", keyword: "시작, 순수", meaningUp: "새로운 시작, 모험, 무한한 가능성", meaningRev: "무모함, 부주의, 지연" },
  { id: 1, name: "마법사", englishName: "The Magician", keyword: "창조, 능력", meaningUp: "기술, 의지력, 실현 능력", meaningRev: "사기, 서투름, 계획 부족" },
  { id: 2, name: "고위 여사제", englishName: "The High Priestess", keyword: "직관, 신비", meaningUp: "내면의 목소리, 지혜, 무의식", meaningRev: "비밀 누설, 직관의 부재, 피상적" },
  { id: 3, name: "여황제", englishName: "The Empress", keyword: "풍요, 모성", meaningUp: "창조성, 양육, 자연의 풍요", meaningRev: "의존성, 정체, 낭비" },
  { id: 4, name: "황제", englishName: "The Emperor", keyword: "권위, 질서", meaningUp: "구조, 통제, 리더십", meaningRev: "독재, 무질서, 유약함" },
  { id: 5, name: "교황", englishName: "The Hierophant", keyword: "전통, 신념", meaningUp: "가르침, 관습, 영적 가이드", meaningRev: "반항, 독선적, 낡은 관념" },
  { id: 6, name: "연인", englishName: "The Lovers", keyword: "선택, 조화", meaningUp: "사랑, 관계의 결합, 가치관의 선택", meaningRev: "불균형, 갈등, 어긋난 선택" },
  { id: 7, name: "전차", englishName: "The Chariot", keyword: "승리, 통제", meaningUp: "결단력, 극복, 전진", meaningRev: "통제 상실, 방향 혼란, 패배" },
  { id: 8, name: "힘", englishName: "Strength", keyword: "인내, 용기", meaningUp: "부드러운 힘, 자신감, 인내", meaningRev: "자기 의심, 나약함, 공격성" },
  { id: 9, name: "은둔자", englishName: "The Hermit", keyword: "성찰, 고독", meaningUp: "내면의 탐구, 신중함, 성숙", meaningRev: "고립, 소외, 경솔함" },
  { id: 10, name: "운명의 수레바퀴", englishName: "Wheel of Fortune", keyword: "변화, 행운", meaningUp: "전환점, 운명적 변화, 기회", meaningRev: "불운, 저항할 수 없는 변화, 정체" },
  { id: 11, name: "정의", englishName: "Justice", keyword: "공정, 결단", meaningUp: "균형, 진실, 책임", meaningRev: "불공정, 편견, 결과 회피" },
  { id: 12, name: "매달린 사람", englishName: "The Hanged Man", keyword: "희생, 관점", meaningUp: "새로운 시각, 정지, 헌신", meaningRev: "헛된 희생, 고집, 정체기" },
  { id: 13, name: "죽음", englishName: "Death", keyword: "종결, 변화", meaningUp: "끝과 새로운 시작, 탈피", meaningRev: "변화에 대한 저항, 정체, 고통스러운 지연" },
  { id: 14, name: "절제", englishName: "Temperance", keyword: "조화, 절제", meaningUp: "중용, 인내, 평온함", meaningRev: "불균형, 과잉, 서투른 조합" },
  { id: 15, name: "악마", englishName: "The Devil", keyword: "구속, 집착", meaningUp: "중독, 속박, 물질적 욕망", meaningRev: "해방, 자각, 굴레를 벗어남" },
  { id: 16, name: "탑", englishName: "The Tower", keyword: "붕괴, 충격", meaningUp: "갑작스러운 변화, 각성, 해체", meaningRev: "위기 모면, 지연된 몰락, 공포" },
  { id: 17, name: "별", englishName: "The Star", keyword: "희망, 영감", meaningUp: "꿈, 치유, 긍정적인 전망", meaningRev: "절망, 비관, 믿음의 상실" },
  { id: 18, name: "달", englishName: "The Moon", keyword: "불안, 환상", meaningUp: "혼란, 보이지 않는 적, 상상력", meaningRev: "오해 해소, 공포 극복, 진실의 규명" },
  { id: 19, name: "태양", englishName: "The Sun", keyword: "성공, 기쁨", meaningUp: "활력, 성취, 긍정", meaningRev: "일시적 우울, 거만함, 과장된 낙관" },
  { id: 20, name: "심판", englishName: "Judgement", keyword: "부활, 결정", meaningUp: "각성, 용서, 중대한 결정", meaningRev: "자기 비난, 지체된 소식, 후회" },
  { id: 21, name: "세계", englishName: "The World", keyword: "완성, 통합", meaningUp: "목표 달성, 조화로운 마무리, 여행", meaningRev: "불완전한 결말, 지체, 미완의 꿈" }
];

export const SPREADS = [
  {
    type: SpreadType.TOJEONG_2026,
    name: "2026 토정비결",
    description: "사주 명식을 기반으로 한 2026년 정통 신년 운세 분석.",
    cardCount: 0,
    positions: []
  },
  {
    type: SpreadType.NEW_YEAR_2026,
    name: "2026 병오년 대운",
    description: "사주 정보와 4장의 타로로 보는 융합 운명 분석.",
    cardCount: 4,
    positions: ["재물운", "직업운", "연애운", "총평"]
  },
  {
    type: SpreadType.THREE_CARDS,
    name: "과거/현재/미래",
    description: "문제의 흐름을 파악하고 앞으로의 전개를 예측합니다.",
    cardCount: 3,
    positions: ["과거", "현재", "미래"]
  },
  {
    type: SpreadType.ONE_CARD,
    name: "오늘의 카드",
    description: "현재의 에너지를 확인하고 오늘의 운세를 알아봅니다.",
    cardCount: 1,
    positions: ["오늘의 운세"]
  }
];

export const COLORS = {
  indigo: "#1E1B4B",
  yellow: "#FDE047",
  violet: "#8B5CF6",
  red: "#EF4444",
};
