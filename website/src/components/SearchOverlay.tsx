import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LabeloDefault, Label } from '../pages/MainPage/ArticleCard';
import { NAV_DATA } from './Footer';
import { SocialIcons, Logo, CloseButton } from './SiteHeader';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
    'Güncel': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600',
    'Tarih': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600',
    'Kuram': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600',
    'Felsefe': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600',
    'Kültür-Sanat': 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=600',
    'Dünya': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600',
    'Spor': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600',
};

const POPULAR_COUNT = 12;

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllTags, setShowAllTags] = useState(false);

    const allTags = LabeloDefault.filter(l => l.type === 'tag');
    const popularTags = allTags.slice(0, POPULAR_COUNT);
    const otherTags = allTags.slice(POPULAR_COUNT);

    const filteredTags = searchTerm
        ? allTags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : null;

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
                    {/* ── WHITE HEADER (restored) ── */}
                    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] border-b border-white/10 bg-[rgb(199,78,38)] sticky top-0 z-10">
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

                        {/* Search Input */}
                        <div className="w-full max-w-xl mx-auto mb-10 relative">
                            <input
                                type="text"
                                placeholder="Genç Hayat'ta ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                className="w-full bg-transparent border-b border-white/40 text-lg md:text-2xl font-bold py-2 px-2 placeholder-white/60 focus:outline-none focus:border-white transition-colors text-center"
                            />
                        </div>

                        <div className="w-full max-w-5xl mx-auto space-y-10 flex-grow">

                            {/* ── 1. Categories Grid ── */}
                            {!searchTerm && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold opacity-80 border-b border-white/20 pb-1 text-center">Kategoriler</h3>
                                    {/* First 4 categories full row; last 3 centered */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {NAV_DATA.categories.slice(0, 4).map((cat) => {
                                            const img = CATEGORY_IMAGES[cat.label] || '';
                                            return (
                                                <Link
                                                    key={cat.label}
                                                    to={cat.to}
                                                    onClick={onClose}
                                                    className="group relative overflow-hidden rounded-md cursor-pointer"
                                                    style={{ aspectRatio: '4 / 1' }}
                                                >
                                                    {img && <img src={img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                                                    <span className="relative z-10 flex items-center justify-center h-full text-center font-bold text-sm tracking-wide text-white drop-shadow">{cat.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    {/* Bottom 3 centered */}
                                    <div className="flex justify-center gap-3">
                                        {NAV_DATA.categories.slice(4).map((cat) => {
                                            const img = CATEGORY_IMAGES[cat.label] || '';
                                            return (
                                                <Link
                                                    key={cat.label}
                                                    to={cat.to}
                                                    onClick={onClose}
                                                    className="group relative overflow-hidden rounded-md cursor-pointer w-full max-w-[calc(25%-6px)]"
                                                    style={{ aspectRatio: '4 / 1' }}
                                                >
                                                    {img && <img src={img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                                                    <span className="relative z-10 flex items-center justify-center h-full text-center font-bold text-sm tracking-wide text-white drop-shadow">{cat.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── 2. Tags Section ── */}
                            <div className="space-y-4 pb-8">
                                <h3 className="text-lg font-bold opacity-80 border-b border-white/20 pb-1 text-center">
                                    {searchTerm ? 'Bulunan Etiketler' : 'Popüler Etiketler'}
                                </h3>

                                {searchTerm ? (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {filteredTags && filteredTags.length > 0 ? (
                                            filteredTags.map((tag, idx) => (
                                                <Link key={idx} to={`/category?tag=${encodeURIComponent(tag.name)}`} onClick={onClose} className="hover:scale-105 transition-transform">
                                                    <Label label={tag.name} />
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="text-white/50 italic">Etiket bulunamadı.</p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Popular + other tags in ONE continuous flex container */}
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {popularTags.map((tag, idx) => (
                                                <Link key={idx} to={`/category?tag=${encodeURIComponent(tag.name)}`} onClick={onClose} className="hover:scale-105 transition-transform">
                                                    <Label label={tag.name} />
                                                </Link>
                                            ))}

                                            {/* "Diğer Etiketler" tags appear right after popular ones */}
                                            {showAllTags && otherTags.map((tag, idx) => (
                                                <Link key={`extra-${idx}`} to={`/category?tag=${encodeURIComponent(tag.name)}`} onClick={onClose} className="hover:scale-105 transition-transform">
                                                    <Label label={tag.name} />
                                                </Link>
                                            ))}
                                        </div>

                                        {otherTags.length > 0 && (
                                            <div className="flex justify-center mt-2">
                                                <button
                                                    onClick={() => setShowAllTags(!showAllTags)}
                                                    className="text-xs font-bold uppercase tracking-widest text-white/70 border border-white/30 px-3 py-1.5 rounded hover:border-white hover:text-white transition-colors flex items-center gap-1"
                                                >
                                                    {showAllTags ? 'Kapat' : 'Diğer Etiketler'}
                                                    <svg className={`w-3 h-3 transition-transform duration-300 ${showAllTags ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
