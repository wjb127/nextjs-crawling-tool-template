import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // const { url, type } = await request.json();
    await request.json();
    const supabase = await createClient();

    // Mock 데이터 생성 (실제 크롤링 대신)
    const mockProducts = generateMockProducts(10);

    // 크롤링 작업 기록
    const { data: job, error: jobError } = await supabase
      .from('crawling_jobs')
      .insert({
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        products_found: mockProducts.length
      })
      .select()
      .single();

    if (jobError) throw jobError;

    // Mock 상품 데이터 저장
    const productsToInsert = mockProducts.map(product => ({
      product_name: product.name,
      product_url: product.url,
      current_price: product.price,
      original_price: product.originalPrice,
      discount_rate: product.discountRate,
      stock_status: product.stockStatus,
      image_url: product.imageUrl,
      category: product.category,
      brand: product.brand
    }));

    const { error: productsError } = await supabase
      .from('products')
      .insert(productsToInsert);

    if (productsError) throw productsError;

    return NextResponse.json({
      success: true,
      message: '크롤링이 완료되었습니다',
      data: {
        jobId: job?.id,
        productsFound: mockProducts.length,
        products: mockProducts
      }
    });
  } catch (error) {
    console.error('Crawling error:', error);
    return NextResponse.json(
      { success: false, error: '크롤링 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

function generateMockProducts(count: number) {
  const categories = ['전자제품', '패션', '뷰티', '식품', '가전'];
  const brands = ['Samsung', 'LG', 'Apple', 'Nike', 'Adidas'];
  const statuses = ['재고있음', '품절임박', '품절', '예약판매'];

  return Array.from({ length: count }, (_, i) => {
    const originalPrice = Math.floor(Math.random() * 1000000) + 50000;
    const discountRate = Math.floor(Math.random() * 50);
    const currentPrice = originalPrice * (1 - discountRate / 100);

    return {
      id: `product-${i + 1}`,
      name: `상품 ${i + 1} - ${categories[i % categories.length]}`,
      url: `https://example.com/product/${i + 1}`,
      price: Math.floor(currentPrice),
      originalPrice,
      discountRate,
      stockStatus: statuses[Math.floor(Math.random() * statuses.length)],
      imageUrl: `https://picsum.photos/seed/${i + 1}/400/400`,
      category: categories[i % categories.length],
      brand: brands[i % brands.length],
      reviews: {
        count: Math.floor(Math.random() * 1000),
        rating: (Math.random() * 2 + 3).toFixed(1)
      }
    };
  });
}