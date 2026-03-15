<?php
/**
 * /api/articles
 * 
 * GET    /api/articles          — tüm makaleler (query: ?category=, ?type=, ?issueNumber=)
 * GET    /api/articles/{id}     — tek makale (id veya slug ile)
 * POST   /api/articles          — yeni makale oluştur
 * PUT    /api/articles/{id}     — makale güncelle
 * DELETE /api/articles/{id}     — makale sil
 */

$articles = db_read('articles');

// Slug → ID çevirme yardımcısı
function find_article_idx(array $articles, string $id): int {
    foreach ($articles as $i => $art) {
        if ($art['id'] === $id || ($art['slug'] ?? '') === $id) {
            return $i;
        }
    }
    return -1;
}

// --- GET /api/articles veya /api/articles/{id} ---
if ($method === 'GET') {
    if (!$id) {
        // Opsiyonel filtreler
        $cat    = $_GET['category']    ?? null;
        $type   = $_GET['type']        ?? null;
        $issue  = $_GET['issueNumber'] ?? null;

        $filtered = array_filter($articles, function ($art) use ($cat, $type, $issue) {
            if ($cat   && ($art['category']    ?? '') !== $cat)   return false;
            if ($type  && ($art['type']        ?? '') !== $type)  return false;
            if ($issue && ($art['issueNumber'] ?? '') !== $issue) return false;
            return true;
        });

        json_response(array_values($filtered));
    }

    // Tek makale
    $idx = find_article_idx($articles, $id);
    if ($idx === -1) json_response(['error' => 'Article not found'], 404);
    json_response($articles[$idx]);
}

// --- POST /api/articles ---
if ($method === 'POST') {
    $body = get_body();
    if (empty($body['title']) || empty($body['author'])) {
        json_response(['error' => 'title ve author gereklidir'], 400);
    }

    // Slug oluştur (yoksa başlıktan türet)
    if (empty($body['slug'])) {
        $body['slug'] = slugify($body['title']);
    }

    // ID oluştur (yoksa)
    if (empty($body['id'])) {
        $body['id'] = generate_id('art');
    }

    // defaults
    $body['createdAt'] = $body['createdAt'] ?? round(microtime(true) * 1000);
    $body['status']    = $body['status']    ?? 'not-edited';
    $body['content']   = $body['content']   ?? [];
    $body['labels']    = $body['labels']    ?? [];
    $body['type']      = $body['type']      ?? 'normal';

    array_unshift($articles, $body);
    db_write('articles', $articles);
    json_response($body, 201);
}

// --- PUT /api/articles/{id} ---
if ($method === 'PUT') {
    if (!$id) json_response(['error' => 'ID gerekli'], 400);
    $body = get_body();
    $idx  = find_article_idx($articles, $id);
    if ($idx === -1) json_response(['error' => 'Article not found'], 404);

    // Slug güncelle (başlık değiştiyse)
    if (isset($body['title']) && empty($body['slug'])) {
        $body['slug'] = slugify($body['title']);
    }

    $articles[$idx] = array_merge($articles[$idx], $body);
    db_write('articles', $articles);
    json_response($articles[$idx]);
}

// --- DELETE /api/articles/{id} ---
if ($method === 'DELETE') {
    if (!$id) json_response(['error' => 'ID gerekli'], 400);
    $idx = find_article_idx($articles, $id);
    if ($idx === -1) json_response(['error' => 'Article not found'], 404);

    $deleted = $articles[$idx];
    array_splice($articles, $idx, 1);
    db_write('articles', $articles);

    // Section_articles junction'dan da temizle
    $sa = db_read('section_articles');
    $sa = array_values(array_filter($sa, fn($r) => $r['articleId'] !== $deleted['id']));
    db_write('section_articles', $sa);

    json_response(['success' => true, 'deleted' => $deleted]);
}

json_response(['error' => 'Method not allowed'], 405);

// --- Yardımcı: Türkçe slug oluştur ---
function slugify(string $text): string {
    $tr = ['ç','Ç','ğ','Ğ','ı','İ','ö','Ö','ş','Ş','ü','Ü'];
    $en = ['c','c','g','g','i','i','o','o','s','s','u','u'];
    $text = str_replace($tr, $en, $text);
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim($text, '-');
    return $text;
}
