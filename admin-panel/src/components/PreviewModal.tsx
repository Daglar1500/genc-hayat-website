import { useEffect, useState, useCallback } from 'react';
import { X, Edit3, Eye, MessageSquare, Check, FileText, CheckSquare, Square, Maximize2, Minimize2, MapPin, RefreshCw, User, Tag, GraduationCap, Hash, Type } from 'lucide-react';
import type { Article } from '../types';
import { API_URL } from '../config';

interface PreviewModalProps {
    article: Article;
    onClose: () => void;
    onMinimize: () => void;
    onEdit: (article: Article) => void;
    getCategoryColor: (name: string) => string;
}

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

type WindowState = 'normal' | 'maximized';

function caption(alt: string): string {
    if (!alt) return '';
    return `<div style="margin-top:6px;font-size:11px;color:#6b7280;"><span style="font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#374151;opacity:0.7;font-size:10px;">GÖRSEL:</span><span style="font-style:italic;margin-left:6px;opacity:0.9;">${alt}</span></div>`;
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
                return `<div style="display:flex;gap:16px;margin:16px 0;${dir}align-items:flex-start;"><div style="flex-shrink:0;width:220px;"><img src="${src}" alt="${alt}" style="width:100%;height:auto;border-radius:6px;display:block;" />${caption(alt)}</div><div style="flex:1;">${text}</div></div>`;
            }
            if (bc.type === 'image') {
                const layout = bc.mediaLayout || 'text-width';
                const widthStyle = layout === 'full-width' ? 'width:100%;' : 'max-width:100%;';
                const alt = bc.alt || '';
                return `<div style="margin:12px 0;"><img src="${bc.src}" alt="${alt}" style="${widthStyle}height:auto;border-radius:8px;display:block;" />${caption(alt)}</div>`;
            }
            if (bc.type === 'subheading') return `<h2>${bc.textContent || ''}</h2>`;
            return `<p>${bc.textContent || ''}</p>`;
        }
        if (b.type === 'paragraph') return `<p>${b.value}</p>`;
        if (b.type === 'subheading') return `<h2>${b.value}</h2>`;
        if (b.type === 'image') {
            const alt = b.alt || '';
            return `<div style="margin:12px 0;"><img src="${b.value}" style="max-width:100%;height:auto;border-radius:8px;display:block;" />${caption(alt)}</div>`;
        }
        return '';
    }).join('');
}

