<?php

namespace App\Controllers\Api;

use App\Models\CustomerModel;
use App\Models\UserModel;

class CustomerController extends BaseApiController
{
    protected CustomerModel $customers;
    protected UserModel $users;

    public function __construct()
    {
        $this->customers = new CustomerModel();
        $this->users     = new UserModel();
    }

    public function index()
    {
        $data = $this->customers
            ->select('customers.*, users.name, users.email, users.is_active')
            ->join('users', 'users.id = customers.user_id')
            ->findAll();

        return $this->success($data, 'Customer list retrieved');
    }

    public function show($id = null)
    {
        $customer = $this->customers
            ->select('customers.*, users.name, users.email')
            ->join('users', 'users.id = customers.user_id')
            ->find($id);

        if (! $customer) {
            return $this->error('Customer not found', 404);
        }

        return $this->success($customer);
    }

    public function create()
    {
        $rules = [
            'name'     => 'required|min_length[2]|max_length[100]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[8]',
            'phone'    => 'permit_empty|max_length[30]',
            'company'  => 'permit_empty|max_length[150]',
        ];

        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $db   = \Config\Database::connect();

        $db->transStart();

        $userId = $this->users->insert([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role'          => 'customer',
            'is_active'     => 1,
        ]);

        $this->customers->insert([
            'user_id' => $userId,
            'phone'   => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
        ]);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->error('Failed to create customer', 500);
        }

        return $this->success(null, 'Customer created', 201);
    }
}
