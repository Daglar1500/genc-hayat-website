import { ArticleCardElement } from "../ArticleCard";

export const CategorySection = () => {
  return (
    <section className="bg-purple-600 py-16 md:py-20 font-bradford">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-purple-500/30 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            {/* Title */}
            <div>
              <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-2">
                Projects & Creatives
              </h2>
            </div>

            {/* "More" Link */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-purple-200 font-serif italic">
                Daha fazlası için
              </span>
              <a
                href="/projects-creatives"
                className="inline-flex items-center justify-center px-3 py-1.5 bg-purple-50 hover:bg-white text-purple-900 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
              >
                Tarih
              </a>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-4 h-full">
            <ArticleCardElement
              href="/articles/james-barnett-arthouse-unlimited-60th-anniversary-merch-film-illustration-180925"
              title="TikTok's most-loved parents celebrate their 60th anniversary with an illustrated merch drop"
              author="James Barnett"
              content={{
                type: "text",
                content: "Exploring the intersection of social media fame and creative collaboration"
              }}
              publishedDate="2 days ago"
              mediaType="image"
              mediaSrc="https://admin.itsnicethat.com/images/gIR2ZEvrMf0lMwyOyuKCDfeFW-A=/270657/format-webp|width-720/Portrait_of_Michael_by_Jack_Churchyard.jpg"
              mediaAlt="TikTok's most-loved parents celebrate their 60th anniversary with an illustrated merch drop"
              mediaVariant="aspect-[4/5]"
              twoLabelShown={[
                { name: "Work", href: "/articles", type: "tag" },
                { name: "Film", href: "/film", type: "tag" }
              ]}
            />
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 h-full">
            <ArticleCardElement
              href="/articles/yutong-hu-graphic-design-discover-180925"
              title="Design always needs a contrarian: Yutong Hu opts for contradiction over consensus"
              author="Editorial Team"
              content={{
                type: "text",
                content: "A deep dive into unconventional design philosophy and creative rebellion"
              }}
              publishedDate="2 days ago"
              mediaType="video"
              mediaSrc="https://media.itsnicethat.com/documents/yutong-hu-gd-itsnicethat1_AdRnqeq.mp4"
              mediaAlt="Yutong Hu graphic design work"
              mediaVariant="aspect-video"
              twoLabelShown={[
                { name: "Work", href: "/articles", type: "tag" },
                { name: "Graphic Design", href: "/graphic-design", type: "tag" }
              ]}
            />
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 h-full">
            <ArticleCardElement
              href="/articles/burton-booz-animation-digitial-discover-180925"
              title="Burton Booz's CGI worlds are haunted manifestations of childhood"
              author="Creative Team"
              content={{
                type: "text",
                content: "Exploring digital artistry and the psychology of nostalgic imagery"
              }}
              publishedDate="2 days ago"
              mediaType="image"
              mediaSrc="/nato.jpg"
              mediaAlt="Burton Booz's CGI worlds"
              mediaVariant="aspect-[16/9]"
              twoLabelShown={[
                { name: "Work", href: "/articles", type: "tag" },
                { name: "Animation", href: "/animation", type: "tag" }
              ]}
            />
          </div>

        </div>
      </div>
    </section>
  );
};