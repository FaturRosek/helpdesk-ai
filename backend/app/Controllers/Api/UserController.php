<?php

namespace App\Controllers\Api;

use App\Models\UserModel;

class UserController extends BaseApiController
{
    protected UserModel $users;

    public function __construct()
    {
        $this->users = new UserModel();
    }

    public function index()
    {
        $users = $this->users->findAll();

        return $this->success($users, 'User list retrieved');
    }

    public function show($id = null)
    {
        $user = $this->users->find($id);

        if (! $user) {
            return $this->error('User not found', 404);
        }

        return $this->success($user);
    }

    public function create()
    {
        $rules = [
            'name'     => 'required|min_length[2]|max_length[100]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[8]',
            'role'     => 'required|in_list[admin,manager,agent,customer]',
        ];

        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);

        $id = $this->users->insert([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role'          => $data['role'],
            'is_active'     => 1,
        ]);

        return $this->success($this->users->find($id), 'User created', 201);
    }

    public function update($id = null)
    {
        $user = $this->users->find($id);

        if (! $user) {
            return $this->error('User not found', 404);
        }

        $rules = [
            'name'  => 'permit_empty|min_length[2]|max_length[100]',
            'email' => "permit_empty|valid_email|is_unique[users.email,id,{$id}]",
        ];

        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);

        $updateData = array_intersect_key($data, array_flip(['name', 'email']));

        $this->users->update($id, $updateData);

        return $this->success($this->users->find($id), 'User updated');
    }

    public function delete($id = null)
    {
        $user = $this->users->find($id);

        if (! $user) {
            return $this->error('User not found', 404);
        }

        $this->users->delete($id);

        return $this->success(null, 'User deleted');
    }

    public function changeRole($id = null)
    {
        $user = $this->users->find($id);

        if (! $user) {
            return $this->error('User not found', 404);
        }

        $rules = ['role' => 'required|in_list[admin,manager,agent,customer]'];

        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $this->users->update($id, ['role' => $data['role']]);

        return $this->success($this->users->find($id), 'Role updated');
    }

    public function activate($id = null)
    {
        $user = $this->users->find($id);

        if (! $user) {
            return $this->error('User not found', 404);
        }

        $newStatus = (int) $user['is_active'] === 1 ? 0 : 1;
        $this->users->update($id, ['is_active' => $newStatus]);

        return $this->success($this->users->find($id), $newStatus ? 'User activated' : 'User deactivated');
    }
}
