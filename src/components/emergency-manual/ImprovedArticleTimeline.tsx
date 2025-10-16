import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, ChevronDown } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

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

  // Get articles by month for selected year
  const monthlyArticleCounts = useMemo(() => {
    if (selectedYear === 'all') return {};
    
    const counts: { [key: number]: number } = {};
    articles.forEach(article => {
      if (!article.created_at) return;
      const date = new Date(article.created_at);
      if (date.getFullYear() === parseInt(selectedYear)) {
        const month = date.getMonth();
        counts[month] = (counts[month] || 0) + 1;
      }
    });
    
    return counts;
  }, [articles, selectedYear]);

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
    
    if (selectedYear === 'all' || month === 'all') {
      if (selectedYear !== 'all') {
        const startDate = new Date(parseInt(selectedYear), 0, 1);
        const endDate = new Date(parseInt(selectedYear), 11, 31);
        onDateRangeChange(startDate, endDate);
      } else {
        onShowAll();
      }
    } else {
      const startDate = new Date(parseInt(selectedYear), parseInt(month), 1);
      const endDate = new Date(parseInt(selectedYear), parseInt(month) + 1, 0);
      onDateRangeChange(startDate, endDate);
    }
  };

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">กรองบทความ</h3>
              <p className="text-sm text-muted-foreground">
                เลือกช่วงเวลาที่ต้องการดูบทความ
              </p>
            </div>
          </div>

          {/* Year Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              เลือกปี
            </label>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกปี" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกปี</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year + 543} {/* Convert to Buddhist year */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Timeline - Only show when year is selected */}
          {selectedYear !== 'all' && (
            <div className="space-y-3">
              <label className="text-sm font-medium">เลือกเดือน</label>
              
              {/* Visual Timeline */}
              <div className="relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2 relative">
                  {months.map((month, index) => {
                    const hasArticles = monthlyArticleCounts[index] > 0;
                    return (
                      <button
                        key={index}
                        onClick={() => handleMonthChange(index.toString())}
                        className={`relative group ${
                          selectedMonth === index.toString()
                            ? 'z-10'
                            : 'z-0'
                        }`}
                        title={`${month} ${parseInt(selectedYear) + 543}`}
                      >
                        <div className={`
                          w-full aspect-square rounded-full transition-all
                          ${hasArticles 
                            ? 'bg-primary hover:bg-primary/80 hover:scale-110' 
                            : 'bg-gray-200 hover:bg-gray-300 hover:scale-105'
                          }
                          ${selectedMonth === index.toString()
                            ? 'ring-4 ring-primary/30 scale-110'
                            : ''
                          }
                        `}>
                          {hasArticles && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {monthlyArticleCounts[index]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs mt-1 text-center truncate">
                          {month.substring(0, 3)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Month Dropdown for easier selection */}
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกเดือน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกเดือน</SelectItem>
                  {months.map((month, index) => (
                    <SelectItem 
                      key={index} 
                      value={index.toString()}
                      disabled={!monthlyArticleCounts[index]}
                    >
                      {month} {monthlyArticleCounts[index] ? `(${monthlyArticleCounts[index]} บทความ)` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Show All Button */}
          <Button
            onClick={() => {
              setSelectedYear('all');
              setSelectedMonth('all');
              onShowAll();
            }}
            variant="outline"
            className="w-full"
          >
            แสดงบทความทั้งหมด
          </Button>

          {/* Filter Summary */}
          <div className="text-sm text-muted-foreground bg-white/50 rounded-lg p-3">
            <p>
              กำลังแสดง: {' '}
              <span className="font-semibold text-foreground">
                {selectedYear === 'all' 
                  ? 'บทความทั้งหมด'
                  : selectedMonth === 'all'
                    ? `ปี ${parseInt(selectedYear) + 543}`
                    : `${months[parseInt(selectedMonth)]} ${parseInt(selectedYear) + 543}`
                }
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
