import { FeedSection } from "./MainContent/FeedSection/index";
import { ArticleLine } from "./MainContent/ArticleLine";
import { FeaturedArticle } from "./MainContent/FeaturedArticle";
import { CategorySection } from "./MainContent/CategorySection";
import { MainSection } from "./MainContent/MainSection";
import { VideoSection } from "./MainContent/YoutubeVideos";
import { ArchiveSection } from "./MainContent/IssuesSection";
import { SpotifySection } from "./MainContent/SpotifyListsSection";
import { LetterboxdSection } from "./MainContent/LetterboxdSection";
import { BreakoutGame } from "./MainContent/BreakoutGame";
import { useApi, toArticleCard } from "../../lib/ApiContext";

export const MainContent = () => {
  const { data } = useApi();

  const dynamicSections = data?.sections.filter(
    s => s.type !== 'article-feed' && s.type !== 'main-row'
  ) ?? [];

  return (
    <div className="pt-[100px]">
      <FeedSection />
      <MainSection />

      {dynamicSections.map((section) => {
        if (section.isVisible === false) return null;

        if (section.type === 'ordinary-row') {
          const articles = section.articles.map(toArticleCard);
          if (!articles.length) return null;
          return <ArticleLine key={section.id} articles={articles} />;
        }
        if (section.type === 'category-row') {
          const articles = section.articles.map(toArticleCard);
          if (!articles.length) return null;
          return <CategorySection key={section.id} categoryTitle={section.title || ''} articles={articles} />;
        }
        if (section.type === 'spot-row') {
          if (!section.articles.length) return null;
          return <FeaturedArticle key={section.id} article={toArticleCard(section.articles[0])} />;
        }
        if (section.type === 'video-row') {
          const cfg = section.config || {};
          if (!cfg.videos?.length) return null;
          return <VideoSection key={section.id} videos={cfg.videos} channelUrl={cfg.channelUrl || ''} />;
        }
        if (section.type === 'spotify-row') {
          const cfg = section.config || {};
          if (!cfg.playlists?.length) return null;
          return <SpotifySection key={section.id} playlists={cfg.playlists} profileUrl={cfg.profileUrl || ''} />;
        }
        if (section.type === 'letterboxd-row') {
          const cfg = section.config || {};
          if (!cfg.films?.length) return null;
          return <LetterboxdSection key={section.id} films={cfg.films} profileUrl={cfg.profileUrl || ''} />;
        }
        if (section.type === 'archive-row') {
          return <ArchiveSection key={section.id} />;
        }
        return null;
      })}

      <div className="hidden lg:block">
        <BreakoutGame />
      </div>
    </div>
  );
};
