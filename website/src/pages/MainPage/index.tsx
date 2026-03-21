import { useState, useEffect } from "react";
import { useSeo } from "../../lib/useSeo";
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
  useSeo({ title: undefined, description: 'Genç Hayat — Gençliğin Sesi' });

  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setFetchError] = useState(false);

  const fetchSections = () => {
    const apiUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3001/api';
    fetch(`${apiUrl}/init`)
      .then(res => res.json())
      .then(data => {
        const mappedSections = data.sections.map((sec: any) => ({
          ...sec,
          articles: (sec.articles || []).map((a: any) => ({
            href: `/articles/${a.id}`,
            title: a.title,
            type: a.type || 'normal',
            description: a.subheading,
            author: a.author,
            place: a.place,
            location: a.school,
            issueNumber: a.issueNumber,
            publishedDate: new Date(a.createdAt),
            firstMedia: { type: 'image', src: a.imageUrl, alt: a.title },
            category: new Labelo('category', a.category || 'Güncel'),
            tags: (a.labels || []).filter(Boolean).map((l: string) => new Labelo('tag', l))
          } as ArticleCard))
        }));
        setSections(mappedSections);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Fetch Error:", err);
        setFetchError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSections();
  }, []);

  if (loading) {
    return <div className="pt-[100px] text-center w-full py-20 text-gray-500 font-bold">Yükleniyor...</div>;
  }

  return (
    <div className="pt-[100px]">
      <FeedSection />
      <MainSection />

      {sections.map(sec => {
        if (sec.isVisible === false) return null;

        if (sec.type === 'category-row') {
          return <CategorySection key={sec.id} categoryTitle={sec.title || "Kategori"} articles={sec.articles} />;
        }
        if (sec.type === 'ordinary-row') {
          return <ArticleLine key={sec.id} articles={sec.articles} />;
        }
        if (sec.type === 'spot-row') {
          return <FeaturedArticle key={sec.id} article={sec.articles[0]} />;
        }
        if (sec.type === 'video-row' && sec.config) {
          return <VideoSection key={sec.id} videos={sec.config.videos || []} channelUrl={sec.config.channelUrl || ''} />;
        }
        if (sec.type === 'spotify-row' && sec.config) {
          return <SpotifySection key={sec.id} playlists={sec.config.playlists || []} profileUrl={sec.config.profileUrl || ''} playlistCount={sec.config.playlistCount} />;
        }
        if (sec.type === 'letterboxd-row' && sec.config) {
          return <LetterboxdSection key={sec.id} films={sec.config.films || []} profileUrl={sec.config.profileUrl || ''} />;
        }
        return null;
      })}

      <ArchiveSection />

      <div className="hidden lg:block">
        <BreakoutGame />
      </div>
    </div>
  );
};