import React from 'react';
import {
    Menu, X, Plus, Settings,
    Layout, BookOpen, List,
    RotateCcw, RotateCw
} from 'lucide-react';
import type { Section } from '../types';

interface Template {
    name: string;
    sections: Omit<Section, 'articles' | 'routeArticle'>[];
}

interface HeaderProps {
    view: 'dashboard' | 'log' | 'read' | 'issues';
    setView: (v: 'dashboard' | 'log' | 'read' | 'issues') => void;
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
}: HeaderProps) {
    return (
        <div className="flex justify-between items-center mb-10 sticky top-4 z-30 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu /></button>
                <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block mr-2" />Genç Hayat CMS
                </h1>
            </div>
            <div className="flex gap-2 items-center">
                {/* Group 1: Undo/Redo/Settings */}
                <button
                    onClick={undoSections}
                    disabled={historySize === 0}
                    title="Geri Al (Ctrl+Z)"
                    className={`p-2 rounded-lg transition ${historySize === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <RotateCcw size={16} />
                </button>
                <button
                    onClick={redoSections}
                    disabled={futureSize === 0}
                    title="İleri Al (Ctrl+Shift+Z)"
                    className={`p-2 rounded-lg transition ${futureSize === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <RotateCw size={16} />
                </button>
                <button onClick={() => setSettingsOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Settings /></button>
                <div className="w-px h-6 bg-gray-200 mx-1" />

                {/* Group 2: Templates */}
                <div className="relative">
                    <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="px-4 py-2 bg-white border rounded-lg font-bold text-gray-600 hover:bg-gray-50 shadow-sm flex items-center gap-1"
                        title="Şablonlar"
                    >
                        <Layout size={16} /> Şablonlar
                    </button>
                    {showTemplates && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-xl shadow-xl z-50 p-3 space-y-2">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">Kaydedilmiş Şablonlar</div>
                            {templates.length === 0 && <div className="text-sm text-gray-400 py-2 text-center">Henüz şablon yok</div>}
                            {templates.map((t, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                                    <span className="flex-1 text-sm truncate">{t.name}</span>
                                    <button onClick={() => loadTemplate(t)} className="text-xs text-blue-600 font-medium hover:underline">Yükle</button>
                                    <button onClick={() => deleteTemplate(i)} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                                </div>
                            ))}
                            <div className="border-t pt-2">
                                <button onClick={saveTemplate} className="w-full text-sm text-green-600 font-bold hover:underline flex items-center gap-1 justify-center">
                                    <Plus size={14} /> Mevcut Düzeni Şablon Olarak Kaydet
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-px h-6 bg-gray-200 mx-1" />

                {/* Group 3: Sayılar, + Makale Ekle, Dashboard */}
                <button
                    onClick={() => setView('issues')}
                    className={`px-4 py-2 rounded-lg font-bold shadow-sm transition ${view === 'issues' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                >
                    <BookOpen size={16} className="inline mr-1" />Sayılar
                </button>
                <button
                    onClick={() => { setSelectedArticle(null); setView('log'); }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold shadow-sm hover:bg-orange-600"
                >
                    + Makale Ekle
                </button>
                <button
                    onClick={() => setView('dashboard')}
                    className={`px-4 py-2 rounded-lg font-bold shadow-sm transition ${view === 'dashboard' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    <List size={16} className="inline mr-1" />Dashboard
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1" />

                {/* Group 4: Düzeni Kaydet */}
                <button
                    onClick={saveLayout}
                    disabled={isSaving}
                    className={`px-6 py-2 rounded-lg font-bold shadow-lg transition ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'} text-white`}
                >
                    {isSaving ? 'Kaydediliyor...' : 'Düzeni Kaydet'}
                </button>
            </div>
        </div>
    );
}
