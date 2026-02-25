import { useState } from "react";

export const Label = ({ label }: { label: string }) => (
  <div className="group inline-flex items-center justify-center px-2.5 py-[5px] bg-red-50 hover:bg-red-600 transition-colors duration-50">
    <span className="text-[11px] text-red-600 group-hover:text-white tracking-[1px] leading-4 font-labilvariable md:font-labil">
      {label}
    </span>
  </div>
);


export class Labelo {
  public name: string;
  public href: string;
  public type: "none" | "category" | "tag" | "thematic" | "featured";
  public color: number; // Renk artık number tipinde (Hex)

  constructor(
    type: "none" | "category" | "tag" | "thematic" | "featured",
    name: string,
  ) {
    this.name = name;
    this.type = type;

    // Varsayılan renk (Kırmızı - Red-600: #DC2626)
    let assignedColor = 0xDC2626;

    // Kategoriye özel Hex renk atamaları (0x ile başlar)
    if (type === "category") {
      switch (name.toLowerCase()) {
        case "tarih":
          assignedColor = 0xEAB308; // Sarı (Yellow-500)
          break;
        case "güncel":
          assignedColor = 0xA855F7; // Mor (Purple-500)
          break;
        case "kuram":
          assignedColor = 0x3B82F6; // Mavi (Blue-500)
          break;
        case "felsefe":
          assignedColor = 0x14B8A6; // Turkuaz (Teal-500)
          break;
        case "kültür-sanat":
          assignedColor = 0xEC4899; // Pembe (Pink-500)
          break;
        case "dünya":
          assignedColor = 0x6366F1; // İndigo (Indigo-500)
          break;
        case "spor":
          assignedColor = 0x22C55E; // Yeşil (Green-500)
          break;
        default:
          assignedColor = 0xDC2626; // Varsayılan
      }
    }

    this.color = assignedColor;

    const slug = name.toLowerCase().replace(/\s+/g, "-");
    if (type === "tag") {
      this.href = `/category?tag=${encodeURIComponent(name)}`;
    } else if (type === "category") {
      this.href = `/category?category=${encodeURIComponent(name)}`;
    } else {
      this.href = `/${type}/${slug}`;
    }
  }
}


