import * as cheerio from 'cheerio';
import axios from 'axios';

export interface Product {
  name: string;
  url: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  stockStatus?: string;
  imageUrl?: string;
  category?: string;
  brand?: string;
  reviews?: {
    count: number;
    rating: number;
  };
}

export abstract class BaseCrawler {
  protected baseUrl: string;
  protected headers: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    };
  }

  protected async fetchPage(url: string): Promise<cheerio.CheerioAPI> {
    try {
      const response = await axios.get(url, {
        headers: this.headers,
        timeout: 10000,
      });
      return cheerio.load(response.data);
    } catch (error) {
      console.error(`Error fetching page ${url}:`, error);
      throw error;
    }
  }

  protected parsePrice(priceText: string): number {
    const cleanedPrice = priceText.replace(/[^0-9]/g, '');
    return parseInt(cleanedPrice, 10) || 0;
  }

  protected calculateDiscountRate(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= 0 || currentPrice <= 0) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  abstract crawlProductList(categoryUrl: string): Promise<Product[]>;
  abstract crawlProductDetail(productUrl: string): Promise<Product>;
  abstract searchProducts(keyword: string): Promise<Product[]>;
}