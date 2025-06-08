
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Edit, Save, X } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  content: string;
  created_at: string;
}

interface ArticleManagerProps {
  onBack: () => void;
  type: 'article' | 'guide';
}

const ArticleManager: React.FC<ArticleManagerProps> = ({ onBack, type }) => {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 'sample-1',
      title: type === 'article' ? 'บทความตัวอย่าง' : 'คู่มือตัวอย่าง',
      subtitle: 'จาก ระบบจัดการแอดมิน',
      description: 'นี่คือตัวอย่างบทความสำหรับการทดสอบระบบ',
      image: '/lovable-uploads/70e87fa1-9284-4474-bda5-04c19250a4d5.png',
      content: 'เนื้อหาตัวอย่าง...',
      created_at: new Date().toISOString()
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleCreateNew = () => {
    const newArticle: Article = {
      id: `new-${Date.now()}`,
      title: '',
      subtitle: '',
      description: '',
      image: '',
      content: '',
      created_at: new Date().toISOString()
    };
    setEditingArticle(newArticle);
    setIsEditing(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle({ ...article });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingArticle) return;

    const existingIndex = articles.findIndex(a => a.id === editingArticle.id);
    if (existingIndex >= 0) {
      const updated = [...articles];
      updated[existingIndex] = editingArticle;
      setArticles(updated);
    } else {
      setArticles([...articles, editingArticle]);
    }
    
    setIsEditing(false);
    setEditingArticle(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingArticle(null);
  };

  const typeLabel = type === 'article' ? 'บทความ' : 'คู่มือ';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-blue-600 hover:bg-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold text-blue-700">จัดการ{typeLabel}</h2>
      </div>

      {!isEditing ? (
        <>
          <Button
            onClick={handleCreateNew}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่ม{typeLabel}ใหม่
          </Button>

          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img 
                      src={article.image || '/lovable-uploads/70e87fa1-9284-4474-bda5-04c19250a4d5.png'} 
                      alt={article.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-blue-700 mb-1">{article.title || 'ไม่มีชื่อเรื่อง'}</h3>
                      <p className="text-sm text-gray-500 mb-2">{article.subtitle}</p>
                      <p className="text-gray-700 text-sm">{article.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        สร้างเมื่อ: {new Date(article.created_at).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(article)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      แก้ไข
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">
              {editingArticle?.id.startsWith('new-') ? `เพิ่ม${typeLabel}ใหม่` : `แก้ไข${typeLabel}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">ชื่อเรื่อง</Label>
              <Input
                id="title"
                value={editingArticle?.title || ''}
                onChange={(e) => setEditingArticle(prev => prev ? {...prev, title: e.target.value} : null)}
                placeholder={`ระบุชื่อ${typeLabel}`}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">คำบรรยาย</Label>
              <Input
                id="subtitle"
                value={editingArticle?.subtitle || ''}
                onChange={(e) => setEditingArticle(prev => prev ? {...prev, subtitle: e.target.value} : null)}
                placeholder="แหล่งที่มาหรือคำบรรยายย่อ"
              />
            </div>
            <div>
              <Label htmlFor="description">รายละเอียดสั้น</Label>
              <Textarea
                id="description"
                value={editingArticle?.description || ''}
                onChange={(e) => setEditingArticle(prev => prev ? {...prev, description: e.target.value} : null)}
                placeholder="รายละเอียดสั้นๆ ที่จะแสดงในรายการ"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="image">URL รูปภาพ</Label>
              <Input
                id="image"
                value={editingArticle?.image || ''}
                onChange={(e) => setEditingArticle(prev => prev ? {...prev, image: e.target.value} : null)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="content">เนื้อหา</Label>
              <Textarea
                id="content"
                value={editingArticle?.content || ''}
                onChange={(e) => setEditingArticle(prev => prev ? {...prev, content: e.target.value} : null)}
                placeholder={`เนื้อหาของ${typeLabel}`}
                rows={10}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                บันทึก
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArticleManager;
