-- Fortune Master 통계 테이블 (Key-Value 구조)
-- Supabase SQL Editor에서 실행하세요

-- ⚠️ 기존 테이블이 있다면 삭제 (기존 데이터 손실 주의!)
DROP TABLE IF EXISTS fortune_master CASCADE;

-- 키-밸류 구조의 통계 테이블 생성
CREATE TABLE fortune_master (
  fortune_type TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터 삽입 (각 운세 유형별로 0으로 시작)
INSERT INTO fortune_master (fortune_type, count) VALUES
  ('tojeong', 0),
  ('saju', 0),
  ('tarot', 0),
  ('body', 0),
  ('face', 0),
  ('palm', 0),
  ('shaman', 0);

-- 인덱스 생성 (성능 향상)
CREATE INDEX idx_fortune_master_type ON fortune_master(fortune_type);

-- RLS (Row Level Security) 비활성화 (익명 접근 허용)
ALTER TABLE fortune_master DISABLE ROW LEVEL SECURITY;

-- 권한 설정: 익명 사용자도 업데이트 가능
GRANT SELECT, UPDATE ON fortune_master TO anon;
GRANT SELECT, UPDATE, DELETE ON fortune_master TO authenticated;

-- 자동으로 updated_at 업데이트하는 함수
CREATE OR REPLACE FUNCTION update_fortune_master_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS update_fortune_master_timestamp_trigger ON fortune_master;
CREATE TRIGGER update_fortune_master_timestamp_trigger
BEFORE UPDATE ON fortune_master
FOR EACH ROW
EXECUTE FUNCTION update_fortune_master_timestamp();

-- 원자적 카운트 증가 함수 (Race Condition 방지)
CREATE OR REPLACE FUNCTION increment_fortune_count(p_fortune_type TEXT)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE fortune_master
  SET count = count + 1
  WHERE fortune_type = p_fortune_type
  RETURNING count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- ✅ 설정 완료! 테이블 확인
SELECT * FROM fortune_master ORDER BY fortune_type;
