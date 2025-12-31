import { useState } from "react";
import { Footer } from "./sections/Footer";
import { MainContent } from "./pages/MainPage";
import SiteHeader from "./sections/Components/SiteHeader";
import { FloatingNavbar } from "./sections/Components/Components";
import { ShareFloatingButton } from "./sections/Components/Components";
import { DiscoverFeed } from "./pages/MainPage/MainContent/FeedSection/DiscoverFeed";
import { DiscoverContext } from "./pages/MainPage/MainContent/FeedSection/DiscoverContext";
import ArticleDetail from "./pages/ArticleDetail";
import { FeaturedArticleDetail } from "./pages/FeaturedArticleDetail";
import { CategoryPage } from "./pages/CategoryPage";
import { IssuesPage } from "./pages/IssuePage";


export const App = () => {
  // Keşfet menüsünün açık olup olmadığını kontrol eden state
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);

  const openDiscover = () => setIsDiscoverOpen(true);
  const closeDiscover = () => setIsDiscoverOpen(false);

  return (
    <DiscoverContext.Provider value={{ isOpen: isDiscoverOpen, openDiscover, closeDiscover }}>
      <div className="min-h-screen w-full flex flex-col font-bradford text-zinc-800 bg-white">
        
        <SiteHeader isTransparent={false} />
        
        {/* Main içeriği büyüyerek footer'ı aşağı iter */}
        <main className="flex-grow flex flex-col w-full">

          <div className="relative box-border caret-transparent tracking-[0.108px] z-[1] md:tracking-[0.09px]">
                <div className="box-border caret-transparent tracking-[0.108px] md:tracking-[0.09px]">
                  <FloatingNavbar />
                  <SiteHeader isTransparent = {true}/>
                  <CategoryPage />
                </div>
          </div>
              
        </main>

        <Footer />

        {/* Discover Feed Overlay - State true ise gösterilir */}
        {isDiscoverOpen && (
          <DiscoverFeed onClose={closeDiscover} />
        )}
      </div>
    </DiscoverContext.Provider>
  );
};
