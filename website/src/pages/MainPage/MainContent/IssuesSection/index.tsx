import React from 'react';
import GridMotion from '../../../../lib/GridMotion';

// Kapak Görselleri
import img1 from "../../../../public/gh-kapak/GH - Sayı 505 - 24 Aralık 2025_page-0001.jpg";
import img2 from "../../../../public/gh-kapak/gh.jpg";
import img3 from "../../../../public/gh-kapak/GH - Sayı_ 502 - 12 Kasım 2025 (1)_page-0001.jpg";
import img4 from "../../../../public/gh-kapak/GH - Sayı_ 499 - 1 Ekim 2025_page-0001.jpg";
import img5 from "../../../../public/gh-kapak/GH - Sayı_ 497 - 3 Eylül 2025 (1)_page-0001.jpg";
import img6 from "../../../../public/gh-kapak/GH - Sayı_ 496 - 16 Ağustos 2025 (1)_page-0001.jpg";
import img7 from "../../../../public/gh-kapak/GH - Sayı_ 494 - 23 Temmuz 2025_page-0001.jpg";
import img8 from "../../../../public/gh-kapak/GH - Sayı_ 490 - 28 Mayıs 2025_page-0001.jpg";
import img9 from "../../../../public/gh-kapak/GH - Sayı_ 487 - 16 Nisan 2025_page-0001.jpg";

export const ArchiveSection = () => {

  const coverImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img1, img2, img3];

  const items = coverImages.map((img, index) => (
    <div
      key={index}
      // Shadow düşürerek kapakları öne çıkardık
      className="relative w-full h-full rounded-md overflow-hidden shadow-xl aspect-[1667/1978] group select-none"
    >
      <img
        src={img}
        alt={`Genç Hayat Kapak ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Kapakların üzerindeki siyah filtreyi tamamen kaldırdım, sadece çok hafif bir kontrast koruyucu var */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  ));

  return (
    <section className="relative w-full h-[600px] md:h-[750px] overflow-hidden bg-zinc-950 font-bradford">

      {/* --- ARKA PLAN (AKAN KAPAKLAR) --- */}
      {/* GÜNCELLEME: Opacity artırıldı (0.65). Kapaklar artık çok daha net. */}
      <div className="absolute inset-0 z-0 opacity-65">
        <GridMotion items={items} />
      </div>

      {/* --- OVERLAY (REVİZE EDİLDİ) --- */}
      {/* 1. Üstten tamamen şeffaf (to-transparent) */}
      {/* 2. Sadece aşağıda yazıların olduğu yerde koyulaşıyor (via-zinc-950/80) */}
      {/* 3. Kenarlarda hafif vignette etkisi için radial gradient eklendi */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.6)_100%)] pointer-events-none" />

      {/* --- İÇERİK ALANI --- */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center px-4 pt-20">

        {/* Kırmızı çizgi */}
        <div className="w-20 h-1.5 bg-red-600 mb-8 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />

        {/* Başlık - Gölge artırıldı ki resimlerin üstünde net okunsun */}
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-labil font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
          Genç Hayat Arşivi
        </h2>

        {/* Açıklama */}
        <p className="text-lg md:text-2xl text-zinc-200 max-w-3xl mb-12 font-serif leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Geçmişten günümüze tüm sayılarımıza dijital olarak ulaşın.
          Mücadelenin hafızasını tazeleyin.
        </p>

        {/* CTA Butonları */}
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          {/* Birinci Buton */}
          <a
            href="/arsiv"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-bold uppercase tracking-widest text-sm rounded overflow-hidden transition-all hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:-translate-y-1"
          >
            <span className="relative z-10">Tüm Arşive Git</span>
            <svg
              className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          {/* İkinci Buton */}
          <a
            href="/son-sayi-indir"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black/40 backdrop-blur-sm border-2 border-white/40 text-white font-bold uppercase tracking-widest text-sm rounded transition-all hover:bg-white hover:text-zinc-950 hover:border-white"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Son Sayıyı İndir</span>
          </a>
        </div>

      </div>
    </section>
  );
};