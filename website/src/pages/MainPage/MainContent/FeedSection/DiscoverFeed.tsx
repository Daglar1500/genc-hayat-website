import { useState, useEffect } from "react";
import logo from '../../../../public/logo.png';
import { FEED_ITEMS } from "./index";

// Logo bileşeni - Logo boyutu büyütüldü (h-16)
const FeedLogo = () => (
  <div className="flex justify-center py-6 border-b border-gray-100/20 bg-transparent transition-all duration-300">
    <img 
      src={logo}
      alt="Genç Hayat" 
      className="h-16 w-auto object-contain drop-shadow-sm" 
    />
  </div>
);

interface DiscoverFeedProps {
  onClose: () => void;
}

export const DiscoverFeed = ({ onClose }: DiscoverFeedProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scrollu kilitle
    document.body.style.overflow = 'hidden';
    setTimeout(() => setLoading(false), 500);

    return () => {
      // Scroll kilidini kaldır
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    // Overlay Container: Tüm ekranı kaplar, z-index en üstte, arka plan flu
    <div className="fixed inset-0 z-[60] flex justify-center backdrop-blur-md bg-black/40">
      
      {/* Kapatma Butonu (Dışarıda, sağ üstte) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
        title="Kapat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* İçerik Sütunu: Genişlik mobilde tam, desktopta %45 */}
      <div 
        className="w-full md:w-[45%] h-full bg-white/0 overflow-y-auto relative animate-in slide-in-from-bottom-10 duration-300"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Logo Bölümü */}
        <FeedLogo />

        {/* Akış İçeriği */}
        <div className="px-4 py-8 pb-20 space-y-12">
          {FEED_ITEMS.map((item) => (
            // Article Card
            <article key={item.id} className="flex flex-col bg-white shadow-sm backdrop-blur-sm overflow-hidden">
              
              {/* İçerik Wrapper */}
              <div className="p-6 pb-2">
                {/* Üst Kısım: Başlık, Yazar, Konum */}
                <div className="flex items-start gap-4 mb-5">
                  {/* Logo: Daire şeklinde kırpılmış */}
                  <div className="w-14 h-14 flex-shrink-0 mt-1 rounded-full overflow-hidden bg-gray-50">
                    <img 
                      src={item.logo} 
                      alt="Publication Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                     {/* Başlık */}
                     <h2 className="text-2xl font-bold leading-tight text-zinc-900 mb-1">{item.title}</h2>
                     
                     {/* Yazar ve Konum */}
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-red-600 uppercase tracking-wider">{item.author}</span>
                        <span className="text-xs text-gray-500 font-medium mt-0.5">{item.location}</span>
                     </div>
                  </div>
                </div>

                {/* Orta Kısım: Metin */}
                <div className="mb-6">
                  <p className="text-zinc-700 font-serif text-xl leading-relaxed line-clamp-4">
                    {item.excerpt}
                  </p>
                  <a 
                    href={item.href} 
                    className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:text-red-600 hover:border-red-600 transition-colors"
                  >
                    Devamını Oku
                  </a>
                </div>
              </div>

              {/* Alt Kısım: Görsel */}
              <div className="w-full mt-auto">
                 <img 
                   src={item.imageUrl} 
                   alt={item.title} 
                   className="w-full h-auto object-cover block"
                   loading="lazy"
                 />
              </div>

            </article>
          ))}

          {/* Yükleniyor İkonu */}
          <div className="pt-4 pb-6 flex justify-center text-white/80">
             <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};