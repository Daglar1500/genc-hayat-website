import { useState } from "react";
import { Label } from "./MainPage/ArticleCard";
import { MOCK_ARTICLES } from "./MockArticles";
import { media, text } from "./MainPage/ArticleCard"; // Import types if needed for casting
import { ShareFloatingButton } from "../sections/Components/Components";

export const FeaturedArticleDetail = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isShareOpen, setIsShareOpen] = useState(false);

  const article = MOCK_ARTICLES[0]; 

  const renderContent = () => {
    // Array kontrolü
    const contentList = Array.isArray(article.content) ? article.content : [article.content];
    if (!contentList.length) return <p>İçerik hazırlanıyor...</p>;

    const renderedBlocks = [];
    
    for (let i = 0; i < contentList.length; i++) {
      const block = contentList[i];
      // Type assertion / safe access helper
      const content = block.blockContent as any; 
      // Not: TypeScript tam tipleri ArticleCard.tsx'den almalı, burada any ile mock veriye uyum sağlıyoruz.

      // --- 1. SPECIAL LOGIC: SIDE IMAGES (Text + Media in same block) ---
      // Mock verisindeki yapı: { blockContent: {type:'text'...}, media: {...}, blockLayout: 'right-side' }
      if (block.media && (block.blockLayout === 'left-side' || block.blockLayout === 'right-side')) {
        const isImageLeft = block.blockLayout === 'left-side';
        const imageSrc = block.media.src;
        const textVal = content.textContent;

        renderedBlocks.push(
          <div key={`group-${i}`} className="w-full lg:w-[200%] ml-0 lg:-ml-[50%] my-8 lg:my-16 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Sol Boşluk (Sadece Desktop) */}
            <div className="hidden lg:block lg:col-span-1"></div>

            {/* İçerik Alanı */}
            {isImageLeft ? (
              <>
               {/* Image */}
               <div className="w-full lg:col-span-5 order-1 lg:order-none">
                  <img src={imageSrc} className="w-full h-auto shadow-sm" alt={block.media.alt || "Article visual"} />
               </div>
               {/* Text */}
               <div className="w-full lg:col-span-5 order-2 lg:order-none">
                  <p className="text-lg lg:text-xl leading-normal text-gray-800 font-serif text-left">
                    {textVal}
                  </p>
               </div>
              </>
            ) : (
              /* Image Right */
              <>
               {/* Text (Mobilde alta gelmesi için order-2) */}
               <div className="w-full lg:col-span-5 order-2 lg:order-none">
                  <p className="text-lg lg:text-xl leading-normal text-gray-800 font-serif text-left">
                    {textVal}
                  </p>
               </div>
               {/* Image (Mobilde üste gelmesi için order-1) */}
               <div className="w-full lg:col-span-5 order-1 lg:order-none">
                  <img src={imageSrc} className="w-full h-auto shadow-sm" alt={block.media.alt || "Article visual"} />
               </div>
              </>
            )}

            {/* Sağ Boşluk (Sadece Desktop) */}
            <div className="hidden lg:block lg:col-span-1"></div>
          </div>
        );
        continue;
      }

      // --- 2. STANDARD IMAGE BLOCKS (blockContent itself is image) ---
      if (content.type === 'image') {
        // Layout: 'full-width' from mock usually maps to full-screen or text-width based on preference.
        // Mock verisinde 'mediaLayout' kullanılmış.
        const layout = content.mediaLayout || content.layout || 'text-width';

        if (layout === 'full-screen' || layout === 'full-width') {
            // Full Width Image
            renderedBlocks.push(
                <div key={i} className="relative w-screen left-1/2 -translate-x-1/2 my-8 lg:my-12 max-w-none">
                   <img src={content.src} className="w-full h-auto md:h-[80vh] object-cover" alt={content.alt || "Article visual"} />
                </div>
            );
        } else {
            // Text Width Image
            renderedBlocks.push(
                <div key={i} className="w-full my-8">
                  <img src={content.src} className="w-full h-auto rounded-lg shadow-sm" alt={content.alt || "Article visual"} />
                </div>
            );
        }
        continue;
      }

      // --- 3. STANDARD TEXT BLOCKS ---
      if (content.type === 'text' || content.type === 'paragraph') {
        const isFirstParagraph = i === 0;
        renderedBlocks.push(
          <p 
            key={i} 
            className={`mb-6 text-lg lg:text-xl leading-normal text-gray-800 font-serif text-left 
              ${isFirstParagraph ? 'first-letter:text-5xl lg:first-letter:text-7xl first-letter:font-bold first-letter:text-black first-letter:mr-3 first-letter:float-left' : ''}`}
          >
            {content.textContent}
          </p>
        );
        continue;
      }
      
      // --- 4. SUBHEADING ---
      if (content.type === 'subheading') {
        renderedBlocks.push(
          <h2 key={i} className="text-2xl lg:text-3xl font-bold mt-8 lg:mt-12 mb-4 lg:mb-6 text-black font-sans">
            {content.textContent}
          </h2>
        );
        continue;
      }
    }

    return renderedBlocks;
  };

  if (!article) return null;

  return (
    <div className="font-bradford text-zinc-800 bg-white">
      
      {/* --- HERO IMAGE --- */}
      <div className="w-full h-[50vh] lg:h-[100vh] relative bg-gray-900">
         {/* firstMedia usually holds the hero image in the new structure if imageUrl is missing */}
         <img 
           src={article.firstMedia?.src} 
           alt={article.title} 
           className="absolute inset-0 w-full h-full object-cover opacity-90"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10"></div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-12 py-10 lg:py-16">
        
        {/* --- TITLE & SUBHEADING --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 lg:mb-14 border-b border-gray-200 pb-8 lg:pb-10">
            {/* Desktop: Sol Boşluk (3 Col), Mobile: Hidden */}
            <div className="hidden lg:block lg:col-span-3"></div>

            {/* Başlık Alanı (Mobile: Full Width, Desktop: 6 Col) */}
            <header className="col-span-1 lg:col-span-6 text-left">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 lg:mb-8 text-balance tracking-tight">
                  {article.title}
                </h1>

                {article.description && (
                  <p className="text-lg md:text-xl lg:text-3xl text-gray-600 font-serif italic leading-relaxed">
                    {article.description}
                  </p>
                )}
            </header>
            
            {/* Desktop: Sağ Boşluk (3 Col) */}
            <div className="hidden lg:block lg:col-span-3"></div>
        </div>

        {/* --- CONTENT ve SIDEBAR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* 1. Sol Boşluk (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* 2. Metadata (Mobile: Full width, Desktop: 2 Cols) */}
          <aside className="col-span-1 lg:col-span-2 relative flex flex-col items-start lg:items-end text-left lg:text-right">
             <div className="w-full space-y-4 lg:space-y-6 pt-0 lg:pt-4 border-t-0 lg:border-t-2 border-black lg:border-t-0 lg:w-auto">
              
              <div className="flex flex-row lg:flex-col gap-4 lg:gap-1 flex-wrap">
                {article.place && <div className="text-xs text-gray-500 font-serif italic">{article.place}</div>}
                <div className="text-sm lg:text-base font-bold text-black">{article.author}</div>
                <div className="text-xs text-gray-400 font-medium">
                  {article.publishedDate}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                 <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                    {article.category && <Label label={article.category.name} />}
                    {article.tags && article.tags.map((tag, i) => (
                        <Label key={i} label={tag.name} />
                    ))}
                 </div>
              </div>
            </div>
          </aside>

          {/* 3. Ana İçerik (Mobile: Full width, Desktop: 6 Cols) */}
          <div className="col-span-1 lg:col-span-6 relative z-0">
            <article className="w-full">
              <div className="w-full">
                {renderContent()}
              </div>
            </article>

            {/* Yorum Alanı */}
            <section className="mt-12 lg:mt-16 border-t border-gray-200 pt-8 lg:pt-12">
                <h3 className="text-lg lg:text-xl font-bold mb-4">Görüş Bildir</h3>
                <p className="text-gray-500 mb-6 italic text-sm">
                   Yorumlarınız doğrudan yazara iletilir ve halka açık olarak yayınlanmaz.
                </p>
                
                <div>
                    <textarea 
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none resize-y font-serif text-base bg-gray-50 min-h-[120px]"
                        placeholder="Yazar için notunuzu buraya yazın..."
                    />
                    <div className="mt-4 flex justify-end">
                        <button className="px-8 py-2 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 transition-transform transform hover:scale-105">
                            Gönder
                        </button>
                    </div>
                </div>
            </section>
          </div>

          {/* 4. Sağ Boşluk (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-3"></div>

        </div>

        <ShareFloatingButton />
        
      </main>
    </div>
  );
};

export default FeaturedArticleDetail;