import { useState } from "react";
import { SiteHeader } from "../sections/Components/SiteHeader";
import { FloatingNavbar } from "../sections/Components/Components";
import { ShareFloatingButton } from "../sections/Components/Components";
import { Label } from "./MainPage/ArticleCard";


export const ArticleDetail = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const article = {
    title: "Dijital Çağda Okuma Kültürü: Değişen Alışkanlıklar",
    category: "Kültür-Sanat",
    issueNumber: "497",
    tags: ["Edebiyat", "Dijitalleşme", "Okuma", "Kültür"],
    subheading: "Basılı kitaplardan ekranlara uzanan yolculukta okuma alışkanlıklarımız nasıl dönüşüyor? Hız çağında derinlemesine okuma mümkün mü?",
    author: "Zeynep Yılmaz",
    place: "İstanbul, Türkiye",
    createdAt: Date.now(),
    // Bu görsel başlığın yanında kullanılacak
    imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80", 
    content: [
      { type: 'paragraph', value: "Geleneksel okuma pratikleri, dijital teknolojilerin yükselişiyle birlikte köklü bir değişim geçiriyor. Artık bilgiye ulaşmak parmaklarımızın ucunda olsa da, bu bilginin özümsenmesi süreci farklılaşıyor. Kitap kokusunun yerini soğuk ekran ışığı alırken, okuma eylemi de çizgisel bir süreçten çok parçalı ve hiper-metinsel bir yapıya bürünüyor." },
      
      { type: 'paragraph', value: "Özellikle Z kuşağı ve sonrası için 'okuma' eylemi, sadece metni takip etmek değil, aynı zamanda görsel ve işitsel uyaranlarla etkileşime girmek anlamına geliyor. Bu durum, odaklanma sürelerini etkilese de, bilgiye erişim hızını artırıyor ve çoklu görev yapabilme yeteneğini geliştiriyor." },

      { type: 'image', value: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80", layout: 'text-width' },
      
      { type: 'paragraph', value: "Ancak derinlemesine okuma (deep reading) yeteneğinin kaybı, birçok eğitimci ve nörobilimci için endişe kaynağı. Maryanne Wolf gibi uzmanlar, dijital okumanın beynimizin 'derin okuma' devrelerini köreltebileceğini savunuyor. Hızlı tarama, atlayarak okuma ve anahtar kelime avcılığı, metnin derinliklerine inmemizi zorlaştırabilir." },

      { type: 'paragraph', value: "Yine de karamsar olmamak gerek. E-kitaplar ve sesli kitaplar, okumayı daha erişilebilir ve demokratik hale getirdi. Taşınabilirlik ve depolama kolaylığı, kütüphaneleri cebimize sığdırdı. Önemli olan, aracın kendisinden ziyade, okuma eylemine verdiğimiz değer ve ayırdığımız nitelikli zamandır." }
    ]
  };

  const renderContent = () => {
    if (!Array.isArray(article.content)) return <p>İçerik hazırlanıyor...</p>;

    return article.content.map((block: any, idx: number) => {
      // 1. Paragraphs
      if (block.type === 'paragraph') {
        return (
          // Satır aralığı (leading) azaltıldı: leading-normal
          <p key={idx} className="mb-6 text-xl leading-normal text-gray-800 font-serif text-left">
            {block.value}
          </p>
        );
      }
      
      // 2. Subheadings
      if (block.type === 'subheading') {
        return (
          <h2 key={idx} className="text-3xl font-bold mt-12 mb-6 text-black font-sans">
            {block.value}
          </h2>
        );
      }

      // 3. Images
      if (block.type === 'image') {
        const layout = block.layout || 'text-width';

        // Full Screen (Optional inside text)
        if (layout === 'full-screen') {
          return (
            <div key={idx} className="relative w-screen left-1/2 -translate-x-1/2 my-12 max-w-none">
               <img src={block.value} className="w-full h-auto md:h-[80vh] object-cover" alt="Article visual" />
            </div>
          );
        }

        // Text Width
        if (layout === 'text-width') {
          return (
            <div key={idx} className="w-full my-8">
              <img src={block.value} className="w-full h-auto rounded-lg shadow-sm" alt="Article visual" />
            </div>
          );
        }

        // Side Images
        if (layout === 'left-side' || layout === 'right-side') {
           return (
             <div key={idx} className={`w-full my-8 flex ${layout === 'right-side' ? 'justify-end' : 'justify-start'}`}>
                <div className="w-1/2">
                   <img src={block.value} className="w-full h-auto rounded-lg shadow-sm" alt="Article visual" />
                </div>
             </div>
           );
        }
      }
      
      return null;
    });
  };

  return (
    <div className="font-bradford text-zinc-800 bg-white relative">
      <FloatingNavbar />
      {/* Sıradan makalelerde header şeffaf değil, beyaz olsun */}
      <SiteHeader isTransparent={false} />
      
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 pt-32">
        
        {/* ÜST BÖLÜM: Başlık, Açıklama ve Görsel (10 Sütunlu Grid) */}
        <header className="grid grid-cols-1 lg:grid-cols-10 gap-12 mb-12 border-b border-gray-200 pb-12">
            {/* Sol: Metin (6 Sütun) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                    {article.category && <Label label={article.category} />}
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        #{article.issueNumber}
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-balance tracking-tight text-zinc-900">
                    {article.title}
                </h1>

                {article.subheading && (
                    <p className="text-xl md:text-2xl text-gray-600 font-serif italic leading-relaxed">
                        {article.subheading}
                    </p>
                )}
            </div>

            {/* Sağ: Görsel (4 Sütun) */}
            <div className="lg:col-span-4">
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                    <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>
                <div className="mt-2 text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Fotoğraf: Unsplash</span>
                </div>
            </div>
        </header>

        {/* İÇERİK ve SIDEBAR (10 Sütunlu Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          
          {/* Sol Sidebar (Metadata) - İlk 2 Sütun (Col 1-2) */}
          <aside className="lg:col-span-2 relative flex flex-col items-end text-right">
             <div className="space-y-6 pt-4 border-t-2 border-black lg:border-t-0 lg:pt-0 w-full lg:w-auto sticky top-32">
              
              {/* Metadata Grubu */}
              <div className="space-y-1">
                {/* 1. Place */}
                {article.place && <div className="text-xs text-gray-500 font-serif italic">{article.place}</div>}
                
                {/* 2. Author */}
                <div className="text-base font-bold text-black">{article.author}</div>
                
                {/* 3. Date */}
                <div className="text-xs text-gray-400 font-medium">
                  {new Date(article.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Etiketler */}
              <div className="space-y-2 pt-2">
                 <div className="flex flex-wrap gap-2 justify-end">
                    {article.tags && article.tags.map((tag, i) => (
                        <Label key={i} label={tag} />
                    ))}
                 </div>
              </div>
            </div>
          </aside>

          {/* Ana İçerik - Sonraki 6 Sütun (Col 3-8) */}
          <div className="lg:col-span-6">
            <article className="w-full">
              {/* Body Text */}
              <div className="w-full">
                {renderContent()}
              </div>
            </article>

            {/* Yorum Alanı */}
            <section className="mt-16 border-t border-gray-200 pt-12">
                <h3 className="text-xl font-bold mb-4">Görüş Bildir</h3>
                <p className="text-gray-500 mb-6 italic text-sm">
                   Yorumlarınız doğrudan yazara iletilir ve halka açık olarak yayınlanmaz.
                </p>
                
                <div>
                    <textarea 
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none resize-y font-serif text-base bg-gray-50 min-h-[120px]"
                        placeholder="Yazar için notunuzu buraya yazın..."
                    />
                    <div className="mt-4 flex justify-end">
                        <button className="px-8 py-2 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 transition-transform transform hover:scale-105">
                            Gönder
                        </button>
                    </div>
                </div>
            </section>
          </div>

          {/* Sağ Boşluk - Son 2 Sütun (Col 9-10) */}
          <div className="hidden lg:block lg:col-span-2"></div>

        </div>
      </main>

      {/* Paylaş Butonu */}
      <ShareFloatingButton />
      
        
    </div>
    
  );
  
}; 
export default ArticleDetail;