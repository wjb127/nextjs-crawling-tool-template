import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { keyword, checkIn, checkOut } = await request.json();

    // MCP 서버로 요청 전송
    const mcp_response = await fetch('http://localhost:8000/search_accommodations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword,
        check_in: checkIn,
        check_out: checkOut,
      }),
    }).catch(() => null);

    if (mcp_response && mcp_response.ok) {
      const data = await mcp_response.json();
      return NextResponse.json(data);
    }

    // MCP 서버가 없을 경우 Mock 데이터 반환
    const mockData = generateMockAccommodations(keyword);
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Accommodation search error:', error);
    return NextResponse.json(
      { success: false, error: '숙소 검색 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

function generateMockAccommodations(keyword: string) {
  const areas = ['강남', '명동', '홍대', '광화문', '이태원'];
  const accommodations = [];
  
  for (let i = 0; i < 10; i++) {
    const area = areas[i % areas.length];
    accommodations.push({
      id: `acc-${i + 1}`,
      name: `${keyword} ${area} 호텔 ${i + 1}`,
      price: 80000 + Math.floor(Math.random() * 200000),
      rating: (4.0 + Math.random() * 0.9).toFixed(1),
      reviews: Math.floor(100 + Math.random() * 900),
      location: `${area}역 도보 ${Math.floor(3 + Math.random() * 10)}분`,
      amenities: ['WiFi', '주차장', '조식', '피트니스', '수영장'].slice(0, Math.floor(3 + Math.random() * 3)),
      image_url: `https://picsum.photos/400/300?random=${i}`,
      availability: Math.random() > 0.3,
      discount: Math.random() > 0.7 ? Math.floor(10 + Math.random() * 30) : 0,
    });
  }

  const prices = accommodations.map(acc => acc.price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  return {
    keyword,
    total_found: accommodations.length,
    accommodations: accommodations.slice(0, 5),
    price_analysis: {
      average_price: Math.floor(avgPrice),
      min_price: Math.min(...prices),
      max_price: Math.max(...prices),
      price_range: Math.max(...prices) - Math.min(...prices),
      total_accommodations: accommodations.length,
      price_distribution: {
        budget: prices.filter(p => p < 100000).length,
        mid_range: prices.filter(p => p >= 100000 && p < 200000).length,
        luxury: prices.filter(p => p >= 200000).length,
      }
    }
  };
}