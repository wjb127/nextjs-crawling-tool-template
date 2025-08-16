'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Package, AlertTriangle } from 'lucide-react';

interface PriceUpdate {
  id: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  change: number;
  timestamp: Date;
  competitor: string;
}

export function RealtimeMonitor() {
  const [updates, setUpdates] = useState<PriceUpdate[]>([]);

  useEffect(() => {
    // Simulate realtime updates
    const interval = setInterval(() => {
      const newUpdate: PriceUpdate = {
        id: `update-${Date.now()}`,
        productName: `상품 ${Math.floor(Math.random() * 100)}`,
        oldPrice: Math.floor(Math.random() * 100000) + 10000,
        newPrice: Math.floor(Math.random() * 100000) + 10000,
        change: (Math.random() - 0.5) * 20,
        timestamp: new Date(),
        competitor: `경쟁사${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`
      };

      setUpdates(prev => [newUpdate, ...prev].slice(0, 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 h-[500px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2" />
          실시간 가격 모니터링
        </h3>
        <Badge variant="secondary" className="animate-pulse">
          LIVE
        </Badge>
      </div>

      <div className="space-y-2 overflow-y-auto h-[420px] custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {updates.map((update) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/50 backdrop-blur rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">{update.productName}</span>
                    <Badge variant="outline" className="text-xs">
                      {update.competitor}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      ₩{update.oldPrice.toLocaleString()}
                    </span>
                    <span className="text-gray-500">→</span>
                    <span className="text-white font-semibold">
                      ₩{update.newPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 ${update.change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {update.change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span className="font-semibold">{Math.abs(update.change).toFixed(1)}%</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {update.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              {Math.abs(update.change) > 10 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 flex items-center gap-1 text-yellow-400"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-xs">큰 가격 변동 감지</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}