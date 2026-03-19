import { useState, useRef, useEffect, useCallback } from 'react';
import { API_URL } from '../config';
import type { Article, Category, Section, Issue } from '../types';

export function useAdminData() {
    const [view, setView] = useState<'dashboard' | 'log' | 'read' | 'issues' | 'stats'>('dashboard');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Data
    const [sections, setSections] = useState<Section[]>([]);
    const [loggedArticles, setLoggedArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [editors, setEditors] = useState<string[]>([]);
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

    // Templates — now include articles for non-feed sections
    const [templates, setTemplates] = useState<{ name: string; sections: Section[] }[]>(() => {
        try { return JSON.parse(localStorage.getItem('cms-templates') || '[]'); } catch { return []; }
    });
    const [showTemplates, setShowTemplates] = useState(false);

    // Sidebar sort
    const [sidebarSort, setSidebarSort] = useState<'issue' | 'date-desc' | 'date-asc' | 'category' | 'author'>('issue');

    // Quick preview popup
    const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

    // Bulk selection
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
    // Saves all section content except article-feed articles
    const saveTemplate = () => {
        const name = prompt('Şablon adı:');
        if (!name) return;
        const templateSections = sections.map(s => ({
            ...s,
            articles: s.type === 'article-feed' ? [] : s.articles,
        }));
        const newTemplates = [...templates, { name, sections: templateSections }];
        setTemplates(newTemplates);
        localStorage.setItem('cms-templates', JSON.stringify(newTemplates));
        showToast(`"${name}" şablonu kaydedildi`);
    };

    const loadTemplate = (template: { name: string; sections: Section[] }) => {
        if (!confirm(`"${template.name}" şablonu yüklensin mi? Mevcut düzen değişecek.`)) return;
        recordHistory(sections);
        setSections(template.sections as Section[]);
        setShowTemplates(false);
        showToast(`"${template.name}" şablonu yüklendi`);
    };

    const deleteTemplate = (idx: number) => {
        const newTemplates = templates.filter((_, i) => i !== idx);
        setTemplates(newTemplates);
        localStorage.setItem('cms-templates', JSON.stringify(newTemplates));
    };

    // --- Data fetching ---
    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/init`).then(r => r.json()),
            fetch(`${API_URL}/issues`).then(r => r.json()),
            fetch(`${API_URL}/editors`).then(r => r.json()).catch(() => []),
        ]).then(([d, issData, editorsData]) => {
            setSections(d.sections);
            setLoggedArticles(d.articles);
            setCategories(d.categories);
            setLabels(d.labels);
            if (Array.isArray(issData)) setIssues(issData);
            if (Array.isArray(editorsData)) setEditors(editorsData);
            else if (d.editors && Array.isArray(d.editors)) setEditors(d.editors);
            setIsLoading(false);
        });
    }, []);

    // --- Keyboard shortcuts ---
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

    // --- Utility ---
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

    const addEditor = () => {
        const name = prompt("Editör Adı:");
        if (!name) return;
        fetch(`${API_URL}/editors`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name })
        }).then(r => r.json()).then(d => d.success && !editors.includes(name) && setEditors([...editors, name]));
    };

    const deleteEditor = (name: string) => {
        if (!confirm("Editörü silmek istediğinize emin misiniz?")) return;
        fetch(`${API_URL}/editors/${encodeURIComponent(name)}`, { method: 'DELETE' })
            .then(() => setEditors(editors.filter(e => e !== name)));
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

    const saveLayout = () => {
        setIsSaving(true);
        fetch(`${API_URL}/layout/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sections)
        })
            .then(() => { showToast('Düzen kaydedildi!'); setIsSaving(false); })
            .catch(() => { showToast('Kaydetme başarısız!', 'error'); setIsSaving(false); });
    };

    const handleDragStart = (e: React.DragEvent, type: string, id: string, fromSec?: string) => {
        dragItem.current = { type, id, fromSec };
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'copyMove';
    };

    const handleDrop = (e: React.DragEvent, targetSecId: string, targetIndex?: number, mode?: 'replace') => {
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
        let sourceIdx = -1;

        if (dragged.type === 'sidebar') {
            const found = loggedArticles.find(a => a.id === dragged.id);
            if (found) art = { ...found };
        } else if (sourceSecIdx !== -1) {
            const sourceSection = newSections[sourceSecIdx];
            sourceIdx = sourceSection.articles.findIndex(a => a.id === dragged.id);
            if (sourceIdx !== -1) {
                [art] = sourceSection.articles.splice(sourceIdx, 1);
            }
        }

        if (!art) return;

        if (targetSection.type === 'main-row') {
            targetSection.routeArticle = art;
            setSections(newSections);
            dragItem.current = null;
            return;
        }

        // Replace mode: replace from sidebar, swap when from a section
        if (mode === 'replace' && targetIndex !== undefined) {
            if (targetIndex < targetSection.articles.length) {
                const displaced = targetSection.articles[targetIndex];
                targetSection.articles[targetIndex] = art;
                if (dragged.type !== 'sidebar' && sourceSecIdx !== -1 && sourceIdx !== -1) {
                    newSections[sourceSecIdx].articles.splice(sourceIdx, 0, displaced);
                }
            } else {
                targetSection.articles.push(art);
            }
            setSections(newSections);
            dragItem.current = null;
            return;
        }

        const maxArticles = targetSection.type === 'category-row' ? 3 : targetSection.type === 'ordinary-row' ? 4 : null;

        if (targetSection.type === 'article-feed') {
            if (targetIndex !== undefined && targetIndex < targetSection.articles.length) {
                targetSection.articles.splice(targetIndex, 0, art);
            } else {
                targetSection.articles.unshift(art);
            }
        } else {
            const atMax = maxArticles !== null && targetSection.articles.length >= maxArticles;
            if (targetIndex !== undefined && targetIndex < targetSection.articles.length) {
                if (atMax) {
                    targetSection.articles[targetIndex] = art;
                } else {
                    targetSection.articles.splice(targetIndex, 0, art);
                }
            } else {
                if (atMax) {
                    showToast(`Bu bölüme maksimum ${maxArticles} makale eklenebilir`, 'error');
                    dragItem.current = null;
                    return;
                }
                targetSection.articles.unshift(art);
            }
        }

        setSections(newSections);
        dragItem.current = null;
    };

    return {
        // View
        view, setView,
        selectedArticle, setSelectedArticle,
        settingsOpen, setSettingsOpen,
        // Data
        sections, setSections,
        loggedArticles, setLoggedArticles,
        categories, setCategories,
        labels, setLabels,
        editors,
        issues, setIssues,
        selectedIssue, setSelectedIssue,
        issueFormOpen, setIssueFormOpen,
        // Loading
        isLoading,
        isSaving,
        // UI
        pagination, setPagination,
        dragItem,
        menuOpen, setMenuOpen,
        sidebarSearch, setSidebarSearch,
        toasts,
        // Undo/Redo
        historySize,
        futureSize,
        // Templates
        templates,
        showTemplates, setShowTemplates,
        // Sidebar sort
        sidebarSort, setSidebarSort,
        // Preview
        previewArticle, setPreviewArticle,
        // Bulk
        bulkSelected, setBulkSelected,
        bulkDropdownOpen, setBulkDropdownOpen,
        // Functions
        showToast,
        recordHistory,
        undoSections,
        redoSections,
        saveTemplate,
        loadTemplate,
        deleteTemplate,
        getCategoryColor,
        formatLogDate,
        addCategory,
        deleteCategory,
        addLabel,
        deleteLabel,
        addEditor,
        deleteEditor,
        deleteArticleFromSection,
        deleteArticle,
        updateSectionConfig,
        addConfigItem,
        removeConfigItem,
        updateConfigItem,
        startEditArticle,
        saveLayout,
        handleDragStart,
        handleDrop,
    };
}
