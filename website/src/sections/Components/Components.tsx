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
const SearchButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
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
const MobileNavigation = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="relative text-black z-50 items-center box-border caret-transparent gap-x-4 flex grow h-full min-h-[auto] min-w-[auto] gap-y-4 ml-5 md:hidden md:min-h-0 md:min-w-0 md:ml-[30px] cursor-pointer"
    >
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
const DesktopNavigation = ({ onSearchClick }: { onSearchClick?: () => void }) => {
  return (
    <div className="relative text-[13px] normal-nums font-medium items-center backdrop-blur-[32px] bg-zinc-100/60 shadow-[rgba(0,0,0,0.08)_0px_-11px_15px_0px,rgba(0,0,0,0.08)_0px_24px_38px_0px,rgba(0,0,0,0.08)_0px_9px_46px_0px,rgba(0,0,0,0.08)_0px_11px_15px_0px] box-border caret-transparent flex grow h-12 justify-between tracking-[normal] leading-[18.2px] overflow-hidden p-1 rounded-[75px] font-labil md:h-[57px]">

      {/* Desktop Content */}
      <DesktopMenu />
      <SearchButton onClick={onSearchClick} />

      {/* Mobile Content */}
      <MobileNavigation onClick={onSearchClick} />
      <MobileMenuButton />

    </div>
  );
};

// --- Main Component ---

export const FloatingNavbar = ({ onSearchClick }: { onSearchClick?: () => void }) => {
  return (
    <div className="fixed items-center box-border caret-transparent flex h-12 tracking-[0.108px] z-[999] bottom-4 inset-x-4 md:h-[57px] md:tracking-[0.09px] md:bottom-8">
      <div className="items-center box-border caret-transparent flex justify-center tracking-[0.108px] max-w-[500px] w-full mx-auto md:tracking-[0.09px] md:max-w-full md:w-auto">
        <NavbarLogo />
        <DesktopNavigation onSearchClick={onSearchClick} />
      </div>
    </div>
  );
};



export const ShareFloatingButton = () => {
  const [isShareOpen, setIsShareOpen] = React.useState(false);

  return (
    // DEĞİŞİKLİK: 'items-end' yerine 'items-center' kullanıldı (Ortalamak için)
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-center gap-3">
      <div className={`flex flex-col gap-2 transition-all duration-300 origin-bottom ${isShareOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}>

        {/* 1. Facebook (Mavi) */}
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors">
          <span className="sr-only">Facebook</span>
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </button>

        {/* 2. X.com (Siyah - Yeni Logo) */}
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white hover:border-black transition-colors">
          <span className="sr-only">X (Twitter)</span>
          {/* Güncel X Logosu */}
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 8.761-6.572-8.71h-1.87l7.135 9.475z"></path></svg>
        </button>

        {/* 3. WhatsApp (Yeşil) */}
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors">
          <span className="sr-only">WhatsApp</span>
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
        </button>

        {/* 4. Bağlantı Kopyala (Sarı) */}
        <button
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-yellow-400 hover:text-white hover:border-yellow-400 transition-colors"
          title="Bağlantıyı Kopyala"
        >
          <span className="sr-only">Copy Link</span>
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
        </button>
      </div>

      {/* Ana Toggle Butonu */}
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