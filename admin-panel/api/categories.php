<?php
/**
 * /api/categories
 * 
 * GET    /api/categories         — tüm kategoriler
 * POST   /api/categories         — yeni kategori ekle
 * PUT    /api/categories/{id}    — kategori güncelle
 * DELETE /api/categories/{id}    — kategori sil
 */

$categories = db_read('categories');

if ($method === 'GET') {
    json_response($categories);
}

if ($method === 'POST') {
    $body = get_body();
    if (empty($body['name'])) {
        json_response(['error' => 'name gereklidir'], 400);
    }
    $body['id']    = $body['id'] ?? generate_id('c');
    $body['color'] = $body['color'] ?? '#ddd';
    $categories[]  = $body;
    db_write('categories', $categories);
    json_response($body, 201);
}

if ($method === 'PUT') {
    if (!$id) json_response(['error' => 'ID gerekli'], 400);
    $body = get_body();
    foreach ($categories as &$cat) {
        if ($cat['id'] === $id) {
            $cat = array_merge($cat, $body);
            db_write('categories', $categories);
            json_response($cat);
        }
    }
    json_response(['error' => 'Kategori bulunamadı'], 404);
}

if ($method === 'DELETE') {
    if (!$id) json_response(['error' => 'ID gerekli'], 400);
    $categories = array_values(array_filter($categories, fn($c) => $c['id'] !== $id));
    db_write('categories', $categories);
    json_response(['success' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
