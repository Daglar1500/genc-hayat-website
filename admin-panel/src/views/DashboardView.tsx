import React, { useState, useEffect, useRef } from 'react';
import {
    FileText, CheckCircle, XCircle, Layers, BookMarked,
    Pin, Eye, EyeOff, ChevronUp, ChevronDown, Trash2, Edit3,
    AlignLeft, MapPin, Plus, X, GripVertical, Upload,
    Eraser, ChevronRight,
} from 'lucide-react';
import type { Article, Section, Category } from '../types';
import { getSectionLabel } from '../utils/sectionHelpers';
import { API_URL } from '../config';

type DisplayItem =
    | { type: 'article'; art: Article; realIdx: number }
    | { type: 'preview' };

async function fetchOEmbedTitle(type: 'video' | 'playlist' | 'film', url: string): Promise<string> {
    if (!url.trim()) return '';
    try {
        // Spotify has CORS-permissive oEmbed; YouTube and Letterboxd go through noembed.com proxy
        let endpoint = '';
        if (type === 'playlist') endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
        else endpoint = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
        const res = await fetch(endpoint);
        if (!res.ok) return '';
        const data = await res.json();
        return data.title || '';
    } catch { return ''; }
}

function buildDisplayItems(arts: Article[], previewIdx: number): DisplayItem[] {
    const items: DisplayItem[] = [];
    for (let i = 0; i <= arts.length; i++) {
        if (i === previewIdx) items.push({ type: 'preview' });
        if (i < arts.length) items.push({ type: 'article', art: arts[i], realIdx: i });
    }
    return items;
}

function InsertPreviewSlot() {
    return (
        <div className="h-60 rounded-xl border-2 border-dashed border-blue-400 dark:border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col items-center justify-center gap-2 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-800/60 flex items-center justify-center">
                <Plus size={18} className="text-blue-500 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-400 dark:text-blue-500">Buraya ekle</span>
        </div>
    );
}

function sectionTypeColor(type: string): string {
    switch (type) {
        case 'main-row': return 'bg-purple-500';
        case 'category-row': return 'bg-orange-400';
        case 'ordinary-row': return 'bg-gray-400';
        case 'spot-row': return 'bg-yellow-400';
        case 'article-feed': return 'bg-blue-500';
        case 'video-row': return 'bg-red-500';
        case 'spotify-row': return 'bg-green-500';
        case 'letterboxd-row': return 'bg-blue-600';
        case 'archive-row': return 'bg-slate-400';
        default: return 'bg-gray-400';
    }
}

interface ArticleCardProps {
    article: Article;
    sectionId: string;
    index?: number;
    compact?: boolean;
    large?: boolean;
    isReplaceTarget?: boolean;
    getCategoryColor: (name: string) => string;
    onDragStart: (e: React.DragEvent) => void;
    onCardDrop: (e: React.DragEvent) => void;
    onDragOverCard: (e: React.DragEvent) => void;
    onDragLeaveCard?: () => void;
    deleteArticleFromSection: (sectionId: string, articleId: string) => void;
    startEditArticle: (article: Article) => void;
    setPreviewArticle: (article: Article | null) => void;
}

function ArticleCard({
    article, sectionId, compact = false, large = false,
    isReplaceTarget = false,
    getCategoryColor, onDragStart, onCardDrop, onDragOverCard, onDragLeaveCard,
    deleteArticleFromSection, startEditArticle, setPreviewArticle,
}: ArticleCardProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirmDelete) {
            if (deleteTimer.current) clearTimeout(deleteTimer.current);
            deleteArticleFromSection(sectionId, article.id);
        } else {
            setConfirmDelete(true);
            deleteTimer.current = setTimeout(() => setConfirmDelete(false), 2000);
        }
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { onDragLeaveCard?.(); } }}
            onDrop={onCardDrop}
            onDragOver={onDragOverCard}
            onClick={() => setPreviewArticle(article)}
            className={`relative border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden group hover:shadow-lg transition-all h-full flex flex-col ${large ? 'md:flex-row' : ''} cursor-move bg-white dark:bg-gray-900 ${isReplaceTarget ? 'rotate-3 scale-95 opacity-60 shadow-xl' : ''}`}
        >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 pointer-events-none">
                <GripVertical size={16} />
            </div>
            <div className="absolute top-2.5 left-2.5 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleDeleteClick}
                    className={`rounded-lg text-white shadow-sm transition-all origin-center ${confirmDelete ? 'bg-red-600 hover:bg-red-700 px-3 py-2 scale-125 text-xs font-bold' : 'p-1.5 bg-red-500 hover:bg-red-600'}`}
                    title={confirmDelete ? 'Onaylamak için tekrar tıkla' : 'Sil'}
                >
                    {confirmDelete ? 'Sil?' : <Trash2 size={12} />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); startEditArticle(article); }}
                    className="p-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-white shadow-sm"
                ><Edit3 size={12} /></button>
            </div>

            <div className={`relative bg-gray-100 dark:bg-gray-800 ${large ? 'md:w-2/3 h-64 md:h-auto' : compact ? 'h-20' : 'h-28'}`}>
                <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="p-3 flex flex-col flex-1 gap-1" style={{ backgroundColor: getCategoryColor(article.category) + '18' }}>
                {/* Category + issue — always visible */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/8 dark:bg-white/10 text-gray-600 dark:text-gray-400 truncate max-w-[80%]">{article.category}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 shrink-0">#{article.issueNumber}</span>
                </div>
                {/* Title */}
                <h3 className={`font-semibold leading-snug ${large ? 'text-xl' : 'text-sm'} text-gray-900 dark:text-gray-100 line-clamp-2`}>{article.title}</h3>
                {/* Author */}
                <p className="text-xs text-gray-500 dark:text-gray-400">{article.author}</p>
                {large && article.subheading && <p className="text-gray-500 italic text-sm">{article.subheading}</p>}
                {/* Bottom row: section+city left, status dot right */}
                <div className="mt-auto pt-1 flex justify-between items-end">
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 flex flex-col gap-0.5">
                        {article.school && <span className="truncate max-w-[6rem] text-blue-500 dark:text-blue-400 font-medium">{article.school}</span>}
                        {article.place && <span className="flex items-center gap-0.5"><MapPin size={10} />{article.place}</span>}
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white dark:ring-gray-900 ${article.status === 'edited' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                </div>
            </div>
        </div>
    );
}


