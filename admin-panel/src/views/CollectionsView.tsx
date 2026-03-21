import { useState, useMemo, useRef, useEffect } from 'react';
import { Layers, FolderOpen, ChevronDown, ChevronUp, ExternalLink, Plus, X, Search } from 'lucide-react';
import type { Article } from '../types';
import { API_URL } from '../config';

interface CollectionInfo {
    slug: string;
    title: string;
    description: string;
    filterTag: string;
    href: string;
}

const TEMATIK: CollectionInfo[] = [
    { slug: 'bir-olay-bir-kavram', title: 'Bir Olay Bir Kavram', description: 'Güncel olayları kuramsal bir perspektifle ele aldığımız köşe yazıları.', filterTag: 'bir olay bir kavram', href: '/tematik/bir-olay-bir-kavram' },
    { slug: 'portre', title: 'Portre', description: 'Tarihe ve günümüze iz bırakan isimlerin hayatlarını derinlemesine inceliyoruz.', filterTag: 'portre', href: '/tematik/portre' },
    { slug: 'nato', title: 'NATO', description: "NATO'nun tarihini, güncel gelişmelerini ve bölgesel etkilerini analiz ediyoruz.", filterTag: 'nato', href: '/tematik/nato' },
];

const DOSYALAR: CollectionInfo[] = [
    { slug: 'cumhuriyet', title: 'Cumhuriyet', description: 'Cumhuriyetin tarihsel sürecini, ideallerini ve günümüzdeki yansımalarını ele alıyoruz.', filterTag: 'cumhuriyet', href: '/dosyalar/cumhuriyet' },
    { slug: '8-mart', title: '8 Mart', description: "8 Mart Dünya Emekçi Kadınlar Günü'ne dair yazılar ve analizler.", filterTag: '8 mart', href: '/dosyalar/8-mart' },
    { slug: 'antiemperyalizm', title: 'Antiemperyalizm', description: 'Emperyalizme karşı mücadele ve antiemperyalist hareketler üzerine derinlemesine analizler.', filterTag: 'antiemperyalizm', href: '/dosyalar/antiemperyalizm' },
    { slug: 'anadil', title: 'Anadil', description: 'Anadil hakkı, dil politikaları ve dilsel çeşitlilik üzerine yazılar.', filterTag: 'anadil', href: '/dosyalar/anadil' },
    { slug: '25-kasim', title: '25 Kasım', description: 'Kadına yönelik şiddete karşı mücadele, İstanbul Sözleşmesi ve kadın haklarına dair yazılar.', filterTag: 'kadın mücadelesi', href: '/dosyalar/25-kasim' },
    { slug: 'mesem', title: 'MESEM', description: 'Mesleki Eğitim Merkezi sisteminde yaşanan sorunlar, güvencesiz çalışma koşulları ve genç işçiler üzerine analizler.', filterTag: 'MESEM', href: '/dosyalar/mesem' },
];

interface Props {
    loggedArticles: Article[];
    setLoggedArticles: React.Dispatch<React.SetStateAction<Article[]>>;
    setPreviewArticle: (article: Article | null) => void;
}