export const LabeloDefault: Labelo[] = [
  new Labelo("category", "default"),
  new Labelo("category", "güncel"),
  new Labelo("category", "tarih"),
  new Labelo("category", "kuram"),
  new Labelo("category", "felsefe"),
  new Labelo("category", "kültür-sanat"),
  new Labelo("category", "dünya"),
  new Labelo("category", "spor"),

  new Labelo("thematic", "bir olay bir kavram"),
  new Labelo("thematic", "portre"),
  new Labelo("thematic", "nato"),

  new Labelo("featured", "cumhuriyet"),
  new Labelo("featured", "8 Mart"),
  new Labelo("featured", "antiemperyalizm"),
  new Labelo("featured", "anadil"),

  new Labelo("tag", "düşünce tarihi"),
  new Labelo("tag", "marksizm"),
  new Labelo("tag", "kadın mücadelesi"),
  new Labelo("tag", "postmodernizm"),
  new Labelo("tag", "bilim felsefesi"),
  new Labelo("tag", "insan doğası"),
  new Labelo("tag", "yabancılaşma"),
  new Labelo("tag", "diyalektik materyalizm"),
  new Labelo("tag", "tarihsel materyalizm"),
  new Labelo("tag", "materyalizm"),
  new Labelo("tag", "idealizm"),
  new Labelo("tag", "pozitivizm"),
  new Labelo("tag", "yapısalcılık"),
  new Labelo("tag", "emperyalizm"),
  new Labelo("tag", "kapitalizm"),
  new Labelo("tag", "sosyalizm"),
  new Labelo("tag", "komünizm"),
  new Labelo("tag", "faşizm"),
  new Labelo("tag", "neoliberalizm"),
  new Labelo("tag", "antifaşizm"),
  new Labelo("tag", "ulusal kurtuluş mücadeleleri"),
  new Labelo("tag", "kürt hareketi"),
  new Labelo("tag", "anadil"),
  new Labelo("tag", "sınıf mücadelesi"),
  new Labelo("tag", "siyasi tarih"),
  new Labelo("tag", "türkiye tarihi"),
  new Labelo("tag", "osmanlı dönemi"),
  new Labelo("tag", "cumhuriyet dönemi"),
  new Labelo("tag", "işçi hareketi tarihi"),
  new Labelo("tag", "gençlik hareketi tarihi"),
  new Labelo("tag", "68 hareketi"),
  new Labelo("tag", "devrimler tarihi"),
  new Labelo("tag", "demokrasi"),
  new Labelo("tag", "emek mücadelesi"),
  new Labelo("tag", "hukuk"),
  new Labelo("tag", "seçimler"),
  new Labelo("tag", "gençlik politikaları"),
  new Labelo("tag", "dünya siyaseti"),
  new Labelo("tag", "ortadoğu"),
  new Labelo("tag", "sosyoloji"),
  new Labelo("tag", "lgbti mücadelesi"),
  new Labelo("tag", "psikoloji"),
  new Labelo("tag", "kent hakkı"),
  new Labelo("tag", "göç"),
  new Labelo("tag", "yoksulluk"),
  new Labelo("tag", "birey ve toplum"),
  new Labelo("tag", "üniversite"),
  new Labelo("tag", "kampüs hayatı"),
  new Labelo("tag", "barınma sorunu"),
  new Labelo("tag", "burs ve krediler"),
  new Labelo("tag", "öğrenci hareketi"),
  new Labelo("tag", "eğitim sistemi"),
  new Labelo("tag", "yurtlar"),
  new Labelo("tag", "kulüp ve topluluklar"),
  new Labelo("tag", "bilimsel araştırma"),
  new Labelo("tag", "yüksek lisans hayatı"),
  new Labelo("tag", "sınav sistemi"),
  new Labelo("tag", "MESEM"),
  new Labelo("tag", "meslek liseleri"),
  new Labelo("tag", "çıraklık"),
  new Labelo("tag", "staj deneyimleri"),
  new Labelo("tag", "genç işçi"),
  new Labelo("tag", "iş güvencesi"),
  new Labelo("tag", "çalışma koşulları"),
  new Labelo("tag", "asgari ücret"),
  new Labelo("tag", "işçi gençlik"),
  new Labelo("tag", "iş kazaları"),
  new Labelo("tag", "mesleki eğitim"),
  new Labelo("tag", "ekoloji mücadelesi"),
  new Labelo("tag", "iklim krizi"),
  new Labelo("tag", "doğa talanı"),
  new Labelo("tag", "ekolojik yaşam"),
  new Labelo("tag", "yenilenebilir enerji"),
  new Labelo("tag", "atık yönetimi"),
  new Labelo("tag", "şehirleşme"),
  new Labelo("tag", "tarım"),
  new Labelo("tag", "köyden kente göç"),
  new Labelo("tag", "doğal afetler"),
  new Labelo("tag", "su kıtlığı"),
  new Labelo("tag", "orman yangınları"),
  new Labelo("tag", "sürdürülebilirlik"),
  new Labelo("tag", "kentsel dönüşüm"),
  new Labelo("tag", "sokak kültürü"),
  new Labelo("tag", "yerel yönetimler"),
  new Labelo("tag", "kent yaşamı"),
  new Labelo("tag", "ulaşım"),
  new Labelo("tag", "mahalle dayanışması"),
  new Labelo("tag", "gençlik merkezleri"),
  new Labelo("tag", "şehir ve sanat"),
  new Labelo("tag", "çeteleşme"),
  new Labelo("tag", "sinema"),
  new Labelo("tag", "dizi"),
  new Labelo("tag", "müzik"),
  new Labelo("tag", "edebiyat"),
  new Labelo("tag", "tiyatro"),
  new Labelo("tag", "resim"),
  new Labelo("tag", "heykel"),
  new Labelo("tag", "mimari"),
  new Labelo("tag", "fotoğraf"),
  new Labelo("tag", "sergi"),
  new Labelo("tag", "grafik tasarım"),
  new Labelo("tag", "kültürel üretim"),
  new Labelo("tag", "sanat eleştirisi"),
  new Labelo("tag", "genç sanatçılar"),
  new Labelo("tag", "dergiler"),
  new Labelo("tag", "bağımsız yayıncılık"),
  new Labelo("tag", "dijital kültür"),
  new Labelo("tag", "youtube kültürü"),
  new Labelo("tag", "podcast"),
  new Labelo("tag", "alternatif medya"),
  new Labelo("tag", "pop kültür"),
  new Labelo("tag", "mizah"),
  new Labelo("tag", "sokak sanatı"),
  new Labelo("tag", "sansür"),
  new Labelo("tag", "dijitalleşme"),
  new Labelo("tag", "yapay zekâ"),
  new Labelo("tag", "teknoloji"),
  new Labelo("tag", "mühendislik"),
  new Labelo("tag", "bilim"),
  new Labelo("tag", "temel bilimler"),
  new Labelo("tag", "sosyal bilimler")
];


