import React, { useState, useRef, useEffect } from 'react';
import {
    Menu, X, Plus,
    Image as ImageIcon,
    ChevronDown, ChevronUp, Trash2, Edit3, Settings,
    Pin, CheckSquare, Square,
    MapPin, ArrowRight, Layout, Type,
    AlignLeft, BookOpen, Star, List, Eye, EyeOff
} from 'lucide-react';

// --- Types ---

interface Category {
    id: string;
    name: string;
    color: string;
}

interface ContentBlock {
    id: string;
    type: 'paragraph' | 'subheading' | 'image';
    value: string;
}

interface Article {
    id: string;
    title: string;
    subheading?: string;
    author: string;
    editorName: string;
    place?: string;
    school?: string;
    text?: string;
    content?: ContentBlock[];
    imageUrl: string;
    labels: string[];
    category: string;
    issueNumber: string;
    createdAt: number;
    status: 'edited' | 'not-edited';
    slug?: string;
    type?: 'featured' | 'normal' | 'sunu' | 'rota';
}

type SectionType = 'main-row' | 'category-row' | 'ordinary-row' | 'spot-row' | 'article-feed' | 'video-row' | 'spotify-row' | 'letterboxd-row' | 'archive-row';

interface Section {
    id: string;
    type: SectionType;
    title?: string;
    isPinned: boolean;
    isVisible?: boolean;
    coverImage?: string;
    preface?: string;
    routeArticle?: Article;
    issueNumber?: string;
    articles: Article[];
    config?: any;
}

interface CoverMedia {
    type: 'image' | 'video';
    src: string;
    alt?: string;
    mediaLayout?: string;
}

interface Issue {
    id: string;
    title: string;
    number: number;
    date: string;
    coverMedia?: CoverMedia;
    sunuArticleId?: string;
    rotaArticleId?: string;
    recommendedArticleIds: string[];
    otherArticleIds: string[];
    sunuArticle?: Article;
    rotaArticle?: Article;
    recomendedCards?: Article[];
    otherArticles?: Article[];
}

const API_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8080/api';

// --- Components ---

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

// --- Rich Text Editor ---
const RichTextEditor = ({ value, onChange }: { value: string; onChange: (html: string) => void }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && editorRef.current) {
            editorRef.current.innerHTML = value || '';
            initialized.current = true;
        }
    }, []);

    const exec = (cmd: string, arg?: string) => {
        document.execCommand(cmd, false, arg);
        editorRef.current?.focus();
        onChange(editorRef.current?.innerHTML || '');
    };

    const Btn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
        <button
            type="button"
            title={title}
            onMouseDown={e => { e.preventDefault(); onClick(); }}
            className="px-2 h-8 min-w-[2rem] rounded hover:bg-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center"
        >
            {children}
        </button>
    );

    return (
        <div className="border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 border-b select-none">
                <Btn onClick={() => exec('bold')} title="Kalın (Ctrl+B)"><span className="font-bold">B</span></Btn>
                <Btn onClick={() => exec('italic')} title="İtalik (Ctrl+I)"><span className="italic">İ</span></Btn>
                <Btn onClick={() => exec('underline')} title="Altı çizili (Ctrl+U)"><span className="underline">A</span></Btn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <Btn onClick={() => exec('formatBlock', 'h2')} title="Ara başlık">H2</Btn>
                <Btn onClick={() => exec('formatBlock', 'h3')} title="Küçük başlık">H3</Btn>
                <Btn onClick={() => exec('formatBlock', 'p')} title="Normal paragraf">¶</Btn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <Btn onClick={() => exec('insertUnorderedList')} title="Madde listesi">• —</Btn>
                <Btn onClick={() => exec('insertOrderedList')} title="Numaralı liste">1.</Btn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <Btn onClick={() => { const url = prompt('Resim URL\'si:'); if (url) exec('insertHTML', `<img src="${url}" style="max-width:100%;border-radius:8px;margin:12px 0;" />`); }} title="Resim ekle">
                    <ImageIcon size={14} />
                </Btn>
                <Btn onClick={() => { const url = prompt('Link URL\'si (https://...):'); if (url) exec('createLink', url); }} title="Link ekle">
                    <ArrowRight size={14} />
                </Btn>
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => onChange(editorRef.current?.innerHTML || '')}
                className="min-h-[320px] p-4 outline-none text-gray-800 text-sm leading-relaxed
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
                    [&_p]:mb-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:pl-5 [&_ol]:list-decimal [&_li]:mb-1
                    [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3
                    [&_a]:text-blue-600 [&_a]:underline"
            />
        </div>
    );
};

