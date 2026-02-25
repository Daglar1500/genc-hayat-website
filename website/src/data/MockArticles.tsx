import { ArticleCard, Labelo, block, text, media, LabeloDefault } from "../pages/MainPage/ArticleCard";
import { FeedCardProps } from "../pages/MainPage/MainContent/FeedSection";

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
      LabeloDefault.find(x => x.name === "sinema")!,
      LabeloDefault.find(x => x.name === "dizi")!,
      LabeloDefault.find(x => x.name === "psikoloji")!,
      LabeloDefault.find(x => x.name === "dijital kültür")!
    ],
    category: LabeloDefault.find(x => x.name === "kültür-sanat")!,
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
          textContent: "“Others” hangi kavramlarla somutlaşıyor?"
        }
      },

      {
        blockContent: {
          type: 'text',
          textContent: "Bugün dünyaya bakan eleştirel bir göz için “hive mind” denince akla artık sadece Soğuk Savaş’ın ideolojik kalıpları gelmiyor; internet, sosyal medya ve yapay zekâ da geliyor. Pluribus’taki Others internetin, algoritmaların ve platformların kolektif bilinci olarak okunabilir. Dizinin üçüncü bölümünde Zosia’nın, Carol’ı memnun etmek için onun tüm anılarını, zevklerini, travmalarını kullanarak mükemmel jestler yapmaya çalıştığını görüyoruz: Sevdiği yemeği getiriyor, eski bir alışverişi telafi ediyor, geçmişten duygusal detaylar hatırlıyor. Ama tüm bu jestler, duygusal bir derinlikten çok, veri işleme kapasitesine dayanıyor; Zosia’nın ve Others’ın sınırı, ironi, özgünlük ve gerçek duyguyu üretememek. Bu sahneler kapitalizmin veri üzerinden işleyen yeni yönetim biçimlerini akla getiriyor. Seni sürekli mutlu, konforlu, memnun etmeye çalışan, içerik ve ilişkilerini sana en uygun olanla filtreleyen, ama aynı anda seni sürekli izleyen, verini emen, seni tahmin edilebilir bir profile indirgeyen dijital bir hive mind. Buna bir de çalışma hayatını ekleyelim: algoritmik vardiya planlaması, performans takibi, optimum verimlilik adına işçilerin adım adım izlenmesi. Bütün bunlar, görünüşte daha iyi hizmet ve daha çok konfor için; tıpkı Others’ın “biz sadece kimseye zarar vermek istemiyoruz” iddiası gibi."
        },
      },

      {
        blockContent: {
          type: 'text',
          textContent: "İlginç olan, Others’ın bile rızaya ihtiyaç duyması. Bu da günümüz kapitalizminin özgür irade fetişini hatırlatıyor: Hepimiz sözde özgürce “kabul ediyoruz”, “kullanım koşullarını okuduk”, “çerezleri kabul ettik”, “sözleşmeyi imzaladık”. Baskı çıplak zorla değil, sürekli üretilen rıza üzerinden işliyor. Bu açıdan Pluribus, belki niyet ettiği kadar sistematik olmasa da eleştirel bir okuma için verimli bir zemin sunuyor. Hive mind’ı, planlı ekonomiden çok; veri temelli, algoritmikleştirilmiş, küresel bir yönetim biçimi olarak düşünebiliriz. Dizi, herkesin mutlu olduğu bir dünyanın bile bedenler ve emek üzerinden nasıl sürdürüldüğünü göstererek, görünmeyen emek ve sömürüye işaret ediyor. Aynı anda, bireysel özgürlük söyleminin, kolektif potansiyelleri nasıl bastırdığını da sergiliyor: Carol ne kadar haklı olsa da çözüm ufkunu kendi yalnız öfkesinin ötesine taşıyamıyor."
        },
      },

      {
        blockContent: {
          href: "/articles/pluribus-soguk-savas",
          type: 'image',
          mediaLayout: 'text-width',
          alt: "Pluribus dizisinden bir sahne",
          src: "https://www.hollywoodreporter.com/wp-content/uploads/2025/11/Pluribus_Photo_010303-H-2025.jpg?w=1296&h=730&crop=1",
        },
      },

      {
        blockContent: {
          type: 'text',
          textContent: "İlginç olan, Others’ın bile rızaya ihtiyaç duyması. Bu da günümüz kapitalizminin özgür irade fetişini hatırlatıyor: Hepimiz sözde özgürce “kabul ediyoruz”, “kullanım koşullarını okuduk”, “çerezleri kabul ettik”, “sözleşmeyi imzaladık”. Baskı çıplak zorla değil, sürekli üretilen rıza üzerinden işliyor. Bu açıdan Pluribus, belki niyet ettiği kadar sistematik olmasa da eleştirel bir okuma için verimli bir zemin sunuyor. Hive mind’ı, planlı ekonomiden çok; veri temelli, algoritmikleştirilmiş, küresel bir yönetim biçimi olarak düşünebiliriz. Dizi, herkesin mutlu olduğu bir dünyanın bile bedenler ve emek üzerinden nasıl sürdürüldüğünü göstererek, görünmeyen emek ve sömürüye işaret ediyor. Aynı anda, bireysel özgürlük söyleminin, kolektif potansiyelleri nasıl bastırdığını da sergiliyor: Carol ne kadar haklı olsa da çözüm ufkunu kendi yalnız öfkesinin ötesine taşıyamıyor."
        },
      },

      {
        blockContent: {
          type: 'subheading',
          textContent: "Sorun kolektiflik mi, yoksa onun içeriği mi?"
        },
      },

      {
        blockContent: {
          type: 'text',
          textContent: "Sonuç olarak Pluribus, günümüz geç-kapitalist dünyasının çelişkilerini taşıyan, gerilimli bir metin. Bir yandan teselli edici kolektivizm fikrinden ürküyor; diğer yandan herkesin kendi başına, kendi küçük adaletini aradığı neoliberal bireyciliğin de tükenmiş bir proje olduğunun farkında. Pluribus’u izlerken şu soruları akılda tutmak bence verimli olabilir: Sorun kolektiflik mi, yoksa kolektifliğin demokratik ve kapsayıcı içeriğinin olmaması mı? Others, tabandan örgütlenen, kendini tartışabilen, eşitsizlikleri çözen bir kolektivite değil; kusursuz bir teknik optimum. Dizi bize hangi kolektif alternatifleri göstermekten kaçınıyor? Ya total hive mind ya yalnız kahraman. Peki kolektif, yatay, demokratik örgütlenme biçimleri nerede? Yapay zekâ ve platform kapitalizmi, “hive mind” fikrini bugün nasıl somutluyor? Bizi mutlu etmeye çalıştığını söyleyen sistemler, aslında kimi besliyor, kimi aç bırakıyor, kimin bedenini, emeğini ve verisini tüketiyor?"
        },
      },

      {
        blockContent: {
          type: 'text',
          textContent: "Pluribus’u böyle bir çerçevede izlemek, hem 50’ler Hollywood’un ideolojik bilim kurgularıyla hesaplaşmayı, hem de bugün yapay zekâ, veri sömürüsü, platform kapitalizmi ve rıza rejimleriyle boğuşan dünyamıza eleştirel bir gözle bakmayı mümkün kılıyor. Belki de dizinin asıl açtığı soru, şu: “İnsanlığın gerçekten kurtulması için, hepimizin aynı zihinle düşünmesi mi gerekiyor, yoksa birbirimizi özgür ve eşit öznelere dönüştürecek yeni kolektif akıllar mı kurmamız?” Bu soruyu sonuna kadar zorlayan eleştirel bir izleme, Pluribus’un mutluluk kıyametini, bugünün dünyası için ciddi bir uyarıya dönüştürebilir."
        }
      }
    ]

  },




  // --- KÜLTÜR-SANAT (7 Adet) ---
  {
    href: "/articles/oguz-atay-yeniden",
    title: "Oğuz Atay’ı Yeniden Okumak: Tutunamayanlar’ın Güncelliği",
    description: "Bugünün prekaryası, Atay’ın 'tutunamayanlar'ını kendi aynasında görerek toplumsal uyumsuzluğun modern tezahürlerini sorguluyor. Selim Işık'ın 70'li yıllarda yaşadığı aydın bunalımı, günümüzün ekonomik ve kültürel belirsizlikleri içinde sıkışan bireylerin hikayesiyle şaşırtıcı benzerlikler taşıyor. Bu inceleme, romanın sadece edebi bir eser değil, aynı zamanda toplumsal bir teşhis olarak nasıl hala geçerliliğini koruduğunu tartışıyor.",
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
    description: "Nuri Bilge Ceylan sinemasının değişmez izleği olan taşra sıkıntısı, yerel bir sorun olmaktan çıkıp evrensel bir varoluş sancısına dönüşüyor. Ahlat Ağacı'ndan Kuru Otlar Üstüne'ye uzanan filmografisinde yönetmen, taşranın boğucu atmosferini karakterlerin içsel çatışmalarıyla ustaca harmanlıyor. Yazımızda, yönetmenin görsel dili ve anlatım teknikleri üzerinden taşranın makus talihinin sinematografik yansımalarını analiz ediyoruz.",
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
    description: "Bağımsız müzisyenler, dijital platformların ve acımasız algoritmaların arasında sanatlarını icra etmeye çalışırken büyük bir varoluş mücadelesi veriyor. Spotify listelerine girme baskısı ve sahnede kalma zorunluluğu arasında sıkışan genç sanatçılar, alternatif yollar arayarak kendi kitlelerini yaratmaya çabalıyor. Bu araştırma, Kadıköy'ün yeraltı sahnelerinden dijital dünyanın vitrinlerine uzanan bu zorlu yolculuğun dinamiklerini ele alıyor.",
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
    description: "Karaköy'ün dar sokaklarından Berlin Duvarı'nın yıkıntılarına kadar graffiti, sprey boyanın isyanı olarak kent dokusuna kazınmaya devam ediyor. Sokak sanatı, sadece estetik bir dışavurum değil, aynı zamanda kamusal alanın mülkiyetini ve kullanımını sorgulayan politik bir eylem biçimi olarak öne çıkıyor. Banksy gibi figürlerin popüler kültürün bir parçası haline gelmesiyle birlikte, bu sanat dalının ticarileşme ve özgünlüğünü koruma ikilemini tartışıyoruz.",
    author: "Caner Erkin",
    place: "Güzel Sanatlar Fakültesi",
    location: "Mimar Sinan GSÜ",
    issueNumber: 485,
    publishedDate: new Date("2025-08-30"),
    firstMedia: {
      href: "/articles/sokak-sanati",
      type: "image",
      src: "https://cooltourspain.com/wp-content/uploads/2020/04/grafiti-art-915x488.jpg"
    },
    category: getLabel("kültür-sanat"),
    tags: [getLabel("sokak sanatı", "tag"), getLabel("kent yaşamı", "tag"), getLabel("sanat eleştirisi", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Banksy popüler kültürün bir parçası mı oldu?..." } }]
  },
  {
    href: "/articles/tiyatro-direniyor",
    title: "Alternatif Sahneler ve Ödeneksiz Tiyatro Gerçeği",
    description: "Pandemi sonrası dönemde tiyatroların ayakta kalma savaşı sürerken, Kadıköy ve Beyoğlu'nun küçük sahnelerinde büyük ve cesur hikayeler anlatılmaya devam ediyor. Ödeneksiz tiyatrolar, ekonomik zorluklara ve sansür baskısına rağmen kolektif üretim modelleriyle sanatı halka ulaştırmanın yollarını arıyor. Bu yazı, sahne arkasındaki görünmeyen emeği ve tiyatrocuların dayanışma ağlarını mercek altına alıyor.",
    author: "Nazlı Çelik",
    place: "Tiyatro Eleştirmenliği",
    location: "İstanbul Üniversitesi",
    issueNumber: 501,
    publishedDate: new Date("2025-11-02"),
    firstMedia: {
      href: "/articles/tiyatro-direniyor",
      type: "image",
      src: "https://blog.sarar.com/wp-content/uploads/istanbul-tiyatro-festivali-kapak.png"
    },
    category: getLabel("kültür-sanat"),
    tags: [getLabel("tiyatro", "tag"), getLabel("kültürel üretim", "tag"), getLabel("emek mücadelesi", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Pandemi sonrası tiyatroların ayakta kalma savaşı..." } }]
  },
  {
    href: "/articles/cagdas-sanat",
    title: "Bienal Eleştirisi: Sanat Kimin İçin?",
    description: "Beyaz küp galerilerin steril ortamından dışarı taşmaya çalışan çağdaş sanat, gerçekten halkla buluşabiliyor mu yoksa sadece elit bir zümreye mi hitap ediyor? Büyük sermaye gruplarının sponsorluğunda gerçekleşen bienaller, sanatın eleştirel gücünü törpülerken, bağımsız sanatçılar bu çelişki içinde kendilerine yer bulmaya çalışıyor. Sanatın metalaşması ve kamusal erişilebilirliği üzerine eleştirel bir bienal okuması yapıyoruz.",
    author: "Selin Artuk",
    place: "Sanat Tarihi",
    location: "Hacettepe Üniversitesi",
    issueNumber: 490,
    publishedDate: new Date("2025-09-20"),
    firstMedia: {
      href: "/articles/cagdas-sanat",
      type: "image",
      src: "https://sanatormani.com/wp-content/uploads/2022/12/bianel-nedir-sanatormani.jpg"
    },
    category: getLabel("kültür-sanat"),
    tags: [getLabel("sergi", "tag"), getLabel("sanat eleştirisi", "tag"), getLabel("kapitalizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Sponsorların gölgesinde sanat üretimi..." } }]
  },


  // --- GÜNCEL (8 Adet) ---
  {
    href: "/articles/beton-ve-bellek",
    title: "Beton ve Bellek: İstanbul’un Kaybolan Meydanları",
    description: "İstanbul’un meydanları sadece kentsel boşluklar değil, aynı zamanda toplumsal hafızanın ve demokratik karşılaşmaların yaşandığı hayati alanlardır. Son yirmi yılda hızlanan kentsel dönüşüm projeleriyle birlikte, bu meydanların betona gömülmesi ve ticarileştirilmesi kentlilerin yaşam alanlarını daraltıyor. Bu makale, Taksim'den Üsküdar'a uzanan meydan düzenlemelerinin ardındaki politik tercihleri ve kent hakkı mücadelesini irdeliyor.",
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
    description: "Büyük şirketlerin yayımladığı 'sürdürülebilirlik' raporları, gezegeni kurtarmayı mı hedefliyor yoksa çevreye verdikleri zararı şık ambalajlarla gizlemeyi mi? Karbon ayak izini bireysel tüketicilere yükleyen hakim söylem, endüstriyel kirliliğin asıl sorumlularını gözden kaçırmamıza neden oluyor. Yeşil aklama stratejilerinin perde arkasını aralıyor ve iklim kriziyle mücadelenin gerçekçi yollarını tartışıyoruz.",
    author: "Ece Vural",
    place: "Ekoloji Topluluğu",
    location: "Muğla",
    issueNumber: 500,
    publishedDate: new Date("2025-10-20"),
    firstMedia: {
      href: "/articles/iklim-krizi-greenwashing",
      type: "image",
      src: "https://i0.wp.com/www.ykp.org.cy/wp-content/uploads/2011/04/story.jpg"
    },
    category: getLabel("güncel"),
    tags: [getLabel("iklim krizi", "tag"), getLabel("doğa talanı", "tag"), getLabel("kapitalizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Karbon ayak izini bireylere yükleyen söylem..." } }]
  },
  {
    href: "/articles/barinma-krizi",
    title: "Öğrenci Evinden Çıkamamak: Barınma Krizi",
    description: "Büyükşehirlerde kiraların astronomik seviyelere ulaşmasıyla birlikte üniversite öğrencileri kampüslere ve şehirlere sığamaz hale geldi. KYK yurtlarının yetersiz kapasitesi ve özel yurtların fahiş fiyatları, öğrencileri sağlıksız ve güvencesiz barınma koşullarına itiyor. Öğrenci hareketinin gündemine oturan barınma sorununun ekonomik ve sosyal boyutlarını, öğrencilerin yaşadığı mağduriyetler üzerinden ele alıyoruz.",
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
    description: "Türkiye'nin göçmen politikası, sadece sınır güvenliği meselesi değil, aynı zamanda toplumsal uyum ve insan hakları ekseninde ele alınması gereken çok katmanlı bir sorundur. Mültecilerin kayıt dışı ekonomi içindeki konumu ve yaşadıkları sömürü, göçmen karşıtlığı üzerinden yükselen siyasi söylemlerle daha da karmaşık bir hal alıyor. Bu yazı, göç olgusunu insani ve sosyolojik bir perspektiften değerlendirerek entegrasyon tartışmalarına ışık tutuyor.",
    author: "Ayşe Yılmaz",
    place: "Uluslararası İlişkiler",
    location: "Galatasaray Üniversitesi",
    issueNumber: 499,
    publishedDate: new Date("2025-10-25"),
    firstMedia: {
      href: "/articles/goc-yollari",
      type: "image",
      src: "https://perspektif.eu/wp-content/uploads/2025/05/Goc-1024x683.jpg"
    },
    category: getLabel("güncel"),
    tags: [getLabel("göç", "tag"), getLabel("insan hakları", "tag"), getLabel("sosyoloji", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Mültecilerin iş gücü piyasasındaki konumu..." } }]
  },
  {
    href: "/articles/dijital-bagimlilik",
    title: "Ekran Süresi ve Kayıp Gençlik",
    description: "Sosyal medya algoritmaları, dopamin döngüsünü tetikleyerek dikkatimizi çalmak ve bizi ekranlara hapsetmek üzerine kusursuzca tasarlanmış durumda. Sonsuz kaydırma tuzağına düşen genç kuşaklar, dijital bağımlılığın getirdiği odaklanma sorunları ve sosyal izolasyonla mücadele ediyor. Teknolojinin psikolojimiz üzerindeki etkilerini inceleyen bu yazı, dijital detoks ve bilinçli kullanım üzerine öneriler sunuyor.",
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
    description: "Kadın mücadelesi sokaklarda ve meydanlarda tüm hızıyla devam ederken, yasal güvencelerin erozyona uğraması şiddetle mücadeleyi sekteye uğratıyor. İstanbul Sözleşmesi'nden çıkılmasının yarattığı hukuki boşluk ve 6284 sayılı kanunun uygulanmasındaki sorunlar, kadınların yaşam hakkını doğrudan tehdit ediyor. Bu dosya, hukuki süreçlerin işleyişini ve kadın hareketinin taleplerini detaylı bir şekilde inceliyor.",
    author: "Elif Sönmez",
    place: "Hukuk Fakültesi",
    location: "Ankara Üniversitesi",
    issueNumber: 494,
    publishedDate: new Date("2025-10-08"),
    firstMedia: {
      href: "/articles/kadin-cinayetleri",
      type: "image",
      src: "https://sarkac.org/wp-content/uploads/2021/07/İstanbul-Sözleşmesi-Yaşatir-640x427-1.jpg"
    },
    category: getLabel("güncel"),
    tags: [getLabel("kadın mücadelesi", "tag"), getLabel("hukuk", "tag"), getLabel("siyaset", "tag")],
    content: [{ blockContent: { type: "text", textContent: "6284 sayılı kanunun uygulanmasındaki sorunlar..." } }]
  },
  {
    href: "/articles/issizlik",
    title: "Diplomalı İşsizler Ordusu",
    description: "Üniversite mezunu gençlerin iş bulma ümidi her geçen gün azalırken, eğitim sistemi ile istihdam piyasası arasındaki kopukluk derinleşiyor. Genç işsizliği oranlarının tarihi zirvelere ulaştığı bu dönemde, diplomalar birer kağıt parçasına dönüşme riskiyle karşı karşıya kalıyor. Neoliberal politikaların yarattığı güvencesizlik ortamında gençlerin gelecek kaygısını ve çözüm arayışlarını veriler ışığında tartışıyoruz.",
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
    description: "Gıda fiyatlarındaki durdurulamaz artış, sadece bir enflasyon sorunu değil, yıllardır uygulanan yanlış tarım politikalarının acı bir sonucudur. İthalata dayalı tarım modeli, yerli üreticiyi toprağından koparırken tüketicinin de gıdaya erişimini zorlaştırıyor. Tarladan sofraya uzanan tedarik zincirindeki kopuşları ve sürdürülebilir bir gıda politikası için yapılması gerekenleri uzman görüşleriyle ele alıyoruz.",
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
    description: "Ankara'nın inşası sadece yeni bir başkent projesi değil, aynı zamanda modernleşme hamlesinin Anadolu'ya yayılmasını hedefleyen kapsamlı bir toplum mühendisliği girişimiydi. Yakup Kadri'nin 'Yaban' romanında da işlendiği gibi, aydın ile köylü arasındaki mesafe ve çatışma, Cumhuriyet'in ilk yıllarındaki toplumsal dönüşümün en sancılı yönlerinden birini oluşturuyordu. Bu çalışma, merkezden taşraya uzanan modernleşme dalgasının yarattığı kültürel gerilimleri tarihsel bir perspektifle inceliyor.",
    author: "Elif Demir",
    place: "Tarih Bölümü",
    location: "Tarih Vakfı",
    issueNumber: 496,
    publishedDate: new Date("2025-11-10"),
    firstMedia: {
      href: "/articles/modernlesme-sancilari",
      type: "image",
      src: "https://saltonline.org/directus/media/thumbnails/4-izmir-isci-esnaf-kurumlar-mitingi-tahminen-1930larn-ikinci-yars-1-1-jpg-780-5000-false.jpg"
    },
    category: getLabel("tarih"),
    tags: [getLabel("cumhuriyet dönemi", "tag"), getLabel("siyasi tarih", "tag"), getLabel("sosyoloji", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Yakup Kadri'nin Yaban romanı..." } }]
  },
  {
    href: "/articles/68-hareketi",
    title: "Türkiye'de 68 Kuşağı: Bir Ütopya Arayışı",
    description: "Deniz Gezmiş ve arkadaşlarının öncülük ettiği 68 kuşağı hareketi, Türkiye'nin siyasi tarihinde bağımsızlık ve devrim idealleriyle özdeşleşen silinmez bir iz bıraktı. Üniversite işgalleriyle başlayan ve antiemperyalist bir mücadeleye dönüşen bu süreç, gençliğin toplumsal muhalefetteki rolünü yeniden tanımladı. O dönemin tanıklıkları ve belgeleri ışığında, 68 hareketinin mirasının bugün nasıl okunması gerektiğini ve günümüz gençliğine neler söylediğini tartışıyoruz.",
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
    description: "Osmanlı aydınının Doğu ile Batı arasında sıkışmışlığı, İmparatorluğun son dönemindeki modernleşme çabalarının hem itici gücü hem de en büyük açmazı olmuştur. Tanzimat Fermanı ile başlayan ve Meşrutiyet ile hız kazanan anayasal hareketler, devletin kurtuluşu için aranan reçetelerin çeşitliliğini gözler önüne seriyor. Jön Türkler'den İttihatçılara uzanan bu fikri süreklilik içinde, Osmanlı modernleşmesinin entelektüel köklerine iniyoruz.",
    author: "Prof. Dr. İlber K.",
    place: "Tarih",
    location: "Galatasaray Lisesi",
    issueNumber: 482,
    publishedDate: new Date("2025-07-15"),
    firstMedia: {
      href: "/articles/osmanli-modernlesmesi",
      type: "image",
      src: "https://apiko.ayk.gov.tr/uploads/2/imagesFile/15229.jpg?size=775x888"
    },
    category: getLabel("tarih"),
    tags: [getLabel("osmanlı dönemi", "tag"), getLabel("düşünce tarihi", "tag"), getLabel("kültür", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Jön Türkler ve anayasal hareketler..." } }]
  },
  {
    href: "/articles/koy-enstituleri",
    title: "Yarım Kalmış Bir Mucize: Köy Enstitüleri",
    description: "Anadolu'nun aydınlanma projesi olarak hayata geçirilen Köy Enstitüleri, sadece bir eğitim hamlesi değil, aynı zamanda kırsal kalkınmayı hedefleyen devrimci bir modeldi. Tonguç Baba ve Hasan Ali Yücel'in vizyonuyla kurulan bu okullar, öğrencilerine sadece teorik bilgi değil, hayatı dönüştürecek pratik beceriler de kazandırıyordu. Enstitülerin kapatılma süreci ve bu yarım kalmış mucizenin Türk eğitim sisteminde yarattığı boşluğu derinlemesine inceliyoruz.",
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
    description: "Türkiye işçi sınıfı tarihinin en büyük kitlesel eylemi olan 15-16 Haziran 1970 olayları, sendikal hakların kısıtlanmasına karşı verilen örgütlü bir cevap olarak tarihe geçti. DİSK'in kapatılmasına karşı İstanbul ve Kocaeli sokaklarını dolduran yüz binlerce işçi, sınıf bilincinin gücünü tüm ülkeye gösterdi. Bu dosya, o gün yaşananları, işçilerin taleplerini ve bu direnişin Türkiye siyasetindeki uzun erimli etkilerini ele alıyor.",
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
    description: "İkinci Dünya Savaşı sonrası şekillenen yeni dünya düzeninde Türkiye'nin tercihi, Soğuk Savaş dinamiklerini ve ülkenin iç siyasetini derinden etkiledi. Truman Doktrini ile başlayan ve Kore Savaşı'na asker gönderilmesiyle pekişen Batı bloku ile entegrasyon süreci, Türkiye'nin dış politikasında olduğu kadar toplumsal yapısında da dönüşümlere yol açtı. NATO üyeliğinin getirdiği askeri ve siyasi yükümlülüklerin tarihsel bilançosunu çıkarıyoruz.",
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
    description: "Türkiye'de kadın mücadelesinin kökleri sanılanın aksine Cumhuriyet öncesine, Osmanlı'nın son dönemindeki kadın derneklerine ve neşriyatına kadar uzanıyor. Nezihe Muhiddin öncülüğünde kurulan Kadınlar Halk Fırkası gibi girişimler, kadınların siyasi hak taleplerinin ne kadar eskiye dayandığını kanıtlıyor. Bu yazı, seçme ve seçilme hakkına giden yolda kadınların verdiği zorlu mücadeleyi ve tarih yazımında görmezden gelinen kadın öncüleri gün yüzüne çıkarıyor.",
    author: "Zeynep Suda",
    place: "Kadın Çalışmaları",
    location: "İstanbul Üniversitesi",
    issueNumber: 475,
    publishedDate: new Date("2025-03-08"),
    firstMedia: {
      href: "/articles/feminist-tarih",
      type: "image",
      src: "https://i0.wp.com/www.akademiktarihtr.com/wp-content/uploads/2019/02/mesrutiyettencumhuriyete.jpg?resize=650%2C381&ssl=1"
    },
    category: getLabel("tarih"),
    tags: [getLabel("kadın mücadelesi", "tag"), getLabel("tarih", "tag"), getLabel("siyaset", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Seçme ve seçilme hakkı mücadelesi..." } }]
  },


  // --- FELSEFE (7 Adet) ---
  {
    href: "/articles/algoritmik-halusinasyonlar",
    title: "Algoritmik Halüsinasyonlar: Gerçeğin Sonu mu?",
    description: "Yapay zeka modellerinin inandırıcı ama gerçek dışı bilgiler üretmesi olarak tanımlanan 'halüsinasyonlar', sadece teknik bir hata değil, aynı zamanda yeni bir ontolojik soruna işaret ediyor. Generative AI araçlarının yaygınlaşmasıyla birlikte hakikat ve kurgu arasındaki sınır giderek bulanıklaşırken, gerçeğin neliği üzerine felsefi tartışmalar yeniden alevleniyor. Bu makalede, Baudrillard'ın simülasyon kuramı ışığında algoritmik gerçekliğin doğasını sorguluyoruz.",
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
    description: "Determinist bir evren anlayışına sahip olan Spinoza'ya göre, insan eylemleri de doğa yasalarının zorunlu bir sonucudur; peki bu durumda özgür irade mümkün müdür? Filozof, özgürlüğü nedensellik zincirinden kopuk bir keyfilik olarak değil, insanın kendi doğasını ve duygularını anlama kapasitesi, yani 'zorunluluğun bilinci' olarak tanımlar. Ethica'daki geometrik düzen içinde duyguların köleliğinden aklın özgürlüğüne giden yolu bu yazıda takip ediyoruz.",
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
    description: "Varoluşçuluğun iki dev ismi Sartre ve Camus arasındaki dostluğun bitmesine neden olan polemik, aslında siyaset felsefesinin en temel sorularından birini barındırır: Amaç, araçları meşrulaştırır mı? Sartre, devrimci şiddeti ve örgütlü mücadeleyi savunurken, Camus başkaldıran insanın ahlaki sınırlarını ve yaşamın kutsallığını ön plana çıkarır. Bulantı ve Yabancı romanlarının izinden giderek, bu tarihsel tartışmanın politik ve etik boyutlarını yeniden değerlendiriyoruz.",
    author: "Selin Gür",
    place: "Sosyoloji",
    location: "Galatasaray Üniversitesi",
    issueNumber: 485,
    publishedDate: new Date("2025-08-20"),
    firstMedia: {
      href: "/articles/varolusculuk",
      type: "image",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Sartre_1967_crop.jpg/250px-Sartre_1967_crop.jpg"
    },
    category: getLabel("felsefe"),
    tags: [getLabel("insan doğası", "tag"), getLabel("siyaset", "tag"), getLabel("yabancılaşma", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Bulantı ve Yabancı romanları üzerinden..." } }]
  },
  {
    href: "/articles/bilim-felsefesi-kuhn",
    title: "Paradigma Değişimleri: Kuhn ve Popper",
    description: "Bilimsel bilginin ilerleyişi, Popper'ın iddia ettiği gibi yanlışlamalar yoluyla kümülatif bir şekilde mi gerçekleşir, yoksa Kuhn'un öne sürdüğü gibi devrimsel paradigma değişimleriyle mi? Thomas Kuhn, 'Bilimsel Devrimlerin Yapısı' adlı eserinde bilimin sosyal ve tarihsel bağlamdan bağımsız olmadığını, kriz dönemlerinde yaşanan kopuşlarla ilerlediğini savunur. Bu yazı, bilim felsefesinin bu iki temel yaklaşımını karşılaştırarak bilimin nesnelliği tartışmasına katkı sunuyor.",
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
    description: "Antik Roma'dan günümüze uzanan Stoacı felsefe, modern plaza çalışanlarından silikon vadisi girişimcilerine kadar geniş bir kitlede neden bu kadar popüler oldu? Marcus Aurelius'un 'kontrol edemediklerini dert etme' öğretisi, kişisel gelişim endüstrisi tarafından basit bir stres yönetimi tekniğine indirgenmiş durumda. Stoacılığın bugünkü popülaritesinin arkasındaki toplumsal nedenleri ve felsefenin otantik anlamını kaybettiği noktaları eleştirel bir gözle inceliyoruz.",
    author: "Berk Yılmaz",
    place: "Psikoloji",
    location: "Koç Üniversitesi",
    issueNumber: 489,
    publishedDate: new Date("2025-09-10"),
    firstMedia: {
      href: "/articles/stoacilik-bugun",
      type: "image",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Paolo_Monti_-_Servizio_fotografico_%28Napoli%2C_1969%29_-_BEIC_6353768.jpg/250px-Paolo_Monti_-_Servizio_fotografico_%28Napoli%2C_1969%29_-_BEIC_6353768.jpg"
    },
    category: getLabel("felsefe"),
    tags: [getLabel("psikoloji", "tag"), getLabel("birey ve toplum", "tag"), getLabel("etik", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Kontrol edemediklerini dert etme felsefesi..." } }]
  },
  {
    href: "/articles/hegel-diyalektik",
    title: "Efendi-Köle Diyalektiği ve Tanınma Arzusu",
    description: "Hegel'in 'Tinin Fenomenolojisi' eserindeki en çarpıcı bölümlerden biri olan efendi-köle diyalektiği, insan bilincinin oluşumunu karşılıklı tanınma mücadelesi üzerinden açıklar. Köle, emeğiyle doğayı dönüştürerek özgürleşirken, efendi kölenin emeğine bağımlı hale gelerek kendi statüsünün tutsağı olur. Bu felsefi metaforun, modern toplumdaki sınıf ilişkilerini ve kimlik politikalarını anlamak için sunduğu zengin kavramsal çerçeveyi analiz ediyoruz.",
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
    description: "Yalanın gerçeklerden daha hızlı yayıldığı ve duyguların olguların önüne geçtiği 'post-truth' (hakikat sonrası) çağında, felsefenin hakikati savunma görevi her zamankinden daha hayati. Sosyal medyanın yankı odaları ve manipülasyon teknikleri, ortak bir gerçeklik zemininde buluşmamızı imkansız hale getiriyor. Bu yazı, hakikat kavramının uğradığı erozyonu ve eleştirel düşünmenin bu dezenformasyon çağındaki önemini vurguluyor.",
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
    description: "Dijital kapitalizmin yükselişiyle birlikte ortaya çıkan yeni işçi sınıfı prekarya, güvencesizlik ve belirsizlik üzerine kurulu bir çalışma rejiminin parçası haline geldi. Motokuryelerden içerik moderatörlerine kadar uzanan bu geniş kitle, algoritmaların yönetimi altında 'iş ortağı' adı altında esnek ama sömürüye açık koşullarda çalıştırılıyor. Bu manifesto niteliğindeki yazı, dijital platformlardaki görünmeyen emeği ifşa ederek yeni bir örgütlenme modelinin imkanlarını tartışıyor.",
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
    description: "19. yüzyıl Paris'inin pasajlarında dolaşan flaneur, modern kentin ilk gözlemcisi olarak Walter Benjamin'in başyapıtı Pasajlar Projesi'nin merkezinde yer alır. Benjamin için tarih düz bir çizgide ilerleyen bir süreç değil, yıkıntıların ve parçaların bir araya geldiği bir kurgudur; flaneur ise bu yıkıntıların arasında hakikati arayan figürdür. Günümüzün AVM kültürüne ve tüketim mabetlerine Benjamin'in penceresinden bakarak, kentsel deneyimin dönüşümünü izliyoruz.",
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
    description: "Genellikle sadece endüstriyel üretimi öncelediği düşünülen Marx, aslında kapitalizmin doğa ile insan arasındaki madde alışverişinde onarılmaz bir 'metabolik yarık' açtığını tespit etmiştir. John Bellamy Foster'ın öncülüğünde gelişen ekolojik Marksizm, kapitalist birikim rejiminin gezegenin sınırlarını nasıl zorladığını teorik bir zemine oturtuyor. Bu yazı, iklim krizini anlamak için Marksist ekolojinin sunduğu kavramsal araçları ve çözüm önerilerini irdeliyor.",
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
    description: "Adorno ve Horkheimer'ın 'Aydınlanmanın Diyalektiği' eserinde ortaya attığı kültür endüstrisi kavramı, sanatın kitlesel üretim ve tüketim nesnesine dönüşerek eleştirel gücünü yitirmesini anlatır. Bugün Netflix dizilerinden pop müziğe kadar her alanda standartlaşan kültürel ürünler, izleyiciyi pasif bir tüketiciye dönüştürerek sistemin devamlılığını sağlar. Frankfurt Okulu'nun karamsar ama keskin eleştirilerinin dijital çağda hala ne kadar geçerli olduğunu tartışıyoruz.",
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
    description: "Antonio Gramsci'nin faşist hapishanelerinde kaleme aldığı hegemonya kavramı, egemen sınıfın sadece zor yoluyla değil, aynı zamanda rıza üreterek iktidarını nasıl sürdürdüğünü açıklar. Sivil toplum, medya ve eğitim kurumları aracılığıyla inşa edilen bu rıza, karşı-hegemonya stratejileriyle kırılmadıkça devrimci bir dönüşüm mümkün değildir. Gramsci'nin 'organik aydın' ve 'tarihsel blok' kavramları ışığında, bugünün siyasi mücadelelerine stratejik bir bakış sunuyoruz.",
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
    description: "Michel Foucault'nun iktidar analizleri, modern devletin sadece toprakları değil, nüfusu ve bedenleri de yönetme arzusu üzerine kuruludur; buna 'biyoiktidar' adını verir. Panoptikon hapishane modelinden dijital veri gözetimine uzanan süreçte, iktidar mekanizmaları daha incelikli ve her yere nüfuz eden bir hal almıştır. Sağlık politikalarından dijital izlemeye kadar bedenlerimizin nasıl disipline edildiğini ve yönetildiğini Foucaultcu bir perspektifle ele alıyoruz.",
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
    description: "Henri Lefebvre'e göre mekan, sadece boş bir geometrik alan değil, toplumsal ilişkilerin üretildiği ve yeniden üretildiği politik bir üründür. Şehir planlamasından mimariye kadar her mekansal düzenleme, arkasında bir ideoloji ve sınıf çıkarı barındırır. Kent hakkı kavramının da fikir babası olan Lefebvre'in teorisi üzerinden, modern kentlerin nasıl sermayenin ihtiyaçlarına göre şekillendiğini ve buna karşı nasıl bir yaşam alanı kurgulanabileceğini tartışıyoruz.",
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
    description: "Latin Amerika siyasetinde esen 'pembe dalga' rüzgarları, Şili'den Brezilya'ya sol iktidarları iş başına getirse de, bu yönetimler ciddi yapısal sorunlarla karşı karşıya. Neoliberal tahribatın derin izleri ve küresel ekonomik kriz, sol hükümetlerin vaatlerini gerçekleştirmesini zorlaştırırken, toplumsal muhalefet de beklentilerini yüksek tutuyor. Boric'in Şili'deki zaferinden Lula'nın dönüşüne kadar kıtadaki siyasi dengeleri ve solun sınırlarını analiz ediyoruz.",
    author: "Deniz Güney",
    place: "Uluslararası İlişkiler",
    location: "ODTÜ",
    issueNumber: 496,
    publishedDate: new Date("2025-10-30"),
    firstMedia: {
      href: "/articles/latin-amerika-solu",
      type: "image",
      src: "https://sarkac.org/wp-content/uploads/2021/07/İstanbul-Sözleşmesi-Yaşatir-640x427-1.jpg"
    },
    category: getLabel("dünya"),
    tags: [getLabel("sosyalizm", "tag"), getLabel("dünya siyaseti", "tag"), getLabel("neoliberalizm", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Boric'in Şili'deki zaferi..." } }]
  },
  {
    href: "/articles/cin-yukselisi",
    title: "Kuşak ve Yol: Çin'in Küresel Hegemonya Arayışı",
    description: "Çin'in 'Kuşak ve Yol' girişimi, sadece devasa bir altyapı projesi değil, aynı zamanda küresel ticaret yollarını ve jeopolitik dengeleri yeniden şekillendirme hamlesidir. ABD ile yaşanan ticaret savaşları ve teknolojik rekabet, dünyayı yeni bir Soğuk Savaş'ın eşiğine getirirken, Çin'in Afrika ve Asya'daki yatırımları etki alanını genişletiyor. Bu makale, Çin'in yükselişinin küresel kapitalizm içindeki anlamını ve olası jeopolitik sonuçlarını değerlendiriyor.",
    author: "Ahmet Asya",
    place: "Asya Çalışmaları",
    location: "Boğaziçi",
    issueNumber: 492,
    publishedDate: new Date("2025-10-10"),
    firstMedia: {
      href: "/articles/cin-yukselisi",
      type: "image",
      src: "https://kritikbakis.com/wp-content/uploads/2025/03/Cin-Halk-Cumhuriyeti.jpg"
    },
    category: getLabel("dünya"),
    tags: [getLabel("emperyalizm", "tag"), getLabel("ekonomi", "tag"), getLabel("dünya siyaseti", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Afrika'daki Çin yatırımları..." } }]
  },
  {
    href: "/articles/avrupa-sagi",
    title: "Avrupa'da Aşırı Sağın Yükselişi",
    description: "Avrupa genelinde yükselişe geçen aşırı sağ partiler, mülteci krizi ve ekonomik durgunluğu kullanarak kitlelerin öfkesini sandığa yansıtmayı başarıyor. İtalya'dan Fransa'ya, Hollanda'dan Almanya'ya kadar yayılan bu milliyetçi dalga, Avrupa Birliği'nin temel değerlerini ve geleceğini tehdit ediyor. Faşizmin yeni yüzünü ve popülist söylemlerin toplumda nasıl karşılık bulduğunu, son seçim sonuçları ve sosyolojik veriler ışığında inceliyoruz.",
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
    description: "Orta Doğu'nun kanayan yarası Filistin meselesi, İsrail'in sistematik işgal ve apartheid politikalarıyla çözümsüzlüğe sürüklenmeye devam ediyor. Gazze'deki insani kriz ve Batı Şeria'daki yerleşimci şiddeti, uluslararası toplumun sessizliğiyle birleşince bölgedeki barış umutlarını tüketiyor. Filistin halkının tarihsel direnişini, uluslararası hukukun ihlallerini ve küresel güçlerin ikiyüzlü tutumunu bu dosyada detaylandırıyoruz.",
    author: "Hasan Orta",
    place: "Orta Doğu Enstitüsü",
    location: "Sakarya Üniversitesi",
    issueNumber: 501,
    publishedDate: new Date("2025-11-15"),
    firstMedia: {
      href: "/articles/filistin-meselesi",
      type: "image",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtl2xE7EwXBRW8heov6tKAn5Mt4fkqGX7tGg&s"
    },
    category: getLabel("dünya"),
    tags: [getLabel("ortadoğu", "tag"), getLabel("emperyalizm", "tag"), getLabel("insan hakları", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Gazze'deki insani kriz..." } }]
  },
  {
    href: "/articles/afrika-darbeler",
    title: "Sahel Bölgesinde Darbeler Zinciri",
    description: "Afrika'nın Sahel bölgesinde peş peşe yaşanan askeri darbeler, kıtada Fransa'nın sömürgeci geçmişine duyulan tepkinin ve değişen güç dengelerinin bir sonucu olarak okunmalı. Mali, Nijer ve Burkina Faso gibi ülkelerdeki rejim değişiklikleri, Batı karşıtı bir damarı beslerken, Rusya gibi yeni aktörlerin bölgedeki etkisini artırıyor. Afrika'nın 'ikinci bağımsızlık savaşı' olarak da nitelendirilen bu sürecin dinamiklerini ve olası sonuçlarını tartışıyoruz.",
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
    description: "Rusya ve Ukrayna arasındaki savaş, sadece iki ülke arasındaki bir çatışma olmanın ötesine geçerek küresel enerji piyasalarını, gıda güvenliğini ve ittifak sistemlerini sarstı. NATO'nun genişleme stratejisi ve Rusya'nın güvenlik kaygıları ekseninde başlayan bu savaş, Avrupa'nın güvenlik mimarisini geri dönülemez bir şekilde değiştirdi. Savaşın ekonomik maliyetlerini ve barış masasının neden hala kurulamadığını jeopolitik bir analizle ele alıyoruz.",
    author: "Mehmet Slav",
    place: "Slav Dilleri",
    location: "İstanbul Üniversitesi",
    issueNumber: 483,
    publishedDate: new Date("2025-07-25"),
    firstMedia: {
      href: "/articles/rusya-ukrayna",
      type: "image",
      src: "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/1195D/production/_116892027_gettyimages-143069358.jpg.webp"
    },
    category: getLabel("dünya"),
    tags: [getLabel("savaş", "tag"), getLabel("enerji", "tag"), getLabel("dünya siyaseti", "tag")],
    content: [{ blockContent: { type: "text", textContent: "NATO'nun genişleme stratejisi..." } }]
  },
  {
    href: "/articles/abd-secimleri",
    title: "Kutuplaşmış Amerika Sandık Başında",
    description: "ABD siyaseti, tarihinin en derin kutuplaşmalarından birini yaşarken, yaklaşan seçimler sadece Amerika'nın değil tüm dünyanın geleceğini etkileyecek kritik bir dönemeç niteliğinde. Trumpizmin popülist söylemleri ile Demokratların yaşadığı liderlik krizi arasında sıkışan seçmenler, demokrasinin kırılganlığını test ediyor. Kongre baskınından bugüne uzanan siyasi gerilimi ve Amerikan toplumundaki kültürel çatışmaları sandık analiziyle birleştiriyoruz.",
    author: "John Doe",
    place: "Amerikan Etütleri",
    location: "Washington",
    issueNumber: 504,
    publishedDate: new Date("2025-11-25"),
    firstMedia: {
      href: "/articles/abd-secimleri",
      type: "image",
      src: "https://cdnuploads.aa.com.tr/uploads/Contents/2024/11/05/thumbs_b_c_98cb183e0d6dbb998e416b4fa79c0dd1.jpg"
    },
    category: getLabel("dünya"),
    tags: [getLabel("seçimler", "tag"), getLabel("popülizm", "tag"), getLabel("dünya siyaseti", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Kongre baskınından bugüne..." } }]
  },
  {
    href: "/articles/hindistan-modi",
    title: "Hindistan'da Milliyetçiliğin Yükselişi",
    description: "Dünyanın en büyük demokrasisi olarak bilinen Hindistan, Modi yönetimi altında giderek artan bir Hindu milliyetçiliği ve otoriterleşme eğilimi gösteriyor. Dini azınlıklara yönelik baskılar ve ifade özgürlüğünün kısıtlanması, ülkenin seküler anayasal yapısını tehdit ederken, ekonomik büyüme rakamları bu sosyal gerilimleri maskeliyor. Hindistan'ın iç siyasetindeki bu dönüşümün Asya'daki dengelere ve demokrasi tartışmalarına etkisini irdeliyoruz.",
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
    description: "Futbolun sadece bir oyun olmaktan çıkıp milyar dolarlık bir endüstriye dönüşmesi, tribün kültürünü ve taraftarlık ruhunu geri dönülmez bir şekilde değiştirdi. Yüksek bilet fiyatları, Passolig gibi denetim mekanizmaları ve yayın gelirlerine odaklı kulüp yönetimleri, futbolu halktan kopararak steril bir eğlence ürününe dönüştürüyor. Premier Lig modelinin küreselleşmesiyle birlikte sessizleşen tribünleri ve futbolun kaybettiği ruhu sorguluyoruz.",
    author: "Mert Çelik",
    place: "Spor Bilimleri",
    location: "Marmara Üniversitesi",
    issueNumber: 496,
    publishedDate: new Date("2025-10-25"),
    firstMedia: {
      href: "/articles/endustriyel-futbol",
      type: "image",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Football_in_Bloomington%2C_Indiana%2C_1995.jpg/1200px-Football_in_Bloomington%2C_Indiana%2C_1995.jpg"
    },
    category: getLabel("spor"),
    tags: [getLabel("kapitalizm", "tag"), getLabel("sosyoloji", "tag"), getLabel("yabancılaşma", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Premier Lig modeli tüm dünyaya ihraç edilirken..." } }]
  },
  {
    href: "/articles/kadin-voleybolu",
    title: "Filenin Sultanları: Bir Başarı Hikayesi",
    description: "Türkiye Kadın Voleybol Milli Takımı'nın uluslararası arenada elde ettiği tarihi başarılar, sadece sportif bir zafer değil, aynı zamanda kadınların toplumsal hayattaki gücünün de bir simgesi. Avrupa şampiyonlukları ve olimpiyat madalyalarıyla taçlanan bu yolculuk, kız çocuklarına ilham verirken, sporun toplumsal cinsiyet eşitliği mücadelesindeki rolünü de gözler önüne seriyor. Filenin Sultanları'nın başarısının arkasındaki disiplin, emek ve takım ruhunu analiz ediyoruz.",
    author: "Selin Smaç",
    place: "Spor Yöneticiliği",
    location: "Celal Bayar Üniversitesi",
    issueNumber: 488,
    publishedDate: new Date("2025-09-10"),
    firstMedia: {
      href: "/articles/kadin-voleybolu",
      type: "image",
      src: "https://cdnuploads.aa.com.tr/uploads/Contents/2021/08/20/thumbs_b_c_2baab00fc28624e3505d51d56d6c8f4e.jpg"
    },
    category: getLabel("spor"),
    tags: [getLabel("kadın mücadelesi", "tag"), getLabel("spor", "tag"), getLabel("başarı", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Avrupa şampiyonluğu ve olimpiyat madalyası..." } }]
  },
  {
    href: "/articles/amator-branslar",
    title: "Futbolun Gölgesinde Amatör Branşlar",
    description: "Türkiye'de spor denince akla gelen ilk şey futbol olsa da, asıl olimpiyat başarısını getiren amatör branşlar ne yazık ki yeterli ilgiyi ve desteği göremiyor. Tesisleşme sorunları, sponsor eksikliği ve medya görünürlüğünün azlığı, yetenekli genç sporcuların potansiyellerini gerçekleştirmesinin önünde büyük bir engel oluşturuyor. Futbol hegemonyasının gölgesinde var olma savaşı veren amatör sporların ve sporcuların yaşadığı zorlukları gündeme taşıyoruz.",
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
    description: "Gezi Direnişi'nden bugüne taraftar gruplarının toplumsal muhalefet içindeki aktif rolü, 'spor siyasetin dışındadır' ezberini çoktan bozdu. Çarşı grubundan üniversite tribünlerine kadar uzanan örgütlü taraftar yapıları, sadece takımlarını desteklemekle kalmıyor, aynı zamanda adalet ve demokrasi taleplerini de stadyumlarda haykırıyor. Tribünlerin birer kamusal alan olarak politik işlevini ve taraftar kültürünün sosyopolitik dinamiklerini inceliyoruz.",
    author: "Ulaş Tribün",
    place: "Sosyoloji",
    location: "Beşiktaş",
    issueNumber: 480,
    publishedDate: new Date("2025-06-01"),
    firstMedia: {
      href: "/articles/spor-ve-politika",
      type: "image",
      src: "https://reformsports.com/wp-content/uploads/2023/10/teleskopik-tribun-malzemeleri-nelerdir.jpg"
    },
    category: getLabel("spor"),
    tags: [getLabel("sokak kültürü", "tag"), getLabel("siyaset", "tag"), getLabel("demokrasi", "tag")],
    content: [{ blockContent: { type: "text", textContent: "Çarşı grubu ve tribün sloganları..." } }]
  },
  {
    href: "/articles/espor-yukselisi",
    title: "Espor: Spor mu Eğlence mi?",
    description: "Dijital oyun dünyasının hızla büyümesiyle birlikte hayatımıza giren espor, stadyumları dolduran izleyicileri ve milyon dolarlık ödül havuzlarıyla geleneksel spora rakip oluyor. Fiziksel aktivite içermediği gerekçesiyle spor sayılıp sayılmayacağı tartışılsa da, gerektirdiği refleks, strateji ve takım oyunu, onu yeni nesil bir rekabet alanı haline getiriyor. Gençlik kültürünün merkezine yerleşen esporun ekonomisini ve geleceğini mercek altına alıyoruz.",
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
    description: "Modern sporun en büyük gölgesi olan doping, 'daha hızlı, daha yüksek, daha güçlü' sloganının sınırlarını zorlarken etik değerleri ve sporcu sağlığını tehdit ediyor. Devlet destekli doping programlarından bireysel hırslara kadar uzanan bu karanlık ağ, haksız rekabet yaratarak sporun adalet duygusunu zedeliyor. Rusya'nın olimpiyatlardan men edilmesine kadar varan skandallar üzerinden, sporda performans artırıcı maddelerin kullanımını ve etik tartışmaları ele alıyoruz.",
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
    description: "Bir zamanlar çocukluğun vazgeçilmez bir parçası olan mahalle maçları, kentsel dönüşüm ve betonlaşan şehirler yüzünden tarihe karışıyor. Sokakların oyun alanı olmaktan çıkıp otoparklara dönüşmesi, sadece bir oyunu değil, komşuluk ilişkilerini ve sokak kültürünü de yok ediyor. 'Üç korner bir penaltı' devrinin kapanışını, değişen kent sosyolojisi ve çocukların oyun hakkı üzerinden hüzünlü bir nostaljiyle anlatıyoruz.",
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

export const FEED_ARTICLES: FeedCardProps[] = [
  {
    href: "/haber/kyk-yurtlari-son-durum",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80", // Öğrenci yurdu/bina görseli
      alt: "Öğrenci yurtları binası",
      mediaLayout: "full-width"
    },
    title: "Barınma Sorunu ve Öğrencilerin Talepleri: Neler Değişmeli?",
    description: "Üniversite öğrencilerinin en büyük sorunu haline gelen barınma krizi, yetersiz yurt kapasiteleri ve fahiş kira artışlarıyla giderek derinleşiyor. Öğrenciler, sağlıklı ve güvenli barınma hakları için kampüslerde ve sokaklarda taleplerini dile getirirken, yetkililerden somut adımlar bekliyor. Bu haber dosyasında, yurtlardaki son durumu, öğrencilerin yaşadığı mağduriyetleri ve çözüm önerilerini tüm boyutlarıyla ele alıyoruz.",
    source: "Genç Hayat",
    timeAgo: "2 saat önce",
  },
  {
    href: "/haber/metal-iscileri-grev",
    media: {
      type: "image",
      src: "https://www.evrensel.net/upload/dosya/312981.jpg",
      alt: "Fabrika işçileri çalışırken",
      mediaLayout: "text-width"
    },
    title: "Metal İşçileri Toplu Sözleşme Masasında: Grev Kapıda mı?",
    description: "Yüksek enflasyon karşısında eriyen ücretlerini korumak isteyen on binlerce metal işçisi, toplu sözleşme görüşmelerinde işveren sendikasıyla karşı karşıya geliyor. Sendikaların taleplerinin kabul edilmemesi durumunda grev kararı alacaklarını duyurması, sanayi üretiminde tansiyonu yükseltiyor. Fabrikalarda süren eylemleri, işçilerin taleplerini ve olası bir grevin ekonomiye etkilerini sıcağı sıcağına takip ediyoruz.",
    source: "Evrensel",
    timeAgo: "5 saat önce",
  },
  {
    href: "/haber/kadin-emegi-gorunmeyen-is",
    media: {
      type: "image",
      src: "https://ekmekvegul.net/storage/images/TUUsguAj6blu0DjcQHOMhSVjaqjI5DRpLdmhbw0W.jpeg", // Kadın dayanışması/yürüyüş temsili
      alt: "Kadınların yürüyüşü",
    },
    title: "Ev İçi Görünmeyen Emek ve Kadınların Mücadelesi",
    description: "Kadınların ev içinde harcadığı karşılıksız emek, kapitalist sistemin çarklarının dönmesini sağlayan en büyük gizli sübvansiyonlardan biri olmaya devam ediyor. Temizlikten bakım işlerine kadar uzanan bu ağır yük, kadınların istihdama katılımını engellerken onları ekonomik bağımlılığa sürüklüyor. Bu dosya, 'görünmeyen emek' kavramını verilerle ortaya koyarak, kadınların eşitlik mücadelesindeki yerini vurguluyor.",
    source: "Ekmek ve Gül",
    timeAgo: "1 gün önce",
  },
  {
    href: "/makale/diyalektik-materyalizm-uzerine",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80", // Kitaplar ve okuma
      alt: "Kütüphanede kitaplar",
      mediaLayout: "text-width"
    },
    title: "Diyalektik Materyalizm ve Günümüz Dünyasını Anlamak",
    description: "Marx ve Engels'in geliştirdiği diyalektik materyalizm, sadece 19. yüzyılı değil, günümüzün karmaşık krizlerini anlamak için de güçlü bir yöntem sunuyor. Değişimin, çelişkinin ve hareketin bilimi olarak diyalektik, toplumsal olayları durağan değil, sürekli bir oluş ve yok oluş süreci içinde ele almamızı sağlıyor. Bu teorik inceleme, felsefi kavramları güncel politik ve ekonomik olaylarla ilişkilendirerek okura yeni bir bakış açısı kazandırıyor.",
    source: "Teori ve Eylem",
    timeAgo: "2 gün önce",
  },
  {
    href: "/haber/lise-festivalleri-yasaklar",
    media: {
      type: "image", // GIF yerine çalışan bir konser görseli (Unsplash gif desteklemez, jpg koydum)
      src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
      alt: "Festival kalabalığı",
      mediaLayout: "full-width"
    },
    title: "Lise Festivallerine Yönelik Yasaklar ve Gençliğin Tepkisi",
    description: "Son dönemde birçok lise festivalinin 'milli ve manevi değerlere aykırılık' gerekçesiyle iptal edilmesi, gençler arasında büyük bir tepki ve hayal kırıklığı yarattı. Sosyal ve kültürel etkinliklerin kısıtlanmasını yaşam tarzına müdahale olarak gören liseliler, forumlar ve sosyal medya aracılığıyla seslerini duyurmaya çalışıyor. Yasakların ardındaki zihniyeti ve gençliğin özgürlük taleplerini öğrencilerle konuşarak haberleştirdik.",
    source: "Genç Hayat",
    timeAgo: "3 gün önce",
  },
  {
    href: "/haber/asgari-ucret-tartisilari",
    media: {
      type: "image",
      src: "https://cdnuploads.aa.com.tr/uploads/Contents/2025/12/23/thumbs_b_c_83fdb8bec75c3adfaff9e2c2ba79eaa6.jpg?v=184956", // Market alışverişi/hesap
      alt: "Market alışveriş sepeti"
    },
    title: "Asgari Ücret Tespit Komisyonu Toplanıyor: Beklentiler Ne?",
    description: "Milyonlarca çalışanı doğrudan ilgilendiren asgari ücret görüşmeleri, yüksek enflasyonun gölgesinde ve geçim sıkıntısının had safhaya ulaştığı bir ortamda başlıyor. İşçi sendikaları, insan onuruna yaraşır bir ücret talep ederken, işveren tarafı maliyet artışlarını gerekçe göstererek temkinli yaklaşıyor. Komisyon masasında konuşulan rakamları, açlık ve yoksulluk sınırlarını ve sokağın nabzını bu haberde tutuyoruz.",
    source: "Evrensel",
    timeAgo: "4 gün önce",
  },
  {
    href: "/haber/istanbul-sozlesmesi-vazgecmiyoruz",
    media: {
      type: "image",
      src: "https://ekmekvegul.net/storage/images/EFFKJOdoL505vCTJZUYcNiuTcI0pbSMcOWP373gP.jpeg", // Eylem/Protesto kalabalığı
      alt: "Meydandaki kalabalık",
      mediaLayout: "full-width"
    },
    title: "İstanbul Sözleşmesi'nden Vazgeçmiyoruz: Alanlardan Mesajlar",
    description: "İstanbul Sözleşmesi'nden çıkılmasının üzerinden geçen zamana rağmen kadınlar, kazanılmış haklarından vazgeçmemekte kararlı olduklarını her fırsatta haykırıyor. Türkiye'nin dört bir yanında düzenlenen eylemlerde bir araya gelen kadın örgütleri, sözleşmenin yeniden yürürlüğe girmesi için mücadeleyi büyüteceklerini vurguluyor. Alanlardan yükselen 'İstanbul Sözleşmesi Yaşatır' sloganlarının ardındaki direnci ve kararlılığı aktarıyoruz.",
    source: "Ekmek ve Gül",
    timeAgo: "5 gün önce",
  },
  {
    href: "/makale/emperyalizm-ve-savas",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80", // Dünya haritası
      alt: "Dünya haritası",
    },
    title: "Emperyalizm Çağında Savaş ve Barış Politikaları",
    description: "Lenin'in emperyalizm tahlilinden yola çıkarak, bugün dünyanın farklı coğrafyalarında süren bölgesel savaşların ve vekalet savaşlarının ekonomi-politiğini inceliyoruz. Enerji kaynaklarının paylaşımı, pazar rekabeti ve silah endüstrisinin kâr hırsı, barışın önündeki en büyük engeller olarak varlığını koruyor. Bu makale, emperyalist rekabetin halklar üzerinde yarattığı yıkımı ve gerçek bir barışın ancak anti-emperyalist bir mücadeleyle mümkün olabileceğini savunuyor.",
    source: "Teori ve Eylem",
    timeAgo: "1 hafta önce",
  },
  {
    href: "/kultur/yeni-cikan-filmler-inceleme",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80", // Sinema salonu
      mediaLayout: "full-width",
      alt: "Sinema salonu koltukları"
    },
    title: "Bu Ay Vizyona Giren Filmler ve Eleştirel Bir Bakış",
    description: "Sinema salonlarında bu ay vizyona giren yerli ve yabancı yapımları, sadece teknik özellikleriyle değil, içerdiği toplumsal mesajlarla da ele alıyoruz. Bağımsız sinemanın özgün örneklerinden gişe rekorları kıran popüler filmlere kadar geniş bir yelpazeyi kapsayan seçkimiz, izleyiciye nitelikli bir rehber sunmayı amaçlıyor. Sanatın ticarileşmesi ve kültürel hegemonya tartışmaları ışığında, beyaz perdede neleri izlediğimizi sorguluyoruz.",
    source: "Genç Hayat",
    timeAgo: "1 hafta önce",
  },
  {
    href: "/haber/cevre-mucadelesi-akbelen",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=80", // Orman/Ağaçlar
      alt: "Yeşil orman",
      href: "/galeri/akbelen-fotograflari"
    },
    title: "Doğa Talanına Karşı Köylülerin Direnişi Sürüyor",
    description: "Akbelen Ormanı'nda kömür madeni sahasını genişletmek için yapılan ağaç kesimine karşı köylülerin ve çevrecilerin başlattığı nöbet eylemi kararlılıkla devam ediyor. Jandarma müdahalesine ve baskılara rağmen yaşam alanlarını savunan İkizköylüler, doğa talanının sadece ağaçları değil, bir kültürü ve geleceği de yok ettiğini haykırıyor. Bu haberde, direniş alanındaki atmosferi, hukuk mücadelesindeki son durumu ve köylü kadınların en ön saftaki mücadelesini paylaşıyoruz.",
    source: "Evrensel",
    timeAgo: "2 hafta önce",
  },
];