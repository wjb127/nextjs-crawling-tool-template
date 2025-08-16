-- 경쟁사 정보 테이블
CREATE TABLE competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 상품 정보 테이블
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  product_name VARCHAR(500) NOT NULL,
  product_url VARCHAR(1000) NOT NULL,
  current_price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  discount_rate DECIMAL(5, 2),
  stock_status VARCHAR(50),
  image_url VARCHAR(1000),
  category VARCHAR(200),
  brand VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 가격 히스토리 테이블
CREATE TABLE price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 리뷰 분석 테이블
CREATE TABLE reviews_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2),
  positive_count INTEGER DEFAULT 0,
  negative_count INTEGER DEFAULT 0,
  neutral_count INTEGER DEFAULT 0,
  keywords JSONB,
  sentiment_score DECIMAL(3, 2),
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 크롤링 작업 테이블
CREATE TABLE crawling_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  products_found INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 알림 설정 테이블
CREATE TABLE alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'price_drop', 'new_product', 'stock_change', 'review_alert'
  conditions JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 알림 로그 테이블
CREATE TABLE alert_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  message TEXT,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 인덱스 생성
CREATE INDEX idx_products_competitor ON products(competitor_id);
CREATE INDEX idx_products_updated ON products(updated_at);
CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_recorded ON price_history(recorded_at);
CREATE INDEX idx_reviews_product ON reviews_analysis(product_id);
CREATE INDEX idx_crawling_jobs_status ON crawling_jobs(status);

-- RLS 정책 (Row Level Security)
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawling_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;

-- 모든 테이블에 대한 읽기 권한 정책
CREATE POLICY "Enable read access for all users" ON competitors FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON price_history FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON reviews_analysis FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON crawling_jobs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON alerts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON alert_logs FOR SELECT USING (true);