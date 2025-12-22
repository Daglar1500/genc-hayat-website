import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001; 

app.use(cors());
app.use(express.json());

// --- MOCK DATABASE ---

// 1. Categories Table
let DB_CATEGORIES = [
  { id: 'c1', name: 'Güncel', color: '#90CAF9' },       // Blue
  { id: 'c2', name: 'Tarih', color: '#CE93D8' },        // Purple
  { id: 'c3', name: 'Kuram', color: '#A5D6A7' },        // Green
  { id: 'c4', name: 'Felsefe', color: '#FFCC80' },      // Orange
  { id: 'c5', name: 'Kültür-Sanat', color: '#F48FB1' }, // Pink
  { id: 'c6', name: 'Dünya', color: '#80CBC4' },        // Teal
  { id: 'c7', name: 'Spor', color: '#EF9A9A' },         // Red
];

// 2. Labels Table
let DB_LABELS = [
  "Felsefe", "Düşünce Tarihi", "Marksizm", "Kadın", "Sosyal Teori", "Postmodernizm",
  "Eleştirel Teori", "Varoluşçuluk", "Aydınlanma", "Kuram", "Bilim Felsefesi", 
  "Etik ve Ahlak", "İnsan Doğası", "Yabancılaşma", "Diyalektik Materyalizm", 
  "Tarihsel Materyalizm", "Materyalizm", "İdealizm", "Pozitivizm", "Yapısalcılık", 
  "Anti-Emperyalizm", "Emperyalizm", "Kapitalizm", "Sosyalizm", "Komünizm", 
  "Faşizm", "Neoliberalizm", "Antifaşizm", "Ulusal Kurtuluş Mücadeleleri", 
  "Kürt Hareketi", "Anadil", "Sınıf Mücadelesi", "Sosyoloji", "Gençlik Sosyolojisi", 
  "Toplumsal Cinsiyet", "Psikoloji", "Akran İlişkileri", "Kent Sosyolojisi", 
  "Göç", "Yoksulluk", "Eşitsizlik", "Birey ve Toplum"
];

// 3. Articles Table
let DB_ARTICLES = [];

// Generators for Fake Data (TURKISH)
const TITLES = [
  "Doğanın Diyalektiği", "21. Yüzyılda Kent Yoksulluğu", "Modern Varoluşçuluk", 
  "Neoliberalizmin Krizi", "Yapay Zeka Çağında Sanat", "Bugün Tarihsel Materyalizm",
  "Göçün Psikolojisi", "Avrupa'da Gençlik Hareketleri", "Kuantum Felsefesi",
  "Emeğin Geleceği", "Ekolojik Marksizm", "Hakikat Sonrası Siyaset"
];
const AUTHORS = ["Zeynep Yılmaz", "Ahmet Demir", "Ali Kaya", "Ayşe Şahin", "Mehmet Çelik", "Elif Öztürk", "Can Yıldız"];
const PLACES = ["İstanbul", "Ankara", "İzmir", "Diyarbakır", "Berlin", "Londra", "Paris", "New York"];
const SCHOOLS = [
  "Biyoloji Bölümü, ODTÜ", "Sosyoloji Bölümü, Boğaziçi", "Esenyurt, İstanbul", 
  "Kadıköy Anadolu Lisesi", "Hukuk Fakültesi, Ankara Üni.", "Felsefe, Galatasaray Üni.", 
  "Tuzluçayır, Ankara", "Bornova Anadolu Lisesi", "Siyasal Bilgiler, Mülkiye", 
  "İletişim Fakültesi, Marmara"
];
const IMAGES = [
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80"
];

const TURKISH_LOREM = "Boğaziçi Direnişi döneminde üniversitedeki öğrenci hareketine damgasını vuran birçok mücadele inisiyatifi 2020-2021 yıllarında popülerdi. Tüm Boğaziçi öğrencilerine açık olan bu inisiyatifler, yapısı inisiyatifin çizdiği, tabii ki süreç içinde değişime uğrayabilen çerçeve içinde mücadelenin örgütlenebilmesi için bir imkân taşıyordu.";

const seedArticles = () => {
  for (let i = 0; i < 50; i++) {
    const title = TITLES[i % TITLES.length] + (Math.floor(i/TITLES.length) > 0 ? ` ${Math.floor(i/TITLES.length)+1}` : "");
    DB_ARTICLES.push({
      id: `art-${i}`,
      title: title,
      subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + TURKISH_LOREM.substring(0, 100) + '...',
      author: AUTHORS[i % AUTHORS.length],
      editorName: (i % 3 === 0) ? 'Admin' : (i % 3 === 1 ? 'Selin' : 'Veli'),
      place: PLACES[i % PLACES.length],
      school: SCHOOLS[i % SCHOOLS.length],
      content: [
        { id: 'b1', type: 'paragraph', value: TURKISH_LOREM }
      ],
      imageUrl: IMAGES[i % IMAGES.length],
      labels: [DB_LABELS[i % DB_LABELS.length]],
      category: DB_CATEGORIES[i % 7].name,
      issueNumber: `${40 + (i % 10)}`,
      createdAt: Date.now() - (i * 86400000),
      status: i % 4 === 0 ? 'edited' : 'not-edited'
    });
  }
};
seedArticles();

