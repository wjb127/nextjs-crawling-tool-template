'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Search, Hotel, MapPin, Star, Users, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface Accommodation {
  id: string;
  name: string;
  price: number;
  rating: string;
  reviews: number;
  location: string;
  amenities: string[];
  image_url: string;
  availability: boolean;
  discount?: number;
}

interface PriceAnalysis {
  average_price: number;
  min_price: number;
  max_price: number;
  price_range: number;
  total_accommodations: number;
  price_distribution: {
    budget: number;
    mid_range: number;
    luxury: number;
  };
}

export function AccommodationSearchPanel() {
  const [keyword, setKeyword] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    accommodations: Accommodation[];
    price_analysis: PriceAnalysis;
  } | null>(null);

  const handleSearch = async () => {
    if (!keyword) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/accommodation/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, checkIn, checkOut })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 검색 패널 */}
      <Card className="p-6 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="flex items-center gap-2 mb-4">
          <Hotel className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">AI 숙소 크롤링 시스템</h2>
          <Badge variant="secondary" className="ml-auto">MCP Server</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-white/80">검색 키워드</Label>
            <Input
              placeholder="예: 광화문, 강남"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <div>
            <Label className="text-white/80">체크인</Label>
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          
          <div>
            <Label className="text-white/80">체크아웃</Label>
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  검색
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* 가격 분석 */}
      {results?.price_analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">평균 가격</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-white">
              ₩{results.price_analysis.average_price.toLocaleString()}
            </p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">최저가</span>
              <TrendingDown className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-white">
              ₩{results.price_analysis.min_price.toLocaleString()}
            </p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">최고가</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-white">
              ₩{results.price_analysis.max_price.toLocaleString()}
            </p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">총 숙소</span>
              <Hotel className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-white">
              {results.price_analysis.total_accommodations}개
            </p>
          </Card>
        </motion.div>
      )}

      {/* 검색 결과 */}
      {results?.accommodations && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">검색 결과</h3>
          {results.accommodations.map((acc, index) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-gray-800/50 hover:bg-gray-800/70 transition-all cursor-pointer">
                <div className="flex gap-4">
                  <img
                    src={acc.image_url}
                    alt={acc.name}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{acc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-400">{acc.location}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-semibold">{acc.rating}</span>
                          <span className="text-xs text-gray-400">({acc.reviews})</span>
                        </div>
                        {acc.discount && acc.discount > 0 && (
                          <Badge className="bg-red-500 text-white mt-1">
                            -{acc.discount}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {acc.amenities.map((amenity, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          ₩{acc.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">1박 기준</p>
                      </div>
                    </div>
                    
                    {!acc.availability && (
                      <Badge className="mt-2 bg-gray-600">예약 마감</Badge>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}