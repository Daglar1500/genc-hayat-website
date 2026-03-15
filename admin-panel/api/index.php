<?php
/**
 * Genç Hayat CMS — PHP API Bootstrap / Router
 * 
 * Bu dosya tüm API isteklerinin giriş noktasıdır.
 * .htaccess ile tüm /api/* istekleri buraya yönlendirilir.
 */

// --- CORS Headers ---
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Preflight OPTIONS isteğini hemen yanıtla
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- DB Yardımcı Fonksiyonlar ---
define('DB_PATH', __DIR__ . '/db/');

function db_read(string $table): array {
    $file = DB_PATH . $table . '.json';
    if (!file_exists($file)) return [];
    $json = file_get_contents($file);
    return json_decode($json, true) ?? [];
}

function db_write(string $table, array $data): void {
    $file = DB_PATH . $table . '.json';
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function json_response(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function get_body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

function generate_id(string $prefix = 'id'): string {
    return $prefix . '-' . round(microtime(true) * 1000);
}

// --- URL Routing ---
// REQUEST_URI örn: /api/init veya /api/articles/art-1
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Base path'i temizle (Docker veya sub-path durumu için)
$uri = preg_replace('#^/api#', '', $uri);
$uri = trim($uri, '/');

// Route: init
if ($uri === 'init' && $method === 'GET') {
    require __DIR__ . '/init.php';
}
// Route: articles
elseif (preg_match('#^articles(/(.+))?$#', $uri, $m)) {
    $id = $m[2] ?? null;
    require __DIR__ . '/articles.php';
}
// Route: categories
elseif (preg_match('#^categories(/(.+))?$#', $uri, $m)) {
    $id = $m[2] ?? null;
    require __DIR__ . '/categories.php';
}
// Route: labels
elseif (preg_match('#^labels(/(.+))?$#', $uri, $m)) {
    $name = isset($m[2]) ? urldecode($m[2]) : null;
    require __DIR__ . '/labels.php';
}
// Route: layout/save
elseif ($uri === 'layout/save' && $method === 'POST') {
    require __DIR__ . '/layout_save.php';
}
// Route: issues
elseif (preg_match('#^issues(/(.+))?$#', $uri, $m)) {
    $id = $m[2] ?? null;
    require __DIR__ . '/issues.php';
}
// 404
else {
    json_response(['error' => 'Route not found: ' . $uri], 404);
}
