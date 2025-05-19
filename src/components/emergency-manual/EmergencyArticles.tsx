
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface EmergencyArticle {
  id?: number;
  content?: string;
  metadata?: {
    title?: string;
    category?: string;
    summary?: string;
  };
}

const EmergencyArticles: React.FC = () => {
  const [articles, setArticles] = useState<EmergencyArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('เตือนภัย CAP')
          .select('id, content, metadata')
          .order('id', { ascending: true });

        if (error) {
          throw error;
        }

        setArticles(data || []);
      } catch (err) {
        console.error('Error fetching emergency articles:', err);
        setError('ไม่สามารถโหลดข้อมูลบทความได้ กรุณาลองอีกครั้งภายหลัง');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-guardian-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">ไม่พบบทความในระบบ</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-2">
              {article.metadata?.title || 'บทความเตือนภัย'}
            </h2>
            
            {article.metadata?.category && (
              <div className="inline-block bg-guardian-purple/10 text-guardian-purple px-2 py-0.5 rounded text-xs mb-2">
                {article.metadata.category}
              </div>
            )}
            
            {article.metadata?.summary && (
              <p className="text-sm text-gray-700 mb-2">{article.metadata.summary}</p>
            )}
            
            <ScrollArea className="max-h-48">
              <div className="text-sm whitespace-pre-wrap">
                {article.content || 'ไม่มีเนื้อหา'}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmergencyArticles;
