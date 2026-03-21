import React from 'react';
import type { Article, Category } from '../types';
import LogArticle from '../components/LogArticle';

interface LogViewProps {
    selectedArticle: Article | null;
    categories: Category[];
    labels: string[];
    editors: string[];
    loggedArticles: Article[];
    setLoggedArticles: React.Dispatch<React.SetStateAction<Article[]>>;
    setView: (v: 'dashboard' | 'log' | 'read' | 'issues' | 'stats' | 'collections') => void;
    setSelectedArticle: (article: Article | null) => void;
    setPreviewArticle: (article: Article | null) => void;
    onMinimize: () => void;
    externalMinimized: boolean;
    onDirtyChange: (dirty: boolean) => void;
    saveTrigger?: number;
}

export default function LogView({
    selectedArticle, categories, labels, editors, loggedArticles,
    setLoggedArticles, setView, setSelectedArticle, setPreviewArticle,
    onMinimize, externalMinimized, onDirtyChange, saveTrigger,
}: LogViewProps) {
    const handleSuccess = (art: Article) => {
        setLoggedArticles(prev => selectedArticle ? prev.map(a => a.id === art.id ? art : a) : [art, ...prev]);
        setView('dashboard');
        setSelectedArticle(null);
    };

    const handleSaveAndView = (art: Article) => {
        setLoggedArticles(prev => selectedArticle ? prev.map(a => a.id === art.id ? art : a) : [art, ...prev]);
        setSelectedArticle(null);
        setView('dashboard');
        setPreviewArticle(art);
    };

    return (
        <LogArticle
            key={selectedArticle?.id ?? 'new'}
            isEdit={!!selectedArticle}
            initialData={selectedArticle}
            onClose={() => { setView('dashboard'); setSelectedArticle(null); }}
            onSuccess={handleSuccess}
            onSaveAndView={handleSaveAndView}
            categories={categories}
            labels={labels}
            editors={editors}
            allArticles={loggedArticles}
            onMinimize={onMinimize}
            externalMinimized={externalMinimized}
            onDirtyChange={onDirtyChange}
            saveTrigger={saveTrigger}
        />
    );
}
