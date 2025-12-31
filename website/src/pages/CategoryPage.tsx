import React, { useState, useMemo, useRef, useEffect } from "react";
import { ArticleCardElement, Labelo, LabeloDefault } from "./MainPage/ArticleCard";
import { ReptileCursor } from "../sections/Components/ReptileCursor";
// Mock verinizi çektiğiniz dosya yolunu buraya yazın:
import { MOCK_ARTICLES } from "./MockArticles"; 

export const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklanınca kapanması için event listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Kategorileri MOCK_ARTICLES'dan dinamik olarak çıkar
  const categories = useMemo(() => {
    const uniqueCats = new Set(MOCK_ARTICLES.map(article => {
        // Veri yapısı hem { name: "X" } objesini hem de "X" stringini destekler
        // @ts-ignore: Mock verinizin tipine göre bu kontrol gerekebilir
        return typeof article.category === 'object' ? article.category?.name : article.category;
    }).filter(Boolean));
    return ["Tümü", ...Array.from(uniqueCats)];
  }, []);

  // 2. Seçili kategoriye göre filtrele ve tarihe göre sırala
  const filteredArticles = useMemo(() => {
    let filtered = MOCK_ARTICLES;

    if (selectedCategory !== "Tümü") {
      filtered = filtered.filter(article => {
        // @ts-ignore
        const catName = typeof article.category === 'object' ? article.category?.name : article.category;
        return catName === selectedCategory;
      });
    }

    // Tarihe göre yeniden eskiye sıralama
    return filtered.sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  }, [selectedCategory]);

  const categoryDescription = "Seçtiğiniz alandaki en son gelişmeler, derinlemesine analizler ve ilham verici hikayeler.";
  // Hero görseli (Sabit veya dinamik yapabilirsiniz)
  const heroImage = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="font-bradford text-zinc-800 bg-white min-h-screen flex flex-col">
      <ReptileCursor />
      
      <main className="flex-grow">
        
        {/* --- HERO SECTION --- */}
        <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden">
          {/* Arka Plan */}
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Category Hero" 
              className="w-full h-full object-cover opacity-60 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
          </div>

          {/* Başlık ve Kategori Seçici (Dropdown) */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Dropdown Başlangıcı */}
            <div className="mb-6 relative" ref={dropdownRef}>
               <button 
                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                 className="group flex items-center gap-2 px-5 py-2 border border-white/30 hover:border-white/60 bg-black/20 hover:bg-black/40 text-white text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md rounded-full transition-all duration-300"
               >
                 <span>{selectedCategory}</span>
                 <svg 
                    className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                 >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                 </svg>
               </button>

               {/* Dropdown İçeriği */}
               {isDropdownOpen && (
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat as string}
                          onClick={() => {
                            setSelectedCategory(cat as string);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-200
                            ${selectedCategory === cat 
                              ? 'bg-white text-black' 
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                          {cat as string}
                        </button>
                      ))}
                    </div>
                 </div>
               )}
            </div>
            {/* Dropdown Bitişi */}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight text-balance">
              {selectedCategory === "Tümü" ? "Keşfet" : selectedCategory}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-serif max-w-2xl mx-auto leading-relaxed">
              {categoryDescription}
            </p>
          </div>
        </div>

        {/* --- ARTICLE GRID --- */}
        <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] bg-gray-50">
          <div className="max-w-[1400px] mx-auto">
            
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredArticles.map((article) => {
                  // Veri güvenliği ve tip kontrolü (Optional Chaining)
                  // @ts-ignore
                  const catName = typeof article.category === 'object' ? article.category?.name : article.category;
                  // @ts-ignore
                  const authorName = typeof article.author === 'object' ? article.author?.name : article.author;
                  const firstTag = article.tags && article.tags.length > 0 ? article.tags[0] : "";

                  return (
                    <ArticleCardElement
                      href= {article.href}
                      title={article.title}
                      author={authorName || "Yazar"}
                      publishedDate={article.publishedDate}
                      issueNumber= { article.issueNumber }
                      
                      // Content yapısı: block -> blockContent -> textContent
                      content={article.content}
                      
                      // Medya yapısı
                      firstMedia={{
                        type: "image",
                        src: article.firstMedia?.src || "",
                        alt: article.title,
                        mediaLayout: "full-width"
                      }}
                      
                      // Kategori (Zorunlu)
                      category={article.category}
                      
                      // Etiketler ve Kategori Görünümü
                      twoLabelShown={article.twoLabelShown}
                      
                      tags={article.tags ? article.tags : []}
                    />
                  );
                })}
              </div>
            ) : (
              // Filtre sonucu boşsa
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 font-serif">Bu kategoride henüz yazı bulunmamaktadır.</p>
                <button 
                  onClick={() => setSelectedCategory("Tümü")}
                  className="mt-4 text-sm font-bold underline decoration-2 underline-offset-4 hover:text-black transition-colors"
                >
                  Tüm yazıları gör
                </button>
              </div>
            )}

            {/* Yükle Butonu */}
            {filteredArticles.length > 0 && (
              <div className="mt-20 text-center">
                 <button className="px-8 py-3 border border-gray-300 text-gray-600 font-bold uppercase text-xs tracking-widest hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                   Daha Fazla Göster
                 </button>
              </div>
            )}

          </div>
        </section>

      </main>

    </div>
  );
};

export default CategoryPage;