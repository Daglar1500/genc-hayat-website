import React from 'react';
import { X, Search, ChevronDown, Trash2, RotateCcw } from 'lucide-react';
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
    handleDragStart: (e: React.DragEvent, type: string, id: string, fromSec?: string, bulkIds?: string[]) => void;
    hasTabBar?: boolean;
    deleteArticle: (id: string) => void;
    getCategoryColor: (name: string) => string;
    formatLogDate: (timestamp: number) => string;
    recordHistory: (prevSections: Section[]) => void;
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
    showToast: (message: string, type?: 'success' | 'error') => void;
    setPreviewArticle: (article: Article | null) => void;
    trashedArticles: Article[];
    trashOpen: boolean;
    setTrashOpen: (open: boolean) => void;
    restoreArticle: (id: string) => void;
    permanentDeleteArticle: (id: string) => void;
    emptyTrash: () => void;
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
    setPreviewArticle,
    trashedArticles, trashOpen, setTrashOpen,
    restoreArticle, permanentDeleteArticle, emptyTrash,
    hasTabBar,
}: SidebarProps) {
    const bulkDropdownRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (!bulkDropdownOpen) return;
        const handler = (e: MouseEvent) => {
            if (bulkDropdownRef.current && !bulkDropdownRef.current.contains(e.target as Node)) {
                setBulkDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [bulkDropdownOpen, setBulkDropdownOpen]);

    const EDITOR_BG_COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6','#6366f1','#f97316','#06b6d4'];
    const getEditorColor = (name: string) => {
        if (!name) return '#94a3b8';
        let h = 0;
        for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
        return EDITOR_BG_COLORS[Math.abs(h) % EDITOR_BG_COLORS.length];
    };
    const getEditorInitials = (name: string) => {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return '?';
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const renderSidebarCard = (a: Article) => (
        <div
            key={a.id}
            draggable
            onDragStart={e => {
                if (bulkSelected.includes(a.id) && bulkSelected.length > 1) {
                    handleDragStart(e, 'sidebar', a.id, undefined, bulkSelected);
                } else {
                    handleDragStart(e, 'sidebar', a.id);
                }
            }}
            onClick={() => setPreviewArticle(a)}
            className={`relative p-2.5 border rounded-xl cursor-pointer flex gap-2.5 group transition-all overflow-hidden ${bulkSelected.includes(a.id) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : 'bg-white dark:bg-slate-800/60 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'}`}
        >
            {/* Bulk select checkbox */}
            <input
                type="checkbox"
                checked={bulkSelected.includes(a.id)}
                onChange={e => { e.stopPropagation(); setBulkSelected(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id]); }}
                onClick={e => e.stopPropagation()}
                className={`absolute top-2 left-2 z-10 w-4 h-4 cursor-pointer transition-opacity ${bulkSelected.includes(a.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            />
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${a.status === 'edited' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <img src={a.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-gray-200 dark:bg-slate-700 ml-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="font-medium text-xs text-gray-800 dark:text-slate-200 line-clamp-2 leading-tight mb-0.5 pr-5">{a.title}</div>
                {a.school && <div className="text-[10px] text-blue-500 dark:text-blue-400 truncate">{a.school}</div>}
                <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 truncate max-w-20">{a.author}</span>
                    <span className="text-[10px] text-gray-300 dark:text-slate-600">{formatLogDate(a.createdAt)}</span>
                </div>
            </div>
            {/* Editor initials badge — hidden on hover, replaced by delete button */}
            {a.editorName && (
                <div
                    className="absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center text-white font-bold text-[9px] group-hover:opacity-0 transition-opacity pointer-events-none"
                    style={{ backgroundColor: getEditorColor(a.editorName) }}
                    title={a.editorName}
                >
                    {getEditorInitials(a.editorName)}
                </div>
            )}
            <button
                onClick={e => { e.stopPropagation(); deleteArticle(a.id); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-gray-100 dark:bg-slate-900/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded-md"
            >
                <Trash2 size={12} />
            </button>
        </div>
    );

    const renderDivider = (label: string, count: number) => (
        <div className="flex items-center gap-2 mb-1 py-1 sticky top-0 z-20 bg-gray-50 dark:bg-slate-900 -mx-4 px-4">
            <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
            <span className="text-[10px] text-gray-300 dark:text-slate-600">{count}</span>
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
            <div className="text-center text-gray-400 dark:text-slate-500 py-12 text-sm">Sonuç bulunamadı</div>
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
                <div key={issueNum} className="mb-1">
                    {renderDivider(`Sayı ${issueNum}`, arts.length)}
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
                <div key={cat} className="mb-1">
                    <div className="flex items-center gap-2 mb-1 py-1 sticky top-0 z-20 bg-gray-50 dark:bg-slate-900 -mx-4 px-4">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(cat) }} />
                        <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest truncate">{cat}</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                        <span className="text-[10px] text-gray-300 dark:text-slate-600">{arts.length}</span>
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

    const renderTrashPanel = () => (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="px-4 py-2.5 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
                <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                    {trashedArticles.length} yazı
                </span>
                {trashedArticles.length > 0 && (
                    <button
                        onClick={() => { if (confirm('Çöp kutusundaki tüm yazılar kalıcı olarak silinecek. Emin misiniz?')) emptyTrash(); }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                        Tümünü Sil
                    </button>
                )}
            </div>
            <div className="px-4 pb-4 overflow-y-auto flex-1 bg-gray-50 dark:bg-slate-900">
                {trashedArticles.length === 0 ? (
                    <div className="text-center text-gray-400 dark:text-slate-500 py-12 text-sm">Çöp kutusu boş</div>
                ) : (
                    <div className="space-y-2 pt-3">
                        {trashedArticles.map(a => (
                            <div key={a.id} className="relative p-2.5 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800/60 flex gap-2.5 overflow-hidden opacity-70">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${a.status === 'edited' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <img src={a.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-gray-200 dark:bg-slate-700 ml-1.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-xs text-gray-800 dark:text-slate-200 line-clamp-2 leading-tight mb-0.5 pr-1">{a.title}</div>
                                    <div className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{a.author}</div>
                                </div>
                                <div className="flex flex-col gap-1 shrink-0">
                                    <button
                                        onClick={() => restoreArticle(a.id)}
                                        title="Geri Yükle"
                                        className="p-1 bg-gray-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-md transition-colors"
                                    >
                                        <RotateCcw size={11} />
                                    </button>
                                    <button
                                        onClick={() => { if (confirm('Bu yazı kalıcı olarak silinecek. Emin misiniz?')) permanentDeleteArticle(a.id); }}
                                        title="Kalıcı Sil"
                                        className="p-1 bg-gray-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/40 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-md transition-colors"
                                    >
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={`fixed top-0 left-0 z-40 w-80 bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col ${hasTabBar ? 'bottom-9' : 'bottom-0'}`}>
            <div className="px-4 py-3.5 flex justify-between items-center border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                        {trashOpen ? 'Çöp Kutusu' : 'Yazı Kütüphanesi'}
                    </h2>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setTrashOpen(!trashOpen)}
                        title={trashOpen ? 'Kütüphaneye Dön' : 'Çöp Kutusu'}
                        className={`relative p-1.5 rounded-lg transition-colors ${trashOpen ? 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                    >
                        <Trash2 size={15} />
                        {!trashOpen && trashedArticles.length > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                                {trashedArticles.length > 99 ? '99+' : trashedArticles.length}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setMenuOpen(false)} className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={16} /></button>
                </div>
            </div>

            {trashOpen ? renderTrashPanel() : (
                <>
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600 pointer-events-none" />
                            <input
                                value={sidebarSearch}
                                onChange={e => setSidebarSearch(e.target.value)}
                                placeholder="Başlık, yazar, okul ara..."
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-100 dark:bg-slate-800/80 text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                            {sidebarSearch && (
                                <button onClick={() => setSidebarSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600 hover:text-gray-600 dark:hover:text-slate-400 transition-colors">
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-1 mt-2 flex-wrap">
                            {(['issue', 'date-desc', 'date-asc', 'category', 'author'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSidebarSort(s)}
                                    className={`text-[11px] px-2 py-1 rounded-md font-medium transition-colors ${sidebarSort === s ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500 hover:bg-gray-300 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-300'}`}
                                >
                                    {s === 'issue' ? 'Sayı ↓' : s === 'date-desc' ? 'Tarih ↓' : s === 'date-asc' ? 'Tarih ↑' : s === 'category' ? 'Kategori' : 'Yazar'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="px-4 pb-4 overflow-y-auto flex-1 bg-gray-50 dark:bg-slate-900">
                        {renderArticleList()}
                    </div>

                    {/* Bulk action bar */}
                    {bulkSelected.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 px-3 py-2 shrink-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-gray-700 dark:text-slate-300 shrink-0">{bulkSelected.length} seçildi</span>
                                <button
                                    onClick={() => setBulkSelected([])}
                                    className="text-[11px] px-1.5 py-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 rounded font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors shrink-0"
                                >
                                    Kaldır
                                </button>
                                <button
                                    onClick={() => { bulkSelected.forEach(id => deleteArticle(id)); setBulkSelected([]); }}
                                    className="text-[11px] px-1.5 py-1 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors shrink-0"
                                >
                                    Sil
                                </button>
                                <div className="relative ml-auto shrink-0" ref={bulkDropdownRef}>
                                    <button
                                        onClick={() => setBulkDropdownOpen(prev => !prev)}
                                        className="text-[11px] px-1.5 py-1 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 flex items-center gap-1 whitespace-nowrap"
                                    >
                                        Bölüme Ekle <ChevronDown size={11} />
                                    </button>
                                    {bulkDropdownOpen && (
                                        <div className="absolute bottom-full right-0 mb-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto">
                                            {sections.filter(sec => ['ordinary-row','category-row','spot-row','article-feed'].includes(sec.type)).map(sec => (
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
                                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    {sec.type === 'category-row'
                                                        ? `Kategori: ${sec.title || '(seçilmedi)'}`
                                                        : `${getSectionLabel(sec.type)}${sec.title ? ` — ${sec.title}` : ''}`}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
