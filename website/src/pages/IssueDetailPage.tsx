import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_ARTICLES } from '../data/MockArticles';
import { ArticleLine } from './MainPage/MainContent/ArticleLine';

// Kapak görselleri
import img1 from "../public/gh-kapak/GH - Sayı 505 - 24 Aralık 2025_page-0001.jpg";
import img2 from "../public/gh-kapak/gh.jpg";
import img3 from "../public/gh-kapak/GH - Sayı_ 502 - 12 Kasım 2025 (1)_page-0001.jpg";
import img4 from "../public/gh-kapak/GH - Sayı_ 499 - 1 Ekim 2025_page-0001.jpg";
import img5 from "../public/gh-kapak/GH - Sayı_ 497 - 3 Eylül 2025 (1)_page-0001.jpg";
import img6 from "../public/gh-kapak/GH - Sayı_ 496 - 16 Ağustos 2025 (1)_page-0001.jpg";
import img7 from "../public/gh-kapak/GH - Sayı_ 494 - 23 Temmuz 2025_page-0001.jpg";
import img8 from "../public/gh-kapak/GH - Sayı_ 490 - 28 Mayıs 2025_page-0001.jpg";

const ISSUE_COVERS: Record<string, { cover: any; title: string; date: string; pdfUrl: string }> = {
    '505': { cover: img1, title: 'Dosya: Yeni Yıl ve Umut', date: 'Aralık 2025', pdfUrl: '#' },
    '504': { cover: img2, title: 'Dosya: Erdal Eren ve Gençlik', date: 'Aralık 2025', pdfUrl: '#' },
    '502': { cover: img3, title: 'Dosya: Sonbahar Direnişi', date: 'Kasım 2025', pdfUrl: '#' },
    '499': { cover: img4, title: 'Dosya: Ekim Dönümü', date: 'Ekim 2025', pdfUrl: '#' },
    '497': { cover: img5, title: 'Dosya: Cumhuriyet ve Biz', date: 'Eylül 2025', pdfUrl: '#' },
    '496': { cover: img6, title: 'Dosya: Üniversiteler Açılırken', date: 'Ağustos 2025', pdfUrl: '#' },
    '494': { cover: img7, title: 'Dosya: Yaz ve Emek', date: 'Temmuz 2025', pdfUrl: '#' },
    '490': { cover: img8, title: 'Dosya: 1 Mayıs ve Gençlik', date: 'Mayıs 2025', pdfUrl: '#' },
};

type ActivePanel = 'sunu' | 'rota';

