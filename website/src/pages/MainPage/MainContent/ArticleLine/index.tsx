import { ArticleCardElement, Labelo } from "../../ArticleCard";
import { MOCK_ARTICLES } from "../../../MockArticles"; 
import React from 'react';


export const ArticleLine = () => {
  return (
    <article className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] py-10 md:py-[60px]">
      <div className="max-w-[1400px] mx-auto">
        {/* Grid yapısı korundu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          
          {/* MOCK_ARTICLES dizisindeki her bir makale için kart oluşturulur */}
          {MOCK_ARTICLES.map((article, index) => (
            <ArticleCardElement
              key={index}
              {...article}
            />
          ))}

        </div>
      </div>
    </article>
  );
};