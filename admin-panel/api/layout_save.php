<?php
/**
 * POST /api/layout/save
 * 
 * Frontend'deki düzeni (sections dizisini) kaydeder.
 * Section'ları ve section_articles junction tablosunu günceller.
 */

if ($method !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$sections_from_frontend = get_body();

if (!is_array($sections_from_frontend)) {
    json_response(['error' => 'Geçersiz veri formatı'], 400);
}

// Sections tablosunu güncelle (article'ları ve routeArticle'ı ayrıştır)
$sections_to_save = array_map(function ($s) {
    return [
        'id'             => $s['id'],
        'type'           => $s['type'],
        'title'          => $s['title']       ?? null,
        'isPinned'       => $s['isPinned']    ?? false,
        'coverImage'     => $s['coverImage']  ?? null,
        'preface'        => $s['preface']     ?? null,
        'issueNumber'    => $s['issueNumber'] ?? null,
        'routeArticleId' => isset($s['routeArticle']['id']) ? $s['routeArticle']['id'] : null,
    ];
}, $sections_from_frontend);

db_write('sections', $sections_to_save);

// Section_articles junction tablosunu yeniden oluştur
$section_articles = [];
foreach ($sections_from_frontend as $section) {
    foreach (($section['articles'] ?? []) as $order => $art) {
        $section_articles[] = [
            'sectionId' => $section['id'],
            'articleId' => $art['id'],
            'sortOrder' => $order,
        ];
    }
}
db_write('section_articles', $section_articles);

json_response(['success' => true]);