// Article picker dropdown for a single collection
function ArticlePicker({ collection, articles, onAdd }: {
    collection: CollectionInfo;
    articles: Article[]; // articles NOT in this collection
    onAdd: (article: Article) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return articles.filter(a =>
            a.title?.toLowerCase().includes(q) ||
            a.author?.toLowerCase().includes(q)
        ).slice(0, 30);
    }, [articles, search]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => { setOpen(o => !o); setSearch(''); }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-teal-400 hover:text-teal-600 dark:hover:border-teal-500 dark:hover:text-teal-400 transition-colors"
            >
                <Plus size={12} /> Makale Ekle
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1.5 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Search size={13} className="text-gray-400 shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Makale ara..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none"
                            />
                        </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="text-center text-xs text-gray-400 py-6">
                                {articles.length === 0 ? 'Tüm makaleler zaten bu koleksiyonda.' : 'Makale bulunamadı.'}
                            </div>
                        ) : (
                            filtered.map(a => (
                                <button
                                    key={a.id}
                                    onClick={() => { onAdd(a); setOpen(false); setSearch(''); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                                >
                                    {a.imageUrl && (
                                        <img src={a.imageUrl} alt="" className="w-7 h-7 rounded object-cover shrink-0 bg-gray-100" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{a.title}</div>
                                        <div className="text-xs text-gray-400 truncate">{a.author}{a.issueNumber ? ` · Sayı ${a.issueNumber}` : ''}</div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CollectionsView({ loggedArticles, setLoggedArticles, setPreviewArticle }: Props) {
    const [tab, setTab] = useState<'tematik' | 'dosyalar'>('tematik');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [saving, setSaving] = useState<string | null>(null); // collectionSlug being saved
    const [dragOver, setDragOver] = useState<string | null>(null); // collectionSlug being dragged over

    const collections = tab === 'tematik' ? TEMATIK : DOSYALAR;

    const articlesByTag = useMemo(() => {
        const map: Record<string, Article[]> = {};
        for (const col of [...TEMATIK, ...DOSYALAR]) {
            const tag = col.filterTag.toLowerCase();
            map[col.filterTag] = loggedArticles.filter(a =>
                a.labels?.some(l => l.toLowerCase() === tag)
            );
        }
        return map;
    }, [loggedArticles]);

    const totalArticles = collections.reduce((sum, col) => sum + (articlesByTag[col.filterTag]?.length ?? 0), 0);

    const updateArticleLabels = async (article: Article, newLabels: string[]) => {
        const updated = { ...article, labels: newLabels };
        const res = await fetch(`${API_URL}/articles/${article.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
        });
        return res.json() as Promise<Article>;
    };

    const handleDrop = async (e: React.DragEvent, collection: CollectionInfo) => {
        e.preventDefault();
        setDragOver(null);
        const articleId = e.dataTransfer.getData('text/plain');
        const article = loggedArticles.find(a => a.id === articleId);
        if (!article) return;
        await handleAdd(collection, article);
    };

    const handleAdd = async (collection: CollectionInfo, article: Article) => {
        setSaving(collection.slug);
        const currentLabels = article.labels ?? [];
        const alreadyHas = currentLabels.some(l => l.toLowerCase() === collection.filterTag.toLowerCase());
        if (alreadyHas) { setSaving(null); return; }
        const newLabels = [...currentLabels, collection.filterTag];
        const saved = await updateArticleLabels(article, newLabels);
        setLoggedArticles(prev => prev.map(a => a.id === saved.id ? saved : a));
        setExpanded(collection.slug); // auto-expand so user sees result
        setSaving(null);
    };

    const handleRemove = async (collection: CollectionInfo, article: Article) => {
        setSaving(collection.slug);
        const newLabels = (article.labels ?? []).filter(l => l.toLowerCase() !== collection.filterTag.toLowerCase());
        const saved = await updateArticleLabels(article, newLabels);
        setLoggedArticles(prev => prev.map(a => a.id === saved.id ? saved : a));
        setSaving(null);
    };

    const accentColor = tab === 'tematik' ? 'teal' : 'indigo';

    return (
        <div className="max-w-4xl mx-auto pb-20 px-2 mt-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Layers className="text-teal-600" /> Koleksiyonlar
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {collections.length} koleksiyon · {totalArticles} etiketli makale
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
                <button
                    onClick={() => { setTab('tematik'); setExpanded(null); }}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'tematik' ? 'bg-white dark:bg-gray-700 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <Layers size={14} /> Tematik
                    <span className="ml-1 text-[10px] bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded-full font-semibold">
                        {TEMATIK.length}
                    </span>
                </button>
                <button
                    onClick={() => { setTab('dosyalar'); setExpanded(null); }}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'dosyalar' ? 'bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <FolderOpen size={14} /> Dosyalar
                    <span className="ml-1 text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-full font-semibold">
                        {DOSYALAR.length}
                    </span>
                </button>
            </div>

            {/* Collection cards */}
            <div className="space-y-3">
                {collections.map(col => {
                    const arts = articlesByTag[col.filterTag] ?? [];
                    const isExpanded = expanded === col.slug;
                    const isSaving = saving === col.slug;
                    const isDragOver = dragOver === col.slug;
                    const notInCollection = loggedArticles.filter(a =>
                        !a.labels?.some(l => l.toLowerCase() === col.filterTag.toLowerCase())
                    );

                    return (
                        <div
                            key={col.slug}
                            onDragOver={e => { e.preventDefault(); setDragOver(col.slug); }}
                            onDragLeave={() => setDragOver(null)}
                            onDrop={e => handleDrop(e, col)}
                            className={`bg-white dark:bg-gray-900 border rounded-xl shadow-sm overflow-hidden transition-colors ${isDragOver ? (accentColor === 'teal' ? 'border-teal-400 dark:border-teal-500 ring-2 ring-teal-200 dark:ring-teal-900' : 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900') : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <div className="flex items-center gap-4 px-4 py-3.5">
                                {/* Color bar */}
                                <div className={`w-1 self-stretch rounded-full shrink-0 ${accentColor === 'teal' ? 'bg-teal-400' : 'bg-indigo-400'}`} />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-gray-900 dark:text-gray-100">{col.title}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold ${accentColor === 'teal' ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400' : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'}`}>
                                            #{col.filterTag}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${arts.length > 0 ? (accentColor === 'teal' ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300' : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300') : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                            {isSaving ? '...' : `${arts.length} makale`}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{col.description}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <ArticlePicker
                                        collection={col}
                                        articles={notInCollection}
                                        onAdd={(a) => handleAdd(col, a)}
                                    />
                                    <a
                                        href={`http://localhost:5173${col.href}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        title="Websitede Aç"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                    <button
                                        onClick={() => setExpanded(isExpanded ? null : col.slug)}
                                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        title={isExpanded ? 'Daralt' : 'Makaleleri Göster'}
                                    >
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded article list */}
                            {isExpanded && (
                                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 px-4 py-3">
                                    {arts.length === 0 ? (
                                        <div className="text-center text-sm text-gray-400 py-4">
                                            Bu koleksiyona henüz makale eklenmemiş.
                                            <div className="text-xs mt-1 text-gray-300 dark:text-gray-600">
                                                "Makale Ekle" butonuyla mevcut yazıları ekleyebilirsiniz.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {arts.map(a => (
                                                <div
                                                    key={a.id}
                                                    className="flex items-center gap-2.5 py-1.5 px-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 group"
                                                >
                                                    <button
                                                        onClick={() => setPreviewArticle(a)}
                                                        className="flex items-center gap-2.5 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
                                                    >
                                                        {a.imageUrl && (
                                                            <img src={a.imageUrl} alt="" className="w-8 h-8 rounded-md object-cover shrink-0 bg-gray-100" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{a.title}</div>
                                                            <div className="text-xs text-gray-400 truncate">
                                                                {a.author}{a.issueNumber ? ` · Sayı ${a.issueNumber}` : ''}
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 font-medium ${a.status === 'edited' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400'}`}>
                                                        {a.status === 'edited' ? 'Düzenlendi' : 'Taslak'}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemove(col, a)}
                                                        disabled={isSaving}
                                                        title="Koleksiyondan çıkar"
                                                        className="p-1 text-gray-300 hover:text-red-400 dark:hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 rounded"
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
