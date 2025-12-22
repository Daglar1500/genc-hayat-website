import React from 'react';

// --- Sub-Components ---

// 1. FooterColumn
type FooterColumnProps = {
  title: string;
  variant?: string;
  content: React.ReactNode;
};

const FooterColumn = ({ title, variant = "", content }: FooterColumnProps) => {
  return (
    <div className={`w-full ${variant}`}>
      <h3 className="text-stone-500 text-[13px] tracking-[1px] leading-4 font-labilvariable md:leading-[19px] mt-5">
        {title}
      </h3>
      <div className="mt-5 text-white text-[13px] leading-[20.8px] md:text-[15px] md:leading-[26px]">
        {content}
      </div>
    </div>
  );
};

// 2. FooterContent
const FooterContent = () => {
  const linkClass = "block mb-1 hover:text-white/70 transition-colors";

  return (
    <div className="mt-20 pb-20 grid grid-cols-1 md:grid-cols-5 gap-8">
      <FooterColumn
        title="Genç Hayat"
        content={
          <>
            <a href="/hakkimizda" className={linkClass}>Hakkımızda</a>
            <a href="/iletisim" className={linkClass}>İletişim</a>
          </>
        }
      />
      {/* variant içindeki "border-t" ve "border-stone-500" gibi sınıfları kaldırdım */}
      <FooterColumn
        title="Kategoriler"
        variant="pt-5 md:pt-0"
        content={
          <>
            <a href="/guncel" className={linkClass}>Güncel</a>
            <a href="/tarih" className={linkClass}>Tarih</a>
            <a href="/kuram" className={linkClass}>Kuram</a>
            <a href="/felsefe" className={linkClass}>Felsefe</a>
            <a href="/kultur-sanat" className={linkClass}>Kültür-Sanat</a>
            <a href="/dunya" className={linkClass}>Dünya</a>
            <a href="/spor" className={linkClass}>Spor</a>
          </>
        }
      />
      <FooterColumn
        title="Tematik"
        variant="pt-5 md:pt-0"
        content={
          <>
            <a href="/bir-olay-bir-kavram" className={linkClass}>Bir Olay Bir Kavram</a>
            <a href="/portre" className={linkClass}>Portre</a>
            <a href="/nato" className={linkClass}>NATO</a>
          </>
        }
      />
      <FooterColumn
        title="Dosyalar"
        variant="pt-5 md:pt-0"
        content={
          <>
            <a href="/cumhuriyet" className={linkClass}>Cumhuriyet</a>
            <a href="/8-mart" className={linkClass}>8 Mart</a>
            <a href="/antiemperyalizm" className={linkClass}>Antiemperyalizm</a>
            <a href="/anadil" className={linkClass}>Anadil</a>
          </>
        }
      />
      <FooterColumn
        title="Sayılar"
        variant="pt-5 md:pt-0"
        content={
          <>
            <a href="/497-sayi" className={linkClass}>497. Sayı</a>
            <a href="/496-sayi" className={linkClass}>496. Sayı</a>
            <a href="/495-sayi" className={linkClass}>495. Sayı</a>
            <a href="/494-sayi" className={linkClass}>494. Sayı</a>
            <a href="/daha-eski-sayilar" className={linkClass}>Daha eski sayılar</a>
          </>
        }
      />
    </div>
  );
};

// 3. FooterCopyright    
const FooterCopyright = () => {
  return (
    <div className="-mt-10 mb-20 pb-[60px] ">
      <p className="text-stone-500 text-[14px] tracking-[1px] leading-4 font-labilvariable md:leading-[19px]">
        © Genç Hayat 2025 | Tüm Hakları Saklıdır.
      </p>
    </div>
  );
};

// --- Main Footer Component ---

export const Footer = () => {
  return (
    // Ana footer konteynerinden de border-t sınıfını kaldırdım
    <footer className="bg-zinc-800">
      <div className="max-w-full mx-auto px-[30px] md:max-w-[1400px] md:px-[60px] md:w-5/6 font-bradford">
        <FooterContent />
        <FooterCopyright />
      </div>
    </footer>
  );
};