import React, { useEffect, useState } from 'react';
import { X, Edit3, Eye, MessageSquare, Check, FileText, Type, CheckSquare, Square, Maximize2, Minimize2, MapPin } from 'lucide-react';
import type { Article } from '../types';
import { API_URL } from '../config';

interface Comment {
    id: string;
    articleId: string;
    text: string;
    createdAt: number;
    isRead: boolean;
}

interface ArticleStats {
    views: number;
    commentCount: number;
    unreadCount: number;
    comments: Comment[];
}

function renderContent(content: any[]): string {
    if (!Array.isArray(content)) return '';
    return content.map(b => {
        if (b.blockContent) {
            const bc = b.blockContent;
            if (b.blockLayout === 'left-side' || b.blockLayout === 'right-side') {
                const src = b.media?.src || '';
                const alt = b.media?.alt || '';
                const text = bc.textContent || '';
                const dir = b.blockLayout === 'right-side' ? 'flex-direction:row-reverse;' : '';
                return `<div style="display:flex;gap:16px;margin:16px 0;${dir}align-items:flex-start;"><img src="${src}" alt="${alt}" style="width:200px;height:150px;object-fit:cover;border-radius:6px;flex-shrink:0;" /><div style="flex:1;">${text}</div></div>`;
            }
            if (bc.type === 'image') {
                const layout = bc.mediaLayout || 'text-width';
                const style = layout === 'full-width' ? 'width:100%;' : 'max-width:100%;';
                return `<img src="${bc.src}" alt="${bc.alt || ''}" style="${style}border-radius:8px;margin:12px 0;" />`;
            }
            if (bc.type === 'subheading') return `<h2>${bc.textContent || ''}</h2>`;
            return `<p>${bc.textContent || ''}</p>`;
        }
        if (b.type === 'paragraph') return `<p>${b.value}</p>`;
        if (b.type === 'subheading') return `<h2>${b.value}</h2>`;
        if (b.type === 'image') return `<img src="${b.value}" style="max-width:100%;border-radius:8px;margin:12px 0;" />`;
        return '';
    }).join('');
}

function countChars(article: Article): number {
    let text = '';
    if (article.subheading) text += article.subheading;
    if (article.content && Array.isArray(article.content)) {
        article.content.forEach((b: any) => {
            if (b.blockContent) {
                if (b.blockContent.textContent) text += b.blockContent.textContent;
            } else if (b.value) {
                text += b.value;
            }
        });
    } else if (article.text) {
        text += article.text.replace(/<[^>]+>/g, '');
    }
    return text.replace(/\s+/g, ' ').trim().length;
}

