# Next.js E-Commerce Crawling Tool Template

실시간 경쟁사 모니터링 및 가격 분석을 위한 이커머스 크롤링 대시보드 템플릿

## 🚀 주요 기능

### 실시간 모니터링
- 경쟁사 가격 실시간 추적
- 신제품 출시 감지
- 재고 상황 파악
- 리뷰/평점 분석

### 시각화 & 분석
- **3D 가격 분석**: Three.js를 활용한 인터랙티브 3D 차트
- **실시간 업데이트**: 3초마다 자동 갱신되는 가격 모니터
- **경쟁사 비교**: Chart.js를 활용한 다양한 분석 차트
- **TOP 5 할인**: 최대 할인 상품 실시간 추적

### 알림 시스템
- 가격 변동 알림 (10% 이상)
- 신규 상품 등록 알림
- 재고 변경 알림
- 리뷰 평점 변동 알림

## 🛠 기술 스택

- **Framework**: Next.js 15 + TypeScript
- **Database**: Supabase
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui + Lucide Icons
- **3D Visualization**: Three.js + @react-three/fiber
- **Charts**: Chart.js + react-chartjs-2
- **Animations**: Framer Motion
- **Crawling**: Puppeteer + Cheerio

## 📦 설치 방법

```bash
# 1. 저장소 클론
git clone https://github.com/wjb127/nextjs-crawling-tool-template.git
cd nextjs-crawling-tool-template

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Supabase 자격 증명 추가

# 4. 개발 서버 실행
npm run dev
```

## ⚙️ 환경 설정

### Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `.env.local` 파일에 자격 증명 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Supabase SQL Editor에서 `lib/supabase/schema.sql` 실행

## 📁 프로젝트 구조

```
nextjs-crawling-tool-template/
├── app/
│   ├── api/
│   │   ├── analytics/     # 분석 데이터 API
│   │   └── crawl/         # 크롤링 API
│   ├── layout.tsx
│   └── page.tsx           # 메인 대시보드
├── components/
│   ├── dashboard/         # 대시보드 컴포넌트
│   │   ├── animated-metrics.tsx
│   │   ├── price-chart-3d.tsx
│   │   ├── realtime-monitor.tsx
│   │   ├── competitor-analysis.tsx
│   │   ├── top-discounts.tsx
│   │   └── alert-panel.tsx
│   └── layout/
│       └── header.tsx
├── lib/
│   ├── crawler/          # 크롤러 로직
│   ├── supabase/         # Supabase 클라이언트
│   └── utils.ts
└── public/
```

## 🎯 타겟 고객

### 이커머스 업체
- **고민**: 가격 경쟁에서 뒤처짐 + 수동 체크의 한계
- **니즈**: 
  - 경쟁사 실시간 가격 모니터링
  - 신제품 출시 감지
  - 리뷰/평점 분석
  - 재고 상황 파악
- **예산**: 월 100만~500만원 (ROI 명확하면 더 투자)
- **의사결정자**: 운영팀장/마케팅팀장
- **접점**: 이커머스 협회, 쇼핑몰 운영자 카페

## 📱 스크린샷

### 메인 대시보드
- 실시간 메트릭 카드
- 3D 가격 분석 차트
- 실시간 모니터링 패널
- 경쟁사 비교 차트

## 🚧 개발 로드맵

- [x] 기본 대시보드 UI
- [x] 실시간 모니터링 기능
- [x] 3D 시각화
- [x] 차트 분석 기능
- [x] 알림 시스템
- [ ] 실제 크롤링 로직 구현
- [ ] 스케줄링 시스템
- [ ] 이메일/슬랙 알림 연동
- [ ] 상세 리포트 생성
- [ ] 다중 쇼핑몰 지원

## 📄 라이선스

MIT

## 👨‍💻 개발자

- GitHub: [@wjb127](https://github.com/wjb127)

## 🤝 기여하기

프로젝트 개선에 기여하고 싶으시다면 PR을 보내주세요!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
