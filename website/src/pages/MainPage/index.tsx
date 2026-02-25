import { FloatingNavbar } from "../../components/FloatingNavbar";
import { SiteHeader } from "../../components/SiteHeader";
import { BreakoutGame } from "./MainContent/BreakoutGame";
import { FeedSection } from "./MainContent/FeedSection/index";
import { ArticleLine } from "./MainContent/ArticleLine";
import { FeaturedArticle } from "./MainContent/FeaturedArticle";
import { CategorySection } from "./MainContent/CategorySection";
import { MainSection } from "./MainContent/MainSection";
import { ShareFloatingButton } from "../../components/ShareFloatingButton";
import { VideoSection } from "./MainContent/YoutubeVideos";
import { MOCK_ARTICLES } from "../../data/MockArticles";
import { ArchiveSection } from "./MainContent/IssuesSection"
import { SpotifySection } from "./MainContent/SpotifyListsSection";

export const MainContent = () => {

  // --- VERİ HAZIRLIĞI ---

  // 1. Kategori Bazlı Filtrelemeler
  const tarihArticles = MOCK_ARTICLES.filter(a => a.category.name === "tarih").slice(0, 3);
  const guncelArticles = MOCK_ARTICLES.filter(a => a.category.name === "güncel").slice(0, 3);
  const felsefeArticles = MOCK_ARTICLES.filter(a => a.category.name === "felsefe").slice(0, 3);

  // 2. Article Line için Karma veya Özel Listeler
  // Örneğin: İlk 4 makale
  const lineArticles1 = MOCK_ARTICLES.slice(0, 4);
  // Örneğin: 4. ile 8. arasındaki makaleler
  const lineArticles2 = MOCK_ARTICLES.slice(4, 8);
  // Örneğin: Rastgele veya özel seçilmiş bir liste
  const lineArticles3 = MOCK_ARTICLES.slice(8, 12);

  return (
    <div className="pt-[100px]">
      <FeedSection />
      <MainSection />

      {/* Article Line'a veri gönderiyoruz */}
      <ArticleLine articles={lineArticles1} />

      <VideoSection />
      <FeaturedArticle />

      <ArticleLine articles={lineArticles2} />



      {/* Category Section artık hem başlığı hem de veriyi bizden alıyor */}
      <CategorySection categoryTitle="Tarih" articles={tarihArticles} />

      <ArticleLine articles={lineArticles1} /> {/* İsterseniz tekrar aynı veriyi kullanabilirsiniz */}

      <CategorySection categoryTitle="Güncel" articles={guncelArticles} />

      <ArticleLine articles={lineArticles2} />

      <CategorySection categoryTitle="Felsefe" articles={felsefeArticles} />

      <ArticleLine articles={lineArticles3} />

      <SpotifySection />

      <ArchiveSection />
      {/* Sadece desktop modda (lg ve üzeri ekranlarda) görünür */}
      <div className="hidden lg:block">
        <BreakoutGame />
      </div>
    </div>
  );
};