import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gh_cover from '../../../../public/gh-kapak/gh.jpg';
import gh_499 from '../../../../public/gh-kapak/GH - Sayı_ 499 - 1 Ekim 2025_page-0001.jpg';
import gh_502 from '../../../../public/gh-kapak/GH - Sayı_ 502 - 12 Kasım 2025 (1)_page-0001.jpg';
import { ArticleCardElement } from '../../ArticleCard';
import type { ArticleCard } from '../../ArticleCard';
import { ArticleLine } from '../ArticleLine';
import { MOCK_ARTICLES } from '../../../../data/MockArticles';
import { useApi, toArticleCard, type ApiSection } from '../../../../lib/ApiContext';

const VISIBLE_COUNT = 4;

// ─── CAROUSEL ────────────────────────────────────────────────────────────────

const ArticleCarousel = ({ issueNumber, isLatest, articles }: { issueNumber: number; isLatest: boolean; articles: ArticleCard[] }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = articles.length;
  const canNext = startIndex + VISIBLE_COUNT < total;
  const canPrev = startIndex > 0;

  const heading = isLatest
    ? 'Son Sayının Önerilen Yazıları'
    : `${issueNumber}. Sayının Önerilen Yazıları`;

  const next = useCallback(() => { if (canNext) setStartIndex(i => i + 1); }, [canNext]);
  const prev = useCallback(() => { if (canPrev) setStartIndex(i => i - 1); }, [canPrev]);
  const resetToStart = () => setStartIndex(0);

  useEffect(() => {
    setStartIndex(0);
  }, [issueNumber]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      if (canNext) next(); else resetToStart();
    }, 3000);
    return () => clearTimeout(timer);
  }, [startIndex, isPaused, canNext, next]);

  const visibleArticles = articles.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{heading}</span>
          <div className="h-0.5 w-12 bg-black mt-1.5" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 mr-2">
            {Array.from({ length: Math.max(0, total - VISIBLE_COUNT + 1) }).map((_, i) => (
              <button key={i} onClick={() => setStartIndex(i)} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${startIndex === i ? 'bg-black' : 'bg-gray-300 hover:bg-gray-500'}`} />
            ))}
          </div>
          <button onClick={prev} disabled={!canPrev} className="p-1.5 rounded-full border border-gray-200 hover:border-black transition-colors disabled:opacity-30" aria-label="Önceki">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={next} disabled={!canNext} className="p-1.5 rounded-full border border-gray-200 hover:border-black transition-colors disabled:opacity-30" aria-label="Sonraki">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {visibleArticles.map((article) => (
            <motion.div key={article.href} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: "easeInOut" }}>
              <ArticleCardElement {...article} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── ISSUE DATA & STATE ───────────────────────────────────────────────────────

interface IssueData {
  number: number;
  cover: string;
  sunuText: React.ReactNode;
  rotaTitle: string;
  rotaDesc: string;
  rotaContent: React.ReactNode;
}

// Hardcoded fallback issues (for issue selector)
const fallbackIssues: IssueData[] = [
  {
    number: 504,
    cover: gh_cover,
    sunuText: (
      <>
        <p className="mb-5 first-letter:text-6xl first-letter:font-black first-letter:text-black first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1">
          Okullarımız çoğu zaman yokluğuyla hatırlanan, varlığıyla pek fark etme şansına erişemediğimiz bir etken maddenin arayışındayız. Mesela bir sıvı sabun, dezenfektan tam da bu özellikleri karşılıyor bizim için. Günlük hayatta sessizce birikinen- ler vardır pas,kir, çeşitli mikroplar gibi; belki kabullendiğimiz belki alıştığımız.
        </p>
        <p className="mb-5">
          İşte böyle, alanlarımızda birikenleri hatırlatıyor; temizliğin tek başına değil, birlikte mümkün olduğunu göstermek için bir araya getiriyoruz sayfalarımızı yeniden.
        </p>
      </>
    ),
    rotaTitle: "Pusulasız Zamanlarda Yön Bulmak",
    rotaDesc: "Bu yazı, gençliğin bugünkü koşullarını ve Erdal Eren'in mücadelesinden alınacak dersleri ele almaktadır.",
    rotaContent: (
      <>
        <h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">Geçmişten Bugüne</h4>
        <p className="mb-5">
          Erdal Eren'in 12 Eylül faşist cuntasınca idam edilişinin üzerinden 45 yıl geçti.
        </p>
        <h4 className="text-xl md:text-2xl font-bold text-black mb-3 mt-6 font-sans">Mücadeleyi Güncellemek</h4>
        <p>
          Erdal Eren'in mücadelesini güncellemek, bugünün gençliğinin en acil görevidir.
        </p>
      </>
    )
  },
  {
    number: 503,
    cover: gh_cover,
    sunuText: (
      <>
        <p className="mb-5 first-letter:text-6xl first-letter:font-black first-letter:text-black first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1">
          503. sayımızda, kampüslerde ve sokaklarda artan sansür ve baskı ortamını ele alıyoruz.
        </p>
        <p>
          Sanatın özgürleştirici gücünün engellenemeyeceğini vurguluyoruz.
        </p>
      </>
    ),
    rotaTitle: "Sansüre Karşı Özgür Sanat",
    rotaDesc: "Sanat okulu öğrencilerinin kampüslerde yaşadığı sansür vakaları ve çözümleri.",
    rotaContent: (
      <>
        <h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">Sansürün Yüzleri</h4>
        <p className="mb-5">
          Üniversite şenliklerinin iptal edilmesinden, tiyatro oyunlarının yasaklanmasına kadar uzanan engelleme.
        </p>
      </>
    )
  },
  {
    number: 502,
    cover: gh_502,
    sunuText: (
      <>
        <p className="mb-5 first-letter:text-6xl first-letter:font-black first-letter:text-black first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1">
          Barınma krizinin ulaştığı boyutlar, öğrencilerin en temel hakkı olan eğitim hakkını gasp ediyor.
        </p>
      </>
    ),
    rotaTitle: "Barınma Haktır, Kiralar Yüksektir",
    rotaDesc: "Artan kiralar ve yetersiz yurt kapasitelerinin öğrenciler üzerindeki etkisi.",
    rotaContent: (
      <>
        <h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">Yurt Sorunları</h4>
        <p>KYK yurtlarındaki yetersiz koşullar ve öğrencilerin insani barınma talepleri.</p>
      </>
    )
  },
  {
    number: 499,
    cover: gh_499,
    sunuText: <p className="mb-5">499. sayımızda kadın mücadelesi ve toplumsal cinsiyet eşitliğini gündemimize alıyoruz.</p>,
    rotaTitle: "Kadınlar Birlikte Güçlü",
    rotaDesc: "Kampüslerdeki kadın dayanışma ağlarının büyümesi.",
    rotaContent: <div className="mb-5"><h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">Eşitlik İstiyoruz</h4><p>8 Mart'a giderken kampüslerdeki kadın hareketinin dinamiklerini inceliyoruz.</p></div>
  },
];

// Build IssueData from API main-row section
function buildIssueFromApi(mainRow: ApiSection): IssueData {
  const num = parseInt(mainRow.issueNumber || '0') || 0;
  const cover = mainRow.coverImage || gh_cover;

  const sunuText = mainRow.preface ? (
    <>
      {mainRow.preface.split(/\n\n+/).map((para, i) => (
        <p key={i} className={`mb-5 ${i === 0 ? 'first-letter:text-6xl first-letter:font-black first-letter:text-black first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1' : ''}`}>
          {para}
        </p>
      ))}
    </>
  ) : <p className="mb-5 text-gray-400 italic">Sunu metni henüz girilmedi.</p>;

  const rotaTitle = mainRow.routeArticle?.title || '';
  const rotaDesc = mainRow.routeArticle?.subheading || '';
  const rotaContent = mainRow.routeArticle?.content ? (
    <>
      {mainRow.routeArticle.content.map((block) => {
        if (block.type === 'paragraph') return <p key={block.id} className="mb-5">{block.value}</p>;
        if (block.type === 'subheading') return <h4 key={block.id} className="text-xl md:text-2xl font-bold text-black mb-3 mt-6 font-sans">{block.value}</h4>;
        if (block.type === 'image') return <img key={block.id} src={block.value} className="rounded-lg my-4 max-h-64 object-cover w-full" />;
        return null;
      })}
    </>
  ) : <p className="text-gray-400 italic">İçerik girilmedi.</p>;

  return { number: num, cover, sunuText, rotaTitle, rotaDesc, rotaContent };
}

// ─── SUNU / ROTA PANEL ────────────────────────────────────────────────────────

type ActivePanel = 'sunu' | 'rota';

const FUTURA_STYLE = "font-['Futura_BLK_BT','Futura','Arial_Black',sans-serif] font-black";

export const SunuRotaPanel = ({ issueData, expanded: externalExpanded, onToggleExpand }: { issueData: IssueData, expanded?: boolean; onToggleExpand?: () => void }) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('sunu');
  const [internalExpanded, setInternalExpanded] = useState(false);

  const expanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
  const toggleExpand = onToggleExpand || (() => setInternalExpanded(!internalExpanded));

  const switchTo = (panel: ActivePanel) => {
    setActivePanel(panel);
    if (externalExpanded === undefined) setInternalExpanded(false);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl p-8 md:p-10 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">

      {/* Background Subtle Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-400" />

      {/* Header & Tabs */}
      <div className="relative flex justify-between items-center mb-8 z-10">
        <div className="flex bg-gray-100 p-1.5 rounded-full">
          <button
            onClick={() => switchTo('sunu')}
            className={`relative px-6 py-2.5 rounded-full text-sm font-bold tracking-widest transition-all duration-300 ${activePanel === 'sunu' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {activePanel === 'sunu' && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-red-600 rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            <span className="relative z-10 uppercase">Sunu</span>
          </button>
          <button
            onClick={() => switchTo('rota')}
            className={`relative px-6 py-2.5 rounded-full text-sm font-bold tracking-widest transition-all duration-300 ${activePanel === 'rota' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {activePanel === 'rota' && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-red-600 rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            <span className="relative z-10 uppercase">Rota</span>
          </button>
        </div>

        {/* Decorative Quote Icon */}
        <div className="text-gray-100 hidden sm:block">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-30 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel + issueData.number}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full flex flex-col min-h-0"
          >
            {activePanel === 'sunu' ? (
              <div className="flex-1 flex flex-col group/text relative min-h-0">
                <div
                  className={`text-zinc-600 font-serif text-md md:text-xl leading-relaxed relative ${expanded ? 'overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent' : 'overflow-visible'} flex-1 min-h-0`}
                >
                  <div className={`pt-3 -mt-3 relative z-30 ${expanded ? '' : 'line-clamp-[9] xl:line-clamp-[11]'}`}>
                    {issueData.sunuText}
                  </div>

                  {!expanded && (
                    <div
                      className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-40 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={toggleExpand}
                      title="Tümünü Oku"
                    />
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
                  <button
                    onClick={toggleExpand}
                    className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest transition-colors bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-full cursor-pointer"
                  >
                    <span>{expanded ? 'Daralt' : 'Tümünü Oku'}</span>
                    <motion.svg animate={{ rotate: expanded ? 180 : 0, x: expanded ? 0 : 4 }} transition={{ duration: 0.3 }} className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={expanded ? "M5 15l7-7 7 7" : "M17 8l4 4m0 0l-4 4m4-4H3"} />
                    </motion.svg>
                  </button>
                  <div className="flex flex-col items-end">
                    <span className="text-black font-bold text-sm uppercase tracking-wider">Yayın Kurulu</span>
                    <span className="text-zinc-500 italic text-xs font-serif">Genç Hayat</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col group/text relative min-h-0">
                <div
                  className={`text-zinc-600 font-serif text-sm md:text-md leading-relaxed relative ${expanded ? 'overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent' : 'overflow-hidden'} flex-1 min-h-0`}
                >
                  <div className="mb-6 relative z-30">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-tight tracking-tight mb-3">
                      {issueData.rotaTitle || <span className="text-gray-300">Rota başlığı girilmedi</span>}
                    </h3>
                    <p className="text-xl md:text-2xl text-zinc-500 font-serif italic mb-2">
                      {issueData.rotaDesc}
                    </p>
                  </div>

                  <div className={`relative z-30 ${expanded ? '' : 'line-clamp-[6] xl:line-clamp-[8]'}`}>
                    {issueData.rotaContent}
                  </div>

                  {!expanded && (
                    <div
                      className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-40 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={toggleExpand}
                      title="Tümünü Oku"
                    />
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
                  <button
                    onClick={toggleExpand}
                    className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest transition-colors bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-full cursor-pointer"
                  >
                    <span>{expanded ? 'Daralt' : 'Tümünü Oku'}</span>
                    <motion.svg animate={{ rotate: expanded ? 180 : 0, x: expanded ? 0 : 4 }} transition={{ duration: 0.3 }} className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={expanded ? "M5 15l7-7 7 7" : "M17 8l4 4m0 0l-4 4m4-4H3"} />
                    </motion.svg>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const VISIBLE_ISSUES = 3;

const CoverCard = ({ issueData, issuesList, onSelectIssue }: { issueData: IssueData, issuesList: IssueData[], onSelectIssue: (issue: IssueData) => void }) => {
  const allNumbers = [...issuesList].sort((a, b) => b.number - a.number).map(i => i.number);

  const [issueOffset, setIssueOffset] = useState(() => {
    const idx = allNumbers.indexOf(issueData.number);
    return Math.max(0, Math.min(idx, allNumbers.length - VISIBLE_ISSUES));
  });

  const handleNextIssues = () => {
    if (issueOffset + VISIBLE_ISSUES < allNumbers.length) {
      setIssueOffset(Math.min(issueOffset + 1, allNumbers.length - VISIBLE_ISSUES));
    }
  };

  const handlePrevIssues = () => {
    if (issueOffset > 0) {
      setIssueOffset(Math.max(0, issueOffset - 1));
    }
  };

  const visibleNumbers = allNumbers.slice(issueOffset, issueOffset + VISIBLE_ISSUES);

  const handleSelectNumber = (num: number) => {
    const found = issuesList.find(i => i.number === num);
    if (found) onSelectIssue(found);
  };

  return (
    <div className="flex flex-col h-full bg-[#FCFCFC] border border-gray-200 p-6 md:p-8 relative shadow-sm rounded-lg lg:h-full">
      <div className="absolute top-0 right-0 w-40 h-40 bg-red-100/50 rounded-full blur-[50px] pointer-events-none" />
      <Link to={`/sayi/${issueData.number}`} className="block relative z-10 flex-1 mb-6">
        <div className="relative w-full h-full min-h-[350px] lg:min-h-0 flex items-center justify-center bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 group/cover overflow-hidden">
          <img
            src={issueData.cover}
            alt={`Genç Hayat Sayı ${issueData.number} Kapak`}
            className="w-full h-full max-h-[500px] object-cover transition-transform duration-700 group-hover/cover:scale-[1.03]"
          />
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest z-10 rounded-sm">
            #{issueData.number}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/40 transition-colors duration-500 z-10 flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover/cover:opacity-100">
            <span className="translate-y-4 group-hover/cover:translate-y-0 text-white font-black uppercase text-sm tracking-[0.2em] transition-all duration-500 flex items-center gap-3 bg-red-600 px-6 py-3 rounded-sm shadow-xl">
              Sayıyı İncele
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>

      {/* Issue Selector */}
      <div className="relative z-20 flex gap-1 justify-center items-center mb-6 shrink-0 min-h-[32px]">
        {issueOffset > 0 && (
          <button
            onClick={handlePrevIssues}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-zinc-600 transition-colors shrink-0 mr-1"
            aria-label="Daha Yeni Sayılar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {visibleNumbers.map((num) => {
          const isSelected = num === issueData.number;
          return (
            <button
              key={num}
              onClick={() => handleSelectNumber(num)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${isSelected
                  ? 'bg-red-600 text-white shadow-md cursor-default'
                  : 'bg-white border border-gray-200 text-zinc-600 hover:border-black hover:text-black'
                }`}
            >
              {num}
            </button>
          );
        })}

        {issueOffset + VISIBLE_ISSUES < allNumbers.length && (
          <button
            onClick={handleNextIssues}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-zinc-600 transition-colors shrink-0 ml-1"
            aria-label="Daha Eski Sayılar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};


// ─── MOBILE LAYOUT ──────────────────────────────────────────────────────────

const MobileLayout = ({ selectedIssue, issuesList, onSelectIssue, articles }: { selectedIssue: IssueData, issuesList: IssueData[], onSelectIssue: (issue: IssueData) => void, articles: ArticleCard[] }) => {
  const latestIssueNumber = Math.max(...issuesList.map(i => i.number));
  const isLatest = selectedIssue.number === latestIssueNumber;
  const heading = isLatest ? 'Son Sayının Önerilen Yazıları' : `${selectedIssue.number}. Sayının Önerilen Yazıları`;

  return (
    <div className="flex flex-col gap-8">
      <CoverCard issueData={selectedIssue} issuesList={issuesList} onSelectIssue={onSelectIssue} />
      <SunuRotaPanel issueData={selectedIssue} />
      <div>
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-4">{heading}</span>
        <div className="h-0.5 w-12 bg-black mt-1.5 mb-2 ml-4" />
        <ArticleLine articles={articles} className="!py-0" />
      </div>
    </div>
  );
};

// ─── MAIN SECTION ────────────────────────────────────────────────────────────

export const MainSection = () => {
  const { data } = useApi();

  const mainRow = data?.sections.find(s => s.type === 'main-row');

  // Build current issue from API data
  const apiIssue = useMemo(() => {
    if (!mainRow) return null;
    return buildIssueFromApi(mainRow);
  }, [mainRow]);

  // Combine API issue with fallback issues (dedup by number)
  const issuesList = useMemo(() => {
    if (!apiIssue) return fallbackIssues;
    const filtered = fallbackIssues.filter(i => i.number !== apiIssue.number);
    return [apiIssue, ...filtered];
  }, [apiIssue]);

  const [selectedIssue, setSelectedIssue] = useState<IssueData>(fallbackIssues[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update selected issue when API data loads
  useEffect(() => {
    if (apiIssue) {
      setSelectedIssue(apiIssue);
    }
  }, [apiIssue]);

  const handleSelectIssue = (issue: IssueData) => {
    setSelectedIssue(issue);
    setIsExpanded(false);
  };

  const latestIssueNumber = Math.max(...issuesList.map(i => i.number));
  const isLatest = selectedIssue.number === latestIssueNumber;

  // Recommended articles: from API main-row or MOCK fallback
  const recommendedArticles: ArticleCard[] = mainRow?.articles.length
    ? mainRow.articles.map(toArticleCard)
    : MOCK_ARTICLES.slice(0, 8);

  return (
    <section className="py-16 md:py-24 bg-white font-bradford">
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px]">

        {/* MOBILE */}
        <div className="block lg:hidden">
          <MobileLayout selectedIssue={selectedIssue} issuesList={issuesList} onSelectIssue={handleSelectIssue} articles={recommendedArticles} />
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:flex flex-col gap-16">

          {/* Row 1: Cover | Sunu/Rota */}
          <div className="relative w-full h-[600px] flex items-stretch">
            {/* The Cover Layer */}
            <div className={`w-[41.666%] h-full transition-all duration-700 ease-in-out ${isExpanded ? 'scale-[0.98] opacity-50 blur-[2px]' : 'scale-100 opacity-100'}`}>
              <CoverCard issueData={selectedIssue} issuesList={issuesList} onSelectIssue={handleSelectIssue} />
            </div>

            {/* The Sunu/Rota Overlay */}
            <div className={`absolute top-0 right-0 h-full transition-all duration-700 ease-in-out z-20 ${isExpanded ? 'w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]' : 'w-[calc(58.333%-2.5rem)]'}`}>
              <SunuRotaPanel issueData={selectedIssue} expanded={isExpanded} onToggleExpand={() => setIsExpanded(!isExpanded)} />
            </div>
          </div>

          {/* Row 2: Carousel */}
          <div className="border-t border-gray-100 pt-10">
            <ArticleCarousel issueNumber={selectedIssue.number} isLatest={isLatest} articles={recommendedArticles} />
          </div>
        </div>
      </div>
    </section>
  );
};
