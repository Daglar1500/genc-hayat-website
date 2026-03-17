import React from 'react';
import type { Article } from '../types';
import ReadArticle from '../components/ReadArticle';

interface ReadViewProps {
    selectedArticle: Article;
    setView: (v: 'dashboard' | 'log' | 'read' | 'issues') => void;
}

export default function ReadView({ selectedArticle, setView }: ReadViewProps) {
    return (
        <ReadArticle
            article={selectedArticle}
            onClose={() => setView('dashboard')}
            onEdit={() => { setView('log'); }}
        />
    );
}
