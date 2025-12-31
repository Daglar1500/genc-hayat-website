import React, { useState, useRef } from 'react';
import gh_cover from '../../../../public/gh-kapak/gh.jpg';
import rotaImage from '../../../../public/pusula.png';

export const MainSection = () => {
  const [isSunuOpen, setIsSunuOpen] = useState(false);
  const [isRotaOpen, setIsRotaOpen] = useState(false);
  
  // Scroll referansı kaldırıldı

  const handleRotaToggle = () => {
    setIsRotaOpen(!isRotaOpen);
  };

  return (
    <section className="py-16 md:py-24 bg-white border-t border-gray-200 font-bradford">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* SOL TARA (Kapak + Sunu + Rota) - 9 Sütun */}
          <div className="lg:col-span-9 flex flex-col gap-16">
            
            {/* 1. BÖLÜM: Kapak ve Sunu */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              
              {/* Dergi Kapağı */}
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="relative w-full shadow-2xl transition-transform hover:-translate-y-2 duration-500">
                    <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                       <img 
                         src={gh_cover} 
                         alt="Genç Hayat Sayı 497 Kapak" 
                         className="absolute inset-0 w-full h-full object-cover"
                       />
                       <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                         Sayı #497
                       </div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                   <button className="w-full py-3 border border-black text-black font-bold uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors">
                     Sayıyı İncele
                   </button>
                </div>
              </div>

              {/* Sunu Yazısı (Accordion) */}
              <div className="w-full md:w-2/3">
                <div className="mb-4">
                   <span className="text-red-600 font-bold text-xs uppercase tracking-widest border-b-2 border-red-600 pb-1">Sunu</span>
                </div>
                
                <div 
                  className="cursor-pointer group" 
                  onClick={() => setIsSunuOpen(!isSunuOpen)}
                >
                  <div className={`prose prose-lg text-zinc-800 font-serif leading-relaxed text-justify relative ${!isSunuOpen ? 'line-clamp-[10] overflow-hidden' : ''}`}>
                    <p className="mb-4">
                      İçinde bulunduğumuz dönem, gençlik kitlelerinin sadece ekonomik kaygılarla değil, aynı zamanda varoluşsal bir belirsizlikle de mücadele ettiği bir süreç. Üniversite kampüslerinden lise sıralarına kadar uzanan bu huzursuzluk, aslında yeni bir arayışın da habercisi.
                    </p>
                    <p className="mb-4">
                      Bu sayımızda, "Geleceksizlik" kavramını sadece bir karamsarlık ifadesi olarak değil, değiştirilmesi gereken bir gerçeklik olarak ele alıyoruz. Sokaklardan yükselen sesler, bize başka bir dünyanın mümkün olduğunu fısıldıyor. Sanatın, edebiyatın ve politikanın kesişim noktasında duran gençlik, kendi tarihini yazmaya hazırlanıyor.
                    </p>
                    {isSunuOpen && (
                      <div className="animate-in fade-in duration-500">
                        <p className="mb-4">
                          Derginin sayfalarını çevirdikçe göreceksiniz ki, her bir satır aslında kolektif bir çabanın ürünü. Editörlerimizden yazarlarımıza, çizerlerimizden okurlarımıza kadar herkesin katkısıyla şekillenen bu sayı, umudun örgütlü halidir.
                        </p>
                        <p>
                          Bizler, Genç Hayat olarak, sadece bugünü değil, yarını da kurma iddiasındayız. Bu sunu, sadece bir başlangıç. Asıl hikaye, sizlerin bu dergiyi okuyup, tartışıp, eyleme geçmesiyle yazılacak. İyi okumalar.
                        </p>
                      </div>
                    )}
                    
                    {!isSunuOpen && (
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none group-hover:from-gray-50 transition-colors"></div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider group-hover:text-red-700">
                    <span>{isSunuOpen ? 'Kapat' : 'Devamını Oku'}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform duration-300 ${isSunuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/initials/svg?seed=Editor" alt="Editör" className="w-full h-full object-cover" />
                   </div>
                   <div className="text-xs text-zinc-400 font-medium">
                      Genç Hayat Yayın Kurulu
                   </div>
                </div>
              </div>
            </div>

            {/* 2. BÖLÜM: Rota Yazısı (Alt Kısım - Sol Sütun İçinde) */}
            <div className="border-t border-gray-100 pt-12 relative w-full">
                <div className="mb-6">
                   <span className="text-red-600 font-bold text-xs uppercase tracking-widest border-b-2 border-red-600 pb-1">Rota</span>
                </div>

                <div 
                  className={`bg-zinc-50 p-8 md:p-12 rounded-sm cursor-pointer group hover:bg-zinc-100 transition-colors relative ${isRotaOpen ? 'shadow-lg bg-zinc-100' : ''}`}
                  onClick={handleRotaToggle}
                >
                   {/* Rota Image */}
                   <div className="absolute top-8 right-8 w-24 md:w-32 hidden md:block">
                      <img src={rotaImage} alt="Rota" className="w-full h-auto object-contain opacity-90 drop-shadow-sm rotate-3" />
                   </div>

                   {/* Header Area */}
                   <div className="md:max-w-[75%]">
                     <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 leading-tight">
                       Pusulasız Zamanlarda Yön Bulmak
                     </h2>
                     <p className="text-xl text-zinc-500 font-serif italic mb-8">
                        Saray rejimine karşı rotamız, Erdal Eren'in bize bıraktığı en önemli mirastan geçiyor: Bizi çaresiz hissettirmeye çalışan sermaye düzenine karşı örgütlü gücümüzü kullanmak.
                     </p>
                   </div>

                   {/* Full Text Content - Değişiklik Burada */}
                   {/* isRotaOpen false ise line-clamp ile kısaltıyoruz, true ise tam metin */}
                   {/* h-0 overflow-hidden yerine line-clamp kullandık */}
                   <div className={`prose prose-lg text-zinc-800 font-serif leading-relaxed text-justify relative transition-all duration-500 ${!isRotaOpen ? 'line-clamp-3 overflow-hidden mask-bottom' : ''}`}>
                      <p className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-black first-letter:mr-3 first-letter:float-left">
                       Erdal Eren'in 12 Eylül faşist cuntasınca idam edilişinin üzerinden 45 yıl geçti. Erdal, o dönemde Ankara Ortaöğrenimliler Derneği (ANOD) bünyesinde örgütlenmiş, işçi sınıfı mücadelesinin ilk adımlarını atan kararlı bir meslek lisesi öğrencisiydi. Onu 17 yaşında idam sehpasına gönderen faşist diktatörlük, bu genç militanın kararlılığından, zekâsından ve taşıdığı kolektif bilinçten korkmuştu. Dün Erdal'ın hayatını bir imzayla alan rejim, bugün faili “makineler” olan bir cinayet düzeni yaratıyor. Kendi kurallarını yazarak oynadığı bu oyunda daha fazla kâr için daha fazla genci esnek, denetimsiz, ucuz iş koşullarına kurban ediyor. İktidar halkın daha da yoksullaşması ve bu sırada sermayedarların kârına kâr katmasından beslenirken, faşizm buna itiraz eden her kesimi susturma çabasıyla inşa ediliyor.
                       </p>
                      <p className="mb-6">
                        <strong>Yoksulluk her geçen gün daha da derinleşiyor</strong><br/>
                        Bugün Erdal gibi meslek liseli olan yüz binlerce genç, MESEM (Mesleki Eğitim Merkezleri) adı altında, denetimsiz, sigortasız işyerlerine adeta sürülüyor. Bu gençler münferit olayların değil, bizzat iktidarın ve patronların koruması altındaki bir sömürü politikasının kurbanı oluyorlar. Çünkü MESEM uygulaması çocuk işçiliğini ortadan kaldırmak bir yana, yasallaştıran ve normalleştiren bir araç olarak işliyor. Bu programla resmî “öğrenci-çalışan” hâline getirilen yüz binlerce liseli, okul sıralarıyla fabrikalar, atölyeler, inşaat şantiyeleri arasında mekik dokuyor. Bunun için görevlendirilmiş öğretmenler denetime gelmediğinden, bu programın esas amacı meslek öğretmek değil, Türkiye kapitalizmine ucuz iş gücü kazandırmak olduğu için birçok iş kazası ve cinayeti yaşanıyor. Ölen her genç, Alperen, Yağız, Arda, Erol, Ulaş ve ismi dahi duyulmayan onlarca başka çocuk, bu topraklarda bir kez daha sömürünün ve ihmalkârlığın cezasını ödüyor.
                      </p>
                      <p className="mb-6">
                        Bir yanda holdinglerin vergi borçları silinirken, diğer yanda gençlere sunulan burslar sadece bir kahve parasına yetiyor, yurtlarda sıcak su ve nitelikli barınma gibi temel ihtiyaçlar dahi karşılanmıyor. Bir yağmurla kampüsler sel altında kalıyor, yurtlarda kaloriferler patlıyor. Kamudan tasarruf demenin “canınızı hiçe sayıyoruz” demek olduğu her geçen gün daha da berraklaşıyor. 2026 bütçe planıyla da bütçenin giderek yoksullaşan gençliğe değil, patronlara ayrılacağı görülüyor. Gençliğe biraz da olsa ayrıldığı açıklanan bütçenin nereye harcandığı ise, sınıflara, yemekhanelere, yurtlara şöyle bir bakınca merak konusu oluyor. Çok çalışıp iyi bir üniversite kazanmaya çalışan gençlere de bir tezgâhın başında mesleğini eline almaya çalışan gençlere de insanca bir yaşam reva görülmüyor. Tüm bu sorunların kökeninde yatan tek bir gerçek yatıyor: Gençliği ucuz emek olarak gören ve bunun böyle kalması için onu pasifize etmeye çalışan sermaye sınıfının diktatörlüğü.
                      </p>
                      <p className="mb-6">
                        <strong>Saray’ın en büyük korkusu örgütlü mücadelemizdir!</strong><br/>
                        İnşa edilmeye çalışılan faşist rejim saldırıların ve sömürünün dozunu artırırken gençlik de buna sessiz kalmıyor elbette. Birçok şehirde, mahallede, lisede iktidarın çocukları kendi eliyle bu tezgahlara sürüyor olması teşhir ediliyor. Nasıl bir mesleki eğitim hayal edilebileceği konuşuluyor. Yoksulluk sebebiyle çareyi okurken çalışmakta bulan, bir yandan mesleğini eline almayı uman gençliğe esas ihtiyacı olan bursun sağlanması talebi tartışılıyor. Geçtiğimiz haftalarda Milli Eğitim Bakanlığı’nın düzenlediği Mesleki Eğitim Zirvesi’ni, bu cinayet rejimine dur demek için protesto eden gençler de bu itirazların bir örneğiydi. Fakat iktidar haftalardır gündemde olan çocuk işçi cinayetlerinin sorumlularını bulmak, onları cezalandırmak yerine o çocukların ölmesine karşı çıkan 16 genci tutukladı. Bu olay, Erdal Eren’in hukuksuz bir şekilde, aceleyle infaz edilmesini hatırlatıyor; gençliğin örgütlü bilincinden duyulan korkunun bugünkü tezahürü olarak karşımıza çıkıyor.
                      </p>
                      <p className="mb-6">
                        Bugün, Saray rejiminin yol haritası apaçık önümüzde duruyor. Bizim rotamız ise Erdal Eren'in bize bıraktığı en önemli mirastan geçiyor: Bizi çaresiz hissettirmeye çalışan sermaye düzenine karşı örgütlü gücümüzü kullanmak. Erdal'ı bir kahraman yapan, yalnızca idam kararı karşısındaki cesareti değil, partili bilinci ve bir siyasi iradenin parçası olma kararlılığıydı. Erdal, yoldaşı Sinan Suner’in polis işkencesiyle katledilmesine itiraz etmişti, yine onun idamına itiraz eden de bir Ercan Koca vardı. Onların örgütlülüğü, birbirlerini yalnız bırakmayışları, iktidarın sopası bin kere gençliğin üstüne inse de gençliğin bin bir kere ayağa kalkarken dayanacağı gücü oluşturuyordu. Bugün ise, tıpkı o zamanki gibi, geleceklerini kendi ellerine almak isteyen tüm gençler aynı sömürü çarkına karşı ortak bir mücadele zemininde birleşmek zorunda. Artık sadece itiraz etmek yetmez; örgütlenmeli, güç biriktirmeli ve bu cinayet rejiminin temelini sarsacak kararlılığı göstermeliyiz. Yoksulluk ve ölüm cenderesinden çıkışın tek yolu, Erdal Eren'in bize gösterdiği gibi, haklı olmaktan gelen cesareti kuşanarak; her alanda, her gün daha ısrarlı bir şekilde birleşmek ve bu düzeni değiştirmekte yatıyor. Canımıza kasteden sınıfı ortadan kaldırabilecek sosyalist bir düzen, ancak bu kararlı örgütlü iradenin ellerinde filizlenebilir.
                      </p>
                      <p className="mb-6">
                        Sermaye sınıfının karşısında gençliği, geleceği yutulmak istenen gençler olarak aynı sınıftayız, bir kuşağız ve ortak kaderi paylaşıyoruz. Meslek liseli gençlik, üniversiteli gençlik, emekçi gençlik; fabrikada, şantiyede, sokakta, okulda nefes alan her genç birbirine ve işçi sınıfına bağlı. Çünkü yoksulluk, güvencesizlik, gelecek kaygısı, sermayenin sınırsız talepleri hepimizin sorunu. O yüzden 17’sinde asılan Erdal’ın mücadele bayrağını devralmak, bugünümüzün ve yarınımızın sorumluluğudur. Örgütlenmek, bir araya gelmek, sesimizi duyurmak bir tercih değil, zorunluluktur. 16 genci tutuklayanlar, protestoları zapt-u rapt altına almaya çalışanlar, aslında bu gerçekliği itiraf ediyor: Çünkü onlar da biliyor, gençliğin örgütlü mücadelesi boşluğa değil, umuda tutunmak anlamına geliyor. İşte şimdi, bu coğrafyada gençlik olarak omuz omuza durma, mezarlık fiyatına alınan emeğe dur demek zamanı. Geleceğimiz sermaye patronlarının kâr hanesine yazıldığı sürece; mücadelemizi bilimsel sosyalizm ışığında örgütlemek bizim en gerçek silahımız. Bugünün gençliği, geçmişin acılarını omuzlarında taşırken yarının adaleti için kendi kaderini kendi ellerine almak zorunda. O yüzden Erdal’ın mirasını bu sene daha güçlü hatırlatalım: “Faşizme Geçit Yok, Erdallar Yaşayacak, Sosyalizm Kazanacak!”
                      </p>
                      
                      {/* Fade Effect when closed */}
                      {!isRotaOpen && (
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-zinc-50 to-transparent pointer-events-none group-hover:from-zinc-100 transition-colors"></div>
                      )}
                   </div>

                   <div className={`flex items-center gap-2 text-black font-bold text-xs uppercase tracking-wider mt-4 ${!isRotaOpen ? '' : 'pt-4 border-t border-gray-200'}`}>
                      <span>{isRotaOpen ? 'Yazıyı Kapat' : 'Yazıyı Oku'}</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 transition-transform duration-300 ${isRotaOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                   </div>
                </div>
            </div>

          </div>

          {/* SAĞ TARA (Pusula Şeridi) - 3 Sütun */}
          <div className="lg:col-span-3 lg:border-l lg:border-gray-100 lg:pl-12 lg:min-h-screen">
             {/* Sticky top değeri "Rota" ile hizalamak için biraz daha aşağıya çekilebilir veya margin eklenebilir. 
                 Rota'nın hizasına denk gelmesi için top-24 yerine Rota'nın başladığı yer hesaplanabilir ama 
                 statik olarak "sticky" ve "top-xxx" kullanmak en kolayıdır. */}
             <div className="sticky top-24 transition-all duration-500">
               <div className="mb-8">
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Bu Ayın Pusulası</span>
                 <div className="h-0.5 w-12 bg-black mt-2"></div>
               </div>

               <div className="space-y-10">
                 
                 {/* 1. KART (Her zaman görünür) */}
                 <article className="group cursor-pointer">
                   <div className="overflow-hidden mb-3 rounded-sm">
                      <img 
                        src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80" 
                        alt="Kitap" 
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                   </div>
                   <span className="text-[10px] font-bold text-red-600 uppercase mb-1 block">Kitap</span>
                   <h4 className="font-bold text-zinc-900 leading-tight mb-2 group-hover:text-red-600 transition-colors">
                     Tutunamayanlar'ı Yeniden Okumak
                   </h4>
                   <p className="text-xs text-zinc-500 font-serif leading-relaxed line-clamp-3">
                     Oğuz Atay'ın başyapıtı, bugünün gençliğinin hislerine tercüman olmaya devam ediyor.
                   </p>
                 </article>

                 <article className="group cursor-pointer">
                   <div className="overflow-hidden mb-3 rounded-sm">
                      <img 
                        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80" 
                        alt="Sinema" 
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                   </div>
                   <span className="text-[10px] font-bold text-red-600 uppercase mb-1 block">Sinema</span>
                   <h4 className="font-bold text-zinc-900 leading-tight mb-2 group-hover:text-red-600 transition-colors">
                     Kuru Otlar Üstüne: Taşra ve Umut
                   </h4>
                   <p className="text-xs text-zinc-500 font-serif leading-relaxed line-clamp-3">
                     Nuri Bilge Ceylan'ın son filmi, Anadolu'nun kışında insan ruhunun derinliklerine iniyor.
                   </p>
                 </article>

                 <article className="group cursor-pointer">
                   <div className="overflow-hidden mb-3 rounded-sm">
                      <img 
                        src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" 
                        alt="Müzik" 
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                   </div>
                   <span className="text-[10px] font-bold text-red-600 uppercase mb-1 block">Müzik</span>
                   <h4 className="font-bold text-zinc-900 leading-tight mb-2 group-hover:text-red-600 transition-colors">
                     Alternatif Sahnenin Yükselişi
                   </h4>
                   <p className="text-xs text-zinc-500 font-serif leading-relaxed line-clamp-3">
                     Yerel motiflerle bezenmiş modern soundlar, gençliğin yeni marşlarını oluşturuyor.
                   </p>
                 </article>
               </div>

               <div className="mt-10 pt-6 border-t border-gray-100">
                 <a href="/rota" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-red-600 transition-colors">
                   <span>Tüm Öneriler</span>
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M5 12h14M12 5l7 7-7 7"/>
                   </svg>
                 </a>
               </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};