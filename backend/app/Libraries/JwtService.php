<?php

namespace App\Libraries;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

class JwtService
{
    protected string $secret;
    protected string $algo;
    protected int $accessTtl;
    protected int $refreshTtl;

    public function __construct()
    {
        $this->secret     = env('JWT_SECRET_KEY');
        $this->algo       = env('JWT_ALGO', 'HS256');
        $this->accessTtl  = (int) env('JWT_ACCESS_TTL', 900);
        $this->refreshTtl = (int) env('JWT_REFRESH_TTL', 604800);
    }

    public function issueAccessToken(int $userId, string $role): string
    {
        $now = time();

        return JWT::encode([
            'sub'  => $userId,
            'role' => $role,
            'type' => 'access',
            'iat'  => $now,
            'exp'  => $now + $this->accessTtl,
        ], $this->secret, $this->algo);
    }

    public function issueRefreshToken(int $userId): string
    {
        $now = time();

        return JWT::encode([
            'sub'  => $userId,
            'type' => 'refresh',
            'iat'  => $now,
            'exp'  => $now + $this->refreshTtl,
        ], $this->secret, $this->algo);
    }

    public function decode(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->algo));
            return (array) $decoded;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
