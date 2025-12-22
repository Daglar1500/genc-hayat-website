import { Label } from "../ArticleCard";

export const FeaturedArticle = () => {
  const tags = [
    { name: "Features", href: "/features" },
    { name: "Animation", href: "/animation" },
    { name: "Digital", href: "/digital" },
    { name: "Gaming", href: "/media/game" },
    { name: "UX Design", href: "/media/ux-design" },
    { name: "Technology", href: "/tags/technology" },
    { name: "History", href: "/tags/history" },
  ];

  return (
    <section className="relative w-full h-[120vh] font-bradford">
      {/* Background Image - Covers whole viewport height + extra */}
      <div className="absolute inset-0">
        <img 
          src="https://admin.itsnicethat.com/images/YWgjxrEwLcWYux7ovniIHX-LpYQ=/269148/width-1440/SuperMarioBrosWonder_Fun_scr_01.jpg" 
          alt="Super Mario Bros Wonder" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center w-full max-w-[1600px] mx-auto px-4 md:px-0">
        
        {/* White Box */}
        {/* ml-[10%] creates the left gap (approx 2 columns worth if thinking in grids, but manually set) */}
        {/* max-w-[600px] constrains the width (the "length") of the box */}
        <div className="bg-white p-10 md:p-14 shadow-2xl ml-[5%] md:ml-30 w-full max-w-[800px]">
          
          {/* Title */}
          <h2 className="mb-8">
            <a 
              href="/features/nintendo-super-mario-bros-40-year-creative-legacy-gaming-digital-110925" 
              className="text-3xl md:text-[40px] font-bold leading-tight hover:text-red-600 transition-colors text-black"
            >
              “It’s-a-me!” Celebrating the craft-first approach of Mario, 40 years young
            </a>
          </h2>

          <div className="border-t border-gray-100 pt-8">
            {/* Description */}
            <p className="text-lg text-zinc-600 leading-relaxed font-serif mb-8">
              Over four decades, and with a plot that might, at first, ring simplistic and repetitive, Mario has endured. We dig into how Nintendo’s dedication to design and experience has kept the franchise fresh and fun for generations, and beloved by creative people everywhere.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <a key={tag.name} href={tag.href}>
                  <Label label={tag.name} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};