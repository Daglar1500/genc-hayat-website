import { Link } from 'react-router-dom';
import img1 from "../public/gh-kapak/GH - Sayı 505 - 24 Aralık 2025_page-0001.jpg";
import img2 from "../public/gh-kapak/gh.jpg";
import img3 from "../public/gh-kapak/GH - Sayı_ 502 - 12 Kasım 2025 (1)_page-0001.jpg";
import img4 from "../public/gh-kapak/GH - Sayı_ 499 - 1 Ekim 2025_page-0001.jpg";
import img5 from "../public/gh-kapak/GH - Sayı_ 497 - 3 Eylül 2025 (1)_page-0001.jpg";
import img6 from "../public/gh-kapak/GH - Sayı_ 496 - 16 Ağustos 2025 (1)_page-0001.jpg";
import img7 from "../public/gh-kapak/GH - Sayı_ 494 - 23 Temmuz 2025_page-0001.jpg";
import img8 from "../public/gh-kapak/GH - Sayı_ 490 - 28 Mayıs 2025_page-0001.jpg";

// --- Types ---
type Issue = {
  id: string;
  number: string;
  title: string;
  date: string;
  coverImage: string | any;
  pdfUrl: string;
};

// --- Mock Data ---
const MOCK_ISSUES: Issue[] = [
  { id: "505", number: "505. Sayı", title: "Dosya: Yeni Yıl ve Umut", date: "Aralık 2025", coverImage: img1, pdfUrl: "#" },
  { id: "504", number: "504. Sayı", title: "Dosya: Erdal Eren ve Gençlik", date: "Aralık 2025", coverImage: img2, pdfUrl: "#" },
  { id: "502", number: "502. Sayı", title: "Dosya: Sonbahar Direnişi", date: "Kasım 2025", coverImage: img3, pdfUrl: "#" },
  { id: "499", number: "499. Sayı", title: "Dosya: Ekim Dönümü", date: "Ekim 2025", coverImage: img4, pdfUrl: "#" },
  { id: "497", number: "497. Sayı", title: "Dosya: Cumhuriyet ve Biz", date: "Eylül 2025", coverImage: img5, pdfUrl: "#" },
  { id: "496", number: "496. Sayı", title: "Dosya: Üniversiteler Açılırken", date: "Ağustos 2025", coverImage: img6, pdfUrl: "#" },
  { id: "494", number: "494. Sayı", title: "Dosya: Yaz ve Emek", date: "Temmuz 2025", coverImage: img7, pdfUrl: "#" },
  { id: "490", number: "490. Sayı", title: "Dosya: 1 Mayıs ve Gençlik", date: "Mayıs 2025", coverImage: img8, pdfUrl: "#" },
];

// --- Sub-Components ---

const IssueCard = ({ issue }: { issue: Issue }) => {
  return (
    <div className="group flex flex-col gap-4">
      {/* Cover Image Wrapper */}
      <Link to={`/sayi/${issue.id}`} className="relative block w-full aspect-[3/4] overflow-hidden rounded-sm shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Image */}
        <img
          src={issue.coverImage}
          alt={`${issue.number} Kapak Görseli`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 text-black px-4 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="text-sm font-medium font-bradford">Sayıyı Keşfet</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <span className="text-stone-500 text-xs tracking-wider uppercase font-labilvariable">
          {issue.date}
        </span>
        <h3 className="text-xl font-bradford font-bold leading-tight text-zinc-900 group-hover:text-red-600 transition-colors">
          <Link to={`/sayi/${issue.id}`}>{issue.number}</Link>
        </h3>
        <p className="text-sm text-stone-600 font-bradford line-clamp-2">
          {issue.title}
        </p>

        {/* Navigate to detail */}
        <Link
          to={`/sayi/${issue.id}`}
          className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black border-b border-black/20 pb-0.5 w-fit hover:border-red-600 hover:text-red-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
          </svg>
          Sayıyı Oku
        </Link>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export const IssuesPage = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 font-bradford">
      {/* Container */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px]">
        <div className="max-w-[1400px] mx-auto">

          {/* Header Section */}
          <div className="mb-12 md:mb-16 border-b border-stone-200 pb-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-4">
              Sayılar
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl font-serif italic">
              Genç Hayat dergisinin yayınlanmış tüm sayılarına buradan ulaşabilir ve yazılarını okuyabilirsiniz.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {MOCK_ISSUES.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-20 flex justify-center">
            <button className="px-8 py-3 border border-stone-300 text-stone-600 hover:bg-black hover:text-white hover:border-black transition-all duration-300 text-sm font-bold tracking-widest uppercase rounded-sm">
              Daha Eski Sayılar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};