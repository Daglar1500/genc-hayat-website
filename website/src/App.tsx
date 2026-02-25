import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { MainContent } from "./pages/MainPage";
import SiteHeader from "./components/SiteHeader";
import { FloatingNavbar } from "./components/FloatingNavbar";
import { SearchOverlay } from "./components/SearchOverlay";
import { DiscoverFeed } from "./pages/MainPage/MainContent/FeedSection/DiscoverFeed";
import { DiscoverContext } from "./pages/MainPage/MainContent/FeedSection/DiscoverContext";
import { FeaturedArticleDetail } from "./pages/FeaturedArticleDetail";
import { CategoryPage } from "./pages/CategoryPage";
import { IssuesPage } from "./pages/IssuePage";
import { AboutPage } from "./pages/AboutPage";
import { ThematicPage } from "./pages/ThematicPage";
import { DosyalarPage } from "./pages/DosyalarPage";
import { IssueDetailPage } from "./pages/IssueDetailPage";

// Layout wrapper: SiteHeader + Footer + FloatingNavbar + Overlays
const Layout = ({
  children,
  openSearch,
}: {
  children: React.ReactNode;
  openSearch: () => void;
}) => {
  return (
    <>
      <SiteHeader />
      <main className="flex-grow flex flex-col w-full">
        <div className="relative box-border caret-transparent tracking-[0.108px] z-[1] md:tracking-[0.09px]">
          <div className="box-border caret-transparent tracking-[0.108px] md:tracking-[0.09px]">
            <div className="hidden md:flex fixed bottom-0 w-full z-50">
              <FloatingNavbar onSearchClick={openSearch} />
            </div>
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export const App = () => {
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const openDiscover = () => setIsDiscoverOpen(true);
  const closeDiscover = () => setIsDiscoverOpen(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <DiscoverContext.Provider value={{ isOpen: isDiscoverOpen, openDiscover, closeDiscover }}>
      <div className="min-h-screen w-full flex flex-col font-bradford text-zinc-800 bg-white">

        <Routes>
          {/* Ana Sayfa */}
          <Route
            path="/"
            element={
              <Layout openSearch={openSearch}>
                <MainContent />
              </Layout>
            }
          />

          {/* Kategori Sayfası — hem slug hem query param destekler */}
          <Route
            path="/category"
            element={
              <Layout openSearch={openSearch}>
                <CategoryPage />
              </Layout>
            }
          />
          <Route
            path="/category/:slug"
            element={
              <Layout openSearch={openSearch}>
                <CategoryPage />
              </Layout>
            }
          />

          {/* Yazı Detay */}
          <Route
            path="/articles/:slug"
            element={
              <Layout openSearch={openSearch}>
                <FeaturedArticleDetail />
              </Layout>
            }
          />

          {/* Tüm Sayılar Listesi */}
          <Route
            path="/sayilar"
            element={
              <Layout openSearch={openSearch}>
                <IssuesPage />
              </Layout>
            }
          />

          {/* Sayı Detay (tek bir sayının yazıları) */}
          <Route
            path="/sayi/:id"
            element={
              <Layout openSearch={openSearch}>
                <IssueDetailPage />
              </Layout>
            }
          />

          {/* Hakkımızda */}
          <Route
            path="/hakkimizda"
            element={
              <Layout openSearch={openSearch}>
                <AboutPage />
              </Layout>
            }
          />

          {/* Tematik */}
          <Route
            path="/tematik/:slug"
            element={
              <Layout openSearch={openSearch}>
                <ThematicPage />
              </Layout>
            }
          />

          {/* Dosyalar */}
          <Route
            path="/dosyalar/:slug"
            element={
              <Layout openSearch={openSearch}>
                <DosyalarPage />
              </Layout>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <Layout openSearch={openSearch}>
                <MainContent />
              </Layout>
            }
          />
        </Routes>

        {/* Discover Feed Overlay */}
        {isDiscoverOpen && (
          <DiscoverFeed onClose={closeDiscover} />
        )}

        <SearchOverlay isOpen={isSearchOpen} onClose={closeSearch} />
      </div>
    </DiscoverContext.Provider>
  );
};
