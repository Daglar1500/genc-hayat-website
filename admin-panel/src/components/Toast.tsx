import React from 'react';

interface ToastItem {
    id: number;
    message: string;
    type: 'success' | 'error';
}

interface ToastProps {
    toasts: ToastItem[];
}

export default function Toast({ toasts }: ToastProps) {
    return (
        <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2 pointer-events-none">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 ${t.type === 'success' ? 'bg-gray-900' : 'bg-red-600'}`}
                >
                    <span>{t.type === 'success' ? '✓' : '✗'}</span>
                    {t.message}
                </div>
            ))}
        </div>
    );
}
