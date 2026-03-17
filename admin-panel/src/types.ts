export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface ContentBlock {
    id: string;
    type: 'paragraph' | 'subheading' | 'image';
    value: string;
}

export interface Article {
    id: string;
    title: string;
    subheading?: string;
    author: string;
    editorName: string;
    place?: string;
    school?: string;
    text?: string;
    content?: ContentBlock[];
    imageUrl: string;
    labels: string[];
    category: string;
    issueNumber: string;
    createdAt: number;
    status: 'edited' | 'not-edited';
    slug?: string;
    type?: 'featured' | 'normal' | 'sunu' | 'rota';
}

export type SectionType = 'main-row' | 'category-row' | 'ordinary-row' | 'spot-row' | 'article-feed' | 'video-row' | 'spotify-row' | 'letterboxd-row' | 'archive-row';

export interface Section {
    id: string;
    type: SectionType;
    title?: string;
    isPinned: boolean;
    isVisible?: boolean;
    coverImage?: string;
    preface?: string;
    routeArticle?: Article;
    issueNumber?: string;
    articles: Article[];
    config?: any;
}

export interface CoverMedia {
    type: 'image' | 'video';
    src: string;
    alt?: string;
    mediaLayout?: string;
}

export interface Issue {
    id: string;
    title: string;
    number: number;
    date: string;
    coverMedia?: CoverMedia;
    sunuArticleId?: string;
    rotaArticleId?: string;
    recommendedArticleIds: string[];
    otherArticleIds: string[];
    sunuArticle?: Article;
    rotaArticle?: Article;
    recomendedCards?: Article[];
    otherArticles?: Article[];
}
