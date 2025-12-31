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
            href={`/category/${item.toLowerCase().replace('ü', 'u').replace('ü', 'u').replace('ö', 'o').replace('ı', 'i').replace('ş', 's').replace('ç', 'c')}`}
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

export const ShareFloatingButton = () => {
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  
  return (
    // Share button fixed to bottom right.
    // The FloatingNavbar now respects this space by stopping short of the right edge on mobile.
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3">
        <div className={`flex flex-col gap-2 transition-all duration-300 origin-bottom ${isShareOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white hover:border-black transition-colors">
            <span className="sr-only">Twitter</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </button>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors">
            <span className="sr-only">Facebook</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </button>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors">
            <span className="sr-only">Copy Link</span>
             <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          </button>
        </div>

        <button 
          onClick={() => setIsShareOpen(!isShareOpen)}
          className={`w-12 h-12 md:w-[57px] md:h-[57px] rounded-full shadow-xl flex items-center justify-center text-white transition-colors duration-300 ${isShareOpen ? 'bg-black rotate-45' : 'bg-black hover:bg-gray-800 rotate-0'}`}
        >
           {isShareOpen ? (
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
           ) : (
             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
           )}
        </button>
      </div>
  );
}