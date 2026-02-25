import { useParams } from 'react-router-dom';
import { MOCK_ARTICLES } from '../data/MockArticles';
import { ArticleCardElement } from './MainPage/ArticleCard';

// --- Dosya Veri ---
interface DosyaInfo {
    title: string;
    description: string;
    heroImage: string;
    filterTag?: string;
}

const DOSYA_DATA: Record<string, DosyaInfo> = {
    'cumhuriyet': {
        title: 'Cumhuriyet',
        description: 'Cumhuriyetin tarihsel sürecini, ideallerini ve günümüzdeki yansımalarını ele alıyoruz.',
        heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'cumhuriyet',
    },
    '8-mart': {
        title: '8 Mart',
        description: "8 Mart Dünya Emekçi Kadınlar Günü'ne dair yazılar ve analizler.",
        heroImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80',
        filterTag: '8 mart',
    },
    'antiemperyalizm': {
        title: 'Antiemperyalizm',
        description: 'Emperyalizme karşı mücadele ve antiemperyalist hareketler üzerine derinlemesine analizler.',
        heroImage: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'antiemperyalizm',
    },
    'anadil': {
        title: 'Anadil',
        description: 'Anadil hakkı, dil politikaları ve dilsel çeşitlilik üzerine yazılar.',
        heroImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'anadil',
    },
};

export const DosyalarPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const info = DOSYA_DATA[slug || ''] || {
        title: slug || 'Dosya',
        description: 'Bu dosyaya ait tüm yazılar aşağıda listelenmektedir.',
        heroImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80',
    };

    const articles = MOCK_ARTICLES.filter(a =>
        a.tags?.some(t => t.name.toLowerCase() === (info.filterTag || slug || '').toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white font-bradford">

            {/* --- HERO --- */}
            <div className="relative w-full h-[55vh] min-h-[400px] flex items-end bg-gray-900 overflow-hidden">
                <img
                    src={info.heroImage}
                    alt={info.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

                <div className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] pb-12 max-w-[1400px] mx-auto w-full">
                    <p className="text-white/60 text-xs tracking-[3px] uppercase font-labilvariable mb-3">Dosya</p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-4">
                        {info.title}
                    </h1>
                    <p className="text-lg text-gray-200 font-serif max-w-2xl leading-relaxed">
                        {info.description}
                    </p>
                </div>
            </div>

            {/* --- ARTICLES --- */}
            <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] py-16">
                <div className="max-w-[1400px] mx-auto">
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                            {articles.map(article => (
                                <ArticleCardElement
                                    key={article.href}
                                    href={article.href}
                                    title={article.title}
                                    author={article.author}
                                    publishedDate={article.publishedDate}
                                    issueNumber={article.issueNumber}
                                    content={article.content}
                                    firstMedia={{ type: 'image', src: article.firstMedia?.src || '', alt: article.title, mediaLayout: 'full-width' }}
                                    category={article.category}
                                    twoLabelShown={article.twoLabelShown}
                                    tags={article.tags || []}
                                    place={article.place}
                                    location={article.location}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-xl text-gray-500 font-serif italic">
                                Bu dosya için henüz içerik bulunmuyor.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DosyalarPage;
