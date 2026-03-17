import React, { useRef, useEffect } from 'react';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';

const RichTextEditor = ({ value, onChange }: { value: string; onChange: (html: string) => void }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && editorRef.current) {
            editorRef.current.innerHTML = value || '';
            initialized.current = true;
        }
    }, []);

    const exec = (cmd: string, arg?: string) => {
        document.execCommand(cmd, false, arg);
        editorRef.current?.focus();
        onChange(editorRef.current?.innerHTML || '');
    };

    const Btn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
        <button
            type="button"
            title={title}
            onMouseDown={e => { e.preventDefault(); onClick(); }}
            className="px-2 h-8 min-w-[2rem] rounded hover:bg-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center"
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
                <Btn onClick={() => exec('formatBlock', 'h3')} title="Küçük başlık">H3</Btn>
                <Btn onClick={() => exec('formatBlock', 'p')} title="Normal paragraf">¶</Btn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <Btn onClick={() => exec('insertUnorderedList')} title="Madde listesi">• —</Btn>
                <Btn onClick={() => exec('insertOrderedList')} title="Numaralı liste">1.</Btn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <Btn onClick={() => { const url = prompt('Resim URL\'si:'); if (url) exec('insertHTML', `<img src="${url}" style="max-width:100%;border-radius:8px;margin:12px 0;" />`); }} title="Resim ekle">
                    <ImageIcon size={14} />
                </Btn>
                <Btn onClick={() => { const url = prompt('Link URL\'si (https://...):'); if (url) exec('createLink', url); }} title="Link ekle">
                    <ArrowRight size={14} />
                </Btn>
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => onChange(editorRef.current?.innerHTML || '')}
                className="min-h-[320px] p-4 outline-none text-gray-800 text-sm leading-relaxed
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
                    [&_p]:mb-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:pl-5 [&_ol]:list-decimal [&_li]:mb-1
                    [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3
                    [&_a]:text-blue-600 [&_a]:underline"
            />
        </div>
    );
};

export default RichTextEditor;
