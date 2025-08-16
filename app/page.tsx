'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { AnimatedMetrics } from '@/components/dashboard/animated-metrics';
import { RealtimeMonitor } from '@/components/dashboard/realtime-monitor';
import { CompetitorAnalysis } from '@/components/dashboard/competitor-analysis';
import { TopDiscounts } from '@/components/dashboard/top-discounts';
import { AlertPanel } from '@/components/dashboard/alert-panel';
import { PriceChart3D } from '@/components/dashboard/price-chart-3d';
import { AccommodationSearchPanel } from '@/components/accommodation/search-panel';
import { motion } from 'framer-motion';

export default function Home() {
  const [analyticsData, setAnalyticsData] = useState<{
    overview?: {
      totalProducts?: number;
      avgPriceChange?: number;
      newProducts?: number;
      priceAlerts?: number;
    };
    priceHistory?: Array<{ date: string; avgPrice: number; minPrice: number; maxPrice: number }>;
    categoryDistribution?: Array<{ name: string; value: number; color: string }>;
    competitorComparison?: Array<{ name: string; avgPrice: number; products: number }>;
    topDiscounts?: Array<{ id: string; productName: string; originalPrice: number; currentPrice: number; discountRate: number; competitor: string }>;
    recentAlerts?: Array<{ id: string; type: string; message: string; productName: string; timestamp: string }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const mock3DData = [
    { x: 0, y: 3, z: 0, value: 85, label: '전자제품' },
    { x: 1, y: 2.5, z: 0, value: 72, label: '패션' },
    { x: 2, y: 3.8, z: 0, value: 92, label: '뷰티' },
    { x: 0, y: 2.2, z: 1, value: 65, label: '식품' },
    { x: 1, y: 4.1, z: 1, value: 95, label: '가전' },
    { x: 2, y: 1.8, z: 1, value: 45, label: '스포츠' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            E-Commerce Intelligence Dashboard
          </h1>
          <p className="text-gray-400">실시간 경쟁사 모니터링 및 가격 분석 시스템</p>
        </motion.div>

        <AnimatedMetrics metrics={analyticsData?.overview || {}} />

        {/* 숙소 크롤링 섹션 추가 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">🔎 AI 숙소 크롤링 (MCP Server)</h2>
          <AccommodationSearchPanel />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">3D 가격 분석</h2>
            <PriceChart3D data={mock3DData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">실시간 모니터링</h2>
            <RealtimeMonitor />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">경쟁사 분석</h2>
          <CompetitorAnalysis data={analyticsData} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">최대 할인 상품</h2>
            <TopDiscounts discounts={analyticsData?.topDiscounts || []} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">알림 센터</h2>
            <AlertPanel alerts={analyticsData?.recentAlerts || []} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}