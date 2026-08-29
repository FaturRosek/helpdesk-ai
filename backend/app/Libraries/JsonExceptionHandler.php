<?php

namespace App\Libraries;

use CodeIgniter\Debug\BaseExceptionHandler;
use CodeIgniter\Debug\ExceptionHandlerInterface;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\ResponseInterface;
use Throwable;

class JsonExceptionHandler extends BaseExceptionHandler implements ExceptionHandlerInterface
{
    public function handle(
        Throwable $exception,
        \CodeIgniter\HTTP\RequestInterface $request,
        ResponseInterface $response,
        int $statusCode,
        int $exitCode
    ): void {
        log_message('critical', '{exception}', ['exception' => $exception]);

        if (! ($request instanceof IncomingRequest) || ! str_starts_with($request->getPath(), 'api/')) {
            parent::handle($exception, $request, $response, $statusCode, $exitCode);
            return;
        }

        $isDev = ENVIRONMENT === 'development';

        $response->setStatusCode($statusCode >= 400 ? $statusCode : 500)
            ->setJSON([
                'success' => false,
                'message' => $isDev ? $exception->getMessage() : 'Internal server error',
            ])
            ->send();

        exit($exitCode);
    }
}
