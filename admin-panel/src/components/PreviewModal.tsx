import React from 'react';
import { X, Edit3, MapPin } from 'lucide-react';
import type { Article } from '../types';

interface PreviewModalProps {
    article: Article;
    onClose: () => void;
    onEdit: (article: Article) => void;
    getCategoryColor: (name: string) => string;
}

export default function PreviewModal({ article, onClose, onEdit, getCategoryColor }: PreviewModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Cover image */}
                <div className="relative h-52 shrink-0 bg-gray-200">
                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
                {/* Content */}
                <div className="p-5 overflow-y-auto flex-1">
                    {/* Category + status pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: getCategoryColor(article.category) }}>
                            {article.category}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${article.status === 'edited' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {article.status === 'edited' ? 'Düzenlenmiş' : 'Düzenlenmemiş'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Sayı #{article.issueNumber}</span>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight mb-1">{article.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                        <span className="font-semibold text-gray-700">{article.author}</span>
                        {article.school && <span className="text-blue-600 font-semibold">{article.school}</span>}
                        {article.place && <span className="flex items-center gap-0.5"><MapPin size={11} />{article.place}</span>}
                    </div>
                    {article.subheading && (
                        <p className="text-sm italic text-gray-600 mb-3 border-l-2 border-gray-200 pl-3">{article.subheading}</p>
                    )}
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">
                        {article.content
                            ? article.content.filter(b => b.type === 'paragraph').slice(0, 2).map(b => b.value).join(' ').slice(0, 300)
                            : (article.text || '').replace(/<[^>]+>/g, '').slice(0, 300)
                        }{((article.content ? article.content.filter(b => b.type === 'paragraph').slice(0, 2).map(b => b.value).join(' ').length : (article.text || '').replace(/<[^>]+>/g, '').length) > 300) ? '…' : ''}
                    </p>
                </div>
                {/* Actions */}
                <div className="px-5 py-3 border-t flex gap-2 justify-end shrink-0 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-50"
                    >
                        Kapat
                    </button>
                    <button
                        onClick={() => { onEdit(article); onClose(); }}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    >
                        <Edit3 size={14} /> Düzenle
                    </button>
                </div>
            </div>
        </div>
    );
}
