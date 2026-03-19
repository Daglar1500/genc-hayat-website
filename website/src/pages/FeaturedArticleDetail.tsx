import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Label, ArticleCard, Labelo } from "./MainPage/ArticleCard";
import { ShareFloatingButton } from "../components/ShareFloatingButton";
import { ArticleLine } from "./MainPage/MainContent/ArticleLine";
import { useSeo } from "../lib/useSeo";

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
  const { slug } = useParams<{ slug: string }>();

  const [article, setArticle] = useState<ArticleCard | null>(null);
  const [randomArticle, setRandomArticle] = useState<ArticleCard | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontIndex, setFontIndex] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [commentStatus, setCommentStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      try {
        // Slug based fetch from API
        const res = await fetch(`${apiUrl}/articles/${slug}`);
        const articleData = await res.json();

        if (articleData) {
          // Normalize content blocks from API format {type, value} to FeaturedArticleDetail format {blockContent: {...}}
          const normalizeBlocks = (blocks: any[]): any[] => {
            if (!Array.isArray(blocks)) return [];
            return blocks.map((b: any) => {
              if (b.blockContent) return b; // already normalized
              if (b.type === 'image') return { blockContent: { type: 'image', src: b.value, alt: b.alt || '' } };
              if (b.type === 'subheading') return { blockContent: { type: 'subheading', textContent: b.value || '' } };
              return { blockContent: { type: 'paragraph', textContent: b.value || b.textContent || '' } };
            });
          };

          const mappedArticle: ArticleCard = {
            href: `/articles/${articleData.id}`,
            title: articleData.title,
            type: articleData.type || 'normal',
            description: articleData.subheading || articleData.content?.substring(0, 150),
            author: articleData.author,
            place: articleData.place,
            location: articleData.school,
            issueNumber: articleData.issueNumber,
            publishedDate: new Date(articleData.createdAt),
            content: normalizeBlocks(articleData.content),
            firstMedia: { type: 'image', src: articleData.imageUrl, alt: articleData.title, mediaLayout: 'full-width' },
            category: new Labelo('category', articleData.category || ''),
            tags: (articleData.labels || []).filter(Boolean).map((l: string) => new Labelo('tag', l))
          };
          setArticle(mappedArticle);

          // Fetch other articles for "related" and "random"
          const allRes = await fetch(`${apiUrl}/articles`);
          const allData = await allRes.json();

          const otherData = allData.filter((a: any) => a.id !== articleData.id);

          if (otherData.length > 0) {
            const mappedOthers: ArticleCard[] = otherData.map((a: any) => ({
              href: `/articles/${a.id}`,
              title: a.title,
              type: a.type || 'normal',
              description: a.subheading || a.content?.substring(0, 150),
              author: a.author,
              place: a.place,
              location: a.school,
              issueNumber: a.issueNumber,
              publishedDate: new Date(a.createdAt),
              content: a.content || [],
              firstMedia: { type: 'image', src: a.imageUrl, alt: a.title, mediaLayout: 'full-width' },
              category: new Labelo('category', a.category),
              tags: a.labels?.map((l: string) => new Labelo('tag', l)) || []
            }));

            setRandomArticle(mappedOthers[Math.floor(Math.random() * mappedOthers.length)]);

            const related = mappedOthers.filter((item) => item.category?.name === mappedArticle.category?.name).slice(0, 3);
            setRelatedArticles(related);
          }
        }

      } catch (err) {
        console.error("Yazı detayı çekilirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug]);

  // Click tracking
  useEffect(() => {
    if (!slug) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    fetch(`${apiUrl}/articles/${slug}/view`, { method: 'POST' }).catch(() => {});
  }, [slug]);

  const handleCommentSubmit = () => {
    if (!commentText.trim() || !slug || commentStatus === 'sending') return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    setCommentStatus('sending');
    fetch(`${apiUrl}/articles/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText.trim() }),
    })
      .then(res => {
        if (res.ok) {
          setCommentStatus('sent');
          setCommentText('');
        } else {
          setCommentStatus('error');
        }
      })
      .catch(() => setCommentStatus('error'));
  };

  useSeo({
    title: article?.title,
    description: article?.description,
    image: article?.firstMedia?.src,
  });

  const issueNumber = article?.issueNumber || 496;

  // Öne Çıkan mı Sıradan mı Kontrolü — sadece "featured" type hero göster
  const isFeatured = article?.type === 'featured';

  const handleFontChange = (direction: 'increase' | 'decrease') => {
    if (direction === 'increase' && fontIndex < FONT_SIZES.length - 1) {
      setFontIndex(prev => prev + 1);
    } else if (direction === 'decrease' && fontIndex > 0) {
      setFontIndex(prev => prev - 1);
    }
  };

  const renderContent = () => {
    if (!article) return null;
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
                  <div className={`${currentFontClass} leading-normal text-gray-800 font-serif text-left transition-all duration-300`}
                    dangerouslySetInnerHTML={{ __html: textVal }} />
                </div>
              </>
            ) : (
              <>
                <div className="w-full lg:col-span-5 order-2 lg:order-none">
                  <div className={`${currentFontClass} leading-normal text-gray-800 font-serif text-left transition-all duration-300`}
                    dangerouslySetInnerHTML={{ __html: textVal }} />
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
                  <div className="col-span-1 lg:col-span-6 px-4 lg:px-0">
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
          <div
            key={i}
            className={`mb-6 ${currentFontClass} leading-normal text-gray-800 font-serif text-left transition-all duration-300
              ${isFirstParagraph ? 'first-letter:text-5xl lg:first-letter:text-7xl first-letter:font-bold first-letter:text-black first-letter:mr-3 first-letter:float-left' : ''}`}
            dangerouslySetInnerHTML={{ __html: content.textContent }}
          />
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-gray-500">Yükleniyor...</div>;
  if (!article) return null;

  return (
    <div className="font-bradford text-zinc-800 bg-white">

      {/* --- HERO SECTION — sadece desktop, featured article --- */}
      {isFeatured && (
        <div className="w-full relative hidden md:block">
          <img
            src={article.firstMedia?.src}
            alt={article.title}
            className="w-full h-auto block opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10 pointer-events-none"></div>
        </div>
      )}

      <main className="max-w-screen-2xl mx-auto px-4 lg:px-0 py-4 lg:py-10">

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
              {/* Mobile'da hero yerine inline görsel */}
              {article.firstMedia?.src && (
                <div className="block md:hidden w-full mt-6">
                  <img
                    src={article.firstMedia.src}
                    alt={article.title}
                    className="w-full h-auto object-cover shadow-sm"
                  />
                  <ImageCaption alt={article.title} />
                </div>
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
          // --- NORMAL HEADER (Pluribus gibi: başlık → açıklama → görsel, hero yok) ---
          <div className="pt-20 lg:pt-24">
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 lg:mb-8 border-b border-gray-200 pb-6 lg:pb-8">
              <div className="hidden lg:block lg:col-span-3"></div>

              <header className="col-span-1 lg:col-span-6 text-left relative">
                {article.category && (
                  <div className="mb-4">
                    <Label label={article.category.name} />
                  </div>
                )}
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 lg:mb-8 text-balance tracking-tight">
                  {article.title}
                </h1>
                {article.description && (
                  <p className="text-lg md:text-xl lg:text-3xl text-gray-600 font-serif italic leading-relaxed mb-6">
                    {article.description}
                  </p>
                )}
                {/* Mobile font buttons */}
                <div className="flex gap-1 lg:hidden mb-6">
                  <FontButton label="A-" onClick={() => handleFontChange('decrease')} disabled={fontIndex === 0} />
                  <FontButton label="A+" onClick={() => handleFontChange('increase')} disabled={fontIndex === FONT_SIZES.length - 1} />
                </div>
                {article.firstMedia?.src && (
                  <div className="w-full mb-6">
                    <img
                      src={article.firstMedia.src}
                      alt={article.firstMedia.alt || article.title}
                      className="w-full h-auto object-cover shadow-sm"
                    />
                    <ImageCaption alt={article.firstMedia.alt || article.title} />
                  </div>
                )}
              </header>

              <div className="hidden lg:block lg:col-span-3"></div>

              {/* Desktop font buttons at the border line */}
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

                <div className="hidden lg:flex flex-wrap gap-2 justify-start lg:justify-end mb-6">
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
              {/* Etiketler: featured mobile'da içeriğin altında, normal her zaman altında */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-100 lg:hidden">
                  {article.category && (
                    <Link to={`/category?category=${encodeURIComponent(article.category.name)}`} className="inline-block">
                      <Label label={article.category.name} />
                    </Link>
                  )}
                  {article.tags.map((tag, i) => (
                    <Link
                      key={i}
                      to={`/category?tag=${encodeURIComponent(tag.name)}`}
                      className="inline-block"
                    >
                      <Label label={tag.name} />
                    </Link>
                  ))}
                </div>
              )}
              <h3 className="text-lg lg:text-xl font-bold mb-4">Görüş Bildir</h3>
              <p className="text-gray-500 mb-6 italic text-sm">
                Yorumlarınız doğrudan Genç Hayat yazı kuruluna gitmektedir.
              </p>
              {commentStatus === 'sent' ? (
                <p className="text-emerald-600 font-serif italic text-base py-4">Görüşünüz iletildi. Teşekkürler.</p>
              ) : (
                <div>
                  {commentStatus === 'error' && (
                    <p className="text-red-500 text-sm mb-4 font-serif">Yorum gönderilemedi. Lütfen tekrar deneyin.</p>
                  )}
                  <textarea
                    value={commentText}
                    onChange={e => { setCommentText(e.target.value); if (commentStatus === 'error') setCommentStatus('idle'); }}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none resize-y font-serif text-base bg-gray-50 min-h-[120px]"
                    placeholder="Notunuzu buraya yazın..."
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleCommentSubmit}
                      disabled={commentStatus === 'sending' || !commentText.trim()}
                      className="px-8 py-2 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 transition-transform transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {commentStatus === 'sending' ? 'Gönderiliyor...' : 'Gönder'}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="hidden lg:block lg:col-span-3"></div>
        </div>

        {/* --- SON SAYININ ÖNERİLEN YAZILARI --- */}
        {relatedArticles.length > 0 && (
          <section className="w-full mt-8 border-t border-black/10 pt-10">
            <div className="w-full text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] font-sans tracking-tight">
                Son Sayının Önerilen Yazıları
              </h3>
            </div>
            <ArticleLine articles={relatedArticles} centered={true} />
          </section>
        )}

        <ShareFloatingButton />

      </main>
    </div>
  );
};

export default FeaturedArticleDetail;
