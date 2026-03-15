import { useState, useEffect } from "react";
import { Label, ArticleCardElement, ArticleCard, Labelo } from "../../ArticleCard";

export const FeaturedArticle = () => {
  const [featuredArticleData, setFeaturedArticleData] = useState<ArticleCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArticle = async () => {
      const apiUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3001/api';
      try {
        // İdealde API'da ?type=featured gibi bir endpoint olmalı
        const res = await fetch(`${apiUrl}/articles`);
        const data = await res.json();

        const featuredData = data.find((a: any) => a.type === 'featured' || a.category === 'Manşet') || data[0];

        if (featuredData) {
          const mappedArticle: ArticleCard = {
            href: `/articles/${featuredData.id}`,
            title: featuredData.title,
            type: featuredData.type || 'normal',
            description: featuredData.subheading || featuredData.content?.substring(0, 150),
            author: featuredData.author,
            place: featuredData.place,
            location: featuredData.school,
            issueNumber: featuredData.issueNumber,
            publishedDate: new Date(featuredData.createdAt),
            firstMedia: { type: 'image', src: featuredData.imageUrl, alt: featuredData.title, mediaLayout: 'full-width' },
            category: new Labelo('category', featuredData.category),
            tags: featuredData.labels?.map((l: string) => new Labelo('tag', l)) || [],
            content: [{ blockContent: { type: 'text', textContent: featuredData.content || '' } }]
          };
          setFeaturedArticleData(mappedArticle);
        }
      } catch (err) {
        console.error("Öne çıkan yazı çekilirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticle();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Yükleniyor...</div>;
  if (!featuredArticleData) return null;

  return (
    <section className="relative w-full min-h-screen flex items-center">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {featuredArticleData.firstMedia && (
          <img
            src={featuredArticleData.firstMedia.src}
            alt={featuredArticleData.firstMedia.alt || featuredArticleData.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-0 py-20">

        {/* White Box - 'relative' sınıfı eklendi */}
        {/* GÜNCELLEME: lg:ml-20 yerine lg:ml-[140px] yapıldı */}
        <div className="relative bg-white p-8 md:p-9 shadow-2xl md:ml-[5%] lg:ml-[140px] w-full max-w-[800px] transition-transform duration-500 hover:shadow-3xl">

          {/* --- YENİ EKLENEN: SPOT KUTUSU --- */}
          <div className="absolute top-0 right-0 bg-red-600 text-white uppercase font-bold tracking-wider text-xs md:text-sm px-4 py-2 shadow-sm z-20">
            Spot
          </div>
          {/* -------------------------------- */}

          {/* Title */}
          <h2 className="mb-6 md:mb-10 mt-4 md:mt-0"> {/* 'mt-4' eklendi: mobilde spot kutusunun başlığın üstüne binmesini önlemek için */}
            <a
              href={featuredArticleData.href || '#'}
              className="text-3xl md:text-[55px] font-labil font-semibold leading-tight hover:text-red-600 transition-colors duration-300 text-black block"
            >
              {featuredArticleData.title}
            </a>
          </h2>

          {/* İki Sütunlu Yapı: Description | Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">

            {/* Sol Sütun: Description */}
            <div>
              <p className="text-base md:text-lg text-zinc-600 leading-relaxed font-serif">
                {featuredArticleData.description}
              </p>
            </div>

            {/* Sağ Sütun: Tags */}
            <div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {featuredArticleData.tags?.map((tag) => {
                  const tagHref = (tag as any).href || `/tags/${tag.name.toLowerCase().replace(/\s+/g, '-')}`;

                  return (
                    <a key={tag.name} href={tagHref} className="hover:opacity-80 transition-opacity">
                      <Label label={tag.name} />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};