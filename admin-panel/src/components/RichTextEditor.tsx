import React, { useRef, useEffect, useState } from 'react';
import { Image as ImageIcon, ArrowRight, X, Upload } from 'lucide-react';
import { API_URL } from '../config';

type ImageLayout = 'text-width' | 'full-width' | 'left-side' | 'right-side';

const LAYOUT_LABELS: Record<ImageLayout, string> = {
    'text-width': 'Dar',
    'full-width': 'Tam Genişlik',
    'left-side': 'Sol Yan',
    'right-side': 'Sağ Yan',
};

export function blocksToHtml(blocks: any[]): string {
    if (!Array.isArray(blocks)) return '';
    return blocks.map(b => {
        const bc = b.blockContent;
        // Old format fallback
        if (!bc) {
            if (b.type === 'paragraph') return `<p>${b.value || ''}</p>`;
            if (b.type === 'subheading') return `<h2>${b.value || ''}</h2>`;
            if (b.type === 'image') {
                const src = b.value || '';
                return `<figure contenteditable="false" data-block-img="1" data-layout="text-width" data-src="${encodeURIComponent(src)}" data-alt="" style="margin:14px 0;border:1px dashed #d1d5db;border-radius:8px;padding:10px;background:#f9fafb;text-align:center;"><span style="font-size:10px;color:#888;background:#e5e7eb;border-radius:4px;padding:2px 6px;display:inline-block;margin-bottom:8px;">Dar</span><br/><img src="${src}" alt="" style="max-width:100%;max-height:200px;border-radius:6px;object-fit:cover;" /></figure>`;
            }
            return '';
        }
        if (b.blockLayout === 'left-side' || b.blockLayout === 'right-side') {
            const src = b.media?.src || '';
            const alt = b.media?.alt || '';
            const sideHtml = bc.textContent || '';
            const dir = b.blockLayout === 'right-side' ? 'flex-direction:row-reverse;' : '';
            return `<figure contenteditable="false" data-block-img="1" data-layout="${b.blockLayout}" data-src="${encodeURIComponent(src)}" data-alt="${encodeURIComponent(alt)}" style="display:flex;gap:14px;margin:14px 0;${dir}align-items:flex-start;border:1px dashed #d1d5db;border-radius:8px;padding:10px;background:#f9fafb;"><img src="${src}" alt="${alt}" style="width:160px;height:120px;object-fit:cover;border-radius:6px;flex-shrink:0;" /><div data-side-text="1" style="flex:1;min-height:60px;font-size:13px;color:#374151;">${sideHtml}</div></figure>`;
        }
        if (bc.type === 'image') {
            const src = bc.src || '';
            const alt = bc.alt || '';
            const layout: ImageLayout = bc.mediaLayout || 'text-width';
            const imgStyle = layout === 'full-width' ? 'width:100%;max-height:240px;' : 'max-width:100%;max-height:200px;';
            return `<figure contenteditable="false" data-block-img="1" data-layout="${layout}" data-src="${encodeURIComponent(src)}" data-alt="${encodeURIComponent(alt)}" style="margin:14px 0;border:1px dashed #d1d5db;border-radius:8px;padding:10px;background:#f9fafb;text-align:center;"><span style="font-size:10px;color:#888;background:#e5e7eb;border-radius:4px;padding:2px 6px;display:inline-block;margin-bottom:8px;">${LAYOUT_LABELS[layout]}</span><br/><img src="${src}" alt="${alt}" style="${imgStyle}border-radius:6px;object-fit:cover;" /></figure>`;
        }
        if (bc.type === 'subheading') return `<h2>${bc.textContent || ''}</h2>`;
        return `<p>${bc.textContent || ''}</p>`;
    }).join('');
}

