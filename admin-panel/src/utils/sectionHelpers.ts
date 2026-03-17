import type { SectionType } from '../types';

export const getSectionLabel = (type: SectionType): string => {
    switch (type) {
        case 'main-row': return 'ANA MANŞET';
        case 'category-row': return 'KATEGORİ SATIRI';
        case 'ordinary-row': return 'SIRADAN SATIR';
        case 'spot-row': return 'SPOT SATIRI';
        case 'article-feed': return 'HABER AKIŞI';
        case 'video-row': return 'VİDEO SATIRI';
        case 'spotify-row': return 'SPOTİFY LİSTELERİ';
        case 'letterboxd-row': return 'LETTERBOXD FİLMLER';
        case 'archive-row': return 'ARŞİV';
        default: return type;
    }
};
