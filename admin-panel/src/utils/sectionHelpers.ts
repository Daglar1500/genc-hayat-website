import type { SectionType } from '../types';

export const getSectionLabel = (type: SectionType): string => {
    switch (type) {
        case 'main-row': return 'ANA BÖLÜM';
        case 'category-row': return 'KATEGORİ BÖLÜMÜ';
        case 'ordinary-row': return 'SIRADAN SATIR';
        case 'spot-row': return 'SPOT SATIRI';
        case 'article-feed': return 'YAZI AKIŞI';
        case 'video-row': return 'YOUTUBE VİDEOLARI';
        case 'spotify-row': return 'SPOTİFY ÇALMA LİSTELERİ';
        case 'letterboxd-row': return 'LETTERBOXD FİLM LİSTELERİ';
        case 'archive-row': return 'ARŞİV';
        default: return type;
    }
};
