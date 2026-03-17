import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Menu, X, Plus, Search,
    ChevronDown, ChevronUp, Trash2, Edit3, Settings,
    Pin, MapPin, ArrowRight, Layout, Type,
    AlignLeft, BookOpen, Star, List, Eye, EyeOff,
    RotateCcw, RotateCw,
    FileText, CheckCircle, XCircle, Layers, BookMarked, TrendingUp,
    GripVertical
} from 'lucide-react';

import { API_URL } from './config';
import type { Article, Category, Section, SectionType, Issue } from './types';
import LogArticle from './components/LogArticle';
import ReadArticle from './components/ReadArticle';
import IssueForm from './components/IssueForm';

// --- Helper for Turkish Labels ---

const getSectionLabel = (type: SectionType) => {
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

export default function App() {
    const [view, setView] = useState<'dashboard' | 'log' | 'read' | 'issues'>('dashboard');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Data
    const [sections, setSections] = useState<Section[]>([]);
    const [loggedArticles, setLoggedArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [issueFormOpen, setIssueFormOpen] = useState(false);

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // UI
    const [pagination, setPagination] = useState<Record<string, { page: number, expanded: boolean }>>({});
    const dragItem = useRef<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [sidebarSearch, setSidebarSearch] = useState('');
    const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);
    const toastId = useRef(0);

    // Undo/Redo
    const sectionsHistoryRef = useRef<Section[][]>([]);
    const sectionsFutureRef = useRef<Section[][]>([]);
    const [historySize, setHistorySize] = useState(0);
    const [futureSize, setFutureSize] = useState(0);

    // Templates
    const [templates, setTemplates] = useState<{ name: string; sections: Omit<Section, 'articles' | 'routeArticle'>[] }[]>(() => {
        try { return JSON.parse(localStorage.getItem('cms-templates') || '[]'); } catch { return []; }
    });
    const [showTemplates, setShowTemplates] = useState(false);

    // Feature 2: Sidebar sort
    const [sidebarSort, setSidebarSort] = useState<'issue' | 'date-desc' | 'date-asc' | 'category' | 'author'>('issue');

    // Feature 3: Quick preview popup
    const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

    // Feature 4: Bulk selection
    const [bulkSelected, setBulkSelected] = useState<string[]>([]);
    const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);


    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = ++toastId.current;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    }, []);

    // --- Undo/Redo Functions ---
    const recordHistory = useCallback((prevSections: Section[]) => {
        sectionsHistoryRef.current = [...sectionsHistoryRef.current.slice(-29), prevSections];
        sectionsFutureRef.current = [];
        setHistorySize(sectionsHistoryRef.current.length);
        setFutureSize(0);
    }, []);

    const undoSections = useCallback(() => {
        if (sectionsHistoryRef.current.length === 0) return;
        const prev = sectionsHistoryRef.current[sectionsHistoryRef.current.length - 1];
        sectionsHistoryRef.current = sectionsHistoryRef.current.slice(0, -1);
        setSections(current => {
            sectionsFutureRef.current = [current, ...sectionsFutureRef.current.slice(0, 29)];
            setHistorySize(sectionsHistoryRef.current.length);
            setFutureSize(sectionsFutureRef.current.length);
            return prev;
        });
    }, []);

    const redoSections = useCallback(() => {
        if (sectionsFutureRef.current.length === 0) return;
        const next = sectionsFutureRef.current[0];
        sectionsFutureRef.current = sectionsFutureRef.current.slice(1);
        setSections(current => {
            sectionsHistoryRef.current = [...sectionsHistoryRef.current.slice(-29), current];
            setHistorySize(sectionsHistoryRef.current.length);
            setFutureSize(sectionsFutureRef.current.length);
            return next;
        });
    }, []);

    // --- Template Functions ---
    const saveTemplate = () => {
        const name = prompt('Şablon adı:');
        if (!name) return;
        const templateSections = sections.map(({ articles, routeArticle, ...rest }) => rest);
        const newTemplates = [...templates, { name, sections: templateSections }];
        setTemplates(newTemplates);
        localStorage.setItem('cms-templates', JSON.stringify(newTemplates));
        showToast(`"${name}" şablonu kaydedildi`);
    };

    const loadTemplate = (template: { name: string; sections: Omit<Section, 'articles' | 'routeArticle'>[] }) => {
        if (!confirm(`"${template.name}" şablonu yüklensin mi? Mevcut düzen korunur, sadece bölüm yapısı değişir.`)) return;
        recordHistory(sections);
        const newSections = template.sections.map(s => ({ ...s, articles: [], routeArticle: undefined }));
        setSections(newSections as Section[]);
        setShowTemplates(false);
        showToast(`"${template.name}" şablonu yüklendi`);
    };

    const deleteTemplate = (idx: number) => {
        const newTemplates = templates.filter((_, i) => i !== idx);
        setTemplates(newTemplates);
        localStorage.setItem('cms-templates', JSON.stringify(newTemplates));
    };

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/init`).then(r => r.json()),
            fetch(`${API_URL}/issues`).then(r => r.json())
        ]).then(([d, issData]) => {
            setSections(d.sections);
            setLoggedArticles(d.articles);
            setCategories(d.categories);
            setLabels(d.labels);
            if (Array.isArray(issData)) setIssues(issData);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPreviewArticle(null);
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undoSections();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redoSections();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                setIsSaving(true);
                fetch(`${API_URL}/layout/save`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sections)
                })
                    .then(() => { showToast('Düzen kaydedildi!'); setIsSaving(false); })
                    .catch(() => { showToast('Kaydetme başarısız!', 'error'); setIsSaving(false); });
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [sections, showToast, undoSections, redoSections]);

    const getCategoryColor = (name: string) => categories.find(c => c.name === name)?.color || '#f3f4f6';

    const formatLogDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    // --- Backend Actions for Settings ---
    const addCategory = () => {
        const name = prompt("Kategori Adı:");
        if (!name) return;
        const color = prompt("Renk (Hex Kodu):") || '#ddd';
        fetch(`${API_URL}/categories`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, color })
        }).then(r => r.json()).then(c => setCategories([...categories, c]));
    };

    const deleteCategory = (id: string) => {
        if (!confirm("Kategoriyi silmek istediğinize emin misiniz?")) return;
        fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' }).then(() => setCategories(categories.filter(c => c.id !== id)));
    };

    const addLabel = () => {
        const label = prompt("Etiket Adı:");
        if (!label) return;
        fetch(`${API_URL}/labels`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label })
        }).then(r => r.json()).then(d => d.success && setLabels([...labels, d.label]));
    };

    const deleteLabel = (l: string) => {
        if (!confirm("Etiketi silmek istediğinize emin misiniz?")) return;
        fetch(`${API_URL}/labels/${l}`, { method: 'DELETE' }).then(() => setLabels(labels.filter(lb => lb !== l)));
    };

    const deleteArticleFromSection = (sectionId: string, articleId: string) => {
        recordHistory(sections);
        setSections(prev => prev.map(s => {
            if (s.id !== sectionId) return s;
            return { ...s, articles: s.articles.filter(a => a.id !== articleId) };
        }));
    };

    const deleteArticle = (id: string) => {
        if (!confirm('Bu makaleyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
        fetch(`${API_URL}/articles/${id}`, { method: 'DELETE' })
            .then(() => {
                setLoggedArticles(prev => prev.filter(a => a.id !== id));
                setSections(prev => prev.map(s => ({ ...s, articles: s.articles.filter(a => a.id !== id) })));
                showToast('Makale silindi');
            })
            .catch(() => showToast('Silme başarısız!', 'error'));
    };

    const updateSectionConfig = (sectionId: string, newConfig: any) => {
        setSections(prev => prev.map(s => s.id === sectionId ? { ...s, config: { ...(s.config || {}), ...newConfig } } : s));
    };

    const addConfigItem = (sectionId: string, field: string, item: any) => {
        const sec = sections.find(s => s.id === sectionId);
        if (!sec) return;
        const arr = [...(sec.config?.[field] || []), item];
        updateSectionConfig(sectionId, { [field]: arr });
    };

    const removeConfigItem = (sectionId: string, field: string, index: number) => {
        const sec = sections.find(s => s.id === sectionId);
        if (!sec) return;
        const arr = (sec.config?.[field] || []).filter((_: any, i: number) => i !== index);
        updateSectionConfig(sectionId, { [field]: arr });
    };

    const updateConfigItem = (sectionId: string, field: string, index: number, patch: any) => {
        const sec = sections.find(s => s.id === sectionId);
        if (!sec) return;
        const arr = (sec.config?.[field] || []).map((item: any, i: number) => i === index ? { ...item, ...patch } : item);
        updateSectionConfig(sectionId, { [field]: arr });
    };

    const startEditArticle = (article: Article) => {
        setSelectedArticle(article);
        setView('log');
    };

    // --- Pagination Logic ---
    const renderPagination = (sectionId: string, total: number, limit: number) => {
        const state = pagination[sectionId] || { page: 1, expanded: false };

        if (!state.expanded) {
            if (total > 4) return (
                <div className="flex justify-center mt-6">
                    <button onClick={() => setPagination({ ...pagination, [sectionId]: { ...state, expanded: true } })} className="px-6 py-2 bg-white border rounded-full shadow-sm hover:bg-gray-50 text-sm font-bold text-gray-600">
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
                                onClick={() => typeof p === 'number' && setPagination({ ...pagination, [sectionId]: { ...state, page: p } })}
                                disabled={typeof p !== 'number'}
                                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${p === page ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'} ${typeof p !== 'number' ? 'cursor-default border-none' : ''}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
                <button onClick={() => setPagination({ ...pagination, [sectionId]: { ...state, expanded: false, page: 1 } })} className="text-xs text-gray-400 hover:text-gray-600 hover:underline">
                    Daha Az Göster
                </button>
            </div>
        );
    };

    const handleDragStart = (e: React.DragEvent, type: string, id: string, fromSec?: string) => {
        dragItem.current = { type, id, fromSec };
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'copyMove';
    };

    const handleDrop = (e: React.DragEvent, targetSecId: string, targetIndex?: number) => {
        e.preventDefault();
        e.stopPropagation();
        const dragged = dragItem.current;
        if (!dragged) return;

        const sourceSecIdx = sections.findIndex(s => s.id === dragged.fromSec);
        const targetSecIdx = sections.findIndex(s => s.id === targetSecId);

        if (targetSecIdx === -1) return;

        recordHistory(sections);

        const newSections = [...sections];
        const targetSection = newSections[targetSecIdx];

        let art: Article | undefined;

        if (dragged.type === 'sidebar') {
            const found = loggedArticles.find(a => a.id === dragged.id);
            if (found) art = { ...found };
        } else if (sourceSecIdx !== -1) {
            const sourceSection = newSections[sourceSecIdx];
            const idx = sourceSection.articles.findIndex(a => a.id === dragged.id);
            if (idx !== -1) {
                [art] = sourceSection.articles.splice(idx, 1);
            }
        }

        if (!art) return;

        if (targetSection.type === 'article-feed') {
            if (targetIndex !== undefined && targetIndex < targetSection.articles.length) {
                targetSection.articles.splice(targetIndex, 0, art);
            } else {
                targetSection.articles.unshift(art);
            }
        } else {
            if (targetIndex !== undefined && targetIndex < targetSection.articles.length) {
                if (dragged.type === 'sidebar') {
                    targetSection.articles[targetIndex] = art;
                } else {
                    targetSection.articles.splice(targetIndex, 0, art);
                    const limit = targetSection.type === 'category-row' ? 3 : 4;
                    if (targetSection.articles.length > limit) {
                        targetSection.articles = targetSection.articles.slice(0, limit);
                    }
                }
            } else {
                targetSection.articles.unshift(art);
                const limit = targetSection.type === 'category-row' ? 3 : 4;
                if (targetSection.articles.length > limit) {
                    targetSection.articles.pop();
                }
            }
        }

        setSections(newSections);
        dragItem.current = null;
    };

    // Updated Article Card to include School info
    const ArticleCard = ({ article, sectionId, index, compact = false, large = false }: { article: Article, sectionId: string, index?: number, compact?: boolean, large?: boolean }) => (
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

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-gray-800 flex">
            {/* Sidebar */}
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
                    {/* Feature 2: Sort row */}
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
                    {(() => {
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

                        // Reusable article card renderer for sidebar
                        const renderSidebarCard = (a: Article) => (
                            <div key={a.id} draggable onDragStart={e => handleDragStart(e, 'sidebar', a.id)} className="relative p-3 border border-slate-700 rounded-xl bg-slate-800 hover:shadow-lg cursor-grab active:cursor-grabbing flex gap-3 group transition-all hover:border-blue-500 overflow-hidden">
                                {/* Feature 4: Bulk select checkbox */}
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
                    })()}
                </div>
                {/* Feature 4: Bulk action bar */}
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

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 p-8 ${menuOpen ? 'ml-80' : ''}`}>
                <div className="flex justify-between items-center mb-10 sticky top-4 z-30 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu /></button>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block mr-2" />Genç Hayat CMS</h1>
                    </div>
                    <div className="flex gap-2 items-center">
                        {/* Group 1: Undo/Redo/Settings */}
                        <button
                            onClick={undoSections}
                            disabled={historySize === 0}
                            title="Geri Al (Ctrl+Z)"
                            className={`p-2 rounded-lg transition ${historySize === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <RotateCcw size={16} />
                        </button>
                        <button
                            onClick={redoSections}
                            disabled={futureSize === 0}
                            title="İleri Al (Ctrl+Shift+Z)"
                            className={`p-2 rounded-lg transition ${futureSize === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <RotateCw size={16} />
                        </button>
                        <button onClick={() => setSettingsOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Settings /></button>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        {/* Group 2: Templates */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTemplates(!showTemplates)}
                                className="px-4 py-2 bg-white border rounded-lg font-bold text-gray-600 hover:bg-gray-50 shadow-sm flex items-center gap-1"
                                title="Şablonlar"
                            >
                                <Layout size={16} /> Şablonlar
                            </button>
                            {showTemplates && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-xl shadow-xl z-50 p-3 space-y-2">
                                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Kaydedilmiş Şablonlar</div>
                                    {templates.length === 0 && <div className="text-sm text-gray-400 py-2 text-center">Henüz şablon yok</div>}
                                    {templates.map((t, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                                            <span className="flex-1 text-sm truncate">{t.name}</span>
                                            <button onClick={() => loadTemplate(t)} className="text-xs text-blue-600 font-medium hover:underline">Yükle</button>
                                            <button onClick={() => deleteTemplate(i)} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                                        </div>
                                    ))}
                                    <div className="border-t pt-2">
                                        <button onClick={saveTemplate} className="w-full text-sm text-green-600 font-bold hover:underline flex items-center gap-1 justify-center">
                                            <Plus size={14} /> Mevcut Düzeni Şablon Olarak Kaydet
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        {/* Group 3: Sayılar, + Makale Ekle, Dashboard */}
                        <button onClick={() => setView('issues')} className={`px-4 py-2 rounded-lg font-bold shadow-sm transition ${view === 'issues' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}><BookOpen size={16} className="inline mr-1" />Sayılar</button>
                        <button onClick={() => { setSelectedArticle(null); setView('log') }} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold shadow-sm hover:bg-orange-600">+ Makale Ekle</button>
                        <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-lg font-bold shadow-sm transition ${view === 'dashboard' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><List size={16} className="inline mr-1" />Dashboard</button>
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        {/* Group 4: Düzeni Kaydet */}
                        <button
                            onClick={() => {
                                setIsSaving(true);
                                fetch(`${API_URL}/layout/save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sections) })
                                    .then(() => { showToast('Düzen kaydedildi!'); setIsSaving(false); })
                                    .catch(() => { showToast('Kaydetme başarısız!', 'error'); setIsSaving(false); });
                            }}
                            disabled={isSaving}
                            className={`px-6 py-2 rounded-lg font-bold shadow-lg transition ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'} text-white`}
                        >
                            {isSaving ? 'Kaydediliyor...' : 'Düzeni Kaydet'}
                        </button>
                    </div>
                </div>

                <div className="space-y-16 max-w-7xl mx-auto pb-20">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-32 text-gray-400">
                            <div className="text-center space-y-3">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                <div className="text-sm font-medium">Yükleniyor...</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Feature 1: Dashboard Statistics Cards */}
                            {view === 'dashboard' && (
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
                            )}
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
                                        <button onClick={() => { recordHistory(sections); const ns = [...sections]; const s = ns.find(x => x.id === section.id)!; s.isVisible = !(s.isVisible ?? true); setSections(ns) }} className={`p-1.5 rounded-md transition-all ${(section.isVisible ?? true) ? 'hover:text-gray-600 hover:bg-gray-50' : 'text-red-500 bg-red-50'}`} title={(section.isVisible ?? true) ? 'Gizle' : 'Göster'}>{(section.isVisible ?? true) ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                                        <button onClick={() => { recordHistory(sections); const ns = [...sections]; ns.find(x => x.id === section.id)!.isPinned = !ns.find(x => x.id === section.id)!.isPinned; setSections(ns) }} className="p-1.5 rounded-md transition-all hover:text-blue-600 hover:bg-blue-50 hover:shadow-[0_0_8px_rgba(59,130,246,0.4)]"><Pin size={16} /></button>
                                        <button onClick={() => { recordHistory(sections); const ns = [...sections]; if (idx > 0) { [ns[idx], ns[idx - 1]] = [ns[idx - 1], ns[idx]]; setSections(ns); } }} className="p-1.5 rounded-md transition-all hover:text-green-600 hover:bg-green-50 hover:shadow-[0_0_8px_rgba(34,197,94,0.4)]"><ChevronUp size={16} /></button>
                                        <button onClick={() => { recordHistory(sections); const ns = [...sections]; if (idx < ns.length - 1) { [ns[idx], ns[idx + 1]] = [ns[idx + 1], ns[idx]]; setSections(ns); } }} className="p-1.5 rounded-md transition-all hover:text-green-600 hover:bg-green-50 hover:shadow-[0_0_8px_rgba(34,197,94,0.4)]"><ChevronDown size={16} /></button>
                                        <button onClick={() => { recordHistory(sections); setSections(sections.filter(s => s.id !== section.id)) }} className="p-1.5 rounded-md transition-all hover:text-red-600 hover:bg-red-50 hover:shadow-[0_0_8px_rgba(239,68,68,0.4)]"><Trash2 size={16} /></button>
                                    </div>

                                    {(section.type === 'article-feed') && (
                                        <>
                                            <div className="grid grid-cols-4 gap-6 min-h-[10rem]">
                                                {section.articles.length === 0 && <div className="col-span-4 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300">Makaleleri Buraya Sürükle</div>}
                                                {(() => {
                                                    const state = pagination[section.id] || { page: 1, expanded: false };
                                                    const start = state.expanded ? (state.page - 1) * 8 : 0;
                                                    const end = state.expanded ? start + 8 : 4;
                                                    const displayArticles = section.articles.slice(start, end);
                                                    return displayArticles.map((art, i) => <div key={art.id} className="h-60"><ArticleCard article={art} sectionId={section.id} index={start + i} /></div>);
                                                })()}
                                            </div>
                                            {renderPagination(section.id, section.articles.length, 8)}
                                        </>
                                    )}

                                    {section.type === 'category-row' && (
                                        <>
                                            <div className="mb-6 flex items-center justify-center gap-2">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={section.title || ''}
                                                        onChange={(e) => { const ns = [...sections]; const s = ns.find(x => x.id === section.id); if (s) s.title = e.target.value; setSections(ns); }}
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
                                                        <div key={art.id} className="h-60"><ArticleCard article={art} sectionId={section.id} index={i} /></div>
                                                    ))}
                                                    {section.articles.length === 0 && <div className="col-span-3 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300">Buraya Sürükle (Maks 3)</div>}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {section.type === 'ordinary-row' && (
                                        <div className="grid grid-cols-4 gap-6 min-h-[10rem]">
                                            {section.articles.slice(0, 4).map((art, i) => (
                                                <div key={art.id} className="h-60"><ArticleCard article={art} sectionId={section.id} index={i} /></div>
                                            ))}
                                            {section.articles.length === 0 && <div className="col-span-4 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300">Buraya Sürükle (Maks 4)</div>}
                                        </div>
                                    )}

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
                                                            <button onClick={() => { recordHistory(sections); const ns = [...sections]; ns.find(s => s.id === section.id)!.articles = []; setSections(ns) }} className="p-2 bg-red-600 hover:bg-red-500 rounded text-white"><Trash2 size={16} /></button>
                                                            <div className={`p-1 text-[10px] font-bold text-center rounded ${section.articles[0].status === 'edited' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                                {section.articles[0].status === 'edited' ? 'D' : 'D-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : <div className="text-gray-500">Spot Haberini Buraya Sürükle</div>}
                                        </div>
                                    )}

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
                                                <button onClick={() => addConfigItem(section.id, 'videos', { id: `v-${Date.now()}`, url: '', title: '', thumbnail: '', duration: '', date: '' })} className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1">
                                                    <Plus size={14} /> Video Ekle
                                                </button>
                                            </div>
                                        </div>
                                    )}

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
                                                <button onClick={() => addConfigItem(section.id, 'playlists', { id: `p-${Date.now()}`, url: '', title: '', description: '', cover: '', trackCount: '' })} className="text-sm text-green-600 font-medium hover:underline flex items-center gap-1">
                                                    <Plus size={14} /> Playlist Ekle
                                                </button>
                                            </div>
                                        </div>
                                    )}

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
                                                <button onClick={() => addConfigItem(section.id, 'films', { id: `f-${Date.now()}`, url: '', title: '', year: '', director: '', rating: 0, posterUrl: '' })} className="text-sm text-emerald-700 font-medium hover:underline flex items-center gap-1">
                                                    <Plus size={14} /> Film Ekle
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {section.type === 'archive-row' && (
                                        <div className="flex items-center justify-center h-20 text-gray-300 text-sm font-medium border-2 border-dashed border-gray-200 rounded-xl">
                                            Sayı Arşivi — Sayılar sekmesinden yönetilir
                                        </div>
                                    )}

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
                                                        <button onClick={() => { const ns = [...sections]; ns.find(x => x.id === section.id)!.routeArticle = undefined; setSections(ns) }} className="absolute top-4 right-4 text-blue-300 hover:text-blue-600"><X /></button>
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
                                <button onClick={() => setSections([...sections, { id: `s-${Date.now()}`, type: 'ordinary-row', isPinned: false, articles: [] }])} className="px-4 py-2 bg-white border rounded hover:text-blue-600 shadow-sm">+ Sıradan Satır</button>
                                <button onClick={() => setSections([...sections, { id: `s-${Date.now()}`, type: 'category-row', isPinned: false, articles: [] }])} className="px-4 py-2 bg-white border rounded hover:text-blue-600 shadow-sm">+ Kategori Satırı</button>
                                <button onClick={() => setSections([...sections, { id: `s-${Date.now()}`, type: 'spot-row', isPinned: false, articles: [] }])} className="px-4 py-2 bg-white border rounded hover:text-blue-600 shadow-sm">+ Spot Satırı</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            {view === 'log' && <LogArticle isEdit={!!selectedArticle} initialData={selectedArticle} onClose={() => { setView('dashboard'); setSelectedArticle(null) }} onSuccess={(art: Article) => {
    setLoggedArticles(prev => selectedArticle ? prev.map(a => a.id === art.id ? art : a) : [art, ...prev]);
    setView('dashboard');
    setSelectedArticle(null);
}} categories={categories} labels={labels} />}
            {view === 'read' && selectedArticle && (
                <ReadArticle
                    article={selectedArticle}
                    onClose={() => setView('dashboard')}
                    onEdit={() => { setView('log'); }}
                />
            )}

            {/* Feature 3: Article Quick Preview Modal */}
            {previewArticle && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewArticle(null)}
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Cover image */}
                        <div className="relative h-52 shrink-0 bg-gray-200">
                            <img src={previewArticle.imageUrl} alt="" className="w-full h-full object-cover" />
                            <button
                                onClick={() => setPreviewArticle(null)}
                                className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        {/* Content */}
                        <div className="p-5 overflow-y-auto flex-1">
                            {/* Category + status pills */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: getCategoryColor(previewArticle.category) }}>
                                    {previewArticle.category}
                                </span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${previewArticle.status === 'edited' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    {previewArticle.status === 'edited' ? 'Düzenlenmiş' : 'Düzenlenmemiş'}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Sayı #{previewArticle.issueNumber}</span>
                            </div>
                            <h2 className="text-xl font-black text-gray-900 leading-tight mb-1">{previewArticle.title}</h2>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                                <span className="font-semibold text-gray-700">{previewArticle.author}</span>
                                {previewArticle.school && <span className="text-blue-600 font-semibold">{previewArticle.school}</span>}
                                {previewArticle.place && <span className="flex items-center gap-0.5"><MapPin size={11} />{previewArticle.place}</span>}
                            </div>
                            {previewArticle.subheading && (
                                <p className="text-sm italic text-gray-600 mb-3 border-l-2 border-gray-200 pl-3">{previewArticle.subheading}</p>
                            )}
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">
                                {previewArticle.content
                                    ? previewArticle.content.filter(b => b.type === 'paragraph').slice(0, 2).map(b => b.value).join(' ').slice(0, 300)
                                    : (previewArticle.text || '').replace(/<[^>]+>/g, '').slice(0, 300)
                                }{((previewArticle.content ? previewArticle.content.filter(b => b.type === 'paragraph').slice(0, 2).map(b => b.value).join(' ').length : (previewArticle.text || '').replace(/<[^>]+>/g, '').length) > 300) ? '…' : ''}
                            </p>
                        </div>
                        {/* Actions */}
                        <div className="px-5 py-3 border-t flex gap-2 justify-end shrink-0 bg-gray-50">
                            <button
                                onClick={() => setPreviewArticle(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-50"
                            >
                                Kapat
                            </button>
                            <button
                                onClick={() => { startEditArticle(previewArticle); setPreviewArticle(null); }}
                                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                            >
                                <Edit3 size={14} /> Düzenle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Issues (Sayılar) Manager */}
            {view === 'issues' && (
                <div className="max-w-4xl mx-auto pb-20 px-2 mt-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><BookOpen className="text-purple-600" />Sayı Yönetimi</h2>
                        <button onClick={() => { setSelectedIssue(null); setIssueFormOpen(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2">
                            <Plus size={16} /> Yeni Sayı
                        </button>
                    </div>

                    {/* Issue Form Modal */}
                    {issueFormOpen && (
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                                <div className="p-5 border-b flex justify-between items-center bg-purple-50">
                                    <h3 className="text-xl font-bold text-purple-800">{selectedIssue ? 'Sayıyı Düzenle' : 'Yeni Sayı Oluştur'}</h3>
                                    <button onClick={() => setIssueFormOpen(false)}><X /></button>
                                </div>
                                <IssueForm
                                    initial={selectedIssue}
                                    articles={loggedArticles}
                                    onClose={() => setIssueFormOpen(false)}
                                    onSuccess={(iss) => {
                                        if (selectedIssue) {
                                            setIssues(prev => prev.map(i => i.id === iss.id ? iss : i));
                                        } else {
                                            setIssues(prev => [iss, ...prev]);
                                        }
                                        setIssueFormOpen(false);
                                        setSelectedIssue(null);
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Issue List */}
                    <div className="space-y-3">
                        {issues.length === 0 && <div className="text-center text-gray-400 py-16">Henüz sayı yok. Yeni sayı ekleyin.</div>}
                        {[...issues].sort((a, b) => b.number - a.number).map(iss => (
                            <div key={iss.id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex">
                                {/* Cover thumbnail */}
                                <div className="w-20 shrink-0 bg-gray-100 relative">
                                    {iss.coverMedia?.src ? (
                                        <img src={iss.coverMedia.src} alt={iss.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <BookOpen size={24} />
                                        </div>
                                    )}
                                    <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                        #{iss.number}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 truncate">{iss.title}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{new Date(iss.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className="flex gap-1.5 shrink-0">
                                            <button onClick={() => { setSelectedIssue(iss); setIssueFormOpen(true); }} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit3 size={14} /></button>
                                            <button onClick={() => {
                                                if (!confirm(`"${iss.title}" sayısını silmek istediğinize emin misiniz?`)) return;
                                                fetch(`${API_URL}/issues/${iss.id}`, { method: 'DELETE' })
                                                    .then(() => setIssues(prev => prev.filter(i => i.id !== iss.id)));
                                            }} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {iss.sunuArticle?.title ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium max-w-50">
                                                <Star size={10} className="shrink-0" />
                                                <span className="truncate">{iss.sunuArticle.title}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">
                                                <Star size={10} /> Sunu yok
                                            </span>
                                        )}
                                        {iss.rotaArticle?.title ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium max-w-50">
                                                <ArrowRight size={10} className="shrink-0" />
                                                <span className="truncate">{iss.rotaArticle.title}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">
                                                <ArrowRight size={10} /> Rota yok
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full">
                                            {(iss.recomendedCards?.length ?? iss.recommendedArticleIds.length) + (iss.otherArticles?.length ?? iss.otherArticleIds.length)} makale
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 ${t.type === 'success' ? 'bg-gray-900' : 'bg-red-600'}`}>
                        <span>{t.type === 'success' ? '✓' : '✗'}</span>
                        {t.message}
                    </div>
                ))}
            </div>

            {settingsOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">Ayarlar</h2>
                            <button onClick={() => setSettingsOpen(false)}><X /></button>
                        </div>
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto p-1">
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Layout size={16} /> Kategoriler</h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="flex gap-2 items-center text-sm bg-gray-50 p-2 rounded">
                                            <div className="w-4 h-4 rounded border" style={{ backgroundColor: cat.color }}></div>
                                            <span className="font-medium">{cat.name}</span>
                                            <button onClick={() => deleteCategory(cat.id)} className="ml-auto text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    <button onClick={addCategory} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">+ Kategori Ekle</button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Type size={16} /> Etiketler</h3>
                                <div className="flex flex-wrap gap-2">
                                    {labels.map(l => (
                                        <span key={l} className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                                            {l}
                                            <button onClick={() => deleteLabel(l)} className="hover:text-red-500"><X size={10} /></button>
                                        </span>
                                    ))}
                                    <button onClick={addLabel} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-100 font-medium">+ Ekle</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
