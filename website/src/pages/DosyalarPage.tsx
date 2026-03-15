import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArticleCardElement, ArticleCard, Labelo } from './MainPage/ArticleCard';
import { DOSYA_DATA } from '../data/DosyaData';

export const DosyalarPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const info = DOSYA_DATA[slug || ''] || {
        title: slug || 'Dosya',
        description: 'Bu dosyaya ait tüm yazılar aşağıda listelenmektedir.',
        heroImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80',
    };

    const [articles, setArticles] = useState<ArticleCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            try {
                // Endpoint could be /articles or a specific search endpoint. We fetch all for now and filter, 
                // or ideally backend should have /api/articles?tag=...
                const res = await fetch(`${apiUrl}/articles`);
                const data = await res.json();

                const filterTag = (info.filterTag || slug || '').toLowerCase();

                // Backend'den etiketleri de aldığımızı varsayarak filtreliyoruz (veya backend querysi)
                const filteredData = data.filter((a: any) =>
                    a.labels && a.labels.some((l: string) => l.toLowerCase() === filterTag)
                );

                const mappedArticles = filteredData.map((a: any) => ({
                    href: `/articles/${a.id}`,
                    title: a.title,
                    type: a.type || 'normal',
                    description: a.subheading,
                    author: a.author,
                    place: a.place,
                    location: a.school,
                    issueNumber: a.issueNumber,
                    publishedDate: new Date(a.createdAt),
                    firstMedia: { type: 'image', src: a.imageUrl, alt: a.title, mediaLayout: 'full-width' },
                    category: new Labelo('category', a.category),
                    tags: a.labels?.map((l: string) => new Labelo('tag', l)) || []
                } as ArticleCard));

                setArticles(mappedArticles);
            } catch (err) {
                console.error("Dosya yazıları çekilirken hata oluştu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [slug, info.filterTag]);

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
                    {loading ? (
                        <div className="flex justify-center items-center py-32 text-gray-500">Yükleniyor...</div>
                    ) : articles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                            {articles.map(article => (
                                <ArticleCardElement
                                    key={article.href}
                                    href={article.href}
                                    title={article.title}
                                    type={article.type}
                                    author={article.author}
                                    publishedDate={article.publishedDate}
                                    issueNumber={article.issueNumber}
                                    content={article.content}
                                    firstMedia={article.firstMedia}
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
