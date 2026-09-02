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
$routes->get('api/ping/user-model', 'Api\PingController::testUserModel');
$routes->group('api/auth', static function ($routes) {
    $routes->post('register', 'Api\AuthController::register');
    $routes->post('login', 'Api\AuthController::login');
});
$routes->get('api/auth/me', 'Api\AuthController::me', ['filter' => ['jwtAuth']]);

$routes->get('api/admin-only', static function () {
    return service('response')->setJSON([
        'success' => true,
    ]);
}, ['filter' => ['jwtAuth', 'role:admin']]);

$routes->group('api/users', ['filter' => ['jwtAuth', 'role:admin']], static function ($routes) {
    $routes->get('/', 'Api\UserController::index');
    $routes->post('/', 'Api\UserController::create');
    $routes->get('(:num)', 'Api\UserController::show/$1');
    $routes->put('(:num)', 'Api\UserController::update/$1');
    $routes->delete('(:num)', 'Api\UserController::delete/$1');
});
