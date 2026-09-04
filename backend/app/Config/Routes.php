<?php


use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->options('(:any)', static function () {
    return service('response')->setStatusCode(200);
});

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
    $routes->patch('(:num)/role', 'Api\UserController::changeRole/$1');
    $routes->patch('(:num)/activate', 'Api\UserController::activate/$1');
});

$routes->group('api/customers', ['filter' => ['jwtAuth', 'role:admin,agent']], static function ($routes) {
    $routes->get('/', 'Api\CustomerController::index');
    $routes->post('/', 'Api\CustomerController::create');
    $routes->get('(:num)', 'Api\CustomerController::show/$1');
});

$routes->group('api/agents', ['filter' => ['jwtAuth', 'role:admin']], static function ($routes) {
    $routes->get('/', 'Api\AgentController::index');
    $routes->post('/', 'Api\AgentController::create');
});

$routes->group('api/categories', ['filter' => ['jwtAuth', 'role:admin']], static function ($routes) {
    $routes->get('/', 'Api\CategoryController::index');
    $routes->post('/', 'Api\CategoryController::create');
    $routes->put('(:num)', 'Api\CategoryController::update/$1');
    $routes->delete('(:num)', 'Api\CategoryController::delete/$1');
});

$routes->group('api/tickets', ['filter' => ['jwtAuth']], static function ($routes) {
    $routes->get('/', 'Api\TicketController::index');
    $routes->post('/', 'Api\TicketController::create');
    $routes->get('(:num)', 'Api\TicketController::show/$1');
    $routes->put('(:num)', 'Api\TicketController::update/$1');
    $routes->post('(:num)/assign', 'Api\TicketController::assign/$1', ['filter' => ['jwtAuth', 'role:admin,agent']]);
    $routes->get('(:num)/messages', 'Api\TicketController::messages/$1');
    $routes->post('(:num)/messages', 'Api\TicketController::reply/$1');
    $routes->post('(:num)/resolve', 'Api\TicketController::resolve/$1', ['filter' => ['jwtAuth', 'role:admin,agent']]);
    $routes->post('(:num)/close', 'Api\TicketController::close/$1');
    $routes->post('(:num)/reopen', 'Api\TicketController::reopen/$1');
    $routes->get('(:num)/history', 'Api\TicketController::history/$1');
});