// 4. Sections Table
let DB_SECTIONS = [
  { id: 'sec-feed', type: 'article-feed', isPinned: true, title: null, coverImage: null, preface: null, issueNumber: null, routeArticleId: null },
  { id: 'sec-main', type: 'main-row', isPinned: false, title: null, coverImage: IMAGES[0], preface: "sunuyu giriniz...", issueNumber: '45', routeArticleId: 'art-0' },
  { id: 'sec-ord', type: 'ordinary-row', isPinned: false, title: null, coverImage: null, preface: null, issueNumber: null, routeArticleId: null },
  { id: 'sec-spot', type: 'spot-row', isPinned: false, title: null, coverImage: null, preface: null, issueNumber: null, routeArticleId: null },
  { id: 'sec-cat-1', type: 'category-row', isPinned: false, title: 'Felsefe', coverImage: null, preface: null, issueNumber: null, routeArticleId: null },
];

// 5. Section_Articles Junction
let DB_SECTION_ARTICLES = [
  ...Array.from({length: 45}).map((_, i) => ({ sectionId: 'sec-feed', articleId: `art-${i}`, sortOrder: i })),
  { sectionId: 'sec-ord', articleId: 'art-1', sortOrder: 0 },
  { sectionId: 'sec-ord', articleId: 'art-2', sortOrder: 1 },
  { sectionId: 'sec-ord', articleId: 'art-5', sortOrder: 2 },
  { sectionId: 'sec-ord', articleId: 'art-6', sortOrder: 3 },
  { sectionId: 'sec-spot', articleId: 'art-3', sortOrder: 0 },
  ...Array.from({length: 12}).map((_, i) => ({ sectionId: 'sec-cat-1', articleId: `art-${i+10}`, sortOrder: i })),
];

// --- API ENDPOINTS ---

app.get('/api/init', (req, res) => {
  const fullSections = DB_SECTIONS.map(section => {
    const relations = DB_SECTION_ARTICLES
      .filter(rel => rel.sectionId === section.id)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const articles = relations.map(rel => DB_ARTICLES.find(a => a.id === rel.articleId)).filter(Boolean);
    
    let routeArticle = null;
    if (section.routeArticleId) {
      routeArticle = DB_ARTICLES.find(a => a.id === section.routeArticleId);
    }

    return { ...section, articles, routeArticle };
  });

  res.json({
    sections: fullSections,
    articles: DB_ARTICLES,
    categories: DB_CATEGORIES,
    labels: DB_LABELS
  });
});

app.post('/api/articles', (req, res) => {
  const newArticle = req.body;
  if (!newArticle) return res.status(400).json({ error: "No data" });
  if (!newArticle.id) newArticle.id = `art-${Date.now()}`;
  DB_ARTICLES.unshift(newArticle);
  res.json(newArticle);
});

app.put('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const idx = DB_ARTICLES.findIndex(a => a.id === id);
  if (idx !== -1) {
    DB_ARTICLES[idx] = { ...DB_ARTICLES[idx], ...updatedData };
    res.json(DB_ARTICLES[idx]);
  } else {
    res.status(404).send('Not found');
  }
});

app.post('/api/layout/save', (req, res) => {
  const sectionsFromFrontend = req.body;
  DB_SECTIONS = sectionsFromFrontend.map(s => ({
    id: s.id, type: s.type, title: s.title, isPinned: s.isPinned,
    coverImage: s.coverImage, preface: s.preface, issueNumber: s.issueNumber,
    routeArticleId: s.routeArticle ? s.routeArticle.id : null
  }));

  DB_SECTION_ARTICLES = [];
  sectionsFromFrontend.forEach(section => {
    section.articles.forEach((art, index) => {
      DB_SECTION_ARTICLES.push({ sectionId: section.id, articleId: art.id, sortOrder: index });
    });
  });
  res.json({ success: true });
});

app.post('/api/categories', (req, res) => {
  const newCat = req.body;
  if(!newCat.id) newCat.id = `c-${Date.now()}`;
  DB_CATEGORIES.push(newCat);
  res.json(newCat);
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  DB_CATEGORIES = DB_CATEGORIES.filter(c => c.id !== id);
  res.json({ success: true });
});

app.post('/api/labels', (req, res) => {
  const { label } = req.body;
  if(label && !DB_LABELS.includes(label)) DB_LABELS.push(label);
  res.json({ success: true, label });
});

app.delete('/api/labels/:name', (req, res) => {
  const { name } = req.params;
  DB_LABELS = DB_LABELS.filter(l => l !== name);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`CMS Backend running on http://localhost:${PORT}`);
});