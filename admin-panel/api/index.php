<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('DATA_DIR', __DIR__ . '/data/');

if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// --- HELPERS ---

function readJson($file) {
    $path = DATA_DIR . $file;
    if (!file_exists($path)) return null;
    return json_decode(file_get_contents($path), true);
}

function writeJson($file, $data) {
    file_put_contents(DATA_DIR . $file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// --- SEED DATA ---

$CATEGORIES_DEFAULT = [
    ['id' => 'c1', 'name' => 'Güncel',      'color' => '#90CAF9'],
    ['id' => 'c2', 'name' => 'Tarih',       'color' => '#CE93D8'],
    ['id' => 'c3', 'name' => 'Kuram',       'color' => '#A5D6A7'],
    ['id' => 'c4', 'name' => 'Felsefe',     'color' => '#FFCC80'],
    ['id' => 'c5', 'name' => 'Kültür-Sanat','color' => '#F48FB1'],
    ['id' => 'c6', 'name' => 'Dünya',       'color' => '#80CBC4'],
    ['id' => 'c7', 'name' => 'Spor',        'color' => '#EF9A9A'],
];

$LABELS_DEFAULT = [
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

$TITLES = [
    "Doğanın Diyalektiği", "21. Yüzyılda Kent Yoksulluğu", "Modern Varoluşçuluk",
    "Neoliberalizmin Krizi", "Yapay Zeka Çağında Sanat", "Bugün Tarihsel Materyalizm",
    "Göçün Psikolojisi", "Avrupa'da Gençlik Hareketleri", "Kuantum Felsefesi",
    "Emeğin Geleceği", "Ekolojik Marksizm", "Hakikat Sonrası Siyaset"
];
$AUTHORS  = ["Zeynep Yılmaz", "Ahmet Demir", "Ali Kaya", "Ayşe Şahin", "Mehmet Çelik", "Elif Öztürk", "Can Yıldız"];
$PLACES   = ["İstanbul", "Ankara", "İzmir", "Diyarbakır", "Berlin", "Londra", "Paris", "New York"];
$SCHOOLS  = [
    "Biyoloji Bölümü, ODTÜ", "Sosyoloji Bölümü, Boğaziçi", "Esenyurt, İstanbul",
    "Kadıköy Anadolu Lisesi", "Hukuk Fakültesi, Ankara Üni.", "Felsefe, Galatasaray Üni.",
    "Tuzluçayır, Ankara", "Bornova Anadolu Lisesi", "Siyasal Bilgiler, Mülkiye",
    "İletişim Fakültesi, Marmara"
];
$IMAGES = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80"
];
$TURKISH_LOREM = "Boğaziçi Direnişi döneminde üniversitedeki öğrenci hareketine damgasını vuran birçok mücadele inisiyatifi 2020-2021 yıllarında popülerdi. Tüm Boğaziçi öğrencilerine açık olan bu inisiyatifler, yapısı inisiyatifin çizdiği, tabii ki süreç içinde değişime uğrayabilen çerçeve içinde mücadelenin örgütlenebilmesi için bir imkân taşıyordu.";

// --- INITIALIZE JSON FILES (first run) ---

function initializeData() {
    global $CATEGORIES_DEFAULT, $LABELS_DEFAULT, $TITLES, $AUTHORS, $PLACES, $SCHOOLS, $IMAGES, $TURKISH_LOREM;

    if (!file_exists(DATA_DIR . 'categories.json')) {
        writeJson('categories.json', $CATEGORIES_DEFAULT);
    }

    if (!file_exists(DATA_DIR . 'labels.json')) {
        writeJson('labels.json', $LABELS_DEFAULT);
    }

    if (!file_exists(DATA_DIR . 'articles.json')) {
        $articles = [];
        $editorNames = ['Admin', 'Selin', 'Veli'];
        for ($i = 0; $i < 50; $i++) {
            $titleCount = count($TITLES);
            $suffix = (int)floor($i / $titleCount) > 0 ? ' ' . ((int)floor($i / $titleCount) + 1) : '';
            $articles[] = [
                'id'          => "art-$i",
                'title'       => $TITLES[$i % $titleCount] . $suffix,
                'subheading'  => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' . mb_substr($TURKISH_LOREM, 0, 100) . '...',
                'author'      => $AUTHORS[$i % count($AUTHORS)],
                'editorName'  => $editorNames[$i % 3],
                'place'       => $PLACES[$i % count($PLACES)],
                'school'      => $SCHOOLS[$i % count($SCHOOLS)],
                'content'     => [['id' => 'b1', 'type' => 'paragraph', 'value' => $TURKISH_LOREM]],
                'imageUrl'    => $IMAGES[$i % count($IMAGES)],
                'labels'      => [$LABELS_DEFAULT[$i % count($LABELS_DEFAULT)]],
                'category'    => $CATEGORIES_DEFAULT[$i % 7]['name'],
                'issueNumber' => strval(40 + ($i % 10)),
                'createdAt'   => (time() - ($i * 86400)) * 1000,
                'status'      => $i % 4 === 0 ? 'edited' : 'not-edited',
            ];
        }
        writeJson('articles.json', $articles);
    }

    $defaultSections = [
        ['id' => 'sec-feed',  'type' => 'article-feed',  'isPinned' => true,  'isVisible' => true, 'title' => null, 'coverImage' => null,        'preface' => null,              'issueNumber' => null, 'routeArticleId' => null, 'config' => null],
        ['id' => 'sec-main',  'type' => 'main-row',      'isPinned' => false, 'isVisible' => true, 'title' => null, 'coverImage' => $IMAGES[0],  'preface' => 'sunuyu giriniz...','issueNumber' => '45', 'routeArticleId' => 'art-0', 'config' => null],
        ['id' => 'sec-ord',   'type' => 'ordinary-row',  'isPinned' => false, 'isVisible' => true, 'title' => null, 'coverImage' => null,        'preface' => null,              'issueNumber' => null, 'routeArticleId' => null, 'config' => null],
        ['id' => 'sec-spot',  'type' => 'spot-row',      'isPinned' => false, 'isVisible' => true, 'title' => null, 'coverImage' => null,        'preface' => null,              'issueNumber' => null, 'routeArticleId' => null, 'config' => null],
        ['id' => 'sec-cat-1', 'type' => 'category-row',  'isPinned' => false, 'isVisible' => true, 'title' => 'Felsefe', 'coverImage' => null,  'preface' => null,              'issueNumber' => null, 'routeArticleId' => null, 'config' => null],
        ['id' => 'sec-video', 'type' => 'video-row',     'isPinned' => false, 'isVisible' => true, 'title' => null, 'coverImage' => null,        'preface' => null,              'issueNumber' => null, 'routeArticleId' => null, 'config' => [
            'channelUrl' => 'https://www.youtube.com/@GencHayatt',
            'videos' => [
                ['id' => 'v1', 'title' => "Cumhuriyet'in 100. Yılında Gençlik ve Gelecek Tartışmaları", 'thumbnail' => 'https://www.evrensel.net/images/840/upload/dosya/113047.jpg', 'duration' => '14:20', 'date' => '2 Gün önce', 'url' => 'https://www.youtube.com/@GencHayatt'],
                ['id' => 'v2', 'title' => 'Sokak Röportajı: Gençlerin Ekonomiye Bakışı Nasıl?', 'thumbnail' => 'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=800&auto=format&fit=crop', 'duration' => '08:45', 'date' => '1 Hafta önce', 'url' => 'https://www.youtube.com/@GencHayatt'],
                ['id' => 'v3', 'title' => "Kültür Sanat: İstanbul Bienali'nden Öne Çıkanlar", 'thumbnail' => 'https://kulturbilinci.org/Thumbnail3.ashx?Type=Services&folder=Seminerler&width=600&height=600&url=populerkultur1revize.jpg', 'duration' => '12:10', 'date' => '2 Hafta önce', 'url' => 'https://www.youtube.com/@GencHayatt'],
                ['id' => 'v4', 'title' => 'Teknoloji Dosyası: Yapay Zeka Sanatı Öldürüyor mu?', 'thumbnail' => 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop', 'duration' => '19:05', 'date' => '3 Hafta önce', 'url' => 'https://www.youtube.com/@GencHayatt'],
            ]
        ]],
        ['id' => 'sec-spotify', 'type' => 'spotify-row', 'isPinned' => false, 'isVisible' => true, 'title' => null, 'coverImage' => null, 'preface' => null, 'issueNumber' => null, 'routeArticleId' => null, 'config' => [
            'profileUrl' => 'https://open.spotify.com/user/spotify',
            'playlists' => [
                ['id' => 'p1', 'title' => 'Genç Hayat: Okuma Listesi', 'description' => 'Dergi okurken size eşlik edecek, odaklanmayı artıran enstrümantal seçkiler.', 'cover' => 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cd4da691f9cf0d37ca297656d', 'trackCount' => '42 Şarkı', 'url' => 'https://open.spotify.com/user/spotify'],
                ['id' => 'p2', 'title' => 'Türkçe Alternatif & Indie', 'description' => 'Yerli sahnenin en taze sesleri ve keşfedilmeyi bekleyenler.', 'cover' => 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop', 'trackCount' => '28 Şarkı', 'url' => 'https://open.spotify.com/user/spotify'],
                ['id' => 'p3', 'title' => 'Pazar Sabahı Kahvesi', 'description' => 'Hafta sonuna sakin bir başlangıç için yumuşak tonlar.', 'cover' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', 'trackCount' => '35 Şarkı', 'url' => 'https://open.spotify.com/user/spotify'],
                ['id' => 'p4', 'title' => 'Geçmişten Günümüze: Anadolu Rock', 'description' => 'Efsanevi gitar riffleri ve unutulmaz sözler.', 'cover' => 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop', 'trackCount' => '50 Şarkı', 'url' => 'https://open.spotify.com/user/spotify'],
                ['id' => 'p5', 'title' => 'Rap & Hip-Hop: Yeni Okul', 'description' => 'Sokağın ritmi, güçlü kafiyeler ve yeni nesil sesler.', 'cover' => 'https://images.unsplash.com/photo-1549497554-474c8309df55?q=80&w=800&auto=format&fit=crop', 'trackCount' => '30 Şarkı', 'url' => 'https://open.spotify.com/user/spotify'],
            ]
        ]],
        ['id' => 'sec-letterboxd', 'type' => 'letterboxd-row', 'isPinned' => false, 'isVisible' => true, 'title' => null, 'coverImage' => null, 'preface' => null, 'issueNumber' => null, 'routeArticleId' => null, 'config' => [
            'profileUrl' => 'https://letterboxd.com/genc_hayat/',
            'films' => [
                ['id' => 'f1', 'title' => 'Stalker', 'year' => '1979', 'director' => 'Andrei Tarkovsky', 'rating' => 5, 'posterUrl' => 'https://a.ltrbxd.com/resized/film-poster/5/1/8/3/1/51831-stalker-0-230-0-345-crop.jpg', 'url' => 'https://letterboxd.com/genc_hayat/'],
                ['id' => 'f2', 'title' => 'Parasite', 'year' => '2019', 'director' => 'Bong Joon-ho', 'rating' => 4.5, 'posterUrl' => 'https://a.ltrbxd.com/resized/film-poster/4/7/6/0/5/47605-parasite-0-230-0-345-crop.jpg', 'url' => 'https://letterboxd.com/genc_hayat/'],
                ['id' => 'f3', 'title' => 'Yi Yi', 'year' => '2000', 'director' => 'Edward Yang', 'rating' => 5, 'posterUrl' => 'https://a.ltrbxd.com/resized/film-poster/4/6/1/6/1/46161-yi-yi-0-230-0-345-crop.jpg', 'url' => 'https://letterboxd.com/genc_hayat/'],
                ['id' => 'f4', 'title' => 'Three Colours: Red', 'year' => '1994', 'director' => 'Krzysztof Kieślowski', 'rating' => 5, 'posterUrl' => 'https://a.ltrbxd.com/resized/film-poster/3/8/7/4/6/38746-three-colours-red-0-230-0-345-crop.jpg', 'url' => 'https://letterboxd.com/genc_hayat/'],
                ['id' => 'f5', 'title' => 'Ikiru', 'year' => '1952', 'director' => 'Akira Kurosawa', 'rating' => 5, 'posterUrl' => 'https://a.ltrbxd.com/resized/film-poster/5/1/5/9/2/51592-ikiru-0-230-0-345-crop.jpg', 'url' => 'https://letterboxd.com/genc_hayat/'],
                ['id' => 'f6', 'title' => 'La Dolce Vita', 'year' => '1960', 'director' => 'Federico Fellini', 'rating' => 4.5, 'posterUrl' => 'https://a.ltrbxd.com/resized/film-poster/5/1/3/1/6/51316-la-dolce-vita-0-230-0-345-crop.jpg', 'url' => 'https://letterboxd.com/genc_hayat/'],
            ]
        ]],
        ['id' => 'sec-archive', 'type' => 'archive-row', 'isPinned' => false, 'isVisible' => true, 'title' => null, 'coverImage' => null, 'preface' => null, 'issueNumber' => null, 'routeArticleId' => null, 'config' => null],
    ];

    if (!file_exists(DATA_DIR . 'sections.json')) {
        writeJson('sections.json', $defaultSections);
    } else {
        // Migration: only add isVisible/config fields if missing — never re-add deleted sections
        $sections = readJson('sections.json') ?? [];
        $changed = false;
        foreach ($sections as &$sec) {
            if (!array_key_exists('isVisible', $sec)) { $sec['isVisible'] = true; $changed = true; }
            if (!array_key_exists('config', $sec)) { $sec['config'] = null; $changed = true; }
        }
        unset($sec);
        if ($changed) writeJson('sections.json', $sections);
    }

    if (!file_exists(DATA_DIR . 'issues.json')) {
        writeJson('issues.json', []);
    }

    if (!file_exists(DATA_DIR . 'editors.json')) {
        writeJson('editors.json', ['Admin', 'Selin', 'Veli']);
    }

    if (!file_exists(DATA_DIR . 'section_articles.json')) {
        $sa = [];
        for ($i = 0; $i < 45; $i++) {
            $sa[] = ['sectionId' => 'sec-feed', 'articleId' => "art-$i", 'sortOrder' => $i];
        }
        foreach ([['art-1',0],['art-2',1],['art-5',2],['art-6',3]] as [$aid, $ord]) {
            $sa[] = ['sectionId' => 'sec-ord', 'articleId' => $aid, 'sortOrder' => $ord];
        }
        $sa[] = ['sectionId' => 'sec-spot', 'articleId' => 'art-3', 'sortOrder' => 0];
        for ($i = 0; $i < 12; $i++) {
            $sa[] = ['sectionId' => 'sec-cat-1', 'articleId' => 'art-' . ($i + 10), 'sortOrder' => $i];
        }
        writeJson('section_articles.json', $sa);
    }
}

initializeData();

// --- ROUTER ---

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = rtrim($uri, '/');

// GET /api/init
if ($method === 'GET' && $uri === '/api/init') {
    $sections       = readJson('sections.json')         ?? [];
    $articles       = readJson('articles.json')         ?? [];
    $categories     = readJson('categories.json')       ?? [];
    $labels         = readJson('labels.json')           ?? [];
    $sectionArticles= readJson('section_articles.json') ?? [];

    $fullSections = array_map(function($section) use ($articles, $sectionArticles) {
        $relations = array_filter($sectionArticles, fn($rel) => $rel['sectionId'] === $section['id']);
        usort($relations, fn($a, $b) => $a['sortOrder'] - $b['sortOrder']);

        $sectionArticlesList = array_values(array_filter(array_map(function($rel) use ($articles) {
            foreach ($articles as $a) {
                if ($a['id'] === $rel['articleId']) return $a;
            }
            return null;
        }, $relations)));

        $routeArticle = null;
        if (!empty($section['routeArticleId'])) {
            foreach ($articles as $a) {
                if ($a['id'] === $section['routeArticleId']) { $routeArticle = $a; break; }
            }
        }

        return array_merge($section, ['articles' => $sectionArticlesList, 'routeArticle' => $routeArticle]);
    }, $sections);

    $editors = readJson('editors.json') ?? [];
    respond(['sections' => array_values($fullSections), 'articles' => $articles, 'categories' => $categories, 'labels' => $labels, 'editors' => $editors]);
}

// GET /api/articles (all)
elseif ($method === 'GET' && $uri === '/api/articles') {
    respond(readJson('articles.json') ?? []);
}

// GET /api/articles/:id
elseif ($method === 'GET' && preg_match('#^/api/articles/(.+)$#', $uri, $m)) {
    $id = $m[1];
    $articles = readJson('articles.json') ?? [];
    foreach ($articles as $a) {
        if ($a['id'] === $id || ($a['slug'] ?? '') === $id) {
            respond($a);
        }
    }
    respond(['error' => 'Not found'], 404);
}

// POST /api/articles
elseif ($method === 'POST' && $uri === '/api/articles') {
    $newArticle = json_decode(file_get_contents('php://input'), true);
    if (!$newArticle) respond(['error' => 'No data'], 400);
    if (empty($newArticle['id'])) $newArticle['id'] = 'art-' . round(microtime(true) * 1000);
    $articles = readJson('articles.json') ?? [];
    array_unshift($articles, $newArticle);
    writeJson('articles.json', $articles);
    respond($newArticle);
}

// PUT / PATCH /api/articles/:id
elseif (($method === 'PUT' || $method === 'PATCH') && preg_match('#^/api/articles/(.+)$#', $uri, $m)) {
    $id          = $m[1];
    $updatedData = json_decode(file_get_contents('php://input'), true);
    $articles    = readJson('articles.json') ?? [];
    $idx = null;
    foreach ($articles as $i => $a) {
        if ($a['id'] === $id) { $idx = $i; break; }
    }
    if ($idx !== null) {
        $articles[$idx] = array_merge($articles[$idx], $updatedData);
        writeJson('articles.json', $articles);
        respond($articles[$idx]);
    } else {
        respond(['error' => 'Not found'], 404);
    }
}

// POST /api/layout/save
elseif ($method === 'POST' && $uri === '/api/layout/save') {
    $sectionsFromFrontend = json_decode(file_get_contents('php://input'), true);

    $newSections = array_map(fn($s) => [
        'id'             => $s['id'],
        'type'           => $s['type'],
        'title'          => $s['title'] ?? null,
        'isPinned'       => $s['isPinned'],
        'isVisible'      => $s['isVisible'] ?? true,
        'coverImage'     => $s['coverImage'] ?? null,
        'preface'        => $s['preface'] ?? null,
        'issueNumber'    => $s['issueNumber'] ?? null,
        'routeArticleId' => !empty($s['routeArticle']) ? $s['routeArticle']['id'] : null,
        'config'         => $s['config'] ?? null,
    ], $sectionsFromFrontend);
    writeJson('sections.json', $newSections);

    $newSA = [];
    foreach ($sectionsFromFrontend as $section) {
        foreach (($section['articles'] ?? []) as $index => $art) {
            $newSA[] = ['sectionId' => $section['id'], 'articleId' => $art['id'], 'sortOrder' => $index];
        }
    }
    writeJson('section_articles.json', $newSA);
    respond(['success' => true]);
}

// POST /api/categories
elseif ($method === 'POST' && $uri === '/api/categories') {
    $newCat = json_decode(file_get_contents('php://input'), true);
    if (empty($newCat['id'])) $newCat['id'] = 'c-' . round(microtime(true) * 1000);
    $categories = readJson('categories.json') ?? [];
    $categories[] = $newCat;
    writeJson('categories.json', $categories);
    respond($newCat);
}

// DELETE /api/categories/:id
elseif ($method === 'DELETE' && preg_match('#^/api/categories/(.+)$#', $uri, $m)) {
    $id = $m[1];
    $categories = readJson('categories.json') ?? [];
    $categories = array_values(array_filter($categories, fn($c) => $c['id'] !== $id));
    writeJson('categories.json', $categories);
    respond(['success' => true]);
}

// POST /api/labels
elseif ($method === 'POST' && $uri === '/api/labels') {
    $body   = json_decode(file_get_contents('php://input'), true);
    $label  = $body['label'] ?? null;
    $labels = readJson('labels.json') ?? [];
    if ($label && !in_array($label, $labels)) {
        $labels[] = $label;
        writeJson('labels.json', $labels);
    }
    respond(['success' => true, 'label' => $label]);
}

// DELETE /api/labels/:name
elseif ($method === 'DELETE' && preg_match('#^/api/labels/(.+)$#', $uri, $m)) {
    $name   = urldecode($m[1]);
    $labels = readJson('labels.json') ?? [];
    $labels = array_values(array_filter($labels, fn($l) => $l !== $name));
    writeJson('labels.json', $labels);
    respond(['success' => true]);
}

// GET /api/issues
elseif ($method === 'GET' && $uri === '/api/issues') {
    respond(readJson('issues.json') ?? []);
}

// POST /api/issues
elseif ($method === 'POST' && $uri === '/api/issues') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) respond(['error' => 'No data'], 400);
    if (empty($body['id'])) $body['id'] = 'iss-' . round(microtime(true) * 1000);
    $issues = readJson('issues.json') ?? [];
    $issues[] = $body;
    writeJson('issues.json', $issues);
    respond($body);
}

// PUT /api/issues/:id
elseif ($method === 'PUT' && preg_match('#^/api/issues/(.+)$#', $uri, $m)) {
    $id = $m[1];
    $body = json_decode(file_get_contents('php://input'), true);
    $issues = readJson('issues.json') ?? [];
    $idx = null;
    foreach ($issues as $i => $iss) {
        if ($iss['id'] === $id) { $idx = $i; break; }
    }
    if ($idx !== null) {
        $issues[$idx] = array_merge($issues[$idx], $body);
        writeJson('issues.json', $issues);
        respond($issues[$idx]);
    } else {
        respond(['error' => 'Not found'], 404);
    }
}

// DELETE /api/issues/:id
elseif ($method === 'DELETE' && preg_match('#^/api/issues/(.+)$#', $uri, $m)) {
    $id = $m[1];
    $issues = readJson('issues.json') ?? [];
    $issues = array_values(array_filter($issues, fn($iss) => $iss['id'] !== $id));
    writeJson('issues.json', $issues);
    respond(['success' => true]);
}

// DELETE /api/articles/:id  →  soft delete (çöp kutusuna taşı)
elseif ($method === 'DELETE' && preg_match('#^/api/articles/(.+)$#', $uri, $m)) {
    $id = $m[1];
    $articles = readJson('articles.json') ?? [];
    $found = null;
    $articles = array_values(array_filter($articles, function($a) use ($id, &$found) {
        if ($a['id'] === $id) { $found = $a; return false; }
        return true;
    }));
    if (!$found) respond(['error' => 'Article not found'], 404);
    $found['deletedAt'] = round(microtime(true) * 1000);
    $trash = readJson('trash.json') ?? [];
    array_unshift($trash, $found);
    writeJson('trash.json', $trash);
    writeJson('articles.json', $articles);
    // section_articles'tan da temizle
    $sa = readJson('section_articles.json') ?? [];
    $sa = array_values(array_filter($sa, fn($rel) => $rel['articleId'] !== $id));
    writeJson('section_articles.json', $sa);
    respond(['success' => true]);
}

// GET /api/trash
elseif ($method === 'GET' && $uri === '/api/trash') {
    respond(readJson('trash.json') ?? []);
}

// POST /api/trash/:id/restore
elseif ($method === 'POST' && preg_match('#^/api/trash/([^/]+)/restore$#', $uri, $m)) {
    $id = $m[1];
    $trash = readJson('trash.json') ?? [];
    $found = null;
    $trash = array_values(array_filter($trash, function($a) use ($id, &$found) {
        if ($a['id'] === $id) { $found = $a; return false; }
        return true;
    }));
    if (!$found) respond(['error' => 'Not found in trash'], 404);
    unset($found['deletedAt']);
    $articles = readJson('articles.json') ?? [];
    array_unshift($articles, $found);
    writeJson('articles.json', $articles);
    writeJson('trash.json', $trash);
    respond($found);
}

// DELETE /api/trash/:id  →  kalıcı sil
elseif ($method === 'DELETE' && preg_match('#^/api/trash/(.+)$#', $uri, $m)) {
    $id = $m[1];
    $trash = readJson('trash.json') ?? [];
    $trash = array_values(array_filter($trash, fn($a) => $a['id'] !== $id));
    writeJson('trash.json', $trash);
    respond(['success' => true]);
}

// DELETE /api/trash  →  tümünü kalıcı sil
elseif ($method === 'DELETE' && $uri === '/api/trash') {
    writeJson('trash.json', []);
    respond(['success' => true]);
}

// POST /api/articles/:id/view
elseif ($method === 'POST' && preg_match('#^/api/articles/([^/]+)/view$#', $uri, $m)) {
    $id = $m[1];
    $views = readJson('views.json') ?? [];
    $views[$id] = ($views[$id] ?? 0) + 1;
    writeJson('views.json', $views);
    respond(['success' => true, 'views' => $views[$id]]);
}

// POST /api/articles/:id/comments
elseif ($method === 'POST' && preg_match('#^/api/articles/([^/]+)/comments$#', $uri, $m)) {
    $identifier = $m[1];
    // Resolve slug to canonical article id
    $allArticles = readJson('articles.json') ?? [];
    $resolvedId = $identifier;
    foreach ($allArticles as $a) {
        if (($a['id'] ?? '') === $identifier || ($a['slug'] ?? '') === $identifier) {
            $resolvedId = $a['id'];
            break;
        }
    }
    $body = json_decode(file_get_contents('php://input'), true);
    $text = trim($body['text'] ?? '');
    if (!$text) respond(['error' => 'No text'], 400);
    $comments = readJson('comments.json') ?? [];
    $comment = [
        'id'        => 'cmt-' . round(microtime(true) * 1000),
        'articleId' => $resolvedId,
        'text'      => $text,
        'createdAt' => round(microtime(true) * 1000),
        'isRead'    => false,
    ];
    array_unshift($comments, $comment);
    writeJson('comments.json', $comments);
    respond($comment);
}

// GET /api/stats
elseif ($method === 'GET' && $uri === '/api/stats') {
    $articles = readJson('articles.json') ?? [];
    $views    = readJson('views.json')    ?? [];
    $comments = readJson('comments.json') ?? [];

    $commentsByArticle = [];
    foreach ($comments as $c) {
        $commentsByArticle[$c['articleId']][] = $c;
    }

    $stats = array_map(function($a) use ($views, $commentsByArticle) {
        $aid  = $a['id'];
        $artC = $commentsByArticle[$aid] ?? [];
        return [
            'id'          => $aid,
            'title'       => $a['title'],
            'author'      => $a['author'] ?? null,
            'category'    => $a['category'] ?? null,
            'issueNumber' => $a['issueNumber'] ?? null,
            'imageUrl'    => $a['imageUrl'] ?? null,
            'views'       => $views[$aid] ?? 0,
            'commentCount'=> count($artC),
            'unreadCount' => count(array_filter($artC, fn($c) => !$c['isRead'])),
            'comments'    => $artC,
        ];
    }, $articles);

    respond(array_values($stats));
}

// PATCH /api/comments/:id/read
elseif ($method === 'PATCH' && preg_match('#^/api/comments/([^/]+)/read$#', $uri, $m)) {
    $id = $m[1];
    $comments = readJson('comments.json') ?? [];
    foreach ($comments as &$c) {
        if ($c['id'] === $id) { $c['isRead'] = true; break; }
    }
    unset($c);
    writeJson('comments.json', $comments);
    respond(['success' => true]);
}

// GET /api/editors
elseif ($method === 'GET' && $uri === '/api/editors') {
    respond(readJson('editors.json') ?? []);
}

// POST /api/editors
elseif ($method === 'POST' && $uri === '/api/editors') {
    $body = json_decode(file_get_contents('php://input'), true);
    $name = trim($body['name'] ?? '');
    if (!$name) respond(['error' => 'No name'], 400);
    $editors = readJson('editors.json') ?? [];
    if (!in_array($name, $editors)) {
        $editors[] = $name;
        writeJson('editors.json', $editors);
    }
    respond(['success' => true, 'name' => $name]);
}

// DELETE /api/editors/:name
elseif ($method === 'DELETE' && preg_match('#^/api/editors/(.+)$#', $uri, $m)) {
    $name = urldecode($m[1]);
    $editors = readJson('editors.json') ?? [];
    $editors = array_values(array_filter($editors, fn($e) => $e !== $name));
    writeJson('editors.json', $editors);
    respond(['success' => true]);
}

// GET /api/search?q=...
elseif ($method === 'GET' && $uri === '/api/search') {
    $q = strtolower(trim($_GET['q'] ?? ''));
    if (strlen($q) < 2) { echo json_encode([]); exit; }
    $articles = readJson('articles.json') ?? [];
    $results = array_values(array_filter($articles, function($a) use ($q) {
        return str_contains(strtolower($a['title'] ?? ''), $q)
            || str_contains(strtolower($a['author'] ?? ''), $q)
            || str_contains(strtolower($a['subheading'] ?? ''), $q);
    }));
    $results = array_slice($results, 0, 20);
    echo json_encode($results, JSON_UNESCAPED_UNICODE);
    exit;
}

// POST /api/upload
elseif ($method === 'POST' && $uri === '/api/upload') {
    if (empty($_FILES['file'])) {
        respond(['error' => 'No file uploaded'], 400);
    }
    $uploadsDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadsDir)) mkdir($uploadsDir, 0755, true);

    $file = $_FILES['file'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($ext, $allowed)) respond(['error' => 'Geçersiz dosya türü'], 400);
    if ($file['size'] > 5 * 1024 * 1024) respond(['error' => 'Dosya çok büyük (max 5MB)'], 400);

    $filename = uniqid('img_', true) . '.' . $ext;
    $dest = $uploadsDir . $filename;
    move_uploaded_file($file['tmp_name'], $dest);

    // Resize if it's an image wider than 1200px
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
        $maxW = 1200;
        $imageInfo = @getimagesize($dest);
        if ($imageInfo) {
            list($w, $h) = $imageInfo;
            if ($w > $maxW) {
                $newH = intval($h * $maxW / $w);
                $src = match($ext) {
                    'jpg', 'jpeg' => imagecreatefromjpeg($dest),
                    'png' => imagecreatefrompng($dest),
                    'webp' => imagecreatefromwebp($dest),
                    default => null
                };
                if ($src) {
                    $dst = imagecreatetruecolor($maxW, $newH);
                    if ($ext === 'png') {
                        imagealphablending($dst, false);
                        imagesavealpha($dst, true);
                    }
                    imagecopyresampled($dst, $src, 0, 0, 0, 0, $maxW, $newH, $w, $h);
                    match($ext) {
                        'jpg', 'jpeg' => imagejpeg($dst, $dest, 85),
                        'png' => imagepng($dst, $dest),
                        'webp' => imagewebp($dst, $dest, 85),
                        default => null
                    };
                    imagedestroy($src);
                    imagedestroy($dst);
                }
            }
        }
    }

    $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
    respond(['url' => $baseUrl . '/uploads/' . $filename]);
}

else {
    respond(['error' => 'Not found'], 404);
}
