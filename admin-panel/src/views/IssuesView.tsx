import React, { useState, useMemo } from 'react';
import { Plus, X, Edit3, Trash2, BookOpen, Star, ArrowRight, ChevronDown, ChevronUp, AlertCircle, Download } from 'lucide-react';
import type { Article, Issue } from '../types';
import IssueForm from '../components/IssueForm';
import { API_URL } from '../config';

interface IssuesViewProps {
    issues: Issue[];
    setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
    selectedIssue: Issue | null;
    setSelectedIssue: (issue: Issue | null) => void;
    issueFormOpen: boolean;
    setIssueFormOpen: (open: boolean) => void;
    loggedArticles: Article[];
    setLoggedArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

export default function IssuesView({
    issues, setIssues,
    selectedIssue, setSelectedIssue,
    issueFormOpen, setIssueFormOpen,
    loggedArticles, setLoggedArticles,
}: IssuesViewProps) {
    const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [importing, setImporting] = useState(false);

    // issueNumbers in articles that don't have a matching Issue record
    const orphanIssueNumbers = useMemo(() => {
        const existingNumbers = new Set(issues.map(i => i.number.toString()));
        const articleNumbers = new Set(
            loggedArticles.map(a => a.issueNumber).filter(Boolean) as string[]
        );
        return [...articleNumbers].filter(n => !existingNumbers.has(n)).sort((a, b) => Number(b) - Number(a));
    }, [issues, loggedArticles]);

    // Create Issue records for all orphan issueNumbers from article library
    const importOrphanIssues = async () => {
        if (!orphanIssueNumbers.length) return;
        setImporting(true);
        const created: Issue[] = [];
        for (const numStr of orphanIssueNumbers) {
            const num = Number(numStr);
            const arts = loggedArticles.filter(a => a.issueNumber === numStr);
            const body = {
                id: `issue-${numStr}`,
                title: `Sayı ${numStr}`,
                number: num,
                date: new Date().toISOString().slice(0, 10),
                sunuArticleId: arts.find(a => a.type === 'sunu')?.id ?? '',
                rotaArticleId: arts.find(a => a.type === 'rota')?.id ?? '',
                recommendedArticleIds: arts.filter(a => a.type === 'featured').map(a => a.id),
                otherArticleIds: arts.filter(a => !a.type || a.type === 'normal').map(a => a.id),
            };
            try {
                const res = await fetch(`${API_URL}/issues`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const iss: Issue = await res.json();
                created.push(iss);
            } catch {
                // continue with next
            }
        }
        setIssues(prev => {
            const existingIds = new Set(prev.map(i => i.id));
            return [...created.filter(i => !existingIds.has(i.id)), ...prev];
        });
        setImporting(false);
    };

    // After saving an issue, sync issueNumber on articles in the library
    const syncArticleIssueNumbers = async (savedIssue: Issue, prevIssue: Issue | null) => {
        const issueNumber = savedIssue.number.toString();

        const newIds = new Set([
            savedIssue.sunuArticleId,
            savedIssue.rotaArticleId,
            ...(savedIssue.recommendedArticleIds ?? []),
            ...(savedIssue.otherArticleIds ?? []),
        ].filter(Boolean) as string[]);

        // Articles removed from the issue (only clear if they carry this issue's number)
        const oldIds = prevIssue ? new Set([
            prevIssue.sunuArticleId,
            prevIssue.rotaArticleId,
            ...(prevIssue.recommendedArticleIds ?? []),
            ...(prevIssue.otherArticleIds ?? []),
        ].filter(Boolean) as string[]) : new Set<string>();
        const removedIds = [...oldIds].filter(id => !newIds.has(id));

        setSyncing(true);
        const updates: Promise<any>[] = [];

        newIds.forEach(id => {
            const art = loggedArticles.find(a => a.id === id);
            if (!art || art.issueNumber === issueNumber) return;
            updates.push(
                fetch(`${API_URL}/articles/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...art, issueNumber }),
                })
            );
        });

        removedIds.forEach(id => {
            const art = loggedArticles.find(a => a.id === id);
            if (!art || art.issueNumber !== issueNumber) return;
            updates.push(
                fetch(`${API_URL}/articles/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...art, issueNumber: '' }),
                })
            );
        });

        await Promise.all(updates);

        // Update library state client-side
        setLoggedArticles(prev => prev.map(a => {
            if (newIds.has(a.id)) return { ...a, issueNumber };
            if (removedIds.has(a.id) && a.issueNumber === issueNumber) return { ...a, issueNumber: '' };
            return a;
        }));

