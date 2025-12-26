<?php

define('JWT_SECRET', '2422ba6e2cd45dd2d5ef9ae7779b47fa8e832301ec4c14fe63fd246b949305983456eecccee1ffa8f39d1d80b4fb8486023c10c47f29cdf857ffc8fe9fd38862');
define('JWT_ISSUER', 'voucher-system');

define('ACCESS_TOKEN_EXPIRE', 60 * 15);       // 15 minutes
define('REFRESH_TOKEN_EXPIRE', 60 * 60 * 24 * 7); // 7 days

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwtEncode(array $payload) {
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];

    $segments = [];
    $segments[] = base64UrlEncode(json_encode($header));
    $segments[] = base64UrlEncode(json_encode($payload));

    $signingInput = implode('.', $segments);
    $signature = hash_hmac('sha256', $signingInput, JWT_SECRET, true);
    $segments[] = base64UrlEncode($signature);

    return implode('.', $segments);
}

function jwtDecode($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        throw new Exception("Invalid token format");
    }

    [$header64, $payload64, $signature64] = $parts;

    $signingInput = $header64 . '.' . $payload64;
    $expectedSig = base64UrlEncode(
        hash_hmac('sha256', $signingInput, JWT_SECRET, true)
    );

    if (!hash_equals($expectedSig, $signature64)) {
        throw new Exception("Invalid token signature");
    }

    $payload = json_decode(base64UrlDecode($payload64), true);

    if (isset($payload['exp']) && time() >= $payload['exp']) {
        throw new Exception("Token expired");
    }

    return $payload;
}
