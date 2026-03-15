import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Labelo } from '../pages/MainPage/ArticleCard';
import type { ArticleCard } from '../pages/MainPage/ArticleCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// --- Types (admin panel format) ---
export interface ApiArticle {
  id: string;
  title: string;
  subheading?: string;
  author: string;
  editorName: string;
  place?: string;
  school?: string;
  content?: { id: string; type: string; value: string }[];
  imageUrl: string;
  labels: string[];
  category: string;
  issueNumber: string;
  createdAt: number;
  status: 'edited' | 'not-edited';
}

export interface ApiSection {
  id: string;
  type: 'main-row' | 'category-row' | 'ordinary-row' | 'spot-row' | 'article-feed' | 'video-row' | 'spotify-row' | 'letterboxd-row' | 'archive-row';
  title?: string | null;
  isPinned: boolean;
  isVisible?: boolean;
  coverImage?: string | null;
  preface?: string | null;
  issueNumber?: string | null;
  routeArticle?: ApiArticle | null;
  articles: ApiArticle[];
  config?: any;
}

export interface ApiCategory {
  id: string;
  name: string;
  color: string;
}

interface ApiData {
  sections: ApiSection[];
  articles: ApiArticle[];
  categories: ApiCategory[];
  labels: string[];
}

interface ApiContextValue {
  data: ApiData | null;
  loading: boolean;
  error: string | null;
  // Convenience helpers
  getFeedArticles: () => ApiArticle[];
  getMainSection: () => ApiSection | null;
  getCategorySection: (title?: string) => ApiSection | null;
}

const ApiContext = createContext<ApiContextValue | null>(null);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/init`)
      .then(r => r.json())
      .then((json: ApiData) => { setData(json); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const getFeedArticles = () =>
    data?.sections.find(s => s.type === 'article-feed')?.articles ?? data?.articles ?? [];

  const getMainSection = () =>
    data?.sections.find(s => s.type === 'main-row') ?? null;

  const getCategorySection = (title?: string) =>
    data?.sections.find(s => s.type === 'category-row' && (!title || s.title === title)) ?? null;

  return (
    <ApiContext.Provider value={{ data, loading, error, getFeedArticles, getMainSection, getCategorySection }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used inside ApiProvider');
  return ctx;
};

// Helper: admin panel Article → website ArticleCard format
export const toArticleCard = (article: ApiArticle): ArticleCard => ({
  href: `/articles/${article.id}`,
  firstMedia: { src: article.imageUrl, alt: article.title },
  title: article.title,
  description: article.subheading,
  publishedDate: new Date(article.createdAt),
  author: article.author,
  place: article.place,
  category: new Labelo('category', article.category || 'Güncel'),
  tags: (article.labels || []).map(l => new Labelo('tag', l)),
  issueNumber: parseInt(article.issueNumber) || 0,
  type: 'normal',
  content: [],
});