export type media = {
  href?: string;
  type: "image" | "gif" | "video";
  src: string;
  alt?: string;
  mediaLayout?: "full-width" | "text-width";
};


export type text = {
  type: "text" | "subheading";
  textContent: string;
};

export type block = {
  blockContent: text | media;
  media?: media;
  blockLayout?: "right-side" | "left-side";
};

export type ArticleCard = {
  href: string;
  title: string;
  description?: string;
  author: string;
  place?: string;
  location?: string;
  issueNumber: number;
  publishedDate: Date;
  firstMedia?: media;
  twoLabelShown?: Labelo[];
  tags?: Array<Labelo>;
  category: Labelo;
  content: block | block[];
};

export const ArticleCardElement = (card: ArticleCard) => {
  const [showAllLabels, setShowAllLabels] = useState(false);

  if (!card) return null;

  // Validation
  if (!card.href || !card.title || !card.author || !card.publishedDate || !card.category) {
    console.warn('ArticleCard missing required fields', card);
    return null;
  }

  const renderTwoLabel = () => {
    const allLabels = [
      card.category,
      ...(card.tags || [])
    ];

    if (!card.twoLabelShown && allLabels.length === 0) return null;

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
              <a
                href={tagOrCategory.href}
                data-tag={tagOrCategory.name} // <--- BU SATIR EKLENDİ
                className="cursor-pointer"
              >
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
    if (!card.firstMedia || !card.firstMedia.src) return null;

    const { type, src, alt } = card.firstMedia;

    return (
      <div className="relative box-border caret-transparent tracking-[0.108px] overflow-hidden md:tracking-[0.09px]">
        <div className="relative box-border caret-transparent tracking-[0.108px] md:tracking-[0.09px] w-full aspect-[4/3]">
          {type === "video" ? (
            <video
              autoPlay
              loop
              playsInline
              src={src}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              alt={alt || card.title}
              src={src}
              className="absolute inset-0 w-full h-full object-cover bg-gray-100"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="box-border caret-transparent float-left tracking-[0.108px] w-full md:tracking-[0.09px] ">
      <div className="bg-white box-border caret-transparent tracking-[0.108px] mr-px mb-px pb-4 md:tracking-[0.09px]">
        <div className="box-border caret-transparent tracking-[0.108px] md:tracking-[0.09px]">
          <a
            href={card.href}
            className="text-[0px] box-border caret-transparent block tracking-[0.108px] px-5 md:tracking-[0.09px] md:px-0"
          >
            {renderMedia()}
          </a>

          <div className="box-border caret-transparent block tracking-[0.108px] pt-3 md:tracking-[0.09px] px-5 md:px-0">
            <a href={card.href} className="block group">
              {/* TITLE */}
              <h3 className="text-lg box-border caret-transparent tracking-[1px] leading-6 font-labilvariable md:leading-[23px] hover:text-red-600 transition-colors duration-200">
                <span className="box-border caret-transparent leading-6 md:leading-[23px]">
                  {card.title}
                </span>
              </h3>

              {/* METADATA SECTION */}
              <div className="text-stone-500  box-border caret-transparent tracking-[1px] leading-4 mt-2.5 font-labilvariable md:font-labil flex flex-col gap-0.5">

                {/* Author */}
                <span className="text-black font-medium text-[14px]">
                  {card.author}
                </span>

                {/* Location (Combines Place + Location) */}
                {(card.place || card.location) && (
                  <span className="text-stone-600 italic text-[12px]">
                    {card.place || card.location}
                  </span>
                )}

                {/* Date • Issue Number */}
                <span className="text-stone-600 text-[12px]">
                  {card.publishedDate?.toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {' • '}
                  Sayı {card.issueNumber}
                </span>
              </div>
            </a>

            {/* Labels */}
            {renderTwoLabel()}
          </div>
        </div>
      </div>
    </div>
  );
};