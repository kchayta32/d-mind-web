import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageProvider';

interface TimelineFilterProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onShowAll: () => void;
  articles: Array<{ created_at?: string; [key: string]: any }>;
}

export const ImprovedArticleTimeline: React.FC<TimelineFilterProps> = ({
  onDateRangeChange,
  onShowAll,
  articles
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const { language } = useLanguage();
  const isEn = language === 'en';

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
      const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59);
      onDateRangeChange(startDate, endDate);
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);

    if (selectedYear === 'all') return;

    if (month === 'all') {
      const startDate = new Date(parseInt(selectedYear), 0, 1);
      const endDate = new Date(parseInt(selectedYear), 11, 31, 23, 59, 59);
      onDateRangeChange(startDate, endDate);
    } else {
      const startDate = new Date(parseInt(selectedYear), parseInt(month), 1);
      const endDate = new Date(parseInt(selectedYear), parseInt(month) + 1, 0, 23, 59, 59);
      onDateRangeChange(startDate, endDate);
    }
  };

  const months = isEn
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  return (
    <div className="space-y-3 mb-4">
      {/* Year Filter - Horizontal Scroll */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-muted-foreground mr-1">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{isEn ? 'Year:' : 'ปีที่เผยแพร่:'}</span>
        </div>
        <ScrollArea className="w-full whitespace-nowrap pb-1">
          <div className="flex gap-1.5">
            <Button
              variant={selectedYear === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleYearChange('all')}
              className={`rounded-full h-8 px-3.5 text-xs font-medium ${
                selectedYear === 'all' ? 'shadow-sm' : 'bg-card border-border hover:bg-muted text-foreground'
              }`}
            >
              {isEn ? 'All' : 'ทั้งหมด'}
            </Button>
            {availableYears.map(year => (
              <Button
                key={year}
                variant={selectedYear === year.toString() ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleYearChange(year.toString())}
                className={`rounded-full h-8 px-3.5 text-xs font-medium ${
                  selectedYear === year.toString() ? 'shadow-sm' : 'bg-card border-border hover:bg-muted text-foreground'
                }`}
              >
                {isEn ? year : `${year + 543} (${year})`}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Month Filter - Only show if Year is selected */}
      {selectedYear !== 'all' && (
        <div className="flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-muted-foreground mr-1 w-[56px] justify-end">
            <span>{isEn ? 'Month:' : 'เดือน:'}</span>
          </div>
          <ScrollArea className="w-full whitespace-nowrap pb-1">
            <div className="flex gap-1.5">
              <Button
                variant={selectedMonth === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleMonthChange('all')}
                className="rounded-full h-7 px-3 text-xs font-medium"
              >
                {isEn ? 'Whole Year' : 'ทั้งปี'}
              </Button>
              {months.map((month, index) => (
                <Button
                  key={index}
                  variant={selectedMonth === index.toString() ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleMonthChange(index.toString())}
                  className={`rounded-full h-7 px-3 text-xs font-medium ${
                    selectedMonth === index.toString()
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
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

export default ImprovedArticleTimeline;
