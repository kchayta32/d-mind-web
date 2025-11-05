
export interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  content: string;
  type: string;
  layout_type: string;
  slug: string | null;
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleManagerProps {
  onBack: () => void;
  type: 'article' | 'guide';
}
