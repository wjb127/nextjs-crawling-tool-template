"""
MCP Server for Accommodation Crawling
Author: WOORIM LEE Style Implementation
"""

import json
import asyncio
from typing import Dict, List, Optional
from urllib.parse import quote
import aiohttp
from fastmcp import FastMCP
from pydantic import BaseModel

# MCP 서버 초기화
mcp = FastMCP("accommodation-crawler")

class AccommodationData(BaseModel):
    """숙소 데이터 모델"""
    name: str
    price: Optional[int]
    rating: Optional[float]
    reviews: Optional[int]
    location: str
    amenities: List[str]
    image_url: Optional[str]
    check_in: Optional[str]
    check_out: Optional[str]

class CrawlerConfig:
    """크롤러 설정"""
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }
        self.timeout = 30

class AccommodationCrawler:
    """숙소 크롤링 핵심 로직"""
    
    def __init__(self):
        self.config = CrawlerConfig()
        
    async def search_accommodations(self, keyword: str, check_in: str = "", check_out: str = "") -> List[Dict]:
        """
        Step 1 & 2: 숙소 검색 및 크롤링
        - 한글 키워드 URL 인코딩 처리
        - JSON 응답 파싱
        """
        encoded_keyword = quote(keyword)
        
        # 실제 숙소 사이트 API 엔드포인트 (예시)
        # 실제 구현시 대상 사이트의 API 엔드포인트로 변경 필요
        api_url = f"https://api.accommodation-site.com/search?keyword={encoded_keyword}"
        
        if check_in:
            api_url += f"&check_in={check_in}"
        if check_out:
            api_url += f"&check_out={check_out}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(api_url, headers=self.config.headers, timeout=self.config.timeout) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_accommodation_data(data)
                    else:
                        # Mock 데이터 반환 (데모용)
                        return self._generate_mock_data(keyword)
        except Exception as e:
            print(f"크롤링 에러: {e}")
            # 에러 시 Mock 데이터 반환
            return self._generate_mock_data(keyword)
    
    def _parse_accommodation_data(self, raw_data: Dict) -> List[Dict]:
        """Step 3: 데이터 정제"""
        accommodations = []
        
        # 실제 응답 구조에 맞게 파싱 로직 구현
        for item in raw_data.get('results', []):
            accommodation = {
                'name': item.get('name'),
                'price': item.get('price'),
                'rating': item.get('rating'),
                'reviews': item.get('review_count'),
                'location': item.get('address'),
                'amenities': item.get('amenities', []),
                'image_url': item.get('image'),
                'availability': item.get('available', True)
            }
            accommodations.append(accommodation)
        
        return accommodations
    
    def _generate_mock_data(self, keyword: str) -> List[Dict]:
        """Mock 데이터 생성 (테스트용)"""
        mock_data = []
        locations = ['강남', '명동', '홍대', '광화문', '이태원']
        
        for i in range(10):
            location = locations[i % len(locations)]
            mock_data.append({
                'name': f'{keyword} 호텔 {i+1}',
                'price': 100000 + (i * 20000),
                'rating': 4.0 + (i * 0.1),
                'reviews': 100 + (i * 50),
                'location': f'{location}역 도보 5분',
                'amenities': ['WiFi', '주차장', '조식', '피트니스'],
                'image_url': f'https://picsum.photos/400/300?random={i}',
                'availability': i % 3 != 0
            })
        
        return mock_data

    async def analyze_price_trends(self, accommodations: List[Dict]) -> Dict:
        """Step 4: 가격 트렌드 분석"""
        if not accommodations:
            return {'error': 'No data to analyze'}
        
        prices = [acc['price'] for acc in accommodations if acc.get('price')]
        
        if not prices:
            return {'error': 'No price data available'}
        
        analysis = {
            'average_price': sum(prices) / len(prices),
            'min_price': min(prices),
            'max_price': max(prices),
            'price_range': max(prices) - min(prices),
            'total_accommodations': len(accommodations),
            'price_distribution': {
                'budget': len([p for p in prices if p < 100000]),
                'mid_range': len([p for p in prices if 100000 <= p < 200000]),
                'luxury': len([p for p in prices if p >= 200000])
            }
        }
        
        return analysis

# MCP 도구 등록
crawler = AccommodationCrawler()

@mcp.tool()
async def search_accommodations(keyword: str, check_in: str = "", check_out: str = "") -> Dict:
    """
    숙소 검색 도구
    
    Args:
        keyword: 검색 키워드 (예: '광화문', '강남')
        check_in: 체크인 날짜 (YYYY-MM-DD)
        check_out: 체크아웃 날짜 (YYYY-MM-DD)
    
    Returns:
        검색된 숙소 목록과 분석 결과
    """
    # 숙소 검색
    accommodations = await crawler.search_accommodations(keyword, check_in, check_out)
    
    # 가격 분석
    analysis = await crawler.analyze_price_trends(accommodations)
    
    return {
        'keyword': keyword,
        'check_in': check_in,
        'check_out': check_out,
        'total_found': len(accommodations),
        'accommodations': accommodations[:5],  # 상위 5개만 반환
        'price_analysis': analysis
    }

@mcp.tool()
async def compare_areas(areas: List[str]) -> Dict:
    """
    여러 지역 숙소 가격 비교
    
    Args:
        areas: 비교할 지역 목록 (예: ['강남', '홍대', '명동'])
    
    Returns:
        지역별 가격 비교 분석
    """
    comparison = {}
    
    for area in areas:
        accommodations = await crawler.search_accommodations(area)
        analysis = await crawler.analyze_price_trends(accommodations)
        
        comparison[area] = {
            'average_price': analysis.get('average_price', 0),
            'min_price': analysis.get('min_price', 0),
            'max_price': analysis.get('max_price', 0),
            'total_accommodations': analysis.get('total_accommodations', 0)
        }
    
    return {
        'areas': areas,
        'comparison': comparison,
        'cheapest_area': min(comparison.items(), key=lambda x: x[1]['average_price'])[0] if comparison else None,
        'most_expensive_area': max(comparison.items(), key=lambda x: x[1]['average_price'])[0] if comparison else None
    }

@mcp.tool()
async def save_search_results(keyword: str, results: Dict, filename: str = None) -> Dict:
    """
    검색 결과를 JSON 파일로 저장
    
    Args:
        keyword: 검색 키워드
        results: 저장할 결과 데이터
        filename: 저장할 파일명 (기본값: keyword_results.json)
    
    Returns:
        저장 결과
    """
    if not filename:
        filename = f"{keyword}_results.json"
    
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        return {
            'success': True,
            'filename': filename,
            'message': f'Successfully saved {len(results.get("accommodations", []))} accommodations'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

# MCP 서버 실행
if __name__ == "__main__":
    import uvicorn
    # FastMCP 서버 실행
    uvicorn.run(mcp.app, host="0.0.0.0", port=8000)