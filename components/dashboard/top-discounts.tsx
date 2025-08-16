'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, ExternalLink } from 'lucide-react';

interface Discount {
  id: string;
  productName: string;
  originalPrice: number;
  currentPrice: number;
  discountRate: number;
  competitor: string;
}

export function TopDiscounts({ discounts }: { discounts: Discount[] }) {
  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-green-400" />
          최대 할인 상품 TOP 5
        </h3>
      </div>

      <div className="space-y-3">
        {discounts?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 p-4 cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{item.competitor}</p>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                  -{item.discountRate}%
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 line-through">
                    ₩{item.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-green-400">
                    ₩{item.currentPrice.toLocaleString()}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>

              <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.discountRate}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-green-400 to-blue-400"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}