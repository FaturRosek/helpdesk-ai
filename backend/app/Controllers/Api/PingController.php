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
}
