'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Package, AlertCircle, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  delay?: number;
}

interface Metrics {
  totalProducts?: number;
  avgPriceChange?: number;
  newProducts?: number;
  priceAlerts?: number;
}

export function AnimatedMetrics({ metrics }: { metrics: Metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="총 모니터링 상품"
        value={metrics.totalProducts?.toLocaleString() || '0'}
        change={12}
        icon={<Package className="w-5 h-5" />}
        delay={0}
      />
      <MetricCard
        title="평균 가격 변동"
        value={`${metrics.avgPriceChange || 0}%`}
        change={metrics.avgPriceChange}
        icon={<BarChart3 className="w-5 h-5" />}
        delay={0.1}
      />
      <MetricCard
        title="신규 상품"
        value={metrics.newProducts || 0}
        change={8}
        icon={<Package className="w-5 h-5" />}
        delay={0.2}
      />
      <MetricCard
        title="가격 알림"
        value={metrics.priceAlerts || 0}
        change={-3}
        icon={<AlertCircle className="w-5 h-5" />}
        delay={0.3}
      />
    </div>
  );
}

function MetricCard({ title, value, change, icon, delay = 0 }: MetricCardProps) {
  const isPositive = change && change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
            {icon}
          </div>
          {change !== undefined && (
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {value}
        </motion.div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{title}</p>
      </Card>
    </motion.div>
  );
}