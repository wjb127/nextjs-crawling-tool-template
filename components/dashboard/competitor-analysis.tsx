'use client';

import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function CompetitorAnalysis({ data }: { data: any }) {
  const priceHistoryData = {
    labels: data?.priceHistory?.map((d: any) => d.date.split('-').slice(1).join('/')) || [],
    datasets: [
      {
        label: '평균가격',
        data: data?.priceHistory?.map((d: any) => d.avgPrice) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: '최저가격',
        data: data?.priceHistory?.map((d: any) => d.minPrice) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: '최고가격',
        data: data?.priceHistory?.map((d: any) => d.maxPrice) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const competitorComparisonData = {
    labels: data?.competitorComparison?.map((d: any) => d.name) || [],
    datasets: [
      {
        label: '평균 가격',
        data: data?.competitorComparison?.map((d: any) => d.avgPrice) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  const categoryData = {
    labels: data?.categoryDistribution?.map((d: any) => d.name) || [],
    datasets: [
      {
        data: data?.categoryDistribution?.map((d: any) => d.value) || [],
        backgroundColor: data?.categoryDistribution?.map((d: any) => d.color) || [],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <Tabs defaultValue="price" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="price">가격 추이</TabsTrigger>
          <TabsTrigger value="competitor">경쟁사 비교</TabsTrigger>
          <TabsTrigger value="category">카테고리 분포</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price" className="h-[300px]">
          <Line data={priceHistoryData} options={chartOptions} />
        </TabsContent>
        
        <TabsContent value="competitor" className="h-[300px]">
          <Bar data={competitorComparisonData} options={chartOptions} />
        </TabsContent>
        
        <TabsContent value="category" className="h-[300px]">
          <Doughnut 
            data={categoryData} 
            options={{
              ...chartOptions,
              scales: undefined
            }} 
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}