import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArticleCardElement } from "./MainPage/ArticleCard";
import { ReptileCursor } from "../lib/ReptileCursor";
import { MOCK_ARTICLES } from "../data/MockArticles";

// --- KATEGORİ GÖRSELLERİ ---
const CATEGORY_IMAGES: Record<string, string> = {
  "tümü": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80",
  "güncel": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80",
  "tarih": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1600&q=80",
  "kuram": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80",
  "felsefe": "https://images.unsplash.com/photo-1525127752301-99b0b6377224?auto=format&fit=crop&w=1600&q=80",
  "kültür-sanat": "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1600&q=80",
  "dünya": "https://images.unsplash.com/photo-1529101091760-61df6be5d187?auto=format&fit=crop&w=1600&q=80",
  "spor": "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80",
};

export const CategoryPage = () => {
  // --- URL PARAMS ---
  const [searchParams] = useSearchParams();

  // --- STATE — initialized from URL query params ---
  const initialCategory = searchParams.get('category') || "Tümü";
  const initialTag = searchParams.get('tag');

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTagFilterVisible, setIsTagFilterVisible] = useState(!!initialTag);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // URL params değişince state güncelle (navigasyon ile sayfa yeniden rendar edilince)
  useEffect(() => {
    const cat = searchParams.get('category') || "Tümü";
    const tag = searchParams.get('tag');
    setSelectedCategory(cat);
    setSelectedTags(tag ? [tag] : []);
    setIsTagFilterVisible(!!tag);
  }, [searchParams]);

  // Dropdown dışına tıklanınca kapanması için
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- VERİ HAZIRLIĞI ---

  const categories = useMemo(() => {
    const names = MOCK_ARTICLES.map(article => article.category?.name).filter(Boolean);
    const uniqueCats = new Set(names);
    return ["Tümü", ...Array.from(uniqueCats)];
  }, []);

  const allTags = useMemo(() => {
    const tags = MOCK_ARTICLES.flatMap(article => article.tags || []).map(t => t.name);
    return Array.from(new Set(tags)).sort();
  }, []);

  const filteredArticles = useMemo(() => {
    let filtered = MOCK_ARTICLES;

    // A. Kategori Filtresi
    if (selectedCategory !== "Tümü") {
      filtered = filtered.filter(article =>
        article.category?.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // B. Etiket Filtresi (AND Logic)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(article => {
        const articleTagNames = article.tags?.map(t => t.name) || [];
        return selectedTags.every(selectedTag => articleTagNames.includes(selectedTag));
      });
    }

    // C. Tarihe Göre Sıralama
    return filtered.sort((a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  }, [selectedCategory, selectedTags]);

  const currentHeroImage = CATEGORY_IMAGES[selectedCategory.toLowerCase()] || CATEGORY_IMAGES["tümü"];

  // --- HANDLERS ---

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const tagLink = (e.target as HTMLElement).closest("a[data-tag]");
    if (tagLink) {
      e.preventDefault();
      const tagName = tagLink.getAttribute("data-tag");
      if (tagName) {
        setSelectedTags([tagName]);
        setIsTagFilterVisible(true);
        window.scrollTo({ top: window.innerHeight * 0.4, behavior: 'smooth' });
      }
    }
  };

  const categoryDescription = "Seçtiğiniz alandaki en son gelişmeler, derinlemesine analizler ve ilham verici hikayeler.";

  return (
    <div className="font-bradford text-zinc-800 bg-white min-h-screen flex flex-col">
      <ReptileCursor />

      <main className="flex-grow">

        {/* --- HERO SECTION --- */}
        <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden transition-all duration-500">
          <div className="absolute inset-0">
            <img
              key={currentHeroImage}
              src={currentHeroImage}
              alt={`${selectedCategory} Hero`}
              className="w-full h-full object-cover opacity-60 transition-opacity duration-700 animate-in fade-in zoom-in-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight text-balance">
              {selectedCategory === "Tümü" ? "Keşfet" : selectedCategory}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-serif max-w-2xl mx-auto leading-relaxed">
              {categoryDescription}
            </p>
          </div>
        </div>

        {/* --- STICKY FILTER BAR --- */}
        <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-30 shadow-sm transition-all duration-300">
          <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col items-center">

            {/* ÜST BAR: Kategori Dropdown (SOLDA) + Filtre Butonu (SAĞDA) */}
            <div className="flex flex-wrap items-center justify-center gap-4">

              {/* 1. KATEGORİ DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="group flex items-center gap-2 px-5 py-2 border border-gray-300 hover:border-black bg-white text-zinc-800 text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-sm"
                >
                  <span>{selectedCategory}</span>
                  <svg className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat as string}
                          onClick={() => {
                            setSelectedCategory(cat as string);
                            setSelectedTags([]);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-200
                                        ${selectedCategory === cat ? 'bg-zinc-100 text-black font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                        >
                          {cat as string}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. ETİKET FİLTRE PANELİ AÇMA BUTONU */}
              <button
                onClick={() => setIsTagFilterVisible(!isTagFilterVisible)}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full border transition-all duration-300 shadow-sm
                            ${isTagFilterVisible || selectedTags.length > 0
                    ? 'bg-zinc-800 text-white border-zinc-800'
                    : 'bg-white text-gray-500 border-gray-300 hover:border-black hover:text-black'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                {selectedTags.length > 0 ? `${selectedTags.length} Filtre` : 'Etiketleri Filtrele'}
                <svg className={`w-3 h-3 transition-transform ${isTagFilterVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            {/* GENİŞLEYEN ETİKET PANELİ */}
            {isTagFilterVisible && (
              <div className="w-full mt-6 animate-in slide-in-from-top-2 duration-300 border-t border-gray-200 pt-4">
                <p className="text-center text-xs text-gray-400 mb-3 italic">
                  Seçilen etiketlerin <span className="font-bold text-gray-600">tümünü</span> içeren yazılar listelenir.
                </p>

                <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto pb-4">
                  {allTags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`group inline-flex items-center justify-center px-2.5 py-[5px] transition-colors duration-50 cursor-pointer
                                            ${isSelected
                            ? 'bg-red-600 text-white' // SEÇİLİ: Kırmızı Zemin
                            : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' // SEÇİLİ DEĞİL: Hover Efektli
                          }`}
                      >
                        <span className={`text-[11px] tracking-[1px] leading-4 font-labilvariable md:font-labil
                                            ${isSelected ? 'text-white' : 'text-red-600 group-hover:text-white'}`}
                        >
                          {tag}
                        </span>

                        {/* SADECE SEÇİLİ İSE X İKONU GÖSTER */}
                        {isSelected && (
                          <svg className="w-3 h-3 ml-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}

                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => setSelectedTags([])}
                      className="px-3 py-1.5 text-[11px] font-bold text-red-600 hover:underline decoration-2"
                    >
                      Temizle
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- ARTICLE GRID --- */}
        <section className="py-12 md:py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] bg-gray-50 min-h-[600px]">
          <div className="max-w-[1400px] mx-auto">

            <div
              onClick={handleGridClick}
              className={filteredArticles.length > 0 ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8" : ""}
            >
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <ArticleCardElement
                    key={article.href}
                    href={article.href}
                    title={article.title}
                    author={article.author}
                    publishedDate={article.publishedDate}
                    issueNumber={article.issueNumber}
                    content={article.content}
                    firstMedia={{
                      type: "image",
                      src: article.firstMedia?.src || "",
                      alt: article.title,
                      mediaLayout: "full-width"
                    }}
                    category={article.category}
                    twoLabelShown={article.twoLabelShown}
                    tags={article.tags || []}
                    place={article.place}
                    location={article.location}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 w-full text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-xl text-gray-600 font-serif">
                    Seçilen kriterlere uygun yazı bulunamadı.
                  </p>
                  <button
                    onClick={() => { setSelectedTags([]); setSelectedCategory("Tümü"); }}
                    className="mt-4 text-sm font-bold text-zinc-800 underline decoration-2 underline-offset-4 hover:text-red-600 transition-colors"
                  >
                    Tüm Filtreleri Temizle
                  </button>
                </div>
              )}
            </div>

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