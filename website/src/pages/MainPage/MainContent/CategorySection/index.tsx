import { ArticleCardElement, Labelo } from "../../ArticleCard";
import { MOCK_ARTICLES } from "../../../MockArticles"; 
import React from 'react';

export const CategorySection = () => {
  // Tasarım 3'lü grid olduğu için ilk 3 makaleyi alıyoruz
  const displayArticles = MOCK_ARTICLES.slice(0, 3);

  return (
    <section className="bg-purple-600 py-16 md:py-20 font-bradford">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-purple-500/30 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            {/* Title */}
            <div>
              <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-2">
                Tarih
              </h2>
            </div>

            {/* "More" Link */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-purple-200 font-serif italic">
                Daha fazlası için
              </span>
              <a
                href="/category/tarih"
                className="inline-flex items-center justify-center px-3 py-1.5 bg-purple-50 hover:bg-white text-purple-900 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
              >
                Tarih
              </a>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {displayArticles.map((article, index) => (
            /* Orijinal tasarımdaki beyaz çerçeveyi (wrapper) koruyoruz */
            <div key={index} className="bg-white p-4 h-full">
              <ArticleCardElement
                {...article}
              />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};