<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class ApiKeyFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $apiKey = env('N8N_API_KEY', '');

        if (empty($apiKey)) {
            return service('response')->setStatusCode(503)->setJSON([
                'success' => false,
                'message' => 'API key not configured on server.',
            ]);
        }

        $provided = $request->getHeaderLine('X-API-Key');

        if (empty($provided) || $provided !== $apiKey) {
            return service('response')->setStatusCode(401)->setJSON([
                'success' => false,
                'message' => 'Invalid or missing API key.',
            ]);
        }

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}
