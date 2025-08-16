'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Menu, Search, Bell, Plus, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCrawlOpen, setIsCrawlOpen] = useState(false);

  const handleCrawl = async (url: string) => {
    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: 'products' })
      });
      const data = await response.json();
      console.log('Crawl result:', data);
      setIsCrawlOpen(false);
    } catch (error) {
      console.error('Crawl error:', error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              E-Commerce Crawler
            </span>
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="상품 검색..."
              className="w-64 bg-gray-800 border-gray-700"
            />
          </div>

          <Sheet open={isCrawlOpen} onOpenChange={setIsCrawlOpen}>
            <SheetTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                <Plus className="h-4 w-4 mr-1" />
                크롤링 시작
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 text-white border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-white">새 크롤링 작업</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <Label>쇼핑몰 URL</Label>
                  <Input
                    id="crawl-url"
                    placeholder="https://example.com/products"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                  onClick={() => {
                    const input = document.getElementById('crawl-url') as HTMLInputElement;
                    if (input?.value) handleCrawl(input.value);
                  }}
                >
                  크롤링 시작
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
          </Button>

          <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 text-white border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-white">설정</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <Label>크롤링 주기</Label>
                  <Input defaultValue="30분" className="bg-gray-800 border-gray-700" />
                </div>
                <div>
                  <Label>알림 설정</Label>
                  <Input defaultValue="가격 10% 이상 변동" className="bg-gray-800 border-gray-700" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}