interface DashboardViewProps {
    sections: Section[];
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
    loggedArticles: Article[];
    categories: Category[];
    issues: { id: string }[];
    pagination: Record<string, { page: number, expanded: boolean }>;
    setPagination: React.Dispatch<React.SetStateAction<Record<string, { page: number, expanded: boolean }>>>;
    getCategoryColor: (name: string) => string;
    handleDragStart: (e: React.DragEvent, type: string, id: string, fromSec?: string) => void;
    handleDrop: (e: React.DragEvent, targetSecId: string, targetIndex?: number, mode?: 'replace' | 'articles') => void;
    deleteArticleFromSection: (sectionId: string, articleId: string) => void;
    startEditArticle: (article: Article) => void;
    setPreviewArticle: (article: Article | null) => void;
    setSelectedArticle: (article: Article) => void;
    setView: (v: 'dashboard' | 'log' | 'read' | 'issues') => void;
    recordHistory: (prevSections: Section[]) => void;
    updateSectionConfig: (sectionId: string, newConfig: any) => void;
    addConfigItem: (sectionId: string, field: string, item: any) => void;
    removeConfigItem: (sectionId: string, field: string, index: number) => void;
    updateConfigItem: (sectionId: string, field: string, index: number, patch: any) => void;
}

export default function DashboardView({
    sections, setSections,
    loggedArticles, categories, issues,
    pagination, setPagination,
    getCategoryColor,
    handleDragStart, handleDrop,
    deleteArticleFromSection, startEditArticle,
    setPreviewArticle, setSelectedArticle, setView,
    recordHistory,
    updateSectionConfig, addConfigItem, removeConfigItem, updateConfigItem,
}: DashboardViewProps) {
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [pendingClearId, setPendingClearId] = useState<string | null>(null);
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
    const [insertPreview, setInsertPreview] = useState<{ sectionId: string; index: number } | null>(null);
    const [replaceTarget, setReplaceTarget] = useState<{ sectionId: string; index: number } | null>(null);
    const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragConfigRef = useRef<{ sectionId: string; field: string; index: number } | null>(null);

    const getSectionSummary = (sec: Section): string => {
        switch (sec.type) {
            case 'spot-row': return sec.articles[0]?.title || 'Yazı yok';
            case 'ordinary-row': case 'category-row': case 'article-feed':
                return `${sec.articles.length} yazı`;
            case 'main-row':
                return `${(sec.routeArticle ? 1 : 0) + sec.articles.length} yazı`;
            case 'video-row': return `${(sec.config?.videos || []).length} video`;
            case 'spotify-row': return `${(sec.config?.playlists || []).length} playlist`;
            case 'letterboxd-row': return `${(sec.config?.films || []).length} film`;
            default: return '';
        }
    };

    const clearSection = (sec: Section) => {
        recordHistory(sections);
        setSections(prev => prev.map(s => {
            if (s.id !== sec.id) return s;
            const base = { ...s, articles: [] as typeof s.articles };
            if (s.type === 'main-row') (base as any).routeArticle = undefined;
            if (s.type === 'video-row') return { ...base, config: { ...s.config, videos: [] } };
            if (s.type === 'spotify-row') return { ...base, config: { ...s.config, playlists: [] } };
            if (s.type === 'letterboxd-row') return { ...base, config: { ...s.config, films: [] } };
            return base;
        }));
    };

    const scheduleHoverClear = () => {
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = setTimeout(() => {
            setInsertPreview(null);
            setReplaceTarget(null);
        }, 60);
    };
    const cancelHoverClear = () => {
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };

    useEffect(() => {
        const clear = () => { setDragOverId(null); setInsertPreview(null); setReplaceTarget(null); };
        document.addEventListener('dragend', clear);
        return () => document.removeEventListener('dragend', clear);
    }, []);

    useEffect(() => {
        if (!pendingDeleteId) return;
        const t = setTimeout(() => setPendingDeleteId(null), 2000);
        return () => clearTimeout(t);
    }, [pendingDeleteId]);

    const sharedCardProps = {
        getCategoryColor, deleteArticleFromSection, startEditArticle, setPreviewArticle,
    };

    // Per-card drag-over handler: determines insert-before / replace / insert-after based on cursor X
    const makeCardDragOver = (sectionId: string, idx: number) => (e: React.DragEvent) => {
        e.preventDefault();
        cancelHoverClear();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        if (relX < 0.28) {
            setInsertPreview({ sectionId, index: idx });
            setReplaceTarget(null);
        } else if (relX > 0.72) {
            setInsertPreview({ sectionId, index: idx + 1 });
            setReplaceTarget(null);
        } else {
            setReplaceTarget({ sectionId, index: idx });
            setInsertPreview(null);
        }
    };

    // Per-card drop handler
    const makeCardDrop = (sectionId: string, idx: number) => (e: React.DragEvent) => {
        const doReplace = replaceTarget?.sectionId === sectionId && replaceTarget?.index === idx;
        const insertIdx = insertPreview?.sectionId === sectionId ? insertPreview.index : undefined;
        setReplaceTarget(null);
        setInsertPreview(null);
        if (!e.defaultPrevented) {
            if (doReplace) {
                handleDrop(e, sectionId, idx, 'replace');
            } else if (insertIdx !== undefined) {
                handleDrop(e, sectionId, insertIdx);
            } else {
                handleDrop(e, sectionId, idx);
            }
        }
    };

    const renderPagination = (sectionId: string, total: number, limit: number) => {
        const state = pagination[sectionId] || { page: 1, expanded: false };

        if (!state.expanded) {
            if (total > 4) return (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, [sectionId]: { ...state, expanded: true } }))}
                        className="px-5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 shadow-sm transition-all"
                    >
                        Daha Fazla Yükle
                    </button>
                </div>
            );
            return null;
        }

        const totalPages = Math.ceil(total / limit);
        const page = state.page;
        let pages: (number | string)[] = [];
        if (totalPages <= 7) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            if (page <= 4) pages = [1, 2, 3, 4, 5, '...', totalPages];
            else if (page >= totalPages - 3) pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            else pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
        }

        return (
            <div className="flex flex-col items-center gap-3 mt-6">
                {totalPages > 1 && (
                    <div className="flex justify-center gap-1.5">
                        {pages.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => typeof p === 'number' && setPagination(prev => ({ ...prev, [sectionId]: { ...state, page: p } }))}
                                disabled={typeof p !== 'number'}
                                className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${p === page ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700'} ${typeof p !== 'number' ? 'cursor-default border-none text-gray-400 dark:text-gray-600' : ''}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => setPagination(prev => ({ ...prev, [sectionId]: { ...state, expanded: false, page: 1 } }))}
                    className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                    Daha Az Göster
                </button>
            </div>
        );
    };

    const sortedSections = [...sections].sort((a, b) => (a.isPinned === b.isPinned) ? 0 : a.isPinned ? -1 : 1);

    return (
        <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
                {[
                    { value: loggedArticles.length, label: 'Toplam Makale', icon: <FileText size={17} />, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
                    { value: loggedArticles.filter(a => a.status === 'edited').length, label: 'Düzenlendi', icon: <CheckCircle size={17} />, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
                    { value: loggedArticles.filter(a => a.status !== 'edited').length, label: 'Düzenlenmedi', icon: <XCircle size={17} />, bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-500 dark:text-rose-400' },
                    { value: sections.length, label: 'Section', icon: <Layers size={17} />, bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400' },
                    { value: issues.length, label: 'Sayı', icon: <BookMarked size={17} />, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
                ].map(({ value, label, icon, bg, text }) => (
                    <div key={label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                        <div className={`p-2.5 ${bg} rounded-xl shrink-0`}>
                            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: text })}
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums leading-none">{value}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top category chips */}
            <div className="flex gap-2 mb-8 flex-wrap">
                {Object.entries(
                    loggedArticles.reduce((acc, a) => { if (a.category) acc[a.category] = (acc[a.category] || 0) + 1; return acc; }, {} as Record<string, number>)
                ).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full px-3 py-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(cat) }} />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{cat}</span>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-600 tabular-nums">{count}</span>
                    </div>
                ))}
            </div>

            {/* Section Manager */}
            {sortedSections.map((section, idx) => (
                <div
                    key={section.id}
                    className={`border rounded-2xl overflow-hidden shadow-sm transition-all ${section.isPinned ? 'border-blue-300 dark:border-blue-700 shadow-blue-50' : 'border-gray-200 dark:border-gray-700'} ${(section.isVisible ?? true) ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/60 dark:bg-gray-900/40 opacity-60'} ${dragOverId === section.id ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
                    onDragEnter={e => { e.preventDefault(); setDragOverId(section.id); }}
                    onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverId(null); }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={(e) => { setDragOverId(null); setInsertPreview(null); setReplaceTarget(null); if (!e.defaultPrevented) handleDrop(e, section.id); }}
                    style={section.type === 'category-row' ? { borderColor: getCategoryColor(section.title || '') + 'aa' } : {}}
                >
                    {/* Card Header */}
                    <div
                        className={`flex items-center justify-between px-5 py-2.5 border-b border-gray-100 dark:border-gray-800 ${section.type !== 'category-row' ? (section.isPinned ? 'bg-blue-50 dark:bg-blue-950/40' : 'bg-gray-50 dark:bg-gray-800/60') : ''}`}
                        style={section.type === 'category-row' ? { backgroundColor: getCategoryColor(section.title || '') + '14' } : {}}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${sectionTypeColor(section.type)}`} />
                            {section.isPinned && <Pin size={11} fill="currentColor" className="text-blue-500" />}
                            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{getSectionLabel(section.type)}</span>
                            {section.type === 'category-row' && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${section.articles.length >= 3 ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>{section.articles.length}/3</span>
                            )}
                            {section.type === 'ordinary-row' && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${section.articles.length >= 4 ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>{section.articles.length}/4</span>
                            )}
                            {!(section.isVisible ?? true) && (
                                <span className="text-[10px] text-amber-600 font-medium bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">Gizli</span>
                            )}
                            {collapsedSections[section.id] && (
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full truncate max-w-[240px]">{getSectionSummary(section)}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-0.5">
                            <button
                                onClick={() => {
                                    recordHistory(sections);
                                    const ns = [...sections];
                                    const s = ns.find(x => x.id === section.id)!;
                                    s.isVisible = !(s.isVisible ?? true);
                                    setSections(ns);
                                }}
                                title={(section.isVisible ?? true) ? 'Gizle' : 'Göster'}
                                className={`p-1.5 rounded-lg transition-colors ${(section.isVisible ?? true) ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-amber-500 bg-amber-50 hover:bg-amber-100'}`}
                            >
                                {(section.isVisible ?? true) ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                            <button
                                onClick={() => {
                                    recordHistory(sections);
                                    const ns = [...sections];
                                    ns.find(x => x.id === section.id)!.isPinned = !ns.find(x => x.id === section.id)!.isPinned;
                                    setSections(ns);
                                }}
                                title={section.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
                                className={`p-1.5 rounded-lg transition-colors ${section.isPinned ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}
                            >
                                <Pin size={14} />
                            </button>
                            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />
                            <button
                                onClick={() => {
                                    recordHistory(sections);
                                    const ns = [...sections];
                                    if (idx > 0) { [ns[idx], ns[idx - 1]] = [ns[idx - 1], ns[idx]]; setSections(ns); }
                                }}
                                disabled={idx === 0}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                                <ChevronUp size={14} />
                            </button>
                            <button
                                onClick={() => {
                                    recordHistory(sections);
                                    const ns = [...sections];
                                    if (idx < ns.length - 1) { [ns[idx], ns[idx + 1]] = [ns[idx + 1], ns[idx]]; setSections(ns); }
                                }}
                                disabled={idx === sortedSections.length - 1}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                                <ChevronDown size={14} />
                            </button>
                            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />
                            {/* Collapse toggle */}
                            <button
                                onClick={() => setCollapsedSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                                title={collapsedSections[section.id] ? 'Genişlet' : 'Küçült'}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                {collapsedSections[section.id] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                            </button>
                            {/* Clear */}
                            <button
                                onClick={() => {
                                    if (pendingClearId === section.id) {
                                        clearSection(section);
                                        setPendingClearId(null);
                                    } else {
                                        setPendingClearId(section.id);
                                        setPendingDeleteId(null);
                                    }
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${pendingClearId === section.id ? 'bg-orange-500 text-white hover:bg-orange-600 px-2' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30'}`}
                                title={pendingClearId === section.id ? 'Onaylamak için tekrar tıkla' : 'İçeriği Temizle'}
                            >
                                {pendingClearId === section.id ? <span className="text-[10px] font-bold">Temizle?</span> : <Eraser size={14} />}
                            </button>
                            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />
                            <button
                                onClick={() => {
                                    if (pendingDeleteId === section.id) {
                                        recordHistory(sections);
                                        setSections(sections.filter(s => s.id !== section.id));
                                        setPendingDeleteId(null);
                                    } else {
                                        setPendingDeleteId(section.id);
                                    }
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${pendingDeleteId === section.id ? 'bg-red-500 text-white hover:bg-red-600 px-2' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                title={pendingDeleteId === section.id ? 'Onaylamak için tekrar tıkla' : 'Bölümü Sil'}
                            >
                                {pendingDeleteId === section.id ? <span className="text-[10px] font-bold">Sil?</span> : <Trash2 size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Section Content */}
                    {!collapsedSections[section.id] && <div className="p-6">

                        {/* article-feed */}
                        {section.type === 'article-feed' && (
                            <>
                                <div className="grid grid-cols-4 gap-5 min-h-40">
                                    {section.articles.length === 0 && !insertPreview && (
                                        <div className="col-span-4 h-20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center text-sm text-gray-300 dark:text-gray-600">Makaleleri Buraya Sürükle</div>
                                    )}
                                    {(() => {
                                        const pstate = pagination[section.id] || { page: 1, expanded: false };
                                        const start = pstate.expanded ? (pstate.page - 1) * 8 : 0;
                                        const end = pstate.expanded ? start + 8 : 4;
                                        const arts = section.articles.slice(start, end);
                                        const prevIdx = insertPreview?.sectionId === section.id && insertPreview.index >= start && insertPreview.index <= start + arts.length ? insertPreview.index - start : -1;
                                        return buildDisplayItems(arts, prevIdx).map(item =>
                                            item.type === 'preview'
                                                ? <InsertPreviewSlot key="preview" />
                                                : <div key={item.art.id} className="h-60">
                                                    <ArticleCard
                                                        article={item.art}
                                                        sectionId={section.id}
                                                        index={start + item.realIdx}
                                                        isReplaceTarget={replaceTarget?.sectionId === section.id && replaceTarget?.index === item.realIdx}
                                                        onDragStart={(e) => { handleDragStart(e, 'grid', item.art.id, section.id); }}
                                                        onDragOverCard={makeCardDragOver(section.id, item.realIdx)}
                                                        onDragLeaveCard={scheduleHoverClear}
                                                        onCardDrop={makeCardDrop(section.id, item.realIdx)}
                                                        {...sharedCardProps}
                                                    />
                                                </div>
                                        );
                                    })()}
                                </div>
                                {renderPagination(section.id, section.articles.length, 8)}
                            </>
                        )}

                        {/* category-row */}
                        {section.type === 'category-row' && (
                            <>
                                <div className="mb-6 flex items-center justify-center gap-2">
                                    <div className="relative inline-block">
                                        <select
                                            value={section.title || ''}
                                            onChange={(e) => {
                                                const ns = [...sections];
                                                const s = ns.find(x => x.id === section.id);
                                                if (s) s.title = e.target.value;
                                                setSections(ns);
                                            }}
                                            className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-1.5 px-4 pr-8 rounded-lg text-sm font-semibold cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        >
                                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                            <ChevronDown size={13} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                </div>
                                {(() => {
                                    const arts = section.articles.slice(0, 3);
                                    const canInsert = arts.length < 3;
                                    const prevIdx = (insertPreview?.sectionId === section.id && canInsert) ? insertPreview.index : -1;
                                    const items = buildDisplayItems(arts, prevIdx);
                                    return (
                                        <div className="flex justify-center">
                                            <div className="grid grid-cols-3 gap-5 min-h-40 w-3/4">
                                                {arts.length === 0 && prevIdx === -1 && (
                                                    <div className="col-span-3 h-20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center text-sm text-gray-300 dark:text-gray-600">Buraya Sürükle (Maks 3)</div>
                                                )}
                                                {items.map(item =>
                                                    item.type === 'preview'
                                                        ? <InsertPreviewSlot key="preview" />
                                                        : <div key={item.art.id} className="h-60">
                                                            <ArticleCard
                                                                article={item.art}
                                                                sectionId={section.id}
                                                                index={item.realIdx}
                                                                isReplaceTarget={replaceTarget?.sectionId === section.id && replaceTarget?.index === item.realIdx}
                                                                onDragStart={(e) => { handleDragStart(e, 'grid', item.art.id, section.id); }}
                                                                onDragOverCard={makeCardDragOver(section.id, item.realIdx)}
                                                                onDragLeaveCard={scheduleHoverClear}
                                                                onCardDrop={makeCardDrop(section.id, item.realIdx)}
                                                                {...sharedCardProps}
                                                            />
                                                        </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </>
                        )}

                        {/* ordinary-row */}
                        {section.type === 'ordinary-row' && (() => {
                            const arts = section.articles.slice(0, 4);
                            const canInsert = arts.length < 4;
                            const prevIdx = (insertPreview?.sectionId === section.id && canInsert) ? insertPreview.index : -1;
                            const items = buildDisplayItems(arts, prevIdx);
                            return (
                                <div className="grid grid-cols-4 gap-5 min-h-40">
                                    {arts.length === 0 && prevIdx === -1 && (
                                        <div className="col-span-4 h-20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center text-sm text-gray-300 dark:text-gray-600">Buraya Sürükle (Maks 4)</div>
                                    )}
                                    {items.map(item =>
                                        item.type === 'preview'
                                            ? <InsertPreviewSlot key="preview" />
                                            : <div key={item.art.id} className="h-60">
                                                <ArticleCard
                                                    article={item.art}
                                                    sectionId={section.id}
                                                    index={item.realIdx}
                                                    isReplaceTarget={replaceTarget?.sectionId === section.id && replaceTarget?.index === item.realIdx}
                                                    onDragStart={(e) => { handleDragStart(e, 'grid', item.art.id, section.id); }}
                                                    onDragOverCard={makeCardDragOver(section.id, item.realIdx)}
                                                    onDragLeaveCard={scheduleHoverClear}
                                                    onCardDrop={makeCardDrop(section.id, item.realIdx)}
                                                    {...sharedCardProps}
                                                />
                                            </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* spot-row */}
                        {section.type === 'spot-row' && (
                            <div className="bg-gray-900 rounded-xl p-8 text-white flex gap-8 items-center min-h-48 justify-center group/spot">
                                {section.articles[0] ? (
                                    <>
                                        <img src={section.articles[0].imageUrl} className="w-1/3 h-48 object-cover rounded-lg shadow-2xl shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-yellow-400 font-semibold tracking-widest text-xs uppercase">Spot</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded">{section.articles[0].category}</span>
                                                    <span className="text-[10px] text-gray-400">#{section.articles[0].issueNumber}</span>
                                                    <div className="flex gap-1 opacity-0 group-hover/spot:opacity-100 transition-opacity">
                                                        <button onClick={() => { setSelectedArticle(section.articles[0]); setView('read'); }} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"><AlignLeft size={14} /></button>
                                                        <button onClick={() => { setSelectedArticle(section.articles[0]); setView('log'); }} className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"><Edit3 size={14} /></button>
                                                        <button
                                                            onClick={() => {
                                                                recordHistory(sections);
                                                                const ns = [...sections];
                                                                ns.find(s => s.id === section.id)!.articles = [];
                                                                setSections(ns);
                                                            }}
                                                            className="p-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${section.articles[0].status === 'edited' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                            {section.articles[0].status === 'edited' ? '✓' : '!'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <h2 onClick={() => setPreviewArticle(section.articles[0])} className="text-4xl font-serif font-bold mb-2 leading-tight cursor-pointer hover:text-yellow-300 transition-colors">{section.articles[0].title}</h2>
                                            {section.articles[0].school && <p className="text-sm text-blue-400 font-medium mb-2">{section.articles[0].school}</p>}
                                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-4 border-t border-gray-700 pt-4">
                                                <span className="font-semibold text-white">{section.articles[0].author}</span>
                                                {section.articles[0].place && <span className="flex items-center gap-1"><MapPin size={14} /> {section.articles[0].place}</span>}
                                            </div>
                                        </div>
                                    </>
                                ) : <div className="text-gray-500 text-sm">Spot Haberini Buraya Sürükle</div>}
                            </div>
                        )}

                        {/* video-row */}
                        {section.type === 'video-row' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">Kanal URL</label>
                                    <input
                                        className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://www.youtube.com/@KanalAdi"
                                        value={section.config?.channelUrl || ''}
                                        onChange={e => updateSectionConfig(section.id, { channelUrl: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-gray-400 uppercase">Videolar</div>
                                    {(section.config?.videos || []).map((v: any, i: number) => (
                                        <div
                                            key={v.id}
                                            draggable
                                            onDragStart={e => { e.stopPropagation(); dragConfigRef.current = { sectionId: section.id, field: 'videos', index: i }; }}
                                            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                                            onDrop={e => {
                                                e.preventDefault(); e.stopPropagation();
                                                const drag = dragConfigRef.current;
                                                if (!drag || drag.sectionId !== section.id || drag.field !== 'videos' || drag.index === i) return;
                                                const items = [...(section.config?.videos || [])];
                                                const [moved] = items.splice(drag.index, 1);
                                                items.splice(i, 0, moved);
                                                updateSectionConfig(section.id, { videos: items });
                                                dragConfigRef.current = null;
                                            }}
                                            className="flex gap-2 items-center p-2 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/40 cursor-default"
                                        >
                                            <GripVertical size={14} className="text-gray-300 dark:text-gray-600 cursor-grab shrink-0" />
                                            <div className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-lg flex items-center justify-center shrink-0">{i + 1}</div>
                                            <input className="flex-1 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Video Başlığı" value={v.title || ''} onChange={e => updateConfigItem(section.id, 'videos', i, { title: e.target.value })} />
                                            <input
                                                className="w-52 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                placeholder="Video URL (YouTube)"
                                                value={v.url}
                                                onChange={e => updateConfigItem(section.id, 'videos', i, { url: e.target.value })}
                                                onBlur={async e => {
                                                    if (e.target.value && !v.title) {
                                                        const title = await fetchOEmbedTitle('video', e.target.value);
                                                        if (title) updateConfigItem(section.id, 'videos', i, { title });
                                                    }
                                                }}
                                            />
                                            <button onClick={() => removeConfigItem(section.id, 'videos', i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addConfigItem(section.id, 'videos', { id: `v-${Date.now()}`, url: '', title: '', thumbnail: '', duration: '', date: '' })}
                                        className="text-sm text-gray-500 font-medium hover:text-red-600 flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={14} /> Video Ekle
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* spotify-row */}
                        {section.type === 'spotify-row' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">Profil URL</label>
                                    <input
                                        className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://open.spotify.com/user/..."
                                        value={section.config?.profileUrl || ''}
                                        onChange={e => updateSectionConfig(section.id, { profileUrl: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">Çalma Listesi Sayısı</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-24 p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                        value={section.config?.playlistCount ?? ''}
                                        onChange={e => updateSectionConfig(section.id, { playlistCount: e.target.value === '' ? '' : Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-gray-400 uppercase">Çalma Listeleri</div>
                                    {(section.config?.playlists || []).map((p: any, i: number) => (
                                        <div
                                            key={p.id}
                                            draggable
                                            onDragStart={e => { e.stopPropagation(); dragConfigRef.current = { sectionId: section.id, field: 'playlists', index: i }; }}
                                            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                                            onDrop={e => {
                                                e.preventDefault(); e.stopPropagation();
                                                const drag = dragConfigRef.current;
                                                if (!drag || drag.sectionId !== section.id || drag.field !== 'playlists' || drag.index === i) return;
                                                const items = [...(section.config?.playlists || [])];
                                                const [moved] = items.splice(drag.index, 1);
                                                items.splice(i, 0, moved);
                                                updateSectionConfig(section.id, { playlists: items });
                                                dragConfigRef.current = null;
                                            }}
                                            className="flex gap-2 items-center p-2 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/40 cursor-default"
                                        >
                                            <GripVertical size={14} className="text-gray-300 dark:text-gray-600 cursor-grab shrink-0" />
                                            <div className="w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-lg flex items-center justify-center shrink-0">{i + 1}</div>
                                            <input className="flex-1 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Liste Adı" value={p.title || ''} onChange={e => updateConfigItem(section.id, 'playlists', i, { title: e.target.value })} />
                                            <input
                                                className="w-52 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                placeholder="Playlist URL (Spotify)"
                                                value={p.url}
                                                onChange={e => updateConfigItem(section.id, 'playlists', i, { url: e.target.value })}
                                                onBlur={async e => {
                                                    if (e.target.value && !p.title) {
                                                        const title = await fetchOEmbedTitle('playlist', e.target.value);
                                                        if (title) updateConfigItem(section.id, 'playlists', i, { title });
                                                    }
                                                }}
                                            />
                                            <button onClick={() => removeConfigItem(section.id, 'playlists', i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addConfigItem(section.id, 'playlists', { id: `p-${Date.now()}`, url: '', title: '', description: '', cover: '', trackCount: '' })}
                                        className="text-sm text-gray-500 font-medium hover:text-green-600 flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={14} /> Çalma Listesi Ekle
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* letterboxd-row */}
                        {section.type === 'letterboxd-row' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">Profil URL</label>
                                    <input
                                        className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://letterboxd.com/kullanici/"
                                        value={section.config?.profileUrl || ''}
                                        onChange={e => updateSectionConfig(section.id, { profileUrl: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-gray-400 uppercase">Film Listeleri</div>
                                    {(section.config?.films || []).map((f: any, i: number) => (
                                        <div
                                            key={f.id}
                                            draggable
                                            onDragStart={e => { e.stopPropagation(); dragConfigRef.current = { sectionId: section.id, field: 'films', index: i }; }}
                                            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                                            onDrop={e => {
                                                e.preventDefault(); e.stopPropagation();
                                                const drag = dragConfigRef.current;
                                                if (!drag || drag.sectionId !== section.id || drag.field !== 'films' || drag.index === i) return;
                                                const items = [...(section.config?.films || [])];
                                                const [moved] = items.splice(drag.index, 1);
                                                items.splice(i, 0, moved);
                                                updateSectionConfig(section.id, { films: items });
                                                dragConfigRef.current = null;
                                            }}
                                            className="flex gap-2 items-center p-2 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/40 cursor-default"
                                        >
                                            <GripVertical size={14} className="text-gray-300 dark:text-gray-600 cursor-grab shrink-0" />
                                            <div className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center shrink-0">{i + 1}</div>
                                            <input className="flex-1 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Liste Adı" value={f.title || ''} onChange={e => updateConfigItem(section.id, 'films', i, { title: e.target.value })} />
                                            <input
                                                className="w-52 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                placeholder="Letterboxd URL"
                                                value={f.url}
                                                onChange={e => updateConfigItem(section.id, 'films', i, { url: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-20 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                placeholder="Film sayısı"
                                                value={f.filmCount ?? ''}
                                                onChange={e => updateConfigItem(section.id, 'films', i, { filmCount: e.target.value === '' ? '' : Number(e.target.value) })}
                                            />
                                            <button onClick={() => removeConfigItem(section.id, 'films', i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addConfigItem(section.id, 'films', { id: `f-${Date.now()}`, url: '', title: '', filmCount: '' })}
                                        className="text-sm text-gray-500 font-medium hover:text-blue-600 flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={14} /> Film Listesi Ekle
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* archive-row */}
                        {section.type === 'archive-row' && (
                            <div className="flex items-center justify-center h-16 text-gray-400 dark:text-gray-600 text-sm border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                                Sayı Arşivi — Sayılar sekmesinden yönetilir
                            </div>
                        )}

                        {/* main-row */}
                        {section.type === 'main-row' && (
                            <div className="space-y-4">
                                {/* Title + Issue Number */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Bölüm Başlığı</label>
                                        <input
                                            value={section.title ?? ''}
                                            onFocus={() => recordHistory(sections)}
                                            onChange={e => { const ns = [...sections]; ns.find(x => x.id === section.id)!.title = e.target.value; setSections(ns); }}
                                            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Sayı 505"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Sayı No</label>
                                        <input
                                            value={section.issueNumber ?? ''}
                                            onFocus={() => recordHistory(sections)}
                                            onChange={e => { const ns = [...sections]; ns.find(x => x.id === section.id)!.issueNumber = e.target.value; setSections(ns); }}
                                            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="505"
                                        />
                                    </div>
                                </div>
                                {/* Cover + Preface + Route Article */}
                                <div className="grid grid-cols-12 gap-4">
                                    {/* Cover image */}
                                    <div className="col-span-3 space-y-2">
                                        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Kapak Görseli</label>
                                        <div className="aspect-3/4 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                                            {section.coverImage
                                                ? <img src={section.coverImage} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600 text-sm">Görsel Yok</div>
                                            }
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                value={section.coverImage ?? ''}
                                                onFocus={() => recordHistory(sections)}
                                                onChange={e => { const ns = [...sections]; ns.find(x => x.id === section.id)!.coverImage = e.target.value; setSections(ns); }}
                                                className="flex-1 min-w-0 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                placeholder="URL"
                                            />
                                            <label className="px-2 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs flex items-center gap-1 shrink-0 cursor-pointer">
                                                <Upload size={12} /> Yükle
                                                <input type="file" accept="image/*" className="hidden" onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const fd = new FormData();
                                                    fd.append('file', file);
                                                    fetch(`${API_URL}/upload`, { method: 'POST', body: fd })
                                                        .then(r => r.json())
                                                        .then(d => { if (d.url) { const ns = [...sections]; ns.find(x => x.id === section.id)!.coverImage = d.url; setSections(ns); } });
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                    {/* Preface */}
                                    <div className="col-span-4 space-y-2">
                                        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Önsöz</label>
                                        <textarea
                                            value={section.preface ?? ''}
                                            onFocus={() => recordHistory(sections)}
                                            onChange={e => { const ns = [...sections]; ns.find(x => x.id === section.id)!.preface = e.target.value; setSections(ns); }}
                                            className="w-full h-56 p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 font-serif italic"
                                            placeholder="Önsöz yazısı..."
                                        />
                                    </div>
                                    {/* Route Article drop zone */}
                                    <div
                                        className="col-span-5 bg-blue-50 dark:bg-blue-950/30 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-5 relative min-h-48 flex flex-col"
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={e => { e.stopPropagation(); handleDrop(e, section.id); }}
                                    >
                                        {section.routeArticle ? (
                                            <>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-blue-500 dark:text-blue-400 font-semibold uppercase text-xs tracking-wider">Rota Makalesi</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <button onClick={() => startEditArticle(section.routeArticle!)} className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"><Edit3 size={13} /></button>
                                                        <button onClick={() => setPreviewArticle(section.routeArticle!)} className="p-1.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Eye size={13} /></button>
                                                        <button
                                                            onClick={() => { recordHistory(sections); const ns = [...sections]; ns.find(x => x.id === section.id)!.routeArticle = undefined; setSections(ns); }}
                                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        ><X size={13} /></button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">{section.routeArticle.title}</h2>
                                                    {section.routeArticle.subheading && <p className="text-gray-500 dark:text-gray-400 text-sm italic mb-3">{section.routeArticle.subheading}</p>}
                                                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">{section.routeArticle.author}</span>
                                                        {section.routeArticle.place && <span className="flex items-center gap-0.5"><MapPin size={10} />{section.routeArticle.place}</span>}
                                                        <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">{section.routeArticle.category}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-blue-300 dark:text-blue-700">
                                                <AlignLeft size={28} />
                                                <span className="text-sm font-medium">Rota Makalesini Buraya Sürükle</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Önerilen yazılar — aynı ordinary-row grid düzeni */}
                                {(() => {
                                    const arts = section.articles;
                                    const prevIdx = (insertPreview?.sectionId === section.id) ? insertPreview.index : -1;
                                    const items = buildDisplayItems(arts, prevIdx);
                                    return (
                                        <div className="mt-4 space-y-2">
                                            <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Önerilen Yazılar <span className="font-normal normal-case text-gray-300 dark:text-gray-600">({arts.length})</span></label>
                                            <div
                                                className="grid grid-cols-4 gap-5 min-h-40"
                                                onDragOver={e => e.preventDefault()}
                                                onDrop={e => handleDrop(e, section.id, undefined, 'articles')}
                                            >
                                                {arts.length === 0 && prevIdx === -1 && (
                                                    <div className="col-span-4 h-20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center text-sm text-gray-300 dark:text-gray-600">Yazı Kütüphanesinden Buraya Sürükle</div>
                                                )}
                                                {items.map(item =>
                                                    item.type === 'preview'
                                                        ? <InsertPreviewSlot key="preview" />
                                                        : <div key={item.art.id} className="h-60">
                                                            <ArticleCard
                                                                article={item.art}
                                                                sectionId={section.id}
                                                                index={item.realIdx}
                                                                isReplaceTarget={replaceTarget?.sectionId === section.id && replaceTarget?.index === item.realIdx}
                                                                onDragStart={(e) => { handleDragStart(e, 'grid', item.art.id, section.id); }}
                                                                onDragOverCard={makeCardDragOver(section.id, item.realIdx)}
                                                                onDragLeaveCard={scheduleHoverClear}
                                                                onCardDrop={makeCardDrop(section.id, item.realIdx)}
                                                                {...sharedCardProps}
                                                            />
                                                        </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>}
                </div>
            ))}

            {/* Add row zone */}
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-wrap justify-center items-center gap-3 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <span className="text-xs font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider">Bölüm Ekle</span>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                {[
                    { type: 'main-row', label: 'Ana Bölüm' },
                    { type: 'ordinary-row', label: 'Sıradan Satır' },
                    { type: 'category-row', label: 'Kategori Bölümü' },
                    { type: 'spot-row', label: 'Spot Satırı' },
                    { type: 'archive-row', label: 'Arşiv' },
                    { type: 'spotify-row', label: 'Spotify' },
                    { type: 'letterboxd-row', label: 'Letterboxd' },
                    { type: 'video-row', label: 'YouTube Videoları' },
                ].map(({ type, label }) => (
                    <button
                        key={type}
                        onClick={() => setSections(prev => [...prev, { id: `s-${Date.now()}`, type: type as any, isPinned: false, articles: [] }])}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 dark:hover:border-blue-700 dark:hover:text-blue-400 transition-all shadow-sm"
                    >
                        <Plus size={14} /> {label}
                    </button>
                ))}
            </div>
        </>
    );
}
