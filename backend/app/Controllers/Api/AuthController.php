<?php

namespace App\Controllers\Api;

use App\Libraries\JwtService;
use App\Models\UserModel;
use App\Models\CustomerModel;

class AuthController extends BaseApiController
{
    protected UserModel $users;
    protected JwtService $jwt;

    public function __construct()
    {
        $this->users = new UserModel();
        $this->jwt   = new JwtService();
    }

    public function register()
    {
        $rules = [
            'name'                  => 'required|min_length[2]|max_length[100]',
            'email'                 => 'required|valid_email|is_unique[users.email]',
            'password'              => 'required|min_length[8]',
            'password_confirmation' => 'required|matches[password]',
        ];

        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);

        $id = $this->users->insert([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role'          => 'customer',
            'is_active'     => 1,
        ]);

        $user = $this->users->find($id);

        $customerModel = new CustomerModel();
        $customerModel->insert([
            'user_id' => $id,
            'phone'   => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
        ]);

        return $this->success([
            'id'    => $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ], 'Registration successful', 201);
    }

    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required',
        ];

        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $user = $this->users->findByEmail($data['email']);

        if (! $user || ! password_verify($data['password'], $user['password_hash'])) {
            return $this->error('Invalid email or password', 401);
        }

        if ((int) $user['is_active'] === 0) {
            return $this->error('This account has been deactivated', 403);
        }

        return $this->success([
            'user' => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
            ],
            'access_token'  => $this->jwt->issueAccessToken((int) $user['id'], $user['role']),
            'refresh_token' => $this->jwt->issueRefreshToken((int) $user['id']),
            'token_type'    => 'Bearer',
        ], 'Login successful');
    }

    public function me()
    {
        $user = $this->users->find($this->authUserId());

        return $this->success([
            'user' => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
            ],
        ], 'Current user');
    }
}
