
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Article } from './types';

export const useArticleManager = (type: 'article' | 'guide') => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const articleType = type === 'article' ? 'emergency_article' : 'guide';

  // Load articles from database
  useEffect(() => {
    loadArticles();
  }, [type]);

  const loadArticles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('type', articleType)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดบทความได้",
        variant: "destructive",
      });
    } else {
      setArticles(data || []);
    }
    setIsLoading(false);
  };

  const handleCreateNew = () => {
    const newArticle: Partial<Article> = {
      title: '',
      subtitle: '',
      description: '',
      image_url: '',
      content: '',
      type: articleType,
      layout_type: 'auto',
      published: false
    };
    setEditingArticle(newArticle as Article);
    setIsEditing(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle({ ...article });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingArticle) return;

    // Generate slug from title
    const slug = editingArticle.title
      .toLowerCase()
      .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const articleData = {
      title: editingArticle.title,
      subtitle: editingArticle.subtitle || null,
      description: editingArticle.description || null,
      image_url: editingArticle.image_url || null,
      content: editingArticle.content,
      type: articleType,
      layout_type: editingArticle.layout_type || 'auto',
      published: editingArticle.published || false,
      slug: slug || null,
    };

    if (editingArticle.id && !editingArticle.id.startsWith('temp-')) {
      // Update existing article
      const { error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', editingArticle.id);

      if (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถบันทึกบทความได้",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Insert new article
      const { error } = await supabase
        .from('articles')
        .insert([articleData]);

      if (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถสร้างบทความได้",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "สำเร็จ",
      description: "บันทึกบทความเรียบร้อยแล้ว",
    });

    setIsEditing(false);
    setEditingArticle(null);
    loadArticles();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบบทความได้",
        variant: "destructive",
      });
    } else {
      toast({
        title: "สำเร็จ",
        description: "ลบบทความเรียบร้อยแล้ว",
      });
      loadArticles();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingArticle(null);
  };

  const updateEditingArticle = (updates: Partial<Article>) => {
    if (editingArticle) {
      setEditingArticle({ ...editingArticle, ...updates });
    }
  };

  return {
    articles,
    isEditing,
    editingArticle,
    isLoading,
    handleCreateNew,
    handleEdit,
    handleSave,
    handleDelete,
    handleCancel,
    updateEditingArticle
  };
};
