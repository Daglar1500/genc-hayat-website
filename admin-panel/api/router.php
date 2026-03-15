<?php
// PHP built-in server router
// Usage: php -S localhost:3001 api/router.php

if (file_exists(__DIR__ . '/' . ltrim($_SERVER['REQUEST_URI'], '/'))) {
    return false; // serve static files as-is
}

require __DIR__ . '/index.php';
