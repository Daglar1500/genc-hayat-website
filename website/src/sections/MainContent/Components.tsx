import React from 'react';
import logo_redcircle from '../../public/logo_redcircle.png';

// --- Sub-Components ---

// 1. NavbarLogo
const NavbarLogo = () => {
  return (
    <a
      href="/"
      className="text-black backdrop-blur-[3px] bg-zinc-100/60 shadow-[rgba(0,0,0,0.08)_0px_24px_38px_0px,rgba(0,0,0,0.08)_0px_9px_46px_0px,rgba(0,0,0,0.08)_0px_11px_15px_0px] box-border caret-transparent block h-12 tracking-[0.108px] min-w-12 underline w-12 p-1 rounded-[75px] md:h-[57px] md:tracking-[0.09px] md:w-[57px] relative overflow-visible"
    >
      <img
        src={logo_redcircle}
        alt="Genç Hayat"
        className="box-border caret-transparent tracking-[0.108px] md:tracking-[0.09px] absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-auto"
      />
    </a>
  );
};

// 2. DesktopMenu
const DesktopMenu = () => {
  return (
    <div className="items-center box-border caret-transparent hidden h-full min-h-0 min-w-0 text-nowrap mr-5 pl-[30px] md:flex md:min-h-[auto] md:min-w-[auto]">
      <div className="box-border caret-transparent gap-x-4 flex min-h-0 min-w-0 gap-y-4 text-nowrap md:min-h-[auto] md:min-w-[auto]">
        {['Güncel', 'Tarih', 'Kuram', 'Felsefe', 'Kültür-Sanat', 'Dünya', 'Spor'].map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase().replace('ü', 'u').replace('ö', 'o').replace('ı', 'i').replace('ş', 's').replace('ç', 'c')}`}
            className="box-border caret-transparent block min-h-0 min-w-0 text-nowrap px-2.5 py-[5px] md:min-h-[auto] md:min-w-[auto] hover:bg-black/10 rounded-md transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  );
};

// 3. SearchButton (Desktop)
const SearchButton = () => {
  return (
    <button
      type="button"
      className="relative text-white oldstyle-nums font-normal items-center caret-transparent gap-x-3 hidden float-right h-full justify-center min-h-0 min-w-0 gap-y-3 text-center ml-auto px-5 py-0 rounded-[75px] md:flex md:min-h-[auto] md:min-w-[118px]"
      style={{ backgroundColor: 'rgb(221, 44, 50)' }}
    >
      <img
        src="https://c.animaapp.com/mfri9c65ooHGDe/assets/icon-2.svg"
        alt="Icon"
        className="box-border caret-transparent inline h-[25px] w-5 md:block"
      />
      <span className="box-border caret-transparent inline min-h-0 min-w-0 md:block md:min-h-[auto] md:min-w-[auto]">
        Ara
      </span>
    </button>
  );
};

// 4. MobileNavigation (Mobile Search Placeholder)
const MobileNavigation = () => {
  return (
    <div className="relative text-black items-center box-border caret-transparent gap-x-4 flex grow h-full min-h-[auto] min-w-[auto] gap-y-4 ml-5 md:hidden md:min-h-0 md:min-w-0 md:ml-[30px]">
      <img
        src="https://c.animaapp.com/mfri9c65ooHGDe/assets/icon-3.svg"
        alt="Icon"
        className="box-border caret-transparent block h-[25px] w-5 md:inline"
      />
      <span className="text-zinc-800/60 box-border caret-transparent block min-h-[auto] min-w-[auto] md:inline md:min-h-0 md:min-w-0">
        Search
      </span>
    </div>
  );
};

// 5. MobileMenuButton
const MobileMenuButton = () => {
  return (
    <button
      type="button"
      className="text-white oldstyle-nums font-normal items-center bg-red-600 caret-transparent gap-x-3 flex float-right h-full justify-center min-h-[auto] min-w-10 gap-y-3 text-center w-10 ml-auto p-0 rounded-[75px] md:hidden md:min-h-0"
    >
      <div className="relative items-center box-border caret-transparent flex h-12 justify-center min-h-[auto] min-w-[auto] w-12 scale-[0.7px] md:min-h-0 md:min-w-0 md:transform-none">
        <div className="absolute bg-white box-border caret-transparent content-[''] h-0.5 w-[25px] -mt-px top-2/4 before:absolute before:bg-white before:h-0.5 before:w-[25px] before:-top-2 before:left-0 before:content-[''] after:absolute after:bg-white after:h-0.5 after:w-[25px] after:-bottom-2 after:left-0 after:content-['']"></div>
      </div>
    </button>
  );
};

// 6. DesktopNavigation (Container)
const DesktopNavigation = () => {
  return (
    <div className="relative text-[13px] normal-nums font-medium items-center backdrop-blur-[32px] bg-zinc-100/60 shadow-[rgba(0,0,0,0.08)_0px_-11px_15px_0px,rgba(0,0,0,0.08)_0px_24px_38px_0px,rgba(0,0,0,0.08)_0px_9px_46px_0px,rgba(0,0,0,0.08)_0px_11px_15px_0px] box-border caret-transparent flex grow h-12 justify-between tracking-[normal] leading-[18.2px] overflow-hidden p-1 rounded-[75px] font-labil md:h-[57px]">
      
      {/* Desktop Content */}
      <DesktopMenu />
      <SearchButton />

      {/* Mobile Content */}
      <MobileNavigation />
      <MobileMenuButton />
      
    </div>
  );
};

// --- Main Component ---

export const FloatingNavbar = () => {
  return (
    <div className="fixed items-center box-border caret-transparent flex h-12 tracking-[0.108px] z-50 bottom-4 inset-x-4 md:h-[57px] md:tracking-[0.09px] md:bottom-8">
      <div className="items-center box-border caret-transparent flex justify-center tracking-[0.108px] max-w-[500px] w-full mx-auto md:tracking-[0.09px] md:max-w-full md:w-auto">
        <NavbarLogo />
        <DesktopNavigation />
      </div>
    </div>
  );
};