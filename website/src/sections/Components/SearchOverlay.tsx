import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LabeloDefault, Label } from '../../pages/MainPage/ArticleCard';
import { SocialIcons, Logo, CloseButton } from './SiteHeader';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    { name: 'Güncel', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600', href: '/category/guncel' },
    { name: 'Tarih', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600', href: '/category/tarih' },
    { name: 'Kuram', image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600', href: '/category/kuram' },
    { name: 'Felsefe', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600', href: '/category/felsefe' },
    { name: 'Kültür-Sanat', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=600', href: '/category/kultur-sanat' },
    { name: 'Dünya', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600', href: '/category/dunya' },
    { name: 'Spor', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600', href: '/category/spor' },
];

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter tags based on search
    const allTags = LabeloDefault.filter(l => l.type === 'tag');
    const filteredTags = searchTerm
        ? allTags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : allTags;

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[1001] bg-[rgb(199,78,38)] overflow-y-auto font-bradford text-white"
                >
                    {/* Header Section */}
                    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] border-b border-white/10">
                        <div className="relative flex items-center justify-between h-20 max-w-[1200px] mx-auto">
                            <div className="hidden lg:flex items-center">
                                <SocialIcons isWhite={true} />
                            </div>
                            <Logo isWhite={true} />
                            <div className="flex items-center ml-auto lg:ml-0">
                                <CloseButton onClick={onClose} />
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[calc(100vh-80px)] flex flex-col">

                        {/* Search Input (Daha da Küçültüldü) */}
                        <div className="w-full max-w-xl mx-auto mb-8 relative">
                            <input
                                type="text"
                                placeholder="Genç Hayat'ta ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                className="w-full bg-transparent border-b border-white/40 text-lg md:text-2xl font-bold py-2 px-2 placeholder-white/60 focus:outline-none focus:border-white transition-colors text-left"
                            />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-70 hidden md:block">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="w-full max-w-5xl mx-auto space-y-8 flex-grow">

                            {/* 1. Categories Grid (Daha Kompakt) */}
                            <div className="space-y-4 text-center">
                                <h3 className="text-lg font-bold opacity-80 border-b border-white/20 pb-1 inline-block">Kategoriler</h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {CATEGORIES.map((cat) => (
                                        <a
                                            key={cat.name}
                                            href={cat.href}
                                            className="group flex flex-col gap-1 cursor-pointer w-[calc(50%-1rem)] md:w-[calc(25%-1rem)]"
                                        >
                                            <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-black/20 relative shadow-sm">
                                                <img
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                            </div>
                                            <span className="text-center font-bold text-sm group-hover:text-white/90 transition-colors">
                                                {cat.name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Tags Cloud (Label Bileşeni Kullanıldı ve Daha Yukarıda) */}
                            <div className="space-y-4 text-center pb-8">
                                <h3 className="text-lg font-bold opacity-80 border-b border-white/20 pb-1 inline-block">
                                    {searchTerm ? 'Bulunan Etiketler' : 'Popüler Etiketler'}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {filteredTags.length > 0 ? (
                                        filteredTags.map((tag, idx) => (
                                            <a
                                                key={idx}
                                                href={tag.href}
                                                className="hover:scale-105 transition-transform"
                                            >
                                                <Label label={tag.name} />
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-white/50 italic">Etiket bulunamadı.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
