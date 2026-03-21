import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Edit3, CheckSquare, Square, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';
import type { Article, Category } from '../types';
import { API_URL } from '../config';
import RichTextEditor, { blocksToHtml, htmlToBlocks } from './RichTextEditor';

const generateSlug = (title: string) =>
    title.toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-');

type WindowState = 'normal' | 'maximized';

const TR_CITIES = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
    'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
    'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
    'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
    'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
    'İçel (Mersin)', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu',
    'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya',
    'Malatya', 'Manisa', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
    'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak',
    'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
];

const LogArticle = ({
    isEdit,
    initialData,
    categories,
    labels,
    editors,
    allArticles,
    onClose,
    onSuccess,
    onSaveAndView,
    onMinimize,
    externalMinimized,
    onDirtyChange,
    saveTrigger,
}: {
    isEdit: boolean;
    initialData: Article | null;
    categories: Category[];
    labels: string[];
    editors: string[];
    allArticles?: Article[];
    onClose: () => void;
    onSuccess: (article: Article) => void;
    onSaveAndView?: (article: Article) => void;
    onMinimize: () => void;
    externalMinimized: boolean;
    onDirtyChange: (dirty: boolean) => void;
    saveTrigger?: number;
}) => {
    const slugTouched = useRef(false);
    const submitAction = useRef<'close' | 'view'>('close');
    const hasEdited = useRef(false);

    const [windowState, setWindowState] = useState<WindowState>('normal');

    const [formData, setFormData] = useState<Partial<Article>>(initialData ? { ...initialData } : {
        labels: [],
        status: 'not-edited',
        editorName: editors[0] || 'Admin',
        issueNumber: allArticles?.length ? allArticles[0].issueNumber : undefined,
    });

    const [editorHtml, setEditorHtml] = useState<string>(() => {
        if (!initialData) return '';
        if (initialData.content && Array.isArray(initialData.content) && initialData.content.length > 0) {
            return blocksToHtml(initialData.content as any[]);
        }
        return initialData.text || '';
    });

    const markDirty = () => {
        if (!hasEdited.current) { hasEdited.current = true; onDirtyChange(true); }
    };

    const toggleLabel = (lbl: string) => {
        markDirty();
        setFormData(prev => {
            const current = prev.labels || [];
            if (current.includes(lbl)) return { ...prev, labels: current.filter(l => l !== lbl) };
            return { ...prev, labels: [...current, lbl] };
        });
    };

    const setFormDataDirty: typeof setFormData = (value) => {
        markDirty();
        setFormData(value);
    };

    const setEditorHtmlDirty: typeof setEditorHtml = (value) => {
        markDirty();
        setEditorHtml(value);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        fetch(`${API_URL}/upload`, { method: 'POST', body: formDataUpload })
            .then(r => r.json())
            .then(d => { if (d.url) setFormData(p => ({ ...p, imageUrl: d.url })); })
            .catch(() => alert('Yükleme başarısız'));
    };

    const saveArticle = () => {
        if (!formData.title || !formData.author) { alert("Başlık ve Yazar gereklidir!"); return; }
        const content = htmlToBlocks(editorHtml);
        const articleData = { ...formData, content, text: null, id: isEdit && initialData ? initialData.id : undefined };
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `${API_URL}/articles/${initialData?.id}` : `${API_URL}/articles`;
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
        })
            .then(res => res.json())
            .then(savedArt => {
                if (submitAction.current === 'view' && onSaveAndView) {
                    onSaveAndView(savedArt);
                } else {
                    onSuccess(savedArt);
                }
            });
    };

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); saveArticle(); };

    useEffect(() => {
        if (saveTrigger && saveTrigger > 0) { submitAction.current = 'close'; saveArticle(); }
    }, [saveTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

    if (externalMinimized) return null;

    const isMaximized = windowState === 'maximized';

    // Maximized: full screen form
    if (isMaximized) {
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-2.5 border-b bg-white shrink-0">
                    <span className="text-sm font-medium text-gray-400 flex items-center gap-2 truncate pr-4">
                        {isEdit ? <Edit3 size={13} className="text-blue-400 shrink-0" /> : <Plus size={13} className="text-orange-400 shrink-0" />}
                        {isEdit ? 'Makaleyi Düzenle' : 'Yeni Makale Ekle'}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={() => setWindowState('normal')} title="Küçült"
                            className="w-5 h-5 rounded-full bg-green-400 hover:bg-green-500 transition-colors flex items-center justify-center group">
                            <Maximize2 size={9} className="opacity-0 group-hover:opacity-100 text-green-900" />
                        </button>
                        <button type="button" onClick={() => onMinimize()} title="Alta Al"
                            className="w-5 h-5 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors flex items-center justify-center group">
                            <Minimize2 size={9} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
                        </button>
                        <button type="button" onClick={onClose} title="Kapat"
                            className="w-5 h-5 rounded-full bg-red-400 hover:bg-red-500 transition-colors flex items-center justify-center group">
                            <X size={9} className="opacity-0 group-hover:opacity-100 text-red-900" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto p-8 flex-1">
                    <FormBody
                        isEdit={isEdit} formData={formData} setFormData={setFormDataDirty}
                        editorHtml={editorHtml} setEditorHtml={setEditorHtmlDirty}
                        slugTouched={slugTouched} toggleLabel={toggleLabel}
                        handleImageUpload={handleImageUpload} handleSubmit={handleSubmit}
                        submitAction={submitAction} categories={categories} labels={labels} editors={editors} allArticles={allArticles} currentId={initialData?.id}
                        layout="wide"
                    />
                </div>
            </div>
        );
    }

    // Normal: compact card
    return (
        <div className="fixed inset-0 bottom-9 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div
                className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative h-20 shrink-0 bg-linear-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center h-full px-5 gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shrink-0">
                            {isEdit
                                ? <Edit3 size={14} className="text-blue-500" />
                                : <Plus size={14} className="text-orange-500" />
                            }
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-medium">{isEdit ? 'Makaleyi Düzenle' : 'Yeni Makale Ekle'}</div>
                            <div className="text-sm font-bold text-gray-700 truncate max-w-xs">
                                {formData.title || <span className="text-gray-400 font-normal italic">Başlıksız makale</span>}
                            </div>
                        </div>
                    </div>
                    {/* Window controls */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button type="button" onClick={(e) => { e.stopPropagation(); setWindowState('maximized'); }} title="Tam Ekran"
                            className="w-5 h-5 rounded-full bg-green-400 hover:bg-green-500 transition-colors flex items-center justify-center group shadow">
                            <Maximize2 size={9} className="opacity-0 group-hover:opacity-100 text-green-900" />
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onMinimize(); }} title="Alta Al"
                            className="w-5 h-5 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors flex items-center justify-center group shadow">
                            <Minimize2 size={9} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} title="Kapat"
                            className="w-5 h-5 rounded-full bg-red-400 hover:bg-red-500 transition-colors flex items-center justify-center group shadow">
                            <X size={9} className="opacity-0 group-hover:opacity-100 text-red-900" />
                        </button>
                    </div>
                </div>

                {/* Scrollable form — extra bottom padding so content isn't hidden under floating buttons */}
                <div className="overflow-y-auto flex-1 p-5 pb-16">
                    <FormBody
                        isEdit={isEdit} formData={formData} setFormData={setFormDataDirty}
                        editorHtml={editorHtml} setEditorHtml={setEditorHtmlDirty}
                        slugTouched={slugTouched} toggleLabel={toggleLabel}
                        handleImageUpload={handleImageUpload} handleSubmit={handleSubmit}
                        submitAction={submitAction} categories={categories} labels={labels} editors={editors} allArticles={allArticles} currentId={initialData?.id}
                        layout="compact"
                    />
                </div>

                {/* Floating action buttons — no background bar */}
                <div className="absolute bottom-3 right-5 flex gap-2 z-10">
                    <button
                        type="submit"
                        form="log-article-form"
                        onClick={() => { submitAction.current = 'close'; }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                    >
                        Kaydet ve Kapat
                    </button>
                    <button
                        type="submit"
                        form="log-article-form"
                        onClick={() => { submitAction.current = 'view'; }}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                        Kaydet ve Görüntüle
                    </button>
                </div>
            </div>
        </div>
    );
};

