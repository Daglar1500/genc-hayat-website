import { useState } from "react";
import { SiteHeader } from "../sections/SiteHeader";
import { Footer } from "../sections/Footer";
import { FloatingNavbar } from "../sections/MainContent/components/FloatingNavbar";
import { Label } from "../sections/MainContent/sections/ArticleCard/components/Label";

export const ArticleDetail = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const article = {
    title: "The Architecture of Silence: Finding Peace in Modern Chaos",
    category: "Architecture & Design",
    issueNumber: "45",
    tags: ["Minimalism", "Urban Planning", "Mental Health", "Design Theory"],
    subheading: "An exploration into how our physical spaces shape our internal quietude, and why the future of design must prioritize silence as a fundamental material.",
    author: "Elena Vespucci",
    place: "Milan, Italy",
    createdAt: Date.now(),
    imageUrl: "https://admin.itsnicethat.com/images/YWgjxrEwLcWYux7ovniIHX-LpYQ=/269148/width-1440/SuperMarioBrosWonder_Fun_scr_01.jpg",
    content: [
      { type: 'paragraph', value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." },
      
      { type: 'paragraph', value: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae." },

      // Type 1: Full Screen (16:9)
      { type: 'image', value: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80", layout: 'full-screen' },
      
      { type: 'paragraph', value: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided." },

      { type: 'paragraph', value: "But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure." },

      // Type 2: Text Width
      { type: 'image', value: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80", layout: 'text-width' },

      { type: 'paragraph', value: "To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text." },
      
      { type: 'paragraph', value: "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout." },

      // Type 3: Right Side (3/4 width of text)
      // NOTE: Logic below will pair this with the following paragraph
      { type: 'image', value: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?auto=format&fit=crop&w=600&q=80", layout: 'right-side' },
      
      { type: 'paragraph', value: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance." },

      // Type 4: Left Side (3/4 width of text)
      // NOTE: Logic below will pair this with the following paragraph
      { type: 'image', value: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80", layout: 'left-side' },
      
      { type: 'paragraph', value: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English." }
    ]
  };

  const renderContent = () => {
    if (!Array.isArray(article.content)) return <p>İçerik hazırlanıyor...</p>;

    const renderedBlocks = [];
    
    for (let i = 0; i < article.content.length; i++) {
      const block = article.content[i];

      // --- SPECIAL LOGIC: SIDE IMAGES (Left/Right) ---
      // We check if it's a side image AND the next block is a paragraph.
      // If so, we render them as a single Flex/Grid unit to prevent wrapping.
      if (block.type === 'image' && (block.layout === 'left-side' || block.layout === 'right-side')) {
        const nextBlock = article.content[i + 1];
        
        if (nextBlock && nextBlock.type === 'paragraph') {
          // Determine Order: Image First (Left) or Text First (Right)?
          // If layout is 'left-side', image is on left.
          // If layout is 'right-side', image is on right.
          
          const isImageLeft = block.layout === 'left-side';

          renderedBlocks.push(
            <div key={`group-${i}`} className="w-full my-12 flex flex-col md:flex-row gap-8 items-start">
              {/* Left Element */}
              {isImageLeft ? (
                 <div className="w-full md:w-5/12 shrink-0">
                    <img src={block.value} className="w-full h-auto rounded-lg shadow-sm" alt="Article visual" />
                 </div>
              ) : (
                 <div className="w-full md:w-7/12">
                    <p className="text-xl leading-loose text-gray-800 font-serif text-left">
                      {nextBlock.value}
                    </p>
                 </div>
              )}

              {/* Right Element */}
              {isImageLeft ? (
                 <div className="w-full md:w-7/12">
                    <p className="text-xl leading-loose text-gray-800 font-serif text-left">
                      {nextBlock.value}
                    </p>
                 </div>
              ) : (
                 <div className="w-full md:w-5/12 shrink-0">
                    <img src={block.value} className="w-full h-auto rounded-lg shadow-sm" alt="Article visual" />
                 </div>
              )}
            </div>
          );

          // Skip the next block since we just rendered it
          i++;
          continue;
        }
      }

      // --- STANDARD BLOCKS ---

      // 1. Paragraphs
      if (block.type === 'paragraph') {
        renderedBlocks.push(
          // Width constrained to approx 7/9 (77%) to match the "7 cols" requirement 
          // within the 9-col container.
          <p key={i} className="mb-8 text-xl leading-loose text-gray-800 font-serif text-left w-full lg:w-[77%]">
            {block.value}
          </p>
        );
        continue;
      }
      
      // 2. Subheadings
      if (block.type === 'subheading') {
        renderedBlocks.push(
          <h2 key={i} className="text-3xl font-bold mt-12 mb-6 text-black font-sans w-full lg:w-[77%]">
            {block.value}
          </h2>
        );
        continue;
      }

      // 3. Images (Full Screen & Text Width)
      if (block.type === 'image') {
        const layout = block.layout || 'text-width';

        // Full Screen - Breakout
        if (layout === 'full-screen') {
          renderedBlocks.push(
            <div key={i} className="relative w-screen left-1/2 -translate-x-1/2 my-16 max-w-none">
               <img src={block.value} className="w-full h-auto md:h-[80vh] object-cover" alt="Article visual" />
            </div>
          );
          continue;
        }

        // Text Width (matches paragraph width)
        if (layout === 'text-width') {
          renderedBlocks.push(
            <div key={i} className="w-full lg:w-[77%] my-10">
              <img src={block.value} className="w-full h-auto rounded-lg shadow-sm" alt="Article visual" />
            </div>
          );
          continue;
        }

        // Fallback for side images that didn't have a pairing paragraph (orphan images)
        if (layout === 'left-side' || layout === 'right-side') {
           renderedBlocks.push(
             <div key={i} className={`w-full lg:w-[77%] my-10 flex ${layout === 'right-side' ? 'justify-end' : 'justify-start'}`}>
                <div className="w-1/2">
                   <img src={block.value} className="w-full h-auto rounded-lg shadow-sm" alt="Article visual" />
                </div>
             </div>
           );
        }
      }
    }

    return renderedBlocks;
  };

  return (
    <div className="font-bradford text-zinc-800 bg-white relative">
      <FloatingNavbar />
      <SiteHeader isTransparent={true} />
      
      {/* Hero Image */}
      <div className="w-full h-[60vh] relative bg-gray-900">
         <img 
           src={article.imageUrl} 
           alt={article.title} 
           className="absolute inset-0 w-full h-full object-cover opacity-90"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10"></div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16">
        
        {/* Layout: Grid 12 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
          
          {/* LEFT SIDEBAR (Metadata) - 3 Columns */}
          <aside className="lg:col-span-3 relative flex flex-col items-end text-right">
             <div className="space-y-8 pt-4 border-t-2 border-black lg:border-t-0 lg:pt-0 w-full lg:w-auto">
              
              {/* Author Info */}
              <div className="space-y-1">
                <div className="text-sm font-bold text-black">{article.author}</div>
                {article.place && <div className="text-xs text-gray-500 font-serif italic">{article.place}</div>}
              </div>

              {/* Date */}
              <div className="space-y-1">
                <div className="text-sm text-black font-medium">
                  {new Date(article.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Issue Info */}
              {article.issueNumber && (
                <div className="space-y-1">
                   <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Sayı</span>
                   <div className="text-sm font-bold text-red-600">
                     #{article.issueNumber}
                   </div>
                </div>
              )}

              {/* Tags */}
              <div className="space-y-2">
                 <div className="flex flex-wrap gap-2 justify-end">
                    {article.category && (
                        <Label label={article.category} />
                    )}
                    {article.tags && article.tags.map((tag, i) => (
                        <Label key={i} label={tag} />
                    ))}
                 </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT COLUMN - 9 Columns (Expanded to allow side images) */}
          <div className="lg:col-span-9">
            <article>
              {/* Header Area - Left Aligned, constrained to text width (7 cols approx) */}
              <header className="mb-14 text-left border-b border-gray-200 pb-10 w-full lg:w-[77%]">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 text-balance tracking-tight">
                  {article.title}
                </h1>

                {article.subheading && (
                  <p className="text-2xl md:text-3xl text-gray-600 font-serif italic leading-relaxed">
                    {article.subheading}
                  </p>
                )}
              </header>

              {/* Body Text */}
              <div className="w-full">
                {renderContent()}
              </div>
            </article>

            {/* Comment Section - Constrained to text width */}
            <section className="mt-24 border-t border-gray-200 pt-12 w-full lg:w-[77%]">
                <h3 className="text-2xl font-bold mb-4">Görüş Bildir</h3>
                <p className="text-gray-500 mb-8 italic">
                   Yorumlarınız doğrudan yazara iletilir ve halka açık olarak yayınlanmaz.
                </p>
                
                <div>
                    <textarea 
                        className="w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none resize-y font-serif text-lg bg-gray-50 min-h-[160px]"
                        placeholder="Yazar için notunuzu buraya yazın..."
                    />
                    <div className="mt-4 flex justify-end">
                        <button className="px-10 py-3 bg-black text-white font-bold text-lg rounded-full hover:bg-gray-800 transition-transform transform hover:scale-105">
                            Gönder
                        </button>
                    </div>
                </div>
            </section>
          </div>
          
          {/* Note: The Right Gap is now implicitly handled because standard text only takes 77% of the 9-column container. 
              The remaining 23% acts as the gap, but 'Side' images can expand into it. */}

        </div>
      </main>

      {/* Fixed Share Button & Popover */}
      <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-3">
        
        {/* Social Icons Popover */}
        <div className={`flex flex-col gap-2 transition-all duration-300 origin-bottom ${isShareOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}>
          <button className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white hover:border-black transition-colors">
            <span className="sr-only">Twitter</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </button>
          <button className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors">
            <span className="sr-only">Facebook</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </button>
          <button className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors">
            <span className="sr-only">Copy Link</span>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          </button>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsShareOpen(!isShareOpen)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-colors duration-300 ${isShareOpen ? 'bg-black rotate-45' : 'bg-black hover:bg-gray-800 rotate-0'}`}
        >
           {isShareOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
           ) : (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
           )}
        </button>
      </div>

      <Footer />
    </div>
  );
};
export default ArticleDetail;