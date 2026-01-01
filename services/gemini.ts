import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPTS } from "../constants";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY || "";

  if (!apiKey) {
    console.warn("⚠️ Gemini API Key가 설정되지 않았습니다. Vercel 환경변수(VITE_GEMINI_API_KEY)를 확인해주세요.");
  } else {
    console.log("✅ Gemini API Key detected (length: " + apiKey.length + ")");
  }

  // @google/genai (Gemini 2.0 SDK) 클라이언트 생성
  return new GoogleGenAI({
    apiKey,
  });
};

export async function getFortuneText(type: keyof typeof SYSTEM_PROMPTS, input: string): Promise<string> {
  const client = getClient();
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: 'user', parts: [{ text: input }] }],
      config: {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPTS[type] }] }
      }
    });

    console.log("Gemini API Response (Text):", response);
    return response.text || "해석을 불러오는 데 실패했습니다.";
  } catch (error: any) {
    console.error("Gemini API Error (Text):", error);
    if (error.message?.includes("API key")) {
      return "API Key 설정 오류가 발생했습니다. 관리자에게 문의하세요.";
    }
    return "신령님의 기운이 잠시 닿지 않습니다. 다시 시도해 주세요.";
  }
}

export async function getFaceReading(base64Image: string, additionalContext?: string): Promise<string> {
  const client = getClient();
  try {
    const imageData = base64Image.split(',')[1] || base64Image;

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { data: imageData, mimeType: 'image/jpeg' } },
          { text: `제 얼굴의 관상을 분석해주세요. 눈, 코, 입의 특징과 그에 따른 2026년 운세를 자세히 알려주세요.${additionalContext ? `\n\n${additionalContext}` : ''}` }
        ]
      }],
      config: {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPTS.face }] }
      }
    });

    console.log("Gemini Vision Response (Face):", response);
    return response.text || "이미지 분석에 실패했습니다.";
  } catch (error) {
    console.error("Gemini Vision Error (Face):", error);
    return "사진을 분석할 수 없습니다. 선명한 사진을 올려주세요.";
  }
}

export async function getPalmReading(base64Image: string, additionalContext?: string): Promise<string> {
  const client = getClient();
  try {
    const imageData = base64Image.split(',')[1] || base64Image;

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { data: imageData, mimeType: 'image/jpeg' } },
          { text: `제 손바닥의 손금을 분석해주세요. 주요 선(생명선, 두뇌선, 감정선 등)을 찾아서 2026년 운세를 해석해주세요.${additionalContext ? `\n\n${additionalContext}` : ''}` }
        ]
      }],
      config: {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPTS.palm }] }
      }
    });

    console.log("Gemini Vision Response (Palm):", response);
    return response.text || "손금 분석에 실패했습니다.";
  } catch (error) {
    console.error("Gemini Vision Error (Palm):", error);
    return "손 사진을 분석할 수 없습니다. 손금이 선명하게 보이도록 다시 찍어주세요.";
  }
}
