import React from 'react';
import { motion } from 'framer-motion';
// GridMotion ve Resim Importları (Dosya yollarını projenize göre kontrol edin)
import GridMotion from '../lib/GridMotion';
import img1 from "../public/gh-kapak/GH - Sayı 505 - 24 Aralık 2025_page-0001.jpg";
import img2 from "../public/gh-kapak/gh.jpg";
import img3 from "../public/gh-kapak/GH - Sayı_ 502 - 12 Kasım 2025 (1)_page-0001.jpg";
import img4 from "../public/gh-kapak/GH - Sayı_ 499 - 1 Ekim 2025_page-0001.jpg";
import img5 from "../public/gh-kapak/GH - Sayı_ 497 - 3 Eylül 2025 (1)_page-0001.jpg";
import img6 from "../public/gh-kapak/GH - Sayı_ 496 - 16 Ağustos 2025 (1)_page-0001.jpg";
import img7 from "../public/gh-kapak/GH - Sayı_ 494 - 23 Temmuz 2025_page-0001.jpg";
import img8 from "../public/gh-kapak/GH - Sayı_ 490 - 28 Mayıs 2025_page-0001.jpg";
import img9 from "../public/gh-kapak/GH - Sayı_ 487 - 16 Nisan 2025_page-0001.jpg";

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export const AboutPage = () => {
  // GridMotion için kapak görselleri
  const coverImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img1, img2, img3];

  // GridMotion'a gönderilecek item yapısı
  const gridItems = coverImages.map((img, index) => (
    <div
      key={index}
      className="relative w-full h-full rounded-md overflow-hidden shadow-lg aspect-[1667/1978] group bg-zinc-800"
    >
      <img
        src={img}
        alt={`Genç Hayat Kapak ${index + 1}`}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
      />
    </div>
  ));

  return (
    <div className="min-h-screen bg-zinc-50 pt-[120px] pb-20 font-bradford text-zinc-900">

      {/* --- HERO SECTION --- */}
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] mb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-5xl mx-auto"
        >
          <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-4 block font-labil">
            Hakkımızda
          </span>
          <h1 className="text-5xl md:text-7xl font-labil font-bold leading-tight mb-8">
            Gençliğin Kürsüsü <br />
            <span className="text-red-600">Genç Hayat</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 font-serif leading-relaxed">
            Genç Hayat; kendine "gençliğin kürsüsü" olmayı misyon edinen, eğitim ve çalışma hayatına devam eden gençler tarafından, gençler için üretilen bir dergidir.
          </p>
        </motion.div>
      </section>

      {/* --- MISSION & VISUAL (SPLIT LAYOUT) --- */}
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-[140px] mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: TEXT CONTENT */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-labil font-bold mb-4">
                Gençler Tarafından, <br /> Gençler İçin.
              </h2>
              <div className="w-20 h-1.5 bg-red-600 rounded-full mb-6" />
              <p className="text-lg text-zinc-700 leading-relaxed mb-6">
                Eğitim sıralarından fabrika tezgahlarına kadar hayatın her alanında var olan gençlerin sesi olmayı hedefliyoruz. Sorunlarımızı, taleplerimizi ve geleceğe dair özlemlerimizi bu sayfalarda birleştiriyoruz.
              </p>

              {/* İletişim Kutusu */}
              <div className="bg-zinc-100 p-6 rounded-xl border-l-4 border-red-600 mb-8">
                <p className="text-zinc-800 font-medium italic mb-2">
                  "Yazılarınızı ve önerilerinizi bizimle paylaşın."
                </p>
                <a href="mailto:genclik@evrensel.net" className="text-red-600 font-bold hover:underline">
                  genclik@evrensel.net
                </a>
                <span className="text-zinc-500 text-sm ml-2">adresinden bizimle iletişime geçebilirsiniz.</span>
              </div>

              {/* BUTON BURADAN KALDIRILDI */}

            </motion.div>
          </motion.div>

          {/* RIGHT: GRID MOTION VISUAL */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 bg-black"
          >
            <div className="absolute inset-0 opacity-70">
              <GridMotion items={gridItems} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Sol alttaki mevcut yazı */}
            <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
              <span className="text-white/80 text-sm uppercase tracking-widest mb-1 block">Arşiv</span>
              <span className="text-white text-3xl font-labil font-bold">Yüzlerce Sayı,<br />Tek Bir Mücadele.</span>
            </div>

            {/* YENİ EKLENEN BUTON: Sağ Alt Köşe */}
            <a
              href="/arsiv"
              // GÜNCELLEME: absolute pozisyon, kırmızı renk, daha küçük boyut (px-5 py-2.5 text-xs)
              className="absolute bottom-8 right-8 z-20 group inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded-lg transition-all hover:bg-red-700 hover:shadow-xl hover:-translate-y-1 shadow-lg shadow-red-900/30"
            >
              <span>Arşive Git</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

          </motion.div>

        </div>
      </section>

      {/* --- MASTHEAD (KÜNYE) --- */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-10 mb-20">
        <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-zinc-100 text-center">
          <div className="mb-10">
            <span className="text-zinc-400 text-sm uppercase tracking-widest mb-2 block">Ek Bilgisi</span>
            <h3 className="text-2xl font-labil font-bold text-zinc-900">
              Günlük EVRENSEL Gazetesi'nin ücretsiz özel ekidir.
            </h3>
            <p className="text-zinc-500 text-sm mt-2">Türü: Yaygın süreli</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8 border-t border-zinc-100 pt-12">
            {/* SAHİBİ */}
            <div>
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">Adına Sahibi</h4>
              <p className="text-lg font-bold text-zinc-900 mb-1">Kürşat Yılmaz</p>
              <p className="text-sm text-zinc-500">Bülten Basın Yayın Reklamcılık Tic. Ltd. Şti.</p>
            </div>

            {/* GYY */}
            <div>
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">Genel Yayın Yönetmeni</h4>
              <p className="text-lg font-bold text-zinc-900">Hakkı Özdal</p>
            </div>

            {/* YAZI İŞLERİ */}
            <div>
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">Sorumlu Yazı İşleri Müdürü</h4>
              <p className="text-lg font-bold text-zinc-900">Sadık Murat Uysal</p>
            </div>

            {/* YAYIN KURULU */}
            <div className="md:col-span-3 mt-4">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-6">Yayın Kurulu</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {["Batuhan Enginer", "Ece Akın", "Rıza Mutlu", "Pelinsu Atasoy", "Ege Alkan", "Ferit Nuri İşler"].map((name, i) => (
                  <span key={i} className="px-6 py-3 bg-zinc-50 rounded-lg text-zinc-800 text-sm font-medium border border-zinc-100 hover:border-red-200 transition-colors">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* İLETİŞİM */}
            <div className="md:col-span-3 mt-8 pt-8 border-t border-zinc-100">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">Yönetim Yeri & İletişim</h4>
              <address className="not-italic text-zinc-600 text-lg leading-relaxed mb-6">
                Gülbahar Mahallesi, Oya Sokak, Tümer Plaza No: 7, <br />
                Kat: 4, Daire: 9 34394 Şişli / İSTANBUL
              </address>
              <div className="flex flex-col md:flex-row justify-center gap-6 text-zinc-800 font-medium">
                <a href="tel:02129094801" className="hover:text-red-600 transition-colors">
                  Tel: 0212 909 48 01
                </a>
                <span className="hidden md:inline text-zinc-300">|</span>
                <span>Fax: 0212 654 15 04</span>
                <span className="hidden md:inline text-zinc-300">|</span>
                <a href="mailto:genclik@evrensel.net" className="hover:text-red-600 transition-colors">
                  genclik@evrensel.net
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};