        setSyncing(false);
    };

    // Resolve article IDs from the library (single source of truth)
    const resolve = (id: string | undefined): Article | undefined =>
        id ? loggedArticles.find(a => a.id === id) : undefined;

    const resolveMany = (ids: string[]): Article[] =>
        ids.map(id => loggedArticles.find(a => a.id === id)).filter(Boolean) as Article[];

    // Articles not assigned to any issue
    const assignedIds = new Set(
        issues.flatMap(i => [
            i.sunuArticleId,
            i.rotaArticleId,
            ...(i.recommendedArticleIds ?? []),
            ...(i.otherArticleIds ?? []),
        ].filter(Boolean) as string[])
    );
    const unassignedArticles = loggedArticles.filter(a => !assignedIds.has(a.id));

    const sorted = [...issues].sort((a, b) => b.number - a.number);

    return (
        <div className="max-w-5xl mx-auto pb-20 px-2 mt-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <BookOpen className="text-purple-600" /> Sayı Yönetimi
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {issues.length} sayı · {loggedArticles.length} makale
                        {unassignedArticles.length > 0 && (
                            <span className="ml-2 text-amber-500 font-medium inline-flex items-center gap-1">
                                <AlertCircle size={12} /> {unassignedArticles.length} makale atanmamış
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {syncing && (
                        <span className="text-xs text-purple-500 flex items-center gap-1.5">
                            <span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin inline-block" />
                            Senkronize ediliyor...
                        </span>
                    )}
                    <button
                        onClick={() => { setSelectedIssue(null); setIssueFormOpen(true); }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={16} /> Yeni Sayı
                    </button>
                </div>
            </div>

            {/* Orphan issueNumbers banner */}
            {orphanIssueNumbers.length > 0 && (
                <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <AlertCircle size={15} className="text-blue-600 shrink-0" />
                                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                                    Haber kütüphanesinde kayıt dışı sayılar var
                                </span>
                            </div>
                            <p className="text-xs text-blue-500 mb-2">
                                Aşağıdaki sayı numaraları makalelerde mevcut ama Sayılar sekmesinde kayıtlı değil.
                                İçe aktar butonu ile otomatik oluşturulabilir.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {orphanIssueNumbers.map(n => {
                                    const count = loggedArticles.filter(a => a.issueNumber === n).length;
                                    return (
                                        <span key={n} className="text-xs px-2 py-1 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 rounded-lg text-blue-700 dark:text-blue-400 font-medium">
                                            Sayı {n} <span className="text-blue-400">({count} makale)</span>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        <button
                            onClick={importOrphanIssues}
                            disabled={importing}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 shrink-0 transition-colors"
                        >
                            <Download size={14} />
                            {importing ? 'İçe Aktarılıyor...' : `${orphanIssueNumbers.length} Sayıyı İçe Aktar`}
                        </button>
                    </div>
                </div>
            )}

            {/* Unassigned articles warning */}
            {unassignedArticles.length > 0 && (
                <div className="mb-5 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={15} className="text-amber-600" />
                        <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Herhangi bir sayıya atanmamış makaleler</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {unassignedArticles.slice(0, 12).map(a => (
                            <span key={a.id} className="text-xs px-2 py-1 bg-white dark:bg-gray-900 border border-amber-200 rounded-lg text-gray-600 dark:text-gray-400 truncate max-w-48">
                                {a.title}
                            </span>
                        ))}
                        {unassignedArticles.length > 12 && (
                            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-lg font-medium">
                                +{unassignedArticles.length - 12} daha
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Issue Form Modal */}
            {issueFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-purple-50 dark:bg-purple-950/40">
                            <div>
                                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">
                                    {selectedIssue ? 'Sayıyı Düzenle' : 'Yeni Sayı Oluştur'}
                                </h3>
                                <p className="text-xs text-purple-500 mt-0.5">{loggedArticles.length} makale kütüphanede</p>
                            </div>
                            <button onClick={() => setIssueFormOpen(false)} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                                <X size={18} />
                            </button>
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
                                syncArticleIssueNumbers(iss, selectedIssue);
                                setIssueFormOpen(false);
                                setSelectedIssue(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Issue List */}
            {issues.length === 0 && (
                <div className="text-center text-gray-400 py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    Henüz sayı yok. Yeni sayı ekleyin.
                </div>
            )}
            <div className="space-y-3">
                {sorted.map(iss => {
                    const sunuArt = resolve(iss.sunuArticleId) ?? iss.sunuArticle;
                    const rotaArt = resolve(iss.rotaArticleId) ?? iss.rotaArticle;
                    const recArts = resolveMany(iss.recommendedArticleIds ?? []);
                    const otherArts = resolveMany(iss.otherArticleIds ?? []);
                    const totalArticles = recArts.length + otherArts.length + (sunuArt ? 1 : 0) + (rotaArt ? 1 : 0);
                    const isExpanded = expandedIssue === iss.id;

                    return (
                        <div key={iss.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                            {/* Issue header row */}
                            <div className="flex items-center gap-0 overflow-hidden">
                                {/* Cover */}
                                <div className="w-16 h-16 shrink-0 bg-gray-100 dark:bg-gray-800 relative">
                                    {iss.coverMedia?.src ? (
                                        <img src={iss.coverMedia.src} alt={iss.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <BookOpen size={20} />
                                        </div>
                                    )}
                                    <span className="absolute top-1 left-1 bg-purple-600 text-white text-[10px] font-bold px-1 py-0.5 rounded leading-tight">
                                        #{iss.number}
                                    </span>
                                </div>

                                {/* Main content */}
                                <div className="flex-1 px-4 py-2.5 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{iss.title}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(iss.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                <span className="mx-1.5 text-gray-300">·</span>
                                                <span className="text-purple-500 font-medium">{totalArticles} makale</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <button
                                                onClick={() => setExpandedIssue(isExpanded ? null : iss.id)}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                title={isExpanded ? 'Daralt' : 'Makaleleri Göster'}
                                            >
                                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                            <button
                                                onClick={() => { setSelectedIssue(iss); setIssueFormOpen(true); }}
                                                className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!confirm(`"${iss.title}" sayısını silmek istediğinize emin misiniz?`)) return;
                                                    fetch(`${API_URL}/issues/${iss.id}`, { method: 'DELETE' })
                                                        .then(() => setIssues(prev => prev.filter(i => i.id !== iss.id)));
                                                }}
                                                className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Summary badges */}
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {sunuArt ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium max-w-48">
                                                <Star size={9} className="shrink-0" />
                                                <span className="truncate">{sunuArt.title}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs rounded-full">
                                                <Star size={9} /> Sunu yok
                                            </span>
                                        )}
                                        {rotaArt ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs rounded-full font-medium max-w-48">
                                                <ArrowRight size={9} className="shrink-0" />
                                                <span className="truncate">{rotaArt.title}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs rounded-full">
                                                <ArrowRight size={9} /> Rota yok
                                            </span>
                                        )}
                                        {recArts.length > 0 && (
                                            <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                                                {recArts.length} önerilen
                                            </span>
                                        )}
                                        {otherArts.length > 0 && (
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                                                {otherArts.length} diğer
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded article list */}
                            {isExpanded && (
                                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 px-4 py-3 space-y-3">
                                    {sunuArt && (
                                        <ArticleRow article={sunuArt} tag="Sunu" tagColor="blue" />
                                    )}
                                    {rotaArt && (
                                        <ArticleRow article={rotaArt} tag="Rota" tagColor="green" />
                                    )}
                                    {recArts.length > 0 && (
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Önerilen Makaleler ({recArts.length})</div>
                                            <div className="space-y-1">
                                                {recArts.map(a => <ArticleRow key={a.id} article={a} />)}
                                            </div>
                                        </div>
                                    )}
                                    {otherArts.length > 0 && (
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Diğer Makaleler ({otherArts.length})</div>
                                            <div className="space-y-1">
                                                {otherArts.map(a => <ArticleRow key={a.id} article={a} />)}
                                            </div>
                                        </div>
                                    )}
                                    {totalArticles === 0 && (
                                        <div className="text-center text-gray-400 text-sm py-4">
                                            Bu sayıya henüz makale eklenmemiş.{' '}
                                            <button
                                                onClick={() => { setSelectedIssue(iss); setIssueFormOpen(true); }}
                                                className="text-purple-600 hover:underline font-medium"
                                            >
                                                Düzenle
                                            </button>
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

function ArticleRow({ article, tag, tagColor }: { article: Article; tag?: string; tagColor?: 'blue' | 'green' }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
        green: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400',
    };
    return (
        <div className="flex items-center gap-2.5 py-1.5 px-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
            <img src={article.imageUrl} alt="" className="w-8 h-8 rounded-md object-cover shrink-0 bg-gray-100" />
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{article.title}</div>
                <div className="text-xs text-gray-400 truncate">{article.author}{article.category && ` · ${article.category}`}</div>
            </div>
            {tag && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${colors[tagColor ?? 'blue']}`}>{tag}</span>
            )}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${article.status === 'edited' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400'}`}>
                {article.status === 'edited' ? 'Düzenlendi' : 'Taslak'}
            </span>
        </div>
    );
}
