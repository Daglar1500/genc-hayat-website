import { useState, useEffect } from "react";
import { BreakoutGame } from "./MainContent/BreakoutGame";
import { FeedSection } from "./MainContent/FeedSection/index";
import { ArticleLine } from "./MainContent/ArticleLine";
import { FeaturedArticle } from "./MainContent/FeaturedArticle";
import { CategorySection } from "./MainContent/CategorySection";
import { MainSection } from "./MainContent/MainSection";
import { VideoSection } from "./MainContent/YoutubeVideos";
import { ArchiveSection } from "./MainContent/IssuesSection";
import { SpotifySection } from "./MainContent/SpotifyListsSection";
import { LetterboxdSection } from "./MainContent/LetterboxdSection";

import { ArticleCard, Labelo } from "../../pages/MainPage/ArticleCard";

export const MainContent = () => {

  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API'dan dinamik layout verisini çek (VITE_API_URL docker config'inde tanımlı olmalı, şimdilik sabit veya env'den)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    fetch(`${apiUrl}/init`)
      .then(res => res.json())
      .then(data => {
        // Admin panel formatını website ArticleCard formatına dönüştürüyoruz
        const mappedSections = data.sections.map((sec: any) => ({
          ...sec,
          articles: sec.articles.map((a: any) => ({
            href: `/articles/${a.id}`, // veya slug
            title: a.title,
            type: a.type || 'normal',
            description: a.subheading,
            author: a.author,
            place: a.place,
            location: a.school,
            issueNumber: a.issueNumber,
            publishedDate: new Date(a.createdAt),
            firstMedia: { type: 'image', src: a.imageUrl, alt: a.title },
            category: new Labelo('category', a.category),
            tags: a.labels?.map((l: string) => new Labelo('tag', l)) || []
          } as ArticleCard))
        }));
        setSections(mappedSections);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="pt-[100px] text-center w-full py-20 text-gray-500 font-bold">Yükleniyor...</div>;
  }

  // API'den dönen sıralanmış, PINNED veya unpinned 'section'ları döngüyle renderla.
  return (
    <div className="pt-[100px]">
      <FeedSection />

      {/* Sunu/Rota (MainSection kısmı şimdilik aynı, detaylandırılabilir) */}
      <MainSection />

      {/* Dinamik sıralı bloklar (Admin panelindeki layout sıralamasına göre) */}
      {sections.map(sec => {
        if (sec.type === 'category-row') {
          return <CategorySection key={sec.id} categoryTitle={sec.title || "Kategori"} articles={sec.articles} />;
        }
        if (sec.type === 'ordinary-row' || sec.type === 'spot-row') {
          return <ArticleLine key={sec.id} articles={sec.articles} />;
        }
        return null; // feed-row vs için
      })}

      <VideoSection />
      <FeaturedArticle />

      <SpotifySection />
      <LetterboxdSection />

      <ArchiveSection />

      <div className="hidden lg:block">
        <BreakoutGame />
      </div>
    </div>
  );
};