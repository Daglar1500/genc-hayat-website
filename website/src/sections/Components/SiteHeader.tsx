import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import logo from '../../public/logo.png';
import logo_white from '../../public/logo_white.png';

// --- Sub-Components ---

// 1. Close Button
export const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-transparent p-2 hover:bg-white/10 rounded-md transition-colors"
    >
      <div className="flex items-center justify-center h-6 w-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-6 h-6 text-white"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </button>
  );
};

// 2. Menu Button (Not Exporting)
const MenuButton = ({ onClick, isWhite = false }: { onClick: () => void; isWhite?: boolean }) => {
  const barColor = isWhite ? 'bg-white' : 'bg-black';
  const hoverClass = isWhite ? 'hover:bg-white/20' : 'hover:bg-black/5';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-transparent p-2 rounded-md transition-colors duration-200 ${hoverClass}`}
    >
      <div className={`flex flex-col items-center justify-center h-6 w-6 space-y-1`}>
        <span className={`block h-0.5 w-6 ${barColor}`}></span>
        <span className={`block h-0.5 w-6 ${barColor}`}></span>
        <span className={`block h-0.5 w-6 ${barColor}`}></span>
      </div>
    </button>
  );
};

// 3. Social Icons
export const SocialIcons = ({ isWhite = false }: { isWhite?: boolean }) => {
  const socialLinks = [
    {
      href: "https://www.instagram.com/genchayatt/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      href: "https://x.com/genc_hayatt",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      href: "https://www.tiktok.com/@genc_hayat",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      )
    },
    {
      href: "https://www.youtube.com/@GencHayatt",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      href: "https://open.spotify.com/user/y09l1m30h1s75djr7oaiw3oob?si=89c7e0945dc34bb5", // Buraya kendi Spotify profil linkinizi ekleyin
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.216.354-.668.468-1.023.252-2.803-1.714-6.328-2.1-10.487-1.15-.404.092-.806-.167-.898-.571-.093-.404.166-.805.57-.898 4.555-1.04 8.436-.607 11.592 1.316.354.216.468.667.252 1.023-.006.006-.013.013-.02.02zm1.47-3.272c-.27.446-.856.588-1.302.318-3.208-1.972-8.1-2.544-11.892-1.393-.498.15-1.026-.127-1.176-.625-.15-.498.127-1.026.625-1.176 4.33-1.313 9.765-.667 13.428 1.576.445.27.587.855.317 1.302zm.135-3.397c-3.846-2.284-10.19-2.495-13.867-1.377-.58.177-1.196-.154-1.373-.734-.177-.58.154-1.196.734-1.373 4.238-1.287 11.216-1.036 15.616 1.573.526.312.697.99.385 1.516-.312.525-.988.696-1.514.384z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className={`${isWhite ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'} rounded-md transition-all duration-200 p-2 flex items-center justify-center`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

// 4. Logo
export const Logo = ({ isWhite = false }: { isWhite?: boolean }) => {
  const logoSrc = isWhite ? logo_white : logo;

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2">
      <img
        src={logoSrc}
        alt="Logo"
        className="h-12 w-auto object-contain"
      />
    </div>
  );
};

// 5. Mobile Menu Components
interface FooterColumnProps {
  title: string;
  variant?: string;
  content: React.ReactNode;
}

const FooterColumn = ({ title, variant = "", content }: FooterColumnProps) => {
  return (
    <div className={`w-full ${variant}`}>
      <h3 className="text-white/70 text-[13px] tracking-[1px] leading-4 font-labilvariable md:leading-[19px] mt-5">
        {title}
      </h3>
      <div className="mt-5 text-white text-[13px] leading-[20.8px] md:text-[15px] md:leading-[26px] flex flex-col gap-1">
        {content}
      </div>
    </div>
  );
};


// --- ACCORDION BİLEŞENİ ---
const MobileAccordion = ({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) => {
  return (
    <div className="border-b border-white/20">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2.5 text-left focus:outline-none group"
      >
        <span className="text-white font-bradford text-lg tracking-wide group-hover:text-white/80 transition-colors">
          {title}
        </span>
        <span className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
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
            <div className="pb-2 pl-4 flex flex-col gap-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Mobile/Desktop Menu Container ---
const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const linkClass = "text-white/80 hover:text-white text-[15px] font-labilvariable transition-colors block py-0.5";

  return (
    <div className="fixed inset-0 z-50 bg-[rgb(199,78,38)] overflow-y-auto overflow-x-hidden font-bradford">

      {/* --- HEADER KISMI (Ortak) --- */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] border-b border-white/10 bg-[rgb(199,78,38)] sticky top-0 z-10">
        <div className="relative flex items-center justify-between h-20 max-w-[1200px] mx-auto">
          <div className="hidden lg:flex items-center">
            <SocialIcons isWhite={true} />
          </div>
          <Logo isWhite={true} />
          <div className="flex items-center ml-auto lg:ml-0">
            <CloseButton onClick={onClose} />
          </div>
        </div>
      </div>

      {/* --- DESKTOP MENU (Grid Yapısı - Large screens ve üzeri) --- */}
      <div className="hidden lg:block">
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px]">
          <div className="mt-20 pb-20 grid grid-cols-1 md:grid-cols-5 gap-8">
            <FooterColumn
              title="Genç Hayat"
              content={
                <>
                  <a href="/hakkimizda" className={linkClass} onClick={onClose}>Hakkımızda</a>
                  <a href="/iletisim" className={linkClass} onClick={onClose}>İletişim</a>
                </>
              }
            />
            <FooterColumn
              title="Kategoriler"
              variant="pt-5 md:pt-0"
              content={
                <>
                  <a href="/guncel" className={linkClass} onClick={onClose}>Güncel</a>
                  <a href="/tarih" className={linkClass} onClick={onClose}>Tarih</a>
                  <a href="/kuram" className={linkClass} onClick={onClose}>Kuram</a>
                  <a href="/felsefe" className={linkClass} onClick={onClose}>Felsefe</a>
                  <a href="/kultur-sanat" className={linkClass} onClick={onClose}>Kültür-Sanat</a>
                  <a href="/dunya" className={linkClass} onClick={onClose}>Dünya</a>
                  <a href="/spor" className={linkClass} onClick={onClose}>Spor</a>
                </>
              }
            />
            <FooterColumn
              title="Tematik"
              variant="pt-5 md:pt-0"
              content={
                <>
                  <a href="/bir-olay-bir-kavram" className={linkClass} onClick={onClose}>Bir Olay Bir Kavram</a>
                  <a href="/portre" className={linkClass} onClick={onClose}>Portre</a>
                  <a href="/nato" className={linkClass} onClick={onClose}>NATO</a>
                </>
              }
            />
            <FooterColumn
              title="Dosyalar"
              variant="pt-5 md:pt-0"
              content={
                <>
                  <a href="/cumhuriyet" className={linkClass} onClick={onClose}>Cumhuriyet</a>
                  <a href="/8-mart" className={linkClass} onClick={onClose}>8 Mart</a>
                  <a href="/antiemperyalizm" className={linkClass} onClick={onClose}>Antiemperyalizm</a>
                  <a href="/anadil" className={linkClass} onClick={onClose}>Anadil</a>
                </>
              }
            />
            <FooterColumn
              title="Sayılar"
              variant="pt-5 md:pt-0"
              content={
                <>
                  <a href="/497-sayi" className={linkClass} onClick={onClose}>497. Sayı</a>
                  <a href="/496-sayi" className={linkClass} onClick={onClose}>496. Sayı</a>
                  <a href="/495-sayi" className={linkClass} onClick={onClose}>495. Sayı</a>
                  <a href="/494-sayi" className={linkClass} onClick={onClose}>494. Sayı</a>
                  <a href="/daha-eski-sayilar" className={linkClass} onClick={onClose}>Daha eski sayılar</a>
                </>
              }
            />
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU (Accordion Yapısı - Large screens altı) --- */}
      <div className="block lg:hidden px-6 pb-10 max-w-[600px] mx-auto flex flex-col h-[calc(100vh-64px)]">

        {/* 1. SEARCH BAR */}
        <div className="mt-4 mb-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Genç Hayat'ta ara..."
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/50 transition-all font-labilvariable text-[14px]"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* 2. ANA LİNKLER */}
        <div className="mb-1 flex flex-col border-t border-white/20">
          <a href="/hakkimizda" onClick={onClose} className="py-2.5 border-b border-white/20 text-white font-bradford text-lg hover:pl-2 transition-all">Hakkımızda</a>
          <a href="/iletisim" onClick={onClose} className="py-2.5 border-b border-white/20 text-white font-bradford text-lg hover:pl-2 transition-all">İletişim</a>
        </div>

        {/* 3. ACCORDION MENÜLER */}
        <div className="flex flex-col">

          <MobileAccordion
            title="Kategoriler"
            isOpen={openSection === 'categories'}
            onToggle={() => handleToggle('categories')}
          >
            <a href="/guncel" className={linkClass} onClick={onClose}>Güncel</a>
            <a href="/tarih" className={linkClass} onClick={onClose}>Tarih</a>
            <a href="/kuram" className={linkClass} onClick={onClose}>Kuram</a>
            <a href="/felsefe" className={linkClass} onClick={onClose}>Felsefe</a>
            <a href="/kultur-sanat" className={linkClass} onClick={onClose}>Kültür-Sanat</a>
            <a href="/dunya" className={linkClass} onClick={onClose}>Dünya</a>
            <a href="/spor" className={linkClass} onClick={onClose}>Spor</a>
          </MobileAccordion>

          <MobileAccordion
            title="Tematik"
            isOpen={openSection === 'thematic'}
            onToggle={() => handleToggle('thematic')}
          >
            <a href="/bir-olay-bir-kavram" className={linkClass} onClick={onClose}>Bir Olay Bir Kavram</a>
            <a href="/portre" className={linkClass} onClick={onClose}>Portre</a>
            <a href="/nato" className={linkClass} onClick={onClose}>NATO</a>
          </MobileAccordion>

          <MobileAccordion
            title="Dosyalar"
            isOpen={openSection === 'files'}
            onToggle={() => handleToggle('files')}
          >
            <a href="/cumhuriyet" className={linkClass} onClick={onClose}>Cumhuriyet</a>
            <a href="/8-mart" className={linkClass} onClick={onClose}>8 Mart</a>
            <a href="/antiemperyalizm" className={linkClass} onClick={onClose}>Antiemperyalizm</a>
            <a href="/anadil" className={linkClass} onClick={onClose}>Anadil</a>
          </MobileAccordion>

          <MobileAccordion
            title="Dergi Sayıları"
            isOpen={openSection === 'issues'}
            onToggle={() => handleToggle('issues')}
          >
            <a href="/497-sayi" className={linkClass} onClick={onClose}>Son Sayı: 497</a>
            <a href="/496-sayi" className={linkClass} onClick={onClose}>Sayı 496</a>
            <a href="/495-sayi" className={linkClass} onClick={onClose}>Sayı 495</a>
            <a href="/daha-eski-sayilar" className="text-white/60 text-sm font-bold mt-2 block" onClick={onClose}>Tüm Arşiv →</a>
          </MobileAccordion>

        </div>

        {/* 4. FOOTER ALANI (Sosyal Medya) */}
        <div className="mt-6 mb-4 flex flex-col items-center gap-3">
          <span className="text-white/60 text-sm font-labilvariable">Bizi Takip Edin</span>
          <SocialIcons isWhite={true} />
        </div>

      </div>
    </div>
  );
};

// --- Main Component ---

interface SiteHeaderProps {
  isTransparent?: boolean;
}

export const SiteHeader = ({ isTransparent: initialTransparent = false }: SiteHeaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isTop, setIsTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuClose = () => setIsMenuOpen(false);

  // Scroll Progress Hook
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollProgress(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsTop(true);
        setIsVisible(true);
      } else {
        setIsTop(false);
      }

      if (currentScrollY > 10) {
        if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsVisible(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);


  const isEffectiveTransparent = !initialTransparent && isTop && !isHovered;

  return (
    <>
      {/* 1. READING PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 origin-left z-[60]"
        style={{ scaleX }}
      />

      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          color: isEffectiveTransparent ? '#ffffff' : '#000000',
          boxShadow: isEffectiveTransparent ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}  ${isTop ? 'hover:bg-white' : 'bg-white'
          }`}
      >
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px]">
          <div className="relative flex items-center justify-between h-20 max-w-[1200px] mx-auto">
            {/* Left */}
            <div className="hidden lg:flex items-center">
              <SocialIcons isWhite={isEffectiveTransparent} />
            </div>

            {/* Center */}
            <Logo isWhite={isEffectiveTransparent} />

            {/* Right */}
            <div className="flex items-center ml-auto lg:ml-0 gap-4">
              <MenuButton onClick={handleMenuToggle} isWhite={isEffectiveTransparent} />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={handleMenuClose} />
    </>
  );
};

export default SiteHeader;