import React from 'react';
import type { Article } from '../types';
import ReadArticle from '../components/ReadArticle';

interface ReadViewProps {
    selectedArticle: Article;
    setView: (v: 'dashboard' | 'log' | 'read' | 'issues' | 'stats' | 'collections') => void;
    setSelectedArticle: (article: Article | null) => void;
}

export default function ReadView({ selectedArticle, setView, setSelectedArticle }: ReadViewProps) {
    return (
        <ReadArticle
            article={selectedArticle}
            onClose={() => { setView('dashboard'); setSelectedArticle(null); }}
            onEdit={() => setView('log')}
        />
    );
}
