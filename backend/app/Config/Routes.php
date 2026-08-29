<?php


use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->setAutoRoute(false);

$routes->get('/', static function () {
    return service('response')->setJSON([
        'success' => true,
        'message' => 'HelpDesk AI API is running',
    ]);
});

$routes->get('api/ping', 'Api\PingController::index');
$routes->post('api/ping/validate', 'Api\PingController::testValidation');
