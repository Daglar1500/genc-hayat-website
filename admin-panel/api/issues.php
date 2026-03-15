<?php
/**
 * /api/issues
 * 
 * Frontend Issue tipini tam olarak karşılar:
 * { id, title, number, date, coverMedia, sunuArticleId, rotaArticleId,
 *   recommendedArticleIds[], otherArticleIds[] }
 * 
 * GET    /api/issues            — tüm sayılar (hydrated)
 * GET    /api/issues/{id}       — tek sayı (id veya number ile)
 * POST   /api/issues            — yeni sayı oluştur
 * PUT    /api/issues/{id}       — sayı güncelle
 * DELETE /api/issues/{id}       — sayı sil
 */

$issues   = db_read('issues');
$articles = db_read('articles');

// Article'ları id => article map
$art_map = [];
foreach ($articles as $art) {
    $art_map[$art['id']] = $art;
}

/**
 * Bir issue'yu frontend Issue tipine hydrate et
 */
function hydrate_issue(array $issue, array $art_map): array {
    $resolve = function (string $artId) use ($art_map) {
        return $art_map[$artId] ?? null;
    };
    $resolveMany = function (array $ids) use ($art_map) {
        return array_values(array_filter(array_map(fn($id) => $art_map[$id] ?? null, $ids)));
    };

    return [
        'id'               => $issue['id'],
        'title'            => $issue['title'],
        'number'           => $issue['number'],
        'date'             => $issue['date'],
        'coverMedia'       => $issue['coverMedia'] ?? null,
        'sunuArticle'      => $resolve($issue['sunuArticleId'] ?? ''),
        'rotaArticle'      => $resolve($issue['rotaArticleId'] ?? ''),
        'recomendedCards'  => $resolveMany($issue['recommendedArticleIds'] ?? []),
        'otherArticles'    => $resolveMany($issue['otherArticleIds'] ?? []),
        // raw IDs de frontend'de issue yönetimi için lazım
        'sunuArticleId'           => $issue['sunuArticleId']           ?? null,
        'rotaArticleId'           => $issue['rotaArticleId']           ?? null,
        'recommendedArticleIds'   => $issue['recommendedArticleIds']   ?? [],
        'otherArticleIds'         => $issue['otherArticleIds']         ?? [],
    ];
}

function find_issue_idx(array $issues, string $id): int {
    foreach ($issues as $i => $issue) {
        if ($issue['id'] === $id || (string)($issue['number'] ?? '') === $id) {
            return $i;
        }
    }
    return -1;
}

// --- GET ---
if ($method === 'GET') {
    if (!$id) {
        $hydrated = array_map(fn($iss) => hydrate_issue($iss, $art_map), $issues);
        json_response(array_values($hydrated));
    }

    $idx = find_issue_idx($issues, $id);
    if ($idx === -1) json_response(['error' => 'Issue not found'], 404);
    json_response(hydrate_issue($issues[$idx], $art_map));
}

// --- POST ---
if ($method === 'POST') {
    $body = get_body();
    if (empty($body['title']) || empty($body['number'])) {
        json_response(['error' => 'title ve number gereklidir'], 400);
    }
    $body['id']    = $body['id']    ?? 'issue-' . $body['number'];
    $body['date']  = $body['date']  ?? date('Y-m-d');
    // Hydrated alanları kaydetme — sadece raw ID'leri tut
    unset($body['sunuArticle'], $body['rotaArticle'], $body['recomendedCards'], $body['otherArticles']);
    
    array_unshift($issues, $body);
    db_write('issues', $issues);
    json_response(hydrate_issue($body, $art_map), 201);
}

// --- PUT ---
if ($method === 'PUT') {
    if (!$id) json_response(['error' => 'ID gerekli'], 400);
    $body = get_body();
    $idx  = find_issue_idx($issues, $id);
    if ($idx === -1) json_response(['error' => 'Issue not found'], 404);

    // Hydrated alanları çıkar, sadece raw kaydet
    unset($body['sunuArticle'], $body['rotaArticle'], $body['recomendedCards'], $body['otherArticles']);

    $issues[$idx] = array_merge($issues[$idx], $body);
    db_write('issues', $issues);
    json_response(hydrate_issue($issues[$idx], $art_map));
}

// --- DELETE ---
if ($method === 'DELETE') {
    if (!$id) json_response(['error' => 'ID gerekli'], 400);
    $idx = find_issue_idx($issues, $id);
    if ($idx === -1) json_response(['error' => 'Issue not found'], 404);

    $deleted = $issues[$idx];
    array_splice($issues, $idx, 1);
    db_write('issues', $issues);
    json_response(['success' => true, 'deleted' => $deleted]);
}

json_response(['error' => 'Method not allowed'], 405);
