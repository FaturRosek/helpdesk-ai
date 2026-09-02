<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class RoleFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $allowedRoles = $arguments ?? [];
        $user         = $request->authUser ?? null;

        if (! $user) {
            return service('response')->setStatusCode(401)->setJSON([
                'success' => false,
                'message' => 'Unauthorized',
            ]);
        }

        if (! empty($allowedRoles) && ! in_array($user['role'], $allowedRoles, true)) {
            return service('response')->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'Forbidden: insufficient role permission',
            ]);
        }

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}
