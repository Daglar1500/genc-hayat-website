import React from 'react';
import { X, Search, ChevronDown, Trash2 } from 'lucide-react';
import type { Article, Section } from '../types';
import { getSectionLabel } from '../utils/sectionHelpers';

interface SidebarProps {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
    sidebarSearch: string;
    setSidebarSearch: (s: string) => void;
    sidebarSort: 'issue' | 'date-desc' | 'date-asc' | 'category' | 'author';
    setSidebarSort: (s: 'issue' | 'date-desc' | 'date-asc' | 'category' | 'author') => void;
    loggedArticles: Article[];
    sections: Section[];
    bulkSelected: string[];
    setBulkSelected: React.Dispatch<React.SetStateAction<string[]>>;
    bulkDropdownOpen: boolean;
    setBulkDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleDragStart: (e: React.DragEvent, type: string, id: string, fromSec?: string) => void;
    deleteArticle: (id: string) => void;
    getCategoryColor: (name: string) => string;
    formatLogDate: (timestamp: number) => string;
    recordHistory: (prevSections: Section[]) => void;
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function Sidebar({
    menuOpen, setMenuOpen,
    sidebarSearch, setSidebarSearch,
    sidebarSort, setSidebarSort,
    loggedArticles, sections,
    bulkSelected, setBulkSelected,
    bulkDropdownOpen, setBulkDropdownOpen,
    handleDragStart, deleteArticle,
    getCategoryColor, formatLogDate,
    recordHistory, setSections, showToast,
}: SidebarProps) {
    const renderSidebarCard = (a: Article) => (
        <div
            key={a.id}
            draggable
            onDragStart={e => handleDragStart(e, 'sidebar', a.id)}
            className="relative p-3 border border-slate-700 rounded-xl bg-slate-800 hover:shadow-lg cursor-grab active:cursor-grabbing flex gap-3 group transition-all hover:border-blue-500 overflow-hidden"
        >
            {/* Bulk select checkbox */}
            <input
                type="checkbox"
                checked={bulkSelected.includes(a.id)}
                onChange={e => { e.stopPropagation(); setBulkSelected(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id]); }}
                onClick={e => e.stopPropagation()}
                className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 w-4 h-4 cursor-pointer"
            />
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${a.status === 'edited' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <img src={a.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-gray-100 ml-2 shrink-0" />
            <div className="flex-1 min-w-0 ml-1">
                <div className="font-medium text-xs text-slate-100 line-clamp-2 leading-tight mb-0.5 pr-6">{a.title}</div>
                {a.school && <div className="text-[10px] text-blue-400 font-semibold truncate">{a.school}</div>}
                <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[80px]">{a.author}</span>
                    <span className="text-[10px] text-slate-500">{formatLogDate(a.createdAt)}</span>
                </div>
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-bold text-slate-500">
                {(a.editorName?.[0] ?? '?').toUpperCase()}
            </div>
            <button
                onClick={e => { e.stopPropagation(); deleteArticle(a.id); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-900/40 hover:bg-red-900/70 text-red-400 hover:text-red-300 rounded"
            >
                <Trash2 size={12} />
            </button>
        </div>
    );

    const renderArticleList = () => {
        const q = sidebarSearch.trim().toLowerCase();
        const filtered = q
            ? loggedArticles.filter(a =>
                a.title.toLowerCase().includes(q) ||
                a.author.toLowerCase().includes(q) ||
                (a.school || '').toLowerCase().includes(q) ||
                (a.category || '').toLowerCase().includes(q)
            )
            : loggedArticles;

        if (q && filtered.length === 0) return (
            <div className="text-center text-slate-500 py-12 text-sm">Sonuç bulunamadı</div>
        );

        if (sidebarSort === 'issue') {
            const groups: Record<string, Article[]> = {};
            filtered.forEach(a => {
                const key = a.issueNumber || 'Sayısız';
                if (!groups[key]) groups[key] = [];
                groups[key].push(a);
            });
            const sorted = Object.entries(groups).sort(([a], [b]) => {
                const na = parseInt(a) || 0, nb = parseInt(b) || 0;
                return nb - na;
            });
            return sorted.map(([issueNum, arts]) => (
                <div key={issueNum} className="mb-4">
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sayı {issueNum}</span>
                        <div className="flex-1 h-px bg-slate-700" />
                        <span className="text-[10px] text-slate-600">{arts.length}</span>
                    </div>
                    <div className="space-y-2">{arts.map(renderSidebarCard)}</div>
                </div>
            ));
        }

        if (sidebarSort === 'date-desc' || sidebarSort === 'date-asc') {
            const sortedFlat = [...filtered].sort((a, b) =>
                sidebarSort === 'date-desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
            );
            return <div className="space-y-2">{sortedFlat.map(renderSidebarCard)}</div>;
        }

        if (sidebarSort === 'category') {
            const groups: Record<string, Article[]> = {};
            filtered.forEach(a => {
                const key = a.category || 'Kategorisiz';
                if (!groups[key]) groups[key] = [];
                groups[key].push(a);
            });
            const sortedGroups = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, 'tr'));
            return sortedGroups.map(([cat, arts]) => (
                <div key={cat} className="mb-4">
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(cat) }} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{cat}</span>
                        <div className="flex-1 h-px bg-slate-700" />
                        <span className="text-[10px] text-slate-600">{arts.length}</span>
                    </div>
                    <div className="space-y-2">{arts.map(renderSidebarCard)}</div>
                </div>
            ));
        }

        if (sidebarSort === 'author') {
            const sortedFlat = [...filtered].sort((a, b) => a.author.localeCompare(b.author, 'tr'));
            return <div className="space-y-2">{sortedFlat.map(renderSidebarCard)}</div>;
        }

        return null;
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-slate-900 border-r border-slate-700 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
            <div className="p-4 flex justify-between items-center border-b border-slate-700 bg-slate-800">
                <h2 className="font-semibold text-white">Haber Kütüphanesi</h2>
                <button onClick={() => setMenuOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="px-4 py-3 border-b border-slate-700 bg-slate-900">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                        value={sidebarSearch}
                        onChange={e => setSidebarSearch(e.target.value)}
                        placeholder="Başlık, yazar, okul ara..."
                        className="w-full pl-8 pr-3 py-2 text-sm border border-slate-700 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {sidebarSearch && (
                        <button onClick={() => setSidebarSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                            <X size={12} />
                        </button>
                    )}
                </div>
                {/* Sort row */}
                <div className="flex gap-1 mt-2 flex-wrap">
                    {(['issue', 'date-desc', 'date-asc', 'category', 'author'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setSidebarSort(s)}
                            className={`text-xs px-2 py-1 rounded font-medium transition-colors ${sidebarSort === s ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                        >
                            {s === 'issue' ? 'Sayı ↓' : s === 'date-desc' ? 'Tarih ↓' : s === 'date-asc' ? 'Tarih ↑' : s === 'category' ? 'Kategori' : 'Yazar'}
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1 pb-4 bg-slate-900">
                {renderArticleList()}
            </div>

            {/* Bulk action bar */}
            {bulkSelected.length > 0 && (
                <div className="border-t border-slate-700 bg-slate-800 px-3 py-2 shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-200">{bulkSelected.length} makale seçildi</span>
                        <button
                            onClick={() => setBulkSelected([])}
                            className="text-xs text-slate-500 hover:text-slate-300 underline"
                        >
                            Hepsini Kaldır
                        </button>
                        <div className="relative ml-auto">
                            <button
                                onClick={() => setBulkDropdownOpen(prev => !prev)}
                                className="text-xs px-2 py-1 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 flex items-center gap-1"
                            >
                                Section'a Ekle <ChevronDown size={12} />
                            </button>
                            {bulkDropdownOpen && (
                                <div className="absolute bottom-full right-0 mb-1 w-52 bg-white border rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto">
                                    {sections.map(sec => (
                                        <button
                                            key={sec.id}
                                            onClick={() => {
                                                recordHistory(sections);
                                                const selectedArts = loggedArticles.filter(a => bulkSelected.includes(a.id));
                                                setSections(prev => prev.map(s => {
                                                    if (s.id !== sec.id) return s;
                                                    const existingIds = new Set(s.articles.map(a => a.id));
                                                    const toAdd = selectedArts.filter(a => !existingIds.has(a.id));
                                                    return { ...s, articles: [...s.articles, ...toAdd] };
                                                }));
                                                showToast(`${bulkSelected.length} makale eklendi`);
                                                setBulkSelected([]);
                                                setBulkDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 truncate"
                                        >
                                            {getSectionLabel(sec.type)}{sec.title ? ` — ${sec.title}` : ''}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
