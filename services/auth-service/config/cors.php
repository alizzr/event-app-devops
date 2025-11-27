<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', '_ignition/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // <--- ON OUVRE TOUT (Mode Bourrin)
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, // Mettez false si allowed_origins est '*'
];