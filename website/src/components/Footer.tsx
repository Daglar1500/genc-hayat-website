import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

// ─── NAV DATA (SiteHeader menüsü ile AYNI kaynak) ──────────────────────────

export const NAV_DATA = {
    corporate: [
        { label: "Hakkımızda", to: "/hakkimizda" },
        { label: "İletişim", to: "/iletisim" },
    ],
    categories: [
        { label: "Güncel", to: "/category?category=Güncel" },
        { label: "Tarih", to: "/category?category=Tarih" },
        { label: "Kuram", to: "/category?category=Kuram" },
        { label: "Felsefe", to: "/category?category=Felsefe" },
        { label: "Kültür-Sanat", to: "/category?category=Kültür-Sanat" },
        { label: "Dünya", to: "/category?category=Dünya" },
        { label: "Spor", to: "/category?category=Spor" },
    ],
    thematic: [
        { label: "Bir Olay Bir Kavram", to: "/tematik/bir-olay-bir-kavram" },
        { label: "Portre", to: "/tematik/portre" },
        { label: "NATO", to: "/tematik/nato" },
    ],
    files: [
        { label: "Cumhuriyet", to: "/dosyalar/cumhuriyet" },
        { label: "8 Mart", to: "/dosyalar/8-mart" },
        { label: "Antiemperyalizm", to: "/dosyalar/antiemperyalizm" },
        { label: "Anadil", to: "/dosyalar/anadil" },
    ],
    issues: [
        { label: "505. Sayı", to: "/sayi/505" },
        { label: "504. Sayı", to: "/sayi/504" },
        { label: "502. Sayı", to: "/sayi/502" },
        { label: "Daha eski sayılar", to: "/sayilar" },
    ],
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

// 1. FooterAccordion (MOBİL)
const FooterAccordion = ({
    title, isOpen, onToggle, children,
}: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => (
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
                    <div className="pb-4 pt-1 flex flex-col gap-2">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// 2. FooterColumn (MASAÜSTÜ)
const FooterColumn = ({
    title, links, variant = "",
}: { title: string; links: { label: string; to: string }[]; variant?: string }) => (
    <div className={`w-full ${variant}`}>
        <h3 className="text-stone-500 text-[13px] tracking-[1px] leading-4 font-labilvariable md:leading-[19px] mt-5 mb-5">
            {title}
        </h3>
        <div className="flex flex-col gap-1">
            {links.map((link) => (
                <Link
                    key={link.to}
                    to={link.to}
                    className="text-white text-[13px] leading-[20.8px] md:text-[15px] md:leading-[26px] block mb-1 hover:text-white/70 transition-colors"
                >
                    {link.label}
                </Link>
            ))}
        </div>
    </div>
);

// 3. FooterContent
const FooterContent = () => {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const handleToggle = (id: string) => setOpenSection(openSection === id ? null : id);
    const directLinkClass = "block w-full py-4 border-b border-white/10 text-[13px] tracking-[1px] font-labilvariable text-stone-500 hover:text-white transition-colors text-left";

    const sections = [
        { id: 'categories', title: "Kategoriler", links: NAV_DATA.categories },
        { id: 'thematic', title: "Tematik", links: NAV_DATA.thematic },
        { id: 'files', title: "Dosyalar", links: NAV_DATA.files },
        { id: 'issues', title: "Dergi Sayıları", links: NAV_DATA.issues },
    ];

    return (
        <div className="mt-10 md:mt-20 pb-10 md:pb-20">

            {/* --- MOBILE VIEW --- */}
            <div className="block md:hidden border-t border-white/10">
                {NAV_DATA.corporate.map((item) => (
                    <Link key={item.to} to={item.to} className={directLinkClass}>{item.label}</Link>
                ))}
                {sections.map((section) => (
                    <FooterAccordion
                        key={section.id}
                        title={section.title}
                        isOpen={openSection === section.id}
                        onToggle={() => handleToggle(section.id)}
                    >
                        {section.links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-white/80 hover:text-white text-[14px] font-labilvariable block py-1 pl-2 border-l border-white/10 hover:border-white/50 transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </FooterAccordion>
                ))}
            </div>

            {/* --- DESKTOP VIEW (GRID) --- */}
            <div className="hidden md:grid grid-cols-5 gap-8">
                <FooterColumn title="Genç Hayat" links={NAV_DATA.corporate} />
                <FooterColumn title="Kategoriler" links={NAV_DATA.categories} variant="pt-0" />
                <FooterColumn title="Tematik" links={NAV_DATA.thematic} variant="pt-0" />
                <FooterColumn title="Dosyalar" links={NAV_DATA.files} variant="pt-0" />
                <FooterColumn title="Dergi Sayıları" links={NAV_DATA.issues} variant="pt-0" />
            </div>
        </div>
    );
};

// 4. FooterCopyright
const FooterCopyright = () => (
    <div className="-mt-5 mb-10 md:-mt-10 md:mb-20 pb-[30px] md:pb-[60px] border-t border-white/10 md:border-0 pt-6 md:pt-0">
        <p className="text-stone-500 text-[12px] md:text-[14px] tracking-[1px] leading-4 font-labilvariable md:leading-[19px] text-center md:text-left">
            © Genç Hayat 2025 | Tüm Hakları Saklıdır.
        </p>
    </div>
);

export const Footer = () => (
    <footer className="bg-zinc-800">
        <div className="max-w-full mx-auto px-[30px] md:max-w-[1400px] md:px-[60px] md:w-5/6 font-bradford">
            <FooterContent />
            <FooterCopyright />
        </div>
    </footer>
);