function countChars(article: Article): number {
    let text = '';
    if (article.subheading) text += article.subheading;
    if (article.content && Array.isArray(article.content)) {
        article.content.forEach((b: any) => {
            if (b.blockContent?.textContent) text += b.blockContent.textContent;
            else if (b.value) text += b.value;
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

const emptyStats: ArticleStats = { views: 0, commentCount: 0, unreadCount: 0, comments: [] };

export default function PreviewModal({ article, onClose, onMinimize, onEdit, getCategoryColor }: PreviewModalProps) {
    const [windowState, setWindowState] = useState<WindowState>('normal');
    const [stats, setStats] = useState<ArticleStats>(emptyStats);
    const [statsLoaded, setStatsLoaded] = useState(false);
    const [statsRefreshing, setStatsRefreshing] = useState(false);

    const loadStats = useCallback((quiet = false) => {
        if (!quiet) setStatsLoaded(false);
        setStatsRefreshing(true);
        fetch(`${API_URL}/stats`)
            .then(r => r.json())
            .then((data: any[]) => {
                const found = data.find((s: any) => s.id === article.id);
                setStats(found || emptyStats);
                setStatsLoaded(true);
                setStatsRefreshing(false);
            })
            .catch(() => { setStatsLoaded(true); setStatsRefreshing(false); });
    }, [article.id]);

    useEffect(() => { loadStats(); }, [loadStats]);

    const charCount = countChars(article);
    const htmlContent = article.text || (article.content ? renderContent(article.content as any[]) : '');
    const isEdited = article.status === 'edited';

    const markRead = (id: string) => {
        fetch(`${API_URL}/comments/${id}/read`, { method: 'PATCH' }).then(() => {
            setStats(prev => ({
                ...prev,
                comments: prev.comments.map(c => c.id === id ? { ...c, isRead: true } : c),
                unreadCount: Math.max(0, prev.unreadCount - 1),
            }));
        });
    };

    // Window controls — top-right
    const WindowControls = () => (
        <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setWindowState(windowState === 'maximized' ? 'normal' : 'maximized')} title={windowState === 'maximized' ? 'Küçült' : 'Büyüt'}
                className="w-5 h-5 rounded-full bg-green-400 hover:bg-green-500 flex items-center justify-center transition-colors group">
                <Maximize2 size={9} className="opacity-0 group-hover:opacity-100 text-green-900" />
            </button>
            <button type="button" onClick={onMinimize} title="Alta Al"
                className="w-5 h-5 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center transition-colors group">
                <Minimize2 size={9} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
            </button>
            <button type="button" onClick={onClose} title="Kapat"
                className="w-5 h-5 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center transition-colors group">
                <X size={9} className="opacity-0 group-hover:opacity-100 text-red-900" />
            </button>
        </div>
    );

    // Left panel: image at natural aspect ratio + meta below
    const LeftPanel = ({ wide = false }: { wide?: boolean }) => (
        <div className={`${wide ? 'w-80' : 'w-72'} shrink-0 flex flex-col border-r border-gray-100 dark:border-gray-800 overflow-y-auto`}>
            {/* Image — natural aspect ratio, no crop, no fixed height */}
            <div className="relative bg-gray-100 dark:bg-gray-800">
                {article.imageUrl
                    ? <img src={article.imageUrl} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    : (
                        <div style={{ width: '100%', paddingTop: '66%', position: 'relative' }}>
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-700">
                                <FileText size={40} />
                            </div>
                        </div>
                    )
                }
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 flex-wrap">
                    {stats.views > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                            <Eye size={9} /> {stats.views} görüntülenme
                        </span>
                    )}
                    {stats.unreadCount > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-white bg-amber-500/90 px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm">
                            <MessageSquare size={9} /> {stats.unreadCount} yeni yorum
                        </span>
                    )}
                </div>
            </div>

            {/* Meta — tüm fieldlar aynı formatta */}
            <div className="flex flex-col flex-1">

                {/* Yazar — mavi */}
                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <User size={16} className="text-blue-500" />
                    </div>
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-0.5">Yazar</div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{article.author}</div>
                    </div>
                </div>

                {/* Kategori — indigo */}
                {article.category && (
                    <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                            <Tag size={16} className="text-indigo-500" />
                        </div>
                        <div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-0.5">Kategori</div>
                            <span className="text-xs font-black px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: getCategoryColor(article.category) }}>
                                {article.category}
                            </span>
                        </div>
                    </div>
                )}

                {/* Okul / Kurum — cyan */}
                {article.school && (
                    <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
                            <GraduationCap size={16} className="text-cyan-500" />
                        </div>
                        <div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-cyan-400 mb-0.5">Okul / Kurum</div>
                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{article.school}</div>
                        </div>
                    </div>
                )}

                {/* Şehir / Mahalle — turuncu */}
                {article.place && (
                    <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                            <MapPin size={16} className="text-orange-500" />
                        </div>
                        <div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-orange-400 mb-0.5">Şehir / Mahalle</div>
                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{article.place}</div>
                        </div>
                    </div>
                )}

                {/* Sayı — mor */}
                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                        <Hash size={16} className="text-violet-500" />
                    </div>
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-violet-400 mb-0.5">Sayı</div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">#{article.issueNumber}</div>
                    </div>
                </div>

                {/* Karakter — slate */}
                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Type size={16} className="text-slate-500" />
                    </div>
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Karakter</div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{charCount.toLocaleString('tr')}</div>
                    </div>
                </div>

                {/* Durum — yeşil / kırmızı */}
                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isEdited ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {isEdited ? <CheckSquare size={16} className="text-emerald-500" /> : <Square size={16} className="text-red-500" />}
                    </div>
                    <div>
                        <div className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${isEdited ? 'text-emerald-400' : 'text-red-400'}`}>Durum</div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{isEdited ? 'Düzenlendi' : 'Henüz Düzenlenmedi'}</div>
                    </div>
                </div>

                {/* Etiketler */}
                {article.labels && article.labels.length > 0 && (
                    <div className="px-4 py-3.5">
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Etiketler</div>
                        <div className="flex flex-wrap gap-1.5">
                            {article.labels.map(l => (
                                <span key={l} className="text-[10px] px-2.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full font-semibold">{l}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Right panel: content + comments (always shown)
    const RightContent = () => (
        <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight mb-2">{article.title}</h2>

            {article.subheading && (
                <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-4 border-l-2 border-gray-200 dark:border-gray-700 pl-3">{article.subheading}</p>
            )}

            {/* Full article content — images use natural aspect ratio via CSS */}
            <div
                className="prose prose-sm max-w-none text-gray-800 dark:text-gray-300 leading-relaxed
                    [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
                    [&_p]:mb-2 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:mb-1
                    [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2 [&_img]:block"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Comments — always rendered */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                        <MessageSquare size={13} className="text-gray-400" />
                        Okur Yorumları
                        {stats.commentCount > 0 && (
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">{stats.commentCount}</span>
                        )}
                    </h3>
                    <div className="flex items-center gap-1">
                        {stats.comments.length > 0 && (
                            <button
                                onClick={() => exportCommentsAsDoc(article, stats.comments)}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline px-2 py-1 rounded"
                            >
                                <FileText size={11} /> Word
                            </button>
                        )}
                        <button
                            onClick={() => loadStats(true)}
                            title="Yorumları yenile"
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        >
                            <RefreshCw size={12} className={statsRefreshing ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
                {!statsLoaded ? (
                    <p className="text-sm text-gray-400 italic py-2 text-center">Yükleniyor...</p>
                ) : stats.comments.length === 0 ? (
                    <p className="text-sm text-gray-400 italic py-2 text-center">Henüz yorum yok.</p>
                ) : (
                    <div className="space-y-2">
                        {stats.comments.map(c => (
                            <div key={c.id} className={`flex items-start gap-2 p-2.5 rounded-lg text-sm ${c.isRead ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700'}`}>
                                <div className="flex-1 min-w-0">
                                    <p className={`leading-relaxed text-xs ${c.isRead ? '' : 'font-medium text-gray-800 dark:text-gray-200'}`}>{c.text}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {new Date(c.createdAt).toLocaleDateString('tr-TR')} {new Date(c.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                {!c.isRead && (
                                    <button onClick={() => markRead(c.id)} className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 shrink-0">
                                        <Check size={11} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // ── MAXIMIZED ─────────────────────────────────────────────────────
    if (windowState === 'maximized') {
        return (
            <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate pr-4">{article.title}</span>
                    <div className="flex items-center gap-3 shrink-0">
                        {stats.views > 0 && (
                            <span className="flex items-center gap-1 text-xs text-gray-400"><Eye size={12} /> {stats.views}</span>
                        )}
                        {stats.unreadCount > 0 && (
                            <span className="flex items-center gap-1 text-xs font-medium text-amber-600"><MessageSquare size={12} /> {stats.unreadCount} yeni</span>
                        )}
                        <button onClick={() => { onEdit(article); onClose(); }}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center gap-1">
                            <Edit3 size={12} /> Düzenle
                        </button>
                        <WindowControls />
                    </div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <LeftPanel wide />
                    <RightContent />
                </div>
            </div>
        );
    }

    // ── NORMAL ────────────────────────────────────────────────────────
    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                style={{ height: 'min(90vh, 820px)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Title bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 pr-4">{article.title}</span>
                    <div className="flex items-center gap-3 shrink-0">
                        {stats.unreadCount > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
                                <MessageSquare size={11} /> {stats.unreadCount} yeni yorum
                            </span>
                        )}
                        <WindowControls />
                    </div>
                </div>

                {/* Two-column body */}
                <div className="flex flex-1 overflow-hidden">
                    <LeftPanel />
                    <RightContent />
                </div>

                {/* Bottom bar */}
                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex gap-2 justify-end shrink-0 bg-gray-50 dark:bg-gray-800/50">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        Kapat
                    </button>
                    <button onClick={() => { onEdit(article); onClose(); }}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1">
                        <Edit3 size={14} /> Düzenle
                    </button>
                </div>
            </div>
        </div>
    );
}
