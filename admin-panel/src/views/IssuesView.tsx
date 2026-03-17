import React from 'react';
import { Plus, X, Edit3, Trash2, BookOpen, Star, ArrowRight } from 'lucide-react';
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
}

export default function IssuesView({
    issues, setIssues,
    selectedIssue, setSelectedIssue,
    issueFormOpen, setIssueFormOpen,
    loggedArticles,
}: IssuesViewProps) {
    return (
        <div className="max-w-4xl mx-auto pb-20 px-2 mt-2">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen className="text-purple-600" />Sayı Yönetimi
                </h2>
                <button
                    onClick={() => { setSelectedIssue(null); setIssueFormOpen(true); }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2"
                >
                    <Plus size={16} /> Yeni Sayı
                </button>
            </div>

            {/* Issue Form Modal */}
            {issueFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                        <div className="p-5 border-b flex justify-between items-center bg-purple-50">
                            <h3 className="text-xl font-bold text-purple-800">{selectedIssue ? 'Sayıyı Düzenle' : 'Yeni Sayı Oluştur'}</h3>
                            <button onClick={() => setIssueFormOpen(false)}><X /></button>
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
                                setIssueFormOpen(false);
                                setSelectedIssue(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Issue List */}
            <div className="space-y-3">
                {issues.length === 0 && (
                    <div className="text-center text-gray-400 py-16">Henüz sayı yok. Yeni sayı ekleyin.</div>
                )}
                {[...issues].sort((a, b) => b.number - a.number).map(iss => (
                    <div key={iss.id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex">
                        {/* Cover thumbnail */}
                        <div className="w-20 shrink-0 bg-gray-100 relative">
                            {iss.coverMedia?.src ? (
                                <img src={iss.coverMedia.src} alt={iss.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <BookOpen size={24} />
                                </div>
                            )}
                            <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                #{iss.number}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate">{iss.title}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {new Date(iss.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                    <button
                                        onClick={() => { setSelectedIssue(iss); setIssueFormOpen(true); }}
                                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!confirm(`"${iss.title}" sayısını silmek istediğinize emin misiniz?`)) return;
                                            fetch(`${API_URL}/issues/${iss.id}`, { method: 'DELETE' })
                                                .then(() => setIssues(prev => prev.filter(i => i.id !== iss.id)));
                                        }}
                                        className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {iss.sunuArticle?.title ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium max-w-50">
                                        <Star size={10} className="shrink-0" />
                                        <span className="truncate">{iss.sunuArticle.title}</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">
                                        <Star size={10} /> Sunu yok
                                    </span>
                                )}
                                {iss.rotaArticle?.title ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium max-w-50">
                                        <ArrowRight size={10} className="shrink-0" />
                                        <span className="truncate">{iss.rotaArticle.title}</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">
                                        <ArrowRight size={10} /> Rota yok
                                    </span>
                                )}
                                <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full">
                                    {(iss.recomendedCards?.length ?? iss.recommendedArticleIds.length) + (iss.otherArticles?.length ?? iss.otherArticleIds.length)} makale
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
