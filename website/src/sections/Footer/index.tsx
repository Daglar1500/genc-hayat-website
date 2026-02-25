import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

// --- VERİ YAPISI ---
const FOOTER_SECTIONS = [
  {
    id: 'corporate',
    title: "Genç Hayat",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "İletişim", href: "/iletisim" }
    ]
  },
  {
    id: 'categories',
    title: "Kategoriler",
    links: [
      { label: "Güncel", href: "/guncel" },
      { label: "Tarih", href: "/tarih" },
      { label: "Kuram", href: "/kuram" },
      { label: "Felsefe", href: "/felsefe" },
      { label: "Kültür-Sanat", href: "/kultur-sanat" },
      { label: "Dünya", href: "/dunya" },
      { label: "Spor", href: "/spor" }
    ]
  },
  {
    id: 'thematic',
    title: "Tematik",
    links: [
      { label: "Bir Olay Bir Kavram", href: "/bir-olay-bir-kavram" },
      { label: "Portre", href: "/portre" },
      { label: "NATO", href: "/nato" }
    ]
  },
  {
    id: 'files',
    title: "Dosyalar",
    links: [
      { label: "Cumhuriyet", href: "/cumhuriyet" },
      { label: "8 Mart", href: "/8-mart" },
      { label: "Antiemperyalizm", href: "/antiemperyalizm" },
      { label: "Anadil", href: "/anadil" }
    ]
  },
  {
    id: 'issues',
    title: "Dergi Sayıları",
    links: [
      { label: "497. Sayı", href: "/497-sayi" },
      { label: "496. Sayı", href: "/496-sayi" },
      { label: "495. Sayı", href: "/495-sayi" },
      { label: "494. Sayı", href: "/494-sayi" },
      { label: "Daha eski sayılar", href: "/daha-eski-sayilar" }
    ]
  }
];

// --- Sub-Components ---

// 1. FooterAccordion (MOBİL)
const FooterAccordion = ({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) => {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none group"
      >
        <span className={`text-[13px] tracking-[1px] font-labilvariable transition-colors ${isOpen ? 'text-white' : 'text-stone-500 group-hover:text-stone-300'}`}>
          {title}
        </span>
        <span className={`text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'rotate-0'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-1 flex flex-col gap-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 2. FooterColumn (MASAÜSTÜ)
type FooterColumnProps = {
  title: string;
  variant?: string;
  links: { label: string; href: string }[];
};

const FooterColumn = ({ title, variant = "", links }: FooterColumnProps) => {
  return (
    <div className={`w-full ${variant}`}>
      <h3 className="text-stone-500 text-[13px] tracking-[1px] leading-4 font-labilvariable md:leading-[19px] mt-5 mb-5">
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        {links.map((link, idx) => (
             <a key={idx} href={link.href} className="text-white text-[13px] leading-[20.8px] md:text-[15px] md:leading-[26px] block mb-1 hover:text-white/70 transition-colors">
                {link.label}
             </a>
        ))}
      </div>
    </div>
  );
};

// 3. FooterContent (GÜNCELLENEN KISIM)
const FooterContent = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  // Tekil linkler için stil (Accordion başlıklarıyla aynı hizada durması için)
  const directLinkClass = "block w-full py-4 border-b border-white/10 text-[13px] tracking-[1px] font-labilvariable text-stone-500 hover:text-white transition-colors text-left";

  return (
    <div className="mt-10 md:mt-20 pb-10 md:pb-20">
      
      {/* --- MOBILE VIEW --- */}
      <div className="block md:hidden border-t border-white/10">
        
        {/* 1. MANUEL OLARAK ÇIKARILAN LINKLER (Hakkımızda & İletişim) */}
        <a href="/hakkimizda" className={directLinkClass}>
          Hakkımızda
        </a>
        <a href="/iletisim" className={directLinkClass}>
          İletişim
        </a>

        {/* 2. DİĞER KATEGORİLER (Accordion Olarak) */}
        {/* 'corporate' (Genç Hayat) id'sini filtreliyoruz, çünkü yukarıda açık olarak yazdık */}
        {FOOTER_SECTIONS.filter(section => section.id !== 'corporate').map((section) => (
          <FooterAccordion
            key={section.id}
            title={section.title}
            isOpen={openSection === section.id}
            onToggle={() => handleToggle(section.id)}
          >
            {section.links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href} 
                className="text-white/80 hover:text-white text-[14px] font-labilvariable block py-1 pl-2 border-l border-white/10 hover:border-white/50 transition-all"
              >
                {link.label}
              </a>
            ))}
          </FooterAccordion>
        ))}
      </div>

      {/* --- DESKTOP VIEW (GRID - DEĞİŞMEDİ) --- */}
      <div className="hidden md:grid grid-cols-5 gap-8">
        {FOOTER_SECTIONS.map((section, index) => (
            <FooterColumn
                key={section.id}
                title={section.title}
                variant={index > 0 ? "pt-0" : ""} 
                links={section.links}
            />
        ))}
      </div>
    </div>
  );
};

// 4. FooterCopyright    
const FooterCopyright = () => {
  return (
    <div className="-mt-5 mb-10 md:-mt-10 md:mb-20 pb-[30px] md:pb-[60px] border-t border-white/10 md:border-0 pt-6 md:pt-0">
      <p className="text-stone-500 text-[12px] md:text-[14px] tracking-[1px] leading-4 font-labilvariable md:leading-[19px] text-center md:text-left">
        © Genç Hayat 2025 | Tüm Hakları Saklıdır.
      </p>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-zinc-800">
      <div className="max-w-full mx-auto px-[30px] md:max-w-[1400px] md:px-[60px] md:w-5/6 font-bradford">
        <FooterContent />
        <FooterCopyright />
      </div>
    </footer>
  );
};