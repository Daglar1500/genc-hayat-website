import React, { useState } from 'react';
import { X, Layout, Type, Trash2, Users, Plus } from 'lucide-react';
import type { Category } from '../types';

interface SettingsPanelProps {
    settingsOpen: boolean;
    setSettingsOpen: (open: boolean) => void;
    categories: Category[];
    labels: string[];
    editors: string[];
    addCategory: () => void;
    deleteCategory: (id: string) => void;
    addLabel: () => void;
    deleteLabel: (l: string) => void;
    addEditor: () => void;
    deleteEditor: (name: string) => void;
}

export default function SettingsPanel({
    settingsOpen, setSettingsOpen,
    categories, labels, editors,
    addCategory, deleteCategory,
    addLabel, deleteLabel,
    addEditor, deleteEditor,
}: SettingsPanelProps) {
    const [activeTab, setActiveTab] = useState<'categories' | 'labels' | 'editors'>('categories');

    if (!settingsOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Ayarlar</h2>
                    <button onClick={() => setSettingsOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"><X size={18} /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b px-6">
                    {([
                        { key: 'categories', label: 'Kategoriler', icon: <Layout size={13} /> },
                        { key: 'labels', label: 'Etiketler', icon: <Type size={13} /> },
                        { key: 'editors', label: 'Editörler', icon: <Users size={13} /> },
                    ] as const).map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    {activeTab === 'categories' && (
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <div key={cat.id} className="flex gap-2 items-center text-sm bg-gray-50 p-2.5 rounded-lg">
                                    <div className="w-4 h-4 rounded-full border flex-shrink-0" style={{ backgroundColor: cat.color }}></div>
                                    <span className="font-medium flex-1">{cat.name}</span>
                                    <button onClick={() => deleteCategory(cat.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded"><Trash2 size={13} /></button>
                                </div>
                            ))}
                            <button onClick={addCategory} className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:underline mt-2">
                                <Plus size={14} /> Kategori Ekle
                            </button>
                        </div>
                    )}

                    {activeTab === 'labels' && (
                        <div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {labels.map(l => (
                                    <span key={l} className="bg-gray-100 px-2.5 py-1 rounded-full text-xs flex items-center gap-1 text-gray-700">
                                        {l}
                                        <button onClick={() => deleteLabel(l)} className="hover:text-red-500 transition-colors ml-0.5"><X size={10} /></button>
                                    </span>
                                ))}
                            </div>
                            <button onClick={addLabel} className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:underline">
                                <Plus size={14} /> Etiket Ekle
                            </button>
                        </div>
                    )}

                    {activeTab === 'editors' && (
                        <div className="space-y-2">
                            {editors.map(ed => (
                                <div key={ed} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        {ed.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium flex-1">{ed}</span>
                                    <button onClick={() => deleteEditor(ed)} className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded"><Trash2 size={13} /></button>
                                </div>
                            ))}
                            <button onClick={addEditor} className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:underline mt-2">
                                <Plus size={14} /> Editör Ekle
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
