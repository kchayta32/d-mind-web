import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TimelineFilterProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onShowAll: () => void;
  articles: Array<{ created_at?: string;[key: string]: any }>;
}

export const ImprovedArticleTimeline: React.FC<TimelineFilterProps> = ({
  onDateRangeChange,
  onShowAll,
  articles
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Get available years from articles
  const availableYears = useMemo(() => {
    const years = articles
      .map(article => {
        if (!article.created_at) return null;
        return new Date(article.created_at).getFullYear();
      })
      .filter((year): year is number => year !== null);

    return [...new Set(years)].sort((a, b) => b - a);
  }, [articles]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth('all');

    if (year === 'all') {
      onShowAll();
    } else {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year), 11, 31);
      onDateRangeChange(startDate, endDate);
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);

    if (selectedYear === 'all') return; // Should not happen given UI logic

    if (month === 'all') {
      const startDate = new Date(parseInt(selectedYear), 0, 1);
      const endDate = new Date(parseInt(selectedYear), 11, 31);
      onDateRangeChange(startDate, endDate);
    } else {
      const startDate = new Date(parseInt(selectedYear), parseInt(month), 1);
      const endDate = new Date(parseInt(selectedYear), parseInt(month) + 1, 0);
      onDateRangeChange(startDate, endDate);
    }
  };

  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Year Filter - Horizontal Scroll */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 shrink-0 text-sm font-medium text-muted-foreground mr-2">
          <Calendar className="w-4 h-4" />
          <span>ปี:</span>
        </div>
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex gap-2">
            <Button
              variant={selectedYear === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleYearChange('all')}
              className="rounded-full h-8 px-4"
            >
              ทั้งหมด
            </Button>
            {availableYears.map(year => (
              <Button
                key={year}
                variant={selectedYear === year.toString() ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleYearChange(year.toString())}
                className="rounded-full h-8 px-4"
              >
                {year + 543}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Month Filter - Only show if Year is selected */}
      {selectedYear !== 'all' && (
        <div className="flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="flex items-center gap-2 shrink-0 text-sm font-medium text-muted-foreground mr-2 w-[52px] justify-end">
            <span>เดือน:</span>
          </div>
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-2">
              <Button
                variant={selectedMonth === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleMonthChange('all')}
                className="rounded-full h-7 px-3 text-xs"
              >
                ทั้งปี
              </Button>
              {months.map((month, index) => (
                <Button
                  key={index}
                  variant={selectedMonth === index.toString() ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleMonthChange(index.toString())}
                  className={`rounded-full h-7 px-3 text-xs ${selectedMonth === index.toString() ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50 text-slate-600'}`}
                >
                  {month}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
