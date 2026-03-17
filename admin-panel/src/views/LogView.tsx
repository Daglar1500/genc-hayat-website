import React from 'react';
import type { Article, Category } from '../types';
import LogArticle from '../components/LogArticle';

interface LogViewProps {
    selectedArticle: Article | null;
    categories: Category[];
    labels: string[];
    setLoggedArticles: React.Dispatch<React.SetStateAction<Article[]>>;
    setView: (v: 'dashboard' | 'log' | 'read' | 'issues') => void;
    setSelectedArticle: (article: Article | null) => void;
}

export default function LogView({
    selectedArticle, categories, labels,
    setLoggedArticles, setView, setSelectedArticle,
}: LogViewProps) {
    return (
        <LogArticle
            isEdit={!!selectedArticle}
            initialData={selectedArticle}
            onClose={() => { setView('dashboard'); setSelectedArticle(null); }}
            onSuccess={(art: Article) => {
                setLoggedArticles(prev => selectedArticle ? prev.map(a => a.id === art.id ? art : a) : [art, ...prev]);
                setView('dashboard');
                setSelectedArticle(null);
            }}
            categories={categories}
            labels={labels}
        />
    );
}
