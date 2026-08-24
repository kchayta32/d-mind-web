
import React, { useState, useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MobileUsageTip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if tip has been shown before
    const tipShown = localStorage.getItem('disaster-map-tip-shown');
    
    if (!tipShown) {
      // Show tip after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasShown(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('disaster-map-tip-shown', 'true');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't save to localStorage so it shows again next time
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-card text-card-foreground border-border shadow-2xl rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground">เคล็ดลับการใช้งาน</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">หมุนหน้าจอแนวนอน</strong> เพื่อประสบการณ์การดูแผนที่ที่ดีที่สุด
            </p>
            
            <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl">
              <p className="text-xs text-primary font-medium">
                💡 แผนที่จะแสดงรายละเอียดและเลเยอร์ GIS ได้ชัดเจนมากขึ้นในโหมดแนวนอน
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="flex-1 rounded-xl border-border"
            >
              ข้าม
            </Button>
            <Button
              size="sm"
              onClick={handleClose}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              เข้าใจแล้ว
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileUsageTip;
