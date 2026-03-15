<?php
/**
 * GET /api/init
 * 
 * Admin panel'in ilk yüklenişinde ihtiyaç duyduğu tüm veriyi döner:
 * - sections (article'lar ile birleştirilmiş)
 * - articles (kütüphane)
 * - categories
 * - labels
 */

$articles         = db_read('articles');
$categories       = db_read('categories');
$labels           = db_read('labels');
$sections_raw     = db_read('sections');
$section_articles = db_read('section_articles');

// Article'ları id => article şeklinde index'le
$articles_map = [];
foreach ($articles as $art) {
    $articles_map[$art['id']] = $art;
}

// Her section için article'ları birleştir
$sections = array_map(function ($section) use ($section_articles, $articles_map) {
    // Bu section'a ait junction kayıtlarını sortOrder'a göre sırala
    $rels = array_filter($section_articles, fn($r) => $r['sectionId'] === $section['id']);
    usort($rels, fn($a, $b) => $a['sortOrder'] <=> $b['sortOrder']);

    // Article'ları hidrate et
    $hydrated = [];
    foreach ($rels as $rel) {
        if (isset($articles_map[$rel['articleId']])) {
            $hydrated[] = $articles_map[$rel['articleId']];
        }
    }

    // routeArticle varsa çöz
    $routeArticle = null;
    if (!empty($section['routeArticleId']) && isset($articles_map[$section['routeArticleId']])) {
        $routeArticle = $articles_map[$section['routeArticleId']];
    }

    return array_merge($section, [
        'articles'     => $hydrated,
        'routeArticle' => $routeArticle,
    ]);
}, $sections_raw);

json_response([
    'sections'   => array_values($sections),
    'articles'   => array_values($articles),
    'categories' => $categories,
    'labels'     => $labels,
]);
