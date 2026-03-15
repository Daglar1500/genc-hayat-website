<?php
/**
 * /api/labels
 * 
 * GET    /api/labels           — tüm etiketler
 * POST   /api/labels           — yeni etiket ekle
 * DELETE /api/labels/{name}    — etiket sil (URL-encoded name)
 */

$labels = db_read('labels');

if ($method === 'GET') {
    json_response($labels);
}

if ($method === 'POST') {
    $body  = get_body();
    $label = $body['label'] ?? null;
    if (!$label) json_response(['error' => 'label gereklidir'], 400);
    if (!in_array($label, $labels, true)) {
        $labels[] = $label;
        db_write('labels', $labels);
    }
    json_response(['success' => true, 'label' => $label]);
}

if ($method === 'DELETE') {
    if (!$name) json_response(['error' => 'Etiket adı gerekli'], 400);
    $labels = array_values(array_filter($labels, fn($l) => $l !== $name));
    db_write('labels', $labels);
    json_response(['success' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
