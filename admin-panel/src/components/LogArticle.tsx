import React, { useState, useRef } from 'react';
import { X, Plus, Edit3, CheckSquare, Square, Image as ImageIcon } from 'lucide-react';
import type { Article, Category, ContentBlock } from '../types';
import { API_URL } from '../config';
import RichTextEditor from './RichTextEditor';

const generateSlug = (title: string) =>
    title.toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-');

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

    const slugTouched = useRef(false);

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
                                    onChange={e => {
                                        slugTouched.current = true;
                                        setFormData(prev => ({ ...prev, slug: e.target.value }));
                                    }}
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
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kapak Görseli</label>
                                    <input
                                        value={formData.imageUrl || ''}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full p-2 border rounded text-sm"
                                        placeholder="https://..."
                                    />
                                    <label className="mt-1 flex items-center gap-1 text-xs text-blue-600 cursor-pointer hover:underline">
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        <ImageIcon size={12} /> Dosya yükle
                                    </label>
                                </div>
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

export default LogArticle;
