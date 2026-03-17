import React from 'react';
import {
    FileText, CheckCircle, XCircle, Layers, BookMarked,
    Pin, Eye, EyeOff, ChevronUp, ChevronDown, Trash2, Edit3,
    AlignLeft, MapPin, Plus, X, GripVertical
} from 'lucide-react';
import type { Article, Section, Category } from '../types';
import { getSectionLabel } from '../utils/sectionHelpers';

interface ArticleCardProps {
    article: Article;
    sectionId: string;
    index?: number;
    compact?: boolean;
    large?: boolean;
    getCategoryColor: (name: string) => string;
    handleDragStart: (e: React.DragEvent, type: string, id: string, fromSec?: string) => void;
    handleDrop: (e: React.DragEvent, targetSecId: string, targetIndex?: number) => void;
    deleteArticleFromSection: (sectionId: string, articleId: string) => void;
    startEditArticle: (article: Article) => void;
    setPreviewArticle: (article: Article | null) => void;
}

function ArticleCard({
    article, sectionId, index, compact = false, large = false,
    getCategoryColor, handleDragStart, handleDrop,
    deleteArticleFromSection, startEditArticle, setPreviewArticle,
}: ArticleCardProps) {
    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, 'grid', article.id, sectionId)}
            onDrop={(e) => {
                if (!e.defaultPrevented) {
                    handleDrop(e, sectionId, index);
                }
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => setPreviewArticle(article)}
            className={`relative border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-all h-full flex flex-col ${large ? 'md:flex-row' : ''} cursor-move bg-white`}
        >
            {/* Drag handle */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 pointer-events-none">
                <GripVertical size={16} />
            </div>
            <div className="absolute top-3 left-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); deleteArticleFromSection(sectionId, article.id); }}
                    className="p-2 bg-red-600 hover:bg-red-500 rounded text-white"><Trash2 size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); startEditArticle(article); }} className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-white"><Edit3 size={16} />
                </button>
            </div>

            <div className={`relative bg-gray-200 ${large ? 'md:w-2/3 h-64 md:h-auto' : compact ? 'h-20' : 'h-24'}`}>
                <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm flex flex-col items-end z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-bold">{article.category}</span>
                    <span>#{article.issueNumber}</span>
                </div>
            </div>

            <div className="p-3 flex flex-col flex-1" style={{ backgroundColor: getCategoryColor(article.category) + '40' }}>
                <h3 className={`font-bold leading-tight ${large ? 'text-2xl' : 'text-base'} mb-1 text-gray-900`}>{article.title}</h3>
                {article.school && <p className="text-xs text-blue-600 font-semibold mt-1">{article.school}</p>}

                {large && article.subheading && <p className="text-gray-700 mb-4 italic text-sm">{article.subheading}</p>}
                <div className="mt-auto pt-2 flex justify-between items-center text-xs text-gray-800 font-medium">
                    <span className="font-bold">{article.author}</span>
                    {article.place && <span className="flex items-center gap-0.5"><MapPin size={12} /> {article.place}</span>}
                </div>
            </div>

            <div className="h-1 w-full relative" style={{ backgroundColor: getCategoryColor(article.category) + '40' }}>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${article.status === 'edited' ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
    handleDrop: (e: React.DragEvent, targetSecId: string, targetIndex?: number) => void;
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
    const articleCardProps = {
        getCategoryColor,
        handleDragStart,
        handleDrop,
        deleteArticleFromSection,
        startEditArticle,
        setPreviewArticle,
    };

    const renderPagination = (sectionId: string, total: number, limit: number) => {
        const state = pagination[sectionId] || { page: 1, expanded: false };

        if (!state.expanded) {
            if (total > 4) return (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, [sectionId]: { ...state, expanded: true } }))}
                        className="px-6 py-2 bg-white border rounded-full shadow-sm hover:bg-gray-50 text-sm font-bold text-gray-600"
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
            if (page <= 4) {
                pages = [1, 2, 3, 4, 5, '...', totalPages];
            } else if (page >= totalPages - 3) {
                pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
            }
        }

        return (
            <div className="flex flex-col items-center gap-4 mt-8">
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        {pages.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => typeof p === 'number' && setPagination(prev => ({ ...prev, [sectionId]: { ...state, page: p } }))}
                                disabled={typeof p !== 'number'}
                                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${p === page ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'} ${typeof p !== 'number' ? 'cursor-default border-none' : ''}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => setPagination(prev => ({ ...prev, [sectionId]: { ...state, expanded: false, page: 1 } }))}
                    className="text-xs text-gray-400 hover:text-gray-600 hover:underline"
                >
                    Daha Az Göster
                </button>
            </div>
        );
    };

    return (
        <>
            {/* Statistics Cards */}
            <div className="flex flex-wrap gap-3 mb-8">
                <div className="bg-white border rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 min-w-36">
                    <div className="p-2.5 bg-blue-50 rounded-xl"><FileText size={18} className="text-blue-600" /></div>
                    <div><div className="text-2xl font-black text-gray-900">{loggedArticles.length}</div><div className="text-xs text-gray-500 font-medium">Toplam Makale</div></div>
                </div>
                <div className="bg-white border rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 min-w-36">
                    <div className="p-2.5 bg-green-50 rounded-xl"><CheckCircle size={18} className="text-green-600" /></div>
                    <div><div className="text-2xl font-black text-gray-900">{loggedArticles.filter(a => a.status === 'edited').length}</div><div className="text-xs text-gray-500 font-medium">Düzenlendi</div></div>
                </div>
                <div className="bg-white border rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 min-w-36">
                    <div className="p-2.5 bg-red-50 rounded-xl"><XCircle size={18} className="text-red-500" /></div>
                    <div><div className="text-2xl font-black text-gray-900">{loggedArticles.filter(a => a.status !== 'edited').length}</div><div className="text-xs text-gray-500 font-medium">Düzenlenmedi</div></div>
                </div>
                <div className="bg-white border rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 min-w-36">
                    <div className="p-2.5 bg-purple-50 rounded-xl"><Layers size={18} className="text-purple-600" /></div>
                    <div><div className="text-2xl font-black text-gray-900">{sections.length}</div><div className="text-xs text-gray-500 font-medium">Section</div></div>
                </div>
                <div className="bg-white border rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 min-w-36">
                    <div className="p-2.5 bg-orange-50 rounded-xl"><BookMarked size={18} className="text-orange-500" /></div>
                    <div><div className="text-2xl font-black text-gray-900">{issues.length}</div><div className="text-xs text-gray-500 font-medium">Sayı</div></div>
                </div>
                {Object.entries(
                    loggedArticles.reduce((acc, a) => { if (a.category) acc[a.category] = (acc[a.category] || 0) + 1; return acc; }, {} as Record<string, number>)
                ).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([cat, count]) => (
                    <div key={cat} className="bg-white border-l-4 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 min-w-36" style={{ borderLeftColor: getCategoryColor(cat) }}>
                        <div><div className="text-2xl font-black text-gray-900">{count}</div><div className="text-xs text-gray-500 font-medium truncate max-w-20">{cat}</div></div>
                    </div>
                ))}
            </div>

            {/* Section Manager */}
            {sections.sort((a, b) => (a.isPinned === b.isPinned) ? 0 : a.isPinned ? -1 : 1).map((section, idx) => (
                <div
                    key={section.id}
                    className={`relative group border rounded-2xl p-8 transition-all ${section.isPinned ? 'border-blue-500 shadow-blue-50' : 'border-gray-200'} ${(section.isVisible ?? true) ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
                    onDragOver={e => e.preventDefault()}
                    onDrop={(e) => {
                        if (!e.defaultPrevented) {
                            handleDrop(e, section.id);
                        }
                    }}
                    style={section.type === 'category-row' ? { backgroundColor: getCategoryColor(section.title || '') + '20', borderColor: getCategoryColor(section.title || '') } : {}}
                >
                    {/* Section Label */}
                    <div className={`absolute -top-3.5 left-6 px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full flex items-center gap-2 shadow ${section.isPinned ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'}`}>
                        {section.isPinned && <Pin size={10} fill="currentColor" />}
                        {getSectionLabel(section.type)}
                    </div>

                    {/* CONTROLS */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-md z-20">
                        <button
                            onClick={() => {
                                recordHistory(sections);
                                const ns = [...sections];
                                const s = ns.find(x => x.id === section.id)!;
                                s.isVisible = !(s.isVisible ?? true);
                                setSections(ns);
                            }}
                            className={`p-1.5 rounded-md transition-all ${(section.isVisible ?? true) ? 'hover:text-gray-600 hover:bg-gray-50' : 'text-red-500 bg-red-50'}`}
                            title={(section.isVisible ?? true) ? 'Gizle' : 'Göster'}
                        >
                            {(section.isVisible ?? true) ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                            onClick={() => {
                                recordHistory(sections);
                                const ns = [...sections];
                                ns.find(x => x.id === section.id)!.isPinned = !ns.find(x => x.id === section.id)!.isPinned;
                                setSections(ns);
                            }}
                            className="p-1.5 rounded-md transition-all hover:text-blue-600 hover:bg-blue-50 hover:shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                        >
                            <Pin size={16} />
                        </button>
                        <button
                            onClick={() => {
                                recordHistory(sections);
                                const ns = [...sections];
                                if (idx > 0) { [ns[idx], ns[idx - 1]] = [ns[idx - 1], ns[idx]]; setSections(ns); }
                            }}
                            className="p-1.5 rounded-md transition-all hover:text-green-600 hover:bg-green-50 hover:shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            onClick={() => {
                                recordHistory(sections);
                                const ns = [...sections];
                                if (idx < ns.length - 1) { [ns[idx], ns[idx + 1]] = [ns[idx + 1], ns[idx]]; setSections(ns); }
                            }}
                            className="p-1.5 rounded-md transition-all hover:text-green-600 hover:bg-green-50 hover:shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                        >
                            <ChevronDown size={16} />
                        </button>
                        <button
                            onClick={() => { recordHistory(sections); setSections(sections.filter(s => s.id !== section.id)); }}
                            className="p-1.5 rounded-md transition-all hover:text-red-600 hover:bg-red-50 hover:shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* article-feed */}
                    {(section.type === 'article-feed') && (
                        <>
                            <div className="grid grid-cols-4 gap-6 min-h-[10rem]">
                                {section.articles.length === 0 && (
                                    <div className="col-span-4 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300">Makaleleri Buraya Sürükle</div>
                                )}
                                {(() => {
                                    const state = pagination[section.id] || { page: 1, expanded: false };
                                    const start = state.expanded ? (state.page - 1) * 8 : 0;
                                    const end = state.expanded ? start + 8 : 4;
                                    const displayArticles = section.articles.slice(start, end);
                                    return displayArticles.map((art, i) => (
                                        <div key={art.id} className="h-60">
                                            <ArticleCard article={art} sectionId={section.id} index={start + i} {...articleCardProps} />
                                        </div>
                                    ));
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
                                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <ChevronDown size={14} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="grid grid-cols-3 gap-6 min-h-[10rem] w-3/4">
                                    {section.articles.slice(0, 3).map((art, i) => (
                                        <div key={art.id} className="h-60">
                                            <ArticleCard article={art} sectionId={section.id} index={i} {...articleCardProps} />
                                        </div>
                                    ))}
                                    {section.articles.length === 0 && (
                                        <div className="col-span-3 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300">Buraya Sürükle (Maks 3)</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ordinary-row */}
                    {section.type === 'ordinary-row' && (
                        <div className="grid grid-cols-4 gap-6 min-h-[10rem]">
                            {section.articles.slice(0, 4).map((art, i) => (
                                <div key={art.id} className="h-60">
                                    <ArticleCard article={art} sectionId={section.id} index={i} {...articleCardProps} />
                                </div>
                            ))}
                            {section.articles.length === 0 && (
                                <div className="col-span-4 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300">Buraya Sürükle (Maks 4)</div>
                            )}
                        </div>
                    )}

                    {/* spot-row */}
                    {section.type === 'spot-row' && (
                        <div className="bg-gray-900 rounded-xl p-8 text-white flex gap-8 items-center min-h-[12rem] justify-center relative group/spot">
                            {section.articles[0] ? (
                                <>
                                    <img src={section.articles[0].imageUrl} className="w-1/3 h-48 object-cover rounded-lg shadow-2xl" />
                                    <div className="flex-1 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-yellow-400 font-bold tracking-widest text-xs uppercase block">Spot</span>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded">{section.articles[0].category}</span>
                                                <span className="text-[10px] text-gray-400 mt-1">#{section.articles[0].issueNumber}</span>
                                            </div>
                                        </div>
                                        <h2 className="text-4xl font-serif font-bold mb-2">{section.articles[0].title}</h2>
                                        {section.articles[0].school && <p className="text-sm text-blue-400 font-semibold mb-2">{section.articles[0].school}</p>}
                                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-4 border-t border-gray-700 pt-4">
                                            <span className="font-bold text-white">{section.articles[0].author}</span>
                                            {section.articles[0].place && <span className="flex items-center gap-1"><MapPin size={14} /> {section.articles[0].place}</span>}
                                        </div>
                                        <div className="absolute top-0 left-0 -ml-4 opacity-0 group-hover/spot:opacity-100 transition-opacity flex flex-col gap-2">
                                            <button onClick={() => { setSelectedArticle(section.articles[0]); setView('read'); }} className="p-2 bg-white/10 hover:bg-white/20 rounded text-white"><AlignLeft size={16} /></button>
                                            <button onClick={() => { setSelectedArticle(section.articles[0]); setView('log'); }} className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-white"><Edit3 size={16} /></button>
                                            <button
                                                onClick={() => {
                                                    recordHistory(sections);
                                                    const ns = [...sections];
                                                    ns.find(s => s.id === section.id)!.articles = [];
                                                    setSections(ns);
                                                }}
                                                className="p-2 bg-red-600 hover:bg-red-500 rounded text-white"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className={`p-1 text-[10px] font-bold text-center rounded ${section.articles[0].status === 'edited' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                {section.articles[0].status === 'edited' ? 'D' : 'D-'}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : <div className="text-gray-500">Spot Haberini Buraya Sürükle</div>}
                        </div>
                    )}

                    {/* video-row */}
                    {section.type === 'video-row' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Kanal URL</label>
                                <input
                                    className="flex-1 p-2 border rounded-lg text-sm"
                                    placeholder="https://www.youtube.com/@KanalAdi"
                                    value={section.config?.channelUrl || ''}
                                    onChange={e => updateSectionConfig(section.id, { channelUrl: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-gray-500 uppercase">Videolar</div>
                                {(section.config?.videos || []).map((v: any, i: number) => (
                                    <div key={v.id} className="flex gap-2 items-center p-2 border rounded-lg bg-gray-50">
                                        <div className="w-6 h-6 bg-red-600 text-white text-xs font-bold rounded flex items-center justify-center shrink-0">{i + 1}</div>
                                        <input className="flex-1 p-1.5 border rounded text-sm" placeholder="Video URL (YouTube)" value={v.url} onChange={e => updateConfigItem(section.id, 'videos', i, { url: e.target.value })} />
                                        <input className="w-48 p-1.5 border rounded text-sm" placeholder="Video Başlığı" value={v.title || ''} onChange={e => updateConfigItem(section.id, 'videos', i, { title: e.target.value })} />
                                        <button onClick={() => removeConfigItem(section.id, 'videos', i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addConfigItem(section.id, 'videos', { id: `v-${Date.now()}`, url: '', title: '', thumbnail: '', duration: '', date: '' })}
                                    className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"
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
                                <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Profil URL</label>
                                <input
                                    className="flex-1 p-2 border rounded-lg text-sm"
                                    placeholder="https://open.spotify.com/user/..."
                                    value={section.config?.profileUrl || ''}
                                    onChange={e => updateSectionConfig(section.id, { profileUrl: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-gray-500 uppercase">Çalma Listeleri</div>
                                {(section.config?.playlists || []).map((p: any, i: number) => (
                                    <div key={p.id} className="flex gap-2 items-center p-2 border rounded-lg bg-gray-50">
                                        <div className="w-6 h-6 bg-green-600 text-white text-xs font-bold rounded flex items-center justify-center shrink-0">{i + 1}</div>
                                        <input className="flex-1 p-1.5 border rounded text-sm" placeholder="Playlist URL (Spotify)" value={p.url} onChange={e => updateConfigItem(section.id, 'playlists', i, { url: e.target.value })} />
                                        <input className="w-48 p-1.5 border rounded text-sm" placeholder="Liste Adı" value={p.title || ''} onChange={e => updateConfigItem(section.id, 'playlists', i, { title: e.target.value })} />
                                        <button onClick={() => removeConfigItem(section.id, 'playlists', i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addConfigItem(section.id, 'playlists', { id: `p-${Date.now()}`, url: '', title: '', description: '', cover: '', trackCount: '' })}
                                    className="text-sm text-green-600 font-medium hover:underline flex items-center gap-1"
                                >
                                    <Plus size={14} /> Playlist Ekle
                                </button>
                            </div>
                        </div>
                    )}

                    {/* letterboxd-row */}
                    {section.type === 'letterboxd-row' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Profil URL</label>
                                <input
                                    className="flex-1 p-2 border rounded-lg text-sm"
                                    placeholder="https://letterboxd.com/kullanici/"
                                    value={section.config?.profileUrl || ''}
                                    onChange={e => updateSectionConfig(section.id, { profileUrl: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-gray-500 uppercase">Filmler</div>
                                {(section.config?.films || []).map((f: any, i: number) => (
                                    <div key={f.id} className="flex gap-2 items-center p-2 border rounded-lg bg-gray-50">
                                        <div className="w-6 h-6 bg-emerald-700 text-white text-xs font-bold rounded flex items-center justify-center shrink-0">{i + 1}</div>
                                        <input className="flex-1 p-1.5 border rounded text-sm" placeholder="Film URL (Letterboxd)" value={f.url} onChange={e => updateConfigItem(section.id, 'films', i, { url: e.target.value })} />
                                        <input className="w-40 p-1.5 border rounded text-sm" placeholder="Film Adı" value={f.title || ''} onChange={e => updateConfigItem(section.id, 'films', i, { title: e.target.value })} />
                                        <input className="w-16 p-1.5 border rounded text-sm" placeholder="Yıl" value={f.year || ''} onChange={e => updateConfigItem(section.id, 'films', i, { year: e.target.value })} />
                                        <button onClick={() => removeConfigItem(section.id, 'films', i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addConfigItem(section.id, 'films', { id: `f-${Date.now()}`, url: '', title: '', year: '', director: '', rating: 0, posterUrl: '' })}
                                    className="text-sm text-emerald-700 font-medium hover:underline flex items-center gap-1"
                                >
                                    <Plus size={14} /> Film Ekle
                                </button>
                            </div>
                        </div>
                    )}

                    {/* archive-row */}
                    {section.type === 'archive-row' && (
                        <div className="flex items-center justify-center h-20 text-gray-300 text-sm font-medium border-2 border-dashed border-gray-200 rounded-xl">
                            Sayı Arşivi — Sayılar sekmesinden yönetilir
                        </div>
                    )}

                    {/* main-row */}
                    {section.type === 'main-row' && (
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-3 aspect-[3/4] bg-gray-100 rounded relative overflow-hidden group/cover">
                                <img src={section.coverImage} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover/cover:opacity-100 font-bold cursor-pointer">Edit Cover</div>
                            </div>
                            <div className="col-span-3">
                                <textarea className="w-full h-full bg-transparent border-none outline-none resize-none font-serif italic text-lg text-gray-600" defaultValue={section.preface} placeholder="Preface..." />
                            </div>
                            <div className="col-span-6 bg-blue-50 border border-blue-100 rounded-xl p-8 relative">
                                {section.routeArticle ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                const ns = [...sections];
                                                ns.find(x => x.id === section.id)!.routeArticle = undefined;
                                                setSections(ns);
                                            }}
                                            className="absolute top-4 right-4 text-blue-300 hover:text-blue-600"
                                        >
                                            <X />
                                        </button>
                                        <span className="text-blue-600 font-bold uppercase text-xs tracking-wider mb-2 block">Route Article</span>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.routeArticle.title}</h2>
                                        <p className="text-gray-600">{section.routeArticle.subheading}</p>
                                    </>
                                ) : <div className="h-full flex items-center justify-center text-blue-300 font-bold">Drag Route Article Here</div>}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Add row zone */}
            <div className="border-2 border-dashed rounded-xl p-8 flex justify-center gap-4 text-gray-400 hover:border-gray-400 transition-colors">
                <button
                    onClick={() => setSections(prev => [...prev, { id: `s-${Date.now()}`, type: 'ordinary-row', isPinned: false, articles: [] }])}
                    className="px-4 py-2 bg-white border rounded hover:text-blue-600 shadow-sm"
                >
                    + Sıradan Satır
                </button>
                <button
                    onClick={() => setSections(prev => [...prev, { id: `s-${Date.now()}`, type: 'category-row', isPinned: false, articles: [] }])}
                    className="px-4 py-2 bg-white border rounded hover:text-blue-600 shadow-sm"
                >
                    + Kategori Satırı
                </button>
                <button
                    onClick={() => setSections(prev => [...prev, { id: `s-${Date.now()}`, type: 'spot-row', isPinned: false, articles: [] }])}
                    className="px-4 py-2 bg-white border rounded hover:text-blue-600 shadow-sm"
                >
                    + Spot Satırı
                </button>
            </div>
        </>
    );
}
