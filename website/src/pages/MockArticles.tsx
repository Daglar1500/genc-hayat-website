import { ArticleCard, Labelo, block, text, media, LabeloDefault } from "./MainPage/ArticleCard";


// Helper to safely find label
const getLabel = (name: string, type: "category" | "tag" = "category") => {
  const found = LabeloDefault.find(x => x.name === name && x.type === type);
  // Fallback to avoid runtime crash if typo exists, returns a dummy label if not found
  return found || LabeloDefault[0]; 
};
export const MOCK_ARTICLES: ArticleCard[] = [
  
  {
    href: "/articles/pluribus-soguk-savas",
    title: "Pluribus: Soğuk Savaş’tan dijital çağa kolektivizm kâbusları",
    description: "Dizinin asıl açtığı soru, şu: “İnsanlığın gerçekten kurtulması için, hepimizin aynı zihinle düşünmesi mi gerekiyor, yoksa birbirimizi özgür ve eşit öznelere dönüştürecek yeni kolektif akıllar mı kurmamız?”",
    author: "Fırat Aslan",
    place: "Psikoloji Bölümü, Boğaziçi Üniversitesi",
    location: "İstanbul, Türkiye",
    issueNumber: 504,
    publishedDate: new Date("2025-11-20"),
    firstMedia: {
      href: "/articles/pluribus-soguk-savas",
      type: "image",
      src: "https://i0.wp.com/therollingtape.com/wp-content/uploads/2025/11/Pluribus_Photo_010205-H-2025.jpeg"
    },
    tags: [ 
      LabeloDefault.find(x => x.name === "kültür-sanat")!, 
      LabeloDefault.find(x => x.name === "sinema")!, 
      LabeloDefault.find(x => x.name === "dizi")!,
      LabeloDefault.find(x => x.name === "psikoloji")!
    ],
    category: LabeloDefault.find(x => x.name === "kultur-sanat")!,
    content: [
      {
        blockContent: {
          type: "text",
          textContent: "Vince Gilligan’ın Apple TV’de yayınlanan yeni dizisi Pluribus, ilk bakışta “uzaylı virüsü sonrası hayatta kalan kahraman” kalıbına oturan klasik bir bilimkurgu gibi görünüyor. Ancak birkaç bölüm sonra anlıyoruz ki asıl hikâye, dünyayı yok eden bir felaketten çok, dünyayı fazla mutlu eden bir düzen hakkında. Dizi, “Joining” adı verilen olayla açılıyor: Kozmik bir sinyalle tetiklenen bir virüs, insanlığın neredeyse tamamını “Others” denen tek bir bilince bağlı, son derece mutlu, uyumlu ve barışçıl bir kolektif zihne dönüştürüyor. Herkes birbirinin anılarını, acılarını, zevklerini paylaşıyor; çatışma yok, savaş yok, yalan yok. Ama bu tablonun dışında kalan 13 kişi var. Onlardan biri de ana karakterimiz Carol Sturka."
        }
      },
      {
        blockContent: {
          type: "text",
          textContent: "Carol, sevgilisi Helen’i ve eski dünyayı kaybettikten sonra, mutluluk kıyametinin ortasında inatla kendi bireysel varlığını savunan, huysuz, öfkeli ve yalnız bir yazar olarak karşımıza çıkıyor. Gilligan’ın bir röportajda söylediği gibi, Pluribus aslında “baş döndürücü bir mutluluk kıyameti”ni anlatıyor: Felaket, dünyanın yanıp kül olması değil; herkesin aynı anda, aynı biçimde iyi hissetmesi. Dizi ilerledikçe bu mutlu kolektivizmin bedelini de görüyoruz. Others kimseyi öldüremediği için, bedenlerini beslemek üzere ölü insanlardan üretilen “HDP” (Human Derived Protein) içiyorlar; yani kelimenin tam anlamıyla insan türevi bir süt sistemi kurulmuş durumda. Bir yanda barış, uyum ve neşeyle dolu bir gezegen; diğer yanda fabrika gibi çalışan, beden parçalarıyla dolu depolar."
        }
      },
      {
        blockContent: {
          type: "image",
          src: "https://i0.wp.com/therollingtape.com/wp-content/uploads/2025/11/Pluribus-We-Is-Us-scaled.jpg?resize=1536%2C864&ssl=1",
          alt: "Pluribus dizisinden bir sahne",
          mediaLayout: "full-width"
        }
        
      },
      {
        blockContent: {
          type: "subheading",
          textContent: "Pluribus’un “hive mind”ı ve tarihsel arka planı"
        }
      },
      {
        blockContent: {
          type: "text",
          textContent: "Tam da bu temel çelişki, Pluribus’u Soğuk Savaş döneminin ünlü Amerikan bilim kurgularındaki “hive mind” teması üzerinden okumayı mümkün kılıyor. Dizi, bu mirası olduğu gibi tekrar eden düz bir nostalji değil hem bu geleneği yeniden üreten hem de ters yüz etmeye çalışan, yer yer içinde çelişkiler barındıran bir yapım. Soğuk Savaş’ın ortasında çekilen 1950’ler Hollywood bilimkurgu filmlerini hatırlayalım: Invasion of the Body Snatchers (1956), The Thing from Another World (1951) ve benzerleri… Bu filmler hem nükleer savaş korkusunu hem de “içimize sızan görünmez düşman” paranoyasını perdeye taşıyordu. Özellikle Invasion of the Body Snatchers, kasabadaki insanların birer birer “aynı görünen ama duygusuz, tek tip” kopyalarla değiştirildiği hikâyesiyle, bir yandan kolektivist sızma korkusunu anlatan açık bir alegori, diğer yandan McCarthycilik ve Amerikan konformizmine yönelik bir eleştiri olarak okunuyor. Hangi okumayı tercih edersek edelim, ortak nokta değişmiyor: Hive mind, yani tek bilince bağlanmış kitle, tehlikeli kolektivizmi temsil ediyor."
        }
      },
      {
        blockContent: {
          type: "text",
          textContent: "1950’ler bilim kurguları sadece eğlencelik bir tür değildi; özellikle genç kuşaklara kolektivizm ve atom çağının tehdidi karşısında bir ahlaki çerçeve sunmaya çalışan ideolojik ürünlerdi. Kitle, düşünmeyen, tek tip bir sürü olarak çizilirken; kahraman çoğu zaman yalnız, aykırı, “Amerikan” erkek figürüydü. Soğuk Savaş propagandasının temel mesajı netti: Her tür kolektivizm, potansiyel olarak bir ruhsuz sürüdür. Bugün bile bazı eleştirmenler, bu dönemin bilim kurgusunda hive mind’ın ne kadar sık ideolojik propaganda aracı olarak kullanıldığını, Batı’nın gözünde aşırı bireyciliğin kolektif olan her şeyi şeytanlaştıran ideolojik bir refleksle birleştiğini hatırlatıyor. Bu tarihsel arka plan, Pluribus’ta karşımıza çıkan güncel “hive mind”ı anlamamız için kritik."
        }
      },
      {
        blockContent: {
          type: "text",
          textContent: "Pluribus, 50’ler bilim kurgusunun kalıbını belirgin biçimde kullanıyor: Dünya tek bir ortak bilince bağlanmış, farklı düşünenler ise istatistiksel olarak önemsiz küçük bir azınlık. Ama burada iki önemli fark var. Birincisi, Others denen hive mind, korkunç bir totaliter zihin kontrolü gibi değil; aşırı nazik, aşırı uyumlu, aşırı olumlu bir yapı olarak resmediliyor. Herkesin acısı paylaşılıyor, kimse yalnız değil, savaşlar bitmiş, kimse kimseye zarar veremiyor. Yumuşak, şiddetsiz ama sarsıcı derecede kapsayıcı bir sistem. İkincisi, Gilligan bu kolektifi bütünüyle şeytanlaştırmıyor; Others’ın içinde etik çelişkiler, teknik sınırlar, hatta naiflikler var. Örneğin canlı hiçbir şeyi öldüremedikleri için, gıda krizini çözmek adına ölü insanlardan elde edilen HDP’yi kullanmaları, bir yandan ölülere saygısızlık ve tiksinti duygusu yaratırken, öte yandan canlı hiçbir varlığı öldürmemek gibi radikal bir etik yasağa bağlılıklarını gösteriyor. Yani Pluribus’ta hive mind ne tam ütopya ne de tam distopya. Asıl rahatsız edici olan, bireysel farklılıkların, çatışmanın, politik mücadelenin ortadan kalkmış olması. Carol’ın öfkesi de tam buradan besleniyor: “Bedeli bu kadar görünmez olan bir mutluluğa rıza göstermek zorunda mıyım?” diye soruyor adeta. Dizi tam bu noktada, 50’lerin totaliter kitle kâbusunu güncelliyor: Dışarıdan gelen totaliter tehdidin yerini, içeriden doğan, iyi niyetli, barışçıl ama total kapsayıcı bir kolektif alıyor. Ancak dizinin yaklaşımı hala bir Amerikan bireyselciliği gözünden bu da bizi dizinin ideolojik kör noktalarına götürüyor."
        },
        media: {
          href: "/articles/pluribus-soguk-savas",
          type: "image",
          src: "https://thumbor.evrimagaci.org/HJM_hB9eGnQnX0PjM0jEyeyUkS8=/filters:format(webp)/mi%2F6eedeb2a-881c-4a01-aaf9-ab00dd072234.jpeg",
          alt: "Pluribus dizisinden bir sahne"
        },
        blockLayout: "right-side"
      },
      {
        blockContent: {
          type: "subheading",
          textContent: "Ya total hive mind ya da yalnız kahraman"
        }
      },
      {
        blockContent: {
          type: "text",
          textContent: "Gilligan, Breaking Bad ve Better Call Saul’da da bireysel ahlaki tercihleri merkeze almayı seven bir yaratıcının tam kendisi. Pluribus’ta da evren, büyük ölçüde Carol’ın gözüyle kuruluyor; Others’ın içindeki olası alternatifler, muhalefetler, kolektif tartışmalar neredeyse hiç görünmüyor. Bu çerçevede Carol, bir anlamda radikal Amerikan bireyciliğinin karikatürü gibi; her tür kolektivizmi benliğine saldırı olarak algılıyor, Others’ı dinlemeyi bile zor sürdürüyor. Bazı yorumcular, dizinin merkezindeki asıl sorunun “İnsanın özgürlüğü, başkalarının acılarıyla ve ortak iyiyle nasıl dengelenir?” sorusu olduğunu söylüyor; Pluribus da izleyicisini tam bu ikilemde sıkıştırmak istiyor."
        }
      },
      {
        blockContent: {
          type: "text",
          textContent: "Burada bizim açımızdan kritik soru şu: Others gerçekten eski tip kolektivizm eleştirilerinin mi, yoksa geç kapitalizmin dijital bir formunun mu alegorisi? Others, herhangi bir sınıf siyaseti üretmiyor; üretim ilişkileri, mülkiyet biçimleri, emek süreci üzerine neredeyse hiçbir şey bilmiyoruz. Karar alma süreçleri tamamen opak; demokratik, tabandan örgütlenen bir kolektivite değil, tek bir büyük zihnin teknik optimizasyonu söz konusu. HDP sistemi küresel bir lojistik ağla, görünmez bir tedarik zinciri üzerinden işliyor; bu görünmezlik tam da kapitalist gıda, enerji ve veri zincirlerini hatırlatıyor. Dolayısıyla Others’ın dünyası geleneksel kolektivizm modellerinden çok; algoritmik olarak yönetilen, sürtünmesiz, rızaya dayalı bir “platform” kapitalizmini andırıyor: Amazon ve Google’ın, Meta ve Apple’ın size en uygun, en güvenli, en konforlu hayatı tasarladığı bir dünya. Dizi bu açıdan, eski ideolojik kalıplardan ziyade Silikon Vadisi’nin “iyilik için teknoloji” söylemini hedef alıyor; yaratıcı ekibin röportajlarında yapay zekâya ve teknoloji devlerine mesafeli, eleştirel bir yerden bakması da bunu destekliyor."
        }
      },
      {
        blockContent: {
          type: "text",
          textContent: "Ne var ki Pluribus, bu eleştiriyi çok net bir sınıf-politik dile çeviremiyor; hikâye hep Carol’ın bireysel vicdanı, travması ve öfkesi etrafında dönüyor. Kolektif bir direniş, örgütlü bir alternatif, yeni bir ortaklaşma biçimi ufku pek görünmüyor. İşte dizinin en Amerikan yanı burada: Ya total hive mind ya da yalnız kahraman. Aradaki olası demokratik, katılımcı kolektif seçenekler kadraja girmiyor. Bu yüzden dizi, bir yandan kolektivizme dair çok güçlü sezgiler yakalarken, diğer yandan kolektif özgürleşme ihtimalini hayal etme cesaretini gösteremiyor."
        },
        media: {
          href: "/articles/pluribus-soguk-savas-2",
          type: "image",
          src: "https://nobetcigazetecom.teimg.com/crop/1280x720/nobetcigazete-com/uploads/2025/11/pluribus-dizisi-konusu-oyuncu-kadrosu-ve-yayin-tarihi-yeni-dizi-1.jpg",
          alt: "Pluribus dizisinden bir sahne"
        },
        blockLayout: "left-side"
      },
      { 
        blockContent: {
          type: 'subheading', 
          textContent: "“Others” hangi kavramlarla somutlaşıyor?" }
      },

      { blockContent: {
          type: 'text', 
          textContent: "Bugün dünyaya bakan eleştirel bir göz için “hive mind” denince akla artık sadece Soğuk Savaş’ın ideolojik kalıpları gelmiyor; internet, sosyal medya ve yapay zekâ da geliyor. Pluribus’taki Others internetin, algoritmaların ve platformların kolektif bilinci olarak okunabilir. Dizinin üçüncü bölümünde Zosia’nın, Carol’ı memnun etmek için onun tüm anılarını, zevklerini, travmalarını kullanarak mükemmel jestler yapmaya çalıştığını görüyoruz: Sevdiği yemeği getiriyor, eski bir alışverişi telafi ediyor, geçmişten duygusal detaylar hatırlıyor. Ama tüm bu jestler, duygusal bir derinlikten çok, veri işleme kapasitesine dayanıyor; Zosia’nın ve Others’ın sınırı, ironi, özgünlük ve gerçek duyguyu üretememek. Bu sahneler kapitalizmin veri üzerinden işleyen yeni yönetim biçimlerini akla getiriyor. Seni sürekli mutlu, konforlu, memnun etmeye çalışan, içerik ve ilişkilerini sana en uygun olanla filtreleyen, ama aynı anda seni sürekli izleyen, verini emen, seni tahmin edilebilir bir profile indirgeyen dijital bir hive mind. Buna bir de çalışma hayatını ekleyelim: algoritmik vardiya planlaması, performans takibi, optimum verimlilik adına işçilerin adım adım izlenmesi. Bütün bunlar, görünüşte daha iyi hizmet ve daha çok konfor için; tıpkı Others’ın “biz sadece kimseye zarar vermek istemiyoruz” iddiası gibi." 
        },
      },

      { blockContent: {
          type: 'text', 
          textContent: "İlginç olan, Others’ın bile rızaya ihtiyaç duyması. Bu da günümüz kapitalizminin özgür irade fetişini hatırlatıyor: Hepimiz sözde özgürce “kabul ediyoruz”, “kullanım koşullarını okuduk”, “çerezleri kabul ettik”, “sözleşmeyi imzaladık”. Baskı çıplak zorla değil, sürekli üretilen rıza üzerinden işliyor. Bu açıdan Pluribus, belki niyet ettiği kadar sistematik olmasa da eleştirel bir okuma için verimli bir zemin sunuyor. Hive mind’ı, planlı ekonomiden çok; veri temelli, algoritmikleştirilmiş, küresel bir yönetim biçimi olarak düşünebiliriz. Dizi, herkesin mutlu olduğu bir dünyanın bile bedenler ve emek üzerinden nasıl sürdürüldüğünü göstererek, görünmeyen emek ve sömürüye işaret ediyor. Aynı anda, bireysel özgürlük söyleminin, kolektif potansiyelleri nasıl bastırdığını da sergiliyor: Carol ne kadar haklı olsa da çözüm ufkunu kendi yalnız öfkesinin ötesine taşıyamıyor." 
        },
      },

      { blockContent: {
          href: "/articles/pluribus-soguk-savas",
          type: 'image',
          mediaLayout: 'text-width',
          alt: "Pluribus dizisinden bir sahne",
          src: "https://www.hollywoodreporter.com/wp-content/uploads/2025/11/Pluribus_Photo_010303-H-2025.jpg?w=1296&h=730&crop=1",
        },
      },
      
      { blockContent: {
          type: 'text', 
          textContent: "İlginç olan, Others’ın bile rızaya ihtiyaç duyması. Bu da günümüz kapitalizminin özgür irade fetişini hatırlatıyor: Hepimiz sözde özgürce “kabul ediyoruz”, “kullanım koşullarını okuduk”, “çerezleri kabul ettik”, “sözleşmeyi imzaladık”. Baskı çıplak zorla değil, sürekli üretilen rıza üzerinden işliyor. Bu açıdan Pluribus, belki niyet ettiği kadar sistematik olmasa da eleştirel bir okuma için verimli bir zemin sunuyor. Hive mind’ı, planlı ekonomiden çok; veri temelli, algoritmikleştirilmiş, küresel bir yönetim biçimi olarak düşünebiliriz. Dizi, herkesin mutlu olduğu bir dünyanın bile bedenler ve emek üzerinden nasıl sürdürüldüğünü göstererek, görünmeyen emek ve sömürüye işaret ediyor. Aynı anda, bireysel özgürlük söyleminin, kolektif potansiyelleri nasıl bastırdığını da sergiliyor: Carol ne kadar haklı olsa da çözüm ufkunu kendi yalnız öfkesinin ötesine taşıyamıyor." 
        },
      },

      { blockContent: {
          type: 'subheading', 
          textContent: "Sorun kolektiflik mi, yoksa onun içeriği mi?" 
        },
      },

      { blockContent: {
          type: 'text', 
          textContent: "Sonuç olarak Pluribus, günümüz geç-kapitalist dünyasının çelişkilerini taşıyan, gerilimli bir metin. Bir yandan teselli edici kolektivizm fikrinden ürküyor; diğer yandan herkesin kendi başına, kendi küçük adaletini aradığı neoliberal bireyciliğin de tükenmiş bir proje olduğunun farkında. Pluribus’u izlerken şu soruları akılda tutmak bence verimli olabilir: Sorun kolektiflik mi, yoksa kolektifliğin demokratik ve kapsayıcı içeriğinin olmaması mı? Others, tabandan örgütlenen, kendini tartışabilen, eşitsizlikleri çözen bir kolektivite değil; kusursuz bir teknik optimum. Dizi bize hangi kolektif alternatifleri göstermekten kaçınıyor? Ya total hive mind ya yalnız kahraman. Peki kolektif, yatay, demokratik örgütlenme biçimleri nerede? Yapay zekâ ve platform kapitalizmi, “hive mind” fikrini bugün nasıl somutluyor? Bizi mutlu etmeye çalıştığını söyleyen sistemler, aslında kimi besliyor, kimi aç bırakıyor, kimin bedenini, emeğini ve verisini tüketiyor?" 
        },
      },

      { blockContent: {
          type: 'text', 
          textContent: "Pluribus’u böyle bir çerçevede izlemek, hem 50’ler Hollywood’un ideolojik bilim kurgularıyla hesaplaşmayı, hem de bugün yapay zekâ, veri sömürüsü, platform kapitalizmi ve rıza rejimleriyle boğuşan dünyamıza eleştirel bir gözle bakmayı mümkün kılıyor. Belki de dizinin asıl açtığı soru, şu: “İnsanlığın gerçekten kurtulması için, hepimizin aynı zihinle düşünmesi mi gerekiyor, yoksa birbirimizi özgür ve eşit öznelere dönüştürecek yeni kolektif akıllar mı kurmamız?” Bu soruyu sonuna kadar zorlayan eleştirel bir izleme, Pluribus’un mutluluk kıyametini, bugünün dünyası için ciddi bir uyarıya dönüştürebilir." 
        }
      }
    ]
    
  },



  
  // --- KÜLTÜR-SANAT (7 Adet) ---
  {
    href: "/articles/pluribus-soguk-savas",
    title: "Pluribus: Soğuk Savaş’tan dijital çağa kolektivizm kâbusları",
    description: "Dizinin asıl açtığı soru, şu: “İnsanlığın gerçekten kurtulması için, hepimizin aynı zihinle düşünmesi mi gerekiyor?”",
    author: "Fırat Aslan",
    place: "Psikoloji Bölümü",
    location: "Boğaziçi Üniversitesi",
    issueNumber: 504,
    publishedDate: new Date("2025-11-20"),
    firstMedia: {
      href: "/articles/pluribus-soguk-savas",
      type: "image",
      src: "https://i0.wp.com/therollingtape.com/wp-content/uploads/2025/11/Pluribus_Photo_010205-H-2025.jpeg"
    },
    category: getLabel("kültür-sanat", "category"),
    tags: [getLabel("sinema", "tag"), getLabel("dizi", "tag"), getLabel("psikoloji", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Vince Gilligan’ın Apple TV’de yayınlanan yeni dizisi Pluribus..." } }]
  },
  {
    href: "/articles/oguz-atay-yeniden",
    title: "Oğuz Atay’ı Yeniden Okumak: Tutunamayanlar’ın Güncelliği",
    description: "Bugünün prekaryası, Atay’ın 'tutunamayanlar'ını kendi aynasında görüyor.",
    author: "Selin Kaya",
    place: "Karşılaştırmalı Edebiyat",
    location: "İstanbul Bilgi Üniversitesi",
    issueNumber: 497,
    publishedDate: new Date("2025-10-28"),
    firstMedia: {
      href: "/articles/oguz-atay-yeniden",
      type: "image",
      src: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1600"
    },
    category: getLabel("kültür-sanat"),
    tags: [getLabel("edebiyat", "tag"), getLabel("yabancılaşma", "tag"), getLabel("birey ve toplum", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Selim Işık'ın bunalımı, 70'lerin aydın bunalımıydı..." } }]
  },
  {
    href: "/articles/sinema-ve-tasra",
    title: "Taşra Sıkıntısından Evrensel Bunalıma: Nuri Bilge Sineması",
    description: "Ahlat Ağacı'ndan Kuru Otlar Üstüne'ye taşranın değişmeyen makus talihi.",
    author: "Berk Güneş",
    place: "Radyo TV Sinema",
    location: "Marmara Üniversitesi",
    issueNumber: 488,
    publishedDate: new Date("2025-09-15"),
    firstMedia: {
      href: "/articles/sinema-ve-tasra",
      type: "image",
      src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600"
    },
    category: getLabel("kültür-sanat"),
    tags: [getLabel("sinema", "tag"), getLabel("sosyoloji", "tag"), getLabel("birey ve toplum", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Nuri Bilge Ceylan sineması, taşranın sadece coğrafi değil..." } }]
  },
  {
    href: "/articles/bagimsiz-muzik",
    title: "Kadıköy Sound'dan Dijital Platformlara Alternatif Müzik",
    description: "Bağımsız müzisyenler algoritmaların arasında kaybolmadan nasıl hayatta kalıyor?",
    author: "Ece Yılmaz",
    place: "Kültür Yönetimi",
    location: "İstanbul Bilgi Üniversitesi",
    issueNumber: 492,
    publishedDate: new Date("2025-10-05"),
    firstMedia: {
      href: "/articles/bagimsiz-muzik",
      type: "image",
      src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600"
    },
    category: getLabel("kültür-sanat"),
    tags: [getLabel("müzik", "tag"), getLabel("dijital kültür", "tag"), getLabel("genç sanatçılar", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Spotify listelerine girmek mi, yoksa sahnede kalmak mı?..." } }]
  },
  {
    href: "/articles/sokak-sanati",
    title: "Duvarlar Konuşuyor: Politik Bir Eylem Olarak Graffiti",
    description: "Karaköy sokaklarından Berlin duvarına, sprey boyanın isyanı.",
    author: "Caner Erkin",
    place: "Güzel Sanatlar Fakültesi",
    location: "Mimar Sinan GSÜ",
    issueNumber: 485,
    publishedDate: new Date("2025-08-30"),
    firstMedia: {
      href: "/articles/sokak-sanati",
      type: "image",
      src: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=1600"
    },
    category: getLabel("kültür-sanat"),
    tags: [getLabel("sokak sanatı", "tag"), getLabel("kent yaşamı", "tag"), getLabel("sanat eleştirisi", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Banksy popüler kültürün bir parçası mı oldu?..." } }]
  },
  {
    href: "/articles/tiyatro-direniyor",
    title: "Alternatif Sahneler ve Ödeneksiz Tiyatro Gerçeği",
    description: "Kadıköy ve Beyoğlu'nun küçük sahnelerinde büyük hikayeler anlatılıyor.",
    author: "Nazlı Çelik",
    place: "Tiyatro Eleştirmenliği",
    location: "İstanbul Üniversitesi",
    issueNumber: 501,
    publishedDate: new Date("2025-11-02"),
    firstMedia: {
      href: "/articles/tiyatro-direniyor",
      type: "image",
      src: "https://images.unsplash.com/photo-1507676184212-d0370baf236d?q=80&w=1600"
    },
    category: getLabel("kültür-sanat"),
    tags: [getLabel("tiyatro", "tag"), getLabel("kültürel üretim", "tag"), getLabel("emek mücadelesi", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Pandemi sonrası tiyatroların ayakta kalma savaşı..." } }]
  },
  {
    href: "/articles/cagdas-sanat",
    title: "Bienal Eleştirisi: Sanat Kimin İçin?",
    description: "Beyaz küp galerilerin dışına taşan sanat, halkla buluşabiliyor mu?",
    author: "Selin Artuk",
    place: "Sanat Tarihi",
    location: "Hacettepe Üniversitesi",
    issueNumber: 490,
    publishedDate: new Date("2025-09-20"),
    firstMedia: {
      href: "/articles/cagdas-sanat",
      type: "image",
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?q=80&w=1600"
    },
    category: getLabel("kültür-sanat"),
    tags: [getLabel("sergi", "tag"), getLabel("sanat eleştirisi", "tag"), getLabel("kapitalizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Sponsorların gölgesinde sanat üretimi..." } }]
  },


  // --- GÜNCEL (8 Adet) ---
  {
    href: "/articles/beton-ve-bellek",
    title: "Beton ve Bellek: İstanbul’un Kaybolan Meydanları",
    description: "Meydanlar sadece boşluklar değil, demokratik karşılaşma alanlarıdır.",
    author: "Zeynep Yılmaz",
    place: "Şehir ve Bölge Planlama",
    location: "İTÜ",
    issueNumber: 495,
    publishedDate: new Date("2025-11-18"),
    firstMedia: {
      href: "/articles/beton-ve-bellek",
      type: "image",
      src: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000"
    },
    category: getLabel("güncel"),
    tags: [getLabel("kent hakkı", "tag"), getLabel("kentsel dönüşüm", "tag"), getLabel("yerel yönetimler", "tag")],
    content: [{ blockContent: { type: "text", textContent: "İstanbul’un meydanları, son yirmi yılda..." } }]
  },
  {
    href: "/articles/iklim-krizi-greenwashing",
    title: "Yeşil Aklama (Greenwashing) Yalanları",
    description: "Şirketlerin 'sürdürülebilirlik' raporları, gezegeni kurtarmak için mi?",
    author: "Ece Vural",
    place: "Ekoloji Topluluğu",
    location: "Muğla",
    issueNumber: 500,
    publishedDate: new Date("2025-10-20"),
    firstMedia: {
      href: "/articles/iklim-krizi-greenwashing",
      type: "image",
      src: "https://images.unsplash.com/photo-1611273426761-53c8577a20fa?q=80&w=1600"
    },
    category: getLabel("güncel"),
    tags: [getLabel("iklim krizi", "tag"), getLabel("doğa talanı", "tag"), getLabel("kapitalizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Karbon ayak izini bireylere yükleyen söylem..." } }]
  },
  {
    href: "/articles/barinma-krizi",
    title: "Öğrenci Evinden Çıkamamak: Barınma Krizi",
    description: "Büyükşehirlerde kiralar uçarken, öğrenciler kampüslere sığamıyor.",
    author: "Mehmet Demir",
    place: "Sosyoloji",
    location: "ODTÜ",
    issueNumber: 502,
    publishedDate: new Date("2025-11-10"),
    firstMedia: {
      href: "/articles/barinma-krizi",
      type: "image",
      src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600"
    },
    category: getLabel("güncel"),
    tags: [getLabel("barınma sorunu", "tag"), getLabel("yurtlar", "tag"), getLabel("öğrenci hareketi", "tag")],
    content: [{ blockContent: { type: "text", textContent: "KYK yurtlarının kapasite sorunu ve özel yurt fiyatları..." } }]
  },
  {
    href: "/articles/goc-yollari",
    title: "Sınırdaki Hayatlar: Göç ve Entegrasyon",
    description: "Türkiye'nin göçmen politikası ve toplumsal yansımaları.",
    author: "Ayşe Yılmaz",
    place: "Uluslararası İlişkiler",
    location: "Galatasaray Üniversitesi",
    issueNumber: 499,
    publishedDate: new Date("2025-10-25"),
    firstMedia: {
      href: "/articles/goc-yollari",
      type: "image",
      src: "https://images.unsplash.com/photo-1488330890490-c291ecb62571?q=80&w=1600"
    },
    category: getLabel("güncel"),
    tags: [getLabel("göç", "tag"), getLabel("insan hakları", "tag"), getLabel("sosyoloji", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Mültecilerin iş gücü piyasasındaki konumu..." } }]
  },
  {
    href: "/articles/dijital-bagimlilik",
    title: "Ekran Süresi ve Kayıp Gençlik",
    description: "Sosyal medya algoritmaları dikkatimizi nasıl çalıyor?",
    author: "Dr. Ali Vural",
    place: "Psikoloji",
    location: "Üsküdar Üniversitesi",
    issueNumber: 503,
    publishedDate: new Date("2025-11-15"),
    firstMedia: {
      href: "/articles/dijital-bagimlilik",
      type: "image",
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600"
    },
    category: getLabel("güncel"),
    tags: [getLabel("teknoloji", "tag"), getLabel("psikoloji", "tag"), getLabel("sosyal medya", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Dopamin döngüsü ve sonsuz kaydırma tuzağı..." } }]
  },
  {
    href: "/articles/kadin-cinayetleri",
    title: "İstanbul Sözleşmesi ve Sonrası",
    description: "Kadın mücadelesi sokakta devam ederken yasal güvenceler ne durumda?",
    author: "Elif Sönmez",
    place: "Hukuk Fakültesi",
    location: "Ankara Üniversitesi",
    issueNumber: 494,
    publishedDate: new Date("2025-10-08"),
    firstMedia: {
      href: "/articles/kadin-cinayetleri",
      type: "image",
      src: "https://images.unsplash.com/photo-1596280803450-48d538622c95?q=80&w=1600"
    },
    category: getLabel("güncel"),
    tags: [getLabel("kadın mücadelesi", "tag"), getLabel("hukuk", "tag"), getLabel("siyaset", "tag")],
    content: [{ blockContent: { type: "text", textContent: "6284 sayılı kanunun uygulanmasındaki sorunlar..." } }]
  },
  {
    href: "/articles/issizlik",
    title: "Diplomalı İşsizler Ordusu",
    description: "Üniversite mezunları neden iş bulamıyor? Eğitim ve istihdam kopukluğu.",
    author: "Can Berk",
    place: "İktisat",
    location: "Yıldız Teknik Üniversitesi",
    issueNumber: 489,
    publishedDate: new Date("2025-09-12"),
    firstMedia: {
      href: "/articles/issizlik",
      type: "image",
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600"
    },
    category: getLabel("güncel"),
    tags: [getLabel("genç işçi", "tag"), getLabel("neoliberalizm", "tag"), getLabel("eğitim sistemi", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Genç işsizliği oranları tarihi zirvede..." } }]
  },
  {
    href: "/articles/gida-krizi",
    title: "Tarladan Sofraya Enflasyon",
    description: "Gıda fiyatlarındaki artışın arkasında yatan tarım politikaları.",
    author: "Ahmet Çiftçi",
    place: "Ziraat Mühendisliği",
    location: "Ege Üniversitesi",
    issueNumber: 487,
    publishedDate: new Date("2025-09-01"),
    firstMedia: {
      href: "/articles/gida-krizi",
      type: "image",
      src: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600"
    },
    category: getLabel("güncel"),
    tags: [getLabel("tarım", "tag"), getLabel("ekonomi", "tag"), getLabel("sürdürülebilirlik", "tag")],
    content: [{ blockContent: { type: "text", textContent: "İthalata dayalı tarım modelinin çöküşü..." } }]
  },


  // --- TARİH (7 Adet) ---
  {
    href: "/articles/modernlesme-sancilari",
    title: "Erken Cumhuriyet'te Taşra ve Merkez Gerilimi",
    description: "Ankara'nın inşası sadece bir başkent projesi değil, bir toplum mühendisliğiydi.",
    author: "Elif Demir",
    place: "Tarih Bölümü",
    location: "Tarih Vakfı",
    issueNumber: 496,
    publishedDate: new Date("2025-11-10"),
    firstMedia: {
      href: "/articles/modernlesme-sancilari",
      type: "image",
      src: "https://images.unsplash.com/photo-1588663459145-8a2b5b376d8b?q=80&w=1600"
    },
    category: getLabel("tarih"),
    tags: [getLabel("cumhuriyet dönemi", "tag"), getLabel("siyasi tarih", "tag"), getLabel("sosyoloji", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Yakup Kadri'nin Yaban romanı..." } }]
  },
  {
    href: "/articles/68-hareketi",
    title: "Türkiye'de 68 Kuşağı: Bir Ütopya Arayışı",
    description: "Deniz Gezmiş ve arkadaşlarının mirası bugün nasıl okunmalı?",
    author: "Orhan Aydın",
    place: "Siyaset Bilimi",
    location: "Mülkiye",
    issueNumber: 480,
    publishedDate: new Date("2025-06-06"),
    firstMedia: {
      href: "/articles/68-hareketi",
      type: "image",
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600"
    },
    category: getLabel("tarih"),
    tags: [getLabel("68 hareketi", "tag"), getLabel("gençlik hareketi tarihi", "tag"), getLabel("antiemperyalizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Üniversite işgalleri ve devrimci gençlik..." } }]
  },
  {
    href: "/articles/osmanli-modernlesmesi",
    title: "Tanzimat'tan Meşrutiyet'e Batılılaşma",
    description: "Osmanlı aydınının Doğu-Batı ikilemi.",
    author: "Prof. Dr. İlber K.",
    place: "Tarih",
    location: "Galatasaray Lisesi",
    issueNumber: 482,
    publishedDate: new Date("2025-07-15"),
    firstMedia: {
      href: "/articles/osmanli-modernlesmesi",
      type: "image",
      src: "https://images.unsplash.com/photo-1565060169194-118430f8983c?q=80&w=1600"
    },
    category: getLabel("tarih"),
    tags: [getLabel("osmanlı dönemi", "tag"), getLabel("düşünce tarihi", "tag"), getLabel("kültür", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Jön Türkler ve anayasal hareketler..." } }]
  },
  {
    href: "/articles/koy-enstituleri",
    title: "Yarım Kalmış Bir Mucize: Köy Enstitüleri",
    description: "Anadolu'nun aydınlanma projesi neden kapatıldı?",
    author: "Ayşe Öğretmen",
    place: "Eğitim Fakültesi",
    location: "Gazi Üniversitesi",
    issueNumber: 478,
    publishedDate: new Date("2025-04-17"),
    firstMedia: {
      href: "/articles/koy-enstituleri",
      type: "image",
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600"
    },
    category: getLabel("tarih"),
    tags: [getLabel("eğitim sistemi", "tag"), getLabel("cumhuriyet dönemi", "tag"), getLabel("aydınlanma", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Tonguç Baba ve Hasan Ali Yücel'in vizyonu..." } }]
  },
  {
    href: "/articles/isci-sinifi-tarihi",
    title: "15-16 Haziran ve İşçi Sınıfının Uyanışı",
    description: "Türkiye tarihinin en büyük işçi eylemi bize ne anlatıyor?",
    author: "Kemal İşler",
    place: "Çalışma Ekonomisi",
    location: "Kocaeli Üniversitesi",
    issueNumber: 491,
    publishedDate: new Date("2025-06-15"),
    firstMedia: {
      href: "/articles/isci-sinifi-tarihi",
      type: "image",
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600"
    },
    category: getLabel("tarih"),
    tags: [getLabel("işçi hareketi tarihi", "tag"), getLabel("sınıf mücadelesi", "tag"), getLabel("sendika", "tag")],
    content: [{ blockContent: { type: "text", textContent: "DİSK'in kapatılmasına karşı yürüyen binler..." } }]
  },
  {
    href: "/articles/soguk-savas-turkiye",
    title: "NATO'ya Giriş ve Türkiye'nin Yönü",
    description: "Soğuk Savaş dinamikleri Türkiye'nin iç siyasetini nasıl şekillendirdi?",
    author: "Mert Yılmaz",
    place: "Uluslararası İlişkiler",
    location: "Bilkent Üniversitesi",
    issueNumber: 486,
    publishedDate: new Date("2025-08-12"),
    firstMedia: {
      href: "/articles/soguk-savas-turkiye",
      type: "image",
      src: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=1600"
    },
    category: getLabel("tarih"),
    tags: [getLabel("dünya siyaseti", "tag"), getLabel("siyasi tarih", "tag"), getLabel("nato", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Truman Doktrini ve Kore Savaşı..." } }]
  },
  {
    href: "/articles/feminist-tarih",
    title: "Osmanlı'dan Cumhuriyete Kadın Hareketleri",
    description: "Nezihe Muhiddin ve Kadınlar Halk Fırkası.",
    author: "Zeynep Suda",
    place: "Kadın Çalışmaları",
    location: "İstanbul Üniversitesi",
    issueNumber: 475,
    publishedDate: new Date("2025-03-08"),
    firstMedia: {
      href: "/articles/feminist-tarih",
      type: "image",
      src: "https://images.unsplash.com/photo-1594833246732-e09211d04403?q=80&w=1600"
    },
    category: getLabel("tarih"),
    tags: [getLabel("kadın mücadelesi", "tag"), getLabel("tarih", "tag"), getLabel("siyaset", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Seçme ve seçilme hakkı mücadelesi..." } }]
  },


  // --- FELSEFE (7 Adet) ---
  {
    href: "/articles/algoritmik-halusinasyonlar",
    title: "Algoritmik Halüsinasyonlar: Gerçeğin Sonu mu?",
    description: "Yapay zeka modellerinin 'halüsinasyon' görmesi teknik bir hata mı, yoksa yeni bir ontoloji mi?",
    author: "Dr. Kerem Soylu",
    place: "Felsefe Bölümü",
    location: "ODTÜ",
    issueNumber: 496,
    publishedDate: new Date("2025-11-15"),
    firstMedia: {
      href: "/articles/algoritmik-halusinasyonlar",
      type: "image",
      src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600"
    },
    category: getLabel("felsefe"),
    tags: [getLabel("yapay zekâ", "tag"), getLabel("bilim felsefesi", "tag"), getLabel("postmodernizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Generative AI araçlarının ürettiği inandırıcı yalanlar..." } }]
  },
  {
    href: "/articles/spinoza-ozgurluk",
    title: "Spinoza ve Zorunluluğun Bilinci Olarak Özgürlük",
    description: "Determinist bir evrende özgür irade mümkün mü?",
    author: "Caner Filiz",
    place: "Felsefe",
    location: "Boğaziçi Üniversitesi",
    issueNumber: 493,
    publishedDate: new Date("2025-10-12"),
    firstMedia: {
      href: "/articles/spinoza-ozgurluk",
      type: "image",
      src: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=1600"
    },
    category: getLabel("felsefe"),
    tags: [getLabel("materyalizm", "tag"), getLabel("düşünce tarihi", "tag"), getLabel("etik", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Ethica'da duyguların geometrik düzeni..." } }]
  },
  {
    href: "/articles/varolusculuk",
    title: "Sartre ve Camus Tartışması: Başkaldırı mı Devrim mi?",
    description: "Varoluşçuluğun politik sınırları.",
    author: "Selin Gür",
    place: "Sosyoloji",
    location: "Galatasaray Üniversitesi",
    issueNumber: 485,
    publishedDate: new Date("2025-08-20"),
    firstMedia: {
      href: "/articles/varolusculuk",
      type: "image",
      src: "https://images.unsplash.com/photo-1490129374591-acf192973167?q=80&w=1600"
    },
    category: getLabel("felsefe"),
    tags: [getLabel("insan doğası", "tag"), getLabel("siyaset", "tag"), getLabel("yabancılaşma", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Bulantı ve Yabancı romanları üzerinden..." } }]
  },
  {
    href: "/articles/bilim-felsefesi-kuhn",
    title: "Paradigma Değişimleri: Kuhn ve Popper",
    description: "Bilim kümülatif mi ilerler yoksa devrimsel kopuşlarla mı?",
    author: "Dr. Ahmet Bilgin",
    place: "Bilim Tarihi",
    location: "İstanbul Üniversitesi",
    issueNumber: 481,
    publishedDate: new Date("2025-07-05"),
    firstMedia: {
      href: "/articles/bilim-felsefesi-kuhn",
      type: "image",
      src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1600"
    },
    category: getLabel("felsefe"),
    tags: [getLabel("bilim felsefesi", "tag"), getLabel("pozitivizm", "tag"), getLabel("bilim", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Bilimsel Devrimlerin Yapısı..." } }]
  },
  {
    href: "/articles/stoacilik-bugun",
    title: "Modern Dünyada Stoacılık: Bir Teselli mi?",
    description: "Marcus Aurelius'un düşünceleri plaza çalışanlarına ne söylüyor?",
    author: "Berk Yılmaz",
    place: "Psikoloji",
    location: "Koç Üniversitesi",
    issueNumber: 489,
    publishedDate: new Date("2025-09-10"),
    firstMedia: {
      href: "/articles/stoacilik-bugun",
      type: "image",
      src: "https://images.unsplash.com/photo-1525127752301-99b0b6377224?q=80&w=1600"
    },
    category: getLabel("felsefe"),
    tags: [getLabel("psikoloji", "tag"), getLabel("birey ve toplum", "tag"), getLabel("etik", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Kontrol edemediklerini dert etme felsefesi..." } }]
  },
  {
    href: "/articles/hegel-diyalektik",
    title: "Efendi-Köle Diyalektiği ve Tanınma Arzusu",
    description: "Hegel'in Fenomenolojisi'nde bilincin serüveni.",
    author: "Prof. Dr. Ali",
    place: "Felsefe",
    location: "Mimar Sinan",
    issueNumber: 476,
    publishedDate: new Date("2025-05-15"),
    firstMedia: {
      href: "/articles/hegel-diyalektik",
      type: "image",
      src: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1600"
    },
    category: getLabel("felsefe"),
    tags: [getLabel("idealizm", "tag"), getLabel("diyalektik materyalizm", "tag"), getLabel("tarih", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Tarihin sonu tartışmaları..." } }]
  },
  {
    href: "/articles/post-truth",
    title: "Hakikat Sonrası Çağda Doğruyu Aramak",
    description: "Yalanın bu kadar hızlı yayıldığı bir çağda felsefenin görevi ne?",
    author: "Ece Temelkuran",
    place: "İletişim",
    location: "Ankara",
    issueNumber: 500,
    publishedDate: new Date("2025-11-01"),
    firstMedia: {
      href: "/articles/post-truth",
      type: "image",
      src: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600"
    },
    category: getLabel("felsefe"),
    tags: [getLabel("medya", "tag"), getLabel("siyaset", "tag"), getLabel("postmodernizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Sosyal medyanın yankı odaları..." } }]
  },


  // --- KURAM (7 Adet) ---
  {
    href: "/articles/prekarya-manifestosu",
    title: "Görünmeyen Emek: Dijital Platformlarda Sömürü",
    description: "Kuryelerden içerik moderatörlerine kadar uzanan yeni işçi sınıfı.",
    author: "Caner Yıldız",
    place: "Emek Çalışmaları",
    location: "Humboldt Üniversitesi",
    issueNumber: 498,
    publishedDate: new Date("2025-10-22"),
    firstMedia: {
      href: "/articles/prekarya-manifestosu",
      type: "image",
      src: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=1600"
    },
    category: getLabel("kuram"),
    tags: [getLabel("emek mücadelesi", "tag"), getLabel("kapitalizm", "tag"), getLabel("teknoloji", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Bir 'iş ortağı' (partner) olarak adlandırılmak..." } }]
  },
  {
    href: "/articles/walter-benjamin",
    title: "Pasajlar'da Kaybolmak: Walter Benjamin'in Flaneur'ü",
    description: "Modern kentin ilk gözlemcisi Benjamin ve AVM kültürü.",
    author: "Mehmet Erdem",
    place: "Sosyoloji",
    location: "Sorbonne",
    issueNumber: 495,
    publishedDate: new Date("2025-10-15"),
    firstMedia: {
      href: "/articles/walter-benjamin",
      type: "image",
      src: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=1600"
    },
    category: getLabel("kuram"),
    tags: [getLabel("tarihsel materyalizm", "tag"), getLabel("kent yaşamı", "tag"), getLabel("kültürel üretim", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Benjamin için tarih, bir ilerleme değil..." } }]
  },
  {
    href: "/articles/marksizm-ekoloji",
    title: "Metabolik Yarık: Marx ve Ekoloji",
    description: "Kapitalizm doğayı nasıl tüketiyor? John Bellamy Foster okuması.",
    author: "Selin Doğa",
    place: "Çevre Mühendisliği",
    location: "ODTÜ",
    issueNumber: 492,
    publishedDate: new Date("2025-09-30"),
    firstMedia: {
      href: "/articles/marksizm-ekoloji",
      type: "image",
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600"
    },
    category: getLabel("kuram"),
    tags: [getLabel("ekoloji mücadelesi", "tag"), getLabel("kapitalizm", "tag"), getLabel("marksizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Doğa ile insan arasındaki madde alışverişinin kopuşu..." } }]
  },
  {
    href: "/articles/frankfurt-okulu",
    title: "Kültür Endüstrisi ve Aydınlanmanın Diyalektiği",
    description: "Adorno ve Horkheimer bugün yaşasa Netflix izler miydi?",
    author: "Berk Can",
    place: "Kültürel Çalışmalar",
    location: "Sabancı Üniversitesi",
    issueNumber: 488,
    publishedDate: new Date("2025-08-15"),
    firstMedia: {
      href: "/articles/frankfurt-okulu",
      type: "image",
      src: "https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=1600"
    },
    category: getLabel("kuram"),
    tags: [getLabel("pop kültür", "tag"), getLabel("sanat eleştirisi", "tag"), getLabel("yabancılaşma", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Standartlaşan sanat ürünleri ve pasif izleyici..." } }]
  },
  {
    href: "/articles/gramsci-hegemonya",
    title: "Hapishane Defterleri'nden Bugüne Hegemonya",
    description: "Rıza nasıl üretilir? Sivil toplumun rolü.",
    author: "Ali Veli",
    place: "Siyaset Bilimi",
    location: "Ankara Üniversitesi",
    issueNumber: 484,
    publishedDate: new Date("2025-07-20"),
    firstMedia: {
      href: "/articles/gramsci-hegemonya",
      type: "image",
      src: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1600"
    },
    category: getLabel("kuram"),
    tags: [getLabel("siyaset", "tag"), getLabel("marksizm", "tag"), getLabel("devrimler tarihi", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Organik aydınlar ve tarihsel blok..." } }]
  },
  {
    href: "/articles/foucault-biyoiktidar",
    title: "Biyoiktidar ve Gözetim Toplumu",
    description: "Panoptikon'dan dijital veriye: Bedenler nasıl yönetiliyor?",
    author: "Zeynep T.",
    place: "Sosyoloji",
    location: "Boğaziçi",
    issueNumber: 479,
    publishedDate: new Date("2025-06-10"),
    firstMedia: {
      href: "/articles/foucault-biyoiktidar",
      type: "image",
      src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600"
    },
    category: getLabel("kuram"),
    tags: [getLabel("yapısalcılık", "tag"), getLabel("teknoloji", "tag"), getLabel("toplum", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Hapishanenin Doğuşu ve modern kapatılma mekanları..." } }]
  },
  {
    href: "/articles/mekan-uretimi",
    title: "Lefebvre ve Mekanın Üretimi",
    description: "Şehir planlaması ideolojiden bağımsız mıdır?",
    author: "Mimar Sinan",
    place: "Mimarlık",
    location: "İTÜ",
    issueNumber: 494,
    publishedDate: new Date("2025-10-18"),
    firstMedia: {
      href: "/articles/mekan-uretimi",
      type: "image",
      src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600"
    },
    category: getLabel("kuram"),
    tags: [getLabel("kent hakkı", "tag"), getLabel("şehirleşme", "tag"), getLabel("marksizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Mekan toplumsal bir üründür..." } }]
  },


  // --- DÜNYA (8 Adet) ---
  {
    href: "/articles/latin-amerika-solu",
    title: "Latin Amerika’da Yeni Sol Dalga ve Sınırları",
    description: "Şili’den Brezilya’ya esen sol rüzgarlar, neoliberal tahribatı onarmaya yetecek mi?",
    author: "Deniz Güney",
    place: "Uluslararası İlişkiler",
    location: "ODTÜ",
    issueNumber: 496,
    publishedDate: new Date("2025-10-30"),
    firstMedia: {
      href: "/articles/latin-amerika-solu",
      type: "image",
      src: "https://images.unsplash.com/photo-1533647488059-3a87679803d2?q=80&w=1600"
    },
    category: getLabel("dünya"),
    tags: [getLabel("sosyalizm", "tag"), getLabel("dünya siyaseti", "tag"), getLabel("neoliberalizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Boric'in Şili'deki zaferi..." } }]
  },
  {
    href: "/articles/cin-yukselisi",
    title: "Kuşak ve Yol: Çin'in Küresel Hegemonya Arayışı",
    description: "ABD ve Çin arasındaki ticaret savaşları yeni bir soğuk savaş mı?",
    author: "Ahmet Asya",
    place: "Asya Çalışmaları",
    location: "Boğaziçi",
    issueNumber: 492,
    publishedDate: new Date("2025-10-10"),
    firstMedia: {
      href: "/articles/cin-yukselisi",
      type: "image",
      src: "https://images.unsplash.com/photo-1543191878-f65533d526cd?q=80&w=1600"
    },
    category: getLabel("dünya"),
    tags: [getLabel("emperyalizm", "tag"), getLabel("ekonomi", "tag"), getLabel("dünya siyaseti", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Afrika'daki Çin yatırımları..." } }]
  },
  {
    href: "/articles/avrupa-sagi",
    title: "Avrupa'da Aşırı Sağın Yükselişi",
    description: "Mülteci krizi ve ekonomik durgunluk faşizmi hortlatıyor mu?",
    author: "Selin Avrupa",
    place: "Siyaset Bilimi",
    location: "Paris",
    issueNumber: 497,
    publishedDate: new Date("2025-11-05"),
    firstMedia: {
      href: "/articles/avrupa-sagi",
      type: "image",
      src: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1600"
    },
    category: getLabel("dünya"),
    tags: [getLabel("faşizm", "tag"), getLabel("göç", "tag"), getLabel("avrupa", "tag")],
    content: [{ blockContent: { type: "text", textContent: "İtalya ve Fransa seçimleri..." } }]
  },
  {
    href: "/articles/filistin-meselesi",
    title: "Apartheid Rejimi ve Filistin Direnişi",
    description: "Orta Doğu'da barış neden imkansız görünüyor?",
    author: "Hasan Orta",
    place: "Orta Doğu Enstitüsü",
    location: "Sakarya Üniversitesi",
    issueNumber: 501,
    publishedDate: new Date("2025-11-15"),
    firstMedia: {
      href: "/articles/filistin-meselesi",
      type: "image",
      src: "https://images.unsplash.com/photo-1531885994236-40742d480628?q=80&w=1600"
    },
    category: getLabel("dünya"),
    tags: [getLabel("ortadoğu", "tag"), getLabel("emperyalizm", "tag"), getLabel("insan hakları", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Gazze'deki insani kriz..." } }]
  },
  {
    href: "/articles/afrika-darbeler",
    title: "Sahel Bölgesinde Darbeler Zinciri",
    description: "Fransız sömürgeciliğinin sonu mu geliyor?",
    author: "Ali Afrika",
    place: "Uluslararası İlişkiler",
    location: "Ankara",
    issueNumber: 489,
    publishedDate: new Date("2025-09-05"),
    firstMedia: {
      href: "/articles/afrika-darbeler",
      type: "image",
      src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1600"
    },
    category: getLabel("dünya"),
    tags: [getLabel("antiemperyalizm", "tag"), getLabel("afrika", "tag"), getLabel("siyaset", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Nijer ve Mali'deki gelişmeler..." } }]
  },
  {
    href: "/articles/rusya-ukrayna",
    title: "Uzayan Savaşın Küresel Etkileri",
    description: "Enerji krizi ve değişen ittifaklar.",
    author: "Mehmet Slav",
    place: "Slav Dilleri",
    location: "İstanbul Üniversitesi",
    issueNumber: 483,
    publishedDate: new Date("2025-07-25"),
    firstMedia: {
      href: "/articles/rusya-ukrayna",
      type: "image",
      src: "https://images.unsplash.com/photo-1574689049743-349071c890d2?q=80&w=1600"
    },
    category: getLabel("dünya"),
    tags: [getLabel("savaş", "tag"), getLabel("enerji", "tag"), getLabel("dünya siyaseti", "tag")],
    content: [{ blockContent: { type: "text", textContent: "NATO'nun genişleme stratejisi..." } }]
  },
  {
    href: "/articles/abd-secimleri",
    title: "Kutuplaşmış Amerika Sandık Başında",
    description: "Trumpizm ve demokratların krizi.",
    author: "John Doe",
    place: "Amerikan Etütleri",
    location: "Washington",
    issueNumber: 504,
    publishedDate: new Date("2025-11-25"),
    firstMedia: {
      href: "/articles/abd-secimleri",
      type: "image",
      src: "https://images.unsplash.com/photo-1541872703-74c5963631df?q=80&w=1600"
    },
    category: getLabel("dünya"),
    tags: [getLabel("seçimler", "tag"), getLabel("popülizm", "tag"), getLabel("dünya siyaseti", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Kongre baskınından bugüne..." } }]
  },
  {
    href: "/articles/hindistan-modi",
    title: "Hindistan'da Milliyetçiliğin Yükselişi",
    description: "Dünyanın en büyük demokrasisi otoriterleşiyor mu?",
    author: "Ravi K.",
    place: "Güney Asya Çalışmaları",
    location: "Delhi",
    issueNumber: 491,
    publishedDate: new Date("2025-09-18"),
    firstMedia: {
      href: "/articles/hindistan-modi",
      type: "image",
      src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1600"
    },
    category: getLabel("dünya"),
    tags: [getLabel("siyaset", "tag"), getLabel("din ve toplum", "tag"), getLabel("asya", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Hindu milliyetçiliği ve azınlık hakları..." } }]
  },


  // --- SPOR (7 Adet) ---
  {
    href: "/articles/endustriyel-futbol",
    title: "Endüstriyel Futbol ve Tribünlerin Sessizliği",
    description: "Bilet fiyatları, Passolig uygulamaları ve yayın gelirleri...",
    author: "Mert Çelik",
    place: "Spor Bilimleri",
    location: "Marmara Üniversitesi",
    issueNumber: 496,
    publishedDate: new Date("2025-10-25"),
    firstMedia: {
      href: "/articles/endustriyel-futbol",
      type: "image",
      src: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600"
    },
    category: getLabel("spor"),
    tags: [getLabel("kapitalizm", "tag"), getLabel("sosyoloji", "tag"), getLabel("yabancılaşma", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Premier Lig modeli tüm dünyaya ihraç edilirken..." } }]
  },
  {
    href: "/articles/kadin-voleybolu",
    title: "Filenin Sultanları: Bir Başarı Hikayesi",
    description: "Kadın voleybolunun yükselişi topluma ne anlatıyor?",
    author: "Selin Smaç",
    place: "Spor Yöneticiliği",
    location: "Celal Bayar Üniversitesi",
    issueNumber: 488,
    publishedDate: new Date("2025-09-10"),
    firstMedia: {
      href: "/articles/kadin-voleybolu",
      type: "image",
      src: "https://images.unsplash.com/photo-1612872087720-48ca45e4c690?q=80&w=1600"
    },
    category: getLabel("spor"),
    tags: [getLabel("kadın mücadelesi", "tag"), getLabel("spor", "tag"), getLabel("başarı", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Avrupa şampiyonluğu ve olimpiyat madalyası..." } }]
  },
  {
    href: "/articles/amator-branslar",
    title: "Futbolun Gölgesinde Amatör Branşlar",
    description: "Olimpik sporcular sponsor bulmakta neden zorlanıyor?",
    author: "Can Atlet",
    place: "Beden Eğitimi",
    location: "Gazi Üniversitesi",
    issueNumber: 490,
    publishedDate: new Date("2025-09-22"),
    firstMedia: {
      href: "/articles/amator-branslar",
      type: "image",
      src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600"
    },
    category: getLabel("spor"),
    tags: [getLabel("spor politikaları", "tag"), getLabel("ekonomi", "tag"), getLabel("olimpiyat", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Tesisleşme sorunu ve altyapı eksikliği..." } }]
  },
  {
    href: "/articles/spor-ve-politika",
    title: "Tribünler Siyaset Yapar mı?",
    description: "Gezi'den bugüne taraftar gruplarının toplumsal muhalefetteki yeri.",
    author: "Ulaş Tribün",
    place: "Sosyoloji",
    location: "Beşiktaş",
    issueNumber: 480,
    publishedDate: new Date("2025-06-01"),
    firstMedia: {
      href: "/articles/spor-ve-politika",
      type: "image",
      src: "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=1600"
    },
    category: getLabel("spor"),
    tags: [getLabel("sokak kültürü", "tag"), getLabel("siyaset", "tag"), getLabel("demokrasi", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Çarşı grubu ve tribün sloganları..." } }]
  },
  {
    href: "/articles/espor-yukselisi",
    title: "Espor: Spor mu Eğlence mi?",
    description: "Dijital oyun dünyasının milyar dolarlık ekonomisi.",
    author: "Berk Gamer",
    place: "Dijital Oyun Tasarımı",
    location: "Bahçeşehir Üniversitesi",
    issueNumber: 502,
    publishedDate: new Date("2025-11-12"),
    firstMedia: {
      href: "/articles/espor-yukselisi",
      type: "image",
      src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600"
    },
    category: getLabel("spor"),
    tags: [getLabel("teknoloji", "tag"), getLabel("gençlik", "tag"), getLabel("dijital kültür", "tag")],
    content: [{ blockContent: { type: "text", textContent: "League of Legends finalleri stadyumları dolduruyor..." } }]
  },
  {
    href: "/articles/doping-skandallari",
    title: "Daha Hızlı, Daha Güçlü, Daha İlaçlı?",
    description: "Sporda doping gerçeği ve etik tartışmalar.",
    author: "Dr. Canan Sağlık",
    place: "Spor Hekimliği",
    location: "Hacettepe",
    issueNumber: 485,
    publishedDate: new Date("2025-08-05"),
    firstMedia: {
      href: "/articles/doping-skandallari",
      type: "image",
      src: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1600"
    },
    category: getLabel("spor"),
    tags: [getLabel("etik", "tag"), getLabel("sağlık", "tag"), getLabel("rekabet", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Rusya'nın olimpiyatlardan men edilmesi..." } }]
  },
  {
    href: "/articles/mahalle-maci",
    title: "Kaybolan Bir Kültür: Mahalle Maçları",
    description: "Kentsel dönüşümle birlikte betonlaşan sokaklar ve çocukluk.",
    author: "Hakan Nostalji",
    place: "Kent Sosyolojisi",
    location: "Kadıköy",
    issueNumber: 479,
    publishedDate: new Date("2025-05-20"),
    firstMedia: {
      href: "/articles/mahalle-maci",
      type: "image",
      src: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1600"
    },
    category: getLabel("spor"),
    tags: [getLabel("kent yaşamı", "tag"), getLabel("çocukluk", "tag"), getLabel("sokak kültürü", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Üç korner bir penaltı devri kapandı mı?..." } }]
  }
];