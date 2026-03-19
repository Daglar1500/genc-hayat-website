import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, AlignLeft, Heading2, Image as ImageIcon } from 'lucide-react';
import { API_URL } from '../config';

export type ParagraphBlock = { id: string; type: 'paragraph'; text: string };
export type SubheadingBlock = { id: string; type: 'subheading'; text: string };
export type ImageBlock = {
    id: string;
    type: 'image';
    src: string;
    alt: string;
    layout: 'text-width' | 'full-width' | 'left-side' | 'right-side';
    sideText: string;
};
export type EditorBlock = ParagraphBlock | SubheadingBlock | ImageBlock;

const LAYOUT_LABELS: Record<string, string> = {
    'text-width': 'Dar (metin genişliği)',
    'full-width': 'Tam Genişlik',
    'left-side': 'Sol Yan (görsel sol)',
    'right-side': 'Sağ Yan (görsel sağ)',
};

export function contentToBlocks(content: any[]): EditorBlock[] {
    if (!Array.isArray(content)) return [];
    const blocks: EditorBlock[] = [];
    for (const b of content) {
        const bc = b.blockContent;
        if (!bc) continue;
        const id = Math.random().toString(36).slice(2);
        if (b.blockLayout === 'left-side' || b.blockLayout === 'right-side') {
            blocks.push({ id, type: 'image', src: b.media?.src || '', alt: b.media?.alt || '', layout: b.blockLayout, sideText: bc.textContent || '' });
        } else if (bc.type === 'image') {
            blocks.push({ id, type: 'image', src: bc.src || '', alt: bc.alt || '', layout: (bc.mediaLayout as any) || 'text-width', sideText: '' });
        } else if (bc.type === 'subheading') {
            blocks.push({ id, type: 'subheading', text: bc.textContent || '' });
        } else {
            blocks.push({ id, type: 'paragraph', text: bc.textContent || '' });
        }
    }
    return blocks;
}

export function blocksToContent(blocks: EditorBlock[]): any[] {
    return blocks.map(b => {
        if (b.type === 'paragraph') return { blockContent: { type: 'text', textContent: b.text } };
        if (b.type === 'subheading') return { blockContent: { type: 'subheading', textContent: b.text } };
        if (b.type === 'image') {
            if (b.layout === 'left-side' || b.layout === 'right-side') {
                return { blockContent: { type: 'text', textContent: b.sideText }, media: { type: 'image', src: b.src, alt: b.alt }, blockLayout: b.layout };
            }
            return { blockContent: { type: 'image', src: b.src, alt: b.alt, mediaLayout: b.layout } };
        }
        return null;
    }).filter(Boolean);
}

const uid = () => Math.random().toString(36).slice(2);

const AddMenu = ({ onAdd }: { onAdd: (type: EditorBlock['type']) => void }) => (
    <div className="flex justify-center gap-2 py-1">
        <button type="button" onClick={() => onAdd('paragraph')} className="flex items-center gap-1 px-3 py-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-600 transition-colors">
            <AlignLeft size={11} /> Paragraf
        </button>
        <button type="button" onClick={() => onAdd('subheading')} className="flex items-center gap-1 px-3 py-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-600 transition-colors">
            <Heading2 size={11} /> Alt Başlık
        </button>
        <button type="button" onClick={() => onAdd('image')} className="flex items-center gap-1 px-3 py-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-gray-600 transition-colors">
            <ImageIcon size={11} /> Görsel
        </button>
    </div>
);

