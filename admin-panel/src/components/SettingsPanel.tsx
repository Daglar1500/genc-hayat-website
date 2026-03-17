import React from 'react';
import { X, Layout, Type, Trash2 } from 'lucide-react';
import type { Category } from '../types';

interface SettingsPanelProps {
    settingsOpen: boolean;
    setSettingsOpen: (open: boolean) => void;
    categories: Category[];
    labels: string[];
    addCategory: () => void;
    deleteCategory: (id: string) => void;
    addLabel: () => void;
    deleteLabel: (l: string) => void;
}

export default function SettingsPanel({
    settingsOpen, setSettingsOpen,
    categories, labels,
    addCategory, deleteCategory,
    addLabel, deleteLabel,
}: SettingsPanelProps) {
    if (!settingsOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Ayarlar</h2>
                    <button onClick={() => setSettingsOpen(false)}><X /></button>
                </div>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto p-1">
                    <div>
                        <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Layout size={16} /> Kategoriler</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <div key={cat.id} className="flex gap-2 items-center text-sm bg-gray-50 p-2 rounded">
                                    <div className="w-4 h-4 rounded border" style={{ backgroundColor: cat.color }}></div>
                                    <span className="font-medium">{cat.name}</span>
                                    <button onClick={() => deleteCategory(cat.id)} className="ml-auto text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                </div>
                            ))}
                            <button onClick={addCategory} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">+ Kategori Ekle</button>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Type size={16} /> Etiketler</h3>
                        <div className="flex flex-wrap gap-2">
                            {labels.map(l => (
                                <span key={l} className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                                    {l}
                                    <button onClick={() => deleteLabel(l)} className="hover:text-red-500"><X size={10} /></button>
                                </span>
                            ))}
                            <button onClick={addLabel} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-100 font-medium">+ Ekle</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