function FormBody({
    isEdit: _isEdit, formData, setFormData, editorHtml, setEditorHtml,
    slugTouched, toggleLabel, handleImageUpload, handleSubmit,
    submitAction, categories, labels, editors, layout, allArticles, currentId
}: {
    isEdit: boolean;
    formData: Partial<Article>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Article>>>;
    editorHtml: string;
    setEditorHtml: (v: string) => void;
    slugTouched: React.MutableRefObject<boolean>;
    toggleLabel: (lbl: string) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    submitAction: React.MutableRefObject<'close' | 'view'>;
    categories: Category[];
    labels: string[];
    editors: string[];
    layout: 'compact' | 'wide';
    allArticles?: Article[];
    currentId?: string;
}) {
    // Shared image section rendered in the content column
    const ImageSection = (
        <div>
            <label className={layout === 'wide' ? 'block text-sm font-bold text-gray-700 mb-1' : 'block text-xs font-bold text-gray-500 uppercase mb-1'}>Kapak Görseli</label>
            {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Kapak" className="w-full max-h-48 object-cover rounded-lg mb-2 border" />
            )}
            <input
                value={formData.imageUrl || ''}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className={`w-full border rounded ${layout === 'wide' ? 'px-4 py-2' : 'p-2 text-sm'} text-sm font-mono text-gray-600`}
                placeholder="https://..."
            />
            <label className="mt-1 flex items-center gap-1 text-xs text-blue-600 cursor-pointer hover:underline">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <ImageIcon size={11} /> Dosya yükle
            </label>
        </div>
    );

    if (layout === 'wide') {
        return (
            <form id="log-article-form" onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
                {/* Left column: Yayın Bilgileri */}
                <div className="col-span-4 space-y-6">
                    <SidePanel formData={formData} setFormData={setFormData} editors={editors} categories={categories} labels={labels} toggleLabel={toggleLabel} charCount={editorHtml.replace(/<[^>]+>/g, '').trim().length} allArticles={allArticles} currentId={currentId} />
                    <div className="flex flex-col gap-3 pt-4">
                        <button type="submit" onClick={() => { submitAction.current = 'view'; }}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">
                            Kaydet ve Görüntüle
                        </button>
                        <button type="submit" onClick={() => { submitAction.current = 'close'; }}
                            className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl shadow hover:bg-gray-900 transition">
                            Kaydet ve Kapat
                        </button>
                    </div>
                </div>
                {/* Right column: content */}
                <div className="col-span-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Başlık *</label>
                        <input
                            value={formData.title || ''}
                            onChange={e => {
                                const title = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    title,
                                    slug: slugTouched.current ? prev.slug : generateSlug(title)
                                }));
                            }}
                            className="w-full text-xl font-bold px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Makale Başlığı"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
                        <input
                            value={formData.slug || ''}
                            onChange={e => { slugTouched.current = true; setFormData(prev => ({ ...prev, slug: e.target.value })); }}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm text-gray-600"
                            placeholder="otomatik-slug-uretilir"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Alt Başlık / Sunum</label>
                        <textarea value={formData.subheading || ''} onChange={e => setFormData({ ...formData, subheading: e.target.value })} rows={2} className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-blue-500 outline-none" placeholder="Özet..." />
                    </div>
                    {ImageSection}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Makale İçeriği</label>
                        <RichTextEditor value={editorHtml} onChange={setEditorHtml} />
                    </div>
                </div>
            </form>
        );
    }

    // Compact layout — two columns
    return (
        <form id="log-article-form" onSubmit={handleSubmit} className="grid grid-cols-[260px_1fr] gap-5">
            {/* Left column: Yayın Bilgileri */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Yayın Bilgileri</h3>
                <SidePanel formData={formData} setFormData={setFormData} editors={editors} categories={categories} labels={labels} toggleLabel={toggleLabel} compact charCount={editorHtml.replace(/<[^>]+>/g, '').trim().length} allArticles={allArticles} currentId={currentId} />
            </div>
            {/* Right column: content fields */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Başlık *</label>
                    <input
                        value={formData.title || ''}
                        onChange={e => {
                            const title = e.target.value;
                            setFormData(prev => ({
                                ...prev,
                                title,
                                slug: slugTouched.current ? prev.slug : generateSlug(title)
                            }));
                        }}
                        className="w-full text-lg font-bold px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Makale Başlığı"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
                    <input
                        value={formData.slug || ''}
                        onChange={e => { slugTouched.current = true; setFormData(prev => ({ ...prev, slug: e.target.value })); }}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm text-gray-600"
                        placeholder="otomatik-slug-uretilir"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alt Başlık</label>
                    <textarea value={formData.subheading || ''} onChange={e => setFormData({ ...formData, subheading: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg resize-none outline-none text-sm" placeholder="Özet..." />
                </div>
                {ImageSection}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İçerik</label>
                    <RichTextEditor value={editorHtml} onChange={setEditorHtml} />
                </div>
            </div>
        </form>
    );
}

function SidePanel({ formData, setFormData, editors, categories, labels, toggleLabel, compact, charCount, allArticles, currentId }: {
    formData: Partial<Article>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Article>>>;
    editors: string[];
    categories: Category[];
    labels: string[];
    toggleLabel: (lbl: string) => void;
    compact?: boolean;
    charCount?: number;
    allArticles?: Article[];
    currentId?: string;
}) {
    const [recSearch, setRecSearch] = useState('');
    const isCustomCity = !!(formData.place && !TR_CITIES.includes(formData.place));
    const [showCustomCity, setShowCustomCity] = useState(isCustomCity);

    const fieldClass = `w-full p-2 border rounded ${compact ? 'text-sm' : ''}`;
    const labelClass = `block text-xs font-bold text-gray-500 uppercase mb-1`;
    const groupClass = compact ? '' : 'space-y-1';
    const recIds: string[] = formData.recommendedArticleIds ?? [];
    const recArticles = recIds.map(id => allArticles?.find(a => a.id === id)).filter(Boolean) as Article[];
    const recSearchResults = recSearch.length > 0
        ? (allArticles ?? []).filter(a => a.id !== currentId && !recIds.includes(a.id) && (a.title?.toLowerCase().includes(recSearch.toLowerCase()) || a.author?.toLowerCase().includes(recSearch.toLowerCase()))).slice(0, 6)
        : [];

    return (
        <div className={compact ? 'space-y-3' : 'bg-gray-50 p-4 rounded-xl space-y-4'}>
            {!compact && <h3 className="font-bold text-gray-700">Yayın Bilgileri</h3>}
            <div className={groupClass}><label className={labelClass}>Yazar</label><input value={formData.author || ''} onChange={e => setFormData({ ...formData, author: e.target.value })} className={fieldClass} /></div>
            <div className={groupClass}>
                <label className={labelClass}>Editör</label>
                {editors.length > 0 ? (
                    <select value={formData.editorName || ''} onChange={e => setFormData({ ...formData, editorName: e.target.value })} className={`${fieldClass} bg-white`}>
                        {editors.map(ed => <option key={ed} value={ed}>{ed}</option>)}
                    </select>
                ) : (
                    <input value={formData.editorName || ''} onChange={e => setFormData({ ...formData, editorName: e.target.value })} className={fieldClass} />
                )}
            </div>
            <div className={groupClass}>
                <label className={labelClass}>Sayı</label>
                <input
                    value={formData.issueNumber || ''}
                    onChange={e => setFormData({ ...formData, issueNumber: e.target.value.replace(/\D/g, '') })}
                    inputMode="numeric"
                    className={fieldClass}
                    placeholder="0"
                />
            </div>
            <div className={groupClass}>
                <label className={labelClass}>Şehir</label>
                <select
                    value={showCustomCity ? '__other__' : (formData.place || '')}
                    onChange={e => {
                        if (e.target.value === '__other__') {
                            setShowCustomCity(true);
                            setFormData({ ...formData, place: '' });
                        } else {
                            setShowCustomCity(false);
                            setFormData({ ...formData, place: e.target.value });
                        }
                    }}
                    className={`${fieldClass} bg-white`}
                >
                    <option value="">— Seçin —</option>
                    {TR_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    <option value="__other__">Diğer...</option>
                </select>
                {showCustomCity && (
                    <input
                        value={formData.place || ''}
                        onChange={e => setFormData({ ...formData, place: e.target.value })}
                        className={`${fieldClass} mt-1`}
                        placeholder="Şehir adı girin"
                    />
                )}
            </div>
            <div className={groupClass}><label className={labelClass}>Okul / Mahalle</label><input value={formData.school || ''} onChange={e => setFormData({ ...formData, school: e.target.value })} className={fieldClass} /></div>
            <div className={groupClass}>
                <label className={labelClass}>Kategori</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={`${fieldClass} bg-white`}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>
            <div className={groupClass}>
                <label className={labelClass}>Etiketler</label>
                <div className="flex flex-wrap gap-1.5 content-start p-2 border rounded bg-white">
                    {labels.map(lbl => (
                        <button key={lbl} type="button" onClick={() => toggleLabel(lbl)}
                            className={`text-xs px-2 py-0.5 rounded-full border ${formData.labels?.includes(lbl) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600'}`}>
                            {lbl}
                        </button>
                    ))}
                </div>
            </div>
            {allArticles && (
                <div className={groupClass}>
                    <label className={labelClass}>Önerilen Yazılar <span className="text-gray-300 font-normal normal-case">({recIds.length}/3)</span></label>
                    <div className="space-y-1 mb-1">
                        {recArticles.map(a => (
                            <div key={a.id} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded px-2 py-1">
                                <span className="flex-1 text-xs text-gray-700 truncate">{a.title}{a.author ? <span className="text-gray-400"> · {a.author}</span> : null}</span>
                                <button type="button" onClick={() => setFormData(p => ({ ...p, recommendedArticleIds: recIds.filter(id => id !== a.id) }))}
                                    className="text-gray-400 hover:text-red-500 shrink-0"><X size={11} /></button>
                            </div>
                        ))}
                    </div>
                    {recIds.length < 3 && (
                        <div className="relative">
                            <input
                                type="text"
                                value={recSearch}
                                onChange={e => setRecSearch(e.target.value)}
                                placeholder="Yazı ara ve ekle..."
                                className={`${fieldClass} text-xs`}
                            />
                            {recSearchResults.length > 0 && (
                                <div className="absolute z-20 top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto">
                                    {recSearchResults.map(a => (
                                        <button key={a.id} type="button"
                                            onClick={() => { setFormData(p => ({ ...p, recommendedArticleIds: [...(p.recommendedArticleIds ?? []), a.id] })); setRecSearch(''); }}
                                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 truncate border-b last:border-0">
                                            <span className="font-medium">{a.title}</span>
                                            <span className="text-gray-400 ml-1">· {a.author}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <div className={`${groupClass} text-xs text-gray-400`}>
                {charCount?.toLocaleString('tr')} karakter
            </div>
            <div className="flex items-center gap-2 pt-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Durum:</label>
                <button type="button" onClick={() => setFormData({ ...formData, status: formData.status === 'edited' ? 'not-edited' : 'edited' })}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold ${formData.status === 'edited' ? 'bg-green-100 text-green-700' : 'bg-red-500 text-white'}`}>
                    {formData.status === 'edited' ? <CheckSquare size={12} /> : <Square size={12} />}
                    {formData.status === 'edited' ? 'Düzenlendi' : 'Düzenlenmedi'}
                </button>
            </div>
        </div>
    );
}

export default LogArticle;
