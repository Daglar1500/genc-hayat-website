import { useState } from 'react';
import { Eye, MessageSquare, Check, RefreshCw, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { WEBSITE_URL } from '../config';
import type { ArticleStat } from '../types';

interface StatsViewProps {
    stats: ArticleStat[];
    isLoading: boolean;
    isRefreshing: boolean;
    onRefresh: () => void;
    onMarkRead: (commentId: string, articleId: string) => void;
}

export default function StatsView({ stats, isLoading, isRefreshing, onRefresh, onMarkRead }: StatsViewProps) {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [issueFilter, setIssueFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'views' | 'comments' | 'unread'>('views');

    const issues = Array.from(new Set(stats.map(a => String(a.issueNumber))))
        .sort((a, b) => Number(b) - Number(a));

    const filtered = stats
        .filter(a => issueFilter === 'all' || String(a.issueNumber) === issueFilter)
        .sort((a, b) => {
            if (sortBy === 'views') return b.views - a.views;
            if (sortBy === 'comments') return b.commentCount - a.commentCount;
            return b.unreadCount - a.unreadCount;
        });

    const maxViews = Math.max(...filtered.map(a => a.views), 1);

    const totalViews = filtered.reduce((s, a) => s + a.views, 0);
    const totalComments = filtered.reduce((s, a) => s + a.commentCount, 0);
    const totalUnread = filtered.reduce((s, a) => s + a.unreadCount, 0);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Toplam Görüntülenme', value: totalViews, icon: <Eye size={18} />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Toplam Yorum', value: totalComments, icon: <MessageSquare size={18} />, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                    { label: 'Okunmamış Yorum', value: totalUnread, icon: <MessageSquare size={18} />, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                ].map(card => (
                    <div key={card.label} className={`${card.bg} rounded-xl p-4 flex items-center gap-3`}>
                        <div className={card.color}>{card.icon}</div>
                        <div>
                            <div className={`text-2xl font-black ${card.color}`}>{card.value}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
                <select
                    value={issueFilter}
                    onChange={e => setIssueFilter(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="all">Tüm Sayılar</option>
                    {issues.map(n => <option key={n} value={n}>Sayı {n}</option>)}
                </select>
                <div className="flex gap-1">
                    {(['views', 'comments', 'unread'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setSortBy(s)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${sortBy === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            {s === 'views' ? 'Görüntülenme' : s === 'comments' ? 'Yorum' : 'Okunmamış'}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onRefresh}
                    className="ml-auto p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Yenile"
                >
                    <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Article list */}
            {isLoading ? (
                <div className="py-20 text-center text-gray-400 dark:text-gray-600">Yükleniyor...</div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-gray-400 dark:text-gray-600">Veri bulunamadı.</div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((stat, idx) => (
                        <div key={stat.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                            {/* Row */}
                            <div
                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                                onClick={() => setExpanded(expanded === stat.id ? null : stat.id)}
                            >
                                <div className="w-7 text-center text-sm font-black text-gray-300 dark:text-gray-700 shrink-0">{idx + 1}</div>
                                <img src={stat.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100 dark:bg-gray-800" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 flex-1">{stat.title}</div>
                                        <a href={`${WEBSITE_URL}/articles/${stat.id}`} target="_blank" rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()}
                                            className="shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
                                            title="Websitede Aç">
                                            <ExternalLink size={11} />
                                        </a>
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-2">
                                        <span>{stat.author}</span>
                                        <span>·</span>
                                        <span>Sayı {stat.issueNumber}</span>
                                        {stat.category && (
                                            <>
                                                <span>·</span>
                                                <span className="text-gray-500 dark:text-gray-400">{stat.category}</span>
                                            </>
                                        )}
                                    </div>
                                    {/* View bar */}
                                    <div className="mt-1.5 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden w-full max-w-xs">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${(stat.views / maxViews) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                {/* Stats badges */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <Eye size={12} /> {stat.views}
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-medium ${stat.unreadCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-600'}`}>
                                        <MessageSquare size={12} />
                                        {stat.unreadCount > 0 ? `${stat.unreadCount} yeni` : stat.commentCount || '—'}
                                    </div>
                                </div>
                                {expanded === stat.id
                                    ? <ChevronUp size={14} className="text-gray-400 shrink-0" />
                                    : <ChevronDown size={14} className="text-gray-400 shrink-0" />
                                }
                            </div>

                            {/* Comments panel */}
                            {expanded === stat.id && (
                                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 px-4 py-3">
                                    {stat.comments.length === 0 ? (
                                        <p className="text-sm text-gray-400 dark:text-gray-600 italic py-2 text-center">
                                            Henüz yorum yok.
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {stat.comments.map(c => (
                                                <div
                                                    key={c.id}
                                                    className={`flex items-start gap-2.5 p-3 rounded-lg text-sm ${c.isRead
                                                        ? 'bg-white dark:bg-gray-800/40 text-gray-600 dark:text-gray-400'
                                                        : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50'}`}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`leading-relaxed ${c.isRead ? '' : 'font-medium text-gray-800 dark:text-gray-200'}`}>
                                                            {c.text}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">
                                                            {new Date(c.createdAt).toLocaleDateString('tr-TR')}
                                                            {' '}
                                                            {new Date(c.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    {!c.isRead && (
                                                        <button
                                                            onClick={() => onMarkRead(c.id, stat.id)}
                                                            className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors shrink-0"
                                                            title="Okundu işaretle"
                                                        >
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
                    ))}
                </div>
            )}
        </div>
    );
}
