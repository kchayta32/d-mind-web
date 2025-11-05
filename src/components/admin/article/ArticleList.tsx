
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Article } from './types';

interface ArticleListProps {
  articles: Article[];
  onCreateNew: () => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  typeLabel: string;
  isLoading: boolean;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  onCreateNew,
  onEdit,
  onDelete,
  typeLabel,
  isLoading
}) => {
  if (isLoading) {
    return <div className="text-center py-8">กำลังโหลด...</div>;
  }
  return (
    <>
      <Button
        onClick={onCreateNew}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        เพิ่ม{typeLabel}ใหม่
      </Button>

      <div className="space-y-4">
        {articles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            ยังไม่มี{typeLabel} คลิก "เพิ่ม{typeLabel}ใหม่" เพื่อสร้าง
          </div>
        ) : (
          articles.map((article) => (
            <Card key={article.id} className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={article.image_url || '/lovable-uploads/70e87fa1-9284-4474-bda5-04c19250a4d5.png'} 
                    alt={article.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="text-lg font-bold text-blue-700 mb-1 flex-1">
                        {article.title || 'ไม่มีชื่อเรื่อง'}
                      </h3>
                      {article.published && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          เผยแพร่แล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{article.subtitle}</p>
                    <p className="text-gray-700 text-sm">{article.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      สร้างเมื่อ: {new Date(article.created_at).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(article)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      แก้ไข
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('คุณต้องการลบบทความนี้หรือไม่?')) {
                          onDelete(article.id);
                        }
                      }}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      ลบ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
};
