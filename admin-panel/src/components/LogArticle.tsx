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

const LogArticle = ({
    isEdit,
    initialData,
    categories,
    labels,
    editors,
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
        editorName: editors[0] || 'Admin'
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
                        submitAction={submitAction} categories={categories} labels={labels} editors={editors}
                        layout="wide"
                    />
                </div>
            </div>
        );
    }

    // Normal: compact card matching ReadArticle style
    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header with cover image area and window controls */}
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

                {/* Scrollable form */}
                <div className="overflow-y-auto flex-1 p-5">
                    <FormBody
                        isEdit={isEdit} formData={formData} setFormData={setFormDataDirty}
                        editorHtml={editorHtml} setEditorHtml={setEditorHtmlDirty}
                        slugTouched={slugTouched} toggleLabel={toggleLabel}
                        handleImageUpload={handleImageUpload} handleSubmit={handleSubmit}
                        submitAction={submitAction} categories={categories} labels={labels} editors={editors}
                        layout="compact"
                    />
                </div>

                {/* Bottom actions */}
                <div className="px-5 py-3 border-t flex gap-2 justify-end shrink-0 bg-gray-50">
                    <button
                        type="submit"
                        form="log-article-form"
                        onClick={() => { submitAction.current = 'close'; }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-50"
                    >
                        Kaydet ve Kapat
                    </button>
                    <button
                        type="submit"
                        form="log-article-form"
                        onClick={() => { submitAction.current = 'view'; }}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    >
                        Kaydet ve Görüntüle
                    </button>
                </div>
            </div>
        </div>
    );
};

function FormBody({
    isEdit, formData, setFormData, editorHtml, setEditorHtml,
    slugTouched, toggleLabel, handleImageUpload, handleSubmit,
    submitAction, categories, labels, editors, layout
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
}) {
    if (layout === 'wide') {
        return (
            <form id="log-article-form" onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
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
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Makale İçeriği</label>
                        <RichTextEditor value={editorHtml} onChange={setEditorHtml} />
                    </div>
                </div>
                <div className="col-span-4 space-y-6">
                    <SidePanel formData={formData} setFormData={setFormData} editors={editors} categories={categories} labels={labels} toggleLabel={toggleLabel} handleImageUpload={handleImageUpload} />
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
            </form>
        );
    }

    // Compact layout
    return (
        <form id="log-article-form" onSubmit={handleSubmit} className="space-y-4">
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
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İçerik</label>
                <RichTextEditor value={editorHtml} onChange={setEditorHtml} />
            </div>
            <SidePanel formData={formData} setFormData={setFormData} editors={editors} categories={categories} labels={labels} toggleLabel={toggleLabel} handleImageUpload={handleImageUpload} compact />
        </form>
    );
}

function SidePanel({ formData, setFormData, editors, categories, labels, toggleLabel, handleImageUpload, compact }: {
    formData: Partial<Article>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Article>>>;
    editors: string[];
    categories: Category[];
    labels: string[];
    toggleLabel: (lbl: string) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    compact?: boolean;
}) {
    const fieldClass = `w-full p-2 border rounded ${compact ? 'text-sm' : ''}`;
    const labelClass = `block text-xs font-bold text-gray-500 uppercase mb-1`;
    const groupClass = compact ? '' : 'space-y-1';

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
            <div className={groupClass}><label className={labelClass}>Sayı</label><input value={formData.issueNumber || ''} onChange={e => setFormData({ ...formData, issueNumber: e.target.value })} className={fieldClass} /></div>
            <div className={groupClass}><label className={labelClass}>Yer / Konum</label><input value={formData.place || ''} onChange={e => setFormData({ ...formData, place: e.target.value })} className={fieldClass} /></div>
            <div className={groupClass}><label className={labelClass}>Okul / Mahalle</label><input value={formData.school || ''} onChange={e => setFormData({ ...formData, school: e.target.value })} className={fieldClass} /></div>
            <div className={groupClass}>
                <label className={labelClass}>Kapak Görseli</label>
                <input value={formData.imageUrl || ''} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className={`${fieldClass} text-sm`} placeholder="https://..." />
                <label className="mt-1 flex items-center gap-1 text-xs text-blue-600 cursor-pointer hover:underline">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <ImageIcon size={11} /> Dosya yükle
                </label>
            </div>
            <div className={groupClass}>
                <label className={labelClass}>Kategori</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={`${fieldClass} bg-white`}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>
            <div className={groupClass}>
                <label className={labelClass}>Etiketler</label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto content-start p-2 border rounded bg-white">
                    {labels.map(lbl => (
                        <button key={lbl} type="button" onClick={() => toggleLabel(lbl)}
                            className={`text-xs px-2 py-0.5 rounded-full border ${formData.labels?.includes(lbl) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600'}`}>
                            {lbl}
                        </button>
                    ))}
                </div>
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