function exportCommentsAsDoc(article: Article, comments: Comment[]) {
    const rows = comments.map(c => {
        const date = new Date(c.createdAt).toLocaleDateString('tr-TR');
        const time = new Date(c.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        return `<tr><td style="padding:6px 10px;border:1px solid #ddd;width:130px;white-space:nowrap;font-size:12px;color:#666;">${date} ${time}</td><td style="padding:6px 10px;border:1px solid #ddd;font-size:13px;">${c.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td></tr>`;
    }).join('');
    const html = `<html><head><meta charset="utf-8"></head><body>
<h2 style="font-family:Arial;font-size:16px;">${article.title} — Kullanıcı Yorumları</h2>
<p style="font-family:Arial;font-size:12px;color:#888;">Toplam ${comments.length} yorum • Dışa aktarım: ${new Date().toLocaleDateString('tr-TR')}</p>
<table style="font-family:Arial;border-collapse:collapse;width:100%;margin-top:12px;">
<thead><tr><th style="padding:6px 10px;border:1px solid #ddd;background:#f5f5f5;font-size:12px;text-align:left;">Tarih</th><th style="padding:6px 10px;border:1px solid #ddd;background:#f5f5f5;font-size:12px;text-align:left;">Yorum</th></tr></thead>
<tbody>${rows}</tbody>
</table></body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `yorumlar-${article.id}.doc`;
    link.click();
}

type WindowState = 'normal' | 'maximized' | 'minimized';

const ReadArticle = ({ article, onClose, onEdit }: { article: Article | null; onClose: () => void; onEdit: () => void }) => {
    const [stats, setStats] = useState<ArticleStats | null>(null);
    const [windowState, setWindowState] = useState<WindowState>('normal');

    useEffect(() => {
        if (!article) return;
        fetch(`${API_URL}/stats`)
            .then(r => r.json())
            .then((data: any[]) => {
                const found = data.find(s => s.id === article.id);
                if (found) setStats(found);
            })
            .catch(() => {});
    }, [article?.id]);

    if (!article) return null;

    const charCount = countChars(article);
    const htmlContent = article.text || (article.content ? renderContent(article.content as any[]) : '');
    const isEdited = article.status === 'edited';

    // Minimized: tab bar at bottom
    if (windowState === 'minimized') {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch bg-white border-t border-gray-200 shadow-lg h-9">
                <button
                    onClick={() => setWindowState('normal')}
                    className="flex items-center gap-2 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-r border-gray-200 max-w-xs"
                >
                    <span className="truncate">{article.title}</span>
                </button>
                <button
                    onClick={onClose}
                    className="ml-auto flex items-center px-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    title="Kapat"
                >
                    <X size={14} />
                </button>
            </div>
        );
    }

    const isMaximized = windowState === 'maximized';

    if (isMaximized) {
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto">
                {/* Window controls strip */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b bg-white shrink-0">
                    <span className="text-sm font-medium text-gray-400 truncate pr-4">{article.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                        {stats && (
                            <>
                                <span className="flex items-center gap-1 text-xs text-gray-400 mr-1">
                                    <Eye size={12} /> {stats.views}
                                </span>
                                <span className={`flex items-center gap-1 text-xs font-medium mr-2 ${stats.unreadCount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                    <MessageSquare size={12} /> {stats.unreadCount > 0 ? `${stats.unreadCount} yeni` : stats.commentCount}
                                </span>
                            </>
                        )}
                        <button type="button" onClick={onEdit}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center gap-1 mr-2">
                            <Edit3 size={12} /> Düzenle
                        </button>
                        <button type="button" onClick={() => setWindowState('normal')} title="Küçült"
                            className="w-5 h-5 rounded-full bg-green-400 hover:bg-green-500 transition-colors flex items-center justify-center group">
                            <Maximize2 size={9} className="opacity-0 group-hover:opacity-100 text-green-900" />
                        </button>
                        <button type="button" onClick={() => setWindowState('minimized')} title="Alta Al"
                            className="w-5 h-5 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors flex items-center justify-center group">
                            <Minimize2 size={9} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
                        </button>
                        <button type="button" onClick={onClose} title="Kapat"
                            className="w-5 h-5 rounded-full bg-red-400 hover:bg-red-500 transition-colors flex items-center justify-center group">
                            <X size={9} className="opacity-0 group-hover:opacity-100 text-red-900" />
                        </button>
                    </div>
                </div>
                <ArticleBody article={article} htmlContent={htmlContent} charCount={charCount} isEdited={isEdited} stats={stats} onEdit={onEdit} exportFn={exportCommentsAsDoc} markRead={(id) => {
                    fetch(`${API_URL}/comments/${id}/read`, { method: 'PATCH' }).then(() => {
                        setStats(prev => prev ? {
                            ...prev,
                            comments: prev.comments.map(c => c.id === id ? { ...c, isRead: true } : c),
                            unreadCount: Math.max(0, prev.unreadCount - 1),
                        } : prev);
                    });
                }} />
            </div>
        );
    }

    // Normal: compact card like original PreviewModal
    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Cover image with window controls overlay */}
                <div className="relative h-52 shrink-0 bg-gray-200">
                    {article.imageUrl
                        ? <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    }
                    {/* Window controls — top right over image */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button type="button" onClick={(e) => { e.stopPropagation(); setWindowState('maximized'); }} title="Tam Ekran"
                            className="w-5 h-5 rounded-full bg-green-400 hover:bg-green-500 transition-colors flex items-center justify-center group shadow">
                            <Maximize2 size={9} className="opacity-0 group-hover:opacity-100 text-green-900" />
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setWindowState('minimized'); }} title="Alta Al"
                            className="w-5 h-5 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors flex items-center justify-center group shadow">
                            <Minimize2 size={9} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} title="Kapat"
                            className="w-5 h-5 rounded-full bg-red-400 hover:bg-red-500 transition-colors flex items-center justify-center group shadow">
                            <X size={9} className="opacity-0 group-hover:opacity-100 text-red-900" />
                        </button>
                    </div>
                    {/* Stats overlay — top left */}
                    {stats && (
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-white bg-black/40 px-2 py-0.5 rounded-full">
                                <Eye size={11} /> {stats.views}
                            </span>
                            {stats.unreadCount > 0 && (
                                <span className="flex items-center gap-1 text-xs text-white bg-amber-500/80 px-2 py-0.5 rounded-full font-medium">
                                    <MessageSquare size={11} /> {stats.unreadCount} yeni
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 p-5">
                    {/* Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {article.category && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                {article.category}
                            </span>
                        )}
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isEdited ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {isEdited ? 'Düzenlenmiş' : 'Düzenlenmemiş'}
                        </span>
                        {article.issueNumber && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Sayı #{article.issueNumber}</span>
                        )}
                    </div>

                    <h2 className="text-xl font-black text-gray-900 leading-tight mb-1">{article.title}</h2>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                        <span className="font-semibold text-gray-700">{article.author}</span>
                        {article.school && <span className="text-blue-600 font-semibold">{article.school}</span>}
                        {article.place && <span className="flex items-center gap-0.5"><MapPin size={11} />{article.place}</span>}
                    </div>

                    {article.subheading && (
                        <p className="text-sm italic text-gray-600 mb-4 border-l-2 border-gray-200 pl-3">{article.subheading}</p>
                    )}

                    <div
                        className="prose prose-sm max-w-none text-gray-800 leading-relaxed
                            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
                            [&_p]:mb-2 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:mb-1
                            [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2
                            [&_a]:text-blue-600 [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />

                    {/* Admin-only dashed section */}
                    <div className="mt-6 pt-3 border-t border-dashed border-gray-300">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <Type size={11} /> {charCount.toLocaleString('tr-TR')} karakter
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium ${isEdited ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                                {isEdited ? <CheckSquare size={11} /> : <Square size={11} />}
                                {isEdited ? 'Düzenlendi' : 'Düzenlenmedi'}
                            </span>
                        </div>
                    </div>

                    {/* Comments */}
                    {stats && (
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                    <MessageSquare size={13} className="text-gray-400" />
                                    Kullanıcı Yorumları
                                    {stats.commentCount > 0 && (
                                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{stats.commentCount}</span>
                                    )}
                                </h3>
                                {stats.comments.length > 0 && (
                                    <button
                                        onClick={() => exportCommentsAsDoc(article, stats.comments)}
                                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline px-2 py-1 rounded"
                                    >
                                        <FileText size={11} /> Word olarak indir
                                    </button>
                                )}
                            </div>
                            {stats.comments.length === 0 ? (
                                <p className="text-sm text-gray-400 italic py-2 text-center">Henüz yorum yok.</p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {stats.comments.map(c => (
                                        <div key={c.id} className={`flex items-start gap-2 p-2.5 rounded-lg text-sm ${c.isRead ? 'bg-gray-50 text-gray-600' : 'bg-amber-50 border border-amber-200'}`}>
                                            <div className="flex-1 min-w-0">
                                                <p className={`leading-relaxed text-xs ${c.isRead ? '' : 'font-medium text-gray-800'}`}>{c.text}</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">
                                                    {new Date(c.createdAt).toLocaleDateString('tr-TR')} {new Date(c.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {!c.isRead && (
                                                <button onClick={() => {
                                                    fetch(`${API_URL}/comments/${c.id}/read`, { method: 'PATCH' }).then(() => {
                                                        setStats(prev => prev ? {
                                                            ...prev,
                                                            comments: prev.comments.map(cm => cm.id === c.id ? { ...cm, isRead: true } : cm),
                                                            unreadCount: Math.max(0, prev.unreadCount - 1),
                                                        } : prev);
                                                    });
                                                }} className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 shrink-0" title="Okundu işaretle">
                                                    <Check size={11} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom actions */}
                <div className="px-5 py-3 border-t flex gap-2 justify-end shrink-0 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-50">
                        Kapat
                    </button>
                    <button onClick={onEdit} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1">
                        <Edit3 size={13} /> Düzenle
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper for maximized view body — avoids repeating the article body JSX
function ArticleBody({ article, htmlContent, charCount, isEdited, stats, onEdit, exportFn, markRead }: {
    article: Article; htmlContent: string; charCount: number; isEdited: boolean;
    stats: ArticleStats | null; onEdit: () => void;
    exportFn: (a: Article, c: Comment[]) => void;
    markRead: (id: string) => void;
}) {
    return (
        <div className="overflow-y-auto flex-1 max-w-3xl mx-auto w-full px-8 py-6">
            {article.imageUrl && (
                <div className="h-56 rounded-xl overflow-hidden mb-6">
                    <img src={article.imageUrl} className="w-full h-full object-cover" alt={article.title} />
                </div>
            )}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {article.category && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">{article.category}</span>
                )}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isEdited ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {isEdited ? 'Düzenlenmiş' : 'Düzenlenmemiş'}
                </span>
                {article.issueNumber && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Sayı #{article.issueNumber}</span>
                )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
            {article.subheading && <p className="text-lg text-gray-500 font-medium mb-5 leading-relaxed">{article.subheading}</p>}
            {article.school && <div className="text-sm text-blue-600 font-semibold mb-1">{article.school}</div>}
            <div className="flex justify-between items-center text-sm text-gray-500 mb-6 pb-4 border-b">
                <span>{article.author}{article.place ? ` • ${article.place}` : ''}</span>
                <span className="text-xs text-gray-400">Sayı {article.issueNumber}</span>
            </div>
            <div
                className="prose prose-sm max-w-none text-gray-800 leading-relaxed
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2
                    [&_p]:mb-3 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:mb-1
                    [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3
                    [&_a]:text-blue-600 [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            <div className="mt-8 pt-4 border-t border-dashed border-gray-300">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Type size={12} /> {charCount.toLocaleString('tr-TR')} karakter</span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium ${isEdited ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                        {isEdited ? <CheckSquare size={12} /> : <Square size={12} />}
                        {isEdited ? 'Düzenlendi' : 'Düzenlenmedi'}
                    </span>
                </div>
            </div>
            {stats && (
                <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                            <MessageSquare size={14} className="text-gray-400" />
                            Kullanıcı Yorumları
                            {stats.commentCount > 0 && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{stats.commentCount}</span>}
                        </h3>
                        {stats.comments.length > 0 && (
                            <button onClick={() => exportFn(article, stats.comments)}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:underline px-2 py-1 rounded">
                                <FileText size={12} /> Word olarak indir
                            </button>
                        )}
                    </div>
                    {stats.comments.length === 0 ? (
                        <p className="text-sm text-gray-400 italic py-3 text-center">Henüz yorum yok.</p>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {stats.comments.map(c => (
                                <div key={c.id} className={`flex items-start gap-2.5 p-3 rounded-lg text-sm ${c.isRead ? 'bg-gray-50 text-gray-600' : 'bg-amber-50 border border-amber-200'}`}>
                                    <div className="flex-1 min-w-0">
                                        <p className={`leading-relaxed ${c.isRead ? '' : 'font-medium text-gray-800'}`}>{c.text}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            {new Date(c.createdAt).toLocaleDateString('tr-TR')} {new Date(c.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {!c.isRead && (
                                        <button onClick={() => markRead(c.id)} className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 shrink-0">
                                            <Check size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ReadArticle;
