
import { GoogleGenAI } from "@google/genai";
import { CardReading, SpreadType, SubServiceType, UserProfile } from "../types";

export const getTarotInterpretationStream = async (
  question: string,
  spreadType: SpreadType | SubServiceType,
  cards: CardReading[],
  onChunk: (text: string) => void,
  userProfile?: UserProfile
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  let seedValue = 42;
  if (userProfile && userProfile.birthDate) {
    const numericDate = userProfile.birthDate.replace(/\D/g, '');
    seedValue = (parseInt(numericDate.substring(0, 8), 10) % 1000000) || 42;
  }

  const genderStr = userProfile?.gender === 'male' ? '남성' : '여성';
  const userName = userProfile?.name || '여행자';
  const sajuInfo = userProfile 
    ? `이름: ${userName}, 성별: ${genderStr}, 생일: ${userProfile.birthDate}, 시간: ${userProfile.birthTime || '모름'}, 역법: ${userProfile.isLunar ? '음력' : '양력'}`
    : "익명";

  const commonRules = `
    [출력 규칙 - 필독]
    1. 반드시 HTML 태그를 사용하세요 (<h3>, <p>, <b>, <table>, <li>). 
    2. 사용자를 부를 때는 반드시 '${userName}님'이라고 다정하게 불러주세요.
    3. 중고등학생도 이해할 수 있도록 아주 쉬운 우리말로 풀어서 설명하세요.
    4. 한자(건명, 곤명 등)는 절대 사용하지 마세요. 오직 '남성', '여성'으로만 구분하세요.
    5. 말투는 따뜻하고 희망적인 '해요체'를 사용하세요. 긍정적인 에너지를 듬뿍 담아주세요.
  `;

  let systemInstruction = "";
  if (spreadType === SpreadType.TOJEONG_2026) {
    systemInstruction = `당신은 2026년 운세 마스터입니다. ${commonRules} ${userName}님의 2026년 전체 흐름을 짚어주세요.`;
  } else if (spreadType === SubServiceType.DREAM) {
    systemInstruction = `당신은 신비로운 해몽 전문가입니다. ${commonRules} ${userName}님이 꾼 꿈의 의미를 아주 흥미진진하게 풀이하세요.`;
  } else {
    systemInstruction = `당신은 고민을 들어주는 따뜻한 천명 마스터입니다. ${commonRules}`;
  }

  const tarotDetails = cards.length > 0 
    ? cards.map(c => `[${c.positionName}]: ${c.card.name}${c.isReversed ? '(역방향)' : '(정방향)'}`).join(', ')
    : "없음";

  const prompt = `
    서비스: ${spreadType}
    질문: "${question}"
    정보: ${sajuInfo}
    카드: ${tarotDetails}
    위 정보를 분석해서 ${userName}님에게 꼭 필요한 2026년의 조언과 운세를 들려줘.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.8,
        seed: seedValue,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    onChunk(`<p>미안해 ${userName}님, 우주의 기운이 잠시 엇갈렸나 봐. 다시 한 번 물어봐 줄래?</p>`);
  }
};
