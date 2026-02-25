import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gh_cover from '../../../../public/gh-kapak/gh.jpg';
import gh_499 from '../../../../public/gh-kapak/GH - Sayı_ 499 - 1 Ekim 2025_page-0001.jpg';
import gh_502 from '../../../../public/gh-kapak/GH - Sayı_ 502 - 12 Kasım 2025 (1)_page-0001.jpg';
import { ArticleCardElement } from '../../ArticleCard';
import type { ArticleCard } from '../../ArticleCard';
import { ArticleLine } from '../ArticleLine';
import { MOCK_ARTICLES } from '../../../../data/MockArticles';

// ─── RECOMMENDED ARTICLES DATA ──────────────────────────────────────────────

// Give a subset (e.g. latest 7-8 or random from MOCK_ARTICLES) to recommended
const recommendedArticles: ArticleCard[] = MOCK_ARTICLES.slice(0, 8);

const VISIBLE_COUNT = 4;

// ─── CAROUSEL ────────────────────────────────────────────────────────────────

const ArticleCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = recommendedArticles.length;
  const canNext = startIndex + VISIBLE_COUNT < total;
  const canPrev = startIndex > 0;

  const next = useCallback(() => { if (canNext) setStartIndex(i => i + 1); }, [canNext]);
  const prev = useCallback(() => { if (canPrev) setStartIndex(i => i - 1); }, [canPrev]);
  const resetToStart = () => setStartIndex(0);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      if (canNext) next(); else resetToStart();
    }, 3000);
    return () => clearTimeout(timer);
  }, [startIndex, isPaused, canNext, next]);

  const visibleArticles = recommendedArticles.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Önerilen Yazılar</span>
          <div className="h-0.5 w-12 bg-black mt-1.5" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 mr-2">
            {Array.from({ length: total - VISIBLE_COUNT + 1 }).map((_, i) => (
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

const recentIssuesData: IssueData[] = [
  {
    number: 504,
    cover: gh_cover,
    sunuText: (
      <>
        <p className="mb-5 first-letter:text-6xl first-letter:font-black first-letter:text-black first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1">
          Okullarımız çoğu zaman yokluğuyla hatırlanan, varlığıyla pek fark etme şansına erişemediğimiz bir etken maddenin arayışındayız. Mesela bir sıvı sabun, dezenfektan tam da bu özellikleri karşılıyor bizim için. Günlük hayatta sessizce birikiren- ler vardır pas,kir, çeşitli mikroplar gibi; belki kabullendiğimiz belki alıştığımız. Bu tarz şeyler ortak alanlarda daha hızlı da çoğalabilirler kimi zaman; kalabalıkta, ihmalde, üst üste bindikçe görünmezleşirler belki. Ancak o ortak alanları oluş turan kalabalıkların, yani her bir kişinin efor gösterdiği koşullarda, ne kadar fazla kişi "Böyle ah vah'la ne yapacağız biz ya, kalkın bir şey yapalım ya" diyerek, "Öyle oturup izleyelim mi ya, ortalığı pislik götürüyor" diyerek harekete geçme kararına katılırsa; hasta eden mikroplarla, etrafı kirletenlerin ortadan kalkması da o kadar etkili olur. Düzenli ve ısrarlı bir müdahale varsa sonuç verir.
        </p>
        <p className="mb-5">
          Günlük hayatta alıştığımız sorunlar da böyledir; birikir, görünmez hale gelir kanıksamaktan bazen aynı zararlı mikroorganizmalar gibi, normalleşir varlıkları. Oysa yapılan araştırmalann dezenfektanlanın bunlar üzerindeki etkisini gösterdiği gibi, tarihin de defalarca gösterdiği bir formül, kanıtladığı bir gerçeklik vardır; sınıf safında yürüyen gençlik mücadelesi kazanır. Geçmiş deneyimlerinden öğrendiği mücadele sayesinde birikmiş sorunların giderildiğini tespit etmiştir tarih, araştırmalar, geçmiş günümüz güncel ömekleri. İşte böyle, israrlı ve düzenli kullanım olduğunda sorunların %90 oranında azaldığı, bize, güvenceli bir yaşam hakkımıza, nitelikli ve parasız bir eğitime yönelik saldırıların da %100 oranın- da engellendiği görülmüştür. Yapılan gözlemler aynı zamanda şunu gösterir: birikmiş sorunlar kendiliğinden dağılmaz, kalıcı etki için de her bir kişinin önlem alması gerekir. Tek sefer kullanımına başvurulan çözümler yüzeyde etki edebilir ancak kalıcı çözüm için süreklilik gerekir. İstikrarlı ve örgütlü bir mücadele varsa kazanım gelir.
        </p>
        <p className="mb-5">
          Bu sayımızda liseler yeniden açılırken, eğitim bakanının hamlelerinin öğrenciler lehine olmadığı bir kez daha açığa çıkıyor. Liseliler parasız, bilimsel ve demokratik eğitim istiyor, güvenli okullar, hijyenik koşullar, günde bir öğün ücretsiz yemek, karşılanabilir kantin fiyatları talep ediyor. Ezbere müfredat yerine ilgi alanlarına ve yeteneklerine göre öğrenmek istiyorlar; MESEM adı altında güvencesiz çalıştırılmak, iş kazalanında ya da iş cinayetlerinde hayatını kaybeden çocuk ve genç işçilerden biri olmak istemiyorlar. Bunun için de mücadeleden başka çare kalmıyor, etken maddesiyse örgütlülük olmadığı müddetçe sonuç vermiyor. İşte bu yüzden her okulda, bazı basit ihtiyaçlanın bulunması gerektiği gibi, mücadelenin de artık bir zorunluluk olarak bulunması gerekiyor.
        </p>
        <p>
          İşte böyle, alanlarımızda birikenleri hatırlatıyor; temizliğin tek başına değil, birlikte mümkün olduğunu göstermek için bir araya getiriyoruz sayfalarımızı yeniden. Herkesin kullandığı yerler için tasarlanmış bir çözümden, süreklilik isteyen bir alışkanlıktan söz ediyoruz, çünkü bazı şeyler lüks değil, ihtiyaç olduğunu biliyoruz. Ve bazı şeylerin hepimizce kullanılması, her yerde bulunması gerektiğini biliyoruz.
        </p>
        <p>
          Dergimizdeki yazılanın ifade ettiği gibi, "kasanın ağzı ihtiyaçlarımıza kapalı ama savaşlara ardına kadar açık bu düzende, ve enstrüman telinden daha gergin hissedebiliyoruz zaman zaman. Ama yalnız değiliz, birlikteliğimize sahibiz, gücümüzü birliğini alan işçiler gibi; biz de gücümüzü birlikte, ortak sorunlara ortak çözümler için hareket edersek buluyoruz.
          Genç Hayat, 508. sayısıyla karşınızda.
        </p>
      </>
    ),
    rotaTitle: "Pusulasız Zamanlarda Yön Bulmak",
    rotaDesc: "Bu yazı, gençliğin bugünkü koşullarını ve Erdal Eren'in mücadelesinden alınacak dersleri ele almaktadır.",
    rotaContent: (
      <>
        <h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">Geçmişten Bugüne</h4>
        <p className="mb-5">
          Erdal Eren'in 12 Eylül faşist cuntasınca idam edilişinin üzerinden 45 yıl geçti. Erdal, o dönemde Ankara Ortaöğrenimliler Derneği (ANOD) bünyesinde örgütlenmiş, işçi sınıfı mücadelesinin ilk adımlarını atan kararlı bir meslek lisesi öğrencisiydi.
        </p>
        <p className="mb-5">
          <strong className="text-black bg-yellow-100/60 px-1 rounded">Yoksulluk her geçen gün daha da derinleşiyor.</strong> Bugün Erdal gibi meslek liseli olan yüz binlerce genç, MESEM adı altında, denetimsiz, sigortasız işyerlerine adeta sürülüyor.
        </p>
        <h4 className="text-xl md:text-2xl font-bold text-black mb-3 mt-6 font-sans">Mücadeleyi Güncellemek</h4>
        <p>
          Erdal Eren'in mücadelesini güncellemek, bugünün gençliğinin en acil görevidir. Çünkü dün olduğu gibi bugün de özgürlük ve eşitlik mücadelesi sınavdan geçiriyor bizi.
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
          503. sayımızda, kampüslerde ve sokaklarda artan sansür ve baskı ortamını ele alıyoruz. Gençlik yaratıcılığını engelleyen her türlü girişime karşı sesimizi yükseltmekten çekinmiyoruz.
        </p>
        <p>
          Sanatın özgürleştirici gücünün engellenemeyeceğini ve bu zor zamanlarda da bir araya gelerek üretmeye devam edeceğimizi vurguluyoruz.
        </p>
      </>
    ),
    rotaTitle: "Sansüre Karşı Özgür Sanat",
    rotaDesc: "Sanat okulu öğrencilerinin kampüslerde yaşadığı sansür vakaları ve çözümleri.",
    rotaContent: (
      <>
        <h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">Sansürün Yüzleri</h4>
        <p className="mb-5">
          Üniversite şenliklerinin iptal edilmesinden, tiyatro oyunlarının yasaklanmasına kadar uzanan bir dizi engelleme, gençliğin kültürel gelişimine ket vuruyor.
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
          Barınma krizinin ulaştığı boyutlar, öğrencilerin en temel hakkı olan eğitim hakkını gasp ediyor. 502. sayımızda fahiş kiralar ve yetersiz KYK yurtlarına karşı "Barınamıyoruz" hareketini yakından inceliyoruz.
        </p>
      </>
    ),
    rotaTitle: "Barınma Haktır, Kiralar Yüksektir",
    rotaDesc: "Artan kiralar ve yetersiz yurt kapasitelerinin öğrenciler üzerindeki etkisi.",
    rotaContent: (
      <>
        <h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">Yurt Sorusalları</h4>
        <p>KYK yurtlarındaki yetersiz koşullar ve öğrencilerin insani barınma talepleri giderek daha yüksek sesle dile getiriliyor.</p>
      </>
    )
  },
  {
    number: 501,
    cover: gh_cover,
    sunuText: <p className="mb-5">501. sayımızda gençlik ve çevre mücadelesini ele alıyoruz.</p>,
    rotaTitle: "Ekolojik Yıkıma Karşı Gençlik",
    rotaDesc: "Doğa katliamlarına karşı üniversiteli gençliğin eylem pratikleri.",
    rotaContent: <div className="mb-5"><h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">İklim Krizi Değil Sistem Krizi</h4><p>Çevre mücadelesinin, kapitalizm karşıtı mücadeleden bağımsız düşünülemeyeceğini bir kez daha vurguluyoruz.</p></div>
  },
  {
    number: 500,
    cover: gh_cover,
    sunuText: <p className="mb-5 text-xl font-bold">500. sayıya ulaşmanın gururunu yaşıyoruz!</p>,
    rotaTitle: "Yarım Asırlık Çınar",
    rotaDesc: "Yayın hayatımızdaki 500. sayımızın anlamı ve önemi.",
    rotaContent: <div className="mb-5"><h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">Geçmişten Geleceğe</h4><p>500 sayıdır kesintisiz bir şekilde gençliğin sesi olmaya devam ediyoruz.</p></div>
  },
  {
    number: 499,
    cover: gh_499,
    sunuText: <p className="mb-5">499. sayımızda kadın mücadelesi ve toplumsal cinsiyet eşitliğini gündemimize alıyoruz.</p>,
    rotaTitle: "Kadınlar Birlikte Güçlü",
    rotaDesc: "Kampüslerdeki kadın dayanışma ağlarının büyümesi.",
    rotaContent: <div className="mb-5"><h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">Eşitlik İstiyoruz</h4><p>8 Mart'a giderken kampüslerdeki kadın hareketinin dinamiklerini inceliyoruz.</p></div>
  }
];

// ─── SUNU / ROTA : MODERN LIGHT DESIGN ────────────────────────────────────────

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
                      {issueData.rotaTitle}
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
  const [issueOffset, setIssueOffset] = useState(0);

  // Consider 508 as the latest issue, or whichever is higher in the data tracker.
  const maxIssue = Math.max(508, ...issuesList.map(i => i.number), issueData.number);

  // Generate an array of all available issue numbers from maxIssue down to 1, excluding the currently viewed one.
  const allNumbers = Array.from({ length: maxIssue }, (_, i) => maxIssue - i).filter(n => n !== issueData.number);

  // When the current issue changes, auto-center the pagination so that its neighbors (newer and older) are visible
  useEffect(() => {
    // Find where the next older issue is in our filtered array
    const idx = allNumbers.findIndex(n => n < issueData.number);
    // Offset by -1 to ideally show 1 newer issue and 2 older issues (if VISIBLE_ISSUES is 3)
    let newOffset = idx !== -1 ? idx - 1 : 0;
    // Don't let offset go out of bounds
    newOffset = Math.max(0, Math.min(newOffset, allNumbers.length - VISIBLE_ISSUES));
    setIssueOffset(newOffset);
  }, [issueData.number, allNumbers.length]);

  const handleNextIssues = () => {
    if (issueOffset + VISIBLE_ISSUES < allNumbers.length) {
      setIssueOffset(Math.min(issueOffset + VISIBLE_ISSUES, allNumbers.length - VISIBLE_ISSUES));
    }
  };

  const handlePrevIssues = () => {
    if (issueOffset - VISIBLE_ISSUES >= 0) {
      setIssueOffset(Math.max(0, issueOffset - VISIBLE_ISSUES));
    }
  };

  const visibleNumbers = allNumbers.slice(issueOffset, issueOffset + VISIBLE_ISSUES);

  const handleSelectNumber = (num: number) => {
    const found = issuesList.find(i => i.number === num);
    if (found) {
      onSelectIssue(found);
    } else {
      // Fallback generator for issues without explicit mock data logic
      onSelectIssue({
        number: num,
        cover: gh_cover, // placeholder image wrapper
        sunuText: <p className="mb-5 text-xl">{num}. Sayımızın sunuş yazısı henüz dijital arşive eklenmedi, içerikler ilerleyen güncellemelerde yüklenecektir.</p>,
        rotaTitle: "Arşiv: Sayı " + num,
        rotaDesc: `${num}. sayımıza ait arşiv belgeleri.`,
        rotaContent: <div className="mb-5"><h4 className="text-xl font-bold mb-3">Arşiv Kaydı</h4><p>Bu sayıya ait rota ve sunu yazıları dijitalleşme sürecindedir.</p></div>
      });
    }
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

      {/* Previous Issues Selector */}
      <div className="relative z-20 flex gap-1 justify-center items-center mb-6 shrink-0 overflow-hidden min-h-[32px]">
        {/* Prev Issues Button (Look newer) */}
        {issueOffset > 0 && (
          <button
            onClick={handlePrevIssues}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-zinc-600 transition-colors shrink-0 mr-1"
            aria-label="Daha Yeni Sayılar"
            title="Daha Yeni Sayılar"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <AnimatePresence mode="popLayout">
          {visibleNumbers.map((num) => (
            <motion.button
              key={num}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleSelectNumber(num)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${issueData.number === num
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-zinc-600 hover:border-black hover:text-black'
                }`}
            >
              {num}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Next Issues Button (Look older) */}
        {issueOffset + VISIBLE_ISSUES < allNumbers.length && (
          <button
            onClick={handleNextIssues}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-zinc-600 transition-colors shrink-0 ml-1"
            aria-label="Daha Eski Sayılar, Sayı 1'e doğru"
            title="Daha Eski Sayılar"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

    </div>
  );
};

// ─── MOBILE LAYOUT ──────────────────────────────────────────────────────────

const MobileLayout = ({ selectedIssue, issuesList, onSelectIssue }: { selectedIssue: IssueData, issuesList: IssueData[], onSelectIssue: (issue: IssueData) => void }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* 1. Cover */}
      <CoverCard issueData={selectedIssue} issuesList={issuesList} onSelectIssue={onSelectIssue} />

      {/* 2. Sunu/Rota dark box */}
      <SunuRotaPanel issueData={selectedIssue} />

      {/* 3. Önerilen Yazılar — uses same ArticleLine mobile carousel */}
      <div>
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-4">Önerilen Yazılar</span>
        <div className="h-0.5 w-12 bg-black mt-1.5 mb-2 ml-4" />
        <ArticleLine articles={recommendedArticles} className="!py-0" />
      </div>
    </div>
  );
};

// ─── MAIN SECTION ────────────────────────────────────────────────────────────

export const MainSection = () => {
  const [selectedIssue, setSelectedIssue] = useState<IssueData>(recentIssuesData[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectIssue = (issue: IssueData) => {
    setSelectedIssue(issue);
    setIsExpanded(false);
  };

  return (
    <section className="py-16 md:py-24 bg-white font-bradford">
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px]">

        {/* MOBILE */}
        <div className="block lg:hidden">
          <MobileLayout selectedIssue={selectedIssue} issuesList={recentIssuesData} onSelectIssue={setSelectedIssue} />
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:flex flex-col gap-16">

          {/* Row 1: Cover | Sunu/Rota */}
          <div className="relative w-full h-[600px] flex items-stretch">
            {/* The Cover Layer */}
            <div className={`w-[41.666%] h-full transition-all duration-700 ease-in-out ${isExpanded ? 'scale-[0.98] opacity-50 blur-[2px]' : 'scale-100 opacity-100'}`}>
              <CoverCard issueData={selectedIssue} issuesList={recentIssuesData} onSelectIssue={handleSelectIssue} />
            </div>

            {/* The Sunu/Rota Overlay */}
            <div className={`absolute top-0 right-0 h-full transition-all duration-700 ease-in-out z-20 ${isExpanded ? 'w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]' : 'w-[calc(58.333%-2.5rem)]'}`}>
              <SunuRotaPanel issueData={selectedIssue} expanded={isExpanded} onToggleExpand={() => setIsExpanded(!isExpanded)} />
            </div>
          </div>

          {/* Row 2: Carousel */}
          <div className="border-t border-gray-100 pt-10">
            <ArticleCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};