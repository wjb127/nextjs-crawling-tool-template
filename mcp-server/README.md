# MCP Server for Accommodation Crawling 🏨

AI 숙소 크롤링 시스템 - WOORIM LEE 스타일 구현

## 🔎 데이터 수집부터 분석까지 4단계

### Step 1: 크롤링 준비
- '광화문' 검색 결과 페이지에서 개발자 도구 열기
- Network 탭에서 요청 확인
- 'Copy as cURL' 기능으로 요청 정보 복사

### Step 2: Python 크롤링 코드 작성
- cURL 명령어를 Python으로 변환
- 한글 키워드 URL 인코딩 처리
- JSON 파일로 결과 저장 구현

### Step 3: MCP 서버 설계
- FastMCP 프레임워크 사용
- 숙소 데이터 분석 목표 설정
- 도구(tool) 기반 API 설계

### Step 4: MCP 크롤러 구현
- FastMCP 서버 초기화
- 숙소 검색 도구 만들기
- URL 요청 및 응답 처리
- 데이터 정제 기능 추가

## 🚀 설치 및 실행

### 1. Python 환경 설정
```bash
cd mcp-server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. MCP 서버 실행
```bash
python accommodation_crawler.py
```

서버가 `http://localhost:8000`에서 실행됩니다.

## 📡 API 엔드포인트

### 숙소 검색
```python
POST /search_accommodations
{
  "keyword": "광화문",
  "check_in": "2024-01-20",
  "check_out": "2024-01-22"
}
```

### 지역 비교
```python
POST /compare_areas
{
  "areas": ["강남", "홍대", "명동"]
}
```

### 검색 결과 저장
```python
POST /save_search_results
{
  "keyword": "광화문",
  "results": {...},
  "filename": "gwanghwamun_results.json"
}
```

## 🔧 주요 기능

### 1. 크롤링 기능
- **한글 키워드 지원**: URL 인코딩 자동 처리
- **동적 헤더 설정**: User-Agent, Accept-Language 등
- **에러 핸들링**: 크롤링 실패 시 Mock 데이터 반환
- **타임아웃 설정**: 30초 기본 타임아웃

### 2. 데이터 분석
- **가격 분석**: 평균, 최저, 최고가 계산
- **가격 분포**: 예산별 숙소 분류 (budget/mid-range/luxury)
- **지역 비교**: 여러 지역 동시 비교 분석
- **트렌드 분석**: 가격 변동 추이 파악

### 3. 데이터 저장
- **JSON 형식**: 구조화된 데이터 저장
- **UTF-8 인코딩**: 한글 데이터 완벽 지원
- **자동 파일명**: 키워드 기반 파일명 생성

## 📊 응답 데이터 구조

```json
{
  "keyword": "광화문",
  "total_found": 10,
  "accommodations": [
    {
      "name": "광화문 호텔",
      "price": 150000,
      "rating": 4.5,
      "reviews": 234,
      "location": "광화문역 도보 5분",
      "amenities": ["WiFi", "주차장", "조식"],
      "image_url": "https://...",
      "availability": true
    }
  ],
  "price_analysis": {
    "average_price": 145000,
    "min_price": 80000,
    "max_price": 250000,
    "price_range": 170000,
    "total_accommodations": 10,
    "price_distribution": {
      "budget": 3,
      "mid_range": 5,
      "luxury": 2
    }
  }
}
```

## 🔌 Next.js 통합

Next.js 프로젝트에서 MCP 서버와 통합하려면:

1. API Route 생성 (`/api/accommodation/search`)
2. MCP 서버로 프록시 요청
3. 응답 데이터를 클라이언트로 전달

```typescript
// app/api/accommodation/search/route.ts
const response = await fetch('http://localhost:8000/search_accommodations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ keyword, check_in, check_out })
});
```

## 🛠 커스터마이징

### 크롤링 대상 변경
`accommodation_crawler.py`의 `search_accommodations` 메서드에서 API URL을 수정:

```python
api_url = f"https://your-target-site.com/api/search?q={encoded_keyword}"
```

### 데이터 파싱 로직 수정
`_parse_accommodation_data` 메서드를 대상 사이트의 응답 구조에 맞게 수정

### 분석 지표 추가
`analyze_price_trends` 메서드에 원하는 분석 지표 추가

## 📝 라이선스

MIT License

## 👨‍💻 개발자

WOORIM LEE 스타일로 구현된 MCP 서버
- FastMCP 기반 구조
- 4단계 크롤링 프로세스
- 실시간 데이터 분석