<?php

namespace App\Controllers\Api;

class PingController extends BaseApiController
{
    public function index()
    {
        return $this->success(['time' => date('Y-m-d H:i:s')], 'Pong!');
    }

    public function testValidation()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required|min_length[8]',
        ];

        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        return $this->success(null, 'Validation passed');
    }

    public function testUserModel()
    {
        $userModel = new \App\Models\UserModel();

        $id = $userModel->insert([
            'name'          => 'Test User',
            'email'         => 'test@example.com',
            'password_hash' => password_hash('password123', PASSWORD_BCRYPT),
            'role'          => 'customer',
            'is_active'     => 1,
        ]);

        $user = $userModel->find($id);

        return $this->success($user, 'User created via Model');
    }
}