const LogArticle = ({
    isEdit,
    initialData,
    categories,
    labels,
    onClose,
    onSuccess
}: {
    isEdit: boolean;
    initialData: Article | null;
    categories: Category[];
    labels: string[];
    onClose: () => void;
    onSuccess: (article: Article) => void;
}) => {
    const getInitialText = () => {
        if (initialData?.text) return initialData.text;
        if (initialData?.content) {
            return initialData.content.map((b: ContentBlock) => {
                if (b.type === 'paragraph') return `<p>${b.value}</p>`;
                if (b.type === 'subheading') return `<h2>${b.value}</h2>`;
                if (b.type === 'image') return `<img src="${b.value}" style="max-width:100%;border-radius:8px;margin:12px 0;" />`;
                return '';
            }).join('');
        }
        return '';
    };

    const [formData, setFormData] = useState<Partial<Article>>(initialData ? { ...initialData, text: getInitialText() } : {
        text: '',
        labels: [],
        status: 'not-edited',
        editorName: 'Admin'
    });

    const toggleLabel = (lbl: string) => {
        setFormData(prev => {
            const current = prev.labels || [];
            if (current.includes(lbl)) return { ...prev, labels: current.filter(l => l !== lbl) };
            return { ...prev, labels: [...current, lbl] };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.author) { alert("Başlık ve Yazar gereklidir!"); return; }

        const articleData = { ...formData, id: isEdit && initialData ? initialData.id : undefined };
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `${API_URL}/articles/${initialData?.id}` : `${API_URL}/articles`;

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
        })
            .then(res => res.json())
            .then(savedArt => {
                onSuccess(savedArt);
            });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50 shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {isEdit ? <Edit3 className="text-blue-500" /> : <Plus className="text-orange-500" />}
                        {isEdit ? 'Makaleyi Düzenle' : 'Yeni Makale Ekle'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X /></button>
                </div>

                <div className="overflow-y-auto p-8">
                    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
                        <div className="col-span-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Başlık *</label>
                                <input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full text-xl font-bold px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Makale Başlığı" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Alt Başlık / Sunum</label>
                                <textarea value={formData.subheading || ''} onChange={e => setFormData({ ...formData, subheading: e.target.value })} rows={2} className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-blue-500 outline-none" placeholder="Özet..." />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Makale İçeriği</label>
                                <RichTextEditor
                                    value={formData.text || ''}
                                    onChange={text => setFormData(p => ({ ...p, text }))}
                                />
                            </div>
                        </div>
                        <div className="col-span-4 space-y-6">
                            <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                <h3 className="font-bold text-gray-700">Yayın Bilgileri</h3>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yazar</label><input value={formData.author || ''} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Editör</label><input value={formData.editorName || 'Admin'} onChange={e => setFormData({ ...formData, editorName: e.target.value })} className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sayı</label><input value={formData.issueNumber || ''} onChange={e => setFormData({ ...formData, issueNumber: e.target.value })} className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yer / Konum</label><input value={formData.place || ''} onChange={e => setFormData({ ...formData, place: e.target.value })} className="w-full p-2 border rounded" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Okul / Mahalle</label><input value={formData.school || ''} onChange={e => setFormData({ ...formData, school: e.target.value })} className="w-full p-2 border rounded" /></div>
                                <div className="flex items-center gap-2 pt-2">
                                    <label className="text-sm font-bold text-gray-700">Durum:</label>
                                    <button type="button" onClick={() => setFormData({ ...formData, status: formData.status === 'edited' ? 'not-edited' : 'edited' })} className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-bold ${formData.status === 'edited' ? 'bg-green-100 text-green-700' : 'bg-red-500 text-white'}`}>
                                        {formData.status === 'edited' ? <CheckSquare size={14} /> : <Square size={14} />} {formData.status === 'edited' ? 'Düzenlendi' : 'Düzenlenmedi'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded bg-white">
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2"><label className="block text-sm font-bold text-gray-700">Etiketler</label></div>
                                <div className="flex flex-wrap gap-2 h-40 overflow-y-auto content-start p-2 border rounded bg-gray-50">
                                    {labels.map(lbl => (
                                        <button key={lbl} type="button" onClick={() => toggleLabel(lbl)} className={`text-xs px-2 py-1 rounded-full border ${formData.labels?.includes(lbl) ? 'bg-blue-600 text-white' : 'bg-white'}`}>{lbl}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6">
                                <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">{isEdit ? 'Güncelle' : 'Kaydet'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- READ MODE MODAL ---
const ReadArticle = ({ article, onClose, onEdit }: any) => {
    if (!article) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            {/* Modified structure to keep Close button sticky/fixed relative to the modal container */}
            <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-xl shadow-2xl relative flex flex-col overflow-hidden">

                {/* Close button moved to a fixed header area within the modal */}
                <div className="absolute top-0 right-0 z-50 p-4">
                    <button onClick={onClose} className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-black shadow-sm transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    <div className="relative h-56 shrink-0">
                        <img src={article.imageUrl} className="w-full h-full object-cover" />

                        <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg">
                            {article.category}
                        </div>
                    </div>
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
                        {article.school && <div className="text-sm text-blue-600 font-semibold mb-1">{article.school}</div>}
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-6 pb-4 border-b">
                            <span>{article.author} • {article.place}</span>
                            <button onClick={onEdit} className="text-blue-600 font-bold hover:underline flex items-center gap-1"><Edit3 size={14} /> Düzenle</button>
                        </div>
                        {article.subheading && <p className="text-lg font-serif italic text-gray-600 mb-6">{article.subheading}</p>}
                        <div
                            className="prose prose-sm max-w-none text-gray-800 leading-relaxed
                                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2
                                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1
                                [&_p]:mb-3 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:mb-1
                                [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3
                                [&_a]:text-blue-600 [&_a]:underline"
                            dangerouslySetInnerHTML={{ __html: article.text || article.content?.map((b: any) => {
                                if (b.type === 'paragraph') return `<p>${b.value}</p>`;
                                if (b.type === 'subheading') return `<h2>${b.value}</h2>`;
                                if (b.type === 'image') return `<img src="${b.value}" style="max-width:100%;border-radius:8px;" />`;
                                return '';
                            }).join('') || '' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ISSUE FORM ---
const IssueForm = ({
    initial,
    articles,
    onClose,
    onSuccess,
}: {
    initial: Issue | null;
    articles: Article[];
    onClose: () => void;
    onSuccess: (iss: Issue) => void;
}) => {
    const [form, setForm] = useState<Partial<Issue>>(initial ?? {
        title: '',
        number: 0,
        date: new Date().toISOString().slice(0, 10),
        sunuArticleId: '',
        rotaArticleId: '',
        recommendedArticleIds: [],
        otherArticleIds: [],
        coverMedia: { type: 'image', src: '', alt: '', mediaLayout: 'full-width' },
    });

    const toggleArr = (field: 'recommendedArticleIds' | 'otherArticleIds', id: string) => {
        setForm(prev => {
            const arr = prev[field] ?? [];
            return {
                ...prev,
                [field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.number) { alert('Başlık ve Sayı No gerekli!'); return; }
        const method = initial ? 'PUT' : 'POST';
        const url = initial ? `${API_URL}/issues/${initial.id}` : `${API_URL}/issues`;
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
            .then(r => r.json())
            .then((iss: Issue) => onSuccess(iss));
    };

    const sunus = articles.filter(a => a.type === 'sunu');
    const rotas = articles.filter(a => a.type === 'rota');
    const others = articles.filter(a => a.type === 'featured' || a.type === 'normal');

    return (
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Başlık</label>
                    <input value={form.title ?? ''} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Sayı 505" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sayı No</label>
                    <input type="number" value={form.number ?? ''} onChange={e => setForm({ ...form, number: Number(e.target.value) })} className="w-full p-2 border rounded-lg" placeholder="505" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarih</label>
                    <input type="date" value={form.date ?? ''} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kapak Görseli URL</label>
                    <input value={form.coverMedia?.src ?? ''} onChange={e => setForm({ ...form, coverMedia: { ...(form.coverMedia ?? { type: 'image', mediaLayout: 'full-width' }), src: e.target.value } })} className="w-full p-2 border rounded-lg" placeholder="https://..." />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-blue-700 uppercase mb-1">⭐ Sunu Makalesi</label>
                    <select value={form.sunuArticleId ?? ''} onChange={e => setForm({ ...form, sunuArticleId: e.target.value })} className="w-full p-2 border rounded-lg">
                        <option value="">-- Seçin --</option>
                        {sunus.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                        {sunus.length === 0 && others.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-green-700 uppercase mb-1">📍 Rota Makalesi</label>
                    <select value={form.rotaArticleId ?? ''} onChange={e => setForm({ ...form, rotaArticleId: e.target.value })} className="w-full p-2 border rounded-lg">
                        <option value="">-- Seçin --</option>
                        {rotas.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                        {rotas.length === 0 && others.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Önerilen Makaleler ({form.recommendedArticleIds?.length ?? 0} seçili)</label>
                <div className="h-40 overflow-y-auto border rounded-lg p-2 space-y-1 bg-gray-50">
                    {others.map(a => (
                        <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white rounded p-1">
                            <input type="checkbox" checked={(form.recommendedArticleIds ?? []).includes(a.id)} onChange={() => toggleArr('recommendedArticleIds', a.id)} />
                            <span className="truncate">{a.title}</span>
                            <span className="ml-auto text-xs text-gray-400">{a.category}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Diğer Makaleler ({form.otherArticleIds?.length ?? 0} seçili)</label>
                <div className="h-40 overflow-y-auto border rounded-lg p-2 space-y-1 bg-gray-50">
                    {others.map(a => (
                        <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white rounded p-1">
                            <input type="checkbox" checked={(form.otherArticleIds ?? []).includes(a.id)} onChange={() => toggleArr('otherArticleIds', a.id)} />
                            <span className="truncate">{a.title}</span>
                            <span className="ml-auto text-xs text-gray-400">{a.category}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition">
                    {initial ? 'Güncelle' : 'Sayı Oluştur'}
                </button>
                <button type="button" onClick={onClose} className="px-6 py-3 border rounded-xl text-gray-600 hover:bg-gray-50">
                    İptal
                </button>
            </div>
        </form>
    );
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

    // UI
    const [pagination, setPagination] = useState<Record<string, { page: number, expanded: boolean }>>({});
    const dragItem = useRef<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/init`).then(r => r.json()).then(d => {
            setSections(d.sections);
            setLoggedArticles(d.articles);
            setCategories(d.categories);
            setLabels(d.labels);
        });
        fetch(`${API_URL}/issues`).then(r => r.json()).then(d => {
            if (Array.isArray(d)) setIssues(d);
        });
    }, []);

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
        setSections(prev => prev.map(s => {
            if (s.id !== sectionId) return s;
            return { ...s, articles: s.articles.filter(a => a.id !== articleId) };
        }));
    };

    const startEditArticle = (article: Article) => {
        setSelectedArticle(article);
        setView('log');
    };

    // --- Pagination Logic ---
    const renderPagination = (sectionId: string, total: number, limit: number) => {
        const state = pagination[sectionId] || { page: 1, expanded: false };

        // If NOT expanded (collapsed view)
        if (!state.expanded) {
            // Show load more if items > 4 (Feed default limit)
            if (total > 4) return (
                <div className="flex justify-center mt-6">
                    <button onClick={() => setPagination({ ...pagination, [sectionId]: { ...state, expanded: true } })} className="px-6 py-2 bg-white border rounded-full shadow-sm hover:bg-gray-50 text-sm font-bold text-gray-600">
                        Daha Fazla Yükle
                    </button>
                </div>
            );
            return null;
        }

        // If expanded, show pagination (8 per page)
        const totalPages = Math.ceil(total / limit);

        const page = state.page;
        let pages = [];
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

        // Create copy of sections
        const newSections = [...sections];
        const targetSection = newSections[targetSecIdx];

        let art: Article | undefined;

        // 1. Retrieve Article
        if (dragged.type === 'sidebar') {
            // Drag from Sidebar (Library)
            const found = loggedArticles.find(a => a.id === dragged.id);
            if (found) art = { ...found, id: `${found.id}-${Date.now()}` }; // Clone with new ID
        } else if (sourceSecIdx !== -1) {
            // Drag from another (or same) section
            const sourceSection = newSections[sourceSecIdx];
            const idx = sourceSection.articles.findIndex(a => a.id === dragged.id);
            if (idx !== -1) {
                [art] = sourceSection.articles.splice(idx, 1);
            }
        }

        if (!art) return;

        // 2. Insert Article Logic

        if (targetSection.type === 'article-feed') {
            // Feed: Just insert at drop position (or prepend if generic drop)
            if (targetIndex !== undefined && targetIndex < targetSection.articles.length) {
                targetSection.articles.splice(targetIndex, 0, art);
            } else {
                targetSection.articles.unshift(art);
            }
        } else {
            // Fixed Rows (Category, Ordinary, Spot)
            // Logic: "Replace the one I drag on" OR "Drag between"

            if (targetIndex !== undefined && targetIndex < targetSection.articles.length) {
                // Replacing/Inserting at specific index
                if (dragged.type === 'sidebar') {
                    // Sidebar -> Grid: REPLACE the article at targetIndex
                    targetSection.articles[targetIndex] = art;
                } else {
                    // Grid -> Grid: INSERT at targetIndex (Reordering)
                    targetSection.articles.splice(targetIndex, 0, art);

                    // Ensure we respect row limits after insertion/move
                    const limit = targetSection.type === 'category-row' ? 3 : 4;
                    if (targetSection.articles.length > limit) {
                        // Remove the last one (trimmed) if we exceeded limit
                        targetSection.articles = targetSection.articles.slice(0, limit);
                    }
                }
            } else {
                // Dropped on container, not specific card -> Append/Prepend
                targetSection.articles.unshift(art);

                // Enforce limit of 4 (or 3 for category).
                const limit = targetSection.type === 'category-row' ? 3 : 4;
                if (targetSection.articles.length > limit) {
                    targetSection.articles.pop(); // Remove the oldest/last article in the row
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
            onClick={() => { setSelectedArticle(article); setView('read'); }}
            className={`relative border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-all h-full flex flex-col ${large ? 'md:flex-row' : ''} cursor-move bg-white`}
        >
            {/* REMOVED Top Colored Stripe to make photo upmost */}

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
                {/* Category/Issue Badge - Hidden by default, show on hover */}
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

            {/* Bottom Status Stripe Fix */}
            {/* The parent div has the default category color. The child div handles the hover color overlay. */}
            <div className="h-1 w-full relative" style={{ backgroundColor: getCategoryColor(article.category) + '40' }}>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${article.status === 'edited' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-800 flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
                <div className="p-4 flex justify-between items-center border-b bg-gray-50">
                    <h2 className="font-medium text-gray-800">Haber Kütüphanesi</h2>
                    <button onClick={() => setMenuOpen(false)}><X size={18} /></button>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto h-full pb-20 bg-[#F8F9FC]">
                    {loggedArticles.map(a => (
                        <div key={a.id} draggable onDragStart={e => handleDragStart(e, 'sidebar', a.id)} className="relative p-3 border rounded-xl bg-white hover:shadow-md cursor-grab active:cursor-grabbing flex gap-3 group transition-all hover:border-blue-300 overflow-hidden">
                            {/* Status Stripe (Left) - TWICE AS BOLD (w-2) */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 ${a.status === 'edited' ? 'bg-green-500' : 'bg-red-500'}`}></div>

                            <img src={a.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-gray-100 ml-2" />
                            <div className="flex-1 min-w-0 ml-1">
                                <div className="font-medium text-xs text-gray-800 line-clamp-2 leading-tight mb-0.5 pr-6">{a.title}</div>
                                {/* ADDED SCHOOL INFO TO SIDEBAR */}
                                {a.school && <div className="text-[10px] text-blue-600 font-semibold truncate">{a.school}</div>}

                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[10px] text-gray-500 font-medium truncate max-w-[80px]">{a.author}</span>
                                    <span className="text-[10px] text-gray-400">{formatLogDate(a.createdAt)}</span>
                                </div>
                            </div>

                            {/* EDITOR INITIALS (Top Right) */}
                            <div className="absolute top-2 right-2 text-[10px] font-bold text-gray-400">
                                {(a.editorName?.[0] ?? '?').toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 p-8 ${menuOpen ? 'ml-80' : ''}`}>
                {/* ... existing header ... */}
                <div className="flex justify-between items-center mb-10 sticky top-4 z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu /></button>
                        <h1 className="text-2xl font-black text-blue-600 tracking-tight">Genç Hayat CMS</h1>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setSettingsOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Settings /></button>
                        <button onClick={() => setView('issues')} className={`px-4 py-2 rounded-lg font-bold shadow-sm transition ${view === 'issues' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}><BookOpen size={16} className="inline mr-1" />Sayılar</button>
                        <button onClick={() => { setSelectedArticle(null); setView('log') }} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold shadow-sm hover:bg-orange-600">+ Makale Ekle</button>
                        <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-lg font-bold shadow-sm transition ${view === 'dashboard' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><List size={16} className="inline mr-1" />Dashboard</button>
                        <button onClick={() => {
                            fetch(`${API_URL}/layout/save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sections) })
                                .then(() => alert("Düzen Kaydedildi!"))
                        }} className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold shadow-lg hover:bg-gray-800">Düzeni Kaydet</button>
                    </div>
                </div>

                <div className="space-y-16 max-w-7xl mx-auto pb-20">
                    {sections.sort((a, b) => (a.isPinned === b.isPinned) ? 0 : a.isPinned ? -1 : 1).map((section, idx) => (
                        <div
                            key={section.id}
                            className={`relative group border rounded-xl p-8 transition-all ${section.isPinned ? 'border-blue-500 shadow-blue-50' : 'border-gray-200'} ${(section.isVisible ?? true) ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
                            onDragOver={e => e.preventDefault()}
                            onDrop={(e) => {
                                // Only trigger main drop if not handled by child
                                if (!e.defaultPrevented) {
                                    handleDrop(e, section.id);
                                }
                            }}
                            style={section.type === 'category-row' ? { backgroundColor: getCategoryColor(section.title || '') + '20', borderColor: getCategoryColor(section.title || '') } : {}}
                        >

                            {/* Section Label */}
                            <div className={`absolute -top-3 left-6 px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full flex items-center gap-2 shadow-sm ${section.isPinned ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'}`}>
                                {section.isPinned && <Pin size={10} fill="currentColor" />}
                                {getSectionLabel(section.type)}
                            </div>

                            {/* CONTROLS (Z-INDEX 100) */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white p-1 rounded-lg border shadow-sm z-20">
                                <button onClick={() => { const ns = [...sections]; const s = ns.find(x => x.id === section.id)!; s.isVisible = !(s.isVisible ?? true); setSections(ns) }} className={`p-1.5 rounded-md transition-all ${(section.isVisible ?? true) ? 'hover:text-gray-600 hover:bg-gray-50' : 'text-red-500 bg-red-50'}`} title={(section.isVisible ?? true) ? 'Gizle' : 'Göster'}>{(section.isVisible ?? true) ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                                <button onClick={() => { const ns = [...sections]; ns.find(x => x.id === section.id)!.isPinned = !ns.find(x => x.id === section.id)!.isPinned; setSections(ns) }} className="p-1.5 rounded-md transition-all hover:text-blue-600 hover:bg-blue-50 hover:shadow-[0_0_8px_rgba(59,130,246,0.4)]"><Pin size={16} /></button>
                                <button onClick={() => { const ns = [...sections]; if (idx > 0) { [ns[idx], ns[idx - 1]] = [ns[idx - 1], ns[idx]]; setSections(ns); } }} className="p-1.5 rounded-md transition-all hover:text-green-600 hover:bg-green-50 hover:shadow-[0_0_8px_rgba(34,197,94,0.4)]"><ChevronUp size={16} /></button>
                                <button onClick={() => { const ns = [...sections]; if (idx < ns.length - 1) { [ns[idx], ns[idx + 1]] = [ns[idx + 1], ns[idx]]; setSections(ns); } }} className="p-1.5 rounded-md transition-all hover:text-green-600 hover:bg-green-50 hover:shadow-[0_0_8px_rgba(34,197,94,0.4)]"><ChevronDown size={16} /></button>
                                <button onClick={() => setSections(sections.filter(s => s.id !== section.id))} className="p-1.5 rounded-md transition-all hover:text-red-600 hover:bg-red-50 hover:shadow-[0_0_8px_rgba(239,68,68,0.4)]"><Trash2 size={16} /></button>
                            </div>

                            {(section.type === 'article-feed') && (
                                <>
                                    <div className="grid grid-cols-4 gap-6 min-h-[10rem]">
                                        {section.articles.length === 0 && <div className="col-span-4 h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400">Makaleleri Buraya Sürükle</div>}
                                        {(() => {
                                            const state = pagination[section.id] || { page: 1, expanded: false };
                                            const start = state.expanded ? (state.page - 1) * 8 : 0;
                                            const end = state.expanded ? start + 8 : 4; // Show 4 if collapsed
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
                                            {section.articles.length === 0 && <div className="col-span-3 h-20 border-2 border-dashed rounded flex items-center justify-center text-gray-400">Buraya Sürükle (Maks 3)</div>}
                                        </div>
                                    </div>
                                </>
                            )}

                            {section.type === 'ordinary-row' && (
                                <div className="grid grid-cols-4 gap-6 min-h-[10rem]">
                                    {section.articles.slice(0, 4).map((art, i) => (
                                        <div key={art.id} className="h-60"><ArticleCard article={art} sectionId={section.id} index={i} /></div>
                                    ))}
                                    {section.articles.length === 0 && <div className="col-span-4 h-20 border-2 border-dashed rounded flex items-center justify-center text-gray-400">Buraya Sürükle (Maks 4)</div>}
                                </div>
                            )}

                            {/* UPDATED SPOT ROW */}
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

                                                {/* School/Neighborhood Info in Spot Row */}
                                                {section.articles[0].school && <p className="text-sm text-blue-400 font-semibold mb-2">{section.articles[0].school}</p>}

                                                <div className="flex items-center gap-4 text-sm text-gray-400 mt-4 border-t border-gray-700 pt-4">
                                                    <span className="font-bold text-white">{section.articles[0].author}</span>
                                                    {section.articles[0].place && <span className="flex items-center gap-1"><MapPin size={14} /> {section.articles[0].place}</span>}
                                                </div>

                                                {/* Spot Controls */}
                                                <div className="absolute top-0 left-0 -ml-4 opacity-0 group-hover/spot:opacity-100 transition-opacity flex flex-col gap-2">
                                                    <button onClick={() => { setSelectedArticle(section.articles[0]); setView('read'); }} className="p-2 bg-white/10 hover:bg-white/20 rounded text-white"><AlignLeft size={16} /></button>
                                                    <button onClick={() => { setSelectedArticle(section.articles[0]); setView('log'); }} className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-white"><Edit3 size={16} /></button>
                                                    <button onClick={() => { const ns = [...sections]; ns.find(s => s.id === section.id)!.articles = []; setSections(ns) }} className="p-2 bg-red-600 hover:bg-red-500 rounded text-white"><Trash2 size={16} /></button>
                                                    <div className={`p-1 text-[10px] font-bold text-center rounded ${section.articles[0].status === 'edited' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                        {section.articles[0].status === 'edited' ? 'D' : 'D-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : <div className="text-gray-500">Spot Haberini Buraya Sürükle</div>}
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

                    {/* ... add row zone ... */}
                    <div className="border-2 border-dashed rounded-xl p-8 flex justify-center gap-4 text-gray-400 hover:border-gray-400 transition-colors">
                        <button onClick={() => setSections([...sections, { id: `s-${Date.now()}`, type: 'ordinary-row', isPinned: false, articles: [] }])} className="px-4 py-2 bg-white border rounded hover:text-blue-600 shadow-sm">+ Sıradan Satır</button>
                        <button onClick={() => setSections([...sections, { id: `s-${Date.now()}`, type: 'category-row', isPinned: false, articles: [] }])} className="px-4 py-2 bg-white border rounded hover:text-blue-600 shadow-sm">+ Kategori Satırı</button>
                        <button onClick={() => setSections([...sections, { id: `s-${Date.now()}`, type: 'spot-row', isPinned: false, articles: [] }])} className="px-4 py-2 bg-white border rounded hover:text-blue-600 shadow-sm">+ Spot Satırı</button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {view === 'log' && <LogArticle isEdit={!!selectedArticle} initialData={selectedArticle} onClose={() => { setView('dashboard'); setSelectedArticle(null) }} onSuccess={(art: Article) => { setLoggedArticles([art, ...loggedArticles]); setView('dashboard'); }} categories={categories} labels={labels} />}
            {view === 'read' && selectedArticle && (
                <ReadArticle
                    article={selectedArticle}
                    onClose={() => setView('dashboard')}
                    onEdit={() => { setView('log'); }}
                />
            )}

            {/* Issues (Sayılar) Manager */}
            {view === 'issues' && (
                <div className="max-w-4xl mx-auto pb-20">
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
                    <div className="space-y-4">
                        {issues.length === 0 && <div className="text-center text-gray-400 py-16">Henüz sayı yok. Yeni sayı ekleyin.</div>}
                        {issues.map(iss => (
                            <div key={iss.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{iss.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{new Date(iss.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <div className="flex gap-4 mt-3 text-sm">
                                            <span className="flex items-center gap-1 text-blue-700 font-semibold"><Star size={14} />Sunu: {iss.sunuArticle?.title || <span className="text-gray-400 font-normal">Atanmadı</span>}</span>
                                        </div>
                                        <div className="flex gap-4 mt-1 text-sm">
                                            <span className="flex items-center gap-1 text-green-700 font-semibold"><ArrowRight size={14} />Rota: {iss.rotaArticle?.title || <span className="text-gray-400 font-normal">Atanmadı</span>}</span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Önerilen: {iss.recomendedCards?.length ?? iss.recommendedArticleIds.length} makale &bull; Diğer: {iss.otherArticles?.length ?? iss.otherArticleIds.length} makale
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => { setSelectedIssue(iss); setIssueFormOpen(true); }} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"><Edit3 size={16} /></button>
                                        <button onClick={() => {
                                            if (!confirm(`"${iss.title}" sayısını silmek istediğinize emin misiniz?`)) return;
                                            fetch(`${API_URL}/issues/${iss.id}`, { method: 'DELETE' })
                                                .then(() => setIssues(prev => prev.filter(i => i.id !== iss.id)));
                                        }} className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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