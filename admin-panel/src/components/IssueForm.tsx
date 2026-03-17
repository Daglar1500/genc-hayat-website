import React, { useState, useRef } from 'react';
import { ArrowRight, Star, Upload } from 'lucide-react';
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

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        fetch(`${API_URL}/upload`, { method: 'POST', body: fd })
            .then(r => r.json())
            .then(d => { if (d.url) setForm(p => ({ ...p, coverMedia: { ...(p.coverMedia ?? { type: 'image', mediaLayout: 'full-width' }), src: d.url, alt: p.title ?? '' } })); })
            .catch(() => alert('Yükleme başarısız'))
            .finally(() => setUploading(false));
    };

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
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kapak Görseli</label>
                    <div className="flex gap-2">
                        <input value={form.coverMedia?.src ?? ''} onChange={e => setForm({ ...form, coverMedia: { ...(form.coverMedia ?? { type: 'image', mediaLayout: 'full-width' }), src: e.target.value } })} className="flex-1 p-2 border rounded-lg text-sm" placeholder="https://..." />
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-3 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-1 shrink-0">
                            <Upload size={14} />{uploading ? '...' : 'Yükle'}
                        </button>
                    </div>
                    {form.coverMedia?.src && (
                        <img src={form.coverMedia.src} alt="" className="mt-2 h-24 w-auto rounded-lg object-cover border" />
                    )}
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

export default IssueForm;
