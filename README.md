<div align="center">
  <h1>🔮 2026 신년운세 마스터</h1>
  <p>AI로 풀어보는 2026년 병오년 신년운세</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)
</div>

## 📖 소개

**2026 신년운세 마스터**는 Google Gemini AI를 활용하여 2026년 병오년 신년운세를 제공하는 웹 애플리케이션입니다. 전통적인 동양 점술과 현대 AI 기술을 결합하여, 누구나 쉽게 자신의 운세를 확인할 수 있습니다.

## ✨ 주요 기능

### 🎋 토정비결
- 조선시대 토정 이지함의 비결을 AI로 재해석
- 2026년 병오년 월별 운세 제공
- 실질적인 조언과 함께 제공

### 🌟 정통 사주
- 생년월일과 출생 시간 기반 사주팔자 풀이
- 평생운세와 2026년 특별 운세
- 직장, 재물, 건강, 가정 등 다양한 관점 분석

### 🔮 신비 타로
- 3장의 타로 카드로 2026년 조언
- 과거-현재-미래의 흐름 해석
- 직관적이고 따뜻한 상담 제공

### 👁️ AI 관상
- 얼굴 사진 업로드를 통한 관상 분석
- 눈, 코, 입 등 부위별 특징 해석
- 2026년 운세와 연결된 조언

### 🖐️ AI 손금
- 손바닥 사진 업로드로 손금 분석
- 생명선, 두뇌선, 감정선 등 주요 선 해석
- 커리어와 경제적 성취 가능성 분석

### 🔥 예리한 신점
- 무속인의 직관적인 답변 스타일
- 현실적이고 속 시원한 조언
- 2026년 주의사항과 비방 제공

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Gemini API 키 ([발급받기](https://makersuite.google.com/app/apikey))

### 설치

```bash
# 저장소 클론
git clone https://github.com/smartmakers00/fortune_master.git

# 프로젝트 폴더로 이동
cd fortune_master

# 의존성 설치
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Gemini API 키 (필수)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase 설정 (선택 - 관리자 기능 및 전체 사용자 통계용)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase 설정 (선택사항)

관리자 로그인 및 **전체 사용자 통계 수집**을 위해서는 Supabase 설정이 필요합니다.

#### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에서 계정 생성 및 로그인
2. "New Project" 클릭하여 새 프로젝트 생성
3. 프로젝트 URL과 Anon Public Key를 복사하여 `.env.local`에 추가

#### 2. 통계 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- 익명 사용자 통계 로그 테이블 생성
CREATE TABLE fortune_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fortune_type TEXT NOT NULL,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX idx_fortune_usage_logs_type ON fortune_usage_logs(fortune_type);
CREATE INDEX idx_fortune_usage_logs_created_at ON fortune_usage_logs(created_at);

-- RLS (Row Level Security) 비활성화 (익명 접근 허용)
ALTER TABLE fortune_usage_logs DISABLE ROW LEVEL SECURITY;
```

#### 3. 테이블 권한 설정

**중요**: 익명 사용자가 통계를 기록할 수 있도록 `INSERT` 권한을 부여하세요.

```sql
-- anon 사용자에게 INSERT 권한 부여
GRANT INSERT ON fortune_usage_logs TO anon;

-- 관리자만 조회/삭제 가능하도록 설정 (선택)
GRANT SELECT, DELETE ON fortune_usage_logs TO authenticated;
```

#### 4. 관리자 계정 생성

Supabase Dashboard > Authentication > Users에서 관리자 계정을 생성하세요. 이 계정으로 관리자 페이지에 로그인할 수 있습니다.

> **참고**: Supabase 설정 없이도 앱은 정상 작동하며, 로컬 브라우저 통계만 사용됩니다.

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열면 애플리케이션을 확인할 수 있습니다.

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (CDN)
- **AI**: Google Gemini 2.0 Flash
- **Markdown**: react-markdown, remark-gfm

## 📁 프로젝트 구조

```
fortune_master/
├── public/              # 정적 파일 (파비콘, 이미지)
├── components/          # React 컴포넌트
├── services/            # API 서비스 (Gemini)
├── utils/               # 유틸리티 함수
├── views/               # 페이지 뷰
├── App.tsx              # 메인 앱 컴포넌트
├── constants.tsx        # 상수 및 시스템 프롬프트
├── types.ts             # TypeScript 타입 정의
└── index.html           # HTML 엔트리포인트
```

## 🎨 디자인

- **테마**: 동양 신비주의, 2026 신년
- **색상**: 금색(#fbbf24), 보라색(#8b5cf6), 다크 브라운(#1c1917)
- **폰트**: Noto Serif KR, Noto Sans KR

## 🔒 보안

- API 키는 `.env.local` 파일에 저장 (Git에 커밋되지 않음)
- `.gitignore`에 민감한 파일 등록
- 환경 변수를 통한 안전한 키 관리

## 📱 배포

### Vercel (권장)

1. [Vercel](https://vercel.com)에 로그인
2. 저장소 연결
3. 환경 변수 `GEMINI_API_KEY` 설정
4. 배포

### Netlify

1. [Netlify](https://netlify.com)에 로그인
2. "Add new site" > "Import an existing project"
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 환경 변수 설정
5. 배포

## 📄 라이선스

MIT License

## 👤 제작자

SmartMakers - [@smartmakers00](https://github.com/smartmakers00)

## 🙏 감사의 말

- Google Gemini AI
- React 팀
- Vite 팀
- 오픈소스 커뮤니티

---

<div align="center">
  <p>⭐ 이 프로젝트가 마음에 드셨다면 스tar를 눌러주세요!</p>
  <p>🔮 2026년 병오년, 모두에게 좋은 운이 가득하길 바랍니다!</p>
</div>