export default function BlockEditor({ blocks, onChange }: { blocks: EditorBlock[]; onChange: (blocks: EditorBlock[]) => void }) {
    const [openMenuAt, setOpenMenuAt] = useState<number | null>(null);

    const update = (idx: number, patch: Partial<EditorBlock>) => {
        onChange(blocks.map((b, i) => i === idx ? { ...b, ...patch } as EditorBlock : b));
    };

    const remove = (idx: number) => onChange(blocks.filter((_, i) => i !== idx));

    const move = (idx: number, dir: -1 | 1) => {
        const next = [...blocks];
        const swap = idx + dir;
        if (swap < 0 || swap >= next.length) return;
        [next[idx], next[swap]] = [next[swap], next[idx]];
        onChange(next);
    };

    const insert = (after: number, type: EditorBlock['type']) => {
        const id = uid();
        const newBlock: EditorBlock =
            type === 'paragraph' ? { id, type: 'paragraph', text: '' } :
            type === 'subheading' ? { id, type: 'subheading', text: '' } :
            { id, type: 'image', src: '', alt: '', layout: 'text-width', sideText: '' };
        const next = [...blocks];
        next.splice(after + 1, 0, newBlock);
        onChange(next);
        setOpenMenuAt(null);
    };

    const handleImageUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        fetch(`${API_URL}/upload`, { method: 'POST', body: fd })
            .then(r => r.json())
            .then(d => { if (d.url) update(idx, { src: d.url }); })
            .catch(() => alert('Yükleme başarısız'));
    };

    return (
        <div className="space-y-1 border rounded-xl bg-gray-50 overflow-hidden">
            {/* Top add */}
            <div className="py-2 border-b border-gray-100">
                {openMenuAt === -1 ? (
                    <div className="flex items-center">
                        <AddMenu onAdd={t => insert(-1, t)} />
                        <button type="button" onClick={() => setOpenMenuAt(null)} className="text-xs text-gray-400 hover:text-gray-600 ml-2">✕</button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setOpenMenuAt(-1)}
                        className="w-full py-1.5 text-xs text-gray-400 hover:text-blue-600 flex items-center justify-center gap-1 hover:bg-gray-100 transition-colors">
                        <Plus size={12} /> Başa blok ekle
                    </button>
                )}
            </div>

            {blocks.length === 0 && (
                <div className="text-center text-gray-400 py-12 text-sm">İçerik yok. Yukarıdan veya aşağıdan blok ekleyin.</div>
            )}

            {blocks.map((block, idx) => (
                <div key={block.id} className="bg-white border-b border-gray-100 last:border-b-0">
                    <div className="p-3">
                        {/* Header row */}
                        <div className="flex items-center gap-1 mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-1">
                                {block.type === 'paragraph' ? 'Paragraf' : block.type === 'subheading' ? 'Alt Başlık' : `Görsel · ${LAYOUT_LABELS[block.layout]}`}
                            </span>
                            <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"><ChevronUp size={13} /></button>
                            <button type="button" onClick={() => move(idx, 1)} disabled={idx === blocks.length - 1} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"><ChevronDown size={13} /></button>
                            <button type="button" onClick={() => remove(idx)} className="p-1 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                        </div>

                        {/* Block body */}
                        {block.type === 'paragraph' && (
                            <textarea
                                value={block.text}
                                onChange={e => update(idx, { text: e.target.value })}
                                className="w-full p-2 border border-gray-200 rounded text-sm resize-y min-h-[80px] font-serif focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Paragraf metni..."
                            />
                        )}
                        {block.type === 'subheading' && (
                            <input
                                value={block.text}
                                onChange={e => update(idx, { text: e.target.value })}
                                className="w-full p-2 border border-gray-200 rounded font-bold text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Alt başlık..."
                            />
                        )}
                        {block.type === 'image' && (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Görsel URL</label>
                                        <input
                                            value={block.src}
                                            onChange={e => update(idx, { src: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="https://..."
                                        />
                                        <label className="mt-1 flex items-center gap-1 text-xs text-blue-600 cursor-pointer hover:underline w-fit">
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(idx, e)} />
                                            <ImageIcon size={11} /> Dosya yükle
                                        </label>
                                    </div>
                                    {block.src && (
                                        <img src={block.src} alt={block.alt} className="h-20 w-24 rounded border object-cover shrink-0 bg-gray-100" />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Açıklama</label>
                                    <input
                                        value={block.alt}
                                        onChange={e => update(idx, { alt: e.target.value })}
                                        className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Görsel açıklaması (caption)..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Yerleşim</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(['text-width', 'full-width', 'left-side', 'right-side'] as const).map(layout => (
                                            <button
                                                key={layout}
                                                type="button"
                                                onClick={() => update(idx, { layout })}
                                                className={`px-2.5 py-1 text-xs rounded-full border font-medium transition-colors ${block.layout === layout ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
                                            >
                                                {LAYOUT_LABELS[layout]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {(block.layout === 'left-side' || block.layout === 'right-side') && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Yan Metin</label>
                                        <textarea
                                            value={block.sideText}
                                            onChange={e => update(idx, { sideText: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded text-sm resize-y min-h-[80px] font-serif focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Görsel yanında gösterilecek paragraf metni..."
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Add after this block */}
                    <div className="border-t border-dashed border-gray-100">
                        {openMenuAt === idx ? (
                            <div className="flex items-center py-1.5">
                                <AddMenu onAdd={t => insert(idx, t)} />
                                <button type="button" onClick={() => setOpenMenuAt(null)} className="text-xs text-gray-400 hover:text-gray-600 ml-2">✕</button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => setOpenMenuAt(idx)}
                                className="w-full py-1.5 text-[11px] text-gray-300 hover:text-blue-500 flex items-center justify-center gap-1 hover:bg-blue-50 transition-colors">
                                <Plus size={11} /> Blok ekle
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
