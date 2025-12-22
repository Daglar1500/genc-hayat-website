import { useState } from "react";
import { Footer } from "./sections/Footer";
import { MainContent } from "./sections/MainContent";
import SiteHeader from "./sections/SiteHeader";
import { DiscoverFeed } from "./sections/MainContent/sections/FeedSection/DiscoverFeed";
import { DiscoverContext } from "./sections/MainContent/sections/FeedSection/DiscoverContext";


export const App = () => {
  // Keşfet menüsünün açık olup olmadığını kontrol eden state
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);

  const openDiscover = () => setIsDiscoverOpen(true);
  const closeDiscover = () => setIsDiscoverOpen(false);

  return (
    <DiscoverContext.Provider value={{ isOpen: isDiscoverOpen, openDiscover, closeDiscover }}>
      {/* Düzeltme: 
        1. 'body' etiketi yerine 'div' kullanıldı (React içinde body kullanımı önerilmez).
        2. 'min-h-screen', 'flex', 'flex-col' ile tam sayfa düzeni sağlandı.
        3. Gereksiz 'tracking', 'leading', 'indent' gibi stiller kaldırıldı.
        4. Arka plan rengi 'bg-white' olarak ayarlandı.
      */}
      <div className="min-h-screen w-full flex flex-col font-bradford text-zinc-800 bg-white">
        
        <SiteHeader isTransparent={false} />
        
        {/* Main içeriği büyüyerek footer'ı aşağı iter */}
        <main className="flex-grow flex flex-col w-full">
          <MainContent />
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