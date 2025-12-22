import { useState } from "react";

const Label = ({ label }: { label: string }) => (
  <div className="group inline-flex items-center justify-center px-2.5 py-[5px] bg-red-50 hover:bg-red-600 transition-colors duration-50">
    <span className="text-[11px] text-red-600 group-hover:text-white tracking-[1px] leading-4 font-labilvariable md:font-labil">
      {label}
    </span>
  </div>
); 

export { Label };

export class Labelo {
  public name: string;
  public color?: [number, number, number];
  public href: string;
  public type: "none" | "category" | "tag" | "thematic" | "featured";

  constructor(
    type: "none" | "category" | "tag" | "thematic" | "featured",
    name: string,
    color?: [number, number, number]
  ) {
    this.name = name;
    this.color = color;
    this.type = type;
    
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    this.href = `/${type}/${slug}`;
  }
}

export type table = {
  columnHeaders?: string[];
  rowHeaders?: string[];
  rows: string[][];
};

export type block = {
  content: string | string[] | table;
  type: "text" | "header-1" | "header-2" | "header-3" | "quote" | "bullet-list" | "numbered-list" | "callout" | "divider" | "table";
};

export type ArticleCard = {
  href: string;
  title: string;
  description?: string;
  author: string;
  location?: string;
  content: block | block[];
  publishedDate: string;
  mediaType?: "image" | "video";
  mediaSrc?: string;
  mediaAlt?: string;
  mediaVariant?: string;
  twoLabelShown?: Array<Labelo>;
  tags?: Array<Labelo>;
  categories?: Array<Labelo>;
};

export const ArticleCardElement = (card: ArticleCard) => {
  const [showAllLabels, setShowAllLabels] = useState(false);

  if (!card) return null;

  // FIX 1: Handle content safely. If it's not an array, wrap it in one. Don't throw error.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contentBlocks = Array.isArray(card.content) ? card.content : (card.content ? [card.content] : []);

  if (!card.href || !card.title || !card.author || !card.publishedDate) {
    console.warn('ArticleCard missing required fields', card);
    return null;
  }

  const renderTwoLabel = () => {
    if (!card.twoLabelShown && (!card.tags || card.tags.length === 0) && (!card.categories || card.categories.length === 0)) return null;

    const allLabels = [
      ...(card.tags || []),
      ...(card.categories || [])
    ];

    const labelsToShow = card.twoLabelShown || allLabels.slice(0, 2);
    const hasMoreLabels = allLabels.length > 2;
    const displayLabels = showAllLabels ? allLabels : labelsToShow.slice(0, 2);

    return (
      <div className="relative z-20 box-border caret-transparent tracking-[0.108px] md:tracking-[0.09px] mt-2.5 ">
        <ul className="box-border caret-transparent tracking-[0.108px] leading-[0px] list-none pl-0 md:tracking-[0.09px]">
          {displayLabels.map((tagOrCategory, index) => (
            <li
              key={index}
              className="box-border caret-transparent inline-block tracking-[0.108px] text-left mr-1 mb-1 md:tracking-[0.09px]"
            >
            <a href={tagOrCategory.href}>
              <Label label={tagOrCategory.name} />
            </a>
            </li>
          ))}

          {hasMoreLabels && !showAllLabels && (
            <li className="box-border caret-transparent inline-block tracking-[0.108px] text-left mr-1 mb-1 md:tracking-[0.09px]">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAllLabels(true);
                }}
                className="relative box-border caret-transparent block tracking-[0.108px] md:tracking-[0.09px] cursor-pointer"
              >
                 <Label label="..." />
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  };

  const renderMedia = () => {
    if (!card.mediaType || !card.mediaSrc) return null;

    return (
      <div className="relative box-border caret-transparent tracking-[0.108px] overflow-hidden md:tracking-[0.09px]">
        <div className={`relative box-border caret-transparent tracking-[0.108px] md:tracking-[0.09px] ${card.mediaVariant || ''}`}>
          {card.mediaType === "video" ? (
            <video
              autoPlay
              loop
              playsInline
              src={card.mediaSrc}
              className="box-border caret-transparent tracking-[0.108px] w-full md:tracking-[0.09px]"
            />
          ) : (
            <div className="absolute box-border caret-transparent tracking-[0.108px] inset-0 md:tracking-[0.09px]">
              <img
                alt={card.mediaAlt || card.title}
                src={card.mediaSrc}
                className="absolute bg-white box-border caret-transparent tracking-[0.108px] max-w-full w-full top-0 md:tracking-[0.09px] object-cover"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="box-border caret-transparent float-left tracking-[0.108px] w-full md:tracking-[0.09px] ">
      <div className="bg-white box-border caret-transparent tracking-[0.108px] mr-px mb-px pb-10 md:tracking-[0.09px]">
        <div className="box-border caret-transparent tracking-[0.108px] md:tracking-[0.09px]">
          <a
            href={card.href}
            className="text-[0px] box-border caret-transparent block tracking-[0.108px] px-5 md:tracking-[0.09px] md:px-0"
          >
            {renderMedia()}
          </a>
          
          <div className="box-border caret-transparent block tracking-[0.108px] pt-5 md:tracking-[0.09px] px-5 md:px-0">
            {/* FIX 2: Main link wraps ONLY the text content */}
            <a href={card.href} className="block group">
                <h3 className="text-lg box-border caret-transparent tracking-[1px] leading-6 font-labilvariable md:leading-[23px] hover:text-red-600 transition-colors duration-200">
                <span className="box-border caret-transparent leading-6 md:leading-[23px]">
                    {card.title}
                </span>
                </h3>
                
                <div className="text-stone-500 text-[11px] box-border caret-transparent tracking-[1px] leading-4 mt-2.5 font-labilvariable md:font-labil">
                By {card.author} • {card.publishedDate}
                </div>
            </a>

            {/* FIX 2: Labels are now SIBLINGS to the link, not children */}
            {renderTwoLabel()}
          </div>
        </div>
      </div>
    </div>
  );
};