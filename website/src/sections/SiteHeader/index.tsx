import React, { useState, useEffect } from 'react';
import logo from '../../public/logo.png';
import logo_white from '../../public/logo_white.png';

// --- Sub-Components ---

// 1. Close Button
const CloseButton = ({ onClick }: { onClick: () => void }) => {
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

// 2. Menu Button
const MenuButton = ({ onClick, isWhite = false }: { onClick: () => void; isWhite?: boolean }) => {
  const barColor = isWhite ? 'bg-white' : 'bg-black';

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-transparent p-2 hover:bg-white/10 rounded-md transition-colors"
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
const SocialIcons = ({ isWhite = false }: { isWhite?: boolean }) => {
  const socialLinks = [
    {
      href: "https://www.instagram.com/genchayatt/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      href: "https://x.com/genc_hayatt",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      href: "https://www.tiktok.com/@genc_hayat",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
        </svg>
      )
    },
    {
      href: "https://www.youtube.com/@GencHayatt",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
          className={`${isWhite ? 'text-white hover:text-white/70' : 'text-black hover:text-gray-600'} transition-colors p-1`}
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
const Logo = ({ isWhite = false }: { isWhite?: boolean }) => {
  // If you have these files in your public folder, these paths should work.
  // Otherwise, ensure the images are available at these paths.
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

// 5. Mobile Menu (Includes FooterColumn)
interface FooterColumnProps {
  title: string;
  variant: string;
  content: React.ReactNode;
}

const FooterColumn = ({ title, variant, content }: FooterColumnProps) => {
  return (
    <div className={`${variant}`}>
      <h3 className="font-semibold mb-4 text-white">{title}</h3>
      {content}
    </div>
  );
};

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgb(199,78,38)] overflow-y-auto">
      {/* Header */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px]">
        <div className="relative flex items-center justify-between h-20 max-w-[1200px] mx-auto">
          {/* Left - Social Icons */}
          <div className="hidden lg:flex items-center">
            <SocialIcons isWhite={true} />
          </div>

          {/* Center - White Logo */}
          <Logo isWhite={true} />

          {/* Right - Close Button */}
          <div className="flex items-center ml-auto lg:ml-0">
            <CloseButton onClick={onClose} />
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] max-w-[1200px] mx-auto">
        <div className="box-border caret-transparent tracking-[0.108px] mt-20 pb-20 md:tracking-[0.09px] grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          <FooterColumn
            title="Genç Hayat"
            variant=""
            content={
              <div className="text-[13px] box-border caret-transparent leading-[20.8px] md:text-[15px] md:leading-[26px]">
                <p className="mb-2">
                  <a href="/hakkimizda" className="text-white hover:text-white/70 transition-colors" onClick={onClose}>Hakkımızda</a>
                </p>
                <p className="mb-2">
                  <a href="/iletisim" className="text-white hover:text-white/70 transition-colors" onClick={onClose}>İletişim</a>
                </p>
              </div>
            }
          />
          <FooterColumn
            title="Kategoriler"
            variant="border-white/30 pt-5 border-t md:pt-0 md:border-t-0"
            content={
              <div className="text-[13px] box-border caret-transparent leading-[20.8px] md:text-[15px] md:leading-[26px]">
                <p className="mb-2"><a href="/guncel" className="text-white hover:text-white/70" onClick={onClose}>Güncel</a></p>
                <p className="mb-2"><a href="/tarih" className="text-white hover:text-white/70" onClick={onClose}>Tarih</a></p>
                <p className="mb-2"><a href="/kuram" className="text-white hover:text-white/70" onClick={onClose}>Kuram</a></p>
                <p className="mb-2"><a href="/felsefe" className="text-white hover:text-white/70" onClick={onClose}>Felsefe</a></p>
                <p className="mb-2"><a href="/kultur-sanat" className="text-white hover:text-white/70" onClick={onClose}>Kültür-Sanat</a></p>
                <p className="mb-2"><a href="/dunya" className="text-white hover:text-white/70" onClick={onClose}>Dünya</a></p>
                <p className="mb-2"><a href="/spor" className="text-white hover:text-white/70" onClick={onClose}>Spor</a></p>
              </div>
            }
          />
          <FooterColumn
            title="Tematik"
            variant="border-white/30 pt-5 border-t md:pt-0 md:border-t-0"
            content={
              <div className="text-[13px] box-border caret-transparent leading-[20.8px] md:text-[15px] md:leading-[26px]">
                <p className="mb-2"><a href="/bir-olay-bir" className="text-white hover:text-white/70" onClick={onClose}>Bir Olay Bir</a></p>
                <p className="mb-2"><a href="/kavram" className="text-white hover:text-white/70" onClick={onClose}>Kavram</a></p>
                <p className="mb-2"><a href="/portre" className="text-white hover:text-white/70" onClick={onClose}>Portre</a></p>
                <p className="mb-2"><a href="/nato" className="text-white hover:text-white/70" onClick={onClose}>NATO</a></p>
              </div>
            }
          />
          <FooterColumn
            title="Dosyalar"
            variant="border-white/30 pt-5 border-t md:pt-0 md:border-t-0"
            content={
              <div className="text-[13px] box-border caret-transparent leading-[20.8px] md:text-[15px] md:leading-[26px]">
                <p className="mb-2"><a href="/cumhuriyet" className="text-white hover:text-white/70" onClick={onClose}>Cumhuriyet</a></p>
                <p className="mb-2"><a href="/8-mart" className="text-white hover:text-white/70" onClick={onClose}>8 Mart</a></p>
                <p className="mb-2"><a href="/antiemperyalizm" className="text-white hover:text-white/70" onClick={onClose}>Antiemperyalizm</a></p>
                <p className="mb-2"><a href="/anadil" className="text-white hover:text-white/70" onClick={onClose}>Anadil</a></p>
              </div>
            }
          />
          <FooterColumn
            title="Sayılar"
            variant="border-white/30 pt-5 border-t md:pt-0 md:border-t-0"
            content={
              <div className="text-[13px] box-border caret-transparent leading-[20.8px] md:text-[15px] md:leading-[26px]">
                <p className="mb-2"><a href="/497-sayi" className="text-white hover:text-white/70" onClick={onClose}>497. Sayı</a></p>
                <p className="mb-2"><a href="/496-sayi" className="text-white hover:text-white/70" onClick={onClose}>496. Sayı</a></p>
                <p className="mb-2"><a href="/495-sayi" className="text-white hover:text-white/70" onClick={onClose}>495. Sayı</a></p>
                <p className="mb-2"><a href="/494-sayi" className="text-white hover:text-white/70" onClick={onClose}>494. Sayı</a></p>
                <p className="mb-2"><a href="/daha-eski-sayilar" className="text-white hover:text-white/70" onClick={onClose}>Daha eski sayılar</a></p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

interface SiteHeaderProps {
  isTransparent?: boolean;
}

// Varsayılan olarak isTransparent false (klasik görünüm) yapıldı.
export const SiteHeader = ({ isTransparent: initialTransparent = false }: SiteHeaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isTop, setIsTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuClose = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if at top
      if (currentScrollY < 10) {
        setIsTop(true);
        setIsVisible(true);
      } else {
        setIsTop(false);
      }

      // Hide/Show on scroll logic
      if (currentScrollY > 10) {
        if (currentScrollY < lastScrollY) {
          setIsVisible(true); // Scrolling UP
        } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsVisible(false); // Scrolling DOWN
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Logic: Transparent only if requested, at top, and NOT hovered
  const isEffectiveTransparent = initialTransparent && isTop && !isHovered;

  return (
    <>
      <header 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          backgroundColor: isEffectiveTransparent ? 'transparent' : '#ffffff',
          borderColor: isEffectiveTransparent ? 'transparent' : '#e5e7eb',
          color: isEffectiveTransparent ? '#ffffff' : '#000000',
          boxShadow: isEffectiveTransparent ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out border-b ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
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
            <div className="flex items-center ml-auto lg:ml-0">
              <MenuButton onClick={handleMenuToggle} isWhite={isEffectiveTransparent} />
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={handleMenuClose} />
    </>
  );
};

export default SiteHeader;