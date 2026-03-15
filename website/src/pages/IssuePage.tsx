import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Resimleri şimdilik örnek olarak tutabiliriz ancak API'dan gelen URL'leri kullanacağız
import defaultCoverImg from "../public/gh-kapak/gh.jpg";

// --- Types ---
type Issue = {
  id: string;
  number: string;
  title: string;
  date: string;
  coverImage: string | any;
  pdfUrl: string;
};

// --- Sub-Components ---

const IssueCard = ({ issue }: { issue: Issue }) => {
  return (
    <div className="group flex flex-col gap-4">
      {/* Cover Image Wrapper */}
      <Link to={`/sayi/${issue.id}`} className="relative block w-full aspect-[3/4] overflow-hidden rounded-sm shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Image */}
        <img
          src={issue.coverImage || defaultCoverImg}
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
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      try {
        const res = await fetch(`${apiUrl}/issues`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        // Handle PHP backend wrapping results in a "data" property if paginated etc.
        const issuesData = Array.isArray(data) ? data : (data.data || []);

        const mappedIssues = issuesData.map((issue: any) => ({
          id: issue.id.toString(),
          number: `${issue.issueNumber}. Sayı`,
          title: issue.title || `Dosya: ${issue.theme || 'Yeni Sayı'}`,
          date: new Date(issue.publishedAt || issue.createdAt).toLocaleDateString("tr-TR", { month: 'long', year: 'numeric' }),
          coverImage: issue.coverImageUrl,
          pdfUrl: issue.pdfUrl || '#'
        }));

        setIssues(mappedIssues);
      } catch (error) {
        console.error("Sayılar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

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
          {loading ? (
            <div className="flex justify-center items-center py-20 text-stone-500">Yükleniyor...</div>
          ) : issues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center py-20 text-stone-500">Henüz yayınlanmış bir sayı bulunmamaktadır.</div>
          )}

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