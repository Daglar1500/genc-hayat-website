import React, { useState, useRef } from 'react';
import { Upload, Search, X } from 'lucide-react';
import type { Article, Issue } from '../types';
import { API_URL } from '../config';

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [searchSunu, setSearchSunu] = useState('');
    const [searchRota, setSearchRota] = useState('');
    const [searchRec, setSearchRec] = useState('');
    const [searchOther, setSearchOther] = useState('');
    const [articleFilter, setArticleFilter] = useState<'all' | 'this-issue' | 'unassigned'>('all');
    const [submitting, setSubmitting] = useState(false);

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

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        fetch(`${API_URL}/upload`, { method: 'POST', body: fd })
            .then(r => r.json())
            .then(d => {
                if (d.url) setForm(p => ({
                    ...p,
                    coverMedia: { ...(p.coverMedia ?? { type: 'image', mediaLayout: 'full-width' }), src: d.url, alt: p.title ?? '' },
                }));
            })
            .catch(() => alert('Yükleme başarısız'))
            .finally(() => setUploading(false));
    };

    const toggleArr = (field: 'recommendedArticleIds' | 'otherArticleIds', id: string) => {
        setForm(prev => {
            const arr = prev[field] ?? [];
            return { ...prev, [field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.number) { alert('Başlık ve Sayı No gerekli!'); return; }
        setSubmitting(true);
        const method = initial ? 'PUT' : 'POST';
        const url = initial ? `${API_URL}/issues/${initial.id}` : `${API_URL}/issues`;
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
            .then(r => r.json())
            .then((iss: Issue) => onSuccess(iss))
            .finally(() => setSubmitting(false));
    };

    const filter = (arts: Article[], q: string) =>
        q.trim()
            ? arts.filter(a =>
                a.title.toLowerCase().includes(q.toLowerCase()) ||
                a.author.toLowerCase().includes(q.toLowerCase()) ||
                (a.category || '').toLowerCase().includes(q.toLowerCase())
            )
            : arts;

    const issueNumStr = form.number ? form.number.toString() : '';
    const filteredArticles = articleFilter === 'all'
        ? articles
        : articleFilter === 'this-issue'
            ? articles.filter(a => a.issueNumber === issueNumStr)
            : articles.filter(a => !a.issueNumber);

    const recIds = form.recommendedArticleIds ?? [];
    const otherIds = form.otherArticleIds ?? [];

    const ArticleCheckList = ({
        arts, selected, onToggle, searchVal, onSearch, placeholder,
    }: {
        arts: Article[];
        selected: string[];
        onToggle: (id: string) => void;
        searchVal: string;
        onSearch: (v: string) => void;
        placeholder: string;
    }) => {
        const shown = filter(arts, searchVal);
        return (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        value={searchVal}
                        onChange={e => onSearch(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-8 pr-8 py-2 text-sm bg-gray-50 border-b border-gray-200 focus:outline-none focus:bg-white"
                    />
                    {searchVal && (
                        <button onClick={() => onSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={12} />
                        </button>
                    )}
                </div>
                <div className="h-44 overflow-y-auto">
                    {shown.length === 0 && (
                        <div className="text-center text-gray-400 text-sm py-6">Sonuç bulunamadı</div>
                    )}
                    {shown.map(a => {
                        const checked = selected.includes(a.id);
                        return (
                            <label key={a.id} className={`flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${checked ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onToggle(a.id)}
                                    className="rounded shrink-0 accent-purple-600"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="truncate font-medium text-gray-800">{a.title}</div>
                                    <div className="text-[11px] text-gray-400 flex gap-2">
                                        <span>{a.author}</span>
                                        {a.issueNumber && <span className="text-purple-400">Sayı {a.issueNumber}</span>}
                                    </div>
                                </div>
                                <span className="text-[10px] shrink-0 px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{a.category}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-5 flex-1">
            {/* Basic info */}
            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Başlık</label>
                    <input
                        value={form.title ?? ''}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="Sayı 505"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sayı No</label>
                    <input
                        type="number"
                        value={form.number || ''}
                        onChange={e => setForm({ ...form, number: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="505"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarih</label>
                    <input
                        type="date"
                        value={form.date ?? ''}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kapak Görseli</label>
                    <div className="flex gap-2">
                        <input
                            value={form.coverMedia?.src ?? ''}
                            onChange={e => setForm({ ...form, coverMedia: { ...(form.coverMedia ?? { type: 'image', mediaLayout: 'full-width' }), src: e.target.value } })}
                            className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                            placeholder="URL veya yükle"
                        />
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-1 shrink-0"
                        >
                            <Upload size={14} />{uploading ? '...' : 'Yükle'}
                        </button>
                    </div>
                    {form.coverMedia?.src && (
                        <img src={form.coverMedia.src} alt="" className="mt-1.5 h-16 w-auto rounded-lg object-cover border" />
                    )}
                </div>
            </div>

            {/* Article filter tabs */}
            <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl">
                {([
                    { key: 'all', label: 'Tümü', count: articles.length },
                    { key: 'this-issue', label: `Sayı ${form.number || '?'}`, count: articles.filter(a => a.issueNumber === issueNumStr).length },
                    { key: 'unassigned', label: 'Atanmamış', count: articles.filter(a => !a.issueNumber).length },
                ] as const).map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setArticleFilter(tab.key)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${articleFilter === tab.key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${articleFilter === tab.key ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Sunu & Rota — select from ALL articles */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-blue-600 uppercase mb-1">⭐ Sunu Makalesi</label>
                    <div className="relative mb-1">
                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            value={searchSunu}
                            onChange={e => setSearchSunu(e.target.value)}
                            placeholder="Ara..."
                            className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <select
                        value={form.sunuArticleId ?? ''}
                        onChange={e => setForm({ ...form, sunuArticleId: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        size={4}
                    >
                        <option value="">— Seçin —</option>
                        {filter(filteredArticles, searchSunu).map(a => (
                            <option key={a.id} value={a.id}>{a.title} ({a.author})</option>
                        ))}
                    </select>
                    {form.sunuArticleId && (
                        <div className="mt-1 text-xs text-blue-600 truncate">
                            ✓ {articles.find(a => a.id === form.sunuArticleId)?.title}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-xs font-bold text-green-600 uppercase mb-1">📍 Rota Makalesi</label>
                    <div className="relative mb-1">
                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            value={searchRota}
                            onChange={e => setSearchRota(e.target.value)}
                            placeholder="Ara..."
                            className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:border-green-400"
                        />
                    </div>
                    <select
                        value={form.rotaArticleId ?? ''}
                        onChange={e => setForm({ ...form, rotaArticleId: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        size={4}
                    >
                        <option value="">— Seçin —</option>
                        {filter(filteredArticles, searchRota).map(a => (
                            <option key={a.id} value={a.id}>{a.title} ({a.author})</option>
                        ))}
                    </select>
                    {form.rotaArticleId && (
                        <div className="mt-1 text-xs text-green-600 truncate">
                            ✓ {articles.find(a => a.id === form.rotaArticleId)?.title}
                        </div>
                    )}
                </div>
            </div>

            {/* Recommended articles */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Önerilen Makaleler
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full normal-case font-semibold">{recIds.length} seçili</span>
                </label>
                <ArticleCheckList
                    arts={filteredArticles}
                    selected={recIds}
                    onToggle={id => toggleArr('recommendedArticleIds', id)}
                    searchVal={searchRec}
                    onSearch={setSearchRec}
                    placeholder={`${filteredArticles.length} makalede ara...`}
                />
            </div>

            {/* Other articles */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Diğer Makaleler
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full normal-case font-semibold">{otherIds.length} seçili</span>
                </label>
                <ArticleCheckList
                    arts={filteredArticles}
                    selected={otherIds}
                    onToggle={id => toggleArr('otherArticleIds', id)}
                    searchVal={searchOther}
                    onSearch={setSearchOther}
                    placeholder={`${filteredArticles.length} makalede ara...`}
                />
            </div>

            <div className="flex gap-3 pt-2 sticky bottom-0 bg-white py-3 -mx-5 px-5 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
                >
                    {submitting ? 'Kaydediliyor...' : initial ? 'Güncelle' : 'Sayı Oluştur'}
                </button>
                <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
                    İptal
                </button>
            </div>
        </form>
    );
};

export default IssueForm;
