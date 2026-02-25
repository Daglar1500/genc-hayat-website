import { useParams } from 'react-router-dom';
import { MOCK_ARTICLES } from '../data/MockArticles';
import { ArticleCardElement } from './MainPage/ArticleCard';

// --- Tematik Veri ---
interface ThematicInfo {
    title: string;
    description: string;
    heroImage: string;
    filterTag?: string; // MOCK_ARTICLES içinde eşleştirilecek tag adı
}

const THEMATIC_DATA: Record<string, ThematicInfo> = {
    'bir-olay-bir-kavram': {
        title: 'Bir Olay Bir Kavram',
        description: 'Güncel olayları kuramsal bir perspektifle ele aldığımız köşe yazıları.',
        heroImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'bir olay bir kavram',
    },
    'portre': {
        title: 'Portre',
        description: 'Tarihe ve günümüze iz bırakan isimlerin hayatlarını derinlemesine inceliyoruz.',
        heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'portre',
    },
    'nato': {
        title: 'NATO',
        description: "NATO'nun tarihini, güncel gelişmelerini ve bölgesel etkilerini analiz ediyoruz.",
        heroImage: 'https://images.unsplash.com/photo-1529101091760-61df6be5d187?auto=format&fit=crop&w=1600&q=80',
        filterTag: 'nato',
    },
};

export const ThematicPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const info = THEMATIC_DATA[slug || ''] || {
        title: slug || 'Tematik',
        description: 'Bu tematik bölüme ait içerikler aşağıda listelenmektedir.',
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
                    <p className="text-white/60 text-xs tracking-[3px] uppercase font-labilvariable mb-3">Tematik</p>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <p className="text-xl text-gray-500 font-serif italic">
                                Bu tematik için henüz içerik bulunmuyor.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ThematicPage;
