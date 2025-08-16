import { NextResponse } from 'next/server';

export async function GET() {
  // Mock 분석 데이터
  const analyticsData = {
    overview: {
      totalProducts: 1254,
      avgPriceChange: -5.2,
      newProducts: 48,
      priceAlerts: 23
    },
    priceHistory: generatePriceHistory(30),
    categoryDistribution: [
      { name: '전자제품', value: 35, color: '#8b5cf6' },
      { name: '패션', value: 25, color: '#3b82f6' },
      { name: '뷰티', value: 20, color: '#ec4899' },
      { name: '식품', value: 15, color: '#f59e0b' },
      { name: '가전', value: 5, color: '#10b981' }
    ],
    competitorComparison: [
      { name: '우리', avgPrice: 45000, products: 320 },
      { name: '경쟁사A', avgPrice: 48000, products: 280 },
      { name: '경쟁사B', avgPrice: 43000, products: 350 },
      { name: '경쟁사C', avgPrice: 46000, products: 290 }
    ],
    topDiscounts: generateTopDiscounts(5),
    recentAlerts: generateRecentAlerts(5)
  };

  return NextResponse.json(analyticsData);
}

function generatePriceHistory(days: number) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now - (days - i - 1) * dayMs);
    return {
      date: date.toISOString().split('T')[0],
      avgPrice: 50000 + Math.sin(i / 5) * 5000 + Math.random() * 2000,
      minPrice: 30000 + Math.sin(i / 5) * 3000 + Math.random() * 1000,
      maxPrice: 80000 + Math.sin(i / 5) * 8000 + Math.random() * 3000
    };
  });
}

function generateTopDiscounts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `discount-${i + 1}`,
    productName: `할인 상품 ${i + 1}`,
    originalPrice: 100000 + i * 20000,
    currentPrice: (100000 + i * 20000) * (0.5 + i * 0.05),
    discountRate: 50 - i * 5,
    competitor: `경쟁사${String.fromCharCode(65 + i)}`
  }));
}

function generateRecentAlerts(count: number) {
  const alertTypes = ['price_drop', 'new_product', 'stock_change', 'review_alert'];
  const messages = [
    '가격이 10% 이상 하락했습니다',
    '신규 상품이 등록되었습니다',
    '재고 상태가 변경되었습니다',
    '리뷰 평점이 크게 변동했습니다'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `alert-${i + 1}`,
    type: alertTypes[i % alertTypes.length],
    message: messages[i % messages.length],
    productName: `상품 ${i + 1}`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString()
  }));
}