export function htmlToBlocks(html: string): any[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${html}</body>`, 'text/html');
    const blocks: any[] = [];

    doc.body.childNodes.forEach(node => {
        const el = node as HTMLElement;
        if (!el.tagName && node.textContent?.trim()) {
            blocks.push({ blockContent: { type: 'text', textContent: node.textContent.trim() } });
            return;
        }
        if (!el.tagName) return;
        if (el.dataset?.blockImg === '1') {
            const layout = (el.dataset.layout || 'text-width') as ImageLayout;
            const src = decodeURIComponent(el.dataset.src || '');
            const alt = decodeURIComponent(el.dataset.alt || '');
            if (layout === 'left-side' || layout === 'right-side') {
                const sideTextDiv = el.querySelector('[data-side-text="1"]');
                const sideHtml = sideTextDiv?.innerHTML || '';
                blocks.push({ blockContent: { type: 'text', textContent: sideHtml }, media: { type: 'image', src, alt }, blockLayout: layout });
            } else {
                if (src) blocks.push({ blockContent: { type: 'image', src, alt, mediaLayout: layout } });
            }
        } else if (el.tagName === 'H2' || el.tagName === 'H3') {
            const text = el.textContent?.trim() || '';
            if (text) blocks.push({ blockContent: { type: 'subheading', textContent: text } });
        } else if (el.tagName === 'UL' || el.tagName === 'OL') {
            const items = Array.from(el.querySelectorAll('li')).map(li => `• ${li.textContent}`).join('\n');
            if (items) blocks.push({ blockContent: { type: 'text', textContent: items } });
        } else {
            const text = el.innerHTML?.trim() || '';
            const plainText = el.textContent?.trim() || '';
            if (plainText) blocks.push({ blockContent: { type: 'text', textContent: text } });
        }
    });

    return blocks;
}

// Mini rich text editor for side text — no image button
const MiniTextEditor = ({ value, onChange }: { value: string; onChange: (html: string) => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && ref.current) {
            ref.current.innerHTML = value || '';
            initialized.current = true;
        }
    }, []);

    const exec = (cmd: string, arg?: string) => {
        document.execCommand(cmd, false, arg);
        ref.current?.focus();
        onChange(ref.current?.innerHTML || '');
    };

    return (
        <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
            <div className="flex gap-0.5 p-1 bg-gray-100 border-b select-none">
                <button type="button" onMouseDown={e => { e.preventDefault(); exec('bold'); }} title="Kalın" className="px-2 h-6 text-xs font-bold hover:bg-white rounded transition-colors"><span className="font-bold">B</span></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); exec('italic'); }} title="İtalik" className="px-2 h-6 text-xs hover:bg-white rounded transition-colors"><span className="italic">İ</span></button>
                <button type="button" onMouseDown={e => { e.preventDefault(); exec('underline'); }} title="Altı çizili" className="px-2 h-6 text-xs hover:bg-white rounded transition-colors"><span className="underline">A</span></button>
                <div className="w-px h-4 bg-gray-300 mx-0.5 self-center" />
                <button type="button" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h2'); }} title="Ara başlık" className="px-2 h-6 text-xs font-semibold hover:bg-white rounded transition-colors">H2</button>
                <button type="button" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'p'); }} title="Paragraf" className="px-2 h-6 text-xs hover:bg-white rounded transition-colors">¶</button>
            </div>
            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onInput={() => onChange(ref.current?.innerHTML || '')}
                className="min-h-22.5 p-2 text-sm leading-relaxed outline-none text-gray-800
                    [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1
                    [&_p]:mb-1.5"
                placeholder="Görsel yanında gösterilecek metin..."
            />
        </div>
    );
};

interface ImagePanelState {
    src: string;
    alt: string;
    layout: ImageLayout;
    sideText: string; // stores HTML for left/right layouts
}

const RichTextEditor = ({ value, onChange }: { value: string; onChange: (html: string) => void }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);
    const savedRange = useRef<Range | null>(null);
    const [imgPanel, setImgPanel] = useState<ImagePanelState | null>(null);

    useEffect(() => {
        if (!initialized.current && editorRef.current) {
            editorRef.current.innerHTML = value || '';
            initialized.current = true;
        }
    }, []);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRange.current = sel.getRangeAt(0).cloneRange();
        }
    };

    const exec = (cmd: string, arg?: string) => {
        document.execCommand(cmd, false, arg);
        editorRef.current?.focus();
        onChange(editorRef.current?.innerHTML || '');
    };

    const insertImage = (panel: ImagePanelState) => {
        if (!panel.src) return;

        // Focus editor and restore saved cursor position
        editorRef.current?.focus();
        if (savedRange.current) {
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(savedRange.current);
            }
        }

        const layout = panel.layout;
        const srcEncoded = encodeURIComponent(panel.src);
        const altEncoded = encodeURIComponent(panel.alt);
        let figureHtml = '';

        if (layout === 'left-side' || layout === 'right-side') {
            const dir = layout === 'right-side' ? 'flex-direction:row-reverse;' : '';
            figureHtml = `<figure contenteditable="false" data-block-img="1" data-layout="${layout}" data-src="${srcEncoded}" data-alt="${altEncoded}" style="display:flex;gap:14px;margin:14px 0;${dir}align-items:flex-start;border:1px dashed #d1d5db;border-radius:8px;padding:10px;background:#f9fafb;"><img src="${panel.src}" alt="${panel.alt}" style="width:160px;height:120px;object-fit:cover;border-radius:6px;flex-shrink:0;" /><div data-side-text="1" style="flex:1;min-height:60px;font-size:13px;color:#374151;">${panel.sideText || '<p><br/></p>'}</div></figure>`;
        } else {
            const imgStyle = layout === 'full-width' ? 'width:100%;max-height:240px;' : 'max-width:100%;max-height:200px;';
            figureHtml = `<figure contenteditable="false" data-block-img="1" data-layout="${layout}" data-src="${srcEncoded}" data-alt="${altEncoded}" style="margin:14px 0;border:1px dashed #d1d5db;border-radius:8px;padding:10px;background:#f9fafb;text-align:center;"><span style="font-size:10px;color:#888;background:#e5e7eb;border-radius:4px;padding:2px 6px;display:inline-block;margin-bottom:8px;">${LAYOUT_LABELS[layout]}</span><br/><img src="${panel.src}" alt="${panel.alt}" style="${imgStyle}border-radius:6px;object-fit:cover;" /></figure>`;
        }

        // DOM-based insertion — more reliable than execCommand('insertHTML')
        const temp = document.createElement('div');
        temp.innerHTML = figureHtml + '<p><br/></p>';
        const fragment = document.createDocumentFragment();
        const insertedNodes: Node[] = [];
        while (temp.firstChild) {
            insertedNodes.push(temp.firstChild);
            fragment.appendChild(temp.firstChild);
        }

        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(fragment);
            // Place cursor after inserted content
            if (insertedNodes.length > 0) {
                const newRange = document.createRange();
                newRange.setStartAfter(insertedNodes[insertedNodes.length - 1]);
                newRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(newRange);
            }
        } else {
            // No range — append to end of editor
            editorRef.current?.appendChild(fragment);
        }

        onChange(editorRef.current?.innerHTML || '');
        setImgPanel(null);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !imgPanel) return;
        const fd = new FormData();
        fd.append('file', file);
        fetch(`${API_URL}/upload`, { method: 'POST', body: fd })
            .then(r => r.json())
            .then(d => { if (d.url) setImgPanel(p => p ? { ...p, src: d.url } : p); })
            .catch(() => alert('Yükleme başarısız'));
    };

    const Btn = ({ onClick, title, children, active }: { onClick: () => void; title: string; children: React.ReactNode; active?: boolean }) => (
        <button
            type="button"
            title={title}
            onMouseDown={e => { e.preventDefault(); onClick(); }}
            className={`px-2 h-8 min-w-8 rounded text-sm font-medium flex items-center justify-center transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-700'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 border-b select-none">
                <Btn onClick={() => exec('bold')} title="Kalın (Ctrl+B)"><span className="font-bold">B</span></Btn>
                <Btn onClick={() => exec('italic')} title="İtalik (Ctrl+I)"><span className="italic">İ</span></Btn>
                <Btn onClick={() => exec('underline')} title="Altı çizili (Ctrl+U)"><span className="underline">A</span></Btn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <Btn onClick={() => exec('formatBlock', 'h2')} title="Ara başlık">H2</Btn>
                <Btn onClick={() => exec('formatBlock', 'p')} title="Normal paragraf">¶</Btn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <Btn onClick={() => exec('insertUnorderedList')} title="Madde listesi">• —</Btn>
                <Btn onClick={() => exec('insertOrderedList')} title="Numaralı liste">1.</Btn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <Btn
                    onClick={() => {
                        saveSelection();
                        setImgPanel(p => p ? null : { src: '', alt: '', layout: 'text-width', sideText: '' });
                    }}
                    title="Görsel ekle"
                    active={!!imgPanel}
                >
                    <ImageIcon size={14} />
                </Btn>
                <Btn onClick={() => { const url = prompt('Link URL\'si (https://...):'); if (url) exec('createLink', url); }} title="Link ekle">
                    <ArrowRight size={14} />
                </Btn>
            </div>

            {/* Image insertion panel */}
            {imgPanel && (
                <div className="bg-blue-50 border-b border-blue-100 p-3 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-blue-700">Görsel Ekle</span>
                        <button type="button" onClick={() => setImgPanel(null)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                    </div>

                    {/* Layout selector */}
                    <div>
                        <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Yerleşim</div>
                        <div className="flex gap-1 flex-wrap">
                            {(['text-width', 'full-width', 'left-side', 'right-side'] as ImageLayout[]).map(l => (
                                <button
                                    key={l} type="button"
                                    onClick={() => setImgPanel(p => p ? { ...p, layout: l } : p)}
                                    className={`px-2.5 py-1 text-xs rounded-full border font-medium transition-colors ${imgPanel.layout === l ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
                                >
                                    {LAYOUT_LABELS[l]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Görsel URL</div>
                            <input
                                value={imgPanel.src}
                                onChange={e => setImgPanel(p => p ? { ...p, src: e.target.value } : p)}
                                className="w-full px-2 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                placeholder="https://..."
                            />
                            <label className="mt-1 flex items-center gap-1 text-xs text-blue-600 cursor-pointer hover:underline w-fit">
                                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                                <Upload size={11} /> Dosya yükle
                            </label>
                        </div>
                        <div>
                            <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Açıklama (alt)</div>
                            <input
                                value={imgPanel.alt}
                                onChange={e => setImgPanel(p => p ? { ...p, alt: e.target.value } : p)}
                                className="w-full px-2 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Görsel açıklaması..."
                            />
                        </div>
                    </div>

                    {/* Side text — mini rich text editor, no image button */}
                    {(imgPanel.layout === 'left-side' || imgPanel.layout === 'right-side') && (
                        <div>
                            <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Yan Metin</div>
                            <MiniTextEditor
                                value={imgPanel.sideText}
                                onChange={html => setImgPanel(p => p ? { ...p, sideText: html } : p)}
                            />
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => insertImage(imgPanel)}
                            disabled={!imgPanel.src}
                            className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Ekle
                        </button>
                    </div>
                </div>
            )}

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => onChange(editorRef.current?.innerHTML || '')}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
                className="min-h-80 p-4 outline-none text-gray-800 text-sm leading-relaxed
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
                    [&_p]:mb-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:pl-5 [&_ol]:list-decimal [&_li]:mb-1
                    [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3
                    [&_a]:text-blue-600 [&_a]:underline
                    [&_figure]:my-2"
            />
        </div>
    );
};

export default RichTextEditor;
