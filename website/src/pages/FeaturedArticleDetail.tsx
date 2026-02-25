import { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "./MainPage/ArticleCard";
import { MOCK_ARTICLES } from "../data/MockArticles";
import { ShareFloatingButton } from "../components/ShareFloatingButton";
import { ArticleLine } from "./MainPage/MainContent/ArticleLine";

// --- BİLEŞENLER ---

const FontButton = ({ label, onClick, disabled }: { label: string, onClick: () => void, disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      group inline-flex items-center justify-center 
      w-10 h-7
      bg-gray-100 hover:bg-gray-800 
      transition-colors duration-200 rounded-sm
      ${disabled ? 'opacity-40 cursor-not-allowed hover:bg-gray-100' : 'cursor-pointer'}
    `}
  >
    <span className={`
      text-[11px] tracking-wider font-bold font-serif
      ${disabled ? 'text-gray-400' : 'text-gray-600 group-hover:text-white'}
    `}>
      {label}
    </span>
  </button>
);

const IssueLabel = ({ number }: { number: number }) => (
  <a
    href={`/sayi/${number}`}
    className="group inline-flex items-center gap-2 px-3 py-[6px] bg-red-50 hover:bg-red-600 transition-all duration-200 border border-transparent hover:border-red-600 rounded-sm cursor-pointer no-underline"
  >
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="text-red-600 group-hover:text-white transition-colors duration-200"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13.65" />
      <path d="M2 10h20" />
    </svg>
    <span className="text-[11px] text-red-600 group-hover:text-white tracking-[1px] leading-4 font-labilvariable md:font-labil font-bold uppercase">
      SAYI: {number}
    </span>
  </a>
);

// Resim Altı Açıklama Bileşeni (Caption)
const ImageCaption = ({ alt }: { alt?: string }) => {
  if (!alt) return null;
  return (
    <div className="mt-2 text-xs lg:text-sm text-gray-500">
      <span className="font-bold text-gray-700/70 uppercase tracking-wide text-[10px] lg:text-xs">
        GÖRSEL:
      </span>
      <span className="font-serif ml-1.5 opacity-90 italic">
        {alt}
      </span>
    </div>
  );
};

const FONT_SIZES = [
  "text-base lg:text-lg",
  "text-lg lg:text-xl",
  "text-xl lg:text-2xl",
  "text-2xl lg:text-3xl"
];

// --- EMBEDDED ARTICLE COMPONENT ---

const EmbeddedArticleBox = ({ article }: { article: any }) => {
  if (!article) return null;

  return (
    <a
      href={article.href}
      className="block my-10 lg:my-14 border-l-4 border-red-600 bg-gray-50 p-6 no-underline group hover:bg-gray-100 transition-colors duration-300"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Görsel */}
        <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-sm relative">
          <img
            src={article.firstMedia?.src}
            alt={article.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* İçerik */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest text-red-600 uppercase">ÖNERİLEN YAZI</span>
            <div className="h-px flex-grow bg-gray-200"></div>
          </div>
          <h4 className="font-serif text-xl font-bold leading-tight text-gray-900 group-hover:text-red-600 transition-colors mb-2">
            {article.title}
          </h4>
          <p className="text-sm text-gray-600 font-serif line-clamp-2 leading-relaxed opacity-80">
            {article.description}
          </p>
        </div>
      </div>
    </a>
  );
};

// --- MAIN COMPONENT ---

export const FeaturedArticleDetail = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [fontIndex, setFontIndex] = useState(1);
  const [randomArticle] = useState(() => {
    const otherArticles = MOCK_ARTICLES.filter(a => a.href !== MOCK_ARTICLES[0].href); // Exclude current
    return otherArticles[Math.floor(Math.random() * otherArticles.length)];
  });

  const article = MOCK_ARTICLES[0];
  const issueNumber = (article as any).issueNumber || 496;

  // Öne Çıkan mı Sıradan mı Kontrolü
  const isFeatured = (article as any).isFeatured ?? true;

  const handleFontChange = (direction: 'increase' | 'decrease') => {
    if (direction === 'increase' && fontIndex < FONT_SIZES.length - 1) {
      setFontIndex(prev => prev + 1);
    } else if (direction === 'decrease' && fontIndex > 0) {
      setFontIndex(prev => prev - 1);
    }
  };

  const relatedArticles = MOCK_ARTICLES.filter(
    (item) =>
      item.title !== article.title &&
      item.category?.name === article.category?.name
  ).slice(0, 3);

  const renderContent = () => {
    const contentList = Array.isArray(article.content) ? article.content : [article.content];
    if (!contentList.length) return <p>İçerik hazırlanıyor...</p>;

    const renderedBlocks = [];
    const currentFontClass = FONT_SIZES[fontIndex];

    for (let i = 0; i < contentList.length; i++) {
      const block = contentList[i];
      const content = block.blockContent as any;

      // --- 1. SIDE IMAGES (YAN GÖRSELLER) ---
      if (block.media && (block.blockLayout === 'left-side' || block.blockLayout === 'right-side')) {
        const isImageLeft = block.blockLayout === 'left-side';
        const imageSrc = block.media.src;
        const textVal = content.textContent;
        const altText = block.media.alt || "Article visual";

        renderedBlocks.push(
          <div key={`group-${i}`} className="w-full lg:w-[200%] ml-0 lg:-ml-[50%] my-8 lg:my-16 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="hidden lg:block lg:col-span-1"></div>
            {isImageLeft ? (
              <>
                <div className="w-full lg:col-span-5 order-1 lg:order-none">
                  <img src={imageSrc} className="w-full h-auto shadow-sm" alt={altText} />
                  <ImageCaption alt={altText} />
                </div>
                <div className="w-full lg:col-span-5 order-2 lg:order-none">
                  <p className={`${currentFontClass} leading-normal text-gray-800 font-serif text-left transition-all duration-300`}>
                    {textVal}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-full lg:col-span-5 order-2 lg:order-none">
                  <p className={`${currentFontClass} leading-normal text-gray-800 font-serif text-left transition-all duration-300`}>
                    {textVal}
                  </p>
                </div>
                <div className="w-full lg:col-span-5 order-1 lg:order-none">
                  <img src={imageSrc} className="w-full h-auto shadow-sm" alt={altText} />
                  <ImageCaption alt={altText} />
                </div>
              </>
            )}
            <div className="hidden lg:block lg:col-span-1"></div>
          </div>
        );
      }

      // --- 2. STANDARD IMAGES (NORMAL GÖRSELLER) ---
      else if (content.type === 'image') {
        const layout = content.mediaLayout || content.layout || 'text-width';
        const altText = content.alt || "Article visual";

        if (layout === 'full-screen' || layout === 'full-width') {
          renderedBlocks.push(
            <div key={i} className="relative w-screen left-1/2 -translate-x-1/2 my-8 lg:my-12 max-w-none flex flex-col items-center">
              <img src={content.src} className="w-full h-auto" alt={altText} />
              <div className="w-full max-w-screen-2xl px-0 mt-2">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="hidden lg:block lg:col-span-3"></div>
                  <div className="col-span-1 lg:col-span-6">
                    <ImageCaption alt={altText} />
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          renderedBlocks.push(
            <div key={i} className="w-full my-8">
              <img src={content.src} className="w-full h-auto shadow-sm" alt={altText} />
              <ImageCaption alt={altText} />
            </div>
          );
        }
      }

      // --- 3. STANDARD TEXT ---
      else if (content.type === 'text' || content.type === 'paragraph') {
        const isFirstParagraph = i === 0;
        renderedBlocks.push(
          <p
            key={i}
            className={`mb-6 ${currentFontClass} leading-normal text-gray-800 font-serif text-left transition-all duration-300
              ${isFirstParagraph ? 'first-letter:text-5xl lg:first-letter:text-7xl first-letter:font-bold first-letter:text-black first-letter:mr-3 first-letter:float-left' : ''}`}
          >
            {content.textContent}
          </p>
        );
      }

      // --- 4. SUBHEADING ---
      else if (content.type === 'subheading') {
        renderedBlocks.push(
          <h2 key={i} className="text-2xl lg:text-3xl font-bold mt-8 lg:mt-12 mb-4 lg:mb-6 text-black font-sans">
            {content.textContent}
          </h2>
        );
      }

      // --- EMBEDDED ARTICLE INJECTION (2. Bloktan Sonra) ---
      if (i === 1 && randomArticle) {
        renderedBlocks.push(
          <div key="embedded-ad" className="w-full">
            <EmbeddedArticleBox article={randomArticle} />
          </div>
        );
      }
    }
    return renderedBlocks;
  };

  if (!article) return null;

  return (
    // GÜNCELLEME 1: pt-[100px] lg:pt-[140px] kaldırıldı (conditional yapıldı), Hero görseli doğal boyuna bırakıldı.
    <div className={`font-bradford text-zinc-800 bg-white ${isFeatured ? '' : 'pt-[100px] lg:pt-[140px]'}`}>

      {/* --- HERO SECTION (Sadece Featured Article için) --- */}
      {isFeatured && (
        <div className="w-full relative mb-10">
          <img
            src={article.firstMedia?.src}
            alt={article.title}
            className="w-full h-auto block opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10 pointer-events-none"></div>
        </div>
      )}

      {/* GÜNCELLEME 2: Paddingler iki katına çıkarıldı (px-8 md:px-12 lg:px-24) */}
      <main className="max-w-screen-2xl mx-auto px-4 lg:px-0 py-10 lg:py-16">

        {/* --- HEADER --- */}
        {isFeatured ? (
          // --- FEATURED HEADER ---
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 lg:mb-8 border-b border-gray-200 pb-6 lg:pb-8">
            <div className="hidden lg:block lg:col-span-3"></div>

            <header className="col-span-1 lg:col-span-6 text-left relative">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 lg:mb-8 text-balance tracking-tight">
                {article.title}
              </h1>
              {article.description && (
                <p className="text-lg md:text-xl lg:text-3xl text-gray-600 font-serif italic leading-relaxed">
                  {article.description}
                </p>
              )}
            </header>

            <div className="hidden lg:block lg:col-span-3"></div>

            {/* Desktop Font Buttons */}
            <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-10 hidden lg:block pointer-events-none">
              <div className="grid grid-cols-12 gap-8 w-full">
                <div className="col-span-4"></div>
                <div className="col-span-8 pl-1">
                  <div className="flex gap-1 pointer-events-auto">
                    <FontButton label="A-" onClick={() => handleFontChange('decrease')} disabled={fontIndex === 0} />
                    <FontButton label="A+" onClick={() => handleFontChange('increase')} disabled={fontIndex === FONT_SIZES.length - 1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // --- ORDINARY HEADER (İKİ EŞİT SÜTUN) ---
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10 lg:mb-16 border-b border-gray-200 pb-8 lg:pb-10 items-start">

            {/* Sol: Başlık ve Açıklama */}
            <header className="flex flex-col justify-center h-full">
              {article.category && (
                <div className="mb-4">
                  <Label label={article.category.name} />
                </div>
              )}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance tracking-tight">
                {article.title}
              </h1>
              {article.description && (
                <p className="text-lg md:text-xl text-gray-600 font-serif italic leading-relaxed">
                  {article.description}
                </p>
              )}

              <div className="hidden lg:flex gap-1 mt-8">
                <FontButton label="A-" onClick={() => handleFontChange('decrease')} disabled={fontIndex === 0} />
                <FontButton label="A+" onClick={() => handleFontChange('increase')} disabled={fontIndex === FONT_SIZES.length - 1} />
              </div>
            </header>

            {/* Sağ: Görsel (Keskin Köşeler, Doğal Uzunluk) */}
            <div>
              <div className="w-full shadow-sm">
                <img
                  src={article.firstMedia?.src}
                  alt={article.title}
                  className="w-full h-auto object-cover" // Köşe yuvarlama (rounded) yok
                />
              </div>
              <ImageCaption alt={article.firstMedia?.alt || article.title} />
            </div>
          </div>
        )}


        {/* --- GRID (CONTENT & SIDEBAR) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 pb-16">

          <div className="hidden lg:block lg:col-span-1"></div>

          {/* --- SIDEBAR --- */}
          <aside className="col-span-1 lg:col-span-2 relative flex flex-col items-start lg:items-end text-left lg:text-right">
            <div className="w-full pt-0 lg:pt-0 border-t-0 lg:border-t-0 border-black lg:w-auto">

              <div className="flex flex-col gap-1 items-start lg:items-end mb-6 w-full">
                <div className="text-sm lg:text-base font-bold text-black">{article.author}</div>
                {article.place && <div className="text-xs text-gray-500 font-serif italic">{article.place}</div>}

                <div className="text-xs text-gray-400 font-medium mb-3">
                  {article.publishedDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <div className="w-full flex items-center justify-between lg:justify-end mt-1">
                  <IssueLabel number={issueNumber} />
                  <div className="flex gap-1 lg:hidden">
                    <FontButton
                      label="A-"
                      onClick={() => handleFontChange('decrease')}
                      disabled={fontIndex === 0}
                    />
                    <FontButton
                      label="A+"
                      onClick={() => handleFontChange('increase')}
                      disabled={fontIndex === FONT_SIZES.length - 1}
                    />
                  </div>
                </div>

              </div>

              <div className="flex flex-wrap gap-2 justify-start lg:justify-end mb-6">
                {article.category && (
                  <Link
                    to={`/category?category=${encodeURIComponent(article.category.name)}`}
                    className="inline-block"
                  >
                    <Label label={article.category.name} />
                  </Link>
                )}
                {article.tags && article.tags.map((tag, i) => (
                  <Link
                    key={i}
                    to={`/category?tag=${encodeURIComponent(tag.name)}`}
                    className="inline-block"
                  >
                    <Label label={tag.name} />
                  </Link>
                ))}
              </div>

            </div>
          </aside>

          {/* Content */}
          <div className="col-span-1 lg:col-span-6 relative z-0">
            <article className="w-full">
              <div className="w-full">
                {renderContent()}
              </div>
            </article>

            {/* Yorumlar */}
            <section className="mt-12 lg:mt-16 border-t border-gray-200 pt-8 lg:pt-12">
              <h3 className="text-lg lg:text-xl font-bold mb-4">Görüş Bildir</h3>
              <p className="text-gray-500 mb-6 italic text-sm">
                Yorumlarınız doğrudan Genç Hayat yazı kuruluna gitmektedir.
              </p>
              <div>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none resize-y font-serif text-base bg-gray-50 min-h-[120px]"
                  placeholder="Notunuzu buraya yazın..."
                />
                <div className="mt-4 flex justify-end">
                  <button className="px-8 py-2 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 transition-transform transform hover:scale-105">
                    Gönder
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="hidden lg:block lg:col-span-3"></div>
        </div>

        {/* --- DİĞER YAZILAR --- */}
        {relatedArticles.length > 0 && (
          <section className="w-full mt-8 border-t border-black/10 pt-10">
            <div className="w-full text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] font-sans tracking-tight">
                Diğer Yazılar
              </h3>
            </div>
            <ArticleLine articles={relatedArticles} />
          </section>
        )}

        <ShareFloatingButton />

      </main>
    </div>
  );
};

export default FeaturedArticleDetail;