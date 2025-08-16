'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, TrendingDown, Package, Star, AlertTriangle, Plus } from 'lucide-react';

const alertIcons = {
  price_drop: <TrendingDown className="w-4 h-4 text-green-500" />,
  new_product: <Package className="w-4 h-4 text-blue-500" />,
  stock_change: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  review_alert: <Star className="w-4 h-4 text-purple-500" />
};

const alertColors = {
  price_drop: 'bg-green-500/10 text-green-500 border-green-500/20',
  new_product: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  stock_change: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  review_alert: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
};

interface Alert {
  id: string;
  type: string;
  message: string;
  productName: string;
  timestamp: string;
}

export function AlertPanel({ alerts }: { alerts: Alert[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          알림 설정
        </h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Plus className="w-4 h-4 mr-1" />
              새 알림
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white border-gray-800">
            <DialogHeader>
              <DialogTitle>새 알림 설정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>알림 이름</Label>
                <Input placeholder="예: 경쟁사A 10% 이상 할인" className="bg-gray-800 border-gray-700" />
              </div>
              <div>
                <Label>알림 유형</Label>
                <Select>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_drop">가격 하락</SelectItem>
                    <SelectItem value="new_product">신규 상품</SelectItem>
                    <SelectItem value="stock_change">재고 변경</SelectItem>
                    <SelectItem value="review_alert">리뷰 알림</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>조건 설정</Label>
                <Input placeholder="예: 10% 이상 가격 하락" className="bg-gray-800 border-gray-700" />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                알림 생성
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {alerts?.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${alertColors[alert.type as keyof typeof alertColors] || 'bg-gray-800 border-gray-700'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {alertIcons[alert.type as keyof typeof alertIcons]}
                <div>
                  <p className="text-sm font-medium text-white">{alert.productName}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {alert.type.replace('_', ' ')}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}