import React from 'react';
import { X, Edit3 } from 'lucide-react';
import type { Article } from '../types';

const ReadArticle = ({ article, onClose, onEdit }: { article: Article | null; onClose: () => void; onEdit: () => void }) => {
    if (!article) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-xl shadow-2xl relative flex flex-col overflow-hidden">

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

export default ReadArticle;
