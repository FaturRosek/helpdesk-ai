<?php

namespace App\Filters;

use App\Libraries\JwtService;
use App\Models\UserModel;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class JWTAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeaderLine('Authorization');

        if (! $header || ! str_starts_with($header, 'Bearer ')) {
            return service('response')->setStatusCode(401)->setJSON([
                'success' => false,
                'message' => 'Missing or invalid Authorization header',
            ]);
        }

        $token  = substr($header, 7);
        $jwt    = new JwtService();
        $claims = $jwt->decode($token);

        if (! $claims || ($claims['type'] ?? null) !== 'access') {
            return service('response')->setStatusCode(401)->setJSON([
                'success' => false,
                'message' => 'Invalid or expired token',
            ]);
        }

        $userModel = new UserModel();
        $user      = $userModel->find($claims['sub']);

        if (! $user || (int) $user['is_active'] === 0) {
            return service('response')->setStatusCode(401)->setJSON([
                'success' => false,
                'message' => 'User not found or inactive',
            ]);
        }

        // Store authenticated user data so controllers can retrieve it.
        // We use $_SERVER to avoid PHP 8.2 dynamic-property deprecation on
        // the request object, which has no declared $authUser property.
        $_SERVER['auth_user'] = [
            'id'    => (int) $user['id'],
            'role'  => $user['role'],
            'email' => $user['email'],
            'name'  => $user['name'],
        ];

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}
