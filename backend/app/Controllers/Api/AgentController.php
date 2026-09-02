<?php

namespace App\Controllers\Api;

use App\Models\AgentModel;
use App\Models\UserModel;

class AgentController extends BaseApiController
{
    protected AgentModel $agents;
    protected UserModel $users;

    public function __construct()
    {
        $this->agents = new AgentModel();
        $this->users  = new UserModel();
    }

    public function index()
    {
        $data = $this->agents
            ->select('agents.*, users.name, users.email, users.is_active')
            ->join('users', 'users.id = agents.user_id')
            ->findAll();

        return $this->success($data);
    }

    public function create()
    {
        $rules = [
            'name'     => 'required|min_length[2]|max_length[100]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[8]',
            'department' => 'permit_empty|max_length[100]',
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
            'role'          => 'agent',
            'is_active'     => 1,
        ]);

        $this->agents->insert([
            'user_id'    => $userId,
            'department' => $data['department'] ?? null,
        ]);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->error('Failed to create agent', 500);
        }

        return $this->success(null, 'Agent created', 201);
    }
}
