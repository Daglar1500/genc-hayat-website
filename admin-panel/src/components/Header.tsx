import React, { useState, useEffect } from 'react';
import {
    Menu, X, Plus, Settings,
    Layout, BookOpen, BarChart2, Layers,
    RotateCcw, RotateCw, Moon, Sun
} from 'lucide-react';
import type { Section } from '../types';
import { API_URL } from '../config';

interface Template {
    name: string;
    sections: Section[];
}

interface HeaderProps {
    view: 'dashboard' | 'log' | 'read' | 'issues' | 'stats' | 'collections';
    setView: (v: 'dashboard' | 'log' | 'read' | 'issues' | 'stats' | 'collections') => void;
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
    historySize: number;
    futureSize: number;
    undoSections: () => void;
    redoSections: () => void;
    isSaving: boolean;
    saveLayout: () => void;
    setSettingsOpen: (open: boolean) => void;
    setSelectedArticle: (article: null) => void;
    showTemplates: boolean;
    setShowTemplates: (show: boolean) => void;
    templates: Template[];
    loadTemplate: (template: Template) => void;
    deleteTemplate: (idx: number) => void;
    saveTemplate: () => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export default function Header({
    view, setView,
    menuOpen, setMenuOpen,
    historySize, futureSize,
    undoSections, redoSections,
    isSaving, saveLayout,
    setSettingsOpen,
    setSelectedArticle,
    showTemplates, setShowTemplates,
    templates, loadTemplate, deleteTemplate, saveTemplate,
    darkMode, toggleDarkMode,
}: HeaderProps) {
    const [unreadComments, setUnreadComments] = useState(0);

    useEffect(() => {
        const load = () => {
            fetch(`${API_URL}/stats`)
                .then(r => r.json())
                .then((data: any[]) => {
                    const total = data.reduce((s: number, a: any) => s + (a.unreadCount || 0), 0);
                    setUnreadComments(total);
                })
                .catch(() => {});
        };
        load();
        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-between items-center mb-8 sticky top-3 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                >
                    <Menu size={18} />
                </button>
                <button
                    onClick={() => setView('dashboard')}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                    title="Ana Sayfaya Dön"
                >
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight">Genç Hayat CMS</h1>
                </button>
            </div>

            <div className="flex gap-1.5 items-center">
                {/* Dark mode toggle */}
                <button
                    onClick={toggleDarkMode}
                    title={darkMode ? 'Açık Mod' : 'Koyu Mod'}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                >
                    {darkMode ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />
                {/* Undo / Redo / Settings */}
                <button
                    onClick={undoSections}
                    disabled={historySize === 0}
                    title="Geri Al (Ctrl+Z)"
                    className={`p-2 rounded-lg transition-colors ${historySize === 0 ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                >
                    <RotateCcw size={15} />
                </button>
                <button
                    onClick={redoSections}
                    disabled={futureSize === 0}
                    title="İleri Al (Ctrl+Shift+Z)"
                    className={`p-2 rounded-lg transition-colors ${futureSize === 0 ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                >
                    <RotateCw size={15} />
                </button>
                <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                    title="Ayarlar"
                >
                    <Settings size={15} />
                </button>
                <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

                {/* Templates */}
                <div className="relative">
                    <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 flex items-center gap-1.5 transition-colors"
                        title="Şablonlar"
                    >
                        <Layout size={14} /> Şablonlar
                    </button>
                    {showTemplates && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-3 space-y-1.5">
                            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">Kaydedilmiş Şablonlar</div>
                            {templates.length === 0 && (
                                <div className="text-sm text-gray-400 py-3 text-center">Henüz şablon yok</div>
                            )}
                            {templates.map((t, i) => (
                                <div key={i} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{t.name}</span>
                                    <button onClick={() => loadTemplate(t)} className="text-xs text-blue-600 font-medium hover:underline shrink-0">Yükle</button>
                                    <button onClick={() => deleteTemplate(i)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0"><X size={12} /></button>
                                </div>
                            ))}
                            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
                                <button
                                    onClick={saveTemplate}
                                    className="w-full text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 justify-center py-1"
                                >
                                    <Plus size={13} /> Mevcut Düzeni Kaydet
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

                {/* İstatistikler toggle */}
                <button
                    onClick={() => setView(view === 'stats' ? 'dashboard' : 'stats')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 relative ${view === 'stats' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40'}`}
                >
                    <BarChart2 size={14} />İstatistikler
                    {unreadComments > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                            {unreadComments > 99 ? '99+' : unreadComments}
                        </span>
                    )}
                </button>

                {/* Sayılar toggle */}
                <button
                    onClick={() => setView(view === 'issues' ? 'dashboard' : 'issues')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${view === 'issues' ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/40'}`}
                >
                    <BookOpen size={14} />Sayılar
                </button>

                {/* Koleksiyonlar toggle */}
                <button
                    onClick={() => setView(view === 'collections' ? 'dashboard' : 'collections')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${view === 'collections' ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-900/40'}`}
                >
                    <Layers size={14} />Koleksiyonlar
                </button>

                {/* Makale Ekle */}
                <button
                    onClick={() => { setSelectedArticle(null); setView('log'); }}
                    className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-1"
                >
                    <Plus size={14} /> Makale Ekle
                </button>
                <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

                {/* Düzeni Kaydet */}
                <button
                    onClick={saveLayout}
                    disabled={isSaving}
                    className={`px-5 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-all ${isSaving ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}
                >
                    {isSaving ? 'Kaydediliyor...' : 'Düzeni Kaydet'}
                </button>
            </div>
        </div>
    );
}