const SunuRotaPanel = ({ issueNumber }: { issueNumber: number }) => {
    const [activePanel, setActivePanel] = useState<ActivePanel>('sunu');
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => setExpanded(!expanded);

    return (
        <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl p-8 md:p-10 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 mt-6 lg:mt-0">

            {/* Background Subtle Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            {/* Top Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-400" />

            {/* Header & Tabs */}
            <div className="relative flex justify-between items-center mb-8 z-10">
                <div className="flex bg-gray-100 p-1.5 rounded-full">
                    <button
                        onClick={() => { setActivePanel('sunu'); setExpanded(false); }}
                        className={`relative px-6 py-2.5 rounded-full text-sm font-bold tracking-widest transition-all duration-300 ${activePanel === 'sunu' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {activePanel === 'sunu' && (
                            <motion.div layoutId="tab-bg-detail" className="absolute inset-0 bg-red-600 rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                        )}
                        <span className="relative z-10 uppercase">Sunu</span>
                    </button>
                    <button
                        onClick={() => { setActivePanel('rota'); setExpanded(false); }}
                        className={`relative px-6 py-2.5 rounded-full text-sm font-bold tracking-widest transition-all duration-300 ${activePanel === 'rota' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {activePanel === 'rota' && (
                            <motion.div layoutId="tab-bg-detail" className="absolute inset-0 bg-red-600 rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
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
                        key={activePanel}
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
                                        <p className="mb-4 first-letter:text-6xl first-letter:font-black first-letter:text-black first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1">
                                            Okullarımız çoğu zaman yokluğuyla hatırlanan, varlığıyla pek fark etme şansına erişemediğimiz bir etken maddenin arayışındayız. Mesela bir sıvı sabun, dezenfektan tam da bu özellikleri karşılıyor bizim için. Günlük hayatta sessizce birikiren- ler vardır pas,kir, çeşitli mikroplar gibi; belki kabullendiğimiz belki alıştığımız. Bu tarz şeyler ortak alanlarda daha hızlı da çoğalabilirler kimi zaman; kalabalıkta, ihmalde, üst üste bindikçe görünmezleşirler belki. Ancak o ortak alanları oluş turan kalabalıkların, yani her bir kişinin efor gösterdiği koşullarda, ne kadar fazla kişi "Böyle ah vah'la ne yapacağız biz ya, kalkın bir şey yapalım ya" diyerek, "Öyle oturup izleyelim mi ya, ortalığı pislik götürüyor" diyerek harekete geçme kararına katılırsa; hasta eden mikroplarla, etrafı kirletenlerin ortadan kalkması da o kadar etkili olur. Düzenli ve ısrarlı bir müdahale varsa sonuç verir.
                                        </p>
                                        <p className="mb-4">
                                            Bu {issueNumber}. sayımızda, "Geleceksizlik" kavramını sadece bir karamsarlık ifadesi olarak değil, değiştirilmesi gereken bir gerçeklik olarak ele alıyoruz.
                                        </p>
                                        <p className="mb-4">
                                            Derginin sayfalarını çevirdikçe göreceksiniz ki her bir satır aslında kolektif bir çabanın ürünü. Editörlerimizden yazarlarımıza herkesin katkısıyla şekillenen bu sayı, umudun örgütlü halidir.
                                        </p>
                                    </div>

                                    {!expanded && (
                                        <div
                                            className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white via-white/50 to-transparent z-40 cursor-pointer hover:opacity-90 transition-opacity"
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
                                            Pusulasız Zamanlarda Yön Bulmak
                                        </h3>
                                        <p className="text-xl md:text-2xl text-zinc-500 font-serif italic mb-2">
                                            Saray rejimine karşı rotamız, Erdal Eren'in bize bıraktığı en önemli mirastan geçiyor.
                                        </p>
                                    </div>

                                    <div className={`relative z-30 ${expanded ? '' : 'line-clamp-[6] xl:line-clamp-[8]'}`}>
                                        <p className="mb-4">
                                            Erdal Eren'in 12 Eylül faşist cuntasınca idam edilişinin üzerinden 45 yıl geçti. Erdal, o dönemde Ankara Ortaöğrenimliler Derneği (ANOD) bünyesinde örgütlenmiş bir meslek lisesi öğrencisiydi.
                                        </p>
                                        <p className="mb-4">
                                            <strong className="text-black bg-yellow-100/60 px-1 rounded">Yoksulluk her geçen gün daha da derinleşiyor.</strong> Bugün Erdal gibi meslek liseli olan yüz binlerce genç, MESEM adı altında sigortasız işyerlerine sürülüyor.
                                        </p>
                                        <p>Erdal Eren'in mücadelesini güncellemek, bugünün gençliğinin en acil görevidir.</p>
                                    </div>

                                    {!expanded && (
                                        <div
                                            className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white via-white/50 to-transparent z-40 cursor-pointer hover:opacity-90 transition-opacity"
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

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export const IssueDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const issueNumber = parseInt(id || '0', 10);
    const issueInfo = ISSUE_COVERS[id || ''];
    const articles = MOCK_ARTICLES.filter(a => a.issueNumber === issueNumber);

    return (
        <div className="min-h-screen bg-white font-bradford">

            {/* Hero: Cover + Sunu/Rota */}
            <div className="pt-24 pb-0 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pb-12 border-b border-gray-200">

                        {/* Cover — 4 columns (1/3 of 12) */}
                        <div className="lg:col-span-4">
                            {issueInfo ? (
                                <div className="shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                                    <img
                                        src={issueInfo.cover}
                                        alt={`${issueNumber}. Sayı Kapağı`}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">Kapak Görseli Yok</span>
                                </div>
                            )}
                            {issueInfo && (
                                <a
                                    href={issueInfo.pdfUrl}
                                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                                        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                                    </svg>
                                    Sayıyı İndir (PDF)
                                </a>
                            )}
                        </div>

                        {/* Info + Sunu/Rota — 8 columns */}
                        <div className="lg:col-span-8 flex flex-col items-stretch pt-0 lg:pt-2">
                            <p className="text-xs tracking-[3px] text-red-600 uppercase font-labilvariable mb-3">Dergi</p>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-4 leading-tight">
                                {issueNumber}. Sayı
                            </h1>
                            {issueInfo && (
                                <>
                                    <p className="text-xl text-gray-500 font-serif italic mb-1">{issueInfo.title}</p>
                                    <p className="text-sm text-gray-400 mb-6">{issueInfo.date}</p>
                                </>
                            )}
                            <SunuRotaPanel issueNumber={issueNumber} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Articles */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px]">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-zinc-900 font-sans tracking-tight border-b border-gray-200 pb-4">
                        Bu Sayının Yazıları
                        <span className="ml-3 text-sm font-normal text-gray-400">({articles.length} yazı)</span>
                    </h2>
                    {articles.length > 0 ? (
                        <ArticleLine articles={articles} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-xl text-gray-500 font-serif italic">Bu sayı için listelenecek yazı bulunmuyor.</p>
                            <Link to="/sayilar" className="mt-4 text-sm font-bold text-red-600 underline decoration-2 underline-offset-4">
                                Tüm Sayılara Git
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default IssueDetailPage;
